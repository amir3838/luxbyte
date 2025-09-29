@echo off
chcp 65001 >nul
echo 🚀 بدء عملية النشر - LUXBYTE FCM Update
echo ========================================
echo.

REM التحقق من Git
where git >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Git غير مثبت
    pause
    exit /b 1
)

REM 1. نشر على GitHub
echo [INFO] نشر التحديثات على GitHub...
git add .
git commit -m "feat: إضافة نظام Firebase Cloud Messaging للإشعارات

- إضافة جدول push_tokens في Supabase
- إعداد Firebase configuration و Service Worker
- إنشاء API endpoints للإشعارات
- إضافة واجهة تفعيل الإشعارات في لوحة التحكم
- دعم إشعارات Web Push مع أمان عالي
- تحديث VAPID Key من Firebase Console"

git push origin main
if %errorlevel% neq 0 (
    echo [ERROR] فشل في رفع التحديثات إلى GitHub
    pause
    exit /b 1
)

echo [SUCCESS] تم رفع التحديثات إلى GitHub بنجاح

REM إنشاء tag
echo [INFO] إنشاء tag للإصدار...
git tag -a v1.1.0 -m "إصدار 1.1.0 - نظام الإشعارات"
git push origin v1.1.0

echo.
echo ========================================
echo [SUCCESS] تم إكمال عملية النشر!
echo ========================================
echo.
echo [INFO] الخطوات التالية:
echo 1. اذهب إلى Supabase Dashboard وشغل Migration:
echo    supabase login
echo    supabase link --project-ref qjsvgpvbtrcnbhcjdcci
echo    supabase db push
echo.
echo 2. اذهب إلى Vercel Dashboard وأضف متغيرات البيئة:
echo    FIREBASE_ADMIN_SA_BASE64 = [Base64 encoded service account JSON]
echo    FCM_VAPID_KEY = BJ3SXe0Nof9H4KJpvgG80LVUeDTNxdh0O2z3aOIzEzrFxd3bAn4ixhhouG7VV11zmK8giQ-UUGWeAP3JK8MpbXk
echo.
echo 3. اذهب إلى Firebase Console وأضف Service Account
echo.
echo 4. اختبر الإشعارات في لوحة التحكم
echo.
echo روابط مفيدة:
echo - Firebase Console: https://console.firebase.google.com/
echo - Vercel Dashboard: https://vercel.com/dashboard
echo - Supabase Dashboard: https://supabase.com/dashboard
echo.
pause
