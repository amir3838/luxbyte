# 🔧 إعداد متغيرات البيئة في Vercel - LUXBYTE

## ⚠️ النظام يحتاج إلى إعداد متغيرات البيئة

تم النشر بنجاح على Vercel، لكن النظام يحتاج إلى إعداد متغيرات البيئة ليعمل بشكل صحيح.

## 🚀 خطوات الإعداد السريع

### 1. الدخول إلى Vercel Dashboard
- اذهب إلى: https://vercel.com/dashboard
- اختر مشروع `luxbyte`
- اذهب إلى Settings > Environment Variables

### 2. إضافة المتغيرات المطلوبة

#### متغيرات Supabase (مطلوبة):
```
SUPABASE_URL = https://qjsvgpvbtrcnbhcjdcci.supabase.co
SUPABASE_SERVICE_ROLE_KEY = [احصل على المفتاح من Supabase Dashboard]
NEXT_PUBLIC_SUPABASE_URL = https://qjsvgpvbtrcnbhcjdcci.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = [احصل على المفتاح من Supabase Dashboard]
```

#### متغيرات الأمان (مطلوبة):
```
ADMIN_KEY = [أنشئ مفتاح قوي - مثال: admin_key_2024_luxbyte_secure_123]
ALLOWED_ORIGINS = https://luxbyte-r38xw8gqr-amir-saids-projects-035bbecd.vercel.app,https://luxbyte.eg
```

#### متغيرات Firebase (اختياري):
```
NEXT_PUBLIC_FIREBASE_API_KEY = [من Firebase Console]
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = [من Firebase Console]
NEXT_PUBLIC_FIREBASE_PROJECT_ID = [من Firebase Console]
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = [من Firebase Console]
NEXT_PUBLIC_FIREBASE_APP_ID = [من Firebase Console]
NEXT_PUBLIC_FIREBASE_VAPID_KEY = [من Firebase Console]
```

### 3. إعادة النشر
بعد إضافة المتغيرات:
- اذهب إلى Deployments
- اضغط على "Redeploy" للـ deployment الأخير
- أو استخدم: `npx vercel --prod`

## 🔑 كيفية الحصول على مفاتيح Supabase

### 1. الدخول إلى Supabase Dashboard
- اذهب إلى: https://supabase.com/dashboard
- اختر مشروع LUXBYTE

### 2. الحصول على المفاتيح
- اذهب إلى Settings > API
- انسخ:
  - `Project URL` → `SUPABASE_URL` و `NEXT_PUBLIC_SUPABASE_URL`
  - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `service_role secret` → `SUPABASE_SERVICE_ROLE_KEY`

## 🗄️ تطبيق تحديثات قاعدة البيانات

### 1. الدخول إلى SQL Editor
- في Supabase Dashboard
- اذهب إلى SQL Editor

### 2. تشغيل Migration
انسخ محتوى ملف `supabase/complete_production_updates.sql` وشغله في SQL Editor.

## 🧪 اختبار النظام بعد الإعداد

```bash
# اختبار النظام المحدث
node test-deployed-system.js

# اختبار API تغيير نوع الحساب
curl -X POST https://luxbyte-r38xw8gqr-amir-saids-projects-035bbecd.vercel.app/api/change-account-type \
  -H "Content-Type: application/json" \
  -H "X-ADMIN-KEY: YOUR_ADMIN_KEY" \
  -d '{
    "user_id": "test-user-id",
    "new_account_type": "pharmacy",
    "changed_by": "admin"
  }'
```

## 📊 مراقبة النظام

### Vercel Dashboard:
- Function Logs
- Performance Metrics
- Error Logs

### Supabase Dashboard:
- Database Activity
- Auth Logs
- Storage Usage

## 🆘 استكشاف الأخطاء

### مشاكل شائعة:

1. **خطأ 401 Unauthorized:**
   - تحقق من ADMIN_KEY
   - تأكد من إعادة النشر بعد إضافة المتغيرات

2. **خطأ في قاعدة البيانات:**
   - تحقق من تطبيق SQL migration
   - راجع Supabase Logs

3. **مشاكل في CORS:**
   - تحقق من ALLOWED_ORIGINS
   - تأكد من إعادة النشر

## ✅ قائمة التحقق

- [ ] تم إضافة متغيرات Supabase
- [ ] تم إضافة متغيرات الأمان
- [ ] تم إعادة النشر
- [ ] تم تطبيق تحديثات قاعدة البيانات
- [ ] تم اختبار النظام
- [ ] تم اختبار API endpoints

## 🎉 بعد الإكمال

بعد إكمال جميع الخطوات، النظام سيكون جاهزاً للاستخدام مع:
- ✅ أمان API محسن
- ✅ نظام audit logging
- ✅ إشعارات FCM (إذا تم الإعداد)
- ✅ مراقبة الأداء
- ✅ اختبارات شاملة

**🚀 النظام جاهز للإنتاج!**
