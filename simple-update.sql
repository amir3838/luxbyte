-- Simple Supabase Update
-- تحديث بسيط لقاعدة البيانات

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create profiles table
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

-- Create pharmacy_inventory table
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

-- Create pharmacy_orders table
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

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pharmacy_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE pharmacy_orders ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can manage own data" ON profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users can manage own data" ON pharmacy_inventory FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own data" ON pharmacy_orders FOR ALL USING (auth.uid() = user_id);

-- Insert sample data
INSERT INTO pharmacy_inventory (user_id, name, category, quantity, price, expiry_date) VALUES
('00000000-0000-0000-0000-000000000000', 'Paracetamol 500mg', 'Pain Relief', 100, 15.50, '2025-12-31'),
('00000000-0000-0000-0000-000000000000', 'Vitamin C 1000mg', 'Vitamins', 50, 25.00, '2025-06-30')
ON CONFLICT DO NOTHING;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'LUXBYTE DATABASE UPDATED SUCCESSFULLY!';
    RAISE NOTICE 'تم تحديث قاعدة البيانات بنجاح!';
END $$;
