# TaskFlow Mini

API REST de tarefas com Node.js, Express e SQLite. Contrato: docs/requisitos.md.

## Executar

Requer Node.js 22 e npm. Dependências nativas de better-sqlite3 podem exigir ferramentas de compilação quando não houver binário disponível.

```sh
npm install
npm start
```

Porta padrão: 3000. Configure PORT e DATABASE_PATH como variáveis do processo; o servidor não carrega .env automaticamente. Banco padrão: ./data/tasks.db, criado na primeira execução. A inicialização usa CREATE TABLE IF NOT EXISTS e não apaga dados. Bancos com esquemas antigos precisam de migração explícita; não há migração automática nesta versão.

## Testar

```sh
npm test
```

Os testes usam SQLite em memória e um diretório temporário; não usam o banco local. O workflow API tests instala as dependências e executa a suíte duas vezes. A presença do workflow não significa que a execução já passou: confira os resultados no GitHub Actions.

## Endpoints

- GET /health
- POST /api/tasks
- GET /api/tasks
- GET /api/tasks/:id
- PUT /api/tasks/:id
- PATCH /api/tasks/:id/status
- DELETE /api/tasks/:id

Status: pendente, em_andamento, concluida. Prioridades: baixa, media, alta.

Cadastro aceita title, description e priority; status inicial sempre pendente. Edição exige title e priority; description omitida vira null. Alteração de status aceita somente status.

Exemplo de cadastro: {"title":"Estudar","priority":"alta"}.
Exemplo de filtro: GET /api/tasks?status=pendente&priority=alta.
Filtros inválidos, vazios, repetidos ou desconhecidos retornam 400. Listagem ordenada por ID decrescente.

## Organização

Rotas delegam aos controllers, que validam entradas e usam models com SQL parametrizado. src/database.js inicializa o banco. src/app.js configura a aplicação sem abrir porta. src/server.js inicia o servidor. O wrapper taskValidator.js existe apenas para compatibilidade de imports antigos; a validação ativa está em validators/tasks.js.

## Documentação

- docs/project-charter.md
- docs/requisitos.md
- docs/casos-de-uso.md
- docs/user-stories.md

## Validação pendente

Os testes precisam passar no CI antes de considerar a implementação validada. O requisito de tempo de resposta RNF10 ainda exige medição no ambiente de execução.
