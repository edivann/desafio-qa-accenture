# Desafio QA Accenture

Projeto independente de automação de API e Frontend em JavaScript com Cypress.
Etapa 1: estrutura, configuração e validação do ambiente. Os testes iniciais usam
uma aplicação local de demonstração; os cenários reais do desafio serão adicionados
quando os requisitos e as URLs estiverem disponíveis.

## Requisitos

- Node.js 24.x (versão de referência em `.nvmrc`).
- npm 10 ou superior.
- Git.
- Microsoft Edge para a execução padrão (Chrome também pode ser usado).
- Internet na primeira instalação para baixar os pacotes e o binário do Cypress.

O projeto usa Edge, disponível neste ambiente. Para usar outro navegador instalado,
adicione `-- --browser chrome` ao comando de teste.

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
| `npm test` | Todos os testes, em Edge sem interface gráfica |
| `npm run test:smoke` | Validação inicial de API, Frontend e seleção de TXT |
| `npm run test:api` | Apenas a pasta de API |
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
│   │   ├── api/smoke.cy.js
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

Não salve credenciais no código, em fixtures ou em argumentos de linha de comando.
Forneça segredos por variáveis de ambiente na execução. `.env` não é carregado
automaticamente. `cypress.env.json`, `.env*`, dependências, screenshots, vídeos
e relatórios gerados estão no `.gitignore`.

## Referências

- [Instalação do Cypress](https://docs.cypress.io/app/get-started/install-cypress)
- [Upload com selectFile](https://docs.cypress.io/api/commands/selectfile)
