/**
 * تكامل الحارث مع نظام Luxbyte
 * Alhareth Integration with Luxbyte System
 */

class AlharethIntegration {
    constructor() {
        this.alharethConfig = {
            apiUrl: 'https://api.alhareth.com', // URL الحقيقي للحارث
            apiKey: '', // سيتم تعيينه من متغيرات البيئة
            version: '1.0.0',
            enabled: true
        };

        this.init();
    }

    /**
     * تهيئة تكامل الحارث
     */
    init() {
        this.loadConfiguration();
        this.setupEventListeners();
        this.initializeAlhareth();
    }

    /**
     * تحميل إعدادات الحارث
     */
    loadConfiguration() {
        // تحميل من متغيرات البيئة أو localStorage
        const alharethApiKey = localStorage.getItem('alhareth_api_key') ||
                              process.env.ALHARETH_API_KEY ||
                              this.alharethConfig.apiKey;

        if (alharethApiKey) {
            this.alharethConfig.apiKey = alharethApiKey;
        }
    }

    /**
     * إعداد مستمعي الأحداث
     */
    setupEventListeners() {
        // استمع لأحداث النظام
        document.addEventListener('userRegistered', (event) => {
            this.syncUserWithAlhareth(event.detail);
        });

        document.addEventListener('userLoggedIn', (event) => {
            this.trackUserActivity(event.detail);
        });

        document.addEventListener('fileUploaded', (event) => {
            this.syncFileWithAlhareth(event.detail);
        });

        document.addEventListener('orderCreated', (event) => {
            this.syncOrderWithAlhareth(event.detail);
        });
    }

    /**
     * تهيئة الحارث
     */
    async initializeAlhareth() {
        try {
            if (!this.alharethConfig.apiKey) {
                console.warn('مفتاح API للحارث غير محدد');
                return;
            }

            // اختبار الاتصال بالحارث
            const isConnected = await this.testConnection();
            if (isConnected) {
                console.log('تم الاتصال بالحارث بنجاح');
                this.showAlharethStatus('متصل', 'success');
            } else {
                console.error('فشل الاتصال بالحارث');
                this.showAlharethStatus('غير متصل', 'error');
            }
        } catch (error) {
            console.error('خطأ في تهيئة الحارث:', error);
            this.showAlharethStatus('خطأ في الاتصال', 'error');
        }
    }

    /**
     * اختبار الاتصال بالحارث
     */
    async testConnection() {
        try {
            const response = await fetch(`${this.alharethConfig.apiUrl}/health`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.alharethConfig.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            return response.ok;
        } catch (error) {
            console.error('خطأ في اختبار الاتصال بالحارث:', error);
            return false;
        }
    }

    /**
     * مزامنة المستخدم مع الحارث
     */
    async syncUserWithAlhareth(userData) {
        try {
            const alharethUser = {
                id: userData.id,
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                activity_type: userData.activity_type,
                created_at: userData.created_at,
                platform: 'luxbyte',
                status: 'active'
            };

            const response = await this.makeAlharethRequest('/users', 'POST', alharethUser);

            if (response.success) {
                console.log('تم مزامنة المستخدم مع الحارث بنجاح');
                this.showNotification('تم ربط الحساب بالحارث', 'success');
            }
        } catch (error) {
            console.error('خطأ في مزامنة المستخدم مع الحارث:', error);
        }
    }

    /**
     * تتبع نشاط المستخدم
     */
    async trackUserActivity(userData) {
        try {
            const activity = {
                user_id: userData.id,
                action: 'login',
                timestamp: new Date().toISOString(),
                platform: 'luxbyte',
                metadata: {
                    activity_type: userData.activity_type,
                    login_method: 'email'
                }
            };

            await this.makeAlharethRequest('/activities', 'POST', activity);
        } catch (error) {
            console.error('خطأ في تتبع نشاط المستخدم:', error);
        }
    }

    /**
     * مزامنة الملف مع الحارث
     */
    async syncFileWithAlhareth(fileData) {
        try {
            const alharethFile = {
                id: fileData.id,
                user_id: fileData.user_id,
                filename: fileData.filename,
                file_type: fileData.file_type,
                file_size: fileData.file_size,
                upload_date: fileData.upload_date,
                activity_type: fileData.activity_type,
                platform: 'luxbyte',
                status: 'uploaded'
            };

            const response = await this.makeAlharethRequest('/files', 'POST', alharethFile);

            if (response.success) {
                console.log('تم مزامنة الملف مع الحارث بنجاح');
            }
        } catch (error) {
            console.error('خطأ في مزامنة الملف مع الحارث:', error);
        }
    }

    /**
     * مزامنة الطلب مع الحارث
     */
    async syncOrderWithAlhareth(orderData) {
        try {
            const alharethOrder = {
                id: orderData.id,
                user_id: orderData.user_id,
                order_type: orderData.order_type,
                status: orderData.status,
                total_amount: orderData.total_amount,
                created_at: orderData.created_at,
                platform: 'luxbyte',
                metadata: orderData.metadata
            };

            const response = await this.makeAlharethRequest('/orders', 'POST', alharethOrder);

            if (response.success) {
                console.log('تم مزامنة الطلب مع الحارث بنجاح');
            }
        } catch (error) {
            console.error('خطأ في مزامنة الطلب مع الحارث:', error);
        }
    }

    /**
     * إجراء طلب للحارث
     */
    async makeAlharethRequest(endpoint, method, data) {
        try {
            const response = await fetch(`${this.alharethConfig.apiUrl}${endpoint}`, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${this.alharethConfig.apiKey}`,
                    'Content-Type': 'application/json',
                    'X-Platform': 'luxbyte',
                    'X-Version': this.alharethConfig.version
                },
                body: data ? JSON.stringify(data) : undefined
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('خطأ في طلب الحارث:', error);
            throw error;
        }
    }

    /**
     * إظهار حالة الحارث
     */
    showAlharethStatus(message, type) {
        const statusElement = document.getElementById('alhareth-status');
        if (statusElement) {
            statusElement.textContent = message;
            statusElement.className = `alhareth-status ${type}`;
        }
    }

    /**
     * إظهار إشعار
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

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

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    /**
     * الحصول على إحصائيات الحارث
     */
    async getAlharethStats() {
        try {
            const response = await this.makeAlharethRequest('/stats', 'GET');
            return response;
        } catch (error) {
            console.error('خطأ في الحصول على إحصائيات الحارث:', error);
            return null;
        }
    }

    /**
     * تحديث إعدادات الحارث
     */
    updateConfiguration(newConfig) {
        this.alharethConfig = { ...this.alharethConfig, ...newConfig };

        if (newConfig.apiKey) {
            localStorage.setItem('alhareth_api_key', newConfig.apiKey);
        }
    }

    /**
     * إيقاف تكامل الحارث
     */
    disable() {
        this.alharethConfig.enabled = false;
        console.log('تم إيقاف تكامل الحارث');
    }

    /**
     * تفعيل تكامل الحارث
     */
    enable() {
        this.alharethConfig.enabled = true;
        this.initializeAlhareth();
        console.log('تم تفعيل تكامل الحارث');
    }
}

// تهيئة تكامل الحارث عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    window.alharethIntegration = new AlharethIntegration();
});

// تصدير الكلاس للاستخدام في الملفات الأخرى
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AlharethIntegration;
} else {
    window.AlharethIntegration = AlharethIntegration;
}
