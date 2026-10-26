const { startSmokeServer } = require('./smoke-server');

async function setupCommonEvents(on, config) {
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
}

module.exports = setupCommonEvents;
