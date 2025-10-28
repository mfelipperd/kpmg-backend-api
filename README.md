# Company Management API

API para gerenciamento de empresas e destinatários de e-mail desenvolvida com NestJS.

## 🚀 Tecnologias

- **NestJS** - Framework Node.js
- **TypeScript** - Linguagem de programação
- **Prisma** - ORM para banco de dados
- **PostgreSQL** - Banco de dados
- **Docker** - Containerização

## 📋 Pré-requisitos

- Node.js 18+
- Docker e Docker Compose
- npm ou yarn

## 🔧 Instalação

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd backend
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
DATABASE_URL="postgresql://kpmg_user:kpmg_password@localhost:5432/kpmg_companydb"
EMAIL_USER=seu-email@gmail.com
EMAIL_PASS=sua-senha-de-app
PORT=3000
NODE_ENV=development
```

### 4. Execute com Docker

```bash
docker compose up --build
```

## 🚀 Executando o Projeto

### Desenvolvimento

```bash
npm run start:dev
```

### Produção

```bash
npm run build
npm run start:prod
```

A API estará rodando em: **http://localhost:3000**

## 📚 Documentação

A documentação completa está disponível no Swagger: **http://localhost:3000/api**

## 🔌 Endpoints

### Companies

- `POST /companies` - Criar empresa
- `GET /companies` - Listar empresas
- `GET /companies/:id` - Buscar empresa por ID
- `PATCH /companies/:id` - Atualizar empresa
- `DELETE /companies/:id` - Deletar empresa

### Emails

- `POST /emails` - Adicionar destinatário
- `GET /emails` - Listar destinatários
- `PATCH /emails/:id` - Atualizar destinatário
- `DELETE /emails/:id` - Deletar destinatário

### Health Check

- `GET /health` - Verificação de saúde da aplicação
- `GET /ping` - Ping simples

## 🧪 Testes

```bash
npm run test
npm run test:e2e
```

## 📁 Estrutura do Projeto

```
src/
├── application/          # Use cases e DTOs
├── domain/              # Entidades e interfaces
├── infrastructure/      # Implementações (banco, email, etc)
├── presentation/        # Controllers e módulos de apresentação
└── main.ts
```

## 🐳 Docker

```bash
# Subir aplicação
docker compose up --build

# Parar aplicação
docker compose down
```

## 📝 Scripts Disponíveis

```bash
npm run start:dev        # Desenvolvimento
npm run build           # Build
npm run test            # Testes
npm run lint            # Linter
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request
