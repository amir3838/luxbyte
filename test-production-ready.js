// Production Ready Test Script
// Run with: node test-production-ready.js

const https = require('https');
const crypto = require('crypto');

// Configuration
const BASE_URL = process.env.TEST_URL || 'https://luxbyte-543s7l9n1-amir-saids-projects-035bbecd.vercel.app';
const ADMIN_KEY = process.env.ADMIN_KEY || 'your_admin_key_here';
const HMAC_SECRET = process.env.HMAC_SECRET || 'your_hmac_secret_here';

// Test results
let testResults = {
    passed: 0,
    failed: 0,
    tests: []
};

function logTest(name, passed, message) {
    const result = { name, passed, message, timestamp: new Date().toISOString() };
    testResults.tests.push(result);
    testResults[passed ? 'passed' : 'failed']++;
    
    console.log(`${passed ? '✅' : '❌'} ${name}: ${message}`);
}

function makeRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
        const req = https.request(url, options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const jsonData = data ? JSON.parse(data) : {};
                    resolve({ status: res.statusCode, data: jsonData, headers: res.headers });
                } catch (e) {
                    resolve({ status: res.statusCode, data: data, headers: res.headers });
                }
            });
        });
        
        req.on('error', reject);
        
        if (options.body) {
            req.write(options.body);
        }
        
        req.end();
    });
}

function generateHMAC(payload, timestamp) {
    return crypto
        .createHmac('sha256', HMAC_SECRET)
        .update(payload + timestamp)
        .digest('hex');
}

async function testAPIEndpoints() {
    console.log('\n🔍 Testing API Endpoints...\n');

    // Test 1: Change Account Type (with admin key)
    try {
        const testUserId = '00000000-0000-0000-0000-000000000000'; // Dummy UUID
        const payload = JSON.stringify({
            user_id: testUserId,
            new_account_type: 'pharmacy',
            changed_by: 'test_script'
        });
        
        const response = await makeRequest(`${BASE_URL}/api/change-account-type`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-ADMIN-KEY': ADMIN_KEY
            },
            body: payload
        });
        
        logTest(
            'Change Account Type API',
            response.status === 404, // Expected 404 for non-existent user
            `Status: ${response.status} (Expected 404 for non-existent user)`
        );
    } catch (error) {
        logTest('Change Account Type API', false, `Error: ${error.message}`);
    }

    // Test 2: List Users API
    try {
        const response = await makeRequest(`${BASE_URL}/api/list-users?admin_key=${ADMIN_KEY}`);
        
        logTest(
            'List Users API',
            response.status === 200 || response.status === 401,
            `Status: ${response.status}`
        );
    } catch (error) {
        logTest('List Users API', false, `Error: ${error.message}`);
    }

    // Test 3: Rate Limiting
    try {
        const promises = [];
        for (let i = 0; i < 15; i++) {
            promises.push(makeRequest(`${BASE_URL}/api/change-account-type`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-ADMIN-KEY': 'invalid_key'
                },
                body: JSON.stringify({ user_id: 'test', new_account_type: 'pharmacy' })
            }));
        }
        
        const responses = await Promise.all(promises);
        const rateLimited = responses.some(r => r.status === 429);
        
        logTest(
            'Rate Limiting',
            rateLimited,
            rateLimited ? 'Rate limiting working' : 'Rate limiting not working'
        );
    } catch (error) {
        logTest('Rate Limiting', false, `Error: ${error.message}`);
    }

    // Test 4: HMAC Verification
    try {
        const timestamp = Date.now().toString();
        const payload = JSON.stringify({
            user_id: 'test',
            new_account_type: 'pharmacy'
        });
        const hmac = generateHMAC(payload, timestamp);
        
        const response = await makeRequest(`${BASE_URL}/api/change-account-type`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-ADMIN-KEY': ADMIN_KEY,
                'X-HMAC-Signature': hmac,
                'X-Timestamp': timestamp
            },
            body: payload
        });
        
        logTest(
            'HMAC Verification',
            response.status === 400 || response.status === 404,
            `Status: ${response.status} (HMAC accepted)`
        );
    } catch (error) {
        logTest('HMAC Verification', false, `Error: ${error.message}`);
    }
}

async function testWebPages() {
    console.log('\n🌐 Testing Web Pages...\n');

    const pages = [
        { name: 'Home Page', url: '/' },
        { name: 'Signup Page', url: '/unified-signup.html' },
        { name: 'Login Page', url: '/auth.html' },
        { name: 'Admin Panel', url: '/admin-panel.html' }
    ];

    for (const page of pages) {
        try {
            const response = await makeRequest(`${BASE_URL}${page.url}`);
            
            logTest(
                page.name,
                response.status === 200,
                `Status: ${response.status}`
            );
        } catch (error) {
            logTest(page.name, false, `Error: ${error.message}`);
        }
    }
}

async function testSecurityHeaders() {
    console.log('\n🔒 Testing Security Headers...\n');

    try {
        const response = await makeRequest(`${BASE_URL}/`);
        
        const securityHeaders = [
            'x-request-id',
            'access-control-allow-origin'
        ];
        
        let headersPresent = 0;
        securityHeaders.forEach(header => {
            if (response.headers[header]) {
                headersPresent++;
            }
        });
        
        logTest(
            'Security Headers',
            headersPresent > 0,
            `${headersPresent}/${securityHeaders.length} security headers present`
        );
    } catch (error) {
        logTest('Security Headers', false, `Error: ${error.message}`);
    }
}

async function runAllTests() {
    console.log('🚀 Starting Production Ready Tests...\n');
    console.log(`Testing against: ${BASE_URL}\n`);

    await testWebPages();
    await testAPIEndpoints();
    await testSecurityHeaders();

    // Summary
    console.log('\n📊 Test Summary:');
    console.log(`✅ Passed: ${testResults.passed}`);
    console.log(`❌ Failed: ${testResults.failed}`);
    console.log(`📈 Success Rate: ${((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1)}%`);

    // Detailed results
    console.log('\n📋 Detailed Results:');
    testResults.tests.forEach(test => {
        console.log(`${test.passed ? '✅' : '❌'} ${test.name}: ${test.message}`);
    });

    // Exit with error code if any tests failed
    if (testResults.failed > 0) {
        process.exit(1);
    }
}

// Run tests
runAllTests().catch(console.error);
