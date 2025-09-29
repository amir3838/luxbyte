/**
 * لوحة تحكم المطعم
 * Restaurant Dashboard
 */

class RestaurantDashboard {
    constructor() {
        this.supabase = null;
        this.currentUser = null;
        this.restaurantData = null;
        this.orders = [];
        this.menuItems = [];
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

            console.log('تم تهيئة لوحة تحكم المطعم بنجاح');
        } catch (error) {
            console.error('خطأ في تهيئة لوحة تحكم المطعم:', error);
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
            if (user.user_metadata?.activity_type !== 'restaurant') {
                throw new Error('هذا الحساب غير مخصص للمطاعم');
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
            // تحميل بيانات المطعم
            await this.loadRestaurantData();

            // تحميل الطلبات
            await this.loadOrders();

            // تحميل قائمة الطعام
            await this.loadMenuItems();

            // تحديث الواجهة
            this.updateDashboard();
        } catch (error) {
            console.error('خطأ في تحميل البيانات:', error);
            this.showError('خطأ في تحميل البيانات');
        }
    }

    /**
     * تحميل بيانات المطعم
     */
    async loadRestaurantData() {
        try {
            const { data, error } = await this.supabase
                .from('user_profiles')
                .select('*')
                .eq('id', this.currentUser.id)
                .single();

            if (error) {
                throw error;
            }

            this.restaurantData = data;
        } catch (error) {
            console.error('خطأ في تحميل بيانات المطعم:', error);
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
     * تحميل قائمة الطعام
     */
    async loadMenuItems() {
        try {
            const { data, error } = await this.supabase
                .from('menu_items')
                .select('*')
                .eq('restaurant_id', this.currentUser.id)
                .order('created_at', { ascending: false });

            if (error) {
                throw error;
            }

            this.menuItems = data || [];
        } catch (error) {
            console.error('خطأ في تحميل قائمة الطعام:', error);
        }
    }

    /**
     * تحديث لوحة التحكم
     */
    updateDashboard() {
        this.updateStats();
        this.updateOrdersList();
        this.updateMenuList();
        this.updateRestaurantInfo();
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
                <button class="btn btn-primary" onclick="restaurantDashboard.viewOrder(${order.id})">عرض</button>
                <button class="btn btn-success" onclick="restaurantDashboard.acceptOrder(${order.id})">قبول</button>
                <button class="btn btn-danger" onclick="restaurantDashboard.rejectOrder(${order.id})">رفض</button>
            </div>
        `;
        return orderDiv;
    }

    /**
     * تحديث قائمة الطعام
     */
    updateMenuList() {
        const menuList = document.getElementById('menu-list');
        if (!menuList) return;

        menuList.innerHTML = '';

        if (this.menuItems.length === 0) {
            menuList.innerHTML = '<p class="no-data">لا توجد عناصر في القائمة</p>';
            return;
        }

        this.menuItems.forEach(item => {
            const itemElement = this.createMenuItemElement(item);
            menuList.appendChild(itemElement);
        });
    }

    /**
     * إنشاء عنصر قائمة الطعام
     */
    createMenuItemElement(item) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'menu-item';
        itemDiv.innerHTML = `
            <div class="menu-item-header">
                <h4>${item.name}</h4>
                <span class="menu-price">${item.price} جنيه</span>
            </div>
            <div class="menu-item-details">
                <p>${item.description || 'لا يوجد وصف'}</p>
                <p><strong>الفئة:</strong> ${item.category || 'غير محدد'}</p>
            </div>
            <div class="menu-item-actions">
                <button class="btn btn-primary" onclick="restaurantDashboard.editMenuItem(${item.id})">تعديل</button>
                <button class="btn btn-danger" onclick="restaurantDashboard.deleteMenuItem(${item.id})">حذف</button>
            </div>
        `;
        return itemDiv;
    }

    /**
     * تحديث معلومات المطعم
     */
    updateRestaurantInfo() {
        if (!this.restaurantData) return;

        document.getElementById('restaurant-name').textContent = this.restaurantData.name || 'غير محدد';
        document.getElementById('restaurant-email').textContent = this.restaurantData.email || 'غير محدد';
        document.getElementById('restaurant-phone').textContent = this.restaurantData.phone || 'غير محدد';
    }

    /**
     * إعداد المستمعين
     */
    setupEventListeners() {
        // زر إضافة عنصر جديد للقائمة
        const addMenuItemBtn = document.getElementById('add-menu-item');
        if (addMenuItemBtn) {
            addMenuItemBtn.addEventListener('click', () => this.showAddMenuItemForm());
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
     * تعديل عنصر القائمة
     */
    editMenuItem(itemId) {
        const item = this.menuItems.find(item => item.id === itemId);
        if (item) {
            this.showEditMenuItemForm(item);
        }
    }

    /**
     * حذف عنصر القائمة
     */
    async deleteMenuItem(itemId) {
        if (!confirm('هل أنت متأكد من حذف هذا العنصر؟')) {
            return;
        }

        try {
            const { error } = await this.supabase
                .from('menu_items')
                .delete()
                .eq('id', itemId);

            if (error) {
                throw error;
            }

            this.showSuccess('تم حذف العنصر بنجاح');
            await this.loadMenuItems();
            this.updateMenuList();
        } catch (error) {
            console.error('خطأ في حذف العنصر:', error);
            this.showError('خطأ في حذف العنصر');
        }
    }

    /**
     * عرض نموذج إضافة عنصر جديد
     */
    showAddMenuItemForm() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>إضافة عنصر جديد للقائمة</h3>
                    <button class="close-btn" onclick="this.closest('.modal').remove()">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="add-menu-item-form">
                        <div class="form-group">
                            <label for="item-name">اسم العنصر</label>
                            <input type="text" id="item-name" name="name" required>
                        </div>
                        <div class="form-group">
                            <label for="item-description">الوصف</label>
                            <textarea id="item-description" name="description"></textarea>
                        </div>
                        <div class="form-group">
                            <label for="item-price">السعر</label>
                            <input type="number" id="item-price" name="price" step="0.01" required>
                        </div>
                        <div class="form-group">
                            <label for="item-category">الفئة</label>
                            <select id="item-category" name="category">
                                <option value="appetizer">مقبلات</option>
                                <option value="main">أطباق رئيسية</option>
                                <option value="dessert">حلويات</option>
                                <option value="beverage">مشروبات</option>
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
        const form = modal.querySelector('#add-menu-item-form');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.addMenuItem(new FormData(form));
            modal.remove();
        });
    }

    /**
     * إضافة عنصر جديد للقائمة
     */
    async addMenuItem(formData) {
        try {
            const { error } = await this.supabase
                .from('menu_items')
                .insert({
                    restaurant_id: this.currentUser.id,
                    name: formData.get('name'),
                    description: formData.get('description'),
                    price: parseFloat(formData.get('price')),
                    category: formData.get('category'),
                    created_at: new Date().toISOString()
                });

            if (error) {
                throw error;
            }

            this.showSuccess('تم إضافة العنصر بنجاح');
            await this.loadMenuItems();
            this.updateMenuList();
        } catch (error) {
            console.error('خطأ في إضافة العنصر:', error);
            this.showError('خطأ في إضافة العنصر');
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

// تهيئة لوحة تحكم المطعم عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    window.restaurantDashboard = new RestaurantDashboard();
});
