# Arquitetura — TaskFlow Mini

## Estado e evidencias

Implementacao revisada na branch feature/issue-15-testes-readme, PR #43. Commit 434be3ada3d146b28cdd5cc6deabb04cd971a951 validado por dois jobs test com success:
- https://github.com/Jaozni/taskflow-mini/actions/runs/42425633119
- https://github.com/Jaozni/taskflow-mini/actions/runs/42425636821

Estes resultados nao comprovam instalacao no Windows do usuario nem release publicada. Detalhes e limites: [validacao](validacao-entrega.md).

## Componentes implementados

Cliente HTTP -> Express -> rotas -> controladores -> modelos -> SQLite local.

- src/app.js: configura Express, JSON, rotas, 404 e middleware de erros; nao abre porta.
- src/server.js: carrega ambiente, inicializa banco e inicia listen.
- src/config/env.js: PORT entre 1 e 65535, padrao 3000; DATABASE_PATH padrao ./data/tasks.db.
- src/database.js: cria diretorio, abre SQLite e inicializa esquema preservando dados existentes.
- src/routes/tasks.js e src/routes/health.js: endpoints de tarefas e saude.
- src/controllers/tasks.js: coordenacao das operacoes e respostas HTTP.
- src/models/tasks.js: consultas parametrizadas; filtros montados com condicoes fixas e valores vinculados.
- test/: testes de API, aceitacao, desempenho e inicializacao real.

Nao existem src/database/connection.js nem pasta tests/ no desenho implementado. O tratamento de erros esta em app.js, nao em middleware/errors.js.

## Dados e contratos

Tarefa: id, title, description, priority, status, created_at. SQLite aplica PRIMARY KEY AUTOINCREMENT, titulo obrigatorio nao vazio, prioridade baixa/media/alta, status pendente/em_andamento/concluida e data UTC automatica. description aceita NULL.

| Metodo | Rota | Sucesso |
|---|---|---|
| GET | /health | 200; 503 se banco indisponivel |
| POST | /api/tasks | 201 |
| GET | /api/tasks | 200 |
| GET | /api/tasks/:id | 200 |
| PUT | /api/tasks/:id | 200 |
| PATCH | /api/tasks/:id/status | 200 |
| DELETE | /api/tasks/:id | 204 sem corpo |

Listagem por ID decrescente. Filtros status/priority combinados por AND. PUT exige title e priority; description omitida remove o valor. PATCH altera somente status. Validacao de ID precede corpo e existencia, exceto rejeicao antecipada do parser JSON. Erros usam JSON com message, sem detalhes internos na resposta. Nao ha autenticacao nem isolamento por usuario; esta versao destina-se a uso local, nao exposicao publica.

## Verificacao e reproducibilidade

Node 22 no CI; package-lock.json versionado; npm ci seguido de duas execucoes de npm test. Banco de teste isolado. performance.test.js realiza 18 medicoes sequenciais com HTTP real e SQLite temporario, no maximo 100 tarefas e limite de 2000 ms. startup.test.js cobre PORT configurada, PORT invalida e falha SQLite. Bind real na porta padrao 3000 nao foi testado.

## Integracao e versionamento

Branches tematicas integram por PR em develop; main recebe marcos revisados por PR de develop. Nao presumir fechamento automatico de issues ao integrar em develop. Tags anotadas vMAJOR.MINOR.PATCH apenas apos validacao e autorizacao. package.json 0.1.0 nao comprova release. Nao foram feitos merge, tag ou publicacao nesta revisao.

[Requisitos](requisitos.md) · [Casos de uso](casos-de-uso.md) · [Historias](user-stories.md) · [Rastreabilidade](rastreabilidade.md)
