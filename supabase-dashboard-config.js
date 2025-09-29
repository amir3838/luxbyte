/**
 * تكوين Supabase للوحات التحكم
 * Supabase Dashboard Configuration
 */

// تكوين Supabase
const SUPABASE_CONFIG = {
    // سيتم استبدالها بمتغيرات البيئة في الإنتاج
    url: process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL',
    anonKey: process.env.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || 'YOUR_SUPABASE_SERVICE_ROLE_KEY'
};

// تكوين الحارث
const ALHARETH_CONFIG = {
    apiUrl: process.env.ALHARETH_API_URL || 'https://api.alhareth.com',
    apiKey: process.env.ALHARETH_API_KEY || 'YOUR_ALHARETH_API_KEY'
};

// تكوين التطبيق
const APP_CONFIG = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    vercelUrl: process.env.VERCEL_URL || 'http://localhost:3000'
};

// تصدير التكوين
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SUPABASE_CONFIG,
        ALHARETH_CONFIG,
        APP_CONFIG
    };
} else {
    window.SUPABASE_CONFIG = SUPABASE_CONFIG;
    window.ALHARETH_CONFIG = ALHARETH_CONFIG;
    window.APP_CONFIG = APP_CONFIG;
}
