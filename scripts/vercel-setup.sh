#!/bin/bash

# ===============================
# LUXBYTE VERCEL SETUP SCRIPT
# سكريبت إعداد Vercel لمنصة Luxbyte
# ===============================

echo "🚀 بدء إعداد Vercel لمنصة Luxbyte..."

# التحقق من تثبيت Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI غير مثبت. يرجى تثبيته أولاً:"
    echo "npm install -g vercel"
    exit 1
fi

# التحقق من تسجيل الدخول
echo "🔐 التحقق من تسجيل الدخول في Vercel..."
if ! vercel whoami &> /dev/null; then
    echo "⚠️ لم يتم تسجيل الدخول. يرجى تسجيل الدخول:"
    vercel login
fi

# إنشاء ملف vercel.json
echo "📝 إنشاء ملف vercel.json..."
cat > vercel.json << EOF
{
  "version": 2,
  "name": "luxbyte-platform",
  "builds": [
    {
      "src": "public/**/*",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/public/$1"
    }
  ],
  "env": {
    "SUPABASE_URL": "@supabase_url",
    "SUPABASE_ANON_KEY": "@supabase_anon_key"
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/",
      "destination": "/public/index.html"
    }
  ]
}
EOF

# إنشاء ملف .vercelignore
echo "📝 إنشاء ملف .vercelignore..."
cat > .vercelignore << EOF
node_modules
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.git
.gitignore
README.md
supabase-schema.sql
supabase-setup.sh
github-setup.sh
vercel-setup.sh
test-comprehensive.html
test-integration.html
EOF

# إعداد متغيرات البيئة
echo "🔧 إعداد متغيرات البيئة..."
read -p "أدخل SUPABASE_URL: " supabase_url
read -p "أدخل SUPABASE_ANON_KEY: " supabase_anon_key

# إضافة متغيرات البيئة إلى Vercel
vercel env add SUPABASE_URL production <<< "$supabase_url"
vercel env add SUPABASE_ANON_KEY production <<< "$supabase_anon_key"

# إضافة متغيرات البيئة للتطوير
vercel env add SUPABASE_URL development <<< "$supabase_url"
vercel env add SUPABASE_ANON_KEY development <<< "$supabase_anon_key"

# إنشاء ملف package.json للتطوير
echo "📦 إنشاء package.json..."
cat > package.json << EOF
{
  "name": "luxbyte-platform",
  "version": "1.0.0",
  "description": "Luxbyte - منصة الأعمال الذكية",
  "main": "public/index.html",
  "scripts": {
    "dev": "vercel dev",
    "build": "echo 'No build step required for static site'",
    "start": "vercel dev",
    "deploy": "vercel --prod",
    "preview": "vercel"
  },
  "keywords": [
    "business",
    "dashboard",
    "pharmacy",
    "restaurant",
    "supermarket",
    "clinic",
    "courier",
    "driver",
    "arabic",
    "egypt"
  ],
  "author": "Luxbyte LLC",
  "license": "MIT",
  "dependencies": {
    "@supabase/supabase-js": "^2.38.0"
  },
  "devDependencies": {
    "vercel": "^32.0.0"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
EOF

# إنشاء ملف next.config.js (للتوافق)
echo "⚙️ إنشاء ملف next.config.js..."
cat > next.config.js << EOF
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
EOF

# إنشاء ملف .env.example
echo "📝 إنشاء ملف .env.example..."
cat > .env.example << EOF
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
EOF

# إنشاء ملف README.md
echo "📚 إنشاء ملف README.md..."
cat > README.md << EOF
# Luxbyte - منصة الأعمال الذكية

منصة شاملة لإدارة الأعمال التجارية المختلفة في مصر، تشمل الصيدليات، المطاعم، السوبر ماركت، العيادات، خدمات التوصيل والنقل.

## 🚀 النشر السريع

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/luxbyte)

## 📋 المتطلبات

- Node.js 18+
- حساب Supabase
- حساب Vercel

## 🛠️ التثبيت

\`\`\`bash
# استنساخ المشروع
git clone https://github.com/your-username/luxbyte.git
cd luxbyte

# تثبيت التبعيات
npm install

# إعداد متغيرات البيئة
cp .env.example .env
# قم بتعديل .env بالقيم الصحيحة

# تشغيل المشروع محلياً
npm run dev
\`\`\`

## 🌐 النشر

\`\`\`bash
# النشر على Vercel
npm run deploy
\`\`\`

## 📊 المميزات

- ✅ داشبوردات متخصصة لكل نوع من الأعمال
- ✅ إدارة المستندات والملفات
- ✅ تقارير مفصلة وإحصائيات
- ✅ نظام مصادقة آمن مع Supabase
- ✅ واجهة عربية سهلة الاستخدام
- ✅ تصميم متجاوب يعمل على جميع الأجهزة

## 🏢 أنواع الحسابات المدعومة

1. **صيدلية** - إدارة الأدوية والمخزون
2. **مطعم** - إدارة القائمة والطلبات
3. **سوبر ماركت** - إدارة المنتجات والمخزون
4. **عيادة** - إدارة المرضى والمواعيد
5. **مندوب توصيل** - إدارة التوصيلات
6. **سائق** - إدارة الرحلات

## 🛠️ التقنيات المستخدمة

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Deployment**: Vercel
- **Icons**: Font Awesome
- **Charts**: Chart.js

## 📞 الدعم

- **البريد الإلكتروني**: support@luxbyte.com
- **الموقع**: https://luxbyte.com
- **فيسبوك**: https://www.facebook.com/share/19zx6VUm7M/
- **إنستجرام**: https://www.instagram.com/luxbyte_llc1
- **تيك توك**: https://www.tiktok.com/@luxpyte.llc
- **واتساب**: +201148709609

## 📄 الترخيص

هذا المشروع مرخص تحت رخصة MIT - انظر ملف [LICENSE](LICENSE) للتفاصيل.

---

تم تطوير هذا المشروع بواسطة **Luxbyte LLC** - شركة لوكس بايت المحدودة المسئولية
EOF

# إنشاء ملف LICENSE
echo "📄 إنشاء ملف LICENSE..."
cat > LICENSE << EOF
MIT License

Copyright (c) 2024 Luxbyte LLC

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
EOF

# إضافة الملفات إلى Git
echo "💾 إضافة الملفات إلى Git..."
git add .
git commit -m "🚀 Add Vercel configuration and deployment files

✨ Added:
- vercel.json configuration
- .vercelignore
- package.json with scripts
- next.config.js for compatibility
- .env.example template
- README.md documentation
- MIT License

🔧 Ready for Vercel deployment!"

# رفع التغييرات
echo "⬆️ رفع التغييرات إلى GitHub..."
git push

# النشر على Vercel
echo "🚀 النشر على Vercel..."
vercel --prod

# الحصول على رابط النشر
echo "🌐 الحصول على رابط النشر..."
vercel ls

echo "✅ تم إعداد Vercel بنجاح!"
echo "🌐 الموقع متاح على: https://luxbyte.vercel.app"
echo "📊 لوحة التحكم: https://vercel.com/dashboard"
echo "🔧 إعدادات المشروع: https://vercel.com/dashboard/project/luxbyte-platform"
