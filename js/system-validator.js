/**
 * LUXBYTE System Validator
 * مدقق النظام الشامل للتأكد من عمل جميع المكونات
 */

class SystemValidator {
    constructor() {
        this.results = {
            backend: { status: 'pending', details: [] },
            frontend: { status: 'pending', details: [] },
            assets: { status: 'pending', details: [] },
            permissions: { status: 'pending', details: [] },
            integration: { status: 'pending', details: [] }
        };
    }

    /**
     * Run complete system validation
     * تشغيل التحقق الشامل من النظام
     */
    async validateAll() {
        console.log('🔍 Starting comprehensive system validation...');
        
        try {
            await Promise.all([
                this.validateBackend(),
                this.validateFrontend(),
                this.validateAssets(),
                this.validatePermissions(),
                this.validateIntegration()
            ]);

            this.generateReport();
            return this.results;
        } catch (error) {
            console.error('❌ System validation failed:', error);
            throw error;
        }
    }

    /**
     * Validate backend connections
     * التحقق من اتصالات الباك اند
     */
    async validateBackend() {
        console.log('🔍 Validating backend connections...');
        
        try {
            // Test Supabase connection
            const { getSupabase } = await import('./supabase-client.js');
            const supabase = getSupabase();
            
            // Test auth
            const { data: { session }, error: authError } = await supabase.auth.getSession();
            this.results.backend.details.push({
                test: 'Supabase Auth',
                status: authError ? 'error' : 'success',
                message: authError ? authError.message : 'Auth connection successful'
            });

            // Test database connection
            const { data: dbData, error: dbError } = await supabase
                .from('profiles')
                .select('count')
                .limit(1);
            
            this.results.backend.details.push({
                test: 'Database Connection',
                status: dbError ? 'error' : 'success',
                message: dbError ? dbError.message : 'Database connection successful'
            });

            // Test storage connection
            const { data: storageData, error: storageError } = await supabase.storage
                .from('kyc_docs')
                .list('', { limit: 1 });
            
            this.results.backend.details.push({
                test: 'Storage Connection',
                status: storageError ? 'error' : 'success',
                message: storageError ? storageError.message : 'Storage connection successful'
            });

            // Test Firebase connection
            if (window.firebase) {
                this.results.backend.details.push({
                    test: 'Firebase Connection',
                    status: 'success',
                    message: 'Firebase initialized successfully'
                });
            } else {
                this.results.backend.details.push({
                    test: 'Firebase Connection',
                    status: 'warning',
                    message: 'Firebase not initialized'
                });
            }

            this.results.backend.status = 'success';
        } catch (error) {
            this.results.backend.status = 'error';
            this.results.backend.details.push({
                test: 'Backend Validation',
                status: 'error',
                message: error.message
            });
        }
    }

    /**
     * Validate frontend components
     * التحقق من مكونات الفرونت اند
     */
    async validateFrontend() {
        console.log('🔍 Validating frontend components...');
        
        try {
            // Check theme manager
            if (window.translationManager) {
                this.results.frontend.details.push({
                    test: 'Theme Manager',
                    status: 'success',
                    message: 'Theme manager loaded successfully'
                });
            } else {
                this.results.frontend.details.push({
                    test: 'Theme Manager',
                    status: 'error',
                    message: 'Theme manager not loaded'
                });
            }

            // Check translation manager
            if (window.translationManager) {
                this.results.frontend.details.push({
                    test: 'Translation Manager',
                    status: 'success',
                    message: 'Translation manager loaded successfully'
                });
            } else {
                this.results.frontend.details.push({
                    test: 'Translation Manager',
                    status: 'error',
                    message: 'Translation manager not loaded'
                });
            }

            // Check navigation bar
            if (window.navigationBar) {
                this.results.frontend.details.push({
                    test: 'Navigation Bar',
                    status: 'success',
                    message: 'Navigation bar loaded successfully'
                });
            } else {
                this.results.frontend.details.push({
                    test: 'Navigation Bar',
                    status: 'error',
                    message: 'Navigation bar not loaded'
                });
            }

            // Check form validation
            const forms = document.querySelectorAll('form');
            if (forms.length > 0) {
                this.results.frontend.details.push({
                    test: 'Form Elements',
                    status: 'success',
                    message: `${forms.length} forms found and ready`
                });
            } else {
                this.results.frontend.details.push({
                    test: 'Form Elements',
                    status: 'warning',
                    message: 'No forms found on current page'
                });
            }

            // Check responsive design
            const viewport = document.querySelector('meta[name="viewport"]');
            if (viewport) {
                this.results.frontend.details.push({
                    test: 'Responsive Design',
                    status: 'success',
                    message: 'Viewport meta tag configured'
                });
            } else {
                this.results.frontend.details.push({
                    test: 'Responsive Design',
                    status: 'error',
                    message: 'Viewport meta tag missing'
                });
            }

            this.results.frontend.status = 'success';
        } catch (error) {
            this.results.frontend.status = 'error';
            this.results.frontend.details.push({
                test: 'Frontend Validation',
                status: 'error',
                message: error.message
            });
        }
    }

