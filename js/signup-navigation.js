/**
 * LUXBYTE Signup Navigation Manager
 * مدير التنقل في صفحة التسجيل
 */

class SignupNavigation {
    constructor() {
        this.currentTab = 0;
        this.tabs = ['personal', 'business', 'location', 'security', 'documents', 'review'];
        this.init();
    }

    /**
     * Initialize navigation
     * تهيئة التنقل
     */
    init() {
        this.setupEventListeners();
        this.showTab(0); // Show first tab by default
        console.log('🧭 Signup Navigation initialized');
    }

    /**
     * Setup event listeners
     * إعداد مستمعي الأحداث
     */
    setupEventListeners() {
        // Tab click handlers
        document.querySelectorAll('.tab').forEach((tab, index) => {
            tab.addEventListener('click', () => {
                this.currentTab = index;
                this.showTab(index);
            });
        });

        // Navigation buttons
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const submitBtn = document.getElementById('submitBtn');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.changeTab('prev'));
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.changeTab('next'));
        }

        if (submitBtn) {
            submitBtn.addEventListener('click', (e) => this.handleSubmit(e));
        }

        // Form validation on tab change
        document.querySelectorAll('.section-content').forEach(section => {
            const inputs = section.querySelectorAll('input[required], select[required], textarea[required]');
            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateCurrentTab());
            });
        });
    }

    /**
     * Change tab
     * تغيير التبويب
     */
    changeTab(direction) {
        if (direction === 'next' && this.currentTab < this.tabs.length - 1) {
            // Validate current tab before moving to next
            if (this.validateCurrentTab()) {
                this.currentTab++;
                this.showTab(this.currentTab);
            }
        } else if (direction === 'prev' && this.currentTab > 0) {
            this.currentTab--;
            this.showTab(this.currentTab);
        }
    }

    /**
     * Show specific tab
     * عرض تبويب محدد
     */
    showTab(tabIndex) {
        // Hide all sections
        document.querySelectorAll('.section-content').forEach(section => {
            section.classList.remove('active');
        });

        // Show current section
        const currentSection = document.getElementById(this.tabs[tabIndex] + '-section');
        if (currentSection) {
            currentSection.classList.add('active');
        }

        // Update tab indicators
        document.querySelectorAll('.tab').forEach((tab, index) => {
            tab.classList.toggle('active', index === tabIndex);
        });

        // Update navigation buttons
        this.updateNavigationButtons();

        // Scroll to top of form
        const form = document.getElementById('signupForm');
        if (form) {
            form.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    /**
     * Update navigation buttons visibility and state
     * تحديث حالة أزرار التنقل
     */
    updateNavigationButtons() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const submitBtn = document.getElementById('submitBtn');

        if (prevBtn) {
            prevBtn.style.display = this.currentTab > 0 ? 'inline-flex' : 'none';
        }

        if (nextBtn) {
            nextBtn.style.display = this.currentTab < this.tabs.length - 1 ? 'inline-flex' : 'none';
        }

        if (submitBtn) {
            submitBtn.style.display = this.currentTab === this.tabs.length - 1 ? 'inline-flex' : 'none';
        }
    }

    /**
     * Validate current tab
     * التحقق من صحة التبويب الحالي
     */
    validateCurrentTab() {
        const currentSection = document.getElementById(this.tabs[this.currentTab] + '-section');
        if (!currentSection) return true;

        const requiredInputs = currentSection.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;
        const errors = [];

        requiredInputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                errors.push(this.getFieldLabel(input));
                this.highlightError(input);
            } else {
                this.clearError(input);
            }
        });

        // Email validation
        const emailInput = currentSection.querySelector('input[type="email"]');
        if (emailInput && emailInput.value) {
            if (!this.isValidEmail(emailInput.value)) {
                isValid = false;
                errors.push('البريد الإلكتروني غير صحيح');
                this.highlightError(emailInput);
            }
        }

        // Password confirmation
        const passwordInput = currentSection.querySelector('input[name="password"]');
        const confirmPasswordInput = currentSection.querySelector('input[name="confirm_password"]');
        if (passwordInput && confirmPasswordInput && passwordInput.value && confirmPasswordInput.value) {
            if (passwordInput.value !== confirmPasswordInput.value) {
                isValid = false;
                errors.push('كلمات المرور غير متطابقة');
                this.highlightError(confirmPasswordInput);
            }
        }

        if (!isValid) {
            this.showValidationError(errors);
        }

        return isValid;
    }

    /**
     * Get field label for error message
     * الحصول على تسمية الحقل لرسالة الخطأ
     */
    getFieldLabel(input) {
        const label = input.closest('.form-group')?.querySelector('label');
        return label ? label.textContent.replace('*', '').trim() : 'هذا الحقل';
    }

    /**
     * Highlight input error
     * تمييز خطأ الإدخال
     */
    highlightError(input) {
        input.style.borderColor = '#ef4444';
        input.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
    }

    /**
     * Clear input error
     * مسح خطأ الإدخال
     */
    clearError(input) {
        input.style.borderColor = '';
        input.style.boxShadow = '';
    }

    /**
     * Show validation error message
     * عرض رسالة خطأ التحقق
     */
    showValidationError(errors) {
        const message = `يرجى ملء الحقول التالية: ${errors.join(', ')}`;
        
        if (typeof LUXBYTE !== 'undefined' && LUXBYTE.notifyErr) {
            LUXBYTE.notifyErr(message);
        } else {
            alert(message);
        }
    }

    /**
     * Validate email format
     * التحقق من صيغة البريد الإلكتروني
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Handle form submission
     * معالجة إرسال النموذج
     */
    async handleSubmit(event) {
        event.preventDefault();
        
        // Validate all tabs before submission
        let allValid = true;
        for (let i = 0; i < this.tabs.length; i++) {
            this.currentTab = i;
            if (!this.validateCurrentTab()) {
                allValid = false;
                this.showTab(i);
                break;
            }
        }

        if (!allValid) {
            return;
        }

        // Show loading state
        const submitBtn = document.getElementById('submitBtn');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';
        }

        try {
            // Collect form data
            const formData = this.collectFormData();
            
            // Submit form
            await this.submitForm(formData);
            
            // Show success message
            this.showSuccessMessage();
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showErrorMessage(error.message);
        } finally {
            // Reset button state
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> إرسال الطلب ⟶';
            }
        }
    }

    /**
     * Collect form data
     * جمع بيانات النموذج
     */
    collectFormData() {
        const form = document.getElementById('signupForm');
        const formData = new FormData(form);
        const data = {};

        for (const [key, value] of formData.entries()) {
            data[key] = value;
        }

        // Add uploaded files
        data.uploadedFiles = this.getUploadedFiles();

        return data;
    }

    /**
     * Get uploaded files
     * الحصول على الملفات المرفوعة
     */
    getUploadedFiles() {
        const files = {};
        document.querySelectorAll('.file-preview').forEach(preview => {
            const container = preview.closest('[id^="file-upload-"]');
            if (container) {
                const docType = container.id.replace('file-upload-', '');
                const fileName = preview.querySelector('.file-name')?.textContent;
                if (fileName) {
                    files[docType] = fileName;
                }
            }
        });
        return files;
    }

    /**
     * Submit form data
     * إرسال بيانات النموذج
     */
    async submitForm(data) {
        // This would typically send data to your backend
        console.log('Submitting form data:', data);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // For now, just show success
        return { success: true };
    }

    /**
     * Show success message
     * عرض رسالة النجاح
     */
    showSuccessMessage() {
        const message = 'تم إرسال طلبك بنجاح! سنتواصل معك قريباً.';
        
        if (typeof LUXBYTE !== 'undefined' && LUXBYTE.notifyOk) {
            LUXBYTE.notifyOk(message);
        } else {
            alert(message);
        }

        // Redirect to success page or home
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 3000);
    }

    /**
     * Show error message
     * عرض رسالة الخطأ
     */
    showErrorMessage(message) {
        if (typeof LUXBYTE !== 'undefined' && LUXBYTE.notifyErr) {
            LUXBYTE.notifyErr(message);
        } else {
            alert(message);
        }
    }

    /**
     * Go to specific tab
     * الانتقال لتبويب محدد
     */
    goToTab(tabIndex) {
        if (tabIndex >= 0 && tabIndex < this.tabs.length) {
            this.currentTab = tabIndex;
            this.showTab(tabIndex);
        }
    }

    /**
     * Get current tab index
     * الحصول على فهرس التبويب الحالي
     */
    getCurrentTab() {
        return this.currentTab;
    }

    /**
     * Get total tabs count
     * الحصول على عدد التبويبات الإجمالي
     */
    getTotalTabs() {
        return this.tabs.length;
    }
}

// Initialize when DOM is ready
let signupNavigation;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        signupNavigation = new SignupNavigation();
    });
} else {
    signupNavigation = new SignupNavigation();
}

// Export for global access
if (typeof window !== 'undefined') {
    window.SignupNavigation = SignupNavigation;
    window.signupNavigation = signupNavigation;
    window.changeTab = (direction) => signupNavigation.changeTab(direction);
}

export default SignupNavigation;
