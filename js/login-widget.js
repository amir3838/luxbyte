// Login Widget JavaScript
class LoginWidget {
    constructor() {
        this.init();
    }

    init() {
        this.setupFormSubmission();
        this.setupForgotPassword();
        this.setupRememberMe();
    }

    setupFormSubmission() {
        const form = document.getElementById('login-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }
    }

    setupForgotPassword() {
        const forgotPasswordLink = document.getElementById('forgot-password-link');
        if (forgotPasswordLink) {
            forgotPasswordLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleForgotPassword();
            });
        }
    }

    setupRememberMe() {
        const rememberMeCheckbox = document.getElementById('remember-me');
        if (rememberMeCheckbox) {
            rememberMeCheckbox.addEventListener('change', (e) => {
                this.handleRememberMe(e.target.checked);
            });
        }
    }

    async handleLogin() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('remember-me').checked;

        // Validate inputs
        if (!this.validateInputs(email, password)) {
            return;
        }

        // Show loading
        this.showLoading(true);

        try {
            // Simulate API call
            const result = await this.authenticateUser(email, password);

            if (result.success) {
                // Store user data
                this.storeUserData(result.user, rememberMe);

                // Show success message
                this.showMessage('تم تسجيل الدخول بنجاح!', 'success');

                // Redirect to dashboard
                setTimeout(() => {
                    this.redirectToDashboard(result.user);
                }, 1500);
            } else {
                this.showMessage(result.message || 'خطأ في تسجيل الدخول', 'error');
            }
        } catch (error) {
            this.showMessage('حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    validateInputs(email, password) {
        // Clear previous errors
        this.hideMessages();

        if (!email || !email.trim()) {
            this.showMessage('يرجى إدخال البريد الإلكتروني', 'error');
            return false;
        }

        if (!this.isValidEmail(email)) {
            this.showMessage('يرجى إدخال بريد إلكتروني صحيح', 'error');
            return false;
        }

        if (!password || !password.trim()) {
            this.showMessage('يرجى إدخال كلمة المرور', 'error');
            return false;
        }

        if (password.length < 6) {
            this.showMessage('كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'error');
            return false;
        }

        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    async authenticateUser(email, password) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Mock authentication - replace with real API call
        const mockUsers = [
            {
                id: 1,
                email: 'admin@luxbyte.com',
                password: '123456',
                firstName: 'أحمد',
                lastName: 'محمد',
                activityType: 'restaurant',
                verified: true
            },
            {
                id: 2,
                email: 'pharmacy@luxbyte.com',
                password: '123456',
                firstName: 'فاطمة',
                lastName: 'علي',
                activityType: 'pharmacy',
                verified: true
            },
            {
                id: 3,
                email: 'courier@luxbyte.com',
                password: '123456',
                firstName: 'محمد',
                lastName: 'حسن',
                activityType: 'courier',
                verified: true
            }
        ];

        const user = mockUsers.find(u => u.email === email && u.password === password);

        if (user) {
            return {
                success: true,
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    activityType: user.activityType,
                    verified: user.verified
                }
            };
        } else {
            return {
                success: false,
                message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
            };
        }
    }

    storeUserData(user, rememberMe) {
        const userData = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            activityType: user.activityType,
            verified: user.verified,
            loginTime: new Date().toISOString()
        };

        if (rememberMe) {
            localStorage.setItem('luxbyte_user', JSON.stringify(userData));
        } else {
            sessionStorage.setItem('luxbyte_user', JSON.stringify(userData));
        }
    }

    redirectToDashboard(user) {
        const dashboardRoutes = {
            restaurant: 'dashboard/restaurant.html',
            supermarket: 'dashboard/supermarket.html',
            pharmacy: 'dashboard/pharmacy.html',
            clinic: 'dashboard/clinic.html',
            courier: 'dashboard/courier.html',
            driver: 'dashboard/driver.html'
        };

        const dashboardPath = dashboardRoutes[user.activityType] || 'dashboard/restaurant.html';
        window.location.href = dashboardPath;
    }

    handleForgotPassword() {
        const email = document.getElementById('email').value;

        if (!email || !this.isValidEmail(email)) {
            this.showMessage('يرجى إدخال بريد إلكتروني صحيح أولاً', 'error');
            return;
        }

        // Show loading
        this.showLoading(true);

        // Simulate sending reset email
        setTimeout(() => {
            this.showLoading(false);
            this.showMessage(`تم إرسال رابط إعادة تعيين كلمة المرور إلى ${email}`, 'success');
        }, 2000);
    }

    handleRememberMe(checked) {
        if (checked) {
            // Store email for next time
            const email = document.getElementById('email').value;
            if (email) {
                localStorage.setItem('luxbyte_remembered_email', email);
            }
        } else {
            // Remove stored email
            localStorage.removeItem('luxbyte_remembered_email');
        }
    }

    showLoading(show) {
        const submitBtn = document.querySelector('#login-form button[type="submit"]');
        if (show) {
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري تسجيل الدخول...';
            submitBtn.disabled = true;
        } else {
            submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> تسجيل الدخول';
            submitBtn.disabled = false;
        }
    }

    showMessage(message, type) {
        this.hideMessages();

        const messageElement = document.getElementById(`${type}-message`);
        if (messageElement) {
            messageElement.textContent = message;
            messageElement.style.display = 'block';

            // Auto hide after 5 seconds
            setTimeout(() => {
                messageElement.style.display = 'none';
            }, 5000);
        }
    }

    hideMessages() {
        const errorMessage = document.getElementById('error-message');
        const successMessage = document.getElementById('success-message');

        if (errorMessage) errorMessage.style.display = 'none';
        if (successMessage) successMessage.style.display = 'none';
    }

    // Load remembered email on page load
    loadRememberedEmail() {
        const rememberedEmail = localStorage.getItem('luxbyte_remembered_email');
        if (rememberedEmail) {
            const emailInput = document.getElementById('email');
            const rememberMeCheckbox = document.getElementById('remember-me');

            if (emailInput) emailInput.value = rememberedEmail;
            if (rememberMeCheckbox) rememberMeCheckbox.checked = true;
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const loginWidget = new LoginWidget();
    loginWidget.loadRememberedEmail();
});
