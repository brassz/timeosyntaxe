# 👥 Usuários do Sistema

## 🔐 Credenciais Configuradas

### Usuário 1 - Gustavo

- **Email:** `gustavo@terraplanagemguimaraes.com`
- **Senha:** `terraplanagem2025`
- **Perfil:** Administrador
- **Acesso:** Painel OSI completo

### Usuário 2 - Admin

- **Email:** `admin@terraplanagemguimaraes.com`
- **Senha:** `administrador2025`
- **Perfil:** Administrador
- **Acesso:** Painel OSI completo

**Para criar TODOS os usuários de uma vez:**
1. Acesse o Supabase Dashboard
2. Vá em **SQL Editor**
3. Execute o script **`create-users-all.sql`** (RECOMENDADO)

**Ou use o script individual:**
- `create-user-gustavo.sql` - Cria ambos os usuários

## 📝 Como Criar Novos Usuários

### Método 1: Via SQL (Recomendado)

Execute no SQL Editor do Supabase:

```sql
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
    'email@usuario.com',  -- ← TROCAR EMAIL
    crypt('senha_segura', gen_salt('bf')),  -- ← TROCAR SENHA
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"name":"Nome do Usuário"}'::jsonb,  -- ← TROCAR NOME
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'email@usuario.com'
);
```

### Método 2: Via Dashboard do Supabase

1. Acesse **Authentication → Users**
2. Clique em **"Add User"**
3. Selecione **"Create new user"**
4. Preencha:
   - Email do usuário
   - Senha (mínimo 6 caracteres)
   - Auto Confirm User: ✅ Sim
5. Clique em **"Create user"**

## 🔄 Trocar Senha

### Para trocar a senha de um usuário existente:

```sql
-- Trocar senha do Gustavo (exemplo)
UPDATE auth.users 
SET 
    encrypted_password = crypt('nova_senha_aqui', gen_salt('bf')),
    updated_at = NOW()
WHERE email = 'gustavo@terraplanagemguimaraes.com';
```

### Para usuário trocar sua própria senha:

1. Fazer login no sistema
2. *(Funcionalidade de troca de senha pode ser implementada no futuro)*

## 📋 Listar Todos os Usuários

```sql
SELECT 
    email,
    created_at,
    last_sign_in_at,
    email_confirmed_at IS NOT NULL as confirmado,
    raw_user_meta_data->>'name' as nome
FROM auth.users
ORDER BY created_at DESC;
```

## 🗑️ Deletar Usuário

```sql
-- Cuidado! Esta ação é irreversível
DELETE FROM auth.users 
WHERE email = 'usuario@email.com';
```

## 🔐 Requisitos de Senha

- Mínimo de 6 caracteres
- Recomendado: Combinar letras, números e caracteres especiais
- Não usar senhas óbvias

### Exemplos de senhas fortes:
- ✅ `Terra@2025Guim`
- ✅ `PlanaG3m#2025`
- ✅ `OSI!Terra25`
- ❌ `123456` (muito fraca)
- ❌ `senha` (muito fraca)
- ❌ `terraplanagem` (muito óbvia)

## 📊 Monitoramento

### Ver últimos acessos:

```sql
SELECT 
    email,
    last_sign_in_at,
    sign_in_count
FROM auth.users
ORDER BY last_sign_in_at DESC NULLS LAST;
```

### Ver usuários criados recentemente:

```sql
SELECT 
    email,
    created_at,
    email_confirmed_at IS NOT NULL as ativo
FROM auth.users
WHERE created_at > NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;
```

## 🚨 Segurança

### Boas Práticas:

1. ✅ **Troque senhas padrão** imediatamente após primeiro acesso
2. ✅ **Use senhas diferentes** para cada usuário
3. ✅ **Não compartilhe senhas** por email ou mensagem
4. ✅ **Desative usuários** que não usam mais o sistema
5. ✅ **Monitore acessos** regularmente
6. ✅ **Faça backup** da lista de usuários

### Desativar usuário temporariamente:

```sql
-- Desativar
UPDATE auth.users 
SET banned_until = NOW() + INTERVAL '30 days'
WHERE email = 'usuario@email.com';

-- Reativar
UPDATE auth.users 
SET banned_until = NULL
WHERE email = 'usuario@email.com';
```

## 📞 Suporte

Para problemas com usuários:
- Verifique logs no Supabase Dashboard
- Confirme que o email está correto
- Teste credenciais no sistema
- Consulte documentação do Supabase Auth

## 🎯 Exemplo de Criação em Lote

Para criar múltiplos usuários de uma vez:

```sql
-- Criar vários usuários
DO $$
DECLARE
    usuarios TEXT[][] := ARRAY[
        ['usuario1@empresa.com', 'Senha123!', 'Usuário 1'],
        ['usuario2@empresa.com', 'Senha456!', 'Usuário 2'],
        ['usuario3@empresa.com', 'Senha789!', 'Usuário 3']
    ];
    usuario TEXT[];
BEGIN
    FOREACH usuario SLICE 1 IN ARRAY usuarios
    LOOP
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, 
            encrypted_password, email_confirmed_at,
            raw_user_meta_data, created_at, updated_at
        )
        SELECT
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            usuario[1],
            crypt(usuario[2], gen_salt('bf')),
            NOW(),
            jsonb_build_object('name', usuario[3]),
            NOW(),
            NOW()
        WHERE NOT EXISTS (
            SELECT 1 FROM auth.users WHERE email = usuario[1]
        );
        
        RAISE NOTICE 'Usuário criado: %', usuario[1];
    END LOOP;
END $$;
```

---

**Última Atualização:** Dezembro 2025  
**Sistema:** Terraplanagem Guimarães - OSI v2.0
