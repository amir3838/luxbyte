# LUXBYTE - تعليمات النشر السريع
## Quick Deploy Instructions

---

## 🔧 1. تثبيت الأدوات (تم)

```bash
# تم تثبيت الأدوات التالية:
npm i -D http-server
npm i -g vercel
# Supabase CLI متاح عبر npx
```

---

## 🔗 2. ربط Supabase وتطبيق RLS

### الخطوة 1: احصل على بيانات Supabase
1. **افتح Supabase Dashboard**
2. **اذهب إلى Settings → General**
3. **انسخ PROJECT_REF** (مثل: abcd1234xyz)
4. **اذهب إلى Account Settings → Access Tokens**
5. **انسخ SUPABASE_ACCESS_TOKEN**

### الخطوة 2: ربط المشروع
```powershell
# في PowerShell
$env:SUPABASE_ACCESS_TOKEN = "ضع_التوكن_هنا"

# ربط المشروع (استبدل abcd1234xyz بالقيمة الحقيقية)
npx supabase link --project-ref abcd1234xyz
```

### الخطوة 3: تطبيق سياسات RLS
```powershell
# تطبيق سياسات الجداول
npx supabase db execute --file supabase/rls_policies_final.sql --use-remote

# تطبيق سياسات التخزين
npx supabase db execute --file supabase/storage_policies.sql --use-remote
```

---

## 🚀 3. تشغيل محلي واختبار

```bash
# تشغيل السيرفر المحلي
npm run dev

# في terminal آخر - اختبار سريع
node scripts/test-smoke.mjs

# أو اختبار مع عنوان محدد
$env:TEST_BASE="http://127.0.0.1:3000"
node scripts/test-smoke.mjs
```

---

## 🌐 4. النشر على Vercel

```bash
# سحب إعدادات المعاينة
vercel pull --environment=preview

# نشر المعاينة
vercel deploy --prebuilt

# بعد المراجعة - نشر الإنتاج
vercel deploy --prod
```

---

## ✅ 5. التحقق من النشر

```bash
# اختبار الصفحة الرئيسية
curl -I https://your-domain.vercel.app

# اختبار SPA routing
curl -I https://your-domain.vercel.app/dashboard/pharmacy

# اختبار API
curl -I https://your-domain.vercel.app/api/health
```

---

## 🚨 استكشاف الأخطاء

### خطأ: "supabase: command not found"
```bash
# استخدم npx بدلاً من supabase مباشرة
npx supabase --version
```

### خطأ: "vercel dev must not recursively invoke itself"
```bash
# تم إصلاحه - استخدم npm run dev بدلاً من vercel dev
npm run dev
```

### خطأ: "fetch failed" في الاختبارات
```bash
# تأكد من تشغيل السيرفر أولاً
npm run dev

# ثم شغل الاختبارات
node scripts/test-smoke.mjs
```

---

## 📋 قائمة التحقق النهائية

- [ ] ربط Supabase بنجاح
- [ ] تطبيق RLS policies
- [ ] تطبيق Storage policies
- [ ] اختبار محلي ناجح
- [ ] نشر المعاينة
- [ ] اختبار المعاينة
- [ ] نشر الإنتاج
- [ ] اختبار الإنتاج

---

**جاهز للنشر!** 🚀
