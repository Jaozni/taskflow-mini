# TaskFlow Mini

API REST para gerenciamento de tarefas, construída com Node.js, Express e SQLite.

## Funcionalidades

- Criar, listar, obter, atualizar, alterar status e remover tarefas.
- Filtrar tarefas por status e prioridade.
- Buscar tarefas por título ou descrição.
- Ordenar por data de criação, prioridade ou título.
- Paginar resultados.
- Obter estatísticas por status e prioridade.
- Persistência em SQLite.
- Testes automatizados de integração.

## Requisitos

- Node.js 18 ou superior
- npm

## Instalação

```bash
npm install
```

## Executar em desenvolvimento

```bash
npm run dev
```

## Executar em produção

```bash
npm start
```

## Executar testes

```bash
npm test
```

## Documentação da API

A documentação completa está disponível em [docs/API.md](docs/API.md).

## Endpoints principais

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/tasks` | Lista tarefas |
| GET | `/api/tasks/stats` | Estatísticas |
| GET | `/api/tasks/:id` | Detalhes de uma tarefa |
| POST | `/api/tasks` | Cria tarefa |
| PUT | `/api/tasks/:id` | Atualiza tarefa |
| PATCH | `/api/tasks/:id/status` | Atualiza status |
| DELETE | `/api/tasks/:id` | Remove tarefa |

## Estrutura

```text
src/
  app.js
  database.js
  routes/
  controllers/
  models/
  validators/
tests/
docs/
```