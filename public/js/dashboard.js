/**
 * ملف JavaScript لوحات التحكم
 * Dashboard JavaScript Functions
 */

class DashboardManager {
    constructor() {
        this.currentSection = 'overview';
        this.init();
    }

    /**
     * تهيئة لوحة التحكم
     */
    init() {
        this.setupNavigation();
        this.setupEventListeners();
        this.loadDashboardData();
    }

    /**
     * إعداد التنقل
     */
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetSection = link.getAttribute('href').substring(1);
                this.showSection(targetSection);
            });
        });
    }

    /**
     * إعداد مستمعي الأحداث
     */
    setupEventListeners() {
        // إعداد الأزرار العامة
        this.setupGeneralButtons();
        
        // إعداد النماذج
        this.setupForms();
        
        // إعداد الجداول
        this.setupTables();
    }

    /**
     * إعداد الأزرار العامة
     */
    setupGeneralButtons() {
        // زر تسجيل الخروج
        const logoutBtn = document.querySelector('.logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.logout();
            });
        }

        // أزرار الإجراءات السريعة
        const actionBtns = document.querySelectorAll('.action-btn');
        actionBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = btn.getAttribute('onclick');
                if (action) {
                    eval(action);
                }
            });
        });
    }

    /**
     * إعداد النماذج
     */
    setupForms() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit(form);
            });
        });
    }

    /**
     * إعداد الجداول
     */
    setupTables() {
        // إضافة وظائف للجداول
        const tables = document.querySelectorAll('table');
        tables.forEach(table => {
            this.setupTableFeatures(table);
        });
    }

    /**
     * إعداد ميزات الجداول
     */
    setupTableFeatures(table) {
        // إضافة ترقيم للصفوف
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach((row, index) => {
            if (!row.querySelector('.row-number')) {
                const cell = document.createElement('td');
                cell.className = 'row-number';
                cell.textContent = index + 1;
                row.insertBefore(cell, row.firstChild);
            }
        });

        // إضافة وظائف البحث
        const searchInputs = document.querySelectorAll('.search-input');
        searchInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                this.filterTable(table, e.target.value);
            });
        });
    }

    /**
     * عرض قسم معين
     */
    showSection(sectionId) {
        // إخفاء جميع الأقسام
        const sections = document.querySelectorAll('.dashboard-section');
        sections.forEach(section => {
            section.classList.remove('active');
        });

        // إزالة النشاط من جميع روابط التنقل
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
        });

        // عرض القسم المطلوب
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionId;
        }

        // تفعيل رابط التنقل المقابل
        const targetLink = document.querySelector(`[href="#${sectionId}"]`);
        if (targetLink) {
            targetLink.classList.add('active');
        }

        // تحميل بيانات القسم
        this.loadSectionData(sectionId);
    }

    /**
     * تحميل بيانات القسم
     */
    loadSectionData(sectionId) {
        switch (sectionId) {
            case 'overview':
                this.loadOverviewData();
                break;
            case 'documents':
                this.loadDocumentsData();
                break;
            case 'products':
                this.loadProductsData();
                break;
            case 'orders':
                this.loadOrdersData();
                break;
            case 'customers':
                this.loadCustomersData();
                break;
            case 'reports':
                this.loadReportsData();
                break;
            case 'settings':
                this.loadSettingsData();
                break;
        }
    }

    /**
     * تحميل بيانات النظرة العامة
     */
    loadOverviewData() {
        // تحديث الإحصائيات
        this.updateStats();
        
        // تحميل الإجراءات السريعة
        this.loadQuickActions();
    }

    /**
     * تحديث الإحصائيات
     */
    updateStats() {
        // محاكاة بيانات الإحصائيات
        const stats = {
            documents: { required: 4, completed: 4 },
            orders: { today: 12, yesterday: 9 },
            revenue: { today: 2450, yesterday: 2100 },
            products: { total: 1250, lowStock: 8 },
            customers: { total: 1250, active: 850 }
        };

        // تحديث قيم الإحصائيات
        this.updateStatValue('.stat-card:nth-child(1) .stat-value', `${stats.documents.completed}/${stats.documents.required}`);
        this.updateStatValue('.stat-card:nth-child(2) .stat-value', 'مفعل');
        this.updateStatValue('.stat-card:nth-child(3) .stat-value', stats.orders.today);
        this.updateStatValue('.stat-card:nth-child(4) .stat-value', `${stats.revenue.today} ج.م`);
    }

    /**
     * تحديث قيمة إحصائية
     */
    updateStatValue(selector, value) {
        const element = document.querySelector(selector);
        if (element) {
            element.textContent = value;
        }
    }

    /**
     * تحميل الإجراءات السريعة
     */
    loadQuickActions() {
        // يمكن إضافة منطق خاص هنا
        console.log('تم تحميل الإجراءات السريعة');
    }

    /**
     * تحميل بيانات المستندات
     */
    loadDocumentsData() {
        // محاكاة بيانات المستندات
        const documents = [
            {
                id: 'logo',
                name: 'لوجو الصيدلية',
                status: 'completed',
                fileName: 'pharmacy_logo.png',
                required: true
            },
            {
                id: 'facade',
                name: 'واجهة الصيدلية',
                status: 'completed',
                fileName: 'pharmacy_facade.jpg',
                required: true
            },
            {
                id: 'license',
                name: 'ترخيص مزاولة المهنة',
                status: 'completed',
                fileName: 'pharmacy_practice_license.pdf',
                required: true
            },
            {
                id: 'cr',
                name: 'السجل التجاري',
                status: 'completed',
                fileName: 'pharmacy_cr.pdf',
                required: true
            },
            {
                id: 'interior',
                name: 'لافتة داخلية/كونتر',
                status: 'pending',
                fileName: 'غير مرفوع',
                required: false
            }
        ];

        this.renderDocuments(documents);
    }

    /**
     * عرض المستندات
     */
    renderDocuments(documents) {
        const container = document.querySelector('.documents-grid');
        if (!container) return;

        container.innerHTML = documents.map(doc => `
            <div class="document-card ${doc.required ? 'required' : 'optional'}">
                <div class="document-header">
                    <h4>${doc.name}</h4>
                    <span class="status-badge ${doc.status}">
                        ${doc.status === 'completed' ? 'مكتمل' : 'اختياري'}
                    </span>
                </div>
                <div class="document-info">
                    <p>${doc.required ? 'مطلوب' : 'اختياري'}</p>
                    <p class="file-name">${doc.fileName}</p>
                </div>
                <div class="document-actions">
                    <button class="btn btn-sm btn-secondary" onclick="viewDocument('${doc.id}')">عرض</button>
                    <button class="btn btn-sm btn-primary" onclick="updateDocument('${doc.id}')">
                        ${doc.status === 'completed' ? 'تحديث' : 'رفع'}
                    </button>
                </div>
            </div>
        `).join('');
    }

    /**
     * تحميل بيانات المنتجات
     */
    loadProductsData() {
        // محاكاة بيانات المنتجات
        const products = [
            {
                id: 1,
                name: 'حليب طازج 1 لتر',
                category: 'مشروبات',
                price: 15,
                quantity: 50,
                expiryDate: '2025-10-15',
                image: '../assets/images/products/milk.jpg'
            },
            {
                id: 2,
                name: 'خبز أبيض',
                category: 'أطعمة',
                price: 5,
                quantity: 100,
                expiryDate: '2025-10-10',
                image: '../assets/images/products/bread.jpg'
            }
        ];

        this.renderProducts(products);
    }

    /**
     * عرض المنتجات
     */
    renderProducts(products) {
        const tbody = document.querySelector('.products-table tbody');
        if (!tbody) return;

        tbody.innerHTML = products.map(product => `
            <tr>
                <td><img src="${product.image}" alt="${product.name}" class="product-thumb"></td>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>${product.price} ج.م</td>
                <td>${product.quantity}</td>
                <td>${product.expiryDate}</td>
                <td>
                    <button class="btn btn-sm btn-secondary" onclick="editProduct(${product.id})">تعديل</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteProduct(${product.id})">حذف</button>
                </td>
            </tr>
        `).join('');
    }

    /**
     * تحميل بيانات الطلبات
     */
    loadOrdersData() {
        // محاكاة بيانات الطلبات
        const orders = [
            {
                id: 'ORD-001',
                customer: 'أحمد محمد',
                phone: '01234567890',
                address: 'شارع التحرير، القاهرة',
                products: 'حليب، خبز، بيض',
                total: 45,
                status: 'pending',
                time: 'منذ 5 دقائق'
            },
            {
                id: 'ORD-002',
                customer: 'فاطمة أحمد',
                phone: '01234567891',
                address: 'شارع الهرم، الجيزة',
                products: 'خضروات، فواكه، لحم',
                total: 120,
                status: 'processing',
                time: 'منذ 15 دقيقة'
            }
        ];

        this.renderOrders(orders);
    }

    /**
     * عرض الطلبات
     */
    renderOrders(orders) {
        const container = document.querySelector('.orders-list');
        if (!container) return;

        container.innerHTML = orders.map(order => `
            <div class="order-card">
                <div class="order-header">
                    <span class="order-id">#${order.id}</span>
                    <span class="order-status ${order.status}">
                        ${this.getOrderStatusText(order.status)}
                    </span>
                    <span class="order-time">${order.time}</span>
                </div>
                <div class="order-details">
                    <p><strong>العميل:</strong> ${order.customer}</p>
                    <p><strong>الهاتف:</strong> ${order.phone}</p>
                    <p><strong>العنوان:</strong> ${order.address}</p>
                    <p><strong>المنتجات:</strong> ${order.products}</p>
                    <p><strong>المجموع:</strong> ${order.total} ج.م</p>
                </div>
                <div class="order-actions">
                    ${this.getOrderActions(order.status)}
                </div>
            </div>
        `).join('');
    }

    /**
     * الحصول على نص حالة الطلب
     */
    getOrderStatusText(status) {
        const statusTexts = {
            pending: 'في الانتظار',
            processing: 'قيد التحضير',
            ready: 'جاهز للاستلام',
            delivered: 'تم التوصيل',
            cancelled: 'ملغي'
        };
        return statusTexts[status] || status;
    }

    /**
     * الحصول على أزرار إجراءات الطلب
     */
    getOrderActions(status) {
        switch (status) {
            case 'pending':
                return `
                    <button class="btn btn-sm btn-primary" onclick="acceptOrder('${status}')">قبول</button>
                    <button class="btn btn-sm btn-secondary" onclick="viewOrderDetails('${status}')">عرض التفاصيل</button>
                    <button class="btn btn-sm btn-danger" onclick="rejectOrder('${status}')">رفض</button>
                `;
            case 'processing':
                return `
                    <button class="btn btn-sm btn-success" onclick="markReady('${status}')">جاهز</button>
                    <button class="btn btn-sm btn-secondary" onclick="viewOrderDetails('${status}')">عرض التفاصيل</button>
                `;
            default:
                return `
                    <button class="btn btn-sm btn-secondary" onclick="viewOrderDetails('${status}')">عرض التفاصيل</button>
                `;
        }
    }

    /**
     * تحميل بيانات العملاء
     */
    loadCustomersData() {
        // محاكاة بيانات العملاء
        const customers = [
            {
                id: 1,
                name: 'أحمد محمد',
                phone: '01234567890',
                email: 'ahmed@example.com',
                orders: 25,
                total: 1250,
                lastOrder: '2025-09-28'
            },
            {
                id: 2,
                name: 'فاطمة أحمد',
                phone: '01234567891',
                email: 'fatma@example.com',
                orders: 18,
                total: 890,
                lastOrder: '2025-09-27'
            }
        ];

        this.renderCustomers(customers);
    }

    /**
     * عرض العملاء
     */
    renderCustomers(customers) {
        const tbody = document.querySelector('.customers-table tbody');
        if (!tbody) return;

        tbody.innerHTML = customers.map(customer => `
            <tr>
                <td>${customer.name}</td>
                <td>${customer.phone}</td>
                <td>${customer.email}</td>
                <td>${customer.orders}</td>
                <td>${customer.total} ج.م</td>
                <td>${customer.lastOrder}</td>
                <td>
                    <button class="btn btn-sm btn-secondary" onclick="viewCustomer(${customer.id})">عرض</button>
                    <button class="btn btn-sm btn-primary" onclick="editCustomer(${customer.id})">تعديل</button>
                </td>
            </tr>
        `).join('');
    }

    /**
     * تحميل بيانات التقارير
     */
    loadReportsData() {
        // تحميل الرسوم البيانية
        this.loadCharts();
        
        // تحميل قوائم التقارير
        this.loadReportLists();
    }

    /**
     * تحميل الرسوم البيانية
     */
    loadCharts() {
        // محاكاة تحميل الرسوم البيانية
        const salesChart = document.getElementById('salesChart');
        if (salesChart) {
            // يمكن إضافة مكتبة الرسوم البيانية هنا
            salesChart.innerHTML = '<p>الرسم البياني للمبيعات</p>';
        }
    }

    /**
     * تحميل قوائم التقارير
     */
    loadReportLists() {
        // محاكاة بيانات التقارير
        const topProducts = [
            { name: 'باراسيتامول', quantity: 150 },
            { name: 'أموكسيسيلين', quantity: 75 }
        ];

        this.renderTopProducts(topProducts);
    }

    /**
     * عرض أكثر المنتجات مبيعاً
     */
    renderTopProducts(products) {
        const container = document.querySelector('.report-list');
        if (!container) return;

        container.innerHTML = products.map(product => `
            <div class="report-item">
                <span>${product.name}</span>
                <span>${product.quantity} قطعة</span>
            </div>
        `).join('');
    }

    /**
     * تحميل بيانات الإعدادات
     */
    loadSettingsData() {
        // تحميل الإعدادات الحالية
        this.loadCurrentSettings();
    }

    /**
     * تحميل الإعدادات الحالية
     */
    loadCurrentSettings() {
        // محاكاة تحميل الإعدادات
        const settings = {
            name: 'صيدلية النور',
            address: 'شارع التحرير، القاهرة',
            phone: '01234567890',
            notifications: true,
            expiryReminder: true
        };

        // تطبيق الإعدادات على النموذج
        Object.keys(settings).forEach(key => {
            const input = document.querySelector(`[name="${key}"]`);
            if (input) {
                if (input.type === 'checkbox') {
                    input.checked = settings[key];
                } else {
                    input.value = settings[key];
                }
            }
        });
    }

    /**
     * معالجة إرسال النماذج
     */
    handleFormSubmit(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        console.log('تم إرسال النموذج:', data);
        
        // محاكاة حفظ البيانات
        this.showNotification('تم حفظ البيانات بنجاح', 'success');
    }

    /**
     * تصفية الجداول
     */
    filterTable(table, searchTerm) {
        const rows = table.querySelectorAll('tbody tr');
        const term = searchTerm.toLowerCase();
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            const shouldShow = text.includes(term);
            row.style.display = shouldShow ? '' : 'none';
        });
    }

    /**
     * تحميل بيانات لوحة التحكم
     */
    loadDashboardData() {
        // تحميل البيانات الأولية
        this.loadOverviewData();
    }

    /**
     * تسجيل الخروج
     */
    logout() {
        if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
            // مسح بيانات المستخدم
            localStorage.removeItem('luxbyte_user');
            
            // توجيه إلى الصفحة الرئيسية
            window.location.href = '../index.html';
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
            border-radius: 6px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        
        // تحديد لون الإشعار
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8'
        };
        
        notification.style.backgroundColor = colors[type] || colors.info;
        
        document.body.appendChild(notification);
        
        // إزالة الإشعار بعد 3 ثوان
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// تهيئة لوحة التحكم عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    window.dashboardManager = new DashboardManager();
});

