// Test Deployed System - LUXBYTE Production
// Tests the deployed system on Vercel

const API_BASE_URL = 'https://luxbyte-r38xw8gqr-amir-saids-projects-035bbecd.vercel.app';

console.log('🚀 Testing Deployed LUXBYTE System...\n');

const testResults = {
  passed: 0,
  failed: 0,
  total: 0,
  details: []
};

function logTest(testName, passed, message, details = {}) {
  testResults.total++;
  if (passed) {
    testResults.passed++;
    console.log(`✅ ${testName}: ${message}`);
  } else {
    testResults.failed++;
    console.log(`❌ ${testName}: ${message}`);
  }
  testResults.details.push({ testName, passed, message, details });
}

async function makeRequest(endpoint, method = 'GET', body = null, headers = {}) {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    const response = await fetch(url, options);
    const data = await response.json().catch(() => null);
    
    return {
      status: response.status,
      data,
      headers: Object.fromEntries(response.headers.entries())
    };
  } catch (error) {
    return {
      status: 0,
      data: null,
      error: error.message
    };
  }
}

// Test 1: Check if main page loads
async function testMainPage() {
  try {
    const response = await makeRequest('/');
    
    if (response.status === 200) {
      logTest('Main Page', true, 'Main page loads successfully');
    } else {
      logTest('Main Page', false, `Main page failed with status ${response.status}`);
    }
  } catch (error) {
    logTest('Main Page', false, `Main page error: ${error.message}`);
  }
}

// Test 2: Check API endpoints exist
async function testApiEndpoints() {
  const endpoints = [
    '/api/change-account-type',
    '/api/log-error'
  ];
  
  for (const endpoint of endpoints) {
    try {
      const response = await makeRequest(endpoint, 'OPTIONS');
      
      if (response.status === 200) {
        logTest(`API ${endpoint}`, true, 'API endpoint responds to OPTIONS');
      } else {
        logTest(`API ${endpoint}`, false, `API endpoint failed with status ${response.status}`);
      }
    } catch (error) {
      logTest(`API ${endpoint}`, false, `API endpoint error: ${error.message}`);
    }
  }
}

// Test 3: Test API security (should reject without admin key)
async function testApiSecurity() {
  try {
    const response = await makeRequest('/api/change-account-type', 'POST', {
      user_id: 'test-user-id',
      new_account_type: 'pharmacy'
    });
    
    if (response.status === 401) {
      logTest('API Security', true, 'API correctly rejects requests without admin key');
    } else {
      logTest('API Security', false, `API security failed: expected 401, got ${response.status}`);
    }
  } catch (error) {
    logTest('API Security', false, `API security error: ${error.message}`);
  }
}

// Test 4: Test CORS headers
async function testCorsHeaders() {
  try {
    const response = await makeRequest('/api/change-account-type', 'OPTIONS');
    
    const corsHeaders = [
      'access-control-allow-origin',
      'access-control-allow-methods',
      'access-control-allow-headers'
    ];
    
    const hasCorsHeaders = corsHeaders.every(header => 
      response.headers[header] || response.headers[header.toLowerCase()]
    );
    
    if (hasCorsHeaders) {
      logTest('CORS Headers', true, 'CORS headers are present');
    } else {
      logTest('CORS Headers', false, 'CORS headers are missing');
    }
  } catch (error) {
    logTest('CORS Headers', false, `CORS headers error: ${error.message}`);
  }
}

// Test 5: Test security headers
async function testSecurityHeaders() {
  try {
    const response = await makeRequest('/');
    
    const securityHeaders = [
      'x-content-type-options',
      'x-frame-options',
      'x-xss-protection'
    ];
    
    const hasSecurityHeaders = securityHeaders.every(header => 
      response.headers[header] || response.headers[header.toLowerCase()]
    );
    
    if (hasSecurityHeaders) {
      logTest('Security Headers', true, 'Security headers are present');
    } else {
      logTest('Security Headers', false, 'Security headers are missing');
    }
  } catch (error) {
    logTest('Security Headers', false, `Security headers error: ${error.message}`);
  }
}

// Test 6: Test error logging API
async function testErrorLogging() {
  try {
    const testError = {
      level: 'error',
      message: 'Test error for deployed system',
      sessionId: 'test-session-' + Date.now(),
      data: { test: true }
    };
    
    const response = await makeRequest('/api/log-error', 'POST', testError);
    
    if (response.status === 200) {
      logTest('Error Logging API', true, 'Error logging API works correctly');
    } else {
      logTest('Error Logging API', false, `Error logging failed with status ${response.status}`);
    }
  } catch (error) {
    logTest('Error Logging API', false, `Error logging error: ${error.message}`);
  }
}

// Test 7: Test static files
async function testStaticFiles() {
  const staticFiles = [
    '/styles.css',
    '/common.js',
    '/config.js',
    '/manifest.json'
  ];
  
  let passed = 0;
  
  for (const file of staticFiles) {
    try {
      const response = await makeRequest(file);
      
      if (response.status === 200) {
        passed++;
      }
    } catch (error) {
      // Ignore errors for static files
    }
  }
  
  if (passed === staticFiles.length) {
    logTest('Static Files', true, `All ${staticFiles.length} static files load successfully`);
  } else {
    logTest('Static Files', false, `${passed}/${staticFiles.length} static files load successfully`);
  }
}

// Test 8: Test HTML pages
async function testHtmlPages() {
  const htmlPages = [
    '/auth.html',
    '/unified-signup.html',
    '/dashboard.html',
    '/index.html'
  ];
  
  let passed = 0;
  
  for (const page of htmlPages) {
    try {
      const response = await makeRequest(page);
      
      if (response.status === 200) {
        passed++;
      }
    } catch (error) {
      // Ignore errors for HTML pages
    }
  }
  
  if (passed === htmlPages.length) {
    logTest('HTML Pages', true, `All ${htmlPages.length} HTML pages load successfully`);
  } else {
    logTest('HTML Pages', false, `${passed}/${htmlPages.length} HTML pages load successfully`);
  }
}

// Run all tests
async function runAllTests() {
  console.log('🔍 Testing Deployed System...\n');
  
  await testMainPage();
  await testApiEndpoints();
  await testApiSecurity();
  await testCorsHeaders();
  await testSecurityHeaders();
  await testErrorLogging();
  await testStaticFiles();
  await testHtmlPages();
  
  // Generate report
  console.log('\n📊 Test Results Summary:');
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`📈 Total: ${testResults.total}`);
  console.log(`🎯 Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);
  
  // Production readiness assessment
  const criticalTests = [
    'Main Page',
    'API Security',
    'CORS Headers',
    'Security Headers'
  ];
  
  const criticalPassed = testResults.details
    .filter(test => criticalTests.includes(test.testName) && test.passed)
    .length;
  
  console.log('\n🎯 Production Readiness Assessment:');
  if (criticalPassed === criticalTests.length) {
    console.log('✅ DEPLOYED SYSTEM IS WORKING CORRECTLY!');
    console.log('All critical tests passed. System is ready for use.');
  } else {
    console.log('⚠️  DEPLOYED SYSTEM NEEDS ATTENTION');
    console.log(`${criticalTests.length - criticalPassed} critical tests failed.`);
  }
  
  console.log('\n💡 Next Steps:');
  console.log('1. Add environment variables in Vercel Dashboard');
  console.log('2. Apply database migrations in Supabase');
  console.log('3. Test with real user data');
  console.log('4. Monitor system performance');
  
  return testResults;
}

// Run tests if this file is executed directly
if (typeof window === 'undefined') {
  runAllTests().catch(console.error);
}

export { runAllTests, testResults };
