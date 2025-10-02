# 🚀 Luxbyte - منصة الأعمال الذكية

<div align="center">

![Luxbyte Logo](public/assets/images/shopeg_logo.webp)

**منصة شاملة لإدارة الأعمال التجارية المختلفة في مصر**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/luxbyte)
[![GitHub stars](https://img.shields.io/github/stars/your-username/luxbyte?style=social)](https://github.com/your-username/luxbyte)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[🌐 الموقع المباشر](https://luxbyte.vercel.app) • [📚 الوثائق](https://github.com/your-username/luxbyte/wiki) • [🐛 الإبلاغ عن مشكلة](https://github.com/your-username/luxbyte/issues)

</div>

## ✨ المميزات

- 🏢 **داشبوردات متخصصة** لكل نوع من الأعمال
- 📁 **إدارة المستندات** والملفات بسهولة
- 📊 **تقارير مفصلة** وإحصائيات في الوقت الفعلي
- 🔐 **نظام مصادقة آمن** مع Supabase
- 🌍 **واجهة عربية** سهلة الاستخدام
- 📱 **تصميم متجاوب** يعمل على جميع الأجهزة
- 🔗 **تكامل مع وسائل التواصل الاجتماعي**
- 📈 **رسوم بيانية تفاعلية** للبيانات

## 🏢 أنواع الحسابات المدعومة

| النوع | الوصف | المميزات |
|-------|--------|----------|
| 🏥 **صيدلية** | إدارة الأدوية والمخزون | إدارة المخزون، تتبع انتهاء الصلاحية، إدارة الطلبات |
| 🍕 **مطعم** | إدارة القائمة والطلبات | إدارة القائمة، تتبع الطلبات، إدارة العملاء |
| 🛒 **سوبر ماركت** | إدارة المنتجات والمخزون | إدارة المنتجات، تتبع المخزون، إدارة المبيعات |
| 🏥 **عيادة** | إدارة المرضى والمواعيد | إدارة المرضى، جدولة المواعيد، السجلات الطبية |
| 🚚 **مندوب توصيل** | إدارة التوصيلات | تتبع التوصيلات، إدارة الأرباح، تتبع الموقع |
| 🚗 **سائق** | إدارة الرحلات | إدارة الرحلات، تتبع الأرباح، إدارة العملاء |

## 🛠️ التقنيات المستخدمة

### Frontend
- **HTML5** - هيكل الصفحات
- **CSS3** - التصميم والتنسيق
- **JavaScript ES6+** - التفاعل والوظائف
- **Font Awesome** - الأيقونات
- **Chart.js** - الرسوم البيانية

### Backend
- **Supabase** - قاعدة البيانات والمصادقة
- **PostgreSQL** - قاعدة البيانات
- **Row Level Security (RLS)** - أمان البيانات
- **Storage** - تخزين الملفات

### Deployment
- **Vercel** - النشر والاستضافة
- **GitHub** - إدارة الكود
- **Git** - التحكم في الإصدارات

## 🚀 النشر السريع

### الطريقة الأولى: النشر التلقائي
```bash
# استنساخ المشروع
git clone https://github.com/your-username/luxbyte.git
cd luxbyte

# تشغيل سكريبت النشر الشامل
chmod +x deploy-all.sh
./deploy-all.sh
```

### الطريقة الثانية: النشر اليدوي

#### 1. إعداد Supabase
```bash
# تثبيت Supabase CLI
npm install -g supabase

# تسجيل الدخول
supabase login

# تشغيل SQL Schema
supabase db reset --linked
```

#### 2. إعداد GitHub
```bash
# إنشاء repository جديد
gh repo create your-username/luxbyte --public

# رفع الكود
git add .
git commit -m "Initial commit"
git push -u origin main
```

#### 3. النشر على Vercel
```bash
# تثبيت Vercel CLI
npm install -g vercel

# تسجيل الدخول
vercel login

# النشر
vercel --prod
```

## 📁 هيكل المشروع

```
luxbyte/
├── 📁 public/                    # الملفات العامة
│   ├── 📁 assets/               # الصور والأيقونات
│   │   ├── 📁 images/           # الصور
│   │   ├── 📁 icons/            # الأيقونات
│   │   └── 📁 app_icon/         # أيقونات التطبيق
│   ├── 📁 css/                  # ملفات التنسيق
│   │   ├── styles.css           # التنسيق الرئيسي
│   │   └── dashboard.css        # تنسيق الداشبورد
│   ├── 📁 js/                   # ملفات JavaScript
│   │   ├── 📁 api/              # واجهات برمجة التطبيقات
│   │   ├── 📁 auth/             # ملفات المصادقة
│   │   ├── 📁 dashboard/        # ملفات الداشبورد
│   │   └── supabase-client.js   # عميل Supabase
│   ├── 📁 dashboard/            # صفحات الداشبورد
│   │   ├── pharmacy.html        # داشبورد الصيدلية
│   │   ├── restaurant.html      # داشبورد المطعم
│   │   ├── supermarket.html     # داشبورد السوبر ماركت
│   │   ├── clinic.html          # داشبورد العيادة
│   │   ├── courier.html         # داشبورد مندوب التوصيل
│   │   └── driver.html          # داشبورد السائق
│   ├── index.html               # الصفحة الرئيسية
│   ├── auth.html                # صفحة تسجيل الدخول
│   └── unified-signup.html      # صفحة التسجيل الموحد
├── 📁 scripts/                  # سكريبتات النشر
│   ├── supabase-setup.sh        # إعداد Supabase
│   ├── github-setup.sh          # إعداد GitHub
│   ├── vercel-setup.sh          # إعداد Vercel
│   └── deploy-all.sh            # النشر الشامل
├── supabase-schema.sql          # مخطط قاعدة البيانات
├── vercel.json                  # إعدادات Vercel
├── package.json                 # تبعيات المشروع
└── README.md                    # هذا الملف
```

## 🔧 الإعداد المحلي

### المتطلبات
- Node.js 18+
- Git
- حساب Supabase
- حساب Vercel

### خطوات الإعداد

1. **استنساخ المشروع**
```bash
git clone https://github.com/your-username/luxbyte.git
cd luxbyte
```

2. **تثبيت التبعيات**
```bash
npm install
```

3. **إعداد متغيرات البيئة**
```bash
cp .env.example .env
# قم بتعديل .env بالقيم الصحيحة
```

4. **تشغيل المشروع محلياً**
```bash
npm run dev
```

5. **فتح المتصفح**
```
http://localhost:3000
```

## 🗄️ إعداد قاعدة البيانات

### 1. إنشاء مشروع Supabase
1. اذهب إلى [Supabase](https://supabase.com)
2. أنشئ مشروع جديد
3. احصل على URL و Anon Key

### 2. تشغيل SQL Schema
```sql
-- تشغيل الملف الموجود في المشروع
-- supabase-schema.sql
```

### 3. إعداد المصادقة
1. اذهب إلى Authentication > Settings
2. أضف URLs التالية:
   - `https://luxbyte.vercel.app`
   - `http://localhost:3000`

3. أضف Redirect URLs:
   - `https://luxbyte.vercel.app/email-confirmation.html`
   - `https://luxbyte.vercel.app/reset-password.html`
   - `https://luxbyte.vercel.app/auth-success.html`
   - `https://luxbyte.vercel.app/complete-registration.html`

## 🧪 الاختبار

### اختبار شامل
```bash
# فتح صفحة الاختبار
open public/test-comprehensive.html
```

### اختبار الوظائف
- ✅ اختبار الاتصال بـ Supabase
- ✅ اختبار المصادقة
- ✅ اختبار الداشبوردات
- ✅ اختبار رفع الملفات
- ✅ اختبار الرسوم البيانية

## 📊 الإحصائيات

- **إجمالي الملفات**: 50+ ملف
- **أسطر الكود**: 5000+ سطر
- **اللغات المستخدمة**: HTML, CSS, JavaScript, SQL
- **حجم المشروع**: ~2MB
- **وقت التحميل**: <3 ثواني

## 🤝 المساهمة

نرحب بمساهماتكم! يرجى اتباع الخطوات التالية:

1. **Fork** المشروع
2. إنشاء **branch** جديد للميزة
```bash
git checkout -b feature/amazing-feature
```
3. عمل **Commit** للتغييرات
```bash
git commit -m 'Add amazing feature'
```
4. عمل **Push** للـ branch
```bash
git push origin feature/amazing-feature
```
5. فتح **Pull Request**

### معايير المساهمة
- اتبع معايير الكود الموجودة
- أضف تعليقات باللغة العربية
- اختبر التغييرات قبل الإرسال
- اكتب وصف واضح للـ Pull Request

## 📄 الترخيص

هذا المشروع مرخص تحت رخصة MIT - انظر ملف [LICENSE](LICENSE) للتفاصيل.

## 📞 الدعم والاتصال

### الدعم التقني
- **البريد الإلكتروني**: support@luxbyte.com
- **واتساب**: +201148709609
- **الموقع**: https://luxbyte.com

### وسائل التواصل الاجتماعي
- **فيسبوك**: [Luxbyte LLC](https://www.facebook.com/share/19zx6VUm7M/)
- **إنستجرام**: [@luxbyte_llc1](https://www.instagram.com/luxbyte_llc1)
- **تيك توك**: [@luxpyte.llc](https://www.tiktok.com/@luxpyte.llc)

### الإبلاغ عن المشاكل
- **GitHub Issues**: [الإبلاغ عن مشكلة](https://github.com/your-username/luxbyte/issues)
- **البريد الإلكتروني**: bugs@luxbyte.com

## 🙏 شكر وتقدير

- **Supabase** - للخدمات السحابية
- **Vercel** - للاستضافة والنشر
- **Font Awesome** - للأيقونات
- **Chart.js** - للرسوم البيانية
- **GitHub** - لإدارة الكود

---

<div align="center">

**تم تطوير هذا المشروع بواسطة [Luxbyte LLC](https://luxbyte.com) - شركة لوكس بايت المحدودة المسئولية**

[![Made with ❤️ in Egypt](https://img.shields.io/badge/Made%20with%20❤️%20in-Egypt-red.svg)](https://github.com/your-username/luxbyte)

</div>