// دوال مساعدة للاستخدام في HTML
function viewDocument(documentId) {
    console.log('عرض المستند:', documentId);
    window.dashboardManager.showNotification('تم فتح المستند', 'info');
}

function updateDocument(documentId) {
    console.log('تحديث المستند:', documentId);
    window.dashboardManager.showNotification('تم فتح نافذة التحديث', 'info');
}

function editProduct(productId) {
    console.log('تعديل المنتج:', productId);
    window.dashboardManager.showNotification('تم فتح نافذة التعديل', 'info');
}

function deleteProduct(productId) {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
        console.log('حذف المنتج:', productId);
        window.dashboardManager.showNotification('تم حذف المنتج', 'success');
    }
}

function acceptOrder(orderId) {
    console.log('قبول الطلب:', orderId);
    window.dashboardManager.showNotification('تم قبول الطلب', 'success');
}

function rejectOrder(orderId) {
    if (confirm('هل أنت متأكد من رفض هذا الطلب؟')) {
        console.log('رفض الطلب:', orderId);
        window.dashboardManager.showNotification('تم رفض الطلب', 'warning');
    }
}

function markReady(orderId) {
    console.log('تحديد الطلب كجاهز:', orderId);
    window.dashboardManager.showNotification('تم تحديد الطلب كجاهز', 'success');
}

function viewOrderDetails(orderId) {
    console.log('عرض تفاصيل الطلب:', orderId);
    window.dashboardManager.showNotification('تم فتح تفاصيل الطلب', 'info');
}

function viewCustomer(customerId) {
    console.log('عرض العميل:', customerId);
    window.dashboardManager.showNotification('تم فتح بيانات العميل', 'info');
}

function editCustomer(customerId) {
    console.log('تعديل العميل:', customerId);
    window.dashboardManager.showNotification('تم فتح نافذة التعديل', 'info');
}

// تصدير الكلاس للاستخدام في الملفات الأخرى
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DashboardManager;
} else {
    window.DashboardManager = DashboardManager;
}
