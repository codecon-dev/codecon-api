# PRD: CodeCon API

## Introdução

O **CodeCon API** é um projeto desenvolvido em NestJS que servirá como base para o evento de tecnologia **CodeCon**. O objetivo é centralizar diversas funcionalidades em uma única API, incluindo gerenciamento de usuários, autenticação, gamificação (badges, pontos, desafios), integração com sistemas externos e coleta de dados estatísticos.

## Objetivos

- **Centralização**: Unificar o gerenciamento de usuários, autenticação e gamificação em uma única API.
- **Gamificação**: Implementar um sistema de badges, pontos e desafios para aumentar o engajamento dos participantes.
- **Integração**: Facilitar a comunicação com sistemas externos, como plataformas de venda de ingressos e aplicações de terceiros.
- **Segurança**: Garantir autenticação segura, autorização adequada e proteção contra vulnerabilidades.
- **Escalabilidade**: Construir uma API que suporte um grande número de usuários e possa ser escalada conforme a demanda.

## Requisitos Funcionais

### Autenticação e Cadastro

- Permitir cadastro de usuários via e-mail com link OTP, Google ou GitHub.
- Enviar e-mail de convite para completar o cadastro após a compra de ingressos ou inscrição em meetups.
- Criar webhooks para receber dados de plataformas de venda de ingressos e automatizar o cadastro de usuários.

### Gerenciamento de Usuários

- Manter perfis de usuários com informações pessoais e profissionais.
- Permitir que usuários atualizem suas informações pessoais, incluindo preferências e redes sociais.
- Registrar a participação dos usuários em eventos e atividades.

### Sistema de Badges

- Implementar um sistema de badges baseado em "hooks" que refletem metas alcançadas.
- Permitir a atribuição automática de badges aos usuários quando determinados critérios forem atendidos.
- Exibir badges conquistadas e disponíveis para cada usuário.

### Gamificação e Desafios

- Criar desafios (puzzles) com múltiplas etapas que os usuários podem completar.
- Rastrear o progresso dos usuários em cada desafio.
- Atribuir pontos aos usuários com base nas atividades e desafios concluídos.

### Integração com Sistemas Externos

- Fornecer APIs para que outros sistemas possam interagir com a API (resgate de pontos, atualização de status, etc.).
- Implementar webhooks para receber e enviar eventos a plataformas externas.

## Requisitos Não Funcionais

- **Segurança**: Implementar práticas de segurança robustas, incluindo criptografia e proteção contra ataques.
- **Desempenho**: Garantir tempos de resposta rápidos e eficiência no processamento de dados.
- **Escalabilidade**: Projetar a API para suportar crescimento no número de usuários e atividades.
- **Manutenibilidade**: Código bem estruturado e documentado para facilitar futuras manutenções e atualizações.
- **Portabilidade**: Utilizar Docker para facilitar a implantação em diferentes ambientes.
- **Confiabilidade**: Assegurar alta disponibilidade e recuperação rápida em caso de falhas.

## Arquitetura do Sistema

- **Backend**: Desenvolvido em **NestJS**.
- **Banco de Dados**: **PostgreSQL** hospedado no **Supabase**.
- **Gerenciador de VPS**: **Coolify**.
- **Autenticação**: Integrar com o sistema de autenticação do **Supabase** ou implementar solução personalizada.
- **Emails**: Utilizar o serviço **Resend** para envio de e-mails transacionais.
- **Contêineres**: Configuração e implantação via **Docker** para consistência entre ambientes.

## Modelagem do Banco de Dados

### Tabelas Principais

#### `attendees`

- **id** (UUID, PK)
- created_at (timestamp)
- updated_at (timestamp)
- deleted_at (timestamp)
- name (string)
- last_name (string)
- display_name (string)
- gender (string)
- email (string, único)
- mobile_phone (string)
- birth_date (date)
- city (string)
- state (string)
- linkedin (string)
- github (string)
- company (string)
- company_segment_id (FK para `company_segment`)
- position_id (FK para `position`)
- position_level_id (FK para `position_level`)
- ticket_system_user_id (string)

#### `company_segment`

- **id** (UUID, PK)
- created_at (timestamp)
- updated_at (timestamp)
- deleted_at (timestamp)
- name (string)

#### `position`

- **id** (UUID, PK)
- created_at (timestamp)
- updated_at (timestamp)
- deleted_at (timestamp)
- name (string)

