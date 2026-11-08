# Checklist de entrega — TaskFlow Mini

## Estado consolidado

- PR #43 integrado em develop: entrega de testes e documentação.
- PR #44 integrado em main no commit d53bad270c2f0ad0415e7b9665e086f98dd2b187.
- Tag anotada v0.1.0 publicada nesse commit conforme saída do push apresentada pelo responsável.
- PR #45 integrado em develop: sincronização de README, Charter e rastreabilidade.
- PR #46 integrado em main no commit 0680baba609cfde957da6ece2038ce8804f9397f.

A tag identifica o marco do PR #44, não as revisões documentais posteriores. Não mover a tag para incluir novas alterações.

## Evidências de CI

Os dois jobs test do PR #44 passaram para o head 595643b429bdc4c052f2fd180e9e63653781134b antes do merge. O PR #45 teve teste aprovado para o head 636d4b37ffd474a9ca0f92d16ef8b6a4555cfea2. No PR #46, os dois checks retornaram success para o head 49e2795c54a980da4e73f3ddc365b86233190f6e.

Execuções associadas ao head do PR #46:
- https://github.com/Jaozni/taskflow-mini/actions/runs/42431830110
- https://github.com/Jaozni/taskflow-mini/actions/runs/42432731413

Esses resultados não antecipam a aprovação deste documento ou de commits futuros.

## Checklist

- [x] Estrutura com docs/, src/, README.md e .gitignore.
- [x] Project Charter, requisitos, casos de uso e histórias de usuário publicados.
- [x] Backlog com 15 issues, labels e critérios de aceite.
- [x] package-lock.json versionado e instalação limpa documentada no CI.
- [x] Testes automatizados e execução repetida no workflow.
- [x] Teste de texto com aparência SQL e preservação da tabela.
- [x] Teste de nomes rastreados para dependências, ambientes privados e bancos.
- [x] Teste real sem PORT na porta 3000 em test/default-port.test.js.
- [x] Teste RNF10 com seis operações, três medições por operação e até 100 tarefas.
- [x] Ambiente e 18 medições históricas registrados em desempenho.md.
- [x] README, Charter e matriz sincronizados pelos PRs #45 e #46.
- [x] Marco integrado em main pelo PR #44 e tag v0.1.0 publicada.
- [ ] Concluir e registrar instalação e desempenho local no Windows.
- [ ] Revisar individualmente critérios e evidências antes de fechar issues.
- [ ] Revisar PRs abertos repetidos ou substituídos.
- [ ] Conferir CI do commit final desta atualização documental.
- [ ] Confirmar acesso do avaliador ao repositório e envio no Teams pelo responsável.

## RNF10

O relatório desempenho.md registra o commit 2d6b19846da126a65e10037b2ed610a405ca2bb9: 18 medições até 2000 ms, maior valor 9.905 ms, em runner Linux/Node 22 com SQLite temporário. A transcrição está concluída para aquela execução. Não atribuir esses números a outro commit ou computador.

A execução local do usuário permanece sem validação. Na tentativa local apresentada, Node v24.13.0 não encontrou supertest e o teste não chegou às medições. Isso é falha de preparação do ambiente, não reprovação por latência.

## Limites

A instalação Windows/Node 24 já apresentou falha na dependência nativa better-sqlite3. Resultados do runner não comprovam instalação ou desempenho no computador do usuário.

Testes de SQL não equivalem a auditoria completa de segurança. Verificação de nomes rastreados não procura segredos em todo o conteúdo e histórico. Não há autenticação, interface gráfica, migração automática de esquemas ou implantação pública.

## Política de evidências

Registrar ambiente, comando, commit e resultado real. Não inventar medições, antecipar checks, marcar critérios não conferidos ou declarar envio no Teams sem confirmação.

[Índice](README.md) · [Validação](validacao-entrega.md) · [Desempenho](desempenho.md) · [Requisitos](requisitos.md) · [Rastreabilidade](rastreabilidade.md) · [README principal](../README.md)
