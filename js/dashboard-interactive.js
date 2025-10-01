/**
 * لوحات التحكم التفاعلية مع الخادم
 * Interactive Dashboard with Server Integration
 */

class InteractiveDashboard {
    constructor() {
        this.supabase = null;
        this.user = null;
        this.role = null;
        this.init();
    }

    /**
     * تهيئة لوحة التحكم التفاعلية
     */
    async init() {
        try {
            // تهيئة Supabase
            await this.initSupabase();
            
            // تحميل بيانات المستخدم
            await this.loadUserData();
            
            // تهيئة الأحداث
            this.setupEventListeners();
            
            // تحميل البيانات الحقيقية
            await this.loadRealData();
            
            console.log('✅ لوحة التحكم التفاعلية جاهزة');
        } catch (error) {
            console.error('❌ خطأ في تهيئة لوحة التحكم:', error);
            this.showError('فشل في تحميل لوحة التحكم');
        }
    }

    /**
     * تهيئة Supabase
     */
    async initSupabase() {
        try {
            const { getSupabase } = await import('./supabase-client.js');
            this.supabase = getSupabase();
            
            // التحقق من حالة المصادقة
            const { data: { user } } = await this.supabase.auth.getUser();
            if (!user) {
                throw new Error('المستخدم غير مسجل الدخول');
            }
            
            this.user = user;
            console.log('✅ تم تهيئة Supabase بنجاح');
        } catch (error) {
            console.error('❌ خطأ في تهيئة Supabase:', error);
            throw error;
        }
    }

    /**
     * تحميل بيانات المستخدم
     */
    async loadUserData() {
        try {
            const { data: profile, error } = await this.supabase
                .from('profiles')
                .select('*')
                .eq('user_id', this.user.id)
                .single();

            if (error) throw error;

            this.role = profile.account;
            this.profile = profile;
            
            // تحديث واجهة المستخدم
            this.updateUserInterface();
            
            console.log('✅ تم تحميل بيانات المستخدم:', this.role);
        } catch (error) {
            console.error('❌ خطأ في تحميل بيانات المستخدم:', error);
            throw error;
        }
    }

    /**
     * تحديث واجهة المستخدم
     */
    updateUserInterface() {
        // تحديث اسم المستخدم
        const userNameElements = document.querySelectorAll('.user-name');
        userNameElements.forEach(el => {
            el.textContent = this.profile.full_name || 'المستخدم';
        });

        // تحديث دور المستخدم
        const userRoleElements = document.querySelectorAll('.user-role');
        userRoleElements.forEach(el => {
            el.textContent = this.getRoleDisplayName(this.role);
        });

        // تحديث صورة المستخدم
        const userAvatarElements = document.querySelectorAll('.user-avatar img');
        if (this.profile.avatar_url) {
            userAvatarElements.forEach(el => {
                el.src = this.profile.avatar_url;
            });
        }
    }

    /**
     * الحصول على اسم الدور المعروض
     */
    getRoleDisplayName(role) {
        const roleNames = {
            'pharmacy': 'صيدلي',
            'restaurant': 'مدير مطعم',
            'supermarket': 'مدير سوبر ماركت',
            'clinic': 'طبيب',
            'courier': 'مندوب توصيل',
            'driver': 'سائق',
            'admin': 'مدير النظام'
        };
        return roleNames[role] || role;
    }

