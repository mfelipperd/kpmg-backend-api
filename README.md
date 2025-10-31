# Company Management API

API para gerenciamento de empresas e destinatários de e-mail desenvolvida com NestJS.

## Tecnologias

- **NestJS** - Framework Node.js
- **TypeScript** - Linguagem de programação
- **Prisma** - ORM para banco de dados
- **PostgreSQL** - Banco de dados
- **Docker** - Containerização

## Pre-requisitos

- Node.js 18+
- Docker e Docker Compose
- npm ou yarn

## Instalacao

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
PORT=3000
NODE_ENV=development

# Configuração de e-mail (opcional - obrigatório apenas para envio de e-mails)
EMAIL_USER=seu-email@gmail.com
EMAIL_PASS=sua-senha-de-app
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
```

**Nota:** As variáveis de e-mail são opcionais. Se não configuradas, a aplicação funcionará normalmente, mas não enviará e-mails de notificação.

### Configuração do Gmail

Para usar o Gmail como serviço de e-mail, você **deve** usar um **App Password** (senha de app), não a senha normal da sua conta.

#### Como gerar um App Password no Gmail:

1. Acesse sua conta Google: https://myaccount.google.com/
2. Ative a **Autenticação de dois fatores** (2FA) se ainda não estiver ativada
3. Vá em **Segurança** > **Senhas de app**
4. Selecione **App** como "Outro (nome personalizado)"
5. Digite "Company API" ou qualquer nome de sua escolha
6. Clique em **Gerar**
7. Copie a senha de 16 caracteres gerada (sem espaços)
8. Use essa senha no `EMAIL_PASS` do arquivo `.env`

**Importante:**
- Use a senha de app gerada, não a senha normal do Gmail
- A senha de app tem 16 caracteres e não contém espaços
- Se receber erro "Cannot authenticate", verifique:
  - Se está usando App Password (não senha normal)
  - Se o 2FA está ativado
  - Se as credenciais estão corretas (sem espaços extras)
  - Se há problemas temporários no Gmail (tente novamente mais tarde)

### 4. Execute com Docker

```bash
docker compose up --build
```

## Executando o Projeto

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

## Documentacao

A documentação completa está disponível no Swagger: **http://localhost:3000/api**

## Endpoints

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

## Testes

```bash
npm run test
npm run test:e2e
```

## Estrutura do Projeto

```
src/
├── application/          # Use cases e DTOs
├── domain/              # Entidades e interfaces
├── infrastructure/      # Implementações (banco, email, etc)
├── presentation/        # Controllers e módulos de apresentação
└── main.ts
```

## Docker

```bash
# Subir aplicação
docker compose up --build

# Parar aplicação
docker compose down
```

## Scripts Disponiveis

```bash
npm run start:dev        # Desenvolvimento
npm run build           # Build
npm run test            # Testes
npm run lint            # Linter
```

## Contribuicao

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request
