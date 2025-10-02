/**
 * LUXBYTE Common Utilities
 * أدوات مشتركة لجميع الصفحات
 */

// Common utility functions
const CommonUtils = {
    /**
     * Format currency
     * تنسيق العملة
     */
    formatCurrency(amount, currency = 'EGP') {
        return new Intl.NumberFormat('ar-EG', {
            style: 'currency',
            currency: currency
        }).format(amount);
    },

    /**
     * Format date
     * تنسيق التاريخ
     */
    formatDate(date, locale = 'ar-EG') {
        return new Intl.DateTimeFormat(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(new Date(date));
    },

    /**
     * Show loading state
     * إظهار حالة التحميل
     */
    showLoading(element) {
        if (element) {
            element.innerHTML = '<div class="loading-spinner">جاري التحميل...</div>';
        }
    },

    /**
     * Hide loading state
     * إخفاء حالة التحميل
     */
    hideLoading(element, content = '') {
        if (element) {
            element.innerHTML = content;
        }
    },

    /**
     * Show error message
     * إظهار رسالة خطأ
     */
    showError(message, container = null) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <span>${message}</span>
        `;

        if (container) {
            container.appendChild(errorDiv);
        } else {
            document.body.appendChild(errorDiv);
        }

        // Auto remove after 5 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    },

    /**
     * Show success message
     * إظهار رسالة نجاح
     */
    showSuccess(message, container = null) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;

        if (container) {
            container.appendChild(successDiv);
        } else {
            document.body.appendChild(successDiv);
        }

        // Auto remove after 3 seconds
        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    },

    /**
     * Validate email
     * التحقق من صحة البريد الإلكتروني
     */
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    /**
     * Validate phone number
     * التحقق من صحة رقم الهاتف
     */
    validatePhone(phone) {
        const re = /^(\+20|0)?1[0-9]{9}$/;
        return re.test(phone.replace(/\s/g, ''));
    },

    /**
     * Debounce function
     * تأخير تنفيذ الدالة
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Throttle function
     * تقليل تكرار تنفيذ الدالة
     */
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CommonUtils;
} else {
    window.CommonUtils = CommonUtils;
}
