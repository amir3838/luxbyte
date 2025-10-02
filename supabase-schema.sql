-- ===============================
-- LUXBYTE SUPABASE SCHEMA
-- منصة الأعمال الذكية - قاعدة البيانات
-- ===============================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ===============================
-- PROFILES TABLE
-- جدول الملفات الشخصية
-- ===============================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    account TEXT NOT NULL CHECK (account IN ('pharmacy', 'supermarket', 'restaurant', 'clinic', 'courier', 'driver', 'admin')),
    city TEXT,
    full_name TEXT,
    phone TEXT,
    business_name TEXT,
    business_address TEXT,
    business_license TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================
-- PHARMACY TABLES
-- جداول الصيدلية
-- ===============================

-- Pharmacy Documents
CREATE TABLE IF NOT EXISTS pharmacy_documents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    kind TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    public_url TEXT,
    required BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pharmacy Inventory
CREATE TABLE IF NOT EXISTS pharmacy_inventory (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT,
    quantity INTEGER DEFAULT 0,
    price DECIMAL(10,2),
    expiry_date DATE,
    low_stock_threshold INTEGER DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pharmacy Orders
CREATE TABLE IF NOT EXISTS pharmacy_orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    customer_name TEXT NOT NULL,
    customer_phone TEXT,
    total_amount DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pharmacy Order Items
CREATE TABLE IF NOT EXISTS pharmacy_order_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES pharmacy_orders(id) ON DELETE CASCADE,
    medicine_id UUID REFERENCES pharmacy_inventory(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================
-- RESTAURANT TABLES
-- جداول المطعم
-- ===============================

-- Restaurant Documents
CREATE TABLE IF NOT EXISTS restaurant_documents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    kind TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    public_url TEXT,
    required BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Restaurant Menu Items
CREATE TABLE IF NOT EXISTS restaurant_menu_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url TEXT,
    available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Restaurant Orders
CREATE TABLE IF NOT EXISTS restaurant_orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    customer_name TEXT NOT NULL,
    customer_phone TEXT,
    total_amount DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Restaurant Order Items
CREATE TABLE IF NOT EXISTS restaurant_order_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES restaurant_orders(id) ON DELETE CASCADE,
    menu_item_id UUID REFERENCES restaurant_menu_items(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    special_instructions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================
-- SUPERMARKET TABLES
-- جداول السوبر ماركت
-- ===============================

-- Supermarket Documents
CREATE TABLE IF NOT EXISTS supermarket_documents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    kind TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    public_url TEXT,
    required BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Supermarket Products
CREATE TABLE IF NOT EXISTS supermarket_products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT,
    brand TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INTEGER DEFAULT 0,
    low_stock_threshold INTEGER DEFAULT 10,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Supermarket Orders
CREATE TABLE IF NOT EXISTS supermarket_orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    customer_name TEXT NOT NULL,
    customer_phone TEXT,
    total_amount DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'packing', 'ready', 'delivered', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Supermarket Order Items
CREATE TABLE IF NOT EXISTS supermarket_order_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES supermarket_orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES supermarket_products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================
-- CLINIC TABLES
-- جداول العيادة
-- ===============================

-- Clinic Documents
CREATE TABLE IF NOT EXISTS clinic_documents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    kind TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    public_url TEXT,
    required BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clinic Patients
CREATE TABLE IF NOT EXISTS clinic_patients (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    age INTEGER,
    gender TEXT CHECK (gender IN ('male', 'female')),
    address TEXT,
    medical_history TEXT,
    last_visit TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clinic Appointments
CREATE TABLE IF NOT EXISTS clinic_appointments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    patient_id UUID REFERENCES clinic_patients(id) ON DELETE CASCADE,
    appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in-progress', 'completed', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clinic Medical Records
CREATE TABLE IF NOT EXISTS clinic_medical_records (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    patient_id UUID REFERENCES clinic_patients(id) ON DELETE CASCADE,
    diagnosis TEXT,
    treatment TEXT,
    prescription TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clinic Staff
CREATE TABLE IF NOT EXISTS clinic_staff (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    role TEXT,
    phone TEXT,
    email TEXT,
    specialization TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================
-- COURIER TABLES
-- جداول مندوب التوصيل
-- ===============================

-- Courier Documents
CREATE TABLE IF NOT EXISTS courier_documents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    kind TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    public_url TEXT,
    required BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Courier Deliveries
CREATE TABLE IF NOT EXISTS courier_deliveries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    customer_name TEXT NOT NULL,
    customer_phone TEXT,
    pickup_address TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    package_description TEXT,
    delivery_fee DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'picked-up', 'in-transit', 'delivered', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Courier Locations
CREATE TABLE IF NOT EXISTS courier_locations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Courier Shifts
CREATE TABLE IF NOT EXISTS courier_shifts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    start_at TIMESTAMP WITH TIME ZONE NOT NULL,
    end_at TIMESTAMP WITH TIME ZONE,
    total_hours DECIMAL(4,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================
-- DRIVER TABLES
-- جداول السائق
-- ===============================

-- Driver Documents
CREATE TABLE IF NOT EXISTS driver_documents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    kind TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    public_url TEXT,
    required BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Driver Rides
CREATE TABLE IF NOT EXISTS driver_rides (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    customer_name TEXT NOT NULL,
    customer_phone TEXT,
    pickup_location TEXT NOT NULL,
    dropoff_location TEXT NOT NULL,
    fare DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'in-progress', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Driver Locations
CREATE TABLE IF NOT EXISTS driver_locations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================
-- STORAGE BUCKETS
-- مجلدات التخزين
-- ===============================

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES
('pharmacy_docs', 'pharmacy_docs', true),
('restaurant_docs', 'restaurant_docs', true),
('supermarket_docs', 'supermarket_docs', true),
('clinic_docs', 'clinic_docs', true),
('courier_docs', 'courier_docs', true),
('driver_docs', 'driver_docs', true)
ON CONFLICT (id) DO NOTHING;

-- ===============================
-- ROW LEVEL SECURITY (RLS)
-- أمان مستوى الصف
-- ===============================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pharmacy_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE pharmacy_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE pharmacy_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE pharmacy_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE supermarket_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE supermarket_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE supermarket_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE supermarket_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinic_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinic_patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinic_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinic_medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinic_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE courier_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE courier_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE courier_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE courier_shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_rides ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_locations ENABLE ROW LEVEL SECURITY;

-- ===============================
-- RLS POLICIES
-- سياسات أمان مستوى الصف
-- ===============================

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Pharmacy policies
CREATE POLICY "Users can manage own pharmacy data" ON pharmacy_documents FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own pharmacy inventory" ON pharmacy_inventory FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own pharmacy orders" ON pharmacy_orders FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own pharmacy order items" ON pharmacy_order_items FOR ALL USING (
    EXISTS (SELECT 1 FROM pharmacy_orders WHERE id = order_id AND user_id = auth.uid())
);

-- Restaurant policies
CREATE POLICY "Users can manage own restaurant data" ON restaurant_documents FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own restaurant menu" ON restaurant_menu_items FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own restaurant orders" ON restaurant_orders FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own restaurant order items" ON restaurant_order_items FOR ALL USING (
    EXISTS (SELECT 1 FROM restaurant_orders WHERE id = order_id AND user_id = auth.uid())
);

-- Supermarket policies
CREATE POLICY "Users can manage own supermarket data" ON supermarket_documents FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own supermarket products" ON supermarket_products FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own supermarket orders" ON supermarket_orders FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own supermarket order items" ON supermarket_order_items FOR ALL USING (
    EXISTS (SELECT 1 FROM supermarket_orders WHERE id = order_id AND user_id = auth.uid())
);

-- Clinic policies
CREATE POLICY "Users can manage own clinic data" ON clinic_documents FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own clinic patients" ON clinic_patients FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own clinic appointments" ON clinic_appointments FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own clinic medical records" ON clinic_medical_records FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own clinic staff" ON clinic_staff FOR ALL USING (auth.uid() = user_id);

-- Courier policies
CREATE POLICY "Users can manage own courier data" ON courier_documents FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own courier deliveries" ON courier_deliveries FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own courier locations" ON courier_locations FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own courier shifts" ON courier_shifts FOR ALL USING (auth.uid() = user_id);

-- Driver policies
CREATE POLICY "Users can manage own driver data" ON driver_documents FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own driver rides" ON driver_rides FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own driver locations" ON driver_locations FOR ALL USING (auth.uid() = user_id);

-- ===============================
-- FUNCTIONS
-- الدوال
-- ===============================

-- Function to get pharmacy KPIs
CREATE OR REPLACE FUNCTION pharmacy_kpis_today()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'docs_required', 5,
        'docs_completed', COALESCE((SELECT COUNT(*) FROM pharmacy_documents WHERE user_id = auth.uid()), 0),
        'orders_today', COALESCE((SELECT COUNT(*) FROM pharmacy_orders WHERE user_id = auth.uid() AND DATE(created_at) = CURRENT_DATE), 0),
        'revenue_today', COALESCE((SELECT SUM(total_amount) FROM pharmacy_orders WHERE user_id = auth.uid() AND DATE(created_at) = CURRENT_DATE), 0)
    ) INTO result;
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get restaurant KPIs
CREATE OR REPLACE FUNCTION restaurant_kpis_today()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'docs_required', 5,
        'docs_completed', COALESCE((SELECT COUNT(*) FROM restaurant_documents WHERE user_id = auth.uid()), 0),
        'orders_today', COALESCE((SELECT COUNT(*) FROM restaurant_orders WHERE user_id = auth.uid() AND DATE(created_at) = CURRENT_DATE), 0),
        'revenue_today', COALESCE((SELECT SUM(total_amount) FROM restaurant_orders WHERE user_id = auth.uid() AND DATE(created_at) = CURRENT_DATE), 0)
    ) INTO result;
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get supermarket KPIs
CREATE OR REPLACE FUNCTION supermarket_kpis_today()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'docs_required', 5,
        'docs_completed', COALESCE((SELECT COUNT(*) FROM supermarket_documents WHERE user_id = auth.uid()), 0),
        'orders_today', COALESCE((SELECT COUNT(*) FROM supermarket_orders WHERE user_id = auth.uid() AND DATE(created_at) = CURRENT_DATE), 0),
        'revenue_today', COALESCE((SELECT SUM(total_amount) FROM supermarket_orders WHERE user_id = auth.uid() AND DATE(created_at) = CURRENT_DATE), 0)
    ) INTO result;
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get clinic KPIs
CREATE OR REPLACE FUNCTION clinic_kpis_today()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'docs_required', 5,
        'docs_completed', COALESCE((SELECT COUNT(*) FROM clinic_documents WHERE user_id = auth.uid()), 0),
        'patients_today', COALESCE((SELECT COUNT(*) FROM clinic_patients WHERE user_id = auth.uid() AND DATE(created_at) = CURRENT_DATE), 0),
        'appts_today', COALESCE((SELECT COUNT(*) FROM clinic_appointments WHERE user_id = auth.uid() AND DATE(appointment_date) = CURRENT_DATE), 0),
        'revenue_today', 0,
        'activated', true,
        'free_rooms', 3,
        'total_rooms', 5
    ) INTO result;
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get courier KPIs
CREATE OR REPLACE FUNCTION courier_kpis_today()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'docs_required', 5,
        'docs_completed', COALESCE((SELECT COUNT(*) FROM courier_documents WHERE user_id = auth.uid()), 0),
        'deliveries_today', COALESCE((SELECT COUNT(*) FROM courier_deliveries WHERE user_id = auth.uid() AND DATE(created_at) = CURRENT_DATE), 0),
        'earnings_today', COALESCE((SELECT SUM(delivery_fee) FROM courier_deliveries WHERE user_id = auth.uid() AND DATE(created_at) = CURRENT_DATE), 0)
    ) INTO result;
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get driver KPIs
CREATE OR REPLACE FUNCTION driver_kpis_today()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'docs_required', 5,
        'docs_completed', COALESCE((SELECT COUNT(*) FROM driver_documents WHERE user_id = auth.uid()), 0),
        'rides_today', COALESCE((SELECT COUNT(*) FROM driver_rides WHERE user_id = auth.uid() AND DATE(created_at) = CURRENT_DATE), 0),
        'earnings_today', COALESCE((SELECT SUM(fare) FROM driver_rides WHERE user_id = auth.uid() AND DATE(created_at) = CURRENT_DATE), 0)
    ) INTO result;
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===============================
-- TRIGGERS
-- المشغلات
-- ===============================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pharmacy_inventory_updated_at BEFORE UPDATE ON pharmacy_inventory FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pharmacy_orders_updated_at BEFORE UPDATE ON pharmacy_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_restaurant_menu_items_updated_at BEFORE UPDATE ON restaurant_menu_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_restaurant_orders_updated_at BEFORE UPDATE ON restaurant_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_supermarket_products_updated_at BEFORE UPDATE ON supermarket_products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_supermarket_orders_updated_at BEFORE UPDATE ON supermarket_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clinic_patients_updated_at BEFORE UPDATE ON clinic_patients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clinic_appointments_updated_at BEFORE UPDATE ON clinic_appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courier_deliveries_updated_at BEFORE UPDATE ON courier_deliveries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_driver_rides_updated_at BEFORE UPDATE ON driver_rides FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===============================
-- SAMPLE DATA
-- بيانات تجريبية
-- ===============================

