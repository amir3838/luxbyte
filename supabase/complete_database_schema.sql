-- Complete Database Schema for LUXBYTE Platform
-- This file contains all tables, RLS policies, and RPC functions for all dashboards

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- CLINIC DASHBOARD TABLES
-- =============================================

-- Clinic patients table
CREATE TABLE IF NOT EXISTS clinic_patients (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    address TEXT,
    date_of_birth DATE,
    gender VARCHAR(10),
    medical_history TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clinic appointments table
CREATE TABLE IF NOT EXISTS clinic_appointments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_id UUID REFERENCES clinic_patients(id) ON DELETE CASCADE,
    appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clinic medical records table
CREATE TABLE IF NOT EXISTS clinic_medical_records (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_id UUID REFERENCES clinic_patients(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES clinic_appointments(id) ON DELETE SET NULL,
    diagnosis TEXT,
    treatment TEXT,
    prescription TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clinic staff table
CREATE TABLE IF NOT EXISTS clinic_staff (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    specialization VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clinic documents table
CREATE TABLE IF NOT EXISTS clinic_documents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_id UUID REFERENCES clinic_patients(id) ON DELETE CASCADE,
    document_type VARCHAR(100) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_size INTEGER,
    file_type VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- RESTAURANT DASHBOARD TABLES
-- =============================================

-- Restaurant customers table
CREATE TABLE IF NOT EXISTS restaurant_customers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Restaurant menu items table
CREATE TABLE IF NOT EXISTS restaurant_menu_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(100),
    available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Restaurant orders table
CREATE TABLE IF NOT EXISTS restaurant_orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    customer_id UUID REFERENCES restaurant_customers(id) ON DELETE CASCADE,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled')),
    order_items JSONB,
    delivery_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Restaurant staff table
CREATE TABLE IF NOT EXISTS restaurant_staff (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- PHARMACY DASHBOARD TABLES
-- =============================================

-- Pharmacy patients table
CREATE TABLE IF NOT EXISTS pharmacy_patients (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    address TEXT,
    date_of_birth DATE,
    gender VARCHAR(10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pharmacy medicines table
CREATE TABLE IF NOT EXISTS pharmacy_medicines (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    generic_name VARCHAR(255),
    manufacturer VARCHAR(255),
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INTEGER DEFAULT 0,
    min_stock_level INTEGER DEFAULT 10,
    expiry_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pharmacy prescriptions table
CREATE TABLE IF NOT EXISTS pharmacy_prescriptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_id UUID REFERENCES pharmacy_patients(id) ON DELETE CASCADE,
    prescription_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'filled', 'cancelled')),
    medicines JSONB,
    total_amount DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pharmacy staff table
CREATE TABLE IF NOT EXISTS pharmacy_staff (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    license_number VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- SUPERMARKET DASHBOARD TABLES
-- =============================================

-- Supermarket customers table
CREATE TABLE IF NOT EXISTS supermarket_customers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Supermarket products table
CREATE TABLE IF NOT EXISTS supermarket_products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(100),
    stock_quantity INTEGER DEFAULT 0,
    min_stock_level INTEGER DEFAULT 10,
    barcode VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Supermarket orders table
CREATE TABLE IF NOT EXISTS supermarket_orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    customer_id UUID REFERENCES supermarket_customers(id) ON DELETE CASCADE,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'packing', 'ready', 'delivered', 'cancelled')),
    order_items JSONB,
    delivery_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Supermarket staff table
CREATE TABLE IF NOT EXISTS supermarket_staff (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- COURIER DASHBOARD TABLES
-- =============================================

-- Courier customers table
CREATE TABLE IF NOT EXISTS courier_customers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Courier deliveries table
CREATE TABLE IF NOT EXISTS courier_deliveries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    customer_id UUID REFERENCES courier_customers(id) ON DELETE CASCADE,
    pickup_address TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'picked_up', 'in_transit', 'delivered', 'cancelled')),
    delivery_fee DECIMAL(10,2) NOT NULL,
    estimated_time INTEGER, -- in minutes
    actual_time INTEGER, -- in minutes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Courier earnings table
CREATE TABLE IF NOT EXISTS courier_earnings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    courier_id UUID NOT NULL,
    delivery_id UUID REFERENCES courier_deliveries(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Courier team table
CREATE TABLE IF NOT EXISTS courier_team (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    vehicle_type VARCHAR(100),
    license_number VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Courier locations table
CREATE TABLE IF NOT EXISTS courier_locations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    courier_id UUID NOT NULL,
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- DRIVER DASHBOARD TABLES
-- =============================================

-- Driver customers table
CREATE TABLE IF NOT EXISTS driver_customers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Driver rides table
CREATE TABLE IF NOT EXISTS driver_rides (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    customer_id UUID REFERENCES driver_customers(id) ON DELETE CASCADE,
    pickup_address TEXT NOT NULL,
    destination_address TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'picked_up', 'in_progress', 'completed', 'cancelled')),
    fare DECIMAL(10,2) NOT NULL,
    estimated_time INTEGER, -- in minutes
    actual_time INTEGER, -- in minutes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Driver earnings table
CREATE TABLE IF NOT EXISTS driver_earnings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    driver_id UUID NOT NULL,
    ride_id UUID REFERENCES driver_rides(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Driver team table
CREATE TABLE IF NOT EXISTS driver_team (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    vehicle_type VARCHAR(100),
    license_number VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Driver locations table
CREATE TABLE IF NOT EXISTS driver_locations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    driver_id UUID NOT NULL,
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE clinic_patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinic_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinic_medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinic_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinic_documents ENABLE ROW LEVEL SECURITY;

ALTER TABLE restaurant_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_staff ENABLE ROW LEVEL SECURITY;

ALTER TABLE pharmacy_patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE pharmacy_medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE pharmacy_prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE pharmacy_staff ENABLE ROW LEVEL SECURITY;

ALTER TABLE supermarket_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE supermarket_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE supermarket_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE supermarket_staff ENABLE ROW LEVEL SECURITY;

ALTER TABLE courier_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE courier_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE courier_earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE courier_team ENABLE ROW LEVEL SECURITY;
ALTER TABLE courier_locations ENABLE ROW LEVEL SECURITY;

ALTER TABLE driver_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_rides ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_team ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_locations ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
-- Clinic policies
CREATE POLICY "Users can view clinic data" ON clinic_patients FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert clinic data" ON clinic_patients FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update clinic data" ON clinic_patients FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete clinic data" ON clinic_patients FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view clinic appointments" ON clinic_appointments FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert clinic appointments" ON clinic_appointments FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update clinic appointments" ON clinic_appointments FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete clinic appointments" ON clinic_appointments FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view clinic medical records" ON clinic_medical_records FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert clinic medical records" ON clinic_medical_records FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update clinic medical records" ON clinic_medical_records FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete clinic medical records" ON clinic_medical_records FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view clinic staff" ON clinic_staff FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert clinic staff" ON clinic_staff FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update clinic staff" ON clinic_staff FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete clinic staff" ON clinic_staff FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view clinic documents" ON clinic_documents FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert clinic documents" ON clinic_documents FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update clinic documents" ON clinic_documents FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete clinic documents" ON clinic_documents FOR DELETE USING (auth.role() = 'authenticated');

-- Restaurant policies
CREATE POLICY "Users can view restaurant data" ON restaurant_customers FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert restaurant data" ON restaurant_customers FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update restaurant data" ON restaurant_customers FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete restaurant data" ON restaurant_customers FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view restaurant menu items" ON restaurant_menu_items FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert restaurant menu items" ON restaurant_menu_items FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update restaurant menu items" ON restaurant_menu_items FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete restaurant menu items" ON restaurant_menu_items FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view restaurant orders" ON restaurant_orders FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert restaurant orders" ON restaurant_orders FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update restaurant orders" ON restaurant_orders FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete restaurant orders" ON restaurant_orders FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view restaurant staff" ON restaurant_staff FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert restaurant staff" ON restaurant_staff FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update restaurant staff" ON restaurant_staff FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete restaurant staff" ON restaurant_staff FOR DELETE USING (auth.role() = 'authenticated');

-- Pharmacy policies
CREATE POLICY "Users can view pharmacy data" ON pharmacy_patients FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert pharmacy data" ON pharmacy_patients FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update pharmacy data" ON pharmacy_patients FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete pharmacy data" ON pharmacy_patients FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view pharmacy medicines" ON pharmacy_medicines FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert pharmacy medicines" ON pharmacy_medicines FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update pharmacy medicines" ON pharmacy_medicines FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete pharmacy medicines" ON pharmacy_medicines FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view pharmacy prescriptions" ON pharmacy_prescriptions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert pharmacy prescriptions" ON pharmacy_prescriptions FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update pharmacy prescriptions" ON pharmacy_prescriptions FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete pharmacy prescriptions" ON pharmacy_prescriptions FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view pharmacy staff" ON pharmacy_staff FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert pharmacy staff" ON pharmacy_staff FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update pharmacy staff" ON pharmacy_staff FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete pharmacy staff" ON pharmacy_staff FOR DELETE USING (auth.role() = 'authenticated');

-- Supermarket policies
CREATE POLICY "Users can view supermarket data" ON supermarket_customers FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert supermarket data" ON supermarket_customers FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update supermarket data" ON supermarket_customers FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete supermarket data" ON supermarket_customers FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view supermarket products" ON supermarket_products FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert supermarket products" ON supermarket_products FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update supermarket products" ON supermarket_products FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete supermarket products" ON supermarket_products FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view supermarket orders" ON supermarket_orders FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert supermarket orders" ON supermarket_orders FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update supermarket orders" ON supermarket_orders FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete supermarket orders" ON supermarket_orders FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view supermarket staff" ON supermarket_staff FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert supermarket staff" ON supermarket_staff FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update supermarket staff" ON supermarket_staff FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete supermarket staff" ON supermarket_staff FOR DELETE USING (auth.role() = 'authenticated');

-- Courier policies
CREATE POLICY "Users can view courier data" ON courier_customers FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert courier data" ON courier_customers FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update courier data" ON courier_customers FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete courier data" ON courier_customers FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view courier deliveries" ON courier_deliveries FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert courier deliveries" ON courier_deliveries FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update courier deliveries" ON courier_deliveries FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete courier deliveries" ON courier_deliveries FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view courier earnings" ON courier_earnings FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert courier earnings" ON courier_earnings FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update courier earnings" ON courier_earnings FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete courier earnings" ON courier_earnings FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view courier team" ON courier_team FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert courier team" ON courier_team FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update courier team" ON courier_team FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete courier team" ON courier_team FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view courier locations" ON courier_locations FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert courier locations" ON courier_locations FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update courier locations" ON courier_locations FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete courier locations" ON courier_locations FOR DELETE USING (auth.role() = 'authenticated');

-- Driver policies
CREATE POLICY "Users can view driver data" ON driver_customers FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert driver data" ON driver_customers FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update driver data" ON driver_customers FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete driver data" ON driver_customers FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view driver rides" ON driver_rides FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert driver rides" ON driver_rides FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update driver rides" ON driver_rides FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete driver rides" ON driver_rides FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view driver earnings" ON driver_earnings FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert driver earnings" ON driver_earnings FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update driver earnings" ON driver_earnings FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete driver earnings" ON driver_earnings FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view driver team" ON driver_team FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert driver team" ON driver_team FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update driver team" ON driver_team FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete driver team" ON driver_team FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view driver locations" ON driver_locations FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert driver locations" ON driver_locations FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update driver locations" ON driver_locations FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete driver locations" ON driver_locations FOR DELETE USING (auth.role() = 'authenticated');

-- =============================================
-- RPC FUNCTIONS FOR KPIs
-- =============================================

-- Clinic KPIs function
CREATE OR REPLACE FUNCTION clinic_kpis_today()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_appointments', COALESCE((
            SELECT COUNT(*) FROM clinic_appointments
            WHERE DATE(appointment_date) = CURRENT_DATE
        ), 0),
        'completed_appointments', COALESCE((
            SELECT COUNT(*) FROM clinic_appointments
            WHERE DATE(appointment_date) = CURRENT_DATE AND status = 'completed'
        ), 0),
        'pending_appointments', COALESCE((
            SELECT COUNT(*) FROM clinic_appointments
            WHERE DATE(appointment_date) = CURRENT_DATE AND status = 'pending'
        ), 0),
        'total_patients', COALESCE((
            SELECT COUNT(*) FROM clinic_patients
        ), 0),
        'new_patients_today', COALESCE((
            SELECT COUNT(*) FROM clinic_patients
            WHERE DATE(created_at) = CURRENT_DATE
        ), 0),
        'revenue_today', COALESCE((
            SELECT SUM(COALESCE(total_amount, 0)) FROM clinic_appointments
            WHERE DATE(appointment_date) = CURRENT_DATE AND status = 'completed'
        ), 0)
    ) INTO result;

    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Restaurant KPIs function
CREATE OR REPLACE FUNCTION restaurant_kpis_today()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_orders', COALESCE((
            SELECT COUNT(*) FROM restaurant_orders
            WHERE DATE(created_at) = CURRENT_DATE
        ), 0),
        'completed_orders', COALESCE((
            SELECT COUNT(*) FROM restaurant_orders
            WHERE DATE(created_at) = CURRENT_DATE AND status = 'delivered'
        ), 0),
        'pending_orders', COALESCE((
            SELECT COUNT(*) FROM restaurant_orders
            WHERE DATE(created_at) = CURRENT_DATE AND status IN ('pending', 'confirmed', 'preparing', 'ready')
        ), 0),
        'total_revenue', COALESCE((
            SELECT SUM(total_amount) FROM restaurant_orders
            WHERE DATE(created_at) = CURRENT_DATE AND status = 'delivered'
        ), 0),
        'new_customers', COALESCE((
            SELECT COUNT(*) FROM restaurant_customers
            WHERE DATE(created_at) = CURRENT_DATE
        ), 0),
        'avg_order_value', COALESCE((
            SELECT AVG(total_amount) FROM restaurant_orders
            WHERE DATE(created_at) = CURRENT_DATE AND status = 'delivered'
        ), 0)
    ) INTO result;

    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Pharmacy KPIs function
CREATE OR REPLACE FUNCTION pharmacy_kpis_today()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_prescriptions', COALESCE((
            SELECT COUNT(*) FROM pharmacy_prescriptions
            WHERE DATE(created_at) = CURRENT_DATE
        ), 0),
        'completed_prescriptions', COALESCE((
            SELECT COUNT(*) FROM pharmacy_prescriptions
            WHERE DATE(created_at) = CURRENT_DATE AND status = 'filled'
        ), 0),
        'pending_prescriptions', COALESCE((
            SELECT COUNT(*) FROM pharmacy_prescriptions
            WHERE DATE(created_at) = CURRENT_DATE AND status = 'pending'
        ), 0),
        'total_medicines', COALESCE((
            SELECT COUNT(*) FROM pharmacy_medicines
        ), 0),
        'low_stock_medicines', COALESCE((
            SELECT COUNT(*) FROM pharmacy_medicines
            WHERE stock_quantity <= min_stock_level
        ), 0),
        'revenue_today', COALESCE((
            SELECT SUM(COALESCE(total_amount, 0)) FROM pharmacy_prescriptions
            WHERE DATE(created_at) = CURRENT_DATE AND status = 'filled'
        ), 0)
    ) INTO result;

    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Supermarket KPIs function