    /**
     * إعداد مستمعي الأحداث
     */
    setupEventListeners() {
        // أزرار تسجيل الخروج
        const logoutBtns = document.querySelectorAll('.logout-btn');
        logoutBtns.forEach(btn => {
            btn.addEventListener('click', () => this.logout());
        });

        // أزرار رفع المستندات
        const uploadBtns = document.querySelectorAll('[onclick*="uploadDocuments"]');
        uploadBtns.forEach(btn => {
            btn.addEventListener('click', () => this.uploadDocuments());
        });

        // أزرار الإجراءات السريعة
        const actionBtns = document.querySelectorAll('.action-btn');
        actionBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = btn.getAttribute('onclick');
                if (action) {
                    this.handleAction(action);
                }
            });
        });

        // النماذج
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit(form);
            });
        });
    }

    /**
     * تحميل البيانات الحقيقية
     */
    async loadRealData() {
        try {
            // تحميل الإحصائيات
            await this.loadStats();
            
            // تحميل المستندات
            await this.loadDocuments();
            
            // تحميل البيانات حسب الدور
            await this.loadRoleSpecificData();
            
            console.log('✅ تم تحميل البيانات الحقيقية');
        } catch (error) {
            console.error('❌ خطأ في تحميل البيانات:', error);
            this.showError('فشل في تحميل البيانات');
        }
    }

    /**
     * تحميل الإحصائيات
     */
    async loadStats() {
        try {
            // إحصائيات المستندات
            const { data: documents, error: docError } = await this.supabase
                .from('documents')
                .select('*')
                .eq('user_id', this.user.id);

            if (docError) throw docError;

            const totalDocs = documents.length;
            const completedDocs = documents.filter(doc => doc.status === 'completed').length;

            // تحديث إحصائيات المستندات
            this.updateStatValue('.stat-card:nth-child(1) .stat-value', `${completedDocs}/${totalDocs}`);
            this.updateStatValue('.stat-card:nth-child(2) .stat-value', completedDocs === totalDocs ? 'مفعل' : 'غير مكتمل');

            // إحصائيات حسب الدور
            await this.loadRoleStats();

        } catch (error) {
            console.error('❌ خطأ في تحميل الإحصائيات:', error);
        }
    }

    /**
     * تحميل إحصائيات الدور
     */
    async loadRoleStats() {
        try {
            switch (this.role) {
                case 'pharmacy':
                    await this.loadPharmacyStats();
                    break;
                case 'restaurant':
                    await this.loadRestaurantStats();
                    break;
                case 'supermarket':
                    await this.loadSupermarketStats();
                    break;
                case 'clinic':
                    await this.loadClinicStats();
                    break;
                case 'courier':
                    await this.loadCourierStats();
                    break;
                case 'driver':
                    await this.loadDriverStats();
                    break;
            }
        } catch (error) {
            console.error('❌ خطأ في تحميل إحصائيات الدور:', error);
        }
    }

    /**
     * تحميل إحصائيات الصيدلية
     */
    async loadPharmacyStats() {
        // إحصائيات الطلبات
        const { data: orders, error: ordersError } = await this.supabase
            .from('pharmacy_requests')
            .select('*')
            .eq('user_id', this.user.id)
            .gte('created_at', new Date().toISOString().split('T')[0]);

        if (!ordersError && orders) {
            this.updateStatValue('.stat-card:nth-child(3) .stat-value', orders.length);
        }

        // إحصائيات الإيرادات
        const totalRevenue = orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
        this.updateStatValue('.stat-card:nth-child(4) .stat-value', `${totalRevenue} ج.م`);
    }

    /**
     * تحميل إحصائيات المطعم
     */
    async loadRestaurantStats() {
        const { data: orders, error: ordersError } = await this.supabase
            .from('restaurant_requests')
            .select('*')
            .eq('user_id', this.user.id)
            .gte('created_at', new Date().toISOString().split('T')[0]);

        if (!ordersError && orders) {
            this.updateStatValue('.stat-card:nth-child(3) .stat-value', orders.length);
            const totalRevenue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
            this.updateStatValue('.stat-card:nth-child(4) .stat-value', `${totalRevenue} ج.م`);
        }
    }

    /**
     * تحميل إحصائيات السوبر ماركت
     */
    async loadSupermarketStats() {
        const { data: orders, error: ordersError } = await this.supabase
            .from('supermarket_requests')
            .select('*')
            .eq('user_id', this.user.id)
            .gte('created_at', new Date().toISOString().split('T')[0]);

        if (!ordersError && orders) {
            this.updateStatValue('.stat-card:nth-child(3) .stat-value', orders.length);
            const totalRevenue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
            this.updateStatValue('.stat-card:nth-child(4) .stat-value', `${totalRevenue} ج.م`);
        }
    }

    /**
     * تحميل إحصائيات العيادة
     */
    async loadClinicStats() {
        const { data: appointments, error: appointmentsError } = await this.supabase
            .from('clinic_requests')
            .select('*')
            .eq('user_id', this.user.id)
            .gte('created_at', new Date().toISOString().split('T')[0]);

        if (!appointmentsError && appointments) {
            this.updateStatValue('.stat-card:nth-child(3) .stat-value', appointments.length);
            const totalRevenue = appointments.reduce((sum, appointment) => sum + (appointment.total_amount || 0), 0);
            this.updateStatValue('.stat-card:nth-child(4) .stat-value', `${totalRevenue} ج.م`);
        }
    }

    /**
     * تحميل إحصائيات مندوب التوصيل
     */
    async loadCourierStats() {
        const { data: deliveries, error: deliveriesError } = await this.supabase
            .from('courier_requests')
            .select('*')
            .eq('user_id', this.user.id)
            .gte('created_at', new Date().toISOString().split('T')[0]);

        if (!deliveriesError && deliveries) {
            this.updateStatValue('.stat-card:nth-child(3) .stat-value', deliveries.length);
            const totalEarnings = deliveries.reduce((sum, delivery) => sum + (delivery.earnings || 0), 0);
            this.updateStatValue('.stat-card:nth-child(4) .stat-value', `${totalEarnings} ج.م`);
        }
    }

    /**
     * تحميل إحصائيات السائق
     */
    async loadDriverStats() {
        const { data: trips, error: tripsError } = await this.supabase
            .from('driver_requests')
            .select('*')
            .eq('user_id', this.user.id)
            .gte('created_at', new Date().toISOString().split('T')[0]);

        if (!tripsError && trips) {
            this.updateStatValue('.stat-card:nth-child(3) .stat-value', trips.length);
            const totalEarnings = trips.reduce((sum, trip) => sum + (trip.earnings || 0), 0);
            this.updateStatValue('.stat-card:nth-child(4) .stat-value', `${totalEarnings} ج.م`);
        }
    }

    /**
     * تحميل المستندات
     */
    async loadDocuments() {
        try {
            const { data: documents, error } = await this.supabase
                .from('documents')
                .select('*')
                .eq('user_id', this.user.id);

            if (error) throw error;

            // تحديث واجهة المستندات
            this.updateDocumentsUI(documents);

        } catch (error) {
            console.error('❌ خطأ في تحميل المستندات:', error);
        }
    }

    /**
     * تحديث واجهة المستندات
     */
    updateDocumentsUI(documents) {
        const container = document.querySelector('.documents-grid');
        if (!container) return;

        container.innerHTML = documents.map(doc => `
            <div class="document-card ${doc.required ? 'required' : 'optional'}">
                <div class="document-header">
                    <h4>${doc.document_name}</h4>
                    <span class="status-badge ${doc.status}">
                        ${doc.status === 'completed' ? 'مكتمل' : 'غير مكتمل'}
                    </span>
                </div>
                <div class="document-info">
                    <p>${doc.required ? 'مطلوب' : 'اختياري'}</p>
                    <p class="file-name">${doc.file_name || 'غير مرفوع'}</p>
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
     * تحميل البيانات الخاصة بالدور
     */
    async loadRoleSpecificData() {
        // يمكن إضافة منطق خاص لكل دور هنا
        console.log(`📊 تحميل بيانات ${this.role}...`);
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
     * معالجة الإجراءات
     */
    handleAction(action) {
        console.log('🎯 معالجة الإجراء:', action);
        
        // يمكن إضافة منطق معالجة الإجراءات هنا
        switch (action) {
            case 'viewDocuments()':
                this.viewDocuments();
                break;
            case 'uploadDocuments()':
                this.uploadDocuments();
                break;
            default:
                console.log('إجراء غير معروف:', action);
        }
    }

    /**
     * عرض المستندات
     */
    viewDocuments() {
        // إظهار قسم المستندات
        const documentsSection = document.getElementById('documents');
        if (documentsSection) {
            documentsSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    /**
     * رفع المستندات
     */
    uploadDocuments() {
        // فتح نافذة رفع المستندات
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*,application/pdf';
        fileInput.multiple = true;
        
        fileInput.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            this.uploadFiles(files);
        });
        
        fileInput.click();
    }

    /**
     * رفع الملفات
     */
    async uploadFiles(files) {
        try {
            for (const file of files) {
                await this.uploadFile(file);
            }
            this.showSuccess('تم رفع الملفات بنجاح');
            await this.loadDocuments(); // إعادة تحميل المستندات
        } catch (error) {
            console.error('❌ خطأ في رفع الملفات:', error);
            this.showError('فشل في رفع الملفات');
        }
    }

    /**
     * رفع ملف واحد
     */
    async uploadFile(file) {
        try {
            // رفع الملف إلى Supabase Storage
            const fileExt = file.name.split('.').pop();
            const fileName = `${this.user.id}/${Date.now()}.${fileExt}`;
            
            const { data, error } = await this.supabase.storage
                .from('kyc_docs')
                .upload(fileName, file);

            if (error) throw error;

            // حفظ معلومات الملف في قاعدة البيانات
            const { error: dbError } = await this.supabase
                .from('documents')
                .insert({
                    user_id: this.user.id,
                    file_name: file.name,
                    file_path: data.path,
                    document_type: 'general',
                    status: 'completed',
                    created_at: new Date().toISOString()
                });

            if (dbError) throw dbError;

            console.log('✅ تم رفع الملف:', file.name);
        } catch (error) {
            console.error('❌ خطأ في رفع الملف:', error);
            throw error;
        }
    }

    /**
     * معالجة إرسال النماذج
     */
    async handleFormSubmit(form) {
        try {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            // حفظ البيانات في قاعدة البيانات
            const { error } = await this.supabase
                .from('profiles')
                .update(data)
                .eq('user_id', this.user.id);

            if (error) throw error;

            this.showSuccess('تم حفظ البيانات بنجاح');
        } catch (error) {
            console.error('❌ خطأ في حفظ البيانات:', error);
            this.showError('فشل في حفظ البيانات');
        }
    }

    /**
     * تسجيل الخروج
     */
    async logout() {
        try {
            const { error } = await this.supabase.auth.signOut();
            if (error) throw error;
            
            // توجيه إلى الصفحة الرئيسية
            window.location.href = '../index.html';
        } catch (error) {
            console.error('❌ خطأ في تسجيل الخروج:', error);
            this.showError('فشل في تسجيل الخروج');
        }
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
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            max-width: 400px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideInRight 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
        `;
        
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        
        notification.style.backgroundColor = colors[type] || colors.info;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 5000);
    }
}

// تصدير الكلاس
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InteractiveDashboard;
} else {
    window.InteractiveDashboard = InteractiveDashboard;
}
