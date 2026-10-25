const { defineConfig } = require('cypress');
const { startSmokeServer } = require('./scripts/smoke-server');
const { setup } = require('@cypress/puppeteer');
const puppeteer = require('puppeteer-core');
const browserActions = require('./scripts/browser-actions.cjs');

module.exports = defineConfig({
  viewportWidth: 1280,
  viewportHeight: 720,
  video: false,
  screenshotOnRunFailure: true,
  retries: 0,
  expose: {},
  e2e: {
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e.js',
    fixturesFolder: 'cypress/fixtures',
    testIsolation: true,
    async setupNodeEvents(on, config) {
      setup({ on, puppeteer, onMessage: browserActions });
      const { server, origin } = await startSmokeServer();

      // Uma porta livre evita conflitos com outros projetos ou aplicações.
      config.baseUrl = config.expose.smokeOnly ? origin : config.baseUrl || 'https://demoqa.com';
      config.expose.smokeUrl = origin;
      config.expose.apiUrl = config.expose.apiUrl || 'https://demoqa.com';

      on('after:run', () => new Promise((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
        // O proxy do navegador pode manter conexões abertas após o último teste.
        server.closeAllConnections();
      }));

      return config;
    },
  },
});
