class WebTablesPage {
  heading() { return cy.get('h1'); }
  table() { return cy.get('table'); }
  rows() { return this.tableBody().find('tr'); }
  searchInput() { return cy.get('#searchBox'); }
  pageSizeSelect() { return cy.get('select'); }
  paginationStatus() { return cy.contains('div', /^Page\s+\d+\s+of\s+\d+$/); }
  nextPageButton() { return cy.contains('button', /^Next$/); }
  selectPageSize(size) { return this.pageSizeSelect().select(String(size)); }
  deleteButtonByEmail(email) { return this.rowByEmail(email).find('[title="Delete"]'); }
  cellsByEmail(email) { return this.rowByEmail(email).find('td:not(:last-child)'); }

  snapshot() {
    return this.rows().then(($rows) => {
      const emails = [...$rows].map((row) => row.cells[3].textContent.trim());
      return this.searchInput().invoke('val').then((search) => (
        this.pageSizeSelect().invoke('val').then((pageSize) => (
          this.paginationStatus().invoke('text').then((pagination) => (
            this.nextPageButton().invoke('prop', 'disabled').then((nextDisabled) => ({
              rowCount: emails.length, emails, search, pageSize,
              pagination: pagination.replace(/\s+/g, ' ').trim(), nextDisabled,
            }))
          ))
        ))
      ));
    });
  }

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
