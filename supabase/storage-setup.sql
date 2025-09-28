-- إعداد Supabase Storage للملفات والمستندات
-- Supabase Storage Setup for Files and Documents

-- إنشاء bucket للمستندات
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'documents',
    'documents',
    false, -- غير عام - يتطلب صلاحيات
    52428800, -- 50MB
    ARRAY['image/jpeg', 'image/png', 'application/pdf']
);

-- إنشاء bucket للصور العامة (لوجوهات، إلخ)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'public-images',
    'public-images',
    true, -- عام
    10485760, -- 10MB
    ARRAY['image/jpeg', 'image/png', 'image/webp']
);

-- سياسات الأمان لـ documents bucket
CREATE POLICY "Users can upload their own documents" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own documents" ON storage.objects
FOR SELECT USING (
    bucket_id = 'documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own documents" ON storage.objects
FOR UPDATE USING (
    bucket_id = 'documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own documents" ON storage.objects
FOR DELETE USING (
    bucket_id = 'documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

-- سياسات الأمان لـ public-images bucket
CREATE POLICY "Anyone can view public images" ON storage.objects
FOR SELECT USING (bucket_id = 'public-images');

CREATE POLICY "Authenticated users can upload public images" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'public-images' AND
    auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own public images" ON storage.objects
FOR UPDATE USING (
    bucket_id = 'public-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own public images" ON storage.objects
FOR DELETE USING (
    bucket_id = 'public-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

-- سياسات للمديرين
CREATE POLICY "Admins can manage all documents" ON storage.objects
FOR ALL USING (
    bucket_id = 'documents' AND
    EXISTS (
        SELECT 1 FROM auth.users
        WHERE id = auth.uid()
        AND raw_user_meta_data->>'role' = 'admin'
    )
);

CREATE POLICY "Admins can manage all public images" ON storage.objects
FOR ALL USING (
    bucket_id = 'public-images' AND
    EXISTS (
        SELECT 1 FROM auth.users
        WHERE id = auth.uid()
        AND raw_user_meta_data->>'role' = 'admin'
    )
);

-- دالة لإنشاء مجلدات المستخدمين تلقائياً
CREATE OR REPLACE FUNCTION create_user_folders()
RETURNS TRIGGER AS $$
BEGIN
    -- إنشاء مجلدات لكل نوع نشاط
    INSERT INTO storage.objects (bucket_id, name, owner)
    VALUES
        ('documents', NEW.id::text || '/restaurant/requests/', NEW.id),
        ('documents', NEW.id::text || '/supermarket/requests/', NEW.id),
        ('documents', NEW.id::text || '/pharmacy/requests/', NEW.id),
        ('documents', NEW.id::text || '/clinic/requests/', NEW.id),
        ('documents', NEW.id::text || '/courier/requests/', NEW.id),
        ('public-images', NEW.id::text || '/profile/', NEW.id),
        ('public-images', NEW.id::text || '/logos/', NEW.id);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- تشغيل الدالة عند إنشاء مستخدم جديد
CREATE TRIGGER create_user_folders_trigger
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION create_user_folders();

-- دالة لتنظيف الملفات المحذوفة
CREATE OR REPLACE FUNCTION cleanup_deleted_files()
RETURNS TRIGGER AS $$
BEGIN
    -- حذف الملف من التخزين عند حذف سجل قاعدة البيانات
    PERFORM storage.delete_object('documents', OLD.file_path);

    RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- تشغيل الدالة عند حذف سجل ملف
CREATE TRIGGER cleanup_deleted_files_trigger
    AFTER DELETE ON uploaded_files
    FOR EACH ROW
    EXECUTE FUNCTION cleanup_deleted_files();

-- دالة للحصول على إحصائيات التخزين للمستخدم
CREATE OR REPLACE FUNCTION get_user_storage_stats(user_uuid UUID)
RETURNS TABLE (
    total_files BIGINT,
    total_size_bytes BIGINT,
    files_by_activity JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(uf.id) as total_files,
        COALESCE(SUM(uf.file_size_bytes), 0) as total_size_bytes,
        jsonb_object_agg(
            at.name_ar,
            jsonb_build_object(
                'count', activity_stats.count,
                'size', activity_stats.size
            )
        ) as files_by_activity
    FROM uploaded_files uf
    JOIN registration_requests rr ON uf.request_id = rr.id
    JOIN activity_types at ON rr.activity_type_id = at.id
    LEFT JOIN (
        SELECT
            rr.activity_type_id,
            COUNT(uf.id) as count,
            SUM(uf.file_size_bytes) as size
        FROM uploaded_files uf
        JOIN registration_requests rr ON uf.request_id = rr.id
        WHERE rr.user_id = user_uuid
        GROUP BY rr.activity_type_id
    ) activity_stats ON at.id = activity_stats.activity_type_id
    WHERE rr.user_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- دالة للتحقق من مساحة التخزين المتاحة
CREATE OR REPLACE FUNCTION check_storage_quota(user_uuid UUID, file_size BIGINT)
RETURNS BOOLEAN AS $$
DECLARE
    current_usage BIGINT;
    max_quota BIGINT := 1073741824; -- 1GB
BEGIN
    SELECT COALESCE(SUM(file_size_bytes), 0) INTO current_usage
    FROM uploaded_files uf
    JOIN registration_requests rr ON uf.request_id = rr.id
    WHERE rr.user_id = user_uuid;

    RETURN (current_usage + file_size) <= max_quota;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- إنشاء فهارس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_uploaded_files_file_path ON uploaded_files(file_path);
CREATE INDEX IF NOT EXISTS idx_uploaded_files_upload_status ON uploaded_files(upload_status);
CREATE INDEX IF NOT EXISTS idx_registration_requests_user_activity ON registration_requests(user_id, activity_type_id);

-- إنشاء view لعرض معلومات الطلبات مع الملفات
CREATE OR REPLACE VIEW registration_requests_with_files AS
SELECT
    rr.*,
    at.name_ar as activity_name_ar,
    at.name_en as activity_name_en,
    COUNT(uf.id) as uploaded_files_count,
    COALESCE(SUM(uf.file_size_bytes), 0) as total_size_bytes,
    CASE
        WHEN COUNT(uf.id) = 0 THEN 'no_files'
        WHEN COUNT(uf.id) < (SELECT COUNT(*) FROM document_types WHERE activity_type_id = at.id AND is_required = true) THEN 'incomplete'
        ELSE 'complete'
    END as completion_status
FROM registration_requests rr
JOIN activity_types at ON rr.activity_type_id = at.id
LEFT JOIN uploaded_files uf ON rr.id = uf.request_id AND uf.upload_status = 'uploaded'
GROUP BY rr.id, at.name_ar, at.name_en;

-- إنشاء view لعرض إحصائيات الملفات
CREATE OR REPLACE VIEW file_statistics AS
SELECT
    at.name_ar as activity_name,
    dt.name_ar as document_name,
    dt.is_required,
    COUNT(uf.id) as upload_count,
    AVG(uf.file_size_bytes) as avg_file_size,
    MAX(uf.uploaded_at) as last_upload
FROM document_types dt
JOIN activity_types at ON dt.activity_type_id = at.id
LEFT JOIN uploaded_files uf ON dt.id = uf.document_type_id AND uf.upload_status = 'uploaded'
GROUP BY at.id, at.name_ar, dt.id, dt.name_ar, dt.is_required
ORDER BY at.name_ar, dt.is_required DESC, dt.name_ar;
