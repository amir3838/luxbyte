// LUXBYTE Application JavaScript - Updated
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initializeApp();
});

// Application state
const AppState = {
    currentScreen: 'splash-screen',
    selectedService: null,
    selectedActivity: null,
    user: null
};

// Location data from the provided JSON
const locations = {
    'القاهرة': ['مدينة نصر', 'المعادي', 'الزمالك', 'وسط البلد', 'مصر الجديدة'],
    'الجيزة': ['المهندسين', 'الدقي', 'الزمالك', 'الهرم', 'فيصل'],
    'الإسكندرية': ['المنتزه', 'الرمل', 'العطارين', 'الجمرك', 'أبو قير'],
    'القليوبية': ['بنها', 'شبرا الخيمة', 'القناطر', 'طوخ', 'قها'],
    'البحيرة': ['دمنهور', 'كفر الدوار', 'رشيد', 'إدكو', 'أبو حمص']
};

// Initialize the application
function initializeApp() {
    showSplashScreen();
    setupEventListeners();
    setupLocationDropdowns();
    setupFormValidation();
    handleImageErrors();
}

// Handle image loading errors with fallbacks
function handleImageErrors() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        // Set up error handling
        img.addEventListener('error', function() {
            handleImageError(this);
        });
        
        // Check if image is already broken
        if (this.naturalWidth === 0 && this.complete) {
            handleImageError(this);
        }
    });
}

function handleImageError(img) {
    // Don't handle if already processed
    if (img.classList.contains('error-handled')) {
        return;
    }
    
    img.classList.add('error-handled');
    
    // Create appropriate fallback based on context
    const container = img.closest('.activity-image-container, .preview-item, .login-background');
    
    if (container) {
        if (container.classList.contains('activity-image-container')) {
            // Activity card background
            container.style.background = 'var(--color-bg-3)';
            container.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: var(--color-text-secondary);">
                    <i class="fas fa-image" style="font-size: 48px;"></i>
                </div>
            `;
        } else if (container.classList.contains('preview-item')) {
            // Service preview image
            img.style.background = 'var(--color-bg-2)';
            img.style.display = 'flex';
            img.style.alignItems = 'center';
            img.style.justifyContent = 'center';
            img.style.color = 'var(--color-text-secondary)';
            img.innerHTML = '<i class="fas fa-image"></i>';
        } else if (container.classList.contains('login-background')) {
            // Login background
            container.style.background = 'var(--color-bg-4)';
            container.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: var(--color-text-secondary);">
                    <i class="fas fa-image" style="font-size: 64px;"></i>
                </div>
                <div class="bg-overlay"></div>
            `;
        }
    }
}

// Splash Screen Management
function showSplashScreen() {
    const splashScreen = document.getElementById('splash-screen');
    
    // Show splash for 3 seconds
    setTimeout(() => {
        splashScreen.classList.add('fade-out');
        
        // After fade out animation, show service selection
        setTimeout(() => {
            hideSplashScreen();
            showScreen('service-selection');
        }, 800);
    }, 3000);
}

function hideSplashScreen() {
    const splashScreen = document.getElementById('splash-screen');
    splashScreen.style.display = 'none';
}

// Screen Management
function showScreen(screenId) {
    // Hide all screens
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show target screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        targetScreen.classList.add('fade-in');
        AppState.currentScreen = screenId;
        
        // Remove fade-in class after animation
        setTimeout(() => {
            targetScreen.classList.remove('fade-in');
        }, 500);
    }
}

// Event Listeners Setup
function setupEventListeners() {
    // Service selection
    setupServiceSelection();
    
    // Activity selection
    setupActivitySelection();
    
    // Back buttons
    setupBackButtons();
    
    // Login/Register forms
    setupAuthForms();
    
    // Navigation links
    setupNavigationLinks();
    
    // Social media links - Enhanced
    setupSocialMediaLinks();
    
    // Dashboard actions
    setupDashboardActions();
}

// Service Selection
function setupServiceSelection() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        const selectBtn = card.querySelector('.service-select-btn');
        const service = card.getAttribute('data-service');
        
        // Card click
        card.addEventListener('click', function(e) {
            if (!e.target.closest('.service-select-btn')) {
                selectService(service);
            }
        });
        
        // Button click
        if (selectBtn) {
            selectBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                selectService(service);
            });
        }
    });
}

