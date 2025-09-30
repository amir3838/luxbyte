/**
 * LUXBYTE Theme Manager
 * مدير الثيمات - النظام الليلي والنهاري
 */

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
        this.createThemeToggle();
        this.setupThemeListeners();
        this.loadSocialIcons();
        console.log(`🎨 Theme Manager initialized: ${this.currentTheme} mode`);
    }

    /**
     * Get stored theme from localStorage
     * الحصول على الثيم المحفوظ
     */
    getStoredTheme() {
        try {
            return localStorage.getItem('luxbyte-theme');
        } catch (error) {
            console.warn('Could not access localStorage:', error);
            return null;
        }
    }

    /**
     * Get system theme preference
     * الحصول على تفضيل النظام
     */
    getSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    /**
     * Apply theme to document
     * تطبيق الثيم على المستند
     */
    applyTheme(theme) {
        const root = document.documentElement;
        root.className = root.className.replace(/light|dark/g, '');
        root.classList.add(theme);
        
        this.currentTheme = theme;
        this.saveTheme(theme);
        this.updateMetaTheme(theme);
        this.updateSocialIcons(theme);
        
        // Trigger custom event
        document.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme }
        }));
    }

    /**
     * Save theme to localStorage
     * حفظ الثيم في التخزين المحلي
     */
    saveTheme(theme) {
        try {
            localStorage.setItem('luxbyte-theme', theme);
        } catch (error) {
            console.warn('Could not save theme to localStorage:', error);
        }
    }

    /**
     * Update meta theme-color
     * تحديث لون الثيم في الميتا
     */
    updateMetaTheme(theme) {
        let metaTheme = document.querySelector('meta[name="theme-color"]');
        if (!metaTheme) {
            metaTheme = document.createElement('meta');
            metaTheme.name = 'theme-color';
            document.head.appendChild(metaTheme);
        }
        
        metaTheme.content = theme === 'dark' ? '#1e293b' : '#ffffff';
    }

    /**
     * Toggle between light and dark themes
     * التبديل بين الثيم الليلي والنهاري
     */
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
        
        // Show notification
        this.showThemeNotification(newTheme);
        
        console.log(`🔄 Theme toggled to: ${newTheme}`);
    }

    /**
     * Create theme toggle button
     * إنشاء زر تبديل الثيم
     */
    createThemeToggle() {
        // Remove existing toggle if any
        const existingToggle = document.querySelector('.theme-toggle');
        if (existingToggle) {
            existingToggle.remove();
        }

        const toggle = document.createElement('button');
        toggle.className = 'theme-toggle';
        toggle.setAttribute('aria-label', 'Toggle theme');
        toggle.innerHTML = this.getThemeIcon();
        
        toggle.addEventListener('click', () => this.toggleTheme());
        
        document.body.appendChild(toggle);
    }

    /**
     * Get appropriate icon for current theme
     * الحصول على الأيقونة المناسبة للثيم الحالي
     */
    getThemeIcon() {
        return this.currentTheme === 'light' 
            ? '<i class="fas fa-moon"></i>' 
            : '<i class="fas fa-sun"></i>';
    }

    /**
     * Update theme toggle icon
     * تحديث أيقونة زر الثيم
     */
    updateThemeIcon() {
        const toggle = document.querySelector('.theme-toggle');
        if (toggle) {
            toggle.innerHTML = this.getThemeIcon();
        }
    }

    /**
     * Setup theme change listeners
     * إعداد مستمعي تغيير الثيم
     */
    setupThemeListeners() {
        // Listen for system theme changes
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', (e) => {
                if (!this.getStoredTheme()) {
                    this.applyTheme(e.matches ? 'dark' : 'light');
                }
            });
        }

        // Listen for custom theme changes
        document.addEventListener('themeChanged', (e) => {
            this.updateThemeIcon();
            this.updateSocialIcons(e.detail.theme);
        });
    }

    /**
     * Show theme change notification
     * عرض إشعار تغيير الثيم
     */
    showThemeNotification(theme) {
        const message = theme === 'dark' 
            ? 'تم التبديل إلى الوضع الليلي 🌙' 
            : 'تم التبديل إلى الوضع النهاري ☀️';
        
        if (typeof LUXBYTE !== 'undefined' && LUXBYTE.notifyOk) {
            LUXBYTE.notifyOk(message);
        } else {
            console.log(`🎨 ${message}`);
        }
    }

    /**
     * Load social media icons
     * تحميل أيقونات التواصل الاجتماعي
     */
    loadSocialIcons() {
        const socialContainer = document.querySelector('.social-icons');
        if (!socialContainer) return;

        const socialLinks = [
            {
                name: 'Facebook',
                url: 'https://facebook.com/luxbyte',
                icon: 'fab fa-facebook-f',
                class: 'facebook'
            },
            {
                name: 'Twitter',
                url: 'https://twitter.com/luxbyte',
                icon: 'fab fa-twitter',
                class: 'twitter'
            },
            {
                name: 'Instagram',
                url: 'https://instagram.com/luxbyte',
                icon: 'fab fa-instagram',
                class: 'instagram'
            },
            {
                name: 'LinkedIn',
                url: 'https://linkedin.com/company/luxbyte',
                icon: 'fab fa-linkedin-in',
                class: 'linkedin'
            },
            {
                name: 'YouTube',
                url: 'https://youtube.com/luxbyte',
                icon: 'fab fa-youtube',
                class: 'youtube'
            },
            {
                name: 'WhatsApp',
                url: 'https://wa.me/1234567890',
                icon: 'fab fa-whatsapp',
                class: 'whatsapp'
            },
            {
                name: 'Telegram',
                url: 'https://t.me/luxbyte',
                icon: 'fab fa-telegram-plane',
                class: 'telegram'
            },
            {
                name: 'TikTok',
                url: 'https://tiktok.com/@luxbyte',
                icon: 'fab fa-tiktok',
                class: 'tiktok'
            }
        ];

        socialContainer.innerHTML = socialLinks.map(link => `
            <a href="${link.url}" 
               class="social-icon ${link.class}" 
               target="_blank" 
               rel="noopener noreferrer"
               aria-label="${link.name}">
                <i class="${link.icon}"></i>
            </a>
        `).join('');
    }

    /**
     * Update social icons based on theme
     * تحديث أيقونات التواصل حسب الثيم
     */
    updateSocialIcons(theme) {
        const socialIcons = document.querySelectorAll('.social-icon');
        socialIcons.forEach(icon => {
            // Add theme-specific classes if needed
            icon.classList.toggle('dark-theme', theme === 'dark');
        });
    }

    /**
     * Get current theme
     * الحصول على الثيم الحالي
     */
    getCurrentTheme() {
        return this.currentTheme;
    }

    /**
     * Set specific theme
     * تعيين ثيم محدد
     */
    setTheme(theme) {
        if (theme === 'light' || theme === 'dark') {
            this.applyTheme(theme);
        } else {
            console.warn('Invalid theme:', theme);
        }
    }

    /**
     * Reset to system theme
     * إعادة تعيين لثيم النظام
     */
    resetToSystemTheme() {
        const systemTheme = this.getSystemTheme();
        this.applyTheme(systemTheme);
        console.log(`🔄 Reset to system theme: ${systemTheme}`);
    }

    /**
     * Apply theme to specific element
     * تطبيق الثيم على عنصر محدد
     */
    applyThemeToElement(element, theme = null) {
        const targetTheme = theme || this.currentTheme;
        element.classList.remove('light', 'dark');
        element.classList.add(targetTheme);
    }

    /**
     * Get theme-aware color
     * الحصول على لون حسب الثيم
     */
    getThemeColor(colorName) {
        const root = document.documentElement;
        return getComputedStyle(root).getPropertyValue(`--${colorName}`).trim();
    }

    /**
     * Create theme-aware gradient
     * إنشاء تدرج حسب الثيم
     */
    createGradient(colors) {
        const theme = this.currentTheme;
        return `linear-gradient(135deg, ${colors[theme] || colors.light})`;
    }
}

// Initialize theme manager when DOM is ready
let themeManager;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        themeManager = new ThemeManager();
    });
} else {
    themeManager = new ThemeManager();
}

// Export for global access
if (typeof window !== 'undefined') {
    window.ThemeManager = ThemeManager;
    window.themeManager = themeManager;
}

// Auto-initialize theme manager
document.addEventListener('DOMContentLoaded', () => {
    if (!themeManager) {
        themeManager = new ThemeManager();
    }
});

export default ThemeManager;
