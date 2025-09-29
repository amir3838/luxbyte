# دليل النشر - LUXBYTE MPA

## 🚀 نظرة عامة

هذا الدليل يوضح كيفية نشر تطبيق LUXBYTE Multi-Page Application على Vercel مع Supabase كخلفية.

## 📋 المتطلبات

### 1. الحسابات المطلوبة
- **Vercel Account**: [vercel.com](https://vercel.com)
- **Supabase Account**: [supabase.com](https://supabase.com)
- **GitHub Account**: [github.com](https://github.com) (اختياري)

### 2. الأدوات المطلوبة
- **Node.js**: 16+ (لـ Vercel CLI)
- **Git**: لإدارة الكود
- **Supabase CLI**: لإدارة قاعدة البيانات

## 🔧 إعداد Supabase

### 1. إنشاء مشروع Supabase

```bash
# تسجيل الدخول
supabase login

# إنشاء مشروع جديد
supabase projects create luxbyte-mpa

# أو استخدام مشروع موجود
supabase link --project-ref YOUR_PROJECT_REF
```

### 2. إعداد قاعدة البيانات

```sql
-- إنشاء الجداول
CREATE TABLE restaurant_requests (
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  governorate TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT NOT NULL,
  restaurant_name TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  description TEXT,
  logo TEXT,
  cover TEXT,
  facade TEXT,
  commercial_register TEXT,
  operating_license TEXT,
  menu TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- جداول مماثلة للأدوار الأخرى
CREATE TABLE supermarket_requests (
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  governorate TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT NOT NULL,
  market_name TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  description TEXT,
  logo TEXT,
  shelves TEXT,
  commercial_register TEXT,
  activity_license TEXT,
  facade TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE pharmacy_requests (
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  governorate TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT NOT NULL,
  pharmacy_name TEXT NOT NULL,
  pharmacist_name TEXT NOT NULL,
  license_number TEXT NOT NULL,
  logo TEXT,
  facade TEXT,
  practice_license TEXT,
  commercial_register TEXT,
  interior TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE clinic_requests (
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  governorate TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT NOT NULL,
  clinic_name TEXT NOT NULL,
  doctor_name TEXT NOT NULL,
  specialization TEXT NOT NULL,
  license_number TEXT NOT NULL,
  logo TEXT,
  facade TEXT,
  clinic_license TEXT,
  doctor_id_front TEXT,
  doctor_id_back TEXT,
  certificate TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE courier_requests (
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  governorate TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT NOT NULL,
  national_id TEXT NOT NULL,
  vehicle_type TEXT NOT NULL,
  license_number TEXT NOT NULL,
  id_front TEXT,
  id_back TEXT,
  driving_license TEXT,
  vehicle_photo TEXT,
  background_check TEXT,
  vehicle_license TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 3. إعداد Row Level Security (RLS)

```sql
-- تفعيل RLS على جميع الجداول
ALTER TABLE restaurant_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE supermarket_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE pharmacy_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinic_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE courier_requests ENABLE ROW LEVEL SECURITY;

-- سياسات القراءة العامة
CREATE POLICY "Allow public read" ON restaurant_requests
  FOR SELECT USING (true);

CREATE POLICY "Allow public read" ON supermarket_requests
  FOR SELECT USING (true);

CREATE POLICY "Allow public read" ON pharmacy_requests
  FOR SELECT USING (true);

CREATE POLICY "Allow public read" ON clinic_requests
  FOR SELECT USING (true);

CREATE POLICY "Allow public read" ON courier_requests
  FOR SELECT USING (true);

-- سياسات الإدراج للمستخدمين المسجلين
CREATE POLICY "Allow authenticated insert" ON restaurant_requests
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated insert" ON supermarket_requests
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated insert" ON pharmacy_requests
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated insert" ON clinic_requests
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated insert" ON courier_requests
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
```

### 4. إعداد Storage Buckets

```sql
-- إنشاء Buckets للتخزين
INSERT INTO storage.buckets (id, name, public) VALUES
  ('restaurant', 'restaurant', true),
  ('supermarket', 'supermarket', true),
  ('pharmacy', 'pharmacy', true),
  ('clinic', 'clinic', true),
  ('courier', 'courier', true);

-- سياسات Storage
CREATE POLICY "Allow public upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id IN ('restaurant', 'supermarket', 'pharmacy', 'clinic', 'courier'));

CREATE POLICY "Allow public read" ON storage.objects
  FOR SELECT USING (bucket_id IN ('restaurant', 'supermarket', 'pharmacy', 'clinic', 'courier'));
```

### 5. إعداد Authentication

```sql
-- تفعيل Email Authentication
-- في Supabase Dashboard > Authentication > Settings
-- تفعيل "Enable email confirmations"
-- إضافة Redirect URLs:
-- - https://your-domain.vercel.app/auth.html
-- - http://localhost:8080/auth.html
```

## 🚀 نشر على Vercel

### 1. إعداد Vercel CLI

```bash
# تثبيت Vercel CLI
npm i -g vercel

# تسجيل الدخول
vercel login
```

### 2. ربط المشروع

```bash
# في مجلد المشروع
vercel link

# أو إنشاء مشروع جديد
vercel
```

### 3. تحديث الإعدادات

قم بتحديث `config.js`:

```javascript
window.CONFIG = {
  SUPABASE_URL: "https://YOUR_PROJECT_REF.supabase.co",
  SUPABASE_ANON_KEY: "YOUR_ANON_KEY",
  // ... باقي الإعدادات
};
```

### 4. النشر

```bash
# النشر للإنتاج
vercel deploy --prod

# أو النشر التلقائي من Git
git push origin main
```

## 🔐 إعداد متغيرات البيئة

### 1. في Vercel Dashboard

1. اذهب إلى مشروعك في Vercel
2. Settings > Environment Variables
3. أضف المتغيرات التالية:

```
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

### 2. في Supabase Dashboard

1. اذهب إلى مشروعك في Supabase
2. Settings > API
3. انسخ:
   - Project URL
   - anon public key

## 🌐 إعداد النطاق المخصص

### 1. في Vercel Dashboard

1. اذهب إلى مشروعك
2. Settings > Domains
3. أضف نطاقك المخصص
4. اتبع التعليمات لإعداد DNS

### 2. تحديث Supabase Auth

1. اذهب إلى Supabase Dashboard
2. Authentication > URL Configuration
3. أضف نطاقك المخصص:
   - Site URL: https://your-domain.com
   - Redirect URLs: https://your-domain.com/auth.html

## 🔍 اختبار النشر

### 1. اختبار الصفحات

```bash
# اختبار الصفحة الرئيسية
curl https://your-domain.vercel.app/

# اختبار صفحة التسجيل
curl https://your-domain.vercel.app/auth.html

# اختبار API
curl https://your-domain.vercel.app/api/health
```

### 2. اختبار الوظائف

1. **تسجيل الدخول**: تأكد من عمل تسجيل الدخول
2. **رفع الملفات**: اختبر رفع المستندات
3. **حفظ البيانات**: تأكد من حفظ البيانات في Supabase
4. **الحماية**: تأكد من حماية الصفحات المحمية

## 🐛 استكشاف الأخطاء

### 1. مشاكل شائعة

#### خطأ CORS
```javascript
// في Supabase Dashboard > Settings > API
// أضف نطاقك إلى CORS origins
```

#### خطأ في Authentication
```javascript
// تحقق من Redirect URLs في Supabase
// تأكد من صحة SUPABASE_URL و SUPABASE_ANON_KEY
```

#### خطأ في Storage
```javascript
// تحقق من سياسات Storage
// تأكد من إنشاء Buckets بشكل صحيح
```

### 2. سجلات الأخطاء

```bash
# عرض سجلات Vercel
vercel logs

# عرض سجلات Supabase
# في Supabase Dashboard > Logs
```

## 📊 مراقبة الأداء

### 1. Vercel Analytics

1. اذهب إلى مشروعك في Vercel
2. Analytics
3. راقب:
   - عدد الزيارات
   - وقت التحميل
   - الأخطاء

### 2. Supabase Monitoring

1. اذهب إلى Supabase Dashboard
2. Monitor
3. راقب:
   - استهلاك قاعدة البيانات
   - استهلاك Storage
   - الأخطاء

## 🔄 التحديثات

### 1. تحديث الكود

```bash
# إجراء التغييرات
git add .
git commit -m "Update feature"
git push origin main

# Vercel سيقوم بالنشر التلقائي
```

### 2. تحديث قاعدة البيانات

```bash
# إنشاء migration جديد
supabase migration new update_tables

# تطبيق التغييرات
supabase db push
```

## 🛡️ الأمان

### 1. HTTPS

- Vercel يوفر HTTPS تلقائياً
- تأكد من استخدام HTTPS في جميع الروابط

### 2. متغيرات البيئة

- لا تضع مفاتيح Supabase في الكود
- استخدم متغيرات البيئة دائماً

### 3. CORS

- أضف نطاقك إلى CORS origins في Supabase
- لا تستخدم `*` في الإنتاج

## 📞 الدعم

### 1. Vercel Support

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

### 2. Supabase Support

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Community](https://github.com/supabase/supabase/discussions)

### 3. LUXBYTE Support

- **البريد الإلكتروني**: support@luxbyte.com
- **الهاتف**: +201148709609
- **الواتساب**: +201148709609

---

**LUXBYTE LLC** - شركة لوكس بايت المحدودة المسئولية