# 🚀 Como Configurar o Sistema - Guia Completo

## 📋 Visão Geral

Este guia mostra como configurar o sistema do zero em **3 etapas simples**.

---

## 🎯 Etapa 1: Configurar Banco de Dados

### No SQL Editor do Supabase:

**Execute:** `supabase-complete-setup.sql`

```sql
-- Este script cria:
-- ✅ Tabela checklists (retenção 7 dias)
-- ✅ Tabela service_orders (permanente)
-- ✅ Índices e otimizações
-- ✅ Função de limpeza automática
```

**Resultado esperado:**
```
✅ INSTALAÇÃO COMPLETA COM SUCESSO!
```

---

## 🔐 Etapa 2: Configurar Autenticação

### Passo 2.1: Limpar Sistema Antigo (se existir)

**Execute:** `revert-auth-supabase.sql`

```sql
-- Remove:
-- ✅ Usuários do auth.users (se houver)
-- ✅ Tabela profiles antiga
-- ✅ Triggers problemáticos
```

### Passo 2.2: Configurar Nova Autenticação

**Execute:** `setup-custom-auth.sql`

```sql
-- Cria:
-- ✅ Tabela public.users
-- ✅ Função login_user()
-- ✅ Função change_password()
-- ✅ RLS e políticas
```

**Resultado esperado:**
```
✅ Tabela users criada
✅ Função login_user criada
✅ RLS habilitado
```

### Passo 2.3: Criar Usuários

**Execute:** `create-users-custom.sql`

```sql
-- Cria 2 usuários:
-- ✅ gustavo@terraplanagemguimaraes.com
-- ✅ admin@terraplanagemguimaraes.com
```

**Resultado esperado:**
```
✅ USUÁRIO 1: GUSTAVO
   📧 Email: gustavo@terraplanagemguimaraes.com
   🔑 Senha: terraplanagem2025

✅ USUÁRIO 2: ADMIN
   📧 Email: admin@terraplanagemguimaraes.com
   🔑 Senha: administrador2025

🎉 SUCESSO! Todos os usuários foram criados.
```

---

## 🧪 Etapa 3: Testar o Sistema

### Teste 1: Verificar Banco de Dados

```sql
-- Ver estatísticas
SELECT * FROM get_system_stats();

-- Ver usuários
SELECT * FROM users_safe;

-- Testar login
SELECT * FROM login_user(
    'gustavo@terraplanagemguimaraes.com',
    'terraplanagem2025'
);
```

### Teste 2: Testar Login no Sistema

1. Abra o sistema no navegador
2. Clique em **"🔐 Login"** (canto superior direito)
3. Digite:
   - Email: `gustavo@terraplanagemguimaraes.com`
   - Senha: `terraplanagem2025`
4. Clique em **"Entrar"**
5. Deve redirecionar para o **Painel OSI** ✅

### Teste 3: Criar uma Ordem de Serviço

1. No Painel OSI, clique em **"Gerar Ordem"**
2. Preencha o formulário:
   - Data e Hora (preenchidos automaticamente)
   - Veículo: "Escavadeira"
   - Equipamento: "CAT 320D"
   - Selecione tipo de manutenção
   - Preencha descrição
3. Clique em **"Gerar PDF"** ou **"Gerar Excel"**
4. Arquivo deve baixar automaticamente ✅

### Teste 4: Criar um Checklist

1. Na tela inicial, clique em **"Novo Checklist"**
2. Preencha:
   - Operador: Seu nome
   - Máquina: Selecione uma
   - Local: Nome da obra
   - TAG: (opcional)
3. Preencha os itens do checklist
4. Clique em **"Finalizar"**
5. PDF deve ser gerado ✅

---

## ✅ Checklist de Configuração

Use esta checklist para garantir que tudo está funcionando:

