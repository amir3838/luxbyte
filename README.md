# LUXBYTE Platform

منصة شاملة للتجارة الإلكترونية وخدمات التوصيل - A comprehensive e-commerce and delivery services platform

## 🌟 المميزات / Features

- **شوب إي جي (ShopEG)**: منصة التجارة الإلكترونية للمنشآت التجارية
- **ماستر درايفر (Master Driver)**: منصة خدمات التوصيل والنقل
- **دعم متعدد اللغات**: العربية والإنجليزية
- **واجهة متجاوبة**: تعمل على جميع الأجهزة
- **نظام إدارة الملفات**: رفع وإدارة المستندات المطلوبة
- **لوحات تحكم متخصصة**: لكل نوع من أنواع النشاط

## 🚀 التقنيات المستخدمة / Technologies

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Deployment**: Vercel
- **Version Control**: Git & GitHub
- **Security**: Row Level Security (RLS), CSP Headers

## 📁 هيكل المشروع / Project Structure

```
luxbyte/
├── index.html              # الصفحة الرئيسية
├── auth.html               # تسجيل الدخول
├── choose-platform.html    # اختيار المنصة
├── choose-role.html        # اختيار الدور
├── signup.html             # تسجيل البيانات
├── dashboard.html          # لوحة المراجعة
├── social.html             # صفحة التواصل
├── styles.css              # ملف التصميم الرئيسي
├── common.js               # الوظائف المشتركة
├── config.js               # إعدادات التطبيق
├── i18n-dict.js            # قاموس الترجمة
├── assets/                 # الصور والأيقونات
└── supabase/               # إعدادات قاعدة البيانات
```

## 🛠️ التثبيت والتشغيل / Installation & Setup

### 1. استنساخ المشروع
```bash
git clone https://github.com/amir-luxbyte/luxbyte-platform.git
cd luxbyte-platform
```

### 2. تثبيت المتطلبات
```bash
npm install
```

### 3. تشغيل المشروع محلياً
```bash
npm run dev
# أو
python -m http.server 8080
```

### 4. فتح المتصفح
```
http://localhost:8080
```

## 🌐 النشر / Deployment

### Vercel
```bash
npm run deploy
```

### GitHub Pages
1. ادفع الكود إلى GitHub
2. فعّل GitHub Pages في إعدادات المستودع
3. اختر الفرع الرئيسي كمصدر

## 🔧 الإعدادات / Configuration

### متغيرات البيئة
```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 📱 الصفحات / Pages

- **الرئيسية**: عرض المنصات والمميزات
- **اختيار المنصة**: شوب إي جي أو ماستر درايفر
- **اختيار الدور**: مطعم، سوبر ماركت، صيدلية، عيادة، مندوب
- **تسجيل البيانات**: نموذج التسجيل مع رفع الملفات
- **لوحة المراجعة**: عرض وإدارة الطلبات
- **التواصل**: معلومات التواصل ووسائل التواصل الاجتماعي

## 🎨 التصميم / Design

- **ألوان متدرجة**: أزرق وبنفسجي
- **خطوط واضحة**: Font Awesome للأيقونات
- **تأثيرات بصرية**: انيميشن وتدرجات
- **تصميم متجاوب**: يعمل على جميع الشاشات

## 🌍 اللغات المدعومة / Supported Languages

- العربية (الافتراضية)
- الإنجليزية

## 🚀 التشغيل المحلي / Running Locally

### متطلبات النظام
- Node.js 18+
- npm أو yarn

### خطوات التشغيل
```bash
# تثبيت التبعيات
npm install

# تشغيل السيرفر المحلي
npm run dev

# في terminal آخر - اختبار سريع
node scripts/test-smoke.mjs
```

### اختبارات الأمان
```bash
# اختبار شامل
npm run test:smoke

# اختبار في المتصفح
npm run test:browser
# ثم افتح: http://localhost:3000?test=true
```

## 🔒 الأمان والحماية / Security & RLS

### تطبيق سياسات RLS

1. **افتح Supabase Dashboard** → **SQL Editor**
2. **انسخ والصق** محتوى `supabase/rls_policies_final.sql`
3. **اضغط Run** لتطبيق جميع السياسات

### اختبار الأمان

```sql
-- في Supabase SQL Editor
-- اختبار كالمستخدم 1
SET LOCAL "request.jwt.claims" TO '{"sub": "user1-uuid"}';
SELECT * FROM documents; -- يجب أن يرى مستنداته فقط

-- اختبار كالمستخدم 2
SET LOCAL "request.jwt.claims" TO '{"sub": "user2-uuid"}';
SELECT * FROM documents; -- يجب أن يرى مستنداته فقط
```

### التحقق من السياسات

```sql
-- فحص حالة RLS
SELECT tablename, rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('documents', 'profiles', 'business_requests');

-- فحص عدد السياسات
SELECT schemaname, tablename, COUNT(*) as policy_count
FROM pg_policies
WHERE schemaname IN ('public', 'storage')
GROUP BY schemaname, tablename;
```

### اختبار الرفع

1. **سجل الدخول** كالمستخدم 1
2. **ارفع ملف** (يجب أن ينجح)
3. **سجل الدخول** كالمستخدم 2
4. **حاول الوصول** لملفات المستخدم 1 (يجب أن يفشل)

## 📞 التواصل / Contact

- **الموقع**: [luxbyte-platform.vercel.app](https://luxbyte-platform.vercel.app)
- **GitHub**: [amir-luxbyte/luxbyte-platform](https://github.com/amir-luxbyte/luxbyte-platform)
- **البريد الإلكتروني**: info@luxbyte.com

## 📄 الترخيص / License

MIT License - راجع ملف [LICENSE](LICENSE) للتفاصيل

---

**تم تطويره بـ ❤️ بواسطة فريق LUXBYTE**