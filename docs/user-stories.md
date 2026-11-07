# Histórias de Usuário — TaskFlow Mini

## 1. Contexto

As histórias descrevem necessidades de uma pessoa que organiza
tarefas individuais por meio de um cliente HTTP.

Nesta versão, o sistema não possui interface gráfica,
autenticação ou separação de dados por usuário.

Os cenários utilizam o formato Dado / Quando / Então e seguem
as regras de requisitos.md e os fluxos de casos-de-uso.md.

## US01 — Cadastrar tarefa

Como usuário, quero cadastrar uma tarefa para que eu possa
registrar uma atividade que preciso realizar.

### Rastreabilidade

- Requisitos: RF01, RF10, RF12, RF14 e RF15.
- Caso de uso: UC01.
- Issue de implementação: #9.

### Critérios de aceite

```gherkin
Cenário: Cadastrar tarefa com todos os campos permitidos
  Dado que a API está disponível e o banco está inicializado
  Quando envio POST /api/tasks com título, descrição e prioridade válidos
  Então recebo HTTP 201
  E a resposta contém id, title, description, priority, status e created_at
  E o status da tarefa é "pendente"
  E a tarefa é persistida no banco
```

```gherkin
Cenário: Aplicar os valores padrão
  Dado que a API está disponível
  Quando cadastro uma tarefa informando somente um título válido
  Então recebo HTTP 201
  E a prioridade é "media"
  E o status é "pendente"
  E a descrição é null
  E o ID e a data de criação são gerados pelo sistema
```

```gherkin
Cenário: Remover espaços das extremidades do título
  Dado que a API está disponível
  Quando cadastro uma tarefa com o título "  Estudar Node.js  "
  Então recebo HTTP 201
  E o título salvo é "Estudar Node.js"
```

```gherkin
Cenário: Rejeitar cadastro inválido
  Dado que a API está disponível
  Quando envio um cadastro que viola as regras de validação de RF10
  Então recebo HTTP 400 com uma mensagem em JSON
  E nenhuma tarefa é criada
```

O cenário de cadastro inválido deve contemplar:

- Título ausente, nulo, vazio, composto apenas por espaços
  ou com tipo diferente de string.
- Descrição informada com tipo diferente de string, incluindo null.
- Prioridade informada fora dos valores permitidos.
- Campos não previstos no contrato.
- Corpo que não seja um objeto JSON.

## US02 — Listar tarefas

Como usuário, quero listar minhas tarefas para que eu possa
acompanhar as atividades registradas.

### Rastreabilidade

- Requisitos: RF02, RF14 e RF15.
- Caso de uso: UC02.
- Issue de implementação: #10.

### Critérios de aceite

```gherkin
Cenário: Listar tarefas existentes
  Dado que existem tarefas cadastradas
  Quando envio GET /api/tasks sem filtros
  Então recebo HTTP 200 com um array de todas as tarefas
  E as tarefas estão ordenadas por ID decrescente
  E cada tarefa contém os campos definidos em RF15
```

```gherkin
Cenário: Listar sem tarefas cadastradas
  Dado que não existem tarefas cadastradas
  Quando envio GET /api/tasks
  Então recebo HTTP 200
  E o corpo da resposta é []
```

## US03 — Consultar tarefa por ID

Como usuário, quero consultar uma tarefa pelo seu identificador
para que eu possa verificar seus detalhes.

### Rastreabilidade

- Requisitos: RF03, RF11, RF14 e RF15.
- Caso de uso: UC03.
- Issue de implementação: #10.

### Critérios de aceite

```gherkin
Cenário: Consultar uma tarefa existente
  Dado que existe uma tarefa cadastrada
  Quando envio GET /api/tasks/:id com seu ID válido
  Então recebo HTTP 200
  E a resposta contém somente a tarefa correspondente
  E seus campos seguem RF15
```

```gherkin
Cenário: Consultar uma tarefa inexistente
  Dado que um ID válido não corresponde a nenhuma tarefa
  Quando consulto esse ID
  Então recebo HTTP 404
  E a mensagem é "Tarefa não encontrada"
```

```gherkin
Cenário: Rejeitar ID inválido
  Dado que a API está disponível
  Quando consulto uma tarefa com ID inválido segundo RF11
  Então recebo HTTP 400 com uma mensagem em JSON
  E nenhum dado é alterado
```

