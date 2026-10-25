# Bônus Cucumber — cadastro validado e exclusão bloqueada

O cenário integrado anterior foi dividido em dois cenários independentes, conforme a auditoria e a orientação do usuário. TC-BDD-001 valida o cadastro dinâmico de 12 registros e está aprovado. TC-BDD-002 prepara seus próprios 12 registros e reproduz a exclusão indevida do DemoQA; está marcado com `@known-bug` e não conta como aprovado. A referência 503a576 permanece no histórico.

## Cenários e comandos

| Cenário | Comando | Resultado esperado na versão atual do site |
| --- | --- | --- |
| TC-BDD-001 — cadastro | `npm run test:bonus` | Um cenário aprovado: 12 registros exclusivos, seis campos comparados por registro, todos visíveis e contabilizados |
| TC-BDD-002 — exclusão individual | `npm run test:bonus:known-bug` | Um cenário reprovado na primeira exclusão, com evidências e código de saída 1 |
| Ambos | `npm run test:bonus:all` | Um aprovado e um reprovado; resultado global de falha |

Os perfis usam expressões de tags explícitas (`not @known-bug` / `@known-bug`) e `omitFiltered=true` via `--expose`, conforme a interface do preprocessor instalado para Cypress 16. O cenário fora de um perfil não é contado como aprovado. O comando conjunto mantém ambos ativos e preserva a falha real; não há skip ou captura da exceção para obter sucesso.

Cada cenário executa sua própria navegação, captura da tabela inicial, geração de 12 e-mails únicos e cadastro pela interface. Os mesmos steps são reutilizados, sem duplicar métodos de cadastro. As aliases são estáticas e o isolamento entre testes está habilitado. TC-BDD-001 termina após verificar os cadastros; TC-BDD-002 executa seu preparo sem depender de TC-BDD-001.

JSON e massa ficam em `cypress/reports/bonus/TC-BDD-001/` e `cypress/reports/bonus/TC-BDD-002/`. Screenshots usam o ID do cenário. Essa separação evita que as evidências de um caso sobrescrevam as do outro na execução conjunta.

## Auditoria antes das alterações

Foram revisados package.json/lockfile, cypress.config.js, WebTablesPage, CRUD aprovado, configurações e steps da tentativa anterior, logs, screenshots e resultados por etapa. A versão estável não tinha Cucumber instalado nem feature ativa. A tentativa antiga havia sido retirada e preservada nas evidências.

O alias da quantidade inicial tinha sido corrigido para snapshot estático na tentativa anterior. Não foi a causa da exclusão coletiva. O seletor do CRUD aprovado já limitava Delete à linha do e-mail.

## Reprodução fora do Cypress

Na interface de um navegador, sem Cypress ou Cucumber:

1. Abrir Web Tables e cadastrar dois registros com e-mails diferentes.
2. Conferir cinco linhas, busca vazia e página 1 de 1.
3. Acionar somente Delete do primeiro registro (ação ID 4).
4. Os dois registros adicionados desaparecem; restam os três originais.
5. Buscar o segundo e-mail não retorna registro. Limpar a busca mostra os três originais.

Isso descarta dependência exclusiva de hooks/steps Cucumber e demonstra o defeito pela interface. Os e-mails são dados fictícios criados só para a reprodução.

## Comportamento confirmado e hipótese técnica

