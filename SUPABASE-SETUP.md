# 🗄️ Configuração do Supabase

## Guia completo para configurar o banco de dados

### 📋 Pré-requisitos

- Conta no Supabase (gratuita)
- Acesso ao projeto: `eppzphzwwpvpoocospxy`

### 🚀 Passo a Passo

#### 1. Acessar o Dashboard

1. Acesse [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Faça login com sua conta
3. Você verá seu projeto `eppzphzwwpvpoocospxy`

#### 2. Executar Schema SQL

1. No menu lateral, clique em **SQL Editor**
2. Clique em **New Query** (ou pressione `Ctrl+Enter`)
3. Copie todo o conteúdo do arquivo `supabase-schema.sql`
4. Cole no editor SQL
5. Clique em **Run** (ou pressione `Ctrl+Enter`)

✅ **Sucesso!** Você verá mensagens confirmando a criação das tabelas.

#### 3. Verificar Tabelas Criadas

1. No menu lateral, clique em **Table Editor**
2. Você deve ver:
   - ✅ `appointments` (agendamentos)
   - ✅ `subscriptions` (planos)

#### 4. Criar Usuário de Teste

**Opção A: Via Dashboard**

1. Menu lateral → **Authentication** → **Users**
2. Clique em **Add User** (canto superior direito)
3. Selecione **Create new user**
4. Preencha:
   ```
   Email: teste@exemplo.com
   Password: 123456
   ```
5. Clique em **Create User**

**Opção B: Via SQL**

```sql
-- Execute no SQL Editor
INSERT INTO auth.users (
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at
)
VALUES (
  'teste@exemplo.com',
  crypt('123456', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW()
);
```

#### 5. Configurar RLS (Row Level Security)

✅ **Já configurado automaticamente** pelo script SQL!

Para verificar:
1. **Table Editor** → Selecione tabela `appointments`
2. Clique em **⚙️** (engrenagem) → **Policies**
3. Você deve ver 4 políticas:
   - ✅ Users can view their own appointments
   - ✅ Users can create their own appointments
   - ✅ Users can update their own appointments
   - ✅ Users can delete their own appointments

### 📊 Estrutura do Banco

#### Tabela: appointments

```sql
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  client_name TEXT NOT NULL,
  service TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  duration INTEGER NOT NULL,
  status TEXT CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Exemplo de registro:**

| Campo | Exemplo | Descrição |
|-------|---------|-----------|
| id | `550e8400-e29b-41d4-a716-446655440000` | UUID único |
| user_id | `123e4567-e89b-12d3-a456-426614174000` | ID do usuário |
| title | "Consulta Dr. Silva" | Título do agendamento |
| client_name | "João da Silva" | Nome do cliente |
| service | "Consulta" | Tipo de serviço |
| start_time | `2025-01-15 14:00:00+00` | Data/hora início |
| end_time | `2025-01-15 14:30:00+00` | Data/hora fim |
| duration | `30` | Duração em minutos |
| status | `scheduled` | Status atual |

#### Tabela: subscriptions

```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  plan TEXT CHECK (plan IN ('monthly', 'quarterly', 'annual')),
  status TEXT CHECK (status IN ('active', 'cancelled', 'expired')),
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 🔐 Segurança (RLS)

O Row Level Security garante que:
- ✅ Usuários só veem seus próprios dados
- ✅ Não podem acessar dados de outros usuários
- ✅ Todas as operações são validadas no banco

### 🧪 Testar Conexão

#### 1. Verificar Credenciais

No Supabase Dashboard:
1. **Settings** → **API**
2. Copie:
   - **Project URL**: `https://eppzphzwwpvpoocospxy.supabase.co`
   - **anon public key**: (sua chave)

#### 2. Testar no Console do Navegador

```javascript
// Cole no console do navegador (F12)
const { createClient } = supabase

const client = createClient(
  'https://eppzphzwwpvpoocospxy.supabase.co',
  'sua-anon-key'
)

// Testar query
const { data, error } = await client
  .from('appointments')
  .select('*')

console.log(data, error)
```

### 📝 Queries Úteis

#### Ver todos agendamentos de um usuário

```sql
SELECT * FROM appointments
WHERE user_id = 'seu-user-id'
ORDER BY start_time DESC;
```

#### Agendamentos do dia

```sql
SELECT * FROM appointments
WHERE DATE(start_time) = CURRENT_DATE
ORDER BY start_time;
```

#### Estatísticas

```sql
SELECT
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE status = 'scheduled') as scheduled,
  COUNT(*) FILTER (WHERE status = 'completed') as completed,
  COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled
FROM appointments
WHERE user_id = 'seu-user-id';
```

#### Próximos 5 agendamentos

```sql
SELECT * FROM appointments
WHERE start_time >= NOW()
ORDER BY start_time
LIMIT 5;
```

### 🔧 Manutenção

#### Backup Manual

1. **Database** → **Backups**
2. Clique em **Create backup**
3. Nomeie o backup (ex: "backup-20250109")

#### Restaurar Backup

1. **Database** → **Backups**
2. Encontre o backup
3. Clique em **Restore**

#### Ver Logs

1. **Logs** → **Postgres Logs**
2. Filtre por tipo de log
3. Use para debug de queries

### 🚨 Troubleshooting

#### Erro: "relation does not exist"

**Solução:** Execute o script SQL novamente

```bash
# No SQL Editor, execute:
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;

# Depois execute novamente o conteúdo de supabase-schema.sql
```

#### Erro: "permission denied"

**Solução:** Verifique as políticas RLS

```sql
-- Listar políticas
SELECT * FROM pg_policies
WHERE tablename = 'appointments';

-- Recriar políticas se necessário
-- (copie do supabase-schema.sql)
```

#### Erro: "JWT expired"

**Solução:** Faça login novamente na aplicação

#### Performance lenta

**Solução:** Adicione índices

```sql
-- Índice para busca por data
CREATE INDEX idx_appointments_date
ON appointments (DATE(start_time));

-- Índice para busca por cliente
CREATE INDEX idx_appointments_client
ON appointments (client_name);
```

### 📊 Monitoring

#### Ver uso do banco

1. **Settings** → **Usage**
2. Monitore:
   - Database size
   - API requests
   - Storage
   - Bandwidth

#### Limites do plano gratuito

- ✅ 500 MB database
- ✅ 1 GB file storage
- ✅ 2 GB bandwidth
- ✅ 50 MB file uploads
- ✅ Unlimited API requests

### 🔄 Migrações Futuras

Para adicionar novas colunas:

```sql
-- Exemplo: adicionar campo 'notes' em appointments
ALTER TABLE appointments
ADD COLUMN notes TEXT;

-- Atualizar RLS se necessário
-- (as políticas existentes continuam válidas)
```

### 🎯 Próximos Passos

1. ✅ Configure notificações (Database Webhooks)
2. ✅ Adicione realtime subscriptions
3. ✅ Configure backups automáticos
4. ✅ Monitore performance

### 📞 Suporte Supabase

- [Documentação oficial](https://supabase.com/docs)
- [Discord community](https://discord.supabase.com)
- [GitHub discussions](https://github.com/supabase/supabase/discussions)

### ✅ Checklist de Configuração

- [ ] Schema SQL executado
- [ ] Tabelas criadas (appointments, subscriptions)
- [ ] Usuário de teste criado
- [ ] RLS ativado e políticas funcionando
- [ ] Credenciais copiadas para .env.local
- [ ] Conexão testada no app
- [ ] Primeiro agendamento criado com sucesso

🎉 **Configuração completa!**
