# Plano de Ação para Implementação do Projeto CodeCon API

Este plano de ação visa dividir o projeto em pequenas features, permitindo um desenvolvimento incremental e testável. Cada etapa inclui testes básicos para validar o mínimo necessário da funcionalidade implementada. Além disso, são mencionadas as bibliotecas e ferramentas prioritárias para cada etapa, conforme os requisitos técnicos.

## Etapa 1: Configuração Inicial do Projeto

### Objetivo

- Inicializar o projeto NestJS.
- Configurar a estrutura básica da aplicação.
- Configurar a conexão com o banco de dados PostgreSQL via Supabase.
- Configurar o Docker para facilitar a implantação.
- Implementar testes básicos para garantir que a aplicação inicia corretamente e se conecta ao banco de dados.

### Passos

1. **Inicializar o Projeto NestJS**

   - Executar `nest new codecon-api` para criar um novo projeto NestJS.
   - Configurar o gerenciador de pacotes (npm, yarn ou pnpm).

2. **Configurar Estrutura Básica**

   - Criar os diretórios conforme a arquitetura planejada (`modules`, `common`, `shared`, etc.).
   - Configurar o `tsconfig.json` e o `nest-cli.json` se necessário.

3. **Configurar Conexão com o Banco de Dados**

   - Instalar o ORM escolhido (por exemplo, TypeORM ou Prisma).
   - Configurar o módulo de banco de dados em `shared/database`.
   - Estabelecer a conexão com o PostgreSQL via Supabase usando variáveis de ambiente.

   **Bibliotecas Prioritárias:**

   - `@nestjs/typeorm` ou `@nestjs/prisma`
   - `pg` (driver PostgreSQL)

4. **Configurar Docker**

   - Criar um `Dockerfile` para a aplicação.
   - Criar um `docker-compose.yml` para orquestrar a aplicação e o banco de dados (caso necessário em desenvolvimento).
   - Adicionar scripts no `package.json` para facilitar o uso do Docker.

5. **Implementar Testes Básicos**

   - Escrever um teste que verifica se a aplicação inicia sem erros.
   - Escrever um teste que verifica a conexão com o banco de dados.

### Testes

- **Teste de Inicialização da Aplicação**

  - Verificar se a aplicação está ouvindo na porta correta.
  - Verificar se a rota raiz (`/`) retorna uma resposta esperada.

- **Teste de Conexão com o Banco de Dados**

  - Verificar se é possível estabelecer uma conexão com o banco de dados.
  - Verificar se a tabela de migrações (se houver) está acessível.

## Etapa 2: Implementação do Módulo de Autenticação (`auth`)

### Objetivo

- Implementar o sistema de autenticação e cadastro de usuários.
- Suportar login via e-mail com link OTP, Google e GitHub.
- Garantir a segurança através de estratégias de autenticação.
- Escrever testes para validar os fluxos de autenticação.

### Passos

1. **Criar o Módulo `auth`**

   - Gerar o módulo, controladores e serviços necessários.

2. **Implementar DTOs de Autenticação**

   - Criar DTOs para login, cadastro e outras operações.
   - Utilizar `class-validator` para validação dos dados de entrada.

   **Bibliotecas Prioritárias:**

   - `class-validator`
   - `class-transformer`

3. **Configurar Estratégias de Autenticação**

   - Instalar e configurar `@nestjs/passport` e `passport`.
   - Implementar estratégia JWT para autenticação via token.
   - Configurar estratégias OAuth2 para Google e GitHub.

   **Bibliotecas Prioritárias:**

   - `@nestjs/passport`
   - `passport`
   - `passport-jwt`
   - `passport-google-oauth20`
   - `passport-github2`
   - `jsonwebtoken`

4. **Implementar Fluxos de Autenticação**

   - Implementar endpoints para login e cadastro.
   - Implementar envio de e-mail com link OTP para login via e-mail.
   - Integrar com o serviço de e-mail (pode ser mockado inicialmente).

5. **Escrever Testes para Autenticação**

   - Testar o fluxo de cadastro de usuários.
   - Testar login via e-mail com OTP.
   - Testar login com Google e GitHub (pode ser simulado em ambiente de teste).

### Testes

- **Teste de Cadastro**

  - Verificar se um novo usuário pode ser registrado com dados válidos.
  - Verificar se usuários duplicados são tratados corretamente.

- **Teste de Login via OTP**

  - Verificar se o link OTP é enviado corretamente.
  - Verificar se o login é bem-sucedido após clicar no link.

- **Teste de Login via Google/GitHub**

  - Verificar se o fluxo OAuth2 funciona corretamente.
  - Verificar se as informações do usuário são armazenadas corretamente.

## Etapa 3: Implementação do Módulo de Usuários (`users`)

### Objetivo

- Criar a entidade `attendees` e suas relações.
- Implementar endpoints para obter e atualizar perfis de usuários.
- Escrever testes para operações de usuário.

### Passos

1. **Criar o Módulo `users`**

   - Gerar o módulo, controladores, serviços e repositórios necessários.

