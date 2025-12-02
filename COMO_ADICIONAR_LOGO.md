# 🖼️ Como Adicionar e Personalizar o Logo

## ✅ Status Atual

**Logo no PDF: CONFIGURADO ✅**
- O sistema agora carrega automaticamente o arquivo `/public/logo.png`
- Se o logo não carregar, mostra um placeholder de texto

**Logo no Excel: ESPAÇO RESERVADO ✅**
- Célula A1 reservada para o logo (atualmente vazia)
- Nota: A biblioteca `xlsx` não suporta imagens facilmente

---

## 📄 PDF - Logo já está configurado!

### Como funciona:

O arquivo `serviceOrderPdf.ts` agora:
1. Tenta carregar `/public/logo.png`
2. Converte para base64
3. Adiciona no PDF na posição correta
4. Se falhar, mostra `[LOGO]` como fallback

### Código atual:

```typescript
// Logo - Tentar carregar do arquivo, se falhar usa placeholder
try {
  const logoBase64 = await loadImageAsBase64('/logo.png');
  pdf.addImage(logoBase64, 'PNG', 12, 12, 25, 25);
  //                              ↑   ↑   ↑   ↑
  //                              X   Y   W   H (em mm)
} catch (error) {
  pdf.setFontSize(8);
  pdf.text('[LOGO]', 15, 20);
}
```

### Personalizar posição e tamanho:

```typescript
pdf.addImage(logoBase64, 'PNG', X, Y, WIDTH, HEIGHT);
```

**Valores atuais:**
- `X = 12mm` (distância da esquerda)
- `Y = 12mm` (distância do topo)
- `WIDTH = 25mm` (largura)
- `HEIGHT = 25mm` (altura)

**Exemplo - Logo maior:**
```typescript
pdf.addImage(logoBase64, 'PNG', 12, 10, 30, 30);
```

**Exemplo - Logo à direita:**
```typescript
pdf.addImage(logoBase64, 'PNG', 100, 12, 25, 25);
```

---

## 🔄 Como Trocar o Logo

### Método 1: Substituir o arquivo (MAIS FÁCIL)

1. Prepare sua imagem:
   - Formato: PNG ou JPG
   - Tamanho recomendado: 500x500 pixels
   - Fundo transparente (PNG) é melhor

2. Renomeie para `logo.png`

3. Substitua o arquivo:
   ```bash
   # Linux/Mac
   cp /caminho/para/seu/logo.png /workspace/public/logo.png
   
   # Windows
   copy C:\caminho\para\seu\logo.png C:\workspace\public\logo.png
   ```

4. Pronto! O sistema vai usar automaticamente

---

### Método 2: Usar outro arquivo

**Se seu logo tem outro nome (ex: `minha-logo.jpg`):**

1. Coloque na pasta `public/`:
   ```bash
   cp minha-logo.jpg /workspace/public/
   ```

2. Edite `serviceOrderPdf.ts` (linha ~40):
   ```typescript
   // De:
   const logoBase64 = await loadImageAsBase64('/logo.png');
   
   // Para:
   const logoBase64 = await loadImageAsBase64('/minha-logo.jpg');
   ```

3. Se for JPG, mude também o formato:
   ```typescript
   // De:
   pdf.addImage(logoBase64, 'PNG', 12, 12, 25, 25);
   
   // Para:
   pdf.addImage(logoBase64, 'JPEG', 12, 12, 25, 25);
   ```

---

### Método 3: Usar Base64 (logo embutido no código)

**Vantagem:** Não precisa de arquivo externo
**Desvantagem:** Código fica maior

1. Converta sua imagem para base64:
   - Use site: https://www.base64-image.de/
   - Ou comando: `base64 logo.png`

2. Edite `serviceOrderPdf.ts`:
   ```typescript
   // Remova o try/catch e use diretamente:
   const logoBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...';
   pdf.addImage(logoBase64, 'PNG', 12, 12, 25, 25);
   ```

---

## 📊 Excel - Como Adicionar Logo

### ⚠️ Limitação

A biblioteca `xlsx` que usamos **NÃO suporta imagens** nativamente.

### Opções:

#### Opção 1: Deixar espaço vazio (ATUAL)
- A célula A1-A4 fica vazia
- Usuário pode adicionar logo manualmente no Excel depois

#### Opção 2: Instalar biblioteca adicional (xlsx-populate)

**Passo 1:** Instalar
```bash
npm install xlsx-populate
npm install --save-dev @types/xlsx-populate
```

**Passo 2:** Modificar código (exemplo):
```typescript
import XlsxPopulate from 'xlsx-populate';

export const generateServiceOrderExcel = async (order: ServiceOrder) => {
  const workbook = await XlsxPopulate.fromBlankAsync();
  const sheet = workbook.sheet(0);
  
  // Adicionar logo
  const logoBuffer = await fetch('/logo.png').then(r => r.arrayBuffer());
  sheet.addImage(logoBuffer, {
    type: 'picture',
    position: {
      type: 'absoluteAnchor',
      x: 10,
      y: 10
    }
  });
  
  // ... resto do código
};
```

**Nota:** Esta opção requer reescrever grande parte do código Excel.

#### Opção 3: Usar símbolo Unicode (SIMPLES)

Adicionar um símbolo que represente a empresa:

