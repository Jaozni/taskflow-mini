# TaskFlow Mini

![Versão declarada](https://img.shields.io/badge/versao-0.1.0-blue)
![Licença declarada](https://img.shields.io/badge/licenca-UNLICENSED-lightgrey)
[![Testes da main](https://github.com/Jaozni/taskflow-mini/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/Jaozni/taskflow-mini/actions/workflows/test.yml?query=branch%3Amain)

API REST local para gerenciamento de tarefas pessoais, desenvolvida com Node.js, Express e SQLite.

O projeto permite cadastrar, listar, consultar, editar, alterar o status e excluir tarefas, além de filtrar atividades por status e prioridade.

O desenvolvimento combina documentação de planejamento, requisitos rastreáveis, histórias de usuário, backlog de issues, branches temáticas, Pull Requests e testes automatizados.

## Sumário

- [Objetivo e escopo](#objetivo-e-escopo)
- [Tecnologias e pré-requisitos](#tecnologias-e-pré-requisitos)
- [Instalação e execução](#instalação-e-execução)
- [Configuração do ambiente](#configuração-do-ambiente)
- [Persistência dos dados](#persistência-dos-dados)
- [Funcionalidades e endpoints](#funcionalidades-e-endpoints)
- [Exemplos de uso](#exemplos-de-uso)
- [Testes e evidências](#testes-e-evidências)
- [Organização do projeto](#organização-do-projeto)
- [Documentação](#documentação)
- [Fluxo de desenvolvimento](#fluxo-de-desenvolvimento)
- [Versionamento e licença](#versionamento-e-licença)
- [Pendências e limitações](#pendências-e-limitações)

## Objetivo e escopo

O TaskFlow Mini busca organizar tarefas pessoais por meio de uma API simples, com persistência local e regras explícitas para cadastro, edição e acompanhamento de atividades.

### Funcionalidades implementadas

- Cadastro de tarefas.
- Listagem de tarefas.
- Consulta individual por identificador.
- Edição dos campos permitidos.
- Alteração de status.
- Exclusão de tarefas.
- Filtros por status e prioridade.
- Endpoint de saúde da aplicação.
- Testes automatizados.

### Fora da versão atual

- Busca textual.
- Paginação.
- Interface gráfica.
- Autenticação e autorização.
- Implantação pública.
- Migração automática de bancos antigos.

Os itens fora da versão atual não devem ser considerados funcionalidades disponíveis. Sua implementação futura depende de planejamento e revisão do backlog.

## Tecnologias e pré-requisitos

| Tecnologia | Utilização |
|---|---|
| Node.js 22 | Ambiente utilizado nas execuções de CI documentadas |
| npm | Instalação de dependências e execução dos scripts |
| Express 4 | Servidor HTTP e rotas da API |
| SQLite | Persistência local |
| better-sqlite3 11.7.0 | Integração com o SQLite |
| Git e GitHub | Versionamento, issues e Pull Requests |
| GitHub Actions | Execução automatizada de testes |

Utilize preferencialmente Node.js 22 para reproduzir o ambiente de CI documentado.

A declaração `engines >=22` no projeto não comprova compatibilidade de todas as dependências com qualquer versão posterior do Node.js.

A instalação no Windows com Node.js 24 apresentou falha na dependência nativa `better-sqlite3`. Quando não há um binário compatível disponível, essa dependência pode exigir ferramentas de compilação.

## Instalação e execução

As instruções abaixo utilizam a branch `main` e pressupõem que a entrega revisada tenha sido integrada nela.

### 1. Clonar o repositório

```sh
git clone --branch main [https://github.com/Jaozni/taskflow-mini.git](https://github.com/Jaozni/taskflow-mini.git)
cd taskflow-mini
```

### 2. Instalar as dependências

```sh
npm ci
```

O arquivo `package-lock.json` está versionado. O comando `npm ci` utiliza esse arquivo e exige consistência com o `package.json`.

### 3. Executar os testes

```sh
npm test
```

Confira o resultado antes de considerar o ambiente validado. A presença de testes no repositório não comprova que eles passaram na sua máquina.

### 4. Iniciar a aplicação

```sh
npm start
```

A porta padrão configurada é `3000`.

Em outro terminal, consulte o endpoint de saúde:

```sh
curl http://localhost:3000/health
```

Com o banco disponível, a resposta esperada é:

```json
{"status":"ok"}
```

### Windows PowerShell

Caso o PowerShell bloqueie `npm.ps1`, utilize `npm.cmd`:

```powershell
npm.cmd ci
npm.cmd test
npm.cmd start
```

Para consultar a API em outro terminal:

```powershell
Invoke-RestMethod -Uri http://localhost:3000/health
