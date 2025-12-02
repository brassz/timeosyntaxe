-- ============================================================================
-- CONFIGURAÇÃO DE AUTENTICAÇÃO CUSTOMIZADA
-- Sistema de Login com Tabela Própria "users"
-- ============================================================================
-- 
-- Este script cria um sistema de autenticação próprio sem usar auth.users
-- 
-- INSTRUÇÕES:
-- 1. Execute primeiro: revert-auth-supabase.sql (para limpar)
-- 2. Execute este script
-- 3. Execute: create-users-custom.sql (para criar usuários)
-- ============================================================================

-- ============================================================================
-- PARTE 1: Criar Tabela de Usuários
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT,
    role TEXT DEFAULT 'admin',
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Comentários
COMMENT ON TABLE public.users IS 'Tabela de usuários do sistema - Autenticação customizada';
COMMENT ON COLUMN public.users.id IS 'ID único do usuário';
COMMENT ON COLUMN public.users.email IS 'Email do usuário (usado para login)';
COMMENT ON COLUMN public.users.password_hash IS 'Hash da senha (crypt)';
COMMENT ON COLUMN public.users.full_name IS 'Nome completo do usuário';
COMMENT ON COLUMN public.users.role IS 'Função do usuário (admin, user, etc)';
COMMENT ON COLUMN public.users.active IS 'Usuário ativo ou desativado';
COMMENT ON COLUMN public.users.created_at IS 'Data de criação';
COMMENT ON COLUMN public.users.updated_at IS 'Data da última atualização';
COMMENT ON COLUMN public.users.last_login_at IS 'Data do último login';

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_active ON public.users(active);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON public.users(created_at DESC);

-- ============================================================================
-- PARTE 2: Habilitar Row Level Security (RLS)
-- ============================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Política: Usuários podem ler todos os usuários ativos
DROP POLICY IF EXISTS "Users podem ler usuários ativos" ON public.users;
CREATE POLICY "Users podem ler usuários ativos" ON public.users
    FOR SELECT
    USING (active = true);

-- Política: Apenas anon pode fazer operações (para login)
DROP POLICY IF EXISTS "Anon pode acessar users" ON public.users;
CREATE POLICY "Anon pode acessar users" ON public.users
    FOR ALL
    TO anon
    USING (true)
    WITH CHECK (true);

-- ============================================================================
-- PARTE 3: Função de Login
-- ============================================================================

CREATE OR REPLACE FUNCTION public.login_user(
    p_email TEXT,
    p_password TEXT
)
RETURNS TABLE(
    success BOOLEAN,
    user_id UUID,
    email TEXT,
    full_name TEXT,
    role TEXT,
    message TEXT
) AS $$
DECLARE
    v_user RECORD;
    v_password_match BOOLEAN;
BEGIN
    -- Buscar usuário por email
    SELECT * INTO v_user
    FROM public.users
    WHERE users.email = p_email
    AND active = true;
    
    -- Se não encontrou usuário
    IF NOT FOUND THEN
        RETURN QUERY SELECT 
            false,
            NULL::UUID,
            NULL::TEXT,
            NULL::TEXT,
            NULL::TEXT,
            'Email ou senha incorretos'::TEXT;
        RETURN;
    END IF;
    
    -- Verificar senha
    v_password_match := (v_user.password_hash = crypt(p_password, v_user.password_hash));
    
    IF v_password_match THEN
        -- Atualizar último login
        UPDATE public.users
        SET last_login_at = NOW()
        WHERE id = v_user.id;
        
        -- Retornar sucesso
        RETURN QUERY SELECT 
            true,
            v_user.id,
            v_user.email,
            v_user.full_name,
            v_user.role,
            'Login realizado com sucesso'::TEXT;
    ELSE
        -- Senha incorreta
        RETURN QUERY SELECT 
            false,
            NULL::UUID,
            NULL::TEXT,
            NULL::TEXT,
            NULL::TEXT,
            'Email ou senha incorretos'::TEXT;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.login_user IS 'Função para autenticar usuário';

-- Grant de execução
GRANT EXECUTE ON FUNCTION public.login_user TO anon, authenticated;

-- ============================================================================
-- PARTE 4: Função para Trocar Senha
-- ============================================================================

CREATE OR REPLACE FUNCTION public.change_password(
    p_user_id UUID,
    p_old_password TEXT,
    p_new_password TEXT
)
RETURNS TABLE(
    success BOOLEAN,
    message TEXT
) AS $$
DECLARE
    v_user RECORD;
    v_password_match BOOLEAN;
BEGIN
    -- Buscar usuário
    SELECT * INTO v_user
    FROM public.users
    WHERE id = p_user_id;
    
    IF NOT FOUND THEN
        RETURN QUERY SELECT false, 'Usuário não encontrado'::TEXT;
        RETURN;
    END IF;
    
    -- Verificar senha antiga
    v_password_match := (v_user.password_hash = crypt(p_old_password, v_user.password_hash));
    
    IF NOT v_password_match THEN
        RETURN QUERY SELECT false, 'Senha atual incorreta'::TEXT;
        RETURN;
    END IF;
    
    -- Atualizar senha
    UPDATE public.users
    SET 
        password_hash = crypt(p_new_password, gen_salt('bf')),
        updated_at = NOW()
    WHERE id = p_user_id;
    
    RETURN QUERY SELECT true, 'Senha alterada com sucesso'::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.change_password IS 'Função para trocar senha do usuário';

-- ============================================================================
-- PARTE 5: Função de Atualização de Timestamp
-- ============================================================================

CREATE OR REPLACE FUNCTION public.update_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_users_updated_at ON public.users;
CREATE TRIGGER trigger_update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.update_users_updated_at();

-- ============================================================================
-- PARTE 6: View de Usuários (sem senha)
-- ============================================================================

CREATE OR REPLACE VIEW public.users_safe AS
SELECT 
    id,
    email,
    full_name,
    role,
    active,
    created_at,
    updated_at,
    last_login_at
FROM public.users;

COMMENT ON VIEW public.users_safe IS 'View de usuários sem expor hash de senha';

-- ============================================================================
-- PARTE 7: Verificação
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '════════════════════════════════════════════════════════════';
    RAISE NOTICE '     AUTENTICAÇÃO CUSTOMIZADA - INSTALAÇÃO COMPLETA';
    RAISE NOTICE '════════════════════════════════════════════════════════════';
    RAISE NOTICE '';
    RAISE NOTICE '✅ Tabela users criada';
    RAISE NOTICE '✅ Índices criados';
    RAISE NOTICE '✅ RLS habilitado';
    RAISE NOTICE '✅ Função login_user criada';
    RAISE NOTICE '✅ Função change_password criada';
    RAISE NOTICE '✅ Trigger de updated_at criado';
    RAISE NOTICE '✅ View users_safe criada';
    RAISE NOTICE '';
    RAISE NOTICE '════════════════════════════════════════════════════════════';
    RAISE NOTICE '';
    RAISE NOTICE '🎯 Próximo passo:';
    RAISE NOTICE '   Execute: create-users-custom.sql';
    RAISE NOTICE '';
    RAISE NOTICE '════════════════════════════════════════════════════════════';
END $$;

-- ============================================================================
-- FIM DO SCRIPT
-- ============================================================================
