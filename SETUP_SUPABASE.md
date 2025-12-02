# Configuração do Supabase

Este documento explica como configurar o banco de dados Supabase para o sistema.

## Passo 1: Criar as Tabelas

### Método Recomendado - Script Completo

1. Acesse o [Supabase Dashboard](https://app.supabase.com)
2. Selecione seu projeto
3. Vá para **"SQL Editor"**
4. Clique em **"New Query"**
5. Copie e cole o conteúdo do arquivo **`supabase-complete-setup.sql`**
6. Clique em **"Run"** ou pressione `Ctrl+Enter`
7. Aguarde a mensagem de sucesso ✅

O script completo irá criar automaticamente:
- ✅ Tabela `checklists` (retenção de 7 dias)
- ✅ Tabela `service_orders` (armazenamento permanente)
- ✅ Políticas de segurança (RLS)
- ✅ Função de limpeza automática (apenas checklists)
- ✅ Índices para otimização
- ✅ Triggers de auto-numeração
- ✅ Funções de estatísticas
- ✅ Verificação automática da instalação

### Arquivos Disponíveis

- **`supabase-complete-setup.sql`** ⭐ RECOMENDADO - Script completo com comentários e verificações
- **`supabase-setup.sql`** - Script básico (versão simplificada)

## Passo 2: Configurar Limpeza Automática de Checklists (Opcional)

**IMPORTANTE:** A limpeza automática se aplica APENAS aos checklists, NÃO às ordens de serviço (OSI).
As ordens de serviço são mantidas permanentemente no banco de dados.

Para que os checklists sejam automaticamente deletados após 7 dias, você pode configurar um cron job no Supabase:

1. Vá para "Database" → "Extensions"
2. Habilite a extensão `pg_cron`
3. No SQL Editor, execute:

```sql
-- Executar a limpeza de CHECKLISTS todos os dias à meia-noite
-- As ordens de serviço (OSI) NÃO são afetadas
SELECT cron.schedule(
    'cleanup-old-checklists',
    '0 0 * * *',
    'SELECT cleanup_old_checklists();'
);
```

**Nota:** As ordens de serviço (service_orders) são documentos oficiais e permanecem no banco indefinidamente.

## Passo 3: Configurar Autenticação

1. Vá para "Authentication" → "Providers"
2. Habilite "Email" como provider
3. Configure as opções de acordo com suas necessidades
4. Crie usuários em "Authentication" → "Users"

### Criar Primeiro Usuário Administrativo

**Opção 1 - Script Pronto (Recomendado):**

Execute o script `create-user-gustavo.sql` no SQL Editor:

```sql
-- Ver arquivo: create-user-gustavo.sql
-- Email: gustavo@terraplanagemguimaraes.com
-- Senha: terraplanagem2025
```

**Opção 2 - Criar Manualmente:**

No SQL Editor, execute:

```sql
-- Criar usuário admin customizado
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
    crypt('senha_segura_aqui', gen_salt('bf')),  -- ← TROCAR SENHA
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"name":"Seu Nome"}'::jsonb,  -- ← TROCAR NOME
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'seu@email.com'
);
```

**IMPORTANTE:** Use senhas fortes e troque após primeiro acesso!

Para mais informações sobre gerenciamento de usuários, consulte `USUARIOS.md`.

## Passo 4: Verificar Configuração

As credenciais do Supabase já estão configuradas em `src/services/supabase.ts`:

```typescript
const supabaseUrl = 'https://yzmxyqtfbthtrlnhrnpu.supabase.co';
const supabaseAnonKey = 'eyJ...';
```

## Funcionalidades Implementadas

### Sistema de Checklists
- ✅ Salvamento automático em Supabase
- ✅ **Retenção de 7 dias** - Checklists antigos são deletados automaticamente
- ✅ Fallback para localStorage se Supabase estiver indisponível
- ✅ Sincronização automática

### Sistema OSI (Ordem de Serviço Interno)
- ✅ Autenticação de usuários
- ✅ Geração de ordens de serviço
- ✅ Exportação para PDF
- ✅ Exportação para Excel
- ✅ Numeração automática de ordens
- ✅ **Armazenamento permanente** - Ordens de serviço nunca são deletadas

## Troubleshooting

### Erro ao salvar dados
- Verifique se as políticas RLS estão ativas
- Confirme se o anon key está correto
- Verifique o console do navegador para erros específicos

### Limpeza automática não funciona
- Verifique se a extensão pg_cron está habilitada
- Confirme que o cron job foi criado corretamente
- Execute manualmente: `SELECT cleanup_old_checklists();`

### Problemas de autenticação
- Verifique se o usuário foi criado corretamente
- Confirme que o email provider está habilitado
- Teste o login com credenciais corretas

## Suporte

Para mais informações sobre o Supabase:
- [Documentação Oficial](https://supabase.com/docs)
- [Guia de RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [pg_cron Extension](https://supabase.com/docs/guides/database/extensions/pg_cron)
