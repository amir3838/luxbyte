# دليل اختبار الداشبوردات - Luxbyte

## 📋 نظرة عامة
هذا الدليل يوضح كيفية اختبار جميع الداشبوردات والتأكد من عملها بشكل صحيح مع Supabase.

## 🚀 خطوات الإعداد

### 1. إعداد Supabase
```bash
# 1. إنشاء مشروع جديد في Supabase
# 2. الحصول على مفاتيح المشروع
# 3. تشغيل SQL Schemas
```

### 2. تحديث مفاتيح Supabase
في كل صفحة داشبورد، حدث `APP_CONFIG`:
```javascript
window.APP_CONFIG = {
    SUPABASE_URL: 'https://YOUR-PROJECT.supabase.co',
    SUPABASE_ANON_KEY: 'YOUR-ANON-KEY'
};
```

### 3. تشغيل SQL Schemas
في Supabase SQL Editor، نفّذ الملفات بالترتيب:
1. `sql/clinic_schema.sql`
2. `sql/courier_schema.sql`
3. `sql/driver_schema.sql`
4. `sql/pharmacy_schema.sql`
5. `sql/restaurant_schema.sql`
6. `sql/supermarket_schema.sql`

## 🧪 اختبار الداشبوردات

### 1. اختبار الاتصال
```javascript
// افتح Console في المتصفح
DashboardTester.testConnection()
```

### 2. اختبار المصادقة
```javascript
DashboardTester.testAuth()
```

### 3. اختبار رفع الملفات
```javascript
// اختر ملف أولاً
const fileInput = document.querySelector('input[type="file"]');
const file = fileInput.files[0];
DashboardTester.testFileUpload(file);
```

### 4. اختبار جميع الداشبوردات
```javascript
DashboardTester.runAllTests()
```

## 📊 صفحات الداشبورد

### العيادة
- **الرابط:** `/dashboard/clinic.html`
- **الميزات:** إدارة المرضى، المواعيد، السجلات الطبية، الموظفين
- **المستندات:** 6 مستندات مطلوبة

### المندوب
- **الرابط:** `/dashboard/courier.html`
- **الميزات:** إدارة التوصيلات، المركبة، الدوام، الموقع
- **المستندات:** 5 مستندات مطلوبة

### السائق
- **الرابط:** `/dashboard/driver.html`
- **الميزات:** إدارة الرحلات، المركبة، الدوام، الموقع
- **المستندات:** 5 مستندات مطلوبة

### الصيدلية
- **الرابط:** `/dashboard/pharmacy.html`
- **الميزات:** إدارة الأدوية، الطلبات، العملاء، المخزون
- **المستندات:** 5 مستندات مطلوبة

### المطعم
- **الرابط:** `/dashboard/restaurant.html`
- **الميزات:** إدارة قائمة الطعام، الطلبات، العملاء
- **المستندات:** 6 مستندات مطلوبة

### السوبر ماركت
- **الرابط:** `/dashboard/supermarket.html`
- **الميزات:** إدارة المنتجات، الطلبات، العملاء، المخزون
- **المستندات:** 6 مستندات مطلوبة

## 🔧 استكشاف الأخطاء

### خطأ في الاتصال
```
❌ خطأ في الاتصال: Invalid API key
```
**الحل:** تأكد من صحة `SUPABASE_ANON_KEY`

### خطأ في المصادقة
```
❌ خطأ في المصادقة: Invalid JWT
```
**الحل:** تأكد من تسجيل الدخول أولاً

### خطأ في رفع الملفات
```
❌ خطأ في رفع الملف: Bucket not found
```
**الحل:** تأكد من إنشاء Storage Buckets في Supabase

### خطأ في الجداول
```
❌ خطأ في API: relation does not exist
```
**الحل:** تأكد من تشغيل SQL Schemas

## 📈 مراقبة الأداء

### 1. Console Logs
راقب Console للرسائل التالية:
- `✅ Supabase client initialized`
- `✅ Dashboard loaded successfully`
- `✅ API functions working`

