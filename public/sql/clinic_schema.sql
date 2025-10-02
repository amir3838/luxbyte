-- Clinic Schema - Luxbyte
CREATE TABLE IF NOT EXISTS clinic_documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    owner UUID DEFAULT auth.uid() NOT NULL,
    kind TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    public_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS patients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    owner UUID DEFAULT auth.uid() NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    age INTEGER,
    diagnosis TEXT,
    last_visit DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS appointments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    owner UUID DEFAULT auth.uid() NOT NULL,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    at TIMESTAMPTZ NOT NULL,
    room_id UUID,
    status TEXT CHECK (status IN ('pending', 'confirmed', 'in-progress', 'completed', 'cancelled')) DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS medical_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    owner UUID DEFAULT auth.uid() NOT NULL,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    diagnosis TEXT NOT NULL,
    treatment TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS rooms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    owner UUID DEFAULT auth.uid() NOT NULL,
    name TEXT NOT NULL,
    status TEXT CHECK (status IN ('available', 'occupied', 'out_of_service')) DEFAULT 'available',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS staff (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    owner UUID DEFAULT auth.uid() NOT NULL,
    name TEXT NOT NULL,
    role TEXT,
    phone TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS clinic_sales (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    owner UUID DEFAULT auth.uid() NOT NULL,
    amount NUMERIC NOT NULL,
    happened_on DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE clinic_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinic_sales ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "clinic_documents_policy" ON clinic_documents USING (owner = auth.uid());
CREATE POLICY "patients_policy" ON patients USING (owner = auth.uid());
CREATE POLICY "appointments_policy" ON appointments USING (owner = auth.uid());
CREATE POLICY "medical_records_policy" ON medical_records USING (owner = auth.uid());
CREATE POLICY "rooms_policy" ON rooms USING (owner = auth.uid());
CREATE POLICY "staff_policy" ON staff USING (owner = auth.uid());
CREATE POLICY "clinic_sales_policy" ON clinic_sales USING (owner = auth.uid());

-- RPC Functions
CREATE OR REPLACE FUNCTION clinic_kpis_today()
RETURNS JSONB AS $$
DECLARE
    result JSONB;
    required_docs INTEGER := 6;
    completed_docs INTEGER;
    activated BOOLEAN;
    patients_today INTEGER;
    revenue_today NUMERIC;
    appts_today INTEGER;
    free_rooms INTEGER;
    total_rooms INTEGER;
BEGIN
    SELECT COUNT(*) INTO completed_docs
    FROM clinic_documents
    WHERE owner = auth.uid() AND created_at >= CURRENT_DATE;

    activated := (completed_docs >= required_docs);

    SELECT COUNT(*) INTO patients_today
    FROM patients
    WHERE owner = auth.uid() AND last_visit = CURRENT_DATE;

    SELECT COALESCE(SUM(amount), 0) INTO revenue_today
    FROM clinic_sales
    WHERE owner = auth.uid() AND happened_on = CURRENT_DATE;

    SELECT COUNT(*) INTO appts_today
    FROM appointments
    WHERE owner = auth.uid() AND DATE(at) = CURRENT_DATE;

    SELECT COUNT(*) INTO free_rooms
    FROM rooms
    WHERE owner = auth.uid() AND status = 'available';

    SELECT COUNT(*) INTO total_rooms
    FROM rooms
    WHERE owner = auth.uid();

    result := jsonb_build_object(
        'required_docs', required_docs,
        'completed_docs', completed_docs,
        'activated', activated,
        'patients_today', patients_today,
        'revenue_today', revenue_today,
        'appts_today', appts_today,
        'free_rooms', free_rooms,
        'total_rooms', total_rooms
    );

    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION clinic_sales_series(days INTEGER DEFAULT 14)
RETURNS TABLE(d DATE, total NUMERIC) AS $$
BEGIN
    RETURN QUERY
    SELECT
        happened_on::DATE as d,
        COALESCE(SUM(amount), 0) as total
    FROM clinic_sales
    WHERE owner = auth.uid()
        AND happened_on >= CURRENT_DATE - INTERVAL '1 day' * days
    GROUP BY happened_on::DATE
    ORDER BY happened_on::DATE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Storage Bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('clinic_docs', 'clinic_docs', true)
ON CONFLICT (id) DO NOTHING;
CREATE TABLE IF NOT EXISTS clinic_documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    owner UUID DEFAULT auth.uid() NOT NULL,
    kind TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    public_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS patients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    owner UUID DEFAULT auth.uid() NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    age INTEGER,
    diagnosis TEXT,
    last_visit DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS appointments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    owner UUID DEFAULT auth.uid() NOT NULL,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    at TIMESTAMPTZ NOT NULL,
    room_id UUID,
    status TEXT CHECK (status IN ('pending', 'confirmed', 'in-progress', 'completed', 'cancelled')) DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS medical_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    owner UUID DEFAULT auth.uid() NOT NULL,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    diagnosis TEXT NOT NULL,
    treatment TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS rooms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    owner UUID DEFAULT auth.uid() NOT NULL,
    name TEXT NOT NULL,
    status TEXT CHECK (status IN ('available', 'occupied', 'out_of_service')) DEFAULT 'available',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS staff (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    owner UUID DEFAULT auth.uid() NOT NULL,
    name TEXT NOT NULL,
    role TEXT,
    phone TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS clinic_sales (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    owner UUID DEFAULT auth.uid() NOT NULL,
    amount NUMERIC NOT NULL,
    happened_on DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE clinic_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinic_sales ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "clinic_documents_policy" ON clinic_documents USING (owner = auth.uid());
CREATE POLICY "patients_policy" ON patients USING (owner = auth.uid());
CREATE POLICY "appointments_policy" ON appointments USING (owner = auth.uid());
CREATE POLICY "medical_records_policy" ON medical_records USING (owner = auth.uid());
CREATE POLICY "rooms_policy" ON rooms USING (owner = auth.uid());
CREATE POLICY "staff_policy" ON staff USING (owner = auth.uid());
CREATE POLICY "clinic_sales_policy" ON clinic_sales USING (owner = auth.uid());

-- RPC Functions
CREATE OR REPLACE FUNCTION clinic_kpis_today()
RETURNS JSONB AS $$
DECLARE
    result JSONB;
    required_docs INTEGER := 6;
    completed_docs INTEGER;
    activated BOOLEAN;
    patients_today INTEGER;
    revenue_today NUMERIC;
    appts_today INTEGER;
    free_rooms INTEGER;
    total_rooms INTEGER;
BEGIN
    SELECT COUNT(*) INTO completed_docs
    FROM clinic_documents
    WHERE owner = auth.uid() AND created_at >= CURRENT_DATE;

    activated := (completed_docs >= required_docs);

    SELECT COUNT(*) INTO patients_today
    FROM patients
    WHERE owner = auth.uid() AND last_visit = CURRENT_DATE;

    SELECT COALESCE(SUM(amount), 0) INTO revenue_today
    FROM clinic_sales
    WHERE owner = auth.uid() AND happened_on = CURRENT_DATE;

    SELECT COUNT(*) INTO appts_today
    FROM appointments
    WHERE owner = auth.uid() AND DATE(at) = CURRENT_DATE;

    SELECT COUNT(*) INTO free_rooms
    FROM rooms
    WHERE owner = auth.uid() AND status = 'available';

    SELECT COUNT(*) INTO total_rooms
    FROM rooms
    WHERE owner = auth.uid();

    result := jsonb_build_object(
        'required_docs', required_docs,
        'completed_docs', completed_docs,
        'activated', activated,
        'patients_today', patients_today,
        'revenue_today', revenue_today,
        'appts_today', appts_today,
        'free_rooms', free_rooms,
        'total_rooms', total_rooms
    );

    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION clinic_sales_series(days INTEGER DEFAULT 14)
RETURNS TABLE(d DATE, total NUMERIC) AS $$
BEGIN
    RETURN QUERY
    SELECT
        happened_on::DATE as d,
        COALESCE(SUM(amount), 0) as total
    FROM clinic_sales
    WHERE owner = auth.uid()
        AND happened_on >= CURRENT_DATE - INTERVAL '1 day' * days
    GROUP BY happened_on::DATE
    ORDER BY happened_on::DATE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Storage Bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('clinic_docs', 'clinic_docs', true)
ON CONFLICT (id) DO NOTHING;
