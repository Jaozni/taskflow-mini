# TaskFlow Mini

![Versão declarada](https://img.shields.io/badge/versao-0.1.0-blue)
![Licença declarada](https://img.shields.io/badge/licenca-UNLICENSED-lightgrey)
[![Testes da main](https://github.com/Jaozni/taskflow-mini/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/Jaozni/taskflow-mini/actions/workflows/test.yml)

API REST local para gerenciar tarefas pessoais com Node.js, Express e SQLite. O projeto conecta documentação de planejamento, requisitos, histórias de usuário, issues, branches, Pull Requests e testes.

## Funcionalidades

Implementadas: cadastro, listagem, consulta por ID, edição, alteração de status, exclusão, filtros por status e prioridade e verificação de saúde.

Não implementadas nesta entrega: busca textual, paginação, interface gráfica, autenticação, implantação pública e migração automática de bancos antigos. Evoluções dependem da revisão do backlog.

## Tecnologias e pré-requisitos

- Node.js 22: ambiente utilizado no CI documentado.
- npm para dependências e scripts.
- Express 4 para a API HTTP.
- SQLite via better-sqlite3 11.7.0 para persistência.
- GitHub Actions para testes automatizados.

Prefira Node.js 22 para reproduzir o ambiente documentado. A declaração engines >=22 não comprova compatibilidade de todas as dependências com versões futuras. A instalação Windows/Node 24 apresentou falha na dependência nativa. Na ausência de binário compatível, better-sqlite3 pode exigir ferramentas de compilação.

## Instalação e execução

Estas instruções destinam-se à main após a integração da entrega revisada. Enquanto a integração estiver pendente, consulte o PR #44.

```sh
git clone --branch main https://github.com/Jaozni/taskflow-mini.git
cd taskflow-mini
npm ci
npm test
npm start
```

O package-lock.json está versionado. npm ci exige consistência com package.json. Confira o resultado dos testes antes de considerar o ambiente validado.

Em outro terminal:

```sh
curl http://localhost:3000/health
```

Com o banco disponível, a resposta esperada é 200 com {"status":"ok"}.

### Windows PowerShell

Se npm.ps1 estiver bloqueado, utilize:

```powershell
npm.cmd ci
npm.cmd test
npm.cmd start
```

Em outro terminal:

```powershell
Invoke-RestMethod -Uri http://localhost:3000/health
```

O uso de npm.cmd contorna o bloqueio do script, mas não resolve compilação nativa. Não utilize --ignore-scripts como evidência de instalação funcional: SQLite depende de seu binário.

## Ambiente e persistência

| Variável | Padrão | Finalidade |
|---|---|---|
| PORT | 3000 | Porta HTTP |
| DATABASE_PATH | ./data/tasks.db | Arquivo SQLite |

O processo lê variáveis de ambiente; não carrega .env automaticamente.

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

O banco é preparado antes de aceitar requisições. CREATE TABLE IF NOT EXISTS preserva registros existentes. Não há migração automática de esquemas antigos; não apague bancos pessoais para testar. Dependências, arquivos privados de ambiente e bancos locais são ignorados conforme .gitignore. Testes usam bancos isolados em memória ou arquivos temporários.

## Endpoints e contratos

| Método | Endpoint | Operação |
|---|---|---|
| GET | /health | Saúde: 200; 503 se banco indisponível |
| POST | /api/tasks | Cadastro: 201 |
| GET | /api/tasks | Listagem e filtros |
| GET | /api/tasks/:id | Consulta individual |
| PUT | /api/tasks/:id | Substituição dos campos editáveis |
| PATCH | /api/tasks/:id/status | Alteração de status |
| DELETE | /api/tasks/:id | Exclusão permanente: 204 sem corpo |

Status: pendente, em_andamento, concluida. Prioridades: baixa, media, alta.

Cadastro aceita title, description e priority. Descrição omitida recebe null; prioridade omitida recebe media; status inicial é pendente.

PUT exige title e priority; descrição omitida remove a descrição. ID, status e created_at não são editáveis por PUT. PATCH aceita somente status.

Listagem por ID decrescente. Filtros combinados usam AND. Entradas inválidas retornam 400, recursos inexistentes 404 e falhas internas 500 com mensagem genérica, sem detalhes SQL.

## Exemplos de uso

Exemplos para shell POSIX, com aplicação em execução:

```sh
curl -X POST http://localhost:3000/api/tasks -H 'Content-Type: application/json' -d '{"title":"Estudar","priority":"alta"}'
curl http://localhost:3000/api/tasks
curl 'http://localhost:3000/api/tasks?status=pendente&priority=alta'
curl http://localhost:3000/api/tasks/1
curl -X PUT http://localhost:3000/api/tasks/1 -H 'Content-Type: application/json' -d '{"title":"Revisar","priority":"media"}'
curl -X PATCH http://localhost:3000/api/tasks/1/status -H 'Content-Type: application/json' -d '{"status":"concluida"}'
curl -X DELETE http://localhost:3000/api/tasks/1
```

Substitua 1 pelo ID real retornado no cadastro ou na listagem. A exclusão é permanente.

Cadastro no PowerShell:

```powershell
$body = @{ title = 'Estudar'; priority = 'alta' } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/tasks -ContentType 'application/json' -Body $body
```

## Testes e evidências

Execute npm test, ou npm.cmd test no PowerShell. A documentação da entrega descreve:

| Arquivo | Verificações |
|---|---|
| test/api.test.js | CRUD, filtros, saúde, erros e persistência após reabrir arquivo |
| test/acceptance.test.js | Contratos, entradas inválidas sem alteração, integridade, idempotência, transições e restrições SQL |
| test/startup.test.js | Processo real, porta configurada/inválida e falha SQLite |
| test/performance.test.js | Seis operações, três medições por operação, até 100 tarefas, HTTP real, SQLite temporário e limite de 2000 ms |
| test/delivery.test.js | Texto com aparência SQL preservado como dado e nomes rastreados pelo Git |

A documentação histórica registra aprovação do commit a08ceb9333dfff4b351f2f30364f0793e3afea74 nestas execuções:

- https://github.com/Jaozni/taskflow-mini/actions/runs/42426116997
- https://github.com/Jaozni/taskflow-mini/actions/runs/42426120857

Essas evidências não comprovam resultados de commits posteriores. O CI documentado utiliza Linux/Node 22, instalação limpa e duas execuções da suíte. Confira os checks do commit efetivamente entregue. Execução em runner não comprova instalação Windows nem desempenho local.

## Organização

- src/app.js: Express sem listen e tratamento central de erros.
- src/server.js: inicialização do processo.
- src/config/env.js: validação de ambiente.
- src/database.js: inicialização SQLite.
- src/routes/: rotas.
- src/controllers/: controladores.
- src/models/: operações de dados.
- src/validators/: contratos de entrada.
- test/: testes automatizados.
- docs/: planejamento e documentação de engenharia.

## Documentação

- [Índice](docs/README.md)
- [Project Charter](docs/project-charter.md)
- [Requisitos](docs/requisitos.md)
- [Casos de uso](docs/casos-de-uso.md)
- [Histórias de usuário](docs/user-stories.md)
- [Arquitetura](docs/arquitetura.md)
- [Rastreabilidade](docs/rastreabilidade.md)
- [Desempenho](docs/desempenho.md)
- [Checklist de entrega](docs/entrega.md)
- [Validação e limites](docs/validacao-entrega.md)

## Fluxo de desenvolvimento

| Branch | Finalidade | Destino do PR |
|---|---|---|
| feature/issue-XX-descricao | Funcionalidades e testes | develop |
| docs/issue-XX-descricao | Documentação | develop |
| fix/issue-XX-descricao | Correções | develop |
| develop | Integração | main após revisão |
| main | Marcos estáveis | Recebe alterações por PR |

Não realizar commits diretos de desenvolvimento em main. Utilizar commits pequenos e coerentes com Conventional Commits, por exemplo feat(tasks): adicionar filtros (#14) e docs(readme): revisar entrega (#15).

Issues devem conter labels e critérios de aceite. Referenciar issues em branches, commits e PRs. Utilizar Closes somente após conferir os critérios. Não presumir fechamento automático em develop. Revisar PRs repetidos ou substituídos individualmente.

## Versionamento e licença

Versão declarada: 0.1.0. Marcos devem seguir SemVer (MAJOR.MINOR.PATCH) e utilizar tags Git anotadas após validação. O badge não comprova publicação de tag ou Release; consulte as tags do repositório.

O package.json declara UNLICENSED. Não foi adotada licença aberta.

## Pendências e limitações

- Confirmar e registrar a execução local prevista no RNF10.
- Instalação Windows/Node 24 não concluída; evidências históricas em Linux/Node 22.
- Conferir a evidência de inicialização real sem PORT na porta padrão 3000.
- Conferir o registro das 18 medições reais de desempenho e do ambiente em documento versionado.
- A verificação de nomes rastreados não equivale a auditoria de segredos no conteúdo ou histórico.
- Não há autenticação, implantação pública ou migração automática de bancos antigos.
- Conferir critérios antes de fechar issues e revisar o CI do commit entregue.
- Revisar PRs repetidos ou substituídos sem integrar alterações indiscriminadamente.
- Criar tag anotada somente após validar o marco.

Atualize as pendências quando houver evidências de conclusão. Não remova uma limitação apenas para apresentar o projeto como finalizado.
