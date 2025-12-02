# Configuração do Supabase

Este documento explica como configurar o banco de dados Supabase para o sistema.

## Passo 1: Criar as Tabelas

1. Acesse o [Supabase Dashboard](https://app.supabase.com)
2. Selecione seu projeto
3. Vá para "SQL Editor"
4. Execute o script `supabase-setup.sql` que está na raiz do projeto

O script irá criar:
- Tabela `checklists` para armazenar os checklists
- Tabela `service_orders` para armazenar as ordens de serviço
- Políticas de segurança (RLS)
- Função de limpeza automática de checklists antigos
- Índices para otimizar as consultas

## Passo 2: Configurar Limpeza Automática (Opcional)

Para que os checklists sejam automaticamente deletados após 7 dias, você pode configurar um cron job no Supabase:

1. Vá para "Database" → "Extensions"
2. Habilite a extensão `pg_cron`
3. No SQL Editor, execute:

```sql
-- Executar a limpeza todos os dias à meia-noite
SELECT cron.schedule(
    'cleanup-old-checklists',
    '0 0 * * *',
    'SELECT cleanup_old_checklists();'
);
```

## Passo 3: Configurar Autenticação

1. Vá para "Authentication" → "Providers"
2. Habilite "Email" como provider
3. Configure as opções de acordo com suas necessidades
4. Crie usuários em "Authentication" → "Users"

### Criar Primeiro Usuário Administrativo

No SQL Editor, execute:

```sql
-- Criar usuário admin
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at
)
VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@terraplanagem.com',
    crypt('senha_segura_aqui', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW()
);
```

**IMPORTANTE:** Troque `senha_segura_aqui` por uma senha forte!

## Passo 4: Verificar Configuração

As credenciais do Supabase já estão configuradas em `src/services/supabase.ts`:

```typescript
const supabaseUrl = 'https://yzmxyqtfbthtrlnhrnpu.supabase.co';
const supabaseAnonKey = 'eyJ...';
```

## Funcionalidades Implementadas

### Sistema de Checklists
- ✅ Salvamento automático em Supabase
- ✅ Retenção de 7 dias (configurável)
- ✅ Fallback para localStorage se Supabase estiver indisponível
- ✅ Sincronização automática

### Sistema OSI (Ordem de Serviço Interno)
- ✅ Autenticação de usuários
- ✅ Geração de ordens de serviço
- ✅ Exportação para PDF
- ✅ Exportação para Excel
- ✅ Numeração automática de ordens
- ✅ Armazenamento em banco de dados

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
