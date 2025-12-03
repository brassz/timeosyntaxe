# Sistema OSI - Ordem de Serviço Interna

## 📋 Visão Geral

Sistema completo de gerenciamento de Ordens de Serviço Interna (OSI) para a Terraplanagem Guimarães, integrado ao sistema de checklist existente.

## 🚀 Funcionalidades Implementadas

### 1. ✅ Sistema de Login
- Login com usuário e senha próprios (sem Supabase Auth)
- Autenticação via bcrypt
- Sessão local com JWT/localStorage
- Expiração de sessão em 24 horas
- Interface moderna e responsiva

### 2. ✅ Painel OSI (Dashboard)
- Visão geral do sistema
- Botões de acesso rápido:
  - Gerar Ordem de Serviço
  - Histórico de Ordens
  - Sair
- Informações do usuário logado
- Design profissional e intuitivo

### 3. ✅ Formulário de Ordem de Serviço
Campos completos:
- **Informações Básicas**: Data, Hora, Veículo, Equipamento
- **Medições**: KM Inicial, KM Final, TAG, Horímetro
- **Tipo de Manutenção** (checkboxes):
  - Preditiva
  - Preventiva
  - Corretiva
  - Avaria
  - Oportunidade
  - Outros
- **Descrição dos Serviços** (campo de texto longo)
- **Peças Aplicadas** (campo de texto longo)
- **Observações** (campo de texto longo)
- **Responsáveis**: Mecânico e Responsável Obra

### 4. ✅ Geração de PDF
- Layout profissional e estruturado
- Todas as informações da OS
- Tabelas organizadas
- Campos de assinatura
- Upload automático para Supabase Storage
- Biblioteca: pdfmake

### 5. ✅ Geração de Excel
- Layout idêntico ao PDF
- Formatação profissional
- Bordas e cores
- Upload automático para Supabase Storage
- Biblioteca: ExcelJS

### 6. ✅ Histórico de Ordens
Tabela completa com:
- Número da OS
- Data e Hora
- Veículo e Equipamento
- Mecânico
- Ações: Ver PDF, Ver Excel, Excluir

**Filtros disponíveis:**
- Por período (data inicial e final)
- Por número da OS
- Por veículo
- Por equipamento

### 7. ✅ Banco de Dados Supabase
- Tabela `usuarios` para autenticação
- Tabela `osi_ordens` para ordens de serviço
- Índices para otimização de consultas
- Storage bucket para arquivos PDF e Excel

## 🔧 Configuração

### Passo 1: Criar Tabelas no Supabase

Execute o arquivo `supabase-setup.sql` no SQL Editor do Supabase:

```sql
-- Veja o arquivo supabase-setup.sql
```

### Passo 2: Criar Bucket de Storage

1. Acesse o Supabase Dashboard
2. Vá em **Storage**
3. Clique em **Create bucket**
4. Nome: `osi-files`
5. Marque como **Public**
6. Clique em **Create**

### Passo 3: Instalar Dependências

```bash
npm install
```

### Passo 4: Executar o Sistema

```bash
npm run dev
```

## 👤 Usuário de Teste

**Usuário:** `admin`  
**Senha:** `admin123`

> ⚠️ Altere essas credenciais em produção!

## 📦 Tecnologias Utilizadas

- **Frontend**: React + TypeScript + Vite
- **Estilização**: CSS puro (design responsivo)
- **Banco de Dados**: Supabase (PostgreSQL)
- **Autenticação**: bcryptjs + localStorage
- **Geração de PDF**: pdfmake
- **Geração de Excel**: ExcelJS
- **Storage**: Supabase Storage

## 🎨 Design

- Interface moderna e profissional
- Cores neutras com gradientes
- Layout responsivo (mobile-friendly)
- Animações suaves
- Feedback visual em todas as ações

## 🔐 Segurança

- Senhas criptografadas com bcrypt
- Sessões com expiração automática
- Validação de dados no frontend
- Políticas de segurança no Supabase (RLS)

## 📂 Estrutura de Arquivos

```
src/
├── components/
│   ├── Login.tsx/css          # Tela de login
│   ├── OSIDashboard.tsx/css   # Painel principal
│   ├── OSIForm.tsx/css        # Formulário de OS
│   └── OSIHistory.tsx/css     # Histórico de ordens
├── services/
│   ├── supabase.ts            # Cliente Supabase
│   ├── auth.ts                # Autenticação
│   ├── osi.ts                 # Operações CRUD OSI
│   ├── osiPDF.ts              # Geração de PDF
│   └── osiExcel.ts            # Geração de Excel
├── types/
│   └── index.ts               # Tipos TypeScript
└── App.tsx                    # Aplicação principal
```

## 🔄 Fluxo do Sistema

1. **Acesso**: Usuário clica no botão "🔐 Painel OSI" na home
2. **Login**: Insere credenciais e autentica
3. **Dashboard**: Visualiza opções disponíveis
4. **Criar OS**: Preenche formulário completo
5. **Gerar Arquivos**: Sistema cria PDF e Excel automaticamente
6. **Salvar**: Ordem salva no banco com URLs dos arquivos
7. **Histórico**: Acessa lista de todas as ordens
8. **Ações**: Pode visualizar PDF/Excel ou excluir ordem

## 🆕 Integração com Sistema Existente

O sistema OSI foi integrado ao sistema de checklist existente:
- Botão de acesso ao OSI no header principal
- Navegação independente entre sistemas
- Não interfere no funcionamento do checklist
- Compartilha o mesmo design e identidade visual

## 🚨 Importantes Observações

1. **Primeiro Uso**: Execute o script SQL antes de usar o sistema
2. **Storage Bucket**: Crie o bucket `osi-files` no Supabase
3. **Credenciais**: Altere as credenciais padrão em produção
4. **Políticas RLS**: Ajuste conforme necessário para produção
5. **Backup**: Configure backups regulares do banco de dados

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique se as tabelas foram criadas corretamente
2. Confirme que o bucket de storage está público
3. Verifique as credenciais do Supabase no código
4. Consulte os logs do console do navegador

## 🎯 Próximas Melhorias (Sugestões)

- [ ] Adicionar edição de ordens existentes
- [ ] Implementar níveis de permissão de usuários
- [ ] Adicionar dashboard com estatísticas
- [ ] Exportação em massa de relatórios
- [ ] Notificações por email
- [ ] Assinatura digital
- [ ] Anexos de fotos nas OS
- [ ] Histórico de alterações (audit log)

---

✅ **Sistema completo e funcional!**

Desenvolvido para Terraplanagem Guimarães - 2025
