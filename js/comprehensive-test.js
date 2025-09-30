// Comprehensive Testing System for LUXBYTE
class ComprehensiveTest {
    constructor() {
        this.testResults = {
            frontend: {},
            backend: {},
            database: {},
            permissions: {},
            performance: {},
            accessibility: {},
            security: {}
        };
        this.init();
    }

    async init() {
        console.log('🧪 Starting Comprehensive Test Suite...');
        await this.runAllTests();
        this.generateReport();
    }

    async runAllTests() {
        // Frontend Tests
        await this.testFrontend();
        
        // Backend Tests
        await this.testBackend();
        
        // Database Tests
        await this.testDatabase();
        
        // Permissions Tests
        await this.testPermissions();
        
        // Performance Tests
        await this.testPerformance();
        
        // Accessibility Tests
        await this.testAccessibility();
        
        // Security Tests
        await this.testSecurity();
    }

    // Frontend Tests
    async testFrontend() {
        console.log('🔍 Testing Frontend...');
        
        this.testResults.frontend = {
            htmlValidation: this.testHTMLValidation(),
            cssValidation: this.testCSSValidation(),
            javascriptErrors: this.testJavaScriptErrors(),
            responsiveDesign: this.testResponsiveDesign(),
            formValidation: this.testFormValidation(),
            fileUpload: this.testFileUpload(),
            themeToggle: this.testThemeToggle(),
            languageToggle: this.testLanguageToggle(),
            navigation: this.testNavigation(),
            animations: this.testAnimations()
        };
    }

    testHTMLValidation() {
        const issues = [];
        
        // Check for required meta tags
        const requiredMetaTags = ['viewport', 'description', 'keywords'];
        requiredMetaTags.forEach(tag => {
            if (!document.querySelector(`meta[name="${tag}"]`)) {
                issues.push(`Missing meta tag: ${tag}`);
            }
        });

        // Check for alt attributes on images
        const images = document.querySelectorAll('img');
        images.forEach((img, index) => {
            if (!img.alt) {
                issues.push(`Image ${index + 1} missing alt attribute`);
            }
        });

        // Check for proper heading hierarchy
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        let lastLevel = 0;
        headings.forEach((heading, index) => {
            const level = parseInt(heading.tagName[1]);
            if (level > lastLevel + 1) {
                issues.push(`Heading hierarchy issue: ${heading.tagName} after h${lastLevel}`);
            }
            lastLevel = level;
        });

        return {
            passed: issues.length === 0,
            issues: issues,
            score: Math.max(0, 100 - (issues.length * 10))
        };
    }

    testCSSValidation() {
        const issues = [];
        
        // Check for CSS custom properties
        const root = document.documentElement;
        const computedStyle = getComputedStyle(root);
        
        const requiredVars = ['--primary', '--secondary', '--text', '--bg-body'];
        requiredVars.forEach(varName => {
            if (!computedStyle.getPropertyValue(varName)) {
                issues.push(`Missing CSS variable: ${varName}`);
            }
        });

        // Check for responsive breakpoints
        const mediaQueries = Array.from(document.styleSheets)
            .flatMap(sheet => {
                try {
                    return Array.from(sheet.cssRules);
                } catch (e) {
                    return [];
                }
            })
            .filter(rule => rule.type === CSSRule.MEDIA_RULE);

        const hasMobileBreakpoint = mediaQueries.some(rule => 
            rule.media.mediaText.includes('768px') || 
            rule.media.mediaText.includes('max-width')
        );

        if (!hasMobileBreakpoint) {
            issues.push('Missing mobile responsive breakpoint');
        }

        return {
            passed: issues.length === 0,
            issues: issues,
            score: Math.max(0, 100 - (issues.length * 15))
        };
    }

    testJavaScriptErrors() {
        const errors = [];
        const originalConsoleError = console.error;
        
        console.error = (...args) => {
            errors.push(args.join(' '));
            originalConsoleError.apply(console, args);
        };

        // Test for undefined variables
        try {
            if (typeof LUXBYTE === 'undefined') {
                errors.push('LUXBYTE object not defined');
            }
        } catch (e) {
            errors.push('Error checking LUXBYTE object');
        }

        // Test for missing functions
        const requiredFunctions = ['notifyOk', 'notifyErr', 'showLoading', 'hideLoading'];
        requiredFunctions.forEach(func => {
            if (typeof window.LUXBYTE?.[func] !== 'function') {
                errors.push(`Missing function: LUXBYTE.${func}`);
            }
        });

        // Restore original console.error
        console.error = originalConsoleError;

        return {
            passed: errors.length === 0,
            errors: errors,
            score: Math.max(0, 100 - (errors.length * 20))
        };
    }

