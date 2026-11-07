# TaskFlow Mini — API

Base URL: `/api`

## Endpoints

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/tasks` | Lista tarefas com filtros, busca, ordenação e paginação |
| GET | `/api/tasks/stats` | Retorna estatísticas das tarefas |
| GET | `/api/tasks/:id` | Retorna uma tarefa pelo ID |
| POST | `/api/tasks` | Cria uma tarefa |
| PUT | `/api/tasks/:id` | Atualiza uma tarefa |
| PATCH | `/api/tasks/:id/status` | Atualiza somente o status de uma tarefa |
| DELETE | `/api/tasks/:id` | Remove uma tarefa |

## Criar tarefa

`POST /api/tasks`

Corpo:

```json
{
  "title": "Estudar Node.js",
  "description": "Revisar fundamentos do Express",
  "priority": "alta"
}
```

Respostas:

- `201 Created`: tarefa criada.
- `400 Bad Request`: payload inválido.

## Listar tarefas

`GET /api/tasks`

Parâmetros de consulta:

| Parâmetro | Valores | Padrão |
|---|---|---|
| `status` | `pendente`, `em_andamento`, `concluida` | — |
| `priority` | `baixa`, `media`, `alta` | — |
| `q` | Texto livre | — |
| `sort_by` | `created_at`, `priority`, `title` | `created_at` |
| `order` | `asc`, `desc` | `desc` |
| `page` | Inteiro positivo | `1` |
| `limit` | Inteiro entre 1 e 100 | `10` |

Respostas:

- `200 OK`: lista paginada de tarefas.
- `400 Bad Request`: parâmetro inválido, vazio, repetido ou desconhecido.

Exemplo:

```http
GET /api/tasks?status=pendente&priority=alta&page=1&limit=10
```

## Buscar tarefas

`GET /api/tasks?q=estudo`

A busca considera título e descrição. O parâmetro `q` não pode estar vazio ou repetido.

## Ordenar tarefas

`GET /api/tasks?sort_by=priority&order=asc`

Campos permitidos para `sort_by`:

- `created_at`
- `priority`
- `title`

Direções permitidas para `order`:

- `asc`
- `desc`

## Obter tarefa

`GET /api/tasks/:id`

Respostas:

- `200 OK`: tarefa encontrada.
- `400 Bad Request`: ID inválido.
- `404 Not Found`: tarefa não encontrada.

## Atualizar tarefa

`PUT /api/tasks/:id`

Corpo:

```json
{
  "title": "Estudar Node.js",
  "description": "Revisar fundamentos do Express",
  "priority": "alta"
}
```

Respostas:

- `200 OK`: tarefa atualizada.
- `400 Bad Request`: payload ou ID inválido.
- `404 Not Found`: tarefa não encontrada.

## Atualizar status

`PATCH /api/tasks/:id/status`

Corpo:

```json
{
  "status": "concluida"
}
```

Respostas:

- `200 OK`: status atualizado.
- `400 Bad Request`: payload ou ID inválido.
- `404 Not Found`: tarefa não encontrada.

## Remover tarefa

`DELETE /api/tasks/:id`

Respostas:

- `204 No Content`: tarefa removida; resposta sem corpo.
- `400 Bad Request`: ID inválido.
- `404 Not Found`: tarefa não encontrada ou já removida.

## Estatísticas

`GET /api/tasks/stats`

Resposta:

```json
{
  "total": 10,
  "byStatus": [
    { "status": "pendente", "count": 4 },
    { "status": "em_andamento", "count": 3 },
    { "status": "concluida", "count": 3 }
  ],
  "byPriority": [
    { "priority": "baixa", "count": 3 },
    { "priority": "media", "count": 4 },
    { "priority": "alta", "count": 3 }
  ]
}
```

Respostas:

- `200 OK`: estatísticas retornadas.
- `500 Internal Server Error`: erro interno.

## Erros

Todas as respostas de erro utilizam o formato:

```json
{
  "message": "Descrição do erro"
}
```
