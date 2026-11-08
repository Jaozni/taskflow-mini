# Validacao da entrega — PR #43

## Evidencias existentes

- Lockfile gerado com npm pelo usuario: commit 8c2a244.
- Workflow alterado para npm ci: commit 0456501.
- Teste RNF10 com SQLite em arquivo e HTTP real: commit f02995f24cbaf931e725d7b1bfa2fc25bb5cd8aa.
- Jobs test confirmados como success: https://github.com/Jaozni/taskflow-mini/actions/runs/42425412282 e https://github.com/Jaozni/taskflow-mini/actions/runs/42425407598.
- Estas execucoes sao anteriores aos novos testes de inicializacao deste documento. O CI do novo commit precisa ser consultado antes da integracao.

## Organizacao implementada

- src/app.js configura Express, rotas e tratamento de erros, sem abrir porta.
- src/server.js carrega ambiente, abre o banco e depois inicia listen.
- src/config/env.js valida PORT e DATABASE_PATH; porta padrao 3000.
- src/database.js cria diretorio, abre SQLite e inicializa esquema.
- src/routes/tasks.js encaminha operacoes para controladores e modelos.
- src/routes/health.js implementa verificacao de saude.
- src/controllers/tasks.js coordena operacoes; src/models/tasks.js acessa SQLite.
- test/acceptance.test.js cobre contrato, validacoes, integridade, transicoes, erros e restricoes SQL.
- test/api.test.js contem os testes existentes de API e persistencia.
- test/performance.test.js mede seis operacoes, tres vezes cada, sem concorrencia e com no maximo 100 tarefas.
- test/startup.test.js inicia processos reais para PORT configurada, PORT invalida e falha SQLite.

Esta organizacao corrige os caminhos planejados database/connection.js e tests/ da arquitetura original: os caminhos implementados sao src/database.js e test/. O middleware de erros esta em src/app.js.

## Rastreabilidade complementar

| Requisito | Evidencia e limite |
|---|---|
| RNF01, RNF04 | acceptance.test.js: contrato e falhas controladas |
| RNF02 | api.test.js: persistencia apos reabrir arquivo |
| RNF06 | createApp utilizado sem iniciar server.js |
| RNF07 | Workflow executa npm test duas vezes |
| RNF08 | Lockfile e npm ci no runner Linux com Node 22; nao comprova instalacao local Windows |
| RNF09 | startup.test.js cobre PORT definida e invalida; valor padrao revisado no codigo, sem teste de bind real em 3000 |
| RNF10 | performance.test.js: 18 medicoes com limite de 2000 ms; resultados numericos ficam nos logs dos jobs |
| RNF11 | Separacao de app, servidor, rotas, controladores, modelos e banco descrita acima |

## Limites e pendencias honestas

- A instalacao local no Windows com Node 24 falhou no better-sqlite3 11.7.0; nao foi declarada concluida.
- O teste de desempenho no runner e evidencia automatizada de loopback local ao runner, nao de desempenho no computador do usuario. RNF10 pede execucao local; validar interpretacao e, se exigido, executar em ambiente local compativel.
- Nao foram copiados tempos numericos dos logs para este documento. Consultar os diagnosticos operation/run/milliseconds; nao inventar valores.
- RNF03 e RNF05 ainda exigem revisao especifica de SQL e arquivos rastreados antes de declarar cobertura integral.
- Nao foram realizados merge, fechamento de issues, publicacao de release ou tag.

## Verificacao do commit final

Aguardar ambos os jobs test do novo commit. Falhas devem ser corrigidas antes do merge. Registrar o SHA e links da execucao final apos a conclusao.

Este registro complementa [arquitetura](arquitetura.md), [rastreabilidade](rastreabilidade.md) e [checklist](entrega.md), sem transformar previsoes em evidencias.
