const { defineConfig } = require('cypress');
const setupCommonEvents = require('./scripts/setup-common-events.cjs');
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
      return setupCommonEvents(on, config);
    },
  },
});
