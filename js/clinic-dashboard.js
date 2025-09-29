/**
 * لوحة تحكم العيادة
 * Clinic Dashboard
 */

class ClinicDashboard {
    constructor() {
        this.supabase = null;
        this.currentUser = null;
        this.clinicData = null;
        this.appointments = [];
        this.patients = [];
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

            console.log('تم تهيئة لوحة تحكم العيادة بنجاح');
        } catch (error) {
            console.error('خطأ في تهيئة لوحة تحكم العيادة:', error);
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
            if (user.user_metadata?.activity_type !== 'clinic') {
                throw new Error('هذا الحساب غير مخصص للعيادات');
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
            // تحميل بيانات العيادة
            await this.loadClinicData();

            // تحميل المواعيد
            await this.loadAppointments();

            // تحميل المرضى
            await this.loadPatients();

            // تحديث الواجهة
            this.updateDashboard();
        } catch (error) {
            console.error('خطأ في تحميل البيانات:', error);
            this.showError('خطأ في تحميل البيانات');
        }
    }

    /**
     * تحميل بيانات العيادة
     */
    async loadClinicData() {
        try {
            const { data, error } = await this.supabase
                .from('user_profiles')
                .select('*')
                .eq('id', this.currentUser.id)
                .single();

            if (error) {
                throw error;
            }

            this.clinicData = data;
        } catch (error) {
            console.error('خطأ في تحميل بيانات العيادة:', error);
        }
    }

    /**
     * تحميل المواعيد
     */
    async loadAppointments() {
        try {
            const { data, error } = await this.supabase
                .from('appointments')
                .select('*')
                .eq('clinic_id', this.currentUser.id)
                .order('appointment_date', { ascending: true })
                .limit(10);

            if (error) {
                throw error;
            }

            this.appointments = data || [];
        } catch (error) {
            console.error('خطأ في تحميل المواعيد:', error);
        }
    }

    /**
     * تحميل المرضى
     */
    async loadPatients() {
        try {
            const { data, error } = await this.supabase
                .from('patients')
                .select('*')
                .eq('clinic_id', this.currentUser.id)
                .order('created_at', { ascending: false })
                .limit(10);

            if (error) {
                throw error;
            }

            this.patients = data || [];
        } catch (error) {
            console.error('خطأ في تحميل المرضى:', error);
        }
    }

    /**
     * تحديث لوحة التحكم
     */
    updateDashboard() {
        this.updateStats();
        this.updateAppointmentsList();
        this.updatePatientsList();
        this.updateClinicInfo();
    }

    /**
     * تحديث الإحصائيات
     */
    updateStats() {
        const totalAppointments = this.appointments.length;
        const todayAppointments = this.appointments.filter(apt =>
            new Date(apt.appointment_date).toDateString() === new Date().toDateString()
        ).length;
        const completedAppointments = this.appointments.filter(apt => apt.status === 'completed').length;
        const totalPatients = this.patients.length;

        document.getElementById('total-appointments').textContent = totalAppointments;
        document.getElementById('today-appointments').textContent = todayAppointments;
        document.getElementById('completed-appointments').textContent = completedAppointments;
        document.getElementById('total-patients').textContent = totalPatients;
    }

    /**
     * تحديث قائمة المواعيد
     */
    updateAppointmentsList() {
        const appointmentsList = document.getElementById('appointments-list');
        if (!appointmentsList) return;

        appointmentsList.innerHTML = '';

        if (this.appointments.length === 0) {
            appointmentsList.innerHTML = '<p class="no-data">لا توجد مواعيد حالياً</p>';
            return;
        }

        this.appointments.forEach(appointment => {
            const appointmentElement = this.createAppointmentElement(appointment);
            appointmentsList.appendChild(appointmentElement);
        });
    }