CREATE OR REPLACE FUNCTION supermarket_kpis_today()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_orders', COALESCE((
            SELECT COUNT(*) FROM supermarket_orders
            WHERE DATE(created_at) = CURRENT_DATE
        ), 0),
        'completed_orders', COALESCE((
            SELECT COUNT(*) FROM supermarket_orders
            WHERE DATE(created_at) = CURRENT_DATE AND status = 'delivered'
        ), 0),
        'pending_orders', COALESCE((
            SELECT COUNT(*) FROM supermarket_orders
            WHERE DATE(created_at) = CURRENT_DATE AND status IN ('pending', 'confirmed', 'packing', 'ready')
        ), 0),
        'total_products', COALESCE((
            SELECT COUNT(*) FROM supermarket_products
        ), 0),
        'low_stock_products', COALESCE((
            SELECT COUNT(*) FROM supermarket_products
            WHERE stock_quantity <= min_stock_level
        ), 0),
        'revenue_today', COALESCE((
            SELECT SUM(total_amount) FROM supermarket_orders
            WHERE DATE(created_at) = CURRENT_DATE AND status = 'delivered'
        ), 0)
    ) INTO result;

    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Courier KPIs function
CREATE OR REPLACE FUNCTION courier_kpis_today()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_deliveries', COALESCE((
            SELECT COUNT(*) FROM courier_deliveries
            WHERE DATE(created_at) = CURRENT_DATE
        ), 0),
        'completed_deliveries', COALESCE((
            SELECT COUNT(*) FROM courier_deliveries
            WHERE DATE(created_at) = CURRENT_DATE AND status = 'delivered'
        ), 0),
        'pending_deliveries', COALESCE((
            SELECT COUNT(*) FROM courier_deliveries
            WHERE DATE(created_at) = CURRENT_DATE AND status IN ('pending', 'accepted', 'picked_up', 'in_transit')
        ), 0),
        'total_earnings', COALESCE((
            SELECT SUM(amount) FROM courier_earnings
            WHERE date = CURRENT_DATE
        ), 0),
        'avg_delivery_time', COALESCE((
            SELECT AVG(actual_time) FROM courier_deliveries
            WHERE DATE(created_at) = CURRENT_DATE AND status = 'delivered' AND actual_time IS NOT NULL
        ), 0),
        'customer_rating', COALESCE((
            SELECT AVG(rating) FROM courier_deliveries
            WHERE DATE(created_at) = CURRENT_DATE AND rating IS NOT NULL
        ), 0)
    ) INTO result;

    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Driver KPIs function
