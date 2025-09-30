/**
 * لوحة تحكم السائق الرئيسي
 * Master Driver Dashboard
 */

class DriverDashboard {
    constructor() {
        this.supabase = null;
        this.currentUser = null;
        this.driverData = null;
        this.deliveries = [];
        this.earnings = [];
        this.team = [];
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

            console.log('تم تهيئة لوحة تحكم السائق الرئيسي بنجاح');
        } catch (error) {
            console.error('خطأ في تهيئة لوحة تحكم السائق الرئيسي:', error);
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
            if (user.user_metadata?.activity_type !== 'driver') {
                throw new Error('هذا الحساب غير مخصص للسائقين الرئيسيين');
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
            // تحميل بيانات السائق
            await this.loadDriverData();

            // تحميل الطلبات
            await this.loadDeliveries();

            // تحميل الأرباح
            await this.loadEarnings();

            // تحميل الفريق
            await this.loadTeam();

            // تحديث الواجهة
            this.updateDashboard();
        } catch (error) {
            console.error('خطأ في تحميل البيانات:', error);
            this.showError('خطأ في تحميل البيانات');
        }
    }

    /**
     * تحميل بيانات السائق
     */
    async loadDriverData() {
        try {
            const { data, error } = await this.supabase
                .from('user_profiles')
                .select('*')
                .eq('id', this.currentUser.id)
                .single();

            if (error) {
                throw error;
            }

            this.driverData = data;
        } catch (error) {
            console.error('خطأ في تحميل بيانات السائق:', error);
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
                .eq('driver_id', this.currentUser.id)
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
                .eq('driver_id', this.currentUser.id)
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
     * تحميل الفريق
     */
    async loadTeam() {
        try {
            const { data, error } = await this.supabase
                .from('team_members')
                .select('*')
                .eq('driver_id', this.currentUser.id)
                .order('created_at', { ascending: false });

            if (error) {
                throw error;
            }

            this.team = data || [];
        } catch (error) {
            console.error('خطأ في تحميل الفريق:', error);
        }
    }

    /**
     * تحديث لوحة التحكم
     */
    updateDashboard() {
        this.updateStats();
        this.updateDeliveriesList();
        this.updateEarningsList();
        this.updateTeamList();
        this.updateDriverInfo();
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
        const teamSize = this.team.length;

        document.getElementById('total-deliveries').textContent = totalDeliveries;
        document.getElementById('pending-deliveries').textContent = pendingDeliveries;
        document.getElementById('completed-deliveries').textContent = completedDeliveries;
        document.getElementById('total-earnings').textContent = totalEarnings.toFixed(2);
        document.getElementById('team-size').textContent = teamSize;
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
                <button class="btn btn-primary" onclick="driverDashboard.viewDelivery(${delivery.id})">عرض</button>
                <button class="btn btn-success" onclick="driverDashboard.acceptDelivery(${delivery.id})">قبول</button>
                <button class="btn btn-danger" onclick="driverDashboard.rejectDelivery(${delivery.id})">رفض</button>
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
     * تحديث قائمة الفريق
     */
    updateTeamList() {
        const teamList = document.getElementById('team-list');
        if (!teamList) return;

        teamList.innerHTML = '';

        if (this.team.length === 0) {
            teamList.innerHTML = '<p class="no-data">لا يوجد أعضاء في الفريق حالياً</p>';
            return;
        }

        this.team.forEach(member => {
            const memberElement = this.createTeamMemberElement(member);
            teamList.appendChild(memberElement);
        });
    }

    /**
     * إنشاء عنصر عضو الفريق
     */
    createTeamMemberElement(member) {
        const memberDiv = document.createElement('div');
        memberDiv.className = 'team-member-item';
        memberDiv.innerHTML = `
            <div class="member-header">
                <h4>${member.name}</h4>
                <span class="member-role">${member.role || 'عضو'}</span>
            </div>
            <div class="member-details">
                <p><strong>الهاتف:</strong> ${member.phone || 'غير محدد'}</p>
                <p><strong>البريد الإلكتروني:</strong> ${member.email || 'غير محدد'}</p>
                <p><strong>تاريخ الانضمام:</strong> ${new Date(member.created_at).toLocaleDateString('ar-EG')}</p>
            </div>
            <div class="member-actions">
                <button class="btn btn-primary" onclick="driverDashboard.viewMember(${member.id})">عرض</button>
                <button class="btn btn-success" onclick="driverDashboard.editMember(${member.id})">تعديل</button>
                <button class="btn btn-danger" onclick="driverDashboard.removeMember(${member.id})">إزالة</button>
            </div>
        `;
        return memberDiv;
    }

    /**
     * تحديث معلومات السائق
     */
    updateDriverInfo() {
        if (!this.driverData) return;

        document.getElementById('driver-name').textContent = this.driverData.name || 'غير محدد';
        document.getElementById('driver-email').textContent = this.driverData.email || 'غير محدد';
        document.getElementById('driver-phone').textContent = this.driverData.phone || 'غير محدد';
    }

    /**
     * إعداد المستمعين
     */
    setupEventListeners() {
        // زر إضافة عضو جديد
        const addMemberBtn = document.getElementById('add-member');
        if (addMemberBtn) {
            addMemberBtn.addEventListener('click', () => this.showAddMemberForm());
        }

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
     * عرض عضو الفريق
     */
    async viewMember(memberId) {
        try {
            const { data, error } = await this.supabase
                .from('team_members')
                .select('*')
                .eq('id', memberId)
                .single();

            if (error) {
                throw error;
            }

            this.showMemberModal(data);
        } catch (error) {
            console.error('خطأ في عرض عضو الفريق:', error);
            this.showError('خطأ في عرض عضو الفريق');
        }
    }

    /**
     * تعديل عضو الفريق
     */
    editMember(memberId) {
        const member = this.team.find(member => member.id === memberId);
        if (member) {
            this.showEditMemberForm(member);
        }
    }

    /**
     * إزالة عضو من الفريق
     */
    async removeMember(memberId) {
        if (!confirm('هل أنت متأكد من إزالة هذا العضو من الفريق؟')) {
            return;
        }

        try {
            const { error } = await this.supabase
                .from('team_members')
                .delete()
                .eq('id', memberId);

            if (error) {
                throw error;
            }

            this.showSuccess('تم إزالة العضو من الفريق بنجاح');
            await this.loadTeam();
            this.updateTeamList();
        } catch (error) {
            console.error('خطأ في إزالة العضو:', error);
            this.showError('خطأ في إزالة العضو');
        }
    }

    /**
     * عرض نموذج إضافة عضو جديد
     */
    showAddMemberForm() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>إضافة عضو جديد للفريق</h3>
                    <button class="close-btn" onclick="this.closest('.modal').remove()">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="add-member-form">
                        <div class="form-group">
                            <label for="member-name">اسم العضو</label>
                            <input type="text" id="member-name" name="name" required>
                        </div>
                        <div class="form-group">
                            <label for="member-phone">رقم الهاتف</label>
                            <input type="tel" id="member-phone" name="phone" required>
                        </div>
                        <div class="form-group">
                            <label for="member-email">البريد الإلكتروني</label>
                            <input type="email" id="member-email" name="email">
                        </div>
                        <div class="form-group">
                            <label for="member-role">الدور</label>
                            <select id="member-role" name="role">
                                <option value="courier">مندوب توصيل</option>
                                <option value="assistant">مساعد</option>
                                <option value="supervisor">مشرف</option>
                            </select>
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">إضافة</button>
                            <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">إلغاء</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // إعداد النموذج
        const form = modal.querySelector('#add-member-form');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.addMember(new FormData(form));
            modal.remove();
        });
    }

    /**
     * إضافة عضو جديد للفريق
     */
    async addMember(formData) {
        try {
            const { error } = await this.supabase
                .from('team_members')
                .insert({
                    driver_id: this.currentUser.id,
                    name: formData.get('name'),
                    phone: formData.get('phone'),
                    email: formData.get('email'),
                    role: formData.get('role'),
                    created_at: new Date().toISOString()
                });

            if (error) {
                throw error;
            }

            this.showSuccess('تم إضافة العضو للفريق بنجاح');
            await this.loadTeam();
            this.updateTeamList();
        } catch (error) {
            console.error('خطأ في إضافة العضو:', error);
            this.showError('خطأ في إضافة العضو');
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
                    .from('driver_locations')
                    .upsert({
                        driver_id: this.currentUser.id,
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

// تهيئة لوحة تحكم السائق الرئيسي عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    window.driverDashboard = new DriverDashboard();
});
