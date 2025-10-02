/**
 * إعدادات المصادقة ومسارات الكول باك
 * Authentication Configuration and Callback URLs
 */

/**
 * مسارات الكول باك للمصادقة
 * Authentication Callback URLs
 */
function getBaseUrl() {
    if (typeof window !== 'undefined' && window.location) {
        return window.location.origin;
    }
    return 'https://luxbyte.site'; // fallback URL
}

export const AUTH_CALLBACKS = {
    // مسار تأكيد الإيميل بعد التسجيل
    EMAIL_CONFIRMATION: `${getBaseUrl()}/email-confirmation.html`,

    // مسار إعادة تعيين كلمة المرور
    PASSWORD_RESET: `${getBaseUrl()}/reset-password.html`,

    // مسار النجاح بعد تسجيل الدخول
    LOGIN_SUCCESS: `${getBaseUrl()}/auth-success.html`,

    // مسار استكمال التسجيل بعد تأكيد الإيميل
    COMPLETE_REGISTRATION: `${getBaseUrl()}/complete-registration.html`
};

/**
 * إعدادات Supabase للمصادقة
 * Supabase Authentication Settings
 */
export const SUPABASE_AUTH_CONFIG = {
    // إعدادات تسجيل المستخدم الجديد
    signUp: {
        emailRedirectTo: AUTH_CALLBACKS.EMAIL_CONFIRMATION
    },

    // إعدادات إعادة تعيين كلمة المرور
    resetPassword: {
        redirectTo: AUTH_CALLBACKS.PASSWORD_RESET
    },

    // إعدادات تسجيل الدخول
    signIn: {
        redirectTo: AUTH_CALLBACKS.LOGIN_SUCCESS
    }
};

/**
 * دالة محسنة للحصول على روابط الكول باك
 * Enhanced function to get callback URLs
 */
export const getCallbackUrl = (type) => {
    const baseUrl = getBaseUrl();
    const callbacks = {
        'email-confirmation': `${baseUrl}/email-confirmation.html`,
        'password-reset': `${baseUrl}/reset-password.html`,
        'auth-success': `${baseUrl}/auth-success.html`,
        'complete-registration': `${baseUrl}/complete-registration.html`
    };

    return callbacks[type] || `${baseUrl}/auth.html`;
};

/**
 * أنواع الحسابات ومسارات الداشبورد
 * Account Types and Dashboard Paths
 */
export const ACCOUNT_DASHBOARDS = {
    pharmacy: 'dashboard/pharmacy.html',
    supermarket: 'dashboard/supermarket.html',
    restaurant: 'dashboard/restaurant.html',
    clinic: 'dashboard/clinic.html',
    courier: 'dashboard/courier.html',
    driver: 'dashboard/driver.html',
    'master-driver': 'dashboard/driver.html',
    admin: 'dashboard.html'
};

/**
 * الحصول على مسار الداشبورد حسب نوع الحساب
 * Get dashboard path by account type
 * @param {string} accountType - نوع الحساب
 * @returns {string} مسار الداشبورد
 */
export function getDashboardPath(accountType) {
    return ACCOUNT_DASHBOARDS[accountType] || 'auth.html';
}

/**
 * التحقق من صحة مسار الكول باك
 * Validate callback URL
 * @param {string} url - المسار المراد التحقق منه
 * @returns {boolean} صحيح أم لا
 */
export function isValidCallbackUrl(url) {
    const validUrls = Object.values(AUTH_CALLBACKS);
    return validUrls.includes(url);
}

/**
 * طباعة إعدادات المصادقة للتطوير
 * Print auth configuration for development
 */
export function printAuthConfig() {
    console.log('🔐 Authentication Configuration:');
    console.log('📧 Email Confirmation:', AUTH_CALLBACKS.EMAIL_CONFIRMATION);
    console.log('🔑 Password Reset:', AUTH_CALLBACKS.PASSWORD_RESET);
    console.log('✅ Login Success:', AUTH_CALLBACKS.LOGIN_SUCCESS);
    console.log('📋 Complete Registration:', AUTH_CALLBACKS.COMPLETE_REGISTRATION);
    console.log('🏠 Dashboards:', ACCOUNT_DASHBOARDS);
}

// طباعة الإعدادات في وضع التطوير
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    printAuthConfig();
}