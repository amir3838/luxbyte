// ===============================
// dashboard-common.js — Common Dashboard Utilities
// ===============================

// Global dashboard utilities
window.DashboardUtils = {

    // Format numbers with Arabic locale
    formatNumber: (num) => {
        return new Intl.NumberFormat('ar-EG').format(num);
    },

    // Format currency
    formatCurrency: (amount) => {
        return `${DashboardUtils.formatNumber(amount)} ج.م`;
    },

    // Format date
    formatDate: (date) => {
        return new Intl.DateTimeFormat('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(new Date(date));
    },

    // Format time
    formatTime: (date) => {
        return new Intl.DateTimeFormat('ar-EG', {
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(date));
    },

    // Time since
    timeSince: (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        const intervals = [
            { label: 'سنة', seconds: 31536000 },
            { label: 'شهر', seconds: 2592000 },
            { label: 'أسبوع', seconds: 604800 },
            { label: 'يوم', seconds: 86400 },
            { label: 'ساعة', seconds: 3600 },
            { label: 'دقيقة', seconds: 60 },
            { label: 'ثانية', seconds: 1 }
        ];

        for (const interval of intervals) {
            const count = Math.floor(seconds / interval.seconds);
            if (count > 0) {
                return `منذ ${count} ${interval.label}`;
            }
        }
        return 'الآن';
    },

    // Show loading state
    showLoading: (element) => {
        if (element) {
            element.classList.add('loading');
        }
    },

    // Hide loading state
    hideLoading: (element) => {
        if (element) {
            element.classList.remove('loading');
        }
    },

    // Show error message
    showError: (message, container) => {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;

        if (container) {
            container.appendChild(errorDiv);
            setTimeout(() => errorDiv.remove(), 5000);
        } else {
            document.body.appendChild(errorDiv);
            setTimeout(() => errorDiv.remove(), 5000);
        }
    },

    // Show success message
    showSuccess: (message, container) => {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;

        if (container) {
            container.appendChild(successDiv);
            setTimeout(() => successDiv.remove(), 3000);
        } else {
            document.body.appendChild(successDiv);
            setTimeout(() => successDiv.remove(), 3000);
        }
    },

    // Draw line chart
    drawLineChart: (canvas, values, options = {}) => {
        if (!canvas || !values || values.length === 0) return;

        const ctx = canvas.getContext('2d');
        const { width, height } = canvas.parentElement.getBoundingClientRect();

        canvas.width = width;
        canvas.height = height;

        const padding = 40;
        const chartWidth = width - (padding * 2);
        const chartHeight = height - (padding * 2);

        const maxValue = Math.max(...values);
        const minValue = Math.min(...values);
        const valueRange = maxValue - minValue || 1;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Draw background
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(0, 0, width, height);

        // Draw grid lines
        ctx.strokeStyle = '#e9ecef';
        ctx.lineWidth = 1;

        // Horizontal grid lines
        for (let i = 0; i <= 5; i++) {
            const y = padding + (chartHeight / 5) * i;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();
        }

        // Vertical grid lines
        for (let i = 0; i <= values.length; i++) {
            const x = padding + (chartWidth / values.length) * i;
            ctx.beginPath();
            ctx.moveTo(x, padding);
            ctx.lineTo(x, height - padding);
            ctx.stroke();
        }

        // Draw line
        ctx.strokeStyle = options.color || '#667eea';
        ctx.lineWidth = 3;
        ctx.beginPath();

        values.forEach((value, index) => {
            const x = padding + (chartWidth / (values.length - 1)) * index;
            const y = height - padding - ((value - minValue) / valueRange) * chartHeight;

            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });

        ctx.stroke();

        // Draw points
        ctx.fillStyle = options.color || '#667eea';
        values.forEach((value, index) => {
            const x = padding + (chartWidth / (values.length - 1)) * index;
            const y = height - padding - ((value - minValue) / valueRange) * chartHeight;

            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fill();
        });

        // Draw labels
        ctx.fillStyle = '#6c757d';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';

        // Y-axis labels
        for (let i = 0; i <= 5; i++) {
            const value = minValue + (valueRange / 5) * i;
            const y = height - padding - (chartHeight / 5) * i;
            ctx.fillText(DashboardUtils.formatNumber(Math.round(value)), padding - 10, y + 4);
        }
    },

    // Draw bar chart
    drawBarChart: (canvas, data, options = {}) => {
        if (!canvas || !data || data.length === 0) return;

        const ctx = canvas.getContext('2d');
        const { width, height } = canvas.parentElement.getBoundingClientRect();

        canvas.width = width;
        canvas.height = height;

        const padding = 40;
        const chartWidth = width - (padding * 2);
        const chartHeight = height - (padding * 2);
        const barWidth = chartWidth / data.length * 0.8;
        const barSpacing = chartWidth / data.length * 0.2;

        const maxValue = Math.max(...data.map(d => d.value));

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Draw background
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(0, 0, width, height);

        // Draw bars
        data.forEach((item, index) => {
            const x = padding + (chartWidth / data.length) * index + barSpacing / 2;
            const barHeight = (item.value / maxValue) * chartHeight;
            const y = height - padding - barHeight;

            // Draw bar
            ctx.fillStyle = item.color || '#667eea';
            ctx.fillRect(x, y, barWidth, barHeight);

            // Draw label
            ctx.fillStyle = '#2c3e50';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(item.label, x + barWidth / 2, height - padding + 20);

            // Draw value
            ctx.fillText(DashboardUtils.formatNumber(item.value), x + barWidth / 2, y - 5);
        });
    },

    // Debounce function
    debounce: (func, wait) => {
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

    // Throttle function
    throttle: (func, limit) => {
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
    },

    // Local storage helpers
    storage: {
        set: (key, value) => {
            try {
                localStorage.setItem(key, JSON.stringify(value));
            } catch (e) {
                console.warn('Failed to save to localStorage:', e);
            }
        },

        get: (key, defaultValue = null) => {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (e) {
                console.warn('Failed to read from localStorage:', e);
                return defaultValue;
            }
        },

        remove: (key) => {
            try {
                localStorage.removeItem(key);
            } catch (e) {
                console.warn('Failed to remove from localStorage:', e);
            }
        }
    },

    // API helpers
    api: {
        // Handle API errors
        handleError: (error, context = 'API') => {
            console.error(`${context} Error:`, error);

            let message = 'حدث خطأ غير متوقع';

            if (error.message) {
                message = error.message;
            } else if (typeof error === 'string') {
                message = error;
            }

            DashboardUtils.showError(message);
            return message;
        },

        // Retry function
        retry: async (fn, retries = 3, delay = 1000) => {
            try {
                return await fn();
            } catch (error) {
                if (retries > 0) {
                    await new Promise(resolve => setTimeout(resolve, delay));
                    return DashboardUtils.api.retry(fn, retries - 1, delay * 2);
                }
                throw error;
            }
        }
    },

    // UI helpers
    ui: {
        // Toggle element visibility
        toggle: (element, show) => {
            if (element) {
                element.style.display = show ? 'block' : 'none';
            }
        },

        // Scroll to element
        scrollTo: (element, offset = 0) => {
            if (element) {
                const elementTop = element.offsetTop - offset;
                window.scrollTo({
                    top: elementTop,
                    behavior: 'smooth'
                });
            }
        },

        // Create loading spinner
        createSpinner: (text = 'جاري التحميل...') => {
            const spinner = document.createElement('div');
            spinner.className = 'loading-spinner';
            spinner.innerHTML = `
                <div class="spinner"></div>
                <span>${text}</span>
            `;
            return spinner;
        }
    }
};

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Dashboard utilities loaded');

    // Add global error handler
    window.addEventListener('error', (event) => {
        console.error('Global error:', event.error);
        DashboardUtils.showError('حدث خطأ في التطبيق');
    });

    // Add unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled promise rejection:', event.reason);
        DashboardUtils.showError('حدث خطأ في التطبيق');
    });
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DashboardUtils;
}
