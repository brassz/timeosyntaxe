# 📄 Template OSI - Guia Visual de Edição

## 🎯 Onde Editar Cada Parte

### ARQUIVO PDF: `src/services/serviceOrderPdf.ts`

```typescript
export const generateServiceOrderPDF = async (order: ServiceOrder) => {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // ═══════════════════════════════════════════════════════════
  // SEÇÃO 1: CONFIGURAÇÕES GERAIS
  // ═══════════════════════════════════════════════════════════
  const pageWidth = pdf.internal.pageSize.getWidth();  // 210mm
  const margin = 10;                                   // 👈 AJUSTAR MARGENS
  const contentWidth = pageWidth - (margin * 2);       // 190mm útil
  let y = margin;

  // ═══════════════════════════════════════════════════════════
  // SEÇÃO 2: CABEÇALHO (Logo + Info + Número)
  // ═══════════════════════════════════════════════════════════
  const headerHeight = 35;  // 👈 AJUSTAR ALTURA DO CABEÇALHO
  
  // Borda externa
  pdf.setLineWidth(0.5);
  pdf.rect(margin, y, contentWidth, headerHeight);
  
  // Logo
  pdf.setFontSize(8);  // 👈 AJUSTAR TAMANHO
  pdf.setFont('helvetica', 'bold');
  pdf.text('[LOGO]', margin + 3, y + 15);
  
  // Nome da empresa
  const infoX = margin + 45;
  pdf.setFontSize(10);  // 👈 AJUSTAR TAMANHO DO NOME
  pdf.setFont('helvetica', 'bold');
  pdf.text('TERRAPLENAGEM GUIMARÃES SERRA LTDA', infoX, y + 10);
  
  // Endereço
  pdf.setFontSize(8);  // 👈 AJUSTAR TAMANHO DO ENDEREÇO
  pdf.setFont('helvetica', 'normal');
  pdf.text('Endereço: Rod Celso Mello Azevedo nº24 321', infoX, y + 16);
  pdf.text('Dom Silverio - BH/MG CEP: 31.985-203', infoX, y + 21);
  pdf.text('CNPJ: 00.514.564/0001-42 TELEFONE: 31.3495-9108', infoX, y + 26);
  
  // Box do número
  const numberBoxWidth = 45;  // 👈 AJUSTAR LARGURA DO BOX
  const numberBoxX = pageWidth - margin - numberBoxWidth;
  pdf.rect(numberBoxX, y, numberBoxWidth, headerHeight);
  
  pdf.setFontSize(8);
  pdf.text('ORDEM DE SERVIÇO INTERNA', numberBoxX + (numberBoxWidth / 2), y + 8, { align: 'center' });
  
  pdf.setFontSize(10);
  pdf.text('Nº', numberBoxX + (numberBoxWidth / 2), y + 16, { align: 'center' });
  
  pdf.setFontSize(20);  // 👈 AJUSTAR TAMANHO DO NÚMERO
  pdf.text(String(order.order_number), numberBoxX + (numberBoxWidth / 2), y + 28, { align: 'center' });
  
  y += headerHeight + 2;

  // ═══════════════════════════════════════════════════════════
  // SEÇÃO 3: DATA E HORA
  // ═══════════════════════════════════════════════════════════
  const dateTimeHeight = 8;  // 👈 AJUSTAR ALTURA
  pdf.setFontSize(9);        // 👈 AJUSTAR TAMANHO DA FONTE
  
  // Desenhar células
  pdf.rect(margin, y, contentWidth / 4, dateTimeHeight);
  pdf.text('DATA:', margin + 2, y + 5.5);
  
  pdf.rect(margin + (contentWidth / 4), y, contentWidth / 4, dateTimeHeight);
  pdf.text(order.date, margin + (contentWidth / 4) + 2, y + 5.5);
  
  pdf.rect(margin + (contentWidth / 2), y, contentWidth / 4, dateTimeHeight);
  pdf.text('HORA:', margin + (contentWidth / 2) + 2, y + 5.5);
  
  pdf.rect(margin + (contentWidth / 2) + (contentWidth / 4), y, contentWidth / 4, dateTimeHeight);
  pdf.text(order.time, margin + (contentWidth / 2) + (contentWidth / 4) + 2, y + 5.5);
  
  y += dateTimeHeight + 1;

  // ═══════════════════════════════════════════════════════════
  // SEÇÃO 4: DADOS DO EQUIPAMENTO
  // ═══════════════════════════════════════════════════════════
  const sectionHeight = 7;   // 👈 AJUSTAR ALTURA DO TÍTULO
  const fieldHeight = 8;     // 👈 AJUSTAR ALTURA DOS CAMPOS
  
  // Título
  pdf.setFontSize(10);       // 👈 AJUSTAR FONTE DO TÍTULO
  pdf.setFont('helvetica', 'bold');
  pdf.rect(margin, y, contentWidth, sectionHeight);
  pdf.text('DADOS DO EQUIPAMENTO', pageWidth / 2, y + 5, { align: 'center' });
  y += sectionHeight;
  
  // Campos (você pode adicionar mais linhas aqui)
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  
  // Linha 1: VEÍCULO e EQUIPAMENTO
  const halfWidth = contentWidth / 2;
  pdf.rect(margin, y, halfWidth, fieldHeight);
  pdf.text(`VEÍCULO: ${order.vehicle}`, margin + 2, y + 5.5);
  
  pdf.rect(margin + halfWidth, y, halfWidth, fieldHeight);
  pdf.text(`EQUIPAMENTO: ${order.equipment}`, margin + halfWidth + 2, y + 5.5);
  y += fieldHeight;
  
  // Linha 2: KM INICIAL e TAG
  pdf.rect(margin, y, halfWidth, fieldHeight);
  pdf.text(`KM INICIAL: ${order.km_initial}`, margin + 2, y + 5.5);
  
  pdf.rect(margin + halfWidth, y, halfWidth, fieldHeight);
  pdf.text(`TAG: ${order.tag}`, margin + halfWidth + 2, y + 5.5);
  y += fieldHeight;
  
  // Linha 3: KM FINAL e HORÍMETRO
  pdf.rect(margin, y, halfWidth, fieldHeight);
  pdf.text(`KM FINAL: ${order.km_final}`, margin + 2, y + 5.5);
  
  pdf.rect(margin + halfWidth, y, halfWidth, fieldHeight);
  pdf.text(`HORÍMETRO: ${order.horimeter}`, margin + halfWidth + 2, y + 5.5);
  y += fieldHeight + 1;

  // ═══════════════════════════════════════════════════════════
  // SEÇÃO 5: TIPO DE MANUTENÇÃO
  // ═══════════════════════════════════════════════════════════
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.rect(margin, y, contentWidth, sectionHeight);
  pdf.text('TIPO DE MANUTENÇÃO', pageWidth / 2, y + 5, { align: 'center' });
  y += sectionHeight;
  
  // Checkboxes
  const checkHeight = 7;     // 👈 AJUSTAR ALTURA DAS LINHAS
  const checkWidth = contentWidth / 3;
  const boxSize = 3.5;       // 👈 AJUSTAR TAMANHO DO CHECKBOX
  
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  
  // Linha 1
  ['PREDITIVA', 'PREVENTIVA', 'CORRETIVA'].forEach((type, i) => {
    const x = margin + (i * checkWidth);
    pdf.rect(x, y, checkWidth, checkHeight);
    
    // Checkbox
    const boxX = x + 3;
    const boxY = y + 1.5;
    pdf.rect(boxX, boxY, boxSize, boxSize);
    
    if (order.maintenance_type?.includes(type)) {
      pdf.setFont('helvetica', 'bold');
      pdf.text('X', boxX + 0.8, boxY + 2.8);
      pdf.setFont('helvetica', 'normal');
    }
    
    pdf.text(type, boxX + boxSize + 2, y + 5);
  });
  y += checkHeight;
  
  // Linha 2
  ['AVARIA', 'OPORTUNIDADE', 'OUTROS'].forEach((type, i) => {
    const x = margin + (i * checkWidth);
    pdf.rect(x, y, checkWidth, checkHeight);
    
    const boxX = x + 3;
    const boxY = y + 1.5;
    pdf.rect(boxX, boxY, boxSize, boxSize);
    
    if (order.maintenance_type?.includes(type)) {
      pdf.setFont('helvetica', 'bold');
      pdf.text('X', boxX + 0.8, boxY + 2.8);
      pdf.setFont('helvetica', 'normal');
    }
    
    pdf.text(type, boxX + boxSize + 2, y + 5);
  });
  y += checkHeight + 1;

  // ═══════════════════════════════════════════════════════════
  // SEÇÃO 6: DESCRIÇÃO DOS SERVIÇOS
  // ═══════════════════════════════════════════════════════════
  const descHeight = 35;     // 👈 AJUSTAR ALTURA DA ÁREA
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.rect(margin, y, contentWidth, sectionHeight);
  pdf.text('DESCRIÇÃO DOS SERVIÇOS', pageWidth / 2, y + 5, { align: 'center' });
  y += sectionHeight;
  
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.rect(margin, y, contentWidth, descHeight);
  
  if (order.service_description) {
    const lines = pdf.splitTextToSize(order.service_description, contentWidth - 4);
    pdf.text(lines, margin + 2, y + 4);
  }
  y += descHeight + 1;

  // ═══════════════════════════════════════════════════════════
  // SEÇÃO 7: PEÇAS APLICADAS
  // ═══════════════════════════════════════════════════════════
  const partsHeight = 20;    // 👈 AJUSTAR ALTURA DA ÁREA
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.rect(margin, y, contentWidth, sectionHeight);
  pdf.text('PEÇAS APLICADAS', pageWidth / 2, y + 5, { align: 'center' });
  y += sectionHeight;
  
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.rect(margin, y, contentWidth, partsHeight);
  
  if (order.parts_applied) {
    const lines = pdf.splitTextToSize(order.parts_applied, contentWidth - 4);
    pdf.text(lines, margin + 2, y + 4);
  }
  y += partsHeight + 1;

  // ═══════════════════════════════════════════════════════════
  // SEÇÃO 8: OBSERVAÇÕES
  // ═══════════════════════════════════════════════════════════
  const obsHeight = 30;      // 👈 AJUSTAR ALTURA DA ÁREA
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.rect(margin, y, contentWidth, sectionHeight);
  pdf.text('OBSERVAÇÕES', pageWidth / 2, y + 5, { align: 'center' });
  y += sectionHeight;
  
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.rect(margin, y, contentWidth, obsHeight);
  
  if (order.observations) {
    const lines = pdf.splitTextToSize(order.observations, contentWidth - 4);
    pdf.text(lines, margin + 2, y + 4);
  }
  y += obsHeight + 2;

  // ═══════════════════════════════════════════════════════════
  // SEÇÃO 9: ASSINATURAS
  // ═══════════════════════════════════════════════════════════
  const sigHeight = 25;      // 👈 AJUSTAR ALTURA DAS ASSINATURAS
  const sigWidth = (contentWidth / 2) - 1;
  
  // MECÂNICO (esquerda)
  pdf.rect(margin, y, sigWidth, sigHeight);
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'bold');
  pdf.text('MECÂNICO', margin + (sigWidth / 2), y + 5, { align: 'center' });
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  if (order.mechanic) {
    pdf.text(order.mechanic, margin + (sigWidth / 2), y + 12, { align: 'center' });
  }
  pdf.line(margin + 5, y + sigHeight - 5, margin + sigWidth - 5, y + sigHeight - 5);
  
  // RESPONSÁVEL OBRA (direita)
  pdf.rect(margin + halfWidth, y, sigWidth, sigHeight);
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'bold');
  pdf.text('RESPONSÁVEL OBRA', margin + halfWidth + (sigWidth / 2), y + 5, { align: 'center' });
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  if (order.responsible) {
    pdf.text(order.responsible, margin + halfWidth + (sigWidth / 2), y + 12, { align: 'center' });
  }
  pdf.line(margin + halfWidth + 5, y + sigHeight - 5, margin + halfWidth + sigWidth - 5, y + sigHeight - 5);

  // ═══════════════════════════════════════════════════════════
  // SALVAR PDF
  // ═══════════════════════════════════════════════════════════
  const filename = `OSI_${order.order_number}_${order.date.replace(/-/g, '')}.pdf`;
  pdf.save(filename);
};
```

