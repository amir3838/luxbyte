-- LUXBYTE RLS Policies for Tables with user_id
-- سياسات RLS للجداول التي تحتوي على user_id

-- Documents Table
-- جدول المستندات
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS sel_own ON documents;
CREATE POLICY sel_own ON documents
FOR SELECT TO authenticated
USING (user_id = auth.uid());

DROP POLICY IF EXISTS ins_own ON documents;
CREATE POLICY ins_own ON documents
FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS upd_own ON documents;
CREATE POLICY upd_own ON documents
FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS del_own ON documents;
CREATE POLICY del_own ON documents
FOR DELETE TO authenticated
USING (user_id = auth.uid());

-- Profiles Table
-- جدول الملفات الشخصية
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS sel_own ON profiles;
CREATE POLICY sel_own ON profiles
FOR SELECT TO authenticated
USING (user_id = auth.uid());

DROP POLICY IF EXISTS ins_own ON profiles;
CREATE POLICY ins_own ON profiles
FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS upd_own ON profiles;
CREATE POLICY upd_own ON profiles
FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Business Requests Tables
-- جداول طلبات الأعمال
DO $$
DECLARE
    table_name TEXT;
    tables TEXT[] := ARRAY[
        'business_requests',
        'restaurant_requests',
        'supermarket_requests',
        'pharmacy_requests',
        'clinic_requests',
        'courier_requests',
        'driver_requests'
    ];
BEGIN
    FOREACH table_name IN ARRAY tables
    LOOP
        -- Enable RLS if table exists
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = table_name AND table_schema = 'public') THEN
            EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', table_name);

            -- Drop existing policies
            EXECUTE format('DROP POLICY IF EXISTS sel_own ON %I', table_name);
            EXECUTE format('DROP POLICY IF EXISTS ins_own ON %I', table_name);
            EXECUTE format('DROP POLICY IF EXISTS upd_own ON %I', table_name);
            EXECUTE format('DROP POLICY IF EXISTS del_own ON %I', table_name);

            -- Create policies
            EXECUTE format('CREATE POLICY sel_own ON %I FOR SELECT TO authenticated USING (user_id = auth.uid())', table_name);
            EXECUTE format('CREATE POLICY ins_own ON %I FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid())', table_name);
            EXECUTE format('CREATE POLICY upd_own ON %I FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid())', table_name);
            EXECUTE format('CREATE POLICY del_own ON %I FOR DELETE TO authenticated USING (user_id = auth.uid())', table_name);

            RAISE NOTICE 'Applied RLS policies to table: %', table_name;
        END IF;
    END LOOP;
END $$;

-- ==============================================
-- 2. Admin Function and Policies
-- دالة الإدارة والسياسات
-- ==============================================

-- Create admin function
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid() AND account = 'admin'
  );
$$;

-- Admin policies for all tables
DO $$
DECLARE
    table_name TEXT;
    tables TEXT[] := ARRAY[
        'documents',
        'profiles',
        'business_requests',
        'restaurant_requests',
        'supermarket_requests',
        'pharmacy_requests',
        'clinic_requests',
        'courier_requests',
        'driver_requests'
    ];
BEGIN
    FOREACH table_name IN ARRAY tables
    LOOP
        -- Create admin policy if table exists
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = table_name AND table_schema = 'public') THEN
            EXECUTE format('DROP POLICY IF EXISTS admin_full ON %I', table_name);
            EXECUTE format('CREATE POLICY admin_full ON %I FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin())', table_name);
            RAISE NOTICE 'Applied admin policy to table: %', table_name;
        END IF;
    END LOOP;
END $$;


-- ==============================================
-- 3. Storage Policies for kyc_docs bucket
-- سياسات التخزين لحاوية kyc_docs
-- ==============================================

-- Create storage bucket if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('kyc_docs', 'kyc_docs', true)
ON CONFLICT (id) DO NOTHING;

-- Option A: Public bucket with user folder restrictions
-- الخيار أ: حاوية عامة مع قيود مجلد المستخدم

-- Insert policy - users can only upload to their own folder
CREATE POLICY ins_user_folder ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'kyc_docs'
  AND name LIKE auth.uid()::text || '/%'
);

-- Update policy - users can only update their own files
CREATE POLICY upd_user_folder ON storage.objects
FOR UPDATE TO authenticated
USING (
  bucket_id = 'kyc_docs'
  AND name LIKE auth.uid()::text || '/%'
)
WITH CHECK (
  bucket_id = 'kyc_docs'
  AND name LIKE auth.uid()::text || '/%'
);

-- Delete policy - users can only delete their own files
CREATE POLICY del_user_folder ON storage.objects
FOR DELETE TO authenticated
USING (
  bucket_id = 'kyc_docs'
  AND name LIKE auth.uid()::text || '/%'
);

-- Select policy - users can only view their own files
CREATE POLICY sel_user_folder ON storage.objects
FOR SELECT TO authenticated
USING (
  bucket_id = 'kyc_docs'
  AND name LIKE auth.uid()::text || '/%'
);

-- Admin can access all files
CREATE POLICY admin_full_storage ON storage.objects
FOR ALL TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- ==============================================
-- 4. Additional Security Tables
-- جداول أمان إضافية
-- ==============================================

-- User Devices Table (if exists)
-- جدول أجهزة المستخدمين
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_devices') THEN
        ALTER TABLE user_devices ENABLE ROW LEVEL SECURITY;

        DROP POLICY IF EXISTS sel_own ON user_devices;
        CREATE POLICY sel_own ON user_devices
        FOR SELECT TO authenticated
        USING (user_id = auth.uid());

        DROP POLICY IF EXISTS ins_own ON user_devices;
        CREATE POLICY ins_own ON user_devices
        FOR INSERT TO authenticated
        WITH CHECK (user_id = auth.uid());

        DROP POLICY IF EXISTS upd_own ON user_devices;
        CREATE POLICY upd_own ON user_devices
        FOR UPDATE TO authenticated
        USING (user_id = auth.uid())
        WITH CHECK (user_id = auth.uid());

        DROP POLICY IF EXISTS del_own ON user_devices;
        CREATE POLICY del_own ON user_devices
        FOR DELETE TO authenticated
        USING (user_id = auth.uid());
    END IF;
END $$;

-- Push Tokens Table (if exists)
-- جدول رموز الإشعارات
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'push_tokens') THEN
        ALTER TABLE push_tokens ENABLE ROW LEVEL SECURITY;

        DROP POLICY IF EXISTS sel_own ON push_tokens;
        CREATE POLICY sel_own ON push_tokens
        FOR SELECT TO authenticated
        USING (user_id = auth.uid());

        DROP POLICY IF EXISTS ins_own ON push_tokens;
        CREATE POLICY ins_own ON push_tokens
        FOR INSERT TO authenticated
        WITH CHECK (user_id = auth.uid());

        DROP POLICY IF EXISTS upd_own ON push_tokens;
        CREATE POLICY upd_own ON push_tokens
        FOR UPDATE TO authenticated
        USING (user_id = auth.uid())
        WITH CHECK (user_id = auth.uid());

        DROP POLICY IF EXISTS del_own ON push_tokens;
        CREATE POLICY del_own ON push_tokens
        FOR DELETE TO authenticated
        USING (user_id = auth.uid());
    END IF;
END $$;

-- ==============================================
-- 5. Verification Queries
-- استعلامات التحقق
-- ==============================================

-- Check RLS status
SELECT
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('documents', 'profiles', 'business_requests', 'user_devices', 'push_tokens')
ORDER BY tablename;

-- Check policies
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Check storage policies
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'storage'
ORDER BY tablename, policyname;
