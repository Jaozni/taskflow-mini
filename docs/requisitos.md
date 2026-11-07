# Requisitos — TaskFlow Mini

## 1. Objetivo

Definir as funcionalidades, regras de negócio e atributos
de qualidade da API de gerenciamento de tarefas.

## 2. Modelo da tarefa

| Campo | Tipo | Regra |
|---|---|---|
| id | Inteiro | Positivo, único e gerado pelo sistema |
| title | Texto | Obrigatório; não pode conter apenas espaços |
| description | Texto ou null | Opcional |
| priority | Texto | baixa, media ou alta |
| status | Texto | pendente, em_andamento ou concluida |
| created_at | Texto | Data e hora em UTC, geradas pelo sistema |

## 3. Requisitos funcionais

### [RF01] Cadastrar tarefa

O sistema deve permitir cadastrar uma tarefa por POST /api/tasks.

- title é obrigatório.
- description é opcional e recebe null quando omitida.
- priority é opcional e recebe media quando omitida.
- O status inicial é sempre pendente.
- id e created_at são gerados pelo sistema.
- O cadastro válido retorna HTTP 201 e a tarefa criada.

### [RF02] Listar tarefas

O sistema deve permitir listar tarefas por GET /api/tasks.

- A resposta deve ser HTTP 200 com um array JSON.
- As tarefas devem ser ordenadas por ID decrescente.
- Sem tarefas cadastradas, a resposta deve ser [].

### [RF03] Consultar tarefa por ID

O sistema deve permitir consultar uma tarefa por GET /api/tasks/:id.

- Uma tarefa existente retorna HTTP 200 e seus dados.
- Um ID válido sem tarefa correspondente retorna HTTP 404
  com mensagem "Tarefa não encontrada".

### [RF04] Editar tarefa

O sistema deve permitir editar uma tarefa por PUT /api/tasks/:id.

- A operação substitui o conjunto de campos editáveis:
  title, description e priority.
- title e priority são obrigatórios em toda edição.
- description omitida deve ser armazenada como null.
- Para manter a descrição atual, o cliente deve enviá-la novamente.
- id, status e created_at devem permanecer inalterados.
- A edição válida retorna HTTP 200 e a tarefa atualizada.

### [RF05] Alterar status

O sistema deve permitir alterar o status por
PATCH /api/tasks/:id/status.

- O corpo deve conter somente o campo status.
- São permitidos pendente, em_andamento e concluida.
- Qualquer status permitido pode ser alterado para outro.
- Reabrir uma tarefa significa definir pendente.
- Enviar o status atual é válido e retorna HTTP 200.
- Os demais campos devem permanecer inalterados.
- A resposta deve conter a tarefa atualizada.

### [RF06] Excluir tarefa

O sistema deve permitir excluir uma tarefa por DELETE /api/tasks/:id.

- A exclusão é permanente.
- Qualquer tarefa pode ser excluída, independentemente do status.
- A exclusão válida retorna HTTP 204 sem corpo.
- Um ID válido sem tarefa correspondente retorna HTTP 404.
- Repetir a exclusão de uma tarefa removida retorna HTTP 404.
- A operação não exige corpo de requisição.

### [RF07] Filtrar tarefas por status

O sistema deve aceitar o parâmetro status em GET /api/tasks.

- O filtro deve retornar somente tarefas com o status informado.
- Os valores permitidos são pendente, em_andamento e concluida.

### [RF08] Filtrar tarefas por prioridade

O sistema deve aceitar o parâmetro priority em GET /api/tasks.

- O filtro deve retornar somente tarefas com a prioridade informada.
- Os valores permitidos são baixa, media e alta.

### [RF09] Combinar e validar filtros

O sistema deve permitir combinar status e priority.

- Com os dois filtros, retornar somente tarefas que atendam
  simultaneamente aos dois critérios.
- Sem filtros, retornar todas as tarefas.
- Manter a ordenação por ID decrescente.
- Sem resultados, retornar HTTP 200 e [].
- Valores inválidos ou vazios devem retornar HTTP 400.
- Parâmetros repetidos ou não previstos devem retornar HTTP 400.

### [RF10] Validar os dados de entrada

O sistema deve validar os dados antes de realizar alterações.

- O corpo de cadastro, edição e alteração de status deve ser
  um objeto JSON, e não um array, null ou valor primitivo.
- title deve ser uma string não vazia após remover espaços
  das extremidades.
- O título deve ser salvo sem espaços nas extremidades.
- description, quando informada, deve ser string.
- Uma descrição vazia é permitida; null explícito não é aceito
  no corpo de cadastro ou edição.
- priority e status devem corresponder exatamente aos valores
  permitidos.
- Campos não previstos em cada operação devem ser rejeitados.
- Dados inválidos devem retornar HTTP 400 e não alterar o banco.

### [RF11] Validar identificadores

O sistema deve validar o parâmetro id das rotas.

- Deve conter apenas algarismos.
- Deve representar um inteiro positivo dentro do intervalo
  de inteiros seguros do JavaScript.
