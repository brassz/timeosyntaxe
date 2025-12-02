-- ============================================================================
-- SCRIPT DE CONFIGURAÇÃO COMPLETA DO BANCO DE DADOS
-- Sistema de Checklist e OSI - Terraplanagem Guimarães Serra LTDA
-- ============================================================================
-- 
-- INSTRUÇÕES:
-- 1. Acesse o Supabase Dashboard (https://app.supabase.com)
-- 2. Selecione seu projeto
-- 3. Vá para "SQL Editor"
-- 4. Cole este script completo
-- 5. Clique em "Run" para executar
-- 
-- O que este script faz:
-- ✅ Cria tabela de checklists (retenção de 7 dias)
-- ✅ Cria tabela de ordens de serviço (armazenamento permanente)
-- ✅ Configura políticas de segurança (RLS)
-- ✅ Cria índices para otimização
-- ✅ Cria função de limpeza automática (apenas checklists)
-- ✅ Configura numeração automática de ordens
-- ============================================================================

-- ============================================================================
-- PARTE 1: TABELA DE CHECKLISTS
-- ============================================================================
-- Armazena os checklists de inspeção de máquinas
-- RETENÇÃO: 7 dias (limpeza automática configurada)
-- ============================================================================

DROP TABLE IF EXISTS public.checklists CASCADE;

CREATE TABLE public.checklists (
    id TEXT PRIMARY KEY,
    operator TEXT NOT NULL,
    machine TEXT NOT NULL,
    location TEXT NOT NULL,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    horimeter TEXT,
    mileage TEXT,
    tag TEXT,
    items JSONB NOT NULL,
    completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comentário da tabela
COMMENT ON TABLE public.checklists IS 'Checklists de inspeção de máquinas pesadas - Retenção de 7 dias';

-- Comentários das colunas
COMMENT ON COLUMN public.checklists.id IS 'Identificador único do checklist';
COMMENT ON COLUMN public.checklists.operator IS 'Nome do operador que realizou a inspeção';
COMMENT ON COLUMN public.checklists.machine IS 'Tipo de máquina inspecionada';
COMMENT ON COLUMN public.checklists.location IS 'Local da inspeção';
COMMENT ON COLUMN public.checklists.date IS 'Data e hora da inspeção';
COMMENT ON COLUMN public.checklists.horimeter IS 'Leitura do horímetro';
COMMENT ON COLUMN public.checklists.mileage IS 'Quilometragem (se aplicável)';
COMMENT ON COLUMN public.checklists.tag IS 'TAG de identificação do equipamento';
COMMENT ON COLUMN public.checklists.items IS 'Array JSON com os itens do checklist';
COMMENT ON COLUMN public.checklists.completed IS 'Indica se o checklist foi finalizado';
COMMENT ON COLUMN public.checklists.created_at IS 'Data de criação do registro';

-- Índice para otimizar consultas por data
CREATE INDEX idx_checklists_created_at ON public.checklists(created_at DESC);
CREATE INDEX idx_checklists_operator ON public.checklists(operator);
CREATE INDEX idx_checklists_machine ON public.checklists(machine);

-- ============================================================================
-- PARTE 2: TABELA DE ORDENS DE SERVIÇO (OSI)
-- ============================================================================
-- Armazena as ordens de serviço interno
-- RETENÇÃO: PERMANENTE (nunca deletadas)
-- ============================================================================

DROP TABLE IF EXISTS public.service_orders CASCADE;
DROP SEQUENCE IF EXISTS service_order_number_seq CASCADE;

CREATE TABLE public.service_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number INTEGER UNIQUE NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    vehicle TEXT NOT NULL,
    km_initial TEXT,
    km_final TEXT,
    equipment TEXT,
    tag TEXT,
    horimeter TEXT,
    maintenance_type TEXT[] DEFAULT '{}',
    service_description TEXT,
    parts_applied TEXT,
    observations TEXT,
    mechanic TEXT,
    responsible TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comentário da tabela
COMMENT ON TABLE public.service_orders IS 'Ordens de Serviço Interno - ARMAZENAMENTO PERMANENTE';

-- Comentários das colunas
COMMENT ON COLUMN public.service_orders.id IS 'Identificador único UUID';
COMMENT ON COLUMN public.service_orders.order_number IS 'Número sequencial da ordem (inicia em 2200)';
COMMENT ON COLUMN public.service_orders.date IS 'Data do serviço';
COMMENT ON COLUMN public.service_orders.time IS 'Hora do serviço';
COMMENT ON COLUMN public.service_orders.vehicle IS 'Veículo/Equipamento';
COMMENT ON COLUMN public.service_orders.km_initial IS 'Quilometragem inicial';
COMMENT ON COLUMN public.service_orders.km_final IS 'Quilometragem final';
COMMENT ON COLUMN public.service_orders.equipment IS 'Descrição do equipamento';
COMMENT ON COLUMN public.service_orders.tag IS 'TAG de identificação';
COMMENT ON COLUMN public.service_orders.horimeter IS 'Leitura do horímetro';
COMMENT ON COLUMN public.service_orders.maintenance_type IS 'Tipos de manutenção (array)';
COMMENT ON COLUMN public.service_orders.service_description IS 'Descrição dos serviços realizados';
COMMENT ON COLUMN public.service_orders.parts_applied IS 'Peças aplicadas';
COMMENT ON COLUMN public.service_orders.observations IS 'Observações adicionais';
COMMENT ON COLUMN public.service_orders.mechanic IS 'Nome do mecânico responsável';
COMMENT ON COLUMN public.service_orders.responsible IS 'Nome do responsável pela obra';
COMMENT ON COLUMN public.service_orders.created_at IS 'Data de criação do registro';
COMMENT ON COLUMN public.service_orders.updated_at IS 'Data da última atualização';

-- Criar sequência para numeração das ordens (inicia em 2200)
CREATE SEQUENCE service_order_number_seq START WITH 2200 INCREMENT BY 1;

-- Índices para otimização
CREATE INDEX idx_service_orders_order_number ON public.service_orders(order_number DESC);
CREATE INDEX idx_service_orders_created_at ON public.service_orders(created_at DESC);
CREATE INDEX idx_service_orders_date ON public.service_orders(date DESC);
CREATE INDEX idx_service_orders_vehicle ON public.service_orders(vehicle);

-- ============================================================================
-- PARTE 3: FUNÇÃO DE AUTO-NUMERAÇÃO DE ORDENS
-- ============================================================================
-- Gera automaticamente o número da ordem ao inserir novo registro
-- ============================================================================

CREATE OR REPLACE FUNCTION auto_order_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_number IS NULL THEN
        NEW.order_number := nextval('service_order_number_seq');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION auto_order_number() IS 'Gera automaticamente número sequencial para ordens de serviço';

-- Trigger para executar a função
DROP TRIGGER IF EXISTS trigger_auto_order_number ON public.service_orders;
CREATE TRIGGER trigger_auto_order_number
    BEFORE INSERT ON public.service_orders
    FOR EACH ROW
    EXECUTE FUNCTION auto_order_number();

-- ============================================================================
-- PARTE 4: FUNÇÃO DE ATUALIZAÇÃO DE TIMESTAMP
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_service_orders_updated_at ON public.service_orders;
CREATE TRIGGER trigger_update_service_orders_updated_at
    BEFORE UPDATE ON public.service_orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- PARTE 5: FUNÇÃO DE LIMPEZA DE CHECKLISTS ANTIGOS
-- ============================================================================
-- Remove checklists com mais de 7 dias
-- IMPORTANTE: Apenas checklists são deletados, ordens de serviço são permanentes
-- ============================================================================

CREATE OR REPLACE FUNCTION cleanup_old_checklists()
RETURNS TABLE(deleted_count INTEGER) AS $$
DECLARE
    rows_deleted INTEGER;
BEGIN
    -- Remove apenas checklists com mais de 7 dias
    DELETE FROM public.checklists
    WHERE created_at < NOW() - INTERVAL '7 days';
    
    -- Retorna quantidade de registros deletados
    GET DIAGNOSTICS rows_deleted = ROW_COUNT;
    deleted_count := rows_deleted;
    RETURN NEXT;
    
    -- Log da operação
    RAISE NOTICE 'Limpeza automática executada: % checklist(s) deletado(s)', rows_deleted;
    
    -- As ordens de serviço (service_orders) NÃO são afetadas
    -- Elas permanecem no banco de dados permanentemente
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION cleanup_old_checklists() IS 'Remove checklists com mais de 7 dias - Não afeta ordens de serviço';

-- Grant de execução
GRANT EXECUTE ON FUNCTION cleanup_old_checklists() TO anon, authenticated;

-- ============================================================================
-- PARTE 6: ROW LEVEL SECURITY (RLS)
-- ============================================================================
-- Configuração de segurança e controle de acesso
-- ============================================================================

-- Habilitar RLS nas tabelas
ALTER TABLE public.checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_orders ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- POLÍTICAS PARA CHECKLISTS
-- ============================================================================

-- Remover políticas existentes
DROP POLICY IF EXISTS "Allow all for authenticated users" ON public.checklists;
DROP POLICY IF EXISTS "Allow read for anon" ON public.checklists;
DROP POLICY IF EXISTS "Allow all for anon" ON public.checklists;

-- Permitir todas as operações para usuários autenticados
CREATE POLICY "checklists_all_authenticated" ON public.checklists
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Permitir leitura para usuários anônimos
CREATE POLICY "checklists_select_anon" ON public.checklists
    FOR SELECT
    TO anon
    USING (true);

-- Permitir insert/update/delete para usuários anônimos
CREATE POLICY "checklists_all_anon" ON public.checklists
    FOR ALL
    TO anon
    USING (true)
    WITH CHECK (true);

-- ============================================================================
-- POLÍTICAS PARA ORDENS DE SERVIÇO
-- ============================================================================

-- Remover políticas existentes
DROP POLICY IF EXISTS "Allow all for authenticated users" ON public.service_orders;
DROP POLICY IF EXISTS "Allow insert for anon" ON public.service_orders;
DROP POLICY IF EXISTS "Allow read for anon" ON public.service_orders;

-- Permitir todas as operações para usuários autenticados
CREATE POLICY "service_orders_all_authenticated" ON public.service_orders
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Permitir insert para usuários anônimos
CREATE POLICY "service_orders_insert_anon" ON public.service_orders
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Permitir leitura para usuários anônimos
CREATE POLICY "service_orders_select_anon" ON public.service_orders
    FOR SELECT
    TO anon
    USING (true);

-- ============================================================================
-- PARTE 7: ESTATÍSTICAS E MONITORAMENTO
-- ============================================================================

-- Função para obter estatísticas do sistema
CREATE OR REPLACE FUNCTION get_system_stats()
RETURNS TABLE(
    total_checklists BIGINT,
    total_service_orders BIGINT,
    oldest_checklist TIMESTAMP WITH TIME ZONE,
    newest_checklist TIMESTAMP WITH TIME ZONE,
    oldest_service_order TIMESTAMP WITH TIME ZONE,
    newest_service_order TIMESTAMP WITH TIME ZONE,
    last_order_number INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM public.checklists),
        (SELECT COUNT(*) FROM public.service_orders),
        (SELECT MIN(created_at) FROM public.checklists),
        (SELECT MAX(created_at) FROM public.checklists),
        (SELECT MIN(created_at) FROM public.service_orders),
        (SELECT MAX(created_at) FROM public.service_orders),
        (SELECT MAX(order_number) FROM public.service_orders);
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION get_system_stats() IS 'Retorna estatísticas do sistema';

-- ============================================================================
-- PARTE 8: CONFIGURAÇÃO OPCIONAL - CRON JOB
-- ============================================================================
-- Para configurar limpeza automática diária, execute o comando abaixo
-- APÓS habilitar a extensão pg_cron no Supabase
-- ============================================================================

-- INSTRUÇÕES PARA CONFIGURAR CRON:
-- 1. Vá em Database → Extensions
-- 2. Habilite a extensão 'pg_cron'
-- 3. Execute o comando abaixo (descomente removendo os --)

-- SELECT cron.schedule(
--     'cleanup-old-checklists-daily',
--     '0 0 * * *',  -- Todo dia à meia-noite
--     'SELECT cleanup_old_checklists();'
-- );

-- Para verificar cron jobs ativos:
-- SELECT * FROM cron.job;

-- Para desabilitar o cron job:
-- SELECT cron.unschedule('cleanup-old-checklists-daily');

-- ============================================================================
-- PARTE 9: DADOS DE TESTE (OPCIONAL)
-- ============================================================================
-- Descomente para inserir dados de exemplo
-- ============================================================================

-- Inserir checklist de exemplo
-- INSERT INTO public.checklists (
--     id, operator, machine, location, date, horimeter, tag, items, completed
-- ) VALUES (
--     'test-' || gen_random_uuid()::text,
--     'João Silva',
--     'Escavadeira',
--     'Obra Centro',
--     NOW(),
--     '1234.5',
--     'ESC-001',
--     '[{"id":"1","name":"Pneus","status":"C","observation":"Ok","photos":[]}]'::jsonb,
--     true
-- );

-- Inserir ordem de serviço de exemplo
-- INSERT INTO public.service_orders (
--     date, time, vehicle, equipment, tag, horimeter,
--     maintenance_type, service_description, mechanic, responsible
-- ) VALUES (
--     CURRENT_DATE,
--     CURRENT_TIME,
--     'Escavadeira Hidráulica',
--     'CAT 320D',
--     'ESC-001',
--     '1234.5',
--     ARRAY['PREVENTIVA', 'CORRETIVA'],
--     'Troca de óleo e filtros. Verificação do sistema hidráulico.',
--     'Carlos Mecânico',
--     'Pedro Responsável'
-- );

-- ============================================================================
-- PARTE 10: VERIFICAÇÃO FINAL
-- ============================================================================
-- Executa verificações para garantir que tudo foi criado corretamente
-- ============================================================================

DO $$ 
DECLARE
    v_checklists_exists BOOLEAN;
    v_service_orders_exists BOOLEAN;
    v_sequence_exists BOOLEAN;
BEGIN
    -- Verificar tabelas
    SELECT EXISTS (
        SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'checklists'
    ) INTO v_checklists_exists;
    
    SELECT EXISTS (
        SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'service_orders'
    ) INTO v_service_orders_exists;
    
    SELECT EXISTS (
        SELECT FROM pg_sequences WHERE schemaname = 'public' AND sequencename = 'service_order_number_seq'
    ) INTO v_sequence_exists;
    
    -- Exibir resultados
    RAISE NOTICE '============================================';
    RAISE NOTICE 'VERIFICAÇÃO DE INSTALAÇÃO';
    RAISE NOTICE '============================================';
    RAISE NOTICE 'Tabela checklists: %', CASE WHEN v_checklists_exists THEN '✅ OK' ELSE '❌ ERRO' END;
    RAISE NOTICE 'Tabela service_orders: %', CASE WHEN v_service_orders_exists THEN '✅ OK' ELSE '❌ ERRO' END;
    RAISE NOTICE 'Sequence order_number: %', CASE WHEN v_sequence_exists THEN '✅ OK' ELSE '❌ ERRO' END;
    RAISE NOTICE '============================================';
    
    IF v_checklists_exists AND v_service_orders_exists AND v_sequence_exists THEN
        RAISE NOTICE '✅ INSTALAÇÃO COMPLETA COM SUCESSO!';
        RAISE NOTICE '';
        RAISE NOTICE 'Próximos passos:';
        RAISE NOTICE '1. Criar usuários administrativos';
        RAISE NOTICE '2. Configurar pg_cron (opcional)';
        RAISE NOTICE '3. Testar inserção de dados';
    ELSE
        RAISE EXCEPTION 'Erro na instalação. Verifique os logs acima.';
    END IF;
END $$;

-- ============================================================================
-- FIM DO SCRIPT
-- ============================================================================
-- 
-- ✅ Script executado com sucesso!
-- 
-- PRÓXIMOS PASSOS:
-- 1. Criar usuário administrativo (ver SETUP_SUPABASE.md)
-- 2. Configurar pg_cron para limpeza automática (opcional)
-- 3. Testar o sistema com dados reais
-- 
-- IMPORTANTE:
-- - Checklists: Retenção de 7 dias
-- - Ordens de Serviço: Armazenamento permanente
-- 
-- Para suporte, consulte a documentação do projeto.
-- ============================================================================

-- Exibir estatísticas iniciais
SELECT * FROM get_system_stats();
