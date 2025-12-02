# 🚨 Solução Rápida de Problemas

## Problema 1: "Database error querying schema"

### ✅ SOLUÇÃO RÁPIDA

Execute os scripts nesta ordem:

### Passo 1: Corrigir Schema
```sql
-- Arquivo: fix-supabase-auth.sql
-- Copie e execute no SQL Editor do Supabase
```

Este script vai:
- ✅ Remover triggers problemáticos
- ✅ Criar tabela profiles corretamente
- ✅ Criar função e trigger sem erros

### Passo 2: Criar Usuários
```sql
-- Arquivo: create-users-basic.sql
-- Copie e execute no SQL Editor do Supabase
```

Este script vai:
- ✅ Criar os 2 usuários
- ✅ Sem depender de profiles ou triggers
- ✅ Funciona sem erros

### Passo 3: Verificar
```sql
SELECT email, created_at, email_confirmed_at 
FROM auth.users
WHERE email LIKE '%terraplanagemguimaraes%';
```

---

## Problema 2: Modal de Login Fecha ao Selecionar Senha

### ✅ SOLUÇÃO IMPLEMENTADA

O problema foi corrigido no código:
- ✅ `LoginModal.tsx` - Evento de clique ajustado
- ✅ `LoginModal.css` - Permitido seleção de texto nos inputs

### O que mudou:

**Antes:**
```typescript
<div className="modal-overlay" onClick={onClose}>
  // Fechava ao clicar em qualquer lugar
</div>
```

**Depois:**
```typescript
const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
  // Só fecha se clicar FORA do modal
  if (e.target === e.currentTarget) {
    onClose();
  }
};

<div className="modal-overlay" onClick={handleOverlayClick}>
```

---

## 🎯 Guia Completo de Configuração

### 1. Preparar Banco de Dados

Execute no **SQL Editor do Supabase** (nesta ordem):

#### A) Criar tabelas do sistema
```sql
-- Execute: supabase-complete-setup.sql
-- Cria: checklists, service_orders, índices, triggers
```

#### B) Corrigir autenticação
```sql
-- Execute: fix-supabase-auth.sql
-- Corrige: profiles, triggers, função handle_new_user
```

#### C) Criar usuários
```sql
-- Execute: create-users-basic.sql
-- Cria: gustavo@terraplanagemguimaraes.com
--       admin@terraplanagemguimaraes.com
```

### 2. Rebuild do Sistema (se necessário)

Se o modal ainda tiver problema:

```bash
# No terminal do projeto
npm run build
```

Ou se estiver rodando dev server:
```bash
# Parar o servidor (Ctrl+C)
# Iniciar novamente
npm run dev
```

### 3. Testar Login

1. Abra o sistema no navegador
2. Clique em **"🔐 Login"**
3. Digite:
   - Email: `gustavo@terraplanagemguimaraes.com`
   - Senha: `terraplanagem2025`
4. O modal NÃO deve fechar ao selecionar texto
5. Clique em **"Entrar"**

---

## 📝 Resumo dos Scripts

| Script | Quando Usar | O que Faz |
|--------|-------------|-----------|
| `supabase-complete-setup.sql` | Primeira vez | Cria todas as tabelas do sistema |
| `fix-supabase-auth.sql` | Se tiver erro de schema | Corrige profiles e triggers |
| `create-users-basic.sql` | Criar usuários | ⭐ Cria os 2 usuários (MAIS SIMPLES) |
| `create-users-simple.sql` | Alternativa | Cria usuários com profiles |

---

## 🔧 Comandos Úteis

### Ver se usuários existem:
```sql
SELECT email, email_confirmed_at, created_at
FROM auth.users
WHERE email LIKE '%terraplanagemguimaraes%';
```

### Ver se tabelas existem:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

### Deletar usuário (se precisar recriar):
```sql
DELETE FROM auth.users 
WHERE email = 'gustavo@terraplanagemguimaraes.com';
```

### Trocar senha:
```sql
UPDATE auth.users 
SET encrypted_password = crypt('nova_senha', gen_salt('bf'))
WHERE email = 'gustavo@terraplanagemguimaraes.com';
```

---

## ❓ FAQ - Perguntas Frequentes

### Q: O modal ainda fecha ao selecionar?
**A:** Faça rebuild do projeto: `npm run build` ou reinicie o dev server.

### Q: Erro "relation profiles does not exist"?
**A:** Execute `fix-supabase-auth.sql` primeiro, depois `create-users-basic.sql`.

### Q: Não consigo fazer login?
**A:** Verifique se usuário existe:
```sql
SELECT * FROM auth.users WHERE email = 'gustavo@terraplanagemguimaraes.com';
```

### Q: Senha está correta mas não entra?
**A:** Tente recriar o usuário:
```sql
-- Deletar
DELETE FROM auth.users WHERE email = 'gustavo@terraplanagemguimaraes.com';

-- Executar create-users-basic.sql novamente
```

---

## 🆘 Última Solução: Reset Completo

Se nada funcionar, reset completo:

```sql
-- 1. Limpar usuários
DELETE FROM auth.users 
WHERE email LIKE '%terraplanagemguimaraes%';

-- 2. Limpar profiles
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 3. Remover trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- 4. Executar scripts na ordem:
--    a) fix-supabase-auth.sql
--    b) create-users-basic.sql
```

---

## ✅ Checklist Final

- [ ] Executou `supabase-complete-setup.sql`
- [ ] Executou `fix-supabase-auth.sql`
- [ ] Executou `create-users-basic.sql`
- [ ] Usuários aparecem no banco
- [ ] Fez rebuild do projeto (se necessário)
- [ ] Modal NÃO fecha ao selecionar texto
- [ ] Login funciona
- [ ] Redireciona para Painel OSI

---

**Prioridade de Scripts:**
1. ⭐⭐⭐ `create-users-basic.sql` - MAIS SIMPLES E CONFIÁVEL
2. ⭐⭐ `fix-supabase-auth.sql` - Se tiver erro de schema
3. ⭐ `create-users-simple.sql` - Se o básico não funcionar

**Última Atualização:** Dezembro 2025