A validação deve contemplar zero, números negativos, decimais,
texto, valores parcialmente numéricos e valores acima
do intervalo de inteiros seguros do JavaScript.

## US04 — Editar tarefa

Como usuário, quero editar os dados de uma tarefa para que eu
possa corrigir ou atualizar uma atividade registrada.

### Rastreabilidade

- Requisitos: RF04, RF10, RF11, RF12, RF14 e RF15.
- Caso de uso: UC04.
- Issue de implementação: #11.

### Critérios de aceite

```gherkin
Cenário: Editar os campos permitidos
  Dado que existe uma tarefa cadastrada
  Quando envio PUT /api/tasks/:id com título, descrição e prioridade válidos
  Então recebo HTTP 200 com a tarefa atualizada
  E os campos editáveis são persistidos
  E o título é salvo sem espaços nas extremidades
  E o ID, o status e a data de criação permanecem inalterados
```

```gherkin
Cenário: Remover a descrição por omissão
  Dado que existe uma tarefa com descrição
  Quando envio uma edição válida sem o campo description
  Então recebo HTTP 200
  E a descrição da tarefa passa a ser null
```

```gherkin
Cenário: Repetir a mesma edição
  Dado que uma edição válida já foi realizada
  Quando envio novamente a mesma edição
  Então recebo HTTP 200
  E a tarefa mantém o mesmo estado
```

```gherkin
Cenário: Rejeitar edição inválida
  Dado que existe uma tarefa cadastrada
  Quando envio uma edição com ID ou dados inválidos
  Então recebo HTTP 400 com uma mensagem em JSON
  E a tarefa permanece inalterada
```

A edição inválida deve contemplar título ou prioridade ausentes,
tipos inválidos, valores não permitidos, descrição inválida,
campos adicionais e corpo que não seja um objeto JSON.

```gherkin
Cenário: Editar uma tarefa inexistente
  Dado que um ID válido não corresponde a nenhuma tarefa
  Quando envio uma edição com corpo válido para esse ID
  Então recebo HTTP 404
  E a mensagem é "Tarefa não encontrada"
```

## US05 — Alterar status

Como usuário, quero alterar o status de uma tarefa para que eu
possa acompanhar seu andamento e registrar sua conclusão.

### Rastreabilidade

- Requisitos: RF05, RF10, RF11, RF12, RF14 e RF15.
- Caso de uso: UC05.
- Issue de implementação: #12.

### Critérios de aceite

```gherkin
Cenário: Iniciar uma tarefa
  Dado que existe uma tarefa pendente
  Quando envio PATCH /api/tasks/:id/status com status "em_andamento"
  Então recebo HTTP 200 com a tarefa atualizada
  E o novo status é persistido
  E os demais campos permanecem inalterados
```

```gherkin
Cenário: Concluir uma tarefa
  Dado que existe uma tarefa pendente ou em andamento
  Quando envio uma alteração de status para "concluida"
  Então recebo HTTP 200
  E a tarefa passa a ter status "concluida"
```

```gherkin
Cenário: Reabrir uma tarefa
  Dado que existe uma tarefa concluída
  Quando envio uma alteração de status para "pendente"
  Então recebo HTTP 200
  E a tarefa passa a ter status "pendente"
```

```gherkin
Cenário: Reenviar o status atual
  Dado que existe uma tarefa cadastrada
  Quando envio o mesmo status que ela já possui
  Então recebo HTTP 200
  E a tarefa mantém o mesmo estado
```

```gherkin
Cenário: Rejeitar alteração inválida
  Dado que existe uma tarefa cadastrada
  Quando envio ID inválido, status inválido ou corpo fora do contrato
  Então recebo HTTP 400 com uma mensagem em JSON
  E a tarefa permanece inalterada
```

O cenário inválido deve contemplar status ausente, nulo,
com tipo diferente de string ou fora dos valores permitidos,
além de campos adicionais e corpo que não seja objeto JSON.

```gherkin
Cenário: Alterar status de uma tarefa inexistente
  Dado que um ID válido não corresponde a nenhuma tarefa
  Quando envio um corpo válido para alterar seu status
  Então recebo HTTP 404
  E a mensagem é "Tarefa não encontrada"
```

Qualquer status permitido pode ser alterado para qualquer outro
status permitido nesta versão.

## US06 — Excluir tarefa

