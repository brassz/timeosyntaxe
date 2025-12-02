# ⚡ Edição Rápida - PDF e Excel IDÊNTICOS

## 📍 ONDE ESTÃO OS ARQUIVOS

```
PDF:   /workspace/src/services/serviceOrderPdf.ts
Excel: /workspace/src/services/serviceOrderExcel.ts
```

---

## 🎯 MUDANÇAS MAIS COMUNS

### 1️⃣ MUDAR INFORMAÇÕES DA EMPRESA

**📄 PDF** (linha ~23-31):
```typescript
pdf.text('TERRAPLENAGEM GUIMARÃES SERRA LTDA', 40, 18);
pdf.text('Endereço: Rod Celso Mello Azevedo nº24 321', 40, 23);
pdf.text('Dom Silverio - BH/MG CEP: 31.985-203', 40, 27);
pdf.text('CNPJ: 00.514.564/0001-42 TELEFONE: 31.3495-9108', 40, 31);
```

**📊 Excel** (linha ~18-27):
```typescript
['[LOGO]', 'TERRAPLENAGEM GUIMARÃES SERRA LTDA', '', '', 'ORDEM DE SERVIÇO INTERNA'],
['', 'Endereço: Rod Celso Mello Azevedo nº24 321', '', '', `Nº ${order.order_number}`],
['', 'Dom Silverio - BH/MG CEP: 31.985-203', '', '', ''],
['', 'CNPJ: 00.514.564/0001-42 TELEFONE: 31.3495-9108', '', '', ''],
```

---

### 2️⃣ ADICIONAR LOGOTIPO REAL

**📄 PDF** (linha ~18-20):
```typescript
// Substituir isto:
pdf.text('[LOGO]', 15, 20);

// Por isto (se tiver logo em base64):
const logoImg = 'data:image/png;base64,iVBORw0KGgoAAAANS...';
pdf.addImage(logoImg, 'PNG', 15, 12, 25, 25);
```

**📊 Excel** (linha ~18):
```typescript
// Substituir:
['[LOGO]', 'TERRAPLENAGEM GUIMARÃES SERRA LTDA', ...

// Por:
['', 'TERRAPLENAGEM GUIMARÃES SERRA LTDA', ...
// E adicionar imagem com biblioteca xlsx-populate
```

---

### 3️⃣ AUMENTAR TAMANHO DO NÚMERO DA ORDEM

**📄 PDF** (linha ~40-42):
```typescript
pdf.setFontSize(16);  // 👈 MUDE ESTE NÚMERO (ex: 20, 24, 28)
pdf.setFont('helvetica', 'bold');
pdf.text(String(order.order_number || '---'), pageWidth - 30, 40, { align: 'center' });
```

**📊 Excel** (linha ~153-156):
```typescript
// No estilo da célula do número:
if (C === 4 && R === 1) {
  ws[cell_address].s = {
    ...boldCenter,
    font: { bold: true, sz: 20 }  // 👈 MUDE sz: 20 para maior
  };
}
```

---

### 4️⃣ MUDAR ALTURA DAS ÁREAS DE TEXTO

**📄 PDF**:
```typescript
// Descrição (linha ~118)
const descHeight = Math.max(descLines.length * 5, 30);  // 👈 30 = altura mínima

// Peças (linha ~133)
const partsHeight = Math.max(partsLines.length * 5, 20);  // 👈 20 = altura mínima

// Observações (linha ~148)
const obsHeight = Math.max(obsLines.length * 5, 25);  // 👈 25 = altura mínima
```

**📊 Excel** (linha ~111-127):
```typescript
ws['!rows'] = [];
for (let i = 0; i < data.length; i++) {
  // ...
  else if (i >= 17 && i <= 20) {
    ws['!rows'][i] = { hpt: 30 };  // 👈 Altura da descrição
  } else if (i >= 23 && i <= 25) {
    ws['!rows'][i] = { hpt: 25 };  // 👈 Altura das peças
  } else if (i >= 28 && i <= 30) {
    ws['!rows'][i] = { hpt: 25 };  // 👈 Altura das observações
  }
```

---

### 5️⃣ MUDAR TAMANHOS DE FONTE

**📄 PDF**:
```typescript
// Nome da empresa (linha ~23)
pdf.setFontSize(10);  // 👈 AUMENTAR/DIMINUIR

// Endereço (linha ~28)
pdf.setFontSize(8);   // 👈 AUMENTAR/DIMINUIR

// Títulos de seção (linha ~57, 85, 111, etc)
pdf.setFontSize(10);  // 👈 AUMENTAR/DIMINUIR

// Conteúdo normal (linha ~63, 116, etc)
pdf.setFontSize(9);   // 👈 AUMENTAR/DIMINUIR
```

**📊 Excel** (linha ~147-151):
```typescript
const bold = {
  font: { bold: true, sz: 11 },  // 👈 ADICIONE sz: TAMANHO
  border: borderStyle,
};
```

---

### 6️⃣ ADICIONAR MAIS CAMPOS NO FORMULÁRIO

**Exemplo: Adicionar campo "OPERADOR"**

**📄 PDF** (após linha ~80):
```typescript
// Adicione uma nova linha:
pdf.rect(10, yPos, pageWidth - 20, 8);
pdf.text(`OPERADOR: ${order.operador || ''}`, 15, yPos + 5);
yPos += 8;
```

