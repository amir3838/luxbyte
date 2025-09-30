import { supabase } from './supabase-client.js';

/**
 * معالجة تسجيل المستخدم الجديد
 * @param {string} email - البريد الإلكتروني
 * @param {string} password - كلمة المرور
 * @param {string} account - نوع الحساب
 * @param {Object} additionalData - بيانات إضافية (اختياري)
 */
export async function handleRegister(email, password, account, additionalData = {}) {
    try {
        console.log('🔐 Starting registration process...', { email, account });

        // تسجيل المستخدم في Supabase Auth
        const { data: { user }, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    account,
                    ...additionalData
                }
            }
        });

        if (authError) {
            console.error('❌ Auth registration failed:', authError);
            throw new Error(authError.message);
        }

        if (!user) {
            throw new Error('فشل في إنشاء المستخدم');
        }

        console.log('✅ User created successfully:', user.id);

        // التحقق من حالة تأكيد البريد
        if (!user.email_confirmed_at) {
            console.log('📧 Email confirmation required');
            showEmailConfirmationMessage();
            return { success: true, user, requiresConfirmation: true };
        }

        // إنشاء ملف شخصي في جدول profiles
        const { error: profileError } = await supabase
            .from('profiles')
            .insert({
                user_id: user.id,
                account: account,
                city: additionalData.city || null
            });

        if (profileError) {
            console.error('❌ Profile creation failed:', profileError);
            throw new Error(profileError.message);
        }

        console.log('✅ Profile created successfully');

        // توجيه المستخدم حسب نوع الحساب
        redirectByAccount(account);

        return { success: true, user };

    } catch (error) {
        console.error('❌ Registration error:', error);
        throw error;
    }
}

/**
 * معالجة تسجيل الدخول
 * @param {string} email - البريد الإلكتروني
 * @param {string} password - كلمة المرور
 */
export async function handleLogin(email, password) {
    try {
        console.log('🔐 Starting login process...', { email });

        const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (authError) {
            console.error('❌ Auth login failed:', authError);
            throw new Error(authError.message);
        }

        if (!user) {
            throw new Error('فشل في تسجيل الدخول');
        }

        console.log('✅ User logged in successfully:', user.id);

        // الحصول على نوع الحساب من جدول profiles
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('account, city')
            .eq('user_id', user.id)
            .single();

        if (profileError) {
            console.error('❌ Profile fetch failed:', profileError);
            throw new Error(profileError.message);
        }

        if (!profile) {
            throw new Error('لم يتم العثور على ملف المستخدم الشخصي');
        }

        console.log('✅ Profile fetched successfully:', profile);

        // توجيه المستخدم حسب نوع الحساب
        redirectByAccount(profile.account);

        return { success: true, user, profile };

    } catch (error) {
        console.error('❌ Login error:', error);
        throw error;
    }
}

/**
 * تسجيل الخروج
 */
export async function handleLogout() {
    try {
        console.log('🔐 Starting logout process...');

        const { error } = await supabase.auth.signOut();

        if (error) {
            console.error('❌ Logout failed:', error);
            throw new Error(error.message);
        }

        console.log('✅ Logout successful');

        // توجيه المستخدم لصفحة تسجيل الدخول
        window.location.href = 'auth.html';

        return { success: true };

    } catch (error) {
        console.error('❌ Logout error:', error);
        throw error;
    }
}

/**
 * التحقق من حالة المصادقة وتوجيه المستخدم
 */
export async function checkAuthAndRedirect() {
    try {
        console.log('🔍 Checking authentication status...');

        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            console.log('❌ No active session, redirecting to auth');
            // التحقق من وجود profile في localStorage للعودة السريعة
            const savedProfile = localStorage.getItem('user_profile');
            if (savedProfile) {
                try {
                    const profile = JSON.parse(savedProfile);
                    if (profile.account) {
                        console.log('🔄 Found saved profile, redirecting to unified signup');
                        window.location.href = 'unified-signup.html';
                        return;
                    }
                } catch (e) {
                    console.warn('Invalid saved profile data');
                }
            }
            window.location.href = 'auth.html';
            return;
        }

        console.log('✅ Active session found:', session.user.id);

        // التحقق من تأكيد البريد الإلكتروني
        if (!session.user.email_confirmed_at) {
            console.log('📧 Email not confirmed, showing confirmation message');
            showEmailConfirmationMessage();
            return;
        }

        // الحصول على نوع الحساب
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('account, city, full_name, phone')
            .eq('user_id', session.user.id)
            .single();

        if (profileError) {
            console.error('❌ Profile fetch failed:', profileError);
            // إذا لم يوجد profile، توجيه لصفحة التسجيل الموحد
            console.log('🔄 No profile found, redirecting to unified signup');
            window.location.href = 'unified-signup.html';
            return;
        }

        if (profile?.account) {
            console.log('✅ Profile found, redirecting to dashboard:', profile.account);
            // حفظ معلومات المستخدم في localStorage للوصول السريع
            localStorage.setItem('user_profile', JSON.stringify(profile));
            redirectByAccount(profile.account);
        } else {
            console.log('❌ No account type found, redirecting to unified signup');
            window.location.href = 'unified-signup.html';
        }

    } catch (error) {
        console.error('❌ Auth check error:', error);
        window.location.href = 'auth.html';
    }
}

/**
 * توجيه المستخدم حسب نوع الحساب
 * @param {string} accountType - نوع الحساب
 */
export function redirectByAccount(accountType) {
    const DASHBOARD = {
        pharmacy: 'dashboard/pharmacy.html',
        supermarket: 'dashboard/supermarket.html',
        restaurant: 'dashboard/restaurant.html',
        clinic: 'dashboard/clinic.html',
        courier: 'dashboard/courier.html',
        driver: 'dashboard/driver.html',
        admin: 'dashboard.html'
    };

    const url = DASHBOARD[accountType];

    if (url) {
        console.log(`🔄 Redirecting to ${accountType} dashboard: ${url}`);
        window.location.href = url;
    } else {
        console.error('❌ Unknown account type:', accountType);
        alert('نوع الحساب غير معروف: ' + accountType);
        window.location.href = 'auth.html';
    }
}

/**
 * الحصول على معلومات المستخدم الحالي
 */
export async function getCurrentUser() {
    try {
        const { data: { user } } = await supabase.auth.getUser();
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
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

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
 * عرض رسالة تأكيد البريد الإلكتروني
 */
function showEmailConfirmationMessage() {
    const messageDiv = document.getElementById('emailConfirmationMessage');
    if (messageDiv) {
        messageDiv.style.display = 'block';
    }

    // إخفاء الرسالة بعد 10 ثوانٍ
    setTimeout(() => {
        if (messageDiv) {
            messageDiv.style.display = 'none';
        }
    }, 10000);
}

/**
 * التحقق من حالة تأكيد البريد
 */
export async function checkEmailConfirmation() {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user && !user.email_confirmed_at) {
            showEmailConfirmationMessage();
            return true;
        }
        return false;
    } catch (error) {
        console.error('❌ Email confirmation check error:', error);
        return false;
    }
}

// جعل الدوال متاحة عالمياً للاستخدام في HTML
window.handleRegister = handleRegister;
window.handleLogin = handleLogin;
window.handleLogout = handleLogout;
window.checkAuthAndRedirect = checkAuthAndRedirect;
window.redirectByAccount = redirectByAccount;
window.showEmailConfirmationMessage = showEmailConfirmationMessage;
window.checkEmailConfirmation = checkEmailConfirmation;
