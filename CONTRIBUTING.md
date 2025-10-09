# 🤝 Guia de Contribuição

Obrigado por considerar contribuir com o TIMEO! Este documento fornece diretrizes para contribuições.

## 📋 Código de Conduta

- Seja respeitoso e inclusivo
- Aceite críticas construtivas
- Foque no que é melhor para a comunidade
- Mostre empatia com outros membros

## 🚀 Como Contribuir

### Reportar Bugs

1. Verifique se o bug já foi reportado nos **Issues**
2. Se não, crie um novo issue com:
   - Título claro e descritivo
   - Passos para reproduzir
   - Comportamento esperado vs atual
   - Screenshots (se aplicável)
   - Versão do Node/navegador

### Sugerir Melhorias

1. Abra um **Issue** com tag `enhancement`
2. Descreva a funcionalidade desejada
3. Explique por que seria útil
4. Proponha como implementar (opcional)

### Pull Requests

#### Antes de começar

1. Fork o repositório
2. Clone seu fork
3. Crie uma branch:
   ```bash
   git checkout -b feature/MinhaFuncionalidade
   # ou
   git checkout -b fix/MeuBugFix
   ```

#### Durante o desenvolvimento

1. **Siga os padrões de código**
   - TypeScript strict
   - ESLint sem erros
   - Prettier para formatação
   
2. **Commits semânticos**
   ```bash
   feat: adiciona notificações por email
   fix: corrige conflito de horários
   docs: atualiza README com novas instruções
   style: formata código com prettier
   refactor: melhora performance do calendário
   test: adiciona testes para appointments
   chore: atualiza dependências
   ```

3. **Escreva testes** (quando aplicável)
   ```bash
   npm run test
   ```

4. **Verifique o build**
   ```bash
   npm run build
   ```

#### Enviando o PR

1. Push para seu fork:
   ```bash
   git push origin feature/MinhaFuncionalidade
   ```

2. Abra um Pull Request no GitHub

3. Preencha o template:
   - Descrição clara das mudanças
   - Issue relacionada (se houver)
   - Screenshots (se aplicável)
   - Checklist de review

4. Aguarde review

## 🎨 Padrões de Código

### TypeScript

```typescript
// ✅ BOM
interface User {
  id: string
  name: string
  email: string
}

const getUser = async (id: string): Promise<User> => {
  // implementação
}

// ❌ RUIM
const getUser = async (id) => {
  // sem tipos
}
```

### React Components

```typescript
// ✅ BOM - Client Component
'use client'

import { useState } from 'react'

export function MyComponent() {
  const [state, setState] = useState('')
  
  return <div>{state}</div>
}

// ✅ BOM - Server Component
import { supabase } from '@/lib/supabase'

export default async function Page() {
  const data = await getData()
  
  return <div>{data}</div>
}
```

### Styling

```typescript
// ✅ BOM - Use Tailwind
<button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105 transition-transform">
  Clique aqui
</button>

// ✅ BOM - Use shadcn/ui
import { Button } from '@/components/ui/button'

<Button variant="gradient">Clique aqui</Button>
```

### Estrutura de Arquivos

```
app/
  minha-feature/
    page.tsx          # Página principal
    layout.tsx        # Layout (se necessário)
    loading.tsx       # Loading state
    error.tsx         # Error boundary

components/
  MyComponent.tsx     # Component único
  MyFeature/          # Feature complexa
    index.tsx
    SubComponent.tsx
    
lib/
  myUtility.ts        # Funções utilitárias
```

## 🧪 Testes

### Estrutura

```typescript
// MyComponent.test.tsx
import { render, screen } from '@testing-library/react'
import { MyComponent } from './MyComponent'

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```

### Executar testes

```bash
npm run test           # Todos os testes
npm run test:watch     # Watch mode
npm run test:coverage  # Com coverage
```

## 📝 Documentação

### Comentários

```typescript
// ✅ BOM - Comenta o "porquê"
// Validamos conflitos antes de salvar para evitar sobrepor agendamentos
const hasConflict = checkTimeConflict(appointments, newAppointment)

// ❌ RUIM - Comenta o "o quê" (óbvio)
// Cria uma variável hasConflict
const hasConflict = checkTimeConflict(appointments, newAppointment)
```

### README

- Atualize o README se adicionar funcionalidades
- Inclua exemplos de uso
- Mantenha instruções claras

## 🔄 Workflow

1. **Issue** → Discutir funcionalidade
2. **Branch** → Criar branch específica
3. **Code** → Desenvolver com commits semânticos
4. **Test** → Garantir qualidade
5. **PR** → Abrir pull request
6. **Review** → Receber e aplicar feedback
7. **Merge** → Aprovação e merge

## 🏆 Boas Práticas

### Performance

- Use `use client` apenas quando necessário
- Lazy loading para componentes pesados
- Otimize imagens com `next/image`
- Memoize callbacks com `useCallback`

### Acessibilidade

- Use HTML semântico
- Adicione `aria-label` quando necessário
- Teste com leitor de tela
- Mantenha contraste adequado

### Segurança

- Nunca commite secrets (`.env`, tokens)
- Valide inputs no frontend e backend
- Use HTTPS em produção
- Sanitize dados do usuário

## 📞 Dúvidas?

- Abra uma **Discussion** no GitHub
- Entre em contato via **Issues**
- Consulte a **documentação**

## 🎉 Reconhecimento

Contribuidores serão listados no README e receberão créditos!

Obrigado por contribuir! 🚀
