-- ============================================================================
-- CRIAR USUÁRIOS - VERSÃO SIMPLIFICADA
-- Terraplanagem Guimarães Serra LTDA
-- ============================================================================
-- 
-- Esta versão funciona sem precisar desabilitar triggers
-- 
-- USUÁRIOS:
-- 1. gustavo@terraplanagemguimaraes.com - Senha: terraplanagem2025
-- 2. admin@terraplanagemguimaraes.com - Senha: administrador2025
-- 
-- INSTRUÇÕES:
-- 1. Acesse o Supabase Dashboard
-- 2. Vá para "SQL Editor"
-- 3. Cole e execute este script
-- ============================================================================

-- ============================================================================
-- PARTE 1: Criar tabela profiles se não existir (correção do erro)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY,
    username TEXT,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Comentário
COMMENT ON TABLE public.profiles IS 'Perfis de usuários do sistema';

-- Habilitar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Criar políticas básicas
DROP POLICY IF EXISTS "Profiles são públicos" ON public.profiles;
CREATE POLICY "Profiles são públicos" ON public.profiles
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Usuários podem atualizar próprio profile" ON public.profiles;
CREATE POLICY "Usuários podem atualizar próprio profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Usuários podem inserir próprio profile" ON public.profiles;
CREATE POLICY "Usuários podem inserir próprio profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================================================
-- PARTE 2: Criar ou substituir função e trigger
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username, full_name)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Se der erro, apenas retorna NEW sem falhar
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recriar trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- PARTE 3: Criar usuários com raw_user_meta_data correto
-- ============================================================================

-- Usuário 1: Gustavo
DO $$
DECLARE
    v_user_id UUID;
BEGIN
    -- Verificar se já existe
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'gustavo@terraplanagemguimaraes.com') THEN
        -- Gerar UUID
        v_user_id := gen_random_uuid();
        
        -- Inserir usuário
        INSERT INTO auth.users (
            instance_id,
            id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at,
            confirmation_token
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            v_user_id,
            'authenticated',
            'authenticated',
            'gustavo@terraplanagemguimaraes.com',
            crypt('terraplanagem2025', gen_salt('bf')),
            NOW(),
            '{"provider":"email","providers":["email"]}'::jsonb,
            '{"name":"Gustavo","username":"gustavo"}'::jsonb,
            NOW(),
            NOW(),
            ''
        );
        
        -- Garantir que profile existe (caso trigger não tenha funcionado)
        INSERT INTO public.profiles (id, username, full_name)
        VALUES (v_user_id, 'gustavo', 'Gustavo')
        ON CONFLICT (id) DO NOTHING;
        
        RAISE NOTICE '✅ Usuário Gustavo criado com sucesso!';
    ELSE
        RAISE NOTICE '⚠️  Usuário Gustavo já existe.';
    END IF;
END $$;

-- Usuário 2: Admin
DO $$
DECLARE
    v_user_id UUID;
BEGIN
    -- Verificar se já existe
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@terraplanagemguimaraes.com') THEN
        -- Gerar UUID
        v_user_id := gen_random_uuid();
        
        -- Inserir usuário
        INSERT INTO auth.users (
            instance_id,
            id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at,
            confirmation_token
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            v_user_id,
            'authenticated',
            'authenticated',
            'admin@terraplanagemguimaraes.com',
            crypt('administrador2025', gen_salt('bf')),
            NOW(),
            '{"provider":"email","providers":["email"]}'::jsonb,
            '{"name":"Administrador","username":"admin"}'::jsonb,
            NOW(),
            NOW(),
            ''
        );
        
        -- Garantir que profile existe (caso trigger não tenha funcionado)
        INSERT INTO public.profiles (id, username, full_name)
        VALUES (v_user_id, 'admin', 'Administrador')
        ON CONFLICT (id) DO NOTHING;
        
        RAISE NOTICE '✅ Usuário Admin criado com sucesso!';
    ELSE
        RAISE NOTICE '⚠️  Usuário Admin já existe.';
    END IF;
END $$;

-- ============================================================================
-- PARTE 4: Verificação Final
-- ============================================================================

DO $$
DECLARE
    v_gustavo_exists BOOLEAN;
    v_admin_exists BOOLEAN;
    v_gustavo_id UUID;
    v_admin_id UUID;
    v_gustavo_profile BOOLEAN;
    v_admin_profile BOOLEAN;