---

## 🎯 Marcadores de Edição

Procure por estes comentários no código:

- `// 👈 AJUSTAR` - Indica onde você pode fazer mudanças
- `// ═══════` - Indica início de uma nova seção

---

## 📏 Valores Padrão Atuais

```typescript
// MARGENS E ESPAÇAMENTOS
margin = 10mm
contentWidth = 190mm (210 - 20 de margem)

// ALTURAS
headerHeight = 35mm
dateTimeHeight = 8mm
sectionHeight = 7mm (títulos)
fieldHeight = 8mm (campos)
checkHeight = 7mm (checkboxes)
descHeight = 35mm (descrição)
partsHeight = 20mm (peças)
obsHeight = 30mm (observações)
sigHeight = 25mm (assinaturas)

// FONTES
Título empresa: 10pt bold
Endereço: 8pt normal
Número OSI: 20pt bold
Títulos seção: 10pt bold
Labels: 9pt bold
Conteúdo: 9pt normal

// LARGURAS
numberBoxWidth = 45mm (box do número)
halfWidth = 95mm (metade da página)
checkWidth = 63.3mm (1/3 da página)

// CHECKBOX
boxSize = 3.5mm
```

---

## 🔄 Mudanças Rápidas Comuns

### Aumentar Espaço para Descrição:
```typescript
const descHeight = 50;  // Era 35, agora 50
```

### Diminuir Cabeçalho:
```typescript
const headerHeight = 30;  // Era 35, agora 30
```

### Aumentar Número da Ordem:
```typescript
pdf.setFontSize(24);  // Era 20, agora 24
```

### Mudar Fonte de TODO o Documento:
```typescript
// No início, após criar o PDF:
pdf.setFont('times'); // Ou 'courier', 'helvetica'
```

---

## 💾 Salvar e Testar

Após editar:

```bash
cd /workspace
npm run build
npm run dev
```

Depois teste criando uma ordem de serviço no sistema!

---

**Arquivo completo está em:**
`/workspace/src/services/serviceOrderPdf.ts`

**Todas as seções estão comentadas com:**
`// ═══════════ SEÇÃO X: NOME ═══════════`

Fácil de encontrar e editar! 🎯
