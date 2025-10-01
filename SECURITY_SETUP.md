# LUXBYTE Security Setup Guide
## دليل إعداد الأمان

هذا الدليل يوضح كيفية تطبيق سياسات الأمان الكاملة في LUXBYTE.

---

## 🔒 1. تطبيق سياسات RLS

### الخطوة 1: تطبيق السياسات في Supabase

1. افتح **Supabase Dashboard** → **SQL Editor**
2. انسخ والصق محتوى `supabase/rls_policies_final.sql`
3. اضغط **Run** لتطبيق جميع السياسات

### الخطوة 2: التحقق من التطبيق

```sql
-- فحص حالة RLS
SELECT
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('documents', 'profiles', 'business_requests')
ORDER BY tablename;
```

**النتيجة المتوقعة:**
```
tablename         | rls_enabled
------------------|------------
business_requests | true
documents         | true
profiles          | true
```

---

## 🧪 2. اختبار الأمان

### اختبار 1: إنشاء مستخدمين تجريبيين

1. في **Supabase Dashboard** → **Authentication** → **Users**
2. أنشئ مستخدمين تجريبيين:
   - **User 1:** test1@example.com
   - **User 2:** test2@example.com

### اختبار 2: اختبار RLS

1. افتح **SQL Editor**
2. انسخ والصق محتوى `supabase/test_rls.sql`
3. استبدل `auth.uid()` بمعرف المستخدم الحقيقي
4. شغل الاختبارات

### اختبار 3: اختبار الرفع

1. سجل الدخول كـ **User 1**
2. ارفع ملف (يجب أن ينجح)
3. سجل الدخول كـ **User 2**
4. حاول الوصول لملفات User 1 (يجب أن يفشل)

---

## 🚀 3. النشر الآمن

### مرحلة المعاينة (Preview)

```bash
# سحب إعدادات المعاينة
vercel pull --environment=preview

# نشر المعاينة
vercel deploy --prebuilt

# اختبار المعاينة
npm run test:smoke
```

### مرحلة الإنتاج (Production)

```bash
# سحب متغيرات البيئة
vercel env pull .env

# نشر الإنتاج
vercel deploy --prod

# اختبار الإنتاج
npm run test:smoke
```

---

## 🔐 4. متغيرات البيئة الآمنة

تأكد من وجود هذه المتغيرات في Vercel:

### متغيرات مطلوبة:
```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### متغيرات اختيارية:
```
FIREBASE_API_KEY=your_firebase_key
FIREBASE_AUTH_DOMAIN=your_firebase_domain
```

---

## 📋 5. قائمة التحقق الأمني

### قبل النشر:
- [ ] تطبيق RLS policies
- [ ] اختبار RLS مع مستخدمين مختلفين
- [ ] اختبار رفع الملفات
- [ ] اختبار API endpoints
- [ ] التحقق من عدم وجود مفاتيح مكشوفة
- [ ] اختبار CSP headers
- [ ] اختبار SPA routing

### بعد النشر:
- [ ] اختبار تسجيل الدخول
- [ ] اختبار رفع ملف
- [ ] اختبار عرض البيانات
- [ ] اختبار الأمان (محاولة الوصول لبيانات الآخرين)
- [ ] مراقبة logs للأخطاء

---

## 🛡️ 6. سياسات الأمان المطبقة

### جداول البيانات:
- **documents:** المستخدم يرى مستنداته فقط
- **profiles:** المستخدم يرى ملفه الشخصي فقط
- **business_requests:** المستخدم يرى طلباته فقط

### التخزين:
- **kyc_docs:** المستخدم يرفع في مجلده فقط
- **Public URLs:** آمنة مع قيود المجلد
- **Admin Access:** المديرون يمكنهم الوصول لكل شيء

### API:
- **Authentication:** مطلوب لجميع العمليات
- **Authorization:** RLS يتحكم في الوصول
- **CORS:** محدود للمواقع المسموحة

---

## 🚨 7. استكشاف الأخطاء

### مشكلة: "RLS policy violation"
**الحل:** تأكد من تطبيق السياسات الصحيحة

### مشكلة: "File upload failed"
**الحل:** تحقق من سياسات التخزين ومجلد المستخدم

### مشكلة: "403 Forbidden"
**الحل:** تحقق من authentication وRLS policies

### مشكلة: "CORS error"
**الحل:** تحقق من إعدادات CORS في vercel.json

---

## 📞 8. الدعم

إذا واجهت أي مشاكل:

1. تحقق من **Supabase Logs**
2. تحقق من **Vercel Logs**
3. شغل `npm run test:smoke`
4. راجع ملف `QUICK_CHECK_RESULTS.md`

---

**تم إعداد الأمان بنجاح!** 🔒✅
