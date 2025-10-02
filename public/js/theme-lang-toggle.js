/**
 * LUXBYTE Theme & Language Toggle
 * تبديل الثيم واللغة لـ LUXBYTE
 *
 * إدارة الثيمات (فاتح/داكن) واللغات (عربي/إنجليزي)
 */

class ThemeLangManager {
  constructor() {
    this.theme = 'light';
    this.language = 'ar';
    this.direction = 'rtl';
    this.init();
  }

  init() {
    this.loadSettings();
    this.setupEventListeners();
    this.applyTheme();
    this.applyLanguage();
    this.createToggleButtons();
    console.log('🎨 تم تحميل مدير الثيم واللغة');
  }

  loadSettings() {
    // تحميل الثيم من localStorage
    const savedTheme = localStorage.getItem('luxbyte-theme');
    if (savedTheme && ['light', 'dark'].includes(savedTheme)) {
      this.theme = savedTheme;
    } else {
      // تحديد الثيم حسب تفضيل النظام
      this.theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    // تحميل اللغة من localStorage
    const savedLanguage = localStorage.getItem('luxbyte-language');
    if (savedLanguage && ['ar', 'en'].includes(savedLanguage)) {
      this.language = savedLanguage;
      this.direction = savedLanguage === 'ar' ? 'rtl' : 'ltr';
    } else {
      // تحديد اللغة من HTML
      const htmlLang = document.documentElement.lang || 'ar';
      this.language = htmlLang.startsWith('ar') ? 'ar' : 'en';
      this.direction = this.language === 'ar' ? 'rtl' : 'ltr';
    }
  }

  setupEventListeners() {
    // مراقبة تغيير تفضيل النظام
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('luxbyte-theme')) {
        this.theme = e.matches ? 'dark' : 'light';
        this.applyTheme();
      }
    });

    // مراقبة تغيير اللغة في المتصفح
    document.addEventListener('languagechange', () => {
      this.updateLanguageFromBrowser();
    });
  }

  createToggleButtons() {
    // إنشاء أزرار التبديل
    this.createThemeToggle();
    this.createLanguageToggle();
  }

  createThemeToggle() {
    // البحث عن زر الثيم الموجود أو إنشاء واحد جديد
    let themeButton = document.getElementById('theme-toggle');

    if (!themeButton) {
      themeButton = document.createElement('button');
      themeButton.id = 'theme-toggle';
      themeButton.className = 'theme-toggle-btn';
      themeButton.setAttribute('aria-label', 'تبديل الثيم');
      themeButton.title = 'تبديل الثيم';
    }

    this.updateThemeButton(themeButton);

    themeButton.addEventListener('click', () => {
      this.toggleTheme();
    });

    // إضافة الزر إلى الصفحة إذا لم يكن موجوداً
    if (!themeButton.parentNode) {
      const header = document.querySelector('header, .site-header, .navbar');
      if (header) {
        header.appendChild(themeButton);
      } else {
        document.body.appendChild(themeButton);
      }
    }
  }

  createLanguageToggle() {
    // البحث عن زر اللغة الموجود أو إنشاء واحد جديد
    let langButton = document.getElementById('language-toggle');

    if (!langButton) {
      langButton = document.createElement('button');
      langButton.id = 'language-toggle';
      langButton.className = 'language-toggle-btn';
      langButton.setAttribute('aria-label', 'تبديل اللغة');
      langButton.title = 'تبديل اللغة';
    }

    this.updateLanguageButton(langButton);

    langButton.addEventListener('click', () => {
      this.toggleLanguage();
    });

    // إضافة الزر إلى الصفحة إذا لم يكن موجوداً
    if (!langButton.parentNode) {
      const header = document.querySelector('header, .site-header, .navbar');
      if (header) {
        header.appendChild(langButton);
      } else {
        document.body.appendChild(langButton);
      }
    }
  }

  updateThemeButton(button) {
    const icon = this.theme === 'dark' ? '🌞' : '🌙';
    button.innerHTML = `<span class="theme-icon">${icon}</span>`;
    button.setAttribute('data-theme', this.theme);
  }

  updateLanguageButton(button) {
    const text = this.language === 'ar' ? 'EN' : 'عربي';
    button.innerHTML = `<span class="language-text">${text}</span>`;
    button.setAttribute('data-language', this.language);
  }

  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('luxbyte-theme', this.theme);
    this.applyTheme();
    this.updateThemeButton(document.getElementById('theme-toggle'));

    // إطلاق حدث مخصص
    this.dispatchThemeChangeEvent();
  }

  toggleLanguage() {
    this.language = this.language === 'ar' ? 'en' : 'ar';
    this.direction = this.language === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('luxbyte-language', this.language);
    this.applyLanguage();
    this.updateLanguageButton(document.getElementById('language-toggle'));

    // إطلاق حدث مخصص
    this.dispatchLanguageChangeEvent();
  }

  applyTheme() {
    const html = document.documentElement;
    html.setAttribute('data-theme', this.theme);

    // إضافة class للثيم
    html.classList.remove('light-theme', 'dark-theme');
    html.classList.add(`${this.theme}-theme`);

    // تحديث meta theme-color
    this.updateThemeColor();

    console.log(`🎨 تم تطبيق الثيم: ${this.theme}`);
  }

  applyLanguage() {
    const html = document.documentElement;
    html.setAttribute('lang', this.language);
    html.setAttribute('dir', this.direction);

    // إضافة class للاتجاه
    html.classList.remove('rtl', 'ltr');
    html.classList.add(this.direction);

    console.log(`🌍 تم تطبيق اللغة: ${this.language} (${this.direction})`);
  }

  updateThemeColor() {
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');

    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.name = 'theme-color';
      document.head.appendChild(metaThemeColor);
    }

    const colors = {
      light: '#ffffff',
      dark: '#1a1a1a'
    };

    metaThemeColor.content = colors[this.theme] || colors.light;
  }

  updateLanguageFromBrowser() {
    const browserLang = navigator.language || navigator.languages[0];
    const isArabic = browserLang.startsWith('ar');

    if (isArabic && this.language !== 'ar') {
      this.language = 'ar';
      this.direction = 'rtl';
      this.applyLanguage();
      this.updateLanguageButton(document.getElementById('language-toggle'));
    } else if (!isArabic && this.language !== 'en') {
      this.language = 'en';
      this.direction = 'ltr';
      this.applyLanguage();
      this.updateLanguageButton(document.getElementById('language-toggle'));
    }
  }

  dispatchThemeChangeEvent() {
    const event = new CustomEvent('themechange', {
      detail: {
        theme: this.theme,
        previousTheme: this.theme === 'light' ? 'dark' : 'light'
      }
    });
    document.dispatchEvent(event);
  }

  dispatchLanguageChangeEvent() {
    const event = new CustomEvent('languagechange', {
      detail: {
        language: this.language,
        direction: this.direction,
        previousLanguage: this.language === 'ar' ? 'en' : 'ar'
      }
    });
    document.dispatchEvent(event);
  }

  // الحصول على الثيم الحالي
  getCurrentTheme() {
    return this.theme;
  }

  // الحصول على اللغة الحالية
  getCurrentLanguage() {
    return this.language;
  }

  // الحصول على الاتجاه الحالي
  getCurrentDirection() {
    return this.direction;
  }

  // تعيين ثيم محدد
  setTheme(theme) {
    if (['light', 'dark'].includes(theme)) {
      this.theme = theme;
      localStorage.setItem('luxbyte-theme', this.theme);
      this.applyTheme();
      this.updateThemeButton(document.getElementById('theme-toggle'));
      this.dispatchThemeChangeEvent();
    }
  }

  // تعيين لغة محددة
  setLanguage(language) {
    if (['ar', 'en'].includes(language)) {
      this.language = language;
      this.direction = language === 'ar' ? 'rtl' : 'ltr';
      localStorage.setItem('luxbyte-language', this.language);
      this.applyLanguage();
      this.updateLanguageButton(document.getElementById('language-toggle'));
      this.dispatchLanguageChangeEvent();
    }
  }
}

