# Terraplanagem Guimarães - Sistema de Checklist

Sistema completo, web e mobile-friendly, para checklist de máquinas pesadas.

## Características

- ✅ Sem login - acesso direto
- ✅ Mobile-friendly
- ✅ Armazenamento local (localStorage + IndexedDB)
- ✅ Upload de múltiplas fotos por item
- ✅ Geração de PDF profissional
- ✅ Salvamento automático de rascunhos
- ✅ Modo escuro opcional
- ✅ Cores da marca: Amarelo, Preto e Cinza

## Como usar

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build
```

## Tecnologias

- React 18
- TypeScript
- Vite
- jsPDF (geração de PDF)
- IndexedDB (armazenamento de fotos)
- localStorage (dados do checklist)

## Funcionalidades

1. **Tela Inicial**: Nome do operador, seleção de máquina e local
2. **Checklist Completo**: 18 itens com status C/N.C/N.A, observações e fotos
3. **Armazenamento Local**: Todos os dados salvos localmente no dispositivo
4. **PDF Profissional**: Geração de relatório completo com fotos
5. **Lista de Checklists**: Histórico de checklists finalizados
