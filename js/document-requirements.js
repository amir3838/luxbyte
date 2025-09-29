/**
 * نظام قوائم المستندات المطلوبة لكل نشاط
 * Document Requirements System for Each Activity Type
 */

class DocumentRequirements {
    constructor() {
        this.requirements = {
            restaurant: {
                name: 'مطعم',
                nameEn: 'Restaurant',
                required: [
                    {
                        id: 'restaurant_logo',
                        name: 'لوجو المطعم',
                        description: 'PNG خلفية شفافة، 512×512',
                        formats: ['png'],
                        maxSize: 5, // MB
                        dimensions: { width: 512, height: 512 },
                        fileName: 'restaurant_logo.png',
                        storagePath: 'restaurant/requests/{uid}/'
                    },
                    {
                        id: 'restaurant_cover',
                        name: 'صورة غلاف',
                        description: 'JPG 1200×600',
                        formats: ['jpg', 'jpeg'],
                        maxSize: 5,
                        dimensions: { width: 1200, height: 600 },
                        fileName: 'restaurant_cover.jpg',
                        storagePath: 'restaurant/requests/{uid}/'
                    },
                    {
                        id: 'restaurant_facade',
                        name: 'واجهة المحل',
                        description: 'JPG 1280px+',
                        formats: ['jpg', 'jpeg'],
                        maxSize: 5,
                        dimensions: { minWidth: 1280 },
                        fileName: 'restaurant_facade.jpg',
                        storagePath: 'restaurant/requests/{uid}/'
                    },
                    {
                        id: 'restaurant_cr',
                        name: 'السجل التجاري',
                        description: 'PDF أو JPG واضحة',
                        formats: ['pdf', 'jpg', 'jpeg'],
                        maxSize: 5,
                        fileName: 'restaurant_cr.pdf',
                        storagePath: 'restaurant/requests/{uid}/'
                    },
                    {
                        id: 'restaurant_op_license',
                        name: 'رخصة التشغيل',
                        description: 'PDF/JPG',
                        formats: ['pdf', 'jpg', 'jpeg'],
                        maxSize: 5,
                        fileName: 'restaurant_op_license.pdf',
                        storagePath: 'restaurant/requests/{uid}/'
                    }
                ],
                optional: [
                    {
                        id: 'restaurant_menu',
                        name: 'قائمة الطعام',
                        description: 'PDF أو صور',
                        formats: ['pdf', 'jpg', 'jpeg'],
                        maxSize: 5,
                        fileName: 'menu.pdf',
                        storagePath: 'restaurant/requests/{uid}/'
                    }
                ]
            },
            supermarket: {
                name: 'سوبر ماركت',
                nameEn: 'Supermarket',
                required: [
                    {
                        id: 'market_logo',
                        name: 'لوجو',
                        description: 'PNG 512×512',
                        formats: ['png'],
                        maxSize: 5,
                        dimensions: { width: 512, height: 512 },
                        fileName: 'market_logo.png',
                        storagePath: 'supermarket/requests/{uid}/'
                    },
                    {
                        id: 'market_shelves',
                        name: 'واجهة/أرفف المتجر',
                        description: 'JPG 1280px+',
                        formats: ['jpg', 'jpeg'],
                        maxSize: 5,
                        dimensions: { minWidth: 1280 },
                        fileName: 'market_shelves.jpg',
                        storagePath: 'supermarket/requests/{uid}/'
                    },
                    {
                        id: 'market_cr',
                        name: 'السجل التجاري',
                        description: 'PDF/JPG',
                        formats: ['pdf', 'jpg', 'jpeg'],
                        maxSize: 5,
                        fileName: 'market_cr.pdf',
                        storagePath: 'supermarket/requests/{uid}/'
                    },
                    {
                        id: 'market_activity_license',
                        name: 'رخصة النشاط',
                        description: 'PDF/JPG',
                        formats: ['pdf', 'jpg', 'jpeg'],
                        maxSize: 5,
                        fileName: 'market_activity_license.pdf',
                        storagePath: 'supermarket/requests/{uid}/'
                    }
                ],
                optional: [
                    {
                        id: 'market_facade',
                        name: 'صورة خارجية للمحل',
                        description: 'JPG',
                        formats: ['jpg', 'jpeg'],
                        maxSize: 5,
                        fileName: 'market_facade.jpg',
                        storagePath: 'supermarket/requests/{uid}/'
                    }
                ]
            },
            pharmacy: {
                name: 'صيدلية',
                nameEn: 'Pharmacy',
                required: [
                    {
                        id: 'pharmacy_logo',
                        name: 'لوجو',
                        description: 'PNG 512×512',
                        formats: ['png'],
                        maxSize: 5,
                        dimensions: { width: 512, height: 512 },
                        fileName: 'pharmacy_logo.png',
                        storagePath: 'pharmacy/requests/{uid}/'
                    },
                    {
                        id: 'pharmacy_facade',
                        name: 'واجهة الصيدلية',
                        description: 'JPG 1280px+',
                        formats: ['jpg', 'jpeg'],
                        maxSize: 5,
                        dimensions: { minWidth: 1280 },
                        fileName: 'pharmacy_facade.jpg',
                        storagePath: 'pharmacy/requests/{uid}/'
                    },
                    {
                        id: 'pharmacy_practice_license',
                        name: 'ترخيص مزاولة المهنة',
                        description: 'PDF/JPG',
                        formats: ['pdf', 'jpg', 'jpeg'],
                        maxSize: 5,
                        fileName: 'pharmacy_practice_license.pdf',
                        storagePath: 'pharmacy/requests/{uid}/'
                    },
                    {
                        id: 'pharmacy_cr',
                        name: 'السجل التجاري',
                        description: 'PDF/JPG',
                        formats: ['pdf', 'jpg', 'jpeg'],
                        maxSize: 5,
                        fileName: 'pharmacy_cr.pdf',
                        storagePath: 'pharmacy/requests/{uid}/'
                    }
                ],
                optional: [
                    {
                        id: 'pharmacy_interior',
                        name: 'لافتة داخلية/كونتر',
                        description: 'JPG',
                        formats: ['jpg', 'jpeg'],
                        maxSize: 5,
                        fileName: 'pharmacy_interior.jpg',
                        storagePath: 'pharmacy/requests/{uid}/'
                    }
                ]
            },
            clinic: {
                name: 'عيادة',
                nameEn: 'Clinic',
                required: [
                    {
                        id: 'clinic_logo',
                        name: 'لوجو العيادة أو صورة الطبيب',
                        description: 'PNG/JPG 512×512',
                        formats: ['png', 'jpg', 'jpeg'],
                        maxSize: 5,
                        dimensions: { width: 512, height: 512 },
                        fileName: 'clinic_logo.png',
                        storagePath: 'clinic/requests/{uid}/'
                    },
                    {
                        id: 'clinic_facade',
                        name: 'واجهة/الاستقبال',
                        description: 'JPG 1280px+',
                        formats: ['jpg', 'jpeg'],
                        maxSize: 5,
                        dimensions: { minWidth: 1280 },
                        fileName: 'clinic_facade.jpg',
                        storagePath: 'clinic/requests/{uid}/'
                    },
                    {
                        id: 'clinic_license',
                        name: 'رخصة العيادة',
                        description: 'PDF/JPG',
                        formats: ['pdf', 'jpg', 'jpeg'],
                        maxSize: 5,
                        fileName: 'clinic_license.pdf',
                        storagePath: 'clinic/requests/{uid}/'
                    },
                    {
                        id: 'doctor_id_front',
                        name: 'بطاقة الطبيب (الوجه الأمامي)',
                        description: 'JPG واضح',
                        formats: ['jpg', 'jpeg'],
                        maxSize: 5,
                        fileName: 'doctor_id_front.jpg',
                        storagePath: 'clinic/requests/{uid}/'
                    },
                    {
                        id: 'doctor_id_back',
                        name: 'بطاقة الطبيب (الوجه الخلفي)',
                        description: 'JPG واضح',
                        formats: ['jpg', 'jpeg'],
                        maxSize: 5,
                        fileName: 'doctor_id_back.jpg',
                        storagePath: 'clinic/requests/{uid}/'
                    }
                ],
                optional: [
                    {
                        id: 'doctor_certificate',
                        name: 'شهادة مزاولة/زمالة',
                        description: 'PDF/JPG',
                        formats: ['pdf', 'jpg', 'jpeg'],
                        maxSize: 5,
                        fileName: 'doctor_certificate.pdf',
                        storagePath: 'clinic/requests/{uid}/'
                    }
                ]
            },
            courier: {
                name: 'مندوب توصيل',
                nameEn: 'Courier',
                required: [
                    {
                        id: 'id_front',
                        name: 'صورة البطاقة (الوجه الأمامي)',
                        description: 'JPG',
                        formats: ['jpg', 'jpeg'],
                        maxSize: 5,
                        fileName: 'id_front.jpg',
                        storagePath: 'courier/requests/{uid}/'
                    },
                    {
                        id: 'id_back',
                        name: 'صورة البطاقة (الوجه الخلفي)',
                        description: 'JPG',
                        formats: ['jpg', 'jpeg'],
                        maxSize: 5,
                        fileName: 'id_back.jpg',
                        storagePath: 'courier/requests/{uid}/'
                    },
                    {
                        id: 'driving_license',
                        name: 'رخصة القيادة',
                        description: 'JPG/PDF',
                        formats: ['jpg', 'jpeg', 'pdf'],
                        maxSize: 5,
                        fileName: 'driving_license.jpg',
                        storagePath: 'courier/requests/{uid}/'
                    },
                    {
                        id: 'vehicle_photo',
                        name: 'صورة المركبة + اللوحة',
                        description: 'JPG واضحة',
                        formats: ['jpg', 'jpeg'],
                        maxSize: 5,
                        fileName: 'vehicle_photo.jpg',
                        storagePath: 'courier/requests/{uid}/'
                    }
                ],
                optional: [
                    {
                        id: 'background_check',
                        name: 'صحيفة الحالة الجنائية',
                        description: 'PDF/JPG',
                        formats: ['pdf', 'jpg', 'jpeg'],
                        maxSize: 5,
                        fileName: 'background_check.pdf',
                        storagePath: 'courier/requests/{uid}/'
                    },
                    {
                        id: 'vehicle_license',
                        name: 'رخصة المركبة/ترخيص السير',
                        description: 'PDF/JPG',
                        formats: ['pdf', 'jpg', 'jpeg'],
                        maxSize: 5,
                        fileName: 'vehicle_license.pdf',
                        storagePath: 'courier/requests/{uid}/'
                    }
                ]
            },
            driver: {
                name: 'سائق رئيسي',
                nameEn: 'Master Driver',
                required: [
                    // جميع متطلبات مندوب التوصيل
                    {
                        id: 'id_front',
                        name: 'صورة البطاقة (الوجه الأمامي)',
                        description: 'JPG',
                        formats: ['jpg', 'jpeg'],
                        maxSize: 5,
                        fileName: 'id_front.jpg',
                        storagePath: 'courier/requests/{uid}/'
                    },
                    {
                        id: 'id_back',
                        name: 'صورة البطاقة (الوجه الخلفي)',
                        description: 'JPG',
                        formats: ['jpg', 'jpeg'],
                        maxSize: 5,
                        fileName: 'id_back.jpg',
                        storagePath: 'courier/requests/{uid}/'
                    },
                    {
                        id: 'driving_license',
                        name: 'رخصة القيادة',
                        description: 'JPG/PDF',
                        formats: ['jpg', 'jpeg', 'pdf'],
                        maxSize: 5,
                        fileName: 'driving_license.jpg',
                        storagePath: 'courier/requests/{uid}/'
                    },
                    {
                        id: 'vehicle_photo',
                        name: 'صورة المركبة + اللوحة',
                        description: 'JPG واضحة',
                        formats: ['jpg', 'jpeg'],
                        maxSize: 5,
                        fileName: 'vehicle_photo.jpg',
                        storagePath: 'courier/requests/{uid}/'
                    },
                    // متطلبات إضافية للسائق الرئيسي
                    {
                        id: 'vehicle_license',
                        name: 'رخصة المركبة',
                        description: 'PDF/JPG',
                        formats: ['pdf', 'jpg', 'jpeg'],
                        maxSize: 5,
                        fileName: 'vehicle_license.pdf',
                        storagePath: 'courier/requests/{uid}/'
                    },
                    {
                        id: 'insurance',
                        name: 'تأمين ساري',
                        description: 'PDF/JPG (إن متطلب)',
                        formats: ['pdf', 'jpg', 'jpeg'],
                        maxSize: 5,
                        fileName: 'insurance.pdf',
                        storagePath: 'courier/requests/{uid}/'
                    }
                ],
                optional: [
                    {
                        id: 'background_check',
                        name: 'صحيفة الحالة الجنائية',
                        description: 'PDF/JPG',
                        formats: ['pdf', 'jpg', 'jpeg'],
                        maxSize: 5,
                        fileName: 'background_check.pdf',
                        storagePath: 'courier/requests/{uid}/'
                    }
                ]
            }
        };
    }

