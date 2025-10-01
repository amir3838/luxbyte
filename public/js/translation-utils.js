// Translation Utils - Simple translation management
class TranslationUtils {
    constructor() {
        this.translations = {
            ar: {
                'reg.title': 'إنشاء حساب جديد - LUXBYTE',
                'reg.documents.title': 'المستندات المطلوبة',
                'reg.location.detect': 'حدد موقعك',
                'reg.location.success': 'تم تحديد الموقع',
                'reg.location.error': 'تعذر تحديد الموقع',
                'reg.password.show': 'إظهار',
                'reg.password.hide': 'إخفاء',
                'reg.password.requirements': 'متطلبات كلمة المرور',
                'reg.password.match': 'تأكيد كلمة المرور',
                'reg.email.invalid': 'البريد الإلكتروني غير صحيح',
                'reg.submit': 'إنشاء الحساب',
                'reg.loading': 'جارٍ التحميل...'
            },
            en: {
                'reg.title': 'Create New Account - LUXBYTE',
                'reg.documents.title': 'Required Documents',
                'reg.location.detect': 'Detect Location',
                'reg.location.success': 'Location Detected',
                'reg.location.error': 'Failed to Detect Location',
                'reg.password.show': 'Show',
                'reg.password.hide': 'Hide',
                'reg.password.requirements': 'Password Requirements',
                'reg.password.match': 'Confirm Password',
                'reg.email.invalid': 'Invalid Email Address',
                'reg.submit': 'Create Account',
                'reg.loading': 'Loading...'
            }
        };
        this.currentLang = localStorage.getItem('language') || 'ar';
        this.init();
    }

    init() {
        this.applyTranslations();
        this.bindEvents();
    }

    applyTranslations() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.translations[this.currentLang]?.[key] || key;
            element.textContent = translation;
        });
    }

    setLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLang = lang;
            localStorage.setItem('language', lang);
            this.applyTranslations();
        }
    }

    bindEvents() {
        // Bind language toggle buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-lang-toggle]')) {
                e.preventDefault();
                const newLang = this.currentLang === 'ar' ? 'en' : 'ar';
                this.setLanguage(newLang);
            }
        });
    }

    t(key) {
        return this.translations[this.currentLang]?.[key] || key;
    }
}

// Initialize translation utils
const translationUtils = new TranslationUtils();

// Export for global usage
window.translationUtils = translationUtils;
