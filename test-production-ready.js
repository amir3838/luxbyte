// Comprehensive Production Readiness Test Suite
// Tests all critical functionality and security measures

import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Configuration
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ADMIN_KEY = process.env.ADMIN_KEY;
const API_BASE_URL = process.env.VERCEL_URL || 'http://localhost:3000';

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || !ADMIN_KEY) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Test results tracking
const testResults = {
  passed: 0,
  failed: 0,
  total: 0,
  details: []
};

// Helper functions
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

async function makeApiRequest(endpoint, method = 'GET', body = null, headers = {}) {
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
  return {
    status: response.status,
    data: await response.json().catch(() => null)
  };
}

// Test functions
async function testDatabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);

    if (error) throw error;
    logTest('Database Connection', true, 'Successfully connected to Supabase');
    return true;
  } catch (error) {
    logTest('Database Connection', false, `Failed to connect: ${error.message}`);
    return false;
  }
}

async function testAuditLogging() {
  try {
    // Check if audit table exists
    const { data, error } = await supabase
      .from('account_audit')
      .select('count')
      .limit(1);

    if (error) throw error;
    logTest('Audit Logging', true, 'Audit table exists and accessible');
    return true;
  } catch (error) {
    logTest('Audit Logging', false, `Audit table not accessible: ${error.message}`);
    return false;
  }
}

async function testErrorLogging() {
  try {
    // Check if error_logs table exists
    const { data, error } = await supabase
      .from('error_logs')
      .select('count')
      .limit(1);

    if (error) throw error;
    logTest('Error Logging', true, 'Error logs table exists and accessible');
    return true;
  } catch (error) {
    logTest('Error Logging', false, `Error logs table not accessible: ${error.message}`);
    return false;
  }
}

async function testNotificationsTable() {
  try {
    // Check if notifications table exists
    const { data, error } = await supabase
      .from('notifications')
      .select('count')
      .limit(1);

    if (error) throw error;
    logTest('Notifications Table', true, 'Notifications table exists and accessible');
    return true;
  } catch (error) {
    logTest('Notifications Table', false, `Notifications table not accessible: ${error.message}`);
    return false;
  }
}

async function testUserDevicesTable() {
  try {
    // Check if user_devices table exists
    const { data, error } = await supabase
      .from('user_devices')
      .select('count')
      .limit(1);

    if (error) throw error;
    logTest('User Devices Table', true, 'User devices table exists and accessible');
    return true;
  } catch (error) {
    logTest('User Devices Table', false, `User devices table not accessible: ${error.message}`);
    return false;
  }
}

async function testAccountChangeApi() {
  try {
    // Test with invalid admin key
    const invalidResponse = await makeApiRequest('/api/change-account-type', 'POST', {
      user_id: 'test-user-id',
      new_account_type: 'pharmacy'
    }, {
      'X-ADMIN-KEY': 'invalid-key'
    });

    if (invalidResponse.status === 401) {
      logTest('Account Change API - Security', true, 'Correctly rejects invalid admin key');
    } else {
      logTest('Account Change API - Security', false, 'Does not reject invalid admin key');
      return false;
    }

    // Test with valid admin key but invalid user
    const validResponse = await makeApiRequest('/api/change-account-type', 'POST', {
      user_id: '00000000-0000-0000-0000-000000000000',
      new_account_type: 'pharmacy'
    }, {
      'X-ADMIN-KEY': ADMIN_KEY
    });

    if (validResponse.status === 404) {
      logTest('Account Change API - Validation', true, 'Correctly handles non-existent user');
    } else {
      logTest('Account Change API - Validation', false, 'Does not handle non-existent user correctly');
    }

    return true;
  } catch (error) {
    logTest('Account Change API', false, `API test failed: ${error.message}`);
    return false;
  }
}

async function testRateLimiting() {
  try {
    const requests = [];

    // Make multiple requests quickly
    for (let i = 0; i < 15; i++) {
      requests.push(
        makeApiRequest('/api/change-account-type', 'POST', {
          user_id: 'test-user-id',
          new_account_type: 'pharmacy'
        }, {
          'X-ADMIN-KEY': 'invalid-key'
        })
      );
    }

    const responses = await Promise.all(requests);
    const rateLimitedResponses = responses.filter(r => r.status === 429);

    if (rateLimitedResponses.length > 0) {
      logTest('Rate Limiting', true, `Rate limiting working: ${rateLimitedResponses.length} requests blocked`);
    } else {
      logTest('Rate Limiting', false, 'Rate limiting not working properly');
    }

    return true;
  } catch (error) {
    logTest('Rate Limiting', false, `Rate limiting test failed: ${error.message}`);
    return false;
  }
}

