const { defineConfig } = require('cypress');
const { startSmokeServer } = require('./scripts/smoke-server');

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
      const { server, origin } = await startSmokeServer();

      // Uma porta livre evita conflitos com outros projetos ou aplicações.
      config.baseUrl = config.baseUrl || origin;
      config.expose.smokeUrl = origin;
      config.expose.apiUrl = config.expose.apiUrl || config.baseUrl;

      on('after:run', () => new Promise((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
        // O proxy do navegador pode manter conexões abertas após o último teste.
        server.closeAllConnections();
      }));

      return config;
    },
  },
});
