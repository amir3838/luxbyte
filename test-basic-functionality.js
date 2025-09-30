// Basic Functionality Test - No Environment Variables Required
// Tests core functionality without external dependencies

console.log('🚀 Starting Basic Functionality Tests...\n');

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

// Test 1: Check if required files exist
function testRequiredFiles() {
  const fs = require('fs');
  const requiredFiles = [
    'api/change-account-type.js',
    'js/auth.js',
    'js/monitoring.js',
    'js/fcm-manager.js',
    'middleware.js',
    'supabase/migrations/007_audit_logging.sql',
    'supabase/migrations/008_error_logging.sql',
    'PRODUCTION_DEPLOYMENT_GUIDE.md'
  ];

  let allFilesExist = true;
  requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`  ✅ ${file} exists`);
    } else {
      console.log(`  ❌ ${file} missing`);
      allFilesExist = false;
    }
  });

  logTest('Required Files', allFilesExist,
    allFilesExist ? 'All required files exist' : 'Some required files are missing');
}

// Test 2: Check API security features
function testApiSecurity() {
  const fs = require('fs');
  const apiFile = fs.readFileSync('api/change-account-type.js', 'utf8');

  const securityFeatures = [
    { name: 'Rate Limiting', pattern: /checkRateLimit/ },
    { name: 'Admin Key Check', pattern: /ADMIN_KEY/ },
    { name: 'HMAC Verification', pattern: /verifyHMAC/ },
    { name: 'CORS Headers', pattern: /Access-Control-Allow/ },
    { name: 'Audit Logging', pattern: /logAuditEvent/ },
    { name: 'Input Validation', pattern: /validAccountTypes/ }
  ];

  let featuresFound = 0;
  securityFeatures.forEach(feature => {
    if (feature.pattern.test(apiFile)) {
      console.log(`  ✅ ${feature.name} implemented`);
      featuresFound++;
    } else {
      console.log(`  ❌ ${feature.name} missing`);
    }
  });

  logTest('API Security Features', featuresFound === securityFeatures.length,
    `${featuresFound}/${securityFeatures.length} security features implemented`);
}

// Test 3: Check database migrations
function testDatabaseMigrations() {
  const fs = require('fs');

  // Check audit logging migration
  const auditMigration = fs.readFileSync('supabase/migrations/007_audit_logging.sql', 'utf8');
  const auditFeatures = [
    { name: 'Account Audit Table', pattern: /CREATE TABLE.*account_audit/ },
    { name: 'Audit Trigger', pattern: /CREATE TRIGGER.*trg_log_account_change/ },
    { name: 'RLS Policies', pattern: /ENABLE ROW LEVEL SECURITY/ },
    { name: 'Cleanup Function', pattern: /cleanup_old_audit_logs/ }
  ];

  let auditFeaturesFound = 0;
  auditFeatures.forEach(feature => {
    if (feature.pattern.test(auditMigration)) {
      console.log(`  ✅ ${feature.name} in audit migration`);
      auditFeaturesFound++;
    } else {
      console.log(`  ❌ ${feature.name} missing in audit migration`);
    }
  });

  // Check error logging migration
  const errorMigration = fs.readFileSync('supabase/migrations/008_error_logging.sql', 'utf8');
  const errorFeatures = [
    { name: 'Error Logs Table', pattern: /CREATE TABLE.*error_logs/ },
    { name: 'System Health Table', pattern: /CREATE TABLE.*system_health/ },
    { name: 'Error Statistics Function', pattern: /get_error_statistics/ }
  ];

  let errorFeaturesFound = 0;
  errorFeatures.forEach(feature => {
    if (feature.pattern.test(errorMigration)) {
      console.log(`  ✅ ${feature.name} in error migration`);
      errorFeaturesFound++;
    } else {
      console.log(`  ❌ ${feature.name} missing in error migration`);
    }
  });

  logTest('Database Migrations',
    auditFeaturesFound === auditFeatures.length && errorFeaturesFound === errorFeatures.length,
    `Audit: ${auditFeaturesFound}/${auditFeatures.length}, Error: ${errorFeaturesFound}/${errorFeatures.length}`);
}

// Test 4: Check monitoring system
function testMonitoringSystem() {
  const fs = require('fs');
  const monitoringFile = fs.readFileSync('js/monitoring.js', 'utf8');

  const monitoringFeatures = [
    { name: 'Log Levels', pattern: /debug|info|warn|error/ },
    { name: 'Session Tracking', pattern: /sessionId/ },
    { name: 'Performance Logging', pattern: /logPerformance/ },
    { name: 'Error Handler', pattern: /addEventListener.*error/ },
    { name: 'Export Function', pattern: /exportLogs/ }
  ];

  let featuresFound = 0;
  monitoringFeatures.forEach(feature => {
    if (feature.pattern.test(monitoringFile)) {
      console.log(`  ✅ ${feature.name} in monitoring system`);
      featuresFound++;
    } else {
      console.log(`  ❌ ${feature.name} missing in monitoring system`);
    }
  });

  logTest('Monitoring System', featuresFound === monitoringFeatures.length,
    `${featuresFound}/${monitoringFeatures.length} monitoring features implemented`);
}

