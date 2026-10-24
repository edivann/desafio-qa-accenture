describe('Smoke | API local de demonstração', () => {
  const endpoint = (path) => `${Cypress.expose('smokeUrl')}${path}`;

  it('retorna a saúde do serviço com contrato JSON válido', () => {
    cy.apiRequest({ method: 'GET', url: endpoint('/api/health') }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.headers['content-type']).to.include('application/json');
      expect(response.body).to.deep.eq({ status: 'ok', service: 'desafio-qa-accenture' });
    });
  });

  it('aceita um usuário fictício e retorna os dados com identificador', () => {
    cy.fixture('smoke').then(({ user }) => {
      cy.apiRequest({ method: 'POST', url: endpoint('/api/users'), body: user })
        .then((response) => {
          expect(response.status).to.eq(201);
          expect(response.body.id).to.be.a('number').and.be.greaterThan(0);
          expect(response.body).to.include(user);
        });
    });
  });

  it('retorna 404 para uma rota inexistente', () => {
    cy.apiRequest({
      method: 'GET',
      url: endpoint('/api/inexistente'),
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(404);
      expect(response.body).to.deep.eq({ error: 'Not found' });
    });
  });
});
