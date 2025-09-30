import { getSupabase } from './supabase-client.js';

/**
 * خريطة توجيه لوحات التحكم حسب نوع الحساب
 */
const DASHBOARD_MAP = {
    pharmacy: 'dashboard/pharmacy.html',
    supermarket: 'dashboard/supermarket.html',
    restaurant: 'dashboard/restaurant.html',
    clinic: 'dashboard/clinic.html',
    courier: 'dashboard/courier.html',
    driver: 'dashboard/driver.html',
    admin: 'dashboard.html'
};

/**
 * قائمة الصفحات المحمية التي تتطلب تسجيل دخول (الداشبورد فقط)
 */
const PROTECTED_PAGES = [
    'dashboard.html',
    'dashboard/pharmacy.html',
    'dashboard/supermarket.html',
    'dashboard/restaurant.html',
    'dashboard/clinic.html',
    'dashboard/courier.html',
    'dashboard/driver.html',
    'admin-panel.html'
];

/**
 * قائمة الصفحات العامة التي لا تحتاج تسجيل دخول
 */
const PUBLIC_PAGES = [
    'index.html',
    'auth.html',
    'unified-signup.html',
    'signup.html',
    'choose-role.html',
    'choose-platform.html',
    'account-type-selection.html',
    'terms-conditions.html',
    'social.html'
];

/**
 * التحقق من حالة المصادقة وتوجيه المستخدم للداشبورد المناسب
 */
export async function checkAuthAndRedirect() {
    try {
        console.log('🔍 Checking authentication status...');

        // التحقق من وجود جلسة نشطة
        const supabase = getSupabase();
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
            console.error('❌ Session check error:', sessionError);
            redirectToAuth();
            return;
        }

        if (!session) {
            console.log('❌ No active session, redirecting to auth');
            redirectToAuth();
            return;
        }

        console.log('✅ Active session found:', session.user.id);

        // الحصول على نوع الحساب من جدول profiles
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('account, city, created_at')
            .eq('user_id', session.user.id)
            .single();

        if (profileError) {
            console.error('❌ Profile fetch failed:', profileError);
            redirectToAuth();
            return;
        }

        if (!profile) {
            console.log('❌ No profile found, redirecting to signup');
            // إذا لم يكن هناك ملف شخصي، توجه للتسجيل لإكمال البيانات
            window.location.href = 'unified-signup.html';
            return;
        }

        console.log('✅ Profile found:', profile);

        // توجيه المستخدم للداشبورد المناسب
        redirectByAccount(profile.account);

    } catch (error) {
        console.error('❌ Auth check error:', error);
        redirectToAuth();
    }
}

/**
 * التحقق من المصادقة (للاستخدام في الداشبورد فقط)
 */
export async function requireAuth() {
    try {
        const supabase = getSupabase();
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            console.log('❌ No active session, redirecting to login');
            redirectToAuth();
            return false;
        }

        console.log('✅ User is authenticated');
        return true;
    } catch (error) {
        console.error('❌ Auth check error:', error);
        console.log('❌ Authentication failed, redirecting to login');
        redirectToAuth();
        return false;
    }
}

/**
 * الحصول على معلومات المستخدم الحالي
 */
export async function getCurrentUser() {
    try {
        const supabase = getSupabase();
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error) {
            console.error('❌ Get current user error:', error);
            return null;
        }

        return user;
    } catch (error) {
        console.error('❌ Get current user error:', error);
        return null;
    }
}

/**
 * الحصول على ملف المستخدم الشخصي
 */
export async function getCurrentProfile() {
    try {
        const user = await getCurrentUser();
        if (!user) return null;

        const supabase = getSupabase();
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', user.id)
            .single();

        if (error) {
            console.error('❌ Get profile error:', error);
            return null;
        }

        return profile;
    } catch (error) {
        console.error('❌ Get profile error:', error);
        return null;
    }
}

/**
 * التحقق من نوع الحساب المحدد
 * @param {string} requiredAccountType - نوع الحساب المطلوب
 */
export async function requireAccountType(requiredAccountType) {
    try {
        const profile = await getCurrentProfile();

        if (!profile) {
            console.log('❌ No profile found');
            redirectToAuth();
            return false;
        }

        if (profile.account !== requiredAccountType) {
            console.log(`❌ Wrong account type. Required: ${requiredAccountType}, Found: ${profile.account}`);
            redirectByAccount(profile.account);
            return false;
        }

        return true;
    } catch (error) {
        console.error('❌ Account type check error:', error);
        redirectToAuth();
        return false;
    }
}

/**
 * توجيه المستخدم حسب نوع الحساب
 * @param {string} accountType - نوع الحساب
 */
export function redirectByAccount(accountType) {
    const url = DASHBOARD_MAP[accountType];

    if (url) {
        console.log(`🔄 Redirecting to ${accountType} dashboard: ${url}`);
        window.location.href = url;
    } else {
        console.error('❌ Unknown account type:', accountType);
        showError('نوع الحساب غير معروف: ' + accountType);
        redirectToAuth();
    }
}

/**
 * توجيه المستخدم لصفحة تسجيل الدخول
 */
