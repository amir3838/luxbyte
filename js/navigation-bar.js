/**
 * LUXBYTE Unified Navigation Bar
 * شريط التنقل الموحد لجميع الصفحات
 */

class NavigationBar {
    constructor() {
        this.currentPage = this.getCurrentPage();
        this.isAuthenticated = false;
        this.userRole = null;
        this.init();
    }

    /**
     * Initialize navigation bar
     * تهيئة شريط التنقل
     */
    async init() {
        await this.checkAuthentication();
        this.createNavigationBar();
        this.setupEventListeners();
        console.log('🧭 Navigation bar initialized');
    }

    /**
     * Get current page name
     * الحصول على اسم الصفحة الحالية
     */
    getCurrentPage() {
        const path = window.location.pathname;
        const page = path.split('/').pop() || 'index.html';
        return page;
    }

    /**
     * Check user authentication status
     * فحص حالة المصادقة
     */
    async checkAuthentication() {
        try {
            const { getSupabase } = await import('./supabase-client.js');
            const supabase = getSupabase();
            const { data: { session } } = await supabase.auth.getSession();

            this.isAuthenticated = !!session;
            this.userRole = session?.user?.user_metadata?.role || null;

            console.log('🔐 Auth status:', this.isAuthenticated, 'Role:', this.userRole);
        } catch (error) {
            console.warn('⚠️ Could not check authentication:', error);
            this.isAuthenticated = false;
        }
    }

    /**
     * Create navigation bar HTML
     * إنشاء HTML شريط التنقل
     */
    createNavigationBar() {
        // Remove existing navbar if any
        const existingNavbar = document.querySelector('.luxbyte-navbar');
        if (existingNavbar) {
            existingNavbar.remove();
        }

        const navbar = document.createElement('div');
        navbar.className = 'luxbyte-navbar';
        navbar.innerHTML = this.getNavbarHTML();

        // Insert at the beginning of body
        document.body.insertBefore(navbar, document.body.firstChild);

        // Styles are now in css/themes.css
    }

