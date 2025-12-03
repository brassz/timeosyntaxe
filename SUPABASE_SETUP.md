# Configuração do Supabase

## 1. Criar Conta no Supabase

1. Acesse https://supabase.com
2. Crie uma conta gratuita
3. Crie um novo projeto

## 2. Configurar Variáveis de Ambiente

1. Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
```

2. No dashboard do Supabase, vá em Settings > API
3. Copie a `URL` e a `anon/public key`
4. Cole no arquivo `.env`:
```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-aqui
```

## 3. Criar Tabelas no Banco de Dados

### 3.1. Tabela de Usuários (users)

Execute no SQL Editor do Supabase:

```sql
-- Criar tabela de usuários
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Inserir usuário de teste (senha: admin123)
INSERT INTO users (username, password, name) 
VALUES ('admin', 'admin123', 'Administrador');

-- Adicionar mais usuários conforme necessário
INSERT INTO users (username, password, name) 
VALUES 
  ('mecanico', 'mecanico123', 'João Silva'),
  ('supervisor', 'supervisor123', 'Maria Santos');
```

### 3.2. Tabela de Checklists

```sql
-- Criar tabela de checklists
CREATE TABLE checklists (
  id VARCHAR(255) PRIMARY KEY,
  operator VARCHAR(100) NOT NULL,
  machine VARCHAR(100) NOT NULL,
  location VARCHAR(200) NOT NULL,
  date TIMESTAMP NOT NULL,
  horimeter VARCHAR(50),
  mileage VARCHAR(50),
  tag VARCHAR(50),
  items JSONB NOT NULL,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Criar índice para melhor performance
CREATE INDEX idx_checklists_created_at ON checklists(created_at DESC);
CREATE INDEX idx_checklists_operator ON checklists(operator);
```

### 3.3. Tabela de Ordens de Serviço Interna (OSI)

```sql
-- Criar tabela de OSI
CREATE TABLE osi_orders (
  id SERIAL PRIMARY KEY,
  order_number INTEGER UNIQUE NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  vehicle VARCHAR(100) NOT NULL,
  equipment VARCHAR(100),
  km_inicial VARCHAR(50),
  km_final VARCHAR(50),
  tag VARCHAR(50),
  horimeter VARCHAR(50),
  maintenance_type JSONB NOT NULL,
  services_description TEXT NOT NULL,
  parts_applied TEXT,
  observations TEXT,
  mechanic VARCHAR(100),
  responsible VARCHAR(100),
  created_by VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Criar índices
CREATE INDEX idx_osi_orders_created_at ON osi_orders(created_at DESC);
CREATE INDEX idx_osi_orders_order_number ON osi_orders(order_number DESC);
CREATE INDEX idx_osi_orders_created_by ON osi_orders(created_by);

-- Inserir ordem de exemplo (opcional)
INSERT INTO osi_orders (
  order_number, date, time, vehicle, equipment,
  km_inicial, km_final, tag, horimeter,
  maintenance_type, services_description, parts_applied,
  observations, mechanic, responsible, created_by
) VALUES (
  2200, CURRENT_DATE, '08:00', 'Caminhão Mercedes', 'Caçamba',
  '12345', '12450', 'TG-001', '1234.5',
  '{"preditiva": false, "preventiva": true, "corretiva": false, "avaria": false, "oportunidade": false, "outros": false}',
  'Manutenção preventiva do sistema hidráulico',
  'Filtro de óleo hidráulico, Óleo hidráulico 20L',
  'Equipamento em bom estado',
  'João Silva', 'Carlos Santos', 'admin'
);
```

## 4. Configurar Políticas de Segurança (RLS)

Por padrão, o Supabase ativa Row Level Security (RLS). Para simplificar o desenvolvimento, você pode desativar temporariamente:

```sql
-- Desativar RLS (apenas para desenvolvimento)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE checklists DISABLE ROW LEVEL SECURITY;
ALTER TABLE osi_orders DISABLE ROW LEVEL SECURITY;
```

**IMPORTANTE:** Para produção, configure políticas de segurança apropriadas!

### Exemplo de Políticas de Segurança para Produção:

```sql
-- Ativar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE osi_orders ENABLE ROW LEVEL SECURITY;

-- Política para users (apenas leitura)
CREATE POLICY "Permitir leitura de usuários" ON users
  FOR SELECT USING (true);

-- Políticas para checklists (todos podem criar, ler e deletar)
CREATE POLICY "Permitir criação de checklists" ON checklists
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir leitura de checklists" ON checklists
  FOR SELECT USING (true);

CREATE POLICY "Permitir deleção de checklists" ON checklists
  FOR DELETE USING (true);

-- Políticas para OSI (todos podem criar e ler)
CREATE POLICY "Permitir criação de OSI" ON osi_orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir leitura de OSI" ON osi_orders
  FOR SELECT USING (true);
```

## 5. Função Automática para Limpar Checklists Antigos (Opcional)

Crie uma função PostgreSQL que será executada automaticamente:

```sql
-- Criar função para limpar checklists antigos
CREATE OR REPLACE FUNCTION clean_old_checklists()
RETURNS void AS $$
BEGIN
  DELETE FROM checklists 
  WHERE created_at < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;

-- Criar extensão pg_cron (se não existir)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Agendar execução diária às 2h da manhã
SELECT cron.schedule(
  'clean-old-checklists',
  '0 2 * * *',
  'SELECT clean_old_checklists();'
);
```

**Nota:** A extensão `pg_cron` pode não estar disponível no plano gratuito do Supabase. Neste caso, a limpeza será feita manualmente através da aplicação.

## 6. Testar a Conexão

1. Reinicie o servidor de desenvolvimento:
```bash
npm run dev
```

2. Acesse a aplicação e clique em "OSI - Login"
3. Use as credenciais de teste:
   - Usuário: `admin`
   - Senha: `admin123`

## 7. Segurança em Produção

**IMPORTANTE:** As senhas estão sendo armazenadas em texto simples neste exemplo. Para produção, você deve:

1. Usar hash de senha (bcrypt, argon2, etc.)
2. Implementar autenticação JWT
3. Configurar políticas RLS apropriadas
4. Usar HTTPS
5. Implementar rate limiting
6. Adicionar validação de entrada

## Troubleshooting

### Erro de Conexão
- Verifique se as credenciais no `.env` estão corretas
- Confirme que o projeto Supabase está ativo
- Verifique se há firewall bloqueando a conexão

### Erro ao Criar Tabelas
- Certifique-se de estar usando o SQL Editor no Supabase
- Verifique se há erros de sintaxe
- Execute cada comando separadamente se necessário

### Dados Não Aparecem
- Verifique se o RLS está desativado durante desenvolvimento
- Confirme que os dados foram inseridos corretamente
- Abra o console do navegador para ver erros

## Suporte

Para mais informações sobre Supabase:
- Documentação: https://supabase.com/docs
- Dashboard: https://app.supabase.com
