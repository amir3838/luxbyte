#!/bin/bash

# ===============================
# LUXBYTE SUPABASE SETUP SCRIPT
# سكريبت إعداد Supabase لمنصة Luxbyte
# ===============================

echo "🚀 بدء إعداد Supabase لمنصة Luxbyte..."

# التحقق من تثبيت Supabase CLI
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI غير مثبت. يرجى تثبيته أولاً:"
    echo "npm install -g supabase"
    exit 1
fi

# التحقق من تسجيل الدخول
echo "🔐 التحقق من تسجيل الدخول في Supabase..."
if ! supabase status &> /dev/null; then
    echo "⚠️ لم يتم تسجيل الدخول. يرجى تسجيل الدخول:"
    echo "supabase login"
    exit 1
fi

# إنشاء مشروع جديد (اختياري)
echo "📁 إنشاء مشروع Supabase..."
read -p "هل تريد إنشاء مشروع جديد؟ (y/n): " create_new

if [ "$create_new" = "y" ]; then
    echo "إنشاء مشروع جديد..."
    supabase projects create luxbyte-platform --region us-east-1
    echo "✅ تم إنشاء المشروع. يرجى نسخ Project ID و API Key من لوحة التحكم"
    read -p "اضغط Enter بعد نسخ البيانات..."
fi

# ربط المشروع
echo "🔗 ربط المشروع..."
read -p "أدخل Project ID: " project_id
read -p "أدخل API Key: " api_key

# تحديث ملف .env
echo "📝 تحديث ملف .env..."
cat > .env << EOF
SUPABASE_URL=https://${project_id}.supabase.co
SUPABASE_ANON_KEY=${api_key}
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
EOF

# تشغيل SQL Schema
echo "🗄️ تشغيل SQL Schema..."
supabase db reset --linked

# رفع الملفات إلى Storage
echo "📦 رفع الملفات إلى Storage..."
supabase storage cp public/assets/images/shopeg_logo.webp supabase://public/shopeg_logo.webp
supabase storage cp public/assets/images/backgrounds/screen-1.png supabase://public/background.png

# إعداد RLS Policies
echo "🔒 إعداد سياسات الأمان..."
supabase db push

# اختبار الاتصال
echo "🧪 اختبار الاتصال..."
supabase db ping

echo "✅ تم إعداد Supabase بنجاح!"
echo "🌐 يمكنك الآن الوصول إلى لوحة التحكم: https://supabase.com/dashboard/project/${project_id}"
echo "📊 قاعدة البيانات جاهزة للاستخدام!"
