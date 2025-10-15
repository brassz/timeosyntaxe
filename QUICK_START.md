# 🚀 Guia de Início Rápido

## 1. Configuração Inicial

### Opção A: Setup Automático
```bash
./setup.sh
```

### Opção B: Setup Manual
```bash
# Instalar dependências
npm run install-all

# Configurar banco (PostgreSQL)
cd server
cp .env.example .env
# Edite .env com suas configurações

# Executar migrações
npm run db:migrate
npm run db:seed
cd ..
```

## 2. Iniciar o Sistema
```bash
npm run dev
```

## 3. Acessar o Sistema
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api
- **Documentação API**: http://localhost:3001/api/health

## 4. Usuários de Teste
Após executar o seed, você terá:

| Tipo | Email | Senha | Descrição |
|------|-------|-------|-----------|
| Admin | admin@agendamentos.com | admin123 | Acesso total ao sistema |
| Provider | provider@agendamentos.com | provider123 | Prestador de serviços |
| Cliente | client@agendamentos.com | client123 | Cliente final |

## 5. Funcionalidades Principais

### Para Clientes
1. **Cadastro/Login** - Criar conta e fazer login
2. **Agendar Serviços** - Escolher serviço, data e horário
3. **Visualizar Agendamentos** - Ver histórico e próximos agendamentos
4. **Cancelar Agendamentos** - Cancelar quando necessário

### Para Prestadores
1. **Gerenciar Serviços** - Criar e editar serviços oferecidos
2. **Definir Disponibilidade** - Configurar horários de trabalho
3. **Confirmar Agendamentos** - Aprovar ou rejeitar solicitações
4. **Dashboard** - Visualizar estatísticas e agendamentos

### Para Administradores
1. **Dashboard Completo** - Visão geral do sistema
2. **Gerenciar Usuários** - Administrar todos os usuários
3. **Relatórios** - Estatísticas e métricas do sistema
4. **Configurações** - Ajustes gerais do sistema

## 6. Estrutura de Navegação

```
📱 Frontend (React)
├── 🏠 Dashboard - Visão geral personalizada
├── 📅 Agendamentos - Listar e gerenciar agendamentos
├── 🛍️ Serviços - Catálogo de serviços disponíveis
├── ⏰ Disponibilidade - Configurar horários (providers)
├── 👥 Usuários - Gerenciar usuários (admin)
├── 🔔 Notificações - Central de notificações
└── 👤 Perfil - Configurações da conta
```

## 7. API Endpoints Principais

```
🔐 Autenticação
POST /api/auth/login
POST /api/auth/register
GET  /api/auth/me

📅 Agendamentos
GET    /api/appointments
POST   /api/appointments
PUT    /api/appointments/:id/status
DELETE /api/appointments/:id

🛍️ Serviços
GET  /api/services
POST /api/services
PUT  /api/services/:id

⏰ Disponibilidade
GET  /api/availability/provider/:id
POST /api/availability
GET  /api/availability/slots/:serviceId
```

## 8. Configurações Importantes

### Banco de Dados
```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/agendamentos"
```

### Email (Notificações)
```env
EMAIL_HOST="smtp.gmail.com"
EMAIL_USER="seu-email@gmail.com"
EMAIL_PASS="sua-senha-de-app"
```

### JWT
```env
JWT_SECRET="seu-secret-super-seguro"
JWT_EXPIRES_IN="7d"
```

## 9. Comandos Úteis

```bash
# Desenvolvimento
npm run dev              # Iniciar frontend + backend
npm run server          # Apenas backend
npm run client          # Apenas frontend

# Banco de dados
cd server
npm run db:migrate      # Executar migrações
npm run db:seed         # Popular com dados de teste
npm run db:studio       # Abrir Prisma Studio

# Produção
npm run build           # Build do frontend
npm start              # Iniciar em produção
```

## 10. Solução de Problemas

### Erro de Conexão com Banco
1. Verifique se PostgreSQL está rodando
2. Confirme as credenciais no `.env`
3. Execute `npm run db:migrate`

### Porta já em uso
1. Backend (3001): Altere `PORT` no `.env`
2. Frontend (3000): Será perguntado para usar outra porta

### Erro de Dependências
```bash
# Limpar e reinstalar
rm -rf node_modules server/node_modules client/node_modules
npm run install-all
```

## 🎉 Pronto!

Agora você tem um sistema completo de agendamentos funcionando. Explore as funcionalidades e personalize conforme suas necessidades!