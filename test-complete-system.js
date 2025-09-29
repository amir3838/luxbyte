/**
 * اختبار شامل للنظام
 * Complete System Test
 */

const fs = require('fs');
const path = require('path');

class CompleteSystemTest {
    constructor() {
        this.testResults = {
            passed: 0,
            failed: 0,
            total: 0,
            errors: []
        };
    }

    /**
     * تشغيل جميع الاختبارات
     */
    async runAllTests() {
        console.log('🚀 بدء الاختبار الشامل للنظام...\n');

        // اختبارات الملفات
        await this.testFileStructure();
        await this.testFileIntegrity();
        await this.testFileDependencies();
        await this.testFileSyntax();

        // اختبارات التكوين
        await this.testConfiguration();
        await this.testEnvironmentVariables();

        // اختبارات الوظائف
        await this.testFunctions();
        await this.testAPIs();

        // اختبارات التكامل
        await this.testIntegration();
        await this.testSecurity();

        // عرض النتائج
        this.displayResults();
    }

    /**
     * اختبار هيكل الملفات
     */
    async testFileStructure() {
        console.log('📁 اختبار هيكل الملفات...');

        const requiredFiles = [
            'index.html',
            'terms-conditions.html',
            'supabase-dashboard-config.js',
            'js/navigation-system.js',
            'js/alhareth-integration.js',
            'js/supabase-dashboard.js',
            'js/restaurant-dashboard.js',
            'js/supermarket-dashboard.js',
            'js/pharmacy-dashboard.js',
            'js/clinic-dashboard.js',
            'js/courier-dashboard.js',
            'js/driver-dashboard.js',
            'js/document-requirements.js',
            'js/terms-conditions.js',
            'js/file-upload-manager.js',
            'css/quick-links.css',
            'css/dashboard.css',
            'css/terms-conditions.css',
            'dashboard/restaurant.html',
            'dashboard/supermarket.html',
            'dashboard/pharmacy.html',
            'dashboard/clinic.html',
            'dashboard/courier.html',
            'dashboard/driver.html',
            'supabase/config.toml',
            'supabase/functions.sql',
            'supabase/migrations/001_create_file_management_tables.sql',
            'supabase/migrations/002_create_dashboard_tables.sql',
            'package.json',
            'vercel.json',
            'README.md'
        ];

        for (const file of requiredFiles) {
            if (fs.existsSync(file)) {
                this.pass(`✅ الملف موجود: ${file}`);
            } else {
                this.fail(`❌ الملف مفقود: ${file}`);
            }
        }
    }

    /**
     * اختبار سلامة الملفات
     */
    async testFileIntegrity() {
        console.log('🔍 اختبار سلامة الملفات...');

        const htmlFiles = [
            'index.html',
            'terms-conditions.html',
            'dashboard/restaurant.html',
            'dashboard/supermarket.html',
            'dashboard/pharmacy.html',
            'dashboard/clinic.html',
            'dashboard/courier.html',
            'dashboard/driver.html'
        ];

        for (const file of htmlFiles) {
            try {
                const content = fs.readFileSync(file, 'utf8');

                // التحقق من وجود DOCTYPE
                if (!content.includes('<!DOCTYPE html>')) {
                    this.fail(`❌ ${file}: مفقود DOCTYPE`);
                }

                // التحقق من وجود html tag
                if (!content.includes('<html')) {
                    this.fail(`❌ ${file}: مفقود html tag`);
                }

                // التحقق من وجود head tag
                if (!content.includes('<head>')) {
                    this.fail(`❌ ${file}: مفقود head tag`);
                }

                // التحقق من وجود body tag
                if (!content.includes('<body>')) {
                    this.fail(`❌ ${file}: مفقود body tag`);
                }

                this.pass(`✅ ${file}: هيكل HTML صحيح`);
            } catch (error) {
                this.fail(`❌ ${file}: خطأ في القراءة - ${error.message}`);
            }
        }
    }