**📊 Excel** (linha ~43):
```typescript
// Adicione linha no array data:
['KM FINAL:', order.km_final, 'HORÍMETRO:', order.horimeter, ''],
['OPERADOR:', order.operador || '', '', '', ''],  // 👈 NOVA LINHA
```

**TypeScript** (`/workspace/src/types/index.ts`):
```typescript
export interface ServiceOrder {
  // ... campos existentes ...
  operador?: string;  // 👈 ADICIONAR
}
```

**Formulário** (`/workspace/src/components/ServiceOrderForm.tsx`):
```typescript
// Adicionar no estado:
const [operador, setOperador] = useState('');

// Adicionar input no JSX:
<input
  type="text"
  value={operador}
  onChange={(e) => setOperador(e.target.value)}
  placeholder="Nome do operador"
/>

// Adicionar ao objeto order:
const order: ServiceOrder = {
  // ... campos existentes ...
  operador,
};
```

---

### 7️⃣ MUDAR CORES

**📊 Excel** (linha ~135-140):
```typescript
const borderStyle = {
  top: { style: 'thin', color: { rgb: '000000' } },  // 👈 Preto
  bottom: { style: 'thin', color: { rgb: '000000' } },
  left: { style: 'thin', color: { rgb: '000000' } },
  right: { style: 'thin', color: { rgb: '000000' } },
};

// Para mudar para azul:
color: { rgb: '0000FF' }

// Para mudar para vermelho:
color: { rgb: 'FF0000' }
```

---

### 8️⃣ ADICIONAR FUNDO COLORIDO NOS TÍTULOS

**📊 Excel** (linha ~187-191):
```typescript
// Títulos de seção (centralizados e negrito)
else if (R === 7 || R === 12 || R === 16 || R === 22 || R === 27) {
  ws[cell_address].s = {
    ...boldCenter,
    fill: { fgColor: { rgb: 'D3D3D3' } }  // 👈 ADICIONAR COR DE FUNDO (cinza claro)
  };
}
```

---

## 🔧 COMO TESTAR SUAS MUDANÇAS

### 1. Edite o arquivo
```bash
# Abra com seu editor preferido
nano /workspace/src/services/serviceOrderPdf.ts
# ou
nano /workspace/src/services/serviceOrderExcel.ts
```

### 2. Recompile o projeto
```bash
cd /workspace
npm run build
```

### 3. Inicie o servidor
```bash
npm run dev
```

### 4. Teste no navegador
1. Faça login no sistema
2. Vá para "Painel OSI"
3. Clique em "Gerar Ordem"
4. Preencha o formulário
5. Clique em "Gerar PDF" ou "Gerar Excel"
6. Verifique o arquivo baixado

---

## 📋 CHECKLIST DE VERIFICAÇÃO

Antes de considerar "idêntico", verifique:

- [ ] Logo no lugar correto
- [ ] Informações da empresa corretas
- [ ] Número da ordem visível e grande
- [ ] Data e hora no formato certo
- [ ] Todos os campos do equipamento presentes
- [ ] Checkboxes de manutenção funcionando
- [ ] Áreas de texto com tamanho adequado
- [ ] Assinaturas no rodapé
- [ ] Bordas em todas as células
- [ ] Alinhamento correto
- [ ] Tamanhos de fonte consistentes
- [ ] PDF e Excel visualmente idênticos

---

## 💡 DICAS PRO

### Copiar Exatamente uma Medida do Print

1. Abra o print original em um editor de imagens
2. Use a ferramenta régua para medir em pixels
3. Converta para mm (1 pixel ≈ 0.264 mm)
4. Use o valor no código

### Comparar Visualmente

```bash
# Gere PDF e Excel
# Converta ambos para imagem:
convert -density 300 arquivo.pdf arquivo.png
# Compare lado a lado com o print original
```

### Backup Antes de Editar

```bash
cp src/services/serviceOrderPdf.ts src/services/serviceOrderPdf.ts.BACKUP
cp src/services/serviceOrderExcel.ts src/services/serviceOrderExcel.ts.BACKUP
```

### Restaurar Backup

```bash
cp src/services/serviceOrderPdf.ts.BACKUP src/services/serviceOrderPdf.ts
cp src/services/serviceOrderExcel.ts.BACKUP src/services/serviceOrderExcel.ts
```

---

## 🆘 PRECISA DE AJUDA?

Se quiser que eu faça as alterações específicas para você, me diga:

**Formato da Solicitação:**
```
1. [SEÇÃO]: Aumentar altura de X para Y
2. [FONTE]: Mudar tamanho do título de X para Y
3. [NOVO CAMPO]: Adicionar campo "NOME DO CAMPO" após "CAMPO EXISTENTE"
4. [LOGOTIPO]: Adicionar logo (forneça o arquivo ou URL)
```

**Exemplo:**
```
1. DESCRIÇÃO: Aumentar altura de 30mm para 50mm
2. TÍTULO: Aumentar fonte dos títulos de 10 para 12
3. NOVO CAMPO: Adicionar "OPERADOR" após "TAG"
4. COR: Colocar fundo cinza nos títulos
```

Posso fazer essas mudanças imediatamente! 🚀

---

**Arquivos Principais:**
- 📄 PDF: `/workspace/src/services/serviceOrderPdf.ts` (177 linhas)
- 📊 Excel: `/workspace/src/services/serviceOrderExcel.ts` (224 linhas)
- 🔧 Tipos: `/workspace/src/types/index.ts`
- 📝 Formulário: `/workspace/src/components/ServiceOrderForm.tsx`

**Após qualquer edição:**
```bash
npm run build
```
