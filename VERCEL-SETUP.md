# 🚀 Vercel Environment Variables Setup

## متغيرات البيئة المطلوبة

### 1. اذهب إلى Vercel Dashboard
- https://vercel.com/dashboard
- اختر مشروع `luxbyte`
- اذهب إلى **Settings** > **Environment Variables**

### 2. أضف المتغيرات التالية:

```bash
# Required
SUPABASE_URL=your_supabase_url_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
ADMIN_KEY=your_secure_admin_key_here

# Optional (for enhanced security)
HMAC_SECRET=your_hmac_secret_here
ALLOWED_ORIGINS=https://luxbyte.vercel.app,https://admin.luxbyte.vercel.app
NODE_ENV=production
```

### 3. كيفية الحصول على القيم:

#### SUPABASE_URL
- اذهب إلى Supabase Dashboard
- اختر مشروعك
- اذهب إلى **Settings** > **API**
- انسخ **Project URL**

#### SUPABASE_SERVICE_ROLE_KEY
- في نفس صفحة API
- انسخ **service_role** key (⚠️ حساس جداً)

#### ADMIN_KEY
- أنشئ مفتاح قوي (32+ حرف)
- مثال: `admin_2024_luxbyte_secure_key_xyz123`

#### HMAC_SECRET (اختياري)
- أنشئ مفتاح HMAC قوي
- مثال: `hmac_secret_2024_luxbyte_xyz789`

### 4. بعد إضافة المتغيرات:
```bash
npx vercel --prod
```

## 🔐 نصائح الأمان

1. **لا تشارك** مفاتيح API مع أي شخص
2. **استخدم** مفاتيح قوية ومعقدة
3. **حدث** المفاتيح بانتظام
4. **راقب** استخدام API

## ✅ التحقق من النشر

بعد النشر، اختبر:
1. الصفحة الرئيسية: `https://your-domain.vercel.app/`
2. صفحة التسجيل: `https://your-domain.vercel.app/unified-signup.html`
3. لوحة الإدارة: `https://your-domain.vercel.app/admin-panel.html`
4. API: `https://your-domain.vercel.app/api/list-users?admin_key=YOUR_KEY`
