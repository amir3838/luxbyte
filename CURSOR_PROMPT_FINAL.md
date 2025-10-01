# Cursor Prompt: Minimal safety fixes (no regressions)

## Title
Minimal safety fixes (no regressions)

## Scope (allowlist)
- `js/supabase-client.js`
- `js/file-upload-manager.js`
- `js/auth.js`
- `js/translation-manager.js`
- `js/theme-manager.js`
- `scripts/test-smoke.mjs`
- `README.md`
- `supabase/rls_policies_final.sql`
- `supabase/storage_policies.sql`

## Do NOT change
- الإصدارات
- env
- CI/CD
- vercel.json
- أي ملفات خارج الـ Allowlist

## Tasks

### 1. تأكيد Supabase Singleton وعدم وجود createClient مكرر
- في `js/supabase-client.js`: تأكد من تطبيق Singleton pattern
- فحص عدم وجود createClient مكرر في ملفات الكلاينت

### 2. في الرفع: أضف finally{} لاسترجاع حالة الأزرار + فحص selectors
- في `js/file-upload-manager.js`: أضف finally blocks
- فحص selectors قبل الاستخدام
- استرجاع حالة الأزرار في حالة الخطأ

### 3. في التسجيل: طبّع Password (إزالة RTL marks/أرقام عربية) قبل المقارنة
- في `js/auth.js`: إضافة دالة normalizeText
- تطبيق normalization على كلمات المرور
- دعم الأرقام العربية/الإنجليزية

### 4. راجع/أنشئ scripts/test-smoke.mjs
- اختبار الصفحة الرئيسية
- اختبار أي API صحيح إن وجد
- استخدام العنوان الصحيح (127.0.0.1:3000)

### 5. حدّث README.md بخطوات التشغيل والاختبار
- إضافة تعليمات التشغيل المحلي
- إضافة تعليمات الاختبار
- إضافة تعليمات النشر

### 6. أكّد محتوى supabase/rls_policies_final.sql
- سياسات RLS لجداول documents, profiles, business_requests
- مبنيّة على user_id
- سياسات شاملة (SELECT, INSERT, UPDATE, DELETE)

## Output
- باتش صغير
- قائمة الملفات المعدّلة ولماذا
- خطوات تشغيل الاختبارات

## Important Notes
- لا تغير أي ملفات خارج الـ allowlist
- ركز على الأمان والاستقرار فقط
- تأكد من عدم وجود regressions
- اختبر كل تغيير قبل التطبيق
