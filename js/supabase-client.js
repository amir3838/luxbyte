/**
 * Unified Supabase Client - ESM Module
 * عميل سوبابيز موحد - وحدة ESM
 */

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { loadEnvInline, loadEnv, validateEnv } from "../src/utils/env.js";

let supabaseClient = null;
let envConfig = null;

/**
 * Initialize environment configuration
 * تهيئة إعدادات البيئة
 */
async function initializeEnv() {
  if (envConfig) return envConfig;

  try {
    // Try inline config first (fastest)
    envConfig = loadEnvInline();
    
    // If inline config is incomplete, try fetch
    if (!envConfig.SUPABASE_URL || !envConfig.SUPABASE_ANON_KEY) {
      console.log('🔄 Inline config incomplete, trying fetch...');
      envConfig = await loadEnv();
    }

    // Validate configuration
    const validation = validateEnv(envConfig);
    if (!validation.ok) {
      throw new Error(`Environment validation failed: ${validation.missing.join(', ')}`);
    }

    console.log('✅ Environment loaded successfully:', validation.present);
    return envConfig;
  } catch (error) {
    console.error('❌ Failed to load environment:', error);
    throw new Error('Environment configuration failed');
  }
}

/**
 * Get or create Supabase client instance
 * الحصول على أو إنشاء مثيل عميل سوبابيز
 */
export async function getSupabaseClient() {
  if (supabaseClient) return supabaseClient;

  try {
    // Initialize environment
    const env = await initializeEnv();

    // Create Supabase client
    supabaseClient = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
      auth: {
        storageKey: 'luxbyte-auth',
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    });

    console.log('✅ Supabase client initialized successfully');
    return supabaseClient;
  } catch (error) {
    console.error('❌ Failed to initialize Supabase client:', error);
    throw error;
  }
}

/**
 * Get current user
 * الحصول على المستخدم الحالي
 */
export async function getCurrentUser() {
  const supabase = await getSupabaseClient();
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
export async function signUp(email, password) {
  const supabase = await getSupabaseClient();
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
export async function signIn(email, password) {
  const supabase = await getSupabaseClient();
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
export async function signOut() {
  const supabase = await getSupabaseClient();
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
export async function onAuthStateChange(callback) {
  const supabase = await getSupabaseClient();
  if (!supabase) return null;

  return supabase.auth.onAuthStateChange(callback);
}

// Create a default export for convenience
const supabase = {
  getClient: getSupabaseClient,
  getCurrentUser: getCurrentUser,
  signUp: signUp,
  signIn: signIn,
  signOut: signOut,
  onAuthStateChange: onAuthStateChange
};

export { supabase };

// Make available globally for legacy scripts
if (typeof window !== 'undefined') {
  window.LUXBYTE = window.LUXBYTE || {};
  window.LUXBYTE.supabase = supabase;
  
  // Also provide direct access
  window.supabase = {
    getClient: getSupabaseClient,
    getCurrentUser: getCurrentUser,
    signUp: signUp,
    signIn: signIn,
    signOut: signOut,
    onAuthStateChange: onAuthStateChange
  };
}