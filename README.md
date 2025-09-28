# 🚀 Luxbyte File Management System

نظام إدارة الملفات والمستندات الشامل لمنصة Luxbyte - نظام متكامل لرفع وإدارة المستندات المطلوبة لكل نشاط تجاري.

## 📋 نظرة عامة

Luxbyte File Management System هو نظام متطور لإدارة رفع الملفات والمستندات المطلوبة للتسجيل في منصة Luxbyte. يدعم النظام جميع أنواع الأنشطة التجارية مع التحقق التلقائي من صحة الملفات.

## ✨ الميزات الرئيسية

- 🏢 **دعم 6 أنواع أنشطة**: مطعم، سوبر ماركت، صيدلية، عيادة، مندوب توصيل، سائق رئيسي
- 📁 **إدارة ذكية للملفات**: تنظيم تلقائي في مجلدات منفصلة
- ✅ **التحقق التلقائي**: من الصيغ والأحجام والأبعاد
- 🔒 **أمان متقدم**: حماية الملفات الحساسة
- 📱 **تصميم متجاوب**: يعمل على جميع الأجهزة
- 🌐 **واجهة عربية**: مصممة خصيصاً للمستخدم العربي

## 🏗️ التقنيات المستخدمة

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Supabase (PostgreSQL + Storage)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel
- **Version Control**: GitHub

## 🚀 البدء السريع

### 1. استنساخ المشروع
```bash
git clone https://github.com/luxbyte/luxbyte-file-management.git
cd luxbyte-file-management
```

### 2. تثبيت المتطلبات
```bash
npm install
```

### 3. إعداد Supabase
```bash
# ربط المشروع
npx supabase link --project-ref YOUR_PROJECT_REF

# تطبيق المايجريشن
npx supabase db push

# إعداد Storage
npx supabase db reset
```

### 4. تشغيل المشروع محلياً
```bash
npm run dev
```

### 5. النشر على Vercel
```bash
npm run deploy
```

## 📁 هيكل المشروع

```
luxbyte-file-management/
├── 📄 index.html                 # الصفحة الرئيسية
├── 📄 file-upload.html          # واجهة رفع الملفات
├── 📁 js/
│   └── 📄 file-upload-manager.js # مدير رفع الملفات
├── 📁 supabase/
│   ├── 📁 migrations/
│   │   └── 📄 001_create_file_management_tables.sql
│   └── 📄 storage-setup.sql
├── 📁 assets/
│   ├── 📁 images/
│   └── 📁 icons/
├── 📄 package.json
├── 📄 vercel.json
└── 📄 README.md
```

## 📊 المستندات المطلوبة

### 🍽️ مطعم (Restaurant)
- **إلزامي**: لوجو، غلاف، واجهة، سجل تجاري، رخصة تشغيل
- **اختياري**: قائمة الطعام

### 🛒 سوبر ماركت (Supermarket)
- **إلزامي**: لوجو، أرفف، سجل تجاري، رخصة نشاط
- **اختياري**: صورة خارجية

### 💊 صيدلية (Pharmacy)
- **إلزامي**: لوجو، واجهة، ترخيص مزاولة، سجل تجاري
- **اختياري**: لافتة داخلية

### 🏥 عيادة (Clinic)
- **إلزامي**: لوجو، واجهة، رخصة، بطاقة طبيب (وجهان)
- **اختياري**: شهادة مزاولة

### 🚚 مندوب توصيل (Courier)
- **إلزامي**: بطاقة هوية (وجهان)، رخصة قيادة، صورة مركبة
- **اختياري**: صحيفة جنائية، رخصة مركبة

### 🚗 سائق رئيسي (Master Driver)
- **إلزامي**: جميع مستندات مندوب + رخصة مركبة + تأمين

## 🔧 التكوين

### متغيرات البيئة
```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### إعداد قاعدة البيانات
1. قم بتشغيل ملفات SQL في مجلد `supabase/`
2. تأكد من إعداد سياسات RLS
3. قم بإنشاء buckets في Supabase Storage

## 📱 الاستخدام

### للمطورين
```javascript
// إنشاء مدير الملفات
const fileManager = new FileUploadManager(supabase);

// رفع ملف
const result = await fileManager.uploadFile(file, docType, requestId, userId);

// التحقق من اكتمال المستندات
const completeness = await fileManager.checkRequiredDocumentsComplete(requestId, activityId);
```

### للمستخدمين
1. افتح `file-upload.html`
2. اختر نوع النشاط
3. ارفع المستندات المطلوبة
4. أرسل الطلب للمراجعة

## 🔒 الأمان

- **Row Level Security (RLS)**: حماية البيانات على مستوى الصفوف
- **تشفير الملفات**: جميع الملفات مشفرة في التخزين
- **التحقق من الصلاحيات**: المستخدمون يمكنهم الوصول لملفاتهم فقط
- **فحص الملفات**: التحقق من نوع وحجم الملفات

## 📈 الأداء

- **ضغط الصور**: تحسين أحجام الملفات تلقائياً
- **فهرسة قاعدة البيانات**: تحسين سرعة الاستعلامات
- **CDN**: تسريع تحميل الملفات عبر Vercel
- **Lazy Loading**: تحميل الملفات عند الحاجة

## 🧪 الاختبار

```bash
# تشغيل الاختبارات
npm test

# اختبار الواجهة
npm run test:ui

# اختبار الأداء
npm run test:performance
```

## 📊 الإحصائيات

- **الملفات المدعومة**: JPG, PNG, PDF
- **الحد الأقصى للحجم**: 5MB لكل ملف
- **الحد الأقصى للمستخدم**: 1GB
- **الأبعاد المدعومة**: 512×512, 1280×720, 1200×600

## 🤝 المساهمة

نرحب بمساهماتكم! يرجى اتباع الخطوات التالية:

1. Fork المشروع
2. إنشاء فرع للميزة الجديدة (`git checkout -b feature/amazing-feature`)
3. Commit التغييرات (`git commit -m 'Add amazing feature'`)
4. Push للفرع (`git push origin feature/amazing-feature`)
5. فتح Pull Request

## 📝 الترخيص

هذا المشروع مرخص تحت رخصة MIT - راجع ملف [LICENSE](LICENSE) للتفاصيل.

## 📞 الدعم

- **البريد الإلكتروني**: support@luxbyte.com
- **الهاتف**: 01148709609
- **الموقع**: https://luxbyte.com
- **GitHub Issues**: [فتح issue جديد](https://github.com/luxbyte/luxbyte-file-management/issues)

## 🙏 شكر وتقدير

- فريق Supabase للبنية التحتية الممتازة
- فريق Vercel للنشر السهل والسريع
- المجتمع المفتوح المصدر

---

**© 2025 Luxbyte - جميع الحقوق محفوظة**

Made with ❤️ in Egypt 🇪🇬
