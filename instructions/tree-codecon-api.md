.
├── Dockerfile
├── LICENSE
├── README.md
├── auth.http
├── docker-compose.yml
├── docker-entrypoint.sh
├── instructions
│   ├── action-plan.md
│   ├── code-review.md
│   ├── project.md
│   ├── structure.md
│   └── tree-codecon-api.md
├── jest.config.js
├── nest-cli.json
├── package.json
├── pnpm-lock.yaml
├── src
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   ├── config
│   │   └── configuration.ts
│   ├── main.ts
│   └── modules
│       ├── attendees
│       │   └── entities
│       │       └── attendee.entity.ts
│       ├── auth
│       │   ├── auth.module.ts
│       │   ├── controllers
│       │   │   ├── auth.controller.spec.ts
│       │   │   └── auth.controller.ts
│       │   ├── guards
│       │   │   └── local-auth.guard.ts
│       │   ├── services
│       │   │   ├── auth.service.spec.ts
│       │   │   └── auth.service.ts
│       │   └── strategies
│       │       ├── github.strategy.ts
│       │       ├── google.strategy.ts
│       │       ├── jwt.strategy.ts
│       │       └── local.strategy.ts
│       ├── shared
│       │   └── services
│       │       ├── email.service.spec.ts
│       │       └── email.service.ts
│       └── users
│           ├── dtos
│           │   └── create-user.dto.ts
│           ├── entities
│           │   └── user.entity.ts
│           ├── services
│           │   └── users.service.ts
│           └── users.module.ts
├── test
│   ├── app.controller.spec.ts
│   ├── auth
│   ├── e2e
│   │   └── app.e2e-spec.ts
│   └── jest-e2e.json
├── tsconfig.build.json
└── tsconfig.json
