# 🚀 دليل البدء السريع - Luxbyte

## ⚡ النشر السريع (5 دقائق)

### 1. تشغيل النشر التلقائي
```bash
# تشغيل النشر الشامل
./run-deployment.sh
```

### 2. النشر اليدوي

#### إعداد Supabase
```bash
# 1. اذهب إلى https://supabase.com
# 2. أنشئ مشروع جديد
# 3. احصل على URL و Anon Key
# 4. شغل ملف supabase-schema.sql في SQL Editor
```

#### إعداد GitHub
```bash
# 1. اذهب إلى https://github.com
# 2. أنشئ repository جديد
# 3. اربط المشروع المحلي
git remote add origin https://github.com/your-username/luxbyte.git
git push -u origin main
```

#### إعداد Vercel
```bash
# 1. اذهب إلى https://vercel.com
# 2. أنشئ مشروع جديد
# 3. اربط المشروع بـ GitHub
# 4. أضف متغيرات البيئة:
#    - SUPABASE_URL
#    - SUPABASE_ANON_KEY
```

## 🔧 المتطلبات

- Node.js 18+
- Git
- حساب Supabase
- حساب GitHub
- حساب Vercel

## 📁 الملفات المهمة

- `supabase-schema.sql` - مخطط قاعدة البيانات
- `vercel.json` - إعدادات Vercel
- `package.json` - تبعيات المشروع
- `run-deployment.sh` - سكريبت النشر الشامل

## 🌐 الروابط

- **الموقع**: https://luxbyte.vercel.app
- **GitHub**: https://github.com/your-username/luxbyte
- **Supabase**: https://supabase.com/dashboard
- **Vercel**: https://vercel.com/dashboard

## 📞 الدعم

- **البريد الإلكتروني**: support@luxbyte.com
- **واتساب**: +201148709609
- **الموقع**: https://luxbyte.com

---

**تم تطوير هذا المشروع بواسطة Luxbyte LLC**
