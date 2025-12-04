-- ============================================
-- ADICIONAR CAMPO DE FOTOS À TABELA OSI
-- ============================================
-- Execute este SQL se você já tem a tabela osi_orders
-- e deseja adicionar o campo de fotos
-- ============================================

-- Adicionar coluna photos à tabela osi_orders
ALTER TABLE osi_orders 
ADD COLUMN IF NOT EXISTS photos JSONB;

-- ============================================
-- PRONTO! A coluna photos foi adicionada
-- ✅ Success. No rows returned
-- ============================================