async function testCorsHeaders() {
  try {
    const response = await makeApiRequest('/api/change-account-type', 'OPTIONS');

    if (response.status === 200) {
      logTest('CORS Headers', true, 'CORS preflight requests handled correctly');
    } else {
      logTest('CORS Headers', false, 'CORS preflight requests not handled correctly');
    }

    return true;
  } catch (error) {
    logTest('CORS Headers', false, `CORS test failed: ${error.message}`);
    return false;
  }
}

async function testErrorLoggingApi() {
  try {
    const testError = {
      timestamp: new Date().toISOString(),
      sessionId: 'test-session-123',
      level: 'error',
      message: 'Test error for production readiness',
      data: { test: true },
      url: 'https://test.com',
      userAgent: 'Test Agent',
      userId: null
    };

    const response = await makeApiRequest('/api/log-error', 'POST', testError);

    if (response.status === 200) {
      logTest('Error Logging API', true, 'Error logging API working correctly');
    } else {
      logTest('Error Logging API', false, `Error logging API failed: ${response.status}`);
    }

    return true;
  } catch (error) {
    logTest('Error Logging API', false, `Error logging API test failed: ${error.message}`);
    return false;
  }
}

async function testDatabaseCleanupFunctions() {
  try {
    // Test cleanup functions exist
    const { data, error } = await supabase.rpc('cleanup_old_audit_logs');

    if (error) {
      logTest('Database Cleanup Functions', false, `Cleanup functions not working: ${error.message}`);
      return false;
    }

    logTest('Database Cleanup Functions', true, 'Database cleanup functions working correctly');
    return true;
  } catch (error) {
    logTest('Database Cleanup Functions', false, `Cleanup functions test failed: ${error.message}`);
    return false;
  }
}

async function testSecurityPolicies() {
  try {
    // Test that RLS is enabled
    const { data, error } = await supabase
      .from('account_audit')
      .select('*')
      .limit(1);

    // This should fail for non-admin users
    if (error && error.message.includes('permission denied')) {
      logTest('Security Policies', true, 'RLS policies are working correctly');
    } else {
      logTest('Security Policies', false, 'RLS policies may not be working correctly');
    }

    return true;
  } catch (error) {
    logTest('Security Policies', false, `Security policies test failed: ${error.message}`);
    return false;
  }
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Starting Production Readiness Tests...\n');

  // Database tests
  await testDatabaseConnection();
  await testAuditLogging();
  await testErrorLogging();
  await testNotificationsTable();
  await testUserDevicesTable();
  await testDatabaseCleanupFunctions();
  await testSecurityPolicies();

  // API tests
  await testAccountChangeApi();
  await testRateLimiting();
  await testCorsHeaders();
  await testErrorLoggingApi();

  // Generate report
  console.log('\n📊 Test Results Summary:');
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`📈 Total: ${testResults.total}`);
  console.log(`🎯 Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);

  // Detailed results
  console.log('\n📋 Detailed Results:');
  testResults.details.forEach(test => {
    const status = test.passed ? '✅' : '❌';
    console.log(`${status} ${test.testName}: ${test.message}`);
  });

  // Production readiness assessment
  const criticalTests = [
    'Database Connection',
    'Audit Logging',
    'Account Change API - Security',
    'Rate Limiting',
    'CORS Headers',
    'Security Policies'
  ];

  const criticalPassed = testResults.details
    .filter(test => criticalTests.includes(test.testName) && test.passed)
    .length;

  console.log('\n🎯 Production Readiness Assessment:');
  if (criticalPassed === criticalTests.length) {
    console.log('✅ SYSTEM IS PRODUCTION READY!');
    console.log('All critical security and functionality tests passed.');
  } else {
    console.log('⚠️  SYSTEM NEEDS ATTENTION BEFORE PRODUCTION');
    console.log(`${criticalTests.length - criticalPassed} critical tests failed.`);
  }

  // Recommendations
  console.log('\n💡 Recommendations:');
  if (testResults.failed > 0) {
    console.log('1. Fix all failed tests before deploying to production');
    console.log('2. Review security policies and API endpoints');
    console.log('3. Test with real user data in staging environment');
  } else {
    console.log('1. Deploy to production with confidence!');
    console.log('2. Set up monitoring and alerting');
    console.log('3. Schedule regular security audits');
  }

  return testResults;
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests().catch(console.error);
}

export { runAllTests, testResults };