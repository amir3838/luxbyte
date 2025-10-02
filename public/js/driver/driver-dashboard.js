// ===============================
// driver/driver-dashboard.js — wires UI to API
// ===============================
import * as api from './api/driver.js';

export class DriverDashboard {
  constructor() {
    this.cacheEls();
    this.bind();
    this.init();
  }

  cacheEls() {
    this.$overview = document.querySelector('#overview');
    this.$docsGrid = document.querySelector('#documents .documents-grid');
    this.$tripsList = document.querySelector('#trips .trips-list');
    this.$earningsList = document.querySelector('#earnings .earnings-list');
    this.$salesChart = document.getElementById('salesChart');

    // KPI elements
    this.$kpiDocs = this.$overview?.querySelector('.stat-card:nth-child(1) .stat-value');
    this.$kpiActive = this.$overview?.querySelector('.stat-card:nth-child(2) .stat-value');
    this.$kpiTrips = this.$overview?.querySelector('.stat-card:nth-child(3) .stat-value');
    this.$kpiEarnings = this.$overview?.querySelector('.stat-card:nth-child(4) .stat-value');
    this.$kpiRating = this.$overview?.querySelector('.stat-card:nth-child(5) .stat-value');
    this.$kpiOnline = this.$overview?.querySelector('.stat-card:nth-child(6) .stat-value');
  }

  bind() {
    // Document upload
    document.querySelector('#documents .btn-primary')?.addEventListener('click', () => this.openUpload());

    // Trip actions
    document.querySelector('#trips .btn-primary')?.addEventListener('click', () => this.refreshTrips());

    // Online status toggle
    document.querySelector('#overview .btn-primary')?.addEventListener('click', () => this.toggleOnlineStatus());
  }

