#!/bin/sh

# Script de inicialização para o container
echo "Iniciando aplicacao..."

# Aguardar o banco de dados estar disponível
echo "Aguardando banco de dados..."
until npx prisma db push --accept-data-loss; do
  echo "Banco nao disponivel, aguardando..."
  sleep 2
done

echo "Banco de dados conectado!"

# Executar migrações
echo "Executando migracoes..."
npx prisma migrate deploy

# Executar seed (popular banco de dados)
echo "Populando banco de dados com dados iniciais..."
node dist/prisma/seed.js || echo "Seed falhou ou ja foi executado"

# Iniciar a aplicação
echo "Iniciando aplicacao NestJS..."
exec node dist/src/main.js
