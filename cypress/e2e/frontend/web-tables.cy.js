import demoQaPage from '../../pages/DemoQaPage';
import webTablesPage from '../../pages/WebTablesPage';

function expectRecordInTable(record) {
  webTablesPage.rowByEmail(record.email).should('be.visible').find('td').should(($cells) => {
    const values = [...$cells].slice(0, 6).map((cell) => cell.textContent.trim());
    expect(values, 'todos os campos do registro na tabela').to.deep.eq([
      record.firstName, record.lastName, String(record.age),
      record.email, String(record.salary), record.department,
    ]);
  });
}

describe('DemoQA | Web Tables', () => {
  it('cria, edita e exclui um registro, validando cada resultado na tabela', () => {
    cy.fixture('demoqa-options').then((options) => {
      const runId = crypto.randomUUID();
      const record = {
        firstName: Cypress._.sample(options.firstNames),
        lastName: Cypress._.sample(options.lastNames),
        email: `registro.${runId}@example.com`,
        age: Cypress._.random(18, 60),
        salary: Cypress._.random(1000, 20000),
        department: Cypress._.sample(options.departments),
      };
      const updatedRecord = {
        firstName: record.firstName === 'Ana' ? 'Bruno' : 'Ana',
        lastName: record.lastName === 'Silva' ? 'Costa' : 'Silva',
        email: `editado.${runId}@example.com`,
        age: record.age + 1,
        salary: record.salary + 1000,
        department: 'Automacao',
      };

      demoQaPage.visitHome();
      demoQaPage.openWebTables();
      cy.location('pathname').should('eq', '/webtables');
      cy.contains('h1', 'Web Tables').should('be.visible');

      webTablesPage.openRegistration();
      webTablesPage.registrationDialog().should('be.visible');
      webTablesPage.fillRegistration(record);
      webTablesPage.submitRegistration();
      webTablesPage.registrationDialog().should('not.exist');
      expectRecordInTable(record);

      webTablesPage.editRecord(record.email);
      webTablesPage.registrationDialog().should('be.visible');
      webTablesPage.fillRegistration(updatedRecord);
      webTablesPage.submitRegistration();
      webTablesPage.registrationDialog().should('not.exist');
      expectRecordInTable(updatedRecord);
      // Sem filtro de busca: a ausência não pode ser consequência de um filtro.
      webTablesPage.tableBody().should('not.contain.text', record.email);
      webTablesPage.tableBody().parent('table').screenshot('web-tables-registro-editado');

      webTablesPage.deleteRecord(updatedRecord.email);
      webTablesPage.tableBody().should('be.visible')
        .and('not.contain.text', updatedRecord.email)
        .and('not.contain.text', record.email);
      webTablesPage.rowByEmail(updatedRecord.email).should('not.exist');
      webTablesPage.tableBody().parent('table').screenshot('web-tables-registro-excluido');
    });
  });
});
