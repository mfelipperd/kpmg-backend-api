# Setup e Configuração

Esta pasta contém scripts e arquivos de configuração para setup do projeto.

## Arquivos

### Scripts

- **`setup-git.sh`** - Script para configurar o Git com padrões semânticos, aliases e hooks
  ```bash
  chmod +x setup/setup-git.sh
  ./setup/setup-git.sh
  ```

### Docker

- **`start.sh`** - Script de inicialização para containers Docker
  - Aguarda o banco de dados estar disponível
  - Executa migrações do Prisma
  - Inicia a aplicação NestJS

### Banco de Dados

- **`init.sql`** - Script SQL de inicialização do PostgreSQL
  - Concede privilégios ao usuário `kpmg_user`
  - Configura o schema `public`
  - Executado automaticamente no primeiro startup do container

## Uso

### Configurar Git (primeira vez)

```bash
./setup/setup-git.sh
```

### Executar com Docker

Os scripts são usados automaticamente pelo `docker-compose.yml` e `Dockerfile`.

## Notas

- Todos os scripts são executáveis
- O `init.sql` é executado automaticamente pelo PostgreSQL quando o container é criado pela primeira vez
- O `start.sh` é usado pelo container do backend para inicialização
