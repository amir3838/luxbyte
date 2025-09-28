/**
 * اختبار مبسط للباك إند - بدون مفاتيح Supabase
 * Simple Backend Test - Without Supabase Keys
 */

const fs = require('fs');
const path = require('path');

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

// نتائج الاختبارات
const testResults = {
    files: { passed: false, error: null, details: [] },
    structure: { passed: false, error: null, details: [] },
    config: { passed: false, error: null, details: [] },
    database: { passed: false, error: null, details: [] },
    storage: { passed: false, error: null, details: [] },
    frontend: { passed: false, error: null, details: [] }
};

// اختبار وجود الملفات
function testFiles() {
    log(colors.cyan, '\n📁 اختبار وجود الملفات...');

    try {
        const requiredFiles = [
            'index.html',
            'file-upload.html',
            'js/file-upload-manager.js',
            'supabase/migrations/001_create_file_management_tables.sql',
            'supabase/storage-setup.sql',
            'package.json',
            'vercel.json',
            'README.md'
        ];

        for (const file of requiredFiles) {
            if (fs.existsSync(file)) {
                testResults.files.details.push(`✅ ${file}: موجود`);
            } else {
                testResults.files.details.push(`❌ ${file}: مفقود`);
                throw new Error(`الملف ${file} مفقود`);
            }
        }

        testResults.files.passed = true;
        log(colors.green, '✅ اختبار الملفات نجح');

    } catch (error) {
        testResults.files.passed = false;
        testResults.files.error = error.message;
        testResults.files.details.push(`❌ فشل اختبار الملفات: ${error.message}`);

        log(colors.red, `❌ اختبار الملفات فشل: ${error.message}`);
    }
}

// اختبار هيكل المشروع
function testStructure() {
    log(colors.cyan, '\n🏗️ اختبار هيكل المشروع...');

    try {
        const requiredDirs = [
            'js',
            'supabase',
            'supabase/migrations',
            'assets',
            'assets/images',
            'assets/icons'
        ];

        for (const dir of requiredDirs) {
            if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) {
                testResults.structure.details.push(`✅ ${dir}/: مجلد موجود`);
            } else {
                testResults.structure.details.push(`❌ ${dir}/: مجلد مفقود`);
                throw new Error(`المجلد ${dir} مفقود`);
            }
        }

        testResults.structure.passed = true;
        log(colors.green, '✅ اختبار الهيكل نجح');

    } catch (error) {
        testResults.structure.passed = false;
        testResults.structure.error = error.message;
        testResults.structure.details.push(`❌ فشل اختبار الهيكل: ${error.message}`);

        log(colors.red, `❌ اختبار الهيكل فشل: ${error.message}`);
    }
}

// اختبار ملفات التكوين
function testConfig() {
    log(colors.cyan, '\n⚙️ اختبار ملفات التكوين...');

    try {
        // اختبار package.json
        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        testResults.config.details.push(`✅ package.json: صالح`);
        testResults.config.details.push(`   - الاسم: ${packageJson.name}`);
        testResults.config.details.push(`   - الإصدار: ${packageJson.version}`);
        testResults.config.details.push(`   - الوصف: ${packageJson.description}`);

        // اختبار vercel.json
        const vercelJson = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
        testResults.config.details.push(`✅ vercel.json: صالح`);
        testResults.config.details.push(`   - الإصدار: ${vercelJson.version}`);
        testResults.config.details.push(`   - الاسم: ${vercelJson.name}`);

        // اختبار .gitignore
        if (fs.existsSync('.gitignore')) {
            testResults.config.details.push(`✅ .gitignore: موجود`);
        } else {
            testResults.config.details.push(`⚠️ .gitignore: مفقود`);
        }

        testResults.config.passed = true;
        log(colors.green, '✅ اختبار التكوين نجح');

    } catch (error) {
        testResults.config.passed = false;
        testResults.config.error = error.message;
        testResults.config.details.push(`❌ فشل اختبار التكوين: ${error.message}`);

        log(colors.red, `❌ اختبار التكوين فشل: ${error.message}`);
    }
}