CREATE OR REPLACE FUNCTION driver_kpis_today()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_rides', COALESCE((
            SELECT COUNT(*) FROM driver_rides
            WHERE DATE(created_at) = CURRENT_DATE
        ), 0),
        'completed_rides', COALESCE((
            SELECT COUNT(*) FROM driver_rides
            WHERE DATE(created_at) = CURRENT_DATE AND status = 'completed'
        ), 0),
        'pending_rides', COALESCE((
            SELECT COUNT(*) FROM driver_rides
            WHERE DATE(created_at) = CURRENT_DATE AND status IN ('pending', 'accepted', 'picked_up', 'in_progress')
        ), 0),
        'total_earnings', COALESCE((
            SELECT SUM(amount) FROM driver_earnings
            WHERE date = CURRENT_DATE
        ), 0),
        'avg_ride_time', COALESCE((
            SELECT AVG(actual_time) FROM driver_rides
            WHERE DATE(created_at) = CURRENT_DATE AND status = 'completed' AND actual_time IS NOT NULL
        ), 0),
        'customer_rating', COALESCE((
            SELECT AVG(rating) FROM driver_rides
            WHERE DATE(created_at) = CURRENT_DATE AND rating IS NOT NULL
        ), 0)
    ) INTO result;

    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- STORAGE BUCKETS