    /**
     * Validate assets and resources
     * التحقق من الأصول والموارد
     */
    async validateAssets() {
        console.log('🔍 Validating assets and resources...');
        
        try {
            // Check critical images
            const criticalImages = [
                'assets/app_icon/LUXBYTE.png',
                'assets/app_icon/LUXBYTEICON.PNG',
                'assets/images/shopeg_logo.webp'
            ];

            for (const imagePath of criticalImages) {
                try {
                    const response = await fetch(imagePath, { method: 'HEAD' });
                    this.results.assets.details.push({
                        test: `Image: ${imagePath}`,
                        status: response.ok ? 'success' : 'error',
                        message: response.ok ? 'Image accessible' : `HTTP ${response.status}`
                    });
                } catch (error) {
                    this.results.assets.details.push({
                        test: `Image: ${imagePath}`,
                        status: 'error',
                        message: 'Image not accessible'
                    });
                }
            }

            // Check CSS files
            const cssFiles = [
                'styles.css',
                'css/themes.css',
                'css/clean-styles.css'
            ];

            for (const cssFile of cssFiles) {
                try {
                    const response = await fetch(cssFile, { method: 'HEAD' });
                    this.results.assets.details.push({
                        test: `CSS: ${cssFile}`,
                        status: response.ok ? 'success' : 'error',
                        message: response.ok ? 'CSS file accessible' : `HTTP ${response.status}`
                    });
                } catch (error) {
                    this.results.assets.details.push({
                        test: `CSS: ${cssFile}`,
                        status: 'error',
                        message: 'CSS file not accessible'
                    });
                }
            }

            // Check JavaScript files
            const jsFiles = [
                'js/supabase-client.js',
                'js/translation-manager.js',
                'js/theme-manager.js',
                'js/navigation-bar.js'
            ];

            for (const jsFile of jsFiles) {
                try {
                    const response = await fetch(jsFile, { method: 'HEAD' });
                    this.results.assets.details.push({
                        test: `JS: ${jsFile}`,
                        status: response.ok ? 'success' : 'error',
                        message: response.ok ? 'JS file accessible' : `HTTP ${response.status}`
                    });
                } catch (error) {
                    this.results.assets.details.push({
                        test: `JS: ${jsFile}`,
                        status: 'error',
                        message: 'JS file not accessible'
                    });
                }
            }

            this.results.assets.status = 'success';
        } catch (error) {
            this.results.assets.status = 'error';
            this.results.assets.details.push({
                test: 'Assets Validation',
                status: 'error',
                message: error.message
            });
        }
    }

    /**
     * Validate permissions and access
     * التحقق من الأذونات والوصول
     */
    async validatePermissions() {
        console.log('🔍 Validating permissions and access...');
        
        try {
            // Check camera permission
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                    stream.getTracks().forEach(track => track.stop());
                    this.results.permissions.details.push({
                        test: 'Camera Access',
                        status: 'success',
                        message: 'Camera permission granted'
                    });
                } catch (error) {
                    this.results.permissions.details.push({
                        test: 'Camera Access',
                        status: 'warning',
                        message: 'Camera permission denied or not available'
                    });
                }
            } else {
                this.results.permissions.details.push({
                    test: 'Camera Access',
                    status: 'warning',
                    message: 'Camera API not supported'
                });
            }

