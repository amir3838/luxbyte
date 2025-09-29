/**
 * Translation Utilities with Fallback Support
 * أدوات الترجمة مع دعم السقوط
 */

/**
 * Translation function with fallback support
 * دالة الترجمة مع دعم السقوط
 * @param {string} key - Translation key
 * @param {string} fallback - Fallback text if translation fails
 * @returns {string} - Translated text or fallback
 */
function tr(key, fallback) {
  // Check if i18n system is available
  if (typeof window !== 'undefined' && window.i18nDict) {
    const currentLang = getCurrentLanguage();
    const translation = window.i18nDict[currentLang]?.[key];

    // Return translation if valid, otherwise fallback
    if (translation && translation !== key) {
      return translation;
    }
  }

  // Return fallback if no valid translation found
  return fallback;
}

/**
 * Get current language from document or localStorage
 * الحصول على اللغة الحالية من المستند أو التخزين المحلي
 * @returns {string} - Current language code
 */
function getCurrentLanguage() {
  // Check document language
  if (typeof document !== 'undefined') {
    const htmlLang = document.documentElement.lang;
    if (htmlLang) {
      return htmlLang.startsWith('ar') ? 'ar' : 'en';
    }
  }

  // Check localStorage
  if (typeof localStorage !== 'undefined') {
    const storedLang = localStorage.getItem('language');
    if (storedLang) {
      return storedLang.startsWith('ar') ? 'ar' : 'en';
    }
  }

  // Default to Arabic
  return 'ar';
}

/**
 * Enhanced translation function with RTL support
 * دالة ترجمة محسنة مع دعم RTL
 * @param {string} key - Translation key
 * @param {string} fallback - Fallback text
 * @param {Object} options - Additional options
 * @returns {Object} - Translation object with text, dir, and aria-label
 */
function trWithOptions(key, fallback, options = {}) {
  const text = tr(key, fallback);
  const isRTL = getCurrentLanguage() === 'ar';

  return {
    text: text,
    dir: isRTL ? 'rtl' : 'ltr',
    'aria-label': options.ariaLabel || text,
    lang: getCurrentLanguage()
  };
}

/**
 * Apply translation to element with fallback
 * تطبيق الترجمة على العنصر مع السقوط
 * @param {HTMLElement} element - Target element
 * @param {string} key - Translation key
 * @param {string} fallback - Fallback text
 * @param {Object} options - Additional options
 */
function applyTranslation(element, key, fallback, options = {}) {
  const translation = trWithOptions(key, fallback, options);

  // Set text content
  element.textContent = translation.text;

  // Set direction
  if (translation.dir) {
    element.setAttribute('dir', translation.dir);
  }

  // Set language
  if (translation.lang) {
    element.setAttribute('lang', translation.lang);
  }

  // Set aria-label
  if (translation['aria-label']) {
    element.setAttribute('aria-label', translation['aria-label']);
  }

  // Set data attribute for i18n
  element.setAttribute('data-i18n', key);
}

/**
 * Initialize translation system
 * تهيئة نظام الترجمة
 */
function initTranslation() {
  // Make functions globally available
  window.tr = tr;
  window.trWithOptions = trWithOptions;
  window.applyTranslation = applyTranslation;
  window.getCurrentLanguage = getCurrentLanguage;

  console.log('Translation system initialized with fallback support');
}

// Auto-initialize when DOM is loaded
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', initTranslation);
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    tr,
    trWithOptions,
    applyTranslation,
    getCurrentLanguage,
    initTranslation
  };
}
