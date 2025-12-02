-- ============================================================================
-- CRIAR USUÁRIOS - VERSÃO BÁSICA (SEM PROFILES)
-- ============================================================================
-- 
-- Esta é a versão mais simples possível - apenas cria usuários
-- Não precisa de tabela profiles nem triggers
-- 
-- USUÁRIOS:
-- 1. gustavo@terraplanagemguimaraes.com - Senha: terraplanagem2025
-- 2. admin@terraplanagemguimaraes.com - Senha: administrador2025
-- 
-- INSTRUÇÕES:
-- 1. Copie ESTE SCRIPT COMPLETO
-- 2. Cole no SQL Editor do Supabase
-- 3. Execute
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
    SELECT 1 FROM auth.users WHERE email = 'gustavo@terraplanagemguimaraes.com'
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
    SELECT 1 FROM auth.users WHERE email = 'admin@terraplanagemguimaraes.com'
);

-- Verificar resultado
SELECT 
    email,
    created_at,
    email_confirmed_at IS NOT NULL as confirmado
FROM auth.users
WHERE email IN ('gustavo@terraplanagemguimaraes.com', 'admin@terraplanagemguimaraes.com')
ORDER BY created_at DESC;
