-- ============================================================================
-- CRIAR USUÁRIO ADMINISTRATIVO - GUSTAVO
-- ============================================================================
-- 
-- Email: gustavo@terraplanagemguimaraes.com
-- Senha: terraplanagem2025
-- 
-- INSTRUÇÕES:
-- 1. Acesse o Supabase Dashboard
-- 2. Vá para "SQL Editor"
-- 3. Cole e execute este script
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
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
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
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"name":"Gustavo"}'::jsonb,
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
WHERE NOT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE email = 'gustavo@terraplanagemguimaraes.com'
);

-- Verificar se o usuário foi criado
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id UUID;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM auth.users 
        WHERE email = 'gustavo@terraplanagemguimaraes.com'
    ) INTO user_exists;
    
    IF user_exists THEN
        SELECT id INTO user_id FROM auth.users 
        WHERE email = 'gustavo@terraplanagemguimaraes.com';
        
        RAISE NOTICE '============================================';
        RAISE NOTICE '✅ USUÁRIO CRIADO COM SUCESSO!';
        RAISE NOTICE '============================================';
        RAISE NOTICE 'Email: gustavo@terraplanagemguimaraes.com';
        RAISE NOTICE 'Senha: terraplanagem2025';
        RAISE NOTICE 'ID: %', user_id;
        RAISE NOTICE '============================================';
        RAISE NOTICE '';
        RAISE NOTICE '🔐 Credenciais de Login:';
        RAISE NOTICE 'Email: gustavo@terraplanagemguimaraes.com';
        RAISE NOTICE 'Senha: terraplanagem2025';
        RAISE NOTICE '';
        RAISE NOTICE '⚠️  IMPORTANTE: Troque a senha após primeiro acesso!';
        RAISE NOTICE '============================================';
    ELSE
        RAISE EXCEPTION '❌ Erro ao criar usuário. Verifique os logs.';
    END IF;
END $$;

-- Listar todos os usuários para confirmar
SELECT 
    email,
    created_at,
    email_confirmed_at IS NOT NULL as email_confirmed
FROM auth.users
ORDER BY created_at DESC;
