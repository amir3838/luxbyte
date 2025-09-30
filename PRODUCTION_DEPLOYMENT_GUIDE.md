# دليل التشغيل السريع - LUXBYTE Production Ready

## 🚀 التحضير للتشغيل

### 1. إعداد متغيرات البيئة

```bash
# انسخ ملف البيئة
cp env.example .env

# عدّل المتغيرات المطلوبة
nano .env
```

**المتغيرات الأساسية:**
```env
# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# الأمان
ADMIN_KEY=your_strong_admin_key_here
HMAC_SECRET=your_hmac_secret_key_here
ALLOWED_ORIGINS=https://your-domain.vercel.app,https://luxbyte.eg

# Firebase (للإشعارات)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_VAPID_KEY=your_vapid_key
```

### 2. تطبيق تحديثات قاعدة البيانات

```bash
# تطبيق جميع المايجريشنز
supabase db push

# أو تطبيق ملفات SQL يدوياً
psql -h your-db-host -U postgres -d postgres -f supabase/migrations/007_audit_logging.sql
psql -h your-db-host -U postgres -d postgres -f supabase/migrations/008_error_logging.sql
```

### 3. اختبار النظام

```bash
# تشغيل اختبارات الإنتاج
node test-production-ready.js

# اختبار API تغيير نوع الحساب
curl -X POST https://YOUR_DOMAIN/api/change-account-type \
  -H "Content-Type: application/json" \
  -H "X-ADMIN-KEY: $ADMIN_KEY" \
  -d '{"user_id":"<uuid>","new_account_type":"pharmacy","changed_by":"admin"}'
```

## 🔒 الأمان

### 1. حماية API تغيير نوع الحساب

- ✅ مفتاح Admin قوي مطلوب
- ✅ Rate limiting (10 طلبات/دقيقة)
- ✅ HMAC signing اختياري
- ✅ CORS protection
- ✅ Audit logging تلقائي

### 2. حماية Admin Panel

```javascript
// إضافة Basic Auth أو Supabase Auth
// في admin-panel.html
const adminToken = new URLSearchParams(window.location.search).get('token');
if (adminToken !== 'your-secure-admin-token') {
  window.location.href = 'auth.html';
}
```

### 3. مراقبة الأخطاء

- ✅ تسجيل تلقائي للأخطاء
- ✅ مراقبة الأداء
- ✅ إحصائيات الاستخدام
- ✅ تنظيف تلقائي للبيانات القديمة

## 📱 الإشعارات

### 1. إعداد FCM

```javascript
// في الصفحات الرئيسية
import './js/fcm-manager.js';

// تهيئة FCM
fcmManager.initialize();
fcmManager.requestPermission();
```

### 2. إرسال إشعارات

```javascript
// إشعار لنوع حساب معين
await fcmManager.sendNotificationToAccountType(
  'pharmacy',
  'إشعار جديد',
  'لديك طلب جديد'
);

// إشعار لمستخدم محدد
await fcmManager.sendNotificationToUser(
  userId,
  'تحديث الحساب',
  'تم تغيير نوع حسابك'
);
```

## 🔄 إعادة التوجيه الذكي

### 1. للمستخدمين الجدد
- تسجيل → تأكيد البريد → إنشاء Profile → توجيه للداشبورد

### 2. للمستخدمين الموجودين
- تسجيل دخول → فحص Profile → توجيه حسب نوع الحساب

### 3. للمستخدمين بدون Profile
- توجيه تلقائي لصفحة التسجيل الموحد

## 📊 المراقبة والصيانة

### 1. مراجعة السجلات

```sql
-- مراجعة تغييرات الحسابات
SELECT * FROM account_audit
WHERE changed_at >= NOW() - INTERVAL '24 hours'
ORDER BY changed_at DESC;

-- مراجعة الأخطاء
SELECT level, message, COUNT(*)
FROM error_logs
WHERE created_at >= NOW() - INTERVAL '24 hours'
GROUP BY level, message
ORDER BY COUNT(*) DESC;
```

### 2. تنظيف البيانات

```sql
-- تنظيف السجلات القديمة (تشغيل أسبوعياً)
SELECT cleanup_old_audit_logs();
SELECT cleanup_old_notifications();
SELECT cleanup_old_error_logs();
```

### 3. مراقبة الأداء

```javascript
// في المتصفح
console.log(monitoring.getSessionSummary());
console.log(monitoring.exportLogs());
```

## 🚀 النشر على Vercel

### 1. إعداد Vercel

```bash
# تثبيت Vercel CLI
npm i -g vercel

# تسجيل الدخول
vercel login

# رفع المشروع
vercel --prod
```

### 2. إعداد متغيرات البيئة في Vercel

```bash
# إضافة متغيرات البيئة
vercel env add SUPABASE_URL
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add ADMIN_KEY
# ... باقي المتغيرات
```

### 3. إعداد Custom Domain

```bash
# إضافة دومين مخصص
vercel domains add luxbyte.eg
```

## ✅ قائمة التحقق النهائية

### قبل النشر:
- [ ] جميع اختبارات الإنتاج نجحت
- [ ] متغيرات البيئة محددة بشكل صحيح
- [ ] قاعدة البيانات محدثة
- [ ] SSL certificate صالح
- [ ] CORS محدث للدومين الجديد
- [ ] Rate limiting مفعل
- [ ] Audit logging يعمل
- [ ] Error logging يعمل

### بعد النشر:
- [ ] اختبار تسجيل مستخدم جديد
- [ ] اختبار تغيير نوع الحساب
- [ ] اختبار الإشعارات
- [ ] مراجعة السجلات
- [ ] اختبار الأداء
- [ ] اختبار الأمان

## 🆘 استكشاف الأخطاء

### مشاكل شائعة:

1. **خطأ في API تغيير نوع الحساب**
   - تحقق من ADMIN_KEY
   - تحقق من صحة user_id
   - راجع سجلات الأخطاء

2. **مشاكل في الإشعارات**
   - تحقق من إعدادات Firebase
   - تحقق من VAPID key
   - راجع console للأخطاء

3. **مشاكل في إعادة التوجيه**
   - تحقق من وجود Profile
   - راجع console للرسائل
   - تحقق من localStorage

### الدعم:
- راجع سجلات الأخطاء في Vercel Dashboard
- استخدم `monitoring.exportLogs()` للحصول على تفاصيل أكثر
- راجع Supabase Dashboard للبيانات

---

**🎉 تهانينا! النظام جاهز للإنتاج**
