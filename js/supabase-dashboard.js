/**
 * تكامل Supabase للوحات التحكم
 * Supabase Integration for Dashboards
 */

class SupabaseDashboard {
    constructor() {
        this.supabase = null;
        this.currentUser = null;
        this.userType = null;
        this.init();
    }

    /**
     * تهيئة Supabase
     */
    async init() {
        try {
            // تحميل Supabase من CDN
            if (typeof window !== 'undefined' && window.supabase) {
                this.supabase = window.supabase;
            } else {
                // تحميل Supabase من CDN
                await this.loadSupabase();
            }

            // تهيئة العميل
            this.supabase = window.supabase.createClient(
                window.SUPABASE_CONFIG?.url || 'YOUR_SUPABASE_URL',
                window.SUPABASE_CONFIG?.anonKey || 'YOUR_SUPABASE_ANON_KEY'
            );

            // التحقق من حالة المصادقة
            await this.checkAuthStatus();

            console.log('تم تهيئة Supabase للوحات التحكم بنجاح');
        } catch (error) {
            console.error('خطأ في تهيئة Supabase:', error);
        }
    }

    /**
     * تحميل Supabase من CDN
     */
    async loadSupabase() {
        return new Promise((resolve, reject) => {
            if (window.supabase) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('فشل في تحميل Supabase'));
            document.head.appendChild(script);
        });
    }

    /**
     * التحقق من حالة المصادقة
     */
    async checkAuthStatus() {
        try {
            const { data: { user }, error } = await this.supabase.auth.getUser();

            if (error) {
                console.error('خطأ في التحقق من المصادقة:', error);
                return;
            }

            if (user) {
                this.currentUser = user;
                this.userType = user.user_metadata?.activity_type;
                console.log('المستخدم مصادق عليه:', user.email);
            }
        } catch (error) {
            console.error('خطأ في التحقق من حالة المصادقة:', error);
        }
    }

    /**
     * تسجيل الدخول
     */
    async signIn(email, password) {
        try {
            const { data, error } = await this.supabase.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) {
                throw error;
            }

            this.currentUser = data.user;
            this.userType = data.user.user_metadata?.activity_type;

            return {
                success: true,
                user: data.user,
                message: 'تم تسجيل الدخول بنجاح'
            };
        } catch (error) {
            console.error('خطأ في تسجيل الدخول:', error);
            return {
                success: false,
                message: error.message || 'خطأ في تسجيل الدخول'
            };
        }
    }

    /**
     * إنشاء حساب جديد
     */
    async signUp(userData) {
        try {
            const { data, error } = await this.supabase.auth.signUp({
                email: userData.email,
                password: userData.password,
                options: {
                    data: {
                        name: userData.name,
                        phone: userData.phone,
                        activity_type: userData.activity_type
                    }
                }
            });

            if (error) {
                throw error;
            }

            // إنشاء ملف تعريف المستخدم
            if (data.user) {
                await this.createUserProfile(data.user, userData);
            }

            return {
                success: true,
                user: data.user,
                message: 'تم إنشاء الحساب بنجاح'
            };
        } catch (error) {
            console.error('خطأ في إنشاء الحساب:', error);
            return {
                success: false,
                message: error.message || 'خطأ في إنشاء الحساب'
            };
        }
    }

    /**
     * إنشاء ملف تعريف المستخدم
     */
    async createUserProfile(user, userData) {
        try {
            const { error } = await this.supabase
                .from('user_profiles')
                .insert({
                    id: user.id,
                    name: userData.name,
                    email: userData.email,
                    phone: userData.phone,
                    activity_type: userData.activity_type,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                });

            if (error) {
                console.error('خطأ في إنشاء ملف تعريف المستخدم:', error);
            }
        } catch (error) {
            console.error('خطأ في إنشاء ملف تعريف المستخدم:', error);
        }
    }

    /**
     * تسجيل الخروج
     */
    async signOut() {
        try {
            const { error } = await this.supabase.auth.signOut();

            if (error) {
                throw error;
            }

            this.currentUser = null;
            this.userType = null;

            return {
                success: true,
                message: 'تم تسجيل الخروج بنجاح'
            };
        } catch (error) {
            console.error('خطأ في تسجيل الخروج:', error);
            return {
                success: false,
                message: error.message || 'خطأ في تسجيل الخروج'
            };
        }
    }

    /**
     * الحصول على بيانات المستخدم
     */
    async getUserProfile() {
        try {
            if (!this.currentUser) {
                throw new Error('المستخدم غير مصادق عليه');
            }

            const { data, error } = await this.supabase
                .from('user_profiles')
                .select('*')
                .eq('id', this.currentUser.id)
                .single();

            if (error) {
                throw error;
            }

            return {
                success: true,
                profile: data
            };
        } catch (error) {
            console.error('خطأ في الحصول على بيانات المستخدم:', error);
            return {
                success: false,
                message: error.message || 'خطأ في الحصول على بيانات المستخدم'
            };
        }
    }

    /**
     * تحديث بيانات المستخدم
     */
    async updateUserProfile(updates) {
        try {
            if (!this.currentUser) {
                throw new Error('المستخدم غير مصادق عليه');
            }

            const { data, error } = await this.supabase
                .from('user_profiles')
                .update({
                    ...updates,
                    updated_at: new Date().toISOString()
                })
                .eq('id', this.currentUser.id)
                .select()
                .single();

            if (error) {
                throw error;
            }

            return {
                success: true,
                profile: data
            };
        } catch (error) {
            console.error('خطأ في تحديث بيانات المستخدم:', error);
            return {
                success: false,
                message: error.message || 'خطأ في تحديث بيانات المستخدم'
            };
        }
    }

    /**
     * الحصول على الطلبات
     */
    async getOrders(filters = {}) {
        try {
            if (!this.currentUser) {
                throw new Error('المستخدم غير مصادق عليه');
            }

            let query = this.supabase
                .from('orders')
                .select('*')
                .eq('user_id', this.currentUser.id);

            // تطبيق المرشحات
            if (filters.status) {
                query = query.eq('status', filters.status);
            }

            if (filters.date_from) {
                query = query.gte('created_at', filters.date_from);
            }

            if (filters.date_to) {
                query = query.lte('created_at', filters.date_to);
            }

            const { data, error } = await query.order('created_at', { ascending: false });

            if (error) {
                throw error;
            }

            return {
                success: true,
                orders: data
            };
        } catch (error) {
            console.error('خطأ في الحصول على الطلبات:', error);
            return {
                success: false,
                message: error.message || 'خطأ في الحصول على الطلبات'
            };
        }
    }

    /**
     * إنشاء طلب جديد
     */
    async createOrder(orderData) {
        try {
            if (!this.currentUser) {
                throw new Error('المستخدم غير مصادق عليه');
            }

            const { data, error } = await this.supabase
                .from('orders')
                .insert({
                    user_id: this.currentUser.id,
                    order_type: orderData.order_type,
                    status: 'pending',
                    total_amount: orderData.total_amount,
                    items: orderData.items,
                    delivery_address: orderData.delivery_address,
                    notes: orderData.notes,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                })
                .select()
                .single();

            if (error) {
                throw error;
            }

            return {
                success: true,
                order: data
            };
        } catch (error) {
            console.error('خطأ في إنشاء الطلب:', error);
            return {
                success: false,
                message: error.message || 'خطأ في إنشاء الطلب'
            };
        }
    }

    /**
     * تحديث حالة الطلب
     */
    async updateOrderStatus(orderId, status) {
        try {
            if (!this.currentUser) {
                throw new Error('المستخدم غير مصادق عليه');
            }

            const { data, error } = await this.supabase
                .from('orders')
                .update({
                    status: status,
                    updated_at: new Date().toISOString()
                })
                .eq('id', orderId)
                .eq('user_id', this.currentUser.id)
                .select()
                .single();

            if (error) {
                throw error;
            }

            return {
                success: true,
                order: data
            };
        } catch (error) {
            console.error('خطأ في تحديث حالة الطلب:', error);
            return {
                success: false,
                message: error.message || 'خطأ في تحديث حالة الطلب'
            };
        }
    }

    /**
     * الحصول على الملفات المرفوعة
     */
    async getUploadedFiles() {
        try {
            if (!this.currentUser) {
                throw new Error('المستخدم غير مصادق عليه');
            }

            const { data, error } = await this.supabase
                .from('uploaded_files')
                .select('*')
                .eq('user_id', this.currentUser.id)
                .order('created_at', { ascending: false });

            if (error) {
                throw error;
            }

            return {
                success: true,
                files: data
            };
        } catch (error) {
            console.error('خطأ في الحصول على الملفات:', error);
            return {
                success: false,
                message: error.message || 'خطأ في الحصول على الملفات'
            };
        }
    }

    /**
     * رفع ملف
     */
    async uploadFile(file, documentType, requestId) {
        try {
            if (!this.currentUser) {
                throw new Error('المستخدم غير مصادق عليه');
            }

            // رفع الملف إلى Supabase Storage
            const fileExt = file.name.split('.').pop();
            const fileName = `${this.currentUser.id}/${requestId}/${Date.now()}.${fileExt}`;

            const { data: uploadData, error: uploadError } = await this.supabase.storage
                .from('documents')
                .upload(fileName, file);

            if (uploadError) {
                throw uploadError;
            }

            // حفظ معلومات الملف في قاعدة البيانات
            const { data, error } = await this.supabase
                .from('uploaded_files')
                .insert({
                    user_id: this.currentUser.id,
                    request_id: requestId,
                    file_name: file.name,
                    file_path: uploadData.path,
                    file_type: documentType,
                    file_size: file.size,
                    mime_type: file.type,
                    created_at: new Date().toISOString()
                })
                .select()
                .single();

            if (error) {
                throw error;
            }

            return {
                success: true,
                file: data
            };
        } catch (error) {
            console.error('خطأ في رفع الملف:', error);
            return {
                success: false,
                message: error.message || 'خطأ في رفع الملف'
            };
        }
    }

    /**
     * حذف ملف
     */
    async deleteFile(fileId) {
        try {
            if (!this.currentUser) {
                throw new Error('المستخدم غير مصادق عليه');
            }

            // الحصول على معلومات الملف
            const { data: fileData, error: fetchError } = await this.supabase
                .from('uploaded_files')
                .select('*')
                .eq('id', fileId)
                .eq('user_id', this.currentUser.id)
                .single();

            if (fetchError) {
                throw fetchError;
            }

            // حذف الملف من Storage
            const { error: deleteError } = await this.supabase.storage
                .from('documents')
                .remove([fileData.file_path]);

            if (deleteError) {
                console.warn('خطأ في حذف الملف من Storage:', deleteError);
            }

            // حذف سجل الملف من قاعدة البيانات
            const { error } = await this.supabase
                .from('uploaded_files')
                .delete()
                .eq('id', fileId)
                .eq('user_id', this.currentUser.id);

            if (error) {
                throw error;
            }

            return {
                success: true,
                message: 'تم حذف الملف بنجاح'
            };
        } catch (error) {
            console.error('خطأ في حذف الملف:', error);
            return {
                success: false,
                message: error.message || 'خطأ في حذف الملف'
            };
        }
    }

    /**
     * الحصول على إحصائيات لوحة التحكم
     */
    async getDashboardStats() {
        try {
            if (!this.currentUser) {
                throw new Error('المستخدم غير مصادق عليه');
            }

            const userId = this.currentUser.id;

            // الحصول على عدد الطلبات
            const { count: ordersCount } = await this.supabase
                .from('orders')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', userId);

            // الحصول على عدد الملفات المرفوعة
            const { count: filesCount } = await this.supabase
                .from('uploaded_files')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', userId);

            // الحصول على الطلبات النشطة
            const { count: activeOrdersCount } = await this.supabase
                .from('orders')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', userId)
                .in('status', ['pending', 'processing', 'shipped']);

            return {
                success: true,
                stats: {
                    totalOrders: ordersCount || 0,
                    totalFiles: filesCount || 0,
                    activeOrders: activeOrdersCount || 0
                }
            };
        } catch (error) {
            console.error('خطأ في الحصول على الإحصائيات:', error);
            return {
                success: false,
                message: error.message || 'خطأ في الحصول على الإحصائيات'
            };
        }
    }
}

// تهيئة Supabase Dashboard عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    window.supabaseDashboard = new SupabaseDashboard();
});

// تصدير الكلاس للاستخدام في الملفات الأخرى
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SupabaseDashboard;
} else {
    window.SupabaseDashboard = SupabaseDashboard;
}
