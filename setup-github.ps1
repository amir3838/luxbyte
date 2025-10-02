# ===============================
# LUXBYTE GITHUB SETUP - PowerShell
# إعداد GitHub لمنصة Luxbyte
# ===============================

Write-Host "🐙 بدء إعداد GitHub لمنصة Luxbyte..." -ForegroundColor Green

# التحقق من وجود Git repository
if (Test-Path ".git") {
    Write-Host "✅ Git repository موجود" -ForegroundColor Green
} else {
    Write-Host "❌ Git repository غير موجود. يرجى تشغيل git init أولاً" -ForegroundColor Red
    exit 1
}

# تسجيل الدخول إلى GitHub
Write-Host "`n🔐 تسجيل الدخول إلى GitHub..." -ForegroundColor Yellow
Write-Host "يرجى الضغط على Enter لفتح المتصفح وتسجيل الدخول..." -ForegroundColor White
Read-Host

try {
    npx gh auth login
    Write-Host "✅ تم تسجيل الدخول إلى GitHub بنجاح" -ForegroundColor Green
} catch {
    Write-Host "❌ فشل في تسجيل الدخول إلى GitHub" -ForegroundColor Red
    Write-Host "يرجى المحاولة مرة أخرى أو تسجيل الدخول يدوياً" -ForegroundColor Yellow
}

# إنشاء repository
Write-Host "`n📁 إنشاء repository جديد..." -ForegroundColor Yellow
$repoName = Read-Host "أدخل اسم المستخدم/المنظمة"
$projectName = Read-Host "أدخل اسم المشروع (افتراضي: luxbyte)"

if ([string]::IsNullOrEmpty($projectName)) {
    $projectName = "luxbyte"
}

try {
    npx gh repo create "$repoName/$projectName" --public --description "Luxbyte - منصة الأعمال الذكية | Smart Business Platform" --clone
    Write-Host "✅ تم إنشاء repository بنجاح" -ForegroundColor Green
} catch {
    Write-Host "❌ فشل في إنشاء repository" -ForegroundColor Red
    Write-Host "يرجى المحاولة مرة أخرى أو إنشاء repository يدوياً" -ForegroundColor Yellow
}

# إضافة remote origin
Write-Host "`n🔗 إضافة remote origin..." -ForegroundColor Yellow
try {
    git remote add origin "https://github.com/$repoName/$projectName.git"
    Write-Host "✅ تم إضافة remote origin" -ForegroundColor Green
} catch {
    Write-Host "⚠️ remote origin موجود بالفعل أو فشل في الإضافة" -ForegroundColor Yellow
}

# إضافة الملفات
Write-Host "`n📝 إضافة الملفات إلى Git..." -ForegroundColor Yellow
git add .

# إنشاء commit
Write-Host "`n💾 إنشاء commit..." -ForegroundColor Yellow
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
Write-Host "`n⬆️ رفع التغييرات إلى GitHub..." -ForegroundColor Yellow
try {
    git push -u origin main
    Write-Host "✅ تم رفع التغييرات بنجاح" -ForegroundColor Green
} catch {
    Write-Host "❌ فشل في رفع التغييرات" -ForegroundColor Red
    Write-Host "يرجى المحاولة مرة أخرى" -ForegroundColor Yellow
}

# إنشاء Issues
Write-Host "`n📋 إنشاء Issues للمهام..." -ForegroundColor Yellow
try {
    npx gh issue create --title "🔧 Setup Supabase Database" --body "تكوين قاعدة بيانات Supabase وتشغيل SQL schema" --label "setup,database"
    npx gh issue create --title "🚀 Deploy to Vercel" --body "نشر المشروع على Vercel وتكوين البيئة" --label "deployment,vercel"
    npx gh issue create --title "🧪 Test All Features" --body "اختبار جميع الوظائف والتأكد من عملها" --label "testing,qa"
    npx gh issue create --title "📱 Mobile Optimization" --body "تحسين التصميم للهواتف المحمولة" --label "mobile,ui"
    npx gh issue create --title "🌐 SEO Optimization" --body "تحسين محركات البحث" --label "seo,optimization"
    Write-Host "✅ تم إنشاء Issues بنجاح" -ForegroundColor Green
} catch {
    Write-Host "⚠️ فشل في إنشاء بعض Issues" -ForegroundColor Yellow
}

# عرض النتائج
Write-Host "`n📊 النتائج:" -ForegroundColor Magenta
Write-Host "🌐 Repository: https://github.com/$repoName/$projectName" -ForegroundColor Green
Write-Host "📋 Issues: https://github.com/$repoName/$projectName/issues" -ForegroundColor Green
Write-Host "🔧 Actions: https://github.com/$repoName/$projectName/actions" -ForegroundColor Green
Write-Host "📊 Insights: https://github.com/$repoName/$projectName/pulse" -ForegroundColor Green

Write-Host "`n✨ تم إعداد GitHub بنجاح!" -ForegroundColor Green
