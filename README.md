# Desafio QA Accenture

Automação independente de API e Frontend do [DemoQA](https://demoqa.com/), em JavaScript, Cypress e Page Object Model. São **9 testes obrigatórios em 6 funcionalidades**, além de **5 Smoke locais**. O bônus tem **dois cenários Cucumber independentes**: cadastro de 12 registros validado e exclusão individual bloqueada por defeito do DemoQA, identificada com `@known-bug`. Os cenários BDD não são incluídos no comando padrão. Veja [o diagnóstico](docs/bonus-cucumber-bloqueado.md).

## Instalação

Requisitos: Node.js 24.x (referência 24.22.1 em `.nvmrc`), npm >=10, Git e Google Chrome instalado. Internet é necessária para instalar pacotes/binário do Cypress e executar os testes do DemoQA. Ambiente validado: Windows, Chrome 156 headless e Cypress 16.2.0.

Abra **esta pasta** no IntelliJ IDEA, abra seu terminal e execute:

```sh
npm ci
npm run cy:verify
npm run test:challenge
```

O lockfile fixa a instalação. Se o binário não tiver sido baixado, execute `npx cypress install`. No PowerShell, se `npm.ps1` for bloqueado, use `npm.cmd`, sem alterar a política da máquina.

Se o terminal resolver um npm global antigo, use o que acompanha o Node:

```powershell
$taskNpm = Join-Path (Split-Path (Get-Command node).Source) 'node_modules/npm/bin/npm-cli.js'
node $taskNpm --version
node $taskNpm ci
node $taskNpm run test:challenge
```

Em redes com certificados corporativos confiáveis no Windows, um erro `UNABLE_TO_VERIFY_LEAF_SIGNATURE` pode ser resolvido com `$env:NODE_USE_SYSTEM_CA = '1'` antes dos comandos. Isso mantém a validação TLS. Não é preciso mudar o npm global ou desabilitar certificados.

## Comandos

Os comandos de teste usam Chrome headless.

| Comando | Escopo | Casos |
| --- | --- | ---: |
| `npm run test:challenge` | Somente os seis módulos Accenture | 9 |
| `npm run test:smoke` | API e Frontend da aplicação local | 5 |
| `npm test` | Desafio e Smoke | 14 |
| `npm run test:bookstore` | Fluxo integrado Book Store | 1 |
| `npm run test:frontend:demoqa` | Practice Form e Web Tables | 4 |
| `npm run test:progress-bar` | Progress Bar | 2 |
| `npm run test:sortable` | Sortable | 1 |
| `npm run test:browser-windows` | Janela real | 1 |
| `npm run test:bonus:validos` | Somente BDD sem `@known-bug`: cadastro dinâmico | 1 |
| `npm run test:bonus:known-bug` | Reproduz a exclusão individual; falha pelo defeito do DemoQA | 1 bloqueado |
| `npm run test:bonus` | Todos os BDD; inclui a falha conhecida de exclusão | 2 (1 bloqueado) |
| `npm run test:api` | Book Store e Smoke API | 4 |
| `npm run test:frontend` | Frontend do desafio e Smoke UI | 10 |
| `npm run cy:open` | Runner interativo; ver restrição abaixo | — |
| `npm run cy:verify` / `npm run cy:info` | Diagnóstico do ambiente | — |

Uma spec ou caso individual pode ser selecionado pelo filtro oficial `@cypress/grep`:

```sh
npm test -- --spec cypress/e2e/frontend/practice-form.cy.js
npm test -- --spec cypress/e2e/frontend/web-tables.cy.js --expose grep=TC-WT-002,grepOmitFiltered=true
npm test -- --spec cypress/e2e/frontend/progress-bar.cy.js --expose grep=TC-PB-001,grepOmitFiltered=true
```

Não há `only`, `skip`, retries de teste, pausas fixas com `cy.wait`, cliques forçados ou exceções ignoradas. Os comandos BDD de válidos/known-bug usam filtros de tags explícitos; `test:bonus` executa ambos sem filtro.

O servidor Smoke inicia automaticamente em `127.0.0.1`, numa porta livre, e encerra após a execução. `test:smoke` usa também a URL local na verificação inicial do Cypress, sem depender da disponibilidade do DemoQA. Na suíte completa, os Smoke continuam usando URLs locais absolutas.

URLs opcionais: `--config baseUrl=https://demoqa.com` para o Frontend e `--expose apiUrl=https://demoqa.com` para API. Contratos e seletores permanecem específicos do DemoQA; trocar a URL não torna a suíte genérica.

## Matriz de cobertura

| ID | Funcionalidade | Ações e resultados verificados |
| --- | --- | --- |
| TC-API-001 | Book Store | Usuário único, token válido, autorização, catálogo, associação de dois ISBNs distintos e consulta da coleção do mesmo usuário |
| TC-PF-001 | Practice Form | Navegação desde Home, dados válidos e dinâmicos, calendário, assuntos, hobbies, estado/cidade, TXT; comparação de dez valores do modal; fechamento por Escape e ausência |
| TC-WT-001 | Cadastro | Criação de registro próprio e comparação das seis células |
| TC-WT-002 | Edição | Cadastro como pré-condição, alteração dos seis campos, valores novos e ausência do e-mail anterior |
| TC-WT-003 | Exclusão | Cadastro e edição próprios com validações intermediárias; exclusão e ausência sem filtro de busca |
| TC-PB-001 | Interromper progresso | Início, pausa em 20%, valor positivo abaixo de 25% e estabilidade após mais intervalos |
| TC-PB-002 | Retomar e resetar | Pausa própria, retomada a 100%, Reset, 0%, Start disponível, Reset ausente e manutenção do zero |
| TC-SO-001 | Sortable | Arraste de One após Two, mudança real, novo arraste e ordem One a Six; eventos nativos confiáveis |
| TC-BW-001 | Browser Windows | New Window real, IDs distintos de página/janela, leitura da mensagem, fechamento e preservação da original |
| TC-BDD-001 | Bônus Cucumber — cadastro validado | Cria 12 registros exclusivos, compara os seis campos individualmente, confirma visibilidade de todos e total de linhas |
| TC-BDD-002 | Bônus Cucumber — exclusão bloqueada, `@known-bug` | Prepara seus próprios 12 registros; exige que cada Delete remova só uma linha e preserve os demais; falha na exclusão indevida do site |
| INF-API-001 a 003 | Smoke API local | Saúde JSON, criação fictícia e rota inexistente 404 |
| INF-UI-001 a 002 | Smoke UI local | Página, comunicação com API, seleção e leitura do TXT |

Os cinco casos INF validam infraestrutura; não contam como requisitos Accenture. Há um bônus aprovado (TC-BDD-001) e um bloqueado (TC-BDD-002). A exclusão bloqueada não entra na contagem de aprovados. A suíte padrão continua com 14 casos; o perfil BDD não bloqueado adiciona um caso aprovado, executado separadamente.

### Bônus Cucumber

```sh
npm run test:bonus:validos
npm run test:bonus:known-bug
```

Os comandos selecionam a mesma feature em português. `test:bonus:validos` usa a expressão `not @known-bug`; `test:bonus:known-bug` usa `@known-bug`. No Cypress 16, essas opções passam por `--expose`, com `omitFiltered=true` para não apresentar o caso fora do perfil como pendente ou aprovado. `npm run test:bonus` não filtra tags: executa os dois e termina com falha enquanto o defeito persistir. A tag não transforma uma falha em sucesso nem ignora as asserções.

Cada cenário navega novamente à Web Tables e gera seus próprios 12 registros. Ambos reutilizam exatamente os mesmos steps de navegação, cadastro e comparação. TC-BDD-001 termina após validar cadastro; TC-BDD-002 prepara o cadastro novamente e tenta as exclusões. Aliases estáticos pertencem à execução atual, com isolamento habilitado. Nenhum cenário depende do outro.

`cypress.bdd.config.js` reutiliza o `setupNodeEvents` base, incluindo Puppeteer, URLs e servidor Smoke. `cypress-on-fix` compõe os handlers para que o encerramento do servidor e os relatórios Cucumber não sobrescrevam um ao outro. As specs `.cy.js` e seus scripts permanecem disponíveis.

Para executar a suíte tradicional sob os plugins BDD, sem selecionar o bônus:

```sh
npm test -- --config-file cypress.bdd.config.js --spec "cypress/e2e/**/*.cy.js"
```

Versões fixadas: `@badeball/cypress-cucumber-preprocessor` 28.0.1, `@bahmutov/cypress-esbuild-preprocessor` 2.2.8, `esbuild` 0.28.2 e `cypress-on-fix` 1.1.0. O preprocessor declara suporte ao Cypress 16 e ao Node 24 usado neste projeto. A configuração segue os [exemplos oficiais](https://github.com/badeball/cypress-cucumber-preprocessor/blob/master/examples/esbuild-cjs/cypress.config.js) e a [orientação de composição de eventos](https://github.com/badeball/cypress-cucumber-preprocessor/blob/master/docs/event-handlers.md).

Cada cenário mantém o mesmo documento durante seu próprio ciclo, seleciona 50 linhas e confirma página única/busca vazia. Gera e salva os 12 registros em `cypress/reports/bonus/<ID>/registros.json`, compara os seis campos de cada um e captura tabela/contagem após cadastro. TC-BDD-002 também captura o estado após cada Delete e exige que os registros restantes continuem presentes antes de preparar a próxima exclusão. Não recarrega a página nem altera React/DOM para contornar o defeito.

Snapshots JSON ficam em pastas por ID dentro de `cypress/reports/bonus/`, relatório Gherkin em `cypress/reports/bonus-cucumber.json` e screenshots identificados por cenário em `cypress/screenshots/`. São evidências locais ignoradas pelo Git. Uma falha na primeira exclusão interrompe TC-BDD-002: as outras 11 exclusões e a ausência final não foram concluídas. O cadastro aprovado não significa aprovação da exclusão. O commit do bônus registra explicitamente essa cobertura parcial e preserva `503a576` no histórico.

## Arquitetura e decisões

```text
cypress/
  e2e/api/          bookstore.cy.js, smoke.cy.js
  e2e/bdd/          web-tables.feature, web-tables.js (Step Definitions)
  e2e/frontend/    practice-form, web-tables, progress-bar,
                   sortable, browser-windows, smoke (.cy.js)
  pages/           DemoQaPage, PracticeFormPage, WebTablesPage,
                   ProgressBarPage, SortablePage, BrowserWindowsPage, SmokePage
  fixtures/        demoqa-options.json, smoke.json, uploads/arquivo-teste.txt
  support/         e2e.js, commands.js, utils/test-data.js
scripts/
  browser-actions.cjs     Ponte com o navegador para arraste e janela
  smoke-server.js         Servidor local em porta livre
  smoke-app/index.html    Aplicação mínima de diagnóstico
docs/bonus-cucumber-bloqueado.md
cypress.config.js
cypress.bdd.config.js / .cypress-cucumber-preprocessorrc.json
package.json / package-lock.json
AGENTS.md
```

As [diretrizes permanentes](AGENTS.md) exigem cenários pequenos e independentes. Page Objects concentram seletores/interações; specs contêm cenários e asserções. `beforeEach` prepara a navegação quando há múltiplos casos. `testIsolation: true` e dados próprios evitam dependência entre testes. Não há herança de páginas ou camadas sem responsabilidade útil.

Web Tables foi separado em cadastro, edição e exclusão. Cada caso prepara seus dados; a exclusão também cadastra e edita, preservando as validações do CRUD. As linhas são identificadas pelo e-mail único, sem posição ou ID numérico. `test-data.js` compartilha somente geradores utilizados.

Book Store permanece integrado porque suas seis chamadas compõem o fluxo sequencial exigido. Separá-las em testes dependentes seria frágil; duplicar todo o preparo sem novas validações acrescentaria complexidade. ID, token e ISBNs são locais ao mesmo `it`, compartilhados por retornos encadeados de `.then()`. Uma falha interrompe o fluxo.

## Book Store: contrato e dados

Referência: [Swagger DemoQA](https://demoqa.com/swagger/). `cy.apiRequest()` resolve a URL e delega para `cy.request()`.

| Etapa | Método e endpoint | HTTP |
| --- | --- | ---: |
| Criar usuário | POST `/Account/v1/User` | 201 |
| Gerar token | POST `/Account/v1/GenerateToken` | 200 |
| Autorizar | POST `/Account/v1/Authorized` | 200 |
| Consultar catálogo | GET `/BookStore/v1/Books` | 200 |
| Associar livros | POST `/BookStore/v1/Books` | 201 |
| Consultar coleção | GET `/Account/v1/User/{userId}` | 200 |

Além do HTTP e JSON, valida identidade, coleção inicial vazia, token não vazio com expiração futura, `status: Success`, autorização `true`, catálogo suficiente e exatamente os dois ISBNs associados. `Set` seleciona ISBNs distintos. A resposta real usa `userID` na criação e `userId` na consulta; essa diferença é explícita.

Login curto combina timestamp e parte de UUID; a senha usa outro UUID com prefixo que satisfaz a política. Não há conta pessoal ou ISBN fixo. Requisições sensíveis usam `log: false`, e o token não é impresso nas asserções nem persistido. HTTP inesperado ou erro no corpo reprova o teste com indicação da etapa. `failOnStatusCode: false` permite diagnosticar a resposta, sem aprová-la automaticamente. Retries de requisição estão desabilitados nesse fluxo.

## Interações reais e limites

- **Practice Form:** Picture aceita o TXT solicitado; valida seleção e nome na confirmação, sem comprovar persistência em backend. O botão Close apresentou historicamente `findDOMNode is not a function`. O caminho validado é Escape, com asserção de fechamento. O botão não foi retestado nesta conclusão nem é tratado como corrigido.
- **Progress Bar:** o componente consultado usa `setInterval(100)`. O relógio controla somente `setInterval`/`clearInterval` após a navegação. Cada `cy.tick(100)` executa o callback real e aguarda `aria-valuenow`. Após 100%, um callback adicional permite a limpeza do intervalo. Não se escreve no estado/DOM. Cobre transições, sem medir duração real ou fluidez. Mudança do timer exige reavaliação.
- **Sortable:** o worker usa o mouse nativo do Chrome e normaliza coordenadas pela escala do iframe Cypress. Observa `dragstart`/`drop` com `isTrusted`, sem ordenar o DOM por JavaScript. Mudança e restauração da ordem são asserções da spec.
- **Browser Windows:** acessa a página criada pelo clique, consulta identidades via CDP, lê `This is a sample page` e fecha a janela. Compara a quantidade de páginas antes/durante/depois e preserva a original. Não há stub de `window.open`. Erros de leitura e limpeza são propagados.
- **Plugin:** a integração oficial `@cypress/puppeteer` 0.1.10 é experimental. Chrome padrão >=137 em modo headed tem restrição no plugin. O modo aprovado é Chrome headless. Para interatividade, consulte variantes compatíveis na documentação (Electron, Chromium ou Chrome for Testing); não foram validadas nesta entrega.
- **Dependências:** `puppeteer-core` 25.16.0 está fixado e aplicado por override também ao plugin, retirando sua árvore antiga vulnerável. Não baixa outro navegador. Essa combinação foi validada neste ambiente; atualizações exigem regressão.
- **Serviço externo:** rede, disponibilidade do DemoQA, autenticação e catálogo insuficiente podem reprovar execuções. Um login de 49 caracteres já retornou 500 no token após cadastro 201; o login curto funcionou. Limite exato e causa interna não foram confirmados. Cada execução mantém sua conta fictícia, pois exclusão de conta não faz parte do fluxo solicitado.

## Validação e entrega

A validação anterior inclui instalação limpa, auditoria e seis specs isoladas. Após a divisão BDD, foram executados os dois cenários isoladamente, a execução conjunta dos dois, os nove obrigatórios e a regressão padrão com 14 casos. O cadastro BDD aprovado e a exclusão bloqueada são reportados separadamente. Web Tables também foi executado por ID após sua divisão; Progress Bar preserva os casos independentes. Contagens, durações, falhas e evidências constam do relatório de entrega.

Screenshots são produzidos após verificações e em falhas. Ficam em `cypress/screenshots`, ignorados pelo Git e regenerados nas próximas execuções. O repositório exclui dependências, caches, relatórios, vídeos, configurações IntelliJ, `.env*` e `cypress.env.json`. `.env` não é carregado automaticamente. Não salvar credenciais ou tokens em código, fixtures ou argumentos.

Repositório local preparado para revisão. **GitHub não publicado:** criar remoto e executar `git push` dependem de autorização do usuário.

## Referências

- [Instalação do Cypress](https://docs.cypress.io/app/get-started/install-cypress)
- [cy.request](https://docs.cypress.io/api/commands/request)
- [selectFile](https://docs.cypress.io/api/commands/selectfile)
- [clock](https://docs.cypress.io/api/commands/clock)
- [Integração oficial Puppeteer](https://github.com/cypress-io/cypress/tree/develop/npm/puppeteer)
- [Filtro oficial](https://github.com/cypress-io/cypress/tree/develop/npm/grep)
- [Cucumber: instalação e Esbuild](https://github.com/badeball/cypress-cucumber-preprocessor/blob/master/docs/quick-start.md)