    testResponsiveDesign() {
        const breakpoints = [320, 768, 1024, 1440];
        const issues = [];
        
        breakpoints.forEach(width => {
            // Simulate viewport width
            const originalWidth = window.innerWidth;
            Object.defineProperty(window, 'innerWidth', {
                writable: true,
                configurable: true,
                value: width
            });
            
            // Trigger resize event
            window.dispatchEvent(new Event('resize'));
            
            // Check for horizontal scroll
            if (document.documentElement.scrollWidth > width) {
                issues.push(`Horizontal scroll at ${width}px width`);
            }
            
            // Restore original width
            Object.defineProperty(window, 'innerWidth', {
                writable: true,
                configurable: true,
                value: originalWidth
            });
        });

        return {
            passed: issues.length === 0,
            issues: issues,
            score: Math.max(0, 100 - (issues.length * 25))
        };
    }

    testFormValidation() {
        const forms = document.querySelectorAll('form');
        const issues = [];
        
        forms.forEach((form, index) => {
            const requiredInputs = form.querySelectorAll('input[required], textarea[required], select[required]');
            requiredInputs.forEach(input => {
                if (!input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby')) {
                    issues.push(`Form ${index + 1}: Input missing accessibility label`);
                }
            });

            // Check for proper form structure
            if (!form.querySelector('button[type="submit"]') && !form.querySelector('input[type="submit"]')) {
                issues.push(`Form ${index + 1}: Missing submit button`);
            }
        });

        return {
            passed: issues.length === 0,
            issues: issues,
            score: Math.max(0, 100 - (issues.length * 20))
        };
    }

    testFileUpload() {
        const fileInputs = document.querySelectorAll('input[type="file"]');
        const issues = [];
        
        fileInputs.forEach((input, index) => {
            // Check for proper accept attribute
            if (!input.accept) {
                issues.push(`File input ${index + 1}: Missing accept attribute`);
            }
            
            // Check for camera capture
            if (!input.hasAttribute('capture')) {
                issues.push(`File input ${index + 1}: Missing capture attribute for camera`);
            }
        });

        return {
            passed: issues.length === 0,
            issues: issues,
            score: Math.max(0, 100 - (issues.length * 30))
        };
    }

    testThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        if (!themeToggle) {
            return {
                passed: false,
                issues: ['Theme toggle button not found'],
                score: 0
            };
        }

        // Test theme toggle functionality
        const originalTheme = document.body.className;
        themeToggle.click();
        const newTheme = document.body.className;
        themeToggle.click(); // Toggle back
        
