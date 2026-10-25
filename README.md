# Desafio QA Accenture

Projeto independente de automação de API e Frontend em JavaScript com Cypress.
Etapa 1: estrutura e validação do ambiente com uma aplicação local de demonstração.
Etapa 2: fluxo completo da API Book Store do DemoQA, explicado abaixo.
Etapa 3: Practice Form e Web Tables no Frontend real do DemoQA.
Etapa 4.1: Progress Bar com dois cenários independentes.

## Diretriz permanente de arquitetura

Os novos cenários devem priorizar blocos `it()` pequenos e independentes, com
títulos descritivos e IDs como `[TC-001]`. Usar `beforeEach()` e helpers para
pré-condições quando apropriado; cada teste deve poder executar individualmente,
sempre que possível, sem depender do estado deixado por outro teste.

Page Objects concentram seletores e interações; as specs mantêm as asserções
principais. Ações da mesma validação e fluxos integrados exigidos pelo desafio
devem permanecer juntos, sem fragmentação artificial.

O padrão completo está em [AGENTS.md](AGENTS.md). Os testes aprovados serão
preservados até concluir Browser Windows, Progress Bar e Sortable. Na revisão
final, a divisão de Book Store e Web Tables será avaliada com preservação da
cobertura, execução individual dos cenários afetados e regressão completa.

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
| `npm run test:frontend:demoqa` | Somente os dois cenários da Etapa 3 |
| `npm run test:progress-bar` | Somente os dois cenários da Progress Bar |
| `npm run cy:open` | Interface interativa do Cypress |
| `npm run cy:verify` | Verificação do binário do Cypress |
| `npm run cy:info` | Diagnóstico do ambiente e navegadores |

O servidor de demonstração inicia automaticamente na interface de loopback,
em uma porta livre. Em modo de execução, ele é encerrado após os testes. No modo
interativo, é encerrado junto com o processo de configuração do Cypress.
Não é preciso iniciar outro terminal ou definir uma porta fixa.
Esse servidor é usado pelos smoke tests locais. Os cenários das Etapas 2 e 3
acessam o DemoQA real, que precisa estar disponível durante a execução.

## Estrutura

```text
desafio-qa-accenture/
├── cypress/
│   ├── e2e/
│   │   ├── api/
│   │   │   ├── bookstore.cy.js
│   │   │   └── smoke.cy.js
│   │   └── frontend/
│   │       ├── practice-form.cy.js
│   │       ├── progress-bar.cy.js
│   │       ├── smoke.cy.js
│   │       └── web-tables.cy.js
│   ├── fixtures/
│   │   ├── demoqa-options.json
│   │   ├── smoke.json
│   │   └── uploads/arquivo-teste.txt
│   ├── pages/
│   │   ├── DemoQaPage.js
│   │   ├── PracticeFormPage.js
│   │   ├── ProgressBarPage.js
│   │   ├── SmokePage.js
│   │   └── WebTablesPage.js
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
continua usando a URL absoluta do servidor local; `baseUrl` agora aponta para
`https://demoqa.com`, usado pelos dois cenários reais de Frontend.

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
deste fluxo. A Etapa 2 não adicionou cenários de Frontend ou bônus de Cucumber.

### Validação executada

- `npm run test:bookstore`: 1 teste aprovado, com as seis etapas completas.
- `npm test`: 6 testes aprovados em 3 specs, sem falhas, pendências ou ignorados.
  Inclui outra execução do fluxo real com novo usuário e os cinco smoke tests
  já existentes. Ambos os comandos terminaram com código de saída zero em
  Chrome 156 headless, Cypress 16.2.0 e Node.js 24.22.1.

## Etapa 3 — Practice Form e Web Tables

Execute apenas os dois novos cenários com:

```sh
npm run test:frontend:demoqa
```

`npm run test:frontend` também executa os dois smoke tests locais de Frontend.
`npm test` inclui todos os cenários, inclusive o fluxo real de API da Etapa 2.

### Practice Form

O teste começa na página inicial e navega por Forms → Practice Form. Preenche
nome, sobrenome, e-mail único, gênero, celular válido com dez dígitos, nascimento,
dois assuntos, os três hobbies, endereço, estado e cidade compatível. A data
é selecionada pelo calendário; os componentes de assunto, estado e cidade
são preenchidos pelas opções visíveis da interface.