  async init() {
    try {
      await this.refreshKpis();
      await this.refreshDocuments();
      await this.refreshTrips();
      await this.refreshEarnings();
      await this.refreshSalesChart();
      await this.updateLocation();
    } catch (error) {
      console.error('❌ Driver Dashboard init error:', error);
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
      this.$kpiTrips.textContent = kpis.trips_today;
      this.$kpiEarnings.textContent = DashboardUtils.formatCurrency(kpis.earnings_today);
      this.$kpiRating.textContent = kpis.rating ? `${kpis.rating}/5` : 'غير محدد';
      this.$kpiOnline.textContent = kpis.is_online ? 'متصل' : 'غير متصل';

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

  // Trips
  async refreshTrips() {
    if (!this.$tripsList) return;

    this.$tripsList.querySelectorAll('[data-generated]')?.forEach(el => el.remove());

    try {
      const trips = await api.listTrips();
      trips.forEach(trip => {
        const card = this.createTripCard(trip);
        this.$tripsList.appendChild(card);
      });
    } catch (error) {
      console.error('❌ Trips refresh error:', error);
    }
  }

  createTripCard(trip) {
    const card = document.createElement('div');
    card.className = `trip-card status-${trip.status}`;
    card.setAttribute('data-generated', '1');
    card.innerHTML = `
      <div class="trip-header">
        <h4>رحلة #${trip.id}</h4>
        <span class="status-badge">${this.getStatusLabel(trip.status)}</span>
      </div>
      <div class="trip-info">
        <p>من: ${trip.pickup_address || 'غير محدد'}</p>
        <p>إلى: ${trip.destination_address || 'غير محدد'}</p>
        <p>العميل: ${trip.customer_name || 'غير معروف'}</p>
        <p>الهاتف: ${trip.customer_phone || '-'}</p>
        <p>المبلغ: ${DashboardUtils.formatCurrency(trip.fare)}</p>
        <p>المسافة: ${trip.distance || 'غير محدد'} كم</p>
        <p>المدة: ${trip.duration || 'غير محدد'} دقيقة</p>
        <p>التاريخ: ${DashboardUtils.formatDate(trip.created_at)}</p>
      </div>
      <div class="trip-actions">
        ${this.getTripActions(trip)}
      </div>
    `;

    this.bindTripActions(card, trip);
    return card;
  }

  getStatusLabel(status) {
    const labels = {
      'pending': 'في الانتظار',
      'assigned': 'مُكلف',
      'started': 'بدأت الرحلة',
      'completed': 'مكتملة',
      'cancelled': 'ملغية'
    };
    return labels[status] || status;
  }

  getTripActions(trip) {
    const actions = [];

    if (trip.status === 'assigned') {
      actions.push(`<button class="btn btn-sm btn-primary" data-action="start" data-id="${trip.id}">بدء الرحلة</button>`);
    }
    if (trip.status === 'started') {
      actions.push(`<button class="btn btn-sm btn-success" data-action="complete" data-id="${trip.id}">إنهاء الرحلة</button>`);
    }
    if (trip.status !== 'completed' && trip.status !== 'cancelled') {
      actions.push(`<button class="btn btn-sm btn-danger" data-action="cancel" data-id="${trip.id}">إلغاء</button>`);
    }

    return actions.join('');
  }

  bindTripActions(card, trip) {
    const statusMap = {
      'start': 'started',
      'complete': 'completed',
      'cancel': 'cancelled'
    };

    Object.entries(statusMap).forEach(([action, status]) => {
      const button = card.querySelector(`[data-action="${action}"]`);
      if (button) {
        button.addEventListener('click', async () => {
          try {
            await api.updateTripStatus(trip.id, status);
            DashboardUtils.showSuccess(`تم تحديث حالة الرحلة إلى: ${this.getStatusLabel(status)}`);
            await this.refreshTrips();
            await this.refreshKpis();
          } catch (error) {
            DashboardUtils.showError('فشل تحديث حالة الرحلة: ' + error.message);
          }
        });
      }
    });
  }

  // Earnings
  async refreshEarnings() {
    if (!this.$earningsList) return;

    this.$earningsList.querySelectorAll('[data-generated]')?.forEach(el => el.remove());

    try {
      const earnings = await api.listEarnings();
      earnings.forEach(earning => {
        const card = this.createEarningCard(earning);
        this.$earningsList.appendChild(card);
      });
    } catch (error) {
      console.error('❌ Earnings refresh error:', error);
    }
  }

  createEarningCard(earning) {
    const card = document.createElement('div');
    card.className = 'earning-card';
    card.setAttribute('data-generated', '1');
    card.innerHTML = `
      <div class="earning-header">
        <h4>${earning.type || 'رحلة'}</h4>
        <span class="amount">${DashboardUtils.formatCurrency(earning.amount)}</span>
      </div>
      <div class="earning-info">
        <p>التاريخ: ${DashboardUtils.formatDate(earning.created_at)}</p>
        <p>الحالة: ${earning.status === 'paid' ? 'مدفوع' : 'معلق'}</p>
        ${earning.trip_id ? `<p>رقم الرحلة: #${earning.trip_id}</p>` : ''}
      </div>
    `;
    return card;
  }

  // Sales Chart
  async refreshSalesChart() {
    if (!this.$salesChart) return;

    try {
      const series = await api.getEarningsSeries(14);
      const values = series.map(s => parseFloat(s.amount) || 0);
      DashboardUtils.drawLineChart(this.$salesChart, values);
    } catch (error) {
      console.error('❌ Sales chart refresh error:', error);
    }
  }

  // Online Status
  async toggleOnlineStatus() {
    try {
      const currentStatus = this.$kpiOnline.textContent === 'متصل';
      const newStatus = !currentStatus;

      await api.updateOnlineStatus(newStatus);
      this.$kpiOnline.textContent = newStatus ? 'متصل' : 'غير متصل';

      const button = document.querySelector('#overview .btn-primary');
      if (button) {
        button.textContent = newStatus ? 'تسجيل الخروج' : 'تسجيل الدخول';
        button.className = newStatus ? 'btn btn-danger' : 'btn btn-primary';
      }

      DashboardUtils.showSuccess(`تم ${newStatus ? 'تسجيل الدخول' : 'تسجيل الخروج'} بنجاح`);
    } catch (error) {
      DashboardUtils.showError('فشل تحديث حالة الاتصال: ' + error.message);
    }
  }

  // Location Update
  async updateLocation() {
    if (!navigator.geolocation) {
      console.warn('Geolocation is not supported by this browser');
      return;
    }

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        });
      });

      const { latitude, longitude } = position.coords;
      await api.updateLocation(latitude, longitude);
      console.log('Location updated successfully');
    } catch (error) {
      console.warn('Failed to update location:', error);
    }
  }
}

// Auto-initialize
document.addEventListener('DOMContentLoaded', () => {
  if (!window.driverDashboard) {
    window.driverDashboard = new DriverDashboard();
  }
});
