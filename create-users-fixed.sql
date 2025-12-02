-- ============================================================================
-- CRIAR USUÁRIOS ADMINISTRATIVOS - VERSÃO CORRIGIDA
-- Terraplanagem Guimarães Serra LTDA
-- ============================================================================
-- 
-- Este script corrige o erro: relation "public.profiles" does not exist
-- 
-- USUÁRIOS:
-- 1. gustavo@terraplanagemguimaraes.com - Senha: terraplanagem2025
-- 2. admin@terraplanagemguimaraes.com - Senha: administrador2025
-- 
-- INSTRUÇÕES:
-- 1. Acesse o Supabase Dashboard
-- 2. Vá para "SQL Editor"
-- 3. Cole e execute este script completo
-- ============================================================================

-- ============================================================================
-- PARTE 1: Criar tabela profiles se não existir
-- ============================================================================

-- Criar tabela profiles (caso não exista)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Criar políticas
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- ============================================================================
-- PARTE 2: Criar ou substituir função handle_new_user
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username, full_name)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', NEW.email),
        COALESCE(NEW.raw_user_meta_data->>'name', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- PARTE 3: Criar trigger se não existir
-- ============================================================================

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- PARTE 4: Criar usuários
-- ============================================================================

-- Desabilitar temporariamente o trigger para evitar erros
ALTER TABLE auth.users DISABLE TRIGGER on_auth_user_created;

-- Criar usuário Gustavo
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token,
    email_change_token_new
)
SELECT
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'gustavo@terraplanagemguimaraes.com',
    crypt('terraplanagem2025', gen_salt('bf')),
    NOW(),
    '{"name":"Gustavo"}'::jsonb,
    NOW(),
    NOW(),
    '',
    '',
    ''
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
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token,
    email_change_token_new
)
SELECT
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@terraplanagemguimaraes.com',
    crypt('administrador2025', gen_salt('bf')),
    NOW(),
    '{"name":"Admin"}'::jsonb,
    NOW(),
    NOW(),
    '',
    '',
    ''
WHERE NOT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE email = 'admin@terraplanagemguimaraes.com'
);

-- Reabilitar o trigger
ALTER TABLE auth.users ENABLE TRIGGER on_auth_user_created;

-- ============================================================================
-- PARTE 5: Criar profiles manualmente para os usuários criados
-- ============================================================================

-- Profile para Gustavo
INSERT INTO public.profiles (id, username, full_name)
SELECT 
    id,
    'gustavo',
    'Gustavo'
FROM auth.users
WHERE email = 'gustavo@terraplanagemguimaraes.com'
AND NOT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = (
        SELECT id FROM auth.users WHERE email = 'gustavo@terraplanagemguimaraes.com'
    )
);

-- Profile para Admin
INSERT INTO public.profiles (id, username, full_name)
SELECT 
    id,
    'admin',
    'Administrador'
FROM auth.users
WHERE email = 'admin@terraplanagemguimaraes.com'
AND NOT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = (
        SELECT id FROM auth.users WHERE email = 'admin@terraplanagemguimaraes.com'
    )
);

-- ============================================================================
-- PARTE 6: Verificação e Confirmação
-- ============================================================================

DO $$
DECLARE
    gustavo_exists BOOLEAN;
    admin_exists BOOLEAN;
    gustavo_id UUID;
    admin_id UUID;
    gustavo_profile BOOLEAN;
    admin_profile BOOLEAN;
