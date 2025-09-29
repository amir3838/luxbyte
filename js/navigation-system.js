/**
 * نظام التنقل والروابط السريعة
 * Navigation System and Quick Links
 */

class NavigationSystem {
    constructor() {
        this.currentUser = null;
        this.userType = null;
        this.isAuthenticated = false;

        this.dashboardRoutes = {
            restaurant: 'dashboard/restaurant.html',
            supermarket: 'dashboard/supermarket.html',
            pharmacy: 'dashboard/pharmacy.html',
            clinic: 'dashboard/clinic.html',
            courier: 'dashboard/courier.html',
            driver: 'dashboard/driver.html'
        };

        this.init();
    }

    /**
     * تهيئة النظام
     */
    init() {
        this.checkAuthenticationStatus();
        this.setupQuickLinks();
        this.setupEventListeners();
    }

    /**
     * التحقق من حالة المصادقة
     */
    checkAuthenticationStatus() {
        // التحقق من وجود بيانات المستخدم في localStorage
        const userData = localStorage.getItem('luxbyte_user');
        if (userData) {
            try {
                this.currentUser = JSON.parse(userData);
                this.userType = this.currentUser.activity_type;
                this.isAuthenticated = true;
                this.updateNavigationUI();
            } catch (error) {
                console.error('خطأ في قراءة بيانات المستخدم:', error);
                this.logout();
            }
        }
    }

    /**
     * إعداد الروابط السريعة
     */
    setupQuickLinks() {
        const quickLinksContainer = document.getElementById('quick-links');
        if (!quickLinksContainer) return;

        quickLinksContainer.innerHTML = `
            <div class="quick-links-menu">
                <h3>روابط سريعة</h3>
                <ul class="quick-links-list">
                    <li>
                        <a href="#" id="choose-service-link" class="quick-link">
                            <i class="icon-service"></i>
                            اختر الخدمة
                        </a>
                    </li>
                    <li>
                        <a href="#" id="login-link" class="quick-link">
                            <i class="icon-login"></i>
                            تسجيل الدخول
                        </a>
                    </li>
                    <li>
                        <a href="#" id="register-link" class="quick-link">
                            <i class="icon-register"></i>
                            إنشاء حساب
                        </a>
                    </li>
                    <li>
                        <a href="#" id="dashboard-link" class="quick-link dashboard-link" style="display: none;">
                            <i class="icon-dashboard"></i>
                            لوحة التحكم
                        </a>
                    </li>
                </ul>
            </div>
        `;
    }

