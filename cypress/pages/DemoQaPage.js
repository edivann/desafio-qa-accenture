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
}

export default new DemoQaPage();
