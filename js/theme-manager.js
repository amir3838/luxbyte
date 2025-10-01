/**
 * LUXBYTE Theme Manager
 * مدير الثيمات - يدعم الثيم الفاتح والداكن مع الإيموجي
 */

const KEY = 'theme';
const root = document.documentElement;
let btn;

function applyTheme(theme){
  root.classList.toggle('theme-dark', theme === 'dark');
  localStorage.setItem(KEY, theme);
  btn = btn || document.querySelector('#themeToggle,[data-action="toggle-theme"]');
  if (btn) {
    btn.setAttribute('aria-pressed', theme === 'dark');
    btn.textContent = theme === 'dark' ? '🌙' : '☀️';
  }
}

function initTheme(){
  const stored = localStorage.getItem(KEY);
  const sysDark = matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(stored ?? (sysDark ? 'dark' : 'light'));

  document.addEventListener('click',(e)=>{
    const t = e.target.closest('#themeToggle,[data-action="toggle-theme"]');
    if (!t) return;
    const next = root.classList.contains('theme-dark') ? 'light' : 'dark';
    applyTheme(next);
  });
}

document.addEventListener('DOMContentLoaded', initTheme);

// Legacy class for compatibility
class ThemeManager {
    constructor() {
        this.currentTheme = this.getStoredTheme() || this.getSystemTheme();
        this.init();
    }

    /**
     * Initialize theme manager
     * تهيئة مدير الثيمات
     */
    init() {
        this.applyTheme(this.currentTheme);
        this.setupEventListeners();
        console.log('🎨 Theme manager initialized:', this.currentTheme);
    }

    /**
     * Get stored theme from localStorage
     * الحصول على الثيم المحفوظ
     */
    getStoredTheme() {
        try {
            return localStorage.getItem('theme');
        } catch (error) {
            console.warn('Could not access localStorage:', error);
            return null;
        }
    }

    /**
     * Get system theme preference
     * الحصول على تفضيل ثيم النظام
     */
    getSystemTheme() {
        if (typeof window !== 'undefined' && window.matchMedia) {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return 'light';
    }

    /**
     * Apply theme to document
     * تطبيق الثيم على المستند
     */
    applyTheme(theme) {
        if (!theme) return;

        const root = document.documentElement;
        root.classList.toggle('theme-dark', theme === 'dark');
        root.classList.toggle('theme-light', theme === 'light');

        // Update theme toggle button if exists
        const themeToggle = document.querySelector('#themeToggle, [data-action="toggle-theme"]');
        if (themeToggle) {
            themeToggle.setAttribute('aria-pressed', theme === 'dark');
            themeToggle.textContent = theme === 'dark' ? '🌙' : '☀️';
        }

        this.currentTheme = theme;
        console.log(`🎨 Theme applied: ${theme}`);
    }

    /**
     * Toggle between light and dark theme
     * تبديل بين الثيم الفاتح والداكن
     */
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    /**
     * Set specific theme
     * تعيين ثيم محدد
     */
    setTheme(theme) {
        if (!theme || !['light', 'dark'].includes(theme)) {
            console.warn('Invalid theme:', theme);
            return;
        }

        this.applyTheme(theme);
        this.saveTheme(theme);
    }

    /**
     * Save theme to localStorage
     * حفظ الثيم في localStorage
     */
    saveTheme(theme) {
        try {
            localStorage.setItem('theme', theme);
            console.log(`💾 Theme saved: ${theme}`);
        } catch (error) {
            console.warn('Could not save theme to localStorage:', error);
        }
    }

    /**
     * Setup event listeners
     * إعداد مستمعي الأحداث
     */
    setupEventListeners() {
        // Listen for system theme changes
        if (typeof window !== 'undefined' && window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', (e) => {
                if (!this.getStoredTheme()) {
                    this.setTheme(e.matches ? 'dark' : 'light');
                }
            });
        }

        // Listen for theme toggle clicks
        document.addEventListener('click', (e) => {
            const themeToggle = e.target.closest('#themeToggle, [data-action="toggle-theme"]');
            if (themeToggle) {
                e.preventDefault();
                this.toggleTheme();
            }
        });
    }
}

// Initialize theme manager
function initializeTheme() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.themeManager = new ThemeManager();
        });
    } else {
        window.themeManager = new ThemeManager();
    }
}

// Global functions for compatibility
window.toggleTheme = function() {
    if (window.themeManager) {
        window.themeManager.toggleTheme();
    } else {
        console.warn('Theme manager not available');
    }
};

// Initialize
initializeTheme();