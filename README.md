# TaskFlow Mini

![Versão declarada](https://img.shields.io/badge/vers%C3%A3o-0.1.0-blue)
![Licença declarada](https://img.shields.io/badge/licen%C3%A7a-UNLICENSED-lightgrey)
[![API tests](https://github.com/Jaozni/taskflow-mini/actions/workflows/test.yml/badge.svg?branch=develop)](https://github.com/Jaozni/taskflow-mini/actions/workflows/test.yml)

API REST local para organizar tarefas pessoais: cadastrar, consultar, editar, acompanhar status e excluir atividades. Sem interface gráfica ou autenticação nesta versão.

## Stack e pré-requisitos

Node.js 22, npm, Express 4 e SQLite via better-sqlite3. O módulo nativo pode exigir ferramentas de compilação quando não houver binário disponível. UNLICENSED é a declaração do package.json; não há licença aberta adotada nem release/tag publicada comprovada por esse badge.

## Instalação e execução

```sh
git clone https://github.com/Jaozni/taskflow-mini.git
cd taskflow-mini
git checkout develop
npm install
npm start
```

O desenvolvimento integrado está em develop; main ainda não representa esta entrega. Porta padrão: 3000. O servidor lê PORT e DATABASE_PATH do ambiente do processo e não carrega .env automaticamente.

Exemplo em shell POSIX:

```sh
PORT=3001 DATABASE_PATH=./data/tasks.db npm start
```

O banco padrão é ./data/tasks.db. A pasta e a tabela são criadas na inicialização, antes de abrir a porta HTTP. CREATE TABLE IF NOT EXISTS não apaga registros. Não há migração automática de bancos antigos; não substitua nem apague um banco pessoal para testar. data/, bancos locais, .env e node_modules/ são ignorados pelo Git.

## Funcionalidades implementadas

| Método | Endpoint | Operação |
|---|---|---|
| GET | /health | Saúde: {"status":"ok"} |
| POST | /api/tasks | Cadastro |
| GET | /api/tasks | Listagem e filtros |
| GET | /api/tasks/:id | Consulta individual |
| PUT | /api/tasks/:id | Substituição dos campos editáveis |
| PATCH | /api/tasks/:id/status | Alteração de status |
| DELETE | /api/tasks/:id | Exclusão permanente, 204 sem corpo |

Status: pendente, em_andamento, concluida. Prioridades: baixa, media, alta.
Cadastro aceita title, description e priority; título é normalizado, descrição omitida vira null, prioridade omitida vira media e status inicial é pendente.
PUT exige title e priority; descrição omitida vira null. ID, status e created_at não são editáveis por PUT. PATCH aceita somente status.

```sh
curl http://localhost:3000/health
curl -X POST http://localhost:3000/api/tasks -H 'Content-Type: application/json' -d '{"title":"Estudar","priority":"alta"}'
curl 'http://localhost:3000/api/tasks?status=pendente&priority=alta'
curl -X PUT http://localhost:3000/api/tasks/1 -H 'Content-Type: application/json' -d '{"title":"Revisar","priority":"media"}'
curl -X PATCH http://localhost:3000/api/tasks/1/status -H 'Content-Type: application/json' -d '{"status":"concluida"}'
curl -X DELETE http://localhost:3000/api/tasks/1
```

IDs dos exemplos dependem dos registros do seu banco. Listagem ordenada por ID decrescente. Filtros usam AND; valores inválidos, vazios, repetidos ou parâmetros desconhecidos retornam 400. Erros usam JSON com message; recurso inexistente retorna 404 e falha interna retorna 500 sem detalhes de SQL na resposta.

## Testes e evidências

```sh
npm test
```

A suíte usa SQLite em memória e arquivo temporário separado do banco local. O workflow API tests executa npm test duas vezes. Dois jobs do commit c567cffe13ac37426610898df3905bc3370b6173 passaram antes do merge do PR #28; isso não comprova testes de commits posteriores. Consulte o badge e os logs para o estado atual.

## Organização

src/routes associa endpoints; controllers valida e coordena respostas; validators/tasks.js centraliza contratos; models executa SQL parametrizado. src/database.js inicializa SQLite; src/app.js configura Express sem abrir porta; src/server.js inicia o processo. test/api.test.js contém os testes atuais.

## Fluxo de trabalho

| Branch | Finalidade | Destino do PR |
|---|---|---|
| feature/issue-XX-descricao | Funcionalidade e testes | develop |
| docs/issue-XX-descricao | Documentação | develop |
| fix/issue-XX-descricao | Correção | develop |
| develop | Integração | main após revisão da entrega |
| main | Marcos estáveis | Sem commits diretos de desenvolvimento |

Usar Conventional Commits, como feat(tasks): adicionar filtros (#14), fix(tasks): validar ID (#10) e docs: revisar entrega (#15). Relacionar PRs às issues. Como develop não é a branch padrão, conferir e fechar issues manualmente após revisão; não presumir fechamento automático.

A versão 0.1.0 identifica desenvolvimento. Tags anotadas vMAJOR.MINOR.PATCH devem ser criadas somente após validação do marco; nenhuma tag nova é criada por este documento.

## Documentação

- [Índice](docs/README.md)
- [Project Charter](docs/project-charter.md)
- [Requisitos](docs/requisitos.md)
- [Casos de uso](docs/casos-de-uso.md)
- [Histórias de usuário](docs/user-stories.md)
- [Arquitetura](docs/arquitetura.md)
- [Rastreabilidade](docs/rastreabilidade.md)
- [Checklist e evidências da entrega](docs/entrega.md)

## Pendências e limites

- Gerar e versionar package-lock.json real; atualmente a instalação usa npm install, não npm ci.
- Completar cobertura dos critérios da issue #15 e atualizar arquitetura/rastreabilidade com evidências específicas.
- Medir RNF10 no ambiente de execução e registrar resultados reais.
- Revisar e encerrar individualmente as issues #7 a #13; a implementação consolidada não fecha esses registros automaticamente.
- Validar o marco antes de promover develop para main ou criar tag de entrega.

Paginação, busca, interface gráfica, autenticação e implantação pública estão fora do escopo atual. Não há migração automática de esquemas antigos.
