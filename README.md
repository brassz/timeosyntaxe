# 🚜 Sistema Terraplanagem Guimarães

Sistema completo de checklist de máquinas pesadas e ordens de serviço interna (OSI).

## 🚀 Início Rápido

### 1. Instalar Dependências
```bash
npm install
```

### 2. Iniciar Sistema
```bash
npm run dev
```

Acesse: http://localhost:5173

## ⚡ Duas Formas de Usar

### 🟢 Modo 1: Teste Rápido (SEM Banco de Dados)

**O sistema já funciona imediatamente!** Você pode testar agora mesmo:

✅ **Checklist**: Funciona normalmente (salvo no navegador)
✅ **Login OSI**: Use `admin` / `admin123` (dados em memória)
✅ **Criar Ordens**: Funciona (perdido ao recarregar)

⚠️ **Limitação**: Dados das ordens são perdidos ao recarregar a página.

### 🔵 Modo 2: Produção (COM Banco de Dados)

Para salvar dados permanentemente, configure o Supabase:

**Veja o guia:** `CONFIGURACAO_RAPIDA.md` (5 minutos)

Com banco configurado você tem:
- ✅ Dados salvos permanentemente na nuvem
- ✅ Checklists deletados automaticamente após 7 dias
- ✅ Histórico completo de ordens de serviço
- ✅ Sincronização entre dispositivos

## 📋 Funcionalidades

### Checklist de Máquinas
- ✅ Múltiplos tipos de máquinas (Escavadeira, Pá Carregadeira, etc.)
- ✅ Checklist adaptativo por tipo de máquina
- ✅ Adicionar fotos aos itens
- ✅ Gerar PDF automático
- ✅ Histórico completo
- ✅ Modo escuro/claro

### OSI - Ordem de Serviço Interna
- ✅ Login de usuários
- ✅ Criar novas ordens
- ✅ Tipos de manutenção (Preditiva, Preventiva, etc.)
- ✅ Gerar PDF (layout profissional)
- ✅ Gerar Excel
- ✅ Histórico completo
- ✅ Numeração automática

## 👤 Usuários Padrão

| Usuário | Senha | Nome |
|---------|-------|------|
| admin | admin123 | Administrador |
| mecanico | mecanico123 | João Silva |
| supervisor | supervisor123 | Maria Santos |

## 📖 Documentação

- **`CONFIGURACAO_RAPIDA.md`** - Configurar banco de dados (5 min)
- **`INSTALACAO.md`** - Guia completo de instalação
- **`SUPABASE_SETUP.md`** - Detalhes do banco de dados
- **`MUDANCAS_IMPLEMENTADAS.md`** - Changelog detalhado

## 🛠️ Comandos

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## 📦 Tecnologias

- React 18
- TypeScript
- Vite
- Supabase (banco de dados)
- jsPDF (geração de PDF)
- XLSX (geração de Excel)
- IndexedDB (armazenamento local)

## 🎨 Screenshots

### Tela Inicial
Seleção de operador, máquina e local para iniciar checklist.

### Checklist
Interface intuitiva para marcar itens como Confere, Não Confere ou N/A.

### OSI - Login
Login seguro para acessar painel de ordens de serviço.

### OSI - Nova Ordem
Formulário completo para criar ordens de serviço com todos os campos necessários.

### OSI - Histórico
Visualização de todas as ordens criadas com opção de gerar PDF/Excel novamente.

## 📱 Responsivo

O sistema é totalmente responsivo e funciona em:
- 📱 Celulares
- 📱 Tablets
- 💻 Desktops

## 🌙 Modo Escuro

Alterne entre modo claro e escuro no botão do cabeçalho.

## 🔒 Segurança

⚠️ **IMPORTANTE**: O sistema atual usa senhas em texto simples para desenvolvimento.

Para produção, você DEVE:
- Implementar hash de senhas (bcrypt/argon2)
- Usar HTTPS
- Configurar RLS no Supabase
- Implementar rate limiting
- Adicionar validação de entrada

## 📄 Licença

© 2025 Terraplanagem Guimarães - Todos os direitos reservados

## 🆘 Suporte

Problemas comuns estão documentados em `CONFIGURACAO_RAPIDA.md`

---

**Desenvolvido com ❤️ para Terraplanagem Guimarães**
