# 🔍 Verificar se Supabase está Configurado Corretamente

## Problema: OSI não está salvando no banco de dados

### ✅ Passo 1: Verificar se as Tabelas Existem

1. Acesse o dashboard do Supabase:
   https://app.supabase.com/project/yzmxyqtfbthtrlnhrnpu

2. Vá em **Table Editor** (menu lateral)

3. Verifique se existem estas 3 tabelas:
   - ✅ `users`
   - ✅ `checklists`
   - ✅ `osi_orders`

**Se NÃO existirem**, você precisa criar:
- Vá em **SQL Editor**
- Clique em **New Query**
- Cole o conteúdo do arquivo `CRIAR_TABELAS.sql`
- Clique em **RUN**

### ✅ Passo 2: Verificar se o RLS está Desabilitado

1. Vá em **Table Editor** > `osi_orders`
2. Clique nos 3 pontinhos (...) ao lado do nome da tabela
3. Clique em **Edit table**
4. Verifique se **"Enable Row Level Security (RLS)"** está **DESABILITADO** ❌

**Se estiver habilitado**, desabilite executando no SQL Editor:
```sql
ALTER TABLE osi_orders DISABLE ROW LEVEL SECURITY;
```

### ✅ Passo 3: Verificar Credenciais

1. Verifique se o arquivo `.env` está correto:
```
VITE_SUPABASE_URL=https://yzmxyqtfbthtrlnhrnpu.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

2. **Reinicie o servidor** após qualquer mudança no `.env`:
```bash
# Pare o servidor (Ctrl+C)
npm run dev
```

### ✅ Passo 4: Testar o Salvamento

1. Abra o **Console do Navegador** (F12)
2. Vá na aba **Console**
3. Faça login no sistema
4. Crie uma nova ordem de serviço
5. Clique em **"💾 Salvar"**

**Procure por estas mensagens:**

✅ **Sucesso:**
```
🔵 Tentando salvar OSI no Supabase: {...}
✅ OSI salva com sucesso: {...}
✅ OSI salva, recarregando histórico...
```

❌ **Erro:**
```
❌ Error saving OSI: {...}
Detalhes: {...}
```

### 🔧 Erros Comuns

#### Erro: "relation osi_orders does not exist"
**Solução:** A tabela não foi criada. Execute o SQL do `CRIAR_TABELAS.sql`

#### Erro: "permission denied for table osi_orders"
**Solução:** RLS está ativo. Desabilite com:
```sql
ALTER TABLE osi_orders DISABLE ROW LEVEL SECURITY;
```

#### Erro: "Invalid API key"
**Solução:** A chave no `.env` está errada. Copie novamente do dashboard

#### Erro: "FetchError: Failed to fetch"
**Solução:** URL do Supabase está errada ou projeto está pausado

### 🎯 Teste Manual no Supabase

1. Vá em **SQL Editor**
2. Execute este comando para testar se consegue inserir:

```sql
INSERT INTO osi_orders (
  order_number, date, time, vehicle, equipment,
  km_inicial, km_final, tag, horimeter,
  maintenance_type, services_description,
  created_by
) VALUES (
  9999,
  CURRENT_DATE,
  '10:00',
  'Teste Manual',
  'Teste',
  '0', '0', 'TEST', '0',
  '{"preditiva": false, "preventiva": true, "corretiva": false, "avaria": false, "oportunidade": false, "outros": false}',
  'Teste de inserção manual',
  'admin'
);

SELECT * FROM osi_orders WHERE order_number = 9999;
```

Se funcionar, o problema está no código. Se não funcionar, é problema de permissão.

### 📊 Ver Dados Salvos

Para ver todas as ordens salvas:
```sql
SELECT * FROM osi_orders ORDER BY created_at DESC;
```

Para deletar a ordem de teste:
```sql
DELETE FROM osi_orders WHERE order_number = 9999;
```

### 🆘 Ainda não Funciona?

Adicione logs detalhados no console:

1. Abra o console do navegador (F12)
2. Tente salvar uma ordem
3. Copie TODOS os logs que aparecerem
4. Procure por erros em vermelho

Os logs mostrarão exatamente onde está o problema!