-- Insert sample pharmacy data
INSERT INTO pharmacy_inventory (user_id, name, category, quantity, price, expiry_date) VALUES
('00000000-0000-0000-0000-000000000000', 'أسبرين 100 مجم', 'مسكنات', 50, 5.50, '2025-12-31'),
('00000000-0000-0000-0000-000000000000', 'باراسيتامول 500 مجم', 'مسكنات', 30, 3.25, '2025-10-15'),
('00000000-0000-0000-0000-000000000000', 'فيتامين سي 1000 مجم', 'فيتامينات', 25, 12.00, '2025-08-20')
ON CONFLICT DO NOTHING;

-- Insert sample restaurant menu items
INSERT INTO restaurant_menu_items (user_id, name, description, category, price) VALUES
('00000000-0000-0000-0000-000000000000', 'برجر لحم', 'برجر لحم طازج مع الخضار', 'وجبات رئيسية', 25.00),
('00000000-0000-0000-0000-000000000000', 'بيتزا مارغريتا', 'بيتزا بالجبن والطماطم', 'بيتزا', 35.00),
('00000000-0000-0000-0000-000000000000', 'سلطة خضراء', 'سلطة طازجة مع الخضار الموسمية', 'سلطات', 15.00)
ON CONFLICT DO NOTHING;

