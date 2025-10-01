/**
 * لوحة تحكم المندوب
 * Courier Dashboard
 */

class CourierDashboard {
    constructor() {
        this.supabase = null;
        this.currentUser = null;
        this.courierData = null;
        this.deliveries = [];
        this.earnings = [];
        this.init();
    }

    /**
     * تهيئة لوحة التحكم
     */
    async init() {
        try {
            // انتظار تحميل Supabase
            await this.waitForSupabase();

            // تهيئة Supabase
            const { getSupabase } = await import('./supabase-client.js');
            this.supabase = getSupabase();

            // التحقق من المصادقة
            await this.checkAuthentication();

            // تحميل البيانات
            await this.loadDashboardData();

            // إعداد المستمعين
            this.setupEventListeners();

            console.log('تم تهيئة لوحة تحكم المندوب بنجاح');
        } catch (error) {
            console.error('خطأ في تهيئة لوحة تحكم المندوب:', error);
            this.showError('خطأ في تحميل لوحة التحكم');
        }
    }

    /**
     * انتظار تحميل Supabase
     */
    async waitForSupabase() {
        return new Promise((resolve) => {
            const checkSupabase = () => {
                if (window.supabase) {
                    resolve();
                } else {
                    setTimeout(checkSupabase, 100);
                }
            };
            checkSupabase();
        });
    }

    /**
     * التحقق من المصادقة
     */
    async checkAuthentication() {
        try {
            const { data: { user }, error } = await this.supabase.auth.getUser();

            if (error || !user) {
                throw new Error('المستخدم غير مصادق عليه');
            }

            this.currentUser = user;

            // التحقق من نوع النشاط
            if (user.user_metadata?.activity_type !== 'courier') {
                throw new Error('هذا الحساب غير مخصص للمندوبين');
            }
        } catch (error) {
            console.error('خطأ في التحقق من المصادقة:', error);
            window.location.href = '../index.html';
        }
    }

    /**
     * تحميل بيانات لوحة التحكم
     */
    async loadDashboardData() {
        try {
            // تحميل بيانات المندوب
            await this.loadCourierData();

            // تحميل الطلبات
            await this.loadDeliveries();

            // تحميل الأرباح
            await this.loadEarnings();

            // تحديث الواجهة
            this.updateDashboard();
        } catch (error) {
            console.error('خطأ في تحميل البيانات:', error);
            this.showError('خطأ في تحميل البيانات');
        }
    }

    /**
     * تحميل بيانات المندوب
     */
    async loadCourierData() {
        try {
            const { data, error } = await this.supabase
                .from('user_profiles')
                .select('*')
                .eq('id', this.currentUser.id)
                .single();

            if (error) {
                throw error;
            }

            this.courierData = data;
        } catch (error) {
            console.error('خطأ في تحميل بيانات المندوب:', error);
        }
    }

    /**
     * تحميل الطلبات
     */
    async loadDeliveries() {
        try {
            const { data, error } = await this.supabase
                .from('deliveries')
                .select('*')
                .eq('courier_id', this.currentUser.id)
                .order('created_at', { ascending: false })
                .limit(10);

            if (error) {
                throw error;
            }

            this.deliveries = data || [];
        } catch (error) {
            console.error('خطأ في تحميل الطلبات:', error);
        }
    }

    /**
     * تحميل الأرباح
     */
    async loadEarnings() {
        try {
            const { data, error } = await this.supabase
                .from('earnings')
                .select('*')
                .eq('courier_id', this.currentUser.id)
                .order('created_at', { ascending: false })
                .limit(10);

            if (error) {
                throw error;
            }

            this.earnings = data || [];
        } catch (error) {
            console.error('خطأ في تحميل الأرباح:', error);
        }
    }

    /**
     * تحديث لوحة التحكم
     */
    updateDashboard() {
        this.updateStats();
        this.updateDeliveriesList();
        this.updateEarningsList();
        this.updateCourierInfo();
    }

