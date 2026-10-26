# Desafio QA Accenture

## Sobre o projeto

Este projeto reúne os testes de API e Frontend do [DemoQA](https://demoqa.com/) para o desafio da Accenture. Usei Cypress e JavaScript, com as interações organizadas em Page Objects e as validações nas specs.

São nove testes obrigatórios em seis funcionalidades e cinco Smoke locais. O bônus Cucumber tem um cenário de cadastro aprovado e outro de exclusão bloqueado por um defeito do DemoQA. A exclusão não entra na contagem de aprovados.

## Tecnologias utilizadas

- Node.js 24.x e npm >=10. A versão de referência do Node está em `.nvmrc` (24.22.1).
- Cypress 16.2.0 e JavaScript.
- `@cypress/puppeteer` 0.1.10 e `puppeteer-core` 25.16.0 para janela real e arraste nativo.
- Cucumber preprocessor 28.0.1, Esbuild 0.28.2, esbuild preprocessor 2.2.8 e `cypress-on-fix` 1.1.0.
- `@cypress/grep` 7.0.0 para selecionar casos pelo ID.
- Chrome headless nos comandos de teste. O Runner permite a seleção padrão de navegadores ou a abertura específica com Chrome for Testing.

As versões estão fixadas no `package-lock.json`. O override de `puppeteer-core` mantém o plugin na mesma versão usada pelo projeto, substituindo sua árvore antiga de dependências. Essa combinação foi validada; atualizações precisam de nova regressão.

## Organização do projeto

```text
cypress/
  e2e/api/          Book Store e Smoke API
  e2e/frontend/     Practice Form, Web Tables, Progress Bar,
                    Sortable, Browser Windows e Smoke UI
  e2e/bdd/          Feature e Step Definitions de Web Tables
  pages/            Seletores e interações com as páginas
  fixtures/         Opções, massa Smoke e uploads/arquivo-teste.txt
  support/          Comandos, plugins e geradores de dados
scripts/
  browser-actions.cjs      Ações Puppeteer para janela e arraste
  chrome-for-testing.cjs   Localização do navegador para o Runner
  setup-common-events.cjs  URLs e ciclo do servidor Smoke compartilhados
  smoke-server.js          Servidor local em porta livre
  smoke-app/index.html     Página usada pelos Smoke
docs/bonus-cucumber-bloqueado.md
cypress.config.js
cypress.open.config.js
cypress.bdd.config.js
cypress.testing.config.js
```

Cada teste prepara seus próprios dados, com isolamento habilitado. Web Tables tem casos separados para cadastro, edição e exclusão. Book Store mantém as seis etapas no mesmo `it()`, como exige o fluxo integrado do desafio. ID do usuário, token e ISBNs ficam apenas nessa execução. As [diretrizes de organização](AGENTS.md) orientam os novos cenários.

## Como instalar

Requisitos: Node.js 24.x, npm >=10, Git, Google Chrome e acesso à internet. Para clonar o [repositório privado](https://github.com/edivann/desafio-qa-accenture), é necessário ter acesso autorizado no GitHub. A autenticação do GitHub não é usada nos testes.

Abra a pasta do projeto no IntelliJ IDEA e execute no terminal:

```sh
npm ci
npm run cy:verify
```

Se o binário do Cypress não tiver sido baixado, execute `npx cypress install`. No PowerShell, use `npm.cmd` se a execução de `npm.ps1` estiver bloqueada, sem alterar a política da máquina.

Para abrir com Chrome convencional ou outro navegador detectado, execute `npm run cy:open`. Esse modo não registra o plugin Puppeteer e não exige Chrome for Testing. Browser Windows e Sortable ficam fora dessa lista porque dependem de Puppeteer.

Para usar a opção portátil compatível com Puppeteer no modo interativo, instale o Chrome for Testing correspondente. O comando abaixo funciona no PowerShell e no Bash e instala o navegador fora do projeto, no cache do usuário:

```sh
npx @puppeteer/browsers@3.2.6 install chrome@156.0.8078.47 --path "$HOME/.cache/puppeteer"
npm run cy:open:testing
```

O instalador baixa a distribuição oficial do Google. O navegador não faz parte do repositório nem é baixado por `npm ci`. Se precisar de outro diretório, use o mesmo `--path` na instalação e defina `CYPRESS_CFT_CACHE` com esse diretório antes de abrir o Cypress. Preserve a estrutura criada pelo instalador.

O helper usa a versão indicada em `PUPPETEER_REVISIONS.chrome` do `puppeteer-core` instalado, sem caminhos pessoais no código. Estão previstos Windows x64, Linux x64 e macOS Intel/Apple Silicon. A validação foi feita em Windows x64 com Chrome for Testing 156.0.8078.47; os demais sistemas não foram executados nesta revisão. No Linux, as [dependências de sistema do Cypress](https://docs.cypress.io/app/get-started/install-cypress#Linux-Prerequisites) e do navegador também precisam estar instaladas.

## Como executar os testes

Os comandos `test:*` usam o Chrome instalado em modo headless:

| Comando | Escopo | Casos |
| --- | --- | ---: |
| `npm run test:challenge` | Seis funcionalidades obrigatórias | 9 |
| `npm run test:smoke` | API e Frontend locais | 5 |
| `npm test` | Obrigatórios e Smoke | 14 |
| `npm run test:all` | Obrigatórios, Smoke e cadastro BDD, sem `@known-bug` | 15 |
| `npm run test:bookstore` | Fluxo integrado da API | 1 |
| `npm run test:frontend:demoqa` | Practice Form e Web Tables | 4 |
| `npm run test:progress-bar` | Pausa, retomada e Reset | 2 |
| `npm run test:sortable` | Arraste e ordenação | 1 |
| `npm run test:browser-windows` | Abertura e fechamento de janela real | 1 |
| `npm run test:api` | Book Store e Smoke API | 4 |
| `npm run test:frontend` | Obrigatórios de Frontend e Smoke UI | 10 |
| `npm run cy:open` | Runner padrão, sem Puppeteer, Browser Windows e Sortable | 12 disponíveis em 6 specs |
| `npm run cy:open:testing` | Runner com Chrome for Testing e cadastro BDD | 15 disponíveis em 9 specs |
| `npm run cy:verify` / `npm run cy:info` | Diagnóstico do ambiente | — |

**Para executar visualmente todos os módulos obrigatórios, use `npm run cy:open:testing`.** Esse é o modo recomendado para a avaliação completa do desafio.

Em `cy:open`, escolha Chrome, Edge, Firefox, Electron ou outro navegador detectado, clique em **Start E2E Testing** e selecione a spec. Não há navegador forçado. A configuração `cypress.open.config.js` mantém as URLs, o isolamento, as fixtures, os comandos e o servidor Smoke, sem registrar os hooks e as tarefas do plugin Puppeteer. Practice Form, Web Tables, Progress Bar, Book Store e os Smoke continuam disponíveis. A feature BDD fica no modo completo.

Em `cy:open:testing`, selecione **Chrome for Testing** e siga os mesmos passos. A configuração `cypress.testing.config.js` reutiliza a configuração BDD, registra Puppeteer normalmente e usa o inicializador portátil. Oferece somente esse navegador; se ele estiver ausente, informa o caminho esperado e o comando de instalação. Esse é o modo completo: os seis módulos obrigatórios, incluindo Browser Windows com janela real e Sortable com arraste nativo, os Smoke e o cadastro BDD. Aplica `not @known-bug`, como `test:all`.

Os comandos headless continuam usando `cypress.config.js` ou `cypress.bdd.config.js`, com Puppeteer habilitado e sem as exclusões do modo visual padrão. `npm test` mantém os 14 casos e `test:all` mantém os 15. O código dos testes e dos Page Objects é o mesmo em todos os modos.

Para executar uma spec ou um teste individual:

```sh
npm test -- --spec cypress/e2e/frontend/practice-form.cy.js
npm test -- --spec cypress/e2e/frontend/web-tables.cy.js --expose grep=TC-WT-002,grepOmitFiltered=true
npm test -- --spec cypress/e2e/frontend/progress-bar.cy.js --expose grep=TC-PB-001,grepOmitFiltered=true
```

## Cenários automatizados

| ID | Funcionalidade | Validações |
| --- | --- | --- |
| TC-API-001 | Book Store | Usuário único, token válido, autorização, catálogo, dois ISBNs distintos e consulta da coleção do mesmo usuário |
| TC-PF-001 | Practice Form | Navegação, dados dinâmicos, calendário, assuntos, hobbies, estado/cidade e TXT; dez valores do modal e fechamento por Escape |
| TC-WT-001 | Web Tables — cadastro | Inclusão e comparação dos seis campos |
| TC-WT-002 | Web Tables — edição | Massa própria, alteração dos seis campos e ausência do e-mail anterior |
| TC-WT-003 | Web Tables — exclusão | Cadastro e edição próprios, validações intermediárias e ausência após Delete, sem busca |
| TC-PB-001 | Progress Bar — pausa | Progresso positivo, parada em 20%, abaixo de 25%, e manutenção da pausa |
| TC-PB-002 | Progress Bar — retomada | Pausa própria, conclusão em 100%, Reset, retorno e manutenção do zero |
| TC-SO-001 | Sortable | Mudança e restauração da ordem de One a Six por arraste nativo, com eventos confiáveis |
| TC-BW-001 | Browser Windows | Nova janela real, IDs distintos, mensagem, fechamento e preservação da original |
| INF-API-001 a 003 | Smoke API | Saúde JSON, criação fictícia e rota inexistente 404 |
| INF-UI-001 a 002 | Smoke UI | Página, comunicação com API e leitura do TXT selecionado |
| TC-BDD-001 | Bônus — cadastro aprovado | 12 registros exclusivos, seis campos por registro, visibilidade de todos e contagem total |
| TC-BDD-002 | Bônus — exclusão bloqueada | Massa própria; cada Delete deve remover só uma linha e preservar as demais; marcado com `@known-bug` |

Os cinco Smoke verificam a infraestrutura local e não contam como requisitos do desafio. O servidor inicia automaticamente em `127.0.0.1`, numa porta livre, e encerra após a execução. `test:smoke` usa a URL local também na verificação inicial do Cypress.

A API segue o [Swagger do DemoQA](https://demoqa.com/swagger/). `cy.apiRequest()` resolve a URL e chama `cy.request()`:

| Etapa | Endpoint | HTTP |
| --- | --- | ---: |
| Criar usuário | POST `/Account/v1/User` | 201 |
| Gerar token | POST `/Account/v1/GenerateToken` | 200 |
| Autorizar | POST `/Account/v1/Authorized` | 200 |
| Consultar catálogo | GET `/BookStore/v1/Books` | 200 |
| Associar livros | POST `/BookStore/v1/Books` | 201 |
| Consultar coleção | GET `/Account/v1/User/{userId}` | 200 |

O teste valida HTTP, JSON e conteúdo das respostas. Um erro interrompe o fluxo e informa a etapa. `failOnStatusCode: false` permite conferir a resposta na asserção; não aprova erros. Os retries de requisição estão desabilitados nesse fluxo.

## Bônus com Cucumber

| Comando | Execução |
| --- | --- |
| `npm run test:bonus` | Apenas TC-BDD-001: um cenário de cadastro |
| `npm run test:bonus:validos` | Mesmo perfil, mantido por compatibilidade |
| `npm run test:bonus:known-bug` | Apenas TC-BDD-002: reprodução da exclusão bloqueada |
| `npm run test:bonus:all` | Ambos, incluindo a falha conhecida |

Os dois cenários são independentes e reutilizam os steps de navegação, cadastro e comparação. Cada um cria seus próprios 12 registros, seleciona 50 linhas e verifica busca vazia e página única. A configuração BDD reaproveita os plugins e o servidor Smoke da configuração principal. `cypress-on-fix` preserva os handlers de encerramento e relatório.

Os perfis passam as tags por `--expose`, com `omitFiltered=true`. O caso fora do perfil não é contado como aprovado ou pendente. A tag não transforma falha em sucesso. Para executar as specs tradicionais com a configuração BDD:

```sh
npm test -- --config-file cypress.bdd.config.js --spec "cypress/e2e/**/*.cy.js"
```

As massas e os snapshots ficam em `cypress/reports/bonus/<ID>/`, o relatório Gherkin em `cypress/reports/bonus-cucumber.json` e as imagens em `cypress/screenshots/`. Essas evidências são locais e ignoradas pelo Git.

Execute o Runner e a regressão em momentos separados: ambos usam essas pastas de evidências, e a execução simultânea apresentou falha na limpeza de screenshots no Windows.

## Limitações conhecidas

- **Exclusão BDD:** após cadastrar 12 registros, a tabela tem 15 linhas. Na reprodução registrada, o primeiro Delete deixa apenas as três linhas originais, embora a asserção exija 14. Os outros 11 registros também desaparecem. O cenário salva evidências antes de falhar; as outras 11 exclusões e a verificação final não são concluídas. Não há 12 exclusões individuais aprovadas. O [diagnóstico completo](docs/bonus-cucumber-bloqueado.md) inclui reprodução manual e hipótese técnica, sem apresentar a causa interna como comprovada. Não há alteração do estado React nem exclusão simulada.
- **Practice Form:** o TXT é conferido na seleção e no modal, sem validar persistência em backend. O botão Close apresentou `findDOMNode is not a function`; o teste usa Escape e confirma o fechamento. O botão não foi tratado como corrigido nem revalidado nesta revisão.
- **Progress Bar:** `cy.clock` controla apenas `setInterval`/`clearInterval`. Cada `cy.tick(100)` executa o callback real e espera o valor renderizado; um callback adicional permite limpar o intervalo em 100%. O teste não mede fluidez ou duração real. Se o timer do site mudar, esse controle precisa ser revisto.
- **Navegador:** o plugin Puppeteer é experimental e bloqueia Chrome convencional >=137 no modo interativo devido à restrição de extensão. Por isso, `cy:open` não registra esse plugin e exclui Browser Windows e Sortable. Para executar esses cenários, use `cy:open:testing`, com Chrome for Testing e Puppeteer habilitado. O plugin exige navegadores Chromium; os comandos headless continuam usando Chrome com a integração completa. Veja a [compatibilidade oficial do plugin](https://github.com/cypress-io/cypress/tree/develop/npm/puppeteer#compatibility).
- **DemoQA e rede:** indisponibilidade, falhas de autenticação e catálogo insuficiente reprovam os testes. Um login longo já retornou 500 na geração do token após cadastro 201; o teste usa um login curto e único. O limite exato do site não foi confirmado. As contas fictícias permanecem no DemoQA, pois removê-las não faz parte do fluxo solicitado.

## Observações necessárias para reprodução

Browser Windows usa a janela criada pelo clique, lê a mensagem e a fecha via Puppeteer. Sortable usa o mouse nativo e ajusta as coordenadas à escala do iframe do Cypress, verificando `dragstart`/`drop` com `isTrusted`. Não há stub de janela, ordenação artificial do DOM, exceções ignoradas, `only`, `skip`, retries de teste, esperas fixas com `cy.wait` ou cliques forçados.

Os dados são fictícios e os e-mails usam UUID. Credenciais da API são geradas por execução; chamadas sensíveis usam `log: false`, e o token não é impresso nem salvo. Não inclua credenciais, tokens ou dados pessoais em código, fixtures ou argumentos. `.env` não é carregado automaticamente. Dependências, navegadores, caches, evidências, configurações do IntelliJ, `.env*` e `cypress.env.json` ficam fora do Git.

As URLs podem ser informadas com `--config baseUrl=https://demoqa.com` e `--expose apiUrl=https://demoqa.com`. Os contratos e seletores continuam específicos do DemoQA.

Se o terminal usar um npm global antigo, use o que acompanha o Node:

```powershell
$taskNpm = Join-Path (Split-Path (Get-Command node).Source) 'node_modules/npm/bin/npm-cli.js'
node $taskNpm --version
node $taskNpm ci
node $taskNpm run test:challenge
```

Em redes corporativas, se aparecer `UNABLE_TO_VERIFY_LEAF_SIGNATURE` e a autoridade certificadora já for confiável no sistema, defina `$env:NODE_USE_SYSTEM_CA = '1'` antes dos comandos. Não desabilite a validação TLS.

Referências de configuração: [navegadores Cypress](https://docs.cypress.io/app/references/launching-browsers), [instalador Chrome for Testing](https://pptr.dev/browsers-api), [Cucumber com Esbuild](https://github.com/badeball/cypress-cucumber-preprocessor/blob/master/examples/esbuild-cjs/cypress.config.js) e [composição de eventos](https://github.com/badeball/cypress-cucumber-preprocessor/blob/master/docs/event-handlers.md).
