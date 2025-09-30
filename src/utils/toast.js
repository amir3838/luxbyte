/**
 * Toast Notification System
 * نظام الإشعارات المنبثقة
 *
 * Features:
 * - Arabic language support
 * - Multiple notification types
 * - Auto-dismiss functionality
 * - Consistent styling
 */

let toastContainer = null;

/**
 * Initialize toast container
 * تهيئة حاوية الإشعارات
 */
function initToastContainer() {
    if (toastContainer) return;

    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        display: flex;
        flex-direction: column;
        gap: 10px;
        pointer-events: none;
    `;

    document.body.appendChild(toastContainer);
}

/**
 * Show error toast
 * عرض إشعار خطأ
 */
export function toastError(message) {
    showToast(message, 'error');
}

/**
 * Show success toast
 * عرض إشعار نجاح
 */
export function toastSuccess(message) {
    showToast(message, 'success');
}

/**
 * Show info toast
 * عرض إشعار معلومات
 */
export function toastInfo(message) {
    showToast(message, 'info');
}

/**
 * Show warning toast
 * عرض إشعار تحذير
 */
export function toastWarning(message) {
    showToast(message, 'warning');
}

/**
 * Show toast notification
 * عرض إشعار منبثق
 */
export function showToast(message, type = 'info', duration = 5000) {
    initToastContainer();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    // Get icon and color based on type
    const { icon, color, bgColor } = getToastStyle(type);

    toast.style.cssText = `
        background: ${bgColor};
        color: ${color};
        border: 1px solid ${color}40;
        border-radius: 12px;
        padding: 16px 20px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
        backdrop-filter: blur(10px);
        display: flex;
        align-items: center;
        gap: 12px;
        font-family: 'Cairo', sans-serif;
        font-size: 14px;
        font-weight: 500;
        max-width: 400px;
        min-width: 300px;
        pointer-events: auto;
        transform: translateX(100%);
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        direction: rtl;
    `;

    toast.innerHTML = `
        <div style="font-size: 18px; flex-shrink: 0;">
            ${icon}
        </div>
        <div style="flex: 1; line-height: 1.4;">
            ${message}
        </div>
        <button onclick="this.parentElement.remove()" style="
            background: none;
            border: none;
            color: inherit;
            cursor: pointer;
            font-size: 16px;
            padding: 4px;
            border-radius: 4px;
            transition: background-color 0.2s;
        " onmouseover="this.style.backgroundColor='rgba(0,0,0,0.1)'" onmouseout="this.style.backgroundColor='transparent'">
            <i class="fas fa-times"></i>
        </button>
    `;

    toastContainer.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
        toast.style.transform = 'translateX(0)';
        toast.style.opacity = '1';
    });

    // Auto remove
    if (duration > 0) {
        setTimeout(() => {
            removeToast(toast);
        }, duration);
    }

    return toast;
}

/**
 * Remove toast
 * إزالة الإشعار
 */
function removeToast(toast) {
    if (!toast || !toast.parentElement) return;

    toast.style.transform = 'translateX(100%)';
    toast.style.opacity = '0';

    setTimeout(() => {
        if (toast.parentElement) {
            toast.parentElement.removeChild(toast);
        }
    }, 300);
}

/**
 * Get toast style based on type
 * الحصول على نمط الإشعار حسب النوع
 */
function getToastStyle(type) {
    const styles = {
        error: {
            icon: '<i class="fas fa-exclamation-circle"></i>',
            color: '#dc2626',
            bgColor: 'rgba(254, 226, 226, 0.95)'
        },
        success: {
            icon: '<i class="fas fa-check-circle"></i>',
            color: '#059669',
            bgColor: 'rgba(240, 253, 244, 0.95)'
        },
        warning: {
            icon: '<i class="fas fa-exclamation-triangle"></i>',
            color: '#d97706',
            bgColor: 'rgba(255, 251, 235, 0.95)'
        },
        info: {
            icon: '<i class="fas fa-info-circle"></i>',
            color: '#2563eb',
            bgColor: 'rgba(239, 246, 255, 0.95)'
        }
    };

    return styles[type] || styles.info;
}

/**
 * Clear all toasts
 * مسح جميع الإشعارات
 */
export function clearAllToasts() {
    if (toastContainer) {
        toastContainer.innerHTML = '';
    }
}

// Make functions globally available for backward compatibility
if (typeof window !== 'undefined') {
    window.toastError = toastError;
    window.toastSuccess = toastSuccess;
    window.toastInfo = toastInfo;
    window.toastWarning = toastWarning;
    window.showToast = showToast;
    window.clearAllToasts = clearAllToasts;
}
