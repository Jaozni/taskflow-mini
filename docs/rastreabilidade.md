# Matriz de rastreabilidade — TaskFlow Mini

## Evidencias da revisao

PR #43; commit 434be3ada3d146b28cdd5cc6deabb04cd971a951. Dois jobs test aprovados:
- https://github.com/Jaozni/taskflow-mini/actions/runs/42425633119
- https://github.com/Jaozni/taskflow-mini/actions/runs/42425636821

Aprovacao da suite nao significa cobertura exaustiva de cada criterio. Alteracoes posteriores exigem nova consulta do CI.

## Requisitos funcionais

| Requisito | UC / US | Issues | Evidencia na suite |
|---|---|---|---|
| RF01 | UC01 / US01 | #9 | API e aceitacao: cadastro e padroes |
| RF02 | UC02 / US02 | #10 | API: listagem, ordem e vazia |
| RF03 | UC03 / US03 | #10 | API e aceitacao: consulta e 404 |
| RF04 | UC04 / US04 | #11 | Aceitacao: substituicao, preservacao e idempotencia |
| RF05 | UC05 / US05 | #12 | Aceitacao: conclusao, reabertura e repeticao |
| RF06 | UC06 / US06 | #13 | Aceitacao: exclusao por status, 204 e 404 |
| RF07 | UC02 / US07 | #14 | API: filtro status |
| RF08 | UC02 / US07 | #14 | API: filtro prioridade |
| RF09 | UC02 / US07 | #14 | API: filtros combinados e invalidos |
| RF10 | UC01, UC04, UC05 / US01, US04, US05 | #9, #11, #12 | Aceitacao: entradas invalidas sem alterar dados |
| RF11 | UC03 a UC06 / US03 a US06 | #10 a #13 | API e aceitacao: IDs invalidos |
| RF12 | UC01 a UC06 / US01 a US07 | #8 a #14 | API: reabertura de banco em arquivo |
| RF13 | Infraestrutura | #7, #8 | Startup: servidor real e falha SQLite; health na suite |
| RF14 | UC01 a UC06 e excecoes | #7, #9 a #14 | API e aceitacao: erros JSON e falhas internas |
| RF15 | UC01 a UC05 / US01 a US05, US07 | #9 a #12, #14 | Aceitacao: campos completos e listagem |

Arquivos: test/api.test.js, test/acceptance.test.js, test/startup.test.js e test/performance.test.js.

## Requisitos nao funcionais

| Requisito | Evidencia e limites |
|---|---|
| RNF01 | Contratos JSON, Content-Type e 204 na suite |
| RNF02 | Persistencia apos fechar e reabrir arquivo na suite |
| RNF03 | Revisao de src/models/tasks.js: placeholders para valores e condicoes fixas nos filtros; teste especifico de caracteres especiais ainda nao acrescentado |
| RNF04 | Falhas simuladas verificam resposta generica sem segredo SQL |
| RNF05 | .gitignore cobre node_modules, .env e bancos; auditoria completa de arquivos e historico ainda pendente |
| RNF06 | createApp utilizada sem abrir porta; testes de startup separados |
| RNF07 | Workflow executa suite duas vezes com bancos isolados |
| RNF08 | Lockfile 8c2a244 e npm ci 0456501 aprovados no CI Linux/Node 22; instalacao Windows/Node 24 falhou |
| RNF09 | Processo real com PORT configurada e invalida; padrao 3000 revisado no codigo, sem teste de bind padrao |
| RNF10 | 18 medicoes sequenciais no runner, HTTP e SQLite em arquivo, ate 100 tarefas, limite 2000 ms; tempos nos logs, transcricao numerica e execucao no computador do usuario pendentes |
| RNF11 | Separacao implementada descrita em arquitetura.md |

## Documentacao e workflow

Issues: #1 estrutura; #2 Project Charter; #3 requisitos; #4 casos de uso; #5 historias; #6 arquitetura/rastreabilidade; #15 README/testes/entrega. Referenciar PR e revisar criterios antes de encerrar issues. Nao foi realizado merge ou fechamento nesta revisao.

[Validacao detalhada](validacao-entrega.md) · [Checklist](entrega.md) · [Arquitetura](arquitetura.md) · [Requisitos](requisitos.md) · [Project Charter](project-charter.md) · [Casos de uso](casos-de-uso.md) · [Historias](user-stories.md)
