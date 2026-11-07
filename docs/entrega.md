# Checklist de entrega — TaskFlow Mini

## Evidências confirmadas

- PR #28 integrado em develop: https://github.com/Jaozni/taskflow-mini/pull/28
- Commit testado: c567cffe13ac37426610898df3905bc3370b6173.
- Merge: b4706bb3f8bcb5c5f1657154d66255c255dfd68b.
- Dois jobs test concluídos com success antes do merge.
- Execuções: https://github.com/Jaozni/taskflow-mini/actions/runs/42422647246 e https://github.com/Jaozni/taskflow-mini/actions/runs/42422647100.
- Issue #14 encerrada após integração.

Essas evidências são do commit indicado. Não comprovam execução de alterações posteriores nem atendimento integral de todos os requisitos.

## Revisão por bloco

| Bloco | Evidência disponível | O que falta conferir |
|---|---|---|
| #7 Express | app/server, health, JSON e CI integrado | Lockfile, teste de inicialização real e PORT |
| #8 SQLite | database.js e teste de reabertura de arquivo | Restrições SQL e falha de inicialização em testes específicos |
| #9 Cadastro | Controller/model/validator e cenários no CI | Matriz completa de entradas inválidas sem inserção |
| #10 Leitura | Listagem, ordenação, ID válido/inválido e 404 no CI | Campos completos e integridade em testes específicos |
| #11 Edição | Edição e preservação de status/data no CI | Descrição removida, idempotência, falhas e precedência |
| #12 Status | Conclusão, andamento e repetição no CI | Reabertura, inválidos, 404 e preservação de todos os campos |
| #13 Exclusão | 204 e repetição com 404 no CI | Todos os status, integridade das demais tarefas, IDs e falhas |
| #14 Filtros | Isolados, AND, vazios, repetidos e inválidos no CI | Concluída no escopo RF07–RF09 |
| #15 Entrega | Suíte, workflow e instruções existentes | Completar testes, badges/links, rastreabilidade e revisão final |

Não marcar todas as caixas de uma issue somente porque há um teste geral de CRUD.

## Pendências transversais

- [ ] Gerar package-lock.json com npm e versioná-lo; não fabricar entradas ou hashes.
- [ ] Executar npm ci em ambiente limpo após o lockfile.
- [ ] Ampliar testes para os critérios ainda não demonstrados acima.
- [ ] Atualizar docs/arquitetura.md para os caminhos reais e docs/rastreabilidade.md com as evidências.
- [ ] Registrar RNF10: ambiente, até 100 tarefas, três medições por operação, todas até 2 segundos.
- [ ] Revisar o resultado do CI do commit final.
- [ ] Revisar e encerrar issues atendidas, preservando o histórico dos critérios.
- [ ] Revisar integração de develop em main e eventual tag; não executar sem confirmação.

## Política de evidências

Documentar medições reais, comandos, ambiente e commit. Não atribuir sucesso ao CI antes da conclusão. Não marcar release publicada com base apenas em package.json. Não declarar licença aberta sem arquivo e decisão correspondentes.

[Requisitos](requisitos.md) · [Rastreabilidade](rastreabilidade.md) · [README](../README.md)
