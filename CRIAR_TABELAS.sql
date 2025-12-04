-- ============================================
-- SQL PARA CRIAR TABELAS NO SUPABASE
-- ============================================
-- Cole este código no SQL Editor do Supabase
-- (Dashboard > SQL Editor > New Query > Cole e Execute)
-- ============================================

-- Criar tabela de usuários
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Inserir usuários de teste
INSERT INTO users (username, password, name) VALUES 
  ('admin', 'admin123', 'Administrador'),
  ('mecanico', 'mecanico123', 'João Silva'),
  ('supervisor', 'supervisor123', 'Maria Santos');

-- Criar tabela de checklists
CREATE TABLE checklists (
  id VARCHAR(255) PRIMARY KEY,
  operator VARCHAR(100) NOT NULL,
  machine VARCHAR(100) NOT NULL,
  location VARCHAR(200) NOT NULL,
  date TIMESTAMP NOT NULL,
  horimeter VARCHAR(50),
  mileage VARCHAR(50),
  tag VARCHAR(50),
  items JSONB NOT NULL,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_checklists_created_at ON checklists(created_at DESC);
CREATE INDEX idx_checklists_operator ON checklists(operator);

-- Criar tabela de OSI (Ordem de Serviço Interna)
CREATE TABLE osi_orders (
  id SERIAL PRIMARY KEY,
  order_number INTEGER UNIQUE NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  vehicle VARCHAR(100) NOT NULL,
  equipment VARCHAR(100),
  km_inicial VARCHAR(50),
  km_final VARCHAR(50),
  tag VARCHAR(50),
  horimeter VARCHAR(50),
  maintenance_type JSONB NOT NULL,
  services_description TEXT NOT NULL,
  parts_applied TEXT,
  observations TEXT,
  mechanic VARCHAR(100),
  responsible VARCHAR(100),
  photos JSONB,
  created_by VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_osi_orders_created_at ON osi_orders(created_at DESC);
CREATE INDEX idx_osi_orders_order_number ON osi_orders(order_number DESC);
CREATE INDEX idx_osi_orders_created_by ON osi_orders(created_by);

-- Desativar RLS (Row Level Security) para desenvolvimento
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE checklists DISABLE ROW LEVEL SECURITY;
ALTER TABLE osi_orders DISABLE ROW LEVEL SECURITY;

-- ============================================
-- PRONTO! Após executar, você verá:
-- ✅ Success. No rows returned
-- ============================================
