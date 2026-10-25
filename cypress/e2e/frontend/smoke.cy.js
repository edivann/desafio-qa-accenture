import smokePage from '../../pages/SmokePage';

describe('Smoke | Frontend local de demonstração', () => {
  beforeEach(() => {
    smokePage.visit();
  });

  it('INF-UI-001 - exibe a página e confirma a comunicação com a API', () => {
    cy.fixture('smoke').then(({ title }) => {
      smokePage.title().should('be.visible').and('have.text', title);
    });
    smokePage.status().should('have.text', 'API disponível');
  });

  it('INF-UI-002 - seleciona o TXT de upload e confere nome e conteúdo', () => {
    const filePath = 'cypress/fixtures/uploads/arquivo-teste.txt';

    smokePage.selectUpload(filePath);
    smokePage.uploadName().should('have.text', 'arquivo-teste.txt');
    cy.readFile(filePath, 'utf8').then((content) => {
      smokePage.uploadContent().should('have.text', content);
    });
  });
});
