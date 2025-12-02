# 📋 Política de Retenção de Dados

## Resumo

Este documento explica como os dados são armazenados e por quanto tempo permanecem no sistema.

## 🔄 Checklists de Inspeção

### Período de Retenção
- **7 dias** a partir da data de criação

### Motivo
- Checklists são verificações operacionais de rotina
- Dados históricos extensos não são necessários
- Otimização de armazenamento e performance

### Processo de Limpeza
- Automático (se configurado com pg_cron)
- Executa diariamente à meia-noite
- Remove apenas registros com mais de 7 dias
- Não afeta dados recentes

### Como Funciona
```sql
-- Função executada automaticamente
DELETE FROM public.checklists
WHERE created_at < NOW() - INTERVAL '7 days';
```

### Recomendação
Se você precisa manter checklists por mais tempo:
- Exporte PDFs antes de 7 dias
- Modifique o intervalo no script SQL
- Ou desabilite a limpeza automática

## 📄 Ordens de Serviço (OSI)

### Período de Retenção
- **PERMANENTE** - Nunca deletadas automaticamente

### Motivo
- Documentos oficiais de manutenção
- Registro histórico importante
- Necessários para auditorias
- Controle de garantias e peças
- Rastreabilidade de manutenções

### Proteção
- Não há limpeza automática configurada
- Dados permanecem indefinidamente
- Backup regular recomendado
- Exportações PDF/Excel disponíveis

## 📊 Comparação

| Tipo de Dado | Retenção | Limpeza Automática | Motivo |
|-------------|----------|-------------------|---------|
| **Checklists** | 7 dias | ✅ Sim | Dados operacionais temporários |
| **Ordens de Serviço (OSI)** | Permanente | ❌ Não | Documentos oficiais |

## 🔧 Configuração

### Alterar Período de Retenção de Checklists

Para manter checklists por mais tempo, edite o script SQL:

```sql
-- Exemplo: 30 dias ao invés de 7
DELETE FROM public.checklists
WHERE created_at < NOW() - INTERVAL '30 days';
```

Opções disponíveis:
- `7 days` - 7 dias (padrão)
- `30 days` - 30 dias
- `90 days` - 90 dias
- `1 year` - 1 ano

### Desabilitar Limpeza Automática

Se quiser manter todos os checklists permanentemente:

```sql
-- Remover o cron job
SELECT cron.unschedule('cleanup-old-checklists');
```

## 💾 Backup de Dados

### Recomendações

**Para Checklists:**
- Exporte PDFs importantes antes de 7 dias
- Configure backup do Supabase (automático)

**Para Ordens de Serviço:**
- Backup automático do Supabase já protege
- Exporte relatórios mensais em Excel
- Mantenha cópias locais de PDFs importantes

## 🔒 Segurança

### Dados Deletados
- Checklists deletados não podem ser recuperados
- Deleção é permanente após limpeza
- Certifique-se de exportar o que precisar

### Dados Permanentes
- Ordens de serviço ficam protegidas
- Backup do Supabase mantém histórico
- Possível restauração se necessário

## 📝 Legislação e Compliance

### Considerações
- Verifique requisitos legais da sua região
- Algumas indústrias exigem retenção específica
- Ajuste políticas conforme necessário
- Consulte departamento jurídico se aplicável

## 🚨 Importante

1. **Checklists são temporários** - Exporte PDFs importantes
2. **Ordens são permanentes** - Mantidas automaticamente
3. **Backup é essencial** - Configure no Supabase
4. **Revise periodicamente** - Ajuste conforme necessidade

## 📞 Suporte

Para dúvidas sobre retenção de dados:
- Consulte SETUP_SUPABASE.md
- Verifique configuração do cron job
- Entre em contato com suporte técnico

---

**Última Atualização:** Dezembro 2025  
**Versão:** 2.0.0  
**Empresa:** Terraplanagem Guimarães Serra LTDA