            // Check geolocation permission
            if (navigator.geolocation) {
                this.results.permissions.details.push({
                    test: 'Geolocation API',
                    status: 'success',
                    message: 'Geolocation API available'
                });
            } else {
                this.results.permissions.details.push({
                    test: 'Geolocation API',
                    status: 'warning',
                    message: 'Geolocation API not supported'
                });
            }

            // Check localStorage
            try {
                localStorage.setItem('test', 'test');
                localStorage.removeItem('test');
                this.results.permissions.details.push({
                    test: 'Local Storage',
                    status: 'success',
                    message: 'Local storage accessible'
                });
            } catch (error) {
                this.results.permissions.details.push({
                    test: 'Local Storage',
                    status: 'error',
                    message: 'Local storage not accessible'
                });
            }

            // Check service worker support
            if ('serviceWorker' in navigator) {
                this.results.permissions.details.push({
                    test: 'Service Worker',
                    status: 'success',
                    message: 'Service worker supported'
                });
            } else {
                this.results.permissions.details.push({
                    test: 'Service Worker',
                    status: 'warning',
                    message: 'Service worker not supported'
                });
            }

            this.results.permissions.status = 'success';
        } catch (error) {
            this.results.permissions.status = 'error';
            this.results.permissions.details.push({
                test: 'Permissions Validation',
                status: 'error',
                message: error.message
            });
        }
    }

    /**
     * Validate integration between components
     * التحقق من التكامل بين المكونات
     */
    async validateIntegration() {
        console.log('🔍 Validating component integration...');
        
        try {
            // Check theme integration
            const body = document.body;
            if (body.classList.contains('light') || body.classList.contains('dark')) {
                this.results.integration.details.push({
                    test: 'Theme Integration',
                    status: 'success',
                    message: 'Theme classes applied to body'
                });
            } else {
                this.results.integration.details.push({
                    test: 'Theme Integration',
                    status: 'warning',
                    message: 'No theme classes found on body'
                });
            }

            // Check translation integration
            const translatedElements = document.querySelectorAll('[data-i18n]');
            if (translatedElements.length > 0) {
                this.results.integration.details.push({
                    test: 'Translation Integration',
                    status: 'success',
                    message: `${translatedElements.length} elements ready for translation`
                });
            } else {
                this.results.integration.details.push({
                    test: 'Translation Integration',
                    status: 'warning',
                    message: 'No translation elements found'
                });
            }

            // Check form integration
            const forms = document.querySelectorAll('form');
            let formIntegrationOk = true;
            for (const form of forms) {
                const requiredFields = form.querySelectorAll('[required]');
                if (requiredFields.length === 0) {
                    formIntegrationOk = false;
                    break;
                }
            }
            
            this.results.integration.details.push({
                test: 'Form Integration',
                status: formIntegrationOk ? 'success' : 'warning',
                message: formIntegrationOk ? 'Forms properly configured' : 'Some forms missing required fields'
            });

            // Check navigation integration
            const navElements = document.querySelectorAll('nav, .navbar, .navigation');
            if (navElements.length > 0) {
                this.results.integration.details.push({
                    test: 'Navigation Integration',
                    status: 'success',
                    message: 'Navigation elements found'
                });
            } else {
                this.results.integration.details.push({
                    test: 'Navigation Integration',
                    status: 'warning',
                    message: 'No navigation elements found'
                });
            }

            this.results.integration.status = 'success';
        } catch (error) {
            this.results.integration.status = 'error';
            this.results.integration.details.push({
                test: 'Integration Validation',
                status: 'error',
                message: error.message
            });
        }
    }

    /**
     * Generate validation report
     * إنشاء تقرير التحقق
     */
    generateReport() {
        console.log('📊 Generating validation report...');
        
        const report = {
            timestamp: new Date().toISOString(),
            overall: this.getOverallStatus(),
            summary: this.getSummary(),
            details: this.results
        };

        console.log('📋 Validation Report:', report);
        
        // Display report in UI if possible
        this.displayReport(report);
        
        return report;
    }

    /**
     * Get overall system status
     * الحصول على حالة النظام العامة
     */
    getOverallStatus() {
        const statuses = Object.values(this.results).map(result => result.status);
        
        if (statuses.every(status => status === 'success')) {
            return 'excellent';
        } else if (statuses.some(status => status === 'error')) {
            return 'needs_attention';
        } else {
            return 'good';
        }
    }

    /**
     * Get summary of validation results
     * الحصول على ملخص نتائج التحقق
     */
    getSummary() {
        const summary = {};
        
        for (const [category, result] of Object.entries(this.results)) {
            const total = result.details.length;
            const success = result.details.filter(d => d.status === 'success').length;
            const warnings = result.details.filter(d => d.status === 'warning').length;
            const errors = result.details.filter(d => d.status === 'error').length;
            
            summary[category] = {
                total,
                success,
                warnings,
                errors,
                status: result.status
            };
        }
        
        return summary;
    }

    /**
     * Display validation report in UI
     * عرض تقرير التحقق في واجهة المستخدم
     */
    displayReport(report) {
        // Create report container
        const reportContainer = document.createElement('div');
        reportContainer.id = 'system-validation-report';
        reportContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 400px;
            max-height: 80vh;
            overflow-y: auto;
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            padding: 20px;
            font-family: 'Cairo', sans-serif;
        `;

        // Add report content
        reportContainer.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                <h3 style="margin: 0; color: #333;">تقرير التحقق من النظام</h3>
                <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; font-size: 20px; cursor: pointer;">×</button>
            </div>
            <div style="margin-bottom: 16px;">
                <div style="display: flex; align-items: center; margin-bottom: 8px;">
                    <span style="font-weight: bold; margin-left: 8px;">الحالة العامة:</span>
                    <span style="color: ${report.overall === 'excellent' ? '#10b981' : report.overall === 'good' ? '#f59e0b' : '#ef4444'};">
                        ${report.overall === 'excellent' ? 'ممتاز' : report.overall === 'good' ? 'جيد' : 'يحتاج انتباه'}
                    </span>
                </div>
                <div style="font-size: 12px; color: #666;">
                    ${new Date(report.timestamp).toLocaleString('ar-EG')}
                </div>
            </div>
            <div style="max-height: 300px; overflow-y: auto;">
                ${Object.entries(report.details).map(([category, result]) => `
                    <div style="margin-bottom: 16px; padding: 12px; background: #f8fafc; border-radius: 6px;">
                        <div style="font-weight: bold; margin-bottom: 8px; color: #333;">
                            ${this.getCategoryName(category)} (${result.status})
                        </div>
                        <div style="font-size: 12px;">
                            ${result.details.map(detail => `
                                <div style="margin-bottom: 4px; display: flex; align-items: center;">
                                    <span style="color: ${detail.status === 'success' ? '#10b981' : detail.status === 'warning' ? '#f59e0b' : '#ef4444'}; margin-left: 8px;">
                                        ${detail.status === 'success' ? '✓' : detail.status === 'warning' ? '⚠' : '✗'}
                                    </span>
                                    <span style="font-size: 11px;">${detail.test}: ${detail.message}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        // Add to page
        document.body.appendChild(reportContainer);

        // Auto-remove after 30 seconds
        setTimeout(() => {
            if (reportContainer.parentNode) {
                reportContainer.remove();
            }
        }, 30000);
    }

    /**
     * Get Arabic category name
     * الحصول على اسم الفئة بالعربية
     */
    getCategoryName(category) {
        const names = {
            backend: 'الباك اند',
            frontend: 'الفرونت اند',
            assets: 'الأصول',
            permissions: 'الأذونات',
            integration: 'التكامل'
        };
        return names[category] || category;
    }
}

// Export for global access
if (typeof window !== 'undefined') {
    window.SystemValidator = SystemValidator;
}

export default SystemValidator;
