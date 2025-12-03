-- Script SQL para criar as tabelas necessárias no Supabase
-- Execute este script no SQL Editor do Supabase

-- 1. Criar tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario TEXT UNIQUE NOT NULL,
    senha TEXT NOT NULL, -- Hash bcrypt da senha
    nome TEXT NOT NULL,
    cargo TEXT NOT NULL,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Criar tabela de ordens de serviço
CREATE TABLE IF NOT EXISTS osi_ordens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    numero_os SERIAL UNIQUE,
    data DATE NOT NULL,
    hora TEXT NOT NULL,
    veiculo TEXT NOT NULL,
    equipamento TEXT NOT NULL,
    km_inicial TEXT,
    km_final TEXT,
    tag TEXT,
    horimetro TEXT,
    manut_preditiva BOOLEAN DEFAULT FALSE,
    manut_preventiva BOOLEAN DEFAULT FALSE,
    manut_corretiva BOOLEAN DEFAULT FALSE,
    manut_avaria BOOLEAN DEFAULT FALSE,
    manut_oportunidade BOOLEAN DEFAULT FALSE,
    manut_outros BOOLEAN DEFAULT FALSE,
    descricao_servicos TEXT NOT NULL,
    pecas_aplicadas TEXT,
    observacoes TEXT,
    mecanico TEXT NOT NULL,
    responsavel TEXT NOT NULL,
    pdf_url TEXT,
    excel_url TEXT,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Criar índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_osi_ordens_data ON osi_ordens(data);
CREATE INDEX IF NOT EXISTS idx_osi_ordens_numero_os ON osi_ordens(numero_os);
CREATE INDEX IF NOT EXISTS idx_osi_ordens_veiculo ON osi_ordens(veiculo);
CREATE INDEX IF NOT EXISTS idx_osi_ordens_equipamento ON osi_ordens(equipamento);

-- 4. Criar bucket de storage para arquivos OSI (execute via interface do Supabase)
-- Vá em Storage > Create bucket > Nome: "osi-files" > Public: true

-- 5. Inserir usuário de teste (senha: admin123)
-- O hash bcrypt abaixo é de "admin123"
INSERT INTO usuarios (usuario, senha, nome, cargo)
VALUES (
    'admin',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'Administrador',
    'Gerente'
) ON CONFLICT (usuario) DO NOTHING;

-- 6. Políticas de segurança (RLS - Row Level Security)
-- Desabilitar RLS para permitir acesso via anon key (modo desenvolvimento)
-- Para produção, configure políticas adequadas

ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE osi_ordens ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura de usuários (necessário para login)
CREATE POLICY "Permitir leitura de usuários" ON usuarios
    FOR SELECT
    USING (true);

-- Política para permitir todas operações em osi_ordens
CREATE POLICY "Permitir tudo em osi_ordens" ON osi_ordens
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- IMPORTANTE: Para produção, ajuste as políticas de segurança conforme necessário
