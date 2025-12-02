-- ============================================================================
-- CRIAR TODOS OS USUÁRIOS ADMINISTRATIVOS - SCRIPT COMPLETO
-- Terraplanagem Guimarães Serra LTDA
-- ============================================================================
-- 
-- Este script cria todos os usuários administrativos do sistema
-- 
-- USUÁRIOS QUE SERÃO CRIADOS:
-- 
-- 1. Gustavo
--    Email: gustavo@terraplanagemguimaraes.com
--    Senha: terraplanagem2025
-- 
-- 2. Admin
--    Email: admin@terraplanagemguimaraes.com
--    Senha: administrador2025
-- 
-- INSTRUÇÕES:
-- 1. Acesse o Supabase Dashboard (https://app.supabase.com)
-- 2. Selecione seu projeto
-- 3. Vá para "SQL Editor"
-- 4. Clique em "New Query"
-- 5. Cole este script completo
-- 6. Clique em "Run" ou pressione Ctrl+Enter
-- 7. Aguarde as mensagens de confirmação
-- ============================================================================

-- ============================================================================
-- USUÁRIO 1: GUSTAVO
-- ============================================================================

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

-- ============================================================================
-- USUÁRIO 2: ADMIN
-- ============================================================================

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

-- ============================================================================
-- VERIFICAÇÃO E CONFIRMAÇÃO
-- ============================================================================

DO $$
DECLARE
    gustavo_exists BOOLEAN;
    admin_exists BOOLEAN;
    gustavo_id UUID;
    admin_id UUID;
    total_users INTEGER;
BEGIN
    -- Verificar se usuários existem
    SELECT EXISTS (
        SELECT 1 FROM auth.users 
        WHERE email = 'gustavo@terraplanagemguimaraes.com'
    ) INTO gustavo_exists;
    
    SELECT EXISTS (
        SELECT 1 FROM auth.users 
        WHERE email = 'admin@terraplanagemguimaraes.com'
    ) INTO admin_exists;
    
    -- Contar total de usuários
    SELECT COUNT(*) INTO total_users FROM auth.users;
    
    -- Exibir resultados
    RAISE NOTICE '';
    RAISE NOTICE '╔════════════════════════════════════════════════════════════╗';
    RAISE NOTICE '║         CRIAÇÃO DE USUÁRIOS - RESULTADO                    ║';
    RAISE NOTICE '╚════════════════════════════════════════════════════════════╝';
    RAISE NOTICE '';
    
    -- Usuário Gustavo
    IF gustavo_exists THEN
        SELECT id INTO gustavo_id FROM auth.users 
        WHERE email = 'gustavo@terraplanagemguimaraes.com';
        
        RAISE NOTICE '✅ USUÁRIO 1 - GUSTAVO';
        RAISE NOTICE '   📧 Email: gustavo@terraplanagemguimaraes.com';
        RAISE NOTICE '   🔑 Senha: terraplanagem2025';
        RAISE NOTICE '   🆔 ID: %', gustavo_id;
    ELSE
        RAISE NOTICE '❌ USUÁRIO 1 - GUSTAVO - ERRO NA CRIAÇÃO';
    END IF;
    
    RAISE NOTICE '';
    RAISE NOTICE '────────────────────────────────────────────────────────────';
    RAISE NOTICE '';
    
    -- Usuário Admin
    IF admin_exists THEN
        SELECT id INTO admin_id FROM auth.users 
        WHERE email = 'admin@terraplanagemguimaraes.com';
        
        RAISE NOTICE '✅ USUÁRIO 2 - ADMIN';
        RAISE NOTICE '   📧 Email: admin@terraplanagemguimaraes.com';
        RAISE NOTICE '   🔑 Senha: administrador2025';
        RAISE NOTICE '   🆔 ID: %', admin_id;
    ELSE
        RAISE NOTICE '❌ USUÁRIO 2 - ADMIN - ERRO NA CRIAÇÃO';
    END IF;
    
    RAISE NOTICE '';
    RAISE NOTICE '════════════════════════════════════════════════════════════';
    RAISE NOTICE '';
    RAISE NOTICE '📊 RESUMO:';
    RAISE NOTICE '   Total de usuários no sistema: %', total_users;
    RAISE NOTICE '   Usuários criados neste script: %', 
        CASE WHEN gustavo_exists THEN 1 ELSE 0 END + 
        CASE WHEN admin_exists THEN 1 ELSE 0 END;
    RAISE NOTICE '';
    RAISE NOTICE '⚠️  IMPORTANTE:';
    RAISE NOTICE '   • Troque as senhas após o primeiro acesso';
    RAISE NOTICE '   • Não compartilhe estas credenciais';
    RAISE NOTICE '   • Use senhas fortes em produção';
    RAISE NOTICE '';
    RAISE NOTICE '════════════════════════════════════════════════════════════';
    RAISE NOTICE '';
    
    -- Verificar se houve falhas
    IF NOT (gustavo_exists AND admin_exists) THEN
        RAISE WARNING 'Alguns usuários não foram criados. Verifique os logs acima.';
    ELSE
        RAISE NOTICE '🎉 TODOS OS USUÁRIOS FORAM CRIADOS COM SUCESSO!';
    END IF;
    
    RAISE NOTICE '';
END $$;

-- ============================================================================
-- LISTAR TODOS OS USUÁRIOS
-- ============================================================================

SELECT 
    email AS "Email",
    created_at AS "Data de Criação",
    last_sign_in_at AS "Último Acesso",
    CASE 
        WHEN email_confirmed_at IS NOT NULL THEN '✅ Confirmado'
        ELSE '⏳ Pendente'
    END AS "Status"
FROM auth.users
ORDER BY created_at DESC;

-- ============================================================================
-- FIM DO SCRIPT
-- ============================================================================
-- 
-- ✅ Script executado!
-- 
-- PRÓXIMOS PASSOS:
-- 1. Fazer login no sistema com as credenciais criadas
-- 2. Trocar as senhas padrão
-- 3. Testar o acesso ao Painel OSI
-- 
-- Para criar mais usuários, consulte o arquivo USUARIOS.md
-- ============================================================================
