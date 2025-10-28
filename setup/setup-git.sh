#!/bin/bash

# Setup Git - Teste Avaliativo KPMG (Vaga Pleno)
# Script para configurar o Git com padrões semânticos

echo "🚀 Configurando Git para o projeto KPMG..."

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Execute este script na raiz do projeto (onde está o package.json)"
    exit 1
fi

# Configurar template de commit message
echo "📝 Configurando template de commit message..."
git config commit.template .gitmessage

# Configurar editor padrão (opcional)
echo "✏️  Configurando editor padrão..."
git config core.editor "code --wait"

# Configurar branch padrão
echo "🌿 Configurando branch padrão..."
git config init.defaultBranch main

# Configurar pull strategy
echo "🔄 Configurando estratégia de pull..."
git config pull.rebase false

# Configurar autocrlf para Windows (se necessário)
echo "🔧 Configurando line endings..."
git config core.autocrlf input

# Configurar alias úteis
echo "🔗 Configando aliases úteis..."
git config alias.co checkout
git config alias.br branch
git config alias.ci commit
git config alias.st status
git config alias.unstage 'reset HEAD --'
git config alias.last 'log -1 HEAD'
git config alias.visual '!gitk'

# Configurar alias para commits semânticos
git config alias.cm 'commit -m'
git config alias.amend 'commit --amend --no-edit'
git config alias.undo 'reset HEAD~1 --mixed'
git config alias.undo-soft 'reset HEAD~1 --soft'

# Configurar hooks (se não existirem)
echo "🪝 Verificando hooks..."
if [ ! -d ".git/hooks" ]; then
    mkdir -p .git/hooks
fi

# Criar hook de pre-commit simples
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
# Pre-commit hook - Teste Avaliativo KPMG (Vaga Pleno)

echo "🔍 Executando pre-commit checks..."

# Verificar se há arquivos staged
if [ -z "$(git diff --cached --name-only)" ]; then
    echo "❌ Nenhum arquivo staged para commit"
    exit 1
fi

# Verificar se o commit message segue o padrão (se configurado)
if [ -f ".gitmessage" ]; then
    echo "✅ Template de commit message configurado"
fi

echo "✅ Pre-commit checks concluídos"
exit 0
EOF

# Tornar o hook executável
chmod +x .git/hooks/pre-commit

# Configurar informações do usuário (se não estiverem configuradas)
echo "👤 Verificando configuração do usuário..."
if [ -z "$(git config user.name)" ]; then
    echo "⚠️  Nome do usuário não configurado. Configure com:"
    echo "   git config user.name 'Seu Nome'"
fi

if [ -z "$(git config user.email)" ]; then
    echo "⚠️  Email do usuário não configurado. Configure com:"
    echo "   git config user.email 'seu.email@exemplo.com'"
fi

echo ""
echo "✅ Configuração do Git concluída!"
echo ""
echo "📋 Próximos passos:"
echo "   1. Configure seu nome: git config user.name 'Seu Nome'"
echo "   2. Configure seu email: git config user.email 'seu.email@exemplo.com'"
echo "   3. Faça commits seguindo o padrão semântico"
echo ""
echo "📚 Documentação:"
echo "   - Padrões de commit: CONVENTIONAL_COMMITS.md"
echo "   - Setup Docker: DOCKER_SETUP.md"
echo ""
echo "🎯 Exemplo de commit:"
echo "   git commit -m 'feat(company): add company validation endpoint'"
echo ""
