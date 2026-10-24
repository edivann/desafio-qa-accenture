const http = require('node:http');
const { readFileSync } = require('node:fs');
const path = require('node:path');

// Aplicação mínima de demonstração, sem acesso a sistemas ou dados externos.
function startSmokeServer() {
  const html = readFileSync(path.join(__dirname, 'smoke-app', 'index.html'));
  const server = http.createServer(async (request, response) => {
    const sendJson = (status, body) => {
      response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
      response.end(JSON.stringify(body));
    };

    if (request.method === 'GET' && request.url === '/') {
      response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      response.end(html);
      return;
    }

    if (request.method === 'GET' && request.url === '/api/health') {
      sendJson(200, { status: 'ok', service: 'desafio-qa-accenture' });
      return;
    }

    if (request.method === 'POST' && request.url === '/api/users') {
      try {
        let body = '';
        for await (const chunk of request) {
          body += chunk;
          if (Buffer.byteLength(body) > 16384) {
            sendJson(413, { error: 'Payload too large' });
            return;
          }
        }
        const user = JSON.parse(body);
        if (!user || typeof user.name !== 'string' || typeof user.role !== 'string') {
          sendJson(400, { error: 'Invalid user' });
          return;
        }
        sendJson(201, { id: 1, name: user.name, role: user.role });
      } catch {
        sendJson(400, { error: 'Invalid JSON' });
      }
      return;
    }

    sendJson(404, { error: 'Not found' });
  });

  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      server.unref();
      resolve({ server, origin: `http://127.0.0.1:${server.address().port}` });
    });
  });
}

module.exports = { startSmokeServer };
