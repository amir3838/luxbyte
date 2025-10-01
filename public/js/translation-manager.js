/**
 * LUXBYTE Translation Manager
 * مدير الترجمة - يدعم العربية والإنجليزية مع الإيموجي
 */

const LANG_KEY = 'lang';
const dict = window.i18nDict || {};
let btn;

// Fallback translations if i18nDict is not loaded
const fallbackDict = {
  ar: {
    "home.cta_start_journey": "ابدأ رحلتك الآن",
    "home.choose_platform": "اختر منصتك",
    "home.choose_ag.title": "اختر نشاطك",
    "home.choose_ag.subtitle": "اختر النشاط المناسب لك",
    "home.choose_ag.items": "مطعم، سوبر ماركت، صيدلية، عيادة، مندوب توصيل",
    "home.ecology_ag.title": "بيئة عمل متكاملة",
    "home.ecology_ag.subtitle": "منصة شاملة لجميع احتياجاتك",
    "home.ecology_ag.items": "إدارة، تقارير، دعم فني، أمان",
    "brand.luxbyte_llc": "شركة لوكس بايت المحدودة المسئولية",
    "home.features_block.security_title": "أمان وموثوقية",
    "home.features_block.security_desc": "نستخدم أحدث تقنيات الأمان لحماية بياناتك ومعاملاتك المالية",
    "home.features_block.ease_title": "سهولة الاستخدام",
    "home.features_block.ease_desc": "واجهة بسيطة وسهلة الاستخدام تعمل على جميع الأجهزة",
    "home.features_block.support_title": "دعم فني متميز",
    "home.features_block.support_desc": "فريق دعم فني متخصص متاح على مدار الساعة لمساعدتك",
    "home.features_block.reports_title": "تقارير مفصلة",
    "home.features_block.reports_desc": "احصل على تقارير مفصلة عن أداء عملك واتخاذ قرارات مدروسة",
    "home.cta_block.title": "جاهز للبدء؟",
    "home.cta_block.desc": "انضم إلى آلاف العملاء الذين يثقون في لوكس بايت لتطوير أعمالهم",
    "home.cta_block.start_now": "ابدأ الآن",
    "home.cta_block.contact_us": "تواصل معنا",
    "home.shop_eg.title": "شوب إي جي",
    "home.shop_eg.subtitle": "منصة التجارة الإلكترونية",
    "home.shop_eg.desc": "منصة متكاملة للتجارة الإلكترونية تتيح للمنشآت التجارية إنشاء متاجرها الإلكترونية وإدارة طلباتها بسهولة",
    "home.master_driver.title": "ماستر درايفر",
    "home.master_driver.subtitle": "منصة خدمات التوصيل",
    "home.master_driver.desc": "منصة متخصصة في خدمات التوصيل والنقل، تربط بين العملاء ومندوبي التوصيل لتقديم خدمة توصيل سريعة وموثوقة"
  }
};

function applyLanguage(lang){
  document.documentElement.lang = lang;
  document.documentElement.dir  = (lang === 'ar') ? 'rtl' : 'ltr';
  localStorage.setItem(LANG_KEY, lang);

  // بدّل نصوص العناصر اللي عليها data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const k = el.getAttribute('data-i18n');
    const v = dict?.[lang]?.[k] || fallbackDict?.[lang]?.[k];
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

  // Wait for i18nDict to load if not already available
  if (!window.i18nDict) {
    setTimeout(() => {
      if (window.i18nDict) {
        Object.assign(dict, window.i18nDict);
      }
      applyLanguage(lang);
    }, 100);
  } else {
    Object.assign(dict, window.i18nDict);
    applyLanguage(lang);
  }

  document.addEventListener('click',(e)=>{
    const t = e.target.closest('#langToggle,[data-action="toggle-lang"]');
    if (!t) return;
    const next = (document.documentElement.lang === 'ar') ? 'en' : 'ar';
    applyLanguage(next);
  });
}

document.addEventListener('DOMContentLoaded', initLang);

// Force immediate translation
setTimeout(() => {
  if (typeof applyLanguage === 'function') {
    applyLanguage('ar');
  }
}, 100);

// Force translation again after DOM is fully loaded
setTimeout(() => {
  if (typeof applyLanguage === 'function') {
    applyLanguage('ar');
  }
}, 1000);

// Force translation on window load
window.addEventListener('load', () => {
  if (typeof applyLanguage === 'function') {
    applyLanguage('ar');
  }
});

// Force translation when DOM changes
const observer = new MutationObserver(() => {
  if (typeof applyLanguage === 'function') {
    applyLanguage('ar');
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

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