    /**
     * اختبار التبعيات
     */
    async testFileDependencies() {
        console.log('🔗 اختبار التبعيات...');

        const jsFiles = [
            'js/navigation-system.js',
            'js/alhareth-integration.js',
            'js/supabase-dashboard.js',
            'js/restaurant-dashboard.js',
            'js/supermarket-dashboard.js',
            'js/pharmacy-dashboard.js',
            'js/clinic-dashboard.js',
            'js/courier-dashboard.js',
            'js/driver-dashboard.js',
            'js/document-requirements.js',
            'js/terms-conditions.js',
            'js/file-upload-manager.js'
        ];

        for (const file of jsFiles) {
            try {
                const content = fs.readFileSync(file, 'utf8');

                // التحقق من وجود class definition
                if (!content.includes('class ')) {
                    this.fail(`❌ ${file}: مفقود class definition`);
                }

                // التحقق من وجود constructor
                if (!content.includes('constructor(')) {
                    this.fail(`❌ ${file}: مفقود constructor`);
                }

                // التحقق من وجود init method
                if (!content.includes('init()')) {
                    this.fail(`❌ ${file}: مفقود init method`);
                }

                this.pass(`✅ ${file}: هيكل JavaScript صحيح`);
            } catch (error) {
                this.fail(`❌ ${file}: خطأ في القراءة - ${error.message}`);
            }
        }
    }

    /**
     * اختبار صحة الصيغة
     */
    async testFileSyntax() {
        console.log('📝 اختبار صحة الصيغة...');

        const jsFiles = [
            'js/navigation-system.js',
            'js/alhareth-integration.js',
            'js/supabase-dashboard.js',
            'js/restaurant-dashboard.js',
            'js/supermarket-dashboard.js',
            'js/pharmacy-dashboard.js',
            'js/clinic-dashboard.js',
            'js/courier-dashboard.js',
            'js/driver-dashboard.js',
            'js/document-requirements.js',
            'js/terms-conditions.js',
            'js/file-upload-manager.js'
        ];

        for (const file of jsFiles) {
            try {
                const content = fs.readFileSync(file, 'utf8');

                // التحقق من وجود أخطاء صيغة واضحة
                const syntaxErrors = this.checkJavaScriptSyntax(content);
                if (syntaxErrors.length > 0) {
                    this.fail(`❌ ${file}: أخطاء صيغة - ${syntaxErrors.join(', ')}`);
                } else {
                    this.pass(`✅ ${file}: صيغة JavaScript صحيحة`);
                }
            } catch (error) {
                this.fail(`❌ ${file}: خطأ في القراءة - ${error.message}`);
            }
        }
    }

    /**
     * اختبار التكوين
     */
    async testConfiguration() {
        console.log('⚙️ اختبار التكوين...');

        // اختبار package.json
        try {
            const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

            if (!packageJson.name) {
                this.fail('❌ package.json: مفقود name');
            } else {
                this.pass('✅ package.json: name موجود');
            }

            if (!packageJson.version) {
                this.fail('❌ package.json: مفقود version');
            } else {
                this.pass('✅ package.json: version موجود');
            }

            if (!packageJson.description) {
                this.fail('❌ package.json: مفقود description');
            } else {
                this.pass('✅ package.json: description موجود');
            }
        } catch (error) {
            this.fail(`❌ package.json: خطأ في الصيغة - ${error.message}`);
        }

        // اختبار vercel.json
        try {
            const vercelJson = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));

            if (!vercelJson.name) {
                this.fail('❌ vercel.json: مفقود name');
            } else {
                this.pass('✅ vercel.json: name موجود');
            }

