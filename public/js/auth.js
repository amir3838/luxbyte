import { getSupabase, supabaseWithErrorHandling } from './supabase-client.js';
import { AUTH_CALLBACKS, SUPABASE_AUTH_CONFIG, getDashboardPath, getCallbackUrl } from './auth-config.js';
// Initialize file upload manager
let fileUploadManager = null;

// Function to initialize file upload manager
const initFileUploadManager = () => {
    if (typeof FileUploadManager !== 'undefined' && !fileUploadManager) {
        fileUploadManager = new FileUploadManager();
    }
};



// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initFileUploadManager);

// Function to upload user documents
const uploadUserDocuments = async (userId, documents) => {
    if (!fileUploadManager) {
        throw new Error('File upload manager not initialized');
    }

    const formData = new FormData();
    formData.append('userId', userId);

    // Add documents to form data
    if (Array.isArray(documents)) {
        documents.forEach((doc, index) => {
            formData.append(`document_${index}`, doc);
        });
    } else {
        formData.append('document', documents);
    }

    const response = await fetch('/api/upload-documents', {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        throw new Error('Failed to upload documents');
    }

    return await response.json();
};


// Enhanced error handling and user feedback
const showNotification = (message, type = 'info', duration = 5000) => {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-family: 'Cairo', sans-serif;
        font-size: 14px;
        max-width: 400px;
        animation: slideIn 0.3s ease-out;
    `;

    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        .notification-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, duration);
};

// Loading state management
const setLoadingState = (element, isLoading, text = '') => {
    if (isLoading) {
        element.disabled = true;
        element.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${text || 'جاري المعالجة...'}`;
    } else {
        element.disabled = false;
        element.innerHTML = text || element.dataset.originalText || 'إرسال';
    }
};

/**
 * معالجة تسجيل المستخدم الجديد
 * @param {string} email - البريد الإلكتروني
 * @param {string} password - كلمة المرور
 * @param {string} account - نوع الحساب
 * @param {Object} additionalData - بيانات إضافية (اختياري)
 */
export async function handleRegister(email, password, account, additionalData = {}) {
    const submitButton = document.querySelector('button[type="submit"]');
    const originalText = submitButton?.textContent;

    try {
        // إظهار حالة التحميل
        if (submitButton) {
            setLoadingState(submitButton, true, 'جاري إنشاء الحساب...');
        }

        console.log('🔐 Starting registration process...', { email, account });

        // التحقق من صحة البيانات
        if (!email || !password || !account) {
            throw new Error('جميع الحقول مطلوبة');
        }

        if (password.length < 6) {
            throw new Error('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
        }

        // تسجيل المستخدم في Supabase Auth
        const supabase = getSupabase();
        const { data: { user }, error: authError } = await supabaseWithErrorHandling.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: getCallbackUrl('email-confirmation'),
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
            showNotification('تم إرسال رابط التفعيل إلى بريدك الإلكتروني', 'success');
            showEmailConfirmationMessage();
            return { success: true, user, requiresConfirmation: true };
        }

        // إنشاء ملف شخصي في جدول profiles
        const { error: profileError } = await supabaseWithErrorHandling
            .from('profiles')
            .insert({
                id: user.id,
                account: account,
                governorate: additionalData.governorate || null,
                city: additionalData.city || null,
                full_name: additionalData.fullName || null,
                phone: additionalData.phone || null,
                business_name: additionalData.businessName || null,
                business_type: additionalData.businessType || null,
                license_number: additionalData.licenseNumber || null,
                tax_id: additionalData.taxId || null,
                address: additionalData.address || null
            });

        if (profileError) {
            console.error('❌ Profile creation failed:', profileError);
            throw new Error(profileError.message);
        }

        // رفع المستندات إذا كانت متوفرة
        if (fileUploadManager && additionalData.documents) {
            try {
                await uploadUserDocuments(user.id, additionalData.documents);
                console.log('✅ Documents uploaded successfully');
            } catch (uploadError) {
                console.warn('⚠️ Document upload failed:', uploadError);
                // لا نوقف العملية إذا فشل رفع المستندات
            }
        }

        console.log('✅ Profile created successfully');
        showNotification('تم إنشاء الحساب بنجاح!', 'success');

        // توجيه المستخدم إلى الصفحة الرئيسية بعد التسجيل
        console.log('🔄 Redirecting to main page after registration');
        setTimeout(() => {
            window.location.href = '/';
        }, 2000);

        return { success: true, user };

    } catch (error) {
        console.error('❌ Registration error:', error);
        showNotification(error.message || 'حدث خطأ في إنشاء الحساب', 'error');
        throw error;
    } finally {
        // إعادة تعيين حالة الزر
        if (submitButton) {
            setLoadingState(submitButton, false, originalText);
        }
    }
}

/**
 * معالجة تسجيل الدخول
 * @param {string} email - البريد الإلكتروني
 * @param {string} password - كلمة المرور
 */
