// LUXBYTE Configuration
window.CONFIG = {
  // Environment Variables Injection (Legacy - for backward compatibility)
  __ENV__: {
    NEXT_PUBLIC_SUPABASE_URL: "https://qjsvgpvbtrcnbhcjdcci.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: "sb_publishable_vAyh05NeO33SYgua07vvIQ_M6nfrx7e",
    NEXT_PUBLIC_FIREBASE_API_KEY: "AIzaSyBIlSKMkFIyY1OFYqqImwx5Lo2nHW5Foss",
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: "studio-1f95z.firebaseapp.com",
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: "studio-1f95z",
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: "922681782984",
    NEXT_PUBLIC_FIREBASE_APP_ID: "1:922681782984:web:d3840713be209e4a60abfd",
    NEXT_PUBLIC_FIREBASE_VAPID_KEY: "BJ3SXe0Nof9H4KJpvgG80LVUeDTNxdh0O2z3aOIzEzrFxd3bAn4ixhhouG7VV11zmK8giQ-UUGWeAP3JK8MpbXk"
  },

  // Supabase Configuration (Legacy - for backward compatibility)
  SUPABASE_URL: "https://qjsvgpvbtrcnbhcjdcci.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable_vAyh05NeO33SYgua07vvIQ_M6nfrx7e",

  // Social Media Links
  SOCIAL_LINKS: {
    facebook: "https://www.facebook.com/share/19zx6VUm7M/",
    instagram: "https://www.instagram.com/luxbyte_llc1?igsh=MTJlemY1ZjFvNzd0eA==",
    tiktok: "https://www.tiktok.com/@luxpyte.llc?is_from_webapp=1&sender_device=pc",
    whatsapp: "https://wa.me/201148709609",
    phone: "tel:+201148709609"
  },

  // Role Definitions
  ROLES: {
    restaurant: {
      name: "مطعم",
      table: "restaurant_requests",
      bucket: "restaurant",
      icon: "fas fa-utensils",
      fields: [
        { name: "restaurant_name", label: "اسم المطعم", type: "text", required: true },
        { name: "owner_name", label: "اسم المالك", type: "text", required: true },
        { name: "phone", label: "رقم الهاتف", type: "tel", required: true },
        { name: "description", label: "وصف المطعم", type: "textarea", required: false }
      ],
      files: [
        // إلزامي غالبًا
        { name: "commercial_register", label: "السجل التجاري", accept: ".pdf,.jpg,.jpeg", required: true, description: "PDF أو JPG واضحة" },
        { name: "tax_card", label: "البطاقة الضريبية", accept: ".pdf,.jpg,.jpeg", required: true, description: "PDF أو JPG واضحة" },
        { name: "contract_document", label: "عقد مقر موثق", accept: ".pdf,.jpg,.jpeg", required: true, description: "إيجار موثق أو تمليك + إيصال مرافق حديث" },
        { name: "food_license", label: "رخصة تشغيل مأكولات", accept: ".pdf,.jpg,.jpeg", required: true, description: "من الحي/المحافظة" },
        { name: "food_safety_approval", label: "موافقة جهاز سلامة الغذاء", accept: ".pdf,.jpg,.jpeg", required: true, description: "اشتراطات الغذاء" },
        { name: "health_certificate", label: "شهادة صحية", accept: ".pdf,.jpg,.jpeg", required: true, description: "لصاحب النشاط وجميع العاملين" },
        { name: "civil_defense_approval", label: "موافقة الدفاع المدني", accept: ".pdf,.jpg,.jpeg", required: true, description: "اشتراطات مكافحة الحريق والتهوية" },
        { name: "environmental_file", label: "ملف بيئي", accept: ".pdf,.jpg,.jpeg", required: false, description: "التزام اشتراطات بيئية" },

        // حسب الحالة
        { name: "industrial_register", label: "سجل صناعي", accept: ".pdf,.jpg,.jpeg", required: false, description: "للتجهيزات الصناعية/توريد شامل" },
        { name: "import_register", label: "سجل استيراد", accept: ".pdf,.jpg,.jpeg", required: false, description: "للاستيراد مواد خام" },
        { name: "tourism_license", label: "ترخيص سياحي", accept: ".pdf,.jpg,.jpeg", required: false, description: "للمطاعم السياحية/الفنادق" },

        // صور إضافية
        { name: "facade_photo", label: "صورة واجهة المحل", accept: "image/*", required: true, description: "JPG 1280px+" },
        { name: "interior_photo", label: "صورة داخلية", accept: "image/*", required: false, description: "JPG 1280px+" }
      ]
    },

    supermarket: {
      name: "سوبر ماركت",
      table: "supermarket_requests",
      bucket: "supermarket",
      icon: "fas fa-shopping-cart",
      fields: [
        { name: "market_name", label: "اسم السوبر ماركت", type: "text", required: true },
        { name: "owner_name", label: "اسم المالك", type: "text", required: true },
        { name: "phone", label: "رقم الهاتف", type: "tel", required: true },
        { name: "description", label: "وصف السوبر ماركت", type: "textarea", required: false }
      ],
      files: [
        // إلزامي
        { name: "commercial_register", label: "السجل التجاري", accept: ".pdf,.jpg,.jpeg", required: true, description: "PDF أو JPG واضحة" },
        { name: "tax_card", label: "البطاقة الضريبية", accept: ".pdf,.jpg,.jpeg", required: true, description: "PDF أو JPG واضحة" },
        { name: "contract_document", label: "عقد مقر موثق", accept: ".pdf,.jpg,.jpeg", required: true, description: "إيجار موثق أو تمليك + إيصال مرافق حديث" },
        { name: "business_license", label: "رخصة فتح وإدارة محل تجاري", accept: ".pdf,.jpg,.jpeg", required: true, description: "من الحي/المحافظة" },
        { name: "civil_defense_approval", label: "موافقة الدفاع المدني", accept: ".pdf,.jpg,.jpeg", required: true, description: "اشتراطات الحريق" },
        { name: "health_approvals", label: "موافقات صحية عامة", accept: ".pdf,.jpg,.jpeg", required: true, description: "خاصة بالأغذية المعبأة والاشتراطات الصحية" },
        { name: "worker_health_certificates", label: "شهادات صحية للعاملين", accept: ".pdf,.jpg,.jpeg", required: true, description: "للعاملين المتعاملين مع المواد الغذائية" },

        // حسب النشاط
        { name: "food_safety_approval", label: "موافقة جهاز سلامة الغذاء", accept: ".pdf,.jpg,.jpeg", required: false, description: "لحوم/ألبان طازجة" },
        { name: "import_register", label: "سجل استيراد", accept: ".pdf,.jpg,.jpeg", required: false, description: "للاستيراد المباشر" },

        // صور
        { name: "facade_photo", label: "صورة واجهة المحل", accept: "image/*", required: true, description: "JPG 1280px+" },
        { name: "interior_photo", label: "صورة داخلية/أرفف", accept: "image/*", required: false, description: "JPG 1280px+" }
      ]
    },

    pharmacy: {
      name: "صيدلية",
      table: "pharmacy_requests",
      bucket: "pharmacy",
      icon: "fas fa-pills",
      fields: [
        { name: "pharmacy_name", label: "اسم الصيدلية", type: "text", required: true },
        { name: "pharmacist_name", label: "اسم الصيدلي", type: "text", required: true },
        { name: "phone", label: "رقم الهاتف", type: "tel", required: true },
        { name: "license_number", label: "رقم الترخيص", type: "text", required: true }
      ],
      files: [
        // إلزامي
        { name: "pharmacy_license", label: "ترخيص فتح صيدلية", accept: ".pdf,.jpg,.jpeg", required: true, description: "من وزارة الصحة (مديرية الشؤون الصحية)" },
        { name: "pharmacist_register", label: "قيد الصيدلي المسؤول", accept: ".pdf,.jpg,.jpeg", required: true, description: "كارنيه نقابة الصيادلة" },
        { name: "management_contract", label: "عقد إدارة/تنازل موثق", accept: ".pdf,.jpg,.jpeg", required: true, description: "إذا غير المالك هو المدير المسؤول" },
        { name: "commercial_register", label: "السجل التجاري", accept: ".pdf,.jpg,.jpeg", required: true, description: "كيان النشاط" },
        { name: "tax_card", label: "البطاقة الضريبية", accept: ".pdf,.jpg,.jpeg", required: true, description: "PDF أو JPG واضحة" },
        { name: "contract_document", label: "عقد مقر موثق", accept: ".pdf,.jpg,.jpeg", required: true, description: "بالمواصفات المعتمدة للصيدليات" },
        { name: "civil_defense_approval", label: "موافقة الدفاع المدني", accept: ".pdf,.jpg,.jpeg", required: true, description: "سلامة الحريق" },

        // حسب الحالة
        { name: "drug_warehouse_license", label: "تصريح تداول ومخزن أدوية", accept: ".pdf,.jpg,.jpeg", required: false, description: "إن وُجد مخزن منفصل" },
        { name: "psychiatric_drugs_approval", label: "موافقات الأدوية النفسية", accept: ".pdf,.jpg,.jpeg", required: false, description: "سجل خاص وإجراءات رقابية" },

        // صور
        { name: "facade_photo", label: "صورة واجهة الصيدلية", accept: "image/*", required: true, description: "JPG 1280px+" },
        { name: "interior_photo", label: "صورة داخلية/كونتر", accept: "image/*", required: false, description: "JPG 1280px+" }
      ]
    },

    clinic: {
      name: "عيادة",
      table: "clinic_requests",
      bucket: "clinic",
      icon: "fas fa-stethoscope",
      fields: [
        { name: "clinic_name", label: "اسم العيادة", type: "text", required: true },
        { name: "doctor_name", label: "اسم الطبيب", type: "text", required: true },
        { name: "specialization", label: "التخصص", type: "text", required: true },
        { name: "phone", label: "رقم الهاتف", type: "tel", required: true },
        { name: "license_number", label: "رقم ترخيص العيادة", type: "text", required: true }
      ],
      files: [
        // إلزامي
        { name: "medical_facility_license", label: "ترخيص منشأة طبية", accept: ".pdf,.jpg,.jpeg", required: true, description: "من وزارة الصحة (وفق لائحة المنشآت الطبية)" },
        { name: "doctor_register", label: "قيد الطبيب/الأطباء", accept: ".pdf,.jpg,.jpeg", required: true, description: "نقابة الأطباء + بطاقة رقم قومي سارية" },
        { name: "contract_document", label: "عقد مقر موثق", accept: ".pdf,.jpg,.jpeg", required: true, description: "يطابق مساحات واشتراطات العيادات" },
        { name: "civil_defense_approval", label: "موافقة الدفاع المدني", accept: ".pdf,.jpg,.jpeg", required: true, description: "سلامة الحريق" },
        { name: "commercial_register", label: "السجل التجاري", accept: ".pdf,.jpg,.jpeg", required: false, description: "لو عيادة كشخص اعتباري/شركة مهنية" },
        { name: "tax_card", label: "البطاقة الضريبية", accept: ".pdf,.jpg,.jpeg", required: false, description: "لو عيادة كشخص اعتباري/شركة مهنية" },

        // حسب التخصص
        { name: "special_equipment_license", label: "تراخيص أجهزة خاصة", accept: ".pdf,.jpg,.jpeg", required: false, description: "أشعة/ليزر/معمل وموافقات إضافية" },
        { name: "medical_waste_license", label: "ترخيص نفايات طبية", accept: ".pdf,.jpg,.jpeg", required: false, description: "خدمة تعاقد مع شركة معتمدة للتخلص الآمن" },

        // صور
        { name: "facade_photo", label: "صورة واجهة العيادة", accept: "image/*", required: true, description: "JPG 1280px+" },
        { name: "interior_photo", label: "صورة داخلية/الاستقبال", accept: "image/*", required: false, description: "JPG 1280px+" }
      ]
    },

    courier: {
      name: "مندوب توصيل",
      table: "courier_requests",
      bucket: "courier",
      icon: "fas fa-motorcycle",
      fields: [
        { name: "full_name", label: "الاسم الكامل", type: "text", required: true },
        { name: "national_id", label: "رقم البطاقة", type: "text", required: true },
        { name: "phone", label: "رقم الهاتف", type: "tel", required: true },
        { name: "vehicle_type", label: "نوع المركبة", type: "select", required: true, options: ["دراجة نارية", "سيارة", "دراجة هوائية"] },
        { name: "license_number", label: "رقم رخصة القيادة", type: "text", required: true }
      ],
      files: [
        // إلزامي غالبًا
        { name: "national_id", label: "بطاقة رقم قومي سارية", accept: "image/*", required: true, description: "JPG واضح من الجهتين" },
        { name: "driving_license", label: "رخصة قيادة سارية", accept: ".pdf,.jpg,.jpeg", required: true, description: "خاصة/مهنية حسب المركبة" },
        { name: "vehicle_license", label: "رخصة مركبة/توكتوك/دراجة نارية", accept: ".pdf,.jpg,.jpeg", required: true, description: "سارية (لو بيستخدم مركبة)" },
        { name: "criminal_record", label: "صحيفة حالة جنائية حديثة", accept: ".pdf,.jpg,.jpeg", required: true, description: "فيش وتشبيه" },
        { name: "personal_photos", label: "صور شخصية حديثة", accept: "image/*", required: true, description: "JPG واضحة" },

        // مستحسن/قد يُطلب
        { name: "civil_insurance", label: "تأمين مسؤولية مدنية", accept: ".pdf,.jpg,.jpeg", required: false, description: "تأمين على المركبة" },
        { name: "vehicle_insurance", label: "تأمين المركبة", accept: ".pdf,.jpg,.jpeg", required: false, description: "تأمين شامل" },
        { name: "activity_license", label: "رخصة مزاولة نشاط نقل خفيف", accept: ".pdf,.jpg,.jpeg", required: false, description: "إن طُلب من الحي (نادِرًا للأفراد)" },

        // صور إضافية
        { name: "vehicle_photo", label: "صورة المركبة + اللوحة", accept: "image/*", required: true, description: "JPG واضحة" }
      ]
    },

    driver: {
      name: "سائق رئيسي",
      table: "driver_requests",
      bucket: "driver",
      icon: "fas fa-car",
      fields: [
        { name: "full_name", label: "الاسم الكامل", type: "text", required: true },
        { name: "national_id", label: "رقم البطاقة", type: "text", required: true },
        { name: "phone", label: "رقم الهاتف", type: "tel", required: true },
        { name: "vehicle_type", label: "نوع المركبة", type: "select", required: true, options: ["سيارة", "فان", "شاحنة صغيرة"] },
        { name: "license_number", label: "رقم رخصة القيادة", type: "text", required: true },
        { name: "experience_years", label: "سنوات الخبرة", type: "number", required: true }
      ],
      files: [
        // إلزامي غالبًا
        { name: "commercial_register", label: "السجل التجاري", accept: ".pdf,.jpg,.jpeg", required: true, description: "بنشاط نقل/خدمات لوجستية" },
        { name: "tax_card", label: "البطاقة الضريبية", accept: ".pdf,.jpg,.jpeg", required: true, description: "PDF أو JPG واضحة" },
        { name: "vehicle_licenses", label: "تراخيص المركبات التجارية", accept: ".pdf,.jpg,.jpeg", required: true, description: "التأمين الإجباري والشامل حسب الأسطول" },
        { name: "drivers_files", label: "ملفات السائقين", accept: ".pdf,.jpg,.jpeg", required: true, description: "رخص مهنية/صحيفة جنائية/كشف مخدرات" },
        { name: "civil_defense_approval", label: "موافقة الدفاع المدني", accept: ".pdf,.jpg,.jpeg", required: true, description: "على الجراج/مقر التشغيل" },
        { name: "maintenance_contracts", label: "عقود صيانة/تشغيل", accept: ".pdf,.jpg,.jpeg", required: false, description: "إن لزم" },

        // حسب النشاط
        { name: "heavy_transport_license", label: "تراخيص تشغيل نقل بضائع", accept: ".pdf,.jpg,.jpeg", required: false, description: "بين المحافظات (نقل تجاري ثقيل)" },
        { name: "import_export_register", label: "سجل مستورد/مصدر", accept: ".pdf,.jpg,.jpeg", required: false, description: "لو خدمات لوجستية موسّعة" },

        // صور
        { name: "fleet_photos", label: "صور الأسطول", accept: "image/*", required: true, description: "JPG واضحة للمركبات" },
        { name: "facility_photos", label: "صور المقر/الجراج", accept: "image/*", required: false, description: "JPG 1280px+" }
      ]
    }
  },

  // Location Data
  LOCATIONS: {
    'القاهرة': [
      'مدينة نصر', 'المعادي', 'الزمالك', 'وسط البلد', 'مصر الجديدة',
      'المقطم', 'التجمع الخامس', 'الرحاب', 'مدينتي', 'الشروق',
      'العبور', 'حلوان', 'المطرية', 'عين شمس', 'الخليفة',
      'السيدة زينب', 'الجمالية', 'عابدين', 'الموسكي', 'باب الشعرية'
    ],
    'الجيزة': [
      'المهندسين', 'الدقي', 'الزمالك', 'الهرم', 'فيصل',
      'العجوزة', '6 أكتوبر', 'الشيخ زايد', 'البدرشين', 'الحوامدية',
      'العياط', 'كرداسة', 'أوسيم', 'الوراق', 'إمبابة',
      'بولاق الدكرور', 'الطالبية', 'المنيب', 'الصف', 'أطفيح'
    ],
    'القليوبية': [
      'العبور', 'شبرا الخيمة', 'بنها', 'الخصوص'
    ]
  },

  // Platform Types
  PLATFORMS: {
    shopeg: {
      name: "شوب إي جي",
      description: "منصة التجارة الإلكترونية للمنشآت التجارية",
      icon: "fas fa-store",
      roles: ["restaurant", "supermarket", "pharmacy", "clinic", "courier"]
    },
    masterdriver: {
      name: "ماستر درايفر",
      description: "منصة خدمات التوصيل والنقل",
      icon: "fas fa-car",
      roles: ["driver"]
    }
  },

  // Firebase Configuration for Push Notifications
  FCM_API_KEY: "AIzaSyBIlSKMkFIyY1OFYqqImwx5Lo2nHW5Foss",
  FCM_PROJECT_ID: "studio-1f95z",
  FCM_SENDER_ID: "922681782984",
  FCM_APP_ID: "1:922681782984:web:d3840713be209e4a60abfd",
  FCM_VAPID_KEY: "BJ3SXe0Nof9H4KJpvgG80LVUeDTNxdh0O2z3aOIzEzrFxd3bAn4ixhhouG7VV11zmK8giQ-UUGWeAP3JK8MpbXk"
};

