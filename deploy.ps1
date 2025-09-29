# LUXBYTE FCM Deployment Script - PowerShell
# سكريبت نشر نظام الإشعارات - لوكس بايت

Write-Host "🚀 بدء عملية النشر - LUXBYTE FCM Update" -ForegroundColor Blue
Write-Host "========================================" -ForegroundColor Blue
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

# التحقق من وجود Git
Write-Status "التحقق من الأدوات المطلوبة..."
try {
    git --version | Out-Null
    Write-Success "Git متوفر"
}
catch {
    Write-Error "Git غير مثبت"
    exit 1
}

# 1. نشر على GitHub
Write-Status "نشر التحديثات على GitHub..."

try {
    # إضافة الملفات
    git add .

    # إنشاء commit
    git commit -m "feat: إضافة نظام Firebase Cloud Messaging للإشعارات

- إضافة جدول push_tokens في Supabase
- إعداد Firebase configuration و Service Worker
- إنشاء API endpoints للإشعارات
- إضافة واجهة تفعيل الإشعارات في لوحة التحكم
- دعم إشعارات Web Push مع أمان عالي
- تحديث VAPID Key من Firebase Console"

    # رفع التحديثات
    git push origin main

    Write-Success "تم رفع التحديثات إلى GitHub بنجاح"

    # إنشاء tag
    Write-Status "إنشاء tag للإصدار..."
    git tag -a v1.1.0 -m "إصدار 1.1.0 - نظام الإشعارات"
    git push origin v1.1.0

    Write-Success "تم إنشاء tag v1.1.0 بنجاح"

}
catch {
    Write-Error "فشل في رفع التحديثات إلى GitHub: $_"
    exit 1
}

# 2. فحص الملفات المطلوبة
Write-Status "فحص الملفات المطلوبة..."

$files = @(
    "firebase-messaging-sw.js",
    "js/firebase-config.js",
    "js/push-notifications.js",
    "api/push/register.js",
    "api/push/send.js",
    "supabase/migrations/003_create_push_tokens_table.sql"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Success "$file موجود"
    }
    else {
        Write-Error "$file مفقود"
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Success "تم إكمال عملية النشر!"
Write-Host "========================================" -ForegroundColor Green
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

Write-Host "3. اذهب إلى Firebase Console وأضف Service Account" -ForegroundColor White
Write-Host ""

Write-Host "4. اختبر الإشعارات في لوحة التحكم" -ForegroundColor White
Write-Host ""

Write-Status "روابط مفيدة:"
Write-Host "- Firebase Console: https://console.firebase.google.com/" -ForegroundColor Cyan
Write-Host "- Vercel Dashboard: https://vercel.com/dashboard" -ForegroundColor Cyan
Write-Host "- Supabase Dashboard: https://supabase.com/dashboard" -ForegroundColor Cyan
Write-Host ""

Write-Status "لاختبار النظام:"
Write-Host "1. ادخل إلى لوحة التحكم" -ForegroundColor White
Write-Host "2. اضغط 'تفعيل الإشعارات'" -ForegroundColor White
Write-Host "3. اضغط 'إرسال إشعار تجريبي'" -ForegroundColor White
Write-Host ""

Read-Host "اضغط Enter للمتابعة"
