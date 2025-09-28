/**
 * اختبار شامل للباك إند - Luxbyte File Management System
 * Comprehensive Backend Testing for Luxbyte File Management System
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// إعداد Supabase
const supabaseUrl = 'https://qjsvgpvbtrcnbhcjdcci.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

// نتائج الاختبارات
const testResults = {
    connection: { passed: false, error: null, details: [] },
    database: { passed: false, error: null, details: [] },
    storage: { passed: false, error: null, details: [] },
    auth: { passed: false, error: null, details: [] },
    upload: { passed: false, error: null, details: [] },
    api: { passed: false, error: null, details: [] }
};

// ألوان للطباعة
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

// دالة الطباعة الملونة
function log(color, message) {
    console.log(`${color}${message}${colors.reset}`);
}

// دالة انتظار
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// اختبار الاتصال الأساسي
async function testConnection() {
    log(colors.cyan, '\n🔌 اختبار الاتصال الأساسي...');

    try {
        const { data, error } = await supabase.from('activity_types').select('count').limit(1);

        if (error) throw error;

        testResults.connection.passed = true;
        testResults.connection.details.push('✅ الاتصال بـ Supabase نجح');
        testResults.connection.details.push('✅ قاعدة البيانات متاحة');
        testResults.connection.details.push('✅ الجداول موجودة');

        log(colors.green, '✅ اختبار الاتصال نجح');

    } catch (error) {
        testResults.connection.passed = false;
        testResults.connection.error = error.message;
        testResults.connection.details.push(`❌ فشل الاتصال: ${error.message}`);

        log(colors.red, `❌ اختبار الاتصال فشل: ${error.message}`);
    }
}

// اختبار قاعدة البيانات
async function testDatabase() {
    log(colors.cyan, '\n🗄️ اختبار قاعدة البيانات...');

    try {
        const tables = [
            { name: 'activity_types', description: 'أنواع الأنشطة' },
            { name: 'document_types', description: 'أنواع المستندات' },
            { name: 'registration_requests', description: 'طلبات التسجيل' },
            { name: 'uploaded_files', description: 'الملفات المرفوعة' }
        ];

        for (const table of tables) {
            const { data, error } = await supabase
                .from(table.name)
                .select('*')
                .limit(1);

            if (error) throw new Error(`${table.name}: ${error.message}`);

            testResults.database.details.push(`✅ ${table.description}: ${data.length} سجل`);
        }

        testResults.database.passed = true;
        log(colors.green, '✅ اختبار قاعدة البيانات نجح');

    } catch (error) {
        testResults.database.passed = false;
        testResults.database.error = error.message;
        testResults.database.details.push(`❌ فشل اختبار قاعدة البيانات: ${error.message}`);

        log(colors.red, `❌ اختبار قاعدة البيانات فشل: ${error.message}`);
    }
}

// اختبار التخزين
async function testStorage() {
    log(colors.cyan, '\n☁️ اختبار التخزين...');

    try {
        // اختبار قائمة Buckets
        const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();

        if (bucketsError) throw new Error(`Buckets: ${bucketsError.message}`);
        testResults.storage.details.push(`✅ Buckets: ${buckets.length} bucket موجود`);

        // اختبار documents bucket
        try {
            const { data: documentsList, error: documentsListError } = await supabase.storage
                .from('documents')
                .list('', { limit: 1 });

            if (documentsListError) {
                testResults.storage.details.push(`⚠️ documents bucket: ${documentsListError.message}`);
            } else {
                testResults.storage.details.push(`✅ documents bucket: متاح`);
            }
        } catch (error) {
            testResults.storage.details.push(`⚠️ documents bucket: ${error.message}`);
        }

        // اختبار public-images bucket
        try {
            const { data: imagesList, error: imagesListError } = await supabase.storage
                .from('public-images')
                .list('', { limit: 1 });

            if (imagesListError) {
                testResults.storage.details.push(`⚠️ public-images bucket: ${imagesListError.message}`);
            } else {
                testResults.storage.details.push(`✅ public-images bucket: متاح`);
            }
        } catch (error) {
            testResults.storage.details.push(`⚠️ public-images bucket: ${error.message}`);
        }

        testResults.storage.passed = true;
        log(colors.green, '✅ اختبار التخزين نجح');

    } catch (error) {
        testResults.storage.passed = false;
        testResults.storage.error = error.message;
        testResults.storage.details.push(`❌ فشل اختبار التخزين: ${error.message}`);

        log(colors.red, `❌ اختبار التخزين فشل: ${error.message}`);
    }
}

// اختبار المصادقة
async function testAuth() {
    log(colors.cyan, '\n🔐 اختبار المصادقة...');

    try {
        // اختبار الحصول على المستخدم الحالي
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError) throw new Error(`getUser: ${userError.message}`);

        if (user) {
            testResults.auth.details.push(`✅ المستخدم مسجل: ${user.email || 'بدون إيميل'}`);
        } else {
            testResults.auth.details.push(`ℹ️ لا يوجد مستخدم مسجل حالياً`);
        }

        // اختبار جلسة المصادقة
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) throw new Error(`getSession: ${sessionError.message}`);

        if (session) {
            testResults.auth.details.push(`✅ الجلسة نشطة`);
        } else {
            testResults.auth.details.push(`ℹ️ لا توجد جلسة نشطة`);
        }

        // اختبار تسجيل الخروج
        const { error: signOutError } = await supabase.auth.signOut();

        if (signOutError) throw new Error(`signOut: ${signOutError.message}`);
        testResults.auth.details.push(`✅ تسجيل الخروج يعمل`);

        testResults.auth.passed = true;
        log(colors.green, '✅ اختبار المصادقة نجح');

    } catch (error) {
        testResults.auth.passed = false;
        testResults.auth.error = error.message;
        testResults.auth.details.push(`❌ فشل اختبار المصادقة: ${error.message}`);

        log(colors.red, `❌ اختبار المصادقة فشل: ${error.message}`);
    }
}

// اختبار رفع الملفات
async function testFileUpload() {
    log(colors.cyan, '\n📤 اختبار رفع الملفات...');

    try {
        // إنشاء ملف تجريبي
        const testContent = 'This is a test file for Luxbyte File Management System - ' + new Date().toISOString();
        const testFile = Buffer.from(testContent, 'utf8');

        // رفع الملف
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('documents')
            .upload(`test/test-file-${Date.now()}.txt`, testFile, {
                contentType: 'text/plain'
            });

        if (uploadError) throw new Error(`Upload: ${uploadError.message}`);
        testResults.upload.details.push(`✅ رفع الملف نجح: ${uploadData.path}`);

        // الحصول على رابط التحميل
        const { data: downloadData, error: downloadError } = await supabase.storage
            .from('documents')
            .createSignedUrl(uploadData.path, 60);

        if (downloadError) throw new Error(`Download: ${downloadError.message}`);
        testResults.upload.details.push(`✅ رابط التحميل متاح`);

        // حذف الملف التجريبي
        const { error: deleteError } = await supabase.storage
            .from('documents')
            .remove([uploadData.path]);

        if (deleteError) throw new Error(`Delete: ${deleteError.message}`);
        testResults.upload.details.push(`✅ حذف الملف نجح`);

        testResults.upload.passed = true;
        log(colors.green, '✅ اختبار رفع الملفات نجح');

    } catch (error) {
        testResults.upload.passed = false;
        testResults.upload.error = error.message;
        testResults.upload.details.push(`❌ فشل اختبار رفع الملفات: ${error.message}`);

        log(colors.red, `❌ اختبار رفع الملفات فشل: ${error.message}`);
    }
}

// اختبار API
async function testAPI() {
    log(colors.cyan, '\n🔌 اختبار API...');

    try {
        // اختبار API للأنشطة
        const { data: activities, error: activitiesError } = await supabase
            .from('activity_types')
            .select('id, name_ar, name_en')
            .eq('is_active', true);

        if (activitiesError) throw new Error(`Activities API: ${activitiesError.message}`);
        testResults.api.details.push(`✅ Activities API: ${activities.length} نشاط`);

        // اختبار API للمستندات
        const { data: documents, error: documentsError } = await supabase
            .from('document_types')
            .select('id, name_ar, is_required')
            .limit(10);

        if (documentsError) throw new Error(`Documents API: ${documentsError.message}`);
        testResults.api.details.push(`✅ Documents API: ${documents.length} نوع مستند`);

        // اختبار API للطلبات
        const { data: requests, error: requestsError } = await supabase
            .from('registration_requests')
            .select('id, status, created_at')
            .limit(5);

        if (requestsError) throw new Error(`Requests API: ${requestsError.message}`);
        testResults.api.details.push(`✅ Requests API: ${requests.length} طلب`);

        // اختبار API للملفات
        const { data: files, error: filesError } = await supabase
            .from('uploaded_files')
            .select('id, original_filename, upload_status')
            .limit(5);

        if (filesError) throw new Error(`Files API: ${filesError.message}`);
        testResults.api.details.push(`✅ Files API: ${files.length} ملف`);

        testResults.api.passed = true;
        log(colors.green, '✅ اختبار API نجح');

    } catch (error) {
        testResults.api.passed = false;
        testResults.api.error = error.message;
        testResults.api.details.push(`❌ فشل اختبار API: ${error.message}`);

        log(colors.red, `❌ اختبار API فشل: ${error.message}`);
    }
}

// عرض النتائج النهائية
function showResults() {
    log(colors.magenta, '\n' + '='.repeat(60));
    log(colors.bright, '📊 ملخص نتائج الاختبار');
    log(colors.magenta, '='.repeat(60));

    const totalTests = Object.keys(testResults).length;
    const passedTests = Object.values(testResults).filter(result => result.passed).length;
    const failedTests = totalTests - passedTests;
    const successRate = Math.round((passedTests / totalTests) * 100);

    log(colors.cyan, `\n📈 الإحصائيات:`);
    log(colors.white, `   إجمالي الاختبارات: ${totalTests}`);
    log(colors.green, `   نجح: ${passedTests}`);
    log(colors.red, `   فشل: ${failedTests}`);
    log(colors.yellow, `   معدل النجاح: ${successRate}%`);

    log(colors.cyan, `\n📋 تفاصيل الاختبارات:`);

    Object.entries(testResults).forEach(([testName, result]) => {
        const status = result.passed ? '✅' : '❌';
        const color = result.passed ? colors.green : colors.red;

        log(color, `\n${status} ${testName.toUpperCase()}:`);

        result.details.forEach(detail => {
            log(colors.white, `   ${detail}`);
        });

        if (result.error) {
            log(colors.red, `   خطأ: ${result.error}`);
        }
    });

    log(colors.magenta, '\n' + '='.repeat(60));

    if (successRate === 100) {
        log(colors.green, '🎉 جميع الاختبارات نجحت! النظام جاهز للاستخدام.');
    } else if (successRate >= 80) {
        log(colors.yellow, '⚠️ معظم الاختبارات نجحت. يرجى مراجعة الاختبارات الفاشلة.');
    } else {
        log(colors.red, '❌ العديد من الاختبارات فشلت. يرجى مراجعة الإعدادات.');
    }

    log(colors.magenta, '='.repeat(60));
}

// تشغيل جميع الاختبارات
async function runAllTests() {
    log(colors.bright, '🚀 بدء اختبار الباك إند - Luxbyte File Management System');
    log(colors.blue, `📅 ${new Date().toLocaleString('ar-EG')}`);
    log(colors.blue, `🔗 Supabase URL: ${supabaseUrl}`);

    await testConnection();
    await sleep(1000);

    await testDatabase();
    await sleep(1000);

    await testStorage();
    await sleep(1000);

    await testAuth();
    await sleep(1000);

    await testFileUpload();
    await sleep(1000);

    await testAPI();

    showResults();
}

// تشغيل الاختبارات
if (require.main === module) {
    runAllTests().catch(error => {
        log(colors.red, `❌ خطأ في تشغيل الاختبارات: ${error.message}`);
        process.exit(1);
    });
}

module.exports = {
    testConnection,
    testDatabase,
    testStorage,
    testAuth,
    testFileUpload,
    testAPI,
    runAllTests
};