-- =============================================

-- Create storage buckets for each dashboard
INSERT INTO storage.buckets (id, name, public) VALUES
('clinic_docs', 'clinic_docs', true),
('restaurant_docs', 'restaurant_docs', true),
('pharmacy_docs', 'pharmacy_docs', true),
('supermarket_docs', 'supermarket_docs', true),
('courier_docs', 'courier_docs', true),
('driver_docs', 'driver_docs', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Users can view clinic documents" ON storage.objects FOR SELECT USING (bucket_id = 'clinic_docs' AND auth.role() = 'authenticated');
CREATE POLICY "Users can upload clinic documents" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'clinic_docs' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update clinic documents" ON storage.objects FOR UPDATE USING (bucket_id = 'clinic_docs' AND auth.role() = 'authenticated');
CREATE POLICY "Users can delete clinic documents" ON storage.objects FOR DELETE USING (bucket_id = 'clinic_docs' AND auth.role() = 'authenticated');

CREATE POLICY "Users can view restaurant documents" ON storage.objects FOR SELECT USING (bucket_id = 'restaurant_docs' AND auth.role() = 'authenticated');
CREATE POLICY "Users can upload restaurant documents" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'restaurant_docs' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update restaurant documents" ON storage.objects FOR UPDATE USING (bucket_id = 'restaurant_docs' AND auth.role() = 'authenticated');
CREATE POLICY "Users can delete restaurant documents" ON storage.objects FOR DELETE USING (bucket_id = 'restaurant_docs' AND auth.role() = 'authenticated');

CREATE POLICY "Users can view pharmacy documents" ON storage.objects FOR SELECT USING (bucket_id = 'pharmacy_docs' AND auth.role() = 'authenticated');
CREATE POLICY "Users can upload pharmacy documents" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'pharmacy_docs' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update pharmacy documents" ON storage.objects FOR UPDATE USING (bucket_id = 'pharmacy_docs' AND auth.role() = 'authenticated');
CREATE POLICY "Users can delete pharmacy documents" ON storage.objects FOR DELETE USING (bucket_id = 'pharmacy_docs' AND auth.role() = 'authenticated');

CREATE POLICY "Users can view supermarket documents" ON storage.objects FOR SELECT USING (bucket_id = 'supermarket_docs' AND auth.role() = 'authenticated');
CREATE POLICY "Users can upload supermarket documents" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'supermarket_docs' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update supermarket documents" ON storage.objects FOR UPDATE USING (bucket_id = 'supermarket_docs' AND auth.role() = 'authenticated');
CREATE POLICY "Users can delete supermarket documents" ON storage.objects FOR DELETE USING (bucket_id = 'supermarket_docs' AND auth.role() = 'authenticated');

CREATE POLICY "Users can view courier documents" ON storage.objects FOR SELECT USING (bucket_id = 'courier_docs' AND auth.role() = 'authenticated');
CREATE POLICY "Users can upload courier documents" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'courier_docs' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update courier documents" ON storage.objects FOR UPDATE USING (bucket_id = 'courier_docs' AND auth.role() = 'authenticated');
CREATE POLICY "Users can delete courier documents" ON storage.objects FOR DELETE USING (bucket_id = 'courier_docs' AND auth.role() = 'authenticated');

CREATE POLICY "Users can view driver documents" ON storage.objects FOR SELECT USING (bucket_id = 'driver_docs' AND auth.role() = 'authenticated');
CREATE POLICY "Users can upload driver documents" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'driver_docs' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update driver documents" ON storage.objects FOR UPDATE USING (bucket_id = 'driver_docs' AND auth.role() = 'authenticated');
CREATE POLICY "Users can delete driver documents" ON storage.objects FOR DELETE USING (bucket_id = 'driver_docs' AND auth.role() = 'authenticated');
-- This file contains all tables, RLS policies, and RPC functions for all dashboards

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- CLINIC DASHBOARD TABLES
-- =============================================

-- Clinic patients table
CREATE TABLE IF NOT EXISTS clinic_patients (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    address TEXT,
    date_of_birth DATE,
    gender VARCHAR(10),
    medical_history TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clinic appointments table
CREATE TABLE IF NOT EXISTS clinic_appointments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_id UUID REFERENCES clinic_patients(id) ON DELETE CASCADE,
    appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clinic medical records table
CREATE TABLE IF NOT EXISTS clinic_medical_records (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_id UUID REFERENCES clinic_patients(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES clinic_appointments(id) ON DELETE SET NULL,
    diagnosis TEXT,
    treatment TEXT,
    prescription TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clinic staff table
CREATE TABLE IF NOT EXISTS clinic_staff (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    specialization VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clinic documents table
CREATE TABLE IF NOT EXISTS clinic_documents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_id UUID REFERENCES clinic_patients(id) ON DELETE CASCADE,
    document_type VARCHAR(100) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_size INTEGER,
    file_type VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- RESTAURANT DASHBOARD TABLES
-- =============================================

-- Restaurant customers table
CREATE TABLE IF NOT EXISTS restaurant_customers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Restaurant menu items table
CREATE TABLE IF NOT EXISTS restaurant_menu_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(100),
    available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Restaurant orders table
CREATE TABLE IF NOT EXISTS restaurant_orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    customer_id UUID REFERENCES restaurant_customers(id) ON DELETE CASCADE,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled')),
    order_items JSONB,
    delivery_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Restaurant staff table
CREATE TABLE IF NOT EXISTS restaurant_staff (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- PHARMACY DASHBOARD TABLES
-- =============================================

-- Pharmacy patients table
CREATE TABLE IF NOT EXISTS pharmacy_patients (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    address TEXT,
    date_of_birth DATE,
    gender VARCHAR(10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pharmacy medicines table
CREATE TABLE IF NOT EXISTS pharmacy_medicines (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    generic_name VARCHAR(255),
    manufacturer VARCHAR(255),
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INTEGER DEFAULT 0,
    min_stock_level INTEGER DEFAULT 10,
    expiry_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pharmacy prescriptions table
CREATE TABLE IF NOT EXISTS pharmacy_prescriptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_id UUID REFERENCES pharmacy_patients(id) ON DELETE CASCADE,
    prescription_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'filled', 'cancelled')),
    medicines JSONB,
    total_amount DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pharmacy staff table
CREATE TABLE IF NOT EXISTS pharmacy_staff (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    license_number VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- SUPERMARKET DASHBOARD TABLES
-- =============================================

-- Supermarket customers table
CREATE TABLE IF NOT EXISTS supermarket_customers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Supermarket products table
CREATE TABLE IF NOT EXISTS supermarket_products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(100),
    stock_quantity INTEGER DEFAULT 0,
    min_stock_level INTEGER DEFAULT 10,
    barcode VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Supermarket orders table
CREATE TABLE IF NOT EXISTS supermarket_orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    customer_id UUID REFERENCES supermarket_customers(id) ON DELETE CASCADE,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'packing', 'ready', 'delivered', 'cancelled')),
    order_items JSONB,
    delivery_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Supermarket staff table
CREATE TABLE IF NOT EXISTS supermarket_staff (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- COURIER DASHBOARD TABLES
-- =============================================

-- Courier customers table
CREATE TABLE IF NOT EXISTS courier_customers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Courier deliveries table
CREATE TABLE IF NOT EXISTS courier_deliveries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    customer_id UUID REFERENCES courier_customers(id) ON DELETE CASCADE,
    pickup_address TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'picked_up', 'in_transit', 'delivered', 'cancelled')),
    delivery_fee DECIMAL(10,2) NOT NULL,
    estimated_time INTEGER, -- in minutes
    actual_time INTEGER, -- in minutes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Courier earnings table
CREATE TABLE IF NOT EXISTS courier_earnings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    courier_id UUID NOT NULL,
    delivery_id UUID REFERENCES courier_deliveries(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Courier team table
CREATE TABLE IF NOT EXISTS courier_team (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    vehicle_type VARCHAR(100),
    license_number VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Courier locations table
CREATE TABLE IF NOT EXISTS courier_locations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    courier_id UUID NOT NULL,
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- DRIVER DASHBOARD TABLES
-- =============================================

-- Driver customers table
CREATE TABLE IF NOT EXISTS driver_customers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Driver rides table
CREATE TABLE IF NOT EXISTS driver_rides (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    customer_id UUID REFERENCES driver_customers(id) ON DELETE CASCADE,
    pickup_address TEXT NOT NULL,
    destination_address TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'picked_up', 'in_progress', 'completed', 'cancelled')),
    fare DECIMAL(10,2) NOT NULL,
    estimated_time INTEGER, -- in minutes
    actual_time INTEGER, -- in minutes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Driver earnings table
CREATE TABLE IF NOT EXISTS driver_earnings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    driver_id UUID NOT NULL,
    ride_id UUID REFERENCES driver_rides(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Driver team table
CREATE TABLE IF NOT EXISTS driver_team (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    vehicle_type VARCHAR(100),
    license_number VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Driver locations table
CREATE TABLE IF NOT EXISTS driver_locations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    driver_id UUID NOT NULL,
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE clinic_patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinic_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinic_medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinic_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinic_documents ENABLE ROW LEVEL SECURITY;

ALTER TABLE restaurant_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_staff ENABLE ROW LEVEL SECURITY;

ALTER TABLE pharmacy_patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE pharmacy_medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE pharmacy_prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE pharmacy_staff ENABLE ROW LEVEL SECURITY;

ALTER TABLE supermarket_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE supermarket_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE supermarket_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE supermarket_staff ENABLE ROW LEVEL SECURITY;

ALTER TABLE courier_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE courier_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE courier_earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE courier_team ENABLE ROW LEVEL SECURITY;
ALTER TABLE courier_locations ENABLE ROW LEVEL SECURITY;

ALTER TABLE driver_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_rides ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_team ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_locations ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
-- Clinic policies
CREATE POLICY "Users can view clinic data" ON clinic_patients FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert clinic data" ON clinic_patients FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update clinic data" ON clinic_patients FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete clinic data" ON clinic_patients FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view clinic appointments" ON clinic_appointments FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert clinic appointments" ON clinic_appointments FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update clinic appointments" ON clinic_appointments FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete clinic appointments" ON clinic_appointments FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view clinic medical records" ON clinic_medical_records FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert clinic medical records" ON clinic_medical_records FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update clinic medical records" ON clinic_medical_records FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete clinic medical records" ON clinic_medical_records FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view clinic staff" ON clinic_staff FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert clinic staff" ON clinic_staff FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update clinic staff" ON clinic_staff FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete clinic staff" ON clinic_staff FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view clinic documents" ON clinic_documents FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert clinic documents" ON clinic_documents FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update clinic documents" ON clinic_documents FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete clinic documents" ON clinic_documents FOR DELETE USING (auth.role() = 'authenticated');

-- Restaurant policies
CREATE POLICY "Users can view restaurant data" ON restaurant_customers FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert restaurant data" ON restaurant_customers FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update restaurant data" ON restaurant_customers FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete restaurant data" ON restaurant_customers FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view restaurant menu items" ON restaurant_menu_items FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert restaurant menu items" ON restaurant_menu_items FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update restaurant menu items" ON restaurant_menu_items FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete restaurant menu items" ON restaurant_menu_items FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view restaurant orders" ON restaurant_orders FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert restaurant orders" ON restaurant_orders FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update restaurant orders" ON restaurant_orders FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete restaurant orders" ON restaurant_orders FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view restaurant staff" ON restaurant_staff FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert restaurant staff" ON restaurant_staff FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update restaurant staff" ON restaurant_staff FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete restaurant staff" ON restaurant_staff FOR DELETE USING (auth.role() = 'authenticated');

-- Pharmacy policies
CREATE POLICY "Users can view pharmacy data" ON pharmacy_patients FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert pharmacy data" ON pharmacy_patients FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update pharmacy data" ON pharmacy_patients FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete pharmacy data" ON pharmacy_patients FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view pharmacy medicines" ON pharmacy_medicines FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert pharmacy medicines" ON pharmacy_medicines FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update pharmacy medicines" ON pharmacy_medicines FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete pharmacy medicines" ON pharmacy_medicines FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view pharmacy prescriptions" ON pharmacy_prescriptions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert pharmacy prescriptions" ON pharmacy_prescriptions FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update pharmacy prescriptions" ON pharmacy_prescriptions FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete pharmacy prescriptions" ON pharmacy_prescriptions FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view pharmacy staff" ON pharmacy_staff FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert pharmacy staff" ON pharmacy_staff FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update pharmacy staff" ON pharmacy_staff FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete pharmacy staff" ON pharmacy_staff FOR DELETE USING (auth.role() = 'authenticated');

-- Supermarket policies
CREATE POLICY "Users can view supermarket data" ON supermarket_customers FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert supermarket data" ON supermarket_customers FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update supermarket data" ON supermarket_customers FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete supermarket data" ON supermarket_customers FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view supermarket products" ON supermarket_products FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert supermarket products" ON supermarket_products FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update supermarket products" ON supermarket_products FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete supermarket products" ON supermarket_products FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view supermarket orders" ON supermarket_orders FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert supermarket orders" ON supermarket_orders FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update supermarket orders" ON supermarket_orders FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete supermarket orders" ON supermarket_orders FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view supermarket staff" ON supermarket_staff FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert supermarket staff" ON supermarket_staff FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update supermarket staff" ON supermarket_staff FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete supermarket staff" ON supermarket_staff FOR DELETE USING (auth.role() = 'authenticated');

-- Courier policies
CREATE POLICY "Users can view courier data" ON courier_customers FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert courier data" ON courier_customers FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update courier data" ON courier_customers FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete courier data" ON courier_customers FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view courier deliveries" ON courier_deliveries FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert courier deliveries" ON courier_deliveries FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update courier deliveries" ON courier_deliveries FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete courier deliveries" ON courier_deliveries FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view courier earnings" ON courier_earnings FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert courier earnings" ON courier_earnings FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update courier earnings" ON courier_earnings FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete courier earnings" ON courier_earnings FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view courier team" ON courier_team FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert courier team" ON courier_team FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update courier team" ON courier_team FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete courier team" ON courier_team FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view courier locations" ON courier_locations FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert courier locations" ON courier_locations FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update courier locations" ON courier_locations FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete courier locations" ON courier_locations FOR DELETE USING (auth.role() = 'authenticated');

-- Driver policies
CREATE POLICY "Users can view driver data" ON driver_customers FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert driver data" ON driver_customers FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update driver data" ON driver_customers FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete driver data" ON driver_customers FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view driver rides" ON driver_rides FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert driver rides" ON driver_rides FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update driver rides" ON driver_rides FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete driver rides" ON driver_rides FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view driver earnings" ON driver_earnings FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert driver earnings" ON driver_earnings FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update driver earnings" ON driver_earnings FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete driver earnings" ON driver_earnings FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view driver team" ON driver_team FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert driver team" ON driver_team FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update driver team" ON driver_team FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete driver team" ON driver_team FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view driver locations" ON driver_locations FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert driver locations" ON driver_locations FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update driver locations" ON driver_locations FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete driver locations" ON driver_locations FOR DELETE USING (auth.role() = 'authenticated');

-- =============================================
-- RPC FUNCTIONS FOR KPIs
-- =============================================

-- Clinic KPIs function
CREATE OR REPLACE FUNCTION clinic_kpis_today()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_appointments', COALESCE((
            SELECT COUNT(*) FROM clinic_appointments
            WHERE DATE(appointment_date) = CURRENT_DATE
        ), 0),
        'completed_appointments', COALESCE((
            SELECT COUNT(*) FROM clinic_appointments
            WHERE DATE(appointment_date) = CURRENT_DATE AND status = 'completed'
        ), 0),
        'pending_appointments', COALESCE((
            SELECT COUNT(*) FROM clinic_appointments
            WHERE DATE(appointment_date) = CURRENT_DATE AND status = 'pending'
        ), 0),
        'total_patients', COALESCE((
            SELECT COUNT(*) FROM clinic_patients
        ), 0),
        'new_patients_today', COALESCE((
            SELECT COUNT(*) FROM clinic_patients
            WHERE DATE(created_at) = CURRENT_DATE
        ), 0),
        'revenue_today', COALESCE((
            SELECT SUM(COALESCE(total_amount, 0)) FROM clinic_appointments
            WHERE DATE(appointment_date) = CURRENT_DATE AND status = 'completed'
        ), 0)
    ) INTO result;

    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Restaurant KPIs function
CREATE OR REPLACE FUNCTION restaurant_kpis_today()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_orders', COALESCE((
            SELECT COUNT(*) FROM restaurant_orders
            WHERE DATE(created_at) = CURRENT_DATE
        ), 0),
        'completed_orders', COALESCE((
            SELECT COUNT(*) FROM restaurant_orders
            WHERE DATE(created_at) = CURRENT_DATE AND status = 'delivered'
        ), 0),
        'pending_orders', COALESCE((
            SELECT COUNT(*) FROM restaurant_orders
            WHERE DATE(created_at) = CURRENT_DATE AND status IN ('pending', 'confirmed', 'preparing', 'ready')
        ), 0),
        'total_revenue', COALESCE((
            SELECT SUM(total_amount) FROM restaurant_orders
            WHERE DATE(created_at) = CURRENT_DATE AND status = 'delivered'
        ), 0),
        'new_customers', COALESCE((
            SELECT COUNT(*) FROM restaurant_customers
            WHERE DATE(created_at) = CURRENT_DATE
        ), 0),
        'avg_order_value', COALESCE((
            SELECT AVG(total_amount) FROM restaurant_orders
            WHERE DATE(created_at) = CURRENT_DATE AND status = 'delivered'
        ), 0)
    ) INTO result;

    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Pharmacy KPIs function
CREATE OR REPLACE FUNCTION pharmacy_kpis_today()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_prescriptions', COALESCE((
            SELECT COUNT(*) FROM pharmacy_prescriptions
            WHERE DATE(created_at) = CURRENT_DATE
        ), 0),
        'completed_prescriptions', COALESCE((
            SELECT COUNT(*) FROM pharmacy_prescriptions
            WHERE DATE(created_at) = CURRENT_DATE AND status = 'filled'
        ), 0),
        'pending_prescriptions', COALESCE((
            SELECT COUNT(*) FROM pharmacy_prescriptions
            WHERE DATE(created_at) = CURRENT_DATE AND status = 'pending'
        ), 0),
        'total_medicines', COALESCE((
            SELECT COUNT(*) FROM pharmacy_medicines
        ), 0),
        'low_stock_medicines', COALESCE((
            SELECT COUNT(*) FROM pharmacy_medicines
            WHERE stock_quantity <= min_stock_level
        ), 0),
        'revenue_today', COALESCE((
            SELECT SUM(COALESCE(total_amount, 0)) FROM pharmacy_prescriptions
            WHERE DATE(created_at) = CURRENT_DATE AND status = 'filled'
        ), 0)
    ) INTO result;

    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Supermarket KPIs function