function selectService(service) {
    AppState.selectedService = service;
    
    // Add loading state
    const button = event.target.closest('.service-card').querySelector('.service-select-btn');
    button.classList.add('loading');
    
    setTimeout(() => {
        button.classList.remove('loading');
        
        if (service === 'shopeg') {
            showScreen('activity-selection');
        } else if (service === 'masterdriver') {
            // For master driver, go directly to login
            showScreen('login-screen');
        }
    }, 800);
}

// Activity Selection
function setupActivitySelection() {
    const activityCards = document.querySelectorAll('.activity-card');
    
    activityCards.forEach(card => {
        card.addEventListener('click', function() {
            const activity = this.getAttribute('data-activity');
            selectActivity(activity);
        });
    });
}

function selectActivity(activity) {
    AppState.selectedActivity = activity;
    
    // Add selection animation
    const card = event.target.closest('.activity-card');
    card.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        card.style.transform = '';
        showScreen('login-screen');
    }, 200);
}

// Back Button Functionality
function setupBackButtons() {
    const backButtons = document.querySelectorAll('.back-btn');
    
    backButtons.forEach(button => {
        button.addEventListener('click', function() {
            navigateBack();
        });
    });
}

function navigateBack() {
    const currentScreen = AppState.currentScreen;
    
    switch (currentScreen) {
        case 'activity-selection':
            showScreen('service-selection');
            break;
        case 'login-screen':
            if (AppState.selectedService === 'shopeg') {
                showScreen('activity-selection');
            } else {
                showScreen('service-selection');
            }
            break;
        case 'register-screen':
            showScreen('login-screen');
            break;
        case 'dashboard':
            showScreen('service-selection');
            AppState.user = null;
            break;
        default:
            showScreen('service-selection');
            break;
    }
}

// Authentication Forms
function setupAuthForms() {
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Register form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // Register link
    const registerLinks = document.querySelectorAll('.register-link');
    registerLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            showScreen('register-screen');
        });
    });
    
    // Login link
    const loginLinks = document.querySelectorAll('.login-link');
    loginLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            showScreen('login-screen');
        });
    });
}

function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const phone = e.target.querySelector('input[type="tel"]').value;
    const password = e.target.querySelector('input[type="password"]').value;
    
    // Validate form
    if (!validateLogin(phone, password)) {
        return;
    }
    
    // Add loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    // Simulate login API call
    setTimeout(() => {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        
        // Mock successful login
        AppState.user = {
            phone: phone,
            service: AppState.selectedService,
            activity: AppState.selectedActivity
        };
        
        showNotification('تم تسجيل الدخول بنجاح!', 'success');
        showScreen('dashboard');
    }, 1500);
}

function handleRegister(e) {
    e.preventDefault();
    
    const formInputs = e.target.querySelectorAll('input, select, textarea');
    const formData = {};
    
    formInputs.forEach(input => {
        if (input.name || input.id) {
            formData[input.name || input.id] = input.value;
        }
    });
    
    // Validate form
    if (!validateRegister(formData)) {
        return;
    }
    
    // Add loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    // Simulate registration API call
    setTimeout(() => {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        
        showNotification('تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.', 'success');
        showScreen('login-screen');
    }, 2000);
}

// Form Validation
function setupFormValidation() {
    // Real-time validation for phone numbers
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function() {
            validatePhoneNumber(this);
        });
    });
    
    // Password confirmation validation
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    if (passwordInputs.length >= 2) {
        passwordInputs[1].addEventListener('input', function() {
            validatePasswordMatch(passwordInputs[0], this);
        });
    }
}

function validateLogin(phone, password) {
    if (!phone || phone.length < 11) {
        showNotification('يرجى إدخال رقم هاتف صحيح', 'error');
        return false;
    }
    
    if (!password || password.length < 6) {
        showNotification('يرجى إدخال كلمة مرور صحيحة', 'error');
        return false;
    }
    
    return true;
}

function validateRegister(data) {
    // Check required fields
    const requiredFields = ['firstName', 'lastName', 'phone', 'email', 'governorate', 'city', 'address', 'password'];
    
    for (let field of requiredFields) {
        if (!data[field] || data[field].trim() === '') {
            showNotification('يرجى ملء جميع الحقول المطلوبة', 'error');
            return false;
        }
    }
    
    // Validate phone number
    if (!isValidPhoneNumber(data.phone)) {
        showNotification('يرجى إدخال رقم هاتف صحيح', 'error');
        return false;
    }
    
    // Validate email
    if (!isValidEmail(data.email)) {
        showNotification('يرجى إدخال بريد إلكتروني صحيح', 'error');
        return false;
    }
    
    return true;
}

