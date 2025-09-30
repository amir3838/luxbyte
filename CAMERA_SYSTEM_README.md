# نظام الكاميرا المحسّن - LUXBYTE

## نظرة عامة

تم تطوير نظام كاميرا محسّن لحل المشاكل التالية:
- رسائل "تم منح إذن الكاميرا" المتكررة
- عدم فتح الكاميرا بعد منح الإذن
- تكرار المستمعين (Event Listeners)
- مشاكل التوافق مع HTTPS/iFrame

## الملفات الرئيسية

### 1. `js/file-upload-manager.js`
النظام الأساسي للكاميرا مع:
- منع التكرار والرسائل المكررة
- معالجة أخطاء شاملة
- دعم فولباك تلقائي لـ iOS/Safari
- رسائل خطأ مفهومة باللغة العربية

### 2. `unified-signup.html`
صفحة التسجيل الموحد مع:
- أزرار كاميرا محسّنة
- مستمعين موحدين
- إزالة الكود المكرر

### 3. `test-camera.html`
صفحة اختبار للتحقق من عمل النظام

## الاستخدام السريع

### 1. فتح الكاميرا
```html
<button id="btnOpenCam">تصوير بالكاميرا</button>
<video id="camPrev" playsinline style="display: none;"></video>
```

```javascript
import { openCameraOnce } from './js/file-upload-manager.js';
document.getElementById('btnOpenCam').addEventListener('click', openCameraOnce);
```

### 2. التقاط صورة
```html
<button id="btnShot">التقاط & رفع</button>
```

```javascript
import { captureAndUpload } from './js/file-upload-manager.js';
document.getElementById('btnShot').addEventListener('click', captureAndUpload);
```

### 3. إيقاف الكاميرا
```html
<button id="btnStop">إيقاف الكاميرا</button>
```

```javascript
import { stopStream } from './js/file-upload-manager.js';
document.getElementById('btnStop').addEventListener('click', stopStream);
```

### 4. فولباك لاختيار الملف
```html
<input id="fileFallback" type="file" accept="image/*" capture="environment" style="display: none;">
```

```javascript
import { onFallbackFile } from './js/file-upload-manager.js';
document.getElementById('fileFallback').addEventListener('change', onFallbackFile);
```

## المتطلبات

### 1. البيئة
- HTTPS أو localhost
- متصفح يدعم `getUserMedia()`
- Supabase Storage مُكوّن

### 2. العناصر المطلوبة
```html
<!-- عنصر الفيديو (مطلوب) -->
<video id="camPrev" playsinline></video>

<!-- أزرار التحكم -->
<button id="btnOpenCam">فتح الكاميرا</button>
<button id="btnShot">التقاط</button>
<button id="btnStop">إيقاف</button>

<!-- فولباك لاختيار الملف -->
<input id="fileFallback" type="file" accept="image/*" capture="environment" style="display: none;">
```

## الاختبار

### 1. اختبار سريع
افتح `test-camera.html` في المتصفح واختبر الوظائف

### 2. اختبار في التطبيق
1. افتح `unified-signup.html`
2. انقر على "تصوير بالكاميرا"
3. تأكد من ظهور معاينة الكاميرا
4. انقر على "التقاط & رفع"
5. تأكد من رفع الصورة

## استكشاف الأخطاء

### 1. "يجب فتح الموقع عبر HTTPS"
**الحل:** شغّل الموقع على HTTPS أو localhost

### 2. "تم رفض الإذن من المتصفح"
**الحل:**
- اذهب إلى إعدادات المتصفح
- ابحث عن "الكاميرا" أو "Camera"
- اسمح بالوصول للموقع

### 3. "الكاميرا مشغولة بتطبيق آخر"
**الحل:** أغلق التطبيقات الأخرى التي تستخدم الكاميرا

### 4. لا تظهر معاينة الكاميرا
**الحل:**
- تحقق من وجود `<video id="camPrev">`
- تحقق من رسائل الخطأ في Console
- تأكد من استدعاء `openCameraOnce()` بعد تحميل DOM

## رسائل الخطأ

| الرسالة | السبب | الحل |
|---------|--------|------|
| "يجب فتح الموقع عبر HTTPS" | الموقع غير آمن | استخدم HTTPS أو localhost |
| "تم رفض الإذن من المتصفح" | المستخدم رفض الإذن | اسمح بالوصول في إعدادات المتصفح |
| "لا توجد كاميرا متاحة" | لا توجد كاميرا | استخدم جهاز به كاميرا |
| "الكاميرا مشغولة بتطبيق آخر" | كاميرا مستخدمة | أغلق التطبيقات الأخرى |
| "عنصر الفيديو camPrev غير موجود" | عنصر مفقود | أضف `<video id="camPrev">` |

## الدعم التقني

### 1. فحص Console
افتح Developer Tools (F12) واذهب إلى Console للبحث عن رسائل الخطأ

### 2. فحص الشبكة
تأكد من تحميل `js/file-upload-manager.js` بنجاح

### 3. فحص Supabase
تأكد من تكوين Supabase Storage بشكل صحيح

## التطوير

### 1. إضافة ميزات جديدة
عدّل `js/file-upload-manager.js` وأضف الدوال المطلوبة

### 2. تخصيص الرسائل
عدّل دوال `toastOk()` و `toastErr()` في الملف

### 3. تخصيص الرفع
عدّل دالة `uploadToSupabase()` لتتناسب مع احتياجاتك

## ملاحظات مهمة

1. **لا تستخدم `onclick`** في HTML للأزرار المتعلقة بالكاميرا
2. **لا تضيف مستمعين متعددة** لنفس العنصر
3. **تأكد من وجود عنصر الفيديو** قبل استدعاء دوال الكاميرا
4. **اختبر على أجهزة مختلفة** للتأكد من التوافق
5. **استخدم HTTPS** في الإنتاج

---
**تاريخ التطوير:** 2024-12-19
**الإصدار:** 1.0.0
**المطور:** LUXBYTE Development Team