2. **Definir a Entidade `Attendee`**

   - Mapear a tabela `attendees` conforme a modelagem do banco de dados.
   - Incluir relações com outras entidades (e.g., `company_segment`, `position`).

3. **Implementar Repositórios**

   - Criar interfaces para os repositórios.
   - Implementar métodos para acessar e manipular dados de usuários.

4. **Implementar Controladores e Serviços**

   - Endpoints para obter o perfil do usuário autenticado.
   - Endpoints para atualizar as informações do usuário.

5. **Escrever Testes para Usuários**

   - Testar obtenção de perfil.
   - Testar atualização de perfil com dados válidos e inválidos.

### Testes

- **Teste de Obtenção de Perfil**

  - Verificar se um usuário autenticado pode obter seu perfil.
  - Verificar se um usuário não autenticado é impedido.

- **Teste de Atualização de Perfil**

  - Verificar atualização com dados válidos.
  - Verificar validação ao enviar dados inválidos.

## Etapa 4: Implementação do Módulo de Badges (`badges`)

### Objetivo

- Implementar o sistema de badges baseado em hooks.
- Criar entidades `badges`, `hooks` e `attendees_badges`.
- Implementar lógica para atribuição automática de badges.
- Escrever testes para atribuição e recuperação de badges.

### Passos

1. **Criar o Módulo `badges`**

   - Gerar o módulo, controladores, serviços e repositórios necessários.

2. **Definir as Entidades**

   - `Badge`, `Hook` e `AttendeeBadge`.
   - Mapear as relações entre essas entidades.

3. **Implementar Lógica de Hooks**

   - Criar um serviço que permita acionar hooks em pontos específicos do código.
   - Implementar mecanismos para atribuir badges quando um hook é acionado.

4. **Implementar Endpoints**

   - Endpoint para listar badges conquistadas pelo usuário.
   - Endpoint para listar todas as badges disponíveis.

5. **Escrever Testes para Badges**

   - Testar atribuição de badges ao acionar um hook.
   - Testar recuperação de badges do usuário.

### Testes

- **Teste de Atribuição de Badge**

  - Verificar se, ao acionar um hook, a badge correspondente é atribuída.

- **Teste de Listagem de Badges**

  - Verificar se o usuário consegue ver suas badges conquistadas.
  - Verificar se a listagem de badges disponíveis está correta.

## Etapa 5: Implementação do Módulo de Eventos (`events`)

### Objetivo

- Implementar o gerenciamento de eventos e tickets.
- Criar as entidades `events` e `tickets`.
- Escrever testes para criação e gestão de eventos.

### Passos

1. **Criar o Módulo `events`**

   - Gerar o módulo, controladores, serviços e repositórios necessários.

2. **Definir as Entidades**

   - `Event` e `Ticket`.
   - Mapear as relações (e.g., um ticket pertence a um evento e a um usuário).

3. **Implementar Endpoints**

   - Endpoints para criar, atualizar e listar eventos.
   - Endpoints para gerenciar tickets (compra, validação).

4. **Implementar Lógica de Tickets**

   - Integrar com sistemas externos se necessário.
   - Implementar verificação de validade de tickets.

5. **Escrever Testes para Eventos e Tickets**

   - Testar criação e atualização de eventos.
   - Testar compra e validação de tickets.

### Testes

- **Teste de Criação de Evento**

  - Verificar se um evento pode ser criado com dados válidos.
  - Verificar validação ao inserir dados inválidos.

- **Teste de Gestão de Tickets**

  - Verificar se um ticket pode ser associado a um usuário.
  - Verificar validação de tickets.

## Etapa 6: Implementação do Módulo de Puzzles (`puzzles`)

### Objetivo

- Implementar o sistema de desafios e quebra-cabeças.
- Criar as entidades `puzzles` e `attendees_puzzles`.
- Implementar lógica para acompanhar o progresso dos usuários.
- Escrever testes para progressão em puzzles.

### Passos

1. **Criar o Módulo `puzzles`**

   - Gerar o módulo, controladores, serviços e repositórios necessários.

2. **Definir as Entidades**

   - `Puzzle` e `AttendeePuzzle`.
   - Mapear atributos como `total_steps`, `current_step`, `completed`.

3. **Implementar Lógica de Progressão**

   - Métodos para avançar etapas de um puzzle.
   - Verificar condições para conclusão do puzzle.

4. **Implementar Endpoints**

   - Endpoints para iniciar um puzzle.
   - Endpoints para avançar etapas e verificar status.

5. **Escrever Testes para Puzzles**

   - Testar progressão através das etapas.
   - Testar conclusão de puzzles.

### Testes

- **Teste de Início de Puzzle**

  - Verificar se um usuário pode iniciar um puzzle.

- **Teste de Progressão**

  - Verificar se o usuário avança corretamente nas etapas.
  - Verificar se a conclusão é registrada ao finalizar.

## Etapa 7: Implementação do Serviço de E-mail (`mail`)

### Objetivo

- Integrar o serviço de e-mail utilizando o Resend.
- Implementar envio de e-mails para cadastro, recuperação de senha, etc.
- Escrever testes para o envio de e-mails (utilizando mocks).

