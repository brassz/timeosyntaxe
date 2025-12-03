# ⚡ Configuração Rápida - 5 Minutos

## 🚨 Vendo Erro de Conexão?

Se você está vendo erros como:
```
Failed to load resource: net::ERR_NAME_NOT_RESOLVED
your-project.supabase.co
```

**Isso significa que o Supabase ainda não foi configurado!**

## 📝 Passos Rápidos

### 1. Criar Conta no Supabase (2 minutos)

1. Acesse: https://supabase.com
2. Clique em **"Start your project"**
3. Faça login com GitHub ou email
4. Clique em **"New Project"**
5. Preencha:
   - **Name**: `terraplanagem`
   - **Database Password**: Escolha uma senha forte (anote!)
   - **Region**: Brazil (South America) ou mais próxima
6. Clique em **"Create new project"**
7. ⏳ Aguarde 1-2 minutos (prepare um café ☕)

### 2. Copiar Credenciais (30 segundos)

1. No dashboard do Supabase, clique em **Settings** (ícone ⚙️)
2. Clique em **API** no menu lateral
3. Você verá duas informações importantes:

**Project URL**:
```
https://abcdefghijklm.supabase.co
```

**anon/public key** (uma chave longa):
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3M...
```

### 3. Configurar o Projeto (1 minuto)

1. No seu projeto, abra o arquivo `.env`
2. Cole suas credenciais:

```env
VITE_SUPABASE_URL=https://abcdefghijklm.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3M...
```

3. Salve o arquivo (Ctrl+S ou Cmd+S)

### 4. Criar Tabelas (1 minuto)

1. No dashboard do Supabase, clique em **SQL Editor** (ícone 📝)
2. Clique em **"New query"**
3. **Copie e cole** todo este SQL:

```sql
-- Criar tabela de usuários
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

-- Criar tabela de checklists
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

-- Criar tabela de OSI
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

-- Desativar RLS para desenvolvimento
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE checklists DISABLE ROW LEVEL SECURITY;
ALTER TABLE osi_orders DISABLE ROW LEVEL SECURITY;
```

4. Clique em **"RUN"** (ou pressione Ctrl+Enter)
5. Deve aparecer: ✅ "Success. No rows returned"

### 5. Reiniciar o Sistema (30 segundos)

1. **Pare o servidor** (Ctrl+C no terminal)
2. **Inicie novamente**:
```bash
npm run dev
```
3. Abra no navegador: http://localhost:5173

## ✅ Verificar se Funcionou

### Teste 1: Checklist
1. Preencha os dados e crie um checklist
2. Deve funcionar normalmente

### Teste 2: Login OSI
1. Clique em **"🔐 OSI - Login"**
2. Use:
   - **Usuário**: `admin`
   - **Senha**: `admin123`
3. Deve entrar no painel OSI

## 🎉 Pronto!

Se conseguiu fazer login, está tudo configurado!

Agora você pode:
- ✅ Criar checklists (salvos no banco)
- ✅ Criar ordens de serviço
- ✅ Gerar PDFs e Excel
- ✅ Ver histórico completo

## ❌ Ainda com Erro?

### Erro: "Usuário ou senha incorretos"
- ✅ Use exatamente: `admin` e `admin123`
- ✅ Verifique se criou a tabela `users` no SQL

### Erro: "Banco de dados não configurado"
- ✅ Verifique se o arquivo `.env` está correto
- ✅ Reinicie o servidor (npm run dev)
- ✅ Limpe o cache do navegador (Ctrl+Shift+R)

### Erro: "relation users does not exist"
- ✅ Execute o SQL novamente no Supabase
- ✅ Verifique se aparece a tabela `users` no Table Editor

### Erro: "Invalid API key"
- ✅ Copie a chave correta do Supabase (a anon/public, não a service)
- ✅ Certifique-se de copiar a chave inteira (é bem longa!)

## 📞 Precisa de Ajuda?

1. Veja a documentação completa: `INSTALACAO.md`
2. Veja detalhes do banco: `SUPABASE_SETUP.md`
3. Verifique o console do navegador (F12) para erros

---

## 🚀 Uso Rápido Após Configurado

### Criar Checklist:
1. Tela inicial → Preencher dados → Iniciar Checklist
2. Preencher itens → Finalizar (gera PDF)

### Criar Ordem de Serviço:
1. Tela inicial → "🔐 OSI - Login"
2. Login: admin/admin123
3. Aba "Nova Ordem" → Preencher formulário
4. "📄 Salvar e Gerar PDF" ou "📊 Salvar e Gerar Excel"

### Ver Histórico de Ordens:
1. No painel OSI → Aba "Histórico"
2. Clicar em uma ordem para ver detalhes
3. Gerar PDF/Excel novamente se necessário
