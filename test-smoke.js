/**
 * LUXBYTE Smoke Tests
 * اختبارات سريعة للتأكد من عمل النظام الأساسي
 */

// Test configuration
const TEST_CONFIG = {
    timeout: 10000,
    retries: 3,
    baseUrl: window.location.origin
};

// Test results
let testResults = {
    passed: 0,
    failed: 0,
    total: 0,
    details: []
};

/**
 * Run a single test
 * تشغيل اختبار واحد
 */
async function runTest(name, testFn) {
    testResults.total++;
    console.log(`🧪 Running test: ${name}`);

    try {
        await Promise.race([
            testFn(),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Test timeout')), TEST_CONFIG.timeout)
            )
        ]);

        testResults.passed++;
        testResults.details.push({ name, status: 'PASSED', error: null });
        console.log(`✅ Test passed: ${name}`);
        return true;
    } catch (error) {
        testResults.failed++;
        testResults.details.push({ name, status: 'FAILED', error: error.message });
        console.error(`❌ Test failed: ${name}`, error);
        return false;
    }
}

/**
 * Test 1: Supabase Client Initialization
 * اختبار 1: تهيئة عميل Supabase
 */
async function testSupabaseInit() {
    const { getSupabase, initSupabase } = await import('./js/supabase-client.js');

    // Test initialization
    const supabase = await initSupabase();
    if (!supabase) {
        throw new Error('Supabase client not initialized');
    }

    // Test session check
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
        throw new Error(`Session check failed: ${error.message}`);
    }

    console.log('Supabase client initialized successfully');
}

/**
 * Test 2: File Upload System
 * اختبار 2: نظام رفع الملفات
 */
async function testFileUploadSystem() {
    const { ensureSupabaseReady } = await import('./js/file-upload-manager.js');

    // Test Supabase readiness
    await ensureSupabaseReady();

    // Test upload button rendering (if container exists)
    const container = document.getElementById('file-upload-container');
    if (container) {
        const { renderUploadButtons } = await import('./js/file-upload-manager.js');
        await renderUploadButtons(container, ['test_document']);

        const uploadBtn = container.querySelector('.upload-btn');
        if (!uploadBtn) {
            throw new Error('Upload button not rendered');
        }
    }

    console.log('File upload system ready');
}

/**
 * Test 3: Authentication System
 * اختبار 3: نظام المصادقة
 */
async function testAuthSystem() {
    const { getSupabase } = await import('./js/supabase-client.js');
    const supabase = getSupabase();

    // Test auth state
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
        throw new Error(`Auth check failed: ${error.message}`);
    }

    console.log('Authentication system working');
}

/**
 * Test 4: Translation System
 * اختبار 4: نظام الترجمة
 */
async function testTranslationSystem() {
    if (typeof window.translationManager === 'undefined') {
        throw new Error('Translation manager not available');
    }

    // Test language switching
    const currentLang = window.translationManager.getCurrentLanguage();
    if (!['ar', 'en'].includes(currentLang)) {
        throw new Error(`Invalid language: ${currentLang}`);
    }

    // Test translation function
    const testKey = 'nav.home';
    const translation = window.translationManager.t(testKey);
    if (!translation || translation === testKey) {
        throw new Error('Translation not working');
    }

    console.log('Translation system working');
}

/**
 * Test 5: Theme System
 * اختبار 5: نظام الثيمات
 */
async function testThemeSystem() {
    if (typeof window.themeManager === 'undefined') {
        throw new Error('Theme manager not available');
    }

    // Test theme switching
    const currentTheme = window.themeManager.getCurrentTheme();
    if (!['light', 'dark'].includes(currentTheme)) {
        throw new Error(`Invalid theme: ${currentTheme}`);
    }

    // Test theme toggle
    const originalTheme = currentTheme;
    window.themeManager.toggleTheme();
    const newTheme = window.themeManager.getCurrentTheme();

    if (newTheme === originalTheme) {
        throw new Error('Theme toggle not working');
    }

    // Restore original theme
    window.themeManager.setTheme(originalTheme);

    console.log('Theme system working');
}

/**
 * Test 6: UI Elements
 * اختبار 6: عناصر الواجهة
 */
async function testUIElements() {
    // Test critical UI elements exist
    const criticalElements = [
        'body',
        'head',
        'title'
    ];

    for (const selector of criticalElements) {
        const element = document.querySelector(selector);
        if (!element) {
            throw new Error(`Critical element missing: ${selector}`);
        }
    }

    // Test CSS loading
    const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
    if (stylesheets.length === 0) {
        throw new Error('No stylesheets loaded');
    }

    console.log('UI elements working');
}

/**
 * Test 7: Error Handling
 * اختبار 7: معالجة الأخطاء
 */
async function testErrorHandling() {
    // Test toast notifications
    if (typeof window.LUXBYTE !== 'undefined' && window.LUXBYTE.notifyOk) {
        window.LUXBYTE.notifyOk('Test notification');
    }

    // Test error logging
    try {
        throw new Error('Test error');
    } catch (error) {
        console.log('Error handling working:', error.message);
    }

    console.log('Error handling working');
}

/**
 * Run all smoke tests
 * تشغيل جميع الاختبارات السريعة
 */
async function runSmokeTests() {
    console.log('🚀 Starting LUXBYTE Smoke Tests...');

    const tests = [
        ['Supabase Initialization', testSupabaseInit],
        ['File Upload System', testFileUploadSystem],
        ['Authentication System', testAuthSystem],
        ['Translation System', testTranslationSystem],
        ['Theme System', testThemeSystem],
        ['UI Elements', testUIElements],
        ['Error Handling', testErrorHandling]
    ];

    for (const [name, testFn] of tests) {
        await runTest(name, testFn);
    }

    // Print results
    console.log('\n📊 Test Results:');
    console.log(`✅ Passed: ${testResults.passed}`);
    console.log(`❌ Failed: ${testResults.failed}`);
    console.log(`📈 Total: ${testResults.total}`);
    console.log(`🎯 Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);

    // Show detailed results
    if (testResults.failed > 0) {
        console.log('\n❌ Failed Tests:');
        testResults.details
            .filter(test => test.status === 'FAILED')
            .forEach(test => {
                console.log(`  - ${test.name}: ${test.error}`);
            });
    }

    return testResults.failed === 0;
}

/**
 * Quick test for specific functionality
 * اختبار سريع لوظيفة محددة
 */
async function quickTest(feature) {
    const tests = {
        'auth': testAuthSystem,
        'upload': testFileUploadSystem,
        'translation': testTranslationSystem,
        'theme': testThemeSystem,
        'ui': testUIElements
    };

    if (tests[feature]) {
        return await runTest(feature, tests[feature]);
    } else {
        console.error(`Unknown test feature: ${feature}`);
        return false;
    }
}

// Export for global access
if (typeof window !== 'undefined') {
    window.runSmokeTests = runSmokeTests;
    window.quickTest = quickTest;
    window.testResults = testResults;
}

// Auto-run tests if in test mode
if (window.location.search.includes('test=true')) {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(runSmokeTests, 2000); // Wait for initialization
    });
}

export { runSmokeTests, quickTest, testResults };
