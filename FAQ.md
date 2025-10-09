# ❓ Perguntas Frequentes (FAQ)

## 🚀 Instalação e Configuração

### Como instalo o projeto?

```bash
# Clone o repositório
git clone <seu-repo>
cd timeosyntaxe

# Instale dependências
npm install

# Configure variáveis de ambiente
cp .env.example .env.local

# Execute
npm run dev
```

Ver **QUICKSTART.md** para guia completo.

---

### Onde consigo as credenciais do Supabase?

As credenciais já estão configuradas no `.env.example`:
- URL: `https://eppzphzwwpvpoocospxy.supabase.co`
- Anon Key: Já incluída no arquivo

Basta copiar `.env.example` para `.env.local`.

---

### Como crio o banco de dados?

1. Acesse [Supabase Dashboard](https://supabase.com/dashboard)
2. Vá em **SQL Editor**
3. Copie e cole o conteúdo de `supabase-schema.sql`
4. Clique em **Run**

Ver **SUPABASE-SETUP.md** para detalhes.

---

### Como crio um usuário de teste?

**No Supabase Dashboard:**
1. **Authentication** → **Users** → **Add User**
2. Email: `teste@exemplo.com`
3. Password: `123456`

---

## 🐛 Problemas Comuns

### Erro: "Cannot connect to Supabase"

**Causas:**
- Credenciais incorretas
- Sem conexão com internet
- Projeto Supabase inativo

**Soluções:**
1. Verifique `.env.local`:
   ```bash
   # Deve conter:
   NEXT_PUBLIC_SUPABASE_URL=https://eppzphzwwpvpoocospxy.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-key
   ```

2. Reinicie o servidor:
   ```bash
   # Ctrl+C para parar
   npm run dev
   ```

3. Verifique se o projeto Supabase está ativo no dashboard

---

### Erro: "User not authenticated"

**Causas:**
- Usuário não criado no Supabase
- Token expirado
- LocalStorage corrompido

**Soluções:**
1. Crie usuário no Supabase Auth
2. Limpe o localStorage:
   ```javascript
   // F12 → Console
   localStorage.clear()
   ```
3. Faça login novamente

---

### Erro: "relation 'appointments' does not exist"

**Causa:** Schema SQL não foi executado

**Solução:**
```sql
-- No SQL Editor do Supabase, execute:
-- (copie todo o conteúdo de supabase-schema.sql)
```

---

### Erro: "permission denied for table appointments"

**Causa:** RLS não configurado corretamente

**Solução:**
```sql
-- No SQL Editor, verifique políticas:
SELECT * FROM pg_policies WHERE tablename = 'appointments';

-- Se vazio, execute novamente o supabase-schema.sql
```

---

### Build Error: "Module not found"

**Solução:**
```bash
# Limpe e reinstale
rm -rf node_modules .next
npm install
npm run build
```

---

### TypeScript Error: "Cannot find module '@/...'"

**Causa:** Paths não configurado

**Solução:**
Verifique `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

---

### Página em branco após login

**Causas:**
- Erro de JavaScript no console
- Usuário sem permissão
- RLS bloqueando acesso

**Soluções:**
1. Abra o Console (F12) e veja erros
2. Verifique se usuário está autenticado:
   ```javascript
   // No console
   localStorage.getItem('auth-storage')
   ```
3. Verifique RLS no Supabase

---

## 💻 Desenvolvimento

### Como adiciono uma nova página?

**Exemplo: Adicionar página de perfil**

```typescript
// app/dashboard/profile/page.tsx
'use client'

export default function ProfilePage() {
  return (
    <div>
      <h1>Meu Perfil</h1>
    </div>
  )
}
```

Acesse em `/dashboard/profile`

---

### Como crio um novo componente UI?

**Exemplo: Criar um Badge**

```typescript
// components/ui/badge.tsx
import * as React from 'react'
import { cn } from '@/lib/utils'

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        className
      )}
      {...props}
    />
  )
}
```

---

### Como adiciono uma nova tabela no Supabase?

```sql
-- No SQL Editor
CREATE TABLE minha_tabela (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ativar RLS
ALTER TABLE minha_tabela ENABLE ROW LEVEL SECURITY;

-- Criar política
CREATE POLICY "Users can view their own data"
  ON minha_tabela FOR SELECT
  USING (auth.uid() = user_id);
```

---

### Como adiciono animações com Framer Motion?

```typescript
import { motion } from 'framer-motion'

export function MeuComponente() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      Conteúdo animado
    </motion.div>
  )
}
```

---

## 🎨 Customização

### Como altero as cores do tema?

Edite `app/globals.css`:

```css
:root {
  --primary: 221.2 83.2% 53.3%;    /* Azul */
  --secondary: 210 40% 96.1%;       /* Cinza claro */
  /* ... */
}
```

Ou use classes Tailwind:
```tsx
<div className="bg-gradient-to-r from-pink-500 to-orange-600">
  Novo gradiente