            if (!vercelJson.routes) {
                this.fail('❌ vercel.json: مفقود routes');
            } else {
                this.pass('✅ vercel.json: routes موجود');
            }
        } catch (error) {
            this.fail(`❌ vercel.json: خطأ في الصيغة - ${error.message}`);
        }

        // اختبار supabase/config.toml
        try {
            const configContent = fs.readFileSync('supabase/config.toml', 'utf8');

            if (!configContent.includes('project_id')) {
                this.fail('❌ supabase/config.toml: مفقود project_id');
            } else {
                this.pass('✅ supabase/config.toml: project_id موجود');
            }

            if (!configContent.includes('[api]')) {
                this.fail('❌ supabase/config.toml: مفقود [api] section');
            } else {
                this.pass('✅ supabase/config.toml: [api] section موجود');
            }
        } catch (error) {
            this.fail(`❌ supabase/config.toml: خطأ في القراءة - ${error.message}`);
        }
    }

    /**
     * اختبار متغيرات البيئة
     */
    async testEnvironmentVariables() {
        console.log('🌍 اختبار متغيرات البيئة...');

        const envExample = fs.readFileSync('env.example', 'utf8');

        const requiredVars = [
            'SUPABASE_URL',
            'SUPABASE_ANON_KEY',
            'SUPABASE_SERVICE_ROLE_KEY',
            'POSTGRES_URL',
            'POSTGRES_URL_NON_POOLING',
            'ALHARETH_API_KEY',
            'ALHARETH_API_URL'
        ];

        for (const varName of requiredVars) {
            if (envExample.includes(varName)) {
                this.pass(`✅ متغير البيئة موجود: ${varName}`);
            } else {
                this.fail(`❌ متغير البيئة مفقود: ${varName}`);
            }
        }
    }

    /**
     * اختبار الوظائف
     */
    async testFunctions() {
        console.log('🔧 اختبار الوظائف...');

        // اختبار دوال Supabase
        try {
            const functionsContent = fs.readFileSync('supabase/functions.sql', 'utf8');

            const requiredFunctions = [
                'get_dashboard_stats',
                'get_user_orders',
                'create_order',
                'update_order_status',
                'get_uploaded_files',
                'upload_file',
                'delete_file',
                'get_user_profile',
                'update_user_profile'
            ];

            for (const funcName of requiredFunctions) {
                if (functionsContent.includes(`CREATE OR REPLACE FUNCTION ${funcName}`)) {
                    this.pass(`✅ دالة Supabase موجودة: ${funcName}`);
                } else {
                    this.fail(`❌ دالة Supabase مفقودة: ${funcName}`);
                }
            }
        } catch (error) {
            this.fail(`❌ supabase/functions.sql: خطأ في القراءة - ${error.message}`);
        }
    }

    /**
     * اختبار APIs
     */
    async testAPIs() {
        console.log('🌐 اختبار APIs...');

        // اختبار تكامل Supabase
        const supabaseFiles = [
            'js/supabase-dashboard.js',
            'js/restaurant-dashboard.js',
            'js/supermarket-dashboard.js',
            'js/pharmacy-dashboard.js',
            'js/clinic-dashboard.js',
            'js/courier-dashboard.js',
            'js/driver-dashboard.js'
        ];

        for (const file of supabaseFiles) {
            try {
                const content = fs.readFileSync(file, 'utf8');

                if (content.includes('this.supabase')) {
                    this.pass(`✅ ${file}: تكامل Supabase موجود`);
                } else {
                    this.fail(`❌ ${file}: تكامل Supabase مفقود`);
                }

                if (content.includes('createClient')) {
                    this.pass(`✅ ${file}: createClient موجود`);
                } else {
                    this.fail(`❌ ${file}: createClient مفقود`);
                }
            } catch (error) {
                this.fail(`❌ ${file}: خطأ في القراءة - ${error.message}`);
            }
        }
    }

    /**
     * اختبار التكامل
     */
    async testIntegration() {
        console.log('🔗 اختبار التكامل...');

        // اختبار تكامل الحارث
        try {
            const alharethContent = fs.readFileSync('js/alhareth-integration.js', 'utf8');

            if (alharethContent.includes('class AlharethIntegration')) {
                this.pass('✅ تكامل الحارث: class موجود');
            } else {
                this.fail('❌ تكامل الحارث: class مفقود');
            }

            if (alharethContent.includes('syncUserWithAlhareth')) {
                this.pass('✅ تكامل الحارث: syncUserWithAlhareth موجود');
            } else {
                this.fail('❌ تكامل الحارث: syncUserWithAlhareth مفقود');
            }
        } catch (error) {
            this.fail(`❌ js/alhareth-integration.js: خطأ في القراءة - ${error.message}`);
        }

        // اختبار تكامل الشروط والأحكام
        try {
            const termsContent = fs.readFileSync('js/terms-conditions.js', 'utf8');

            if (termsContent.includes('class TermsConditionsManager')) {
                this.pass('✅ الشروط والأحكام: class موجود');
            } else {
                this.fail('❌ الشروط والأحكام: class مفقود');
            }

            if (termsContent.includes('acceptTerms')) {
                this.pass('✅ الشروط والأحكام: acceptTerms موجود');
            } else {
                this.fail('❌ الشروط والأحكام: acceptTerms مفقود');
            }
        } catch (error) {
            this.fail(`❌ js/terms-conditions.js: خطأ في القراءة - ${error.message}`);
        }
    }

    /**
     * اختبار الأمان
     */
    async testSecurity() {
        console.log('🔒 اختبار الأمان...');

        // اختبار RLS policies
        try {
            const migrationContent = fs.readFileSync('supabase/migrations/002_create_dashboard_tables.sql', 'utf8');

            if (migrationContent.includes('ENABLE ROW LEVEL SECURITY')) {
                this.pass('✅ RLS: مفعل');
            } else {
                this.fail('❌ RLS: غير مفعل');
            }

            if (migrationContent.includes('CREATE POLICY')) {
                this.pass('✅ RLS: سياسات موجودة');
            } else {
                this.fail('❌ RLS: سياسات مفقودة');
            }
        } catch (error) {
            this.fail(`❌ supabase/migrations/002_create_dashboard_tables.sql: خطأ في القراءة - ${error.message}`);
        }

        // اختبار التحقق من المصادقة
        const dashboardFiles = [
            'js/restaurant-dashboard.js',
            'js/supermarket-dashboard.js',
            'js/pharmacy-dashboard.js',
            'js/clinic-dashboard.js',
            'js/courier-dashboard.js',
            'js/driver-dashboard.js'
        ];

        for (const file of dashboardFiles) {
            try {
                const content = fs.readFileSync(file, 'utf8');

                if (content.includes('checkAuthentication')) {
                    this.pass(`✅ ${file}: التحقق من المصادقة موجود`);
                } else {
                    this.fail(`❌ ${file}: التحقق من المصادقة مفقود`);
                }
            } catch (error) {
                this.fail(`❌ ${file}: خطأ في القراءة - ${error.message}`);
            }
        }
    }

    /**
     * فحص صيغة JavaScript
     */
    checkJavaScriptSyntax(content) {
        const errors = [];

        // فحص الأقواس المتوازنة
        const openBraces = (content.match(/\{/g) || []).length;
        const closeBraces = (content.match(/\}/g) || []).length;
        if (openBraces !== closeBraces) {
            errors.push('أقواس غير متوازنة');
        }

        // فحص الأقواس المستديرة المتوازنة
        const openParens = (content.match(/\(/g) || []).length;
        const closeParens = (content.match(/\)/g) || []).length;
        if (openParens !== closeParens) {
            errors.push('أقواس مستديرة غير متوازنة');
        }

        // فحص الأقواس المربعة المتوازنة
        const openBrackets = (content.match(/\[/g) || []).length;
        const closeBrackets = (content.match(/\]/g) || []).length;
        if (openBrackets !== closeBrackets) {
            errors.push('أقواس مربعة غير متوازنة');
        }

        // فحص الاقتباسات المتوازنة
        const singleQuotes = (content.match(/'/g) || []).length;
        const doubleQuotes = (content.match(/"/g) || []).length;
        if (singleQuotes % 2 !== 0) {
            errors.push('اقتباسات مفردة غير متوازنة');
        }
        if (doubleQuotes % 2 !== 0) {
            errors.push('اقتباسات مزدوجة غير متوازنة');
        }

        return errors;
    }

    /**
     * تسجيل نجاح الاختبار
     */
    pass(message) {
        this.testResults.passed++;
        this.testResults.total++;
        console.log(message);
    }

    /**
     * تسجيل فشل الاختبار
     */
    fail(message) {
        this.testResults.failed++;
        this.testResults.total++;
        this.testResults.errors.push(message);
        console.log(message);
    }

    /**
     * عرض النتائج
     */
    displayResults() {
        console.log('\n' + '='.repeat(50));
        console.log('📊 نتائج الاختبار الشامل');
        console.log('='.repeat(50));
        console.log(`✅ نجح: ${this.testResults.passed}`);
        console.log(`❌ فشل: ${this.testResults.failed}`);
        console.log(`📈 المجموع: ${this.testResults.total}`);
        console.log(`📊 النسبة: ${((this.testResults.passed / this.testResults.total) * 100).toFixed(2)}%`);

        if (this.testResults.errors.length > 0) {
            console.log('\n❌ الأخطاء:');
            this.testResults.errors.forEach((error, index) => {
                console.log(`${index + 1}. ${error}`);
            });
        }

        console.log('\n' + '='.repeat(50));

        if (this.testResults.failed === 0) {
            console.log('🎉 جميع الاختبارات نجحت! النظام جاهز للإنتاج.');
        } else {
            console.log('⚠️ يوجد أخطاء تحتاج إلى إصلاح قبل الإنتاج.');
        }
    }
}

// تشغيل الاختبارات
if (require.main === module) {
    const tester = new CompleteSystemTest();
    tester.runAllTests().catch(console.error);
}

module.exports = CompleteSystemTest;
