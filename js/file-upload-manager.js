/**
 * مدير رفع الملفات والمستندات - مشروع Luxbyte
 * File Upload Manager for Luxbyte Project
 *
 * يدير رفع الملفات المطلوبة لكل نشاط مع التحقق من الصيغ والأحجام
 * Manages file uploads for each activity with format and size validation
 */

class FileUploadManager {
    constructor(supabaseClient) {
        this.supabase = supabaseClient;
        this.maxFileSize = 5 * 1024 * 1024; // 5MB
        this.allowedImageFormats = ['jpg', 'jpeg', 'png'];
        this.allowedDocumentFormats = ['pdf', 'jpg', 'jpeg'];
        this.uploadProgress = new Map();
    }

    /**
     * الحصول على أنواع الأنشطة المتاحة
     * Get available activity types
     */
    async getActivityTypes() {
        try {
            const { data, error } = await this.supabase
                .from('activity_types')
                .select('*')
                .eq('is_active', true)
                .order('name_ar');

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('خطأ في جلب أنواع الأنشطة:', error);
            throw error;
        }
    }

    /**
     * الحصول على أنواع المستندات المطلوبة لنشاط معين
     * Get required document types for specific activity
     */
    async getDocumentTypes(activityTypeId) {
        try {
            const { data, error } = await this.supabase
                .from('document_types')
                .select('*')
                .eq('activity_type_id', activityTypeId)
                .order('is_required', { ascending: false });

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('خطأ في جلب أنواع المستندات:', error);
            throw error;
        }
    }

