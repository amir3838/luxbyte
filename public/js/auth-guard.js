// ===============================
// AUTH GUARD - حارس المصادقة
// ===============================

import { supabase } from './supabase-client.js';

class AuthGuard {
    constructor() {
        this.currentUser = null;
        this.isAuthenticated = false;
        this.userRole = null;
    }

    // تهيئة حارس المصادقة
    async init() {
        try {
            // التحقق من الجلسة الحالية
            const { data: { session }, error } = await supabase.auth.getSession();

            if (error) {
                console.error('خطأ في جلب الجلسة:', error);
                return false;
            }

            if (session?.user) {
                this.currentUser = session.user;
                this.isAuthenticated = true;

                // جلب دور المستخدم
                await this.getUserRole();
                return true;
            }

            return false;
        } catch (error) {
            console.error('خطأ في تهيئة حارس المصادقة:', error);
            return false;
        }
    }

    // جلب دور المستخدم
    async getUserRole() {
        try {
            if (!this.currentUser) return null;

            const { data, error } = await supabase
                .from('profiles')
                .select('account')
                .eq('id', this.currentUser.id)
                .single();

            if (error) {
                console.error('خطأ في جلب دور المستخدم:', error);
                return null;
            }

            this.userRole = data?.account || null;
            return this.userRole;
        } catch (error) {
            console.error('خطأ في جلب دور المستخدم:', error);
            return null;
        }
    }

    // التحقق من المصادقة
    isAuth() {
        return this.isAuthenticated && this.currentUser !== null;
    }

    // التحقق من الدور
    hasRole(role) {
        return this.userRole === role;
    }

    // التحقق من الأدوار المتعددة
    hasAnyRole(roles) {
        return roles.includes(this.userRole);
    }

    // إعادة توجيه المستخدم غير المصادق
    redirectToLogin() {
        // حفظ الصفحة الحالية للعودة إليها بعد تسجيل الدخول
        const currentPath = window.location.pathname + window.location.search;
        localStorage.setItem('redirectAfterLogin', currentPath);

        // التوجيه إلى صفحة تسجيل الدخول
        window.location.href = '/auth.html';
    }

    // إعادة توجيه المستخدم المصادق إلى الداشبورد المناسب
    redirectToDashboard() {
        if (!this.userRole) {
            // إذا لم يكن لديه دور، يوجه إلى الصفحة الرئيسية
            window.location.href = '/';
            return;
        }

        // التوجيه إلى الداشبورد المناسب
        const dashboardMap = {
            'pharmacy': '/dashboard/pharmacy.html',
            'restaurant': '/dashboard/restaurant.html',
            'supermarket': '/dashboard/supermarket.html',
            'clinic': '/dashboard/clinic.html',
            'courier': '/dashboard/courier.html',
            'driver': '/dashboard/driver.html',
            'admin': '/dashboard/admin.html'
        };

        const dashboardUrl = dashboardMap[this.userRole];
        if (dashboardUrl) {
            window.location.href = dashboardUrl;
        } else {
            // دور غير معروف، يوجه إلى الصفحة الرئيسية
            window.location.href = '/';
        }
    }

    // تسجيل الخروج
    async logout() {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) {
                console.error('خطأ في تسجيل الخروج:', error);
                return false;
            }

            // مسح البيانات المحلية
            this.currentUser = null;
            this.isAuthenticated = false;
            this.userRole = null;

            // مسح التخزين المحلي
            localStorage.removeItem('selectedRole');
            localStorage.removeItem('redirectAfterLogin');

            return true;
        } catch (error) {
            console.error('خطأ في تسجيل الخروج:', error);
            return false;
        }
    }

    // حماية الصفحة (يجب استدعاؤها في بداية كل صفحة محمية)
    async protectPage(requiredRole = null) {
        const isAuth = await this.init();

        if (!isAuth) {
            this.redirectToLogin();
            return false;
        }

        // إذا كان مطلوب دور معين
        if (requiredRole && !this.hasRole(requiredRole)) {
            // إذا لم يكن لديه الدور المطلوب، يوجه إلى الداشبورد المناسب له
            this.redirectToDashboard();
            return false;
        }

        return true;
    }

    // حماية صفحة اختيار الدور (يجب أن يكون مصادقاً)
    async protectRoleSelection() {
        const isAuth = await this.init();

        if (!isAuth) {
            this.redirectToLogin();
            return false;
        }

        // إذا كان لديه دور بالفعل، يوجه إلى الداشبورد المناسب
        if (this.userRole) {
            this.redirectToDashboard();
            return false;
        }

        return true;
    }

    // حماية صفحة تسجيل الدخول (يجب ألا يكون مصادقاً)
    async protectAuthPage() {
        const isAuth = await this.init();

        if (isAuth) {
            // إذا كان مصادقاً بالفعل، يوجه إلى الداشبورد المناسب
            this.redirectToDashboard();
            return false;
        }

        return true;
    }

    // جلب معلومات المستخدم
    getUserInfo() {
        return {
            user: this.currentUser,
            isAuthenticated: this.isAuthenticated,
            role: this.userRole
        };
    }
}

// إنشاء مثيل واحد من حارس المصادقة
const authGuard = new AuthGuard();

// تصدير حارس المصادقة
export default authGuard;

// جعل حارس المصادقة متاحاً عالمياً
window.authGuard = authGuard;
