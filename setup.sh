#!/bin/bash

echo "🚀 Configurando Sistema de Agendamentos..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para imprimir mensagens coloridas
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    print_error "Node.js não está instalado. Por favor, instale Node.js 18+ antes de continuar."
    exit 1
fi

# Verificar versão do Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js versão 18+ é necessária. Versão atual: $(node -v)"
    exit 1
fi

print_success "Node.js $(node -v) encontrado"

# Verificar se PostgreSQL está instalado
if ! command -v psql &> /dev/null; then
    print_warning "PostgreSQL não encontrado. Certifique-se de ter PostgreSQL instalado e rodando."
    print_warning "Você pode usar Docker: docker run --name postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres"
fi

# Instalar dependências do projeto raiz
print_status "Instalando dependências do projeto raiz..."
npm install
if [ $? -eq 0 ]; then
    print_success "Dependências do projeto raiz instaladas"
else
    print_error "Falha ao instalar dependências do projeto raiz"
    exit 1
fi

# Instalar dependências do servidor
print_status "Instalando dependências do servidor..."
cd server
npm install
if [ $? -eq 0 ]; then
    print_success "Dependências do servidor instaladas"
else
    print_error "Falha ao instalar dependências do servidor"
    exit 1
fi

# Configurar banco de dados
print_status "Configurando banco de dados..."

# Verificar se .env existe
if [ ! -f ".env" ]; then
    print_warning "Arquivo .env não encontrado. Copiando de .env.example..."
    cp .env.example .env
    print_warning "Por favor, edite o arquivo server/.env com suas configurações de banco de dados"
    print_warning "DATABASE_URL=\"postgresql://usuario:senha@localhost:5432/agendamentos?schema=public\""
fi

# Gerar cliente Prisma
print_status "Gerando cliente Prisma..."
npx prisma generate
if [ $? -eq 0 ]; then
    print_success "Cliente Prisma gerado"
else
    print_error "Falha ao gerar cliente Prisma"
    exit 1
fi

# Executar migrações (se o banco estiver disponível)
print_status "Tentando executar migrações do banco de dados..."
npx prisma migrate dev --name init 2>/dev/null
if [ $? -eq 0 ]; then
    print_success "Migrações executadas com sucesso"
    
    # Executar seed
    print_status "Executando seed do banco de dados..."
    npm run db:seed
    if [ $? -eq 0 ]; then
        print_success "Seed executado com sucesso"
    else
        print_warning "Falha ao executar seed (não é crítico)"
    fi
else
    print_warning "Não foi possível executar migrações. Certifique-se de que o PostgreSQL está rodando e as configurações estão corretas."
fi

# Voltar para o diretório raiz
cd ..

# Instalar dependências do cliente
print_status "Instalando dependências do cliente..."
cd client
npm install
if [ $? -eq 0 ]; then
    print_success "Dependências do cliente instaladas"
else
    print_error "Falha ao instalar dependências do cliente"
    exit 1
fi

# Voltar para o diretório raiz
cd ..

print_success "✅ Setup concluído com sucesso!"
echo ""
echo "📋 Próximos passos:"
echo "1. Configure o banco PostgreSQL se ainda não fez"
echo "2. Edite server/.env com suas configurações"
echo "3. Execute 'npm run dev' para iniciar o sistema"
echo ""
echo "🔗 URLs importantes:"
echo "- Frontend: http://localhost:3000"
echo "- Backend API: http://localhost:3001/api"
echo "- Prisma Studio: npx prisma studio (no diretório server/)"
echo ""
echo "👤 Usuários padrão (após seed):"
echo "- Admin: admin@agendamentos.com / admin123"
echo "- Provider: provider@agendamentos.com / provider123"
echo "- Cliente: client@agendamentos.com / client123"
echo ""
echo "🎉 Sistema de Agendamentos pronto para uso!"