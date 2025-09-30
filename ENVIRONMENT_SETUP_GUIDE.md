# 🔧 دليل إعداد متغيرات البيئة - LUXBYTE

## ✅ تم النشر بنجاح على Vercel!

**رابط الإنتاج:** https://luxbyte-r38xw8gqr-amir-saids-projects-035bbecd.vercel.app

## 🔧 إعداد متغيرات البيئة

### 1. متغيرات Vercel (مطلوبة)

```bash
# إضافة متغيرات البيئة في Vercel Dashboard
# أو باستخدام CLI:

npx vercel env add SUPABASE_URL
npx vercel env add SUPABASE_SERVICE_ROLE_KEY
npx vercel env add NEXT_PUBLIC_SUPABASE_URL
npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
npx vercel env add ADMIN_KEY
npx vercel env add ALLOWED_ORIGINS
```

### 2. قيم المتغيرات المطلوبة

```env
# Supabase (مطلوب)
SUPABASE_URL=https://qjsvgpvbtrcnbhcjdcci.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
NEXT_PUBLIC_SUPABASE_URL=https://qjsvgpvbtrcnbhcjdcci.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# الأمان (مطلوب)
ADMIN_KEY=your_strong_admin_key_here
ALLOWED_ORIGINS=https://luxbyte-r38xw8gqr-amir-saids-projects-035bbecd.vercel.app,https://luxbyte.eg

# Firebase (للإشعارات - اختياري)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_VAPID_KEY=your_vapid_key

# اختياري
HMAC_SECRET=your_hmac_secret_key
FIREBASE_ADMIN_CREDENTIALS={"type":"service_account",...}
ALHARETH_API_KEY=your_alhareth_key
ALHARETH_API_URL=https://api.alhareth.com
```

## 🗄️ تطبيق تحديثات قاعدة البيانات

### 1. تسجيل الدخول إلى Supabase Dashboard
- اذهب إلى: https://supabase.com/dashboard
- اختر مشروع LUXBYTE

### 2. تطبيق SQL Migration
- اذهب إلى SQL Editor
- انسخ محتوى ملف: `supabase/complete_production_updates.sql`
- شغّل الكود في SQL Editor

### 3. التحقق من الجداول الجديدة
```sql
-- تحقق من وجود الجداول الجديدة
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('account_audit', 'notifications', 'user_devices', 'error_logs', 'system_health');
```

## 🔥 إعداد Firebase (اختياري)

### 1. إنشاء Firebase Project
- اذهب إلى: https://console.firebase.google.com
- أنشئ مشروع جديد أو استخدم موجود

### 2. إعداد Web App
- أضف Web App للمشروع
- احصل على Firebase config
- فعّل Cloud Messaging

### 3. تكوين FCM
- اذهب إلى Project Settings > Cloud Messaging
- احصل على Server Key و VAPID Key
- أضف المفاتيح إلى متغيرات البيئة في Vercel

## 🧪 اختبار النظام

### 1. اختبار API تغيير نوع الحساب
```bash
curl -X POST https://luxbyte-r38xw8gqr-amir-saids-projects-035bbecd.vercel.app/api/change-account-type \
  -H "Content-Type: application/json" \
  -H "X-ADMIN-KEY: YOUR_ADMIN_KEY" \
  -d '{
    "user_id": "user-uuid-here",
    "new_account_type": "pharmacy",
    "changed_by": "admin"
  }'
```

### 2. اختبار تسجيل الأخطاء
```bash
curl -X POST https://luxbyte-r38xw8gqr-amir-saids-projects-035bbecd.vercel.app/api/log-error \
  -H "Content-Type: application/json" \
  -d '{
    "level": "error",
    "message": "Test error",
    "sessionId": "test-session"
  }'
```

### 3. اختبار الموقع
- افتح: https://luxbyte-r38xw8gqr-amir-saids-projects-035bbecd.vercel.app
- جرب تسجيل الدخول
- اختبر تغيير نوع الحساب

## 📊 مراقبة النظام

### 1. Vercel Dashboard
- راقب Function Logs
- تحقق من Performance Metrics
- راجع Error Logs

### 2. Supabase Dashboard
- راقب Database Activity
- تحقق من Auth Logs
- راجع Storage Usage

### 3. Firebase Console (إذا تم الإعداد)
- راقب Cloud Messaging
- تحقق من Authentication
- راجع Analytics

## 🆘 استكشاف الأخطاء

### مشاكل شائعة:

1. **خطأ في API:**
   - تحقق من ADMIN_KEY في Vercel
   - راجع Vercel Function Logs
   - تأكد من صحة متغيرات البيئة

2. **مشاكل في قاعدة البيانات:**
   - تحقق من تطبيق SQL migration
   - راجع Supabase Logs
   - تأكد من RLS policies

3. **مشاكل في الإشعارات:**
   - تحقق من Firebase config
   - راجع Browser Console
   - تأكد من Service Worker

## ✅ قائمة التحقق النهائية

- [x] تم النشر على Vercel
- [ ] تم إضافة متغيرات البيئة في Vercel
- [ ] تم تطبيق تحديثات قاعدة البيانات
- [ ] تم اختبار API endpoints
- [ ] تم اختبار الموقع
- [ ] تم إعداد Firebase (اختياري)
- [ ] تم اختبار الإشعارات (إذا تم إعداد Firebase)

## 🎉 تهانينا!

**النظام جاهز للاستخدام!**

### المميزات الجديدة:
- ✅ أمان API محسن
- ✅ نظام audit logging شامل
- ✅ إشعارات FCM (إذا تم الإعداد)
- ✅ مراقبة الأداء
- ✅ اختبارات شاملة
- ✅ توثيق مفصل

### الخطوات التالية:
1. أضف متغيرات البيئة في Vercel
2. طبق تحديثات قاعدة البيانات
3. اختبر النظام
4. راقب الأداء في الأيام الأولى

**🚀 النظام جاهز للإنتاج!**
