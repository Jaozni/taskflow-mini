# Desempenho — RNF10

## Origem e escopo

Transcricao do log de npm test fornecido pelo responsavel pelo projeto em 07/11/2026. Commit registrado no proprio diagnostico: 2d6b19846da126a65e10037b2ed610a405ca2bb9. O trecho fornecido nao identifica qual dos dois jobs nem qual repeticao do workflow foi copiada; nao atribuir estas medicoes a um job especifico sem verificar.

Execucoes aprovadas associadas ao commit:
- https://github.com/Jaozni/taskflow-mini/actions/runs/42426328684
- https://github.com/Jaozni/taskflow-mini/actions/runs/42426332649

Comando: npm test (node --test). Arquivo: test/performance.test.js. A suite completa registrou 14 testes aprovados, zero falhas, cancelamentos ou testes ignorados; duracao total 1265.206183 ms. A duracao do subteste RNF10 foi 226.062984 ms; ela nao e a latencia de uma requisicao individual.

## Ambiente informado pelo teste

| Item | Valor |
|---|---|
| Node.js | v22.23.4 |
| Sistema | linux 7.0.0-1019-azure |
| Arquitetura | x64 |
| CPU | AMD EPYC 7763 64-Core Processor |
| Banco | SQLite em arquivo temporario |
| Concorrencia das requisicoes medidas | 1 |
| Maximo de tarefas | 100 |
| Limite individual | 2000 ms |

## Metodo

Servidor HTTP real em loopback, iniciado antes das medicoes. Health verificado antes de medir. Base inicial de 97 tarefas; os tres cadastros elevam o total a 100. As demais operacoes ocorrem com ate 100 registros. Cada operacao e executada tres vezes consecutivas; as exclusoes usam IDs diferentes. Respostas HTTP esperadas sao verificadas. O tempo usa performance.now() e inclui a requisicao Supertest e sua verificacao. O teste nao e ensaio de carga; outros arquivos da suite podem executar simultaneamente no runner, embora as 18 requisicoes deste teste sejam sequenciais.

## Resultados reais

Unidade: milissegundos. Valores transcritos sem substituir por medias.

| Operacao | Medicao 1 | Medicao 2 | Medicao 3 | Todas <= 2000 ms |
|---|---:|---:|---:|---|
| Criar | 9.905 | 3.868 | 3.408 | Sim |
| Listar | 2.958 | 2.969 | 2.722 | Sim |
| Consultar por ID | 1.965 | 3.123 | 2.010 | Sim |
| Editar | 3.322 | 2.675 | 2.714 | Sim |
| Alterar status | 2.858 | 3.608 | 2.920 | Sim |
| Excluir | 2.761 | 2.895 | 2.698 | Sim |

As 18 medicoes atendem ao limite no ambiente registrado. A maior foi 9.905 ms, no primeiro cadastro.

## Limites da conclusao

O runner Linux do GitHub executou a aplicacao e o cliente no mesmo ambiente. Isso comprova o resultado automatizado nesse runner, nao desempenho no computador Windows do usuario, sob rede externa, com concorrencia ou com mais de 100 tarefas. A instalacao local Windows/Node 24 falhou e nao foi validada. O RNF10 exige execucao local: esta evidencia deve ser apresentada como CI, sem declarar cumprimento integral da parte local no computador do usuario.

As mensagens SQL segredo e segredo SQL no log pertencem a falhas simuladas dos testes de contrato; os respectivos testes terminaram com sucesso. Nao sao medicoes nem dados reais de producao.

## Reproducao em ambiente compativel

```sh
npm ci
node --test test/performance.test.js
```

Registrar o SHA com git rev-parse HEAD, ambiente e 18 valores da nova execucao. Nao reaproveitar estes numeros como resultado de outro commit ou computador.

Este relatorio substitui a pendencia de transcricao numerica para o commit medido, mas nao altera automaticamente checkboxes antigos. A validacao local permanece pendente.

[Requisitos](requisitos.md) · [Checklist](entrega.md) · [Rastreabilidade](rastreabilidade.md) · [Validacao](validacao-entrega.md)
