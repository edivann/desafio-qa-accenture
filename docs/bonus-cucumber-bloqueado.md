# Bônus Cucumber — não concluído

Investigação em 25/10/2026, após a regressão obrigatória aprovada.

Foi testada uma configuração separada com Cucumber 28.0.1, preprocessor esbuild 2.2.8 e esbuild 0.28.2. A feature TC-BDD-001 reutilizou Page Objects e geradores para cadastrar 12 registros únicos, comparar os seis campos de cada um, excluir todos e verificar ausência.

## Resultado observado

1. Abrir Home → Elements → Web Tables e selecionar 20 linhas por página.
2. Capturar a quantidade inicial: 3 registros.
3. Cadastrar 12 registros distintos pela interface, com e-mails UUID.
4. Comparar os seis campos dos 12 registros e confirmar 15 linhas: passou.
5. Clicar Delete no primeiro registro criado: os 12 registros adicionados desaparecem, restando os 3 iniciais.
6. Tentar excluir o segundo registro: Cypress falha porque a linha não existe. As outras exclusões e a verificação final não foram aprovadas.

O bundle público consultado em [index-D_rDx8ml.js](https://demoqa.com/assets/index-D_rDx8ml.js) define o callback de exclusão a partir do estado da tabela e memoriza as colunas com dependências vazias. A leitura indica captura da lista inicial pelo callback do botão. O comportamento observado é compatível com essa referência antiga: excluir um registro adicionado restaura a lista inicial. O nome do bundle pode mudar quando o site for publicado novamente.

## Falha do teste corrigida na investigação

A primeira tentativa também encontrou uma falha da automação: o alias da quantidade inicial era uma consulta reexecutável. Após os cadastros, retornava 15 em vez de 3. A captura foi alterada para `type: 'static'`. A execução seguinte passou pela inclusão e todas as comparações, e revelou o defeito de exclusão descrito acima. As duas falhas foram registradas separadamente.

## Decisão de entrega

Não aceitar desaparecimento coletivo como sucesso de 12 exclusões individuais, nem modificar estado React, DOM ou callbacks do site para obter aprovação. O bônus fica **não concluído**, sem contar como cobertura aprovada.

Conforme a orientação de preservar a versão estável, configuração experimental, feature, steps e dependências exclusivas Cucumber não integram o código final. A tentativa e as evidências ficam no material de diagnóstico da entrega. A suíte principal continua com 9 casos obrigatórios e 5 Smoke.

Retomar exige corrigir/reavaliar o site e executar o bônus inteiro, sua repetição e a regressão principal. Não há `test:bonus` no projeto estável; nenhum caso foi marcado como ignorado para ocultar a falha.
