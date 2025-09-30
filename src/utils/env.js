// src/utils/env.js - Enhanced environment loading with inline fallback

/**
 * Load environment configuration from inline JSON (preferred)
 * @returns {Object} Environment configuration
 */
export function loadEnvInline() {
  try {
    const el = document.getElementById('app-config');
    if (el) {
      const config = JSON.parse(el.textContent);
      console.log('✅ Loaded environment from inline config');
      return config;
    }
  } catch (error) {
    console.warn('⚠️ Failed to load inline config:', error);
  }
  return {};
}

/**
 * Load environment configuration (inline first, then fetch fallback)
 * @returns {Promise<Object>} Environment configuration
 */
export async function loadEnv() {
  // Try inline first (faster and more reliable)
  const inlineConfig = loadEnvInline();
  if (inlineConfig.SUPABASE_URL && inlineConfig.SUPABASE_ANON_KEY) {
    return inlineConfig;
  }

  // Fallback to fetch
  try {
    const response = await fetch('/config.json', { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`ENV_FETCH_FAILED: ${response.status}`);
    }
    const config = await response.json();
    console.log('✅ Loaded environment from config.json');
    return config;
  } catch (error) {
    console.error('❌ Error loading environment configuration:', error);
    
    // Final fallback to window.CONFIG
    if (window.CONFIG?.__ENV__) {
      console.log('🔄 Using window.CONFIG fallback');
      return window.CONFIG.__ENV__;
    }
    
    throw new Error('ENV_FETCH_FAILED: No configuration available');
  }
}

/**
 * Validate environment configuration
 * @param {Object} env - Environment configuration
 * @returns {Object} Validation result
 */
export function validateEnv(env) {
  const requiredKeys = [
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY'
  ];

  const optionalKeys = [
    'FIREBASE_API_KEY',
    'FIREBASE_AUTH_DOMAIN',
    'FIREBASE_PROJECT_ID',
    'FIREBASE_MESSAGING_SENDER_ID',
    'FIREBASE_APP_ID',
    'FIREBASE_VAPID_KEY',
    'FIREBASE_MEASUREMENT_ID',
    'STORAGE_BUCKET',
    'MAX_UPLOAD_MB',
    'ALLOWED_MIME'
  ];

  const missing = requiredKeys.filter(key => !env[key]);
  const present = [...requiredKeys, ...optionalKeys].filter(key => env[key]);

  return {
    ok: missing.length === 0,
    missing,
    present,
    hasSupabase: !!(env.SUPABASE_URL && env.SUPABASE_ANON_KEY),
    hasFirebase: !!(env.FIREBASE_API_KEY && env.FIREBASE_PROJECT_ID)
  };
}

// Make globally available for legacy scripts
if (typeof window !== 'undefined') {
  window.loadEnv = loadEnv;
  window.loadEnvInline = loadEnvInline;
  window.validateEnv = validateEnv;
}