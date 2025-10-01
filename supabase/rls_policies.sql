-- RLS Policies for Documents Table
-- سياسات RLS لجدول المستندات

-- Enable RLS on documents table
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only read their own documents
CREATE POLICY "read_own_docs" ON documents
FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- Policy: Users can only insert their own documents
CREATE POLICY "insert_own_docs" ON documents
FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

-- Policy: Users can only update their own documents
CREATE POLICY "update_own_docs" ON documents
FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Policy: Users can only delete their own documents
CREATE POLICY "delete_own_docs" ON documents
FOR DELETE TO authenticated
USING (user_id = auth.uid());

-- RLS Policies for Profiles Table
-- سياسات RLS لجدول الملفات الشخصية

-- Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only read their own profile
CREATE POLICY "read_own_profile" ON profiles
FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- Policy: Users can only insert their own profile
CREATE POLICY "insert_own_profile" ON profiles
FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

-- Policy: Users can only update their own profile
CREATE POLICY "update_own_profile" ON profiles
FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- RLS Policies for Storage Bucket
-- سياسات RLS لحاوية التخزين

-- Create storage bucket if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('kyc_docs', 'kyc_docs', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Users can upload files to their own folder
CREATE POLICY "upload_own_files" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'kyc_docs' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Policy: Users can view their own files
CREATE POLICY "view_own_files" ON storage.objects
FOR SELECT TO authenticated
USING (bucket_id = 'kyc_docs' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Policy: Users can update their own files
CREATE POLICY "update_own_files" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'kyc_docs' AND (storage.foldername(name))[1] = auth.uid()::text)
WITH CHECK (bucket_id = 'kyc_docs' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Policy: Users can delete their own files
CREATE POLICY "delete_own_files" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'kyc_docs' AND (storage.foldername(name))[1] = auth.uid()::text);

-- RLS Policies for Business Requests
-- سياسات RLS لطلبات الأعمال

-- Enable RLS on business_requests table
ALTER TABLE business_requests ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only read their own requests
CREATE POLICY "read_own_requests" ON business_requests
FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- Policy: Users can only insert their own requests
CREATE POLICY "insert_own_requests" ON business_requests
FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

-- Policy: Users can only update their own requests
CREATE POLICY "update_own_requests" ON business_requests
FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Admin policies (for admin users)
-- سياسات الإدارة (للمستخدمين الإداريين)

-- Policy: Admins can read all requests
CREATE POLICY "admin_read_all_requests" ON business_requests
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE user_id = auth.uid()
    AND account = 'admin'
  )
);

-- Policy: Admins can update all requests
CREATE POLICY "admin_update_all_requests" ON business_requests
FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE user_id = auth.uid()
    AND account = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE user_id = auth.uid()
    AND account = 'admin'
  )
);
