-- ============================================================================
-- CRIAR USUÁRIOS ADMINISTRATIVOS
-- ============================================================================
-- 
-- USUÁRIO 1 - Gustavo
-- Email: gustavo@terraplanagemguimaraes.com
-- Senha: terraplanagem2025
-- 
-- USUÁRIO 2 - Admin
-- Email: admin@terraplanagemguimaraes.com
-- Senha: administrador2025
-- 
-- INSTRUÇÕES:
-- 1. Acesse o Supabase Dashboard
-- 2. Vá para "SQL Editor"
-- 3. Cole e execute este script completo
-- ============================================================================

-- Criar usuário Gustavo
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at
)
SELECT
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'gustavo@terraplanagemguimaraes.com',
    crypt('terraplanagem2025', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE email = 'gustavo@terraplanagemguimaraes.com'
);

-- Criar usuário Admin
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at
)
SELECT
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@terraplanagemguimaraes.com',
    crypt('administrador2025', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE email = 'admin@terraplanagemguimaraes.com'
);

-- Verificar se os usuários foram criados
DO $$
DECLARE
    gustavo_exists BOOLEAN;
    admin_exists BOOLEAN;
    gustavo_id UUID;
    admin_id UUID;
BEGIN
    -- Verificar Gustavo
    SELECT EXISTS (
        SELECT 1 FROM auth.users 
        WHERE email = 'gustavo@terraplanagemguimaraes.com'
    ) INTO gustavo_exists;
    
    -- Verificar Admin
    SELECT EXISTS (
        SELECT 1 FROM auth.users 
        WHERE email = 'admin@terraplanagemguimaraes.com'
    ) INTO admin_exists;
    
    RAISE NOTICE '============================================';
    RAISE NOTICE '          USUÁRIOS CRIADOS';
    RAISE NOTICE '============================================';
    RAISE NOTICE '';
    
    IF gustavo_exists THEN
        SELECT id INTO gustavo_id FROM auth.users 
        WHERE email = 'gustavo@terraplanagemguimaraes.com';
        
        RAISE NOTICE '✅ USUÁRIO 1 - GUSTAVO';
        RAISE NOTICE '   Email: gustavo@terraplanagemguimaraes.com';
        RAISE NOTICE '   Senha: terraplanagem2025';
        RAISE NOTICE '   ID: %', gustavo_id;
        RAISE NOTICE '';
    ELSE
        RAISE NOTICE '❌ Erro ao criar usuário Gustavo';
        RAISE NOTICE '';
    END IF;
    
    IF admin_exists THEN
        SELECT id INTO admin_id FROM auth.users 
        WHERE email = 'admin@terraplanagemguimaraes.com';
        
        RAISE NOTICE '✅ USUÁRIO 2 - ADMIN';
        RAISE NOTICE '   Email: admin@terraplanagemguimaraes.com';
        RAISE NOTICE '   Senha: administrador2025';
        RAISE NOTICE '   ID: %', admin_id;
        RAISE NOTICE '';
    ELSE
        RAISE NOTICE '❌ Erro ao criar usuário Admin';
        RAISE NOTICE '';
    END IF;
    
    RAISE NOTICE '============================================';
    RAISE NOTICE '⚠️  IMPORTANTE: Troque as senhas após primeiro acesso!';
    RAISE NOTICE '============================================';
    
    IF NOT (gustavo_exists AND admin_exists) THEN
        RAISE EXCEPTION 'Um ou mais usuários não foram criados. Verifique os logs acima.';
    END IF;
END $$;

-- Listar todos os usuários para confirmar
SELECT 
    email,
    created_at,
    email_confirmed_at IS NOT NULL as email_confirmado
FROM auth.users
ORDER BY created_at DESC;