BEGIN
    -- Verificar usuários
    SELECT EXISTS (
        SELECT 1 FROM auth.users WHERE email = 'gustavo@terraplanagemguimaraes.com'
    ) INTO gustavo_exists;
    
    SELECT EXISTS (
        SELECT 1 FROM auth.users WHERE email = 'admin@terraplanagemguimaraes.com'
    ) INTO admin_exists;
    
    RAISE NOTICE '';
    RAISE NOTICE '╔════════════════════════════════════════════════════════════╗';
    RAISE NOTICE '║         CRIAÇÃO DE USUÁRIOS - RESULTADO                    ║';
    RAISE NOTICE '╚════════════════════════════════════════════════════════════╝';
    RAISE NOTICE '';
    
    -- Gustavo
    IF gustavo_exists THEN
        SELECT id INTO gustavo_id FROM auth.users 
        WHERE email = 'gustavo@terraplanagemguimaraes.com';
        
        SELECT EXISTS (
            SELECT 1 FROM public.profiles WHERE id = gustavo_id
        ) INTO gustavo_profile;
        
        RAISE NOTICE '✅ USUÁRIO 1 - GUSTAVO';
        RAISE NOTICE '   📧 Email: gustavo@terraplanagemguimaraes.com';
        RAISE NOTICE '   🔑 Senha: terraplanagem2025';
        RAISE NOTICE '   🆔 ID: %', gustavo_id;
        RAISE NOTICE '   👤 Profile: %', CASE WHEN gustavo_profile THEN '✅ Criado' ELSE '⚠️ Não criado' END;
    ELSE
        RAISE NOTICE '❌ USUÁRIO 1 - GUSTAVO - NÃO FOI CRIADO';
    END IF;
    
    RAISE NOTICE '';
    RAISE NOTICE '────────────────────────────────────────────────────────────';
    RAISE NOTICE '';
    
    -- Admin
    IF admin_exists THEN
        SELECT id INTO admin_id FROM auth.users 
        WHERE email = 'admin@terraplanagemguimaraes.com';
        
        SELECT EXISTS (
            SELECT 1 FROM public.profiles WHERE id = admin_id
        ) INTO admin_profile;
        
        RAISE NOTICE '✅ USUÁRIO 2 - ADMIN';
        RAISE NOTICE '   📧 Email: admin@terraplanagemguimaraes.com';
        RAISE NOTICE '   🔑 Senha: administrador2025';
        RAISE NOTICE '   🆔 ID: %', admin_id;
        RAISE NOTICE '   👤 Profile: %', CASE WHEN admin_profile THEN '✅ Criado' ELSE '⚠️ Não criado' END;
    ELSE
        RAISE NOTICE '❌ USUÁRIO 2 - ADMIN - NÃO FOI CRIADO';
    END IF;
    
    RAISE NOTICE '';
    RAISE NOTICE '════════════════════════════════════════════════════════════';
    RAISE NOTICE '';
    
    IF gustavo_exists AND admin_exists THEN
        RAISE NOTICE '🎉 SUCESSO! Todos os usuários foram criados.';
        RAISE NOTICE '';
        RAISE NOTICE '⚠️  IMPORTANTE:';
        RAISE NOTICE '   • Troque as senhas após primeiro acesso';
        RAISE NOTICE '   • Faça login no sistema para testar';
    ELSE
        RAISE NOTICE '⚠️  ATENÇÃO: Alguns usuários não foram criados.';
        RAISE NOTICE '   Verifique se já existem no sistema.';
    END IF;
    
    RAISE NOTICE '';
    RAISE NOTICE '════════════════════════════════════════════════════════════';
END $$;

-- ============================================================================
-- PARTE 7: Listar usuários criados
-- ============================================================================

SELECT 
    u.email AS "📧 Email",
    u.created_at AS "📅 Criado em",
    CASE 
        WHEN u.email_confirmed_at IS NOT NULL THEN '✅ Confirmado'
        ELSE '⏳ Pendente'
    END AS "Status",
    CASE 
        WHEN p.id IS NOT NULL THEN '✅ Sim'
        ELSE '❌ Não'
    END AS "Profile"
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email IN ('gustavo@terraplanagemguimaraes.com', 'admin@terraplanagemguimaraes.com')
ORDER BY u.created_at DESC;

-- ============================================================================
-- FIM DO SCRIPT
-- ============================================================================