/**
 * Initialize Configuration System
 * تهيئة نظام الإعدادات
 *
 * This function provides backward compatibility while supporting
 * the new runtime environment loading system.
 */
async function initConfig() {
  try {
    // Try to load from new environment system
    if (typeof window !== 'undefined' && window.loadEnv) {
      console.log('🔄 Loading environment from new system...');
      const ENV = await window.loadEnv();
      const { ok, missing } = window.validateEnv(ENV);

      if (!ok) {
        console.error('❌ Environment validation failed:', missing);
        if (window.toastError) {
          window.toastError(`خطأ في تحميل أزرار الرفع: متغيّرات البيئة غير مكتملة (${missing.join(', ')})`);
        }
        return null;
      }

      // Update window.__ENV__ with loaded values
      window.__ENV__ = {
        NEXT_PUBLIC_SUPABASE_URL: ENV.SUPABASE_URL,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: ENV.SUPABASE_ANON_KEY,
        NEXT_PUBLIC_FIREBASE_API_KEY: ENV.FIREBASE_API_KEY,
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: ENV.FIREBASE_AUTH_DOMAIN,
        NEXT_PUBLIC_FIREBASE_PROJECT_ID: ENV.FIREBASE_PROJECT_ID,
        NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: ENV.FIREBASE_MESSAGING_SENDER_ID,
        NEXT_PUBLIC_FIREBASE_APP_ID: ENV.FIREBASE_APP_ID,
        NEXT_PUBLIC_FIREBASE_VAPID_KEY: ENV.FIREBASE_VAPID_KEY
      };

      console.log('✅ Environment loaded successfully from new system');
      return ENV;
    }

    // Fallback to existing configuration
    console.log('📦 Using existing configuration');
    return window.CONFIG.__ENV__;

  } catch (error) {
    console.error('❌ Failed to initialize configuration:', error);
    if (window.toastError) {
      window.toastError('خطأ في تحميل أزرار الرفع: تعذّر جلب إعدادات البيئة');
    }
    return null;
  }
}

// Make initConfig globally available
if (typeof window !== 'undefined') {
  window.initConfig = initConfig;
}
