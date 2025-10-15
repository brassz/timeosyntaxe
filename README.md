# 📅 Sistema de Agendamentos Completo

Um sistema completo de agendamentos desenvolvido com React (frontend) e Node.js (backend), oferecendo uma solução moderna e escalável para gerenciamento de agendamentos e serviços.

## Funcionalidades

### Para Clientes
- ✅ Cadastro e login de usuários
- ✅ Visualização de horários disponíveis
- ✅ Agendamento de serviços
- ✅ Histórico de agendamentos
- ✅ Cancelamento de agendamentos
- ✅ Notificações por email

### Para Prestadores de Serviço
- ✅ Dashboard administrativo
- ✅ Gerenciamento de horários disponíveis
- ✅ Visualização de agendamentos
- ✅ Confirmação/cancelamento de agendamentos
- ✅ Relatórios e estatísticas

### Recursos Técnicos
- ✅ Interface moderna e responsiva
- ✅ Autenticação JWT
- ✅ Banco de dados PostgreSQL
- ✅ API RESTful
- ✅ Validação de dados
- ✅ Sistema de notificações
- ✅ Calendário interativo

## Tecnologias Utilizadas

### Frontend
- React 18
- TypeScript
- Material-UI
- React Router
- Axios
- React Query
- FullCalendar

### Backend
- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT Authentication
- Nodemailer
- Express Validator

## 🚀 Instalação Rápida

### Método 1: Setup Automático (Recomendado)
```bash
# Execute o script de setup automático
./setup.sh
```

### Método 2: Instalação Manual

#### Pré-requisitos
- Node.js 18+
- PostgreSQL 12+
- npm ou yarn

#### Passos
```bash
# 1. Instalar todas as dependências
npm run install-all

# 2. Configurar banco de dados
cd server
cp .env.example .env
# Edite .env com suas configurações de banco

# 3. Executar migrações e seed
npm run db:migrate
npm run db:seed

# 4. Voltar ao diretório raiz
cd ..

# 5. Iniciar o sistema
npm run dev
```

### ⚡ Execução
```bash
# Executar em modo desenvolvimento (frontend + backend)
npm run dev

# Ou executar separadamente:
npm run server  # Backend na porta 3001
npm run client  # Frontend na porta 3000
```

### 📦 Build para Produção
```bash
npm run build
npm start
```

## Estrutura do Projeto

```
├── client/                 # Frontend React
│   ├── public/
│   ├── src/
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── hooks/         # Custom hooks
│   │   ├── services/      # Serviços de API
│   │   ├── types/         # Tipos TypeScript
│   │   └── utils/         # Utilitários
│   └── package.json
├── server/                # Backend Node.js
│   ├── src/
│   │   ├── controllers/   # Controladores
│   │   ├── middleware/    # Middlewares
│   │   ├── models/        # Modelos Prisma
│   │   ├── routes/        # Rotas da API
│   │   ├── services/      # Serviços de negócio
│   │   └── utils/         # Utilitários
│   ├── prisma/           # Schema e migrações
│   └── package.json
└── package.json          # Scripts principais
```

## API Endpoints

### Autenticação
- `POST /api/auth/register` - Cadastro de usuário
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Renovar token

### Agendamentos
- `GET /api/appointments` - Listar agendamentos
- `POST /api/appointments` - Criar agendamento
- `PUT /api/appointments/:id` - Atualizar agendamento
- `DELETE /api/appointments/:id` - Cancelar agendamento

### Serviços
- `GET /api/services` - Listar serviços
- `POST /api/services` - Criar serviço (admin)
- `PUT /api/services/:id` - Atualizar serviço (admin)

### Horários
- `GET /api/availability` - Verificar disponibilidade
- `POST /api/availability` - Definir horários disponíveis (admin)

## Configuração do Banco de Dados

O sistema utiliza PostgreSQL com Prisma ORM. O schema inclui:

- **Users**: Usuários do sistema (clientes e prestadores)
- **Services**: Serviços oferecidos
- **Appointments**: Agendamentos
- **Availability**: Horários disponíveis
- **Notifications**: Notificações

## Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT.