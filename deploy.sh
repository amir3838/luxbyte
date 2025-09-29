#!/bin/bash

# LUXBYTE FCM Deployment Script
# سكريبت نشر نظام الإشعارات - لوكس بايت

echo "🚀 بدء عملية النشر - LUXBYTE FCM Update"
echo "========================================"

# الألوان للرسائل
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# دالة طباعة رسائل ملونة
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

# التحقق من وجود الأدوات المطلوبة
check_dependencies() {
    print_status "التحقق من الأدوات المطلوبة..."
    
    if ! command -v git &> /dev/null; then
        print_error "Git غير مثبت"
        exit 1
    fi
    
    if ! command -v supabase &> /dev/null; then
        print_warning "Supabase CLI غير مثبت - سيتم تخطي نشر Migration"
    fi
    
    if ! command -v vercel &> /dev/null; then
        print_warning "Vercel CLI غير مثبت - سيتم تخطي نشر Vercel"
    fi
    
    print_success "تم التحقق من الأدوات"
}

# 1. نشر Migration في Supabase
deploy_supabase() {
    print_status "نشر Migration في Supabase..."
    
    if command -v supabase &> /dev/null; then
        # تسجيل الدخول
        print_status "تسجيل الدخول إلى Supabase..."
        supabase login
        
        # ربط المشروع
        print_status "ربط المشروع..."
        supabase link --project-ref qjsvgpvbtrcnbhcjdcci
        
        # نشر Migration
        print_status "نشر Migration..."
        supabase db push
        
        if [ $? -eq 0 ]; then
            print_success "تم نشر Migration بنجاح"
        else
            print_error "فشل في نشر Migration"
            return 1
        fi
    else
        print_warning "Supabase CLI غير متوفر - تخطي نشر Migration"
        print_warning "يرجى تشغيل الأوامر التالية يدوياً:"
        echo "  supabase login"
        echo "  supabase link --project-ref qjsvgpvbtrcnbhcjdcci"
        echo "  supabase db push"
    fi
}

# 2. نشر على GitHub
deploy_github() {
    print_status "نشر التحديثات على GitHub..."
    
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
    
    if [ $? -eq 0 ]; then
        print_success "تم رفع التحديثات إلى GitHub بنجاح"
        
        # إنشاء tag
        print_status "إنشاء tag للإصدار..."
        git tag -a v1.1.0 -m "إصدار 1.1.0 - نظام الإشعارات"
        git push origin v1.1.0
        
        if [ $? -eq 0 ]; then
            print_success "تم إنشاء tag v1.1.0 بنجاح"
        fi
    else
        print_error "فشل في رفع التحديثات إلى GitHub"
        return 1
    fi
}

# 3. نشر على Vercel
deploy_vercel() {
    print_status "نشر التحديثات على Vercel..."
    
    if command -v vercel &> /dev/null; then
        # تسجيل الدخول
        print_status "تسجيل الدخول إلى Vercel..."
        vercel login
        
        # ربط المشروع
        print_status "ربط المشروع..."
        vercel link
        
        # إضافة متغيرات البيئة
        print_warning "يرجى إضافة متغيرات البيئة التالية في Vercel Dashboard:"
        echo "  FIREBASE_ADMIN_SA_BASE64 = [Base64 encoded service account JSON]"
        echo "  FCM_VAPID_KEY = BJ3SXe0Nof9H4KJpvgG80LVUeDTNxdh0O2z3aOIzEzrFxd3bAn4ixhhouG7VV11zmK8giQ-UUGWeAP3JK8MpbXk"
        
        read -p "هل أضفت متغيرات البيئة؟ (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            # نشر التحديثات
            print_status "نشر التحديثات..."
            vercel --prod
            
            if [ $? -eq 0 ]; then
                print_success "تم نشر التحديثات على Vercel بنجاح"
            else
                print_error "فشل في نشر التحديثات على Vercel"
                return 1
            fi
        else
            print_warning "تم تخطي نشر Vercel - يرجى إضافة متغيرات البيئة أولاً"
        fi
    else
        print_warning "Vercel CLI غير متوفر - تخطي نشر Vercel"
        print_warning "يرجى تشغيل الأوامر التالية يدوياً:"
        echo "  vercel login"
        echo "  vercel link"
        echo "  vercel --prod"
    fi
}

# 4. اختبار النظام
test_system() {
    print_status "اختبار النظام..."
    
    # فحص الملفات المطلوبة
    if [ -f "firebase-messaging-sw.js" ]; then
        print_success "Service Worker موجود"
    else
        print_error "Service Worker مفقود"
    fi
    
    if [ -f "js/firebase-config.js" ]; then
        print_success "Firebase Config موجود"
    else
        print_error "Firebase Config مفقود"
    fi
    
    if [ -f "js/push-notifications.js" ]; then
        print_success "Push Notifications Manager موجود"
    else
        print_error "Push Notifications Manager مفقود"
    fi
    
    if [ -f "api/push/register.js" ]; then
        print_success "Register API موجود"
    else
        print_error "Register API مفقود"
    fi
    
    if [ -f "api/push/send.js" ]; then
        print_success "Send API موجود"
    else
        print_error "Send API مفقود"
    fi
}

# 5. عرض ملخص النشر
show_summary() {
    echo
    echo "========================================"
    print_success "تم إكمال عملية النشر!"
    echo "========================================"
    echo
    print_status "الخطوات التالية:"
    echo "1. اذهب إلى Firebase Console وأضف Service Account"
    echo "2. اذهب إلى Vercel Dashboard وأضف متغيرات البيئة"
    echo "3. اختبر الإشعارات في لوحة التحكم"
    echo
    print_status "روابط مفيدة:"
    echo "- Firebase Console: https://console.firebase.google.com/"
    echo "- Vercel Dashboard: https://vercel.com/dashboard"
    echo "- Supabase Dashboard: https://supabase.com/dashboard"
    echo
    print_status "لاختبار النظام:"
    echo "1. ادخل إلى لوحة التحكم"
    echo "2. اضغط 'تفعيل الإشعارات'"
    echo "3. اضغط 'إرسال إشعار تجريبي'"
    echo
}

# تشغيل العملية
main() {
    echo "بدء عملية النشر..."
    echo
    
    check_dependencies
    echo
    
    deploy_supabase
    echo
    
    deploy_github
    echo
    
    deploy_vercel
    echo
    
    test_system
    echo
    
    show_summary
}

# تشغيل السكريبت
main "$@"