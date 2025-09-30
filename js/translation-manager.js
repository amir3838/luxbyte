/**
 * LUXBYTE Translation Manager
 * مدير الترجمة المحسن
 */

class TranslationManager {
    constructor() {
        this.currentLang = this.getStoredLanguage() || this.getBrowserLanguage();
        this.dict = i18nDict;
        this.init();
    }

    /**
     * Initialize translation manager
     * تهيئة مدير الترجمة
     */
    init() {
        this.applyLanguage(this.currentLang);
        this.createLanguageToggle();
        this.setupLanguageListeners();
        console.log(`🌐 Translation Manager initialized: ${this.currentLang}`);
    }

    /**
     * Get stored language from localStorage
     * الحصول على اللغة المحفوظة
     */
    getStoredLanguage() {
        try {
            return localStorage.getItem('luxbyte-language');
        } catch (error) {
            console.warn('Could not access localStorage:', error);
            return null;
        }
    }

    /**
     * Get browser language preference
     * الحصول على تفضيل لغة المتصفح
     */
    getBrowserLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        return browserLang.startsWith('ar') ? 'ar' : 'en';
    }

    /**
     * Apply language to document
     * تطبيق اللغة على المستند
     */
    applyLanguage(lang) {
        if (!this.dict[lang]) {
            console.warn(`Language ${lang} not found, falling back to Arabic`);
            lang = 'ar';
        }

        this.currentLang = lang;
        this.saveLanguage(lang);
        this.updateDocumentLanguage(lang);
        this.translateAllElements();
        this.updateLanguageToggle(lang);

        // Trigger custom event
        document.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: lang }
        }));
    }

    /**
     * Save language to localStorage
     * حفظ اللغة في التخزين المحلي
     */
    saveLanguage(lang) {
        try {
            localStorage.setItem('luxbyte-language', lang);
        } catch (error) {
            console.warn('Could not save language to localStorage:', error);
        }
    }

    /**
     * Update document language attribute
     * تحديث خاصية لغة المستند
     */
    updateDocumentLanguage(lang) {
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    }

    /**
     * Translate all elements with data-i18n attribute
     * ترجمة جميع العناصر مع خاصية data-i18n
     */
    translateAllElements() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            this.translateElement(element);
        });
    }

    /**
     * Translate a specific element
     * ترجمة عنصر محدد
     */
    translateElement(element) {
        const key = element.getAttribute('data-i18n');
        const translation = this.getTranslation(key);

        if (translation) {
            if (element.tagName === 'INPUT' && (element.type === 'text' || element.type === 'email' || element.type === 'tel' || element.type === 'password')) {
                element.placeholder = translation;
            } else if (element.tagName === 'TEXTAREA') {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        } else {
            console.warn(`Translation not found for key: ${key}`);
        }
    }

    /**
     * Get translation for a key
     * الحصول على الترجمة لمفتاح
     */
    getTranslation(key) {
        return this.dict[this.currentLang]?.[key] || this.dict['ar']?.[key] || key;
    }

    /**
     * Toggle between Arabic and English
     * التبديل بين العربية والإنجليزية
     */
    toggleLanguage() {
        const newLang = this.currentLang === 'ar' ? 'en' : 'ar';
        this.applyLanguage(newLang);
        this.showLanguageNotification(newLang);
        console.log(`🔄 Language toggled to: ${newLang}`);
    }

    /**
     * Create language toggle button
     * إنشاء زر تبديل اللغة
     */
    createLanguageToggle() {
        // Remove existing toggle if any
        const existingToggle = document.querySelector('.language-toggle');
        if (existingToggle) {
            existingToggle.remove();
        }

        const toggle = document.createElement('button');
        toggle.className = 'language-toggle';
        toggle.setAttribute('aria-label', 'Toggle language');
        toggle.innerHTML = this.getLanguageIcon();

        toggle.addEventListener('click', () => this.toggleLanguage());

        // Add to navbar if exists, otherwise add to body
        const navbar = document.querySelector('.navbar-user');
        if (navbar) {
            navbar.appendChild(toggle);
        } else {
            document.body.appendChild(toggle);
        }
    }

    /**
     * Get appropriate icon for current language
     * الحصول على الأيقونة المناسبة للغة الحالية
     */
    getLanguageIcon() {
        return this.currentLang === 'ar'
            ? '<i class="fas fa-globe"></i><span>EN</span>'
            : '<i class="fas fa-globe"></i><span>AR</span>';
    }

    /**
     * Update language toggle icon
     * تحديث أيقونة زر اللغة
     */
    updateLanguageToggle(lang) {
        const toggle = document.querySelector('.language-toggle');
        if (toggle) {
            toggle.innerHTML = this.getLanguageIcon();
        }
    }

    /**
     * Setup language change listeners
     * إعداد مستمعي تغيير اللغة
     */
    setupLanguageListeners() {
        // Listen for custom language changes
        document.addEventListener('languageChanged', (e) => {
            this.updateLanguageToggle(e.detail.language);
        });

        // Listen for new elements added to DOM
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.hasAttribute && node.hasAttribute('data-i18n')) {
                            this.translateElement(node);
                        }
                        const elements = node.querySelectorAll && node.querySelectorAll('[data-i18n]');
                        if (elements) {
                            elements.forEach(element => this.translateElement(element));
                        }
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    /**
     * Show language change notification
     * عرض إشعار تغيير اللغة
     */
    showLanguageNotification(lang) {
        const message = lang === 'ar'
            ? 'تم التبديل إلى العربية 🇸🇦'
            : 'Switched to English 🇺🇸';

        if (typeof LUXBYTE !== 'undefined' && LUXBYTE.notifyOk) {
            LUXBYTE.notifyOk(message);
        } else {
            console.log(`🌐 ${message}`);
        }
    }

    /**
     * Get current language
     * الحصول على اللغة الحالية
     */
    getCurrentLanguage() {
        return this.currentLang;
    }

    /**
     * Set specific language
     * تعيين لغة محددة
     */
    setLanguage(lang) {
        if (lang === 'ar' || lang === 'en') {
            this.applyLanguage(lang);
        } else {
            console.warn('Invalid language:', lang);
        }
    }

    /**
     * Translate text programmatically
     * ترجمة النص برمجياً
     */
    t(key, params = {}) {
        let translation = this.getTranslation(key);

        // Replace parameters in translation
        Object.keys(params).forEach(param => {
            translation = translation.replace(`{${param}}`, params[param]);
        });

        return translation;
    }

    /**
     * Add new translation key
     * إضافة مفتاح ترجمة جديد
     */
    addTranslation(lang, key, value) {
        if (!this.dict[lang]) {
            this.dict[lang] = {};
        }
        this.dict[lang][key] = value;
    }

    /**
     * Get all available languages
     * الحصول على جميع اللغات المتاحة
     */
    getAvailableLanguages() {
        return Object.keys(this.dict);
    }

    /**
     * Check if translation exists
     * فحص وجود الترجمة
     */
    hasTranslation(key) {
        return !!(this.dict[this.currentLang]?.[key] || this.dict['ar']?.[key]);
    }
}

// Initialize translation manager when DOM is ready
let translationManager;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        translationManager = new TranslationManager();
    });
} else {
    translationManager = new TranslationManager();
}

// Export for global access
if (typeof window !== 'undefined') {
    window.TranslationManager = TranslationManager;
    window.translationManager = translationManager;
    window.t = (key, params) => translationManager.t(key, params);
}

// Auto-initialize translation manager
document.addEventListener('DOMContentLoaded', () => {
    if (!translationManager) {
        translationManager = new TranslationManager();
    }
});

export default TranslationManager;
