// ===============================
// pharmacy/pharmacy-dashboard.js — wires UI to API
// ===============================
import * as api from './api/pharmacy.js';

export class PharmacyDashboard {
  constructor() {
    this.cacheEls();
    this.bind();
    this.init();
  }

  cacheEls() {
    this.$overview = document.querySelector('#overview');
    this.$docsGrid = document.querySelector('#documents .documents-grid');
    this.$medicinesTbody = document.querySelector('#medicines tbody');
    this.$ordersList = document.querySelector('#orders .orders-list');
    this.$customersTbody = document.querySelector('#customers tbody');
    this.$salesChart = document.getElementById('salesChart');

    // KPI slots
    this.$kpiDocs = this.$overview?.querySelector('.stat-card:nth-child(1) .stat-value');
    this.$kpiActive = this.$overview?.querySelector('.stat-card:nth-child(2) .stat-value');
    this.$kpiOrders = this.$overview?.querySelector('.stat-card:nth-child(3) .stat-value');
    this.$kpiRevenue = this.$overview?.querySelector('.stat-card:nth-child(4) .stat-value');
    this.$kpiMedicines = this.$overview?.querySelector('.stat-card:nth-child(5) .stat-value');
    this.$kpiLowStock = this.$overview?.querySelector('.stat-card:nth-child(6) .stat-value');

    this.$uploadBtns = this.$overview?.querySelectorAll('button.btn-primary');
  }

  bind() {
    // Uploads
    this.$uploadBtns?.forEach((btn) => btn.addEventListener('click', () => this.openUpload()));
    document.querySelector('#documents .section-actions .btn-primary')?.addEventListener('click', () => this.openUpload());

    // Medicines actions
    document.querySelector('#medicines .section-actions .btn-primary')?.addEventListener('click', () => this.openAddMedicineDialog());

    // Orders header
    document.querySelector('#orders .section-actions .btn-primary')?.addEventListener('click', () => this.refreshOrders());
  }

  async init() {
    try {
      await this.refreshKpis();
      await this.refreshDocuments();
      await this.refreshMedicines();
      await this.refreshOrders();
      await this.refreshCustomers();
      await this.refreshReports();
    } catch (e) {
      console.error('❌ init', e);
    }
  }

  // ---- KPIs
  async refreshKpis() {
    try {
      const k = await api.getKpis();
      if (!k) return;
      this.$kpiDocs.textContent = `${k.docs_completed}/${k.docs_required}`;
      this.$kpiActive.textContent = k.active ? 'مفعل' : 'غير مفعل';
      this.$kpiOrders.textContent = k.orders_today;
      this.$kpiRevenue.textContent = `${Number(k.revenue_today || 0).toLocaleString('ar-EG')} ج.م`;
      this.$kpiMedicines.textContent = k.medicines_total;
      this.$kpiLowStock.textContent = k.medicines_low_stock;
      const progress = this.$overview?.querySelector('.progress-bar');
      if (progress) {
        const pct = Math.round((k.docs_completed / Math.max(1, k.docs_required)) * 100);
        progress.style.width = `${pct}%`;
      }
    } catch (e) {
      console.warn('⚠️ KPIs', e);
    }
  }

  // ---- Documents
  async refreshDocuments() {
    if (!this.$docsGrid) return;
    this.$docsGrid.querySelectorAll('[data-gen="1"]')?.forEach((el) => el.remove());
    try {
      const docs = await api.listDocuments();
      for (const d of docs) {
        const card = document.createElement('div');
        card.className = `document-card ${d.required ? 'required' : 'optional'}`;
        card.setAttribute('data-gen', '1');
        card.innerHTML = `
          <div class="document-header">
            <h4>${d.display_name || d.kind}</h4>
            <span class="status-badge ${d.completed ? 'completed' : 'pending'}">${d.completed ? 'مكتمل' : 'قيد الرفع'}</span>
          </div>
          <div class="document-info">
            <p>${d.mime || ''}</p>
            <p class="file-name">${d.storage_path.split('/').pop()}</p>
          </div>
          <div class="document-actions">
            ${d.public_url ? `<a class="btn btn-sm btn-secondary" href="${d.public_url}" target="_blank">عرض</a>` : ''}
            <button class="btn btn-sm btn-primary" data-action="update">تحديث</button>
          </div>`;
        this.$docsGrid.appendChild(card);
        card.querySelector('[data-action="update"]').addEventListener('click', () => this.openUpload(d.kind));
      }
    } catch (e) {
      console.error('❌ documents', e);
    }
  }

