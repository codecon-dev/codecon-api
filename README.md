# CodeCon API

[![https://img.shields.io/badge/feito%20com-nestjs-red](https://img.shields.io/badge/feito%20com-nestjs-E0234E)](https://nestjs.com/)
[![https://img.shields.io/badge/banco%20de%20dados-postgresql-blue](https://img.shields.io/badge/banco%20de%20dados-postgresql-336791)](https://www.postgresql.org/)
[![https://img.shields.io/badge/powered%20by-supabase-green](https://img.shields.io/badge/powered%20by-supabase-3ECF8E)](https://supabase.com/)

## 🌐 Visão Geral

A API do CodeCon é um projeto baseado em NestJS que serve como espinha dorsal para a [CodeCon](https://codecon.dev). Ela centraliza o gerenciamento de usuários, autenticação, recursos de gamificação e integrações com sistemas externos.

## 🚀 Principais Recursos

- Autenticação e registro de usuários
- Gerenciamento de perfil de usuário
- Sistema de emblemas e gamificação
- Integração com plataformas de venda de ingressos
- Desafios e quebra-cabeças para participantes
- Integrações com sistemas externos via APIs e webhooks

## 📘 Configuração de Desenvolvimento

- Instale o [pnpm](https://pnpm.io/installation)
- Instale o [Docker](https://docs.docker.com/get-docker/)
- Instale o [Node.js](https://nodejs.org/) (versão especificada no `package.json`)

## 🐳 Executando com Docker

Este projeto está configurado para ser executado inteiramente com Docker, incluindo tanto a aplicação quanto o banco de dados.

1. Certifique-se de ter o Docker e o Docker Compose instalados.

2. Clone o repositório:

   ```sh
   git clone https://github.com/codecon-dev/codecon-api.git
   cd codecon-api
   ```

3. Copie o arquivo de exemplo de variáveis de ambiente:

   ```sh
   cp .env.example .env
   ```

   Edite o arquivo `.env` com as configurações apropriadas.

4. Construa e inicie os contêineres:

   ```sh
   docker-compose up --build
   ```

   Isso iniciará tanto a API quanto o banco de dados PostgreSQL. A API estará disponível em http://localhost:3000/

5. Para parar os contêineres, use:
   ```sh
   docker-compose down
   ```

## 🛠 Desenvolvimento

- Para ver os logs da aplicação:

  ```sh
  docker-compose logs app
  ```

- Para executar testes:

  ```sh
  docker-compose run app npm run test
  ```

- Para acessar o shell do contêiner da aplicação:

  ```sh
  docker-compose exec app sh
  ```

- Para inicializar o banco de dados com dados de exemplo (opcional):

  ```sh
  docker-compose exec app npm run db:init
  ```

  Nota: Use este comando com cautela em ambientes de produção, pois ele pode sobrescrever dados existentes.

A partir daqui, você pode executar comandos npm, modificar arquivos (as alterações serão refletidas no contêiner) e realizar outras tarefas de desenvolvimento.

## 🛠 Scripts

- `pnpm run start`: Inicia a aplicação em modo de produção
- `pnpm run start:dev`: Inicia a aplicação em modo de desenvolvimento com watch
- `pnpm run start:prod`: Inicia a build de produção
- `pnpm run build`: Constrói a aplicação
- `pnpm run test`: Executa testes unitários
- `pnpm run test:e2e`: Executa testes end-to-end
- `pnpm run test:cov`: Executa testes com cobertura
- `pnpm run tree`: Gera uma árvore do projeto para ser usada em Prompts de IA
- `pnpm run db:reset`: Reseta o banco de dados

## 🧪 Testando Endpoints da API

Este projeto inclui um arquivo `auth.http` para facilitar o teste da API usando a extensão REST Client no Visual Studio Code.

1. Instale a extensão [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) no VS Code.
2. Abra o arquivo `auth.http`.
3. Clique em "Send Request" acima de cada requisição para testar os endpoints.
4. Para rotas protegidas, substitua `{{authToken}}` pelo token real recebido na resposta de login.

Nota: Certifique-se de que a API esteja rodando localmente antes de testar.

## 📚 Documentação da API

A documentação da API está disponível em `/api-docs` ao executar a aplicação.

## 🤝 Contribuindo

Por favor, leia nosso [Guia de Contribuição](CONTRIBUTING.md) antes de enviar um Pull Request para o projeto.

## 📄 Licença

Este projeto está licenciado sob a [Mozilla Public License 2.0 (MPL-2.0)](LICENSE).