    /**
     * Get navigation bar HTML
     * الحصول على HTML شريط التنقل
     */
    getNavbarHTML() {
        const isDashboard = this.currentPage.includes('dashboard') || this.currentPage === 'admin-panel.html';
        const isAuthPage = this.currentPage === 'auth.html' || this.currentPage === 'unified-signup.html';

        return `
            <div class="navbar-container">
                <div class="navbar-content">
                    <!-- Logo Section -->
                    <div class="navbar-brand">
                        <a href="index.html" class="brand-link">
                            <img src="assets/app_icon/LUXBYTEICON.PNG" alt="LUXBYTE" class="brand-logo">
                            <span class="brand-text">LUXBYTE</span>
                        </a>
                    </div>

                    <!-- Navigation Links -->
                    <nav class="navbar-nav">
                        <a href="index.html" class="nav-link ${this.currentPage === 'index.html' ? 'active' : ''}">
                            <i class="fas fa-home"></i>
                            <span>الرئيسية</span>
                        </a>

                        ${!isAuthPage ? `
                            <a href="unified-signup.html" class="nav-link ${this.currentPage === 'unified-signup.html' ? 'active' : ''}">
                                <i class="fas fa-user-plus"></i>
                                <span>انضم إلينا</span>
                            </a>
                        ` : ''}

                        ${this.isAuthenticated && !isDashboard ? `
                            <a href="${this.getDashboardUrl()}" class="nav-link dashboard-link">
                                <i class="fas fa-tachometer-alt"></i>
                                <span>لوحة التحكم</span>
                            </a>
                        ` : ''}

                        ${isDashboard ? `
                            <a href="index.html" class="nav-link">
                                <i class="fas fa-home"></i>
                                <span>العودة للرئيسية</span>
                            </a>
                        ` : ''}
                    </nav>

                    <!-- User Section -->
                    <div class="navbar-user">
                        ${this.isAuthenticated ? `
                            <div class="user-menu">
                                <button class="user-button" onclick="toggleUserMenu()">
                                    <i class="fas fa-user-circle"></i>
                                    <span class="user-name">${this.getUserDisplayName()}</span>
                                    <i class="fas fa-chevron-down"></i>
                                </button>
                                <div class="user-dropdown" id="userDropdown">
                                    <a href="${this.getDashboardUrl()}" class="dropdown-item">
                                        <i class="fas fa-tachometer-alt"></i>
                                        لوحة التحكم
                                    </a>
                                    <a href="profile.html" class="dropdown-item">
                                        <i class="fas fa-user"></i>
                                        الملف الشخصي
                                    </a>
                                    <a href="settings.html" class="dropdown-item">
                                        <i class="fas fa-cog"></i>
                                        الإعدادات
                                    </a>
                                    <div class="dropdown-divider"></div>
                                    <a href="#" class="dropdown-item logout" onclick="logout()">
                                        <i class="fas fa-sign-out-alt"></i>
                                        تسجيل الخروج
                                    </a>
                                </div>
                            </div>
                        ` : `
                            <div class="auth-buttons">
                                <a href="auth.html" class="btn btn-outline">
                                    <i class="fas fa-sign-in-alt"></i>
                                    تسجيل الدخول
                                </a>
                                <a href="unified-signup.html" class="btn btn-primary">
                                    <i class="fas fa-user-plus"></i>
                                    إنشاء حساب
                                </a>
                            </div>
                        `}

                        <!-- Language Toggle -->
                        <button class="lang-toggle" onclick="toggleLanguage()" aria-label="تبديل اللغة">
                            <i class="fas fa-globe"></i>
                        </button>

                        <!-- Theme Toggle -->
                        <button class="theme-toggle" onclick="toggleTheme()" aria-label="تبديل الثيم">
                            <i class="fas fa-adjust"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Get dashboard URL based on user role
     * الحصول على رابط الداشبورد حسب الدور
     */
    getDashboardUrl() {
        const roleMap = {
            'pharmacy': 'dashboard/pharmacy.html',
            'supermarket': 'dashboard/supermarket.html',
            'restaurant': 'dashboard/restaurant.html',
            'clinic': 'dashboard/clinic.html',
            'courier': 'dashboard/courier.html',
            'driver': 'dashboard/driver.html',
            'admin': 'admin-panel.html'
        };

        return roleMap[this.userRole] || 'dashboard.html';
    }

    /**
     * Get user display name
     * الحصول على اسم المستخدم للعرض
     */
    getUserDisplayName() {
        // This would typically come from user data
        return this.userRole ? this.getRoleDisplayName(this.userRole) : 'المستخدم';
    }

    /**
     * Get role display name
     * الحصول على اسم الدور للعرض
     */
    getRoleDisplayName(role) {
        const roleNames = {
            'pharmacy': 'صيدلية',
            'supermarket': 'سوبر ماركت',
            'restaurant': 'مطعم',
            'clinic': 'عيادة',
            'courier': 'مندوب توصيل',
            'driver': 'سائق',
            'admin': 'مدير'
        };

        return roleNames[role] || role;
    }

    /**
     * Add navigation bar styles
     * إضافة أنماط شريط التنقل
     */
    addNavbarStyles() {
        // Styles are now in css/themes.css
        return;
        const style = document.createElement('style');
        style.textContent = `
            .luxbyte-navbar {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                z-index: 1000;
                background: var(--bg-header);
                border-bottom: 1px solid var(--border-color);
                box-shadow: var(--shadow-md);
                backdrop-filter: blur(10px);
                transition: all var(--transition-normal);
            }

            .navbar-container {
                max-width: 1200px;
                margin: 0 auto;
                padding: 0 var(--space-lg);
            }

            .navbar-content {
                display: flex;
                align-items: center;
                justify-content: space-between;
                height: 70px;
                gap: var(--space-lg);
            }

            .navbar-brand {
                display: flex;
                align-items: center;
                flex-shrink: 0;
            }

            .brand-link {
                display: flex;
                align-items: center;
                gap: var(--space-md);
                text-decoration: none;
                color: var(--text-primary);
                font-weight: 700;
                font-size: 1.5rem;
                transition: all var(--transition-normal);
            }

            .brand-link:hover {
                color: var(--primary);
                transform: scale(1.05);
            }

            .brand-logo {
                width: 40px;
                height: 40px;
                border-radius: var(--radius-md);
                object-fit: cover;
            }

            .brand-text {
                background: var(--grad-text);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }

            .navbar-nav {
                display: flex;
                align-items: center;
                gap: var(--space-md);
                flex: 1;
                justify-content: center;
            }

            .nav-link {
                display: flex;
                align-items: center;
                gap: var(--space-sm);
                padding: var(--space-sm) var(--space-md);
                color: var(--text-secondary);
                text-decoration: none;
                border-radius: var(--radius-md);
                font-weight: 500;
                transition: all var(--transition-normal);
                position: relative;
            }

            .nav-link:hover {
                color: var(--primary);
                background: var(--bg-card-hover);
                transform: translateY(-1px);
            }

            .nav-link.active {
                color: var(--primary);
                background: var(--bg-card-hover);
                font-weight: 600;
            }

            .nav-link.active::after {
                content: '';
                position: absolute;
                bottom: -1px;
                left: 50%;
                transform: translateX(-50%);
                width: 20px;
                height: 2px;
                background: var(--primary);
                border-radius: 1px;
            }

            .navbar-user {
                display: flex;
                align-items: center;
                gap: var(--space-md);
                flex-shrink: 0;
            }

            .auth-buttons {
                display: flex;
                gap: var(--space-sm);
                align-items: center;
            }

            .btn {
                display: inline-flex;
                align-items: center;
                gap: var(--space-sm);
                padding: var(--space-sm) var(--space-md);
                border: none;
                border-radius: var(--radius-md);
                font-weight: 500;
                text-decoration: none;
                cursor: pointer;
                transition: all var(--transition-normal);
                font-size: 0.9rem;
            }

            .btn-primary {
                background: var(--primary);
                color: var(--text-inverse);
            }

            .btn-primary:hover {
                background: var(--primary-dark);
                transform: translateY(-1px);
                box-shadow: var(--shadow-md);
            }

            .btn-outline {
                background: transparent;
                color: var(--text-primary);
                border: 1px solid var(--border-color);
            }

            .btn-outline:hover {
                background: var(--bg-card-hover);
                border-color: var(--primary);
            }

            .theme-toggle {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 40px;
                height: 40px;
                background: var(--bg-card);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-md);
                color: var(--text-primary);
                cursor: pointer;
                transition: all var(--transition-normal);
            }

