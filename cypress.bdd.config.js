const { defineConfig } = require('cypress');
const base = require('./cypress.config');
const composeEvents = require('cypress-on-fix');
const createBundler = require('@bahmutov/cypress-esbuild-preprocessor');
const { addCucumberPreprocessorPlugin } = require('@badeball/cypress-cucumber-preprocessor');
const { createEsbuildPlugin } = require('@badeball/cypress-cucumber-preprocessor/esbuild');

module.exports = defineConfig({
  ...base,
  viewportWidth: 1600,
  viewportHeight: 1200,
  e2e: {
    ...base.e2e,
    // Permite validar também as specs tradicionais sob os mesmos plugins.
    specPattern: ['cypress/e2e/**/*.cy.js', 'cypress/e2e/bdd/**/*.feature'],
    async setupNodeEvents(cypressOn, config) {
      // Preserva, entre outros eventos, ambos os handlers de after:run.
      const on = composeEvents(cypressOn);
      const configured = await base.e2e.setupNodeEvents(on, config);
      await addCucumberPreprocessorPlugin(on, configured);
      on('file:preprocessor', createBundler({
        plugins: [createEsbuildPlugin(configured)],
      }));
      return configured;
    },
  },
});
