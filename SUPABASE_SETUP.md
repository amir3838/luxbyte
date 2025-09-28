# إعداد Supabase CLI

## ✅ تم إنجاز المهام التالية:

### 1. تثبيت Supabase CLI
```bash
npx supabase --version
# الإصدار: 2.45.5
```

### 2. تهيئة المشروع
```bash
npx supabase init
# تم إنشاء مجلد supabase/ مع ملف config.toml
```

### 3. ربط المشروع بـ Supabase
```bash
npx supabase link --project-ref qjsvgpvbtrcnbhcjdcci
# تم ربط المشروع بنجاح
```

## 🔗 معلومات الاتصال

### سلسلة الاتصال الرئيسية:
```
postgresql://postgres.qjsvgpvbtrcnbhcjdcci:A01065452921%25A@aws-1-eu-west-1.pooler.supabase.com:5432/postgres
```

### سلسلة الاتصال بدون Pooling:
```
postgres://postgres.qjsvgpvbtrcnbhcjdcci:A01065452921%25A@aws-1-eu-west-1.pooler.supabase.com:5432/postgres?sslmode=require
```

## 📁 الملفات المُنشأة:

1. **supabase/config.toml** - ملف تكوين Supabase
2. **database-config.json** - ملف تكوين قاعدة البيانات
3. **supabase/.gitignore** - ملف gitignore للمشروع

## ⚠️ ملاحظات مهمة:

- **Docker Desktop مطلوب** للتطوير المحلي مع Supabase CLI
- يمكن استخدام سلسلة الاتصال مباشرة في التطبيقات
- المشروع مربوط بـ Supabase بنجاح

## 🚀 الخطوات التالية:

1. تثبيت Docker Desktop للتطوير المحلي
2. تشغيل `npx supabase start` لبدء البيئة المحلية
3. استخدام `npx supabase db pull` لسحب البيانات
4. استخدام `npx supabase db push` لرفع التغييرات

## 📋 أوامر مفيدة:

```bash
# عرض حالة المشروع
npx supabase status

# سحب البيانات من قاعدة البيانات البعيدة
npx supabase db pull

# رفع التغييرات إلى قاعدة البيانات البعيدة
npx supabase db push

# عرض قائمة الجداول
npx supabase db list

# إعادة تعيين قاعدة البيانات المحلية
npx supabase db reset
```
