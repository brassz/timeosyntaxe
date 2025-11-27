# 🚀 Guia de Deploy - Terraplanagem Guimarães

## Opções de Deploy

### 1. Vercel (Recomendado - GRÁTIS)

#### Opção A: Deploy via CLI
```bash
# Instalar Vercel CLI
npm install -g vercel

# Fazer login
vercel login

# Deploy
vercel

# Deploy para produção
vercel --prod
```

#### Opção B: Deploy via GitHub
1. Acesse [vercel.com](https://vercel.com)
2. Conecte seu repositório GitHub
3. Vercel detectará automaticamente como projeto Vite
4. Clique em "Deploy"
5. Pronto! URL disponível em segundos

**Configurações automáticas:**
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

---

### 2. Netlify (Alternativa - GRÁTIS)

#### Via CLI:
```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Fazer login
netlify login

# Deploy
netlify deploy

# Deploy para produção
netlify deploy --prod
```

#### Via Interface:
1. Acesse [netlify.com](https://netlify.com)
2. Clique em "Add new site" > "Import an existing project"
3. Conecte ao GitHub
4. Configure:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Deploy

---

### 3. GitHub Pages

```bash
# Instalar gh-pages
npm install -g gh-pages

# Build
npm run build

# Deploy
gh-pages -d dist
```

Adicione ao `vite.config.ts`:
```typescript
export default defineConfig({
  plugins: [react()],
  base: '/nome-do-repositorio/', // Nome do seu repo
})
```

Acesse em: `https://seuusuario.github.io/nome-do-repositorio/`

---

### 4. Deploy Local (Servidor Próprio)

#### Opção A: Servidor Simples
```bash
# Build
npm run build

# Servir com qualquer servidor HTTP
npx serve dist
# ou
python -m http.server --directory dist 8080
```

#### Opção B: Nginx
```bash
# Build
npm run build

# Copiar para pasta do Nginx
sudo cp -r dist/* /var/www/html/

# Configurar Nginx
sudo nano /etc/nginx/sites-available/default
```

Configuração Nginx:
```nginx
server {
    listen 80;
    server_name seu-dominio.com;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

### 5. Docker

Criar `Dockerfile`:
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Criar `nginx.conf`:
```nginx
server {
    listen 80;
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
}
```

Deploy:
```bash
# Build da imagem
docker build -t terraplanagem-guimaraes .

# Executar
docker run -d -p 80:80 terraplanagem-guimaraes
```

---

## 🔧 Configurações Importantes

### PWA (Progressive Web App) - Opcional

Para permitir instalação no celular como app:

1. Instalar plugin PWA:
```bash
npm install vite-plugin-pwa -D
```

2. Atualizar `vite.config.ts`:
```typescript
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Terraplanagem Guimarães',
        short_name: 'TG Checklist',
        description: 'Sistema de Checklist de Máquinas Pesadas',
        theme_color: '#ffcc00',
        background_color: '#1a1a1a',
        display: 'standalone',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})
```

---

## 📱 Domínio Personalizado

### Vercel:
1. Vá em Settings > Domains
2. Adicione seu domínio
3. Configure DNS conforme instruções

### Netlify:
1. Vá em Domain settings
2. Add custom domain
3. Configure DNS

### Registradores Populares:
- Registro.br (Brasil)
- GoDaddy
- Namecheap
- Cloudflare

---

## 🔒 HTTPS

Todos os serviços recomendados (Vercel, Netlify) fornecem **HTTPS gratuito** automaticamente via Let's Encrypt.

Para servidor próprio:
```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# Obter certificado
sudo certbot --nginx -d seu-dominio.com
```

---

## 📊 Monitoramento

### Google Analytics (Opcional)

Adicionar ao `index.html`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

---

## ✅ Checklist de Deploy

- [ ] Build funciona localmente (`npm run build`)
- [ ] Teste a pasta `dist` localmente
- [ ] Configure variáveis de ambiente (se houver)
- [ ] Teste em diferentes navegadores
- [ ] Teste em dispositivos móveis
- [ ] Configure domínio (se aplicável)
- [ ] Configure HTTPS
- [ ] Teste upload de fotos
- [ ] Teste geração de PDF
- [ ] Teste armazenamento local
- [ ] Configure backup/analytics (opcional)

---

## 🆘 Troubleshooting

### Build falha
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Rotas 404
Configure redirect/rewrite:
- **Vercel:** `vercel.json`
- **Netlify:** `_redirects` ou `netlify.toml`

### Fotos grandes
Considere adicionar compressão de imagem antes do upload.

---

## 🎯 Recomendação Final

**Para uso rápido e fácil:** Use **Vercel** ou **Netlify**
- Deploy em 2 minutos
- HTTPS automático
- CDN global
- Domínio gratuito (.vercel.app ou .netlify.app)
- Atualizações automáticas via Git

**Para controle total:** Use servidor próprio com Docker
- Mais configurável
- Sem limites de provider
- Dados sob seu controle