### Passos

1. **Criar o Módulo `mail`**

   - Gerar o módulo e serviço de e-mail.

2. **Integrar com o Resend**

   - Implementar o serviço utilizando a API do Resend.
   - Configurar as chaves de API via variáveis de ambiente.

   **Bibliotecas Prioritárias:**

   - `@nestjs/axios` ou pacote HTTP preferido para chamadas à API do Resend.

3. **Implementar Métodos de Envio**

   - Métodos para enviar e-mails de confirmação, notificações, etc.

4. **Escrever Testes para o Serviço de E-mail**

   - Utilizar mocks para simular o envio de e-mails.
   - Verificar se os métodos estão sendo chamados com os parâmetros corretos.

### Testes

- **Teste de Envio de E-mail**

  - Verificar se, ao solicitar um link OTP, o e-mail é "enviado" corretamente.
  - Verificar tratamento de erros no envio.

## Etapa 8: Implementação de Webhooks

### Objetivo

- Configurar webhooks para receber dados de plataformas externas (e.g., venda de ingressos).
- Implementar endpoints para lidar com os webhooks recebidos.
- Escrever testes para o processamento de webhooks.

### Passos

1. **Implementar Endpoints de Webhooks**

   - Criar controladores para receber chamadas de webhooks.
   - Garantir segurança (e.g., validação de tokens ou assinaturas).

2. **Processar Dados Recebidos**

   - Atualizar ou criar registros conforme os dados recebidos.
   - Exemplo: criar um usuário após a compra de um ingresso.

3. **Escrever Testes para Webhooks**

   - Simular chamadas de webhook com dados de exemplo.
   - Verificar se os dados são processados corretamente.

### Testes

- **Teste de Recebimento de Webhook**

  - Verificar se o endpoint aceita a chamada e responde corretamente.
  - Verificar processamento de dados válidos e tratamento de dados inválidos.

## Etapa 9: Implementação de Recursos de Segurança

### Objetivo

- Implementar rate limiting para prevenir abusos.
- Implementar validação e sanitização de entrada de dados.
- Escrever testes para garantir a segurança das rotas.

### Passos

1. **Implementar Rate Limiting**

   - Utilizar a biblioteca `@nestjs/throttler` para limitar o número de requisições.

   **Bibliotecas Prioritárias:**

   - `@nestjs/throttler`

2. **Implementar Validação e Sanitização**

   - Garantir que todos os endpoints utilizam DTOs com `class-validator`.
   - Sanitizar entradas para prevenir injeção de SQL, XSS, etc.

3. **Configurar Guards e Interceptors de Segurança**

   - Implementar guards para verificar autenticação e autorização.
   - Utilizar interceptors para logging e monitoramento.

4. **Escrever Testes de Segurança**

   - Testar que endpoints protegidos não são acessíveis sem autenticação.
   - Testar que o rate limiting está funcionando.

### Testes

- **Teste de Rate Limiting**

  - Simular múltiplas requisições e verificar se o limite é aplicado.

- **Teste de Autorização**

  - Verificar acesso a recursos com diferentes níveis de permissão.

## Etapa 10: Preparação para Implantação

### Objetivo

- Finalizar configurações do Docker.
- Configurar pipelines de CI/CD.
- Escrever scripts de implantação.

### Passos

1. **Refinar Configurações do Docker**

   - Otimizar o `Dockerfile` para produção.
   - Configurar variáveis de ambiente necessárias.

2. **Configurar CI/CD**

   - Utilizar GitHub Actions, GitLab CI ou outra ferramenta para automatizar testes e implantações.

3. **Escrever Scripts de Implantação**

   - Scripts para implantar a aplicação no VPS utilizando o Coolify.
   - Documentar o processo de implantação.

4. **Realizar Testes Finais**

   - Testar a aplicação em um ambiente de staging.
   - Realizar testes de carga se necessário.

### Testes

- **Teste de Implantação**

  - Verificar se a aplicação inicia corretamente no ambiente de produção.
  - Verificar se as conexões com serviços externos (e.g., banco de dados, e-mail) estão funcionando.

---

# Resumo das Bibliotecas Prioritárias

- **Framework Principal:**

  - `@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express`

- **ORM:**

  - `@nestjs/typeorm` e `typeorm` ou `@nestjs/prisma` e `prisma`

- **Validação:**

  - `class-validator`, `class-transformer`

- **Autenticação:**

  - `@nestjs/passport`, `passport`, `passport-jwt`, `passport-google-oauth20`, `passport-github2`, `jsonwebtoken`

- **E-mail:**

  - `@nestjs/axios` ou pacote HTTP para integração com Resend

- **Segurança:**

  - `@nestjs/throttler` para rate limiting

---

Este plano de ação visa orientar o desenvolvimento do projeto CodeCon API em etapas claras e gerenciáveis, garantindo que cada funcionalidade seja acompanhada de testes básicos para validar seu correto funcionamento. Seguindo este plano, é possível construir uma aplicação robusta, escalável e de fácil manutenção, atendendo aos requisitos técnicos e funcionais definidos.
