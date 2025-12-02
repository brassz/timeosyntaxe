-- SQL script to set up Supabase tables
-- Run this in your Supabase SQL Editor

-- Create checklists table
CREATE TABLE IF NOT EXISTS public.checklists (
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

-- Create index for date-based queries
CREATE INDEX IF NOT EXISTS idx_checklists_created_at ON public.checklists(created_at);

-- Enable Row Level Security
ALTER TABLE public.checklists ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for authenticated users
CREATE POLICY "Allow all for authenticated users" ON public.checklists
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Create policy to allow read for anon users
CREATE POLICY "Allow read for anon" ON public.checklists
    FOR SELECT
    TO anon
    USING (true);

-- Create policy to allow insert/update/delete for anon users
CREATE POLICY "Allow all for anon" ON public.checklists
    FOR ALL
    TO anon
    USING (true)
    WITH CHECK (true);

-- Create service_orders table
CREATE TABLE IF NOT EXISTS public.service_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number INTEGER UNIQUE,
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sequence for order numbers
CREATE SEQUENCE IF NOT EXISTS service_order_number_seq START WITH 2200;

-- Create index for order number
CREATE INDEX IF NOT EXISTS idx_service_orders_order_number ON public.service_orders(order_number);

-- Enable Row Level Security
ALTER TABLE public.service_orders ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for authenticated users
CREATE POLICY "Allow all for authenticated users" ON public.service_orders
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Create policy to allow insert for anon users
CREATE POLICY "Allow insert for anon" ON public.service_orders
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Create policy to allow read for anon users
CREATE POLICY "Allow read for anon" ON public.service_orders
    FOR SELECT
    TO anon
    USING (true);

-- Create function to auto-generate order numbers
CREATE OR REPLACE FUNCTION auto_order_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_number IS NULL THEN
        NEW.order_number := nextval('service_order_number_seq');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate order numbers
DROP TRIGGER IF EXISTS trigger_auto_order_number ON public.service_orders;
CREATE TRIGGER trigger_auto_order_number
    BEFORE INSERT ON public.service_orders
    FOR EACH ROW
    EXECUTE FUNCTION auto_order_number();

-- Create function to clean up old checklists (older than 7 days)
CREATE OR REPLACE FUNCTION cleanup_old_checklists()
RETURNS void AS $$
BEGIN
    DELETE FROM public.checklists
    WHERE created_at < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission on the cleanup function
GRANT EXECUTE ON FUNCTION cleanup_old_checklists() TO anon, authenticated;

-- Note: You may want to set up a cron job to run this function daily
-- This can be done using pg_cron extension or an external scheduler