            .theme-toggle:hover {
                background: var(--bg-card-hover);
                border-color: var(--primary);
                color: var(--primary);
                transform: scale(1.1);
            }

            .user-menu {
                position: relative;
            }

            .user-button {
                display: flex;
                align-items: center;
                gap: var(--space-sm);
                padding: var(--space-sm) var(--space-md);
                background: var(--bg-card);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-md);
                color: var(--text-primary);
                cursor: pointer;
                transition: all var(--transition-normal);
            }

            .user-button:hover {
                background: var(--bg-card-hover);
                border-color: var(--primary);
            }

            .user-dropdown {
                position: absolute;
                top: 100%;
                right: 0;
                background: var(--bg-card);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-md);
                box-shadow: var(--shadow-lg);
                min-width: 200px;
                opacity: 0;
                visibility: hidden;
                transform: translateY(-10px);
                transition: all var(--transition-normal);
                z-index: 1001;
            }

            .user-dropdown.show {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }

            .dropdown-item {
                display: flex;
                align-items: center;
                gap: var(--space-sm);
                padding: var(--space-md);
                color: var(--text-primary);
                text-decoration: none;
                transition: all var(--transition-normal);
                border-bottom: 1px solid var(--border-color);
            }

            .dropdown-item:last-child {
                border-bottom: none;
            }

            .dropdown-item:hover {
                background: var(--bg-card-hover);
                color: var(--primary);
            }

            .dropdown-item.logout:hover {
                color: var(--error);
            }

            .dropdown-divider {
                height: 1px;
                background: var(--border-color);
                margin: var(--space-sm) 0;
            }

            /* Mobile Responsive */
            @media (max-width: 768px) {
                .navbar-content {
                    height: 60px;
                    padding: 0 var(--space-md);
                }

                .navbar-nav {
                    display: none;
                }

                .brand-text {
                    display: none;
                }

                .auth-buttons {
                    flex-direction: column;
                    gap: var(--space-xs);
                }

                .btn {
                    padding: var(--space-xs) var(--space-sm);
                    font-size: 0.8rem;
                }

                .user-dropdown {
                    right: -10px;
                    min-width: 180px;
                }
            }

            /* Add top padding to body to account for fixed navbar */
            body {
                padding-top: 70px;
            }

            @media (max-width: 768px) {
                body {
                    padding-top: 60px;
                }
            }
        `;

        document.head.appendChild(style);
    }

    /**
     * Setup event listeners
     * إعداد مستمعي الأحداث
     */
    setupEventListeners() {
        // Close user dropdown when clicking outside
        document.addEventListener('click', (e) => {
            const dropdown = document.getElementById('userDropdown');
            const userButton = document.querySelector('.user-button');

            if (dropdown && userButton && !userButton.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.classList.remove('show');
            }
        });

        // Listen for theme changes
        document.addEventListener('themeChanged', () => {
            this.updateThemeIcon();
        });
    }

    /**
     * Update theme toggle icon
     * تحديث أيقونة تبديل الثيم
     */
    updateThemeIcon() {
        const themeToggle = document.querySelector('.theme-toggle i');
        if (themeToggle) {
            const isDark = document.documentElement.classList.contains('dark');
            themeToggle.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    /**
     * Refresh navigation bar
     * تحديث شريط التنقل
     */
    async refresh() {
        await this.checkAuthentication();
        this.createNavigationBar();
        this.setupEventListeners();
    }
}

// Global functions for navbar interactions
window.toggleUserMenu = function() {
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
};

window.toggleTheme = function() {
    if (window.themeManager) {
        window.themeManager.toggleTheme();
    } else {
        console.warn('Theme manager not available');
    }
};

window.toggleLanguage = function() {
    if (window.translationManager) {
        window.translationManager.toggleLanguage();
    } else {
        console.warn('Translation manager not available');
    }
};

window.logout = async function() {
    try {
        const { getSupabase } = await import('./supabase-client.js');
        const supabase = getSupabase();

        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Logout error:', error);
            return;
        }

        // Redirect to home page
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Logout failed:', error);
    }
};

// Initialize navigation bar when DOM is ready
let navigationBar;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        navigationBar = new NavigationBar();
    });
} else {
    navigationBar = new NavigationBar();
}

// Export for global access
if (typeof window !== 'undefined') {
    window.NavigationBar = NavigationBar;
    window.navigationBar = navigationBar;
}

export default NavigationBar;
