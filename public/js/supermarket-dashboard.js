/**
 * لوحة تحكم السوبر ماركت
 * Supermarket Dashboard
 */

class SupermarketDashboard {
    constructor() {
        this.supabase = null;
        this.currentUser = null;
        this.supermarketData = null;
        this.orders = [];
        this.products = [];
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

            console.log('تم تهيئة لوحة تحكم السوبر ماركت بنجاح');
        } catch (error) {
            console.error('خطأ في تهيئة لوحة تحكم السوبر ماركت:', error);
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
            if (user.user_metadata?.activity_type !== 'supermarket') {
                throw new Error('هذا الحساب غير مخصص للسوبر ماركت');
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
            // تحميل بيانات السوبر ماركت
            await this.loadSupermarketData();

            // تحميل الطلبات
            await this.loadOrders();

            // تحميل المنتجات
            await this.loadProducts();

            // تحديث الواجهة
            this.updateDashboard();
        } catch (error) {
            console.error('خطأ في تحميل البيانات:', error);
            this.showError('خطأ في تحميل البيانات');
        }
    }

    /**
     * تحميل بيانات السوبر ماركت
     */
    async loadSupermarketData() {
        try {
            const { data, error } = await this.supabase
                .from('user_profiles')
                .select('*')
                .eq('id', this.currentUser.id)
                .single();

            if (error) {
                throw error;
            }

            this.supermarketData = data;
        } catch (error) {
            console.error('خطأ في تحميل بيانات السوبر ماركت:', error);
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
     * تحميل المنتجات
     */
    async loadProducts() {
        try {
            const { data, error } = await this.supabase
                .from('products')
                .select('*')
                .eq('supermarket_id', this.currentUser.id)
                .order('created_at', { ascending: false });

            if (error) {
                throw error;
            }

            this.products = data || [];
        } catch (error) {
            console.error('خطأ في تحميل المنتجات:', error);
        }
    }

    /**
     * تحديث لوحة التحكم
     */
    updateDashboard() {
        this.updateStats();
        this.updateOrdersList();
        this.updateProductsList();
        this.updateSupermarketInfo();
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
                <button class="btn btn-primary" onclick="supermarketDashboard.viewOrder(${order.id})">عرض</button>
                <button class="btn btn-success" onclick="supermarketDashboard.acceptOrder(${order.id})">قبول</button>
                <button class="btn btn-danger" onclick="supermarketDashboard.rejectOrder(${order.id})">رفض</button>
            </div>
        `;
        return orderDiv;
    }

    /**
     * تحديث قائمة المنتجات
     */
    updateProductsList() {
        const productsList = document.getElementById('products-list');
        if (!productsList) return;

        productsList.innerHTML = '';

        if (this.products.length === 0) {
            productsList.innerHTML = '<p class="no-data">لا توجد منتجات حالياً</p>';
            return;
        }

        this.products.forEach(product => {
            const productElement = this.createProductElement(product);
            productsList.appendChild(productElement);
        });
    }

    /**
     * إنشاء عنصر المنتج
     */
    createProductElement(product) {
        const productDiv = document.createElement('div');
        productDiv.className = 'product-item';
        productDiv.innerHTML = `
            <div class="product-header">
                <h4>${product.name}</h4>
                <span class="product-price">${product.price} جنيه</span>
            </div>
            <div class="product-details">
                <p>${product.description || 'لا يوجد وصف'}</p>
                <p><strong>الفئة:</strong> ${product.category || 'غير محدد'}</p>
                <p><strong>الكمية المتاحة:</strong> ${product.stock_quantity || 0}</p>
            </div>
            <div class="product-actions">
                <button class="btn btn-primary" onclick="supermarketDashboard.editProduct(${product.id})">تعديل</button>
                <button class="btn btn-danger" onclick="supermarketDashboard.deleteProduct(${product.id})">حذف</button>
            </div>
        `;
        return productDiv;
    }

    /**
     * تحديث معلومات السوبر ماركت
     */
    updateSupermarketInfo() {
        if (!this.supermarketData) return;

        document.getElementById('supermarket-name').textContent = this.supermarketData.name || 'غير محدد';
        document.getElementById('supermarket-email').textContent = this.supermarketData.email || 'غير محدد';
        document.getElementById('supermarket-phone').textContent = this.supermarketData.phone || 'غير محدد';
    }

    /**
     * إعداد المستمعين
     */
    setupEventListeners() {
        // زر إضافة منتج جديد
        const addProductBtn = document.getElementById('add-product');
        if (addProductBtn) {
            addProductBtn.addEventListener('click', () => this.showAddProductForm());
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
     * تعديل المنتج
     */
    editProduct(productId) {
        const product = this.products.find(product => product.id === productId);
        if (product) {
            this.showEditProductForm(product);
        }
    }

    /**
     * حذف المنتج
     */
    async deleteProduct(productId) {
        if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
            return;
        }

        try {
            const { error } = await this.supabase
                .from('products')
                .delete()
                .eq('id', productId);

            if (error) {
                throw error;
            }

            this.showSuccess('تم حذف المنتج بنجاح');
            await this.loadProducts();
            this.updateProductsList();
        } catch (error) {
            console.error('خطأ في حذف المنتج:', error);
            this.showError('خطأ في حذف المنتج');
        }
    }

    /**
     * عرض نموذج إضافة منتج جديد
     */
    showAddProductForm() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>إضافة منتج جديد</h3>
                    <button class="close-btn" onclick="this.closest('.modal').remove()">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="add-product-form">
                        <div class="form-group">
                            <label for="product-name">اسم المنتج</label>
                            <input type="text" id="product-name" name="name" required>
                        </div>
                        <div class="form-group">
                            <label for="product-description">الوصف</label>
                            <textarea id="product-description" name="description"></textarea>
                        </div>
                        <div class="form-group">
                            <label for="product-price">السعر</label>
                            <input type="number" id="product-price" name="price" step="0.01" required>
                        </div>
                        <div class="form-group">
                            <label for="product-category">الفئة</label>
                            <select id="product-category" name="category">
                                <option value="food">طعام</option>
                                <option value="beverages">مشروبات</option>
                                <option value="household">منتجات منزلية</option>
                                <option value="personal_care">العناية الشخصية</option>
                                <option value="other">أخرى</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="product-stock">الكمية المتاحة</label>
                            <input type="number" id="product-stock" name="stock_quantity" min="0" required>
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
        const form = modal.querySelector('#add-product-form');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.addProduct(new FormData(form));
            modal.remove();
        });
    }

    /**
     * إضافة منتج جديد
     */
    async addProduct(formData) {
        try {
            const { error } = await this.supabase
                .from('products')
                .insert({
                    supermarket_id: this.currentUser.id,
                    name: formData.get('name'),
                    description: formData.get('description'),
                    price: parseFloat(formData.get('price')),
                    category: formData.get('category'),
                    stock_quantity: parseInt(formData.get('stock_quantity')),
                    created_at: new Date().toISOString()
                });

            if (error) {
                throw error;
            }

            this.showSuccess('تم إضافة المنتج بنجاح');
            await this.loadProducts();
            this.updateProductsList();
        } catch (error) {
            console.error('خطأ في إضافة المنتج:', error);
            this.showError('خطأ في إضافة المنتج');
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

// تهيئة لوحة تحكم السوبر ماركت عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    window.supermarketDashboard = new SupermarketDashboard();
});
