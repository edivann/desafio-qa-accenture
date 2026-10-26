// O HTTP é validado manualmente para incluir a etapa e o erro retornado pela API.
function validateResponse(response, expectedStatus, step) {
  const apiCode = response.body?.code ?? 'sem código';
  const apiMessage = typeof response.body === 'string'
    ? response.body.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 180)
    : response.body?.message ?? response.body?.result ?? 'sem mensagem';

  expect(response.status, `${step} | API: ${apiCode} - ${apiMessage}`)
    .to.eq(expectedStatus);
  expect(response.headers['content-type'], `${step}: resposta JSON`)
    .to.include('application/json');
}

describe('DemoQA | Fluxo completo da API Book Store', () => {
  it('TC-API-001 - cria e autentica um usuário, adiciona dois livros e consulta a coleção', () => {
    // O DemoQA aceitou um login longo no cadastro, mas falhou ao gerar seu token.
    const runId = `${Date.now().toString(36)}${crypto.randomUUID().slice(0, 6)}`;
    const credentials = {
      userName: `qa${runId}`,
      password: `Qa!9_${crypto.randomUUID()}`,
    };

    let userId;
    let token;
    let selectedIsbns;

    const requestOptions = {
      failOnStatusCode: false,
      retryOnNetworkFailure: false,
      retryOnStatusCodeFailure: false,
      log: false,
    };

    cy.log('1/6 - Criar usuário com credenciais únicas');
    return cy.apiRequest({
      ...requestOptions,
      method: 'POST',
      url: '/Account/v1/User',
      body: credentials,
    }).then((response) => {
      validateResponse(response, 201, '1/6 - Criar usuário');
      // A resposta real de criação usa userID; a consulta usa userId.
      userId = response.body.userID;
      expect(userId, 'ID do usuário criado').to.be.a('string').and.not.be.empty;
      expect(response.body.username).to.eq(credentials.userName);
      expect(response.body.books, 'coleção inicial vazia').to.be.an('array').and.be.empty;

      cy.log('2/6 - Gerar token');
      return cy.apiRequest({
        ...requestOptions,
        method: 'POST',
        url: '/Account/v1/GenerateToken',
        body: credentials,
      });
    }).then((response) => {
      validateResponse(response, 200, '2/6 - Gerar token');
      expect(response.body.status, `Gerar token: ${response.body.result}`).to.eq('Success');
      token = response.body.token;
      // A asserção booleana evita imprimir o token em uma eventual falha.
      expect(typeof token === 'string' && token.length > 0, 'token recebido').to.eq(true);
      const expiresAt = Date.parse(response.body.expires);
      expect(Number.isFinite(expiresAt), 'expiração do token válida').to.eq(true);
      expect(expiresAt, 'token ainda não expirou').to.be.greaterThan(Date.now());

      cy.log('3/6 - Verificar autorização');
      return cy.apiRequest({
        ...requestOptions,
        method: 'POST',
        url: '/Account/v1/Authorized',
        body: credentials,
      });
    }).then((response) => {
      validateResponse(response, 200, '3/6 - Verificar autorização');
      expect(response.body, 'usuário autorizado').to.eq(true);

      cy.log('4/6 - Consultar catálogo e selecionar dois ISBNs distintos');
      return cy.apiRequest({
        ...requestOptions,
        method: 'GET',
        url: '/BookStore/v1/Books',
      });
    }).then((response) => {
      validateResponse(response, 200, '4/6 - Consultar catálogo');
      expect(response.body.books, 'catálogo de livros').to.be.an('array');
      const catalogIsbns = response.body.books.map((book) => {
        expect(book.isbn, 'ISBN do catálogo').to.be.a('string').and.not.be.empty;
        expect(book.title, 'título do livro').to.be.a('string').and.not.be.empty;
        return book.isbn;
      });

      selectedIsbns = [...new Set(catalogIsbns)].slice(0, 2);
      expect(selectedIsbns, 'catálogo deve oferecer dois ISBNs distintos').to.have.length(2);

      cy.log('5/6 - Associar os dois livros ao usuário');
      return cy.apiRequest({
        ...requestOptions,
        method: 'POST',
        url: '/BookStore/v1/Books',
        headers: { Authorization: `Bearer ${token}` },
        body: {
          userId,
          collectionOfIsbns: selectedIsbns.map((isbn) => ({ isbn })),
        },
      });
    }).then((response) => {
      validateResponse(response, 201, '5/6 - Associar livros');
      expect(response.body.books, 'livros adicionados').to.be.an('array').and.have.length(2);
      expect(response.body.books.map((book) => book.isbn), 'ISBNs adicionados')
        .to.have.members(selectedIsbns);

      cy.log('6/6 - Consultar usuário e validar os dois livros associados');
      return cy.apiRequest({
        ...requestOptions,
        method: 'GET',
        url: `/Account/v1/User/${userId}`,
        headers: { Authorization: `Bearer ${token}` },
      });
    }).then((response) => {
      validateResponse(response, 200, '6/6 - Consultar usuário');
      expect(response.body.userId, 'ID do usuário consultado').to.eq(userId);
      expect(response.body.username).to.eq(credentials.userName);
      expect(response.body.books, 'coleção final do usuário').to.be.an('array').and.have.length(2);
      expect(response.body.books.map((book) => book.isbn), 'ISBNs associados ao usuário')
        .to.have.members(selectedIsbns);
    });
  });
});
