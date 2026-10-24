class PracticeFormPage {
  fill(student) {
    cy.get('#firstName').type(student.firstName);
    cy.get('#lastName').type(student.lastName);
    cy.get('#userEmail').type(student.email);
    cy.contains('#genterWrapper label', student.gender).click();
    cy.get('#userNumber').type(student.mobile);
    this.selectBirthDate(student.birthDate);

    student.subjects.forEach((subject) => {
      cy.get('#subjectsInput').type(subject);
      cy.contains('#subjectsContainer [role="option"]', new RegExp(`^${subject}$`)).click();
    });
    student.hobbies.forEach((hobby) => {
      cy.contains('#hobbiesWrapper label', hobby).click();
    });

    cy.get('#uploadPicture').selectFile(student.uploadPath);
    cy.get('#currentAddress').type(student.address);
    cy.get('#state input').type(student.state);
    cy.contains('#state [role="option"]', new RegExp(`^${student.state}$`)).click();
    cy.get('#city input').type(student.city);
    return cy.contains('#city [role="option"]', new RegExp(`^${student.city}$`)).click();
  }

  selectBirthDate({ year, month, day }) {
    cy.get('#dateOfBirthInput').click();
    cy.get('.react-datepicker__year-select').select(String(year));
    cy.get('.react-datepicker__month-select').select(String(month));
    return cy.contains(
      '.react-datepicker__day:not(.react-datepicker__day--outside-month)',
      new RegExp(`^${day}$`),
    ).click();
  }

  uploadInput() {
    return cy.get('#uploadPicture');
  }

  submit() {
    return cy.get('#submit').click();
  }

  confirmationDialog() {
    return cy.get('.modal[role="dialog"]');
  }

  confirmationValue(label) {
    return cy.contains('.modal tbody td:first-child', new RegExp(`^${label}$`))
      .siblings('td');
  }

  closeConfirmation() {
    // ESC aciona o fechamento nativo; o botão Close do DemoQA lança findDOMNode.
    return this.confirmationDialog().type('{esc}');
  }
}

export default new PracticeFormPage();
