# 🔐 Credenciais de Acesso

## Sistema OSI - Terraplanagem Guimarães Serra LTDA

---

## 👥 Usuários Administrativos

### 👤 Usuário 1 - Gustavo

```
📧 Email:    gustavo@terraplanagemguimaraes.com
🔑 Senha:    terraplanagem2025
🎯 Perfil:   Administrador
✅ Acesso:   Painel OSI Completo
```

### 👤 Usuário 2 - Admin

```
📧 Email:    admin@terraplanagemguimaraes.com
🔑 Senha:    administrador2025
🎯 Perfil:   Administrador
✅ Acesso:   Painel OSI Completo
```

---

## 🚀 Como Fazer Login

### No Sistema Web:

1. Acesse o sistema no navegador
2. Clique no botão **"🔐 Login"** (canto superior direito)
3. Digite o email e senha
4. Clique em **"Entrar"**
5. Você será redirecionado para o Painel OSI

### Primeiro Acesso:

1. Use as credenciais acima
2. Acesse o Painel OSI
3. **⚠️ IMPORTANTE:** Troque a senha para uma senha pessoal forte
4. Configure suas preferências

---

## 🔧 Criar Usuários no Supabase

### Script Completo (Recomendado):

Execute o arquivo **`create-users-all.sql`** no Supabase SQL Editor.

Este script irá:
- ✅ Criar o usuário Gustavo
- ✅ Criar o usuário Admin
- ✅ Confirmar emails automaticamente
- ✅ Exibir relatório de criação

### Passo a Passo:

1. Acesse [Supabase Dashboard](https://app.supabase.com)
2. Selecione seu projeto
3. Vá em **"SQL Editor"**
4. Clique em **"New Query"**
5. Copie o conteúdo de `create-users-all.sql`
6. Cole no editor
7. Clique em **"Run"** (ou Ctrl+Enter)
8. Aguarde confirmação ✅

---

## 🔄 Trocar Senha

### No Supabase SQL Editor:

```sql
-- Trocar senha do Gustavo
UPDATE auth.users 
SET encrypted_password = crypt('nova_senha_aqui', gen_salt('bf')),
    updated_at = NOW()
WHERE email = 'gustavo@terraplanagemguimaraes.com';

-- Trocar senha do Admin
UPDATE auth.users 
SET encrypted_password = crypt('nova_senha_aqui', gen_salt('bf')),
    updated_at = NOW()
WHERE email = 'admin@terraplanagemguimaraes.com';
```

### Recomendações de Senha:

- ✅ Mínimo 8 caracteres
- ✅ Misture letras maiúsculas e minúsculas
- ✅ Inclua números
- ✅ Use caracteres especiais (@, #, $, !, etc.)

**Exemplos de senhas fortes:**
- `Terra@Guim2025`
- `OSI#Strong2025!`
- `Manutenc@o2025`

---

## 🗑️ Remover Usuário

```sql
-- Remover usuário (cuidado - ação irreversível)
DELETE FROM auth.users 
WHERE email = 'usuario@email.com';
```

---

## 📋 Listar Usuários

### Ver todos os usuários:

```sql
SELECT 
    email,
    created_at AS "Criado em",
    last_sign_in_at AS "Último acesso",
    CASE 
        WHEN email_confirmed_at IS NOT NULL THEN 'Ativo'
        ELSE 'Pendente'
    END AS "Status"
FROM auth.users
ORDER BY created_at DESC;
```

### Ver apenas emails:

```sql
SELECT email 
FROM auth.users 
ORDER BY email;
```

---

## 🔒 Segurança

### ⚠️ IMPORTANTE:

1. **Não compartilhe senhas** por email ou mensagem
2. **Troque senhas padrão** imediatamente
3. **Use senhas únicas** para cada usuário
4. **Não anote senhas** em locais inseguros
5. **Configure backup** regular do banco

### Boas Práticas:

- ✅ Senhas diferentes para cada sistema
- ✅ Troca periódica de senhas (a cada 90 dias)
- ✅ Não use informações pessoais óbvias
- ✅ Desative usuários que não usam mais o sistema
- ✅ Monitore logs de acesso regularmente

### Desativar usuário temporariamente:

```sql
-- Desativar por 30 dias
UPDATE auth.users 
SET banned_until = NOW() + INTERVAL '30 days'
WHERE email = 'usuario@email.com';

-- Reativar
UPDATE auth.users 
SET banned_until = NULL
WHERE email = 'usuario@email.com';
```

---

## 🆘 Problemas de Acesso

### ❌ Não consigo fazer login

**Verificações:**

1. Email está correto? (sem espaços extras)
2. Senha está correta? (case-sensitive)
3. Usuário foi criado no Supabase?
4. Verificar se usuário existe:
   ```sql
   SELECT email, email_confirmed_at 
   FROM auth.users 
   WHERE email = 'seu@email.com';
   ```

### ❌ Esqueci a senha

**Solução:**

Execute no Supabase para redefinir:

```sql
UPDATE auth.users 
SET encrypted_password = crypt('nova_senha', gen_salt('bf'))
WHERE email = 'seu@email.com';
```

### ❌ Usuário não aparece na lista

**Verificar:**

```sql
-- Contar usuários
SELECT COUNT(*) FROM auth.users;

-- Ver todos
SELECT * FROM auth.users;
```

---

## 📞 Suporte

Para mais informações:
- **Gerenciamento de usuários:** Ver `USUARIOS.md`
- **Configuração do banco:** Ver `SETUP_SUPABASE.md`
- **Guia rápido:** Ver `QUICK_SETUP.md`

---

## 📝 Notas Importantes

- ⚠️ **Senhas padrão:** Devem ser trocadas após primeiro acesso
- 🔒 **Dados sensíveis:** Não compartilhe este arquivo publicamente
- 💾 **Backup:** Mantenha cópia segura das credenciais
- 🔄 **Atualização:** Atualize este documento ao criar novos usuários

---

**Última Atualização:** Dezembro 2025  
**Versão:** 2.0.0  
**Sistema:** Terraplanagem Guimarães - OSI

**⚠️ CONFIDENCIAL - Uso interno apenas**
