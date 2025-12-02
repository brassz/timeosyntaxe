# 🔧 Guia de Solução de Problemas

## Problemas Comuns e Soluções

---

## ❌ Erro: relation "public.profiles" does not exist

### Sintoma:
```
ERROR: 42P01: relation "public.profiles" does not exist
QUERY: INSERT INTO public.profiles (id, username) VALUES...
CONTEXT: PL/pgSQL function handle_new_user() line 3...
```

### Causa:
O Supabase tem um trigger automático que tenta criar um perfil de usuário na tabela `profiles`, mas essa tabela não existe no seu projeto.

### Solução:

**Use o script simplificado: `create-users-simple.sql`** ⭐

Este script:
1. ✅ Cria a tabela `profiles` se não existir
2. ✅ Cria a função `handle_new_user()` com tratamento de erros
3. ✅ Cria os usuários sem precisar de permissões especiais
4. ✅ Garante que os perfis são criados

**Passo a passo:**
1. Acesse o Supabase SQL Editor
2. Abra o arquivo `create-users-simple.sql`
3. Copie TODO o conteúdo
4. Cole no editor SQL
5. Execute
6. Aguarde confirmação ✅

---

## ❌ Erro: must be owner of table users

### Sintoma:
```
ERROR: 42501: must be owner of table users
```

### Causa:
Tentativa de modificar triggers da tabela `auth.users` sem permissão.

### Solução:

**Use o script simplificado: `create-users-simple.sql`**

Este script NÃO tenta desabilitar triggers, funciona sem precisar de permissões especiais.

**Execute:**
```sql
-- Use o script create-users-simple.sql
-- Ele funciona sem tentar modificar a tabela auth.users
```

---

## ❌ Erro ao fazer login no sistema

### Sintoma:
- Não consigo fazer login
- Email ou senha incorretos
- Erro de autenticação

### Soluções:

#### 1. Verificar se usuário existe:
```sql
SELECT email, email_confirmed_at, created_at
FROM auth.users
WHERE email = 'gustavo@terraplanagemguimaraes.com';
```

#### 2. Verificar senha:
- Email: `gustavo@terraplanagemguimaraes.com`
- Senha: `terraplanagem2025` (case-sensitive!)

#### 3. Recriar usuário:
Execute o script `create-users-fixed.sql` novamente.

#### 4. Verificar configuração do Supabase:
- Auth está habilitado?
- Email provider está ativo?
- RLS configurado corretamente?

---

## ❌ Erro: duplicate key value violates unique constraint

### Sintoma:
```
ERROR: duplicate key value violates unique constraint "users_email_key"
```

### Causa:
Usuário já existe no sistema.

### Solução:

**Opção 1 - Trocar a senha do usuário existente:**
```sql
UPDATE auth.users 
SET encrypted_password = crypt('terraplanagem2025', gen_salt('bf')),
    updated_at = NOW()
WHERE email = 'gustavo@terraplanagemguimaraes.com';
```

**Opção 2 - Deletar e recriar:**
```sql
-- CUIDADO: Isso apaga o usuário permanentemente
DELETE FROM auth.users WHERE email = 'gustavo@terraplanagemguimaraes.com';

-- Depois execute o script de criação novamente
```

---

## ❌ Tabelas não foram criadas

### Sintoma:
- Erro ao salvar checklist
- Erro ao criar ordem de serviço
- Tabela não existe

### Solução:

Execute o setup completo:
```bash
# Use o script completo
supabase-complete-setup.sql
```

**Verificar se tabelas existem:**
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
AND table_name IN ('checklists', 'service_orders', 'profiles');
```

---

## ❌ Limpeza automática não funciona

### Sintoma:
Checklists antigos não são deletados após 7 dias.

### Causas possíveis:
1. pg_cron não está habilitado
2. Cron job não foi criado
3. Função não existe

### Soluções:

#### 1. Habilitar pg_cron:
- Vá em Database → Extensions
- Procure "pg_cron"
- Clique em "Enable"

#### 2. Criar cron job:
```sql
SELECT cron.schedule(
    'cleanup-old-checklists-daily',
    '0 0 * * *',
    'SELECT cleanup_old_checklists();'
);
```

#### 3. Verificar cron jobs:
```sql
SELECT * FROM cron.job;
```

#### 4. Executar limpeza manualmente:
```sql
SELECT cleanup_old_checklists();
```

---

## ❌ PDF/Excel não é gerado

### Sintoma:
- Erro ao gerar PDF
- Erro ao gerar Excel
- Download não inicia

### Soluções:

#### 1. Verificar console do navegador:
- Pressione F12
- Vá na aba "Console"
- Veja os erros

#### 2. Verificar campos obrigatórios:
- Data está preenchida?
- Veículo está preenchido?

#### 3. Limpar cache:
```
Ctrl + Shift + Delete (Chrome/Edge)
Cmd + Shift + Delete (Mac)
```

#### 4. Testar em navegador diferente:
- Chrome
- Firefox
- Edge

---

## ❌ Sistema não salva dados no Supabase

### Sintoma:
- Dados não aparecem no banco
- Erro ao salvar
- Timeout

### Soluções:

#### 1. Verificar conexão:
```sql
-- Testar insert manual
INSERT INTO checklists (id, operator, machine, location, date, items, completed)
VALUES ('test-123', 'Teste', 'Escavadeira', 'Obra', NOW(), '[]'::jsonb, false);

