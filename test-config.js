/**
 * ملف تكوين الاختبار
 * Test Configuration File
 */

// إعدادات Supabase
const config = {
    supabaseUrl: 'https://qjsvgpvbtrcnbhcjdcci.supabase.co',
    supabaseAnonKey: 'YOUR_SUPABASE_ANON_KEY', // يجب استبدالها بالمفتاح الفعلي
    supabaseServiceKey: 'YOUR_SUPABASE_SERVICE_KEY', // يجب استبدالها بالمفتاح الفعلي

    // إعدادات الاختبار
    testSettings: {
        timeout: 10000, // 10 ثواني
        retries: 3,
        delay: 1000 // 1 ثانية بين الاختبارات
    },

    // إعدادات الملفات التجريبية
    testFiles: {
        small: {
            name: 'test-small.txt',
            content: 'Small test file',
            size: 15
        },
        medium: {
            name: 'test-medium.txt',
            content: 'Medium test file content '.repeat(100),
            size: 2500
        }
    }
};

module.exports = config;
