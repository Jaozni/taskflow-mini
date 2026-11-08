# Validação da entrega — TaskFlow Mini

## Estado e escopo

O PR #43 foi integrado em develop; o PR #44 publicou a entrega em main. Os PRs #45 e #46 sincronizaram README, Charter e rastreabilidade. O merge do PR #46 é 0680baba609cfde957da6ece2038ce8804f9397f.

A tag anotada v0.1.0 permanece no merge do PR #44, d53bad270c2f0ad0415e7b9665e086f98dd2b187. Esta revisão documental não altera a tag, não modifica código nem fecha issues.

## Evidências automatizadas

Os dois checks do head 49e2795c54a980da4e73f3ddc365b86233190f6e do PR #46 terminaram com success antes do merge:
- https://github.com/Jaozni/taskflow-mini/actions/runs/42431830110
- https://github.com/Jaozni/taskflow-mini/actions/runs/42432731413

A aprovação se refere aos commits testados, não automaticamente a alterações posteriores.

## Organização implementada

- src/app.js: configuração do Express sem abrir porta e tratamento central de erros.
- src/server.js: ambiente, banco e início do servidor.
- src/config/env.js: validação de PORT e DATABASE_PATH.
- src/database.js: diretório, SQLite e esquema.
- src/routes/: endpoints.
- src/controllers/: coordenação das operações.
- src/models/: acesso aos dados.
- src/validators/: contratos de entrada.
- test/: testes automatizados.

## Evidências por requisito

| Requisito | Evidência e limite |
|---|---|
| RNF01, RNF04 | Testes de contrato, erros JSON e falhas controladas |
| RNF02 | Persistência após fechar e reabrir arquivo em test/api.test.js |
| RNF03 | test/delivery.test.js verifica texto SQL literal em cadastro/edição, leitura, filtro inválido e preservação da tabela; não é auditoria completa |
| RNF05 | test/delivery.test.js consulta git ls-files e rejeita dependências, ambientes privados e bancos rastreados; não audita todo o conteúdo e histórico |
| RNF06 | Aplicação utilizada sem iniciar server.js nos testes de API |
| RNF07 | Workflow documentado executa suíte duas vezes com bancos isolados |
| RNF08 | Lockfile e npm ci no CI Linux/Node 22; instalação local Windows não validada |
| RNF09 | test/startup.test.js cobre porta configurada/inválida; test/default-port.test.js inicia processo sem PORT e consulta /health em 127.0.0.1:3000 |
| RNF10 | test/performance.test.js realiza 18 medições sequenciais com HTTP real, SQLite temporário e até 100 tarefas; relatório em desempenho.md, execução local do usuário pendente |
| RNF11 | Separação de responsabilidades descrita acima e em arquitetura.md |

A matriz completa em rastreabilidade.md relaciona requisitos funcionais, casos de uso, histórias e issues. A existência de testes não comprova cobertura exaustiva de todos os critérios.

## Desempenho

Os 18 valores e o ambiente da execução histórica do commit 2d6b19846da126a65e10037b2ed610a405ca2bb9 estão transcritos em desempenho.md. Todas as medições atenderam ao limite de 2000 ms no runner registrado; a maior foi 9.905 ms. Não reutilizar como resultado de outro ambiente ou commit.

## Validação local e limitações

A instalação Windows/Node 24 apresentou falha em better-sqlite3. Na tentativa local posterior, Node v24.13.0 retornou Cannot find module 'supertest'. O teste não iniciou as medições.

Isso não demonstra lentidão da API, mas impede comprovar a validação local do RNF10. Resultados no runner não substituem essa evidência. Nenhuma execução local bem-sucedida está declarada nesta revisão.

Não há autenticação, implantação pública ou migração automática de bancos antigos. Testes SQL e revisão de nomes rastreados não equivalem a auditoria completa de segurança.

## Próximas verificações

- Conferir checks do novo commit documental antes da integração.
- Revisar critérios individuais das issues antes de atualizar checkboxes ou fechar registros.
- Concluir validação local em ambiente compatível e registrar SHA, comandos, ambiente e medições reais.
- Confirmar que a documentação final foi integrada em main antes da conferência de entrega.

[Arquitetura](arquitetura.md) · [Rastreabilidade](rastreabilidade.md) · [Checklist](entrega.md) · [Desempenho](desempenho.md)
