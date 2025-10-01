-- LUXBYTE Storage Policies
-- سياسات التخزين

-- Create storage bucket if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('kyc_docs', 'kyc_docs', true)
ON CONFLICT (id) DO NOTHING;

-- Users can only upload to their own folder
CREATE POLICY ins_user_folder ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'kyc_docs'
  AND name LIKE auth.uid()::text || '/%'
);

-- Users can only update their own files
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

-- Users can only delete their own files
CREATE POLICY del_user_folder ON storage.objects
FOR DELETE TO authenticated
USING (
  bucket_id = 'kyc_docs'
  AND name LIKE auth.uid()::text || '/%'
);

-- Users can only view their own files
CREATE POLICY sel_user_folder ON storage.objects
FOR SELECT TO authenticated
USING (
  bucket_id = 'kyc_docs'
  AND name LIKE auth.uid()::text || '/%'
);

-- Admin function (if not exists)
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

-- Admin can access all files
CREATE POLICY admin_full_storage ON storage.objects
FOR ALL TO authenticated
USING (is_admin())
WITH CHECK (is_admin());
