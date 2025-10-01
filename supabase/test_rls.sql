-- LUXBYTE RLS Testing Script
-- سكريبت اختبار سياسات RLS

-- ==============================================
-- Test 1: Create Test Users
-- اختبار 1: إنشاء مستخدمين تجريبيين
-- ==============================================

-- Note: In real testing, you would create actual users via Supabase Auth
-- ملاحظة: في الاختبار الحقيقي، ستقوم بإنشاء مستخدمين حقيقيين عبر Supabase Auth

-- ==============================================
-- Test 2: Test Documents Table RLS
-- اختبار 2: اختبار جدول المستندات
-- ==============================================

-- Test as User 1 (replace with actual user ID)
-- اختبار كالمستخدم 1 (استبدل بمعرف المستخدم الحقيقي)
-- SET LOCAL "request.jwt.claims" TO '{"sub": "user1-uuid-here"}';

-- Insert test document for user 1
-- إدراج مستند تجريبي للمستخدم 1
INSERT INTO documents (user_id, document_type, file_path, public_url, file_name, file_size, mime_type)
VALUES (
    auth.uid(), -- This will be the current user's ID
    'test_document',
    'test/path/document.pdf',
    'https://example.com/document.pdf',
    'test_document.pdf',
    1024,
    'application/pdf'
);

-- Try to select documents (should only see own documents)
-- محاولة استعلام المستندات (يجب أن يرى مستنداته فقط)
SELECT * FROM documents;

-- ==============================================
-- Test 3: Test Storage RLS
-- اختبار 3: اختبار سياسات التخزين
-- ==============================================

-- Test file upload to user's folder (should succeed)
-- اختبار رفع ملف لمجلد المستخدم (يجب أن ينجح)
INSERT INTO storage.objects (bucket_id, name, path_tokens, owner, metadata)
VALUES (
    'kyc_docs',
    auth.uid()::text || '/test_file.jpg',
    ARRAY[auth.uid()::text, 'test_file.jpg'],
    auth.uid(),
    '{"size": 1024, "mimetype": "image/jpeg"}'::jsonb
);

-- Test file upload to another user's folder (should fail)
-- اختبار رفع ملف لمجلد مستخدم آخر (يجب أن يفشل)
-- This should fail with RLS policy violation
-- هذا يجب أن يفشل بسبب انتهاك سياسة RLS
INSERT INTO storage.objects (bucket_id, name, path_tokens, owner, metadata)
VALUES (
    'kyc_docs',
    'other-user-uuid/test_file.jpg',
    ARRAY['other-user-uuid', 'test_file.jpg'],
    auth.uid(),
    '{"size": 1024, "mimetype": "image/jpeg"}'::jsonb
);

-- ==============================================
-- Test 4: Test Admin Function
-- اختبار 4: اختبار دالة الإدارة
-- ==============================================

-- Check if current user is admin
-- فحص إذا كان المستخدم الحالي مدير
SELECT is_admin();

-- ==============================================
-- Test 5: Verification Queries
-- اختبار 5: استعلامات التحقق
-- ==============================================

-- Check RLS status for all tables
-- فحص حالة RLS لجميع الجداول
SELECT
    schemaname,
    tablename,
    rowsecurity as rls_enabled,
    CASE
        WHEN rowsecurity THEN '✅ RLS Enabled'
        ELSE '❌ RLS Disabled'
    END as status
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('documents', 'profiles', 'business_requests', 'user_devices', 'push_tokens')
ORDER BY tablename;

-- Check policies count
-- فحص عدد السياسات
SELECT
    schemaname,
    tablename,
    COUNT(*) as policy_count
FROM pg_policies
WHERE schemaname IN ('public', 'storage')
GROUP BY schemaname, tablename
ORDER BY schemaname, tablename;

-- Check storage bucket configuration
-- فحص إعدادات حاوية التخزين
SELECT
    id,
    name,
    public,
    created_at
FROM storage.buckets
WHERE id = 'kyc_docs';

-- ==============================================
-- Test 6: Manual Testing Instructions
-- اختبار 6: تعليمات الاختبار اليدوي
-- ==============================================

/*
MANUAL TESTING STEPS:
خطوات الاختبار اليدوي:

1. Create two test users in Supabase Auth
   إنشاء مستخدمين تجريبيين في Supabase Auth

2. Login as User 1 and:
   تسجيل الدخول كالمستخدم 1 و:
   - Upload a file (should succeed)
   - Try to access another user's file (should fail)
   - View documents (should only see own documents)

3. Login as User 2 and:
   تسجيل الدخول كالمستخدم 2 و:
   - Try to access User 1's files (should fail)
   - Upload own file (should succeed)

4. Test admin user:
   اختبار المستخدم الإداري:
   - Should be able to access all data
   - Should be able to manage all files

5. Test API endpoints:
   اختبار نقاط النهاية:
   - GET /api/documents (should return user's documents only)
   - POST /api/upload (should upload to user's folder)
   - GET /api/admin/* (should work for admin only)
*/
