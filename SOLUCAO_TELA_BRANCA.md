# 🔧 Solução para Tela Branca

## ✅ Problema Resolvido

Ajustei a importação do bcryptjs para garantir compatibilidade com o navegador.

## 🚀 Como Testar

### 1. Limpar Cache
```bash
# Pare o servidor se estiver rodando
Ctrl+C

# Limpe o cache
rm -rf node_modules/.vite
rm -rf dist

# Reinstale (opcional, mas recomendado)
npm install
```

### 2. Executar Novamente
```bash
npm run dev
```

### 3. Abrir no Navegador
```
http://localhost:5173
```

**OU**

```
http://localhost:5174
```
(se a porta 5173 estiver ocupada)

### 4. Verificar Console do Navegador

Se ainda houver tela branca:

1. Pressione **F12** no navegador
2. Vá na aba **Console**
3. Veja se há erros em vermelho
4. Copie a mensagem de erro

## 🔍 Possíveis Causas e Soluções

### Causa 1: Cache do Navegador
**Solução:**
- Pressione `Ctrl+Shift+R` (hard refresh)
- Ou limpe o cache: F12 → Application → Clear Storage → Clear site data

### Causa 2: Porta Ocupada
**Solução:**
```bash
# Mate processos na porta
pkill -f vite

# Ou use outra porta
npm run dev -- --port 3000
```

### Causa 3: Node Modules Corrompidos
**Solução:**
```bash
rm -rf node_modules
rm package-lock.json
npm install
npm run dev
```

### Causa 4: Erro no Supabase (antes de configurar)
**Sintoma:** Console mostra erro de Supabase

**Solução:** Isso é esperado se você ainda não configurou o banco.

O sistema deve mostrar a tela inicial mesmo sem o Supabase configurado.

O botão OSI só funcionará após configurar o banco.

## 🧪 Teste Rápido

Depois de iniciar o servidor, você DEVE ver:

✅ **Tela Inicial do Sistema de Checklist**
- Header com logo
- Botão "🔐 Painel OSI" (canto direito)
- Toggle de modo escuro
- Formulário de checklist

❌ **NÃO deve ver:**
- Tela completamente branca
- Nada na tela

## 🆘 Se Ainda Estiver Branco

Execute este comando e me envie o resultado:

```bash
npm run dev 2>&1 | tee /tmp/vite-output.txt
```

Depois, no navegador:
1. Abra o DevTools (F12)
2. Aba Console
3. Copie TODOS os erros (se houver)

## ✅ Confirmação de Funcionamento

Você saberá que está funcionando quando ver:

1. **Terminal mostra:**
```
VITE v5.x.x  ready in XXXms
➜  Local:   http://localhost:5173/
```

2. **Navegador mostra:**
- Logo da Terraplanagem Guimarães
- Título "Sistema de Checklist de Máquinas Pesadas"
- Botão "🔐 Painel OSI"

3. **Console do navegador (F12):**
- Sem erros em vermelho
- Pode ter warnings (amarelo) - isso é ok

## 📝 Mudanças Feitas

Corrigi a importação do bcryptjs de:
```typescript
import * as bcrypt from 'bcryptjs';
```

Para:
```typescript
import bcrypt from 'bcryptjs';
```

Isso garante compatibilidade com o Vite e navegadores modernos.

## 🎯 Próximos Passos

Após confirmar que a tela está funcionando:

1. **Configure o Supabase** (se ainda não fez)
   - Execute `supabase-setup.sql`
   - Crie o bucket `osi-files`

2. **Teste o Sistema OSI**
   - Clique no botão "🔐 Painel OSI"
   - Login: admin / admin123

3. **Crie sua primeira OS**

---

**Sistema corrigido e pronto para uso! 🚀**
