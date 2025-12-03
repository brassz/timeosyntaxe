# Guia de Instalação - Sistema Terraplanagem Guimarães

## Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn
- Conta no Supabase (gratuita)

## Passo 1: Clonar/Baixar o Projeto

```bash
# Se estiver usando git
git clone <url-do-repositorio>
cd terraplanagem-guimaraes

# Ou extraia o arquivo ZIP na pasta desejada
```

## Passo 2: Instalar Dependências

```bash
npm install
```

## Passo 3: Configurar Banco de Dados Supabase

### 3.1. Criar Conta e Projeto no Supabase

1. Acesse https://supabase.com
2. Crie uma conta gratuita
3. Clique em "New Project"
4. Preencha os dados:
   - Nome do projeto: `terraplanagem-guimaraes`
   - Database Password: (escolha uma senha forte)
   - Region: Brazil (São Paulo) ou mais próxima
5. Aguarde a criação do projeto (1-2 minutos)

### 3.2. Obter Credenciais

1. No dashboard do Supabase, clique no projeto criado
2. Vá em **Settings** (ícone de engrenagem) > **API**
3. Copie os valores:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbGci...` (uma chave longa)

### 3.3. Configurar Variáveis de Ambiente

1. Na raiz do projeto, copie o arquivo de exemplo:
```bash
cp .env.example .env
```

2. Abra o arquivo `.env` e cole suas credenciais:
```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-aqui
```

### 3.4. Criar Tabelas no Banco de Dados

1. No dashboard do Supabase, vá em **SQL Editor**
2. Clique em **New Query**
3. Execute os comandos SQL abaixo (pode copiar e colar tudo de uma vez):

```sql
-- ============================================
-- TABELA DE USUÁRIOS
-- ============================================
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Inserir usuários de teste
INSERT INTO users (username, password, name) VALUES 
  ('admin', 'admin123', 'Administrador'),
  ('mecanico', 'mecanico123', 'João Silva'),
  ('supervisor', 'supervisor123', 'Maria Santos');

