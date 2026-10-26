const base = require('./cypress.config');
const setupCommonEvents = require('./scripts/setup-common-events.cjs');

module.exports = {
  ...base,
  e2e: {
    ...base.e2e,
    // Ambos usam cy.puppeteer(); permanecem no modo completo e na regressão.
    excludeSpecPattern: [
      'cypress/e2e/frontend/browser-windows.cy.js',
      'cypress/e2e/frontend/sortable.cy.js',
    ],
    setupNodeEvents: setupCommonEvents,
  },
};
