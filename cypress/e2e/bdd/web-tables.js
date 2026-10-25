import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import demoQaPage from '../../pages/DemoQaPage';
import webTablesPage from '../../pages/WebTablesPage';
import { generateTableRecord } from '../../support/utils/test-data';

const reportFolder = 'cypress/reports/bonus';

function scenarioId() {
  return Cypress.currentTest.title.split(' - ')[0];
}

function expectRecord(record) {
  webTablesPage.rowByEmail(record.email).should('have.length', 1).and('be.visible');
  webTablesPage.cellsByEmail(record.email).should(($cells) => {
    expect([...$cells].map((cell) => cell.textContent.trim())).to.deep.eq([
      record.firstName, record.lastName, String(record.age), record.email,
      String(record.salary), record.department,
    ]);
  });
}

function captureState(stage, remaining, deleted) {
  return cy.get('@pageContext').then((context) => cy.window({ log: false }).then((win) => (
    webTablesPage.table().then(($table) => webTablesPage.snapshot().then((table) => {
      const state = {
        scenarioId: scenarioId(), stage, ...table, url: win.location.href, timeOrigin: win.performance.timeOrigin,
        sameDocument: win.document === context.document,
        sameWindow: win === context.window, sameTable: $table[0] === context.table,
        expectedRemaining: remaining.map((record) => record.email),
        deleted: deleted.map((record) => record.email), lastDelete: context.lastDelete,
      };
      cy.log(`${stage}: ${state.rowCount} linhas; ${remaining.length} registros ainda esperados`);
      return cy.writeFile(`${reportFolder}/${scenarioId()}/${stage}.json`, state, { log: false }).then(() => state);
    }))
  )));
}

function expectContinuousPage(state) {
  expect(state.sameDocument, 'mesmo documento, sem recarregamento').to.eq(true);
  expect(state.sameWindow, 'mesmo contexto de janela').to.eq(true);
  expect(new URL(state.url).pathname).to.eq('/webtables');
  expect(state.search, 'busca vazia, sem ocultar registros').to.eq('');
  expect(state.pageSize, 'capacidade para todos os registros').to.eq('50');
  expect(state.pagination, 'todos os registros na mesma página').to.eq('Page 1 of 1');
  expect(state.nextDisabled, 'não há página seguinte oculta').to.eq(true);
}

function deleteNext(remaining, deleted, initialEmails) {
  if (!remaining.length) return;
  const [record, ...next] = remaining;
  const removed = [...deleted, record];
  const stage = `apos-exclusao-${removed.length}`;

  expectRecord(record);
  webTablesPage.deleteButtonByEmail(record.email).should('have.length', 1)
    .invoke('attr', 'id').then((id) => {
      cy.get('@pageContext').then((context) => {
        context.lastDelete = { email: record.email, buttonId: id, matchedButtons: 1 };
      });
    });
  webTablesPage.deleteRecord(record.email);
  captureState(stage, next, removed).then((state) => {
    // A evidência é salva antes da asserção que pode interromper o cenário.
    webTablesPage.table().screenshot(`${scenarioId()}-${stage}`);
    cy.then(() => {
      expectContinuousPage(state);
      expect(state.rowCount, 'Delete deve remover somente uma linha; os demais devem permanecer')
        .to.eq(initialEmails.length + next.length);
      expect(state.emails).to.have.members([...initialEmails, ...next.map((item) => item.email)]);
      removed.forEach((item) => expect(state.emails).not.to.include(item.email));
    });
    webTablesPage.rowByEmail(record.email).should('not.exist');
    next.forEach(expectRecord);
    // Só prepara a próxima exclusão depois de comprovar os sobreviventes.
    cy.then(() => deleteNext(next, removed, initialEmails));
  });
}

Given('que estou na página Web Tables', () => {
  demoQaPage.visitHome();
  demoQaPage.openWebTables();
  webTablesPage.heading().should('be.visible').and('have.text', 'Web Tables');
  webTablesPage.selectPageSize(50);
  webTablesPage.searchInput().should('have.value', '');
  webTablesPage.snapshot().as('initialTable', { type: 'static' });
  cy.window({ log: false }).then((win) => {
    webTablesPage.table().then(($table) => {
      cy.wrap({ window: win, document: win.document, table: $table[0] }, { log: false })
        .as('pageContext', { type: 'static' });
    });
  });
});

When('cadastro {int} registros com dados dinâmicos e exclusivos', (count) => {
  cy.get('@initialTable').then((initial) => {
    expect(initial.rowCount + count, 'total cabe na página selecionada').to.be.at.most(50);
  });
  cy.fixture('demoqa-options').then((options) => {
    const records = Array.from({ length: count }, () => generateTableRecord(options));
    expect(new Set(records.map((record) => record.email)).size, 'e-mails exclusivos').to.eq(count);
    cy.wrap(records, { log: false }).as('records', { type: 'static' });
    cy.writeFile(`${reportFolder}/${scenarioId()}/registros.json`, records, { log: false });
    records.forEach((record) => {
      webTablesPage.openRegistration();
      webTablesPage.registrationDialog().should('be.visible');
      webTablesPage.fillRegistration(record);
      webTablesPage.submitRegistration();
      webTablesPage.registrationDialog().should('not.exist');
      expectRecord(record);
    });
  });
});

Then('os {int} registros devem estar cadastrados', (count) => {
  cy.get('@records').then((records) => {
    expect(records).to.have.length(count);
    records.forEach(expectRecord);
    captureState('apos-cadastro', records, []).then((state) => {
      expectContinuousPage(state);
      cy.get('@initialTable').then((initial) => {
        expect(state.emails).to.have.members([...initial.emails, ...records.map((record) => record.email)]);
        expect(state.rowCount).to.eq(initial.rowCount + count);
      });
    });
  });
  webTablesPage.table().screenshot(`${scenarioId()}-doze-cadastros`);
});

When('excluo individualmente os {int} registros cadastrados', (count) => {
  cy.get('@records').then((records) => cy.get('@initialTable').then((initial) => {
    expect(records).to.have.length(count);
    deleteNext(records, [], initial.emails);
  }));
});

Then('nenhum dos {int} registros deve permanecer na tabela', (count) => {
  cy.get('@records').then((records) => {
    expect(records).to.have.length(count);
    captureState('apos-todas-exclusoes', [], records).then((state) => {
      expectContinuousPage(state);
      cy.get('@initialTable').then((initial) => {
        expect(state.emails).to.have.members(initial.emails);
        expect(state.rowCount).to.eq(initial.rowCount);
      });
      records.forEach((record) => webTablesPage.rowByEmail(record.email).should('not.exist'));
    });
  });
});