-- ============================================
-- TABELA DE CHECKLISTS
-- ============================================
CREATE TABLE checklists (
  id VARCHAR(255) PRIMARY KEY,
  operator VARCHAR(100) NOT NULL,
  machine VARCHAR(100) NOT NULL,
  location VARCHAR(200) NOT NULL,
  date TIMESTAMP NOT NULL,
  horimeter VARCHAR(50),
  mileage VARCHAR(50),
  tag VARCHAR(50),
  items JSONB NOT NULL,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_checklists_created_at ON checklists(created_at DESC);
CREATE INDEX idx_checklists_operator ON checklists(operator);

-- ============================================
-- TABELA DE ORDENS DE SERVIÇO INTERNA (OSI)
-- ============================================
CREATE TABLE osi_orders (
  id SERIAL PRIMARY KEY,
  order_number INTEGER UNIQUE NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  vehicle VARCHAR(100) NOT NULL,
  equipment VARCHAR(100),
  km_inicial VARCHAR(50),
  km_final VARCHAR(50),
  tag VARCHAR(50),
  horimeter VARCHAR(50),
  maintenance_type JSONB NOT NULL,
  services_description TEXT NOT NULL,
  parts_applied TEXT,
  observations TEXT,
  mechanic VARCHAR(100),
  responsible VARCHAR(100),
  created_by VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_osi_orders_created_at ON osi_orders(created_at DESC);
CREATE INDEX idx_osi_orders_order_number ON osi_orders(order_number DESC);
CREATE INDEX idx_osi_orders_created_by ON osi_orders(created_by);

-- ============================================
-- DESATIVAR RLS (PARA DESENVOLVIMENTO)
-- ============================================
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE checklists DISABLE ROW LEVEL SECURITY;
ALTER TABLE osi_orders DISABLE ROW LEVEL SECURITY;
```

4. Clique em **Run** (ou pressione Ctrl+Enter)
5. Verifique se apareceu "Success. No rows returned" (isso é normal)

### 3.5. Verificar se as Tabelas Foram Criadas

1. No dashboard do Supabase, vá em **Table Editor**
2. Você deve ver 3 tabelas:
   - `users` (com 3 usuários)
   - `checklists` (vazia)
   - `osi_orders` (vazia)

## Passo 4: Iniciar o Sistema

```bash
npm run dev
```

O sistema estará disponível em: http://localhost:5173

## Passo 5: Testar o Sistema

### Testar Checklist
1. Na tela inicial, preencha os dados do operador e máquina
2. Clique em "Iniciar Checklist"
3. Preencha o checklist
4. Clique em "Finalizar" para gerar o PDF

### Testar OSI (Ordem de Serviço Interna)
1. Na tela inicial, clique em "🔐 OSI - Login"
2. Use as credenciais:
   - **Usuário:** `admin`
   - **Senha:** `admin123`
3. Crie uma nova ordem de serviço
4. Gere PDF ou Excel
5. Veja o histórico na aba "Histórico"

## Funcionalidades do Sistema

### 1. Checklist de Máquinas
- ✅ Criar checklists para diferentes tipos de máquinas
- ✅ Adicionar fotos aos itens
- ✅ Gerar PDF do checklist
- ✅ Ver histórico de checklists
- ✅ **Checklists são salvos no Supabase**
- ✅ **Limpeza automática após 7 dias**

### 2. OSI - Ordem de Serviço Interna (NOVO!)
- ✅ Login de usuários
- ✅ Criar novas ordens de serviço
- ✅ Gerar PDF (baseado no modelo fornecido)
- ✅ Gerar Excel
- ✅ Histórico completo (não expira)
- ✅ Numeração automática de ordens

### 3. Recursos Gerais
- ✅ Modo claro/escuro
- ✅ Responsivo (funciona em celular)
- ✅ Salvamento em nuvem (Supabase)
- ✅ Funciona offline (com limitações)

## Estrutura de Pastas

```
terraplanagem-guimaraes/
├── src/
│   ├── components/         # Componentes React
│   │   ├── Home.tsx       # Tela inicial
│   │   ├── Checklist.tsx  # Formulário de checklist
│   │   ├── History.tsx    # Histórico de checklists
│   │   ├── Login.tsx      # Tela de login OSI
│   │   └── OSI.tsx        # Painel OSI
│   ├── services/          # Serviços e APIs
│   │   ├── storage.ts     # Gerenciamento de dados
│   │   ├── supabase.ts    # Conexão Supabase
│   │   ├── pdf.ts         # Geração de PDF checklist
│   │   ├── osiPdf.ts      # Geração de PDF OSI
│   │   └── osiExcel.ts    # Geração de Excel OSI
│   ├── types/             # Tipos TypeScript
│   └── App.tsx            # Componente principal
├── .env                   # Credenciais (NÃO COMMITAR!)
├── .env.example           # Exemplo de credenciais
└── package.json           # Dependências
```

## Usuários Padrão

| Usuário | Senha | Nome |
|---------|-------|------|
| admin | admin123 | Administrador |
| mecanico | mecanico123 | João Silva |
| supervisor | supervisor123 | Maria Santos |

## Adicionar Novos Usuários

1. No Supabase, vá em **Table Editor** > **users**
2. Clique em **Insert** > **Insert row**
3. Preencha:
   - `username`: nome de usuário único
   - `password`: senha (texto simples por enquanto)
   - `name`: nome completo
4. Clique em **Save**

**IMPORTANTE:** Para produção, implemente hash de senhas!

## Problemas Comuns

### Erro: "Failed to connect to Supabase"
- ✅ Verifique se o arquivo `.env` existe e está preenchido
- ✅ Confirme que as credenciais estão corretas
- ✅ Verifique se o projeto Supabase está ativo

### Erro: "relation users does not exist"
- ✅ Execute os comandos SQL novamente no SQL Editor
- ✅ Verifique se as tabelas foram criadas no Table Editor

### Login não funciona
- ✅ Confirme que a tabela `users` tem dados
- ✅ Verifique no console do navegador (F12) se há erros
- ✅ Teste com: usuário `admin`, senha `admin123`

### PDF não gera
- ✅ Verifique se há erros no console
- ✅ Tente desabilitar bloqueadores de popup
- ✅ Teste em outro navegador

## Build para Produção

```bash
npm run build
```

Os arquivos estarão na pasta `dist/`

## Deploy

### Opção 1: Vercel (Recomendado)
1. Instale a CLI: `npm install -g vercel`
2. Execute: `vercel`
3. Siga as instruções
4. Configure as variáveis de ambiente no dashboard da Vercel

### Opção 2: Netlify
1. Arraste a pasta `dist/` para https://app.netlify.com/drop
2. Configure as variáveis de ambiente no dashboard

### Opção 3: Servidor Próprio
1. Copie a pasta `dist/` para seu servidor
2. Configure um servidor web (nginx, apache)
3. Configure SSL/HTTPS

## Suporte

Para dúvidas sobre:
- **Supabase:** https://supabase.com/docs
- **Vite:** https://vitejs.dev
- **React:** https://react.dev

## Licença

© 2025 Terraplanagem Guimarães - Todos os direitos reservados