function validatePhoneNumber(input) {
    const phone = input.value;
    const isValid = isValidPhoneNumber(phone);
    
    if (phone && !isValid) {
        input.style.borderColor = 'var(--color-error)';
        input.setAttribute('data-error', 'رقم هاتف غير صحيح');
    } else {
        input.style.borderColor = '';
        input.removeAttribute('data-error');
    }
}

function validatePasswordMatch(password1, password2) {
    if (password2.value && password1.value !== password2.value) {
        password2.style.borderColor = 'var(--color-error)';
        password2.setAttribute('data-error', 'كلمات المرور غير متطابقة');
    } else {
        password2.style.borderColor = '';
        password2.removeAttribute('data-error');
    }
}

function isValidPhoneNumber(phone) {
    // Egyptian phone number validation
    const phoneRegex = /^(010|011|012|015)[0-9]{8}$/;
    return phoneRegex.test(phone);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Location Dropdowns
function setupLocationDropdowns() {
    const governorateSelect = document.getElementById('governorate-select');
    const citySelect = document.getElementById('city-select');
    
    if (governorateSelect && citySelect) {
        governorateSelect.addEventListener('change', function() {
            const selectedGovernorate = this.value;
            updateCityDropdown(citySelect, selectedGovernorate);
        });
    }
}

function updateCityDropdown(citySelect, governorate) {
    // Clear existing options
    citySelect.innerHTML = '<option value="">اختر المدينة</option>';
    
    if (governorate && locations[governorate]) {
        const cities = locations[governorate];
        
        cities.forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            option.textContent = city;
            citySelect.appendChild(option);
        });
        
        citySelect.disabled = false;
    } else {
        citySelect.disabled = true;
    }
}

// Navigation Links
function setupNavigationLinks() {
    // Footer navigation links
    const navLinks = {
        'nav-to-service': 'service-selection',
        'nav-to-login': 'login-screen',
        'nav-to-register': 'register-screen',
        'nav-to-dashboard': 'dashboard'
    };
    
    Object.keys(navLinks).forEach(className => {
        const links = document.querySelectorAll(`.${className}`);
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                showScreen(navLinks[className]);
            });
        });
    });
}

// Enhanced Social Media Links
function setupSocialMediaLinks() {
    const socialLinks = document.querySelectorAll('.social-link, .footer-social-quick a');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Get platform information
            const href = this.getAttribute('href') || '';
            const platform = getSocialMediaPlatform(href);
            
            console.log(`Social media click: ${platform} - ${href}`);
            
            // Handle different social media platforms
            if (href.includes('tel:')) {
                // Phone call handling
                e.preventDefault();
                showNotification('جاري فتح تطبيق الهاتف...', 'info');
                setTimeout(() => {
                    window.open(href, '_self');
                }, 1000);
            } else if (href.includes('wa.me')) {
                // WhatsApp handling
                showNotification('جاري فتح واتساب...', 'info');
                // Let default behavior continue (opens in new tab)
            } else if (href.includes('facebook') || href.includes('instagram') || href.includes('tiktok')) {
                // Social media platforms
                showNotification(`جاري فتح ${platform}...`, 'info');
                // Let default behavior continue (opens in new tab)
            }
            
            // Ensure all external links open in new tab
            if (!href.includes('tel:') && !this.hasAttribute('target')) {
                this.setAttribute('target', '_blank');
            }
        });
    });
}

function getSocialMediaPlatform(href) {
    if (href.includes('facebook')) return 'فيسبوك';
    if (href.includes('instagram')) return 'إنستجرام';
    if (href.includes('tiktok')) return 'تيك توك';
    if (href.includes('whatsapp') || href.includes('wa.me')) return 'واتساب';
    if (href.includes('tel:')) return 'الهاتف';
    return 'منصة اجتماعية';
}