O TXT existente em `cypress/fixtures/uploads/arquivo-teste.txt` é selecionado
com `selectFile()`. O teste confere o arquivo selecionado, submete o formulário,
valida a visibilidade do modal e compara as dez linhas da confirmação com o
objeto usado no preenchimento. Depois fecha o modal com Escape e verifica
que ele deixou de existir e que o formulário permanece visível.

O campo tem o rótulo Picture, mas atualmente aceita o TXT solicitado. A verificação
cobre sua seleção e o nome exibido na confirmação; persistência em um servidor
não faz parte deste cenário.

### Web Tables

O teste começa na página inicial e navega por Elements → Web Tables. Cria um
registro com e-mail único e valida as seis células de dados na tabela. Em seguida,
edita todos os campos, verifica os novos valores e a ausência do e-mail anterior,
exclui somente o registro criado e confirma que ele não existe mais.

As ações Edit e Delete são localizadas dentro da linha do e-mail do teste,
sem depender do número do registro ou da posição da linha. A ausência é validada
na tabela sem filtro de busca, para evitar uma conclusão baseada em um filtro
que apenas esconde o registro.

### Organização e dados

- `DemoQaPage`: navegação a partir da página inicial, compartilhada pelos cenários.
- `PracticeFormPage` e `WebTablesPage`: seletores e ações de cada página, seguindo
  o padrão do Page Object existente. As asserções ficam nos arquivos de teste.
- `demoqa-options.json`: opções válidas dos componentes e dados fictícios para
  sorteio. E-mails usam UUID; nomes, data, gênero, celular, assuntos, localização,
  idade e salário são gerados ou selecionados a cada execução. Os dias variam
  de 1 a 28 para manter a data válida em todos os meses.
- Não foram adicionadas dependências. Não há esperas fixas, cliques forçados,
  remoção de elementos da página ou handlers para ignorar exceções da aplicação.
- Screenshots após as verificações ficam em `cypress/screenshots/`: confirmação
  do formulário, registro editado e tabela após a exclusão. São evidências locais
  ignoradas pelo Git.

### Dificuldade encontrada no site

O botão Close da confirmação do Practice Form lança `findDOMNode is not a function`
no código atual do DemoQA. A primeira execução falhou nesse ponto, depois de
validar todos os dados do modal. O modal também oferece fechamento por Escape,
que aciona seu handler nativo de fechamento; esse é o caminho usado no teste.
A ausência do modal continua sendo uma asserção obrigatória. O defeito do botão
permanece no site e não é tratado como corrigido pela automação.

Nenhum cenário adicional de Frontend ou Cucumber foi implementado nesta etapa.

### Validação da Etapa 3

- `npm run test:frontend:demoqa`: os dois novos cenários aprovados no Chrome.
- `npm test`: 8 testes aprovados em 5 specs, incluindo a API Book Store e os
  smoke tests existentes; zero falhas, pendências ou ignorados; código de saída 0.
- As verificações incluem as dez linhas da confirmação, a ausência do modal
  após Escape, os seis campos da tabela antes e depois da edição e a ausência
  do registro excluído. O fechamento do botão Close permanece um defeito conhecido.

## Etapa 4.1 — Progress Bar

```sh
npm run test:progress-bar
```

| ID | Cenário | Verificações |
| --- | --- | --- |
| TC-PB-001 | Interromper antes de 25% | Avança até 20%, clica Stop, confere valor maior que zero e menor que 25%, avança mais vinte intervalos e confirma que permaneceu parado |
| TC-PB-002 | Retomar, concluir e resetar | Prepara sua própria pausa em 20%, comprova a parada, retoma até 100%, aciona Reset e verifica 0%, Start disponível, Reset ausente e manutenção do zero |

Cada `it()` usa `beforeEach()` para acessar a página inicial e navegar por
Widgets → Progress Bar. A página começa em 0% para cada cenário. O helper local
`startAndPause()` prepara a pausa separadamente em cada teste; nenhum estado
é compartilhado entre os dois. `ProgressBarPage` centraliza seletores e ações;
as asserções ficam na spec. `DemoQaPage` ganhou somente a navegação necessária.

### Compatibilidade com o relógio e funcionamento real

