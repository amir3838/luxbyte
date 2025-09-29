/**
 * لوحة تحكم الصيدلية
 * Pharmacy Dashboard
 */

class PharmacyDashboard {
    constructor() {
        this.supabase = null;
        this.currentUser = null;
        this.pharmacyData = null;
        this.orders = [];
        this.medicines = [];
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
            this.supabase = window.supabase.createClient(
                window.SUPABASE_CONFIG?.url || 'YOUR_SUPABASE_URL',
                window.SUPABASE_CONFIG?.anonKey || 'YOUR_SUPABASE_ANON_KEY'
            );

            // التحقق من المصادقة
            await this.checkAuthentication();

            // تحميل البيانات
            await this.loadDashboardData();

            // إعداد المستمعين
            this.setupEventListeners();

            console.log('تم تهيئة لوحة تحكم الصيدلية بنجاح');
        } catch (error) {
            console.error('خطأ في تهيئة لوحة تحكم الصيدلية:', error);
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
            if (user.user_metadata?.activity_type !== 'pharmacy') {
                throw new Error('هذا الحساب غير مخصص للصيدليات');
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
            // تحميل بيانات الصيدلية
            await this.loadPharmacyData();

            // تحميل الطلبات
            await this.loadOrders();

            // تحميل الأدوية
            await this.loadMedicines();

            // تحديث الواجهة
            this.updateDashboard();
        } catch (error) {
            console.error('خطأ في تحميل البيانات:', error);
            this.showError('خطأ في تحميل البيانات');
        }
    }

    /**
     * تحميل بيانات الصيدلية
     */
    async loadPharmacyData() {
        try {
            const { data, error } = await this.supabase
                .from('user_profiles')
                .select('*')
                .eq('id', this.currentUser.id)
                .single();

            if (error) {
                throw error;
            }

            this.pharmacyData = data;
        } catch (error) {
            console.error('خطأ في تحميل بيانات الصيدلية:', error);
        }
    }

    /**
     * تحميل الطلبات
     */
    async loadOrders() {
        try {
            const { data, error } = await this.supabase
                .from('orders')
                .select('*')
                .eq('user_id', this.currentUser.id)
                .order('created_at', { ascending: false })
                .limit(10);

            if (error) {
                throw error;
            }

            this.orders = data || [];
        } catch (error) {
            console.error('خطأ في تحميل الطلبات:', error);
        }
    }

    /**
     * تحميل الأدوية
     */
    async loadMedicines() {
        try {
            const { data, error } = await this.supabase
                .from('medicines')
                .select('*')
                .eq('pharmacy_id', this.currentUser.id)
                .order('created_at', { ascending: false });

            if (error) {
                throw error;
            }

            this.medicines = data || [];
        } catch (error) {
            console.error('خطأ في تحميل الأدوية:', error);
        }
    }

    /**
     * تحديث لوحة التحكم
     */
    updateDashboard() {
        this.updateStats();
        this.updateOrdersList();
        this.updateMedicinesList();
        this.updatePharmacyInfo();
    }

    /**
     * تحديث الإحصائيات
     */
    updateStats() {
        const totalOrders = this.orders.length;
        const pendingOrders = this.orders.filter(order => order.status === 'pending').length;
        const completedOrders = this.orders.filter(order => order.status === 'completed').length;
        const totalRevenue = this.orders
            .filter(order => order.status === 'completed')
            .reduce((sum, order) => sum + (order.total_amount || 0), 0);

        document.getElementById('total-orders').textContent = totalOrders;
        document.getElementById('pending-orders').textContent = pendingOrders;
        document.getElementById('completed-orders').textContent = completedOrders;
        document.getElementById('total-revenue').textContent = totalRevenue.toFixed(2);
    }

    /**
     * تحديث قائمة الطلبات
     */
    updateOrdersList() {
        const ordersList = document.getElementById('orders-list');
        if (!ordersList) return;

        ordersList.innerHTML = '';

        if (this.orders.length === 0) {
            ordersList.innerHTML = '<p class="no-data">لا توجد طلبات حالياً</p>';
            return;
        }

        this.orders.forEach(order => {
            const orderElement = this.createOrderElement(order);
            ordersList.appendChild(orderElement);
        });
    }

