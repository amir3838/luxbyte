# نظام إدارة الملفات والمستندات - Luxbyte
# File Management System for Luxbyte

## 📋 نظرة عامة

نظام شامل لإدارة رفع الملفات والمستندات المطلوبة لكل نشاط في منصة Luxbyte. يدعم التحقق من الصيغ والأحجام، وتنظيم الملفات في مجلدات منفصلة لكل مستخدم ونشاط.

## 🏗️ هيكل النظام

### 1. قاعدة البيانات (PostgreSQL)

#### الجداول الرئيسية:

- **`activity_types`** - أنواع الأنشطة (مطعم، صيدلية، إلخ)
- **`document_types`** - أنواع المستندات المطلوبة لكل نشاط
- **`registration_requests`** - طلبات التسجيل للمستخدمين
- **`uploaded_files`** - الملفات المرفوعة مع معلوماتها

#### الملفات:
- `supabase/migrations/001_create_file_management_tables.sql` - إنشاء الجداول
- `supabase/storage-setup.sql` - إعداد Supabase Storage

### 2. التخزين (Supabase Storage)

#### Buckets:
- **`documents`** - المستندات الخاصة (غير عامة)
- **`public-images`** - الصور العامة (لوجوهات، إلخ)

#### هيكل المجلدات:
```
documents/
├── {user_id}/
│   ├── restaurant/requests/
│   ├── supermarket/requests/
│   ├── pharmacy/requests/
│   ├── clinic/requests/
│   └── courier/requests/

public-images/
├── {user_id}/
│   ├── profile/
│   └── logos/
```

### 3. الواجهة الأمامية

#### الملفات:
- `file-upload.html` - واجهة رفع الملفات الرئيسية
- `js/file-upload-manager.js` - مدير رفع الملفات

## 📁 المستندات المطلوبة لكل نشاط

### 🍽️ مطعم (Restaurant)

#### إلزامي:
- **لوجو المطعم** (PNG 512×512) → `restaurant_logo.png`
- **صورة غلاف** (JPG 1200×600) → `restaurant_cover.jpg`
- **واجهة المحل** (JPG 1280px+) → `restaurant_facade.jpg`
- **السجل التجاري** (PDF/JPG) → `restaurant_cr.pdf`
- **رخصة التشغيل** (PDF/JPG) → `restaurant_op_license.pdf`

#### اختياري:
- **قائمة الطعام** (PDF/صور) → `menu.pdf`

### 🛒 سوبر ماركت (Supermarket)

#### إلزامي:
- **لوجو** (PNG 512×512) → `market_logo.png`
- **واجهة/أرفف المتجر** (JPG 1280px+) → `market_shelves.jpg`
- **السجل التجاري** (PDF/JPG) → `market_cr.pdf`
- **رخصة النشاط** (PDF/JPG) → `market_activity_license.pdf`

#### اختياري:
- **صورة خارجية للمحل** (JPG) → `market_facade.jpg`

### 💊 صيدلية (Pharmacy)

#### إلزامي:
- **لوجو** (PNG 512×512) → `pharmacy_logo.png`
- **واجهة الصيدلية** (JPG 1280px+) → `pharmacy_facade.jpg`
- **ترخيص مزاولة المهنة** (PDF/JPG) → `pharmacy_practice_license.pdf`
- **السجل التجاري** (PDF/JPG) → `pharmacy_cr.pdf`

#### اختياري:
- **لافتة داخلية/كونتر** (JPG) → `pharmacy_interior.jpg`

### 🏥 عيادة (Clinic)

#### إلزامي:
- **لوجو العيادة أو صورة الطبيب** (PNG/JPG 512×512) → `clinic_logo.png`
- **واجهة/الاستقبال** (JPG 1280px+) → `clinic_facade.jpg`
- **رخصة العيادة** (PDF/JPG) → `clinic_license.pdf`
- **بطاقة الطبيب - الوجه الأمامي** (JPG) → `doctor_id_front.jpg`
- **بطاقة الطبيب - الوجه الخلفي** (JPG) → `doctor_id_back.jpg`

#### اختياري:
- **شهادة مزاولة/زمالة** (PDF/JPG) → `doctor_certificate.pdf`

### 🚚 مندوب توصيل (Courier)

