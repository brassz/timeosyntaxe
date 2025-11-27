# 📋 Manual de Uso - Terraplanagem Guimarães

## 🚀 Como Iniciar

### 1. Instalação e Execução

```bash
# Instalar dependências (primeira vez)
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build
```

Após executar `npm run dev`, abra seu navegador em `http://localhost:5173`

---

## 📱 Como Usar o Sistema

### **Tela Inicial**

1. Digite o **nome do operador**
2. Selecione a **máquina** no menu dropdown
3. Informe o **local da operação**
4. Clique em **"🚜 Iniciar Checklist"**

> 💡 **Dica:** Se houver um checklist em andamento, você será avisado que ele será substituído.

---

### **Tela de Checklist**

#### Informações Obrigatórias
- **Horímetro:** Informe a leitura do horímetro da máquina
- **Quilometragem:** Opcional (apenas para máquinas aplicáveis)

#### Para Cada Item do Checklist:

1. **Escolha o Status:**
   - ✓ **C** - Confere (item OK)
   - ✗ **N.C** - Não Confere (item com problema)
   - − **N.A** - Não se Aplica (item não aplicável)

2. **Adicione Observações:**
   - Use o campo de texto para descrever problemas ou detalhes
   - Exemplo: "Vazamento pequeno no cilindro esquerdo"

3. **Envie Fotos:**
   - Clique em **"📷 Adicionar Fotos"**
   - Selecione uma ou múltiplas fotos
   - Pré-visualize as fotos enviadas
   - Remova fotos indesejadas clicando no 🗑️

4. **Navegação:**
   - Use os botões **"← Anterior"** e **"Próximo →"**
   - Ou clique diretamente nos números dos itens na parte inferior
   - Itens respondidos aparecem com cor do status (verde, vermelho, cinza)

#### Barra de Progresso
- Mostra quantos % do checklist foi completado
- Atualiza automaticamente conforme você responde os itens

---

### **Finalizando o Checklist**

1. Responda todos os itens (ou os mais importantes)
2. Clique em **"✓ Finalizar e Gerar PDF"**
3. Se houver itens não respondidos, você será avisado
4. O sistema irá:
   - Salvar o checklist completo
   - Gerar um PDF profissional
   - Baixar o PDF automaticamente
   - Retornar à tela inicial

---

### **Histórico de Checklists**

Na tela inicial, clique em **"📋 Ver Histórico de Checklists"**

#### Funcionalidades:
- **Ver Detalhes:** Clique em qualquer checklist para expandir
- **Gerar PDF Novamente:** Clique em "📄 Gerar PDF"
- **Excluir:** Clique em "🗑️ Excluir" para remover do histórico

> ⚠️ **Atenção:** Os dados são salvos apenas no dispositivo atual. Se limpar o cache do navegador, os dados serão perdidos.

---

## 🎨 Modo Escuro

No cabeçalho, use o botão de alternância:
- ☀️ **Modo Claro** (padrão)
- 🌙 **Modo Escuro** (economiza bateria em telas OLED)

A preferência é salva automaticamente.

---

## 📄 Sobre o PDF Gerado

O PDF incluirá:
- **Cabeçalho:** Logo e nome Terraplanagem Guimarães
- **Informações:** Data, hora, operador, máquina, local, horímetro
- **Tabela Completa:** Todos os itens com status e observações
- **Fotos:** Imagens organizadas por item
- **Rodapé:** Numeração de páginas e data de geração

Nome do arquivo: `Checklist_[Máquina]_[Data].pdf`

---

## 💾 Armazenamento de Dados

### O que é salvo:
- **localStorage:** Dados do checklist (rascunhos e finalizados)
- **IndexedDB:** Fotos (armazenamento eficiente)
- **Preferências:** Modo escuro

### Limpeza:
- **Descartar:** Remove apenas o rascunho atual
- **Excluir do Histórico:** Remove checklist específico
- **Cache do Navegador:** Remove TODOS os dados

---

## 📋 Lista de Itens do Checklist

1. Nível de óleo
2. Nível de água
3. Vazamentos visíveis
4. Pneus / Rodas / Esteiras
5. Freio
6. Direção
7. Buzina
8. Luzes
9. Itens de segurança
10. Painel de alerta
11. Documentação
12. Cabine em geral
13. Motor
14. Sistema hidráulico
15. Braços / Caçamba / Lâmina
16. Filtros
17. Extintor
18. Condições externas gerais

---

## 🛠️ Dicas de Uso

### Em Campo
- Use tablets ou celulares com boa câmera
- Tire fotos claras e bem iluminadas
- Adicione observações detalhadas para itens N.C
- Não feche o navegador com checklist em andamento

### Gerenciamento
- Salve os PDFs em nuvem (Google Drive, Dropbox, etc.)
- Faça backup regular do histórico
- Revise checklists antigos para manutenção preventiva

### Performance
- Evite adicionar muitas fotos de alta resolução por item
- Exporte PDFs regularmente e limpe o histórico
- Use conexão estável ao fazer upload de fotos grandes

---

## ❓ Solução de Problemas

### Fotos não aparecem no PDF
- Verifique se as fotos foram carregadas corretamente
- Aguarde o carregamento completo antes de gerar PDF
- Tente fotos menores se o PDF falhar

### Checklist travou
- Recarregue a página (dados são salvos automaticamente)
- Seus dados estarão em rascunho

### PDF não baixa
- Verifique se o navegador permite downloads
- Tente novamente em outra aba
- Use o histórico para regerar o PDF

### Dados perdidos
- Verifique se não limpou o cache do navegador
- Os dados são locais e não podem ser recuperados

---

## 🔒 Privacidade

- ✅ **SEM LOGIN** - Acesso direto
- ✅ **SEM SERVIDOR** - Tudo local no dispositivo
- ✅ **SEM INTERNET** - Funciona offline (após primeiro carregamento)
- ✅ **SEUS DADOS** - Você controla tudo

---

## 📞 Suporte

Para dúvidas ou problemas, entre em contato com:
**Terraplanagem Guimarães**

---

**Versão:** 1.0.0  
**Última Atualização:** Novembro 2025
