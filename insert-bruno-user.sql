-- Script SQL para inserir o usuário bruno@ti com senha 102030
-- Execute este script no SQL Editor do Supabase Dashboard

-- Primeiro, vamos criar o usuário na tabela auth.users
-- Nota: Este método requer acesso direto ao banco de dados ou uso da API Admin

-- Opção 1: Inserir diretamente na tabela auth.users (requer privilégios de admin)
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
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'bruno@ti',
  crypt('102030', gen_salt('bf')), -- Hash da senha usando bcrypt
  NOW(),
  NULL,
  NULL,
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "Bruno TI"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

-- O trigger on_auth_user_created irá automaticamente criar o perfil na tabela usuarios

-- Verificar se o usuário foi criado corretamente
SELECT 
  u.id,
  u.email,
  u.created_at,
  usr.nome,
  usr.ativo
FROM auth.users u
LEFT JOIN usuarios usr ON u.id = usr.id
WHERE u.email = 'bruno@ti';

-- Caso o trigger não tenha funcionado, você pode criar o perfil manualmente:
-- INSERT INTO usuarios (id, nome, email, ativo)
-- SELECT id, 'Bruno TI', email, true
-- FROM auth.users 
-- WHERE email = 'bruno@ti'
-- AND id NOT IN (SELECT id FROM usuarios);