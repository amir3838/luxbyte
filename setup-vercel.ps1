# ===============================
# LUXBYTE VERCEL SETUP - PowerShell
# إعداد Vercel لمنصة Luxbyte
# ===============================

Write-Host "🚀 بدء إعداد Vercel لمنصة Luxbyte..." -ForegroundColor Green

# التحقق من وجود ملف .env
if (Test-Path ".env") {
    Write-Host "✅ ملف .env موجود" -ForegroundColor Green
} else {
    Write-Host "⚠️ ملف .env غير موجود. يرجى إنشاؤه من .env.example" -ForegroundColor Yellow
    Write-Host "نسخ .env.example إلى .env..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env" -ErrorAction SilentlyContinue
}

# التحقق من وجود ملف vercel.json
if (Test-Path "vercel.json") {
    Write-Host "✅ ملف vercel.json موجود" -ForegroundColor Green
} else {
    Write-Host "❌ ملف vercel.json غير موجود" -ForegroundColor Red
    exit 1
}

# التحقق من وجود ملف package.json
if (Test-Path "package.json") {
    Write-Host "✅ ملف package.json موجود" -ForegroundColor Green
} else {
    Write-Host "❌ ملف package.json غير موجود" -ForegroundColor Red
    exit 1
}

# تسجيل الدخول إلى Vercel
Write-Host "`n🔐 تسجيل الدخول إلى Vercel..." -ForegroundColor Yellow
Write-Host "يرجى الضغط على Enter لفتح المتصفح وتسجيل الدخول..." -ForegroundColor White
Read-Host

try {
    npx vercel login
    Write-Host "✅ تم تسجيل الدخول إلى Vercel بنجاح" -ForegroundColor Green
} catch {
    Write-Host "❌ فشل في تسجيل الدخول إلى Vercel" -ForegroundColor Red
    Write-Host "يرجى المحاولة مرة أخرى أو تسجيل الدخول يدوياً" -ForegroundColor Yellow
}

# إنشاء مشروع Vercel
Write-Host "`n📁 إنشاء مشروع Vercel..." -ForegroundColor Yellow
try {
    npx vercel --yes
    Write-Host "✅ تم إنشاء مشروع Vercel بنجاح" -ForegroundColor Green
} catch {
    Write-Host "❌ فشل في إنشاء مشروع Vercel" -ForegroundColor Red
    Write-Host "يرجى المحاولة مرة أخرى" -ForegroundColor Yellow
}

# إضافة متغيرات البيئة
Write-Host "`n🔧 إضافة متغيرات البيئة..." -ForegroundColor Yellow
if (Test-Path ".env") {
    $envContent = Get-Content ".env" -Raw
    $lines = $envContent -split "`n"
    
    foreach ($line in $lines) {
        if ($line -match "^([^#][^=]+)=(.*)$") {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim()
            
            if ($key -and $value -and $value -ne "your-project.supabase.co" -and $value -ne "your-anon-key") {
                Write-Host "إضافة متغير البيئة: $key" -ForegroundColor Cyan
                try {
                    npx vercel env add $key production <<< $value
                    npx vercel env add $key development <<< $value
                    Write-Host "✅ تم إضافة $key" -ForegroundColor Green
                } catch {
                    Write-Host "⚠️ فشل في إضافة $key" -ForegroundColor Yellow
                }
            }
        }
    }
}

# النشر
Write-Host "`n🚀 نشر المشروع على Vercel..." -ForegroundColor Yellow
try {
    npx vercel --prod
    Write-Host "✅ تم نشر المشروع بنجاح" -ForegroundColor Green
} catch {
    Write-Host "❌ فشل في نشر المشروع" -ForegroundColor Red
    Write-Host "يرجى المحاولة مرة أخرى" -ForegroundColor Yellow
}

# عرض النتائج
Write-Host "`n📊 النتائج:" -ForegroundColor Magenta
Write-Host "🌐 الموقع متاح على: https://luxbyte.vercel.app" -ForegroundColor Green
Write-Host "📊 لوحة التحكم: https://vercel.com/dashboard" -ForegroundColor Green
Write-Host "🔧 إعدادات المشروع: https://vercel.com/dashboard/project/luxbyte-platform" -ForegroundColor Green

Write-Host "`n✨ تم إعداد Vercel بنجاح!" -ForegroundColor Green