Como usuário, quero excluir uma tarefa para que eu possa
remover atividades que não desejo manter.

### Rastreabilidade

- Requisitos: RF06, RF11, RF12 e RF14.
- Caso de uso: UC06.
- Issue de implementação: #13.

### Critérios de aceite

```gherkin
Cenário: Excluir uma tarefa existente
  Dado que existe uma tarefa com qualquer status permitido
  Quando envio DELETE /api/tasks/:id com seu ID válido
  Então recebo HTTP 204 sem corpo
  E a tarefa é removida permanentemente
  E as demais tarefas permanecem inalteradas
  E uma consulta pelo ID removido retorna HTTP 404
```

```gherkin
Cenário: Excluir uma tarefa inexistente
  Dado que um ID válido não corresponde a nenhuma tarefa
  Quando envio uma exclusão para esse ID
  Então recebo HTTP 404
  E a mensagem é "Tarefa não encontrada"
```

```gherkin
Cenário: Repetir uma exclusão
  Dado que uma tarefa já foi excluída
  Quando envio novamente a exclusão para o mesmo ID
  Então recebo HTTP 404
  E nenhuma outra tarefa é removida
```

```gherkin
Cenário: Rejeitar ID inválido na exclusão
  Dado que a API está disponível
  Quando envio uma exclusão com ID inválido segundo RF11
  Então recebo HTTP 400 com uma mensagem em JSON
  E nenhuma tarefa é removida
```

## US07 — Filtrar tarefas

Como usuário, quero filtrar tarefas por status e prioridade
para que eu possa localizar atividades relevantes.

### Rastreabilidade

- Requisitos: RF07, RF08, RF09, RF14 e RF15.
- Caso de uso: UC02.
- Issue de implementação: #14.

### Critérios de aceite

```gherkin
Cenário: Filtrar por status
  Dado que existem tarefas com diferentes status
  Quando envio GET /api/tasks?status=pendente
  Então recebo HTTP 200
  E todas as tarefas retornadas possuem status "pendente"
```

```gherkin
Cenário: Filtrar por prioridade
  Dado que existem tarefas com diferentes prioridades
  Quando envio GET /api/tasks?priority=alta
  Então recebo HTTP 200
  E todas as tarefas retornadas possuem prioridade "alta"
```

```gherkin
Cenário: Combinar os filtros
  Dado que existem tarefas com diferentes status e prioridades
  Quando envio GET /api/tasks?status=pendente&priority=alta
  Então recebo HTTP 200
  E todas as tarefas retornadas possuem status "pendente"
  E todas possuem prioridade "alta"
  E os resultados estão ordenados por ID decrescente
```

```gherkin
Cenário: Consultar sem correspondências
  Dado que nenhuma tarefa atende aos filtros válidos informados
  Quando envio a consulta
  Então recebo HTTP 200
  E o corpo da resposta é []
```

```gherkin
Cenário: Rejeitar filtros inválidos
  Dado que a API está disponível
  Quando envio valor inválido, vazio, parâmetro repetido ou não previsto
  Então recebo HTTP 400 com uma mensagem em JSON
  E nenhum dado é alterado
```

Os filtros isolados também devem manter a ordenação por ID
decrescente e retornar todos os campos definidos em RF15.

## 2. Critérios transversais

Aplicáveis às histórias conforme a operação:

- JSON malformado retorna HTTP 400.
- Falhas internas inesperadas retornam HTTP 500.
- Respostas de erro seguem o formato definido em RF14.
- Erros não expõem SQL, caminhos locais ou stack traces.
- Operações de leitura não alteram os registros.
- Os dados persistidos continuam disponíveis após reiniciar
  a aplicação usando o mesmo banco.

## 3. Matriz resumida

| História | Caso de uso | Issue |
|---|---|---|
| US01 — Cadastrar tarefa | UC01 | #9 |
| US02 — Listar tarefas | UC02 | #10 |
| US03 — Consultar tarefa | UC03 | #10 |
| US04 — Editar tarefa | UC04 | #11 |
| US05 — Alterar status | UC05 | #12 |
| US06 — Excluir tarefa | UC06 | #13 |
| US07 — Filtrar tarefas | UC02 | #14 |

A verificação automatizada dos comportamentos principais
será realizada na issue #15.

A matriz completa de rastreabilidade será consolidada na issue #6.