BEGIN
    -- Verificar usuários
    SELECT EXISTS (
        SELECT 1 FROM auth.users WHERE email = 'gustavo@terraplanagemguimaraes.com'
    ) INTO v_gustavo_exists;
    
    SELECT EXISTS (
        SELECT 1 FROM auth.users WHERE email = 'admin@terraplanagemguimaraes.com'
    ) INTO v_admin_exists;
    
    RAISE NOTICE '';
    RAISE NOTICE '════════════════════════════════════════════════════════════';
    RAISE NOTICE '              RESULTADO DA CRIAÇÃO DE USUÁRIOS              ';
    RAISE NOTICE '════════════════════════════════════════════════════════════';
    RAISE NOTICE '';
    
    -- Usuário Gustavo
    IF v_gustavo_exists THEN
        SELECT id INTO v_gustavo_id FROM auth.users 
        WHERE email = 'gustavo@terraplanagemguimaraes.com';
        
        SELECT EXISTS (
            SELECT 1 FROM public.profiles WHERE id = v_gustavo_id
        ) INTO v_gustavo_profile;
        
        RAISE NOTICE '✅ USUÁRIO 1: GUSTAVO';
        RAISE NOTICE '   📧 Email:   gustavo@terraplanagemguimaraes.com';
        RAISE NOTICE '   🔑 Senha:   terraplanagem2025';
        RAISE NOTICE '   🆔 ID:      %', v_gustavo_id;
        RAISE NOTICE '   👤 Profile: %', CASE WHEN v_gustavo_profile THEN '✅ OK' ELSE '⚠️ Não criado' END;
        RAISE NOTICE '';
    ELSE
        RAISE NOTICE '❌ Usuário Gustavo NÃO foi criado';
        RAISE NOTICE '';
    END IF;
    
    -- Usuário Admin
    IF v_admin_exists THEN
        SELECT id INTO v_admin_id FROM auth.users 
        WHERE email = 'admin@terraplanagemguimaraes.com';
        
        SELECT EXISTS (
            SELECT 1 FROM public.profiles WHERE id = v_admin_id
        ) INTO v_admin_profile;
        
        RAISE NOTICE '✅ USUÁRIO 2: ADMIN';
        RAISE NOTICE '   📧 Email:   admin@terraplanagemguimaraes.com';
        RAISE NOTICE '   🔑 Senha:   administrador2025';
        RAISE NOTICE '   🆔 ID:      %', v_admin_id;
        RAISE NOTICE '   👤 Profile: %', CASE WHEN v_admin_profile THEN '✅ OK' ELSE '⚠️ Não criado' END;
        RAISE NOTICE '';
    ELSE
        RAISE NOTICE '❌ Usuário Admin NÃO foi criado';
        RAISE NOTICE '';
    END IF;
    
    RAISE NOTICE '════════════════════════════════════════════════════════════';
    
    IF v_gustavo_exists AND v_admin_exists THEN
        RAISE NOTICE '';
        RAISE NOTICE '🎉 SUCESSO! Ambos os usuários foram criados.';
        RAISE NOTICE '';
        RAISE NOTICE '📝 Próximos passos:';
        RAISE NOTICE '   1. Fazer login no sistema';
        RAISE NOTICE '   2. Testar acesso ao Painel OSI';
        RAISE NOTICE '   3. Trocar senhas após primeiro acesso';
        RAISE NOTICE '';
    ELSIF v_gustavo_exists OR v_admin_exists THEN
        RAISE NOTICE '';
        RAISE NOTICE '⚠️  Alguns usuários já existiam ou não foram criados.';
        RAISE NOTICE '   Verifique a lista acima.';
        RAISE NOTICE '';
    ELSE
        RAISE NOTICE '';
        RAISE NOTICE '❌ Nenhum usuário foi criado. Verifique os erros acima.';
        RAISE NOTICE '';
    END IF;
    
    RAISE NOTICE '════════════════════════════════════════════════════════════';
END $$;

-- ============================================================================
-- PARTE 5: Listar usuários criados
-- ============================================================================

SELECT 
    u.email AS "📧 Email",
    TO_CHAR(u.created_at, 'DD/MM/YYYY HH24:MI') AS "📅 Criado em",
    CASE 
        WHEN u.email_confirmed_at IS NOT NULL THEN '✅ Sim'
        ELSE '❌ Não'
    END AS "Email Confirmado",
    CASE 
        WHEN p.id IS NOT NULL THEN '✅ Sim'
        ELSE '❌ Não'
    END AS "Profile Criado"
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email IN ('gustavo@terraplanagemguimaraes.com', 'admin@terraplanagemguimaraes.com')
ORDER BY u.created_at DESC;

-- ============================================================================
-- FIM DO SCRIPT
-- ============================================================================
-- 
-- ✅ Script executado!
-- 
-- Se os usuários foram criados com sucesso, você pode:
-- 1. Fazer login no sistema com as credenciais acima
-- 2. Acessar o Painel OSI
-- 3. Começar a usar o sistema
-- 
-- Para mais informações, consulte CREDENCIAIS.md
-- ============================================================================
