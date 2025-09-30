/**
 * Environment Variables Loader
 * محمل متغيرات البيئة
 *
 * Features:
 * - Runtime environment loading
 * - Fallback to config.json
 * - Validation of required keys
 * - Caching for performance
 */

let cachedEnv = null;

/**
 * Load environment variables
 * تحميل متغيرات البيئة
 */
export async function loadEnv() {
    // Return cached version if available
    if (cachedEnv) {
        console.log('📦 Using cached environment variables');
        return cachedEnv;
    }

    console.log('🔍 Loading environment variables...');

    try {
        // Try window.__ENV first (if injected by build process)
        if (window.__ENV__ && window.__ENV__.NEXT_PUBLIC_SUPABASE_URL) {
            console.log('✅ Found environment variables in window.__ENV__');
            cachedEnv = {
                SUPABASE_URL: window.__ENV__.NEXT_PUBLIC_SUPABASE_URL,
                SUPABASE_ANON_KEY: window.__ENV__.NEXT_PUBLIC_SUPABASE_ANON_KEY,
                STORAGE_BUCKET: 'kyc_docs',
                MAX_UPLOAD_MB: 10,
                ALLOWED_MIME: ['image/jpeg', 'image/png', 'application/pdf'],
                FIREBASE_API_KEY: window.__ENV__.NEXT_PUBLIC_FIREBASE_API_KEY,
                FIREBASE_AUTH_DOMAIN: window.__ENV__.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
                FIREBASE_PROJECT_ID: window.__ENV__.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
                FIREBASE_MESSAGING_SENDER_ID: window.__ENV__.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
                FIREBASE_APP_ID: window.__ENV__.NEXT_PUBLIC_FIREBASE_APP_ID,
                FIREBASE_VAPID_KEY: window.__ENV__.NEXT_PUBLIC_FIREBASE_VAPID_KEY
            };
            return cachedEnv;
        }

        // Fallback to config.json
        console.log('📄 Loading from config.json...');
        const response = await fetch('/config.json', {
            cache: 'no-store',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`ENV_FETCH_FAILED: ${response.status} ${response.statusText}`);
        }

        const env = await response.json();
        console.log('✅ Environment variables loaded from config.json');

        // Cache the result
        cachedEnv = env;
        return env;

    } catch (error) {
        console.error('❌ Failed to load environment variables:', error);
        throw new Error(`فشل في تحميل متغيرات البيئة: ${error.message}`);
    }
}

/**
 * Validate environment variables
 * التحقق من صحة متغيرات البيئة
 */
export function validateEnv(env) {
    const required = [
        'SUPABASE_URL',
        'SUPABASE_ANON_KEY',
        'STORAGE_BUCKET'
    ];

    const missing = required.filter(key => {
        const value = env[key];
        return !value || String(value).trim() === '';
    });

    return {
        ok: missing.length === 0,
        missing: missing
    };
}

/**
 * Get environment variable with fallback
 * الحصول على متغير بيئة مع قيمة افتراضية
 */
export function getEnvVar(key, fallback = null) {
    if (!cachedEnv) {
        console.warn('⚠️ Environment not loaded yet, returning fallback for:', key);
        return fallback;
    }
    return cachedEnv[key] || fallback;
}

/**
 * Clear cached environment (for testing)
 * مسح متغيرات البيئة المحفوظة (للاختبار)
 */
export function clearEnvCache() {
    cachedEnv = null;
    console.log('🗑️ Environment cache cleared');
}
