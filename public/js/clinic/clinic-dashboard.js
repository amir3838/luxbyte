// ===============================
// Clinic Dashboard Controller - Luxbyte
// ===============================
import * as api from './api/clinic.js';

class ClinicDashboard {
    constructor() {
        this.cacheElements();
        this.bindEvents();
        this.init();
    }

    cacheElements() {
        this.$overview = document.querySelector('#overview');
        this.$docsGrid = document.querySelector('#documents .documents-grid');
        this.$patientsList = document.querySelector('#patients .patients-list');
        this.$appointmentsList = document.querySelector('#appointments .appointments-list');
        this.$staffList = document.querySelector('#staff .staff-list');
        this.$salesChart = document.getElementById('salesChart');

        // KPI elements
        this.$kpiDocs = this.$overview?.querySelector('.stat-card:nth-child(1) .stat-value');
        this.$kpiActive = this.$overview?.querySelector('.stat-card:nth-child(2) .stat-value');
        this.$kpiPatients = this.$overview?.querySelector('.stat-card:nth-child(3) .stat-value');
        this.$kpiRevenue = this.$overview?.querySelector('.stat-card:nth-child(4) .stat-value');
        this.$kpiAppointments = this.$overview?.querySelector('.stat-card:nth-child(5) .stat-value');
        this.$kpiRooms = this.$overview?.querySelector('.stat-card:nth-child(6) .stat-value');
    }

    bindEvents() {
        // Document upload
        document.querySelector('#documents .btn-primary')?.addEventListener('click', () => this.openUpload());

        // Patient actions
        document.querySelector('#patients .btn-primary')?.addEventListener('click', () => this.openAddPatientModal());

        // Appointment filters
        document.querySelector('#appointments .filter-select')?.addEventListener('change', () => this.refreshAppointments());
    }

