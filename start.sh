#!/bin/sh

# Script de inicialização para o container
echo "🚀 Iniciando aplicação..."

# Aguardar o banco de dados estar disponível
echo "⏳ Aguardando banco de dados..."
until npx prisma db push --accept-data-loss; do
  echo "Banco não disponível, aguardando..."
  sleep 2
done

echo "✅ Banco de dados conectado!"

# Executar migrações
echo "📦 Executando migrações..."
npx prisma migrate deploy

# Iniciar a aplicação
echo "🎯 Iniciando aplicação NestJS..."
exec node dist/main.js
