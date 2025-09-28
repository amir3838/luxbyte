# ⚡ نشر سريع - Luxbyte File Management System

## 🚀 الخطوات السريعة للنشر

### 1. إنشاء Repository على GitHub

**اذهب إلى**: https://github.com/new

**املأ البيانات**:
- **Repository name**: `luxbyte-file-management`
- **Description**: `نظام إدارة الملفات والمستندات الشامل لمنصة Luxbyte`
- **Visibility**: Public ✅
- **Initialize**: لا تضع علامة على أي خيار

**اضغط**: Create repository

### 2. ربط Repository المحلي

**انسخ الأوامر التالية** (استبدل YOUR_USERNAME باسم المستخدم):

```bash
git remote add origin https://github.com/YOUR_USERNAME/luxbyte-file-management.git
git branch -M main
git push -u origin main
```

### 3. النشر على Vercel

**اذهب إلى**: https://vercel.com

**الخطوات**:
1. سجل الدخول بحساب GitHub
2. اضغط "New Project"
3. اختر `luxbyte-file-management`
4. اضغط "Deploy"

### 4. إعداد متغيرات البيئة

**في Vercel Dashboard**:
1. اذهب إلى Project Settings
2. اختر Environment Variables
3. أضف:

```
SUPABASE_URL = https://qjsvgpvbtrcnbhcjdcci.supabase.co
SUPABASE_ANON_KEY = your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY = your_service_role_key
```

### 5. تحديث مفاتيح Supabase

**في ملف file-upload.html**:
```javascript
const supabaseKey = 'YOUR_ACTUAL_SUPABASE_ANON_KEY';
```

**في ملف test-backend.html**:
```javascript
const supabaseKey = 'YOUR_ACTUAL_SUPABASE_ANON_KEY';
```

### 6. تطبيق قاعدة البيانات

```bash
npx supabase link --project-ref qjsvgpvbtrcnbhcjdcci
npx supabase db push
```

## ✅ التحقق من النجاح

- [ ] GitHub Repository منشور
- [ ] Vercel Deployment يعمل
- [ ] الموقع يفتح بشكل صحيح
- [ ] رفع الملفات يعمل

## 🔗 الروابط المتوقعة

- **GitHub**: https://github.com/YOUR_USERNAME/luxbyte-file-management
- **Vercel**: https://luxbyte-file-management.vercel.app

---

**🎉 المشروع جاهز للنشر!**
