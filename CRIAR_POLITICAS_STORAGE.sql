-- ============================================
-- POLÍTICAS DE STORAGE PARA FOTOS E PDFs
-- ============================================
-- Projeto: yzmxyqtfbthtrlnhrnpu (Supabase principal)
-- Execute no SQL Editor do Supabase Dashboard
-- ============================================

-- 1) Crie o bucket "pdfs" em Storage (se ainda não existir)
--    - Nome: pdfs
--    - Public bucket: SIM (recomendado)
--    - Allowed MIME types: deixe vazio OU inclua:
--      application/pdf, image/jpeg, image/png, image/webp

-- 2) Execute as políticas abaixo:

DROP POLICY IF EXISTS "Public read pdfs bucket" ON storage.objects;
DROP POLICY IF EXISTS "Public upload pdfs bucket" ON storage.objects;
DROP POLICY IF EXISTS "Public update pdfs bucket" ON storage.objects;
DROP POLICY IF EXISTS "Public delete pdfs bucket" ON storage.objects;

-- Leitura pública (necessário para PDF carregar fotos pela URL)
CREATE POLICY "Public read pdfs bucket"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'pdfs');

-- Upload via app (chave anon do frontend)
CREATE POLICY "Public upload pdfs bucket"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'pdfs');

-- Upsert (atualizar arquivo existente)
CREATE POLICY "Public update pdfs bucket"
ON storage.objects FOR UPDATE
TO anon, authenticated
USING (bucket_id = 'pdfs')
WITH CHECK (bucket_id = 'pdfs');

-- Exclusão (opcional, usado ao apagar registros)
CREATE POLICY "Public delete pdfs bucket"
ON storage.objects FOR DELETE
TO anon, authenticated
USING (bucket_id = 'pdfs');

-- ============================================
-- PRONTO! Teste enviando uma foto no checklist/OSI
-- ============================================
