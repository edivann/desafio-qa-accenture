const base = require('./cypress.bdd.config');
const chromeForTesting = require('./scripts/chrome-for-testing.cjs');

module.exports = {
  ...base,
  e2e: {
    ...base.e2e,
    async setupNodeEvents(on, config) {
      config.browsers = [chromeForTesting()];
      return base.e2e.setupNodeEvents(on, config);
    },
  },
};
