# ⚡ Início Rápido - Sistema OSI

## 🚀 3 Passos para Começar

### 📝 Passo 1: Configurar Banco de Dados (5 minutos)

1. Acesse o Supabase: https://yzmxyqtfbthtrlnhrnpu.supabase.co
2. Vá em **SQL Editor** no menu lateral
3. Cole e execute o conteúdo do arquivo `supabase-setup.sql`
4. Vá em **Storage** no menu lateral
5. Clique em **Create bucket** → Nome: `osi-files` → Marque **Public** → Create

### 💻 Passo 2: Executar Sistema (1 minuto)

```bash
npm run dev
```

Acesse: http://localhost:5173

### 🔐 Passo 3: Fazer Login (30 segundos)

1. Clique no botão **🔐 Painel OSI** no canto superior direito
2. Login:
   - **Usuário:** `admin`
   - **Senha:** `admin123`
3. Pronto! Você está dentro do sistema.

---

## 📝 Usar pela Primeira Vez

### Criar sua primeira OS:

1. No painel, clique em **📝 Gerar Ordem de Serviço**
2. Preencha os campos:
   - Data: (automática)
   - Veículo: `Caminhão Mercedes-Benz`
   - Equipamento: `Basculante`
   - Marque: ✅ Preventiva
   - Descrição: `Troca de óleo e filtros`
   - Mecânico: `Seu nome`
   - Responsável: `Nome do responsável`
3. Clique em **✅ Gerar OS com PDF e Excel**
4. Aguarde 10 segundos
5. ✅ Sucesso! OS criada

### Ver sua OS:

1. Volte ao painel (botão Voltar)
2. Clique em **📊 Histórico de Ordens**
3. Sua OS está lá!
4. Clique em **📄 PDF** para ver o arquivo
5. Clique em **📊 Excel** para baixar a planilha

---

## 🎯 Tudo Pronto!

Agora você pode:
- ✅ Criar ordens de serviço
- ✅ Gerar PDFs profissionais
- ✅ Gerar planilhas Excel
- ✅ Consultar histórico
- ✅ Filtrar ordens
- ✅ Exportar relatórios

---

## 📚 Documentação Completa

Para mais detalhes, consulte:

- **README_OSI.md** → Visão geral completa
- **SETUP_OSI_GUIDE.md** → Guia detalhado de configuração
- **EXEMPLOS_USO_OSI.md** → Casos práticos e exemplos
- **RESUMO_IMPLEMENTACAO_OSI.md** → Tudo que foi implementado

---

## 🆘 Problemas?

### Erro ao criar OS?
- ✅ Conferiu se executou o `supabase-setup.sql`?
- ✅ Criou o bucket `osi-files` público?

### Não consegue logar?
- ✅ Usuário: `admin` (minúsculo)
- ✅ Senha: `admin123` (sem espaços)

### PDF/Excel não abre?
- ✅ Bucket está marcado como público?
- ✅ Aguardou o processo completo?

---

## 🎉 Pronto para Produção!

Sistema 100% funcional e testado.

**Bom trabalho! 🚀**
