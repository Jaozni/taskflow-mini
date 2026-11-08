# Checklist de entrega — TaskFlow Mini

## Estado consolidado

PR #43, branch feature/issue-15-testes-readme. Alterações ainda não integradas nesta revisão. Não apresentar main ou develop como contendo a entrega antes do merge confirmado.

## Histórico de evidências

- PR #28 integrado em develop: https://github.com/Jaozni/taskflow-mini/pull/28
- Commit anterior testado: c567cffe13ac37426610898df3905bc3370b6173; merge b4706bb3f8bcb5c5f1657154d66255c255dfd68b.
- Execuções anteriores aprovadas: https://github.com/Jaozni/taskflow-mini/actions/runs/42422647246 e https://github.com/Jaozni/taskflow-mini/actions/runs/42422647100. Issue #14 encerrada após integração.
- 8c2a244: lockfile real gerado pelo npm.
- 0456501: instalação limpa via npm ci no CI Linux/Node 22.
- f02995f: teste de desempenho HTTP real e SQLite em arquivo.
- 434be3a: inicialização real, PORT inválida e falha SQLite.
- a08ceb9: texto SQL literal e nomes de arquivos rastreados; jobs aprovados https://github.com/Jaozni/taskflow-mini/actions/runs/42426116997 e https://github.com/Jaozni/taskflow-mini/actions/runs/42426120857.
- 2d6b19846da126a65e10037b2ed610a405ca2bb9: commit do log fornecido pelo usuário; 14 testes aprovados, zero falhas e 18 medições RNF10 dentro do limite.
- fd4135e002d65fd50b888a99c049925068ef3665: relatório numérico registrado em desempenho.md; jobs aprovados https://github.com/Jaozni/taskflow-mini/actions/runs/42426945269 e https://github.com/Jaozni/taskflow-mini/actions/runs/42426949402.

Estes resultados pertencem aos commits indicados. O commit que atualiza este checklist exige sua própria verificação do CI.

## Checklist atualizado

- [x] Gerar e versionar package-lock.json com npm, sem inventar hashes.
- [x] Validar npm ci em runner limpo Linux/Node 22.
- [x] Ampliar testes de contrato, integridade, restrições, erros e inicialização.
- [x] Atualizar arquitetura e rastreabilidade para os caminhos implementados.
- [x] Verificar texto com aparência SQL tratado como dado e preservação da tabela.
- [x] Verificar nomes rastreados: sem node_modules, ambientes privados ou bancos locais.
- [x] Adicionar RNF10 automatizado com seis operações, três medições, até 100 tarefas e limite de 2000 ms.
- [x] Registrar ambiente e as 18 medições reais em [desempenho.md](desempenho.md).
- [x] Sincronizar README com lockfile, PowerShell, testes e limites conhecidos.
- [x] Conferir os dois jobs do commit fd4135e como success.
- [ ] Validar instalação e desempenho local conforme RNF10; runner não comprova execução no computador do usuário.
- [ ] Testar bind real sem PORT na porta padrão 3000; valor padrão revisado no código.
- [ ] Conferir CI do último commit antes da integração.
- [ ] Revisar individualmente critérios das issues antes de encerrar registros.
- [ ] Autorizar separadamente merge em develop, integração em main e eventual tag.

## Revisão por bloco

| Bloco | Evidência disponível | Limite da conclusão |
|---|---|---|
| #7 Express | Health, JSON, servidor real e PORT configurada/inválida | Bind padrão ainda não testado |
| #8 SQLite | Reabertura de arquivo, restrições SQL e falha de inicialização | Não equivale a auditoria completa |
| #9 Cadastro | Contrato e inválidos sem inserção | Cobertura não declarada exaustiva |
| #10 Leitura | Listagem, ordem, filtros, campos e integridade | Revisão individual da issue antes de fechar |
| #11 Edição | Substituição, remoção de descrição, preservação e idempotência | Revisão individual da issue antes de fechar |
| #12 Status | Conclusão, reabertura, repetição, inválidos e preservação | Revisão individual da issue antes de fechar |
| #13 Exclusão | Todos os status, 204/404, IDs e preservação das demais | Revisão individual da issue antes de fechar |
| #14 Filtros | Isolados, AND, vazios, repetidos e inválidos | Integração anterior registrada acima |
| #15 Entrega | Lockfile, CI, testes, README, documentação e medições registradas | Validação local e integração ainda pendentes |

## RNF10 e limites conhecidos

[Relatório de desempenho](desempenho.md): 18 de 18 medições <= 2000 ms; maior valor 9.905 ms. Node v22.23.4, Linux x64, CPU AMD EPYC 7763, SQLite em arquivo temporário. Evidência do runner, não do Windows do usuário. As antigas menções a transcrição numérica pendente em outros documentos foram superadas por esse relatório para o commit medido.

Instalação Windows/Node 24 não concluída: better-sqlite3 11.7.0 não encontrou binário pronto e a compilação falhou por falta de ferramentas C++. Verificação de git ls-files cobre nomes atuais, não segredos no conteúdo ou histórico. Testes SQL não substituem auditoria de segurança. Não há autenticação, interface gráfica, migração de esquemas ou implantação pública nesta entrega.

## Política de evidências

Registrar ambiente, comando, commit e resultado real. Não inventar tempos nem antecipar sucesso do CI. package.json não comprova release; não declarar licença aberta sem arquivo e decisão. Não realizar merge, tag ou fechamento sem autorização correspondente.

[Índice](README.md) · [Validação](validacao-entrega.md) · [Desempenho](desempenho.md) · [Requisitos](requisitos.md) · [Rastreabilidade](rastreabilidade.md) · [README principal](../README.md)
