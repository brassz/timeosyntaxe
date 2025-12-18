# 📷 Funcionalidade de Fotos no Painel OSI

## Visão Geral

A funcionalidade de fotos foi adicionada ao painel OSI (Ordem de Serviço Interna), permitindo que os usuários anexem imagens durante a criação de ordens de serviço.

## Funcionalidades Implementadas

### 1. Upload de Fotos
- **Múltiplas Fotos**: Permite adicionar até 10 fotos por ordem de serviço
- **Limite de Quantidade**: Máximo de 10 fotos por OSI
- **Limite de Tamanho**: Máximo de 5MB por foto
- **Formatos Aceitos**: Todos os formatos de imagem (JPG, PNG, GIF, etc.)
- **Pré-visualização**: As fotos aparecem em grade após o upload
- **Remoção**: Botão de remoção individual para cada foto
- **Contador Visual**: Mostra quantas fotos foram adicionadas (ex: 3/10)

### 2. Armazenamento
- As fotos são armazenadas em formato **base64** no banco de dados
- Campo `photos` do tipo JSONB na tabela `osi_orders`
- Compatível com modo offline (armazenamento local)

### 3. Visualização no Histórico
- Exibição em grade das fotos anexadas
- Click para ampliar (abre em nova aba)
- Design responsivo para mobile

## Como Usar

### Para Novos Projetos
Se você está criando as tabelas pela primeira vez, use o arquivo `CRIAR_TABELAS.sql` que já inclui o campo de fotos.

### Para Projetos Existentes
Se você já tem a tabela `osi_orders` criada, execute o script:

```sql
-- Execute no SQL Editor do Supabase
ALTER TABLE osi_orders 
ADD COLUMN IF NOT EXISTS photos JSONB;
```

Ou use o arquivo `ADICIONAR_FOTOS_OSI.sql` fornecido.

## Interface de Usuário

### Seção de Upload
1. No formulário de nova OSI, procure a seção **"📷 Fotos"**
2. Clique no botão **"📸 Adicionar Fotos"**
3. Selecione uma ou mais fotos do seu dispositivo
4. As fotos aparecerão em uma grade abaixo do botão
5. Para remover uma foto, clique no **"✕"** no canto da imagem

### Visualização no Histórico
1. No histórico de OSI, clique em uma ordem de serviço
2. Role até a seção de fotos (se houver)
3. As fotos são exibidas em grade
4. Clique em qualquer foto para ampliar

## Características Técnicas

### Estrutura de Dados

```typescript
interface OSIData {
  // ... outros campos ...
  photos?: string[]; // Array de fotos em base64
}
```

### Componentes Atualizados
- `src/components/OSI.tsx` - Componente principal
- `src/components/OSI.css` - Estilos para fotos
- `src/types/index.ts` - Tipos TypeScript
- `src/services/supabase.ts` - Interface do banco

### Responsividade
- Desktop: Grade de 150px por foto
- Mobile: Grade de 100px por foto (criação) e 80px (histórico)
- Otimizado para touch screens

## Limitações

1. **Quantidade**: Máximo de 10 fotos por OSI
2. **Tamanho**: Fotos maiores que 5MB serão rejeitadas
3. **Armazenamento**: Como usa base64, o tamanho do banco pode crescer rapidamente
4. **Performance**: Muitas fotos podem aumentar o tempo de carregamento

## Melhorias Futuras Possíveis

- [ ] Compressão automática de imagens
- [ ] Upload para Supabase Storage em vez de base64
- [ ] Galeria com zoom e navegação
- [ ] Anotações nas fotos
- [ ] Filtros e edição básica

## Suporte

Para problemas ou dúvidas:
1. Verifique se a coluna `photos` existe na tabela `osi_orders`
2. Verifique o console do navegador para erros
3. Confirme que o arquivo tem menos de 5MB

---

**Última Atualização**: Dezembro 2024
**Versão**: 1.0.0
