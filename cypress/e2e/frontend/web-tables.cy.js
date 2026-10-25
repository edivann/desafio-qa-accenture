import demoQaPage from '../../pages/DemoQaPage';
import webTablesPage from '../../pages/WebTablesPage';
import { generateTableRecord, updateTableRecord } from '../../support/utils/test-data';

function expectRecordInTable(record) {
  webTablesPage.cellsByEmail(record.email).should(($cells) => {
    expect([...$cells].map((cell) => cell.textContent.trim()), 'seis campos visíveis do registro')
      .to.deep.eq([record.firstName, record.lastName, String(record.age),
        record.email, String(record.salary), record.department]);
  });
  webTablesPage.rowByEmail(record.email).should('be.visible');
}

function createRecord(record) {
  webTablesPage.openRegistration();
  webTablesPage.registrationDialog().should('be.visible');
  webTablesPage.fillRegistration(record);
  webTablesPage.submitRegistration();
  webTablesPage.registrationDialog().should('not.exist');
  expectRecordInTable(record);
}

function editRecord(original, updated) {
  webTablesPage.editRecord(original.email);
  webTablesPage.registrationDialog().should('be.visible');
  webTablesPage.fillRegistration(updated);
  webTablesPage.submitRegistration();
  webTablesPage.registrationDialog().should('not.exist');
  expectRecordInTable(updated);
  webTablesPage.tableBody().should('not.contain.text', original.email);
}

describe('DemoQA | Web Tables', () => {
  beforeEach(() => {
    demoQaPage.visitHome();
    demoQaPage.openWebTables();
    cy.location('pathname').should('eq', '/webtables');
    webTablesPage.heading().should('be.visible').and('have.text', 'Web Tables');
    cy.fixture('demoqa-options').then((options) => {
      cy.wrap(generateTableRecord(options)).as('record');
    });
  });

  it('TC-WT-001 - cadastra um registro e valida todos os campos na tabela', () => {
    cy.get('@record').then((record) => { createRecord(record); });
  });

  it('TC-WT-002 - edita seu próprio registro e confirma os valores atualizados', () => {
    cy.get('@record').then((record) => {
      createRecord(record);
      editRecord(record, updateTableRecord(record));
      webTablesPage.table().screenshot('TC-WT-002-registro-editado');
    });
  });

  it('TC-WT-003 - exclui seu próprio registro após cadastro e edição', () => {
    cy.get('@record').then((record) => {
      const updated = updateTableRecord(record);
      createRecord(record);
      editRecord(record, updated);
      webTablesPage.deleteRecord(updated.email);
      webTablesPage.tableBody().should('be.visible')
        .and('not.contain.text', record.email).and('not.contain.text', updated.email);
      webTablesPage.rowByEmail(updated.email).should('not.exist');
      webTablesPage.table().screenshot('TC-WT-003-registro-excluido');
    });
  });
});
