# CodeCon API

[![https://img.shields.io/badge/made%20with-nestjs-red](https://img.shields.io/badge/made%20with-nestjs-E0234E)](https://nestjs.com/)
[![https://img.shields.io/badge/database-postgresql-blue](https://img.shields.io/badge/database-postgresql-336791)](https://www.postgresql.org/)
[![https://img.shields.io/badge/powered%20by-supabase-green](https://img.shields.io/badge/powered%20by-supabase-3ECF8E)](https://supabase.com/)

## 🌐 Quick Overview

The CodeCon API is a NestJS-based project serving as the backbone for the CodeCon technology event. It centralizes user management, authentication, gamification features, and integrations with external systems.

## 🚀 Key Features

- User authentication and registration
- User profile management
- Badge system and gamification
- Integration with ticket selling platforms
- Challenges and puzzles for participants
- External system integrations via APIs and webhooks

## 📘 Development Setup

- Install [pnpm](https://pnpm.io/installation)
- Install [Docker](https://docs.docker.com/get-docker/)
- Install [Node.js](https://nodejs.org/) (version specified in `package.json`)

## 📗 Local Development

1. Clone the repository:

   ```sh
   git clone https://github.com/codecon-dev/codecon-api.git
   cd codecon-api
   ```

2. Install dependencies:

   ```sh
   pnpm install
   ```

3. Set up environment variables:

   ```sh
   cp .env.example .env
   ```

   Edit the `.env` file and configure your environment variables.

4. Start the PostgreSQL database:

   ```sh
   docker-compose up -d db
   ```

5. Run the application in development mode:
   ```sh
   pnpm run start:dev
   ```

The API will be available at http://localhost:3000/

## 🐳 Running with Docker

To run the entire application using Docker:

1. Make sure you have Docker and Docker Compose installed.

2. Build and start the containers:
   ```sh
   docker-compose up --build
   ```

This will start both the API and the PostgreSQL database. The API will be available at http://localhost:3000/

## 🛠 Scripts

- `pnpm run start`: Start the application in production mode
- `pnpm run start:dev`: Start the application in development mode with watch
- `pnpm run start:prod`: Start the production build
- `pnpm run build`: Build the application
- `pnpm run test`: Run unit tests
- `pnpm run test:e2e`: Run end-to-end tests
- `pnpm run test:cov`: Run tests with coverage
- `pnpm run tree`: Generate a tree of the project to be used in AI Prompts

## 🔒 Environment Variables

Make sure to set up the following environment variables in your `.env` file:

- `DATABASE_URL`: PostgreSQL connection string
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_KEY`: Supabase API key
- `RESEND_API_KEY`: Resend API key for email services

## 📚 API Documentation

API documentation is available at `/api-docs` when running the application. (TO-DO)

## 🤝 Contributing

Please read our [Contributing Guide](CONTRIBUTING.md) before submitting a Pull Request to the project.

## 📄 License

This project is licensed under the [Mozilla Public License 2.0 (MPL-2.0)](LICENSE).