### 2. Network Tab
تأكد من:
- طلبات Supabase تعمل (200 status)
- رفع الملفات ينجح
- لا توجد أخطاء CORS

### 3. Storage
تأكد من:
- الملفات ترفع إلى Storage
- URLs تعمل بشكل صحيح
- الصلاحيات صحيحة

## 🎯 قائمة التحقق

### قبل الاختبار
- [ ] Supabase project منشأ
- [ ] مفاتيح المشروع محدثة
- [ ] SQL Schemas منفذة
- [ ] Storage Buckets منشأة

### أثناء الاختبار
- [ ] الاتصال يعمل
- [ ] المصادقة تعمل
- [ ] رفع الملفات يعمل
- [ ] جميع الداشبوردات تحمل
- [ ] KPIs تظهر
- [ ] الجداول تعمل
- [ ] الرسوم البيانية تعمل

### بعد الاختبار
- [ ] جميع الميزات تعمل
- [ ] لا توجد أخطاء في Console
- [ ] الأداء مقبول
- [ ] التصميم متجاوب

## 🚨 مشاكل شائعة

### 1. CORS Error
**السبب:** إعدادات CORS في Supabase
**الحل:** أضف domain إلى Allowed Origins

### 2. RLS Policy Error
**السبب:** سياسات RLS تمنع الوصول
**الحل:** تأكد من `owner = auth.uid()` في السياسات

### 3. Module Import Error
**السبب:** مسارات الملفات خاطئة
**الحل:** تأكد من صحة مسارات `import`

### 4. Canvas Drawing Error
**السبب:** Canvas element غير موجود
**الحل:** تأكد من وجود `<canvas>` في HTML

## 📞 الدعم

إذا واجهت مشاكل:
1. راجع Console للرسائل
2. تأكد من إعدادات Supabase
3. اختبر كل مكون على حدة
4. راجع هذا الدليل

---

**تم إنشاء هذا الدليل بواسطة Luxbyte Team**
**آخر تحديث:** $(date)

## 📋 نظرة عامة
هذا الدليل يوضح كيفية اختبار جميع الداشبوردات والتأكد من عملها بشكل صحيح مع Supabase.

## 🚀 خطوات الإعداد

### 1. إعداد Supabase
```bash
# 1. إنشاء مشروع جديد في Supabase
# 2. الحصول على مفاتيح المشروع
# 3. تشغيل SQL Schemas
```

### 2. تحديث مفاتيح Supabase
في كل صفحة داشبورد، حدث `APP_CONFIG`:
```javascript
window.APP_CONFIG = {
    SUPABASE_URL: 'https://YOUR-PROJECT.supabase.co',
    SUPABASE_ANON_KEY: 'YOUR-ANON-KEY'
};
```

### 3. تشغيل SQL Schemas
في Supabase SQL Editor، نفّذ الملفات بالترتيب:
1. `sql/clinic_schema.sql`
2. `sql/courier_schema.sql`
3. `sql/driver_schema.sql`
4. `sql/pharmacy_schema.sql`
5. `sql/restaurant_schema.sql`
6. `sql/supermarket_schema.sql`

## 🧪 اختبار الداشبوردات

### 1. اختبار الاتصال
```javascript
// افتح Console في المتصفح
DashboardTester.testConnection()
```

### 2. اختبار المصادقة
```javascript
DashboardTester.testAuth()
```

### 3. اختبار رفع الملفات
```javascript
// اختر ملف أولاً
const fileInput = document.querySelector('input[type="file"]');
const file = fileInput.files[0];
DashboardTester.testFileUpload(file);
```

### 4. اختبار جميع الداشبوردات
```javascript
DashboardTester.runAllTests()
```

## 📊 صفحات الداشبورد

### العيادة
- **الرابط:** `/dashboard/clinic.html`
- **الميزات:** إدارة المرضى، المواعيد، السجلات الطبية، الموظفين
- **المستندات:** 6 مستندات مطلوبة

