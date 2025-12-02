# 📄 Guia de Personalização de Documentos (PDF e Excel)

## 📍 Localização dos Arquivos

### Arquivo de Geração de PDF
```
📁 /workspace/src/services/serviceOrderPdf.ts
```
Este arquivo controla TODO o layout do PDF.

### Arquivo de Geração de Excel
```
📁 /workspace/src/services/serviceOrderExcel.ts
```
Este arquivo controla TODO o layout do Excel.

---

## 🎨 Estrutura do Documento (Baseado na Imagem)

### CABEÇALHO (Topo)
```
┌────────────────────────────────────────────────────────────┐
│ [LOGO] TERRAPLENAGEM GUIMARÃES SERRA LTDA  │ ORDEM DE      │
│        Endereço: Rod Celso Mello...        │ SERVIÇO       │
│        Dom Silverio - BH/MG...             │ INTERNA       │
│        CNPJ: 00.514.564/0001-42...         │   Nº 2200     │
└────────────────────────────────────────────────────────────┘
```

### DATA E HORA
```
┌──────────────────┬──────────────────┬──────────────────────┐
│ DATA: __/__/__   │                  │ HORA: __:__          │
└──────────────────┴──────────────────┴──────────────────────┘
```

### DADOS DO EQUIPAMENTO
```
┌────────────────────────────────────────────────────────────┐
│                  DADOS DO EQUIPAMENTO                       │
├──────────────────────────────┬─────────────────────────────┤
│ VEÍCULO: _______________     │ EQUIPAMENTO: ______________ │
├──────────────────────────────┼─────────────────────────────┤
│ KM INICIAL: ____________     │ TAG: ______________________ │
├──────────────────────────────┼─────────────────────────────┤
│ KM FINAL: ______________     │ HORÍMETRO: ________________ │
└──────────────────────────────┴─────────────────────────────┘
```

### TIPO DE MANUTENÇÃO
```
┌────────────────────────────────────────────────────────────┐
│                  TIPO DE MANUTENÇÃO                         │
├────────────────────────────────────────────────────────────┤
│ ☐ PREDITIVA    ☐ PREVENTIVA    ☐ CORRETIVA                │
│ ☐ AVARIA       ☐ OPORTUNIDADE  ☐ OUTROS                    │
└────────────────────────────────────────────────────────────┘
```

### DESCRIÇÃO DOS SERVIÇOS
```
┌────────────────────────────────────────────────────────────┐
│               DESCRIÇÃO DOS SERVIÇOS                        │
├────────────────────────────────────────────────────────────┤
│                                                             │
│ [Área grande para texto]                                    │
│                                                             │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

### PEÇAS APLICADAS
```
┌────────────────────────────────────────────────────────────┐
│                  PEÇAS APLICADAS                            │
├────────────────────────────────────────────────────────────┤
│                                                             │
│ [Área para listar peças]                                    │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

### OBSERVAÇÕES
```
┌────────────────────────────────────────────────────────────┐
│                    OBSERVAÇÕES                              │
├────────────────────────────────────────────────────────────┤
│                                                             │
│ [Área para observações]                                     │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

### ASSINATURAS
```
┌──────────────────────────────┬─────────────────────────────┐
│          MECÂNICO            │      RESPONSÁVEL OBRA        │
│                              │                              │
│ Nome: _________________      │ Nome: ______________________ │
│                              │                              │
│ _________________________    │ ____________________________ │
└──────────────────────────────┴─────────────────────────────┘
```

---

## 🛠️ Como Personalizar o PDF

### Abra o arquivo:
```bash
/workspace/src/services/serviceOrderPdf.ts
```

### Seções que você pode editar:

#### 1. CABEÇALHO (Linhas ~15-40)
```typescript
// Alterar texto da empresa
pdf.text('TERRAPLENAGEM GUIMARÃES SERRA LTDA', x, y);
pdf.text('Endereço: Rod Celso Mello Azevedo nº24 321', x, y);
// etc...

// Alterar tamanho do número da ordem
pdf.setFontSize(20); // Aumentar ou diminuir
```

#### 2. DATA E HORA (Linhas ~45-55)
```typescript
// Alterar largura das células
const dateWidth = contentWidth / 4; // Ajustar proporção
```

#### 3. DADOS DO EQUIPAMENTO (Linhas ~60-80)
```typescript
// Alterar altura das linhas
const fieldHeight = 8; // Aumentar para mais espaço
```

#### 4. CHECKBOXES (Linhas ~85-105)
```typescript
// Alterar tamanho dos checkboxes
const boxSize = 3.5; // Maior ou menor
```

#### 5. DESCRIÇÃO (Linhas ~110-125)
```typescript
// Alterar altura da área de descrição
const descHeight = 35; // Aumentar para mais espaço
```

#### 6. OBSERVAÇÕES (Linhas ~140-155)
```typescript
// Alterar altura da área de observações
const obsHeight = 30; // Ajustar conforme necessário
```

#### 7. ASSINATURAS (Linhas ~160-180)
```typescript
// Alterar altura das áreas de assinatura
const sigHeight = 25; // Ajustar espaço
```

---

## 🛠️ Como Personalizar o Excel

### Abra o arquivo:
```bash
/workspace/src/services/serviceOrderExcel.ts
```

### Estrutura Atual:
```typescript
const data = [
    ['TERRAPLENAGEM GUIMARÃES SERRA LTDA'],
    ['Endereço: Rod Celso Mello Azevedo nº24 321'],
    // ... cada linha é um array
];
```

### Para Deixar IDÊNTICO à Imagem:

Você precisa adicionar células vazias para criar o layout de tabela:

```typescript
const data = [
    // CABEÇALHO
    ['TERRAPLENAGEM...', '', '', 'ORDEM DE SERVIÇO INTERNA', `Nº ${order.order_number}`],
    ['Endereço...', '', '', '', ''],
    
    // DATA E HORA
    ['DATA:', order.date, '', 'HORA:', order.time],
    
    // DADOS DO EQUIPAMENTO (título centralizado)
    ['DADOS DO EQUIPAMENTO', '', '', '', ''],
    ['VEÍCULO:', order.vehicle, 'EQUIPAMENTO:', order.equipment, ''],
    ['KM INICIAL:', order.km_initial, 'TAG:', order.tag, ''],
    ['KM FINAL:', order.km_final, 'HORÍMETRO:', order.horimeter, ''],
    
    // TIPO DE MANUTENÇÃO
    ['TIPO DE MANUTENÇÃO', '', '', '', ''],
    [order.maintenance_type.join(', '), '', '', '', ''],
    
    // etc...
];
```

### Adicionar Bordas e Formatação:
```typescript
// Após criar a worksheet
const range = XLSX.utils.decode_range(ws['!ref']);

