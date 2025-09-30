-- Create storage buckets for document uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('kyc_docs', 'kyc_docs', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])
ON CONFLICT (id) DO NOTHING;

-- Create policy for authenticated users to upload documents
CREATE POLICY "Authenticated users can upload documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'kyc_docs');

-- Create policy for authenticated users to view their own documents
CREATE POLICY "Users can view their own documents"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'kyc_docs' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create policy for authenticated users to update their own documents
CREATE POLICY "Users can update their own documents"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'kyc_docs' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create policy for authenticated users to delete their own documents
CREATE POLICY "Users can delete their own documents"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'kyc_docs' AND auth.uid()::text = (storage.foldername(name))[1]);
