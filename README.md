# Desafio QA Accenture

Projeto independente de automação de API e Frontend em JavaScript com Cypress.
Etapa 1: estrutura e validação do ambiente com uma aplicação local de demonstração.
Etapa 2: fluxo completo da API Book Store do DemoQA, explicado abaixo.

## Requisitos

- Node.js 24.x (versão de referência em `.nvmrc`).
- npm 10 ou superior.
- Git.
- Google Chrome para a execução padrão.
- Internet na primeira instalação para baixar os pacotes e o binário do Cypress.

O projeto usa Chrome por padrão. Para usar outro navegador instalado, por exemplo
Edge, adicione `-- --browser edge` ao comando de teste.

## Instalação

No terminal, entre na pasta deste projeto e execute:

```sh
npm ci
npm run cy:verify
```

O `package-lock.json` fixa as versões para uma instalação reproduzível. Use
`npm install` quando precisar alterar as dependências. Se o binário não for
baixado durante a instalação, execute `npx cypress install`.

No PowerShell, se a política de execução bloquear `npm.ps1`, use `npm.cmd`
nos comandos, sem alterar a política da máquina.

Se `npm --version` apontar para uma instalação global antiga, confira a versão
do npm que acompanha o Node.js e use seu CLI diretamente. No PowerShell:

```powershell
$taskNpm = Join-Path (Split-Path (Get-Command node).Source) 'node_modules/npm/bin/npm-cli.js'
node $taskNpm --version
node $taskNpm ci
node $taskNpm test
```

Esse procedimento não muda a instalação global de npm.

Em uma rede com certificados corporativos confiáveis no Windows, caso o Node
reporte `UNABLE_TO_VERIFY_LEAF_SIGNATURE`, execute `$env:NODE_USE_SYSTEM_CA = '1'`
no PowerShell antes da instalação. Isso usa os certificados do sistema e mantém
a validação TLS habilitada.

## Execução

| Comando | Finalidade |
| --- | --- |
| `npm test` | Todos os testes, em Chrome sem interface gráfica |
| `npm run test:smoke` | Validação inicial de API, Frontend e seleção de TXT |
| `npm run test:api` | Apenas a pasta de API |
| `npm run test:bookstore` | Apenas o fluxo completo da API Book Store do DemoQA |
| `npm run test:frontend` | Apenas a pasta de Frontend |
| `npm run cy:open` | Interface interativa do Cypress |
| `npm run cy:verify` | Verificação do binário do Cypress |
| `npm run cy:info` | Diagnóstico do ambiente e navegadores |

O servidor de demonstração inicia automaticamente na interface de loopback,
em uma porta livre. Em modo de execução, ele é encerrado após os testes. No modo
interativo, é encerrado junto com o processo de configuração do Cypress.
Não é preciso iniciar outro terminal ou definir uma porta fixa.

## Estrutura

```text
desafio-qa-accenture/
├── cypress/
│   ├── e2e/
│   │   ├── api/
│   │   │   ├── bookstore.cy.js
│   │   │   └── smoke.cy.js
│   │   └── frontend/smoke.cy.js
│   ├── fixtures/
│   │   ├── smoke.json
│   │   └── uploads/arquivo-teste.txt
│   ├── pages/SmokePage.js
│   └── support/
│       ├── commands.js
│       └── e2e.js
├── scripts/
│   ├── smoke-app/index.html
│   └── smoke-server.js
├── .gitattributes
├── .gitignore
├── .nvmrc
├── cypress.config.js
├── jsconfig.json
├── package.json
├── package-lock.json
└── README.md
```

## Organização e próximos cenários

- API: `cy.request()` com o comando reutilizável `cy.apiRequest(options)`.
- Frontend: Page Objects para ações e seletores; as verificações ficam nos testes.
- Seletores: prefira `data-testid` e o comando `cy.getByTestId()`.
- Fixtures: dados fictícios e arquivos de upload em `cypress/fixtures/`.
- Upload: `selectFile()` nativo, sem plugin adicional. O smoke verifica seleção
  e leitura do TXT no navegador; envio e persistência no backend dependem do desafio.
- Testes independentes, isolamento habilitado e esperas por condições do Cypress,
  sem pausas de duração fixa e sem esconder falhas com tentativas automáticas.

Para os testes reais, configure a URL do Frontend com `--config baseUrl=...`
e a URL pública da API com `--expose apiUrl=...`, por exemplo:

```sh
npm run test:frontend -- --config baseUrl=https://frontend.exemplo.com
npm run test:api -- --expose apiUrl=https://api.exemplo.com
```

Os smoke tests continuam usando URLs absolutas do servidor local para validar
o ambiente, mesmo quando as URLs reais forem configuradas. Novos testes podem
usar `cy.visit('/')` e `cy.apiRequest({ method: 'GET', url: '/recurso' })`.
Por padrão, `apiUrl` aponta para `https://demoqa.com`. O Frontend de demonstração
continua usando o servidor local.

## Etapa 2 — API Book Store

