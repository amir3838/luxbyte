/**
 * LUXBYTE App Manager
 * مدير التطبيق الموحد
 */

class AppManager {
    constructor() {
        this.isInitialized = false;
        this.modules = {
            theme: null,
            translation: null,
            navigation: null,
            signup: null
        };
        this.init();
    }

    /**
     * Initialize app manager
     * تهيئة مدير التطبيق
     */
    async init() {
        if (this.isInitialized) return;

        try {
            console.log('🚀 Initializing LUXBYTE App Manager...');

            // Initialize modules in order
            await this.initializeModules();

            // Setup global event listeners
            this.setupGlobalListeners();

            // Initialize page-specific functionality
            this.initializePageSpecific();

            this.isInitialized = true;
            console.log('✅ LUXBYTE App Manager initialized successfully');

        } catch (error) {
            console.error('❌ Failed to initialize App Manager:', error);
        }
    }

    /**
     * Initialize all modules
     * تهيئة جميع الوحدات
     */
    async initializeModules() {
        // Initialize Theme Manager
        try {
            const { default: ThemeManager } = await import('./theme-manager.js');
            this.modules.theme = new ThemeManager();
            console.log('✅ Theme Manager initialized');
        } catch (error) {
            console.warn('⚠️ Theme Manager failed to initialize:', error);
        }

        // Initialize Translation Manager
        try {
            const { default: TranslationManager } = await import('./translation-manager.js');
            this.modules.translation = new TranslationManager();
            console.log('✅ Translation Manager initialized');
        } catch (error) {
            console.warn('⚠️ Translation Manager failed to initialize:', error);
        }

        // Initialize Navigation Bar
        try {
            const { default: NavigationBar } = await import('./navigation-bar.js');
            this.modules.navigation = new NavigationBar();
            console.log('✅ Navigation Bar initialized');
        } catch (error) {
            console.warn('⚠️ Navigation Bar failed to initialize:', error);
        }

        // Initialize Signup Navigation (only on signup pages)
        if (this.isSignupPage()) {
            try {
                const { default: SignupNavigation } = await import('./signup-navigation.js');
                this.modules.signup = new SignupNavigation();
                console.log('✅ Signup Navigation initialized');
            } catch (error) {
                console.warn('⚠️ Signup Navigation failed to initialize:', error);
            }
        }
    }

    /**
     * Setup global event listeners
     * إعداد مستمعي الأحداث العامة
     */
    setupGlobalListeners() {
        // Listen for theme changes
        document.addEventListener('themeChanged', (e) => {
            console.log('🎨 Theme changed to:', e.detail.theme);
            this.updatePageForTheme(e.detail.theme);
        });

        // Listen for language changes
        document.addEventListener('languageChanged', (e) => {
            console.log('🌐 Language changed to:', e.detail.language);
            this.updatePageForLanguage(e.detail.language);
        });

        // Listen for authentication changes
        document.addEventListener('authChanged', (e) => {
            console.log('🔐 Auth status changed:', e.detail);
            this.updateNavigationForAuth(e.detail);
        });

        // Listen for file upload events
        document.addEventListener('fileUploaded', (e) => {
            console.log('📁 File uploaded:', e.detail);
            this.handleFileUpload(e.detail);
        });

        // Listen for form validation events
        document.addEventListener('formValidation', (e) => {
            console.log('📝 Form validation:', e.detail);
            this.handleFormValidation(e.detail);
        });
    }

    /**
     * Initialize page-specific functionality
     * تهيئة الوظائف الخاصة بالصفحة
     */
    initializePageSpecific() {
        const currentPage = this.getCurrentPage();

        switch (currentPage) {
            case 'index.html':
                this.initializeHomePage();
                break;
            case 'unified-signup.html':
                this.initializeSignupPage();
                break;
            case 'auth.html':
                this.initializeAuthPage();
                break;
            case 'dashboard.html':
                this.initializeDashboardPage();
                break;
            default:
                console.log('📄 Generic page initialization');
        }
    }

    /**
     * Initialize home page
     * تهيئة الصفحة الرئيسية
     */
    initializeHomePage() {
        console.log('🏠 Initializing home page...');

        // Add any home page specific functionality here
        this.setupHomePageAnimations();
        this.setupHomePageInteractions();
    }

    /**
     * Initialize signup page
     * تهيئة صفحة التسجيل
     */
    initializeSignupPage() {
        console.log('📝 Initializing signup page...');

        // Signup navigation is already initialized in modules
        this.setupSignupPageValidation();
        this.setupSignupPageUploads();
    }