O código público do DemoQA consultado usa `setInterval` com 100 ms e incrementa
o estado do componente em um ponto percentual a cada callback. O teste instala
`cy.clock()` depois da navegação e controla somente `setInterval` e `clearInterval`.
Date, timeouts e os demais mecanismos continuam com o comportamento normal.

O helper `advanceProgress()` usa `cy.tick(100)` e aguarda a atualização de
`aria-valuenow` a cada ponto. Essa sincronização permite que o React renderize
o estado antes do próximo callback, evitando concentrar vários incrementos
em um único avanço de relógio. O teste não escreve o valor da barra no DOM ou
no estado React: as alterações são produzidas pelos callbacks reais da aplicação.

Após alcançar 100%, um callback adicional de 100 ms permite a limpeza do intervalo
que o componente realiza quando seu contador interno ultrapassa 100, mantendo
100% visíveis. O teste então aciona Reset e confirma que o zero permanece após
mais vinte intervalos. Os avanços de tempo representam o timer observado e a
janela de verificação da parada; não são esperas fixas reais com `cy.wait()`.

O relógio é restaurado pelo Cypress entre os testes. Não houve alteração global
de configuração, dependências novas, mocks, cliques forçados ou exceções ignoradas.
Se a aplicação mudar o timer, a implementação deve ser reavaliada. A cobertura
verifica as transições de estado e o valor exibido; duração real e fluidez da
animação não são objetivos destes testes com relógio controlado.

Os comandos `npm run test:frontend` e `npm test` incluem os dois cenários novos.
`test:frontend:demoqa` continua selecionando especificamente os dois cenários
da Etapa 3. Browser Windows, Sortable e Cucumber seguem fora desta implementação.

### Validação da Etapa 4.1

- TC-PB-001 isolado: 1 teste aprovado no Chrome.
- TC-PB-002 isolado: 1 teste aprovado no Chrome, com sua própria pré-condição.
- Dois cenários juntos: 2 aprovados; repetição consecutiva: 2 aprovados novamente.
- `npm test`: 10 testes aprovados em 6 specs, incluindo os oito anteriores;
  zero falhas, pendências ou ignorados; código de saída 0.

A seleção individual usou `it.only()` temporário, com restauração da spec e
conferência de hash após cada execução. A versão final contém os dois `it()`
normais e nenhuma seleção ou exclusão. Configuração, dependências e os testes
aprovados das etapas anteriores foram preservados.

Não salve credenciais no código, em fixtures ou em argumentos de linha de comando.
Forneça segredos por variáveis de ambiente na execução. `.env` não é carregado
automaticamente. `cypress.env.json`, `.env*`, dependências, screenshots, vídeos
e relatórios gerados estão no `.gitignore`.

## Referências

## Sortable — TC-SO-001

Execute `npm run test:sortable`. O teste navega até Interactions → Sortable,
usa a lista, troca One e Two por drag and drop nativo, valida a ordem alterada
e restaura One, Two, Three, Four, Five, Six com novo arraste. Eventos dragstart
e drop precisam ser isTrusted; uma lista que não mudar reprova o teste.

A integração oficial @cypress/puppeteer usa puppeteer-core 25.16.0 fixado também
por override, evitando dependências antigas vulneráveis do plugin. A ponte Node
normaliza coordenadas pela escala do iframe Cypress e não altera a lista no DOM.
O modo validado é Chrome headless. Chrome padrão >=137 em modo interativo é
uma limitação do plugin; para headed, usar uma variante compatível indicada na
documentação oficial, como Chrome for Testing, Chromium ou Electron.

## Referências técnicas

## Browser Windows — TC-BW-001

Execute `npm run test:browser-windows`. A navegação passa por Alerts, Frame &
Windows → Browser Windows e aciona New Window. A ponte oficial acessa a página
criada pelo clique e retorna sua mensagem, URL e identidade ao teste Cypress.
A spec exige IDs de página e janela novos, uma página adicional, mensagem exata
This is a sample page, fechamento confirmado e retorno à quantidade inicial de
páginas, com a janela original preservada. Não há stub de window.open.
O helper fecha a janela também se a leitura falhar, preservando erros de leitura
e limpeza. A execução validada usa Chrome headless; vale a limitação de headed
do plugin descrita em Sortable.

## Referências da implementação

- [Instalação do Cypress](https://docs.cypress.io/app/get-started/install-cypress)
- [Upload com selectFile](https://docs.cypress.io/api/commands/selectfile)
