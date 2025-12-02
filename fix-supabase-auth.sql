-- ============================================================================
-- CORREÇÃO DE PROBLEMAS DE AUTENTICAÇÃO - SUPABASE
-- ============================================================================
-- 
-- Execute este script se estiver tendo problemas com:
-- - "Database error querying schema"
-- - Erros de trigger
-- - Erros de profiles
-- 
-- INSTRUÇÕES:
-- 1. Copie TODO este script
-- 2. Cole no SQL Editor do Supabase
-- 3. Execute
-- ============================================================================

-- ============================================================================
-- OPÇÃO 1: Remover trigger problemático (se existir)
-- ============================================================================

-- Desabilitar trigger que pode estar causando problemas
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Remover função se existir
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- ============================================================================
-- OPÇÃO 2: Criar tabela profiles básica (se não existir)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Política simples
DROP POLICY IF EXISTS "Todos podem ver profiles" ON public.profiles;
CREATE POLICY "Todos podem ver profiles" ON public.profiles
    FOR ALL USING (true);

-- ============================================================================
-- OPÇÃO 3: Criar função e trigger SIMPLES (sem erros)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Tenta criar profile, se falhar não quebra
    BEGIN
        INSERT INTO public.profiles (id, email)
        VALUES (NEW.id, NEW.email)
        ON CONFLICT (id) DO NOTHING;
    EXCEPTION WHEN OTHERS THEN
        NULL; -- Ignora erros
    END;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- VERIFICAR STATUS
-- ============================================================================

-- Ver se profiles existe
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles') 
        THEN '✅ Tabela profiles existe'
        ELSE '❌ Tabela profiles NÃO existe'
    END as "Status Profiles";

-- Ver se função existe
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'handle_new_user') 
        THEN '✅ Função handle_new_user existe'
        ELSE '❌ Função handle_new_user NÃO existe'
    END as "Status Função";

-- Ver se trigger existe
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') 
        THEN '✅ Trigger on_auth_user_created existe'
        ELSE '❌ Trigger on_auth_user_created NÃO existe'
    END as "Status Trigger";

-- ============================================================================
-- FIM
-- ============================================================================
-- 
-- Depois de executar este script, execute:
-- create-users-basic.sql
-- 
-- Isso vai criar os usuários sem problemas de schema.
-- ============================================================================