CREATE OR REPLACE FUNCTION supermarket_kpis_today()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_orders', COALESCE((
            SELECT COUNT(*) FROM supermarket_orders
            WHERE DATE(created_at) = CURRENT_DATE
        ), 0),
        'completed_orders', COALESCE((
            SELECT COUNT(*) FROM supermarket_orders
            WHERE DATE(created_at) = CURRENT_DATE AND status = 'delivered'
        ), 0),
        'pending_orders', COALESCE((
            SELECT COUNT(*) FROM supermarket_orders
            WHERE DATE(created_at) = CURRENT_DATE AND status IN ('pending', 'confirmed', 'packing', 'ready')
        ), 0),
        'total_products', COALESCE((
            SELECT COUNT(*) FROM supermarket_products
        ), 0),
        'low_stock_products', COALESCE((
            SELECT COUNT(*) FROM supermarket_products
            WHERE stock_quantity <= min_stock_level
        ), 0),
        'revenue_today', COALESCE((
            SELECT SUM(total_amount) FROM supermarket_orders
            WHERE DATE(created_at) = CURRENT_DATE AND status = 'delivered'
        ), 0)
    ) INTO result;

    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Courier KPIs function
CREATE OR REPLACE FUNCTION courier_kpis_today()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_deliveries', COALESCE((
            SELECT COUNT(*) FROM courier_deliveries
            WHERE DATE(created_at) = CURRENT_DATE
        ), 0),
        'completed_deliveries', COALESCE((
            SELECT COUNT(*) FROM courier_deliveries
            WHERE DATE(created_at) = CURRENT_DATE AND status = 'delivered'
        ), 0),
        'pending_deliveries', COALESCE((
            SELECT COUNT(*) FROM courier_deliveries
            WHERE DATE(created_at) = CURRENT_DATE AND status IN ('pending', 'accepted', 'picked_up', 'in_transit')
        ), 0),
        'total_earnings', COALESCE((
            SELECT SUM(amount) FROM courier_earnings
            WHERE date = CURRENT_DATE
        ), 0),
        'avg_delivery_time', COALESCE((
            SELECT AVG(actual_time) FROM courier_deliveries
            WHERE DATE(created_at) = CURRENT_DATE AND status = 'delivered' AND actual_time IS NOT NULL
        ), 0),
        'customer_rating', COALESCE((
            SELECT AVG(rating) FROM courier_deliveries
            WHERE DATE(created_at) = CURRENT_DATE AND rating IS NOT NULL
        ), 0)
    ) INTO result;

    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Driver KPIs function
