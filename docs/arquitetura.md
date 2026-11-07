# Arquitetura — TaskFlow Mini

## Estado

Arquitetura planejada na issue #6. Este documento não comprova implementação ou execução de testes.

## Contexto e componentes

Usuário → cliente HTTP → API Node.js/Express → SQLite local. Não há interface gráfica, autenticação ou separação por usuário. A aplicação destina-se à execução local, não à exposição pública nesta versão.

## Organização proposta

```text
src/
  app.js
  server.js
  routes/tasks.js
  controllers/tasks.js
  models/tasks.js
  database/connection.js
  middleware/errors.js
  validators/tasks.js
tests/
data/ (não versionada)
```

- app.js configura e exporta a aplicação sem abrir porta.
- server.js inicializa o banco antes de aceitar requisições e utiliza PORT ou 3000.
- Rotas associam métodos e caminhos aos controladores.
- Controladores validam entradas e coordenam respostas.
- Validadores centralizam regras de ID, corpo e filtros.
- Modelos executam SQL parametrizado.
- database/connection.js cria a pasta local, abre o banco e inicializa o esquema sem apagar dados.
- O tratamento de erros retorna JSON com message, sem detalhes internos.
- Testes usam banco isolado, nunca o banco pessoal.

## Modelo de dados

| Campo | Tipo SQLite | Restrições e padrão |
|---|---|---|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT |
| title | TEXT | NOT NULL; título não vazio após remoção de espaços nas extremidades |
| description | TEXT | Aceita NULL; padrão NULL |
| priority | TEXT | NOT NULL; CHECK em baixa, media, alta; padrão media |
| status | TEXT | NOT NULL; CHECK em pendente, em_andamento, concluida; padrão pendente |
| created_at | TEXT | NOT NULL; data e hora UTC geradas automaticamente |

Não há relacionamentos com outras entidades. O banco fica em data/. A validação do backend complementa as restrições SQL e segue requisitos.md, incluindo rejeição de títulos com apenas espaços.

## Contratos HTTP

| Método | Rota | Finalidade | Sucesso |
|---|---|---|---|
| GET | /health | Saúde da aplicação | 200 |
| POST | /api/tasks | Cadastro | 201 |
| GET | /api/tasks | Listagem e filtros status/priority | 200 |
| GET | /api/tasks/:id | Consulta individual | 200 |
| PUT | /api/tasks/:id | Substituir campos editáveis | 200 |
| PATCH | /api/tasks/:id/status | Alterar somente status | 200 |
| DELETE | /api/tasks/:id | Exclusão permanente | 204 sem corpo |

Respostas de tarefa contêm id, title, description, priority, status e created_at. Listagens retornam array por ID decrescente, inclusive [] quando vazias. PUT exige title e priority; description omitida remove a descrição. Campos controlados pelo sistema não são editáveis. PATCH aceita somente status e permite todas as transições entre valores válidos.

Erros: 400 para entradas inválidas, 404 para recurso ou rota inexistente e 500 para falha interna. Formato: {"message":"Descrição do erro"}. Nas rotas com ID e corpo, validar ID, depois corpo e depois existência. JSON malformado pode ser rejeitado antes. Filtros combinados utilizam AND; filtros vazios, repetidos ou desconhecidos são rejeitados.

## Fluxo de branches

| Branch | Uso | Integração |
|---|---|---|
| main | Marcos estáveis e branch padrão | PR de develop |
| develop | Integração do desenvolvimento | PR de branch temática |
| feature/issue-XX-descricao | Funcionalidades/configuração | PR para develop |
| docs/issue-XX-descricao | Documentação | PR para develop |
| fix/issue-XX-descricao | Correções | PR para develop |

Não fazer commits diretamente na main. Usar Conventional Commits pequenos e referências às issues. Registrar Closes #N no PR; como develop não é a branch padrão, não presumir fechamento automático ao integrar nela. Registrar o PR na issue e fechar manualmente após revisão dos critérios.

Exceção inicial: main e develop foram criadas a partir do commit da issue #1, sem PR por ausência de diferenças. A exceção está registrada na issue.

## Versionamento e verificação

Marcos validados receberão tags Git anotadas no formato vMAJOR.MINOR.PATCH, respeitando SemVer. Não criar tag de marco estável antes da verificação correspondente. Commits e testes futuros não devem ser apresentados como já executados.

A versão inicial 0.1.0 do package.json identifica desenvolvimento; não comprova release publicada. A documentação de execução e os links serão consolidados no README na issue #15.

## Referências internas

- [Requisitos](requisitos.md)
- [Casos de uso](casos-de-uso.md)
- [Histórias](user-stories.md)
- [Rastreabilidade](rastreabilidade.md)
