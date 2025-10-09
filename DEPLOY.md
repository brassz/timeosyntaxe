# 🚀 Guia de Deploy - TimeoSyntaxe

## Deploy no Vercel (Recomendado)

### Opção 1: Via GitHub (Melhor para CI/CD)

#### 1. Preparar repositório

```bash
# Inicializar Git (se ainda não fez)
git init

# Adicionar arquivos
git add .

# Commit inicial
git commit -m "🎉 Initial commit - TimeoSyntaxe"

# Criar branch main
git branch -M main

# Adicionar repositório remoto
git remote add origin https://github.com/seu-usuario/timeosyntaxe.git

# Push
git push -u origin main
```

#### 2. Deploy no Vercel

1. Acesse [https://vercel.com](https://vercel.com)
2. Login com GitHub
3. **New Project**
4. **Import** seu repositório
5. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

#### 3. Variáveis de Ambiente

Adicione no Vercel:

```env
NEXT_PUBLIC_SUPABASE_URL=https://eppzphzwwpvpoocospxy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwcHpwaHp3d3B2cG9vY29zcHh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0NTc1MDEsImV4cCI6MjA3NTAzMzUwMX0.QwiFlP-h3sk0-pDBmrOMkQmhWZtewD2wDMPYbXAATXI
```

#### 4. Deploy

- Clique em **Deploy**
- Aguarde o build (2-3 minutos)
- Seu site estará em `https://seu-projeto.vercel.app`

---

### Opção 2: Via Vercel CLI

#### 1. Instalar Vercel CLI

```bash
npm i -g vercel
```

#### 2. Login

```bash
vercel login
```

#### 3. Deploy

```bash
# Deploy de preview
vercel

# Deploy de produção
vercel --prod
```

#### 4. Adicionar variáveis de ambiente

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
# Cole o valor: https://eppzphzwwpvpoocospxy.supabase.co

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# Cole o valor da key
```

---

## Deploy no Netlify

### 1. Build Settings

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"
```

### 2. Deploy

```bash
npm i -g netlify-cli
netlify login
netlify deploy --prod
```

### 3. Variáveis de ambiente

No Netlify Dashboard:
- **Site Settings** → **Environment Variables**
- Adicione `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## Deploy Manual (VPS/Cloud)

### Requisitos
- Node.js 18+
- PM2 (gerenciador de processos)
- Nginx (opcional, para proxy reverso)

### 1. Build da aplicação

```bash
npm run build
```

### 2. Instalar PM2

```bash
npm i -g pm2
```

### 3. Iniciar aplicação

```bash
pm2 start npm --name "timeosyntaxe" -- start
pm2 save
pm2 startup
```

### 4. Configurar Nginx (opcional)

```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Configurar Domínio Customizado

### No Vercel

1. **Project Settings** → **Domains**
2. Adicione seu domínio
3. Configure DNS:
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

### No Netlify

1. **Domain Management** → **Add Custom Domain**
2. Configure DNS conforme instruções

---

## Otimizações de Produção

### 1. Adicionar Analytics

```bash
# Google Analytics
npm install @next/third-parties
```

### 2. Configurar Sentry (Monitoramento de erros)

```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

### 3. Adicionar SEO

Em `app/layout.tsx`:

```tsx
export const metadata = {
  metadataBase: new URL('https://seu-dominio.com'),
  title: 'TimeoSyntaxe - Sistema de Agendamentos',
  description: 'Gerencie seus agendamentos de forma moderna e eficiente',
  openGraph: {
    images: ['/og-image.png'],
  },
}
```

### 4. Configurar CSP (Content Security Policy)

Em `next.config.js`:

```js
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline';"
          }
        ]
      }
    ]
  }
}
```

---

## Checklist Pré-Deploy

- [ ] Build local funciona (`npm run build`)
- [ ] Testes de funcionalidade
- [ ] Variáveis de ambiente configuradas
- [ ] Schema do Supabase executado
- [ ] Domínio configurado (se aplicável)
- [ ] SSL/HTTPS ativo
- [ ] Analytics configurado
- [ ] Sentry configurado (erro tracking)
- [ ] Imagens otimizadas
- [ ] Meta tags SEO
- [ ] Lighthouse score > 90

---

## Monitoramento

### Vercel Analytics

```bash
npm install @vercel/analytics
```

Em `app/layout.tsx`:

```tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

---

## Comandos Úteis

```bash
# Build local
npm run build

# Testar build local
npm start

# Limpar cache
rm -rf .next

# Deploy Vercel (preview)
vercel

# Deploy Vercel (produção)
vercel --prod

# Ver logs
vercel logs

# Ver domínios
vercel domains ls
```

---

## Suporte

- [Documentação Vercel](https://vercel.com/docs)
- [Next.js Deploy](https://nextjs.org/docs/deployment)
- [Supabase Docs](https://supabase.com/docs)

🚀 **Bom deploy!**