    /**
     * إنشاء عنصر الطلب
     */
    createOrderElement(order) {
        const orderDiv = document.createElement('div');
        orderDiv.className = 'order-item';
        orderDiv.innerHTML = `
            <div class="order-header">
                <h4>طلب #${order.id}</h4>
                <span class="order-status status-${order.status}">${this.getStatusText(order.status)}</span>
            </div>
            <div class="order-details">
                <p><strong>العميل:</strong> ${order.customer_name || 'غير محدد'}</p>
                <p><strong>المبلغ:</strong> ${order.total_amount || 0} جنيه</p>
                <p><strong>التاريخ:</strong> ${new Date(order.created_at).toLocaleDateString('ar-EG')}</p>
            </div>
            <div class="order-actions">
                <button class="btn btn-primary" onclick="pharmacyDashboard.viewOrder(${order.id})">عرض</button>
                <button class="btn btn-success" onclick="pharmacyDashboard.acceptOrder(${order.id})">قبول</button>
                <button class="btn btn-danger" onclick="pharmacyDashboard.rejectOrder(${order.id})">رفض</button>
            </div>
        `;
        return orderDiv;
    }

    /**
     * تحديث قائمة الأدوية
     */
    updateMedicinesList() {
        const medicinesList = document.getElementById('medicines-list');
        if (!medicinesList) return;

        medicinesList.innerHTML = '';

        if (this.medicines.length === 0) {
            medicinesList.innerHTML = '<p class="no-data">لا توجد أدوية حالياً</p>';
            return;
        }

        this.medicines.forEach(medicine => {
            const medicineElement = this.createMedicineElement(medicine);
            medicinesList.appendChild(medicineElement);
        });
    }

    /**
     * إنشاء عنصر الدواء
     */
    createMedicineElement(medicine) {
        const medicineDiv = document.createElement('div');
        medicineDiv.className = 'medicine-item';
        medicineDiv.innerHTML = `
            <div class="medicine-header">
                <h4>${medicine.name}</h4>
                <span class="medicine-price">${medicine.price} جنيه</span>
            </div>
            <div class="medicine-details">
                <p>${medicine.description || 'لا يوجد وصف'}</p>
                <p><strong>الفئة:</strong> ${medicine.category || 'غير محدد'}</p>
                <p><strong>الكمية المتاحة:</strong> ${medicine.stock_quantity || 0}</p>
                <p><strong>تاريخ الانتهاء:</strong> ${medicine.expiry_date || 'غير محدد'}</p>
            </div>
            <div class="medicine-actions">
                <button class="btn btn-primary" onclick="pharmacyDashboard.editMedicine(${medicine.id})">تعديل</button>
                <button class="btn btn-danger" onclick="pharmacyDashboard.deleteMedicine(${medicine.id})">حذف</button>
            </div>
        `;
        return medicineDiv;
    }

    /**
     * تحديث معلومات الصيدلية
     */
    updatePharmacyInfo() {
        if (!this.pharmacyData) return;

        document.getElementById('pharmacy-name').textContent = this.pharmacyData.name || 'غير محدد';
        document.getElementById('pharmacy-email').textContent = this.pharmacyData.email || 'غير محدد';
        document.getElementById('pharmacy-phone').textContent = this.pharmacyData.phone || 'غير محدد';
    }