    async init() {
        try {
            await this.refreshKpis();
            await this.refreshDocuments();
            await this.refreshPatients();
            await this.refreshAppointments();
            await this.refreshStaff();
            await this.refreshSalesChart();
        } catch (error) {
            console.error('❌ Clinic Dashboard init error:', error);
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
            this.$kpiPatients.textContent = kpis.patients_today;
            this.$kpiRevenue.textContent = DashboardUtils.formatCurrency(kpis.revenue_today);
            this.$kpiAppointments.textContent = kpis.appts_today;
            this.$kpiRooms.textContent = `${kpis.free_rooms}/${kpis.total_rooms}`;

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

    // Patients
    async refreshPatients() {
        if (!this.$patientsList) return;

        this.$patientsList.querySelectorAll('[data-generated]')?.forEach(el => el.remove());

        try {
            const patients = await api.listPatients();
            patients.forEach(patient => {
                const card = this.createPatientCard(patient);
                this.$patientsList.appendChild(card);
            });
        } catch (error) {
            console.error('❌ Patients refresh error:', error);
        }
    }

    createPatientCard(patient) {
        const card = document.createElement('div');
        card.className = 'patient-card';
        card.setAttribute('data-generated', '1');
        card.innerHTML = `
            <h4>${patient.name}</h4>
            <p>الهاتف: ${patient.phone || '-'}</p>
            <p>العمر: ${patient.age || '-'}</p>
            <p>آخر زيارة: ${patient.last_visit ? DashboardUtils.formatDate(patient.last_visit) : '-'}</p>
            <div class="patient-actions">
                <button class="btn btn-sm btn-secondary" data-action="view-records" data-patient-id="${patient.id}">السجلات</button>
                <button class="btn btn-sm btn-primary" data-action="edit-patient" data-patient-id="${patient.id}">تعديل</button>
            </div>
        `;

        card.querySelector('[data-action="view-records"]')?.addEventListener('click', () => this.viewMedicalRecords(patient.id));
        card.querySelector('[data-action="edit-patient"]')?.addEventListener('click', () => this.openEditPatientModal(patient));
        return card;
    }

    // Appointments
    async refreshAppointments() {
        if (!this.$appointmentsList) return;

        this.$appointmentsList.querySelectorAll('[data-generated]')?.forEach(el => el.remove());

        try {
            const status = document.querySelector('#appointments .filter-select')?.value || 'all';
            const appointments = await api.listAppointments({ status });

            appointments.forEach(appointment => {
                const card = this.createAppointmentCard(appointment);
                this.$appointmentsList.appendChild(card);
            });
        } catch (error) {
            console.error('❌ Appointments refresh error:', error);
        }
    }

    createAppointmentCard(appointment) {
        const card = document.createElement('div');
        card.className = `appointment-card status-${appointment.status}`;
        card.setAttribute('data-generated', '1');
        card.innerHTML = `
            <h4>موعد مع: ${appointment.patients?.name || 'غير معروف'}</h4>
            <p>التاريخ: ${DashboardUtils.formatDate(appointment.at)}</p>
            <p>الحالة: <span class="status-badge">${this.getStatusLabel(appointment.status)}</span></p>
            <div class="appointment-actions">
                ${this.getAppointmentActions(appointment)}
            </div>
        `;

        this.bindAppointmentActions(card, appointment);
        return card;
    }

    getStatusLabel(status) {
        const labels = {
            'pending': 'معلق',
            'confirmed': 'مؤكد',
            'in-progress': 'قيد الكشف',
            'completed': 'مكتمل',
            'cancelled': 'ملغي'
        };
        return labels[status] || status;
    }

    getAppointmentActions(appointment) {
        const actions = [];

        if (appointment.status === 'pending') {
            actions.push(`<button class="btn btn-sm btn-primary" data-action="confirm" data-id="${appointment.id}">تأكيد</button>`);
        }
        if (appointment.status === 'confirmed') {
            actions.push(`<button class="btn btn-sm btn-secondary" data-action="start" data-id="${appointment.id}">بدء الكشف</button>`);
        }
        if (appointment.status === 'in-progress') {
            actions.push(`<button class="btn btn-sm btn-success" data-action="complete" data-id="${appointment.id}">إنهاء الكشف</button>`);
        }
        if (appointment.status !== 'completed' && appointment.status !== 'cancelled') {
            actions.push(`<button class="btn btn-sm btn-danger" data-action="cancel" data-id="${appointment.id}">إلغاء</button>`);
        }

        return actions.join('');
    }

    bindAppointmentActions(card, appointment) {
        const statusMap = {
            'confirm': 'confirmed',
            'start': 'in-progress',
            'complete': 'completed',
            'cancel': 'cancelled'
        };

        Object.entries(statusMap).forEach(([action, status]) => {
            const button = card.querySelector(`[data-action="${action}"]`);
            if (button) {
                button.addEventListener('click', async () => {
                    try {
                        await api.updateAppointmentStatus(appointment.id, status);
                        DashboardUtils.showSuccess(`تم تحديث حالة الموعد إلى: ${this.getStatusLabel(status)}`);
                        await this.refreshAppointments();
                        await this.refreshKpis();
                    } catch (error) {
                        DashboardUtils.showError('فشل تحديث حالة الموعد: ' + error.message);
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
    openAddPatientModal() {
        DashboardUtils.showError('نافذة إضافة مريض جديد - قيد التطوير');
    }

    openEditPatientModal(patient) {
        DashboardUtils.showError(`نافذة تعديل المريض: ${patient.name} - قيد التطوير`);
    }

    viewMedicalRecords(patientId) {
        DashboardUtils.showError(`عرض السجلات الطبية للمريض ID: ${patientId} - قيد التطوير`);
    }
}

// Auto-initialize
document.addEventListener('DOMContentLoaded', () => {
    if (!window.clinicDashboard) {
        window.clinicDashboard = new ClinicDashboard();
    }
});