CREATE OR REPLACE FUNCTION driver_kpis_today()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_rides', COALESCE((
            SELECT COUNT(*) FROM driver_rides
            WHERE DATE(created_at) = CURRENT_DATE
        ), 0),
        'completed_rides', COALESCE((
            SELECT COUNT(*) FROM driver_rides
            WHERE DATE(created_at) = CURRENT_DATE AND status = 'completed'
        ), 0),
        'pending_rides', COALESCE((
            SELECT COUNT(*) FROM driver_rides
            WHERE DATE(created_at) = CURRENT_DATE AND status IN ('pending', 'accepted', 'picked_up', 'in_progress')
        ), 0),
        'total_earnings', COALESCE((
            SELECT SUM(amount) FROM driver_earnings
            WHERE date = CURRENT_DATE
        ), 0),
        'avg_ride_time', COALESCE((
            SELECT AVG(actual_time) FROM driver_rides
            WHERE DATE(created_at) = CURRENT_DATE AND status = 'completed' AND actual_time IS NOT NULL
        ), 0),
        'customer_rating', COALESCE((
            SELECT AVG(rating) FROM driver_rides
            WHERE DATE(created_at) = CURRENT_DATE AND rating IS NOT NULL
        ), 0)
    ) INTO result;

    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- STORAGE BUCKETS
