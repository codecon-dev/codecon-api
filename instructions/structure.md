# Plano de Arquitetura do Projeto CodeCon API

## Visão Geral

O **CodeCon API** será desenvolvido utilizando **NestJS**, um framework Node.js que promove a escrita de aplicações escaláveis e mantidas através de uma arquitetura modular e de injeção de dependência. O objetivo é criar uma estrutura que permita a troca de módulos ou bibliotecas externas sem atrito, facilitando a manutenção e evolução do projeto.

## Estrutura do Projeto

A estrutura do projeto seguirá as melhores práticas recomendadas pelo NestJS, organizando o código em módulos, cada um responsável por uma funcionalidade específica.

```
codecon-api/
├── src/
│   ├── app.module.ts
│   ├── main.ts
│   ├── common/
│   │   ├── decorators/
│   │   ├── filters/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   ├── interfaces/
│   │   └── pipes/
│   ├── config/
│   │   ├── configuration.module.ts
│   │   └── configuration.service.ts
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── strategies/
│   │   │   ├── interfaces/
│   │   │   ├── dto/
│   │   │   └── auth.module.ts
│   │   ├── users/
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── repositories/
│   │   │   ├── entities/
│   │   │   ├── interfaces/
│   │   │   ├── dto/
│   │   │   └── users.module.ts
│   │   ├── badges/
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── repositories/
│   │   │   ├── entities/
│   │   │   ├── interfaces/
│   │   │   ├── dto/
│   │   │   └── badges.module.ts
│   │   ├── events/
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── repositories/
│   │   │   ├── entities/
│   │   │   ├── interfaces/
│   │   │   ├── dto/
│   │   │   └── events.module.ts
│   │   └── puzzles/
│   │       ├── controllers/
│   │       ├── services/
│   │       ├── repositories/
│   │       ├── entities/
│   │       ├── interfaces/
│   │       ├── dto/
│   │       └── puzzles.module.ts
│   ├── shared/
│   │   ├── database/
│   │   │   ├── database.module.ts
│   │   │   ├── database.service.ts
│   │   │   └── interfaces/
│   │   └── mail/
│   │       ├── mail.module.ts
│   │       ├── mail.service.ts
│   │       └── interfaces/
│   └── utils/
│       └── (funções utilitárias)
├── test/
│   └── (arquivos de teste)
├── Dockerfile
├── docker-compose.yml
├── package.json
├── tsconfig.json
└── README.md
```

## Detalhamento dos Componentes

### 1. `main.ts`

Ponto de entrada da aplicação NestJS. Responsável por inicializar o aplicativo e aplicar configurações globais, como validação e filtros de exceção.

### 2. `app.module.ts`

Módulo raiz da aplicação. Importa todos os módulos principais e configurações globais.

### 3. Diretório `common/`

Contém código compartilhado por toda a aplicação.

