# Casos de Uso — TaskFlow Mini

## 1. Atores e contexto

### Usuário

Pessoa que organiza suas tarefas por meio de um cliente HTTP,
enviando requisições à API.

Nesta versão não há autenticação, separação por usuário
ou interface gráfica.

### Sistema

A API TaskFlow Mini recebe as requisições, valida os dados,
acessa o SQLite e retorna respostas HTTP.

O banco faz parte da implementação do sistema e não é
considerado um ator externo.

## 2. Convenções

- A API utiliza JSON nas requisições e respostas de dados.
- Erros retornam um objeto com o campo message.
- Respostas HTTP 204 não possuem corpo.
- Os campos da tarefa seguem docs/requisitos.md.
- Nas operações com ID e corpo, a validação do ID ocorre
  antes da validação do corpo e da busca pela tarefa.
- JSON malformado pode ser rejeitado antes dessas etapas.

## UC01 — Cadastrar tarefa

### Ator principal

Usuário.

### Requisitos relacionados

RF01, RF10, RF12, RF14 e RF15.

### Pré-condições

- API em execução.
- Banco inicializado.

### Fluxo principal

1. O usuário envia POST /api/tasks com title, description e priority.
2. O sistema valida o corpo e os campos recebidos.
3. O sistema remove espaços das extremidades do título.
4. O sistema define o status inicial como pendente.
5. O sistema gera o ID e a data de criação em UTC.
6. O sistema persiste a tarefa.
7. O sistema retorna HTTP 201 com os dados da tarefa criada.

### Fluxos alternativos

- A1: Se description for omitida, o sistema armazena null.
- A2: Se priority for omitida, o sistema utiliza media.
- A3: A1 e A2 podem ocorrer no mesmo cadastro.

### Fluxos de exceção

- E1: Título ausente, vazio, composto apenas por espaços,
  nulo ou com tipo inválido: retornar HTTP 400.
- E2: Descrição informada com tipo diferente de string:
  retornar HTTP 400.
- E3: Prioridade inválida: retornar HTTP 400.
- E4: Corpo que não seja objeto ou campos não previstos:
  retornar HTTP 400.
- E5: Falha inesperada de persistência: retornar HTTP 500
  sem expor detalhes internos.

### Pós-condições

- Em caso de sucesso, uma nova tarefa está persistida.
- Em caso de erro de validação, nenhuma tarefa é criada.

## UC02 — Listar e filtrar tarefas

### Ator principal

Usuário.

### Requisitos relacionados

RF02, RF07, RF08, RF09, RF14 e RF15.

### Pré-condições

- API em execução.
- Banco inicializado.

### Fluxo principal

1. O usuário envia GET /api/tasks sem filtros.
2. O sistema consulta as tarefas.
3. O sistema ordena os resultados por ID decrescente.
4. O sistema retorna HTTP 200 com um array de tarefas.

### Fluxos alternativos

- A1: O usuário informa status; o sistema retorna somente
  tarefas com o status informado.
- A2: O usuário informa priority; o sistema retorna somente
  tarefas com a prioridade informada.
- A3: O usuário informa os dois filtros; o sistema retorna
  somente tarefas que atendam simultaneamente aos dois critérios.
- A4: Não existem tarefas correspondentes; o sistema retorna
  HTTP 200 com [].

### Fluxos de exceção

- E1: Filtro com valor vazio ou inválido: retornar HTTP 400.
- E2: Parâmetro repetido ou não previsto: retornar HTTP 400.
- E3: Falha inesperada de persistência: retornar HTTP 500
  sem expor detalhes internos.

### Pós-condições

- As tarefas correspondentes são apresentadas.
- Nenhum dado é alterado.

## UC03 — Consultar tarefa por ID

### Ator principal

Usuário.

### Requisitos relacionados

RF03, RF11, RF14 e RF15.

### Pré-condições

- API em execução.
- Banco inicializado.

### Fluxo principal

1. O usuário envia GET /api/tasks/:id.
2. O sistema valida o ID.
3. O sistema busca a tarefa correspondente.
4. O sistema retorna HTTP 200 com os dados da tarefa.

### Fluxos alternativos

- A1: O ID contém zeros à esquerda, mas representa um inteiro
  positivo válido; o sistema consulta seu valor numérico.

### Fluxos de exceção

- E1: ID inválido segundo RF11: retornar HTTP 400.
- E2: ID válido sem tarefa correspondente: retornar HTTP 404
  com message igual a "Tarefa não encontrada".
- E3: Falha inesperada de persistência: retornar HTTP 500
  sem expor detalhes internos.

### Pós-condições

- Em caso de sucesso, os dados da tarefa são apresentados.
- Nenhum dado é alterado.

## UC04 — Editar tarefa

### Ator principal

Usuário.

### Requisitos relacionados

RF04, RF10, RF11, RF12, RF14 e RF15.

### Pré-condições

- API em execução.
- Banco inicializado.
- Para o fluxo de sucesso, a tarefa deve existir.

### Fluxo principal

1. O usuário envia PUT /api/tasks/:id com title,
   description e priority.