    /**
     * إنشاء طلب تسجيل جديد
     * Create new registration request
     */
    async createRegistrationRequest(activityTypeId, additionalNotes = '') {
        try {
            const { data: { user } } = await this.supabase.auth.getUser();
            if (!user) throw new Error('يجب تسجيل الدخول أولاً');

            const { data, error } = await this.supabase
                .from('registration_requests')
                .insert({
                    user_id: user.id,
                    activity_type_id: activityTypeId,
                    additional_notes: additionalNotes
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('خطأ في إنشاء طلب التسجيل:', error);
            throw error;
        }
    }

    /**
     * التحقق من صحة الملف قبل الرفع
     * Validate file before upload
     */
    validateFile(file, documentType) {
        const errors = [];

        // التحقق من وجود الملف
        if (!file) {
            errors.push('لم يتم اختيار ملف');
            return { isValid: false, errors };
        }

        // التحقق من حجم الملف
        if (file.size > documentType.max_file_size_mb * 1024 * 1024) {
            errors.push(`حجم الملف يجب أن يكون أقل من ${documentType.max_file_size_mb} ميجابايت`);
        }

        // التحقق من صيغة الملف
        const fileExtension = file.name.split('.').pop().toLowerCase();
        if (!documentType.file_formats.includes(fileExtension)) {
            errors.push(`صيغة الملف غير مدعومة. الصيغ المسموحة: ${documentType.file_formats.join(', ')}`);
        }

        // التحقق من نوع MIME
        const allowedMimeTypes = this.getAllowedMimeTypes(documentType.file_formats);
        if (!allowedMimeTypes.includes(file.type)) {
            errors.push('نوع الملف غير صحيح');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * الحصول على أنواع MIME المسموحة
     * Get allowed MIME types
     */
    getAllowedMimeTypes(formats) {
        const mimeTypes = {
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'pdf': 'application/pdf'
        };

        return formats.map(format => mimeTypes[format]).filter(Boolean);
    }

    /**
     * إنشاء اسم ملف فريد
     * Generate unique filename
     */
    generateUniqueFilename(originalName, userId) {
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 8);
        const extension = originalName.split('.').pop();
        return `${timestamp}_${randomString}_${userId}.${extension}`;
    }

    /**
     * رفع ملف واحد
     * Upload single file
     */
    async uploadFile(file, documentType, requestId, userId) {
        try {
            // التحقق من صحة الملف
            const validation = this.validateFile(file, documentType);
            if (!validation.isValid) {
                throw new Error(`خطأ في التحقق من الملف: ${validation.errors.join(', ')}`);
            }

            // إنشاء اسم ملف فريد
            const uniqueFilename = this.generateUniqueFilename(file.name, userId);

            // إنشاء مسار التخزين
            const storagePath = documentType.storage_path_template
                .replace('{uid}', userId)
                .replace('{request_id}', requestId);

            const fullPath = `${storagePath}${uniqueFilename}`;

            // رفع الملف إلى Supabase Storage
            const { data: uploadData, error: uploadError } = await this.supabase.storage
                .from('documents')
                .upload(fullPath, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) throw uploadError;

            // حفظ معلومات الملف في قاعدة البيانات
            const { data: fileData, error: dbError } = await this.supabase
                .from('uploaded_files')
                .insert({
                    request_id: requestId,
                    document_type_id: documentType.id,
                    original_filename: file.name,
                    stored_filename: uniqueFilename,
                    file_path: fullPath,
                    file_size_bytes: file.size,
                    mime_type: file.type,
                    file_extension: file.name.split('.').pop().toLowerCase(),
                    upload_status: 'uploaded'
                })
                .select()
                .single();

            if (dbError) throw dbError;

            return {
                success: true,
                data: fileData,
                storagePath: fullPath
            };

        } catch (error) {
            console.error('خطأ في رفع الملف:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * رفع عدة ملفات
     * Upload multiple files
     */
    async uploadMultipleFiles(files, documentTypes, requestId, userId, onProgress = null) {
        const results = [];
        const totalFiles = files.length;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const documentType = documentTypes.find(dt => dt.id === file.documentTypeId);

            if (!documentType) {
                results.push({
                    success: false,
                    error: 'نوع المستند غير موجود',
                    filename: file.name
                });
                continue;
            }

            // تحديث التقدم
            if (onProgress) {
                onProgress({
                    current: i + 1,
                    total: totalFiles,
                    percentage: Math.round(((i + 1) / totalFiles) * 100),
                    filename: file.name
                });
            }

            const result = await this.uploadFile(file, documentType, requestId, userId);
            results.push({
                ...result,
                filename: file.name,
                documentType: documentType.name_ar
            });
        }

        return results;
    }

    /**
     * الحصول على الملفات المرفوعة لطلب معين
     * Get uploaded files for specific request
     */
    async getUploadedFiles(requestId) {
        try {
            const { data, error } = await this.supabase
                .from('uploaded_files')
                .select(`
                    *,
                    document_types (
                        name_ar,
                        name_en,
                        is_required,
                        suggested_filename
                    )
                `)
                .eq('request_id', requestId)
                .order('uploaded_at', { ascending: true });

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('خطأ في جلب الملفات المرفوعة:', error);
            throw error;
        }
    }

    /**
     * حذف ملف
     * Delete file
     */
    async deleteFile(fileId) {
        try {
            // الحصول على معلومات الملف
            const { data: fileData, error: fetchError } = await this.supabase
                .from('uploaded_files')
                .select('file_path')
                .eq('id', fileId)
                .single();

            if (fetchError) throw fetchError;

            // حذف الملف من التخزين
            const { error: storageError } = await this.supabase.storage
                .from('documents')
                .remove([fileData.file_path]);

            if (storageError) throw storageError;

            // حذف سجل الملف من قاعدة البيانات
            const { error: dbError } = await this.supabase
                .from('uploaded_files')
                .delete()
                .eq('id', fileId);

            if (dbError) throw dbError;

            return { success: true };
        } catch (error) {
            console.error('خطأ في حذف الملف:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * الحصول على رابط تحميل الملف
     * Get file download URL
     */
    async getFileDownloadUrl(filePath) {
        try {
            const { data, error } = await this.supabase.storage
                .from('documents')
                .createSignedUrl(filePath, 3600); // صالح لمدة ساعة

            if (error) throw error;
            return data.signedUrl;
        } catch (error) {
            console.error('خطأ في الحصول على رابط التحميل:', error);
            throw error;
        }
    }

    /**
     * التحقق من اكتمال المستندات المطلوبة
     * Check if all required documents are uploaded
     */
    async checkRequiredDocumentsComplete(requestId, activityTypeId) {
        try {
            // الحصول على المستندات المطلوبة
            const { data: requiredDocs, error: requiredError } = await this.supabase
                .from('document_types')
                .select('id')
                .eq('activity_type_id', activityTypeId)
                .eq('is_required', true);

            if (requiredError) throw requiredError;

            // الحصول على الملفات المرفوعة
            const { data: uploadedFiles, error: uploadedError } = await this.supabase
                .from('uploaded_files')
                .select('document_type_id')
                .eq('request_id', requestId)
                .eq('upload_status', 'uploaded');

            if (uploadedError) throw uploadedError;

            const requiredDocIds = requiredDocs.map(doc => doc.id);
            const uploadedDocIds = uploadedFiles.map(file => file.document_type_id);

            const missingDocs = requiredDocIds.filter(id => !uploadedDocIds.includes(id));

            return {
                isComplete: missingDocs.length === 0,
                missingCount: missingDocs.length,
                missingDocIds: missingDocs
            };
        } catch (error) {
            console.error('خطأ في التحقق من اكتمال المستندات:', error);
            throw error;
        }
    }

    /**
     * إرسال الطلب للمراجعة
     * Submit request for review
     */
    async submitRequestForReview(requestId) {
        try {
            // التحقق من اكتمال المستندات المطلوبة
            const { data: request } = await this.supabase
                .from('registration_requests')
                .select('activity_type_id')
                .eq('id', requestId)
                .single();

            const completeness = await this.checkRequiredDocumentsComplete(requestId, request.activity_type_id);

            if (!completeness.isComplete) {
                throw new Error(`يجب رفع ${completeness.missingCount} مستند إضافي مطلوب`);
            }

            // تحديث حالة الطلب
            const { error } = await this.supabase
                .from('registration_requests')
                .update({
                    status: 'under_review',
                    submitted_at: new Date().toISOString()
                })
                .eq('id', requestId);

            if (error) throw error;

            return { success: true };
        } catch (error) {
            console.error('خطأ في إرسال الطلب للمراجعة:', error);
            return { success: false, error: error.message };
        }
    }
}

// تصدير الكلاس للاستخدام
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FileUploadManager;
} else if (typeof window !== 'undefined') {
    window.FileUploadManager = FileUploadManager;
}
