# دليل إعداد Firebase Cloud Messaging (FCM) - لوكس بايت

## نظرة عامة
تم إضافة نظام الإشعارات الفورية (Web Push) إلى مشروع لوكس بايت باستخدام Firebase Cloud Messaging. هذا النظام يسمح بإرسال إشعارات فورية للمستخدمين المسجلين.

## الملفات المضافة/المعدلة

### 1. قاعدة البيانات
- `supabase/migrations/003_create_push_tokens_table.sql` - جدول تخزين توكنات الإشعارات

### 2. ملفات Firebase
- `js/firebase-config.js` - إعدادات Firebase
- `firebase-messaging-sw.js` - Service Worker للإشعارات
- `js/push-notifications.js` - مدير الإشعارات

### 3. API Endpoints
- `api/push/register.js` - تسجيل توكن FCM
- `api/push/send.js` - إرسال الإشعارات

### 4. واجهة المستخدم
- `dashboard.html` - إضافة قسم الإشعارات
- `config.js` - إضافة إعدادات Firebase

## خطوات الإعداد

### 1. إعداد Firebase Console

#### أ) إنشاء مشروع Firebase
1. اذهب إلى [Firebase Console](https://console.firebase.google.com/)
2. أنشئ مشروع جديد أو استخدم المشروع الموجود
3. اسم المشروع: `studio-1f95z` (أو أي اسم تريده)

#### ب) إضافة تطبيق ويب
1. في لوحة Firebase، اضغط على "Add app" → "Web"
2. سجل اسم التطبيق: `luxbyte-web`
3. انسخ إعدادات Firebase (تم إضافتها مسبقاً في `config.js`)

#### ج) تفعيل Cloud Messaging
1. في القائمة الجانبية، اذهب إلى "Messaging"
2. اضغط على "Get started"
3. اذهب إلى "Cloud Messaging" → "Web configuration"
4. انسخ "Web push certificates" → "Key pair" (VAPID Key)

#### د) إنشاء Service Account
1. اذهب إلى "Project Settings" → "Service accounts"
2. اضغط على "Generate new private key"
3. احفظ ملف JSON
4. حول الملف إلى Base64:
   ```bash
   base64 -i path/to/service-account.json
   ```

### 2. تحديث الإعدادات

#### أ) تحديث VAPID Key
في ملف `config.js`، استبدل:
```javascript
FCM_VAPID_KEY: "YOUR_VAPID_KEY_HERE"
```
بـ VAPID Key من Firebase Console

#### ب) إضافة متغيرات البيئة في Vercel
1. اذهب إلى Vercel Dashboard → مشروعك → Settings → Environment Variables
2. أضف المتغيرات التالية:
   ```
   FIREBASE_ADMIN_SA_BASE64 = [Base64 encoded service account JSON]
   ```

### 3. تشغيل Migration
```bash
# في Supabase CLI
supabase db push
```

### 4. تثبيت Dependencies
```bash
npm install
```

## كيفية الاستخدام

### 1. تفعيل الإشعارات للمستخدمين
- المستخدمون يدخلون إلى لوحة التحكم
- يضغطون على "تفعيل الإشعارات"
- يتم حفظ التوكن في قاعدة البيانات

### 2. إرسال الإشعارات
```javascript
// إرسال إشعار لجميع أجهزة المستخدم
const response = await fetch('/api/push/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'user-uuid',
    title: 'عنوان الإشعار',
    body: 'محتوى الإشعار',
    url: 'https://example.com'
  })
});
```

### 3. إرسال إشعار تجريبي
- في لوحة التحكم، اضغط على "إرسال إشعار تجريبي"
- سيتم إرسال إشعار فوري للمستخدم الحالي

## الميزات

### ✅ مدعوم
- إشعارات Web Push
- حفظ التوكنات في Supabase
- واجهة تفعيل/إلغاء الإشعارات
- إشعارات تجريبية
- دعم متصفحات حديثة

### ⚠️ قيود
- يتطلب HTTPS في الإنتاج
- لا يعمل في Safari (iOS) إلا مع PWA
- يتطلب إذن المستخدم

## استكشاف الأخطاء

### 1. الإشعارات لا تعمل
- تأكد من أن الموقع يعمل على HTTPS
- تحقق من VAPID Key
- تأكد من تسجيل Service Worker

### 2. خطأ في قاعدة البيانات
- تأكد من تشغيل Migration
- تحقق من إعدادات Supabase RLS

### 3. خطأ في API
- تأكد من إعداد متغيرات البيئة في Vercel
- تحقق من Firebase Service Account

## الأمان

- جميع التوكنات محمية بـ Row Level Security
- المستخدمون يمكنهم رؤية/تعديل توكناتهم فقط
- المديرون يمكنهم رؤية جميع التوكنات
- لا يتم تخزين معلومات حساسة في التوكن

## الدعم

للمساعدة أو الاستفسارات:
- 📧 البريد الإلكتروني: support@luxbyte.com
- 📞 الهاتف: 01148709609
- 🌐 الموقع: https://luxbyte.com

---

**ملاحظة**: هذا النظام إضافي ولا يؤثر على الوظائف الموجودة. يمكن إزالته بسهولة إذا لزم الأمر.