    /**
     * تهيئة النظام
     */
    init() {
        // تهيئة النظام
    }

    /**
     * الحصول على متطلبات نشاط معين
     */
    getRequirements(activityType) {
        return this.requirements[activityType] || null;
    }

    /**
     * الحصول على جميع أنواع الأنشطة
     */
    getAllActivityTypes() {
        return Object.keys(this.requirements).map(key => ({
            id: key,
            name: this.requirements[key].name,
            nameEn: this.requirements[key].nameEn
        }));
    }

    /**
     * التحقق من صحة الملف حسب متطلبات النشاط
     */
    validateFile(activityType, documentId, file) {
        const activity = this.getRequirements(activityType);
        if (!activity) return { valid: false, error: 'نوع النشاط غير صحيح' };

        // البحث عن المستند في القائمة المطلوبة أو الاختيارية
        let document = activity.required.find(doc => doc.id === documentId);
        if (!document) {
            document = activity.optional.find(doc => doc.id === documentId);
        }

        if (!document) {
            return { valid: false, error: 'نوع المستند غير صحيح' };
        }

        // التحقق من الصيغة
        const fileExtension = file.name.split('.').pop().toLowerCase();
        if (!document.formats.includes(fileExtension)) {
            return {
                valid: false,
                error: `الصيغة غير مدعومة. الصيغ المقبولة: ${document.formats.join(', ')}`
            };
        }

        // التحقق من الحجم
        const fileSizeMB = file.size / (1024 * 1024);
        if (fileSizeMB > document.maxSize) {
            return {
                valid: false,
                error: `حجم الملف كبير جداً. الحد الأقصى: ${document.maxSize}MB`
            };
        }

        // التحقق من الأبعاد للصور
        if (document.dimensions && file.type.startsWith('image/')) {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => {
                    const { width, height } = img;
                    const { dimensions } = document;

                    if (dimensions.width && dimensions.height) {
                        // أبعاد محددة
                        if (width !== dimensions.width || height !== dimensions.height) {
                            resolve({
                                valid: false,
                                error: `الأبعاد غير صحيحة. المطلوب: ${dimensions.width}×${dimensions.height}px`
                            });
                            return;
                        }
                    } else if (dimensions.minWidth) {
                        // عرض أدنى
                        if (width < dimensions.minWidth) {
                            resolve({
                                valid: false,
                                error: `العرض صغير جداً. الحد الأدنى: ${dimensions.minWidth}px`
                            });
                            return;
                        }
                    }

                    resolve({ valid: true });
                };
                img.onerror = () => {
                    resolve({ valid: false, error: 'خطأ في قراءة الصورة' });
                };
                img.src = URL.createObjectURL(file);
            });
        }

        return { valid: true };
    }

    /**
     * إنشاء قائمة تحقق للمستندات المطلوبة
     */
    createChecklist(activityType) {
        const activity = this.getRequirements(activityType);
        if (!activity) return null;

        return {
            activity: activity,
            required: activity.required.map(doc => ({
                ...doc,
                uploaded: false,
                file: null
            })),
            optional: activity.optional.map(doc => ({
                ...doc,
                uploaded: false,
                file: null
            }))
        };
    }

    /**
     * تحديث حالة المستند في القائمة
     */
    updateDocumentStatus(checklist, documentId, uploaded, file = null) {
        // البحث في المستندات المطلوبة
        let document = checklist.required.find(doc => doc.id === documentId);
        if (document) {
            document.uploaded = uploaded;
            document.file = file;
            return true;
        }

        // البحث في المستندات الاختيارية
        document = checklist.optional.find(doc => doc.id === documentId);
        if (document) {
            document.uploaded = uploaded;
            document.file = file;
            return true;
        }

        return false;
    }

    /**
     * التحقق من اكتمال جميع المستندات المطلوبة
     */
    isComplete(checklist) {
        return checklist.required.every(doc => doc.uploaded);
    }

    /**
     * الحصول على نسبة الإكمال
     */
    getCompletionPercentage(checklist) {
        const totalRequired = checklist.required.length;
        const uploadedRequired = checklist.required.filter(doc => doc.uploaded).length;
        return Math.round((uploadedRequired / totalRequired) * 100);
    }
}

// تصدير الكلاس للاستخدام في الملفات الأخرى
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DocumentRequirements;
} else {
    window.DocumentRequirements = DocumentRequirements;
}
