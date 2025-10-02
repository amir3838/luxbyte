# ===============================
# LUXBYTE SUPABASE SETUP - PowerShell
# إعداد Supabase لمنصة Luxbyte
# ===============================

Write-Host "🚀 بدء إعداد Supabase لمنصة Luxbyte..." -ForegroundColor Green

# التحقق من وجود ملف SQL schema
if (Test-Path "supabase-schema.sql") {
    Write-Host "✅ ملف supabase-schema.sql موجود" -ForegroundColor Green
    
    # عرض تعليمات إعداد Supabase
    Write-Host "`n📋 تعليمات إعداد Supabase:" -ForegroundColor Yellow
    Write-Host "1. اذهب إلى https://supabase.com" -ForegroundColor White
    Write-Host "2. أنشئ مشروع جديد" -ForegroundColor White
    Write-Host "3. احصل على Project URL و Anon Key" -ForegroundColor White
    Write-Host "4. اذهب إلى SQL Editor" -ForegroundColor White
    Write-Host "5. انسخ محتوى ملف supabase-schema.sql" -ForegroundColor White
    Write-Host "6. شغل الكود في SQL Editor" -ForegroundColor White
    
    # قراءة محتوى ملف SQL
    $sqlContent = Get-Content "supabase-schema.sql" -Raw
    Write-Host "`n📄 محتوى SQL Schema:" -ForegroundColor Cyan
    Write-Host "=================================" -ForegroundColor Gray
    Write-Host $sqlContent.Substring(0, [Math]::Min(500, $sqlContent.Length)) -ForegroundColor White
    if ($sqlContent.Length -gt 500) {
        Write-Host "... (المحتوى مقطوع للعرض)" -ForegroundColor Gray
    }
    Write-Host "=================================" -ForegroundColor Gray
    
    # إنشاء ملف .env.example
    Write-Host "`n📝 إنشاء ملف .env.example..." -ForegroundColor Yellow
    $envContent = @"
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key

# Vercel Configuration
VERCEL_URL=https://luxbyte.vercel.app

# Authentication Callback URLs
EMAIL_CONFIRMATION_URL=https://luxbyte.vercel.app/email-confirmation.html
PASSWORD_RESET_URL=https://luxbyte.vercel.app/reset-password.html
LOGIN_SUCCESS_URL=https://luxbyte.vercel.app/auth-success.html
COMPLETE_REGISTRATION_URL=https://luxbyte.vercel.app/complete-registration.html
"@
    
    Set-Content -Path ".env.example" -Value $envContent
    Write-Host "✅ تم إنشاء ملف .env.example" -ForegroundColor Green
    
    Write-Host "`n🎯 الخطوات التالية:" -ForegroundColor Magenta
    Write-Host "1. قم بإعداد Supabase كما هو موضح أعلاه" -ForegroundColor White
    Write-Host "2. انسخ .env.example إلى .env" -ForegroundColor White
    Write-Host "3. أضف قيم Supabase الصحيحة في .env" -ForegroundColor White
    Write-Host "4. شغل setup-vercel.ps1 للنشر على Vercel" -ForegroundColor White
    
} else {
    Write-Host "❌ ملف supabase-schema.sql غير موجود" -ForegroundColor Red
}

Write-Host "`n✨ تم إعداد Supabase!" -ForegroundColor Green
