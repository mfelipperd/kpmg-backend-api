-- Inicialização do banco de dados
-- Este arquivo é executado automaticamente pelo PostgreSQL no primeiro startup

-- Criar usuário se não existir (já é criado automaticamente pelo POSTGRES_USER)
-- CREATE USER kpmg_user WITH PASSWORD 'kpmg_password';

-- Criar banco se não existir (já é criado automaticamente pelo POSTGRES_DB)
-- CREATE DATABASE kpmg_companydb OWNER kpmg_user;

-- Conceder privilégios
GRANT ALL PRIVILEGES ON DATABASE kpmg_companydb TO kpmg_user;

-- Conectar ao banco
\c kpmg_companydb;

-- Conceder privilégios no schema public
GRANT ALL ON SCHEMA public TO kpmg_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO kpmg_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO kpmg_user;
