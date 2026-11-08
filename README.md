# TaskFlow Mini

![Versão declarada](https://img.shields.io/badge/versao-0.1.0-blue)
![Licença declarada](https://img.shields.io/badge/licenca-UNLICENSED-lightgrey)
[![Testes da main](https://github.com/Jaozni/taskflow-mini/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/Jaozni/taskflow-mini/actions/workflows/test.yml)

API REST local para organizar tarefas pessoais com Node.js, Express e SQLite. A entrega revisada foi integrada em main pelo PR #44.

## Funcionalidades

Implementadas: cadastro, listagem, consulta por ID, edição, alteração de status, exclusão, filtros por status e prioridade e endpoint de saúde.

Fora desta versão: busca textual, paginação, interface gráfica, autenticação, implantação pública e migração automática de bancos antigos. Evoluções dependem da revisão do backlog.

## Tecnologias e pré-requisitos

Node.js 22, npm, Express 4 e SQLite via better-sqlite3 11.7.0. GitHub Actions executa testes automatizados.

Prefira Node.js 22 para reproduzir o ambiente de CI documentado. engines >=22 não comprova compatibilidade com todas as versões futuras. A instalação Windows/Node 24 falhou na dependência nativa. Na ausência de binário compatível, better-sqlite3 pode exigir ferramentas de compilação.

## Instalação e execução

```sh
git clone --branch main https://github.com/Jaozni/taskflow-mini.git
cd taskflow-mini
npm ci
npm test
npm start
```

package-lock.json está versionado. npm ci exige consistência com package.json. Confira o resultado dos comandos; a execução no CI não comprova instalação no seu computador.

Em outro terminal:

```sh
curl http://localhost:3000/health
```

Com o banco disponível, a resposta esperada é HTTP 200 com {"status":"ok"}.

### Windows PowerShell

Se npm.ps1 estiver bloqueado:

```powershell
npm.cmd ci
npm.cmd test
npm.cmd start
```

Em outro terminal:

```powershell
Invoke-RestMethod -Uri http://localhost:3000/health
```

npm.cmd contorna o bloqueio do script, mas não resolve compilação nativa. Não utilize --ignore-scripts como evidência de instalação funcional do SQLite.

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

O banco é preparado antes de aceitar requisições. CREATE TABLE IF NOT EXISTS preserva registros. Não há migração automática de esquemas antigos; não apague bancos pessoais para testar. Dependências, arquivos privados de ambiente e bancos locais são ignorados conforme .gitignore. Testes utilizam bancos isolados.

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

Cadastro aceita title, description e priority. Descrição omitida recebe null; prioridade omitida recebe media; status inicial é pendente. PUT exige title e priority; descrição omitida remove a descrição. ID, status e created_at não são editáveis por PUT. PATCH aceita somente status.

Listagem por ID decrescente; filtros combinados usam AND. Entradas inválidas retornam 400, recursos inexistentes 404 e falhas internas 500 com mensagem genérica, sem detalhes SQL.

### Exemplos em shell POSIX

```sh
curl -X POST http://localhost:3000/api/tasks -H 'Content-Type: application/json' -d '{"title":"Estudar","priority":"alta"}'
curl 'http://localhost:3000/api/tasks?status=pendente&priority=alta'
curl http://localhost:3000/api/tasks/1
curl -X PUT http://localhost:3000/api/tasks/1 -H 'Content-Type: application/json' -d '{"title":"Revisar","priority":"media"}'
curl -X PATCH http://localhost:3000/api/tasks/1/status -H 'Content-Type: application/json' -d '{"status":"concluida"}'
curl -X DELETE http://localhost:3000/api/tasks/1
```

Substitua 1 pelo ID real. A exclusão é permanente.

Cadastro no PowerShell:

```powershell
$body = @{ title = 'Estudar'; priority = 'alta' } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/tasks -ContentType 'application/json' -Body $body
```

## Testes e evidências

Execute npm test, ou npm.cmd test no PowerShell.

| Arquivo | Verificações descritas |
|---|---|
| test/api.test.js | CRUD, filtros, saúde, erros e persistência |
| test/acceptance.test.js | Contratos, integridade, idempotência, transições e restrições SQL |
| test/startup.test.js | Processo real, porta configurada/inválida e falha SQLite |
| test/default-port.test.js | Processo sem PORT e consulta HTTP real na porta 3000 |
| test/performance.test.js | Seis operações, três medições por operação, até 100 tarefas e limite de 2000 ms |
| test/delivery.test.js | Texto com aparência SQL preservado como dado e arquivos rastreados |

Os dois jobs test do PR #44 passaram para o commit 595643b429bdc4c052f2fd180e9e63653781134b antes do merge. Novos commits exigem nova conferência dos checks.

[O relatório de desempenho](docs/desempenho.md) já registra as 18 medições históricas e o ambiente do commit 2d6b19846da126a65e10037b2ed610a405ca2bb9. Todas atenderam ao limite no runner informado. Não reutilize esses valores como medições de outro commit ou computador.

O CI documentado utiliza Linux/Node 22, instalação limpa e duas execuções da suíte. Isso não comprova instalação Windows nem desempenho local.

## Organização

- src/app.js: configuração do Express sem listen e tratamento central de erros.
- src/server.js: inicialização do processo.
- src/config/env.js: validação de ambiente.
- src/database.js: inicialização SQLite.
- src/routes/: rotas.
- src/controllers/: controladores.
- src/models/: operações de dados.
- src/validators/: contratos de entrada.
- test/: testes.
- docs/: documentação de planejamento e engenharia.

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

Não realizar commits diretos de desenvolvimento em main. Utilizar commits pequenos e coerentes com Conventional Commits, por exemplo feat(tasks): adicionar filtros (#14). Relacionar issues, branches, commits e PRs. Utilizar Closes somente após conferir os critérios. Não presumir fechamento automático em develop. Revisar PRs repetidos individualmente.

## Versionamento e licença

A tag anotada v0.1.0 foi publicada no commit d53bad270c2f0ad0415e7b9665e086f98dd2b187, referente ao merge do PR #44. Alterações documentais posteriores não fazem parte daquela tag e não devem movê-la.

Novos marcos devem seguir SemVer (MAJOR.MINOR.PATCH), com tags anotadas após validação.

O package.json declara UNLICENSED. Não foi adotada licença aberta.

## Pendências e limitações

- Confirmar e registrar a execução local prevista no RNF10.
- Instalação Windows/Node 24 não concluída; CI documentado em Linux/Node 22.
- A transcrição das 18 medições já existe em docs/desempenho.md; não comprova desempenho no computador do usuário.
- O teste da porta padrão existe em test/default-port.test.js; não é validação manual do ambiente Windows.
- A verificação de arquivos rastreados não equivale a auditoria de segredos no conteúdo ou histórico.
- Não há autenticação, implantação pública ou migração automática de bancos antigos.
- Conferir critérios antes de fechar issues e revisar os checks do commit entregue.
- Revisar PRs repetidos ou substituídos sem integrar alterações indiscriminadamente.

Atualize as pendências com evidências. Não remova uma limitação apenas para apresentar o projeto como finalizado.
