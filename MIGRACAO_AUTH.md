# 🔄 Migração para Autenticação Customizada

## 📋 Resumo da Mudança

O sistema foi migrado de usar `auth.users` do Supabase para uma **tabela customizada `public.users`**.

### Por que a mudança?
- ✅ Maior controle sobre autenticação
- ✅ Sem dependência de triggers complexos do Supabase Auth
- ✅ Mais simples de configurar e manter
- ✅ Evita erros de schema e permissões
- ✅ Autenticação via localStorage (mais rápida)

---

## 🚀 Migração Completa - Passo a Passo

### Passo 1: Reverter Sistema Antigo (IMPORTANTE)

Execute no **SQL Editor do Supabase**:

**Arquivo: `revert-auth-supabase.sql`**
```sql
-- Este script:
-- ✅ Remove usuários do auth.users
-- ✅ Remove tabela profiles
-- ✅ Remove triggers e funções antigas
-- ✅ Limpa completamente o sistema antigo
```

### Passo 2: Configurar Nova Autenticação

Execute no **SQL Editor do Supabase**:

**Arquivo: `setup-custom-auth.sql`**
```sql
-- Este script cria:
-- ✅ Tabela public.users
-- ✅ Função login_user()
-- ✅ Função change_password()
-- ✅ RLS e políticas
-- ✅ Índices e triggers
```

### Passo 3: Criar Usuários

Execute no **SQL Editor do Supabase**:

**Arquivo: `create-users-custom.sql`**
```sql
-- Cria os 2 usuários:
-- ✅ gustavo@terraplanagemguimaraes.com / terraplanagem2025
-- ✅ admin@terraplanagemguimaraes.com / administrador2025
```

### Passo 4: Testar o Sistema

1. **Recarregue a aplicação** (F5)
2. Clique em **"🔐 Login"**
3. Use as credenciais:
   - Email: `gustavo@terraplanagemguimaraes.com`
   - Senha: `terraplanagem2025`
4. Sistema deve fazer login com sucesso ✅

---

## 📊 Comparação: Antes vs Depois

### Antes (auth.users do Supabase)

```typescript
// Sistema complexo com triggers
- Usava auth.users
- Precisava de tabela profiles
- Triggers automáticos
- Funções handle_new_user
- Session management do Supabase
- Erros de schema comuns
```

### Depois (Tabela customizada)

```typescript
// Sistema simples e direto
- Usa public.users
- Função login_user() própria
- Sem triggers complexos
- localStorage para sessão
- Mais controle e simplicidade
- Sem erros de schema
```

---

## 🗄️ Estrutura da Tabela users

```sql
CREATE TABLE public.users (
    id UUID PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,  -- Hash bcrypt
    full_name TEXT,
    role TEXT DEFAULT 'admin',
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    last_login_at TIMESTAMP
);
```

---

## 🔐 Como Funciona o Login

### 1. Usuário digita credenciais
```typescript
await signIn('gustavo@terraplanagemguimaraes.com', 'terraplanagem2025');
```

### 2. Sistema chama função SQL
```sql
SELECT * FROM login_user(
    'gustavo@terraplanagemguimaraes.com',
    'terraplanagem2025'
);
```

### 3. Função verifica:
- ✅ Usuário existe?
- ✅ Está ativo?
- ✅ Senha correta? (usando crypt)

### 4. Se sucesso:
- ✅ Atualiza last_login_at
- ✅ Retorna dados do usuário
- ✅ Salva no localStorage
- ✅ Redireciona para painel OSI

---

## 🛠️ Operações Disponíveis

### Login
```sql
SELECT * FROM login_user(
    'email@exemplo.com',
    'senha123'
);
```

### Trocar Senha
```sql
SELECT * FROM change_password(
    'user-uuid-aqui',
    'senha_antiga',
    'senha_nova'
);
```

### Criar Usuário
```sql
INSERT INTO public.users (email, password_hash, full_name, role)
VALUES (
    'novo@email.com',
    crypt('senha123', gen_salt('bf')),
    'Nome Completo',
    'admin'
);
```

### Listar Usuários (sem senha)
```sql
SELECT * FROM users_safe;
```

### Desativar Usuário
```sql
UPDATE public.users 
SET active = false 
WHERE email = 'usuario@email.com';
```

---

## 📝 Scripts Criados

### Novos Scripts (USAR ESTES):
1. **`revert-auth-supabase.sql`** - Limpa sistema antigo
2. **`setup-custom-auth.sql`** - Configura novo sistema
3. **`create-users-custom.sql`** - Cria usuários

### Scripts Antigos (DELETADOS):
- ❌ `create-user-gustavo.sql`
- ❌ `create-users-all.sql`
- ❌ `create-users-basic.sql`
- ❌ `create-users-fixed.sql`
- ❌ `create-users-simple.sql`
- ❌ `fix-supabase-auth.sql`

---

## 🔍 Verificações

### Ver usuários:
```sql
SELECT 
    email,
    full_name,
    role,
    active,
    last_login_at
FROM public.users;
```

### Testar login:
```sql
SELECT * FROM login_user(
    'gustavo@terraplanagemguimaraes.com',
    'terraplanagem2025'
);
```

### Contar usuários:
```sql
SELECT COUNT(*) FROM public.users WHERE active = true;
```

---

## 🎯 Vantagens do Novo Sistema

### Simplicidade
- ✅ Apenas 1 tabela (users)
- ✅ Sem triggers complexos
- ✅ Sem dependências externas
- ✅ Código mais limpo

### Performance
- ✅ Login via RPC direto
- ✅ LocalStorage para sessão
- ✅ Menos queries ao banco
- ✅ Sem overhead do Supabase Auth

### Manutenção
- ✅ Mais fácil debugar
- ✅ Controle total do fluxo
- ✅ Sem surpresas de updates
- ✅ Logs mais claros

### Segurança
- ✅ Hash bcrypt forte
- ✅ RLS configurado
- ✅ Função SECURITY DEFINER
- ✅ Validação de email

---

## 🚨 Troubleshooting

### Erro ao fazer login

**Verificar se usuário existe:**
```sql
SELECT * FROM public.users WHERE email = 'email@exemplo.com';
```

**Verificar se está ativo:**
```sql
SELECT active FROM public.users WHERE email = 'email@exemplo.com';
```

### Senha não funciona

**Recriar hash da senha:**
```sql
UPDATE public.users 
SET password_hash = crypt('nova_senha', gen_salt('bf'))
WHERE email = 'email@exemplo.com';
```

### Função não existe

**Reexecutar setup:**
```sql
-- Execute novamente: setup-custom-auth.sql
```

---

## 📞 Suporte

Para problemas:
1. Verifique se executou os 3 scripts na ordem
2. Consulte a documentação de cada script
3. Execute as queries de verificação
4. Veja logs no console do navegador (F12)

---

**Data da Migração:** Dezembro 2025  
**Versão:** 2.0.0  
**Status:** ✅ Migração Completa