Na investigação anterior, a leitura do [bundle público consultado](https://demoqa.com/assets/index-D_rDx8ml.js) mostrou colunas criadas com `useMemo` e dependências vazias e um callback que filtra a lista. Isso sugere que a ação Delete pode manter uma referência à lista inicial. Essa hipótese é compatível com o retorno às três linhas originais, mas não constitui comprovação conclusiva da causa interna no DemoQA. O bundle pode mudar e não há confirmação do mantenedor ou validação de uma correção no produto.

O comportamento confirmado é o desaparecimento dos registros adicionados, inclusive em busca por e-mail, com o mesmo documento e sem filtros/paginação ocultando os dados. Não foi comprovada persistência em servidor nem inspecionado diretamente o estado interno do React.

Se a hipótese se confirmar, uma possível correção pelo mantenedor é usar atualização funcional baseada na lista atual:

```js
setRows(current => current.filter(item => item.id !== selected.id));
```

Esse exemplo é uma recomendação para o mantenedor. O projeto de testes não contém a fonte do DemoQA nem tem acesso para corrigir/publicar o site. A automação não aplica esse patch, não modifica estado React e não simula exclusões.

## Evidências instrumentadas de TC-BDD-002

- Os 12 registros únicos foram cadastrados e seus seis campos comparados: 15 linhas antes do Delete.
- Primeiro clique: somente um botão, `delete-record-4`, dentro da linha do e-mail esperado.
- Após o clique: três linhas; a asserção exige 14 e falha.
- Mesmo documento, mesma janela, mesmo elemento da tabela e mesmo `performance.timeOrigin` antes/depois.
- Busca vazia, capacidade 50, página 1 de 1 e Next desabilitado.
- Nenhum `visit`/`reload` após a preparação inicial; os steps seguintes reutilizam aliases estáticos.
- O cenário captura JSON e screenshot antes da asserção de sobrevivência e interrompe as outras exclusões se houver perda indevida.

Essas observações descartam recarregamento/nova navegação, paginação, busca e seletor atingindo várias linhas na execução registrada. São compatíveis com a hipótese de referência antiga no callback, sem comprovar todo o ciclo interno de estado do React.

## Integração e preservação

- Cucumber 28.0.1: compatível com Cypress 16.2.0 e Node 24.22.1 conforme engines/peers declarados.
- Esbuild 0.28.2 e preprocessor 2.2.8; configuração conforme documentação oficial.
- cypress-on-fix 1.1.0: composição de eventos recomendada pelo Cucumber para preservar handlers simultâneos.
- Configuração BDD reaproveita setupNodeEvents base, Puppeteer/Browser Windows, URLs e encerramento do Smoke. Não substitui a configuração padrão.
- Feature e Step Definitions exclusivos; Page Object ganha apenas getters, paginação e leitura para diagnóstico. CRUD obrigatório não foi alterado.
- Scripts dos seis módulos preservados. test:bonus executa somente o cadastro não bloqueado; test:bonus:known-bug reproduz a exclusão; test:bonus:all mantém ambos acessíveis. test:all reúne os 14 casos tradicionais e o cadastro BDD, excluindo explicitamente @known-bug. test:bonus:validos permanece por compatibilidade. A configuração BDD aceita também as specs tradicionais.
- A divisão não alterou o Page Object, a configuração dos plugins, as dependências ou o lockfile existentes no início desta etapa. O commit do bônus também incorpora os arquivos da integração anterior, que já estavam presentes e ainda não tinham commit.

Referências: [Esbuild oficial](https://github.com/badeball/cypress-cucumber-preprocessor/blob/master/examples/esbuild-cjs/cypress.config.js), [eventos](https://github.com/badeball/cypress-cucumber-preprocessor/blob/master/docs/event-handlers.md).

## Situação da entrega

Há um cenário de cadastro BDD aprovado e um cenário de exclusão bloqueado. TC-BDD-002 executa um clique e detecta a remoção dos outros 11 registros que deveriam permanecer. A asserção exige 14 linhas no total e encontra três. As outras 11 exclusões individuais e a validação final de ausência não são concluídas. Não há 12 exclusões individuais aprovadas.

O commit específico do bônus registra cadastro validado e exclusão bloqueada, conforme autorização do usuário para essa entrega parcial. A validação inclui execução isolada de cada cenário, execução conjunta, os nove obrigatórios e a regressão padrão com cinco Smoke. O cenário de exclusão deverá ser reexecutado após correção do DemoQA; somente então poderá ser contado como aprovado. Resultados e evidências completos acompanham o relatório da divisão dos cenários.
