-- ===============================
-- LUXBYTE SUPABASE UPDATE
-- تحديث قاعدة البيانات
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
    inventory_id UUID REFERENCES pharmacy_inventory(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================
-- RESTAURANT TABLES
-- جداول المطعم
-- ===============================

-- Restaurant Menu
CREATE TABLE IF NOT EXISTS restaurant_menu (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category TEXT,
    available BOOLEAN DEFAULT true,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Restaurant Orders
CREATE TABLE IF NOT EXISTS restaurant_orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    customer_name TEXT NOT NULL,
    customer_phone TEXT,
    customer_address TEXT,
    total_amount DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Restaurant Order Items
CREATE TABLE IF NOT EXISTS restaurant_order_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES restaurant_orders(id) ON DELETE CASCADE,
    menu_id UUID REFERENCES restaurant_menu(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    special_instructions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================
-- SUPERMARKET TABLES
-- جداول السوبر ماركت
-- ===============================

-- Supermarket Products
CREATE TABLE IF NOT EXISTS supermarket_products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category TEXT,
    stock_quantity INTEGER DEFAULT 0,
    min_stock_level INTEGER DEFAULT 0,
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
    customer_address TEXT,
    total_amount DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled')),
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

-- Clinic Patients
CREATE TABLE IF NOT EXISTS clinic_patients (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    date_of_birth DATE,
    gender TEXT,
    address TEXT,
    medical_history TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clinic Appointments
CREATE TABLE IF NOT EXISTS clinic_appointments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    patient_id UUID REFERENCES clinic_patients(id) ON DELETE CASCADE,
    appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER DEFAULT 30,
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================
-- COURIER TABLES
-- جداول مندوب التوصيل
-- ===============================

-- Courier Deliveries
CREATE TABLE IF NOT EXISTS courier_deliveries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    order_id TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT,
    pickup_address TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'picked_up', 'in_transit', 'delivered', 'failed', 'cancelled')),
    delivery_fee DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================
-- DRIVER TABLES
-- جداول السائق
-- ===============================

-- Driver Trips
CREATE TABLE IF NOT EXISTS driver_trips (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    passenger_name TEXT,
    passenger_phone TEXT,
    pickup_location TEXT NOT NULL,
    destination TEXT NOT NULL,
    fare DECIMAL(10,2) DEFAULT 0,
    status TEXT DEFAULT 'available' CHECK (status IN ('available', 'booked', 'in_progress', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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
ALTER TABLE restaurant_menu ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE supermarket_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE supermarket_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE supermarket_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinic_patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinic_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE courier_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_trips ENABLE ROW LEVEL SECURITY;

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
CREATE POLICY "Users can manage own pharmacy data" ON pharmacy_inventory FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own pharmacy data" ON pharmacy_orders FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own pharmacy data" ON pharmacy_order_items FOR ALL USING (auth.uid() = user_id);

-- Restaurant policies
CREATE POLICY "Users can manage own restaurant data" ON restaurant_menu FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own restaurant data" ON restaurant_orders FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own restaurant data" ON restaurant_order_items FOR ALL USING (auth.uid() = user_id);

-- Supermarket policies
CREATE POLICY "Users can manage own supermarket data" ON supermarket_products FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own supermarket data" ON supermarket_orders FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own supermarket data" ON supermarket_order_items FOR ALL USING (auth.uid() = user_id);

-- Clinic policies
CREATE POLICY "Users can manage own clinic data" ON clinic_patients FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own clinic data" ON clinic_appointments FOR ALL USING (auth.uid() = user_id);

-- Courier policies
CREATE POLICY "Users can manage own courier data" ON courier_deliveries FOR ALL USING (auth.uid() = user_id);

-- Driver policies
CREATE POLICY "Users can manage own driver data" ON driver_trips FOR ALL USING (auth.uid() = user_id);

-- ===============================
-- FUNCTIONS
-- الدوال
-- ===============================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pharmacy_inventory_updated_at BEFORE UPDATE ON pharmacy_inventory FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pharmacy_orders_updated_at BEFORE UPDATE ON pharmacy_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_restaurant_menu_updated_at BEFORE UPDATE ON restaurant_menu FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_restaurant_orders_updated_at BEFORE UPDATE ON restaurant_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_supermarket_products_updated_at BEFORE UPDATE ON supermarket_products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_supermarket_orders_updated_at BEFORE UPDATE ON supermarket_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clinic_patients_updated_at BEFORE UPDATE ON clinic_patients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clinic_appointments_updated_at BEFORE UPDATE ON clinic_appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courier_deliveries_updated_at BEFORE UPDATE ON courier_deliveries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_driver_trips_updated_at BEFORE UPDATE ON driver_trips FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===============================
-- STORAGE BUCKETS
-- دلو التخزين
-- ===============================

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES
('documents', 'documents', true),
('images', 'images', true),
('files', 'files', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Users can upload own files" ON storage.objects FOR INSERT WITH CHECK (auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can view own files" ON storage.objects FOR SELECT USING (auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can update own files" ON storage.objects FOR UPDATE USING (auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete own files" ON storage.objects FOR DELETE USING (auth.uid()::text = (storage.foldername(name))[1]);

-- ===============================
-- SAMPLE DATA
-- بيانات تجريبية
-- ===============================

-- Insert sample pharmacy inventory
INSERT INTO pharmacy_inventory (user_id, name, category, quantity, price, expiry_date) VALUES
('00000000-0000-0000-0000-000000000000', 'Paracetamol 500mg', 'Pain Relief', 100, 15.50, '2025-12-31'),
('00000000-0000-0000-0000-000000000000', 'Vitamin C 1000mg', 'Vitamins', 50, 25.00, '2025-06-30'),
('00000000-0000-0000-0000-000000000000', 'Antibiotic Cream', 'Antibiotics', 30, 35.75, '2025-09-15')
ON CONFLICT DO NOTHING;

-- Insert sample restaurant menu
INSERT INTO restaurant_menu (user_id, name, description, price, category, available) VALUES
('00000000-0000-0000-0000-000000000000', 'Chicken Shawarma', 'Fresh chicken with vegetables and tahini', 25.00, 'Main Dishes', true),
('00000000-0000-0000-0000-000000000000', 'Falafel Sandwich', 'Crispy falafel with fresh vegetables', 15.00, 'Sandwiches', true),
('00000000-0000-0000-0000-000000000000', 'Fresh Juice', 'Orange, apple, or mixed fruit juice', 8.00, 'Beverages', true)
ON CONFLICT DO NOTHING;

-- Insert sample supermarket products
INSERT INTO supermarket_products (user_id, name, description, price, category, stock_quantity, min_stock_level) VALUES
('00000000-0000-0000-0000-000000000000', 'Fresh Milk 1L', 'Fresh cow milk', 12.00, 'Dairy', 50, 10),
('00000000-0000-0000-0000-000000000000', 'Bread Loaf', 'Fresh white bread', 5.50, 'Bakery', 25, 5),
('00000000-0000-0000-0000-000000000000', 'Apples 1kg', 'Fresh red apples', 8.00, 'Fruits', 30, 8)
ON CONFLICT DO NOTHING;

-- ===============================
-- COMPLETION MESSAGE
-- رسالة الإكمال
-- ===============================

DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'LUXBYTE DATABASE UPDATE COMPLETED!';
    RAISE NOTICE 'تم تحديث قاعدة البيانات بنجاح!';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Tables created: 15';
    RAISE NOTICE 'Policies created: 20+';
    RAISE NOTICE 'Functions created: 1';
    RAISE NOTICE 'Triggers created: 10';
    RAISE NOTICE 'Sample data inserted';
    RAISE NOTICE '========================================';
END $$;