// اختبار ملفات قاعدة البيانات
function testDatabase() {
    log(colors.cyan, '\n🗄️ اختبار ملفات قاعدة البيانات...');

    try {
        // اختبار ملف المايجريشن
        const migrationFile = 'supabase/migrations/001_create_file_management_tables.sql';
        if (fs.existsSync(migrationFile)) {
            const migrationContent = fs.readFileSync(migrationFile, 'utf8');

            const requiredTables = [
                'activity_types',
                'document_types',
                'registration_requests',
                'uploaded_files'
            ];

            for (const table of requiredTables) {
                if (migrationContent.includes(`CREATE TABLE`) && migrationContent.includes(table)) {
                    testResults.database.details.push(`✅ جدول ${table}: معرف في المايجريشن`);
                } else {
                    testResults.database.details.push(`❌ جدول ${table}: غير موجود في المايجريشن`);
                    throw new Error(`الجدول ${table} غير موجود في المايجريشن`);
                }
            }
        } else {
            throw new Error('ملف المايجريشن مفقود');
        }

        // اختبار ملف Storage setup
        const storageFile = 'supabase/storage-setup.sql';
        if (fs.existsSync(storageFile)) {
            const storageContent = fs.readFileSync(storageFile, 'utf8');

            if (storageContent.includes('documents') && storageContent.includes('public-images')) {
                testResults.database.details.push(`✅ Storage setup: صالح`);
            } else {
                testResults.database.details.push(`⚠️ Storage setup: قد يكون غير مكتمل`);
            }
        } else {
            testResults.database.details.push(`⚠️ Storage setup: مفقود`);
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

// اختبار ملفات التخزين
function testStorage() {
    log(colors.cyan, '\n☁️ اختبار ملفات التخزين...');

    try {
        // اختبار مجلد assets
        const assetsDir = 'assets';
        if (fs.existsSync(assetsDir)) {
            const assetsContent = fs.readdirSync(assetsDir);
            testResults.storage.details.push(`✅ مجلد assets: موجود (${assetsContent.length} عنصر)`);

            // اختبار مجلد الصور
            const imagesDir = path.join(assetsDir, 'images');
            if (fs.existsSync(imagesDir)) {
                const imagesContent = fs.readdirSync(imagesDir);
                testResults.storage.details.push(`✅ مجلد الصور: موجود (${imagesContent.length} صورة)`);
            }

            // اختبار مجلد الأيقونات
            const iconsDir = path.join(assetsDir, 'icons');
            if (fs.existsSync(iconsDir)) {
                const iconsContent = fs.readdirSync(iconsDir);
                testResults.storage.details.push(`✅ مجلد الأيقونات: موجود (${iconsContent.length} أيقونة)`);
            }
        } else {
            throw new Error('مجلد assets مفقود');
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

// اختبار الواجهة الأمامية
function testFrontend() {
    log(colors.cyan, '\n🎨 اختبار الواجهة الأمامية...');

    try {
        // اختبار index.html
        const indexContent = fs.readFileSync('index.html', 'utf8');
        if (indexContent.includes('<!DOCTYPE html>') && indexContent.includes('LUXBYTE')) {
            testResults.frontend.details.push(`✅ index.html: صالح`);
        } else {
            throw new Error('index.html غير صالح');
        }

        // اختبار file-upload.html
        const uploadContent = fs.readFileSync('file-upload.html', 'utf8');
        if (uploadContent.includes('<!DOCTYPE html>') && uploadContent.includes('رفع المستندات')) {
            testResults.frontend.details.push(`✅ file-upload.html: صالح`);
        } else {
            throw new Error('file-upload.html غير صالح');
        }

        // اختبار file-upload-manager.js
        const managerContent = fs.readFileSync('js/file-upload-manager.js', 'utf8');
        if (managerContent.includes('class FileUploadManager') && managerContent.includes('uploadFile')) {
            testResults.frontend.details.push(`✅ file-upload-manager.js: صالح`);
        } else {
            throw new Error('file-upload-manager.js غير صالح');
        }

        // اختبار CSS
        if (indexContent.includes('<style>') || indexContent.includes('style.css')) {
            testResults.frontend.details.push(`✅ CSS: موجود`);
        } else {
            testResults.frontend.details.push(`⚠️ CSS: قد يكون مفقود`);
        }

        // اختبار JavaScript
        if (indexContent.includes('<script>') || indexContent.includes('app.js')) {
            testResults.frontend.details.push(`✅ JavaScript: موجود`);
        } else {
            testResults.frontend.details.push(`⚠️ JavaScript: قد يكون مفقود`);
        }

        testResults.frontend.passed = true;
        log(colors.green, '✅ اختبار الواجهة الأمامية نجح');

    } catch (error) {
        testResults.frontend.passed = false;
        testResults.frontend.error = error.message;
        testResults.frontend.details.push(`❌ فشل اختبار الواجهة الأمامية: ${error.message}`);

        log(colors.red, `❌ اختبار الواجهة الأمامية فشل: ${error.message}`);
    }
}

// عرض النتائج النهائية
function showResults() {
    log(colors.magenta, '\n' + '='.repeat(60));
    log(colors.bright, '📊 ملخص نتائج الاختبار المبسط');
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
        log(colors.green, '🎉 جميع الاختبارات نجحت! المشروع جاهز للاستخدام.');
    } else if (successRate >= 80) {
        log(colors.yellow, '⚠️ معظم الاختبارات نجحت. يرجى مراجعة الاختبارات الفاشلة.');
    } else {
        log(colors.red, '❌ العديد من الاختبارات فشلت. يرجى مراجعة الإعدادات.');
    }

    log(colors.magenta, '='.repeat(60));
}

// تشغيل جميع الاختبارات
function runAllTests() {
    log(colors.bright, '🚀 بدء اختبار الباك إند المبسط - Luxbyte File Management System');
    log(colors.blue, `📅 ${new Date().toLocaleString('ar-EG')}`);

    testFiles();
    testStructure();
    testConfig();
    testDatabase();
    testStorage();
    testFrontend();

    showResults();
}

// تشغيل الاختبارات
if (require.main === module) {
    runAllTests();
}

module.exports = {
    testFiles,
    testStructure,
    testConfig,
    testDatabase,
    testStorage,
    testFrontend,
    runAllTests
};
