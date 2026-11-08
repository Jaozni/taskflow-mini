# Project Charter — TaskFlow Mini

## 1. Justificativa e visão do produto

Tarefas pessoais distribuídas entre anotações e listas dificultam o acompanhamento de prioridades e andamento. O TaskFlow Mini centraliza essas informações em uma API REST individual com Node.js, Express e SQLite.

O projeto acadêmico exercita especificação, rastreabilidade e uso disciplinado de Git e GitHub. O acesso ocorre por cliente HTTP, sem interface gráfica ou autenticação nesta versão. Cada tarefa possui identificador, título, descrição opcional, prioridade, status e data de criação.

## 2. Objetivos SMART

Período planejado: sete dias a partir do início do desenvolvimento. Os prazos abaixo são metas do planejamento, não declarações automáticas de conclusão.

| ID | Objetivo | Critério de sucesso | Prazo |
|---|---|---|---|
| OBJ01 | Documentar a concepção e as regras | Publicar Charter, requisitos, casos de uso, histórias, arquitetura e rastreabilidade | Dia 3 |
| OBJ02 | Implementar operações centrais | Disponibilizar cadastro, listagem, consulta, edição, status e exclusão | Dia 6 |
| OBJ03 | Implementar filtros e persistência | Filtrar por status/prioridade e preservar dados após reinício | Dia 6 |
| OBJ04 | Validar os comportamentos principais | Executar com sucesso a suíte da issue #15 com banco separado | Dia 7 |
| OBJ05 | Consolidar a entrega rastreável | Revisar README/matriz, vincular commits às issues e publicar tag anotada | Dia 7 |

## 3. Escopo da semana

### Dentro do escopo

- API REST com JSON.
- Cadastro, listagem, consulta por ID, edição de título/descrição/prioridade, alteração de status e exclusão permanente.
- Filtros por status e prioridade.
- Validação de entradas e persistência local em SQLite.
- Endpoint de saúde e testes automatizados.
- Documentação Markdown e backlog com pelo menos 15 issues.
- Branches temáticas, commits vinculados e PRs de integração.
- Tag anotada para marco validado.

### Evolução registrada do planejamento

A automação de testes no GitHub Actions foi incorporada como melhoria de engenharia durante o desenvolvimento. O planejamento inicial excluía pipeline de CI/CD; esta revisão distingue a integração contínua com testes, agora presente, da implantação contínua, que permanece fora do escopo. A mudança não comprova execução local nem adiciona funcionalidades ao produto.

### Fora do escopo

- Interface web ou móvel.
- Cadastro de usuários, login, autenticação e compartilhamento.
- Notificações e integrações externas.
- Relatórios avançados e paginação.
- Hospedagem pública e implantação contínua.
- Histórico de alterações e recuperação de tarefas excluídas.

## 4. Stakeholders e público-alvo

| Stakeholder | Papel e interesse |
|---|---|
| Estudante desenvolvedor | Planejar, implementar, testar e documentar |
| Professor/orientador | Avaliar e oferecer feedback |
| Usuário-alvo | Organizar tarefas individuais por prioridade e status |

O uso direto exige familiaridade com cliente HTTP, pois não há interface gráfica.

## 5. Premissas e restrições

- Desenvolvimento individual em uma semana.
- Execução local com Node.js, npm e Git.
- Persistência SQLite, sem separação de dados por usuário.
- README com pré-requisitos efetivamente utilizados.
- Nenhum serviço pago obrigatório.
- Não versionar credenciais ou variáveis sensíveis.
- A compatibilidade local deve ser validada; resultados do CI não a substituem.

## 6. Riscos e respostas

| Risco | Resposta |
|---|---|
| Escopo maior que o prazo | Manter extras fora da versão |
| Incompatibilidade do SQLite | Verificar Node.js e dependência nativa; registrar falhas |
| Divergência documental | Sincronizar matriz, README e critérios com evidências |
| Problemas de integração | Integrar alterações pequenas por PR e conferir testes |

## 7. Marcos

| Marco | Resultado esperado |
|---|---|
| M1 | Estrutura e backlog |
| M2 | Documentação de planejamento |
| M3 | Servidor e persistência |
| M4 | Operações e filtros |
| M5 | Testes, README revisado e versão marcada |

## 8. Critérios de conclusão

- Funcionalidades do escopo implementadas e verificadas.
- Dados preservados após reinício.
- Testes principais aprovados.
- README e matriz coerentes com o projeto.
- Limitações registradas e marco identificado por tag anotada.

A validação local do RNF10 permanece pendente conforme desempenho.md. Publicar uma tag não comprova automaticamente todos os critérios.

## 9. Rastreabilidade

Documento associado à issue #2. Requisitos em requisitos.md; desdobramentos em casos-de-uso.md, user-stories.md e rastreabilidade.md. A sincronização desta revisão está relacionada à issue #15 e ao PR #45.