    /**
     * إنشاء عنصر الموعد
     */
    createAppointmentElement(appointment) {
        const appointmentDiv = document.createElement('div');
        appointmentDiv.className = 'appointment-item';
        appointmentDiv.innerHTML = `
            <div class="appointment-header">
                <h4>موعد #${appointment.id}</h4>
                <span class="appointment-status status-${appointment.status}">${this.getStatusText(appointment.status)}</span>
            </div>
            <div class="appointment-details">
                <p><strong>المريض:</strong> ${appointment.patient_name || 'غير محدد'}</p>
                <p><strong>التاريخ:</strong> ${new Date(appointment.appointment_date).toLocaleDateString('ar-EG')}</p>
                <p><strong>الوقت:</strong> ${appointment.appointment_time || 'غير محدد'}</p>
                <p><strong>نوع الموعد:</strong> ${appointment.appointment_type || 'غير محدد'}</p>
            </div>
            <div class="appointment-actions">
                <button class="btn btn-primary" onclick="clinicDashboard.viewAppointment(${appointment.id})">عرض</button>
                <button class="btn btn-success" onclick="clinicDashboard.completeAppointment(${appointment.id})">إكمال</button>
                <button class="btn btn-danger" onclick="clinicDashboard.cancelAppointment(${appointment.id})">إلغاء</button>
            </div>
        `;
        return appointmentDiv;
    }

    /**
     * تحديث قائمة المرضى
     */
    updatePatientsList() {
        const patientsList = document.getElementById('patients-list');
        if (!patientsList) return;

        patientsList.innerHTML = '';

        if (this.patients.length === 0) {
            patientsList.innerHTML = '<p class="no-data">لا توجد مرضى حالياً</p>';
            return;
        }

        this.patients.forEach(patient => {
            const patientElement = this.createPatientElement(patient);
            patientsList.appendChild(patientElement);
        });
    }

    /**
     * إنشاء عنصر المريض
     */
    createPatientElement(patient) {
        const patientDiv = document.createElement('div');
        patientDiv.className = 'patient-item';
        patientDiv.innerHTML = `
            <div class="patient-header">
                <h4>${patient.name}</h4>
                <span class="patient-age">${patient.age || 'غير محدد'} سنة</span>
            </div>
            <div class="patient-details">
                <p><strong>الهاتف:</strong> ${patient.phone || 'غير محدد'}</p>
                <p><strong>البريد الإلكتروني:</strong> ${patient.email || 'غير محدد'}</p>
                <p><strong>التاريخ الطبي:</strong> ${patient.medical_history || 'غير محدد'}</p>
            </div>
            <div class="patient-actions">
                <button class="btn btn-primary" onclick="clinicDashboard.viewPatient(${patient.id})">عرض</button>
                <button class="btn btn-success" onclick="clinicDashboard.editPatient(${patient.id})">تعديل</button>
                <button class="btn btn-info" onclick="clinicDashboard.scheduleAppointment(${patient.id})">حجز موعد</button>
            </div>
        `;
        return patientDiv;
    }

    /**
     * تحديث معلومات العيادة
     */
    updateClinicInfo() {
        if (!this.clinicData) return;

        document.getElementById('clinic-name').textContent = this.clinicData.name || 'غير محدد';
        document.getElementById('clinic-email').textContent = this.clinicData.email || 'غير محدد';
        document.getElementById('clinic-phone').textContent = this.clinicData.phone || 'غير محدد';
    }

