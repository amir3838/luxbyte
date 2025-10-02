// ===============================
// supermarket/supermarket-dashboard.js — wires UI to API
// ===============================
import * as api from './api/supermarket.js';

export class SupermarketDashboard {
  constructor() {
    this.cacheEls();
    this.bind();
    this.init();
  }

  cacheEls() {
    this.$overview = document.querySelector('#overview');
    this.$docsGrid = document.querySelector('#documents .documents-grid');
    this.$productsList = document.querySelector('#products .products-list');
    this.$ordersList = document.querySelector('#orders .orders-list');
    this.$staffList = document.querySelector('#staff .staff-list');
    this.$salesChart = document.getElementById('salesChart');

    // KPI elements
    this.$kpiDocs = this.$overview?.querySelector('.stat-card:nth-child(1) .stat-value');
    this.$kpiActive = this.$overview?.querySelector('.stat-card:nth-child(2) .stat-value');
    this.$kpiProducts = this.$overview?.querySelector('.stat-card:nth-child(3) .stat-value');
    this.$kpiRevenue = this.$overview?.querySelector('.stat-card:nth-child(4) .stat-value');
    this.$kpiOrders = this.$overview?.querySelector('.stat-card:nth-child(5) .stat-value');
    this.$kpiStaff = this.$overview?.querySelector('.stat-card:nth-child(6) .stat-value');
  }

  bind() {
    // Document upload
    document.querySelector('#documents .btn-primary')?.addEventListener('click', () => this.openUpload());

    // Product actions
    document.querySelector('#products .btn-primary')?.addEventListener('click', () => this.openAddProductModal());

    // Order filters
    document.querySelector('#orders .filter-select')?.addEventListener('change', () => this.refreshOrders());
  }

  async init() {
    try {
      await this.refreshKpis();
      await this.refreshDocuments();
      await this.refreshProducts();
      await this.refreshOrders();
      await this.refreshStaff();
      await this.refreshSalesChart();
    } catch (error) {
      console.error('❌ Supermarket Dashboard init error:', error);
      DashboardUtils.showError('فشل تحميل لوحة التحكم: ' + error.message);
    }
  }

  // KPIs
  async refreshKpis() {
    try {
      const kpis = await api.getKpis();
      if (!kpis) return;

      this.$kpiDocs.textContent = `${kpis.completed_docs}/${kpis.required_docs}`;
      this.$kpiActive.textContent = kpis.activated ? 'مفعل' : 'غير مفعل';
      this.$kpiProducts.textContent = kpis.products_count;
      this.$kpiRevenue.textContent = DashboardUtils.formatCurrency(kpis.revenue_today);
      this.$kpiOrders.textContent = kpis.orders_today;
      this.$kpiStaff.textContent = kpis.staff_count;

      // Update progress bar
      const progress = this.$overview?.querySelector('.progress-bar');
      if (progress) {
        const percentage = Math.round((kpis.completed_docs / kpis.required_docs) * 100);
        progress.style.width = `${percentage}%`;
      }
    } catch (error) {
      console.warn('⚠️ KPIs refresh warning:', error);
    }
  }

  // Documents
  async refreshDocuments() {
    if (!this.$docsGrid) return;

    this.$docsGrid.querySelectorAll('[data-generated]')?.forEach(el => el.remove());

    try {
      const docs = await api.listDocuments();
      docs.forEach(doc => {
        const card = this.createDocumentCard(doc);
        this.$docsGrid.appendChild(card);
      });
    } catch (error) {
      console.error('❌ Documents refresh error:', error);
    }
  }

  createDocumentCard(doc) {
    const card = document.createElement('div');
    card.className = `document-card ${doc.required ? 'required' : 'optional'}`;
    card.setAttribute('data-generated', '1');
    card.innerHTML = `
      <div class="document-header">
        <h4>${doc.kind}</h4>
        <span class="status-badge completed">مكتمل</span>
      </div>
      <div class="document-info">
        <p>${doc.storage_path.split('/').pop()}</p>
      </div>
      <div class="document-actions">
        ${doc.public_url ? `<a class="btn btn-sm btn-secondary" href="${doc.public_url}" target="_blank">عرض</a>` : ''}
        <button class="btn btn-sm btn-primary" data-action="update" data-kind="${doc.kind}">تحديث</button>
      </div>
    `;

    card.querySelector('[data-action="update"]')?.addEventListener('click', () => this.openUpload(doc.kind));
    return card;
  }

