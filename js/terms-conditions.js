/**
 * ملف JavaScript للشروط والأحكام
 * Terms and Conditions JavaScript Functions
 */

class TermsConditionsManager {
    constructor() {
        this.init();
    }

    /**
     * تهيئة النظام
     */
    init() {
        this.setupNavigation();
        this.setupScrollSpy();
        this.setupAcceptanceFlow();
    }

    /**
     * إعداد التنقل
     */
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('.terms-section');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);

                if (targetSection) {
                    // إزالة النشاط من جميع الروابط
                    navLinks.forEach(navLink => navLink.classList.remove('active'));

                    // إضافة النشاط للرابط المحدد
                    link.classList.add('active');

                    // التمرير إلى القسم المطلوب
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    /**
     * إعداد تتبع التمرير
     */
    setupScrollSpy() {
        const sections = document.querySelectorAll('.terms-section');
        const navLinks = document.querySelectorAll('.nav-link');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);

                    if (activeLink) {
                        // إزالة النشاط من جميع الروابط
                        navLinks.forEach(link => link.classList.remove('active'));

                        // إضافة النشاط للرابط المقابل
                        activeLink.classList.add('active');
                    }
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-100px 0px -100px 0px'
        });

        sections.forEach(section => {
            observer.observe(section);
        });
    }

    /**
     * إعداد تدفق الموافقة
     */
    setupAcceptanceFlow() {
        // التحقق من وجود معاملات URL
        const urlParams = new URLSearchParams(window.location.search);
        const fromRegistration = urlParams.get('from') === 'registration';

        if (fromRegistration) {
            this.showAcceptanceButtons();
        }
    }

    /**
     * إظهار أزرار الموافقة
     */
    showAcceptanceButtons() {
        const footer = document.querySelector('.terms-footer');
        if (footer) {
            footer.style.display = 'block';
        }
    }

    /**
     * معالجة الموافقة على الشروط
     */
    acceptTerms() {
        // حفظ موافقة المستخدم
        localStorage.setItem('terms_accepted', 'true');
        localStorage.setItem('terms_accepted_date', new Date().toISOString());

        // إظهار رسالة تأكيد
        this.showNotification('تم قبول الشروط والأحكام بنجاح', 'success');

        // توجيه المستخدم إلى صفحة التسجيل
        setTimeout(() => {
            window.location.href = 'index.html?terms_accepted=true';
        }, 1500);
    }

    /**
     * العودة للصفحة السابقة
     */
    goBack() {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            window.location.href = 'index.html';
        }
    }

    /**
     * عرض إشعار
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        // إضافة الأنماط
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            animation: slideIn 0.3s ease;
            max-width: 400px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        `;

        // تحديد لون الإشعار
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8'
        };

        notification.style.backgroundColor = colors[type] || colors.info;

        if (type === 'warning') {
            notification.style.color = '#333';
        }

        document.body.appendChild(notification);

        // إزالة الإشعار بعد 3 ثوان
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    /**
     * التحقق من موافقة المستخدم على الشروط
     */
    static checkTermsAcceptance() {
        const termsAccepted = localStorage.getItem('terms_accepted');
        const termsAcceptedDate = localStorage.getItem('terms_accepted_date');

        if (!termsAccepted) {
            return false;
        }

        // التحقق من أن الموافقة حديثة (أقل من 30 يوم)
        if (termsAcceptedDate) {
            const acceptedDate = new Date(termsAcceptedDate);
            const currentDate = new Date();
            const daysDiff = (currentDate - acceptedDate) / (1000 * 60 * 60 * 24);

            if (daysDiff > 30) {
                // الموافقة قديمة، يجب الموافقة مرة أخرى
                localStorage.removeItem('terms_accepted');
                localStorage.removeItem('terms_accepted_date');
                return false;
            }
        }

        return true;
    }

    /**
     * إجبار المستخدم على الموافقة على الشروط
     */
    static requireTermsAcceptance() {
        if (!this.checkTermsAcceptance()) {
            // توجيه المستخدم إلى صفحة الشروط والأحكام
            window.location.href = 'terms-conditions.html?from=registration';
            return false;
        }
        return true;
    }

    /**
     * إضافة checkbox للموافقة على الشروط في نماذج التسجيل
     */
    static addTermsCheckbox(form) {
        const termsCheckbox = document.createElement('div');
        termsCheckbox.className = 'form-group terms-checkbox';
        termsCheckbox.innerHTML = `
            <label class="terms-label">
                <input type="checkbox" id="terms-acceptance" name="terms_accepted" required>
                <span class="checkmark"></span>
                أوافق على <a href="terms-conditions.html" target="_blank" class="terms-link">الشروط والأحكام</a>
            </label>
        `;

        // إضافة الأنماط
        const style = document.createElement('style');
        style.textContent = `
            .terms-checkbox {
                margin: 1rem 0;
            }

            .terms-label {
                display: flex;
                align-items: flex-start;
                gap: 0.75rem;
                cursor: pointer;
                font-size: 0.9rem;
                line-height: 1.4;
            }

            .terms-label input[type="checkbox"] {
                margin: 0;
                width: 18px;
                height: 18px;
                accent-color: #667eea;
            }

            .terms-link {
                color: #667eea;
                text-decoration: none;
                font-weight: 500;
            }

            .terms-link:hover {
                text-decoration: underline;
            }
        `;
        document.head.appendChild(style);

        // إدراج checkbox قبل زر الإرسال
        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton) {
            form.insertBefore(termsCheckbox, submitButton);
        } else {
            form.appendChild(termsCheckbox);
        }

        // إضافة التحقق من الموافقة عند إرسال النموذج
        form.addEventListener('submit', (e) => {
            const termsCheckbox = form.querySelector('#terms-acceptance');
            if (termsCheckbox && !termsCheckbox.checked) {
                e.preventDefault();
                alert('يجب الموافقة على الشروط والأحكام أولاً');
                termsCheckbox.focus();
                return false;
            }
        });
    }
}

// تهيئة النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    window.termsManager = new TermsConditionsManager();
});

// دوال مساعدة للاستخدام في الملفات الأخرى
function acceptTerms() {
    if (window.termsManager) {
        window.termsManager.acceptTerms();
    }
}

function goBack() {
    if (window.termsManager) {
        window.termsManager.goBack();
    }
}

// إضافة أنماط CSS للرسوم المتحركة
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;
document.head.appendChild(animationStyles);

// تصدير الكلاس للاستخدام في الملفات الأخرى
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TermsConditionsManager;
} else {
    window.TermsConditionsManager = TermsConditionsManager;
}
