# 🚀 دليل النشر الشامل - LUXBYTE Production

## 📋 قائمة التحقق قبل النشر

### 1. ✅ Git & GitHub
- [x] جميع التغييرات محفوظة في Git
- [x] تم رفع التحديثات إلى GitHub
- [x] تم إنشاء commit وصفي شامل

### 2. 🗄️ قاعدة البيانات (Supabase)
- [ ] تطبيق تحديثات قاعدة البيانات
- [ ] اختبار الجداول الجديدة
- [ ] التحقق من RLS policies

### 3. ☁️ Vercel
- [ ] نشر التحديثات
- [ ] إعداد متغيرات البيئة
- [ ] اختبار API endpoints

### 4. 🔥 Firebase
- [ ] إعداد Firebase project
- [ ] تكوين FCM
- [ ] اختبار الإشعارات

## 🚀 خطوات النشر

### الخطوة 1: تطبيق تحديثات قاعدة البيانات

```bash
# 1. تسجيل الدخول إلى Supabase Dashboard
# 2. الذهاب إلى SQL Editor
# 3. تشغيل ملف complete_production_updates.sql

# أو باستخدام Supabase CLI (إذا كان متاحاً)
npx supabase db push
```

**ملف SQL المطلوب تشغيله:**
`supabase/complete_production_updates.sql`

### الخطوة 2: نشر على Vercel

```bash
# 1. تثبيت Vercel CLI
npm install -g vercel

# 2. تسجيل الدخول
vercel login

# 3. ربط المشروع
vercel link

# 4. نشر التحديثات
vercel --prod
```

### الخطوة 3: إعداد متغيرات البيئة في Vercel

```bash
# إضافة متغيرات البيئة الأساسية
vercel env add SUPABASE_URL
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add ADMIN_KEY
vercel env add ALLOWED_ORIGINS

# إضافة متغيرات Firebase
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID
vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
vercel env add NEXT_PUBLIC_FIREBASE_APP_ID
vercel env add NEXT_PUBLIC_FIREBASE_VAPID_KEY

# إضافة متغيرات اختيارية
vercel env add HMAC_SECRET
vercel env add FIREBASE_ADMIN_CREDENTIALS
vercel env add ALHARETH_API_KEY
vercel env add ALHARETH_API_URL
```

### الخطوة 4: إعداد Firebase

1. **إنشاء Firebase Project:**
   - اذهب إلى [Firebase Console](https://console.firebase.google.com)
   - أنشئ مشروع جديد أو استخدم موجود
   - فعّل Authentication و Cloud Messaging

2. **إعداد Web App:**
   - أضف Web App للمشروع
   - احصل على Firebase config
   - فعّل Cloud Messaging

3. **تكوين FCM:**
   - اذهب إلى Project Settings > Cloud Messaging
   - احصل على Server Key و VAPID Key
   - أضف المفاتيح إلى متغيرات البيئة

4. **تحديث firebase-messaging-sw.js:**
   - استبدل Firebase config بالمفاتيح الصحيحة
   - ارفع الملف إلى Vercel

### الخطوة 5: اختبار النظام

```bash
# 1. اختبار أساسي
node test-basic-functionality.js

# 2. اختبار API
curl -X POST https://YOUR_DOMAIN.vercel.app/api/change-account-type \
  -H "Content-Type: application/json" \
  -H "X-ADMIN-KEY: YOUR_ADMIN_KEY" \
  -d '{"user_id":"test-user-id","new_account_type":"pharmacy","changed_by":"admin"}'

# 3. اختبار الإشعارات
# افتح الموقع واختبر تسجيل الدخول
```

## 🔧 إعدادات مهمة

### متغيرات البيئة المطلوبة:

```env
# Supabase (مطلوب)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# الأمان (مطلوب)
ADMIN_KEY=your_strong_admin_key_here
ALLOWED_ORIGINS=https://your-domain.vercel.app,https://luxbyte.eg

# Firebase (للإشعارات)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
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

### إعدادات Vercel:

```json
{
  "version": 2,
  "name": "luxbyte-production",
  "builds": [
    {
      "src": "api/**/*.js",
      "use": "@vercel/node"
    },
    {
      "src": "middleware.js",
      "use": "@vercel/node"
    }
  ],
  "functions": {
    "api/change-account-type.js": {
      "maxDuration": 30
    },
    "api/log-error.js": {
      "maxDuration": 10
    }
  }
}
```

## 🧪 اختبارات ما بعد النشر

### 1. اختبار API تغيير نوع الحساب:
```bash
curl -X POST https://YOUR_DOMAIN.vercel.app/api/change-account-type \
  -H "Content-Type: application/json" \
  -H "X-ADMIN-KEY: YOUR_ADMIN_KEY" \
  -d '{
    "user_id": "user-uuid-here",
    "new_account_type": "pharmacy",
    "changed_by": "admin"
  }'
```

### 2. اختبار تسجيل الأخطاء:
```bash
curl -X POST https://YOUR_DOMAIN.vercel.app/api/log-error \
  -H "Content-Type: application/json" \
  -d '{
    "level": "error",
    "message": "Test error",
    "sessionId": "test-session"
  }'
```

### 3. اختبار الإشعارات:
- افتح الموقع في المتصفح
- سجل دخول كصيدلية
- تحقق من ظهور إشعارات الاختبار

## 📊 مراقبة النظام

### 1. Vercel Dashboard:
- راقب Function Logs
- تحقق من Performance Metrics
- راجع Error Logs

### 2. Supabase Dashboard:
- راقب Database Activity
- تحقق من Auth Logs
- راجع Storage Usage

### 3. Firebase Console:
- راقب Cloud Messaging
- تحقق من Authentication
- راجع Analytics

## 🆘 استكشاف الأخطاء

### مشاكل شائعة:

1. **خطأ في API:**
   - تحقق من ADMIN_KEY
   - راجع Vercel Function Logs
   - تأكد من صحة متغيرات البيئة

2. **مشاكل في قاعدة البيانات:**
   - تحقق من RLS policies
   - راجع Supabase Logs
   - تأكد من تطبيق المايجريشنز

3. **مشاكل في الإشعارات:**
   - تحقق من Firebase config
   - راجع Browser Console
   - تأكد من Service Worker

## ✅ قائمة التحقق النهائية

- [ ] تم تطبيق تحديثات قاعدة البيانات
- [ ] تم نشر التحديثات على Vercel
- [ ] تم إعداد جميع متغيرات البيئة
- [ ] تم تكوين Firebase
- [ ] تم اختبار جميع API endpoints
- [ ] تم اختبار الإشعارات
- [ ] تم اختبار تسجيل الدخول
- [ ] تم اختبار تغيير نوع الحساب
- [ ] تم مراجعة السجلات
- [ ] تم اختبار الأداء

## 🎉 تهانينا!

**النظام جاهز للإنتاج مع أعلى معايير الأمان والأداء!**

### المميزات الجديدة:
- ✅ أمان API محسن
- ✅ نظام audit logging شامل
- ✅ إشعارات FCM
- ✅ مراقبة الأداء
- ✅ اختبارات شاملة
- ✅ توثيق مفصل

### الخطوات التالية:
1. راقب النظام في الأيام الأولى
2. راجع السجلات بانتظام
3. حدث المتغيرات حسب الحاجة
4. خطط للصيانة الدورية

**🚀 النظام جاهز للاستخدام!**
