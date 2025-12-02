-- ============================================================================
-- SCRIPT DE REVERSÃO - LIMPAR TUDO RELACIONADO A AUTH DO SUPABASE
-- ============================================================================
-- 
-- Este script remove tudo que foi criado com auth.users do Supabase
-- Execute este script ANTES de implementar a nova autenticação
-- 
-- ATENÇÃO: Este script vai DELETAR os usuários criados no auth.users
-- ============================================================================

-- ============================================================================
-- PARTE 1: Remover Usuários Criados
-- ============================================================================

DELETE FROM auth.users 
WHERE email IN (
    'gustavo@terraplanagemguimaraes.com',
    'admin@terraplanagemguimaraes.com'
);

-- Remover todos os outros usuários que possam ter sido criados
-- (Descomente a linha abaixo se quiser limpar TODOS os usuários)
-- DELETE FROM auth.users WHERE email LIKE '%terraplanagemguimaraes%';

-- ============================================================================
-- PARTE 2: Remover Tabela Profiles e Dependências
-- ============================================================================

-- Remover trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Remover função
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Remover tabela profiles
DROP TABLE IF EXISTS public.profiles CASCADE;

-- ============================================================================
-- PARTE 3: Verificação
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '════════════════════════════════════════════════════════════';
    RAISE NOTICE '          REVERSÃO COMPLETA - RESULTADO';
    RAISE NOTICE '════════════════════════════════════════════════════════════';
    RAISE NOTICE '';
    RAISE NOTICE '✅ Usuários do auth.users removidos';
    RAISE NOTICE '✅ Trigger on_auth_user_created removido';
    RAISE NOTICE '✅ Função handle_new_user removida';
    RAISE NOTICE '✅ Tabela profiles removida';
    RAISE NOTICE '';
    RAISE NOTICE '════════════════════════════════════════════════════════════';
    RAISE NOTICE '';
    RAISE NOTICE '🎯 Sistema limpo e pronto para nova implementação';
    RAISE NOTICE '';
    RAISE NOTICE 'Próximos passos:';
    RAISE NOTICE '1. Execute o script: setup-custom-auth.sql';
    RAISE NOTICE '2. Execute o script: create-users-custom.sql';
    RAISE NOTICE '3. Atualize o código da aplicação';
    RAISE NOTICE '';
    RAISE NOTICE '════════════════════════════════════════════════════════════';
END $$;

-- ============================================================================
-- FIM DO SCRIPT DE REVERSÃO
-- ============================================================================
