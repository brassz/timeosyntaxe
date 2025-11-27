# 🚀 Quick Start - Terraplanagem Guimarães

## ⚡ Início Rápido (3 minutos)

### 1️⃣ Instalar Dependências
```bash
npm install
```

### 2️⃣ Iniciar Servidor
```bash
npm run dev
```

### 3️⃣ Abrir no Navegador
Acesse: `http://localhost:5173`

---

## 📱 Primeiro Uso

### Passo 1: Tela Inicial
1. Digite seu nome
2. Selecione a máquina
3. Informe o local
4. Clique em "Iniciar Checklist"

### Passo 2: Preencher Checklist
1. Informe horímetro e quilometragem
2. Para cada item:
   - Escolha: C / N.C / N.A
   - Adicione observação (opcional)
   - Tire fotos (opcional)
3. Navegue com as setas ou clique nos números

### Passo 3: Finalizar
1. Clique em "Finalizar e Gerar PDF"
2. PDF será baixado automaticamente
3. Checklist salvo no histórico

---

## 🎯 Atalhos Úteis

| Ação | Como fazer |
|------|------------|
| Próximo item | Botão "Próximo →" |
| Item anterior | Botão "← Anterior" |
| Ir para item específico | Clicar no número do item |
| Adicionar foto | Botão "📷 Adicionar Fotos" |
| Ver histórico | Botão na tela inicial |
| Modo escuro | Toggle no cabeçalho |

---

## 📋 18 Itens do Checklist

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

## 🔧 Comandos Principais

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento

# Produção
npm run build        # Cria versão otimizada
npm run preview      # Preview da build

# Limpeza
rm -rf dist          # Remove build anterior
rm -rf node_modules  # Remove dependências
```

---

## 💾 Onde os Dados Ficam?

- **Rascunhos**: localStorage do navegador
- **Fotos**: IndexedDB do navegador
- **Histórico**: localStorage do navegador
- **PDFs**: Pasta de Downloads do seu dispositivo

⚠️ **Importante:** Dados são locais. Limpar cache = perder dados.

---

## 📱 Testar em Mobile

### Método 1: Rede Local
```bash
npm run dev -- --host
```
Acesse pelo IP no celular: `http://192.168.x.x:5173`

### Método 2: Simulação no Browser
1. Abra DevTools (F12)
2. Clique no ícone de dispositivo móvel
3. Escolha um dispositivo (iPhone, Galaxy, etc.)

---

## 🐛 Problemas Comuns

### Erro ao instalar
```bash
# Usar versão correta do Node (18+)
node -v

# Limpar e reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Porta 5173 em uso
```bash
# Usar outra porta
npm run dev -- --port 3000
```

### Build falha
```bash
# Verificar erros
npm run build

# Ver logs completos
npm run build 2>&1 | tee build.log
```

---

## 📚 Arquivos Importantes

| Arquivo | Descrição |
|---------|-----------|
| `README.md` | Documentação completa |
| `MANUAL_USO.md` | Manual detalhado |
| `FEATURES.md` | Lista de funcionalidades |
| `DEPLOY.md` | Guia de publicação |
| `src/App.tsx` | Componente principal |
| `src/services/storage.ts` | Gerenciamento de dados |
| `src/services/pdf.ts` | Geração de PDF |

---

## ✅ Checklist Pré-Deploy

- [ ] `npm install` funciona
- [ ] `npm run dev` funciona
- [ ] `npm run build` funciona
- [ ] Testar no Chrome
- [ ] Testar no Safari (iOS)
- [ ] Testar upload de foto
- [ ] Testar geração de PDF
- [ ] Testar modo escuro

---

## 🎓 Próximos Passos

1. **Personalizar**: Edite cores, logo, itens do checklist
2. **Testar**: Use em situação real
3. **Deploy**: Publique online (ver DEPLOY.md)
4. **Treinar**: Ensine operadores a usar
5. **Melhorar**: Colete feedback e ajuste

---

## 📞 Suporte Rápido

**Problema com fotos?**
→ Verificar permissões de câmera no navegador

**PDF não gera?**
→ Verificar console do navegador (F12)

**Dados perdidos?**
→ Não limpar cache/dados do navegador

**App lento?**
→ Limpar histórico antigo, usar fotos menores

---

## 🎯 Dica de Ouro

> **Use em tablet de 7-10"** para melhor experiência!
> 
> Tela grande o suficiente para conforto, pequena o suficiente para campo.

---

**Pronto para usar! 🚜💪**

Leia o `MANUAL_USO.md` para detalhes completos.
