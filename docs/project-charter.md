# Project Charter — TaskFlow Mini

## 1. Justificativa

O acompanhamento de atividades pessoais pode se tornar confuso
quando as tarefas ficam distribuídas em anotações e listas
sem uma estrutura padronizada.

O TaskFlow Mini propõe uma API REST para centralizar o cadastro
e o acompanhamento dessas tarefas, permitindo organizar
prioridades e identificar atividades pendentes, em andamento
e concluídas.

O projeto também tem finalidade acadêmica: exercitar a
especificação de software, a rastreabilidade entre documentação
e implementação e o uso disciplinado de Git e GitHub.

## 2. Visão geral do produto

O TaskFlow Mini será uma API de gerenciamento individual
de tarefas, desenvolvida com Node.js, Express e SQLite.

A API será acessada por um cliente HTTP. Não haverá interface
gráfica nem autenticação nesta versão.

Cada tarefa terá:

- Identificador.
- Título.
- Descrição opcional.
- Prioridade.
- Status.
- Data de criação.

## 3. Objetivos SMART

O período planejado é de 7 dias, contado a partir do início
do desenvolvimento.

| ID | Objetivo | Critério de sucesso | Prazo |
|---|---|---|---|
| OBJ01 | Documentar a concepção e as regras do produto | Publicar Project Charter, requisitos, casos de uso, histórias, arquitetura e matriz de rastreabilidade em docs/ | Até o dia 3 |
| OBJ02 | Implementar as operações centrais da API | Disponibilizar cadastro, listagem, consulta por ID, edição, alteração de status e exclusão | Até o dia 6 |
| OBJ03 | Implementar filtros e persistência | Filtrar por status e prioridade, isolados e combinados, e manter os dados após reiniciar a aplicação | Até o dia 6 |
| OBJ04 | Validar os comportamentos principais | Executar com sucesso a suíte de testes prevista na issue #15, utilizando banco separado | Até o dia 7 |
| OBJ05 | Consolidar a entrega rastreável | Revisar README e matriz de rastreabilidade, registrar as entregas em commits vinculados às issues e publicar uma tag anotada de versão | Até o dia 7 |

## 4. Escopo desta semana

### Dentro do escopo

- API REST com respostas em JSON.
- Cadastro de tarefas.
- Listagem de tarefas.
- Consulta de tarefa por ID.
- Edição de título, descrição e prioridade.
- Alteração de status.
- Exclusão permanente de tarefas.
- Filtros por status e prioridade.
- Validação de entradas.
- Persistência local em SQLite.
- Endpoint de saúde da aplicação.
- Testes automatizados dos comportamentos principais.
- Documentação em Markdown.
- Backlog com pelo menos 15 issues.
- Branches temáticas, commits vinculados às issues e PRs
  para integração após a inicialização do repositório.
- Tag de versão anotada para um marco validado.

### Fora do escopo desta semana

- Interface web ou aplicativo móvel.
- Cadastro de usuários, login e autenticação.
- Colaboração e compartilhamento de tarefas.
- Notificações.
- Integrações com calendários e serviços externos.
- Relatórios avançados.
- Paginação.
- Hospedagem pública da API.
- Pipeline de CI/CD.
- Histórico de alterações e recuperação de tarefas excluídas.

## 5. Stakeholders

| Stakeholder | Papel e interesse |
|---|---|
| Estudante desenvolvedor | Planejar, implementar, testar e documentar a solução |
| Professor/orientador | Avaliar o projeto e oferecer feedback sobre documentação, arquitetura e workflow |
| Usuário-alvo | Organizar tarefas pessoais e acompanhar prioridades e status |

## 6. Público-alvo

Pessoas que desejam organizar tarefas individuais.

Nesta versão acadêmica, o uso direto exige familiaridade
com um cliente HTTP, pois não haverá interface gráfica.

## 7. Premissas

- O desenvolvimento será individual.
- A aplicação será executada localmente.
- O ambiente terá Node.js, npm e Git disponíveis.
- O SQLite será utilizado como banco local.
- A versão não realizará separação de dados por usuário.
- O README registrará os pré-requisitos efetivamente utilizados.

## 8. Restrições

- Prazo planejado de uma semana.
- Escopo reduzido às funcionalidades descritas neste documento.
- Não utilização de serviços pagos obrigatórios.
- Nenhuma credencial ou variável de ambiente sensível
  deverá ser versionada.

## 9. Riscos e respostas

| Risco | Resposta planejada |
|---|---|
| Escopo maior que o prazo disponível | Manter funcionalidades adicionais fora desta versão |
| Dificuldade com dependência do SQLite | Verificar compatibilidade com a versão instalada do Node.js antes da implementação |
| Divergência entre documentos e código | Atualizar a matriz de rastreabilidade e revisar os critérios em cada entrega |
| Problemas de integração entre branches | Integrar mudanças pequenas por PR e verificar o resultado antes de prosseguir |

## 10. Marcos de entrega

| Marco | Resultado esperado |
|---|---|
| M1 | Estrutura inicial e backlog cadastrados |
| M2 | Documentação de planejamento concluída |
| M3 | Servidor e persistência configurados |
| M4 | Operações de tarefas e filtros implementados |
| M5 | Testes executados, README revisado e versão marcada |

## 11. Critérios gerais de conclusão

- Funcionalidades do escopo implementadas e verificadas.
- Dados preservados após reiniciar a aplicação.
- Testes principais executados com sucesso.
- README coerente com o estado real do projeto.
- Documentação e matriz de rastreabilidade atualizadas.
- Limitações conhecidas registradas.
- Marco validado identificado por tag anotada.

## 12. Rastreabilidade

Este documento atende à issue #2.

Os requisitos detalhados serão definidos em requisitos.md,
na issue #3. Os demais documentos desdobrarão esses requisitos
em casos de uso, histórias e itens de implementação.