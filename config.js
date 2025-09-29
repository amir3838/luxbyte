// LUXBYTE Configuration
window.CONFIG = {
  // Supabase Configuration
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
        { name: "logo", label: "لوجو المطعم", accept: "image/*", required: true, description: "PNG خلفية شفافة، 512×512" },
        { name: "cover", label: "صورة غلاف", accept: "image/*", required: true, description: "JPG 1200×600" },
        { name: "facade", label: "واجهة المحل", accept: "image/*", required: true, description: "JPG 1280px+" },
        { name: "commercial_register", label: "السجل التجاري", accept: ".pdf,.jpg,.jpeg", required: true, description: "PDF أو JPG واضحة" },
        { name: "operating_license", label: "رخصة التشغيل", accept: ".pdf,.jpg,.jpeg", required: true, description: "PDF/JPG" },
        { name: "menu", label: "قائمة الطعام", accept: ".pdf,.jpg,.jpeg", required: false, description: "PDF أو صور" }
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
        { name: "logo", label: "لوجو السوبر ماركت", accept: "image/*", required: true, description: "PNG 512×512" },
        { name: "shelves", label: "واجهة/أرفف المتجر", accept: "image/*", required: true, description: "JPG 1280px+" },
        { name: "commercial_register", label: "السجل التجاري", accept: ".pdf,.jpg,.jpeg", required: true, description: "PDF/JPG" },
        { name: "activity_license", label: "رخصة النشاط", accept: ".pdf,.jpg,.jpeg", required: true, description: "PDF/JPG" },
        { name: "facade", label: "صورة خارجية للمحل", accept: "image/*", required: false, description: "JPG" }
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
        { name: "logo", label: "لوجو الصيدلية", accept: "image/*", required: true, description: "PNG 512×512" },
        { name: "facade", label: "واجهة الصيدلية", accept: "image/*", required: true, description: "JPG 1280px+" },
        { name: "practice_license", label: "ترخيص مزاولة المهنة", accept: ".pdf,.jpg,.jpeg", required: true, description: "PDF/JPG" },
        { name: "commercial_register", label: "السجل التجاري", accept: ".pdf,.jpg,.jpeg", required: true, description: "PDF/JPG" },
        { name: "interior", label: "لافتة داخلية/كونتر", accept: "image/*", required: false, description: "JPG" }
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
        { name: "logo", label: "لوجو العيادة أو صورة الطبيب", accept: "image/*", required: true, description: "PNG/JPG 512×512" },
        { name: "facade", label: "واجهة/الاستقبال", accept: "image/*", required: true, description: "JPG 1280px+" },
        { name: "clinic_license", label: "رخصة العيادة", accept: ".pdf,.jpg,.jpeg", required: true, description: "PDF/JPG" },
        { name: "doctor_id_front", label: "بطاقة الطبيب (الوجه الأمامي)", accept: "image/*", required: true, description: "JPG واضح" },
        { name: "doctor_id_back", label: "بطاقة الطبيب (الوجه الخلفي)", accept: "image/*", required: true, description: "JPG واضح" },
        { name: "certificate", label: "شهادة مزاولة/زمالة", accept: ".pdf,.jpg,.jpeg", required: false, description: "PDF/JPG" }
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
        { name: "id_front", label: "صورة البطاقة (الوجه الأمامي)", accept: "image/*", required: true, description: "JPG واضح" },
        { name: "id_back", label: "صورة البطاقة (الوجه الخلفي)", accept: "image/*", required: true, description: "JPG واضح" },
        { name: "driving_license", label: "رخصة القيادة", accept: ".pdf,.jpg,.jpeg", required: true, description: "JPG/PDF" },
        { name: "vehicle_photo", label: "صورة المركبة + اللوحة", accept: "image/*", required: true, description: "JPG واضحة" },
        { name: "background_check", label: "صحيفة الحالة الجنائية", accept: ".pdf,.jpg,.jpeg", required: false, description: "PDF/JPG" },
        { name: "vehicle_license", label: "رخصة المركبة/ترخيص السير", accept: ".pdf,.jpg,.jpeg", required: false, description: "PDF/JPG" }
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
        { name: "id_front", label: "صورة البطاقة (الوجه الأمامي)", accept: "image/*", required: true, description: "JPG واضح" },
        { name: "id_back", label: "صورة البطاقة (الوجه الخلفي)", accept: "image/*", required: true, description: "JPG واضح" },
        { name: "driving_license", label: "رخصة القيادة", accept: ".pdf,.jpg,.jpeg", required: true, description: "JPG/PDF" },
        { name: "vehicle_photo", label: "صورة المركبة + اللوحة", accept: "image/*", required: true, description: "JPG واضحة" },
        { name: "vehicle_license", label: "رخصة المركبة/ترخيص السير", accept: ".pdf,.jpg,.jpeg", required: true, description: "PDF/JPG" },
        { name: "insurance", label: "تأمين ساري", accept: ".pdf,.jpg,.jpeg", required: true, description: "PDF/JPG" },
        { name: "background_check", label: "صحيفة الحالة الجنائية", accept: ".pdf,.jpg,.jpeg", required: false, description: "PDF/JPG" }
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
