# Codecon App

[![https://img.shields.io/badge/framework%20nextforge-red](https://img.shields.io/badge/framework%20nextforge-E0234E)](https://www.next-forge.com/)
[![https://img.shields.io/badge/feito%20com-nextjs-red](https://img.shields.io/badge/feito%20com-nextjs-E0234E)](https://nextjs.org/)
[![https://img.shields.io/badge/banco%20de%20dados-postgresql-blue](https://img.shields.io/badge/banco%20de%20dados-postgresql-336791)](https://www.postgresql.org/)
[![https://img.shields.io/badge/powered%20by-supabase-green](https://img.shields.io/badge/powered%20by-supabase-3ECF8E)](https://supabase.com/)

## 🌐 Visão Geral

O App do Codecon é um monorepo baseado em next-forge que serve como espinha dorsal para a [Codecon](https://codecon.dev). Ela centraliza o gerenciamento de usuários, autenticação, recursos de gamificação e integrações com sistemas externos.

## 🚀 Principais Recursos

- Autenticação e registro de usuários
- Gerenciamento de perfil de usuário
- Sistema de emblemas e gamificação
- Integração com plataformas de venda de ingressos
- Desafios e quebra-cabeças para participantes
- Integrações com sistemas externos via APIs e webhooks

## 📘 Configuração de Desenvolvimento

- Instale o [pnpm](https://pnpm.io/installation)
- Instale o [Node.js](https://nodejs.org/) (versão especificada no `package.json`)
- Instale o Mintlifly CLI `pnpm add -g @mintlify/cli`

## 🛠 Scripts

- `pnpm migrate`: Para configurar o banco de dados
- `pnpm dev`: Iniciar a aplicação

## 🔒 Variáveis de Ambiente

Certifique-se de configurar as seguintes variáveis de ambiente no seu arquivo `.env.local` nas pastas `/apps/app` e `/apps/api`:

- `CLERK_SECRET_KEY`: Chave de API da Clerk
- `CLERK_WEBHOOK_SECRET`: Secret do Webhook da Clerk recebido pela nossa aplicação
- `EVEN3_WEBHOOK_SECRET`: Secret do Webhook da Even3 recebido pela nossa aplicação
- `RESEND_AUDIENCE_ID`: ID da audiência no Resend
- `RESEND_FROM`: E-mail que será o remetente dos e-mails transacionais
- `DATABASE_URL`: String de conexão com o PostgreSQL
- `RESEND_TOKEN`: Chave de API do Resend
- `BETTERSTACK_API_KEY`: Chave de API do BetterStack
- `BETTERSTACK_URL`: URL da status page do BetterStack
- `FLAGS_SECRET`: Secret para uso de features flags
- `ARCJET_KEY`: Chave de API da ArcJet
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Chave publicável do Clerk
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`: Código do Google Analytics
- `NEXT_PUBLIC_POSTHOG_KEY`: Código do PostHog
- `NEXT_PUBLIC_POSTHOG_HOST`: URL de Host do PostHog

Também configure a variável de ambiente do banco de dados no arquivo `.env` dentro da pasta `/packages/database`

- `DATABASE_URL`: String de conexão com o PostgreSQL
- `DIRECT_URL`: String de conexão direta, para usar nas migrations

## Desenvolvimento

- http://localhost:3000/ — A aplicação principal
- http://localhost:3002/ — A API
- http://localhost:3003/ — Preview de e-mails
- http://localhost:3004/ — Documentação da API

## 📚 Documentação next-forge

Acesse a [documentação do next-forge](https://docs.next-forge.com/setup) para mais detalhes.

## 🤝 Contribuindo

Por favor, leia nosso [Guia de Contribuição](CONTRIBUTING.md) antes de enviar um Pull Request para o projeto.

## 📄 Licença

Este projeto está licenciado sob a [Mozilla Public License 2.0 (MPL-2.0)](LICENSE).