  openUpload(kind = 'misc') {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '*/*';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      try {
        DashboardUtils.showLoading(document.querySelector('#documents .btn-primary'));
        await api.uploadDocument({ file, kind });
        await this.refreshDocuments();
        await this.refreshKpis();
        DashboardUtils.showSuccess('تم رفع الملف بنجاح!');
      } catch (error) {
        DashboardUtils.showError('فشل رفع الملف: ' + error.message);
      } finally {
        DashboardUtils.hideLoading(document.querySelector('#documents .btn-primary'));
      }
    };
    input.click();
  }

  // Products
  async refreshProducts() {
    if (!this.$productsList) return;

    this.$productsList.querySelectorAll('[data-generated]')?.forEach(el => el.remove());

    try {
      const products = await api.listProducts();
      products.forEach(product => {
        const card = this.createProductCard(product);
        this.$productsList.appendChild(card);
      });
    } catch (error) {
      console.error('❌ Products refresh error:', error);
    }
  }

  createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-generated', '1');
    card.innerHTML = `
      <div class="product-image">
        ${product.image_url ? `<img src="${product.image_url}" alt="${product.name}" loading="lazy">` : '<div class="no-image">لا توجد صورة</div>'}
      </div>
      <div class="product-info">
        <h4>${product.name}</h4>
        <p class="description">${product.description || 'لا يوجد وصف'}</p>
        <div class="product-details">
          <span class="price">${DashboardUtils.formatCurrency(product.price)}</span>
          <span class="category">${product.category || 'عام'}</span>
          <span class="stock ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}">${product.stock > 0 ? `متوفر (${product.stock})` : 'نفد المخزون'}</span>
        </div>
      </div>
      <div class="product-actions">
        <button class="btn btn-sm btn-secondary" data-action="view" data-id="${product.id}">عرض</button>
        <button class="btn btn-sm btn-primary" data-action="edit" data-id="${product.id}">تعديل</button>
        <button class="btn btn-sm btn-danger" data-action="delete" data-id="${product.id}">حذف</button>
      </div>
    `;

    this.bindProductActions(card, product);
    return card;
  }

  bindProductActions(card, product) {
    card.querySelector('[data-action="view"]')?.addEventListener('click', () => this.viewProduct(product));
    card.querySelector('[data-action="edit"]')?.addEventListener('click', () => this.openEditProductModal(product));
    card.querySelector('[data-action="delete"]')?.addEventListener('click', () => this.deleteProduct(product.id));
  }

  // Orders
  async refreshOrders() {
    if (!this.$ordersList) return;

    this.$ordersList.querySelectorAll('[data-generated]')?.forEach(el => el.remove());

    try {
      const status = document.querySelector('#orders .filter-select')?.value || 'all';
      const orders = await api.listOrders({ status });

      orders.forEach(order => {
        const card = this.createOrderCard(order);
        this.$ordersList.appendChild(card);
      });
    } catch (error) {
      console.error('❌ Orders refresh error:', error);
    }
  }

  createOrderCard(order) {
    const card = document.createElement('div');
    card.className = `order-card status-${order.status}`;
    card.setAttribute('data-generated', '1');
    card.innerHTML = `
      <div class="order-header">
        <h4>طلب #${order.id}</h4>
        <span class="status-badge">${this.getStatusLabel(order.status)}</span>
      </div>
      <div class="order-info">
        <p>العميل: ${order.customer_name || 'غير معروف'}</p>
        <p>الهاتف: ${order.customer_phone || '-'}</p>
        <p>المجموع: ${DashboardUtils.formatCurrency(order.total)}</p>
        <p>التاريخ: ${DashboardUtils.formatDate(order.created_at)}</p>
      </div>
      <div class="order-items">
        <h5>الطلبات:</h5>
        <ul>
          ${order.items?.map(item => `<li>${item.name} x${item.quantity}</li>`).join('') || '<li>لا توجد عناصر</li>'}
        </ul>
      </div>
      <div class="order-actions">
        ${this.getOrderActions(order)}
      </div>
    `;

    this.bindOrderActions(card, order);
    return card;
  }

  getStatusLabel(status) {
    const labels = {
      'pending': 'في الانتظار',
      'confirmed': 'مؤكد',
      'preparing': 'قيد التحضير',
      'ready': 'جاهز',
      'delivered': 'تم التوصيل',
      'cancelled': 'ملغي'
    };
    return labels[status] || status;
  }

  getOrderActions(order) {
    const actions = [];

    if (order.status === 'pending') {
      actions.push(`<button class="btn btn-sm btn-primary" data-action="confirm" data-id="${order.id}">تأكيد</button>`);
    }
    if (order.status === 'confirmed') {
      actions.push(`<button class="btn btn-sm btn-secondary" data-action="start-preparing" data-id="${order.id}">بدء التحضير</button>`);
    }
    if (order.status === 'preparing') {
      actions.push(`<button class="btn btn-sm btn-success" data-action="ready" data-id="${order.id}">جاهز للتوصيل</button>`);
    }
    if (order.status === 'ready') {
      actions.push(`<button class="btn btn-sm btn-info" data-action="delivered" data-id="${order.id}">تم التوصيل</button>`);
    }
    if (order.status !== 'delivered' && order.status !== 'cancelled') {
      actions.push(`<button class="btn btn-sm btn-danger" data-action="cancel" data-id="${order.id}">إلغاء</button>`);
    }

    return actions.join('');
  }

  bindOrderActions(card, order) {
    const statusMap = {
      'confirm': 'confirmed',
      'start-preparing': 'preparing',
      'ready': 'ready',
      'delivered': 'delivered',
      'cancel': 'cancelled'
    };

    Object.entries(statusMap).forEach(([action, status]) => {
      const button = card.querySelector(`[data-action="${action}"]`);
      if (button) {
        button.addEventListener('click', async () => {
          try {
            await api.updateOrderStatus(order.id, status);
            DashboardUtils.showSuccess(`تم تحديث حالة الطلب إلى: ${this.getStatusLabel(status)}`);
            await this.refreshOrders();
            await this.refreshKpis();
          } catch (error) {
            DashboardUtils.showError('فشل تحديث حالة الطلب: ' + error.message);
          }
        });
      }
    });
  }

  // Staff
  async refreshStaff() {
    if (!this.$staffList) return;

    this.$staffList.querySelectorAll('[data-generated]')?.forEach(el => el.remove());

    try {
      const staff = await api.listStaff();
      staff.forEach(member => {
        const card = this.createStaffCard(member);
        this.$staffList.appendChild(card);
      });
    } catch (error) {
      console.error('❌ Staff refresh error:', error);
    }
  }

  createStaffCard(member) {
    const card = document.createElement('div');
    card.className = 'staff-card';
    card.setAttribute('data-generated', '1');
    card.innerHTML = `
      <h4>${member.name}</h4>
      <p>الوظيفة: ${member.role || '-'}</p>
      <p>الهاتف: ${member.phone || '-'}</p>
      <div class="staff-actions">
        <button class="btn btn-sm btn-secondary">عرض</button>
        <button class="btn btn-sm btn-primary">تعديل</button>
      </div>
    `;
    return card;
  }

  // Sales Chart
  async refreshSalesChart() {
    if (!this.$salesChart) return;

    try {
      const series = await api.getSalesSeries(14);
      const values = series.map(s => parseFloat(s.total) || 0);
      DashboardUtils.drawLineChart(this.$salesChart, values);
    } catch (error) {
      console.error('❌ Sales chart refresh error:', error);
    }
  }

  // Modal functions
  openAddProductModal() {
    DashboardUtils.showError('نافذة إضافة منتج جديد - قيد التطوير');
  }

  openEditProductModal(product) {
    DashboardUtils.showError(`نافذة تعديل المنتج: ${product.name} - قيد التطوير`);
  }

  viewProduct(product) {
    DashboardUtils.showError(`عرض تفاصيل المنتج: ${product.name} - قيد التطوير`);
  }

  async deleteProduct(productId) {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;

    try {
      await api.deleteProduct(productId);
      DashboardUtils.showSuccess('تم حذف المنتج بنجاح');
      await this.refreshProducts();
      await this.refreshKpis();
    } catch (error) {
      DashboardUtils.showError('فشل حذف المنتج: ' + error.message);
    }
  }
}

// Auto-initialize
document.addEventListener('DOMContentLoaded', () => {
  if (!window.supermarketDashboard) {
    window.supermarketDashboard = new SupermarketDashboard();
  }
});
