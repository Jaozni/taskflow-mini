# Matriz de rastreabilidade — TaskFlow Mini

## Base da revisão

Revisão documental baseada no conteúdo integrado pelo PR #44, commit d53bad270c2f0ad0415e7b9665e086f98dd2b187. Os dois jobs test do PR foram aprovados para o head 595643b429bdc4c052f2fd180e9e63653781134b antes do merge. Essa aprovação não significa cobertura exaustiva de todos os critérios nem comprova execução no computador do usuário.

## Requisitos funcionais

| Requisito | UC / US | Issues | Evidência descrita na suíte |
|---|---|---|---|
| RF01 | UC01 / US01 | #9 | Cadastro e valores padrão |
| RF02 | UC02 / US02 | #10 | Listagem, ordenação e lista vazia |
| RF03 | UC03 / US03 | #10 | Consulta e tarefa inexistente |
| RF04 | UC04 / US04 | #11 | Substituição, preservação e idempotência |
| RF05 | UC05 / US05 | #12 | Conclusão, reabertura e repetição |
| RF06 | UC06 / US06 | #13 | Exclusão por status, 204 e 404 |
| RF07 | UC02 / US07 | #14 | Filtro por status |
| RF08 | UC02 / US07 | #14 | Filtro por prioridade |
| RF09 | UC02 / US07 | #14 | Filtros combinados e inválidos |
| RF10 | UC01, UC04, UC05 / US01, US04, US05 | #9, #11, #12 | Entradas inválidas sem alteração de dados |
| RF11 | UC03 a UC06 / US03 a US06 | #10 a #13 | Identificadores inválidos |
| RF12 | UC01 a UC06 / US01 a US07 | #8 a #14 | Reabertura de banco em arquivo |
| RF13 | Infraestrutura | #7, #8 | Saúde e inicialização |
| RF14 | UC01 a UC06 e exceções | #7, #9 a #14 | Erros JSON e falhas internas |
| RF15 | UC01 a UC05 / US01 a US05, US07 | #9 a #12, #14 | Campos completos das respostas |

A matriz indica onde procurar as evidências; não substitui a revisão individual dos testes e critérios antes de encerrar issues.

## Requisitos não funcionais

| Requisito | Evidência e limites |
|---|---|
| RNF01 | Contratos JSON, Content-Type e respostas 204 descritos na suíte |
| RNF02 | Teste de persistência após fechar e reabrir arquivo |
| RNF03 | Modelo com parâmetros SQL conforme revisão anterior; test/delivery.test.js verifica cadastro, leitura e edição de texto com aparência SQL, rejeição de filtro malicioso e preservação da tabela. Não equivale a auditoria completa de segurança |
| RNF04 | Falhas simuladas verificam resposta genérica sem detalhes SQL |
| RNF05 | test/delivery.test.js consulta git ls-files e rejeita dependências, arquivos privados de ambiente e bancos rastreados. Não examina todo o conteúdo nem o histórico em busca de segredos |
| RNF06 | Aplicação utilizada sem iniciar o servidor nos testes de API; inicialização testada separadamente |
| RNF07 | Workflow documentado executa a suíte duas vezes com bancos isolados |
| RNF08 | Instalação limpa documentada no CI Linux/Node 22; instalação Windows/Node 24 não validada |
| RNF09 | test/default-port.test.js remove PORT, inicia src/server.js em processo real e consulta /health em 127.0.0.1:3000; testes de startup tratam a porta configurada e inválida |
| RNF10 | As 18 medições históricas e o ambiente estão transcritos em desempenho.md. Resultados do runner não comprovam a execução local exigida no computador do usuário, que permanece pendente |
| RNF11 | Separação de responsabilidades descrita em arquitetura.md |

## Desempenho

O relatório desempenho.md registra medições do commit 2d6b19846da126a65e10037b2ed610a405ca2bb9: seis operações, três medições por operação, até 100 tarefas e requisições sequenciais. Todas ficaram abaixo de 2000 ms no ambiente registrado. Não atribuir esses números a outro commit ou computador.

A transcrição numérica está concluída para aquela execução histórica. A validação local do RNF10 permanece pendente.

## Documentação e workflow

Issues: #1 estrutura; #2 Project Charter; #3 requisitos; #4 casos de uso; #5 histórias; #6 arquitetura/rastreabilidade; #15 README/testes/entrega.

O PR #43 integrou a entrega de testes e documentação em develop; o PR #44 integrou develop em main. Esta atualização não fecha issues, não cria tags e não altera o código da aplicação.

Conferir os critérios e registrar as evidências antes de atualizar checkboxes ou encerrar registros. Novos commits exigem nova conferência do CI.

[Desempenho](desempenho.md) · [Validação](validacao-entrega.md) · [Checklist](entrega.md) · [Arquitetura](arquitetura.md) · [Requisitos](requisitos.md) · [Project Charter](project-charter.md) · [Casos de uso](casos-de-uso.md) · [Histórias](user-stories.md)
