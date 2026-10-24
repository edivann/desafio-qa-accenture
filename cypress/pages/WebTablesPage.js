class WebTablesPage {
  openRegistration() {
    return cy.get('#addNewRecordButton').click();
  }

  registrationDialog() {
    return cy.get('.modal[role="dialog"]');
  }

  fillRegistration(record) {
    this.registrationDialog().within(() => {
      cy.get('#firstName').clear().type(record.firstName);
      cy.get('#lastName').clear().type(record.lastName);
      cy.get('#userEmail').clear().type(record.email);
      cy.get('#age').clear().type(String(record.age));
      cy.get('#salary').clear().type(String(record.salary));
      cy.get('#department').clear().type(record.department);
    });
  }

  submitRegistration() {
    return this.registrationDialog().find('#submit').click();
  }

  tableBody() {
    return cy.get('table tbody');
  }

  rowByEmail(email) {
    return cy.contains('table tbody tr', email);
  }

  editRecord(email) {
    return this.rowByEmail(email).find('[title="Edit"]').click();
  }

  deleteRecord(email) {
    return this.rowByEmail(email).find('[title="Delete"]').click();
  }
}

export default new WebTablesPage();
