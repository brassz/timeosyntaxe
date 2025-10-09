# 👤 Criar Usuário Bruno TI

## 📧 Dados do Usuário
- **Email**: `bruno@ti`
- **Senha**: `102030`
- **Nome**: `Bruno TI`

## 🚀 Como Criar o Usuário

### ✅ MÉTODO 1: Supabase Dashboard (RECOMENDADO)

1. **Acesse o Supabase Dashboard**
   - URL: https://supabase.com/dashboard
   - Faça login na sua conta Supabase

2. **Navegue para Authentication**
   - No menu lateral, clique em **Authentication**
   - Clique na aba **Users**

3. **Adicione o Usuário**
   - Clique no botão **"Add user"** ou **"Invite user"**
   - Preencha os dados:
     - **Email**: `bruno@ti`
     - **Password**: `102030`
     - **Confirm password**: `102030`
   - Marque **"Auto Confirm User"** (para pular verificação de email)
   - Clique em **"Create user"** ou **"Send invitation"**

4. **Verificação**
   - O usuário aparecerá na lista de usuários
   - Um perfil será automaticamente criado na tabela `usuarios` (via trigger)

---

### 🔧 MÉTODO 2: SQL Editor

1. **Acesse o SQL Editor**
   - No Supabase Dashboard, vá em **SQL Editor**

2. **Execute o SQL**
   ```sql
   -- Criar usuário via função administrativa
   SELECT auth.admin_create_user(
     'bruno@ti',           -- email
     '102030',             -- password
     '{"name": "Bruno TI"}'::jsonb,  -- user_metadata
     true                  -- email_confirmed
   );
   ```

3. **Verificar Criação**
   ```sql
   -- Verificar se foi criado
   SELECT 
     u.id,
     u.email,
     u.created_at,
     usr.nome,
     usr.ativo
   FROM auth.users u
   LEFT JOIN usuarios usr ON u.id = usr.id
   WHERE u.email = 'bruno@ti';
   ```

---

### 🛠️ MÉTODO 3: Via API (Programático)

Se você tiver a **Service Role Key**:

1. **Configure a variável de ambiente**
   ```bash
   export SUPABASE_SERVICE_ROLE_KEY="sua_service_role_key_aqui"
   ```

2. **Execute o script**
   ```bash
   node insert-user.js
   ```

---

### 🔍 MÉTODO 4: Verificar se Já Existe

Execute este SQL para verificar se o usuário já existe:

```sql
SELECT 
  u.id,
  u.email,
  u.email_confirmed_at,
  u.created_at,
  usr.nome,
  usr.ativo,
  usr.created_at as profile_created_at
FROM auth.users u
LEFT JOIN usuarios usr ON u.id = usr.id
WHERE u.email = 'bruno@ti';
```

---

## 🎯 Resultado Esperado

Após a criação bem-sucedida:

- ✅ Usuário criado em `auth.users`
- ✅ Perfil criado automaticamente em `usuarios`
- ✅ Pode fazer login com `bruno@ti` / `102030`
- ✅ Acesso ao dashboard da aplicação

---

## 🔐 Teste de Login

Após criar o usuário, teste o login:

1. Acesse a aplicação: http://localhost:3000/login
2. Digite:
   - **Email**: `bruno@ti`
   - **Senha**: `102030`
3. Clique em **"Entrar"**
4. Deve redirecionar para `/dashboard`

---

## 🐛 Solução de Problemas

### Erro: "User already registered"
- O usuário já existe
- Verifique com o SQL do Método 4

### Erro: "Invalid login credentials"
- Verifique se a senha está correta: `102030`
- Confirme se o email está correto: `bruno@ti`

### Perfil não criado na tabela `usuarios`
Execute manualmente:
```sql
INSERT INTO usuarios (id, nome, email, ativo)
SELECT id, 'Bruno TI', email, true
FROM auth.users 
WHERE email = 'bruno@ti'
AND id NOT IN (SELECT id FROM usuarios);
```

---

## 📝 Arquivos Criados

- `insert-user.js` - Script Node.js para criação via API
- `insert-bruno-user.sql` - Script SQL para execução direta
- `create-bruno-user.js` - Script de teste e instruções

---

**✨ Criado em**: 2025-01-09  
**🎯 Objetivo**: Inserir usuário bruno@ti com senha 102030  
**🔧 Sistema**: TimeoSyntaxe + Supabase