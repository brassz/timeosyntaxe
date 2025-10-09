# 👥 Tabela Usuarios

## Descrição
A tabela `usuarios` complementa a tabela `auth.users` do Supabase, armazenando informações adicionais do perfil dos usuários do sistema TimeoSyntaxe.

## Estrutura da Tabela

```sql
CREATE TABLE usuarios (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  telefone TEXT,
  endereco TEXT,
  cidade TEXT,
  estado TEXT,
  cep TEXT,
  data_nascimento DATE,
  profissao TEXT,
  observacoes TEXT,
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Campos

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | ✅ | Chave primária, referencia auth.users(id) |
| `nome` | TEXT | ✅ | Nome completo do usuário |
| `email` | TEXT | ✅ | Email único do usuário |
| `telefone` | TEXT | ❌ | Telefone de contato |
| `endereco` | TEXT | ❌ | Endereço completo |
| `cidade` | TEXT | ❌ | Cidade |
| `estado` | TEXT | ❌ | Estado/UF |
| `cep` | TEXT | ❌ | CEP |
| `data_nascimento` | DATE | ❌ | Data de nascimento |
| `profissao` | TEXT | ❌ | Profissão |
| `observacoes` | TEXT | ❌ | Observações gerais |
| `ativo` | BOOLEAN | ✅ | Status ativo/inativo (padrão: true) |
| `created_at` | TIMESTAMPTZ | ✅ | Data de criação |
| `updated_at` | TIMESTAMPTZ | ✅ | Data da última atualização |

## Funcionalidades Automáticas

### 1. Criação Automática de Perfil
Quando um usuário se registra via `auth.users`, um perfil é automaticamente criado na tabela `usuarios`:

```sql
-- Trigger que executa automaticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 2. Atualização Automática de `updated_at`
O campo `updated_at` é atualizado automaticamente a cada modificação:

```sql
CREATE TRIGGER update_usuarios_updated_at
  BEFORE UPDATE ON usuarios
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## Segurança (RLS)

A tabela possui Row Level Security habilitado com as seguintes políticas:

- **SELECT**: Usuários podem ver apenas seu próprio perfil
- **UPDATE**: Usuários podem atualizar apenas seu próprio perfil  
- **INSERT**: Usuários podem inserir apenas seu próprio perfil

```sql
-- Políticas de segurança
CREATE POLICY "Users can view their own profile"
  ON usuarios FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON usuarios FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON usuarios FOR INSERT
  WITH CHECK (auth.uid() = id);
```

## Índices para Performance

```sql
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_nome ON usuarios(nome);
CREATE INDEX idx_usuarios_ativo ON usuarios(ativo);
```

## Exemplos de Uso

### TypeScript Interface
```typescript
export interface Usuario {
  id: string
  nome: string
  email: string
  telefone?: string
  endereco?: string
  cidade?: string
  estado?: string
  cep?: string
  data_nascimento?: string
  profissao?: string
  observacoes?: string
  ativo: boolean
  created_at: string
  updated_at: string
}
```

### Buscar Perfil do Usuário Logado
```typescript
const { data: usuario, error } = await supabase
  .from('usuarios')
  .select('*')
  .eq('id', user.id)
  .single()
```

### Atualizar Perfil
```typescript
const { data, error } = await supabase
  .from('usuarios')
  .update({
    nome: 'João Silva',
    telefone: '(11) 99999-9999',
    cidade: 'São Paulo',
    estado: 'SP'
  })
  .eq('id', user.id)
```

### Buscar Usuários Ativos
```typescript
const { data: usuarios, error } = await supabase
  .from('usuarios')
  .select('*')
  .eq('ativo', true)
  .order('nome')
```

## Queries SQL Úteis

### 1. Buscar usuário por email
```sql
SELECT * FROM usuarios WHERE email = 'usuario@exemplo.com';
```

### 2. Buscar usuários ativos
```sql
SELECT * FROM usuarios WHERE ativo = true ORDER BY nome;
```

### 3. Buscar usuários por cidade
```sql
SELECT * FROM usuarios WHERE cidade ILIKE '%São Paulo%' ORDER BY nome;
```

### 4. Contar usuários por estado
```sql
SELECT estado, COUNT(*) as total 
FROM usuarios 
WHERE estado IS NOT NULL 
GROUP BY estado 
ORDER BY total DESC;
```

### 5. Usuários cadastrados nos últimos 30 dias
```sql
SELECT * FROM usuarios 
WHERE created_at >= NOW() - INTERVAL '30 days' 
ORDER BY created_at DESC;
```

### 6. Usuários com agendamentos
```sql
SELECT DISTINCT u.* FROM usuarios u 
INNER JOIN appointments a ON u.id = a.user_id 
WHERE a.status = 'scheduled' 
ORDER BY u.nome;
```

## Relacionamentos

### Com `auth.users`
- **Tipo**: One-to-One
- **Chave**: `usuarios.id` → `auth.users.id`
- **Cascade**: ON DELETE CASCADE

### Com `appointments`
- **Tipo**: One-to-Many
- **Chave**: `appointments.user_id` → `usuarios.id`

### Com `subscriptions`
- **Tipo**: One-to-Many  
- **Chave**: `subscriptions.user_id` → `usuarios.id`

## Validações Recomendadas

### No Frontend (React)
```typescript
import * as z from 'zod'

const usuarioSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  telefone: z.string().optional(),
  endereco: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().max(2, 'Estado deve ter 2 caracteres').optional(),
  cep: z.string().regex(/^\d{5}-?\d{3}$/, 'CEP inválido').optional(),
  data_nascimento: z.string().optional(),
  profissao: z.string().optional(),
  observacoes: z.string().optional(),
})
```

## Migração de Dados Existentes

Se você já tem usuários em `auth.users`, pode criar os perfis manualmente:

```sql
INSERT INTO usuarios (id, nome, email)
SELECT 
  id,
  COALESCE(raw_user_meta_data->>'name', split_part(email, '@', 1)) as nome,
  email
FROM auth.users
WHERE id NOT IN (SELECT id FROM usuarios);
```

## Backup e Manutenção

### Backup da tabela
```sql
-- Exportar dados
COPY usuarios TO '/tmp/usuarios_backup.csv' DELIMITER ',' CSV HEADER;
```

### Limpeza de usuários inativos antigos
```sql
-- Usuários inativos há mais de 1 ano
SELECT * FROM usuarios 
WHERE ativo = false 
AND updated_at < NOW() - INTERVAL '1 year';
```

## Considerações de Performance

1. **Índices**: Já criados para `email`, `nome` e `ativo`
2. **Paginação**: Use LIMIT/OFFSET para listas grandes
3. **Cache**: Considere cache para perfis frequentemente acessados
4. **Soft Delete**: Use o campo `ativo` em vez de DELETE

## Próximos Passos

1. ✅ Criar interface de edição de perfil
2. ✅ Implementar validação de CPF/CNPJ
3. ✅ Adicionar campo para foto de perfil
4. ✅ Implementar notificações por email/SMS
5. ✅ Criar relatórios de usuários

---

**Criado em**: 2025-01-09  
**Versão**: 1.0  
**Autor**: Sistema TimeoSyntaxe