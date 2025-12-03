# 🚀 Guia Rápido de Configuração do Sistema OSI

## ⚡ Passo a Passo para Começar

### 1️⃣ Criar Tabelas no Supabase

1. Acesse o Supabase Dashboard: https://yzmxyqtfbthtrlnhrnpu.supabase.co
2. Vá em **SQL Editor** (menu lateral)
3. Clique em **New Query**
4. Copie e cole o conteúdo do arquivo `supabase-setup.sql`
5. Clique em **Run** (ou pressione Ctrl+Enter)
6. Aguarde a mensagem de sucesso

### 2️⃣ Criar Bucket de Storage

1. No Supabase Dashboard, vá em **Storage** (menu lateral)
2. Clique em **Create bucket**
3. Preencha:
   - **Name**: `osi-files`
   - **Public bucket**: ✅ Marcar como público
4. Clique em **Create bucket**

### 3️⃣ Executar o Sistema

```bash
# Instalar dependências (se ainda não instalou)
npm install

# Executar em modo desenvolvimento
npm run dev
```

O sistema estará disponível em: http://localhost:5173

### 4️⃣ Primeiro Acesso

1. Abra o sistema no navegador
2. Clique no botão **🔐 Painel OSI** no canto superior direito
3. Faça login com as credenciais padrão:
   - **Usuário:** `admin`
   - **Senha:** `admin123`

## 🎯 Usar o Sistema

### Criar uma Ordem de Serviço

1. No Painel OSI, clique em **📝 Gerar Ordem de Serviço**
2. Preencha todos os campos obrigatórios (marcados com *)
3. Selecione os tipos de manutenção aplicáveis
4. Clique em **✅ Gerar OS com PDF e Excel**
5. Aguarde a geração dos arquivos (pode levar alguns segundos)
6. Pronto! A OS foi criada e os arquivos foram salvos

### Ver Histórico de Ordens

1. No Painel OSI, clique em **📊 Histórico de Ordens**
2. Use os filtros para buscar ordens específicas
3. Clique em **📄 PDF** ou **📊 Excel** para abrir os arquivos
4. Use **🗑️** para excluir uma ordem (confirmação necessária)

## ⚙️ Configurações Importantes

### Alterar Senha do Administrador

Para alterar a senha padrão, você precisa gerar um novo hash bcrypt:

```javascript
// Exemplo em Node.js
const bcrypt = require('bcryptjs');
const novaSenha = 'sua_nova_senha_aqui';
const hash = bcrypt.hashSync(novaSenha, 10);
console.log(hash);
```

Depois, atualize no Supabase:

```sql
UPDATE usuarios 
SET senha = 'HASH_GERADO_AQUI' 
WHERE usuario = 'admin';
```

### Adicionar Novos Usuários

Execute no SQL Editor do Supabase:

```sql
INSERT INTO usuarios (usuario, senha, nome, cargo)
VALUES (
    'nome_usuario',
    'HASH_BCRYPT_DA_SENHA',
    'Nome Completo',
    'Cargo'
);
```

## 🔧 Solução de Problemas

### Erro ao criar ordem de serviço

**Sintoma:** Mensagem de erro ao tentar criar uma OS

**Soluções:**
1. Verifique se as tabelas foram criadas corretamente
2. Confirme que o bucket `osi-files` está público
3. Verifique a conexão com o Supabase
4. Veja o console do navegador (F12) para mais detalhes

### PDF ou Excel não abre

**Sintoma:** Botão desabilitado ou arquivo não carrega

**Soluções:**
1. Verifique se o bucket `osi-files` é público
2. Confirme que os arquivos foram gerados (veja o campo `pdf_url` e `excel_url` no banco)
3. Tente gerar a OS novamente

### Erro de autenticação

**Sintoma:** Não consegue fazer login

**Soluções:**
1. Verifique se a tabela `usuarios` foi criada
2. Confirme que o usuário de teste foi inserido
3. Verifique as credenciais (usuário: admin, senha: admin123)
4. Limpe o localStorage do navegador e tente novamente

### Erro "Cannot read properties of null"

**Sintoma:** Erro ao navegar entre páginas

**Soluções:**
1. Faça logout e login novamente
2. Limpe o cache do navegador
3. Verifique se a sessão não expirou

## 📊 Estrutura do Banco de Dados

### Tabela: usuarios
```
id          UUID    (Primary Key)
usuario     TEXT    (Unique)
senha       TEXT    (bcrypt hash)
nome        TEXT
cargo       TEXT
criado_em   TIMESTAMP
```

### Tabela: osi_ordens
```
id                    UUID    (Primary Key)
numero_os             SERIAL  (Auto increment)
data                  DATE
hora                  TEXT
veiculo               TEXT
equipamento           TEXT
km_inicial            TEXT
km_final              TEXT
tag                   TEXT
horimetro             TEXT
manut_preditiva       BOOLEAN
manut_preventiva      BOOLEAN
manut_corretiva       BOOLEAN
manut_avaria          BOOLEAN
manut_oportunidade    BOOLEAN
manut_outros          BOOLEAN
descricao_servicos    TEXT
pecas_aplicadas       TEXT
observacoes           TEXT
mecanico              TEXT
responsavel           TEXT
pdf_url               TEXT
excel_url             TEXT
criado_em             TIMESTAMP
```

## 🔒 Segurança

### Recomendações para Produção

1. **Altere a senha padrão** imediatamente
2. **Configure políticas RLS** adequadas no Supabase
3. **Use variáveis de ambiente** para chaves sensíveis
4. **Ative HTTPS** em produção
5. **Configure backups** automáticos do banco
6. **Limite tentativas de login** (implementar rate limiting)
7. **Adicione logs de auditoria** para ações críticas

### Variáveis de Ambiente (Recomendado)

Crie um arquivo `.env`:

```env
VITE_SUPABASE_URL=https://yzmxyqtfbthtrlnhrnpu.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_aqui
```

E atualize `src/services/supabase.ts`:

```typescript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
```

## 📞 Suporte e Ajuda

### Verificar Logs

**No navegador:**
1. Abra o DevTools (F12)
2. Vá na aba **Console**
3. Procure por mensagens de erro em vermelho

**No Supabase:**
1. Acesse o Dashboard
2. Vá em **Logs** (menu lateral)
3. Filtre por erros recentes

### Checklist de Verificação

- [ ] Tabelas criadas no Supabase
- [ ] Bucket `osi-files` criado e público
- [ ] Usuário de teste inserido
- [ ] Dependências instaladas (`npm install`)
- [ ] Servidor rodando (`npm run dev`)
- [ ] Navegador atualizado
- [ ] Console sem erros

## 🎉 Pronto!

Seu sistema OSI está configurado e pronto para uso!

Para mais informações, consulte o arquivo `README_OSI.md`.

---

**Desenvolvido para Terraplanagem Guimarães - 2025**
