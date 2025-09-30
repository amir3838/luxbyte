/**
 * Unified Supabase Client
 * عميل سوبابيز موحد - لوكس بايت
 */

let supabaseClient = null;

/**
 * Get or create Supabase client instance
 * الحصول على أو إنشاء مثيل عميل سوبابيز
 */
function getSupabaseClient() {
  if (!supabaseClient) {
    // Check if we're in browser environment
    if (typeof window === 'undefined') {
      console.warn('Supabase client can only be initialized in browser environment');
      return null;
    }

    // Check if Supabase is available
    if (typeof window.supabase === 'undefined') {
      console.warn('Supabase library not loaded');
      return null;
    }

    try {
      supabaseClient = window.supabase.createClient(
        window.CONFIG?.__ENV__?.NEXT_PUBLIC_SUPABASE_URL || window.CONFIG?.SUPABASE_URL || 'https://your-project.supabase.co',
        window.CONFIG?.__ENV__?.NEXT_PUBLIC_SUPABASE_ANON_KEY || window.CONFIG?.SUPABASE_ANON_KEY || 'your-anon-key',
        {
          auth: {
            storageKey: 'luxbyte-auth', // Unique storage key
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true
          }
        }
      );

      console.log('Supabase client initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Supabase client:', error);
      return null;
    }
  }

  return supabaseClient;
}

/**
 * Get current user
 * الحصول على المستخدم الحالي
 */
async function getCurrentUser() {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.debug('User not logged in:', error.message);
      return null;
    }
    return user;
  } catch (error) {
    console.debug('Error getting current user:', error.message);
    return null;
  }
}

/**
 * Sign up user
 * تسجيل مستخدم جديد
 */
async function signUp(email, password) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error('Supabase client not available');
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: password.trim()
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Sign up error:', error);
    throw error;
  }
}

/**
 * Sign in user
 * تسجيل دخول المستخدم
 */
async function signIn(email, password) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error('Supabase client not available');
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim()
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
}

/**
 * Sign out user
 * تسجيل خروج المستخدم
 */
async function signOut() {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error('Supabase client not available');
  }

  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }

    // Clear local storage
    localStorage.removeItem('luxbyte-auth');
    return true;
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
}

/**
 * Listen to auth state changes
 * الاستماع لتغييرات حالة المصادقة
 */
function onAuthStateChange(callback) {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  return supabase.auth.onAuthStateChange(callback);
}

// Export functions
window.LUXBYTE = window.LUXBYTE || {};
window.LUXBYTE.supabase = {
  getClient: getSupabaseClient,
  getCurrentUser: getCurrentUser,
  signUp: signUp,
  signIn: signIn,
  signOut: signOut,
  onAuthStateChange: onAuthStateChange
};

// For module exports
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getSupabaseClient,
    getCurrentUser,
    signUp,
    signIn,
    signOut,
    onAuthStateChange
  };
}
