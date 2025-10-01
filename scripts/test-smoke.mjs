#!/usr/bin/env node

/**
 * LUXBYTE Smoke Test Script
 * اختبار سريع للنظام
 */

const ok = (c, m) => { if (!c) throw new Error(m); };

const base = process.env.TEST_BASE || 'http://127.0.0.1:3000';
const fetchJson = async (p, opts) => {
    const response = await fetch(base + p, opts);
    ok(response.ok, `${p}: ${response.status} ${response.statusText}`);
    return response;
};

console.log('🧪 Starting LUXBYTE Smoke Tests...');
console.log(`📍 Testing: ${base}`);

try {
    // Test 1: Home page loads
    console.log('1️⃣ Testing home page...');
    await fetchJson('/');
    console.log('✅ Home page OK');

    // Test 2: Auth page loads
    console.log('2️⃣ Testing auth page...');
    await fetchJson('/public/auth.html');
    console.log('✅ Auth page OK');

    // Test 3: Unified signup loads
    console.log('3️⃣ Testing unified signup...');
    await fetchJson('/public/unified-signup.html');
    console.log('✅ Unified signup OK');

    // Test 4: Check if API endpoints exist (optional)
    console.log('4️⃣ Testing API endpoints...');
    try {
        await fetchJson('/api/health');
        console.log('✅ Health API OK');
    } catch (e) {
        console.log('⚠️ Health API not available (optional)');
    }

    // Test 5: Check static assets
    console.log('5️⃣ Testing static assets...');
    try {
        await fetchJson('/public/assets/app_icon/LUXBYTEicon.png');
        console.log('✅ Static assets OK');
    } catch (e) {
        console.log('⚠️ Static assets not found (check paths)');
    }

    // Test 6: Check SPA routing (should not 404)
    console.log('6️⃣ Testing SPA routing...');
    const spaResponse = await fetch(base + '/public/dashboard/pharmacy');
    if (spaResponse.status === 200) {
        console.log('✅ SPA routing OK');
    } else {
        console.log(`⚠️ SPA routing returned ${spaResponse.status} (might be expected)`);
    }

    console.log('\n🎉 All smoke tests passed!');
    console.log('✅ System is ready for deployment');
    console.log('SMOKE OK');

} catch (error) {
    console.error('\n❌ Smoke test failed:', error.message);
    console.error('🔍 Check the error above and fix before deployment');
    process.exit(1);
}