    /**
     * Initialize auth page
     * تهيئة صفحة المصادقة
     */
    initializeAuthPage() {
        console.log('🔐 Initializing auth page...');

        this.setupAuthPageValidation();
        this.setupAuthPageRedirects();
    }

    /**
     * Initialize dashboard page
     * تهيئة صفحة الداشبورد
     */
    initializeDashboardPage() {
        console.log('📊 Initializing dashboard page...');

        this.setupDashboardPageData();
        this.setupDashboardPageInteractions();
    }

    /**
     * Setup home page animations
     * إعداد الرسوم المتحركة للصفحة الرئيسية
     */
    setupHomePageAnimations() {
        // Add fade-in animations to cards
        const cards = document.querySelectorAll('.card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';

            setTimeout(() => {
                card.style.transition = 'all 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    /**
     * Setup home page interactions
     * إعداد التفاعلات في الصفحة الرئيسية
     */
    setupHomePageInteractions() {
        // Add hover effects to platform cards
        const platformCards = document.querySelectorAll('.card[data-platform]');
        platformCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px)';
                card.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            });
        });
    }

    /**
     * Setup signup page validation
     * إعداد التحقق من صفحة التسجيل
     */
    setupSignupPageValidation() {
        // Real-time validation for form fields
        const form = document.getElementById('signupForm');
        if (!form) return;

        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });

            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });
        });
    }

    /**
     * Setup signup page uploads
     * إعداد الرفع في صفحة التسجيل
     */
    setupSignupPageUploads() {
        // Setup file upload progress tracking
        document.addEventListener('fileUploadStart', (e) => {
            this.showUploadProgress(e.detail);
        });

        document.addEventListener('fileUploadComplete', (e) => {
            this.hideUploadProgress(e.detail);
        });
    }

    /**
     * Setup auth page validation
     * إعداد التحقق من صفحة المصادقة
     */
    setupAuthPageValidation() {
        const form = document.getElementById('loginForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAuthSubmit(form);
        });
    }

    /**
     * Setup auth page redirects
     * إعداد التوجيه في صفحة المصادقة
     */
    setupAuthPageRedirects() {
        // Check if user is already logged in
        this.checkExistingAuth();
    }

    /**
     * Setup dashboard page data
     * إعداد بيانات صفحة الداشبورد
     */
    setupDashboardPageData() {
        // Load dashboard data
        this.loadDashboardData();
    }

    /**
     * Setup dashboard page interactions
     * إعداد التفاعلات في صفحة الداشبورد
     */
    setupDashboardPageInteractions() {
        // Setup dashboard-specific interactions
        this.setupDashboardTabs();
        this.setupDashboardFilters();
    }

    /**
     * Update page for theme change
     * تحديث الصفحة لتغيير الثيم
     */
    updatePageForTheme(theme) {
        // Update any theme-specific elements
        const body = document.body;
        body.className = body.className.replace(/light|dark/g, '');
        body.classList.add(theme);
    }

    /**
     * Update page for language change
     * تحديث الصفحة لتغيير اللغة
     */
    updatePageForLanguage(language) {
        // Update any language-specific elements
        document.documentElement.lang = language;
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    }

    /**
     * Update navigation for auth status
     * تحديث التنقل لحالة المصادقة
     */
    updateNavigationForAuth(authData) {
        if (this.modules.navigation) {
            this.modules.navigation.refresh();
        }
    }

    /**
     * Handle file upload
     * معالجة رفع الملف
     */
    handleFileUpload(uploadData) {
        console.log('📁 Handling file upload:', uploadData);
        // Add any file upload handling logic here
    }

    /**
     * Handle form validation
     * معالجة التحقق من النموذج
     */
    handleFormValidation(validationData) {
        console.log('📝 Handling form validation:', validationData);
        // Add any form validation handling logic here
    }

    /**
     * Validate a single field
     * التحقق من حقل واحد
     */
    validateField(field) {
        const value = field.value.trim();
        const isRequired = field.hasAttribute('required');
        const type = field.type;

        if (isRequired && !value) {
            this.showFieldError(field, 'هذا الحقل مطلوب');
            return false;
        }

        if (type === 'email' && value && !this.isValidEmail(value)) {
            this.showFieldError(field, 'البريد الإلكتروني غير صحيح');
            return false;
        }

        if (type === 'tel' && value && !this.isValidPhone(value)) {
            this.showFieldError(field, 'رقم الهاتف غير صحيح');
            return false;
        }

        this.clearFieldError(field);
        return true;
    }

    /**
     * Show field error
     * عرض خطأ الحقل
     */
    showFieldError(field, message) {
        field.style.borderColor = '#ef4444';
        field.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';

        // Show error message
        let errorElement = field.parentNode.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            errorElement.style.color = '#ef4444';
            errorElement.style.fontSize = '12px';
            errorElement.style.marginTop = '4px';
            field.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }

    /**
     * Clear field error
     * مسح خطأ الحقل
     */
    clearFieldError(field) {
        field.style.borderColor = '';
        field.style.boxShadow = '';

        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    /**
     * Validate email format
     * التحقق من صيغة البريد الإلكتروني
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Validate phone format
     * التحقق من صيغة الهاتف
     */
    isValidPhone(phone) {
        const phoneRegex = /^01[0-9]{9}$/;
        return phoneRegex.test(phone);
    }

    /**
     * Handle auth form submission
     * معالجة إرسال نموذج المصادقة
     */
    async handleAuthSubmit(form) {
        const formData = new FormData(form);
        const email = formData.get('email');
        const password = formData.get('password');

        try {
            // Import auth functions
            const { handleLogin } = await import('./auth.js');
            await handleLogin(email, password);

            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        } catch (error) {
            console.error('Login failed:', error);
            this.showErrorMessage('فشل في تسجيل الدخول. يرجى المحاولة مرة أخرى.');
        }
    }

    /**
     * Check existing authentication
     * فحص المصادقة الموجودة
     */
    async checkExistingAuth() {
        try {
            const { checkAuthAndRedirect } = await import('./auth.js');
            await checkAuthAndRedirect();
        } catch (error) {
            console.log('No existing auth found');
        }
    }

    /**
     * Load dashboard data
     * تحميل بيانات الداشبورد
     */
    async loadDashboardData() {
        // Load dashboard-specific data
        console.log('📊 Loading dashboard data...');
    }

    /**
     * Setup dashboard tabs
     * إعداد تبويبات الداشبورد
     */
    setupDashboardTabs() {
        // Setup dashboard tab functionality
        console.log('📊 Setting up dashboard tabs...');
    }

    /**
     * Setup dashboard filters
     * إعداد مرشحات الداشبورد
     */
    setupDashboardFilters() {
        // Setup dashboard filter functionality
        console.log('📊 Setting up dashboard filters...');
    }

    /**
     * Show upload progress
     * عرض تقدم الرفع
     */
    showUploadProgress(uploadData) {
        console.log('📁 Showing upload progress:', uploadData);
    }

    /**
     * Hide upload progress
     * إخفاء تقدم الرفع
     */
    hideUploadProgress(uploadData) {
        console.log('📁 Hiding upload progress:', uploadData);
    }

    /**
     * Show error message
     * عرض رسالة خطأ
     */
    showErrorMessage(message) {
        if (typeof LUXBYTE !== 'undefined' && LUXBYTE.notifyErr) {
            LUXBYTE.notifyErr(message);
        } else {
            alert(message);
        }
    }

    /**
     * Show success message
     * عرض رسالة نجاح
     */
    showSuccessMessage(message) {
        if (typeof LUXBYTE !== 'undefined' && LUXBYTE.notifyOk) {
            LUXBYTE.notifyOk(message);
        } else {
            alert(message);
        }
    }

    /**
     * Get current page
     * الحصول على الصفحة الحالية
     */
    getCurrentPage() {
        const path = window.location.pathname;
        return path.split('/').pop() || 'index.html';
    }

    /**
     * Check if current page is signup page
     * فحص إذا كانت الصفحة الحالية صفحة تسجيل
     */
    isSignupPage() {
        const currentPage = this.getCurrentPage();
        return currentPage.includes('signup') || currentPage.includes('register');
    }

    /**
     * Get module
     * الحصول على وحدة
     */
    getModule(moduleName) {
        return this.modules[moduleName];
    }

    /**
     * Check if app is initialized
     * فحص إذا كان التطبيق مهيأ
     */
    isAppInitialized() {
        return this.isInitialized;
    }
}

// Initialize app manager when DOM is ready
let appManager;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        appManager = new AppManager();
    });
} else {
    appManager = new AppManager();
}

// Export for global access
if (typeof window !== 'undefined') {
    window.AppManager = AppManager;
    window.appManager = appManager;
}

export default AppManager;
