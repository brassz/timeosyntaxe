-- ============================================================================
-- CRIAR USUÁRIOS - SISTEMA CUSTOMIZADO
-- Tabela: public.users
-- ============================================================================
-- 
-- Este script cria os usuários no sistema de autenticação customizado
-- 
-- USUÁRIOS:
-- 1. gustavo@terraplanagemguimaraes.com - Senha: terraplanagem2025
-- 2. admin@terraplanagemguimaraes.com - Senha: administrador2025
-- 
-- INSTRUÇÕES:
-- 1. Execute primeiro: setup-custom-auth.sql
-- 2. Execute este script
-- ============================================================================

-- ============================================================================
-- CRIAR USUÁRIOS
-- ============================================================================

-- Usuário 1: Gustavo
INSERT INTO public.users (
    email,
    password_hash,
    full_name,
    role,
    active
)
SELECT
    'gustavo@terraplanagemguimaraes.com',
    crypt('terraplanagem2025', gen_salt('bf')),
    'Gustavo',
    'admin',
    true
WHERE NOT EXISTS (
    SELECT 1 FROM public.users WHERE email = 'gustavo@terraplanagemguimaraes.com'
);

-- Usuário 2: Admin
INSERT INTO public.users (
    email,
    password_hash,
    full_name,
    role,
    active
)
SELECT
    'admin@terraplanagemguimaraes.com',
    crypt('administrador2025', gen_salt('bf')),
    'Administrador',
    'admin',
    true
WHERE NOT EXISTS (
    SELECT 1 FROM public.users WHERE email = 'admin@terraplanagemguimaraes.com'
);

-- ============================================================================
-- VERIFICAÇÃO E RESULTADO
-- ============================================================================

DO $$
DECLARE
    v_gustavo_exists BOOLEAN;
    v_admin_exists BOOLEAN;
    v_total_users INTEGER;
BEGIN
    -- Verificar se usuários existem
    SELECT EXISTS (
        SELECT 1 FROM public.users WHERE email = 'gustavo@terraplanagemguimaraes.com'
    ) INTO v_gustavo_exists;
    
    SELECT EXISTS (
        SELECT 1 FROM public.users WHERE email = 'admin@terraplanagemguimaraes.com'
    ) INTO v_admin_exists;
    
    -- Contar total
    SELECT COUNT(*) INTO v_total_users FROM public.users;
    
    RAISE NOTICE '';
    RAISE NOTICE '════════════════════════════════════════════════════════════';
    RAISE NOTICE '          CRIAÇÃO DE USUÁRIOS - RESULTADO';
    RAISE NOTICE '════════════════════════════════════════════════════════════';
    RAISE NOTICE '';
    
    IF v_gustavo_exists THEN
        RAISE NOTICE '✅ USUÁRIO 1: GUSTAVO';
        RAISE NOTICE '   📧 Email: gustavo@terraplanagemguimaraes.com';
        RAISE NOTICE '   🔑 Senha: terraplanagem2025';
        RAISE NOTICE '   👤 Nome:  Gustavo';
        RAISE NOTICE '   🎯 Role:  admin';
    ELSE
        RAISE NOTICE '❌ Usuário Gustavo NÃO foi criado';
    END IF;
    
    RAISE NOTICE '';
    
    IF v_admin_exists THEN
        RAISE NOTICE '✅ USUÁRIO 2: ADMIN';
        RAISE NOTICE '   📧 Email: admin@terraplanagemguimaraes.com';
        RAISE NOTICE '   🔑 Senha: administrador2025';
        RAISE NOTICE '   👤 Nome:  Administrador';
        RAISE NOTICE '   🎯 Role:  admin';
    ELSE
        RAISE NOTICE '❌ Usuário Admin NÃO foi criado';
    END IF;
    
    RAISE NOTICE '';
    RAISE NOTICE '────────────────────────────────────────────────────────────';
    RAISE NOTICE '📊 Total de usuários no sistema: %', v_total_users;
    RAISE NOTICE '════════════════════════════════════════════════════════════';
    
    IF v_gustavo_exists AND v_admin_exists THEN
        RAISE NOTICE '';
        RAISE NOTICE '🎉 SUCESSO! Todos os usuários foram criados.';
        RAISE NOTICE '';
        RAISE NOTICE '🎯 Próximos passos:';
        RAISE NOTICE '   1. Atualizar código da aplicação';
        RAISE NOTICE '   2. Testar login no sistema';
        RAISE NOTICE '';
    END IF;
    
    RAISE NOTICE '════════════════════════════════════════════════════════════';
END $$;

-- ============================================================================
-- LISTAR USUÁRIOS CRIADOS
-- ============================================================================

SELECT 
    email AS "📧 Email",
    full_name AS "👤 Nome",
    role AS "🎯 Role",
    CASE 
        WHEN active THEN '✅ Ativo'
        ELSE '❌ Inativo'
    END AS "Status",
    TO_CHAR(created_at, 'DD/MM/YYYY HH24:MI') AS "📅 Criado em"
FROM public.users
ORDER BY created_at DESC;

-- ============================================================================
-- TESTE DE LOGIN (OPCIONAL)
-- ============================================================================

-- Testar função de login
-- Descomente para testar:

-- SELECT * FROM public.login_user(
--     'gustavo@terraplanagemguimaraes.com',
--     'terraplanagem2025'
-- );

-- ============================================================================
-- FIM DO SCRIPT
-- ============================================================================