    /**
     * تحديث الإحصائيات
     */
    updateStats() {
        const totalDeliveries = this.deliveries.length;
        const pendingDeliveries = this.deliveries.filter(delivery => delivery.status === 'pending').length;
        const completedDeliveries = this.deliveries.filter(delivery => delivery.status === 'completed').length;
        const totalEarnings = this.earnings
            .filter(earning => earning.status === 'paid')
            .reduce((sum, earning) => sum + (earning.amount || 0), 0);

        document.getElementById('total-deliveries').textContent = totalDeliveries;
        document.getElementById('pending-deliveries').textContent = pendingDeliveries;
        document.getElementById('completed-deliveries').textContent = completedDeliveries;
        document.getElementById('total-earnings').textContent = totalEarnings.toFixed(2);
    }

    /**
     * تحديث قائمة الطلبات
     */
    updateDeliveriesList() {
        const deliveriesList = document.getElementById('deliveries-list');
        if (!deliveriesList) return;

        deliveriesList.innerHTML = '';

        if (this.deliveries.length === 0) {
            deliveriesList.innerHTML = '<p class="no-data">لا توجد طلبات حالياً</p>';
            return;
        }

        this.deliveries.forEach(delivery => {
            const deliveryElement = this.createDeliveryElement(delivery);
            deliveriesList.appendChild(deliveryElement);
        });
    }

    /**
     * إنشاء عنصر الطلب
     */
    createDeliveryElement(delivery) {
        const deliveryDiv = document.createElement('div');
        deliveryDiv.className = 'delivery-item';
        deliveryDiv.innerHTML = `
            <div class="delivery-header">
                <h4>طلب #${delivery.id}</h4>
                <span class="delivery-status status-${delivery.status}">${this.getStatusText(delivery.status)}</span>
            </div>
            <div class="delivery-details">
                <p><strong>العميل:</strong> ${delivery.customer_name || 'غير محدد'}</p>
                <p><strong>العنوان:</strong> ${delivery.delivery_address || 'غير محدد'}</p>
                <p><strong>المبلغ:</strong> ${delivery.delivery_fee || 0} جنيه</p>
                <p><strong>التاريخ:</strong> ${new Date(delivery.created_at).toLocaleDateString('ar-EG')}</p>
            </div>
            <div class="delivery-actions">
                <button class="btn btn-primary" onclick="courierDashboard.viewDelivery(${delivery.id})">عرض</button>
                <button class="btn btn-success" onclick="courierDashboard.acceptDelivery(${delivery.id})">قبول</button>
                <button class="btn btn-danger" onclick="courierDashboard.rejectDelivery(${delivery.id})">رفض</button>
            </div>
        `;
        return deliveryDiv;
    }

    /**
     * تحديث قائمة الأرباح
     */
    updateEarningsList() {
        const earningsList = document.getElementById('earnings-list');
        if (!earningsList) return;

        earningsList.innerHTML = '';

        if (this.earnings.length === 0) {
            earningsList.innerHTML = '<p class="no-data">لا توجد أرباح حالياً</p>';
            return;
        }

        this.earnings.forEach(earning => {
            const earningElement = this.createEarningElement(earning);
            earningsList.appendChild(earningElement);
        });
    }

    /**
     * إنشاء عنصر الربح
     */
    createEarningElement(earning) {
        const earningDiv = document.createElement('div');
        earningDiv.className = 'earning-item';
        earningDiv.innerHTML = `
            <div class="earning-header">
                <h4>ربح #${earning.id}</h4>
                <span class="earning-amount">${earning.amount} جنيه</span>
            </div>
            <div class="earning-details">
                <p><strong>المصدر:</strong> ${earning.source || 'غير محدد'}</p>
                <p><strong>الحالة:</strong> ${this.getEarningStatusText(earning.status)}</p>
                <p><strong>التاريخ:</strong> ${new Date(earning.created_at).toLocaleDateString('ar-EG')}</p>
            </div>
        `;
        return earningDiv;
    }

