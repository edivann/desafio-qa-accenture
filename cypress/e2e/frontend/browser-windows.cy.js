import demoQaPage from '../../pages/DemoQaPage';
import browserWindowsPage from '../../pages/BrowserWindowsPage';

describe('DemoQA | Browser Windows', () => {
  beforeEach(() => {
    demoQaPage.visitHome();
    demoQaPage.openBrowserWindows();
    cy.location('pathname').should('eq', '/browser-windows');
    browserWindowsPage.heading().should('be.visible').and('have.text', 'Browser Windows');
  });

  it('TC-BW-001 - abre uma janela real, valida a mensagem e confirma seu fechamento', () => {
    browserWindowsPage.snapshotWindows().then((baseline) => {
      browserWindowsPage.openNewWindow();
      browserWindowsPage.inspectAndClose(baseline).then((result) => {
        expect(baseline.pages.map((page) => page.targetId), 'novo contexto de página')
          .not.to.include(result.child.targetId);
        expect(result.child.windowId, 'nova janela distinta da original')
          .not.to.eq(baseline.parent.windowId);
        expect(result.pageCountWhileOpen).to.eq(baseline.pages.length + 1);
        expect(new URL(result.url).pathname).to.eq('/sample');
        expect(new URL(result.url).origin).to.eq(new URL(Cypress.config('baseUrl')).origin);
        expect(result.message).to.eq('This is a sample page');
        expect(result.closed, 'janela criada foi fechada').to.eq(true);
        expect(result.pageCountAfterClose).to.eq(baseline.pages.length);
        expect(result.parentClosed, 'janela original permanece aberta').to.eq(false);
      });
    });
    browserWindowsPage.heading().should('be.visible');
    cy.location('pathname').should('eq', '/browser-windows');
  });
});