</div>
```

---

### Como adiciono um novo serviço na lista?

Edite `app/dashboard/appointments/new/page.tsx`:

```typescript
const services = [
  'Consulta',
  'Reunião',
  'Avaliação',
  'Meu Novo Serviço',  // ← Adicione aqui
  // ...
]
```

---

### Como altero a duração padrão dos agendamentos?

Em `app/dashboard/appointments/new/page.tsx`:

```typescript
const {
  register,
  // ...
} = useForm<AppointmentForm>({
  defaultValues: {
    duration: 60,  // ← Altere de 30 para 60 minutos
  },
})
```

---

## 🚀 Deploy

### Como faço deploy no Vercel?

**Opção 1: Via GitHub**
1. Push código para GitHub
2. Conecte repositório no Vercel
3. Configure variáveis de ambiente
4. Deploy automático

**Opção 2: Via CLI**
```bash
npm i -g vercel
vercel --prod
```

Ver **DEPLOY.md** para detalhes.

---

### Como adiciono domínio customizado?

**No Vercel:**
1. Project Settings → Domains
2. Add domain
3. Configure DNS:
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

---

### Como configuro HTTPS?

✅ Automático no Vercel e Netlify!

Para VPS, use Let's Encrypt:
```bash
sudo certbot --nginx -d seudominio.com
```

---

## 📊 Funcionalidades

### Como exporto agendamentos para PDF?

**Funcionalidade futura!** Por enquanto, use:

```typescript
// Temporário: copie dados
const exportData = appointments.map(apt => ({
  data: format(parseISO(apt.start_time), 'dd/MM/yyyy'),
  hora: format(parseISO(apt.start_time), 'HH:mm'),
  cliente: apt.client_name,
  servico: apt.service,
}))

console.table(exportData)
```

---

### Como adiciono notificações por email?

**Em desenvolvimento!** Vai usar Supabase Edge Functions.

---

### Como integro com Google Calendar?

**Roadmap futuro!** Vai usar Google Calendar API.

---

### Posso usar sem Supabase?

Sim, mas requer mudanças:
1. Alterar `lib/supabase.ts` para usar outro backend
2. Implementar autenticação alternativa
3. Adaptar queries

---

## 🔐 Segurança

### Os dados são seguros?

✅ Sim!
- Supabase usa PostgreSQL com RLS
- Autenticação com JWT
- HTTPS obrigatório em produção
- Validação no backend e frontend

---

### Como protejo rotas sensíveis?

Já implementado! Ver `middleware.ts`:

```typescript
const protectedRoutes = ['/dashboard', '/appointments']
// Redireciona para /login se não autenticado
```

---

### Como adiciono 2FA (autenticação de 2 fatores)?

**Funcionalidade futura!** Supabase suporta nativamente:
```typescript
// Exemplo futuro
await supabase.auth.mfa.enroll({
  factorType: 'totp',
})
```

---

## 📱 Mobile

### O app funciona no mobile?

✅ Sim! Design 100% responsivo.

Testado em:
- iPhone (Safari)
- Android (Chrome)
- Tablet (iPad)

---

### Posso criar um app nativo?

Sim! Use React Native com Expo:
- Reuse lógica de negócio
- Componentes precisam ser adaptados
- Supabase funciona normalmente

---

## 💡 Dicas

### Atalhos úteis

```bash
# Reiniciar servidor rapidamente
rs

# Ver logs detalhados
npm run dev -- --turbo

# Build e testar
npm run build && npm start

# Limpar tudo
rm -rf .next node_modules && npm install
```

---

### Console do Supabase

```javascript
// Ver usuário autenticado
const { data: { user } } = await supabase.auth.getUser()
console.log(user)

// Fazer query manualmente
const { data } = await supabase.from('appointments').select('*')
console.table(data)

// Testar autenticação
await supabase.auth.signInWithPassword({
  email: 'teste@exemplo.com',
  password: '123456'
})
```

---

### DevTools

- **F12**: Abrir DevTools
- **Ctrl+Shift+M**: Modo responsivo
- **Ctrl+Shift+C**: Inspecionar elemento
- **Ctrl+Shift+I**: Console
- **Ctrl+Shift+J**: Console (Chrome)

---

## 📞 Suporte

### Onde encontro ajuda?

1. **Documentação**: Ver arquivos `.md` no projeto
2. **Supabase Docs**: https://supabase.com/docs
3. **Next.js Docs**: https://nextjs.org/docs
4. **Issues**: Abra um issue no GitHub
5. **Discord**: Entre na comunidade

---

### Como reporto um bug?

1. Verifique se já foi reportado
2. Crie um issue com:
   - Título descritivo
   - Passos para reproduzir
   - Comportamento esperado
   - Screenshots
   - Versão do Node/browser

---

### Como sugiro uma funcionalidade?

Abra um issue com tag `enhancement`:
- Descreva a funcionalidade
- Explique o caso de uso
- Providencie exemplos

---

## 🎓 Aprendizado

### Onde aprendo Next.js?

- [Next.js Learn](https://nextjs.org/learn)
- [Next.js Docs](https://nextjs.org/docs)
- [Vercel YouTube](https://www.youtube.com/@Vercel)

---

### Onde aprendo Supabase?

- [Supabase Learn](https://supabase.com/docs)
- [Supabase YouTube](https://www.youtube.com/@Supabase)
- [Supabase Discord](https://discord.supabase.com)

---

### Recursos recomendados

- **TypeScript**: https://www.typescriptlang.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Framer Motion**: https://www.framer.com/motion
- **React Hook Form**: https://react-hook-form.com
- **Zod**: https://zod.dev

---

## ✅ Checklist de Produção

Antes de colocar em produção:

- [ ] Executar `npm run build` sem erros
- [ ] Testar todas funcionalidades
- [ ] Configurar variáveis de ambiente
- [ ] Adicionar Analytics (Google Analytics)
- [ ] Configurar Sentry (error tracking)
- [ ] Testar em múltiplos dispositivos
- [ ] Verificar performance (Lighthouse)
- [ ] Configurar domínio e SSL
- [ ] Fazer backup do banco
- [ ] Documentar APIs (se houver)

---

**Não encontrou sua dúvida?** Abra um issue! 🚀