-- Ver se apareceu
SELECT * FROM checklists WHERE id = 'test-123';

-- Deletar teste
DELETE FROM checklists WHERE id = 'test-123';
```

#### 2. Verificar RLS (Row Level Security):
```sql
-- Ver políticas
SELECT * FROM pg_policies WHERE tablename = 'checklists';
```

#### 3. Verificar credenciais no código:
```typescript
// src/services/supabase.ts
const supabaseUrl = 'https://yzmxyqtfbthtrlnhrnpu.supabase.co';
const supabaseAnonKey = 'eyJ...';
```

---

## ❌ Ordem de serviço não incrementa número

### Sintoma:
Todas as ordens têm o mesmo número.

### Solução:

#### 1. Verificar sequence:
```sql
-- Ver valor atual
SELECT last_value FROM service_order_number_seq;

-- Resetar para 2200 (se necessário)
ALTER SEQUENCE service_order_number_seq RESTART WITH 2200;
```

#### 2. Verificar trigger:
```sql
-- Ver triggers
SELECT trigger_name, event_manipulation 
FROM information_schema.triggers 
WHERE event_object_table = 'service_orders';
```

---

## ❌ Modo escuro não funciona

### Sintoma:
Toggle não alterna cores.

### Solução:

#### 1. Limpar localStorage:
```javascript
// Console do navegador (F12)
localStorage.clear();
location.reload();
```

#### 2. Verificar CSS:
- Arquivo App.css tem variáveis [data-theme="dark"]?

---

## 🔍 Comandos Úteis de Diagnóstico

### Ver todos os usuários:
```sql
SELECT email, created_at, last_sign_in_at
FROM auth.users
ORDER BY created_at DESC;
```

### Ver todas as tabelas:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

### Ver estatísticas do sistema:
```sql
SELECT * FROM get_system_stats();
```

### Ver últimas ordens criadas:
```sql
SELECT order_number, vehicle, date, created_at
FROM service_orders
ORDER BY created_at DESC
LIMIT 10;
```

### Ver últimos checklists:
```sql
SELECT operator, machine, date, completed
FROM checklists
ORDER BY created_at DESC
LIMIT 10;
```

### Contar registros:
```sql
SELECT 
    (SELECT COUNT(*) FROM checklists) as total_checklists,
    (SELECT COUNT(*) FROM service_orders) as total_ordens,
    (SELECT COUNT(*) FROM auth.users) as total_usuarios;
```

---

## 📞 Ainda precisa de ajuda?

### Checklist de diagnóstico:

- [ ] Executou o script `supabase-complete-setup.sql`?
- [ ] Executou o script `create-users-fixed.sql`?
- [ ] Usuários aparecem em `auth.users`?
- [ ] Tabelas existem no banco?
- [ ] RLS está configurado?
- [ ] Credenciais estão corretas no código?
- [ ] Console do navegador mostra erros?
- [ ] Tentou em navegador diferente?
- [ ] Cache foi limpo?

### Recursos de suporte:

1. **Documentação:**
   - `SETUP_SUPABASE.md` - Setup completo
   - `QUICK_SETUP.md` - Guia rápido
   - `USUARIOS.md` - Gerenciamento de usuários
   - `CREDENCIAIS.md` - Informações de login

2. **Supabase:**
   - [Documentação Oficial](https://supabase.com/docs)
   - [Supabase Discord](https://discord.supabase.com)

3. **Logs do sistema:**
   - Supabase Dashboard → Logs
   - Console do navegador (F12)

---

**Última Atualização:** Dezembro 2025  
**Versão:** 2.0.0
