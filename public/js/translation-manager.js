/**
 * LUXBYTE Translation Manager
 * مدير الترجمة - يدعم العربية والإنجليزية مع الإيموجي
 */

const LANG_KEY = 'lang';
const dict = window.i18nDict || {};
let btn;

function applyLanguage(lang){
  document.documentElement.lang = lang;
  document.documentElement.dir  = (lang === 'ar') ? 'rtl' : 'ltr';
  localStorage.setItem(LANG_KEY, lang);

  // بدّل نصوص العناصر اللي عليها data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const k = el.getAttribute('data-i18n');
    const v = dict?.[lang]?.[k];
    if (v) el.textContent = v;
  });

  // Fallback to humanize keys if translation fails
  function humanizeKey(k){
    return k.replace(/^([a-z_]+\.)+/,'').replace(/[_\.]/g,' ').trim();
  }
  document.querySelectorAll('[data-i18n], .i18n').forEach(el=>{
    if(/^[a-z0-9_\.]+$/i.test(el.textContent.trim())) {
      el.textContent = humanizeKey(el.textContent);
    }
  });

  btn = btn || document.querySelector('#langToggle,[data-action="toggle-lang"]');
  if (btn) btn.textContent = (lang === 'ar') ? '🇸🇦' : '🇬🇧';
}

function initLang(){
  const lang = localStorage.getItem(LANG_KEY) || 'ar';
  applyLanguage(lang);

  document.addEventListener('click',(e)=>{
    const t = e.target.closest('#langToggle,[data-action="toggle-lang"]');
    if (!t) return;
    const next = (document.documentElement.lang === 'ar') ? 'en' : 'ar';
    applyLanguage(next);
  });
}

document.addEventListener('DOMContentLoaded', initLang);

// Legacy class for compatibility
class TranslationManager {
    constructor() {
        this.currentLanguage = this.getStoredLanguage() || 'ar';
        this.dictionary = window.i18nDict || {};
        this.init();
    }

    /**
     * Initialize translation manager
     * تهيئة مدير الترجمة
     */
    init() {
        this.applyLanguage(this.currentLanguage);
        this.setupEventListeners();
        this.observeDynamicContent();
        console.log('🌍 Translation manager initialized:', this.currentLanguage);
    }

    /**
     * Get stored language from localStorage
     * الحصول على اللغة المحفوظة
     */
    getStoredLanguage() {
        try {
            return localStorage.getItem('lang');
        } catch (error) {
            console.warn('Could not access localStorage:', error);
            return null;
        }
    }

    /**
     * Apply language to document
     * تطبيق اللغة على المستند
     */
    applyLanguage(lang) {
        if (!lang || !['ar', 'en'].includes(lang)) {
            console.warn('Invalid language:', lang);
            return;
        }

        // Set document attributes
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

        // Update language toggle button if exists
        const langToggle = document.querySelector('#langToggle, [data-action="toggle-lang"]');
        if (langToggle) {
            langToggle.textContent = lang === 'ar' ? '🇸🇦' : '🇬🇧';
        }

        // Translate all elements with data-i18n attribute
        this.translateElements();

        this.currentLanguage = lang;
        console.log(`🌍 Language applied: ${lang}`);
    }

    /**
     * Translate all elements with data-i18n attribute
     * ترجمة جميع العناصر مع data-i18n
     */
    translateElements() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            this.translateElement(element);
        });
    }

    /**
     * Translate a single element
     * ترجمة عنصر واحد
     */
    translateElement(element) {
        const key = element.getAttribute('data-i18n');
        if (!key) return;

        const translation = this.dictionary[this.currentLanguage]?.[key];
        if (translation) {
            element.textContent = translation;
        } else {
            console.warn(`Translation missing for key: ${key} in language: ${this.currentLanguage}`);
        }
    }

    /**
     * Toggle between Arabic and English
     * تبديل بين العربية والإنجليزية
     */
    toggleLanguage() {
        const newLang = this.currentLanguage === 'ar' ? 'en' : 'ar';
        this.setLanguage(newLang);
    }

    /**
     * Set specific language
     * تعيين لغة محددة
     */
    setLanguage(lang) {
        if (!lang || !['ar', 'en'].includes(lang)) {
            console.warn('Invalid language:', lang);
            return;
        }

        this.applyLanguage(lang);
        this.saveLanguage(lang);
    }

    /**
     * Save language to localStorage
     * حفظ اللغة في localStorage
     */
    saveLanguage(lang) {
        try {
            localStorage.setItem('lang', lang);
            console.log(`💾 Language saved: ${lang}`);
        } catch (error) {
            console.warn('Could not save language to localStorage:', error);
        }
    }

    /**
     * Setup event listeners
     * إعداد مستمعي الأحداث
     */
    setupEventListeners() {
        // Listen for language toggle clicks
        document.addEventListener('click', (e) => {
            const langToggle = e.target.closest('#langToggle, [data-action="toggle-lang"]');
            if (langToggle) {
                e.preventDefault();
                this.toggleLanguage();
            }
        });
    }

    /**
     * Observe dynamic content for translation
     * مراقبة المحتوى الديناميكي للترجمة
     */
    observeDynamicContent() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // Translate new elements with data-i18n
                            if (node.hasAttribute && node.hasAttribute('data-i18n')) {
                                this.translateElement(node);
                            }
                            // Translate children of new elements
                            const translatableElements = node.querySelectorAll ? node.querySelectorAll('[data-i18n]') : [];
                            translatableElements.forEach(element => {
                                this.translateElement(element);
                            });
                        }
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
}

// Initialize translation manager
function initializeTranslation() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.translationManager = new TranslationManager();
        });
    } else {
        window.translationManager = new TranslationManager();
    }
}

// Global functions for compatibility
window.toggleLanguage = function() {
    if (window.translationManager) {
        window.translationManager.toggleLanguage();
    } else {
        console.warn('Translation manager not available');
    }
};

// Initialize
initializeTranslation();