#### إلزامي:
- **بطاقة الهوية - الوجه الأمامي** (JPG) → `id_front.jpg`
- **بطاقة الهوية - الوجه الخلفي** (JPG) → `id_back.jpg`
- **رخصة القيادة** (JPG/PDF) → `driving_license.jpg`
- **صورة المركبة + اللوحة** (JPG) → `vehicle_photo.jpg`

#### اختياري:
- **صحيفة الحالة الجنائية** (PDF/JPG) → `background_check.pdf`
- **رخصة المركبة** (PDF/JPG) → `vehicle_license.pdf`

### 🚗 سائق رئيسي (Master Driver)

#### إلزامي:
- جميع مستندات مندوب التوصيل +
- **رخصة المركبة** (PDF/JPG) → `vehicle_license.pdf`
- **تأمين المركبة** (PDF/JPG) → `insurance.pdf`

## 🔧 الاستخدام

### 1. إعداد Supabase

```bash
# ربط المشروع
npx supabase link --project-ref qjsvgpvbtrcnbhcjdcci

# تطبيق المايجريشن
npx supabase db push

# تشغيل Storage setup
npx supabase db reset --db-url "your-database-url"
```

### 2. استخدام JavaScript API

```javascript
// إنشاء مدير الملفات
const fileManager = new FileUploadManager(supabase);

// الحصول على أنواع الأنشطة
const activities = await fileManager.getActivityTypes();

// الحصول على أنواع المستندات
const docTypes = await fileManager.getDocumentTypes(activityId);

// رفع ملف
const result = await fileManager.uploadFile(file, docType, requestId, userId);

// التحقق من اكتمال المستندات
const completeness = await fileManager.checkRequiredDocumentsComplete(requestId, activityId);
```

### 3. استخدام الواجهة

1. افتح `file-upload.html`
2. اختر نوع النشاط
3. ارفع المستندات المطلوبة
4. أرسل الطلب للمراجعة

## 📊 الميزات

### ✅ التحقق من الملفات
- التحقق من صيغة الملف
- التحقق من حجم الملف
- التحقق من نوع MIME
- التحقق من الأبعاد (للصور)

### ✅ إدارة التخزين
- تنظيم الملفات في مجلدات منفصلة
- ضغط الصور تلقائياً
- حذف الملفات المحذوفة من قاعدة البيانات
- إحصائيات الاستخدام

### ✅ الأمان
- سياسات RLS للحماية
- التحقق من صلاحيات المستخدم
- تشفير الملفات الحساسة
- حماية من الوصول غير المصرح

### ✅ واجهة المستخدم
- تصميم متجاوب
- سحب وإفلات الملفات
- شريط تقدم الرفع
- رسائل خطأ واضحة

## 🔒 الأمان والخصوصية

### سياسات الحماية:
- المستخدمون يمكنهم رؤية ملفاتهم فقط
- المديرون يمكنهم الوصول لجميع الملفات
- الملفات محمية بكلمات مرور
- تشفير البيانات الحساسة

### حدود الاستخدام:
- حد أقصى 5MB لكل ملف
- حد أقصى 1GB لكل مستخدم
- أنواع ملفات محدودة
- فحص الفيروسات

## 📈 الإحصائيات والمراقبة

### Views المتاحة:
- `registration_requests_with_files` - الطلبات مع الملفات
- `file_statistics` - إحصائيات الملفات

### الدوال:
- `get_user_storage_stats()` - إحصائيات المستخدم
- `check_storage_quota()` - فحص المساحة المتاحة

## 🚀 التطوير المستقبلي

### الميزات المخططة:
- [ ] ضغط الصور التلقائي
- [ ] OCR للمستندات
- [ ] فحص جودة الصور
- [ ] إشعارات التحديث
- [ ] API للهواتف المحمولة
- [ ] دعم الملفات السحابية

### التحسينات:
- [ ] تحسين سرعة الرفع
- [ ] دعم الملفات الكبيرة
- [ ] واجهة إدارة متقدمة
- [ ] تقارير مفصلة

## 📞 الدعم

للحصول على الدعم أو الإبلاغ عن مشاكل:
- البريد الإلكتروني: support@luxbyte.com
- الهاتف: 01148709609
- الموقع: https://luxbyte.com

---

**© 2025 Luxbyte - جميع الحقوق محفوظة**
