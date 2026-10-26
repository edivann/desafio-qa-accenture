Cypress.Commands.add('getByTestId', (testId, options = {}) => (
  cy.get(`[data-testid="${testId}"]`, options)
));

// Aceita caminhos relativos à API configurada ou uma URL absoluta explícita.
Cypress.Commands.add('apiRequest', (options) => {
  const baseUrl = Cypress.expose('apiUrl');
  const url = new URL(options.url, `${baseUrl.replace(/\/$/, '')}/`).href;
  return cy.request({ ...options, url });
});