// Adicionar bordas a todas as células
for (let R = range.s.r; R <= range.e.r; ++R) {
  for (let C = range.s.c; C <= range.e.c; ++C) {
    const cell_address = XLSX.utils.encode_cell({ r: R, c: C });
    if (!ws[cell_address]) continue;
    
    ws[cell_address].s = {
      border: {
        top: { style: 'thin', color: { rgb: '000000' } },
        bottom: { style: 'thin', color: { rgb: '000000' } },
        left: { style: 'thin', color: { rgb: '000000' } },
        right: { style: 'thin', color: { rgb: '000000' } }
      }
    };
  }
}
```

---

## 🎯 Passo a Passo para Personalizar

### 1. Fazer Backup dos Arquivos Atuais
```bash
cp src/services/serviceOrderPdf.ts src/services/serviceOrderPdf.ts.backup
cp src/services/serviceOrderExcel.ts src/services/serviceOrderExcel.ts.backup
```

### 2. Editar o PDF
1. Abra `src/services/serviceOrderPdf.ts`
2. Localize cada seção pelo comentário (// CABEÇALHO, // DATA, etc)
3. Ajuste as medidas (width, height, x, y)
4. Ajuste os tamanhos de fonte (setFontSize)
5. Teste gerando um PDF

### 3. Editar o Excel
1. Abra `src/services/serviceOrderExcel.ts`
2. Modifique o array `data` para criar o layout de tabela
3. Adicione células vazias onde necessário
4. Configure larguras de coluna
5. Teste gerando um Excel

### 4. Testar
```bash
npm run build
npm run dev
```
- Faça login
- Crie uma ordem de serviço
- Gere PDF e Excel
- Compare com a imagem original

### 5. Iterar
Repita os passos 2-4 até ficar idêntico à imagem.

---

## 📐 Medidas de Referência

### Tamanhos de Fonte Recomendados:
- **Título principal**: 10-12pt (bold)
- **Subtítulos**: 10pt (bold)
- **Labels**: 9pt (bold)
- **Conteúdo**: 9pt (normal)
- **Número da ordem**: 18-20pt (bold)

### Alturas Recomendadas:
- **Linha de campo**: 7-8mm
- **Título de seção**: 7mm
- **Descrição de serviços**: 30-40mm
- **Peças aplicadas**: 20-25mm
- **Observações**: 25-35mm
- **Assinaturas**: 25-30mm

### Larguras:
- **Página A4**: 210mm (com margens de 10mm = 190mm úteis)
- **Metade da página**: 95mm (para campos lado a lado)

---

## 🔧 Variáveis Importantes para Ajustar

### No arquivo PDF:

```typescript
// MARGENS
const margin = 10; // Margem da página

// LARGURAS
const contentWidth = pageWidth - (margin * 2); // Largura útil
const halfWidth = contentWidth / 2; // Metade (para 2 colunas)

// ALTURAS
const headerHeight = 35; // Altura do cabeçalho
const sectionHeight = 7; // Altura de título de seção
const fieldHeight = 8; // Altura de campo
const descHeight = 35; // Altura de descrição
const obsHeight = 30; // Altura de observações
const sigHeight = 25; // Altura de assinaturas

// FONTES
pdf.setFontSize(10); // Tamanho padrão
pdf.setFont('helvetica', 'bold'); // Negrito
pdf.setFont('helvetica', 'normal'); // Normal
```

---

## 💡 Dicas para Ficar Idêntico

### 1. Compare Visualmente
- Imprima a imagem original
- Imprima o PDF gerado
- Compare lado a lado
- Ajuste as medidas

### 2. Use Régua
- Meça as alturas na imagem original
- Converta para milímetros
- Use essas medidas no código

### 3. Teste Incremental
- Ajuste UMA seção por vez
- Gere e teste
- Só passe para próxima quando estiver certo

### 4. Mantenha Proporções
- Se uma seção cresceu, outra pode precisar diminuir
- Total da página: ~280mm de altura

---

## 📞 Precisa de Ajuda Específica?

Se você quiser que EU faça as alterações para ficar EXATAMENTE igual:

1. **Me envie os detalhes**: "Quero que a descrição seja X mm de altura"
2. **Ou envie novo print**: Se tiver uma versão editada de como quer
3. **Ou lista de mudanças**: "Aumentar fonte do título, diminuir espaço de assinatura"

Posso editar os arquivos para você com as especificações exatas!

---

**Arquivos para Editar:**
- 📝 PDF: `/workspace/src/services/serviceOrderPdf.ts`
- 📊 Excel: `/workspace/src/services/serviceOrderExcel.ts`

**Após Editar:**
```bash
npm run build  # Recompilar
```

Depois é só testar no sistema! 🚀