```typescript
['🏗️', 'TERRAPLENAGEM GUIMARÃES SERRA LTDA', '', '', 'ORDEM DE SERVIÇO INTERNA'],
```

Ou usar iniciais:
```typescript
['TGS', 'TERRAPLENAGEM GUIMARÃES SERRA LTDA', '', '', 'ORDEM DE SERVIÇO INTERNA'],
```

---

## 🎨 Ajustar Tamanho e Posição do Logo no PDF

### Tamanho Atual: 25x25mm

**Para logo MAIOR (30x30mm):**
```typescript
pdf.addImage(logoBase64, 'PNG', 12, 12, 30, 30);
```

**Para logo MENOR (20x20mm):**
```typescript
pdf.addImage(logoBase64, 'PNG', 12, 12, 20, 20);
```

**Para logo RETANGULAR (largura > altura):**
```typescript
pdf.addImage(logoBase64, 'PNG', 12, 15, 35, 20);
//                                         ↑   ↑
//                                    mais largo, menos alto
```

**Para logo VERTICAL (altura > largura):**
```typescript
pdf.addImage(logoBase64, 'PNG', 15, 12, 20, 30);
//                                         ↑   ↑
//                                    menos largo, mais alto
```

---

## 🔍 Verificar se Logo Está Carregando

### Método 1: Console do Navegador

Abra as DevTools (F12) e veja se há erros como:
```
Logo não pôde ser carregado: Error...
```

### Método 2: Testar URL

Abra no navegador:
```
http://localhost:5173/logo.png
```

Se mostrar a imagem, está funcionando!

### Método 3: Verificar arquivo

```bash
ls -lh /workspace/public/logo.png
```

Deve mostrar o arquivo e seu tamanho.

---

## 📐 Medidas de Referência

**Área do cabeçalho:**
- Largura total: 190mm
- Altura: 35mm
- Margem esquerda: 10mm
- Margem topo: 10mm

**Espaço recomendado para logo:**
- Quadrado: 20-30mm
- Retangular horizontal: 35x20mm
- Retangular vertical: 20x30mm

**Posição X (horizontal):**
- `12mm` - colado à esquerda
- `20mm` - com mais espaço
- `15mm` - meio termo

**Posição Y (vertical):**
- `12mm` - topo
- `15mm` - centralizado
- `10mm` - mais acima

---

## ✅ Checklist Final

- [ ] Arquivo `logo.png` está em `/workspace/public/`
- [ ] Logo tem tamanho adequado (recomendado 500x500 px)
- [ ] Logo tem fundo transparente (se PNG)
- [ ] PDF gerado mostra o logo
- [ ] Logo não está cortado ou distorcido
- [ ] Logo não sobrepõe o texto da empresa
- [ ] Tamanho do logo está proporcional ao cabeçalho

---

## 🆘 Problemas Comuns

### Logo não aparece no PDF

**Causa:** Arquivo não encontrado ou erro de carregamento

**Solução:**
1. Verifique se `/public/logo.png` existe
2. Tente acessar `http://localhost:5173/logo.png` no navegador
3. Veja o console (F12) por erros
4. Teste com uma imagem diferente

### Logo aparece distorcido

**Causa:** Proporções erradas (width/height)

**Solução:**
1. Descubra proporção original da imagem
2. Mantenha a mesma proporção no código

Exemplo - imagem 800x600 (proporção 4:3):
```typescript
// Bom (mantém proporção):
pdf.addImage(logoBase64, 'PNG', 12, 12, 28, 21);  // 28:21 = 4:3

// Ruim (distorce):
pdf.addImage(logoBase64, 'PNG', 12, 12, 25, 25);  // 25:25 = 1:1
```

### Logo muito grande ou pequeno

**Solução:** Ajuste width e height:

```typescript
// Aumentar 20%:
pdf.addImage(logoBase64, 'PNG', 12, 12, 30, 30);  // era 25x25

// Diminuir 20%:
pdf.addImage(logoBase64, 'PNG', 12, 12, 20, 20);  // era 25x25
```

### Logo sobrepõe texto

**Solução:** Mova o texto ou o logo:

**Opção 1 - Mover logo mais à esquerda:**
```typescript
pdf.addImage(logoBase64, 'PNG', 10, 12, 25, 25);  // X era 12, agora 10
```

**Opção 2 - Mover texto mais à direita:**
```typescript
pdf.text('TERRAPLENAGEM...', 45, 18);  // X era 40, agora 45
```

---

## 🚀 Arquivo Atual

**PDF:** `/workspace/src/services/serviceOrderPdf.ts`
- Linhas 5-21: Função de carregamento
- Linhas 36-45: Inserção do logo

**Logo:** `/workspace/public/logo.png`

---

## 💡 Dica Pro

Para ter certeza de que o logo sempre carrega, use base64 embutido:

```typescript
// No topo do arquivo, depois dos imports:
const COMPANY_LOGO = 'data:image/png;base64,iVBORw0KG...'; // Seu logo aqui

// No código:
pdf.addImage(COMPANY_LOGO, 'PNG', 12, 12, 25, 25);
```

Assim nunca vai falhar por problema de carregamento!

---

**✅ PRONTO! Seu logo agora aparece no PDF automaticamente!**

Qualquer dúvida ou se quiser ajustar tamanho/posição, é só me avisar! 🎨
