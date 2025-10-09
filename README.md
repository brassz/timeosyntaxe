# 📅 TimeoSyntaxe - Sistema de Agendamentos

Sistema moderno e inteligente para gerenciar agendamentos, construído com as melhores tecnologias do mercado.

## ✨ Características

- 🎨 **Design Moderno**: Interface limpa e minimalista com gradientes sutis e animações suaves
- 📱 **Responsivo**: Mobile-first, funciona perfeitamente em todos os dispositivos
- 🔐 **Autenticação Segura**: Sistema completo com Supabase Auth
- 📆 **Calendário Interativo**: Visualize todos seus compromissos de forma intuitiva
- ⚡ **Performance**: Next.js 14 com App Router para velocidade máxima
- 🎭 **Animações**: Transições suaves com Framer Motion
- 🔔 **Notificações**: Feedback visual com toasts elegantes

## 🚀 Tecnologias

- **Frontend**: Next.js 14, React 18, TypeScript
- **Estilização**: Tailwind CSS, shadcn/ui
- **Animações**: Framer Motion
- **Formulários**: React Hook Form + Zod
- **Estado**: Zustand
- **Backend**: Supabase (PostgreSQL + Auth)
- **Notificações**: React Hot Toast

## 📋 Pré-requisitos

- Node.js 18+ instalado
- Conta no Supabase (gratuita)
- Git (opcional)

## 🛠️ Instalação

### 1. Clone o repositório

```bash
git clone <seu-repositorio>
cd timeosyntaxe
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o Supabase

#### 3.1 Acesse o Supabase Dashboard

1. Acesse [https://supabase.com](https://supabase.com)
2. Faça login ou crie uma conta gratuita
3. Seu projeto já está criado com as credenciais:
   - URL: `https://eppzphzwwpvpoocospxy.supabase.co`
   - Anon Key: Já configurada no projeto

#### 3.2 Configure as variáveis de ambiente

Copie o arquivo `.env.example` para `.env.local`:

```bash
# Windows (PowerShell)
copy .env.example .env.local

# Linux/Mac
cp .env.example .env.local
```

As credenciais já estão configuradas no `.env.example`.

#### 3.3 Execute o script SQL

1. No Supabase Dashboard, vá em **SQL Editor**
2. Clique em **New Query**
3. Copie todo o conteúdo do arquivo `supabase-schema.sql`
4. Cole no editor e clique em **Run**

Isso criará:
- ✅ Tabela `appointments` (agendamentos)
- ✅ Tabela `subscriptions` (planos)
- ✅ Índices para performance
- ✅ Row Level Security (RLS)
- ✅ Políticas de segurança

#### 3.4 Crie um usuário de teste

1. No Supabase Dashboard, vá em **Authentication** → **Users**
2. Clique em **Add User** → **Create new user**
3. Preencha:
   - Email: `teste@exemplo.com`
   - Password: `123456`
4. Clique em **Create User**

## 🎯 Executar o projeto

### Modo desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

### Build de produção

```bash
npm run build
npm start
```

## 📦 Deploy no Vercel

### Opção 1: Deploy via Git (Recomendado)

1. Crie um repositório no GitHub
2. Faça commit e push do código:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <seu-repositorio-github>
git push -u origin main
```

3. Acesse [https://vercel.com](https://vercel.com)
4. Clique em **New Project**
5. Importe seu repositório do GitHub
6. Configure as variáveis de ambiente:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
7. Clique em **Deploy**

### Opção 2: Deploy via Vercel CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy de produção
vercel --prod
```

## 🎨 Funcionalidades

### Landing Page
- ✅ Apresentação do sistema
- ✅ Planos de preços (Mensal, Trimestral, Anual)
- ✅ Destaque para plano anual
- ✅ Parcelamento em até 10x
- ✅ Design com gradientes animados

### Autenticação
- ✅ Login com email/senha
- ✅ Validação de formulários
- ✅ Persistência de sessão
- ✅ Proteção de rotas

### Dashboard
- ✅ Overview com estatísticas
- ✅ Calendário mensal interativo
- ✅ Lista de próximos agendamentos
- ✅ Cards com informações em tempo real

### Agendamentos
- ✅ Criar novos agendamentos
- ✅ Editar agendamentos existentes
- ✅ Deletar agendamentos
- ✅ Validação de conflitos de horário
- ✅ Filtro de busca
- ✅ Status (Agendado, Concluído, Cancelado)
- ✅ Informações detalhadas (cliente, serviço, duração)