### Banco de Dados
- [ ] Tabela `checklists` existe
- [ ] Tabela `service_orders` existe
- [ ] Tabela `users` existe
- [ ] Função `get_system_stats()` funciona
- [ ] Função `login_user()` funciona
- [ ] Função `cleanup_old_checklists()` existe

### Usuários
- [ ] 2 usuários criados
- [ ] Login com Gustavo funciona
- [ ] Login com Admin funciona
- [ ] Usuários aparecem em `users_safe`

### Sistema
- [ ] Modal de login abre
- [ ] Modal não fecha ao selecionar texto
- [ ] Login redireciona para Painel OSI
- [ ] Painel OSI carrega corretamente
- [ ] Botão "Gerar Ordem" funciona
- [ ] Formulário de ordem carrega
- [ ] PDF é gerado
- [ ] Excel é gerado

### Checklists
- [ ] Novo checklist pode ser criado
- [ ] Itens podem ser marcados
- [ ] Fotos podem ser anexadas
- [ ] PDF é gerado
- [ ] Histórico mostra checklists

---

## 📊 Comandos Úteis

### Ver todas as tabelas:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

### Ver estatísticas:
```sql
SELECT * FROM get_system_stats();
```

### Ver usuários:
```sql
SELECT * FROM users_safe;
```

### Ver últimas ordens:
```sql
SELECT order_number, vehicle, date, created_at
FROM service_orders
ORDER BY created_at DESC
LIMIT 5;
```

### Ver últimos checklists:
```sql
SELECT operator, machine, date, completed
FROM checklists
ORDER BY created_at DESC
LIMIT 5;
```

### Contar registros:
```sql
SELECT 
    (SELECT COUNT(*) FROM checklists) as checklists,
    (SELECT COUNT(*) FROM service_orders) as ordens,
    (SELECT COUNT(*) FROM users) as usuarios;
```

---

## 🔧 Configuração Opcional

### Limpeza Automática de Checklists (Recomendado)

Para que checklists antigos sejam deletados automaticamente:

1. Habilite a extensão `pg_cron`:
   - Database → Extensions → pg_cron → Enable

2. Execute no SQL Editor:
```sql
SELECT cron.schedule(
    'cleanup-old-checklists-daily',
    '0 0 * * *',  -- Todo dia à meia-noite
    'SELECT cleanup_old_checklists();'
);
```

3. Verificar cron jobs:
```sql
SELECT * FROM cron.job;
```

---

## 🆘 Problemas Comuns

### "Database error querying schema"
**Solução:** Execute `revert-auth-supabase.sql` e depois `setup-custom-auth.sql`

### "Email ou senha incorretos"
**Solução:** Verifique se usuário existe:
```sql
SELECT * FROM users WHERE email = 'gustavo@terraplanagemguimaraes.com';
```

### Modal fecha ao clicar
**Solução:** Sistema já está corrigido. Faça reload da página (F5)

### PDF não é gerado
**Solução:** 
1. Verifique console do navegador (F12)
2. Preencha todos os campos obrigatórios
3. Limpe cache do navegador

---

## 📞 Recursos de Suporte

- **Guia Rápido:** [QUICK_SETUP.md](QUICK_SETUP.md)
- **Migração:** [MIGRACAO_AUTH.md](MIGRACAO_AUTH.md)
- **Credenciais:** [CREDENCIAIS.md](CREDENCIAIS.md)
- **Problemas:** [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- **Sistema OSI:** [README_OSI.md](README_OSI.md)

---

## 🎉 Configuração Completa!

Se todos os testes passaram, seu sistema está **100% configurado e pronto para uso**!

**Próximos passos:**
1. Trocar senhas padrão após primeiro acesso
2. Criar mais usuários se necessário
3. Fazer backup regular do banco
4. Monitorar uso e performance

---

**Tempo total de configuração:** ~10 minutos  
**Dificuldade:** ⭐⭐ Médio  
**Suporte:** Documentação completa incluída

**Última Atualização:** Dezembro 2025  
**Versão:** 2.0.0