Referência dos contratos: [Swagger oficial do DemoQA](https://demoqa.com/swagger/).
O arquivo `cypress/e2e/api/bookstore.cy.js` contém um único teste com seis etapas.
Execute com `npm run test:bookstore`. Os comandos `npm run test:api` e `npm test`
também incluem esse fluxo e passam a depender da disponibilidade do DemoQA.
Para validar somente a infraestrutura local, use `npm run test:smoke`.

| Etapa | Método e endpoint | HTTP esperado | Validações principais |
| --- | --- | --- | --- |
| 1. Criar usuário | `POST /Account/v1/User` | 201 | ID, nome enviado e coleção inicialmente vazia |
| 2. Gerar token | `POST /Account/v1/GenerateToken` | 200 | `status` igual a `Success`, token não vazio e expiração futura |
| 3. Verificar autorização | `POST /Account/v1/Authorized` | 200 | Corpo booleano `true` |
| 4. Consultar catálogo | `GET /BookStore/v1/Books` | 200 | Livros com ISBN e título; ao menos dois ISBNs distintos |
| 5. Associar livros | `POST /BookStore/v1/Books` | 201 | Exatamente os dois ISBNs selecionados |
| 6. Consultar usuário | `GET /Account/v1/User/{userId}` | 200 | Mesmo ID e nome, coleção com exatamente os dois ISBNs |

### Como explicar o teste

1. O nome combina `qa`, timestamp em base 36 e seis caracteres de um UUID aleatório.
   Ele é curto e muda a cada execução. A senha usa outro `crypto.randomUUID()`,
   com prefixo que garante letras maiúsculas, minúsculas, número e caractere
   especial. Não há credenciais pessoais ou ISBNs fixos.
2. Cada chamada usa `cy.apiRequest()`, que delega para `cy.request()`. O retorno
   de cada chamada é encadeado com `.then()`. A etapa seguinte só começa depois
   das asserções da etapa anterior; uma falha interrompe o fluxo.
3. `userId`, `token` e `selectedIsbns` são variáveis locais do mesmo teste. Elas
   são preenchidas antes da construção das requisições que dependem delas.
   Não há dependência entre testes separados, arquivos ou execuções.
4. O catálogo fornece os ISBNs. `Set` elimina duplicações e `slice(0, 2)` escolhe
   dois distintos. O teste falha se o catálogo não oferecer essa quantidade.
5. O token vai no cabeçalho `Authorization: Bearer ...` nas chamadas protegidas.
   Credenciais e token não são gravados em fixtures ou arquivos; `log: false`
   desabilita o log das requisições. Asserções não imprimem o valor do token.
6. Além dos códigos HTTP, o teste valida o conteúdo. O token, por exemplo, pode
   vir com HTTP 200 e indicar erro no campo `status`; isso também causa falha.

### Diagnóstico e limites

`failOnStatusCode: false` permite que `validateResponse()` compare o HTTP esperado
com o recebido e inclua a etapa, o código e a mensagem da API na falha. Isso não
transforma erros em sucesso. Não há `catch` para ignorar erros, mocks, pausas fixas
ou tentativas automáticas de requisição neste fluxo.

A API real retorna `userID` na criação e `userId` na consulta. O Swagger descreve
`userId` nos dois modelos; o teste explicita essa diferença, sem aceitar ambos
indiscriminadamente.

Na investigação inicial, um nome com 49 caracteres foi aceito no cadastro (201),
mas a geração do token retornou 500 com uma página HTML apontando erro de atualização
no banco do servidor. Repetindo as chamadas com um nome único de 16 caracteres,
a geração do token retornou 200 e a autorização retornou `true`. Por isso o gerador
mantém nomes curtos. O Swagger não informa o limite; não foi determinado um limite
exato nem confirmada a causa interna. Respostas HTML de erro também têm um trecho
incluído na mensagem de falha, sem transformar o HTTP 500 em sucesso.

O DemoQA é um serviço público externo: falhas de rede, autenticação, indisponibilidade
ou catálogo insuficiente devem falhar no teste e ser investigadas. Cada execução
cria uma conta fictícia e mantém a coleção nela; exclusão de contas não faz parte
deste fluxo. Nenhum novo cenário de Frontend ou bônus de Cucumber foi implementado.

### Validação executada

- `npm run test:bookstore`: 1 teste aprovado, com as seis etapas completas.
- `npm test`: 6 testes aprovados em 3 specs, sem falhas, pendências ou ignorados.
  Inclui outra execução do fluxo real com novo usuário e os cinco smoke tests
  já existentes. Ambos os comandos terminaram com código de saída zero em
  Chrome 156 headless, Cypress 16.2.0 e Node.js 24.22.1.

Não salve credenciais no código, em fixtures ou em argumentos de linha de comando.
Forneça segredos por variáveis de ambiente na execução. `.env` não é carregado
automaticamente. `cypress.env.json`, `.env*`, dependências, screenshots, vídeos
e relatórios gerados estão no `.gitignore`.

## Referências

- [Instalação do Cypress](https://docs.cypress.io/app/get-started/install-cypress)
- [Upload com selectFile](https://docs.cypress.io/api/commands/selectfile)
