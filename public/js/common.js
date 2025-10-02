/**
 * LUXBYTE Common Utilities
 * أدوات LUXBYTE المشتركة
 *
 * يحتوي على عميل Supabase الوحيد (singleton) وأدوات مشتركة
 */

// LUXBYTE Supabase Singleton
// عميل Supabase الوحيد لتجنب Multiple GoTrueClient
(() => {
  // تحميل Supabase بشكل ديناميكي لتجنب التكرار
  if (window.__supabase) {
    console.log('✅ عميل Supabase موجود بالفعل');
    return;
  }

  // إعدادات Supabase - فقط المفاتيح العامة
  const SUPABASE_URL = window.__ENV?.SUPABASE_URL || window.NEXT_PUBLIC_SUPABASE_URL || 'https://qjsvgpvbtrcnbhcjdcci.supabase.co';
  const SUPABASE_ANON_KEY = window.__ENV?.SUPABASE_ANON_KEY || window.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_vAyh05NeO33SYgua07vvIQ_M6nfrx7e';

  // فحص صحة الإعدادات
  const okUrl = SUPABASE_URL && SUPABASE_URL.startsWith('https://') && SUPABASE_URL.includes('.supabase.co');
  const ANON = SUPABASE_ANON_KEY;
  console.log('SB URL ok?', okUrl, 'ANON len:', ANON?.length);

  if (!okUrl) {
    console.error('❌ خطأ في إعدادات Supabase URL:', SUPABASE_URL);
  }

  if (!ANON || ANON.length < 100) {
    console.error('❌ خطأ في إعدادات Supabase ANON KEY:', ANON?.length || 0);
  }

  // تحميل Supabase بشكل ديناميكي
  import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm').then(({ createClient }) => {
    if (!window.__supabase) {
      window.__supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          storageKey: 'luxbyte-auth',
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          flowType: 'pkce'
        },
        global: {
          headers: {
            'x-client-info': 'luxbyte-web',
            'x-app-version': '1.0.0'
          }
        },
        db: {
          schema: 'public'
        },
        realtime: {
          params: {
            eventsPerSecond: 10
          }
        }
      });

      console.log('✅ تم إنشاء عميل Supabase الوحيد');

      // فحص إضافي للتأكد من عمل العميل
      if (window.__supabase) {
        console.log('✅ عميل Supabase جاهز للاستخدام');
      } else {
        console.error('❌ فشل في إنشاء عميل Supabase');
      }
    }
  }).catch(error => {
    console.error('❌ فشل في تحميل Supabase:', error);
  });
})();

// دالة للحصول على العميل
export function getSupabase() {
  return window.__supabase;
}

// تصدير العميل للاستخدام في الملفات الأخرى
export const supabase = window.__supabase;

// دالة للتحقق من وجود جلسة نشطة
export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await window.__supabase.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error) {
    console.error('خطأ في الحصول على المستخدم الحالي:', error);
    return null;
  }
}

// دالة للتحقق من وجود جلسة
export async function getCurrentSession() {
  try {
    const { data: { session }, error } = await window.__supabase.auth.getSession();
    if (error) throw error;
    return session;
  } catch (error) {
    console.error('خطأ في الحصول على الجلسة الحالية:', error);
    return null;
  }
}

// دالة للخروج
export async function signOut() {
  try {
    const { error } = await window.__supabase.auth.signOut();
    if (error) throw error;
    console.log('تم تسجيل الخروج بنجاح');
    return true;
  } catch (error) {
    console.error('خطأ في تسجيل الخروج:', error);
    return false;
  }
}

// دالة لإظهار الإشعارات
export function showNotification(message, type = 'info', duration = 5000) {
  // إنشاء عنصر الإشعار
  const notification = document.createElement('div');
  notification.className = `notification notification--${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas fa-${type === 'error' ? 'exclamation-circle' : type === 'success' ? 'check-circle' : 'info-circle'}"></i>
      <span>${message}</span>
    </div>
  `;

  // إضافة الإشعار إلى الصفحة
  document.body.appendChild(notification);

  // إزالة الإشعار بعد المدة المحددة
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, duration);
}

// دالة لإدارة حالة التحميل
export function setLoadingState(element, isLoading, text = '') {
  if (!element) return;

  if (isLoading) {
    element.disabled = true;
    element.dataset.originalText = element.textContent;
    element.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${text}`;
  } else {
    element.disabled = false;
    element.textContent = element.dataset.originalText || text;
    delete element.dataset.originalText;
  }
}

// دالة للتحقق من صحة البريد الإلكتروني
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// دالة للتحقق من قوة كلمة المرور
export function isStrongPassword(password) {
  return password && password.length >= 6;
}

// دالة لتنسيق التاريخ
export function formatDate(date) {
  return new Intl.DateTimeFormat('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
}

// دالة لتنسيق العملة
export function formatCurrency(amount, currency = 'EGP') {
  return new Intl.NumberFormat('ar-EG', {
    style: 'currency',
    currency: currency
  }).format(amount);
}

// دالة للتحقق من دعم المتصفح
export function checkBrowserSupport() {
  const features = {
    serviceWorker: 'serviceWorker' in navigator,
    localStorage: typeof Storage !== 'undefined',
    fetch: 'fetch' in window,
    promises: typeof Promise !== 'undefined',
    es6: typeof Symbol !== 'undefined'
  };

  const unsupported = Object.entries(features)
    .filter(([key, supported]) => !supported)
    .map(([key]) => key);

  if (unsupported.length > 0) {
    console.warn('المتصفح لا يدعم الميزات التالية:', unsupported);
    return false;
  }

  return true;
}

// تهيئة التحقق من دعم المتصفح
document.addEventListener('DOMContentLoaded', () => {
  if (!checkBrowserSupport()) {
    showNotification('متصفحك لا يدعم بعض الميزات المطلوبة. يرجى التحديث إلى إصدار أحدث.', 'error', 10000);
  }
});

console.log('📦 تم تحميل LUXBYTE Common Utilities');