import demoQaPage from '../../pages/DemoQaPage';
import practiceFormPage from '../../pages/PracticeFormPage';

describe('DemoQA | Practice Form', () => {
  it('TC-PF-001 - preenche todos os campos, confere os dados enviados e fecha a confirmação', () => {
    cy.fixture('demoqa-options').then((options) => {
      const runId = crypto.randomUUID();
      const location = Cypress._.sample(options.locations);
      const student = {
        firstName: Cypress._.sample(options.firstNames),
        lastName: Cypress._.sample(options.lastNames),
        email: `aluno.${runId}@example.com`,
        gender: Cypress._.sample(options.genders),
        mobile: `9${Cypress._.random(100000000, 999999999)}`,
        birthDate: {
          year: Cypress._.random(1980, 2005),
          month: Cypress._.random(0, 11),
          day: Cypress._.random(1, 28),
        },
        subjects: Cypress._.sampleSize(options.subjects, 2),
        hobbies: options.hobbies,
        uploadPath: 'cypress/fixtures/uploads/arquivo-teste.txt',
        address: `Rua de Teste ${Cypress._.random(1, 9999)}, apto ${Cypress._.random(1, 100)}`,
        state: location.state,
        city: Cypress._.sample(location.cities),
      };

      demoQaPage.visitHome();
      cy.location('pathname').should('eq', '/');
      demoQaPage.openPracticeForm();
      cy.location('pathname').should('eq', '/automation-practice-form');
      practiceFormPage.heading().should('be.visible').and('have.text', 'Practice Form');

      practiceFormPage.fill(student);
      practiceFormPage.uploadInput().should(($input) => {
        expect($input[0].files, 'arquivo TXT selecionado').to.have.length(1);
        expect($input[0].files[0].name).to.eq('arquivo-teste.txt');
      });
      practiceFormPage.submit();
      practiceFormPage.confirmationDialog().should('be.visible')
        .and('contain.text', 'Thanks for submitting the form');

      const { year, month, day } = student.birthDate;
      const monthName = new Date(year, month, day).toLocaleString('en-US', { month: 'long' });
      const expectedValues = {
        'Student Name': `${student.firstName} ${student.lastName}`,
        'Student Email': student.email,
        Gender: student.gender,
        Mobile: student.mobile,
        'Date of Birth': `${String(day).padStart(2, '0')} ${monthName},${year}`,
        Subjects: student.subjects.join(', '),
        Hobbies: student.hobbies.join(', '),
        Picture: 'arquivo-teste.txt',
        Address: student.address,
        'State and City': `${student.state} ${student.city}`,
      };
      Object.entries(expectedValues).forEach(([label, value]) => {
        practiceFormPage.confirmationValue(label).should('have.text', value);
      });

      cy.screenshot('practice-form-confirmacao', { capture: 'viewport' });
      practiceFormPage.closeConfirmation();
      practiceFormPage.confirmationDialog().should('not.exist');
      practiceFormPage.form().should('be.visible');
    });
  });
});
