# LUXBYTE Deploy Commands
## أوامر النشر السريعة

---

## 🔒 1. تطبيق الأمان (قبل النشر)

```bash
# 1. تطبيق RLS policies في Supabase
# افتح Supabase Dashboard → SQL Editor
# انسخ والصق محتوى: supabase/rls_policies_final.sql
# اضغط Run

# 2. اختبار RLS
# انسخ والصق محتوى: supabase/test_rls.sql
# اضغط Run
```

---

## 🧪 2. اختبار محلي

```bash
# تشغيل السيرفر المحلي
npm run dev

# اختبار سريع
npm run test:smoke

# اختبار في المتصفح
npm run test:browser
# ثم افتح: http://localhost:3000?test=true
```

---

## 🚀 3. النشر على Vercel

### مرحلة المعاينة (Preview)

```bash
# سحب إعدادات المعاينة
vercel pull --environment=preview

# نشر المعاينة
vercel deploy --prebuilt

# اختبار المعاينة
curl -I https://your-preview-url.vercel.app
```

### مرحلة الإنتاج (Production)

```bash
# سحب متغيرات البيئة
vercel env pull .env

# نشر الإنتاج
vercel deploy --prod

# اختبار الإنتاج
curl -I https://your-production-url.vercel.app
```

---

## 🔍 4. اختبارات ما بعد النشر

```bash
# اختبار الصفحة الرئيسية
curl -I https://your-domain.com

# اختبار SPA routing
curl -I https://your-domain.com/dashboard/pharmacy

# اختبار API (إذا كان متاح)
curl -I https://your-domain.com/api/health
```

---

## 📋 5. قائمة التحقق السريع

### قبل النشر:
- [ ] تطبيق RLS policies في Supabase
- [ ] اختبار RLS مع مستخدمين مختلفين
- [ ] تشغيل `npm run test:smoke`
- [ ] التحقق من عدم وجود مفاتيح مكشوفة

### بعد النشر:
- [ ] اختبار تسجيل الدخول
- [ ] اختبار رفع ملف
- [ ] اختبار عرض البيانات
- [ ] اختبار الأمان (محاولة الوصول لبيانات الآخرين)

---

## 🚨 6. استكشاف الأخطاء السريع

```bash
# فحص logs
vercel logs

# فحص متغيرات البيئة
vercel env ls

# إعادة نشر
vercel deploy --prod --force
```

---

## 📞 7. الدعم

إذا واجهت مشاكل:

1. **تحقق من Supabase Logs**
2. **تحقق من Vercel Logs**
3. **شغل الاختبارات:**
   ```bash
   npm run test:smoke
   ```
4. **راجع ملفات الأمان:**
   - `SECURITY_SETUP.md`
   - `QUICK_CHECK_RESULTS.md`

---

**جاهز للنشر!** 🚀✅