  openUpload(kind = 'misc') {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '*/*';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        await api.uploadDocument({ file, kind });
        await this.refreshDocuments();
        await this.refreshKpis();
      } catch (e) {
        alert('فشل رفع الملف: ' + (e.message || e));
      }
    };
    input.click();
  }

  // ---- Medicines
  async refreshMedicines() {
    if (!this.$medicinesTbody) return;
    try {
      const rows = await api.listMedicines();
      this.$medicinesTbody.innerHTML = '';
      for (const r of rows) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${r.name}</td>
          <td>${r.category || '-'}</td>
          <td>${r.stock_quantity || 0}</td>
          <td>${Number(r.price || 0).toLocaleString('ar-EG')} ج.م</td>
          <td>${r.expiry_date || '-'}</td>
          <td>
            <button class="btn btn-sm btn-secondary" data-act="edit">تعديل</button>
            <button class="btn btn-sm btn-danger" data-act="del">حذف</button>
          </td>`;
        this.$medicinesTbody.appendChild(tr);
        tr.querySelector('[data-act="edit"]').addEventListener('click', () => this.openEditMedicineDialog(r));
        tr.querySelector('[data-act="del"]').addEventListener('click', async () => {
          if (confirm('حذف هذا الدواء؟')) {
            await api.deleteMedicine(r.id);
            this.refreshMedicines();
          }
        });
      }
    } catch (e) {
      console.error('❌ medicines', e);
    }
  }

  openAddMedicineDialog() {
    this.openEditMedicineDialog({});
  }

  openEditMedicineDialog(row) {
    const name = prompt('اسم الدواء', row.name || '');
    if (name === null) return;
    const category = prompt('الفئة', row.category || '');
    if (category === null) return;
    const stock_quantity = Number(prompt('الكمية المتاحة', row.stock_quantity ?? 0));
    if (Number.isNaN(stock_quantity)) return;
    const price = Number(prompt('السعر', row.price ?? 0));
    if (Number.isNaN(price)) return;
    const expiry_date = prompt('تاريخ الانتهاء (YYYY-MM-DD)', row.expiry_date || '');
    if (expiry_date === null) return;
    api.upsertMedicine({ id: row.id, name, category, stock_quantity, price, expiry_date }).then(() => this.refreshMedicines());
  }

  // ---- Orders
  async refreshOrders() {
    if (!this.$ordersList) return;
    try {
      const statusSel = document.querySelector('#orders .filter-select');
      const status = statusSel?.value || 'all';
      const list = await api.listOrders({ status });
      this.$ordersList.querySelectorAll('.order-card[data-gen="1"]')?.forEach((el) => el.remove());
      for (const o of list) {
        const card = document.createElement('div');
        card.className = 'order-card';
        card.setAttribute('data-gen', '1');
        card.innerHTML = `
          <div class="order-header">
            <span class="order-id">#ORD-${String(o.id).padStart(3, '0')}</span>
            <span class="order-status ${o.status}">${statusLabel(o.status)}</span>
          </div>
          <div class="order-details">
            <p><strong>العميل:</strong> ${o.customer?.name || o.customer_name || '-'}</p>
            <p><strong>الهاتف:</strong> ${o.customer?.phone || o.phone || '-'}</p>
            <p><strong>العنوان:</strong> ${o.delivery_address || '-'}</p>
            <p><strong>المجموع:</strong> ${Number(o.total_amount || 0).toLocaleString('ar-EG')} ج.م</p>
          </div>
          <div class="order-actions">
            ${o.status === 'pending' ? '<button class="btn btn-sm btn-primary" data-act="process">معالجة</button>' : ''}
            ${o.status === 'processing' ? '<button class="btn btn-sm btn-secondary" data-act="ready">جاهز</button>' : ''}
            ${o.status === 'ready' ? '<button class="btn btn-sm btn-success" data-act="completed">مكتمل</button>' : ''}
            ${o.status === 'pending' ? '<button class="btn btn-sm btn-danger" data-act="cancel">إلغاء</button>' : ''}
          </div>`;
        this.$ordersList.prepend(card);
        card.querySelector('[data-act="process"]')?.addEventListener('click', async () => {
          await api.updateOrderStatus(o.id, 'processing');
          this.refreshOrders();
          this.refreshKpis();
        });
        card.querySelector('[data-act="ready"]')?.addEventListener('click', async () => {
          await api.updateOrderStatus(o.id, 'ready');
          this.refreshOrders();
        });
        card.querySelector('[data-act="completed"]')?.addEventListener('click', async () => {
          await api.updateOrderStatus(o.id, 'completed');
          this.refreshOrders();
          this.refreshKpis();
        });
        card.querySelector('[data-act="cancel"]')?.addEventListener('click', async () => {
          await api.updateOrderStatus(o.id, 'cancelled');
          this.refreshOrders();
        });
      }
    } catch (e) {
      console.error('❌ orders', e);
    }
  }

  // ---- Customers
  async refreshCustomers() {
    if (!this.$customersTbody) return;
    try {
      const rows = await api.listCustomers();
      this.$customersTbody.innerHTML = '';
      for (const r of rows) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${r.name}</td>
          <td>${r.phone || '-'}</td>
          <td>${r.email || '-'}</td>
          <td>${r.address || '-'}</td>
          <td>
            <button class="btn btn-sm btn-secondary" data-act="edit">تعديل</button>
            <button class="btn btn-sm btn-primary" data-act="view">عرض</button>
          </td>`;
        this.$customersTbody.appendChild(tr);
      }
    } catch (e) {
      console.error('❌ customers', e);
    }
  }

  // ---- Reports
  async refreshReports() {
    try {
      const series = await api.getSalesSeries();
      this.drawLineChart(this.$salesChart, series.map(x => x.amount));
    } catch (e) {
      console.error('❌ reports', e);
    }
  }

  drawLineChart(canvas, values) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = (canvas.width = canvas.parentElement.clientWidth);
    const h = (canvas.height = 200);
    const max = Math.max(1, ...values);
    ctx.clearRect(0, 0, w, h);
    ctx.beginPath();
    values.forEach((v, i) => {
      const x = 10 + (i / Math.max(1, values.length - 1)) * (w - 20);
      const y = h - (v / max) * (h - 20);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  }
}

function statusLabel(s) {
  return s === 'pending' ? 'في الانتظار' : s === 'processing' ? 'قيد المعالجة' : s === 'ready' ? 'جاهز' : s === 'completed' ? 'مكتمل' : s === 'cancelled' ? 'ملغي' : s;
}

// Auto-init
if (!window.pharmacyDashboard) window.pharmacyDashboard = new PharmacyDashboard();
