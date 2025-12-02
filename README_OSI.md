# Sistema OSI - Ordem de Serviço Interno

## 📋 Visão Geral

O Sistema OSI (Ordem de Serviço Interno) é uma nova funcionalidade adicionada ao sistema de checklist da Terraplanagem Guimarães. Permite a criação, gerenciamento e exportação de ordens de serviço interno de forma digital.

## 🔐 Acesso ao Sistema

### Login
1. Clique no botão **"🔐 Login"** no canto superior direito
2. Digite suas credenciais de acesso
3. Clique em **"Entrar"**
4. Você será redirecionado para o Painel OSI

### Primeira Configuração
Para criar o primeiro usuário administrativo, execute o SQL no Supabase:

```sql
-- Ver arquivo SETUP_SUPABASE.md para instruções completas
```

## 🎯 Funcionalidades

### 1. Painel OSI
- Interface limpa e intuitiva
- Botão destacado "Gerar Ordem"
- Acesso rápido a funcionalidades administrativas
- Botão de Logout

### 2. Criação de Ordem de Serviço

#### Cabeçalho Automático
- Logo da empresa
- Informações da empresa (endereço, CNPJ, telefone)
- Número da ordem (gerado automaticamente)

#### Campos do Formulário

**Data e Hora**
- Data: Preenchida automaticamente com data atual
- Hora: Preenchida automaticamente com hora atual
- Ambos editáveis conforme necessário

**Dados do Equipamento**
- Veículo: Tipo de equipamento (ex: Escavadeira, Motoniveladora)
- Equipamento: Descrição adicional
- KM Inicial: Quilometragem inicial
- KM Final: Quilometragem final
- TAG: Identificação do equipamento
- Horímetro: Leitura do horímetro

**Tipo de Manutenção**
Selecione um ou mais tipos:
- ☐ PREDITIVA
- ☐ PREVENTIVA
- ☐ CORRETIVA
- ☐ AVARIA
- ☐ OPORTUNIDADE
- ☐ OUTROS

**Descrição dos Serviços**
- Campo de texto expandível
- Descreva detalhadamente os serviços realizados

**Peças Aplicadas**
- Liste todas as peças utilizadas
- Inclua códigos e quantidades se necessário

**Observações**
- Informações adicionais relevantes
- Pendências ou recomendações

**Assinaturas**
- Nome do Mecânico
- Nome do Responsável pela Obra

### 3. Exportação

Após preencher a ordem, você pode exportá-la em dois formatos:

#### 📄 PDF
- Clique em **"📄 Gerar PDF"**
- Arquivo é gerado e baixado automaticamente
- Layout profissional mantendo formatação do documento original
- Nome do arquivo: `OSI_2200_20251202.pdf`

#### 📊 Excel
- Clique em **"📊 Gerar Excel"**
- Planilha formatada com todos os dados
- Fácil de editar, compartilhar e integrar com outros sistemas
- Nome do arquivo: `OSI_2200_20251202.xlsx`

## 📝 Fluxo de Trabalho Recomendado

### Criar Nova Ordem
1. Acesse o Painel OSI
2. Clique em "Gerar Ordem"
3. Preencha os campos obrigatórios (marcados)
4. Complete as informações do equipamento
5. Selecione o tipo de manutenção
6. Descreva os serviços realizados
7. Liste as peças aplicadas
8. Adicione observações se necessário
9. Preencha os nomes para assinatura
10. Clique em "Gerar PDF" ou "Gerar Excel"

### Numeração de Ordens
- A primeira ordem será número **2200**
- Cada nova ordem incrementa automaticamente
- Numeração é sequencial e única
- Armazenada no banco de dados

### Armazenamento
- Todas as ordens são salvas automaticamente no banco de dados Supabase
- Histórico completo disponível
- Dados seguros e backupeados

## 🎨 Layout da Ordem

O layout digital é idêntico ao documento físico, incluindo:

```
┌─────────────────────────────────────────────────────────┐
│  [LOGO]  TERRAPLENAGEM GUIMARÃES SERRA LTDA   │ ORDEM DE│
│          Endereço completo                     │ SERVIÇO │
│          CNPJ e Telefone                       │ INTERNA │
│                                                │  Nº 2200│
├─────────────────────────────────────────────────────────┤
│  DATA: __/__/__        HORA: __:__                     │
├─────────────────────────────────────────────────────────┤
│  DADOS DO EQUIPAMENTO                                   │
│  VEÍCULO: ____________  EQUIPAMENTO: ____________      │
│  KM INICIAL: _______   TAG: __________                 │
│  KM FINAL: _________   HORÍMETRO: ____                 │
├─────────────────────────────────────────────────────────┤
│  TIPO DE MANUTENÇÃO                                     │
│  ☐ PREDITIVA  ☐ PREVENTIVA  ☐ CORRETIVA               │
│  ☐ AVARIA     ☐ OPORTUNIDADE ☐ OUTROS                 │
├─────────────────────────────────────────────────────────┤
│  DESCRIÇÃO DOS SERVIÇOS                                 │
│  [Campo de texto expansível]                            │
├─────────────────────────────────────────────────────────┤
│  PEÇAS APLICADAS                                        │
│  [Campo de texto]                                       │
├─────────────────────────────────────────────────────────┤
│  OBSERVAÇÕES                                            │
│  [Campo de texto]                                       │
├─────────────────────────────────────────────────────────┤
│  MECÂNICO              │  RESPONSÁVEL OBRA              │
│  ___________________   │  ___________________           │
└─────────────────────────────────────────────────────────┘
```

## 🔧 Configuração Técnica

### Requisitos
- Supabase configurado (ver SETUP_SUPABASE.md)
- Tabelas criadas no banco de dados
- Usuário administrativo criado
- Autenticação habilitada

### Tecnologias Utilizadas
- **Supabase**: Banco de dados e autenticação
- **jsPDF**: Geração de PDF
- **xlsx**: Geração de Excel
- **React**: Interface do usuário
- **TypeScript**: Type safety

## 🐛 Solução de Problemas

### Não consigo fazer login
- Verifique se o usuário foi criado no Supabase
- Confirme email e senha
- Verifique se a autenticação está habilitada no Supabase

### Número da ordem não aparece
- Verifique se a sequência foi criada no banco de dados
- Execute: `SELECT nextval('service_order_number_seq');`

### PDF não é gerado
- Verifique console do navegador para erros
- Confirme que todos os campos obrigatórios estão preenchidos
- Tente limpar cache do navegador

### Excel não abre corretamente
- Certifique-se de usar Microsoft Excel ou LibreOffice Calc
- Verifique se o arquivo não está corrompido
- Tente abrir com Google Sheets

## 📞 Suporte

Para dúvidas ou problemas:
1. Consulte a documentação completa em SETUP_SUPABASE.md
2. Verifique o CHANGELOG_NEW_FEATURES.md
3. Entre em contato com o suporte técnico

## 🚀 Próximas Funcionalidades

Planejadas para versões futuras:
- Histórico de ordens de serviço
- Busca e filtros avançados
- Edição de ordens existentes
- Relatórios e estatísticas
- Notificações automáticas
- Impressão direta

---

**Versão do Sistema:** 2.0.0  
**Última Atualização:** Dezembro 2025  
**Empresa:** Terraplanagem Guimarães Serra LTDA