// إنشاء مثيل مدير الثيم واللغة
const themeLangManager = new ThemeLangManager();

// جعل المدير متاحاً عالمياً
window.themeLangManager = themeLangManager;

// إضافة الأنماط للأزرار
const style = document.createElement('style');
style.textContent = `
  .theme-toggle-btn,
  .language-toggle-btn {
    background: rgba(255, 255, 255, 0.9);
    border: 2px solid #e74c3c;
    border-radius: 50px;
    padding: 8px 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: 'Cairo', sans-serif;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 40px;
    height: 40px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .theme-toggle-btn:hover,
  .language-toggle-btn:hover {
    background: #e74c3c;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
  }

  .theme-toggle-btn:active,
  .language-toggle-btn:active {
    transform: translateY(0);
  }

  .theme-icon {
    font-size: 1.2rem;
    line-height: 1;
  }

  .language-text {
    font-size: 0.9rem;
    font-weight: 700;
  }

  [data-theme="dark"] .theme-toggle-btn,
  [data-theme="dark"] .language-toggle-btn {
    background: rgba(30, 30, 30, 0.9);
    color: white;
    border-color: #3498db;
  }

  [data-theme="dark"] .theme-toggle-btn:hover,
  [data-theme="dark"] .language-toggle-btn:hover {
    background: #3498db;
  }

  /* تخطيط الأزرار في الهيدر */
  header .theme-toggle-btn,
  header .language-toggle-btn {
    margin: 0 5px;
  }

  /* استجابة للشاشات الصغيرة */
  @media (max-width: 768px) {
    .theme-toggle-btn,
    .language-toggle-btn {
      min-width: 35px;
      height: 35px;
      padding: 6px 10px;
    }

    .theme-icon {
      font-size: 1rem;
    }

    .language-text {
      font-size: 0.8rem;
    }
  }
`;

document.head.appendChild(style);

// تصدير للاستخدام في الوحدات
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ThemeLangManager;
}

console.log('🎨 تم تحميل مدير الثيم واللغة');
