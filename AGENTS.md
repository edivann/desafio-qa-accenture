# Diretrizes permanentes — desafio-qa-accenture

## Escopo

- Trabalhar exclusivamente neste projeto. Não acessar, modificar ou reutilizar
  arquivos do projeto LiveOnce.
- Preservar o histórico Git e as implementações aprovadas.
- Não publicar no GitHub sem autorização explícita do usuário.

## Organização dos testes Cypress

Este padrão se aplica a todos os novos cenários:

1. Cada `it()` deve representar um cenário verificável, com responsabilidade
   pequena, clara e específica. Priorizar múltiplos blocos `it()` quando houver
   comportamentos ou validações independentes.
2. Usar títulos descritivos com identificação estável, como
   `[TC-001] cria um registro e confirma os dados na tabela`. Consultar os cenários
   existentes antes de atribuir IDs, evitando identificadores duplicados.
3. Usar `beforeEach()` e helpers para pré-condições quando apropriado. A preparação
   deve permitir executar o cenário sem depender de um teste anterior.
4. Garantir execução individual sempre que possível. Se um fluxo precisar ser
   integrado, explicar a razão e manter suas etapas dentro do mesmo cenário.
5. Não criar dependências frágeis entre testes: um `it()` não pode exigir ID,
   token, registro ou estado deixado por outro `it()`.
6. Manter os Page Objects responsáveis pelos seletores e pelas interações.
7. Manter as asserções principais e o fluxo de validação nas specs.
8. Não fragmentar artificialmente ações que pertencem à mesma validação. Quantidade
   de blocos `it()` não é uma medida de cobertura de requisitos.
9. Preservar fluxos integrados exigidos pelo desafio, incluindo o fluxo completo
   e sequencial da API Book Store. Não dividir suas seis etapas em testes que
   dependam da ordem de execução.
10. Priorizar legibilidade, simplicidade e manutenção. Criar helpers e comandos
    somente quando tiverem responsabilidade útil; evitar abstrações desnecessárias.

## Aplicação ao código existente

- Não refatorar os testes já aprovados antes de concluir os requisitos restantes
  do desafio: Browser Windows, Progress Bar e Sortable.
- Na revisão final, avaliar a divisão dos cenários existentes, principalmente
  Book Store e Web Tables. A decisão deve considerar independência das validações
  e os fluxos integrados exigidos, sem divisão automática por quantidade de ações.
- Não alterar testes aprovados apenas para acrescentar IDs nesta etapa. Aplicar
  o padrão aos novos cenários e alinhar os existentes durante a revisão final.

## Critérios para qualquer refatoração posterior

1. Registrar quais validações serão preservadas e justificar a divisão proposta.
2. Preservar toda a cobertura existente, incluindo resultados intermediários,
   dados retornados e verificações finais relevantes.
3. Preparar as pré-condições de cada teste de forma independente.
4. Executar cada cenário afetado individualmente, além da execução conjunta.
   Usar o Runner do Cypress ou a seleção suportada pelo projeto; não versionar
   `it.only`, `describe.only` ou exclusões para obter aprovação.
5. Executar a regressão completa com `npm test`, incluindo API e Frontend.
6. Informar comandos, resultados e limitações reais. Não considerar um cenário
   aprovado sem executar suas verificações com sucesso.
7. Versionar a refatoração somente após a validação, preservando o histórico Git.