- Zero, números negativos, decimais, texto e valores acima
  desse intervalo devem retornar HTTP 400.
- A validação não deve aceitar parcialmente valores como "1abc".

### [RF12] Persistir tarefas

O sistema deve armazenar as tarefas em SQLite.

- O banco e a tabela devem ser criados na primeira execução.
- A inicialização não deve apagar dados existentes.
- Os dados devem continuar disponíveis após reiniciar a aplicação.
- O arquivo local do banco deve ficar na pasta data/.

### [RF13] Disponibilizar endpoint de saúde

O sistema deve disponibilizar GET /health.

- A resposta deve ser HTTP 200.
- O corpo deve ser {"status":"ok"}.
- O servidor somente deve aceitar requisições depois da
  inicialização bem-sucedida do banco.

### [RF14] Retornar erros padronizados

O sistema deve retornar erros em JSON com uma mensagem textual.

Formato:

```json
{
  "message": "Descrição do erro"
}
```

- HTTP 400: entrada inválida ou JSON malformado.
- HTTP 404: tarefa ou rota inexistente.
- HTTP 500: falha interna inesperada.
- Falhas internas não devem expor SQL, caminhos locais
  ou stack traces.

### [RF15] Retornar os campos da tarefa

As respostas de cadastro, consulta, edição e alteração de status
devem conter:

- id
- title
- description
- priority
- status
- created_at

Cada item da listagem deve conter os mesmos campos.
A exclusão bem-sucedida é a exceção: retorna HTTP 204 sem corpo.

## 4. Requisitos não funcionais

| ID | Requisito | Forma de verificação |
|---|---|---|
| RNF01 | A API deve trocar dados de aplicação em JSON; respostas HTTP 204 não devem conter corpo | Verificar Content-Type e corpo nos testes dos endpoints |
| RNF02 | Reiniciar a aplicação não deve causar perda de tarefas | Cadastrar uma tarefa, reiniciar usando o mesmo banco e consultar o registro |
| RNF03 | Consultas e alterações devem utilizar parâmetros SQL para os valores recebidos, sem concatená-los nas instruções | Revisar as operações do modelo e testar entradas com caracteres especiais |
| RNF04 | Respostas de erro não devem expor detalhes internos | Verificar o tratamento centralizado e testar uma falha interna controlada |
| RNF05 | Dependências, variáveis de ambiente, logs e bancos locais não devem ser versionados | Revisar .gitignore e conferir os arquivos rastreados |
| RNF06 | A configuração da aplicação deve ser separada da abertura da porta HTTP | Verificar se os testes conseguem utilizar a aplicação sem iniciar src/server.js |
| RNF07 | A suíte deve utilizar banco separado e permitir execuções repetidas | Executar npm test duas vezes e conferir que o banco local não foi modificado |
| RNF08 | A instalação, execução e configuração devem ser reproduzíveis a partir do README | Seguir as instruções em uma cópia limpa com a versão documentada do Node.js |
| RNF09 | O servidor deve utilizar PORT quando definida e 3000 quando ausente | Iniciar a aplicação com e sem a variável e conferir a porta utilizada |
| RNF10 | As operações principais devem responder em até 2 segundos em execução local com até 100 tarefas, sem concorrência | Registrar ambiente e medir três requisições consecutivas por operação após a inicialização; todas devem atender ao limite |
| RNF11 | O código deve separar rotas, controladores, modelos e inicialização do banco | Revisar a organização das pastas e as responsabilidades dos módulos |

Os identificadores desta tabela devem ser referenciados no formato
[RNF01], [RNF02] etc. nos demais artefatos.

## 5. Regras de validação e precedência

Nas operações que recebem ID e corpo:

1. Validar o ID.
2. Validar o corpo.
3. Consultar ou alterar a tarefa.

Assim, os cenários de tarefa inexistente devem ser verificados
com ID e corpo válidos.

JSON malformado pode ser rejeitado antes dessas etapas
pelo processamento da requisição.

## 6. Fora do escopo

- Interface gráfica.
- Autenticação e múltiplos usuários.
- Notificações.
- Integrações externas.
- Paginação.
- Exclusão em lote ou recuperação de tarefas.
- Histórico de alterações.

## 7. Rastreabilidade inicial

| Requisitos | Issue principal |
|---|---|
| RF01 | #9 |
| RF02 e RF03 | #10 |
| RF04 | #11 |
| RF05 | #12 |
| RF06 | #13 |
| RF07, RF08 e RF09 | #14 |
| RF10 | #9, #11 e #12 |
| RF11 | #10, #11, #12 e #13 |
| RF12 | #8 |
| RF13 | #7 e #8 |
| RF14 | #7 e #9 a #14 |
| RF15 | #9 a #12 e #14 |
| Verificação automatizada dos comportamentos principais | #15 |

A matriz completa, incluindo casos de uso, histórias e requisitos
não funcionais, será construída na issue #6.