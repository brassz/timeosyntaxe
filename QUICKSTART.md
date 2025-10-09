# 🚀 Guia Rápido - TimeoSyntaxe

## Começar em 5 minutos

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

As credenciais do Supabase já estão configuradas. Apenas copie o arquivo:

```bash
# Windows (PowerShell)
copy .env.example .env.local

# Linux/Mac
cp .env.example .env.local
```

### 3. Configurar banco de dados no Supabase

1. Acesse [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Seu projeto: `eppzphzwwpvpoocospxy`
3. Vá em **SQL Editor**
4. Cole e execute o conteúdo de `supabase-schema.sql`

### 4. Criar usuário de teste

No Supabase Dashboard:
1. **Authentication** → **Users** → **Add User**
2. Email: `teste@exemplo.com`
3. Password: `123456`
4. **Create User**

### 5. Executar o projeto

```bash
npm run dev
```

### 6. Acessar

Abra [http://localhost:3000](http://localhost:3000)

**Login:**
- Email: `teste@exemplo.com`
- Senha: `123456`

## 🎉 Pronto!

Agora você pode:
- ✅ Ver a landing page com os planos
- ✅ Fazer login
- ✅ Acessar o dashboard
- ✅ Criar agendamentos
- ✅ Editar e deletar agendamentos
- ✅ Visualizar calendário

## 📱 Testar Responsividade

1. Abra o DevTools (F12)
2. Ative o modo responsivo (Ctrl+Shift+M)
3. Teste em diferentes tamanhos

## 🚀 Deploy no Vercel

```bash
npm i -g vercel
vercel
```

Ou conecte seu repositório GitHub no [vercel.com](https://vercel.com)

## ⚡ Dicas

- Use **Ctrl+K** no Supabase para busca rápida
- Limpe o localStorage se tiver problemas de autenticação
- Veja os logs do console para debug
- Use React DevTools para inspecionar componentes

## 🆘 Problemas comuns

**Erro de conexão com Supabase:**
```bash
# Verifique se .env.local existe
# Reinicie o servidor: Ctrl+C e npm run dev
```

**Erro no login:**
```bash
# Verifique se criou o usuário no Supabase Auth
# Limpe o localStorage: F12 → Application → Clear storage
```

**Build error:**
```bash
rm -rf .next node_modules
npm install
npm run build
```

## 📖 Documentação completa

Veja `README.md` para informações detalhadas.