    /**
     * إعداد المستمعين
     */
    setupEventListeners() {
        // زر إضافة دواء جديد
        const addMedicineBtn = document.getElementById('add-medicine');
        if (addMedicineBtn) {
            addMedicineBtn.addEventListener('click', () => this.showAddMedicineForm());
        }

        // زر تحديث البيانات
        const refreshBtn = document.getElementById('refresh-data');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.loadDashboardData());
        }
    }

    /**
     * عرض تفاصيل الطلب
     */
    async viewOrder(orderId) {
        try {
            const { data, error } = await this.supabase
                .from('orders')
                .select('*')
                .eq('id', orderId)
                .single();

            if (error) {
                throw error;
            }

            this.showOrderModal(data);
        } catch (error) {
            console.error('خطأ في عرض الطلب:', error);
            this.showError('خطأ في عرض الطلب');
        }
    }

    /**
     * قبول الطلب
     */
    async acceptOrder(orderId) {
        try {
            const { error } = await this.supabase
                .from('orders')
                .update({
                    status: 'accepted',
                    updated_at: new Date().toISOString()
                })
                .eq('id', orderId);

            if (error) {
                throw error;
            }

            this.showSuccess('تم قبول الطلب بنجاح');
            await this.loadOrders();
            this.updateOrdersList();
        } catch (error) {
            console.error('خطأ في قبول الطلب:', error);
            this.showError('خطأ في قبول الطلب');
        }
    }

    /**
     * رفض الطلب
     */
    async rejectOrder(orderId) {
        try {
            const { error } = await this.supabase
                .from('orders')
                .update({
                    status: 'rejected',
                    updated_at: new Date().toISOString()
                })
                .eq('id', orderId);

            if (error) {
                throw error;
            }

            this.showSuccess('تم رفض الطلب');
            await this.loadOrders();
            this.updateOrdersList();
        } catch (error) {
            console.error('خطأ في رفض الطلب:', error);
            this.showError('خطأ في رفض الطلب');
        }
    }

    /**
     * تعديل الدواء
     */
    editMedicine(medicineId) {
        const medicine = this.medicines.find(medicine => medicine.id === medicineId);
        if (medicine) {
            this.showEditMedicineForm(medicine);
        }
    }

    /**
     * حذف الدواء
     */
    async deleteMedicine(medicineId) {
        if (!confirm('هل أنت متأكد من حذف هذا الدواء؟')) {
            return;
        }

        try {
            const { error } = await this.supabase
                .from('medicines')
                .delete()
                .eq('id', medicineId);

            if (error) {
                throw error;
            }

            this.showSuccess('تم حذف الدواء بنجاح');
            await this.loadMedicines();
            this.updateMedicinesList();
        } catch (error) {
            console.error('خطأ في حذف الدواء:', error);
            this.showError('خطأ في حذف الدواء');
        }
    }

    /**
     * عرض نموذج إضافة دواء جديد
     */
    showAddMedicineForm() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>إضافة دواء جديد</h3>
                    <button class="close-btn" onclick="this.closest('.modal').remove()">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="add-medicine-form">
                        <div class="form-group">
                            <label for="medicine-name">اسم الدواء</label>
                            <input type="text" id="medicine-name" name="name" required>
                        </div>
                        <div class="form-group">
                            <label for="medicine-description">الوصف</label>
                            <textarea id="medicine-description" name="description"></textarea>
                        </div>
                        <div class="form-group">
                            <label for="medicine-price">السعر</label>
                            <input type="number" id="medicine-price" name="price" step="0.01" required>
                        </div>
                        <div class="form-group">
                            <label for="medicine-category">الفئة</label>
                            <select id="medicine-category" name="category">
                                <option value="prescription">وصفة طبية</option>
                                <option value="over_counter">بدون وصفة</option>
                                <option value="supplements">مكملات غذائية</option>
                                <option value="medical_supplies">مستلزمات طبية</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="medicine-stock">الكمية المتاحة</label>
                            <input type="number" id="medicine-stock" name="stock_quantity" min="0" required>
                        </div>
                        <div class="form-group">
                            <label for="medicine-expiry">تاريخ الانتهاء</label>
                            <input type="date" id="medicine-expiry" name="expiry_date">
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
        const form = modal.querySelector('#add-medicine-form');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.addMedicine(new FormData(form));
            modal.remove();
        });
    }

    /**
     * إضافة دواء جديد
     */
    async addMedicine(formData) {
        try {
            const { error } = await this.supabase
                .from('medicines')
                .insert({
                    pharmacy_id: this.currentUser.id,
                    name: formData.get('name'),
                    description: formData.get('description'),
                    price: parseFloat(formData.get('price')),
                    category: formData.get('category'),
                    stock_quantity: parseInt(formData.get('stock_quantity')),
                    expiry_date: formData.get('expiry_date'),
                    created_at: new Date().toISOString()
                });

            if (error) {
                throw error;
            }

            this.showSuccess('تم إضافة الدواء بنجاح');
            await this.loadMedicines();
            this.updateMedicinesList();
        } catch (error) {
            console.error('خطأ في إضافة الدواء:', error);
            this.showError('خطأ في إضافة الدواء');
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
            'processing': 'قيد التحضير',
            'ready': 'جاهز',
            'delivered': 'تم التسليم',
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

// تهيئة لوحة تحكم الصيدلية عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    window.pharmacyDashboard = new PharmacyDashboard();
});
