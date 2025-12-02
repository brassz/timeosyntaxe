# 🚀 Configuração Rápida do Supabase

Guia rápido para colocar o sistema no ar em menos de 5 minutos.

## 📋 Pré-requisitos

- Conta no Supabase (gratuita)
- Projeto já criado no Supabase

Se não tem projeto ainda:
1. Acesse [supabase.com](https://supabase.com)
2. Faça login ou crie conta
3. Clique em "New Project"
4. Escolha nome, senha e região
5. Aguarde criação (~2 minutos)

## ⚡ Passo a Passo Rápido

### 1️⃣ Executar Script SQL (2 minutos)

1. Abra seu projeto no [Supabase Dashboard](https://app.supabase.com)
2. Vá em **SQL Editor** (menu lateral)
3. Clique em **"+ New Query"**
4. Abra o arquivo `supabase-complete-setup.sql` do projeto
5. **Copie TODO o conteúdo** do arquivo
6. **Cole** no editor SQL do Supabase
7. Clique em **"Run"** (ou `Ctrl+Enter`)
8. Aguarde aparecer ✅ **"INSTALAÇÃO COMPLETA COM SUCESSO!"**

### 2️⃣ Criar Usuário Admin (1 minuto)

**Opção A - Criar Todos os Usuários (Recomendado):**

Execute o script pronto:
1. Abra o arquivo `create-users-all.sql`
2. Copie todo o conteúdo
3. Cole no SQL Editor do Supabase
4. Execute

**Credenciais criadas:**

**Usuário 1 - Gustavo:**
- 📧 Email: `gustavo@terraplanagemguimaraes.com`
- 🔑 Senha: `terraplanagem2025`

**Usuário 2 - Admin:**
- 📧 Email: `admin@terraplanagemguimaraes.com`
- 🔑 Senha: `administrador2025`

**Opção B - Criar usuário customizado:**

No SQL Editor, execute:

```sql
-- Criar usuário administrativo personalizado
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
)
SELECT
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'seu@email.com',  -- ← TROCAR
    crypt('sua_senha', gen_salt('bf')),  -- ← TROCAR
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"name":"Seu Nome"}'::jsonb,  -- ← TROCAR
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'seu@email.com'
);
```

⚠️ **IMPORTANTE:** Troque a senha após primeiro login!

### 3️⃣ Configurar Limpeza Automática (1 minuto - OPCIONAL)

Se quiser que checklists antigos sejam deletados automaticamente:

1. Vá em **Database → Extensions**
2. Procure por **"pg_cron"**
3. Clique em **"Enable"**
4. Volte para **SQL Editor**
5. Execute:

```sql
-- Configurar limpeza diária à meia-noite
SELECT cron.schedule(
    'cleanup-old-checklists-daily',
    '0 0 * * *',
    'SELECT cleanup_old_checklists();'
);
```

### 4️⃣ Testar o Sistema (1 minuto)

1. Abra o sistema no navegador
2. Clique em **"🔐 Login"** (canto superior direito)
3. Use as credenciais criadas:
   - Email: `admin@terraplanagem.com`
   - Senha: `Admin@2025`
4. Você deve ser redirecionado para o Painel OSI ✅
5. Clique em **"Gerar Ordem"**
6. Teste criar uma ordem de serviço

## ✅ Verificação

Para verificar se tudo está funcionando:

```sql
-- Ver estatísticas do sistema
SELECT * FROM get_system_stats();

-- Ver ordens criadas
SELECT order_number, vehicle, date, created_at 
FROM service_orders 
ORDER BY created_at DESC 
LIMIT 5;

-- Ver checklists recentes
SELECT operator, machine, date, completed
FROM checklists 
ORDER BY created_at DESC 
LIMIT 5;
```

## 🎉 Pronto!

Seu sistema está configurado e pronto para uso!

**O que você tem agora:**
- ✅ Banco de dados completo
- ✅ Usuário admin criado
- ✅ Sistema de limpeza (se configurou)
- ✅ Todas as tabelas e funções

## 📝 Próximos Passos

### Para Produção

1. **Trocar senha do admin**
   ```sql
   -- No SQL Editor do Supabase
   UPDATE auth.users 
   SET encrypted_password = crypt('SuaSenhaForte123!', gen_salt('bf'))
   WHERE email = 'admin@terraplanagem.com';
   ```

2. **Criar usuários adicionais**
   - Use o mesmo script do Passo 2
   - Troque email e senha
   - Crie um para cada administrador

3. **Configurar backup**
   - Supabase faz backup automático
   - Configure em: Settings → Database → Backups

4. **Deploy da aplicação**
   - Faça build: `npm run build`
   - Deploy no Vercel, Netlify ou similar

### Criar Mais Usuários

Para cada novo administrador:

```sql
INSERT INTO auth.users (
    instance_id, id, aud, role, email, 
    encrypted_password, email_confirmed_at, 
    created_at, updated_at
)
SELECT
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'usuario@empresa.com',  -- ← TROCAR EMAIL
    crypt('SenhaSegura123', gen_salt('bf')),  -- ← TROCAR SENHA
    NOW(),
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'usuario@empresa.com'
);
```

## 🆘 Problemas Comuns

### ❌ Erro: "relation already exists"
**Solução:** Tabelas já existem. Tudo bem! Script é idempotente.

### ❌ Erro ao fazer login
**Verificações:**
1. Usuário foi criado? 
   ```sql
   SELECT email FROM auth.users;
   ```
2. Email e senha corretos?
3. Auth está habilitado no projeto?

### ❌ Limpeza automática não funciona
**Verificações:**
1. pg_cron está habilitado?
2. Cron job foi criado?
   ```sql
   SELECT * FROM cron.job;
   ```

### ❌ Erro ao salvar dados
**Verificações:**
1. RLS está configurado?
2. Políticas foram criadas?
3. Chave anon está correta no código?

## 📞 Precisa de Ajuda?

Consulte os arquivos de documentação:
- `SETUP_SUPABASE.md` - Guia completo
- `README_OSI.md` - Manual do sistema OSI
- `POLITICA_RETENCAO.md` - Política de dados
- `TROUBLESHOOTING.md` - Solução de problemas

## 🔐 Segurança

**IMPORTANTE:**
- ✅ Troque senhas padrão
- ✅ Use senhas fortes
- ✅ Não compartilhe credenciais
- ✅ Configure backup regular
- ✅ Monitore logs de acesso

---

**Tempo total de configuração:** ~5 minutos  
**Dificuldade:** ⭐ Fácil  
**Suporte:** Documentação completa incluída