- **decorators/**: Decorators personalizados.
- **filters/**: Filtros globais de exceção.
- **guards/**: Guards de autenticação e autorização.
- **interceptors/**: Interceptores para logging, cache, etc.
- **interfaces/**: Interfaces comuns.
- **pipes/**: Pipes para validação e transformação de dados.

### 4. Diretório `config/`

Gerencia a configuração da aplicação.

- **configuration.module.ts**: Módulo de configuração.
- **configuration.service.ts**: Serviço que fornece as configurações da aplicação.

### 5. Diretório `modules/`

Cada funcionalidade principal é encapsulada em um módulo próprio.

#### a. Módulo `auth/`

Responsável pela autenticação e autorização.

- **controllers/**: Controladores que lidam com as rotas de autenticação.
- **services/**: Serviços que contêm a lógica de negócio de autenticação.
- **strategies/**: Estratégias de autenticação (JWT, OAuth, etc.).
- **interfaces/**: Interfaces que definem contratos para serviços e estratégias.
- **dto/**: Objetos de transferência de dados para validação e tipagem.
- **auth.module.ts**: Módulo que agrupa todos os componentes de autenticação.

#### b. Módulo `users/`

Gerencia os usuários da plataforma.

- **controllers/**: Rotas para operações de usuário.
- **services/**: Lógica de negócio relacionada a usuários.
- **repositories/**: Abstração de acesso a dados.
- **entities/**: Definição das entidades (modelos) do banco de dados.
- **interfaces/**: Contratos para serviços e repositórios.
- **dto/**: Objetos de transferência de dados.
- **users.module.ts**: Módulo do usuário.

#### c. Módulo `badges/`

Gerencia o sistema de badges.

- **controllers/**: Rotas para operações de badges.
- **services/**: Lógica de negócio para atribuição e gerenciamento de badges.
- **repositories/**: Acesso aos dados de badges.
- **entities/**: Modelos de badges e hooks.
- **interfaces/**: Contratos para serviços e repositórios.
- **dto/**: Objetos de transferência de dados.
- **badges.module.ts**: Módulo de badges.

#### d. Módulo `events/`

Gerencia eventos e meetups.

- **controllers/**: Rotas para operações de eventos.
- **services/**: Lógica de negócio para eventos.
- **repositories/**: Acesso aos dados de eventos.
- **entities/**: Modelos de eventos.
- **interfaces/**: Contratos para serviços e repositórios.
- **dto/**: Objetos de transferência de dados.
- **events.module.ts**: Módulo de eventos.

#### e. Módulo `puzzles/`

Gerencia desafios e quebra-cabeças.

- **controllers/**: Rotas para operações de puzzles.
- **services/**: Lógica de negócio para desafios.
- **repositories/**: Acesso aos dados de puzzles.
- **entities/**: Modelos de puzzles.
- **interfaces/**: Contratos para serviços e repositórios.
- **dto/**: Objetos de transferência de dados.
- **puzzles.module.ts**: Módulo de puzzles.

### 6. Diretório `shared/`

Contém módulos e serviços compartilhados que não pertencem a um domínio específico.

#### a. Módulo `database/`

Abstrai a conexão com o banco de dados.

- **database.module.ts**: Configuração do módulo de banco de dados.
- **database.service.ts**: Serviço que gerencia a conexão.
- **interfaces/**: Contratos para o serviço de banco de dados.

#### b. Módulo `mail/`

Abstrai o envio de e-mails.

- **mail.module.ts**: Configuração do módulo de e-mail.
- **mail.service.ts**: Serviço que envia e-mails.
- **interfaces/**: Contratos para o serviço de e-mail.

### 7. Diretório `utils/`

Funções utilitárias que podem ser usadas em toda a aplicação.

## Interfaces e Injeção de Dependência

Para permitir a troca de módulos ou bibliotecas externas, todas as dependências serão injetadas via construtores e baseadas em interfaces.

### Exemplo de Serviço de E-mail

**Interface:**

```typescript
// mail/interfaces/mail-service.interface.ts
export interface IMailService {
  sendMail(options: SendMailOptions): Promise<void>;
}
```

**Implementação:**

```typescript
// mail/services/mail.service.ts
@Injectable()
export class MailService implements IMailService {
  constructor(private readonly mailProvider: MailProviderInterface) {}

  async sendMail(options: SendMailOptions): Promise<void> {
    await this.mailProvider.send(options);
  }
}
```

Se quisermos trocar de provedor de e-mail, basta criar uma nova implementação de `MailProviderInterface` e ajustar a injeção de dependência.

## Repositórios e Acesso a Dados

Os repositórios serão definidos por interfaces e implementados de forma que possam ser substituídos sem impacto nas camadas superiores.

**Interface:**

```typescript
// users/interfaces/user-repository.interface.ts
export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user: CreateUserDto): Promise<User>;
}
```

**Implementação:**

```typescript
// users/repositories/user.repository.ts
@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
  ) {}

  // Implementação dos métodos
}
```

## Comunicação entre Módulos

Os módulos se comunicam através de serviços e eventos, evitando dependências circulares.

- **Serviços**: Exportados nos módulos e injetados onde necessários.
- **Eventos**: Utilização do padrão Observer ou do módulo EventEmitter do NestJS para comunicação assíncrona.

## Configuração e Variáveis de Ambiente

Utilização do módulo `@nestjs/config` para gerenciar configurações.

- As configurações serão acessadas via `ConfigService`, permitindo a troca ou ajuste sem impacto no código.
- Suporte a diferentes ambientes (desenvolvimento, teste, produção) através de arquivos de configuração ou variáveis de ambiente.

## Segurança e Autenticação

- **Guards**: Implementação de guards para proteger rotas.
- **Estratégias de Autenticação**: Suporte a JWT, OAuth2, etc.
- **Políticas de Autorização**: Controle de acesso baseado em roles e permissões.

## Tratamento de Erros e Logging

- **Filtros de Exceção**: Capturam e tratam erros de forma consistente.
- **Interceptors de Logging**: Registram atividades e erros para monitoramento.

## Testes

- **Unitários**: Para serviços e utilitários.
- **Integração**: Testes dos módulos e rotas.
- **E2E**: Testes fim a fim simulando o uso real da aplicação.

## Docker e Docker Compose

- **Dockerfile**: Para construir a imagem da aplicação.
- **docker-compose.yml**: Para orquestrar serviços como banco de dados, aplicação e outros necessários em ambiente de desenvolvimento ou produção.

## Planejamento para Implementação por Outra IA

Para facilitar a implementação por outra IA, seguem orientações:

1. **Seguir a Estrutura Proposta**: Utilizar a estrutura de diretórios e nomeações conforme descrito.

2. **Implementar Interfaces Primeiro**: Definir todas as interfaces para serviços, repositórios e provedores antes das implementações.

3. **Utilizar Injeção de Dependência**: Todos os serviços e repositórios devem ser injetados via construtor e não instanciados diretamente.

4. **Isolar Dependências Externas**: Qualquer interação com bibliotecas externas (e.g., ORM, serviços de e-mail) deve ser abstraída por meio de interfaces.

5. **Criar DTOs para Validação**: Todos os dados de entrada devem ser validados utilizando os DTOs com decorators do `class-validator`.

6. **Documentar Métodos e Classes**: Adicionar comentários e documentação para facilitar o entendimento.

7. **Implementar Testes**: Escrever testes unitários e de integração para garantir o correto funcionamento dos componentes.

8. **Configurar Scripts de Build e Teste**: Garantir que os scripts no `package.json` funcionem conforme esperado.

9. **Utilizar Variáveis de Ambiente**: Todas as configurações sensíveis ou que possam mudar entre ambientes devem ser gerenciadas por variáveis de ambiente.

10. **Evitar Dependências Circulares**: Monitorar as importações para evitar problemas de acoplamento.

## Conclusão

Este plano de arquitetura visa criar uma base sólida para o desenvolvimento do CodeCon API, permitindo escalabilidade, manutenção e flexibilidade. A utilização de interfaces e injeção de dependência são fundamentais para garantir que módulos e bibliotecas possam ser trocados sem atrito, atendendo aos requisitos do projeto.

---

#fim
