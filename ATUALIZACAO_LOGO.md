# 🎨 Logo Adicionada ao PDF e Excel

## ✅ Implementado

A logo da empresa **Terraplanagem Guimarães** agora aparece nos documentos gerados!

### 📄 PDF da Ordem de Serviço (OSI)
- ✅ Logo posicionada no canto superior esquerdo (20x20mm)
- ✅ Carregada dinamicamente de `/public/logo.png`
- ✅ Layout profissional com logo + informações da empresa
- ✅ Fallback para círculo laranja se a logo não carregar

### 📊 Excel da Ordem de Serviço (OSI)
- ✅ Emoji 🏗️ no cabeçalho representando construção
- ✅ Nome da empresa em destaque
- ✅ Informações completas da empresa

**Nota sobre Excel:** A biblioteca XLSX básica não suporta facilmente a inserção de imagens. Para adicionar a logo real no Excel, seria necessário usar bibliotecas mais avançadas como `exceljs` ou `xlsx-populate`, que são mais pesadas.

## 🎨 A Logo

A logo da Terraplanagem Guimarães apresenta:
- Escavadeira em destaque
- Planeta Terra ao fundo
- Cores vermelhas características da marca
- Design profissional e impactante

## 📝 Arquivos Modificados

- `src/services/osiPdf.ts` - Adicionada função para carregar e inserir logo
- `src/services/osiExcel.ts` - Adicionado emoji representativo no cabeçalho
- `src/components/OSI.tsx` - Funções de Excel atualizadas para async

## 🚀 Como Funciona

### PDF
1. Quando você clica em "Gerar PDF", o sistema:
   - Carrega a logo de `/public/logo.png`
   - Converte para base64
   - Insere no PDF (20x20mm no canto superior esquerdo)
   - Mantém o layout profissional com informações da empresa

2. Se a logo não carregar:
   - Aparece um círculo laranja como fallback
   - O PDF é gerado normalmente

### Excel
1. Cabeçalho com emoji 🏗️
2. Nome completo da empresa
3. Endereço e dados de contato
4. Layout limpo e profissional

## 🎯 Resultado

Os PDFs e Excel agora têm identidade visual da empresa, tornando os documentos mais profissionais e oficiais!

### Exemplo do Layout do PDF:

```
┌─────────────────────────────────────────────────────────────┐
│  [LOGO]  TERRAPLANAGEM GUIMARÃES SERRA LTDA                 │
│           Endereço: Rod Celso Mello Azevedo nº24 321        │
│           Dom Silverio - BH/MG  CEP: 31.985-203             │
│           CNPJ: 00.514.564/0001-42 TEL: 31.3495-9108        │
│                                                              │
│                                    ORDEM DE SERVIÇO INTERNA │
│                                                   Nº 2200   │
└─────────────────────────────────────────────────────────────┘
```

## 💡 Melhorias Futuras (Opcional)

Para adicionar a logo real no Excel:
1. Instalar biblioteca avançada:
   ```bash
   npm install exceljs
   ```

2. Usar `exceljs` ao invés de `xlsx`:
   ```typescript
   import ExcelJS from 'exceljs';
   const workbook = new ExcelJS.Workbook();
   const imageId = workbook.addImage({
     base64: logoBase64,
     extension: 'png',
   });
   worksheet.addImage(imageId, 'A1:B4');
   ```

Mas isso aumentaria o tamanho do bundle em ~300KB.

## ✅ Teste Agora!

1. Faça login no sistema (admin/admin123)
2. Crie uma nova ordem de serviço
3. Clique em "📄 Salvar e Gerar PDF"
4. Veja a logo no PDF gerado! 🎉