export function redirectToAuth() {
    console.log('🔄 Redirecting to auth page');
    window.location.href = 'auth.html';
}

/**
 * تسجيل الخروج وتوجيه المستخدم
 */
export async function logout() {
    try {
        console.log('🔐 Starting logout process...');

        const supabase = getSupabase();
        const { error } = await supabase.auth.signOut();

        if (error) {
            console.error('❌ Logout failed:', error);
            showError('فشل في تسجيل الخروج: ' + error.message);
            return;
        }

        console.log('✅ Logout successful');
        redirectToAuth();

    } catch (error) {
        console.error('❌ Logout error:', error);
        showError('خطأ في تسجيل الخروج: ' + error.message);
    }
}

/**
 * عرض رسالة خطأ
 * @param {string} message - رسالة الخطأ
 */
function showError(message) {
    // يمكن تخصيص طريقة عرض الأخطاء حسب التصميم
    if (typeof LUXBYTE !== 'undefined' && LUXBYTE.notifyErr) {
        LUXBYTE.notifyErr(message);
    } else {
        alert(message);
    }
}

/**
 * عرض رسالة نجاح
 * @param {string} message - رسالة النجاح
 */
function showSuccess(message) {
    if (typeof LUXBYTE !== 'undefined' && LUXBYTE.notifyOk) {
        LUXBYTE.notifyOk(message);
    } else {
        console.log('✅', message);
    }
}

/**
 * التحقق من الصفحة الحالية إذا كانت محمية (داشبورد فقط)
 */
export function isCurrentPageProtected() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const isProtected = PROTECTED_PAGES.includes(currentPage);
    console.log(`🔍 Checking if page is protected (dashboard): ${currentPage} -> ${isProtected}`);
    return isProtected;
}

/**
 * التحقق من الصفحة الحالية إذا كانت عامة
 */
export function isCurrentPagePublic() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const isPublic = PUBLIC_PAGES.includes(currentPage);
    console.log(`🔍 Checking if page is public: ${currentPage} -> ${isPublic}`);
    return isPublic;
}

/**
 * تهيئة الحماية التلقائية للصفحة (الداشبورد فقط)
 */
export async function initAutoGuard() {
    try {
        console.log('🛡️ Initializing auto page guard...');
        
        // إذا كانت الصفحة محمية (داشبورد)، تحقق من المصادقة
        if (isCurrentPageProtected()) {
            console.log('🔒 Dashboard page detected, checking authentication...');
            const isAuthenticated = await requireAuth();
            if (!isAuthenticated) {
                console.log('❌ Authentication failed, redirecting to login');
                return false;
            }
            
            console.log('✅ Dashboard access granted');
            return true;
        }
        
        // جميع الصفحات الأخرى (العامة وغير المعروفة) لا تحتاج تسجيل دخول
        console.log('🌐 Non-dashboard page detected, no authentication required');
        return true;

    } catch (error) {
        console.error('❌ Auto guard initialization error:', error);
        
        // في حالة الخطأ، لا نمنع الوصول إلا للداشبورد
        if (isCurrentPageProtected()) {
            console.log('❌ Error occurred on dashboard page, redirecting to login');
            redirectToAuth();
            return false;
        }
        
        console.log('🌐 Error occurred on non-dashboard page, allowing access');
        return true;
    }
}

/**
 * تهيئة الحماية للصفحة
 * @param {string} requiredAccountType - نوع الحساب المطلوب (اختياري)
 */
export async function initPageGuard(requiredAccountType = null) {
    try {
        console.log('🛡️ Initializing page guard...');

        // التحقق من المصادقة
        const isAuthenticated = await requireAuth();
        if (!isAuthenticated) return;

        // التحقق من نوع الحساب إذا كان مطلوباً
        if (requiredAccountType) {
            const hasCorrectAccountType = await requireAccountType(requiredAccountType);
            if (!hasCorrectAccountType) return;
        }

        console.log('✅ Page guard initialized successfully');
        return true;

    } catch (error) {
        console.error('❌ Page guard initialization error:', error);
        redirectToAuth();
        return false;
    }
}

// جعل الدوال متاحة عالمياً
window.checkAuthAndRedirect = checkAuthAndRedirect;
window.requireAuth = requireAuth;
window.getCurrentUser = getCurrentUser;
window.getCurrentProfile = getCurrentProfile;
window.requireAccountType = requireAccountType;
window.redirectByAccount = redirectByAccount;
window.redirectToAuth = redirectToAuth;
window.logout = logout;
window.initPageGuard = initPageGuard;
window.initAutoGuard = initAutoGuard;
window.isCurrentPageProtected = isCurrentPageProtected;
window.isCurrentPagePublic = isCurrentPagePublic;

// تهيئة تلقائية للحارس عند تحميل الصفحة
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // تأخير بسيط للتأكد من تحميل جميع السكريبتات
        setTimeout(() => {
            initAutoGuard();
        }, 100);
    });
} else {
    // تأخير بسيط للتأكد من تحميل جميع السكريبتات
    setTimeout(() => {
        initAutoGuard();
    }, 100);
}
