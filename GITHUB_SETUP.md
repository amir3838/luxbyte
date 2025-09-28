# إعداد GitHub Repository

## خطوات إنشاء Repository على GitHub:

### 1. اذهب إلى GitHub
- افتح https://github.com في المتصفح
- سجل الدخول إلى حسابك

### 2. إنشاء Repository جديد
- اضغط على زر "New" أو "+" في الزاوية العلوية
- اختر "New repository"

### 3. إعداد Repository
- **Repository name**: `luxbyte-file-management`
- **Description**: `نظام إدارة الملفات والمستندات الشامل لمنصة Luxbyte - Complete File Management System for Luxbyte Platform`
- **Visibility**: Public
- **Initialize**: لا تضع علامة على أي خيار (سنتعامل مع الملفات محلياً)

### 4. ربط Repository المحلي
بعد إنشاء Repository، قم بتشغيل الأوامر التالية:

```bash
# إضافة remote origin
git remote add origin https://github.com/YOUR_USERNAME/luxbyte-file-management.git

# تغيير اسم الفرع الرئيسي
git branch -M main

# رفع الكود
git push -u origin main
```

### 5. إعداد Vercel

#### الطريقة الأولى - عبر Vercel Dashboard:
1. اذهب إلى https://vercel.com
2. سجل الدخول بحساب GitHub
3. اضغط "New Project"
4. اختر repository `luxbyte-file-management`
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

### 6. إعداد متغيرات البيئة في Vercel
بعد النشر، أضف المتغيرات التالية في Vercel Dashboard:

```
SUPABASE_URL=https://qjsvgpvbtrcnbhcjdcci.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 7. تحديث ملف file-upload.html
قم بتحديث مفتاح Supabase في الملف:
```javascript
const supabaseKey = 'YOUR_ACTUAL_SUPABASE_ANON_KEY';
```

## ✅ التحقق من النجاح

بعد اكتمال الخطوات:
1. ✅ Repository موجود على GitHub
2. ✅ المشروع منشور على Vercel
3. ✅ الموقع يعمل بشكل صحيح
4. ✅ قاعدة البيانات مرتبطة
5. ✅ Storage يعمل

## 🔗 الروابط المهمة

- **GitHub Repository**: https://github.com/YOUR_USERNAME/luxbyte-file-management
- **Vercel Deployment**: https://luxbyte-file-management.vercel.app
- **Supabase Dashboard**: https://supabase.com/dashboard/project/qjsvgpvbtrcnbhcjdcci

## 📞 الدعم

إذا واجهت أي مشاكل:
- تحقق من إعدادات GitHub
- تأكد من صحة مفاتيح Supabase
- راجع logs في Vercel Dashboard
