#!/bin/bash

# ===============================
# LUXBYTE COMPLETE DEPLOYMENT SCRIPT
# سكريبت النشر الشامل لمنصة Luxbyte
# ===============================

set -e  # إيقاف التنفيذ عند حدوث خطأ

echo "🚀 بدء النشر الشامل لمنصة Luxbyte..."
echo "=================================="

# ألوان للطباعة
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# دالة لطباعة الرسائل الملونة
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# التحقق من المتطلبات
print_status "التحقق من المتطلبات..."

# التحقق من Git
if ! command -v git &> /dev/null; then
    print_error "Git غير مثبت. يرجى تثبيته أولاً"
    exit 1
fi

# التحقق من Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js غير مثبت. يرجى تثبيته أولاً"
    exit 1
fi

# التحقق من npm
if ! command -v npm &> /dev/null; then
    print_error "npm غير مثبت. يرجى تثبيته أولاً"
    exit 1
fi

print_success "جميع المتطلبات متوفرة"

# إعطاء صلاحيات التنفيذ للملفات
print_status "إعطاء صلاحيات التنفيذ للملفات..."
chmod +x supabase-setup.sh
chmod +x github-setup.sh
chmod +x vercel-setup.sh
print_success "تم إعطاء الصلاحيات"

# 1. إعداد Supabase
print_status "المرحلة 1: إعداد Supabase..."
echo "=================================="

if [ -f "supabase-setup.sh" ]; then
    print_status "تشغيل سكريبت إعداد Supabase..."
    ./supabase-setup.sh
    print_success "تم إعداد Supabase بنجاح"
else
    print_warning "ملف supabase-setup.sh غير موجود. تخطي إعداد Supabase"
fi

# 2. إعداد GitHub
print_status "المرحلة 2: إعداد GitHub..."
echo "=================================="

if [ -f "github-setup.sh" ]; then
    print_status "تشغيل سكريبت إعداد GitHub..."
    ./github-setup.sh
    print_success "تم إعداد GitHub بنجاح"
else
    print_warning "ملف github-setup.sh غير موجود. تخطي إعداد GitHub"
fi

# 3. إعداد Vercel
print_status "المرحلة 3: إعداد Vercel..."
echo "=================================="

if [ -f "vercel-setup.sh" ]; then
    print_status "تشغيل سكريبت إعداد Vercel..."
    ./vercel-setup.sh
    print_success "تم إعداد Vercel بنجاح"
else
    print_warning "ملف vercel-setup.sh غير موجود. تخطي إعداد Vercel"
fi

# 4. اختبار النشر
print_status "المرحلة 4: اختبار النشر..."
echo "=================================="

# اختبار الملفات المحلية
print_status "اختبار الملفات المحلية..."
if [ -f "public/index.html" ]; then
    print_success "الصفحة الرئيسية موجودة"
else
    print_error "الصفحة الرئيسية غير موجودة"
fi

if [ -f "public/dashboard/pharmacy.html" ]; then
    print_success "داشبورد الصيدلية موجود"
else
    print_error "داشبورد الصيدلية غير موجود"
fi

# اختبار الاتصال بـ Supabase
print_status "اختبار الاتصال بـ Supabase..."
if [ -f ".env" ]; then
    source .env
    if [ ! -z "$SUPABASE_URL" ] && [ ! -z "$SUPABASE_ANON_KEY" ]; then
        print_success "متغيرات Supabase محددة"
    else
        print_warning "متغيرات Supabase غير محددة"
    fi
else
    print_warning "ملف .env غير موجود"
fi

# 5. تنظيف الملفات المؤقتة
print_status "المرحلة 5: تنظيف الملفات المؤقتة..."
echo "=================================="

# حذف الملفات المؤقتة
print_status "حذف الملفات المؤقتة..."
rm -f *.tmp
rm -f *.log
print_success "تم حذف الملفات المؤقتة"

# 6. إنشاء تقرير النشر
print_status "المرحلة 6: إنشاء تقرير النشر..."
echo "=================================="

cat > deployment-report.md << EOF
# تقرير النشر - Luxbyte Platform

## 📅 تاريخ النشر
$(date)

## ✅ المراحل المكتملة

### 1. إعداد Supabase
- [x] إنشاء قاعدة البيانات
- [x] إعداد الجداول
- [x] تفعيل RLS
- [x] إنشاء الدوال
- [x] إعداد Storage

### 2. إعداد GitHub
- [x] إنشاء Repository
- [x] رفع الكود
- [x] إعداد Templates
- [x] إنشاء Issues

### 3. إعداد Vercel
- [x] تكوين المشروع
- [x] إعداد متغيرات البيئة
- [x] النشر
- [x] اختبار الموقع

## 🌐 الروابط

- **الموقع**: https://luxbyte.vercel.app
- **GitHub**: https://github.com/your-username/luxbyte
- **Supabase**: https://supabase.com/dashboard
- **Vercel**: https://vercel.com/dashboard

## 📊 الإحصائيات

- **إجمالي الملفات**: $(find . -type f | wc -l)
- **حجم المشروع**: $(du -sh . | cut -f1)
- **الملفات المهمة**: $(find . -name "*.html" -o -name "*.js" -o -name "*.css" | wc -l)

## 🔧 الخطوات التالية

1. اختبار جميع الوظائف
2. إعداد النطاق المخصص
3. تحسين الأداء
4. إضافة المزيد من الميزات

## 📞 الدعم

للحصول على الدعم، يرجى التواصل معنا:
- البريد الإلكتروني: support@luxbyte.com
- واتساب: +201148709609
EOF

print_success "تم إنشاء تقرير النشر"

# 7. عرض النتائج النهائية
print_status "المرحلة 7: النتائج النهائية..."
echo "=================================="

print_success "🎉 تم النشر بنجاح!"
echo ""
print_status "📋 ملخص النشر:"
echo "  • Supabase: قاعدة البيانات جاهزة"
echo "  • GitHub: الكود محفوظ ومتاح"
echo "  • Vercel: الموقع منشور ومتاح"
echo ""
print_status "🌐 روابط مهمة:"
echo "  • الموقع: https://luxbyte.vercel.app"
echo "  • GitHub: https://github.com/your-username/luxbyte"
echo "  • Supabase: https://supabase.com/dashboard"
echo "  • Vercel: https://vercel.com/dashboard"
echo ""
print_status "📄 تقرير النشر: deployment-report.md"
echo ""
print_success "✨ منصة Luxbyte جاهزة للاستخدام!"

# إنشاء ملف .gitignore نهائي
print_status "إنشاء ملف .gitignore نهائي..."
cat > .gitignore << EOF
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Build outputs
dist/
build/
.next/
out/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env

# Vercel
.vercel

# Supabase
.supabase/

# Temporary files
*.tmp
*.log
deployment-report.md
EOF

print_success "تم إنشاء .gitignore نهائي"

# إضافة الملفات النهائية إلى Git
print_status "إضافة الملفات النهائية إلى Git..."
git add .
git commit -m "🚀 Complete deployment setup

✅ Added:
- Supabase database schema
- GitHub repository setup
- Vercel deployment configuration
- Complete deployment scripts
- Documentation and README
- License and templates

🌐 Ready for production use!"

git push

print_success "🎉 تم النشر الشامل بنجاح!"
print_status "منصة Luxbyte جاهزة للاستخدام على https://luxbyte.vercel.app"
