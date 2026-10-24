class SmokePage {
  visit() {
    return cy.visit(Cypress.expose('smokeUrl'));
  }

  title() {
    return cy.getByTestId('page-title');
  }

  status() {
    return cy.getByTestId('status');
  }

  selectUpload(filePath) {
    return cy.getByTestId('upload-input').selectFile(filePath);
  }

  uploadName() {
    return cy.getByTestId('upload-name');
  }

  uploadContent() {
    return cy.getByTestId('upload-content');
  }
}

export default new SmokePage();