    /**
     * إعداد مستمعي الأحداث
     */
    setupEventListeners() {
        // رابط اختيار الخدمة
        const chooseServiceLink = document.getElementById('choose-service-link');
        if (chooseServiceLink) {
            chooseServiceLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showServiceSelection();
            });
        }

        // رابط تسجيل الدخول
        const loginLink = document.getElementById('login-link');
        if (loginLink) {
            loginLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showLoginForm();
            });
        }

        // رابط إنشاء حساب
        const registerLink = document.getElementById('register-link');
        if (registerLink) {
            registerLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showRegistrationForm();
            });
        }

        // رابط لوحة التحكم
        const dashboardLink = document.getElementById('dashboard-link');
        if (dashboardLink) {
            dashboardLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.redirectToDashboard();
            });
        }
    }

    /**
     * تحديث واجهة التنقل حسب حالة المستخدم
     */
    updateNavigationUI() {
        const loginLink = document.getElementById('login-link');
        const registerLink = document.getElementById('register-link');
        const dashboardLink = document.getElementById('dashboard-link');

        if (this.isAuthenticated) {
            // إخفاء روابط تسجيل الدخول وإنشاء الحساب
            if (loginLink) loginLink.style.display = 'none';
            if (registerLink) registerLink.style.display = 'none';

            // إظهار رابط لوحة التحكم
            if (dashboardLink) {
                dashboardLink.style.display = 'block';
                dashboardLink.innerHTML = `
                    <i class="icon-dashboard"></i>
                    لوحة التحكم (${this.getActivityTypeName()})
                `;
            }
        } else {
            // إظهار روابط تسجيل الدخول وإنشاء الحساب
            if (loginLink) loginLink.style.display = 'block';
            if (registerLink) registerLink.style.display = 'block';

            // إخفاء رابط لوحة التحكم
            if (dashboardLink) dashboardLink.style.display = 'none';
        }
    }

    /**
     * الحصول على اسم نوع النشاط
     */
    getActivityTypeName() {
        const activityNames = {
            restaurant: 'مطعم',
            supermarket: 'سوبر ماركت',
            pharmacy: 'صيدلية',
            clinic: 'عيادة',
            courier: 'مندوب توصيل',
            driver: 'سائق رئيسي'
        };
        return activityNames[this.userType] || 'غير محدد';
    }

    /**
     * عرض نافذة اختيار الخدمة
     */
    showServiceSelection() {
        const modal = this.createModal('اختر نوع الخدمة', this.createServiceSelectionContent());
        document.body.appendChild(modal);
    }

    /**
     * إنشاء محتوى اختيار الخدمة
     */
    createServiceSelectionContent() {
        const services = [
            { id: 'restaurant', name: 'مطعم', icon: '🍽️', description: 'خدمات المطاعم والمقاهي' },
            { id: 'supermarket', name: 'سوبر ماركت', icon: '🛒', description: 'خدمات السوبر ماركت والمتاجر' },
            { id: 'pharmacy', name: 'صيدلية', icon: '💊', description: 'خدمات الصيدليات' },
            { id: 'clinic', name: 'عيادة', icon: '🏥', description: 'خدمات العيادات الطبية' },
            { id: 'courier', name: 'مندوب توصيل', icon: '🚚', description: 'خدمات التوصيل' },
            { id: 'driver', name: 'سائق رئيسي', icon: '🚗', description: 'خدمات السائقين الرئيسيين' }
        ];

        let content = '<div class="service-selection">';
        services.forEach(service => {
            content += `
                <div class="service-card" data-service="${service.id}">
                    <div class="service-icon">${service.icon}</div>
                    <h4>${service.name}</h4>
                    <p>${service.description}</p>
                    <button class="btn btn-primary select-service" data-service="${service.id}">
                        اختر هذه الخدمة
                    </button>
                </div>
            `;
        });
        content += '</div>';

        return content;
    }

    /**
     * عرض نموذج تسجيل الدخول
     */
    showLoginForm() {
        const modal = this.createModal('تسجيل الدخول', this.createLoginFormContent());
        document.body.appendChild(modal);
    }

    /**
     * إنشاء محتوى نموذج تسجيل الدخول
     */
    createLoginFormContent() {
        return `
            <form id="login-form" class="auth-form">
                <div class="form-group">
                    <label for="login-email">البريد الإلكتروني</label>
                    <input type="email" id="login-email" name="email" required>
                </div>
                <div class="form-group">
                    <label for="login-password">كلمة المرور</label>
                    <input type="password" id="login-password" name="password" required>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">تسجيل الدخول</button>
                    <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">إلغاء</button>
                </div>
            </form>
        `;
    }

    /**
     * عرض نموذج إنشاء الحساب
     */
    showRegistrationForm() {
        const modal = this.createModal('إنشاء حساب جديد', this.createRegistrationFormContent());
        document.body.appendChild(modal);
    }

    /**
     * إنشاء محتوى نموذج إنشاء الحساب
     */
    createRegistrationFormContent() {
        return `
            <form id="registration-form" class="auth-form">
                <div class="form-group">
                    <label for="reg-name">الاسم الكامل</label>
                    <input type="text" id="reg-name" name="name" required>
                </div>
                <div class="form-group">
                    <label for="reg-email">البريد الإلكتروني</label>
                    <input type="email" id="reg-email" name="email" required>
                </div>
                <div class="form-group">
                    <label for="reg-phone">رقم الهاتف</label>
                    <input type="tel" id="reg-phone" name="phone" required>
                </div>
                <div class="form-group">
                    <label for="reg-activity">نوع النشاط</label>
                    <select id="reg-activity" name="activity_type" required>
                        <option value="">اختر نوع النشاط</option>
                        <option value="restaurant">مطعم</option>
                        <option value="supermarket">سوبر ماركت</option>
                        <option value="pharmacy">صيدلية</option>
                        <option value="clinic">عيادة</option>
                        <option value="courier">مندوب توصيل</option>
                        <option value="driver">سائق رئيسي</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="reg-password">كلمة المرور</label>
                    <input type="password" id="reg-password" name="password" required>
                </div>
                <div class="form-group">
                    <label for="reg-confirm-password">تأكيد كلمة المرور</label>
                    <input type="password" id="reg-confirm-password" name="confirm_password" required>
                </div>
                <div class="form-group terms-checkbox">
                    <label class="terms-label">
                        <input type="checkbox" id="terms-acceptance" name="terms_accepted" required>
                        <span class="checkmark"></span>
                        أوافق على <a href="terms-conditions.html" target="_blank" class="terms-link">الشروط والأحكام</a>
                    </label>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">إنشاء الحساب</button>
                    <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">إلغاء</button>
                </div>
            </form>
        `;
    }

    /**
     * إنشاء نافذة منبثقة
     */
    createModal(title, content) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${title}</h2>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
            </div>
        `;

        // إضافة مستمعي الأحداث
        setTimeout(() => {
            this.setupModalEventListeners(modal);
        }, 100);

        return modal;
    }

    /**
     * إعداد مستمعي الأحداث للنافذة المنبثقة
     */
    setupModalEventListeners(modal) {
        // اختيار الخدمة
        const serviceCards = modal.querySelectorAll('.select-service');
        serviceCards.forEach(card => {
            card.addEventListener('click', (e) => {
                const serviceId = e.target.dataset.service;
                this.handleServiceSelection(serviceId);
                modal.remove();
            });
        });

        // تسجيل الدخول
        const loginForm = modal.querySelector('#login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin(loginForm);
            });
        }

        // إنشاء الحساب
        const registrationForm = modal.querySelector('#registration-form');
        if (registrationForm) {
            registrationForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegistration(registrationForm);
            });
        }
    }

    /**
     * معالجة اختيار الخدمة
     */
    handleServiceSelection(serviceId) {
        // التحقق من موافقة المستخدم على الشروط
        const termsAccepted = localStorage.getItem('terms_accepted');
        if (!termsAccepted) {
            this.showNotification('يجب الموافقة على الشروط والأحكام أولاً', 'error');
            // توجيه المستخدم إلى صفحة الشروط والأحكام
            setTimeout(() => {
                window.location.href = 'terms-conditions.html?from=service&service=' + serviceId;
            }, 1500);
            return;
        }

        // حفظ نوع الخدمة المختارة
        localStorage.setItem('selected_service', serviceId);

        // توجيه المستخدم إلى لوحة التحكم المناسبة
        this.redirectToSpecificDashboard(serviceId);
    }

    /**
     * معالجة تسجيل الدخول
     */
    async handleLogin(form) {
        const formData = new FormData(form);
        const loginData = {
            email: formData.get('email'),
            password: formData.get('password')
        };

        try {
            // محاكاة تسجيل الدخول (يجب استبدالها بـ Supabase Auth)
            const response = await this.authenticateUser(loginData);

            if (response.success) {
                // التحقق من موافقة المستخدم على الشروط
                const termsAccepted = localStorage.getItem('terms_accepted');
                if (!termsAccepted) {
                    this.showNotification('يجب الموافقة على الشروط والأحكام أولاً', 'error');
                    // توجيه المستخدم إلى صفحة الشروط والأحكام
                    setTimeout(() => {
                        window.location.href = 'terms-conditions.html?from=login';
                    }, 1500);
                    return;
                }

                this.currentUser = response.user;
                this.userType = response.user.activity_type;
                this.isAuthenticated = true;

                // حفظ بيانات المستخدم
                localStorage.setItem('luxbyte_user', JSON.stringify(response.user));

                // تحديث الواجهة
                this.updateNavigationUI();

                // إغلاق النافذة المنبثقة
                form.closest('.modal').remove();

                this.showNotification('تم تسجيل الدخول بنجاح', 'success');

                // توجيه إلى لوحة التحكم المناسبة
                setTimeout(() => {
                    this.redirectToSpecificDashboard(response.user.activity_type);
                }, 2500);
            } else {
                this.showNotification(response.message || 'خطأ في تسجيل الدخول', 'error');
            }
        } catch (error) {
            console.error('خطأ في تسجيل الدخول:', error);
            this.showNotification('حدث خطأ أثناء تسجيل الدخول', 'error');
        }
    }

    /**
     * معالجة إنشاء الحساب
     */
    async handleRegistration(form) {
        const formData = new FormData(form);
        const registrationData = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            activity_type: formData.get('activity_type'),
            password: formData.get('password'),
            confirm_password: formData.get('confirm_password'),
            terms_accepted: formData.get('terms_accepted')
        };

        // التحقق من تطابق كلمة المرور
        if (registrationData.password !== registrationData.confirm_password) {
            this.showNotification('كلمة المرور غير متطابقة', 'error');
            return;
        }

        // التحقق من الموافقة على الشروط
        if (!registrationData.terms_accepted) {
            this.showNotification('يجب الموافقة على الشروط والأحكام أولاً', 'error');
            return;
        }

        try {
            // محاكاة إنشاء الحساب (يجب استبدالها بـ Supabase Auth)
            const response = await this.registerUser(registrationData);

            if (response.success) {
                // حفظ موافقة المستخدم على الشروط
                localStorage.setItem('terms_accepted', 'true');
                localStorage.setItem('terms_accepted_date', new Date().toISOString());

                this.showNotification('تم إنشاء الحساب بنجاح', 'success');
                form.closest('.modal').remove();

                // توجيه مباشر إلى لوحة التحكم المناسبة
                setTimeout(() => {
                    this.redirectToSpecificDashboard(registrationData.activity_type);
                }, 3000);
            } else {
                this.showNotification(response.message || 'خطأ في إنشاء الحساب', 'error');
            }
        } catch (error) {
            console.error('خطأ في إنشاء الحساب:', error);
            this.showNotification('حدث خطأ أثناء إنشاء الحساب', 'error');
        }
    }

    /**
     * توجيه إلى لوحة التحكم المناسبة
     */
    redirectToDashboard(activityType = null) {
        const targetActivityType = activityType || this.userType;

        if (!targetActivityType) {
            this.showNotification('يجب تحديد نوع النشاط أولاً', 'error');
            return;
        }

        // التحقق من موافقة المستخدم على الشروط
        const termsAccepted = localStorage.getItem('terms_accepted');
        if (!termsAccepted) {
            this.showNotification('يجب الموافقة على الشروط والأحكام أولاً', 'error');
            // توجيه المستخدم إلى صفحة الشروط والأحكام
            setTimeout(() => {
                window.location.href = 'terms-conditions.html?from=dashboard&activity=' + targetActivityType;
            }, 1500);
            return;
        }

        const dashboardUrl = this.dashboardRoutes[targetActivityType];
        if (dashboardUrl) {
            window.location.href = dashboardUrl;
        } else {
            this.showNotification('نوع النشاط غير مدعوم', 'error');
        }
    }

    /**
     * توجيه مباشر إلى لوحة تحكم معينة (مختصر)
     */
    redirectToSpecificDashboard(activityType) {
        this.redirectToDashboard(activityType);
    }

    /**
     * تسجيل الخروج
     */
    logout() {
        this.currentUser = null;
        this.userType = null;
        this.isAuthenticated = false;

        localStorage.removeItem('luxbyte_user');
        // لا نحذف موافقة المستخدم على الشروط عند تسجيل الخروج
        this.updateNavigationUI();

        this.showNotification('تم تسجيل الخروج بنجاح', 'success');
    }

    /**
     * مصادقة المستخدم (محاكاة)
     */
    async authenticateUser(loginData) {
        // محاكاة API call
        return new Promise((resolve) => {
            setTimeout(() => {
                // محاكاة بيانات المستخدم
                const mockUser = {
                    id: 'user_123',
                    name: 'مستخدم تجريبي',
                    email: loginData.email,
                    activity_type: 'pharmacy', // نوع افتراضي
                    created_at: new Date().toISOString()
                };

                resolve({
                    success: true,
                    user: mockUser
                });
            }, 1000);
        });
    }

    /**
     * تسجيل المستخدم (محاكاة)
     */
    async registerUser(registrationData) {
        // محاكاة API call
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    message: 'تم إنشاء الحساب بنجاح',
                    user: {
                        id: 'user_' + Date.now(),
                        name: registrationData.name,
                        email: registrationData.email,
                        activity_type: registrationData.activity_type,
                        created_at: new Date().toISOString()
                    }
                });
            }, 1000);
        });
    }

    /**
     * عرض إشعار
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// تهيئة نظام التنقل عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    window.navigationSystem = new NavigationSystem();
});

// تصدير الكلاس للاستخدام في الملفات الأخرى
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NavigationSystem;
} else {
    window.NavigationSystem = NavigationSystem;
}
