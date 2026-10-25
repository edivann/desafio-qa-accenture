class BrowserWindowsPage {
  heading() { return cy.get('#browserWindows h1'); }
  openNewWindow() { return cy.get('#windowButton').click(); }
  snapshotWindows() { return cy.puppeteer('snapshotWindows', { pathname: '/browser-windows' }); }
  inspectAndClose(baseline) {
    return cy.puppeteer('inspectAndCloseWindow', {
      pathname: '/browser-windows', baseline, messageSelector: '#sampleHeading',
      screenshotPath: 'cypress/screenshots/TC-BW-001-janela-real.png',
    });
  }
}

export default new BrowserWindowsPage();
