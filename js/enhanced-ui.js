// Enhanced UI/UX System for LUXBYTE
class EnhancedUI {
    constructor() {
        this.init();
    }

    init() {
        this.setupThemeToggle();
        this.setupLanguageToggle();
        this.setupNotifications();
        this.setupLoadingStates();
        this.setupAnimations();
        this.setupAccessibility();
        console.log('🎨 Enhanced UI System initialized');
    }

    // Theme Toggle System
    setupThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        if (!themeToggle) return;

        // Load saved theme
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.body.classList.add(savedTheme + '-theme');
        this.updateThemeIcon(savedTheme);

        themeToggle.addEventListener('click', () => {
            const currentTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';

            document.body.classList.remove(currentTheme + '-theme');
            document.body.classList.add(newTheme + '-theme');

            localStorage.setItem('theme', newTheme);
            this.updateThemeIcon(newTheme);

            // Dispatch theme change event
            window.dispatchEvent(new CustomEvent('themeChanged', {
                detail: { theme: newTheme }
            }));
        });
    }

    updateThemeIcon(theme) {
        const themeIcon = document.getElementById('theme-icon');
        if (themeIcon) {
            themeIcon.innerHTML = theme === 'light' ?
                '<i class="fas fa-moon"></i>' :
                '<i class="fas fa-sun"></i>';
        }
    }

    // Language Toggle System
    setupLanguageToggle() {
        const langToggle = document.getElementById('language-toggle');
        if (!langToggle) return;

        // Load saved language
        const savedLang = localStorage.getItem('language') || 'ar';
        this.setLanguage(savedLang);

        langToggle.addEventListener('click', () => {
            const currentLang = localStorage.getItem('language') || 'ar';
            const newLang = currentLang === 'ar' ? 'en' : 'ar';
            this.setLanguage(newLang);
        });
    }

    setLanguage(lang) {
        localStorage.setItem('language', lang);
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

        // Update language toggle text
        const langToggle = document.getElementById('language-toggle');
        if (langToggle) {
            langToggle.textContent = lang === 'ar' ? 'EN' : 'AR';
        }

        // Apply translations
        if (window.applyI18n) {
            window.applyI18n();
        }
    }

    // Enhanced Notifications System
    setupNotifications() {
        // Create notification container if it doesn't exist
        if (!document.getElementById('notification-container')) {
            const container = document.createElement('div');
            container.id = 'notification-container';
            container.className = 'notification-container';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: 10px;
            `;
            document.body.appendChild(container);
        }
    }

    showNotification(message, type = 'info', duration = 5000) {
        const container = document.getElementById('notification-container');
        if (!container) return;

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 16px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            gap: 12px;
            max-width: 400px;
            animation: slideInRight 0.3s ease;
            position: relative;
            overflow: hidden;
        `;

        const icon = this.getNotificationIcon(type);
        notification.innerHTML = `
            <div style="font-size: 20px;">${icon}</div>
            <div style="flex: 1;">${message}</div>
            <button onclick="this.parentElement.remove()" style="
                background: none;
                border: none;
                color: white;
                font-size: 18px;
                cursor: pointer;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
            ">×</button>
        `;

        container.appendChild(notification);

        // Auto remove after duration
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, duration);
    }

    getNotificationColor(type) {
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        return colors[type] || colors.info;
    }

    getNotificationIcon(type) {
        const icons = {
            success: '<i class="fas fa-check-circle"></i>',
            error: '<i class="fas fa-exclamation-circle"></i>',
            warning: '<i class="fas fa-exclamation-triangle"></i>',
            info: '<i class="fas fa-info-circle"></i>'
        };
        return icons[type] || icons.info;
    }

    // Loading States System
    setupLoadingStates() {
        // Add loading styles
        const style = document.createElement('style');
        style.textContent = `
            .loading-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                backdrop-filter: blur(4px);
            }

            .loading-spinner {
                width: 50px;
                height: 50px;
                border: 4px solid rgba(255,255,255,0.3);
                border-top: 4px solid #6b7cff;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }

            .loading-text {
                color: white;
                margin-top: 20px;
                font-size: 16px;
                text-align: center;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }

            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    showLoading(message = 'جاري التحميل...') {
        const overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        overlay.id = 'loading-overlay';
        overlay.innerHTML = `
            <div style="text-align: center;">
                <div class="loading-spinner"></div>
                <div class="loading-text">${message}</div>
            </div>
        `;
        document.body.appendChild(overlay);
    }

    hideLoading() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.remove();
        }
    }

    // Enhanced Animations
    setupAnimations() {
        // Intersection Observer for scroll animations
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                    }
                });
            }, { threshold: 0.1 });

            // Observe elements with animation classes
            document.querySelectorAll('.fade-in, .slide-up, .scale-in').forEach(el => {
                observer.observe(el);
            });
        }

        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            .fade-in {
                opacity: 0;
                transform: translateY(20px);
                transition: all 0.6s ease;
            }

            .fade-in.animate-in {
                opacity: 1;
                transform: translateY(0);
            }

            .slide-up {
                opacity: 0;
                transform: translateY(30px);
                transition: all 0.8s ease;
            }

            .slide-up.animate-in {
                opacity: 1;
                transform: translateY(0);
            }

            .scale-in {
                opacity: 0;
                transform: scale(0.9);
                transition: all 0.5s ease;
            }

            .scale-in.animate-in {
                opacity: 1;
                transform: scale(1);
            }
        `;
        document.head.appendChild(style);
    }

    // Accessibility Enhancements
    setupAccessibility() {
        // Add skip to main content link
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'انتقل إلى المحتوى الرئيسي';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: #6b7cff;
            color: white;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 1000;
            transition: top 0.3s;
        `;
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        document.body.insertBefore(skipLink, document.body.firstChild);

        // Add ARIA labels to interactive elements
        document.querySelectorAll('button, input, select, textarea').forEach(el => {
            if (!el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby')) {
                const label = el.previousElementSibling?.textContent ||
                            el.placeholder ||
                            el.value ||
                            'عنصر تفاعلي';
                el.setAttribute('aria-label', label);
            }
        });

        // Add keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // Close any open modals or overlays
                const modals = document.querySelectorAll('.modal, .overlay');
                modals.forEach(modal => modal.remove());
            }
        });
    }

    // Form Validation Enhancement
    enhanceFormValidation(form) {
        const inputs = form.querySelectorAll('input, textarea, select');

        inputs.forEach(input => {
            // Real-time validation
            input.addEventListener('blur', () => {
                this.validateField(input);
            });

            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    this.validateField(input);
                }
            });
        });

        // Form submission validation
        form.addEventListener('submit', (e) => {
            let isValid = true;
            inputs.forEach(input => {
                if (!this.validateField(input)) {
                    isValid = false;
                }
            });

            if (!isValid) {
                e.preventDefault();
                this.showNotification('يرجى تصحيح الأخطاء في النموذج', 'error');
            }
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const isRequired = field.hasAttribute('required');
        const type = field.type;
        let isValid = true;
        let errorMessage = '';

        // Required field validation
        if (isRequired && !value) {
            isValid = false;
            errorMessage = 'هذا الحقل مطلوب';
        }

        // Email validation
        if (type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'يرجى إدخال بريد إلكتروني صحيح';
            }
        }

        // Phone validation
        if (type === 'tel' && value) {
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                errorMessage = 'يرجى إدخال رقم هاتف صحيح';
            }
        }

        // Password validation
        if (type === 'password' && value) {
            if (value.length < 6) {
                isValid = false;
                errorMessage = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
            }
        }

        // Update field appearance
        if (isValid) {
            field.classList.remove('error');
            field.classList.add('valid');
            this.removeFieldError(field);
        } else {
            field.classList.remove('valid');
            field.classList.add('error');
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    showFieldError(field, message) {
        this.removeFieldError(field);

        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.style.cssText = `
            color: #ef4444;
            font-size: 14px;
            margin-top: 4px;
            display: flex;
            align-items: center;
            gap: 4px;
        `;
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;

        field.parentNode.appendChild(errorDiv);
    }

    removeFieldError(field) {
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    // Camera Integration Enhancement
    async requestCameraPermission() {
        try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error('Camera not supported');
            }

            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'environment',
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            });

            stream.getTracks().forEach(track => track.stop());
            return true;
        } catch (error) {
            console.error('Camera permission denied:', error);
            this.showNotification('يرجى السماح بالوصول للكاميرا لتصوير المستندات', 'warning');
            return false;
        }
    }

    // Location Integration Enhancement
    async requestLocationPermission() {
        try {
            if (!navigator.geolocation) {
                throw new Error('Geolocation not supported');
            }

            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 300000
                });
            });

            return {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy
            };
        } catch (error) {
            console.error('Location permission denied:', error);
            this.showNotification('يرجى السماح بالوصول للموقع الجغرافي', 'warning');
            return null;
        }
    }
}

// Initialize Enhanced UI
window.enhancedUI = new EnhancedUI();

// Global notification functions
window.LUXBYTE = window.LUXBYTE || {};
window.LUXBYTE.notifyOk = (message) => window.enhancedUI.showNotification(message, 'success');
window.LUXBYTE.notifyErr = (message) => window.enhancedUI.showNotification(message, 'error');
window.LUXBYTE.notifyWarn = (message) => window.enhancedUI.showNotification(message, 'warning');
window.LUXBYTE.notifyInfo = (message) => window.enhancedUI.showNotification(message, 'info');
window.LUXBYTE.showLoading = (message) => window.enhancedUI.showLoading(message);
window.LUXBYTE.hideLoading = () => window.enhancedUI.hideLoading();