-- Insert sample supermarket products
INSERT INTO supermarket_products (user_id, name, category, brand, price, stock_quantity) VALUES
('00000000-0000-0000-0000-000000000000', 'أرز بسمتي', 'أرز', 'أبو كاس', 8.50, 100),
('00000000-0000-0000-0000-000000000000', 'زيت عباد الشمس', 'زيوت', 'الزيت الذهبي', 12.00, 50),
('00000000-0000-0000-0000-000000000000', 'سكر أبيض', 'سكر', 'سكر الأهرام', 6.75, 75)
ON CONFLICT DO NOTHING;

-- ===============================
-- AUTHENTICATION SETTINGS
-- إعدادات المصادقة
-- ===============================

-- Update auth settings
UPDATE auth.config SET
    site_url = 'https://luxbyte.vercel.app',
    additional_redirect_urls = '{
        "https://luxbyte.vercel.app/email-confirmation.html",
        "https://luxbyte.vercel.app/reset-password.html",
        "https://luxbyte.vercel.app/auth-success.html",
        "https://luxbyte.vercel.app/complete-registration.html",
        "http://localhost:3000/email-confirmation.html",
        "http://localhost:3000/reset-password.html",
        "http://localhost:3000/auth-success.html",
        "http://localhost:3000/complete-registration.html"
    }'
WHERE id = 1;

-- ===============================
-- COMPLETION MESSAGE
-- رسالة الإكمال
-- ===============================
DO $$
BEGIN
    RAISE NOTICE '✅ تم إنشاء قاعدة بيانات Luxbyte بنجاح!';
    RAISE NOTICE '📊 تم إنشاء % جداول', (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public');
    RAISE NOTICE '🔐 تم تفعيل أمان مستوى الصف (RLS)';
    RAISE NOTICE '📦 تم إنشاء % مجلدات تخزين', (SELECT COUNT(*) FROM storage.buckets);
    RAISE NOTICE '⚙️ تم إنشاء % دوال', (SELECT COUNT(*) FROM information_schema.routines WHERE routine_schema = 'public');
    RAISE NOTICE '🎯 المنصة جاهزة للاستخدام!';
END $$;
