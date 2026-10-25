# language: pt
@bonus
Funcionalidade: Gerenciamento dinâmico de registros na Web Tables
  Cenário: TC-BDD-001 - Cadastrar 12 registros com dados exclusivos
    Dado que estou na página Web Tables
    Quando cadastro 12 registros com dados dinâmicos e exclusivos
    Então os 12 registros devem estar cadastrados

  @known-bug
  Cenário: TC-BDD-002 - Excluir individualmente 12 registros preservando os demais
    Dado que estou na página Web Tables
    Quando cadastro 12 registros com dados dinâmicos e exclusivos
    Então os 12 registros devem estar cadastrados
    Quando excluo individualmente os 12 registros cadastrados
    Então nenhum dos 12 registros deve permanecer na tabela