    /**
     * تحديث معلومات المندوب
     */
    updateCourierInfo() {
        if (!this.courierData) return;

        document.getElementById('courier-name').textContent = this.courierData.name || 'غير محدد';
        document.getElementById('courier-email').textContent = this.courierData.email || 'غير محدد';
        document.getElementById('courier-phone').textContent = this.courierData.phone || 'غير محدد';
    }

    /**
     * إعداد المستمعين
     */
    setupEventListeners() {
        // زر تحديث البيانات
        const refreshBtn = document.getElementById('refresh-data');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.loadDashboardData());
        }

        // زر تحديث الموقع
        const updateLocationBtn = document.getElementById('update-location');
        if (updateLocationBtn) {
            updateLocationBtn.addEventListener('click', () => this.updateLocation());
        }
    }

    /**
     * عرض تفاصيل الطلب
     */
    async viewDelivery(deliveryId) {
        try {
            const { data, error } = await this.supabase
                .from('deliveries')
                .select('*')
                .eq('id', deliveryId)
                .single();

            if (error) {
                throw error;
            }

            this.showDeliveryModal(data);
        } catch (error) {
            console.error('خطأ في عرض الطلب:', error);
            this.showError('خطأ في عرض الطلب');
        }
    }

    /**
     * قبول الطلب
     */
    async acceptDelivery(deliveryId) {
        try {
            const { error } = await this.supabase
                .from('deliveries')
                .update({
                    status: 'accepted',
                    updated_at: new Date().toISOString()
                })
                .eq('id', deliveryId);

            if (error) {
                throw error;
            }

            this.showSuccess('تم قبول الطلب بنجاح');
            await this.loadDeliveries();
            this.updateDeliveriesList();
        } catch (error) {
            console.error('خطأ في قبول الطلب:', error);
            this.showError('خطأ في قبول الطلب');
        }
    }

    /**
     * رفض الطلب
     */
    async rejectDelivery(deliveryId) {
        try {
            const { error } = await this.supabase
                .from('deliveries')
                .update({
                    status: 'rejected',
                    updated_at: new Date().toISOString()
                })
                .eq('id', deliveryId);

            if (error) {
                throw error;
            }

            this.showSuccess('تم رفض الطلب');
            await this.loadDeliveries();
            this.updateDeliveriesList();
        } catch (error) {
            console.error('خطأ في رفض الطلب:', error);
            this.showError('خطأ في رفض الطلب');
        }
    }

    /**
     * تحديث الموقع
     */
    async updateLocation() {
        try {
            if (!navigator.geolocation) {
                throw new Error('المتصفح لا يدعم تحديد الموقع');
            }

            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;

                const { error } = await this.supabase
                    .from('courier_locations')
                    .upsert({
                        courier_id: this.currentUser.id,
                        latitude: latitude,
                        longitude: longitude,
                        updated_at: new Date().toISOString()
                    });

                if (error) {
                    throw error;
                }

                this.showSuccess('تم تحديث الموقع بنجاح');
            }, (error) => {
                throw new Error('فشل في الحصول على الموقع');
            });
        } catch (error) {
            console.error('خطأ في تحديث الموقع:', error);
            this.showError('خطأ في تحديث الموقع');
        }
    }

    /**
     * الحصول على نص الحالة
     */
    getStatusText(status) {
        const statusMap = {
            'pending': 'في الانتظار',
            'accepted': 'مقبول',
            'rejected': 'مرفوض',
            'picked_up': 'تم الاستلام',
            'in_transit': 'قيد التوصيل',
            'delivered': 'تم التسليم',
            'cancelled': 'ملغي'
        };
        return statusMap[status] || status;
    }

    /**
     * الحصول على نص حالة الربح
     */
    getEarningStatusText(status) {
        const statusMap = {
            'pending': 'في الانتظار',
            'paid': 'مدفوع',
            'cancelled': 'ملغي'
        };
        return statusMap[status] || status;
    }

    /**
     * إظهار رسالة نجاح
     */
    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    /**
     * إظهار رسالة خطأ
     */
    showError(message) {
        this.showNotification(message, 'error');
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
}

// تهيئة لوحة تحكم المندوب عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    window.courierDashboard = new CourierDashboard();
});
