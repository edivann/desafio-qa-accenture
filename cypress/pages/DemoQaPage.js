class DemoQaPage {
  visitHome() {
    return cy.visit('/');
  }

  openPracticeForm() {
    cy.get('a[href="/forms"]').click();
    return cy.get('a[href="/automation-practice-form"]').click();
  }

  openWebTables() {
    cy.get('a[href="/elements"]').click();
    return cy.get('a[href="/webtables"]').click();
  }

  openProgressBar() {
    cy.get('a[href="/widgets"]').click();
    return cy.get('a[href="/progress-bar"]').click();
  }

  openSortable() {
    cy.get('a[href="/interaction"]').click();
    return cy.get('a[href="/sortable"]').click();
  }

  openBrowserWindows() {
    cy.get('a[href="/alertsWindows"]').click();
    return cy.get('a[href="/browser-windows"]').click();
  }
}

export default new DemoQaPage();
