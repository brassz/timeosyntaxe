# 🚜 Terraplanagem Guimarães - Sistema de Checklist e OSI

Sistema completo, web e mobile-friendly, para checklist de máquinas pesadas e gestão de ordens de serviço interno.

## 🆕 Versão 2.0 - Novidades

- ✅ **Sistema OSI (Ordem de Serviço Interno)** - Gestão completa de ordens
- ✅ **Autenticação** - Login seguro para administradores
- ✅ **Banco de Dados Supabase** - Checklists com retenção de 7 dias, OSI permanente
- ✅ **Exportação para Excel** - Ordens de serviço em planilha
- ✅ **Numeração Automática** - Sistema inteligente de numeração de ordens
- ✅ **Formulário Profissional** - Layout idêntico ao documento impresso

## Características

### Sistema de Checklist
- ✅ **Sem login** - acesso direto para operadores
- ✅ **Mobile-friendly** - otimizado para tablets e celulares
- ✅ **Armazenamento em nuvem** - Supabase + fallback localStorage
- ✅ **Upload de múltiplas fotos** por item
- ✅ **Geração de PDF profissional** - com logo da empresa
- ✅ **Salvamento automático** de rascunhos
- ✅ **Retenção de 7 dias** - Checklists antigos são deletados automaticamente
- ✅ **Modo escuro** opcional

### Sistema OSI (Novo!)
- ✅ **Login administrativo** - Acesso seguro para gestores
- ✅ **Criação de ordens** - Formulário completo e profissional
- ✅ **Exportação PDF e Excel** - Múltiplos formatos de saída
- ✅ **Numeração automática** - Controle sequencial de ordens
- ✅ **Armazenamento permanente** - Ordens nunca são deletadas
- ✅ **Dados do equipamento** - KM, TAG, horímetro, etc.
- ✅ **Tipos de manutenção** - Preditiva, preventiva, corretiva, etc.
- ✅ **Assinaturas digitais** - Mecânico e responsável

## Como usar

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 🔧 Configuração do Banco de Dados

### ⚡ Configuração Rápida (5 minutos)

1. Siga o guia [QUICK_SETUP.md](QUICK_SETUP.md) - **RECOMENDADO**
2. Execute o script `supabase-complete-setup.sql` no Supabase
3. Pronto! Sistema configurado e funcionando

### 📚 Configuração Detalhada

Para instruções completas, consulte [SETUP_SUPABASE.md](SETUP_SUPABASE.md)

**Scripts disponíveis:**
- `supabase-complete-setup.sql` - ⭐ Script completo com verificações (RECOMENDADO)
- `supabase-setup.sql` - Script básico (versão simplificada)

## Tecnologias

- React 18
- TypeScript
- Vite
- **Supabase** - Banco de dados e autenticação
- jsPDF - Geração de PDF
- **xlsx** - Geração de Excel
- IndexedDB - Armazenamento de fotos
- localStorage - Fallback offline

## Funcionalidades

### Para Operadores (Checklist)
1. **Tela Inicial**: Nome do operador, seleção de máquina e local
2. **Checklist Completo**: Itens com status C/N.C/N.A, observações e fotos
3. **Armazenamento em Nuvem**: Dados sincronizados com Supabase
4. **PDF Profissional**: Geração de relatório completo com fotos
5. **Histórico (7 dias)**: Acesso aos checklists recentes

### Para Administradores (OSI)
1. **Login Seguro**: Autenticação via Supabase
2. **Painel OSI**: Interface administrativa intuitiva
3. **Criar Ordens**: Formulário completo de serviço interno
4. **Exportar**: PDF ou Excel com um clique
5. **Histórico Completo**: Todas as ordens salvas no banco

## 📚 Documentação Adicional

- [QUICK_SETUP.md](QUICK_SETUP.md) - ⚡ Configuração rápida em 5 minutos
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - 🔧 Solução de problemas
- [CREDENCIAIS.md](CREDENCIAIS.md) - 🔐 Credenciais de acesso
- [README_OSI.md](README_OSI.md) - Guia completo do Sistema OSI
- [SETUP_SUPABASE.md](SETUP_SUPABASE.md) - Configuração detalhada do banco
- [USUARIOS.md](USUARIOS.md) - Gerenciamento de usuários
- [POLITICA_RETENCAO.md](POLITICA_RETENCAO.md) - Política de retenção de dados
- [CHANGELOG_NEW_FEATURES.md](CHANGELOG_NEW_FEATURES.md) - Detalhes das novas funcionalidades

## 🔑 Scripts SQL Disponíveis

### Configuração Inicial:
- `supabase-complete-setup.sql` - ⭐ Script completo de instalação (RECOMENDADO)
- `supabase-setup.sql` - Script básico de instalação

### Criação de Usuários:
- `create-users-fixed.sql` - ⭐ Script corrigido sem erros (RECOMENDADO)
- `create-users-all.sql` - Script alternativo
- `create-user-gustavo.sql` - Script básico

## 👥 Credenciais de Acesso

Para acessar o Painel OSI, use uma das credenciais:

**Usuário 1 - Gustavo:**
- Email: `gustavo@terraplanagemguimaraes.com`
- Senha: `terraplanagem2025`

**Usuário 2 - Admin:**
- Email: `admin@terraplanagemguimaraes.com`
- Senha: `administrador2025`

📄 Ver detalhes completos em: [CREDENCIAIS.md](CREDENCIAIS.md)

## 🚀 Deploy

O sistema pode ser deployado em qualquer provedor de hospedagem estática:

- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

Certifique-se de configurar as variáveis de ambiente do Supabase se necessário.

## 📱 Acesso

- **Operadores**: Acesso direto sem login
- **Administradores**: Clique no botão "Login" no canto superior direito

## 🔒 Segurança

- Autenticação via Supabase Auth
- Row Level Security (RLS) configurado
- Dados criptografados em trânsito
- Políticas de acesso granulares

## 📊 Estrutura do Projeto

```
src/
├── components/         # Componentes React
│   ├── Checklist.tsx
│   ├── History.tsx
│   ├── Home.tsx
│   ├── LoginModal.tsx        # 🆕 Modal de login
│   ├── OSIPanel.tsx          # 🆕 Painel OSI
│   └── ServiceOrderForm.tsx  # 🆕 Formulário de ordem
├── contexts/
│   └── AuthContext.tsx       # 🆕 Contexto de autenticação
├── services/
│   ├── pdf.ts
│   ├── storage.ts
│   ├── supabase.ts           # 🆕 Configuração Supabase
│   ├── serviceOrderPdf.ts    # 🆕 Geração PDF OSI
│   └── serviceOrderExcel.ts  # 🆕 Geração Excel OSI
├── types/
│   └── index.ts
└── App.tsx
```

## 🐛 Troubleshooting

### Problemas comuns

1. **Erro ao salvar dados**: Verifique a configuração do Supabase
2. **Login não funciona**: Confirme que usuários foram criados
3. **PDF não gera**: Limpe o cache do navegador

Para mais detalhes, consulte a documentação específica.

## 📞 Suporte

Para dúvidas ou problemas:
- Consulte a documentação em `/docs`
- Verifique os arquivos README específicos
- Entre em contato com o suporte técnico

## 📝 Licença

© 2025 Terraplanagem Guimarães Serra LTDA - Todos os direitos reservados
