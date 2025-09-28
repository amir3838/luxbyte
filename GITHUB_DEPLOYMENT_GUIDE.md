# 🚀 دليل نشر المشروع على GitHub و Vercel

## 📋 الخطوات المطلوبة

### 1. إنشاء Repository على GitHub

#### الطريقة الأولى - عبر الموقع:
1. اذهب إلى https://github.com/new
2. املأ البيانات التالية:
   - **Repository name**: `luxbyte-file-management`
   - **Description**: `نظام إدارة الملفات والمستندات الشامل لمنصة Luxbyte - Complete File Management System for Luxbyte Platform`
   - **Visibility**: Public ✅
   - **Initialize**: لا تضع علامة على أي خيار (سنتعامل مع الملفات محلياً)

#### الطريقة الثانية - عبر GitHub CLI:
```bash
# تثبيت GitHub CLI (إذا لم يكن مثبت)
winget install --id GitHub.cli

# تسجيل الدخول
gh auth login

# إنشاء Repository
gh repo create luxbyte-file-management --public --description "نظام إدارة الملفات والمستندات الشامل لمنصة Luxbyte" --source=. --remote=origin --push
```

### 2. ربط Repository المحلي بـ GitHub

```bash
# إضافة remote origin
git remote add origin https://github.com/YOUR_USERNAME/luxbyte-file-management.git

# تغيير اسم الفرع الرئيسي
git branch -M main

# رفع الكود
git push -u origin main
```

### 3. النشر على Vercel

#### الطريقة الأولى - عبر Vercel Dashboard:
1. اذهب إلى https://vercel.com
2. سجل الدخول بحساب GitHub
3. اضغط "New Project"
4. اختر `luxbyte-file-management`
5. اضغط "Deploy"

#### الطريقة الثانية - عبر Vercel CLI:
```bash
# تثبيت Vercel CLI
npm install -g vercel

# تسجيل الدخول
vercel login

# النشر
vercel --prod
```

### 4. إعداد متغيرات البيئة في Vercel

بعد النشر، أضف المتغيرات التالية في Vercel Dashboard:

1. اذهب إلى Project Settings
2. اختر Environment Variables
3. أضف المتغيرات التالية:

```
SUPABASE_URL = https://qjsvgpvbtrcnbhcjdcci.supabase.co
SUPABASE_ANON_KEY = your_actual_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY = your_actual_service_role_key
```

### 5. تحديث مفاتيح Supabase في الكود

#### في ملف file-upload.html:
```javascript
// استبدل هذا السطر:
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';

// بمفتاحك الفعلي:
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

#### في ملف test-backend.html:
```javascript
// استبدل هذا السطر:
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';

// بمفتاحك الفعلي:
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

### 6. تطبيق قاعدة البيانات

```bash
# ربط المشروع بـ Supabase
npx supabase link --project-ref qjsvgpvbtrcnbhcjdcci

# تطبيق المايجريشن
npx supabase db push

# إعداد Storage
npx supabase db reset
```

## 🔗 الروابط المتوقعة

بعد النشر، ستكون الروابط كالتالي:

- **GitHub Repository**: https://github.com/YOUR_USERNAME/luxbyte-file-management
- **Vercel Deployment**: https://luxbyte-file-management.vercel.app
- **Supabase Dashboard**: https://supabase.com/dashboard/project/qjsvgpvbtrcnbhcjdcci

## ✅ التحقق من النجاح

### 1. GitHub:
- [ ] Repository منشور
- [ ] جميع الملفات موجودة
- [ ] README.md يظهر بشكل صحيح

### 2. Vercel:
- [ ] المشروع منشور
- [ ] الموقع يعمل
- [ ] متغيرات البيئة مُعدة

### 3. Supabase:
- [ ] قاعدة البيانات مرتبطة
- [ ] الجداول موجودة
- [ ] Storage يعمل

### 4. الموقع:
- [ ] الصفحة الرئيسية تعمل
- [ ] صفحة رفع الملفات تعمل
- [ ] جميع الوظائف تعمل

## 🚨 استكشاف الأخطاء

### مشاكل شائعة:

#### 1. خطأ في GitHub:
```
remote: Repository not found
```
**الحل**: تأكد من صحة URL واسم المستخدم

#### 2. خطأ في Vercel:
```
Build failed
```
**الحل**: تحقق من package.json وvercel.json

#### 3. خطأ في Supabase:
```
Invalid API key
```
**الحل**: تأكد من صحة مفاتيح Supabase

#### 4. خطأ في الموقع:
```
404 Not Found
```
**الحل**: تحقق من إعدادات Vercel

## 📞 الدعم

إذا واجهت أي مشاكل:
- **GitHub Issues**: فتح issue جديد في Repository
- **Vercel Support**: support@vercel.com
- **Supabase Support**: support@supabase.com
- **Luxbyte Team**: support@luxbyte.com

---

**🎉 مبروك! مشروع Luxbyte File Management System جاهز للنشر!**