## 📱 Estrutura do Projeto

```
timeosyntaxe/
├── app/
│   ├── dashboard/
│   │   ├── appointments/
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx       # Editar agendamento
│   │   │   ├── new/
│   │   │   │   └── page.tsx       # Criar agendamento
│   │   │   └── page.tsx           # Lista de agendamentos
│   │   ├── layout.tsx             # Layout do dashboard
│   │   └── page.tsx               # Dashboard principal
│   ├── login/
│   │   └── page.tsx               # Página de login
│   ├── globals.css                # Estilos globais
│   ├── layout.tsx                 # Layout raiz
│   └── page.tsx                   # Landing page
├── components/
│   ├── ui/                        # Componentes shadcn/ui
│   │   ├── avatar.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   └── select.tsx
│   └── Header.tsx                 # Header do dashboard
├── lib/
│   ├── store.ts                   # Zustand stores
│   ├── supabase.ts                # Cliente Supabase
│   └── utils.ts                   # Utilitários
├── middleware.ts                  # Proteção de rotas
├── supabase-schema.sql           # Schema do banco
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## 🎭 Componentes UI

Todos os componentes são do **shadcn/ui**, totalmente customizados com:
- Gradientes sutis
- Animações de hover
- Transições suaves
- Responsividade completa

### Principais componentes:
- `Button`: Botões com variantes (gradient, outline, ghost)
- `Card`: Cards com hover effects
- `Input`: Inputs com validação visual
- `Dialog`: Modais elegantes
- `Select`: Dropdowns customizados
- `Avatar`: Avatares com fallback

## 🔐 Autenticação

O sistema usa **Supabase Auth** com:
- Email + Senha
- Row Level Security (RLS)
- Tokens JWT
- Persistência com Zustand

## 🗄️ Banco de Dados

### Tabela: appointments
```sql
- id: UUID
- user_id: UUID (FK para auth.users)
- title: TEXT
- client_name: TEXT
- service: TEXT
- start_time: TIMESTAMPTZ
- end_time: TIMESTAMPTZ
- duration: INTEGER
- status: TEXT (scheduled, completed, cancelled)
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ
```

### Tabela: subscriptions
```sql
- id: UUID
- user_id: UUID (FK para auth.users)
- plan: TEXT (monthly, quarterly, annual)
- status: TEXT (active, cancelled, expired)
- start_date: TIMESTAMPTZ
- end_date: TIMESTAMPTZ
- price: DECIMAL
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ
```

## 🎨 Paleta de Cores

- **Primary**: Gradiente azul → roxo (#3b82f6 → #8b5cf6)
- **Secondary**: Roxo → Rosa (#8b5cf6 → #ec4899)
- **Success**: Verde (#10b981)
- **Error**: Vermelho (#ef4444)

## 🌟 Próximas Funcionalidades

- [ ] Sistema de notificações por email
- [ ] Integração com Google Calendar
- [ ] Lembretes automáticos por WhatsApp
- [ ] Relatórios e analytics
- [ ] Exportação de dados (PDF, Excel)
- [ ] Multi-usuários e permissões
- [ ] Temas claro/escuro
- [ ] PWA (Progressive Web App)

## 🐛 Troubleshooting

### Erro: Cannot connect to Supabase
- Verifique se as variáveis de ambiente estão corretas
- Confirme que executou o script SQL no Supabase
- Verifique sua conexão com internet

### Erro: User not authenticated
- Limpe o localStorage do navegador
- Crie um novo usuário no Supabase Auth
- Verifique se as políticas RLS estão ativas

### Build Error
```bash
# Limpe o cache e reinstale
rm -rf .next node_modules
npm install
npm run build
```

## 📄 Scripts Disponíveis

```bash
npm run dev      # Modo desenvolvimento
npm run build    # Build de produção
npm start        # Executar build
npm run lint     # Verificar código
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

## 📝 Licença

Este projeto é privado e proprietário.

## 👤 Autor

Desenvolvido com ❤️ para gerenciar agendamentos de forma moderna e eficiente.

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique a documentação
2. Consulte os issues do GitHub
3. Entre em contato com o desenvolvedor

---

**Nota**: Este é um projeto demonstrativo. Para uso em produção, considere adicionar:
- Testes automatizados
- Monitoramento de erros (Sentry)
- Analytics (Google Analytics)
- SEO otimizado
- Logs estruturados
- Backup automático

🚀 **Bom desenvolvimento!**