// Dashboard Actions
function setupDashboardActions() {
    const actionCards = document.querySelectorAll('.action-card');
    
    actionCards.forEach(card => {
        card.addEventListener('click', function() {
            const actionText = this.querySelector('h3').textContent;
            showNotification(`تم النقر على: ${actionText}`, 'info');
            
            // Add click animation
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    // Logout functionality
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            AppState.user = null;
            showNotification('تم تسجيل الخروج بنجاح', 'success');
            showScreen('service-selection');
        });
    }
}

// Enhanced Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.remove();
    });
    
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    
    // Create notification content
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Enhanced notification styling
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--color-surface);
        border: 2px solid ${getNotificationColor(type)};
        border-radius: var(--radius-lg);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        padding: var(--space-16) var(--space-20);
        z-index: 10000;
        transform: translateX(400px);
        transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        max-width: 350px;
        min-width: 280px;
        font-family: 'Cairo', var(--font-family-base);
    `;
    
    // Add content styling
    const style = document.createElement('style');
    style.textContent = `
        .notification-content {
            display: flex;
            align-items: center;
            gap: var(--space-12);
            color: var(--color-text);
            font-weight: var(--font-weight-medium);
        }
        .notification-content i {
            color: ${getNotificationColor(type)};
            font-size: var(--font-size-lg);
        }
        .notification-close {
            position: absolute;
            top: var(--space-8);
            left: var(--space-8);
            background: none;
            border: none;
            color: var(--color-text-secondary);
            cursor: pointer;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.2s ease;
            font-size: var(--font-size-sm);
        }
        .notification-close:hover {
            background: var(--color-secondary);
            color: var(--color-text);
            transform: scale(1.1);
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        removeNotification(notification);
    });
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0) scale(1)';
    }, 100);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        removeNotification(notification);
    }, 4000);
}

function getNotificationIcon(type) {
    const icons = {
        'success': 'fa-check-circle',
        'error': 'fa-exclamation-circle',
        'warning': 'fa-exclamation-triangle',
        'info': 'fa-info-circle'
    };
    return icons[type] || icons.info;
}

function getNotificationColor(type) {
    const colors = {
        'success': 'var(--color-success)',
        'error': 'var(--color-error)',
        'warning': 'var(--color-warning)',
        'info': 'var(--luxbyte-primary)'
    };
    return colors[type] || colors.info;
}

function removeNotification(notification) {
    if (notification && notification.parentNode) {
        notification.style.transform = 'translateX(400px) scale(0.8)';
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function formatPhoneNumber(phone) {
    // Format Egyptian phone numbers
    if (phone.length === 11 && phone.startsWith('0')) {
        return phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1 $2 $3');
    }
    return phone;
}

// Enhanced Image Loading with Error Handling
document.addEventListener('DOMContentLoaded', function() {
    // Handle all images on page load
    handleImageErrors();
    
    // Observer for dynamically added images
    const imageObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeName === 'IMG') {
                        setupImageErrorHandling(node);
                    } else if (node.querySelectorAll) {
                        const images = node.querySelectorAll('img');
                        images.forEach(setupImageErrorHandling);
                    }
                });
            }
        });
    });
    
    imageObserver.observe(document.body, {
        childList: true,
        subtree: true
    });
});

function setupImageErrorHandling(img) {
    img.addEventListener('error', function() {
        handleImageError(this);
    });
    
    img.addEventListener('load', function() {
        this.classList.add('loaded');
        this.style.opacity = '1';
    });
    
    // Set initial opacity for smooth loading
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.3s ease';
    
    // Check if already broken
    if (img.naturalWidth === 0 && img.complete) {
        handleImageError(img);
    }
}

// Keyboard Navigation Support
document.addEventListener('keydown', function(e) {
    // ESC key to go back
    if (e.key === 'Escape') {
        if (AppState.currentScreen !== 'service-selection' && AppState.currentScreen !== 'splash-screen') {
            navigateBack();
        }
    }
    
    // Enter key on service/activity cards
    if (e.key === 'Enter') {
        const focusedElement = document.activeElement;
        if (focusedElement.classList.contains('service-card')) {
            focusedElement.click();
        } else if (focusedElement.classList.contains('activity-card')) {
            focusedElement.click();
        }
    }
});

// Add tabindex to interactive elements for accessibility
document.addEventListener('DOMContentLoaded', function() {
    const interactiveElements = document.querySelectorAll('.service-card, .activity-card, .action-card');
    interactiveElements.forEach((element, index) => {
        element.setAttribute('tabindex', index + 1);
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid var(--luxbyte-primary)';
            this.style.outlineOffset = '2px';
        });
        element.addEventListener('blur', function() {
            this.style.outline = '';
            this.style.outlineOffset = '';
        });
    });
});

// Performance Monitoring (Development only)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.addEventListener('load', () => {
        if ('performance' in window) {
            const navigation = performance.getEntriesByType('navigation')[0];
            console.log(`Page load time: ${navigation.loadEventEnd - navigation.loadEventStart}ms`);
            console.log(`DOM content loaded: ${navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart}ms`);
        }
    });
}

// Service Worker Registration (for future PWA features)
if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AppState,
        showScreen,
        selectService,
        selectActivity,
        validateLogin,
        validateRegister,
        isValidPhoneNumber,
        isValidEmail,
        showNotification,
        getSocialMediaPlatform
    };
}