-- =============================================

-- Create storage buckets for each dashboard
INSERT INTO storage.buckets (id, name, public) VALUES
('clinic_docs', 'clinic_docs', true),
('restaurant_docs', 'restaurant_docs', true),
('pharmacy_docs', 'pharmacy_docs', true),
('supermarket_docs', 'supermarket_docs', true),
('courier_docs', 'courier_docs', true),
('driver_docs', 'driver_docs', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Users can view clinic documents" ON storage.objects FOR SELECT USING (bucket_id = 'clinic_docs' AND auth.role() = 'authenticated');
CREATE POLICY "Users can upload clinic documents" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'clinic_docs' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update clinic documents" ON storage.objects FOR UPDATE USING (bucket_id = 'clinic_docs' AND auth.role() = 'authenticated');
CREATE POLICY "Users can delete clinic documents" ON storage.objects FOR DELETE USING (bucket_id = 'clinic_docs' AND auth.role() = 'authenticated');

CREATE POLICY "Users can view restaurant documents" ON storage.objects FOR SELECT USING (bucket_id = 'restaurant_docs' AND auth.role() = 'authenticated');
CREATE POLICY "Users can upload restaurant documents" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'restaurant_docs' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update restaurant documents" ON storage.objects FOR UPDATE USING (bucket_id = 'restaurant_docs' AND auth.role() = 'authenticated');
CREATE POLICY "Users can delete restaurant documents" ON storage.objects FOR DELETE USING (bucket_id = 'restaurant_docs' AND auth.role() = 'authenticated');

CREATE POLICY "Users can view pharmacy documents" ON storage.objects FOR SELECT USING (bucket_id = 'pharmacy_docs' AND auth.role() = 'authenticated');
CREATE POLICY "Users can upload pharmacy documents" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'pharmacy_docs' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update pharmacy documents" ON storage.objects FOR UPDATE USING (bucket_id = 'pharmacy_docs' AND auth.role() = 'authenticated');
CREATE POLICY "Users can delete pharmacy documents" ON storage.objects FOR DELETE USING (bucket_id = 'pharmacy_docs' AND auth.role() = 'authenticated');

CREATE POLICY "Users can view supermarket documents" ON storage.objects FOR SELECT USING (bucket_id = 'supermarket_docs' AND auth.role() = 'authenticated');
CREATE POLICY "Users can upload supermarket documents" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'supermarket_docs' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update supermarket documents" ON storage.objects FOR UPDATE USING (bucket_id = 'supermarket_docs' AND auth.role() = 'authenticated');
CREATE POLICY "Users can delete supermarket documents" ON storage.objects FOR DELETE USING (bucket_id = 'supermarket_docs' AND auth.role() = 'authenticated');

CREATE POLICY "Users can view courier documents" ON storage.objects FOR SELECT USING (bucket_id = 'courier_docs' AND auth.role() = 'authenticated');
CREATE POLICY "Users can upload courier documents" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'courier_docs' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update courier documents" ON storage.objects FOR UPDATE USING (bucket_id = 'courier_docs' AND auth.role() = 'authenticated');
CREATE POLICY "Users can delete courier documents" ON storage.objects FOR DELETE USING (bucket_id = 'courier_docs' AND auth.role() = 'authenticated');

CREATE POLICY "Users can view driver documents" ON storage.objects FOR SELECT USING (bucket_id = 'driver_docs' AND auth.role() = 'authenticated');
CREATE POLICY "Users can upload driver documents" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'driver_docs' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update driver documents" ON storage.objects FOR UPDATE USING (bucket_id = 'driver_docs' AND auth.role() = 'authenticated');
CREATE POLICY "Users can delete driver documents" ON storage.objects FOR DELETE USING (bucket_id = 'driver_docs' AND auth.role() = 'authenticated');