#### `position_level`

- **id** (UUID, PK)
- created_at (timestamp)
- updated_at (timestamp)
- deleted_at (timestamp)
- name (string)

#### `programming_languages`

- **id** (UUID, PK)
- created_at (timestamp)
- updated_at (timestamp)
- deleted_at (timestamp)
- name (string)

#### `attendees_programming_languages`

- **id** (UUID, PK)
- created_at (timestamp)
- updated_at (timestamp)
- deleted_at (timestamp)
- programming_language_id (FK para `programming_languages`)
- attendee_id (FK para `attendees`)

#### `badges`

- **id** (UUID, PK)
- created_at (timestamp)
- updated_at (timestamp)
- deleted_at (timestamp)
- name (string)
- image (string)
- hook_id (FK para `hooks`)

#### `hooks`

- **id** (UUID, PK)
- created_at (timestamp)
- updated_at (timestamp)
- deleted_at (timestamp)
- name (string)

#### `attendees_badges`

- **id** (UUID, PK)
- created_at (timestamp)
- updated_at (timestamp)
- deleted_at (timestamp)
- attendee_id (FK para `attendees`)
- badge_id (FK para `badges`)
- count (integer)

### Tabelas Adicionais

#### `puzzles`

- **id** (UUID, PK)
- created_at (timestamp)
- updated_at (timestamp)
- deleted_at (timestamp)
- name (string)
- description (text)
- total_steps (integer)
- points (integer)

#### `attendees_puzzles`

- **id** (UUID, PK)
- created_at (timestamp)
- updated_at (timestamp)
- deleted_at (timestamp)
- attendee_id (FK para `attendees`)
- puzzle_id (FK para `puzzles`)
- current_step (integer)
- completed (boolean)

#### `tickets`

- **id** (UUID, PK)
- created_at (timestamp)
- updated_at (timestamp)
- deleted_at (timestamp)
- attendee_id (FK para `attendees`)
- event_id (FK para `events`)
- ticket_type (string)
- purchase_date (timestamp)

#### `events`

- **id** (UUID, PK)
- created_at (timestamp)
- updated_at (timestamp)
- deleted_at (timestamp)
- name (string)
- date (date)
- location (string)
- description (text)

## Referências

### Issues do GitHub

- **Milestone 1: Colocar o projeto no ar #6**

  - Objetivo de deixar o projeto rodando com funcionalidades iniciais.
  - Sub-issues:
    - **Commit inicial #1**
    - **Configuração do Docker #2**
    - **Autenticação / Cadastro #3**
    - **Cadastro de eventos #4**
    - **Badges #5**

- **Badges #5**

  - Implementação de um sistema de badges baseado em "hooks".
  - Tabelas envolvidas: `badges`, `hooks`, `attendees_badges`.

- **Autenticação / Cadastro #3**

  - Definição do fluxo de autenticação e cadastro de usuários.
  - Integração com plataformas de venda de ingressos.
  - Tabelas envolvidas: `attendees`, `company_segment`, `position`, `position_level`, `programming_languages`, `attendees_programming_languages`.

### Contexto Adicional

- **Projeto em NestJS**: Utilização do NestJS para o desenvolvimento da API.
- **Supabase**: Uso do Supabase para o banco de dados PostgreSQL e autenticação.
- **Gamificação**: Foco na gamificação do evento, incluindo desafios e sistema de pontos.
- **Segurança e Confiabilidade**: Necessidade de uma API segura, confiável e escalável.
- **Integração**: APIs e webhooks para comunicação com sistemas externos.

### Estrutura Inicial do Projeto

```
.
├── README.md
├── instructions
│   ├── project.md
│   └── tree-codecon-api.md
├── nest-cli.json
├── package.json
├── pnpm-lock.yaml
├── src
│   ├── app.controller.spec.ts
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   └── main.ts
├── test
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── tsconfig.build.json
└── tsconfig.json
```

### Dependências e Scripts Importantes (`package.json`)

- **Scripts**:
  - `build`, `start`, `start:dev`, `lint`, `test`, etc.
- **Dependências Principais**:
  - `@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express`, `rxjs`, etc.
- **Dependências de Desenvolvimento**:
  - `@nestjs/cli`, `typescript`, `jest`, `eslint`, `prettier`, etc.

---

#fim