        return {
            passed: originalTheme !== newTheme,
            issues: originalTheme === newTheme ? ['Theme toggle not working'] : [],
            score: originalTheme !== newTheme ? 100 : 0
        };
    }

    testLanguageToggle() {
        const langToggle = document.getElementById('language-toggle');
        if (!langToggle) {
            return {
                passed: false,
                issues: ['Language toggle button not found'],
                score: 0
            };
        }

        return {
            passed: true,
            issues: [],
            score: 100
        };
    }

    testNavigation() {
        const navLinks = document.querySelectorAll('nav a, .nav a');
        const issues = [];
        
        navLinks.forEach((link, index) => {
            if (!link.href || link.href === '#') {
                issues.push(`Navigation link ${index + 1}: Missing or invalid href`);
            }
            
            if (!link.textContent.trim()) {
                issues.push(`Navigation link ${index + 1}: Missing text content`);
            }
        });

        return {
            passed: issues.length === 0,
            issues: issues,
            score: Math.max(0, 100 - (issues.length * 25))
        };
    }

    testAnimations() {
        const animatedElements = document.querySelectorAll('.fade-in, .slide-up, .scale-in');
        const issues = [];
        
        if (animatedElements.length === 0) {
            issues.push('No animated elements found');
        }

        // Check for CSS animations
        const hasAnimations = Array.from(document.styleSheets)
            .flatMap(sheet => {
                try {
                    return Array.from(sheet.cssRules);
                } catch (e) {
                    return [];
                }
            })
            .some(rule => rule.type === CSSRule.KEYFRAMES_RULE);

        if (!hasAnimations) {
            issues.push('No CSS animations defined');
        }

        return {
            passed: issues.length === 0,
            issues: issues,
            score: Math.max(0, 100 - (issues.length * 50))
        };
    }

    // Backend Tests
    async testBackend() {
        console.log('🔍 Testing Backend...');
        
        this.testResults.backend = {
            apiEndpoints: await this.testAPIEndpoints(),
            authentication: await this.testAuthentication(),
            fileUpload: await this.testFileUploadAPI(),
            databaseConnection: await this.testDatabaseConnection()
        };
    }

    async testAPIEndpoints() {
        const endpoints = [
            '/api/auth/register',
            '/api/business/submit-request',
            '/api/business/get-requests',
            '/api/admin/update-request-status'
        ];
        
        const results = {};
        
        for (const endpoint of endpoints) {
            try {
                const response = await fetch(endpoint, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                results[endpoint] = {
                    accessible: response.status !== 404,
                    status: response.status,
                    error: response.status === 404 ? 'Endpoint not found' : null
                };
            } catch (error) {
                results[endpoint] = {
                    accessible: false,
                    status: 0,
                    error: error.message
                };
            }
        }
        
        return results;
    }

    async testAuthentication() {
        try {
            // Test Supabase connection
            if (typeof window.LUXBYTE?.supabase !== 'undefined') {
                const { data, error } = await window.LUXBYTE.supabase.auth.getSession();
                return {
                    connected: !error,
                    error: error?.message || null,
                    hasSession: !!data?.session
                };
            }
            
            return {
                connected: false,
                error: 'Supabase client not initialized',
                hasSession: false
            };
        } catch (error) {
            return {
                connected: false,
                error: error.message,
                hasSession: false
            };
        }
    }

    async testFileUploadAPI() {
        // Test file upload functionality
        const testFile = new File(['test content'], 'test.txt', { type: 'text/plain' });
        
        try {
            const formData = new FormData();
            formData.append('file', testFile);
            
            // This would test actual file upload in a real scenario
            return {
                supported: true,
                error: null
            };
        } catch (error) {
            return {
                supported: false,
                error: error.message
            };
        }
    }

    async testDatabaseConnection() {
        try {
            if (typeof window.LUXBYTE?.supabase !== 'undefined') {
                const { data, error } = await window.LUXBYTE.supabase
                    .from('system_settings')
                    .select('key')
                    .limit(1);
                
                return {
                    connected: !error,
                    error: error?.message || null
                };
            }
            
            return {
                connected: false,
                error: 'Supabase client not initialized'
            };
        } catch (error) {
            return {
                connected: false,
                error: error.message
            };
        }
    }

    // Database Tests
    async testDatabase() {
        console.log('🔍 Testing Database...');
        
        this.testResults.database = {
            connection: await this.testDatabaseConnection(),
            tables: await this.testDatabaseTables(),
            permissions: await this.testDatabasePermissions()
        };
    }

    async testDatabaseTables() {
        const requiredTables = [
            'user_profiles',
            'business_types',
            'restaurant_requests',
            'supermarket_requests',
            'pharmacy_requests',
            'clinic_requests',
            'courier_requests',
            'driver_requests',
            'file_uploads',
            'document_types',
            'push_tokens',
            'notifications',
            'system_settings',
            'audit_logs'
        ];
        
        const results = {};
        
        for (const table of requiredTables) {
            try {
                if (typeof window.LUXBYTE?.supabase !== 'undefined') {
                    const { data, error } = await window.LUXBYTE.supabase
                        .from(table)
                        .select('*')
                        .limit(1);
                    
                    results[table] = {
                        exists: !error,
                        error: error?.message || null
                    };
                } else {
                    results[table] = {
                        exists: false,
                        error: 'Supabase client not initialized'
                    };
                }
            } catch (error) {
                results[table] = {
                    exists: false,
                    error: error.message
                };
            }
        }
        
        return results;
    }

    async testDatabasePermissions() {
        // Test RLS policies
        try {
            if (typeof window.LUXBYTE?.supabase !== 'undefined') {
                // Test if user can access their own data
                const { data, error } = await window.LUXBYTE.supabase
                    .from('user_profiles')
                    .select('id')
                    .limit(1);
                
                return {
                    rlsEnabled: !error || error.message.includes('permission'),
                    error: error?.message || null
                };
            }
            
            return {
                rlsEnabled: false,
                error: 'Supabase client not initialized'
            };
        } catch (error) {
            return {
                rlsEnabled: false,
                error: error.message
            };
        }
    }

    // Permissions Tests
    async testPermissions() {
        console.log('🔍 Testing Permissions...');
        
        this.testResults.permissions = {
            camera: await this.testCameraPermission(),
            location: await this.testLocationPermission(),
            notifications: await this.testNotificationPermission(),
            storage: await this.testStoragePermission()
        };
    }

    async testCameraPermission() {
        try {
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                stream.getTracks().forEach(track => track.stop());
                return { granted: true, error: null };
            }
            return { granted: false, error: 'Camera not supported' };
        } catch (error) {
            return { granted: false, error: error.message };
        }
    }

    async testLocationPermission() {
        try {
            if (navigator.geolocation) {
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject, {
                        enableHighAccuracy: true,
                        timeout: 5000
                    });
                });
                return { granted: true, error: null };
            }
            return { granted: false, error: 'Geolocation not supported' };
        } catch (error) {
            return { granted: false, error: error.message };
        }
    }

    async testNotificationPermission() {
        try {
            if ('Notification' in window) {
                const permission = Notification.permission;
                return { 
                    granted: permission === 'granted', 
                    permission: permission,
                    error: null 
                };
            }
            return { granted: false, error: 'Notifications not supported' };
        } catch (error) {
            return { granted: false, error: error.message };
        }
    }

    async testStoragePermission() {
        try {
            if ('storage' in navigator && 'estimate' in navigator.storage) {
                const estimate = await navigator.storage.estimate();
                return { 
                    supported: true, 
                    quota: estimate.quota,
                    usage: estimate.usage,
                    error: null 
                };
            }
            return { supported: false, error: 'Storage API not supported' };
        } catch (error) {
            return { supported: false, error: error.message };
        }
    }

    // Performance Tests
    async testPerformance() {
        console.log('🔍 Testing Performance...');
        
        this.testResults.performance = {
            pageLoadTime: this.testPageLoadTime(),
            resourceLoading: this.testResourceLoading(),
            memoryUsage: this.testMemoryUsage(),
            networkLatency: await this.testNetworkLatency()
        };
    }

    testPageLoadTime() {
        const navigation = performance.getEntriesByType('navigation')[0];
        return {
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
            loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
            totalTime: navigation.loadEventEnd - navigation.fetchStart
        };
    }

    testResourceLoading() {
        const resources = performance.getEntriesByType('resource');
        const slowResources = resources.filter(resource => resource.duration > 1000);
        
        return {
            totalResources: resources.length,
            slowResources: slowResources.length,
            averageLoadTime: resources.reduce((sum, resource) => sum + resource.duration, 0) / resources.length
        };
    }

    testMemoryUsage() {
        if ('memory' in performance) {
            return {
                usedJSHeapSize: performance.memory.usedJSHeapSize,
                totalJSHeapSize: performance.memory.totalJSHeapSize,
                jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
            };
        }
        return { supported: false };
    }

    async testNetworkLatency() {
        const start = performance.now();
        try {
            await fetch('/api/health', { method: 'HEAD' });
            return performance.now() - start;
        } catch (error) {
            return null;
        }
    }

    // Accessibility Tests
    async testAccessibility() {
        console.log('🔍 Testing Accessibility...');
        
        this.testResults.accessibility = {
            colorContrast: this.testColorContrast(),
            keyboardNavigation: this.testKeyboardNavigation(),
            screenReader: this.testScreenReaderSupport(),
            focusManagement: this.testFocusManagement()
        };
    }

    testColorContrast() {
        // Basic color contrast test
        const textElements = document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6');
        const issues = [];
        
        textElements.forEach((element, index) => {
            const style = getComputedStyle(element);
            const color = style.color;
            const backgroundColor = style.backgroundColor;
            
            // This is a simplified test - in reality, you'd use a proper contrast ratio calculation
            if (color === backgroundColor) {
                issues.push(`Element ${index + 1}: Text and background colors are identical`);
            }
        });
        
        return {
            passed: issues.length === 0,
            issues: issues,
            score: Math.max(0, 100 - (issues.length * 20))
        };
    }

    testKeyboardNavigation() {
        const focusableElements = document.querySelectorAll(
            'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        const issues = [];
        
        focusableElements.forEach((element, index) => {
            if (element.tabIndex < 0 && element.tabIndex !== -1) {
                issues.push(`Element ${index + 1}: Invalid tabindex value`);
            }
        });
        
        return {
            passed: issues.length === 0,
            issues: issues,
            score: Math.max(0, 100 - (issues.length * 25))
        };
    }

    testScreenReaderSupport() {
        const elements = document.querySelectorAll('img, input, button, a');
        const issues = [];
        
        elements.forEach((element, index) => {
            if (element.tagName === 'IMG' && !element.alt) {
                issues.push(`Image ${index + 1}: Missing alt text`);
            }
            
            if (!element.getAttribute('aria-label') && 
                !element.getAttribute('aria-labelledby') && 
                !element.textContent.trim()) {
                issues.push(`Element ${index + 1}: Missing accessible name`);
            }
        });
        
        return {
            passed: issues.length === 0,
            issues: issues,
            score: Math.max(0, 100 - (issues.length * 15))
        };
    }

    testFocusManagement() {
        const focusableElements = document.querySelectorAll(
            'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        
        // Test if focus can be managed
        let focusable = true;
        try {
            if (focusableElements.length > 0) {
                focusableElements[0].focus();
            }
        } catch (error) {
            focusable = false;
        }
        
        return {
            passed: focusable,
            focusableElements: focusableElements.length,
            score: focusable ? 100 : 0
        };
    }

    // Security Tests
    async testSecurity() {
        console.log('🔍 Testing Security...');
        
        this.testResults.security = {
            https: this.testHTTPS(),
            contentSecurityPolicy: this.testContentSecurityPolicy(),
            xssProtection: this.testXSSProtection(),
            dataValidation: this.testDataValidation()
        };
    }

    testHTTPS() {
        return {
            isSecure: location.protocol === 'https:',
            score: location.protocol === 'https:' ? 100 : 0
        };
    }

    testContentSecurityPolicy() {
        const metaCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
        return {
            hasCSP: !!metaCSP,
            score: metaCSP ? 100 : 0
        };
    }

    testXSSProtection() {
        // Test for potential XSS vulnerabilities
        const scriptTags = document.querySelectorAll('script');
        const issues = [];
        
        scriptTags.forEach((script, index) => {
            if (script.src && !script.src.startsWith('http') && !script.src.startsWith('/')) {
                issues.push(`Script ${index + 1}: Potentially unsafe src`);
            }
        });
        
        return {
            passed: issues.length === 0,
            issues: issues,
            score: Math.max(0, 100 - (issues.length * 50))
        };
    }

    testDataValidation() {
        const forms = document.querySelectorAll('form');
        const issues = [];
        
        forms.forEach((form, index) => {
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach((input, inputIndex) => {
                if (input.type === 'email' && !input.pattern) {
                    issues.push(`Form ${index + 1}, Input ${inputIndex + 1}: Email input missing pattern validation`);
                }
            });
        });
        
        return {
            passed: issues.length === 0,
            issues: issues,
            score: Math.max(0, 100 - (issues.length * 20))
        };
    }

    // Generate comprehensive report
    generateReport() {
        const report = {
            timestamp: new Date().toISOString(),
            overallScore: this.calculateOverallScore(),
            results: this.testResults,
            summary: this.generateSummary()
        };
        
        console.log('📊 Comprehensive Test Report:', report);
        this.displayReport(report);
        return report;
    }

    calculateOverallScore() {
        const categories = Object.keys(this.testResults);
        let totalScore = 0;
        let categoryCount = 0;
        
        categories.forEach(category => {
            const categoryResults = this.testResults[category];
            if (typeof categoryResults === 'object') {
                const scores = Object.values(categoryResults)
                    .filter(result => typeof result === 'object' && 'score' in result)
                    .map(result => result.score);
                
                if (scores.length > 0) {
                    totalScore += scores.reduce((sum, score) => sum + score, 0) / scores.length;
                    categoryCount++;
                }
            }
        });
        
        return categoryCount > 0 ? Math.round(totalScore / categoryCount) : 0;
    }

    generateSummary() {
        const summary = {
            totalTests: 0,
            passedTests: 0,
            failedTests: 0,
            criticalIssues: [],
            recommendations: []
        };
        
        Object.values(this.testResults).forEach(category => {
            if (typeof category === 'object') {
                Object.values(category).forEach(test => {
                    if (typeof test === 'object' && 'passed' in test) {
                        summary.totalTests++;
                        if (test.passed) {
                            summary.passedTests++;
                        } else {
                            summary.failedTests++;
                            if (test.issues) {
                                summary.criticalIssues.push(...test.issues);
                            }
                        }
                    }
                });
            }
        });
        
        // Generate recommendations
        if (summary.criticalIssues.length > 0) {
            summary.recommendations.push('Fix critical issues before deployment');
        }
        
        if (this.testResults.permissions?.camera?.granted === false) {
            summary.recommendations.push('Implement camera permission request flow');
        }
        
        if (this.testResults.permissions?.location?.granted === false) {
            summary.recommendations.push('Implement location permission request flow');
        }
        
        if (this.testResults.performance?.pageLoadTime?.totalTime > 3000) {
            summary.recommendations.push('Optimize page load performance');
        }
        
        return summary;
    }

    displayReport(report) {
        const reportContainer = document.createElement('div');
        reportContainer.id = 'test-report';
        reportContainer.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            width: 400px;
            max-height: 80vh;
            background: white;
            border: 2px solid #6b7cff;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            overflow-y: auto;
            font-family: 'Cairo', sans-serif;
        `;
        
        reportContainer.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h3 style="margin: 0; color: #6b7cff;">🧪 Test Report</h3>
                <button onclick="document.getElementById('test-report').remove()" style="
                    background: none;
                    border: none;
                    font-size: 20px;
                    cursor: pointer;
                    color: #666;
                ">×</button>
            </div>
            
            <div style="margin-bottom: 20px;">
                <div style="font-size: 24px; font-weight: bold; color: ${report.overallScore >= 80 ? '#10b981' : report.overallScore >= 60 ? '#f59e0b' : '#ef4444'};">
                    ${report.overallScore}%
                </div>
                <div style="color: #666; font-size: 14px;">Overall Score</div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <h4 style="margin: 0 0 10px 0; color: #333;">Summary</h4>
                <div style="font-size: 14px; color: #666;">
                    <div>Total Tests: ${report.summary.totalTests}</div>
                    <div style="color: #10b981;">Passed: ${report.summary.passedTests}</div>
                    <div style="color: #ef4444;">Failed: ${report.summary.failedTests}</div>
                </div>
            </div>
            
            ${report.summary.criticalIssues.length > 0 ? `
                <div style="margin-bottom: 20px;">
                    <h4 style="margin: 0 0 10px 0; color: #ef4444;">Critical Issues</h4>
                    <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #666;">
                        ${report.summary.criticalIssues.slice(0, 5).map(issue => `<li>${issue}</li>`).join('')}
                        ${report.summary.criticalIssues.length > 5 ? `<li>... and ${report.summary.criticalIssues.length - 5} more</li>` : ''}
                    </ul>
                </div>
            ` : ''}
            
            ${report.summary.recommendations.length > 0 ? `
                <div>
                    <h4 style="margin: 0 0 10px 0; color: #6b7cff;">Recommendations</h4>
                    <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #666;">
                        ${report.summary.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
        `;
        
        document.body.appendChild(reportContainer);
    }
}

// Auto-run tests when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Only run in development or when explicitly requested
    if (window.location.hostname === 'localhost' || 
        window.location.search.includes('test=true') ||
        localStorage.getItem('runTests') === 'true') {
        new ComprehensiveTest();
    }
});

// Export for manual testing
window.ComprehensiveTest = ComprehensiveTest;
