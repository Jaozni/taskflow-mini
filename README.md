# TaskFlow Mini

API para gerenciamento de tarefas.

## Stack

- Node.js
- Express
- SQLite

## Execução

```bash
npm install
npm start
```

Por padrão, a API utiliza a porta `3000`.

Para usar outra porta:

```bash
PORT=4000 npm start
```

## Saúde da aplicação

```http
GET /health
```

Resposta esperada:

```json
{
  "status": "ok"
}
```

## Documentação

- [Project Charter](docs/project-charter.md)
- [Requisitos](docs/requisitos.md)
- [Casos de uso](docs/casos-de-uso.md)
- [Histórias de usuário](docs/user-stories.md)
- [Arquitetura](docs/arquitetura.md)
- [Rastreabilidade](docs/rastreabilidade.md)
