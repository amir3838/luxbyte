-- Courier Schema - Luxbyte
CREATE TABLE IF NOT EXISTS courier_documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    owner UUID DEFAULT auth.uid() NOT NULL,
    kind TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    public_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS deliveries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    owner UUID DEFAULT auth.uid() NOT NULL,
    code TEXT NOT NULL,
    pickup_name TEXT NOT NULL,
    dropoff_name TEXT NOT NULL,
    phone TEXT,
    distance_km NUMERIC,
    fee NUMERIC NOT NULL,
    status TEXT CHECK (status IN ('pending', 'picked-up', 'in-transit', 'delivered', 'cancelled')) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS vehicle (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    owner UUID DEFAULT auth.uid() NOT NULL,
    make TEXT,
    model TEXT,
    plate TEXT,
    color TEXT,
    year INTEGER,
    health TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS courier_shifts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    owner UUID DEFAULT auth.uid() NOT NULL,
    start_at TIMESTAMPTZ NOT NULL,
    end_at TIMESTAMPTZ,
    total_hours NUMERIC,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS courier_sales (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    owner UUID DEFAULT auth.uid() NOT NULL,
    amount NUMERIC NOT NULL,
    happened_on DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE courier_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle ENABLE ROW LEVEL SECURITY;
ALTER TABLE courier_shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE courier_sales ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "courier_documents_policy" ON courier_documents USING (owner = auth.uid());
CREATE POLICY "deliveries_policy" ON deliveries USING (owner = auth.uid());
CREATE POLICY "vehicle_policy" ON vehicle USING (owner = auth.uid());
CREATE POLICY "courier_shifts_policy" ON courier_shifts USING (owner = auth.uid());
CREATE POLICY "courier_sales_policy" ON courier_sales USING (owner = auth.uid());

-- RPC Functions
CREATE OR REPLACE FUNCTION courier_kpis_today()
RETURNS JSONB AS $$
DECLARE
    result JSONB;
    required_docs INTEGER := 5;
    completed_docs INTEGER;
    activated BOOLEAN;
    deliveries_today INTEGER;
    earnings_today NUMERIC;
    hours_today NUMERIC;
    rating NUMERIC;
BEGIN
    SELECT COUNT(*) INTO completed_docs
    FROM courier_documents
    WHERE owner = auth.uid() AND created_at >= CURRENT_DATE;

    activated := (completed_docs >= required_docs);

    SELECT COUNT(*) INTO deliveries_today
    FROM deliveries
    WHERE owner = auth.uid() AND created_at >= CURRENT_DATE;

    SELECT COALESCE(SUM(fee), 0) INTO earnings_today
    FROM deliveries
    WHERE owner = auth.uid() AND created_at >= CURRENT_DATE AND status = 'delivered';

    SELECT COALESCE(SUM(total_hours), 0) INTO hours_today
    FROM courier_shifts
    WHERE owner = auth.uid() AND DATE(start_at) = CURRENT_DATE;

    rating := 4.5; -- Default rating

    result := jsonb_build_object(
        'required_docs', required_docs,
        'completed_docs', completed_docs,
        'activated', activated,
        'deliveries_today', deliveries_today,
        'earnings_today', earnings_today,
        'hours_today', hours_today,
        'rating', rating
    );

    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION courier_sales_series(days INTEGER DEFAULT 14)
RETURNS TABLE(d DATE, total NUMERIC) AS $$
BEGIN
    RETURN QUERY
    SELECT
        happened_on::DATE as d,
        COALESCE(SUM(amount), 0) as total
    FROM courier_sales
    WHERE owner = auth.uid()
        AND happened_on >= CURRENT_DATE - INTERVAL '1 day' * days
    GROUP BY happened_on::DATE
    ORDER BY happened_on::DATE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Storage Bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('courier_docs', 'courier_docs', true)
ON CONFLICT (id) DO NOTHING;
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    owner UUID DEFAULT auth.uid() NOT NULL,
    kind TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    public_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS deliveries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    owner UUID DEFAULT auth.uid() NOT NULL,
    code TEXT NOT NULL,
    pickup_name TEXT NOT NULL,
    dropoff_name TEXT NOT NULL,
    phone TEXT,
    distance_km NUMERIC,
    fee NUMERIC NOT NULL,
    status TEXT CHECK (status IN ('pending', 'picked-up', 'in-transit', 'delivered', 'cancelled')) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS vehicle (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    owner UUID DEFAULT auth.uid() NOT NULL,
    make TEXT,
    model TEXT,
    plate TEXT,
    color TEXT,
    year INTEGER,
    health TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS courier_shifts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    owner UUID DEFAULT auth.uid() NOT NULL,
    start_at TIMESTAMPTZ NOT NULL,
    end_at TIMESTAMPTZ,
    total_hours NUMERIC,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS courier_sales (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    owner UUID DEFAULT auth.uid() NOT NULL,
    amount NUMERIC NOT NULL,
    happened_on DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE courier_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle ENABLE ROW LEVEL SECURITY;
ALTER TABLE courier_shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE courier_sales ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "courier_documents_policy" ON courier_documents USING (owner = auth.uid());
CREATE POLICY "deliveries_policy" ON deliveries USING (owner = auth.uid());
CREATE POLICY "vehicle_policy" ON vehicle USING (owner = auth.uid());
CREATE POLICY "courier_shifts_policy" ON courier_shifts USING (owner = auth.uid());
CREATE POLICY "courier_sales_policy" ON courier_sales USING (owner = auth.uid());

-- RPC Functions
CREATE OR REPLACE FUNCTION courier_kpis_today()
RETURNS JSONB AS $$
DECLARE
    result JSONB;
    required_docs INTEGER := 5;
    completed_docs INTEGER;
    activated BOOLEAN;
    deliveries_today INTEGER;
    earnings_today NUMERIC;
    hours_today NUMERIC;
    rating NUMERIC;
BEGIN
    SELECT COUNT(*) INTO completed_docs
    FROM courier_documents
    WHERE owner = auth.uid() AND created_at >= CURRENT_DATE;

    activated := (completed_docs >= required_docs);

    SELECT COUNT(*) INTO deliveries_today
    FROM deliveries
    WHERE owner = auth.uid() AND created_at >= CURRENT_DATE;

    SELECT COALESCE(SUM(fee), 0) INTO earnings_today
    FROM deliveries
    WHERE owner = auth.uid() AND created_at >= CURRENT_DATE AND status = 'delivered';

    SELECT COALESCE(SUM(total_hours), 0) INTO hours_today
    FROM courier_shifts
    WHERE owner = auth.uid() AND DATE(start_at) = CURRENT_DATE;

    rating := 4.5; -- Default rating

    result := jsonb_build_object(
        'required_docs', required_docs,
        'completed_docs', completed_docs,
        'activated', activated,
        'deliveries_today', deliveries_today,
        'earnings_today', earnings_today,
        'hours_today', hours_today,
        'rating', rating
    );

    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION courier_sales_series(days INTEGER DEFAULT 14)
RETURNS TABLE(d DATE, total NUMERIC) AS $$
BEGIN
    RETURN QUERY
    SELECT
        happened_on::DATE as d,
        COALESCE(SUM(amount), 0) as total
    FROM courier_sales
    WHERE owner = auth.uid()
        AND happened_on >= CURRENT_DATE - INTERVAL '1 day' * days
    GROUP BY happened_on::DATE
    ORDER BY happened_on::DATE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Storage Bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('courier_docs', 'courier_docs', true)
ON CONFLICT (id) DO NOTHING;