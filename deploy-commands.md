# أوامر النشر - LUXBYTE FCM Update

## 1. نشر Migration في Supabase

```bash
# تسجيل الدخول إلى Supabase
supabase login

# ربط المشروع
supabase link --project-ref qjsvgpvbtrcnbhcjdcci

# تشغيل Migration الجديد
supabase db push

# التحقق من حالة Migration
supabase migration list
```

## 2. إعداد Firebase Console

```bash
# تثبيت Firebase CLI (إذا لم يكن مثبت)
npm install -g firebase-tools

# تسجيل الدخول إلى Firebase
firebase login

# إنشاء مشروع جديد (إذا لم يكن موجود)
firebase projects:create studio-1f95z

# ربط المشروع
firebase use studio-1f95z

# تفعيل Cloud Messaging
firebase init messaging
```

## 3. نشر على GitHub

```bash
# إضافة جميع الملفات الجديدة
git add .

# إنشاء commit للتحديث
git commit -m "feat: إضافة نظام Firebase Cloud Messaging للإشعارات

- إضافة جدول push_tokens في Supabase
- إعداد Firebase configuration و Service Worker
- إنشاء API endpoints للإشعارات
- إضافة واجهة تفعيل الإشعارات في لوحة التحكم
- دعم إشعارات Web Push مع أمان عالي"

# رفع التحديثات إلى GitHub
git push origin main

# إنشاء tag للإصدار
git tag -a v1.1.0 -m "إصدار 1.1.0 - نظام الإشعارات"
git push origin v1.1.0
```

## 4. نشر على Vercel

```bash
# تثبيت Vercel CLI (إذا لم يكن مثبت)
npm install -g vercel

# تسجيل الدخول إلى Vercel
vercel login

# ربط المشروع
vercel link

# إضافة متغيرات البيئة
vercel env add FIREBASE_ADMIN_SA_BASE64
# أدخل Base64 encoded service account JSON

vercel env add FCM_VAPID_KEY
# أدخل VAPID Key من Firebase Console

# نشر التحديثات
vercel --prod

# التحقق من النشر
vercel ls
```

## 5. أوامر إضافية مفيدة

### فحص حالة النشر
```bash
# فحص حالة Supabase
supabase status

# فحص حالة Vercel
vercel inspect

# فحص حالة GitHub
git status
git log --oneline -5
```

### إعادة تشغيل الخدمات
```bash
# إعادة تشغيل Vercel Functions
vercel --prod --force

# إعادة تشغيل Supabase Edge Functions
supabase functions deploy
```

### اختبار النظام
```bash
# اختبار API endpoints محلياً
npm run serve

# اختبار Migration
supabase db reset
supabase db push
```

## 6. تسلسل النشر الموصى به

```bash
# 1. أولاً: نشر Migration في Supabase
supabase login
supabase link --project-ref qjsvgpvbtrcnbhcjdcci
supabase db push

# 2. ثانياً: رفع الكود إلى GitHub
git add .
git commit -m "feat: إضافة نظام Firebase Cloud Messaging"
git push origin main

# 3. ثالثاً: نشر على Vercel
vercel --prod

# 4. أخيراً: إعداد Firebase Console يدوياً
# (يجب القيام به عبر الويب)
```

## 7. التحقق من النشر الناجح

### فحص Supabase
- اذهب إلى Supabase Dashboard
- تحقق من وجود جدول `push_tokens`
- اختبر RLS policies

### فحص Vercel
- اذهب إلى Vercel Dashboard
- تحقق من Environment Variables
- اختبر API endpoints

### فحص Firebase
- اذهب إلى Firebase Console
- تحقق من Cloud Messaging
- اختبر إرسال إشعار تجريبي

## 8. استكشاف الأخطاء

### إذا فشل Migration
```bash
# فحص logs
supabase logs

# إعادة تعيين قاعدة البيانات
supabase db reset
supabase db push
```

### إذا فشل Vercel
```bash
# فحص logs
vercel logs

# إعادة النشر
vercel --prod --force
```

### إذا فشل GitHub
```bash
# فحص حالة Git
git status
git remote -v

# إعادة المحاولة
git push origin main --force-with-lease
```

---

**ملاحظة**: تأكد من إعداد VAPID Key و Service Account في Firebase Console قبل النشر!
