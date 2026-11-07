# TaskFlow Mini

![Versao declarada](https://img.shields.io/badge/versao-0.1.0-blue)
![Licenca declarada](https://img.shields.io/badge/licenca-UNLICENSED-lightgrey)
[![API tests da branch de entrega](https://github.com/Jaozni/taskflow-mini/actions/workflows/test.yml/badge.svg?branch=feature%2Fissue-15-testes-readme)](https://github.com/Jaozni/taskflow-mini/actions/workflows/test.yml)

API REST local para organizar tarefas pessoais: cadastrar, consultar, editar, acompanhar status e excluir atividades. Sem interface grafica ou autenticacao nesta versao.

## Stack e pre-requisitos

Node.js 22 utilizado no CI, npm, Express 4 e SQLite via better-sqlite3 11.7.0. A declaracao engines >=22 nao comprova compatibilidade de todas as dependencias com cada versao futura. A instalacao Windows com Node 24 falhou na dependencia nativa; prefira Node 22 para reproduzir o ambiente testado. Na ausencia de binario pronto, o modulo pode exigir ferramentas de compilacao.

UNLICENSED e a declaracao do package.json; nao foi adotada licenca aberta. O badge 0.1.0 nao comprova release ou tag publicada.

## Instalar a entrega do PR #43

A entrega revisada esta em feature/issue-15-testes-readme enquanto o PR nao for integrado. main nao deve ser apresentada como contendo estas alteracoes.

```sh
git clone --branch feature/issue-15-testes-readme https://github.com/Jaozni/taskflow-mini.git
cd taskflow-mini
npm ci
npm test
npm start
```

O package-lock.json esta versionado. npm ci instala conforme esse arquivo e falha em caso de incompatibilidade com package.json. O CI executa instalacao limpa no Linux com Node 22 e roda a suite duas vezes.

### Windows PowerShell

Se npm.ps1 for bloqueado, use o executavel npm.cmd sem alterar a politica de scripts:

```powershell
npm.cmd ci
npm.cmd test
npm.cmd start
```

Esses comandos ainda dependem de ambiente compativel com better-sqlite3; npm.cmd resolve o bloqueio do PowerShell, nao a compilacao nativa. Nao use --ignore-scripts para declarar a aplicacao instalada: o SQLite precisa de seu binario funcional.

## Ambiente e persistencia

Porta padrao 3000. O processo le PORT e DATABASE_PATH; nao carrega .env automaticamente. Banco padrao ./data/tasks.db, criado antes de aceitar requisicoes. CREATE TABLE IF NOT EXISTS preserva registros. Nao ha migracao automatica de esquemas antigos; nao apague banco pessoal para testar.

Shell POSIX:

```sh
PORT=3001 DATABASE_PATH=./data/tasks.db npm start
```

PowerShell:

```powershell
$env:PORT = '3001'
$env:DATABASE_PATH = './data/tasks.db'
npm.cmd start
```

Dependencias, arquivos privados de ambiente e bancos locais sao ignorados pelo Git. Os testes usam bancos isolados em memoria ou arquivos temporarios.

## Funcionalidades implementadas

| Metodo | Endpoint | Operacao |
|---|---|---|
| GET | /health | Saude: 200 com {"status":"ok"}; 503 se banco indisponivel |
| POST | /api/tasks | Cadastro, 201 |
| GET | /api/tasks | Listagem e filtros |
| GET | /api/tasks/:id | Consulta individual |
| PUT | /api/tasks/:id | Substituicao dos campos editaveis |
| PATCH | /api/tasks/:id/status | Alteracao de status |
| DELETE | /api/tasks/:id | Exclusao permanente, 204 sem corpo |

Status: pendente, em_andamento, concluida. Prioridades: baixa, media, alta. Cadastro aceita title, description e priority; descricao omitida vira null, prioridade omitida media e status inicial pendente. PUT exige title e priority; descricao omitida remove a descricao. ID, status e created_at nao sao editaveis por PUT. PATCH aceita somente status.

Exemplos em shell POSIX:

```sh
curl http://localhost:3000/health
curl -X POST http://localhost:3000/api/tasks -H 'Content-Type: application/json' -d '{"title":"Estudar","priority":"alta"}'
curl 'http://localhost:3000/api/tasks?status=pendente&priority=alta'
curl http://localhost:3000/api/tasks/1
curl -X PUT http://localhost:3000/api/tasks/1 -H 'Content-Type: application/json' -d '{"title":"Revisar","priority":"media"}'
curl -X PATCH http://localhost:3000/api/tasks/1/status -H 'Content-Type: application/json' -d '{"status":"concluida"}'
curl -X DELETE http://localhost:3000/api/tasks/1
```

Exemplo PowerShell:

```powershell
Invoke-RestMethod http://localhost:3000/health
Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/tasks -ContentType 'application/json' -Body '{"title":"Estudar","priority":"alta"}'
```

Os IDs dependem dos dados existentes. Listagem por ID decrescente; filtros combinados usam AND. Entradas invalidas retornam 400, recursos inexistentes 404 e falhas internas 500 com message generica, sem detalhes SQL na resposta.

## Testes e evidencias

- test/api.test.js: CRUD, filtros, health, erros e persistencia apos reabrir arquivo.
- test/acceptance.test.js: contratos, invalidos sem alteracao, integridade, idempotencia, transicoes e restricoes SQL.
- test/startup.test.js: processo real, PORT configurada/invalida e falha SQLite.
- test/performance.test.js: seis operacoes, tres medicoes por operacao, ate 100 tarefas, HTTP real e SQLite temporario em arquivo; limite 2000 ms.
- test/delivery.test.js: texto com aparencia SQL preservado como dado e verificacao de nomes rastreados pelo Git.

Commit a08ceb9333dfff4b351f2f30364f0793e3afea74 aprovado em dois jobs test:
- https://github.com/Jaozni/taskflow-mini/actions/runs/42426116997
- https://github.com/Jaozni/taskflow-mini/actions/runs/42426120857

Essas evidencias nao antecipam o resultado de commits posteriores. Tempos reais e ambiente do teste de desempenho aparecem nos diagnosticos dos logs. Nao foram transcritos para uma tabela versionada. Execucao no runner nao comprova desempenho no computador do usuario nem instalacao Windows concluida.

## Organizacao

src/app.js configura Express sem listen; src/server.js inicia o processo; src/config/env.js valida ambiente; src/database.js inicializa SQLite. Rotas em src/routes/, controladores em src/controllers/, modelos em src/models/ e contratos em src/validators/tasks.js. Tratamento central de erros em app.js. Testes em test/.

## Fluxo de trabalho e versoes

| Branch | Finalidade | Destino do PR |
|---|---|---|
| feature/issue-XX-descricao | Funcionalidades e testes | develop |
| docs/issue-XX-descricao | Documentacao | develop |
| fix/issue-XX-descricao | Correcoes | develop |
| develop | Integracao | main apos revisao |
| main | Marcos estaveis | Sem commits diretos de desenvolvimento |

Usar Conventional Commits, por exemplo feat(tasks): adicionar filtros (#14) ou docs: revisar entrega (#15). Relacionar PRs as issues e revisar criterios antes de fechar. Nao presumir fechamento automatico em develop. Tags anotadas vMAJOR.MINOR.PATCH somente apos validacao e autorizacao. Nenhum merge, tag ou release e realizado por este documento.

## Documentacao

- [Indice](docs/README.md)
- [Project Charter](docs/project-charter.md)
- [Requisitos](docs/requisitos.md)
- [Casos de uso](docs/casos-de-uso.md)
- [Historias](docs/user-stories.md)
- [Arquitetura](docs/arquitetura.md)
- [Rastreabilidade](docs/rastreabilidade.md)
- [Checklist de entrega](docs/entrega.md)
- [Validacao e limites](docs/validacao-entrega.md)

## Pendencias e limites

- Transcrever as 18 medicoes reais e ambiente para documento versionado; validar execucao local exigida pelo RNF10.
- Instalacao Windows/Node 24 nao concluida; CI validado em Linux/Node 22.
- PORT padrao revisada no codigo; bind real sem PORT na porta 3000 ainda nao testado.
- Verificacao de nomes rastreados nao e auditoria de segredos no conteudo ou historico.
- Revisar criterios das issues, CI do ultimo commit e autorizacao de integracao antes de fechar registros ou publicar marco.

Busca, paginacao, interface grafica, autenticacao e implantacao publica nao estao implementadas nesta entrega. Nao ha migracao automatica de bancos antigos.
