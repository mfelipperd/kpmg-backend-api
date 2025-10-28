# Dockerfile para o backend NestJS - Teste Avaliativo KPMG (Vaga Pleno)
# Multi-stage build para otimizar o tamanho da imagem final

# Stage 1: Build stage
FROM node:20-alpine AS builder

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY prisma ./prisma/

# Instalar todas as dependências (incluindo dev) para o build
RUN npm ci --ignore-scripts && npm cache clean --force

# Copiar código fonte
COPY . .

# Gerar cliente Prisma
RUN npx prisma generate

# Build da aplicação
RUN npm run build

# Stage 2: Production stage
FROM node:20-alpine AS production

# Instalar dumb-init para melhor gerenciamento de processos
RUN apk add --no-cache dumb-init

# Criar usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar apenas dependências de produção (sem postinstall scripts)
RUN npm ci --only=production --ignore-scripts && npm cache clean --force

# Copiar build da aplicação do stage anterior
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma

# Copiar script de inicialização
COPY setup/start.sh ./start.sh

# Mudar propriedade dos arquivos para o usuário não-root
RUN chown -R nestjs:nodejs /app && chmod +x /app/start.sh

# Mudar para usuário não-root
USER nestjs

# Expor porta
EXPOSE 3000

# Configurar variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=3000

# Comando de inicialização
ENTRYPOINT ["dumb-init", "--"]
CMD ["./start.sh"]
