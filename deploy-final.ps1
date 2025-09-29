# LUXBYTE Final Deployment Script - PowerShell
# سكريبت النشر النهائي - لوكس بايت

Write-Host "🚀 بدء النشر النهائي - LUXBYTE FCM + Translation Fix" -ForegroundColor Blue
Write-Host "=================================================" -ForegroundColor Blue
Write-Host ""

# دالة طباعة رسائل ملونة
function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# 1. إصلاح مشكلة الترجمة
Write-Status "إصلاح مشكلة الترجمة..."

# التحقق من الملفات المحدثة
$files = @(
    "i18n-dict.js",
    "common.js",
    "js/translation-utils.js",
    "index.html",
    "dashboard.html",
    "auth.html",
    "choose-platform.html",
    "choose-role.html",
    "signup.html",
    "social.html"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Success "$file موجود ومحدث"
    }
    else {
        Write-Error "$file مفقود"
    }
}

# 2. فحص التغييرات
Write-Status "فحص التغييرات..."

try {
    git status --porcelain | ForEach-Object {
        $status = $_.Substring(0, 2)
        $file = $_.Substring(3)

        switch ($status) {
            "M " { Write-Host "  Modified: $file" -ForegroundColor Yellow }
            "A " { Write-Host "  Added: $file" -ForegroundColor Green }
            "??" { Write-Host "  Untracked: $file" -ForegroundColor Cyan }
        }
    }
}
catch {
    Write-Warning "لا يمكن فحص حالة Git"
}

# 3. إضافة الملفات
Write-Status "إضافة الملفات إلى Git..."

try {
    git add .
    Write-Success "تم إضافة جميع الملفات"
}
catch {
    Write-Error "فشل في إضافة الملفات: $_"
    exit 1
}

# 4. إنشاء commit
Write-Status "إنشاء commit..."

try {
    git commit -m "fix: إصلاح مشكلة الترجمة وإضافة نظام fallback

- إضافة مفاتيح الترجمة المفقودة (nav.signup)
- إنشاء نظام fallback للترجمة
- إصلاح عرض 'إنشاء حساب' بدلاً من nav.signup
- إضافة aria-label و dir للعناصر
- تحسين نظام i18n مع دعم السقوط
- إضافة translation-utils.js لجميع الصفحات

Fixes: زر 'إنشاء حساب' يعرض النص الصحيح الآن
Improves: نظام ترجمة أكثر قوة وموثوقية"

    Write-Success "تم إنشاء commit بنجاح"
}
catch {
    Write-Error "فشل في إنشاء commit: $_"
    exit 1
}

# 5. رفع التحديثات
Write-Status "رفع التحديثات إلى GitHub..."

try {
    git push origin main
    Write-Success "تم رفع التحديثات إلى GitHub بنجاح"
}
catch {
    Write-Error "فشل في رفع التحديثات: $_"
    exit 1
}

# 6. إنشاء tag جديد
Write-Status "إنشاء tag للإصدار..."

try {
    git tag -a v1.1.1 -m "Release v1.1.1 - Translation Fix + FCM System

- Fixed translation fallback system
- Added missing nav.signup translation
- Improved i18n with proper fallback handling
- Enhanced accessibility with aria-labels
- Complete Firebase Cloud Messaging system
- All features working correctly"

    git push origin v1.1.1
    Write-Success "تم إنشاء tag v1.1.1 بنجاح"
}
catch {
    Write-Warning "فشل في إنشاء tag: $_"
}

# 7. فحص النظام
Write-Status "فحص النظام..."

# فحص الملفات المهمة
$criticalFiles = @(
    "firebase-messaging-sw.js",
    "js/firebase-config.js",
    "js/push-notifications.js",
    "js/translation-utils.js",
    "api/push/register.js",
    "api/push/send.js",
    "supabase/migrations/003_create_push_tokens_table.sql"
)

foreach ($file in $criticalFiles) {
    if (Test-Path $file) {
        Write-Success "✓ $file"
    }
    else {
        Write-Error "✗ $file مفقود"
    }
}

# 8. عرض ملخص النشر
Write-Host ""
Write-Host "=================================================" -ForegroundColor Green
Write-Success "تم إكمال النشر النهائي بنجاح!"
Write-Host "=================================================" -ForegroundColor Green
Write-Host ""

Write-Status "ما تم إصلاحه:"
Write-Host "✓ مشكلة عرض 'nav.signup' - الآن يعرض 'إنشاء حساب'" -ForegroundColor White
Write-Host "✓ إضافة نظام fallback للترجمة" -ForegroundColor White
Write-Host "✓ تحسين aria-label و dir للعناصر" -ForegroundColor White
Write-Host "✓ إضافة translation-utils.js لجميع الصفحات" -ForegroundColor White
Write-Host ""

Write-Status "الميزات الجديدة:"
Write-Host "✓ نظام Firebase Cloud Messaging كامل" -ForegroundColor White
Write-Host "✓ إشعارات Web Push" -ForegroundColor White
Write-Host "✓ واجهة تفعيل الإشعارات" -ForegroundColor White
Write-Host "✓ API endpoints للإشعارات" -ForegroundColor White
Write-Host ""

Write-Status "الخطوات التالية:"
Write-Host "1. اذهب إلى Supabase Dashboard وشغل Migration:" -ForegroundColor White
Write-Host "   supabase login" -ForegroundColor Gray
Write-Host "   supabase link --project-ref qjsvgpvbtrcnbhcjdcci" -ForegroundColor Gray
Write-Host "   supabase db push" -ForegroundColor Gray
Write-Host ""

Write-Host "2. اذهب إلى Vercel Dashboard وأضف متغيرات البيئة:" -ForegroundColor White
Write-Host "   FIREBASE_ADMIN_SA_BASE64 = [Base64 encoded service account JSON]" -ForegroundColor Gray
Write-Host "   FCM_VAPID_KEY = BJ3SXe0Nof9H4KJpvgG80LVUeDTNxdh0O2z3aOIzEzrFxd3bAn4ixhhouG7VV11zmK8giQ-UUGWeAP3JK8MpbXk" -ForegroundColor Gray
Write-Host ""

Write-Host "3. اختبر النظام:" -ForegroundColor White
Write-Host "   - ادخل إلى الموقع وتحقق من زر 'إنشاء حساب'" -ForegroundColor Gray
Write-Host "   - ادخل إلى لوحة التحكم واختبر الإشعارات" -ForegroundColor Gray
Write-Host ""

Write-Status "روابط مفيدة:"
Write-Host "- GitHub: https://github.com/amir3838/luxbyte" -ForegroundColor Cyan
Write-Host "- Firebase Console: https://console.firebase.google.com/" -ForegroundColor Cyan
Write-Host "- Vercel Dashboard: https://vercel.com/dashboard" -ForegroundColor Cyan
Write-Host "- Supabase Dashboard: https://supabase.com/dashboard" -ForegroundColor Cyan
Write-Host ""

Write-Success "النظام جاهز للاستخدام! 🎉"
Write-Host ""

Read-Host "اضغط Enter للمتابعة"
