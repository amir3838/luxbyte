#!/bin/bash

# ===============================
# LUXBYTE GITHUB SETUP SCRIPT
# سكريبت إعداد GitHub لمنصة Luxbyte
# ===============================

echo "🐙 بدء إعداد GitHub لمنصة Luxbyte..."

# التحقق من تثبيت Git
if ! command -v git &> /dev/null; then
    echo "❌ Git غير مثبت. يرجى تثبيته أولاً"
    exit 1
fi

# التحقق من تثبيت GitHub CLI
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI غير مثبت. يرجى تثبيته أولاً:"
    echo "brew install gh  # على macOS"
    echo "winget install GitHub.cli  # على Windows"
    exit 1
fi

# التحقق من تسجيل الدخول في GitHub
echo "🔐 التحقق من تسجيل الدخول في GitHub..."
if ! gh auth status &> /dev/null; then
    echo "⚠️ لم يتم تسجيل الدخول. يرجى تسجيل الدخول:"
    gh auth login
fi

# إنشاء repository جديد
echo "📁 إنشاء repository جديد..."
read -p "أدخل اسم المستخدم/المنظمة: " username
read -p "أدخل اسم المشروع (افتراضي: luxbyte): " repo_name
repo_name=${repo_name:-luxbyte}

# إنشاء repository
gh repo create $username/$repo_name --public --description "Luxbyte - منصة الأعمال الذكية | Smart Business Platform" --clone

# الانتقال إلى مجلد المشروع
cd $repo_name

# إضافة الملفات
echo "📝 إضافة الملفات..."
git add .

# إنشاء .gitignore
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
EOF

# إضافة الملفات إلى Git
git add .gitignore
git add .

# إنشاء commit أولي
echo "💾 إنشاء commit أولي..."
git commit -m "🚀 Initial commit: Luxbyte Smart Business Platform

✨ Features:
- 📱 Multi-dashboard platform (Pharmacy, Restaurant, Supermarket, Clinic, Courier, Driver)
- 🔐 Supabase authentication & database
- 📊 Real-time analytics & reporting
- 📱 Responsive Arabic UI
- 🔗 Social media integration
- 📁 File upload & management
- 🎨 Modern design with Font Awesome icons

🛠️ Tech Stack:
- Frontend: HTML5, CSS3, JavaScript ES6+
- Backend: Supabase (PostgreSQL + Auth + Storage)
- Deployment: Vercel
- Icons: Font Awesome
- Charts: Chart.js

🌐 Ready for deployment on Vercel!"

# رفع التغييرات
echo "⬆️ رفع التغييرات إلى GitHub..."
git push -u origin main

# إنشاء GitHub Pages (اختياري)
echo "🌐 إعداد GitHub Pages..."
read -p "هل تريد تفعيل GitHub Pages؟ (y/n): " enable_pages

if [ "$enable_pages" = "y" ]; then
    gh repo edit $username/$repo_name --enable-pages --pages-source=main
    echo "✅ تم تفعيل GitHub Pages"
    echo "🌐 الموقع متاح على: https://$username.github.io/$repo_name"
fi

# إنشاء Issues للمهام
echo "📋 إنشاء Issues للمهام..."
gh issue create --title "🔧 Setup Supabase Database" --body "تكوين قاعدة بيانات Supabase وتشغيل SQL schema" --label "setup,database"
gh issue create --title "🚀 Deploy to Vercel" --body "نشر المشروع على Vercel وتكوين البيئة" --label "deployment,vercel"
gh issue create --title "🧪 Test All Features" --body "اختبار جميع الوظائف والتأكد من عملها" --label "testing,qa"
gh issue create --title "📱 Mobile Optimization" --body "تحسين التصميم للهواتف المحمولة" --label "mobile,ui"
gh issue create --title "🌐 SEO Optimization" --body "تحسين محركات البحث" --label "seo,optimization"

# إنشاء Pull Request template
echo "📝 إنشاء Pull Request template..."
mkdir -p .github/pull_request_template
cat > .github/pull_request_template.md << EOF
## 📝 وصف التغييرات
<!-- وصف مختصر للتغييرات المطلوبة -->

## 🎯 نوع التغيير
- [ ] 🐛 إصلاح خطأ
- [ ] ✨ ميزة جديدة
- [ ] 💄 تحسين واجهة المستخدم
- [ ] ⚡ تحسين الأداء
- [ ] 📚 تحديث الوثائق
- [ ] 🧪 إضافة اختبارات
- [ ] 🔧 إصلاح البناء

## 🧪 كيفية الاختبار
<!-- خطوات اختبار التغييرات -->

## 📸 لقطات الشاشة (إن أمكن)
<!-- إضافة لقطات شاشة للتغييرات البصرية -->

## ✅ قائمة التحقق
- [ ] تم اختبار التغييرات محلياً
- [ ] تم تحديث الوثائق
- [ ] لا توجد أخطاء في وحدة التحكم
- [ ] التصميم متجاوب
- [ ] الكود يتبع معايير المشروع

## 🔗 روابط ذات صلة
<!-- روابط للمشاكل أو الوثائق ذات الصلة -->
EOF

# إنشاء Issue template
echo "📝 إنشاء Issue template..."
mkdir -p .github/ISSUE_TEMPLATE
cat > .github/ISSUE_TEMPLATE/bug_report.md << EOF
---
name: 🐛 تقرير خطأ
about: إنشاء تقرير لمساعدتنا في إصلاح المشكلة
title: '[BUG] '
labels: bug
assignees: ''
---

## 🐛 وصف الخطأ
<!-- وصف واضح ومختصر للخطأ -->

## 🔄 خطوات إعادة إنتاج الخطأ
1. اذهب إلى '...'
2. اضغط على '...'
3. مرر لأسفل إلى '...'
4. شاهد الخطأ

## 🎯 السلوك المتوقع
<!-- وصف واضح ومختصر لما كنت تتوقعه -->

## 📸 لقطات الشاشة
<!-- إذا أمكن، أضف لقطات شاشة لمساعدتنا في فهم المشكلة -->

## 🖥️ معلومات النظام
- نظام التشغيل: [مثل Windows 10]
- المتصفح: [مثل Chrome 91]
- إصدار المشروع: [مثل v1.0.0]

## 📝 معلومات إضافية
<!-- أضف أي معلومات أخرى حول المشكلة هنا -->
EOF

cat > .github/ISSUE_TEMPLATE/feature_request.md << EOF
---
name: ✨ طلب ميزة جديدة
about: اقتراح فكرة لهذا المشروع
title: '[FEATURE] '
labels: enhancement
assignees: ''
---

## ✨ هل طلبك مرتبط بمشكلة؟
<!-- وصف واضح ومختصر للمشكلة. مثال: أنا محبط عندما... -->

## 💡 وصف الحل المطلوب
<!-- وصف واضح ومختصر لما تريد أن يحدث -->

## 🔄 البدائل المطروحة
<!-- وصف واضح ومختصر لأي حلول أو ميزات بديلة فكرت بها -->

## 📝 معلومات إضافية
<!-- أضف أي معلومات أخرى أو لقطات شاشة حول طلب الميزة هنا -->
EOF

# إضافة الملفات الجديدة
git add .github/
git commit -m "📝 Add GitHub templates and workflows"
git push

echo "✅ تم إعداد GitHub بنجاح!"
echo "🌐 Repository: https://github.com/$username/$repo_name"
echo "📋 Issues: https://github.com/$username/$repo_name/issues"
echo "🔧 Actions: https://github.com/$username/$repo_name/actions"
echo "📊 Insights: https://github.com/$username/$repo_name/pulse"
