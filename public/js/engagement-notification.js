/**
 * LUXBYTE Engagement Notification System
 * نظام إشعارات التفاعل
 */

class EngagementNotification {
    constructor() {
        this.notifications = [];
        this.permission = 'default';
        this.soundEnabled = true;
        this.init();
    }

    /**
     * Initialize notification system
     * تهيئة نظام الإشعارات
     */
    async init() {
        await this.requestPermission();
        this.setupEventListeners();
        this.loadSettings();
        console.log('🔔 Engagement notification system initialized');
    }

    /**
     * Request notification permission
     * طلب إذن الإشعارات
     */
    async requestPermission() {
        if ('Notification' in window) {
            this.permission = await Notification.requestPermission();
        }
    }

    /**
     * Setup event listeners
     * إعداد مستمعي الأحداث
     */
    setupEventListeners() {
        // Listen for visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.scheduleNotifications();
            } else {
                this.clearScheduledNotifications();
            }
        });

        // Listen for online/offline events
        window.addEventListener('online', () => {
            this.showNotification('تم استعادة الاتصال', 'success');
        });

        window.addEventListener('offline', () => {
            this.showNotification('فقدان الاتصال بالإنترنت', 'warning');
        });
    }

    /**
     * Load notification settings
     * تحميل إعدادات الإشعارات
     */
    loadSettings() {
        const settings = localStorage.getItem('notification-settings');
        if (settings) {
            const parsed = JSON.parse(settings);
            this.soundEnabled = parsed.soundEnabled !== false;
        }
    }

    /**
     * Save notification settings
     * حفظ إعدادات الإشعارات
     */
    saveSettings() {
        const settings = {
            soundEnabled: this.soundEnabled
        };
        localStorage.setItem('notification-settings', JSON.stringify(settings));
    }

    /**
     * Show notification
     * إظهار إشعار
     */
    showNotification(title, message, type = 'info', options = {}) {
        // Browser notification
        if (this.permission === 'granted') {
            const notification = new Notification(title, {
                body: message,
                icon: '/assets/images/logo.png',
                badge: '/assets/images/badge.png',
                tag: 'luxbyte-notification',
                ...options
            });

            // Auto close after 5 seconds
            setTimeout(() => {
                notification.close();
            }, 5000);

            // Handle click
            notification.onclick = () => {
                window.focus();
                notification.close();
            };
        }

        // In-app notification
        this.showInAppNotification(title, message, type);

        // Play sound
        if (this.soundEnabled) {
            this.playNotificationSound(type);
        }
    }

    /**
     * Show in-app notification
     * إظهار إشعار داخل التطبيق
     */
    showInAppNotification(title, message, type) {
        const notification = document.createElement('div');
        notification.className = `in-app-notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">
                    <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                </div>
                <div class="notification-text">
                    <div class="notification-title">${title}</div>
                    <div class="notification-message">${message}</div>
                </div>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        // Add to container
        let container = document.getElementById('notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            container.className = 'notification-container';
            document.body.appendChild(container);
        }

        container.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);

        // Store reference
        this.notifications.push(notification);
    }

    /**
     * Get notification icon
     * الحصول على أيقونة الإشعار
     */
    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle',
            order: 'shopping-cart',
            message: 'envelope',
            system: 'cog'
        };
        return icons[type] || 'bell';
    }

    /**
     * Play notification sound
     * تشغيل صوت الإشعار
     */
    playNotificationSound(type) {
        const audio = new Audio();
        const sounds = {
            success: '/assets/sounds/success.mp3',
            error: '/assets/sounds/error.mp3',
            warning: '/assets/sounds/warning.mp3',
            info: '/assets/sounds/info.mp3',
            order: '/assets/sounds/order.mp3',
            message: '/assets/sounds/message.mp3'
        };

        audio.src = sounds[type] || sounds.info;
        audio.volume = 0.3;
        audio.play().catch(() => {
            // Ignore audio play errors
        });
    }

    /**
     * Schedule notifications
     * جدولة الإشعارات
     */
    scheduleNotifications() {
        // Schedule engagement reminders
        this.scheduleEngagementReminder();
        this.scheduleOrderReminders();
        this.scheduleSystemAlerts();
    }

    /**
     * Schedule engagement reminder
     * جدولة تذكير التفاعل
     */
    scheduleEngagementReminder() {
        // Remind user to check dashboard after 30 minutes of inactivity
        setTimeout(() => {
            if (document.hidden) {
                this.showNotification(
                    'تذكير التفاعل',
                    'لديك تحديثات جديدة في لوحة التحكم',
                    'info'
                );
            }
        }, 30 * 60 * 1000); // 30 minutes
    }

    /**
     * Schedule order reminders
     * جدولة تذكيرات الطلبات
     */
    scheduleOrderReminders() {
        // Check for pending orders every 5 minutes
        setInterval(async () => {
            if (document.hidden) {
                try {
                    const pendingOrders = await this.getPendingOrders();
                    if (pendingOrders.length > 0) {
                        this.showNotification(
                            'طلبات جديدة',
                            `لديك ${pendingOrders.length} طلب جديد`,
                            'order'
                        );
                    }
                } catch (error) {
                    console.warn('Failed to check pending orders:', error);
                }
            }
        }, 5 * 60 * 1000); // 5 minutes
    }

    /**
     * Schedule system alerts
     * جدولة تنبيهات النظام
     */
    scheduleSystemAlerts() {
        // Check system status every 10 minutes
        setInterval(async () => {
            try {
                const systemStatus = await this.checkSystemStatus();
                if (!systemStatus.healthy) {
                    this.showNotification(
                        'تنبيه النظام',
                        systemStatus.message,
                        'warning'
                    );
                }
            } catch (error) {
                console.warn('Failed to check system status:', error);
            }
        }, 10 * 60 * 1000); // 10 minutes
    }

    /**
     * Clear scheduled notifications
     * مسح الإشعارات المجدولة
     */
    clearScheduledNotifications() {
        // Clear all timeouts and intervals
        for (let i = 1; i < 99999; i++) {
            window.clearTimeout(i);
            window.clearInterval(i);
        }
    }

    /**
     * Get pending orders
     * الحصول على الطلبات المعلقة
     */
    async getPendingOrders() {
        try {
            const { getSupabase } = await import('./supabase-client.js');
            const supabase = getSupabase();

            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .eq('status', 'pending')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching pending orders:', error);
            return [];
        }
    }

    /**
     * Check system status
     * فحص حالة النظام
     */
    async checkSystemStatus() {
        try {
            const response = await fetch('/api/health');
            const data = await response.json();
            return {
                healthy: response.ok,
                message: data.message || 'النظام يعمل بشكل طبيعي'
            };
        } catch (error) {
            return {
                healthy: false,
                message: 'فشل في الاتصال بالخادم'
            };
        }
    }

    /**
     * Toggle sound
     * تبديل الصوت
     */
    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        this.saveSettings();

        this.showNotification(
            'إعدادات الصوت',
            this.soundEnabled ? 'تم تفعيل الصوت' : 'تم إيقاف الصوت',
            'info'
        );
    }

    /**
     * Clear all notifications
     * مسح جميع الإشعارات
     */
    clearAllNotifications() {
        this.notifications.forEach(notification => {
            if (notification.parentNode) {
                notification.remove();
            }
        });
        this.notifications = [];
    }

    /**
     * Get notification history
     * الحصول على تاريخ الإشعارات
     */
    getNotificationHistory() {
        return this.notifications.map(notification => ({
            title: notification.querySelector('.notification-title')?.textContent,
            message: notification.querySelector('.notification-message')?.textContent,
            type: notification.className.match(/notification-(\w+)/)?.[1],
            timestamp: new Date()
        }));
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.engagementNotification = new EngagementNotification();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EngagementNotification;
}
