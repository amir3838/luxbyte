-- LUXBYTE Complete Database Schema
-- This file contains all tables, functions, and policies for the complete system

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- =============================================
-- 1. USERS AND AUTHENTICATION TABLES
-- =============================================

-- User profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255) UNIQUE NOT NULL,
    avatar_url TEXT,
    role VARCHAR(50) DEFAULT 'user',
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    location POINT,
    address TEXT,
    city VARCHAR(100),
    governorate VARCHAR(100),
    postal_code VARCHAR(20),
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    verification_expires TIMESTAMP WITH TIME ZONE
);

-- Business types table
CREATE TABLE IF NOT EXISTS business_types (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name_ar VARCHAR(100) NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    description_ar TEXT,
    description_en TEXT,
    icon VARCHAR(100),
    color VARCHAR(7),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert business types
INSERT INTO business_types (name_ar, name_en, description_ar, description_en, icon, color) VALUES
('مطعم', 'Restaurant', 'منصة إدارة المطاعم', 'Restaurant management platform', 'fas fa-utensils', '#FF6B6B'),
('سوبر ماركت', 'Supermarket', 'منصة إدارة السوبر ماركت', 'Supermarket management platform', 'fas fa-shopping-cart', '#4ECDC4'),
('صيدلية', 'Pharmacy', 'منصة إدارة الصيدليات', 'Pharmacy management platform', 'fas fa-pills', '#45B7D1'),
('عيادة', 'Clinic', 'منصة إدارة العيادات', 'Clinic management platform', 'fas fa-stethoscope', '#96CEB4'),
('مندوب توصيل', 'Courier', 'منصة إدارة مندوبي التوصيل', 'Courier management platform', 'fas fa-motorcycle', '#FFEAA7'),
('سائق', 'Driver', 'منصة إدارة السائقين', 'Driver management platform', 'fas fa-car', '#DDA0DD')
ON CONFLICT DO NOTHING;

-- =============================================
-- 2. BUSINESS REGISTRATION TABLES
-- =============================================

-- Restaurant requests
CREATE TABLE IF NOT EXISTS restaurant_requests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    restaurant_name VARCHAR(255) NOT NULL,
    owner_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    location POINT,
    city VARCHAR(100),
    governorate VARCHAR(100),
    status VARCHAR(20) DEFAULT 'pending',
    documents JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_by UUID REFERENCES user_profiles(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    review_notes TEXT
);

-- Supermarket requests
CREATE TABLE IF NOT EXISTS supermarket_requests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    supermarket_name VARCHAR(255) NOT NULL,
    owner_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    location POINT,
    city VARCHAR(100),
    governorate VARCHAR(100),
    status VARCHAR(20) DEFAULT 'pending',
    documents JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_by UUID REFERENCES user_profiles(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    review_notes TEXT
);

-- Pharmacy requests
CREATE TABLE IF NOT EXISTS pharmacy_requests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    pharmacy_name VARCHAR(255) NOT NULL,
    owner_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    location POINT,
    city VARCHAR(100),
    governorate VARCHAR(100),
    status VARCHAR(20) DEFAULT 'pending',
    documents JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_by UUID REFERENCES user_profiles(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    review_notes TEXT
);

-- Clinic requests
CREATE TABLE IF NOT EXISTS clinic_requests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    clinic_name VARCHAR(255) NOT NULL,
    owner_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    location POINT,
    city VARCHAR(100),
    governorate VARCHAR(100),
    status VARCHAR(20) DEFAULT 'pending',
    documents JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_by UUID REFERENCES user_profiles(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    review_notes TEXT
);

-- Courier requests
CREATE TABLE IF NOT EXISTS courier_requests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    courier_name VARCHAR(255) NOT NULL,
    owner_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    location POINT,
    city VARCHAR(100),
    governorate VARCHAR(100),
    status VARCHAR(20) DEFAULT 'pending',
    documents JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_by UUID REFERENCES user_profiles(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    review_notes TEXT
);

-- Driver requests
CREATE TABLE IF NOT EXISTS driver_requests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    driver_name VARCHAR(255) NOT NULL,
    owner_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    location POINT,
    city VARCHAR(100),
    governorate VARCHAR(100),
    status VARCHAR(20) DEFAULT 'pending',
    documents JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_by UUID REFERENCES user_profiles(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    review_notes TEXT
);

-- =============================================
-- 3. FILE MANAGEMENT SYSTEM
-- =============================================

-- File uploads table
CREATE TABLE IF NOT EXISTS file_uploads (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    business_id UUID,
    business_type VARCHAR(50),
    file_name VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_type VARCHAR(50) NOT NULL, -- 'document', 'image', 'video'
    is_verified BOOLEAN DEFAULT FALSE,
    verified_by UUID REFERENCES user_profiles(id),
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Document types table
CREATE TABLE IF NOT EXISTS document_types (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    business_type VARCHAR(50) NOT NULL,
    name_ar VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    description_ar TEXT,
    description_en TEXT,
    is_required BOOLEAN DEFAULT TRUE,
    accepted_formats TEXT[],
    max_size_mb INTEGER DEFAULT 10,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert document types for each business
INSERT INTO document_types (business_type, name_ar, name_en, description_ar, description_en, accepted_formats) VALUES
-- Restaurant documents
('restaurant', 'السجل التجاري', 'Commercial Register', 'السجل التجاري للمطعم', 'Restaurant commercial register', ARRAY['image/jpeg', 'image/png', 'application/pdf']),
('restaurant', 'البطاقة الضريبية', 'Tax Card', 'البطاقة الضريبية', 'Tax card', ARRAY['image/jpeg', 'image/png', 'application/pdf']),
('restaurant', 'عقد مقر موثق', 'Certified Location Contract', 'عقد مقر موثق', 'Certified location contract', ARRAY['image/jpeg', 'image/png', 'application/pdf']),
('restaurant', 'رخصة تشغيل مأكولات', 'Food License', 'رخصة تشغيل مأكولات', 'Food operation license', ARRAY['image/jpeg', 'image/png', 'application/pdf']),
('restaurant', 'شهادة صحية', 'Health Certificate', 'شهادة صحية', 'Health certificate', ARRAY['image/jpeg', 'image/png', 'application/pdf']),

-- Supermarket documents
('supermarket', 'السجل التجاري', 'Commercial Register', 'السجل التجاري للسوبر ماركت', 'Supermarket commercial register', ARRAY['image/jpeg', 'image/png', 'application/pdf']),
('supermarket', 'البطاقة الضريبية', 'Tax Card', 'البطاقة الضريبية', 'Tax card', ARRAY['image/jpeg', 'image/png', 'application/pdf']),
('supermarket', 'رخصة تجارية', 'Commercial License', 'رخصة تجارية', 'Commercial license', ARRAY['image/jpeg', 'image/png', 'application/pdf']),

-- Pharmacy documents
('pharmacy', 'رخصة الصيدلية', 'Pharmacy License', 'رخصة الصيدلية', 'Pharmacy license', ARRAY['image/jpeg', 'image/png', 'application/pdf']),
('pharmacy', 'شهادة الصيدلي', 'Pharmacist Certificate', 'شهادة الصيدلي', 'Pharmacist certificate', ARRAY['image/jpeg', 'image/png', 'application/pdf']),

-- Clinic documents
('clinic', 'رخصة العيادة', 'Clinic License', 'رخصة العيادة', 'Clinic license', ARRAY['image/jpeg', 'image/png', 'application/pdf']),
('clinic', 'شهادة الطبيب', 'Doctor Certificate', 'شهادة الطبيب', 'Doctor certificate', ARRAY['image/jpeg', 'image/png', 'application/pdf']),

-- Courier documents
('courier', 'الهوية الوطنية', 'National ID', 'الهوية الوطنية', 'National ID', ARRAY['image/jpeg', 'image/png', 'application/pdf']),
('courier', 'رخصة القيادة', 'Driving License', 'رخصة القيادة', 'Driving license', ARRAY['image/jpeg', 'image/png', 'application/pdf']),

-- Driver documents
('driver', 'الهوية الوطنية', 'National ID', 'الهوية الوطنية', 'National ID', ARRAY['image/jpeg', 'image/png', 'application/pdf']),
('driver', 'رخصة القيادة', 'Driving License', 'رخصة القيادة', 'Driving license', ARRAY['image/jpeg', 'image/png', 'application/pdf']),
('driver', 'السجل التجاري', 'Commercial Register', 'السجل التجاري', 'Commercial register', ARRAY['image/jpeg', 'image/png', 'application/pdf'])
ON CONFLICT DO NOTHING;

-- =============================================
-- 4. NOTIFICATION SYSTEM
-- =============================================

-- Push notification tokens
CREATE TABLE IF NOT EXISTS push_tokens (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE,
    platform VARCHAR(20) DEFAULT 'web',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE
);

-- =============================================
-- 5. SYSTEM CONFIGURATION
-- =============================================

-- System settings
CREATE TABLE IF NOT EXISTS system_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default settings
INSERT INTO system_settings (key, value, description, is_public) VALUES
('app_name', 'LUXBYTE', 'Application name', TRUE),
('app_version', '1.3.2', 'Application version', TRUE),
('maintenance_mode', 'false', 'Maintenance mode status', TRUE),
('max_file_size_mb', '10', 'Maximum file size in MB', TRUE),
('allowed_file_types', 'image/jpeg,image/png,application/pdf', 'Allowed file types', TRUE),
('notification_enabled', 'true', 'Enable notifications', TRUE),
('location_required', 'true', 'Require location for registration', TRUE)
ON CONFLICT (key) DO NOTHING;

-- =============================================
-- 6. AUDIT LOGS
-- =============================================

-- Audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100),
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 7. FUNCTIONS AND TRIGGERS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_restaurant_requests_updated_at BEFORE UPDATE ON restaurant_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_supermarket_requests_updated_at BEFORE UPDATE ON supermarket_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pharmacy_requests_updated_at BEFORE UPDATE ON pharmacy_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clinic_requests_updated_at BEFORE UPDATE ON clinic_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courier_requests_updated_at BEFORE UPDATE ON courier_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_driver_requests_updated_at BEFORE UPDATE ON driver_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_push_tokens_updated_at BEFORE UPDATE ON push_tokens FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, first_name, last_name, email)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
        COALESCE(NEW.email, '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to log audit events
CREATE OR REPLACE FUNCTION log_audit_event()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (user_id, action, table_name, record_id, old_values, new_values)
    VALUES (
        COALESCE(NEW.user_id, OLD.user_id),
        TG_OP,
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
        CASE WHEN TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN to_jsonb(NEW) ELSE NULL END
    );
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add audit triggers
CREATE TRIGGER audit_restaurant_requests AFTER INSERT OR UPDATE OR DELETE ON restaurant_requests FOR EACH ROW EXECUTE FUNCTION log_audit_event();
CREATE TRIGGER audit_supermarket_requests AFTER INSERT OR UPDATE OR DELETE ON supermarket_requests FOR EACH ROW EXECUTE FUNCTION log_audit_event();
CREATE TRIGGER audit_pharmacy_requests AFTER INSERT OR UPDATE OR DELETE ON pharmacy_requests FOR EACH ROW EXECUTE FUNCTION log_audit_event();
CREATE TRIGGER audit_clinic_requests AFTER INSERT OR UPDATE OR DELETE ON clinic_requests FOR EACH ROW EXECUTE FUNCTION log_audit_event();
CREATE TRIGGER audit_courier_requests AFTER INSERT OR UPDATE OR DELETE ON courier_requests FOR EACH ROW EXECUTE FUNCTION log_audit_event();
CREATE TRIGGER audit_driver_requests AFTER INSERT OR UPDATE OR DELETE ON driver_requests FOR EACH ROW EXECUTE FUNCTION log_audit_event();

-- =============================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE supermarket_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE pharmacy_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinic_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE courier_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Business types policies (public read)
CREATE POLICY "Anyone can view business types" ON business_types FOR SELECT USING (is_active = true);

-- Restaurant requests policies
CREATE POLICY "Users can view own restaurant requests" ON restaurant_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own restaurant requests" ON restaurant_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own restaurant requests" ON restaurant_requests FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all restaurant requests" ON restaurant_requests FOR SELECT USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Similar policies for other business types
CREATE POLICY "Users can view own supermarket requests" ON supermarket_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own supermarket requests" ON supermarket_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own supermarket requests" ON supermarket_requests FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own pharmacy requests" ON pharmacy_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own pharmacy requests" ON pharmacy_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own pharmacy requests" ON pharmacy_requests FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own clinic requests" ON clinic_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own clinic requests" ON clinic_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own clinic requests" ON clinic_requests FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own courier requests" ON courier_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own courier requests" ON courier_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own courier requests" ON courier_requests FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own driver requests" ON driver_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own driver requests" ON driver_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own driver requests" ON driver_requests FOR UPDATE USING (auth.uid() = user_id);

-- File uploads policies
CREATE POLICY "Users can view own file uploads" ON file_uploads FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own file uploads" ON file_uploads FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own file uploads" ON file_uploads FOR UPDATE USING (auth.uid() = user_id);

-- Document types policies (public read)
CREATE POLICY "Anyone can view document types" ON document_types FOR SELECT USING (is_active = true);

-- Push tokens policies
CREATE POLICY "Users can manage own push tokens" ON push_tokens FOR ALL USING (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- System settings policies (public read for public settings)
CREATE POLICY "Anyone can view public settings" ON system_settings FOR SELECT USING (is_public = true);
CREATE POLICY "Admins can manage all settings" ON system_settings FOR ALL USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);

-- =============================================
-- 9. STORAGE BUCKETS
-- =============================================

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES
('restaurant', 'restaurant', false),
('supermarket', 'supermarket', false),
('pharmacy', 'pharmacy', false),
('clinic', 'clinic', false),
('courier', 'courier', false),
('driver', 'driver', false),
('documents', 'documents', false),
('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Users can upload own files" ON storage.objects FOR INSERT WITH CHECK (
    auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view own files" ON storage.objects FOR SELECT USING (
    auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update own files" ON storage.objects FOR UPDATE USING (
    auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete own files" ON storage.objects FOR DELETE USING (
    auth.uid()::text = (storage.foldername(name))[1]
);

-- =============================================
-- 10. INDEXES FOR PERFORMANCE
-- =============================================

-- User profiles indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_status ON user_profiles(status);
CREATE INDEX IF NOT EXISTS idx_user_profiles_location ON user_profiles USING GIST(location);

-- Business requests indexes
CREATE INDEX IF NOT EXISTS idx_restaurant_requests_user_id ON restaurant_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_restaurant_requests_status ON restaurant_requests(status);
CREATE INDEX IF NOT EXISTS idx_restaurant_requests_location ON restaurant_requests USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_restaurant_requests_created_at ON restaurant_requests(created_at);

CREATE INDEX IF NOT EXISTS idx_supermarket_requests_user_id ON supermarket_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_supermarket_requests_status ON supermarket_requests(status);
CREATE INDEX IF NOT EXISTS idx_supermarket_requests_location ON supermarket_requests USING GIST(location);

CREATE INDEX IF NOT EXISTS idx_pharmacy_requests_user_id ON pharmacy_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_pharmacy_requests_status ON pharmacy_requests(status);
CREATE INDEX IF NOT EXISTS idx_pharmacy_requests_location ON pharmacy_requests USING GIST(location);

CREATE INDEX IF NOT EXISTS idx_clinic_requests_user_id ON clinic_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_clinic_requests_status ON clinic_requests(status);
CREATE INDEX IF NOT EXISTS idx_clinic_requests_location ON clinic_requests USING GIST(location);

CREATE INDEX IF NOT EXISTS idx_courier_requests_user_id ON courier_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_courier_requests_status ON courier_requests(status);
CREATE INDEX IF NOT EXISTS idx_courier_requests_location ON courier_requests USING GIST(location);

CREATE INDEX IF NOT EXISTS idx_driver_requests_user_id ON driver_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_driver_requests_status ON driver_requests(status);
CREATE INDEX IF NOT EXISTS idx_driver_requests_location ON driver_requests USING GIST(location);

-- File uploads indexes
CREATE INDEX IF NOT EXISTS idx_file_uploads_user_id ON file_uploads(user_id);
CREATE INDEX IF NOT EXISTS idx_file_uploads_business_id ON file_uploads(business_id);
CREATE INDEX IF NOT EXISTS idx_file_uploads_business_type ON file_uploads(business_type);
CREATE INDEX IF NOT EXISTS idx_file_uploads_file_type ON file_uploads(file_type);

-- Notifications indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- Push tokens indexes
CREATE INDEX IF NOT EXISTS idx_push_tokens_user_id ON push_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_push_tokens_platform ON push_tokens(platform);
CREATE INDEX IF NOT EXISTS idx_push_tokens_is_active ON push_tokens(is_active);

-- Audit logs indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_name ON audit_logs(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- =============================================
-- 11. VIEWS FOR COMMON QUERIES
-- =============================================

-- View for all business requests
CREATE OR REPLACE VIEW all_business_requests AS
SELECT 
    'restaurant' as business_type,
    id,
    user_id,
    restaurant_name as business_name,
    owner_name,
    phone,
    email,
    address,
    location,
    status,
    created_at,
    updated_at
FROM restaurant_requests
UNION ALL
SELECT 
    'supermarket' as business_type,
    id,
    user_id,
    supermarket_name as business_name,
    owner_name,
    phone,
    email,
    address,
    location,
    status,
    created_at,
    updated_at
FROM supermarket_requests
UNION ALL
SELECT 
    'pharmacy' as business_type,
    id,
    user_id,
    pharmacy_name as business_name,
    owner_name,
    phone,
    email,
    address,
    location,
    status,
    created_at,
    updated_at
FROM pharmacy_requests
UNION ALL
SELECT 
    'clinic' as business_type,
    id,
    user_id,
    clinic_name as business_name,
    owner_name,
    phone,
    email,
    address,
    location,
    status,
    created_at,
    updated_at
FROM clinic_requests
UNION ALL
SELECT 
    'courier' as business_type,
    id,
    user_id,
    courier_name as business_name,
    owner_name,
    phone,
    email,
    address,
    location,
    status,
    created_at,
    updated_at
FROM courier_requests
UNION ALL
SELECT 
    'driver' as business_type,
    id,
    user_id,
    driver_name as business_name,
    owner_name,
    phone,
    email,
    address,
    location,
    status,
    created_at,
    updated_at
FROM driver_requests;

-- View for user dashboard data
CREATE OR REPLACE VIEW user_dashboard_data AS
SELECT 
    up.id,
    up.first_name,
    up.last_name,
    up.email,
    up.role,
    up.status,
    up.created_at,
    up.last_login,
    COUNT(abr.id) as total_requests,
    COUNT(CASE WHEN abr.status = 'pending' THEN 1 END) as pending_requests,
    COUNT(CASE WHEN abr.status = 'approved' THEN 1 END) as approved_requests,
    COUNT(CASE WHEN abr.status = 'rejected' THEN 1 END) as rejected_requests
FROM user_profiles up
LEFT JOIN all_business_requests abr ON up.id = abr.user_id
GROUP BY up.id, up.first_name, up.last_name, up.email, up.role, up.status, up.created_at, up.last_login;

-- =============================================
-- 12. COMPLETE SYSTEM READY
-- =============================================

-- Final verification query
SELECT 
    'Database setup completed successfully' as status,
    COUNT(*) as total_tables
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
    'user_profiles', 'business_types', 'restaurant_requests', 
    'supermarket_requests', 'pharmacy_requests', 'clinic_requests',
    'courier_requests', 'driver_requests', 'file_uploads',
    'document_types', 'push_tokens', 'notifications',
    'system_settings', 'audit_logs'
);
