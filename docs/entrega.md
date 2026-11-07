# Checklist de entrega — TaskFlow Mini

## Evidencias confirmadas

### Integracao anterior

- PR #28 integrado em develop: https://github.com/Jaozni/taskflow-mini/pull/28
- Commit testado c567cffe13ac37426610898df3905bc3370b6173; merge b4706bb3f8bcb5c5f1657154d66255c255dfd68b.
- Execucoes aprovadas: https://github.com/Jaozni/taskflow-mini/actions/runs/42422647246 e https://github.com/Jaozni/taskflow-mini/actions/runs/42422647100.
- Issue #14 encerrada apos integracao.

### PR #43, ainda sem integracao nesta revisao

- 8c2a244: package-lock.json gerado pelo npm e enviado pelo usuario.
- 0456501: CI usa npm ci em Linux com Node 22.
- f02995f: teste de desempenho HTTP/SQLite em arquivo, ate 100 tarefas.
- 434be3a: testes de inicializacao real e registro de validacao.
- b16d533edf21a89c1c4aa08bbb2708e370bf0225: arquitetura e rastreabilidade consolidadas; dois jobs test aprovados:
  - https://github.com/Jaozni/taskflow-mini/actions/runs/42425913172
  - https://github.com/Jaozni/taskflow-mini/actions/runs/42425918447

Estas evidencias pertencem aos commits indicados. Novos testes em test/delivery.test.js ainda precisam passar no CI do commit que os adiciona.

## Revisao por bloco

| Bloco | Evidencia atual | Limites |
|---|---|---|
| #7 Express | Health, JSON, servidor real e PORT configurada/invalida | Bind real com PORT ausente em 3000 nao testado |
| #8 SQLite | Reabertura de arquivo, restricoes SQL e falha ao inicializar | Nao representa auditoria completa do banco |
| #9 Cadastro | Contrato e matriz de invalidos sem insercao | Nao declarar exaustividade de todas as entradas |
| #10 Leitura | Ordem, filtros, campos e integridade | Revisar criterios da issue antes de encerrar |
| #11 Edicao | Substituicao, descricao removida, preservacao e idempotencia | Revisar criterios da issue antes de encerrar |
| #12 Status | Conclusao, reabertura, repeticao, invalidos e preservacao | Revisar criterios da issue antes de encerrar |
| #13 Exclusao | Todos os status, 204/404, IDs e preservacao das demais | Revisar criterios da issue antes de encerrar |
| #14 Filtros | Isolados, AND, vazios, repetidos e invalidos | Integracao anterior registrada acima |
| #15 Entrega | Lockfile, npm ci, testes e documentos | Medicoes numericas, validacao local e revisao final pendentes |

## Checklist atualizado

- [x] Gerar lockfile com npm e versionar, sem hashes inventados.
- [x] Validar npm ci em runner limpo Linux/Node 22.
- [x] Ampliar testes de contrato, integridade, restricoes, erros e inicializacao.
- [x] Atualizar arquitetura e rastreabilidade para implementacao real.
- [x] Adicionar RNF10 automatizado: seis operacoes, tres medicoes, ate 100 tarefas, limite 2000 ms.
- [ ] Transcrever ambiente e 18 tempos reais dos logs para documento de desempenho.
- [ ] Confirmar RNF10 em execucao local conforme requisito; runner nao equivale ao computador do usuario.
- [ ] Validar os novos testes RNF03/RNF05 do commit atual.
- [ ] Conferir CI do ultimo commit antes de integrar.
- [ ] Revisar criterios e encerrar somente issues efetivamente atendidas apos integracao.
- [ ] Autorizar separadamente merge em develop, integracao em main e eventual tag.

## Limites importantes

Instalacao Windows/Node 24 nao concluida: better-sqlite3 11.7.0 nao encontrou binario pronto e compilacao falhou por ferramentas C++ ausentes. Nao foi declarada reproducibilidade local. A verificacao de git ls-files cobre nomes rastreados atuais, nao segredos no conteudo nem historico. Testes de parametrizacao nao substituem auditoria de seguranca.

## Politica de evidencias

Registrar comandos, ambiente, commit e resultados reais. Nao inventar tempos nem antecipar sucesso do CI. package.json nao comprova release; nao declarar licenca aberta sem arquivo/decisao. Nao fazer merge, tag ou fechamento de issues sem autorizacao correspondente.

[Validacao](validacao-entrega.md) · [Requisitos](requisitos.md) · [Rastreabilidade](rastreabilidade.md) · [README](../README.md)