export async function handleLogin(email, password) {
    const submitButton = document.querySelector('button[type="submit"]');
    const originalText = submitButton?.textContent;

    try {
        // إظهار حالة التحميل
        if (submitButton) {
            setLoadingState(submitButton, true, 'جاري تسجيل الدخول...');
        }

        console.log('🔐 Starting login process...', { email });

        // التحقق من صحة البيانات
        if (!email || !password) {
            throw new Error('البريد الإلكتروني وكلمة المرور مطلوبان');
        }

        const supabase = getSupabase();
        const { data: { user }, error: authError } = await supabaseWithErrorHandling.auth.signInWithPassword({
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

        // التحقق من تأكيد البريد الإلكتروني
        if (!user.email_confirmed_at) {
            showNotification('يرجى تأكيد بريدك الإلكتروني أولاً', 'error');
            return { success: false, requiresConfirmation: true };
        }

        // الحصول على نوع الحساب من جدول profiles
        const { data: profile, error: profileError } = await supabaseWithErrorHandling
            .from('profiles')
            .select('account, city, full_name, phone')
            .eq('id', user.id)
            .single();

        if (profileError) {
            console.error('❌ Profile fetch failed:', profileError);
            // إذا لم يكن هناك ملف شخصي، يوجه إلى صفحة اختيار الدور
            console.log('🔄 No profile found, redirecting to role selection');
            showNotification('يرجى اختيار نوع النشاط أولاً', 'info');
            window.location.href = '/choose-activity.html';
            return { success: true, user, requiresRoleSelection: true };
        }

        if (!profile) {
            console.log('🔄 No profile found, redirecting to role selection');
            showNotification('يرجى اختيار نوع النشاط أولاً', 'info');
            window.location.href = '/choose-activity.html';
            return { success: true, user, requiresRoleSelection: true };
        }

        console.log('✅ Profile fetched successfully:', profile);

        // حفظ معلومات المستخدم في localStorage
        localStorage.setItem('user_profile', JSON.stringify(profile));
        localStorage.setItem('user_id', user.id);

        // إذا لم يكن لديه دور محدد، يوجه إلى الصفحة الرئيسية
        if (!profile.account) {
            console.log('🔄 No account type found, redirecting to main page');
            showNotification('مرحباً بك في LUXBYTE!', 'success');
            window.location.href = '/';
            return { success: true, user, requiresActivitySelection: true };
        }

        // توجيه المستخدم حسب نوع الحساب
        showNotification(`مرحباً ${profile.full_name || 'بك'} في LUXBYTE!`, 'success');
        redirectByAccount(profile.account);

        return { success: true, user, profile };

    } catch (error) {
        console.error('❌ Login error:', error);
        showNotification(error.message || 'حدث خطأ في تسجيل الدخول', 'error');
        throw error;
    } finally {
        // إعادة تعيين حالة الزر
        if (submitButton) {
            setLoadingState(submitButton, false, originalText);
        }
    }
}

/**
 * إعادة تعيين كلمة المرور
 * @param {string} email - البريد الإلكتروني
 * @returns {Promise<Object>} نتيجة العملية
 */
export async function handlePasswordReset(email) {
    try {
        console.log('🔐 Starting password reset process...', { email });

        const supabase = getSupabase();
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: getCallbackUrl('password-reset')
        });

        if (error) {
            console.error('❌ Password reset failed:', error);
            throw new Error(error.message);
        }

        console.log('✅ Password reset email sent successfully');
        return {
            success: true,
            message: 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني'
        };

    } catch (error) {
        console.error('❌ Password reset error:', error);
        throw new Error(error.message);
    }
}

/**
 * تسجيل الخروج
 */
export async function handleLogout() {
    try {
        console.log('🔐 Starting logout process...');

        const supabase = getSupabase();
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

        const supabase = getSupabase();
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            console.log('❌ No active session, redirecting to auth');
            // التحقق من وجود profile في localStorage للعودة السريعة
            const savedProfile = localStorage.getItem('user_profile');
        if (savedProfile) {
            try {
                const profile = JSON.parse(savedProfile);
                if (profile.account) {
                    console.log('🔄 Found saved profile, redirecting to main page');
                    window.location.href = '/';
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
            // إذا لم يوجد profile، توجيه للصفحة الرئيسية
            console.log('🔄 No profile found, redirecting to main page');
            window.location.href = '/';
            return;
        }

        if (profile?.account) {
            console.log('✅ Profile found, redirecting to dashboard:', profile.account);
            // حفظ معلومات المستخدم في localStorage للوصول السريع
            localStorage.setItem('user_profile', JSON.stringify(profile));
            redirectByAccount(profile.account);
        } else {
            console.log('❌ No account type found, redirecting to main page');
            window.location.href = '/';
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
    const url = getDashboardPath(accountType);

    if (url && url !== 'auth.html') {
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
        const supabase = getSupabase();
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
        const supabase = getSupabase();
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
        const supabase = getSupabase();
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