    /**
     * إعداد المستمعين
     */
    setupEventListeners() {
        // زر إضافة مريض جديد
        const addPatientBtn = document.getElementById('add-patient');
        if (addPatientBtn) {
            addPatientBtn.addEventListener('click', () => this.showAddPatientForm());
        }

        // زر حجز موعد جديد
        const addAppointmentBtn = document.getElementById('add-appointment');
        if (addAppointmentBtn) {
            addAppointmentBtn.addEventListener('click', () => this.showAddAppointmentForm());
        }

        // زر تحديث البيانات
        const refreshBtn = document.getElementById('refresh-data');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.loadDashboardData());
        }
    }

    /**
     * عرض تفاصيل الموعد
     */
    async viewAppointment(appointmentId) {
        try {
            const { data, error } = await this.supabase
                .from('appointments')
                .select('*')
                .eq('id', appointmentId)
                .single();

            if (error) {
                throw error;
            }

            this.showAppointmentModal(data);
        } catch (error) {
            console.error('خطأ في عرض الموعد:', error);
            this.showError('خطأ في عرض الموعد');
        }
    }

    /**
     * إكمال الموعد
     */
    async completeAppointment(appointmentId) {
        try {
            const { error } = await this.supabase
                .from('appointments')
                .update({
                    status: 'completed',
                    updated_at: new Date().toISOString()
                })
                .eq('id', appointmentId);

            if (error) {
                throw error;
            }

            this.showSuccess('تم إكمال الموعد بنجاح');
            await this.loadAppointments();
            this.updateAppointmentsList();
        } catch (error) {
            console.error('خطأ في إكمال الموعد:', error);
            this.showError('خطأ في إكمال الموعد');
        }
    }

    /**
     * إلغاء الموعد
     */
    async cancelAppointment(appointmentId) {
        try {
            const { error } = await this.supabase
                .from('appointments')
                .update({
                    status: 'cancelled',
                    updated_at: new Date().toISOString()
                })
                .eq('id', appointmentId);

            if (error) {
                throw error;
            }

            this.showSuccess('تم إلغاء الموعد');
            await this.loadAppointments();
            this.updateAppointmentsList();
        } catch (error) {
            console.error('خطأ في إلغاء الموعد:', error);
            this.showError('خطأ في إلغاء الموعد');
        }
    }

    /**
     * عرض المريض
     */
    async viewPatient(patientId) {
        try {
            const { data, error } = await this.supabase
                .from('patients')
                .select('*')
                .eq('id', patientId)
                .single();

            if (error) {
                throw error;
            }

            this.showPatientModal(data);
        } catch (error) {
            console.error('خطأ في عرض المريض:', error);
            this.showError('خطأ في عرض المريض');
        }
    }

    /**
     * تعديل المريض
     */
    editPatient(patientId) {
        const patient = this.patients.find(patient => patient.id === patientId);
        if (patient) {
            this.showEditPatientForm(patient);
        }
    }

    /**
     * حجز موعد
     */
    scheduleAppointment(patientId) {
        const patient = this.patients.find(patient => patient.id === patientId);
        if (patient) {
            this.showAddAppointmentForm(patient);
        }
    }

    /**
     * عرض نموذج إضافة مريض جديد
     */
    showAddPatientForm() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>إضافة مريض جديد</h3>
                    <button class="close-btn" onclick="this.closest('.modal').remove()">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="add-patient-form">
                        <div class="form-group">
                            <label for="patient-name">اسم المريض</label>
                            <input type="text" id="patient-name" name="name" required>
                        </div>
                        <div class="form-group">
                            <label for="patient-age">العمر</label>
                            <input type="number" id="patient-age" name="age" min="0" max="120">
                        </div>
                        <div class="form-group">
                            <label for="patient-phone">رقم الهاتف</label>
                            <input type="tel" id="patient-phone" name="phone">
                        </div>
                        <div class="form-group">
                            <label for="patient-email">البريد الإلكتروني</label>
                            <input type="email" id="patient-email" name="email">
                        </div>
                        <div class="form-group">
                            <label for="patient-history">التاريخ الطبي</label>
                            <textarea id="patient-history" name="medical_history"></textarea>
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
        const form = modal.querySelector('#add-patient-form');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.addPatient(new FormData(form));
            modal.remove();
        });
    }

    /**
     * إضافة مريض جديد
     */
    async addPatient(formData) {
        try {
            const { error } = await this.supabase
                .from('patients')
                .insert({
                    clinic_id: this.currentUser.id,
                    name: formData.get('name'),
                    age: parseInt(formData.get('age')) || null,
                    phone: formData.get('phone'),
                    email: formData.get('email'),
                    medical_history: formData.get('medical_history'),
                    created_at: new Date().toISOString()
                });

            if (error) {
                throw error;
            }

            this.showSuccess('تم إضافة المريض بنجاح');
            await this.loadPatients();
            this.updatePatientsList();
        } catch (error) {
            console.error('خطأ في إضافة المريض:', error);
            this.showError('خطأ في إضافة المريض');
        }
    }

    /**
     * الحصول على نص الحالة
     */
    getStatusText(status) {
        const statusMap = {
            'scheduled': 'مجدول',
            'confirmed': 'مؤكد',
            'in_progress': 'قيد التنفيذ',
            'completed': 'مكتمل',
            'cancelled': 'ملغي',
            'no_show': 'لم يحضر'
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

// تهيئة لوحة تحكم العيادة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    window.clinicDashboard = new ClinicDashboard();
});