### المندوب
- **الرابط:** `/dashboard/courier.html`
- **الميزات:** إدارة التوصيلات، المركبة، الدوام، الموقع
- **المستندات:** 5 مستندات مطلوبة

### السائق
- **الرابط:** `/dashboard/driver.html`
- **الميزات:** إدارة الرحلات، المركبة، الدوام، الموقع
- **المستندات:** 5 مستندات مطلوبة

### الصيدلية
- **الرابط:** `/dashboard/pharmacy.html`
- **الميزات:** إدارة الأدوية، الطلبات، العملاء، المخزون
- **المستندات:** 5 مستندات مطلوبة

### المطعم
- **الرابط:** `/dashboard/restaurant.html`
- **الميزات:** إدارة قائمة الطعام، الطلبات، العملاء
- **المستندات:** 6 مستندات مطلوبة

### السوبر ماركت
- **الرابط:** `/dashboard/supermarket.html`
- **الميزات:** إدارة المنتجات، الطلبات، العملاء، المخزون
- **المستندات:** 6 مستندات مطلوبة

## 🔧 استكشاف الأخطاء

### خطأ في الاتصال
```
❌ خطأ في الاتصال: Invalid API key
```
**الحل:** تأكد من صحة `SUPABASE_ANON_KEY`

### خطأ في المصادقة
```
❌ خطأ في المصادقة: Invalid JWT
```
**الحل:** تأكد من تسجيل الدخول أولاً

### خطأ في رفع الملفات
```
❌ خطأ في رفع الملف: Bucket not found
```
**الحل:** تأكد من إنشاء Storage Buckets في Supabase

### خطأ في الجداول
```
❌ خطأ في API: relation does not exist
```
**الحل:** تأكد من تشغيل SQL Schemas

## 📈 مراقبة الأداء

### 1. Console Logs
راقب Console للرسائل التالية:
- `✅ Supabase client initialized`
- `✅ Dashboard loaded successfully`
- `✅ API functions working`

### 2. Network Tab
تأكد من:
- طلبات Supabase تعمل (200 status)
- رفع الملفات ينجح
- لا توجد أخطاء CORS

### 3. Storage
تأكد من:
- الملفات ترفع إلى Storage
- URLs تعمل بشكل صحيح
- الصلاحيات صحيحة

## 🎯 قائمة التحقق

### قبل الاختبار
- [ ] Supabase project منشأ
- [ ] مفاتيح المشروع محدثة
- [ ] SQL Schemas منفذة
- [ ] Storage Buckets منشأة

### أثناء الاختبار
- [ ] الاتصال يعمل
- [ ] المصادقة تعمل
- [ ] رفع الملفات يعمل
- [ ] جميع الداشبوردات تحمل
- [ ] KPIs تظهر
- [ ] الجداول تعمل
- [ ] الرسوم البيانية تعمل

### بعد الاختبار
- [ ] جميع الميزات تعمل
- [ ] لا توجد أخطاء في Console
- [ ] الأداء مقبول
- [ ] التصميم متجاوب

## 🚨 مشاكل شائعة

### 1. CORS Error
**السبب:** إعدادات CORS في Supabase
**الحل:** أضف domain إلى Allowed Origins

### 2. RLS Policy Error
**السبب:** سياسات RLS تمنع الوصول
**الحل:** تأكد من `owner = auth.uid()` في السياسات

### 3. Module Import Error
**السبب:** مسارات الملفات خاطئة
**الحل:** تأكد من صحة مسارات `import`

### 4. Canvas Drawing Error
**السبب:** Canvas element غير موجود
**الحل:** تأكد من وجود `<canvas>` في HTML

## 📞 الدعم

إذا واجهت مشاكل:
1. راجع Console للرسائل
2. تأكد من إعدادات Supabase
3. اختبر كل مكون على حدة
4. راجع هذا الدليل

---

**تم إنشاء هذا الدليل بواسطة Luxbyte Team**
**آخر تحديث:** $(date)