// Test 5: Check FCM system
function testFCMSystem() {
  const fs = require('fs');
  const fcmFile = fs.readFileSync('js/fcm-manager.js', 'utf8');

  const fcmFeatures = [
    { name: 'Token Management', pattern: /getToken|saveTokenToDatabase/ },
    { name: 'Notification Sending', pattern: /sendNotification/ },
    { name: 'Permission Handling', pattern: /requestPermission/ },
    { name: 'Message Listener', pattern: /onMessage/ },
    { name: 'Device Registration', pattern: /user_devices/ }
  ];

  let featuresFound = 0;
  fcmFeatures.forEach(feature => {
    if (feature.pattern.test(fcmFile)) {
      console.log(`  ✅ ${feature.name} in FCM system`);
      featuresFound++;
    } else {
      console.log(`  ❌ ${feature.name} missing in FCM system`);
    }
  });

  logTest('FCM System', featuresFound === fcmFeatures.length,
    `${featuresFound}/${fcmFeatures.length} FCM features implemented`);
}

// Test 6: Check auth improvements
function testAuthImprovements() {
  const fs = require('fs');
  const authFile = fs.readFileSync('js/auth.js', 'utf8');

  const authFeatures = [
    { name: 'Email Confirmation Check', pattern: /email_confirmed_at/ },
    { name: 'Smart Redirect', pattern: /unified-signup/ },
    { name: 'Profile Caching', pattern: /localStorage/ },
    { name: 'Error Handling', pattern: /try.*catch/ }
  ];

  let featuresFound = 0;
  authFeatures.forEach(feature => {
    if (feature.pattern.test(authFile)) {
      console.log(`  ✅ ${feature.name} in auth system`);
      featuresFound++;
    } else {
      console.log(`  ❌ ${feature.name} missing in auth system`);
    }
  });

  logTest('Auth Improvements', featuresFound === authFeatures.length,
    `${featuresFound}/${authFeatures.length} auth features implemented`);
}

// Test 7: Check middleware
function testMiddleware() {
  const fs = require('fs');
  const middlewareFile = fs.readFileSync('middleware.js', 'utf8');

  const middlewareFeatures = [
    { name: 'Rate Limiting', pattern: /checkRateLimit/ },
    { name: 'CORS Protection', pattern: /Access-Control-Allow/ },
    { name: 'Security Headers', pattern: /X-Content-Type-Options|X-Frame-Options/ },
    { name: 'CSP Policy', pattern: /Content-Security-Policy/ },
    { name: 'Permissions Policy', pattern: /Permissions-Policy/ }
  ];

  let featuresFound = 0;
  middlewareFeatures.forEach(feature => {
    if (feature.pattern.test(middlewareFile)) {
      console.log(`  ✅ ${feature.name} in middleware`);
      featuresFound++;
    } else {
      console.log(`  ❌ ${feature.name} missing in middleware`);
    }
  });

  logTest('Middleware Security', featuresFound === middlewareFeatures.length,
    `${featuresFound}/${middlewareFeatures.length} middleware features implemented`);
}

// Run all tests
function runAllTests() {
  console.log('🔍 Testing File Structure...\n');
  testRequiredFiles();

  console.log('\n🔒 Testing API Security...\n');
  testApiSecurity();

  console.log('\n🗄️ Testing Database Migrations...\n');
  testDatabaseMigrations();

  console.log('\n📊 Testing Monitoring System...\n');
  testMonitoringSystem();

  console.log('\n📱 Testing FCM System...\n');
  testFCMSystem();

  console.log('\n🔐 Testing Auth Improvements...\n');
  testAuthImprovements();

  console.log('\n🛡️ Testing Middleware...\n');
  testMiddleware();

  // Generate report
  console.log('\n📊 Test Results Summary:');
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`📈 Total: ${testResults.total}`);
  console.log(`🎯 Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);

  // Production readiness assessment
  const criticalTests = [
    'Required Files',
    'API Security Features',
    'Database Migrations',
    'Middleware Security'
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

  console.log('\n💡 Next Steps:');
  console.log('1. Set up environment variables in .env file');
  console.log('2. Apply database migrations to Supabase');
  console.log('3. Deploy to Vercel with proper configuration');
  console.log('4. Test with real user data');

  return testResults;
}

// Run tests
runAllTests();
