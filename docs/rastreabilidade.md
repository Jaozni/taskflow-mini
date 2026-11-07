# Matriz de rastreabilidade — TaskFlow Mini

## Estado

Mapeamento planejado na issue #6. Uma referência a uma issue não significa que a funcionalidade esteja implementada ou testada. As evidências serão preenchidas após execução real.

## Requisitos funcionais

| Requisito | Casos de uso | Histórias | Issues de implementação | Verificação prevista |
|---|---|---|---|---|
| RF01 | UC01 | US01 | #9 | Cadastro, padrões e persistência |
| RF02 | UC02 | US02 | #10 | Listagem ordenada e vazia |
| RF03 | UC03 | US03 | #10 | Consulta existente e inexistente |
| RF04 | UC04 | US04 | #11 | Substituição dos campos editáveis |
| RF05 | UC05 | US05 | #12 | Transições e repetição do status |
| RF06 | UC06 | US06 | #13 | Exclusão, 204 e repetição |
| RF07 | UC02 | US07 | #14 | Filtro por status |
| RF08 | UC02 | US07 | #14 | Filtro por prioridade |
| RF09 | UC02 | US07 | #14 | Filtros combinados e inválidos |
| RF10 | UC01, UC04, UC05 | US01, US04, US05 | #9, #11, #12 | Entradas inválidas sem alteração de dados |
| RF11 | UC03 a UC06 | US03 a US06 | #10 a #13 | IDs inválidos e limite seguro |
| RF12 | UC01 a UC06 | US01 a US07 | #8 e operações #9 a #14 | Reinício preservando registros |
| RF13 | Infraestrutura, sem UC de negócio | Infraestrutura, sem US de negócio | #7, #8 | Health e inicialização do banco antes de listen |
| RF14 | UC01 a UC06 e exceções comuns | US01 a US07 e critérios transversais | #7, #9 a #14 | 400, 404, 500 e mensagens JSON |
| RF15 | UC01 a UC05 | US01 a US05, US07 | #9 a #12, #14 | Campos da tarefa e arrays |

A issue #15 cobre a suíte automatizada dos comportamentos principais. A preservação após reinício também exige verificação com banco em arquivo.

## Requisitos não funcionais

| Requisito | Issues relacionadas | Método de verificação | Evidência atual |
|---|---|---|---|
| RNF01 | #7, #9 a #15 | Testes de JSON, Content-Type e 204 sem corpo | Pendente |
| RNF02 | #8, #15 | Cadastrar, fechar, reabrir o mesmo banco e consultar | Pendente |
| RNF03 | #8 a #15 | Revisão de SQL parametrizado e entradas com caracteres especiais | Pendente |
| RNF04 | #7, #9 a #15 | Falha interna controlada sem detalhes na resposta | Pendente |
| RNF05 | #1, #8, #15 | Revisão de .gitignore e arquivos rastreados | Verificação final pendente |
| RNF06 | #7, #15 | Usar app nos testes sem executar server.js | Pendente |
| RNF07 | #15 | Rodar suíte duas vezes com banco isolado | Pendente |
| RNF08 | #7, #8, #15 | Reproduzir instalação em cópia limpa e registrar Node utilizado | Pendente |
| RNF09 | #7, #15 | Iniciar com PORT e sem PORT | Pendente |
| RNF10 | #9 a #15 | Até 100 tarefas; três medições por operação; registrar ambiente; todas até 2 segundos | Pendente |
| RNF11 | #6 a #15 | Revisar separação de responsabilidades dos módulos | Pendente de implementação |

## Documentação e workflow

| Artefato | Issue |
|---|---|
| Estrutura inicial | #1 |
| Project Charter | #2 |
| Requisitos | #3 |
| Casos de uso | #4 |
| Histórias | #5 |
| Arquitetura e esta matriz | #6 |
| README consolidado e testes | #15 |

Cada PR deve referenciar a issue correspondente. Após integração e verificação dos critérios, registrar o PR na issue. Não marcar critérios de implementação ou testes apenas porque a documentação foi criada.

## Referências

- [Project Charter](project-charter.md)
- [Requisitos](requisitos.md)
- [Casos de uso](casos-de-uso.md)
- [Histórias](user-stories.md)
- [Arquitetura](arquitetura.md)