2. O sistema valida o ID.
3. O sistema valida o corpo e os campos recebidos.
4. O sistema verifica se a tarefa existe.
5. O sistema remove espaços das extremidades do título.
6. O sistema substitui os campos editáveis e persiste a alteração.
7. O sistema preserva id, status e created_at.
8. O sistema retorna HTTP 200 com a tarefa atualizada.

### Fluxos alternativos

- A1: Description é omitida; o sistema armazena null,
  removendo a descrição anterior, caso exista.
- A2: O usuário envia os mesmos dados atuais; o sistema
  retorna HTTP 200, mantendo o mesmo estado.

### Fluxos de exceção

- E1: ID inválido: retornar HTTP 400.
- E2: Title ausente ou inválido: retornar HTTP 400.
- E3: Priority ausente ou inválida: retornar HTTP 400.
- E4: Description informada com tipo diferente de string:
  retornar HTTP 400.
- E5: Corpo que não seja objeto ou campos não previstos:
  retornar HTTP 400.
- E6: ID e corpo válidos, mas tarefa inexistente:
  retornar HTTP 404 com "Tarefa não encontrada".
- E7: Falha inesperada de persistência: retornar HTTP 500
  sem expor detalhes internos.

### Pós-condições

- Em caso de sucesso, os campos editáveis são atualizados.
- Em caso de erro de validação, a tarefa permanece inalterada.

## UC05 — Alterar status da tarefa

### Ator principal

Usuário.

### Requisitos relacionados

RF05, RF10, RF11, RF12, RF14 e RF15.

### Pré-condições

- API em execução.
- Banco inicializado.
- Para o fluxo de sucesso, a tarefa deve existir.

### Fluxo principal

1. O usuário envia PATCH /api/tasks/:id/status com o campo status.
2. O sistema valida o ID.
3. O sistema valida o corpo e o valor do status.
4. O sistema verifica se a tarefa existe.
5. O sistema atualiza e persiste o status.
6. O sistema preserva os demais campos.
7. O sistema retorna HTTP 200 com a tarefa atualizada.

### Fluxos alternativos

- A1: O usuário informa em_andamento para iniciar a tarefa.
- A2: O usuário informa concluida para concluir a tarefa.
- A3: O usuário informa pendente para reabrir a tarefa.
- A4: O usuário informa o status atual; o sistema retorna
  HTTP 200 sem alterar o estado.
- A5: Qualquer status permitido pode ser alterado para outro,
  sem restrição de transição nesta versão.

### Fluxos de exceção

- E1: ID inválido: retornar HTTP 400.
- E2: Status ausente, nulo, com tipo inválido ou fora
  dos valores permitidos: retornar HTTP 400.
- E3: Corpo que não seja objeto ou campos adicionais:
  retornar HTTP 400.
- E4: ID e corpo válidos, mas tarefa inexistente:
  retornar HTTP 404 com "Tarefa não encontrada".
- E5: Falha inesperada de persistência: retornar HTTP 500
  sem expor detalhes internos.

### Pós-condições

- Em caso de sucesso, o status solicitado está persistido.
- Em caso de erro de validação, a tarefa permanece inalterada.

## UC06 — Excluir tarefa

### Ator principal

Usuário.

### Requisitos relacionados

RF06, RF11, RF12 e RF14.

### Pré-condições

- API em execução.
- Banco inicializado.
- Para o fluxo de sucesso, a tarefa deve existir.

### Fluxo principal

1. O usuário envia DELETE /api/tasks/:id.
2. O sistema valida o ID.
3. O sistema remove a tarefa correspondente.
4. O sistema retorna HTTP 204 sem corpo.

### Fluxos alternativos

- A1: A tarefa possui status pendente, em_andamento
  ou concluida; a exclusão é permitida em todos os casos.

### Fluxos de exceção

- E1: ID inválido: retornar HTTP 400.
- E2: ID válido sem tarefa correspondente: retornar HTTP 404
  com "Tarefa não encontrada".
- E3: A tarefa já foi excluída em uma requisição anterior:
  retornar HTTP 404.
- E4: Falha inesperada de persistência: retornar HTTP 500
  sem expor detalhes internos.

### Pós-condições

- Em caso de sucesso, a tarefa é removida permanentemente.
- As demais tarefas permanecem inalteradas.
- Não há lixeira nem recuperação nesta versão.

## 3. Exceções comuns

Nas operações que recebem JSON:

- JSON malformado retorna HTTP 400 com mensagem em JSON.

Em toda a API:

- Rotas inexistentes retornam HTTP 404 com mensagem em JSON.
- Erros internos não expõem SQL, caminhos locais ou stack traces.

## 4. Rastreabilidade inicial

| Caso de uso | Issues de implementação |
|---|---|
| UC01 — Cadastrar tarefa | #9 |
| UC02 — Listar e filtrar tarefas | #10 e #14 |
| UC03 — Consultar tarefa por ID | #10 |
| UC04 — Editar tarefa | #11 |
| UC05 — Alterar status | #12 |
| UC06 — Excluir tarefa | #13 |

Todos os casos dependem da base do servidor e da persistência,
previstas nas issues #7 e #8.

A matriz completa será consolidada na issue #6.