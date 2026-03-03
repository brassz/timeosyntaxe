# 📦 Configuração do Bucket de PDFs no Supabase

Este guia explica como configurar o bucket no Supabase Storage para armazenar os PDFs gerados (Checklist e OSI).

## 📋 Pré-requisitos

- Acesso ao Dashboard do Supabase
- Projeto Supabase configurado
- Credenciais do Supabase configuradas no arquivo `.env`

## 🚀 Passo a Passo

### 1. Acessar o Supabase Dashboard

1. Acesse: https://app.supabase.com
2. Faça login na sua conta
3. Selecione o projeto correto

### 2. Criar o Bucket

1. No menu lateral, clique em **Storage**
2. Clique no botão **"New bucket"** ou **"Create bucket"**
3. Preencha os dados:
   - **Name**: `pdfs` (nome exato, sem espaços)
   - **Public bucket**: 
     - ✅ **Recomendado**: Marque como **Público** se quiser acesso direto via URL
     - ❌ Ou deixe **Privado** se quiser controle de acesso
   - **File size limit**: Deixe o padrão ou ajuste conforme necessário (ex: 10MB)
   - **Allowed MIME types**: Deixe vazio ou adicione `application/pdf, image/jpeg, image/png` para permitir PDFs e fotos das OSI
4. Clique em **"Create bucket"**

### 3. Configurar Políticas de Acesso (RLS)

Se o bucket for **privado**, você precisará configurar políticas RLS:

1. No bucket criado, clique em **"Policies"**
2. Clique em **"New Policy"**
3. Selecione **"For full customization"**
4. Configure a política:

**Para permitir upload (INSERT):**
```sql
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'pdfs');
```

**Para permitir leitura (SELECT):**
```sql
CREATE POLICY "Allow public read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'pdfs');
```

**Para permitir atualização (UPDATE):**
```sql
CREATE POLICY "Allow authenticated updates"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'pdfs');
```

**Para permitir exclusão (DELETE):**
```sql
CREATE POLICY "Allow authenticated deletes"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'pdfs');
```

### 4. Estrutura de Pastas

O sistema criará automaticamente as seguintes pastas dentro do bucket:

- `checklists/` - PDFs dos checklists
- `osi/` - PDFs das ordens de serviço interna
- `osi/photos/` - Fotos anexadas às OSI (enviadas automaticamente ao salvar)

**Não é necessário criar essas pastas manualmente!** Elas serão criadas automaticamente quando o primeiro arquivo for enviado.

### 5. Verificar Configuração

Após criar o bucket, verifique:

1. ✅ O bucket `pdfs` aparece na lista de buckets
2. ✅ As políticas RLS estão configuradas (se bucket privado)
3. ✅ O bucket está acessível

## 📁 Estrutura de Arquivos

Os PDFs serão salvos com a seguinte estrutura:

```
pdfs/
├── checklists/
│   ├── Checklist_Motoniveladora_01-01-2024.pdf
│   ├── Checklist_Trator_02-01-2024.pdf
│   └── ...
└── osi/
    ├── OSI_2200_2024-01-01.pdf
    ├── OSI_2201_2024-01-02.pdf
    ├── photos/
    │   ├── OSI_2200_1234567890_0.jpg
    │   ├── OSI_2200_1234567890_1.png
    │   └── ...
    └── ...
```

## 🔍 Verificar se Está Funcionando

1. Gere um PDF (Checklist ou OSI)
2. Verifique o console do navegador - deve aparecer:
   ```
   ✅ PDF salvo no Supabase Storage: https://...
   ```
3. No Supabase Dashboard > Storage > pdfs, verifique se o arquivo aparece

## ⚙️ Configurações Avançadas

### Limitar Tamanho dos Arquivos

No bucket, você pode configurar:
- **File size limit**: Máximo de 10MB (recomendado)

### Limpar PDFs Antigos

Você pode criar uma função no Supabase para limpar PDFs antigos:

```sql
-- Exemplo: Deletar PDFs com mais de 90 dias
DELETE FROM storage.objects
WHERE bucket_id = 'pdfs'
AND created_at < NOW() - INTERVAL '90 days';
```

### Backup Automático

Configure backups automáticos no Supabase:
1. Vá em **Settings** > **Database**
2. Configure **Point-in-time Recovery** (PITR)

## 🐛 Troubleshooting

### Erro: "Bucket not found"
- Verifique se o bucket foi criado com o nome exato: `pdfs`
- Verifique se está no projeto correto do Supabase

### Erro: "Permission denied"
- Verifique as políticas RLS do bucket
- Se o bucket for privado, configure as políticas conforme o passo 3
- Se o bucket for público, não precisa de políticas

### PDF não aparece no storage
- Verifique o console do navegador para erros
- Verifique se as credenciais do Supabase estão corretas no `.env`
- Verifique se o bucket está acessível

### Upload muito lento
- Verifique a conexão de internet
- PDFs grandes podem demorar mais
- Considere aumentar o timeout nas configurações

## 📝 Notas Importantes

- ✅ Os PDFs são salvos **tanto localmente** (download) **quanto no Supabase Storage**
- ✅ As **fotos das OSI** são enviadas automaticamente para o bucket ao salvar a ordem (em `osi/photos/`)
- ✅ Se o upload falhar, o PDF ainda será baixado localmente; fotos usam fallback para base64 no banco
- ✅ O sistema funciona mesmo sem o bucket configurado (apenas não salva no storage)
- ✅ PDFs antigos podem ser deletados manualmente ou via função SQL

## 🎯 Próximos Passos

Após configurar o bucket:

1. ✅ Teste gerando um PDF de Checklist
2. ✅ Teste gerando um PDF de OSI
3. ✅ Verifique se os arquivos aparecem no Supabase Storage
4. ✅ Configure backups se necessário

---

**Pronto!** O sistema agora salvará todos os PDFs gerados no Supabase Storage. 🎉

