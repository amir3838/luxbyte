// قاموس الترجمة الجديد
const i18nDict = {
  ar: {
    // Brand
    "brand.luxbyte":"لوكس بايت","brand.luxbyte_llc":"شركة لوكس بايت المحدودة المسئولية","brand.shop_eg":"شوب إي جي","brand.master_driver":"ماستر درايفر",

    // Navigation
    "nav.home":"الرئيسية","nav.choose_platform":"اختر منصتك","nav.dashboard":"لوحة المراجعة","nav.logout":"تسجيل الخروج","nav.contact":"التواصل","nav.login":"تسجيل الدخول","nav.signup":"إنشاء حساب","nav.start_now":"ابدأ الآن",

    // Home Page
    "home.company_full":"شركة لوكس بايت المحدودة المسئولية","home.tagline":"منصة شاملة للتجارة الإلكترونية وخدمات التوصيل، تقدم حلول متكاملة للمنشآت التجارية والأفراد في مصر. انضم إلينا واكتشف عالمًا جديدًا من الفرص التجارية.","home.cta_start_journey":"ابدأ رحلتك الآن","home.choose_platform":"اختر منصتك",

    // ShopEG
    "home.shop_eg.title":"شوب إي جي","home.shop_eg.subtitle":"منصة التجارة الإلكترونية","home.shop_eg.desc":"منصة متكاملة للتجارة الإلكترونية تتيح للمنشآت التجارية إنشاء متاجرها الإلكترونية وإدارة طلباتها بسهولة. مناسب للمطاعم، السوبر ماركت، الصيدليات، العيادات، ومندوبي التوصيل.","home.shop_eg.features.advanced_orders":"إدارة طلبات متقدمة","home.shop_eg.features.secure_payments":"نظام دفع آمن","home.shop_eg.features.detailed_reports":"تقارير مفصلة","home.shop_eg.features.support_247":"دعم فني 24/7","home.shop_eg.cta":"ابدأ مع شوب إي جي",

    // Master Driver
    "home.master_driver.title":"ماستر درايفر","home.master_driver.subtitle":"منصة خدمات التوصيل","home.master_driver.desc":"منصة متخصصة في خدمات التوصيل والنقل، تربط بين العملاء ومندوبي التوصيل لتقديم خدمة توصيل سريعة وموثوقة في جميع أنحاء مصر.","home.master_driver.features.live_tracking":"تتبع الطلبات في الوقت الفعلي","home.master_driver.features.rating_system":"نظام تقييم متقدم","home.master_driver.features.secure_pay":"دفع آمن ومضمون","home.master_driver.features.city_coverage":"تغطية شاملة للمدن","home.master_driver.cta":"ابدأ مع ماستر درايفر",

    // Features Block
    "home.features_block.title":"لماذا لوكس بايت؟","home.features_block.security_title":"أمان وموثوقية","home.features_block.security_desc":"نستخدم أحدث تقنيات الأمان لحماية بياناتك ومعاملاتك المالية","home.features_block.ease_title":"سهولة الاستخدام","home.features_block.ease_desc":"واجهة بسيطة وسهلة الاستخدام تعمل على جميع الأجهزة","home.features_block.support_title":"دعم فني متميز","home.features_block.support_desc":"فريق دعم فني متخصص متاح على مدار الساعة لمساعدتك","home.features_block.reports_title":"تقارير مفصلة","home.features_block.reports_desc":"احصل على تقارير مفصلة عن أداء عملك واتخاذ قرارات مدروسة",

    // CTA Block
    "home.cta_block.title":"جاهز للبدء؟","home.cta_block.desc":"انضم إلى آلاف العملاء الذين يثقون في لوكس بايت لتطوير أعمالهم","home.cta_block.start_now":"ابدأ الآن","home.cta_block.contact_us":"تواصل معنا",

    // Social
    "home.social.title":"روابط التواصل","home.social.facebook":"فيسبوك","home.social.instagram":"إنستجرام","home.social.tiktok":"تيك توك","home.social.whatsapp":"واتساب","home.social.call_us":"اتصل بنا",

    // Footer
    "home.footer.copyright":"© 2024 شركة لوكس بايت المحدودة المسئولية. جميع الحقوق محفوظة.","home.footer.company_line":"شركة لوكس بايت المحدودة المسئولية - مصر",

    // Choose Platform
    "choose_platform.title":"اختيار المنصة - لوكس بايت","choose_platform.heading":"اختر منصة لوكس بايت المناسبة لك","choose_platform.subheading":"اختر منصتك","choose_platform.helper":"اختر المنصة المناسبة لاحتياجاتك",
    "choose_platform.shop_eg.subtitle":"منصة التجارة الإلكترونية","choose_platform.shop_eg.desc":"منصة متكاملة للتجارة الإلكترونية تتيح للمنشآت التجارية إنشاء متاجرها الإلكترونية وإدارة طلباتها بسهولة. مناسب للمطاعم، السوبر ماركت، الصيدليات، العيادات، ومندوبي التوصيل.","choose_platform.shop_eg.roles_title":"الأدوار المتاحة:","choose_platform.shop_eg.roles":"مطعم, سوبر ماركت, صيدلية, عيادة, مندوب توصيل","choose_platform.shop_eg.features":"إدارة طلبات متقدمة, نظام دفع آمن, تقارير مفصلة, دعم فني 24/7","choose_platform.shop_eg.cta":"ابدأ مع شوب إي جي",
    "choose_platform.master_driver.subtitle":"منصة خدمات التوصيل","choose_platform.master_driver.desc":"منصة متخصصة في خدمات التوصيل والنقل...","choose_platform.master_driver.roles_title":"الأدوار المتاحة:","choose_platform.master_driver.roles":"سائق رئيسي","choose_platform.master_driver.features":"تتبع الطلبات في الوقت الفعلي, نظام تقييم متقدم","choose_platform.master_driver.cta":"ابدأ مع ماستر درايفر",

    // Choose Role
    "choose_role.title":"اختيار النشاط - لوكس بايت","choose_role.heading":"اختر نوع النشاط المناسب لك في منصة شوب إي جي","choose_role.breadcrumb_back":"العودة لاختيار المنصة","choose_role.panel":"لوحة المراجعة","choose_role.logout":"تسجيل الخروج","choose_role.choose_activity":"اختر نوع النشاط","choose_role.helper":"اختر النشاط المناسب لك في منصة شوب إي جي",
    "choose_role.restaurant.title":"مطعم","choose_role.restaurant.subtitle":"إدارة المطاعم والوجبات","choose_role.restaurant.desc":"منصة متكاملة لإدارة المطاعم...","choose_role.restaurant.features_title":"المميزات:","choose_role.restaurant.features":"إدارة قائمة الطعام, تتبع الطلبات, إدارة العملاء, تقارير المبيعات","choose_role.restaurant.cta":"اختر المطعم",
    "choose_role.supermarket.title":"سوبر ماركت","choose_role.supermarket.subtitle":"إدارة المتاجر الكبرى","choose_role.supermarket.desc":"حل متكامل لإدارة السوبر ماركت...","choose_role.supermarket.features":"إدارة المخزون, نظام نقاط البيع, التوصيل المنزلي, تقارير مالية","choose_role.supermarket.cta":"اختر السوبر ماركت",
    "choose_role.pharmacy.title":"صيدلية",

    // Auth
    "auth.title":"تسجيل الدخول - لوكس بايت","auth.subtitle":"تسجيل الدخول أو إنشاء حساب جديد في لوكس بايت","auth.welcome":"مرحباً بك في لوكس بايت","auth.email":"البريد الإلكتروني","auth.password":"كلمة المرور","auth.password_ph":"أدخل كلمة المرور","auth.remember_me":"تذكرني","auth.sign_in":"تسجيل الدخول","auth.no_account":"ليس لديك حساب؟","auth.create_account":"إنشاء حساب جديد",
    "auth.signup_title":"تسجيل البيانات - لوكس بايت","auth.signup_subtitle":"تسجيل البيانات والمستندات المطلوبة","auth.join_today":"انضم إلى لوكس بايت اليوم","auth.confirm_password":"تأكيد كلمة المرور","auth.confirm_password_ph":"أكد كلمة المرور","auth.agree_terms":"أوافق على الشروط والأحكام","auth.have_account":"لديك حساب بالفعل؟","auth.signin":"تسجيل الدخول",
    "auth.fill_all_fields":"يرجى ملء جميع الحقول","auth.signing_in":"جاري تسجيل الدخول...","auth.success":"تم تسجيل الدخول بنجاح","auth.error":"خطأ في تسجيل الدخول",

    // Registration
    "reg.title":"تسجيل البيانات - لوكس بايت","reg.heading":"تسجيل البيانات","reg.helper":"املأ البيانات المطلوبة","reg.personal.title":"البيانات الشخصية","reg.personal.helper":"املأ البيانات الشخصية الأساسية","reg.first_name":"الاسم الأول","reg.first_name_ph":"أدخل اسمك الأول","reg.last_name":"اسم العائلة","reg.last_name_ph":"أدخل اسم العائلة","reg.email":"البريد الإلكتروني","reg.phone":"رقم الهاتف","reg.password":"كلمة المرور","reg.password_ph":"أدخل كلمة المرور","reg.password_confirm":"تأكيد كلمة المرور","reg.password_confirm_ph":"أكد كلمة المرور","reg.location_activity_title":"الموقع والنشاط","reg.governorate":"المحافظة","reg.governorate_ph":"اختر المحافظة","reg.gov.cairo":"القاهرة","reg.gov.giza":"الجيزة","reg.gov.qalyubia":"القليوبية","reg.city":"المدينة","reg.city_ph":"اختر المدينة","reg.address":"العنوان التفصيلي","reg.get_location":"GPS",

    // Dashboard
    "dashboard.title":"لوحة المراجعة - لوكس بايت","dashboard.subtitle":"مراجعة وإدارة طلبات التسجيل","dashboard.new_registration":"تسجيل جديد","dashboard.tabs.courier":"مندوب توصيل","dashboard.tabs.clinic":"عيادة","dashboard.tabs.pharmacy":"صيدلية","dashboard.tabs.supermarket":"سوبر ماركت","dashboard.tabs.restaurant":"مطعم","dashboard.cards.total_requests":"إجمالي الطلبات","dashboard.status.pending":"في الانتظار","dashboard.status.approved":"مقبولة","dashboard.status.rejected":"مرفوضة","dashboard.empty_title":"لا توجد طلبات","dashboard.empty_subtitle":"لا توجد طلبات حالياً","dashboard.table.email":"البريد الإلكتروني","dashboard.table.date":"تاريخ الطلب","dashboard.table.status":"الحالة","dashboard.table.data":"البيانات","dashboard.table.files":"الملفات","dashboard.table.actions":"الإجراءات","dashboard.action.view":"عرض","dashboard.action.files":"ملفات",

    // Contact
    "contact.title":"التواصل معنا - لوكس بايت","contact.subtitle":"تواصل مع لوكس بايت عبر قنوات التواصل المختلفة","contact.start_now":"ابدأ الآن","contact.heading":"تواصل معنا","contact.help_anytime":"نحن هنا لمساعدتك في أي وقت","contact.call_us":"اتصل بنا","contact.call_desc":"تواصل معنا مباشرة عبر الهاتف للحصول على المساعدة الفورية","contact.whatsapp":"واتساب","contact.whatsapp_desc":"راسلنا على واتساب للحصول على رد سريع ومباشر","contact.message_on_whatsapp":"راسلنا على واتساب","contact.follow_us":"تابعنا على وسائل التواصل الاجتماعي","contact.company_info":"معلومات الشركة","contact.company_name_label":"اسم الشركة:","contact.company_name_value":"شركة لوكس بايت المحدودة المسئولية","contact.location_label":"الموقع:","contact.location_value":"مصر - القاهرة","contact.hours_label":"ساعات العمل:","contact.hours_value":"24/7 - خدمة عملاء على مدار الساعة","contact.services.shop_eg":"منصة شوب إي جي للتجارة الإلكترونية","contact.services.master_driver":"منصة ماستر درايفر للتوصيل","contact.services.premium_support":"دعم فني متخصص","contact.services.security":"حماية وأمان البيانات","contact.faq":"الأسئلة الشائعة"
  },
  en: {
    // Brand
    "brand.luxbyte":"LUXBYTE","brand.luxbyte_llc":"LUXBYTE LLC","brand.shop_eg":"ShopEG","brand.master_driver":"Master Driver",

    // Navigation
    "nav.home":"Home","nav.choose_platform":"Choose your platform","nav.dashboard":"Review Panel","nav.logout":"Sign out","nav.contact":"Contact","nav.login":"Sign in","nav.signup":"Sign Up","nav.start_now":"Get started",

    // Home Page
    "home.company_full":"LUXBYTE LLC","home.tagline":"A comprehensive platform for e-commerce and delivery services, offering integrated solutions for businesses and individuals in Egypt. Join us and discover a new world of business opportunities.","home.cta_start_journey":"Start your journey now","home.choose_platform":"Choose your platform",

    // ShopEG
    "home.shop_eg.title":"ShopEG","home.shop_eg.subtitle":"E-commerce platform","home.shop_eg.desc":"An integrated e-commerce platform enabling businesses to create their online stores and manage orders with ease. Suitable for restaurants, supermarkets, pharmacies, clinics, and couriers.","home.shop_eg.features.advanced_orders":"Advanced order management","home.shop_eg.features.secure_payments":"Secure payment system","home.shop_eg.features.detailed_reports":"Detailed reports","home.shop_eg.features.support_247":"24/7 support","home.shop_eg.cta":"Get started with ShopEG",

    // Master Driver
    "home.master_driver.title":"Master Driver","home.master_driver.subtitle":"Delivery services platform","home.master_driver.desc":"A specialized delivery and transportation platform connecting customers with couriers for fast, reliable service across Egypt.","home.master_driver.features.live_tracking":"Real-time order tracking","home.master_driver.features.rating_system":"Advanced rating system","home.master_driver.features.secure_pay":"Secure and guaranteed payments","home.master_driver.features.city_coverage":"Wide coverage across cities","home.master_driver.cta":"Get started with Master Driver",

    // Features Block
    "home.features_block.title":"Why LUXBYTE?","home.features_block.security_title":"Security & reliability","home.features_block.security_desc":"We use the latest security technologies to protect your data and financial transactions.","home.features_block.ease_title":"Ease of use","home.features_block.ease_desc":"A simple, easy-to-use interface that works on all devices.","home.features_block.support_title":"Premium support","home.features_block.support_desc":"A dedicated technical support team available around the clock.","home.features_block.reports_title":"Detailed reports","home.features_block.reports_desc":"Get detailed insights into your performance and make informed decisions.",

    // CTA Block
    "home.cta_block.title":"Ready to get started?","home.cta_block.desc":"Join thousands who trust LUXBYTE to grow their business.","home.cta_block.start_now":"Get started now","home.cta_block.contact_us":"Contact us",

    // Social
    "home.social.title":"Social links","home.social.facebook":"Facebook","home.social.instagram":"Instagram","home.social.tiktok":"TikTok","home.social.whatsapp":"WhatsApp","home.social.call_us":"Call us",

    // Footer
    "home.footer.copyright":"© 2024 LUXBYTE LLC. All rights reserved.","home.footer.company_line":"LUXBYTE LLC — Egypt",

    // Choose Platform
    "choose_platform.title":"Choose Platform — LUXBYTE","choose_platform.heading":"Choose the LUXBYTE platform that fits you","choose_platform.subheading":"Choose your platform","choose_platform.helper":"Select the platform that matches your needs",
    "choose_platform.shop_eg.subtitle":"E-commerce platform","choose_platform.shop_eg.desc":"An integrated e-commerce platform that enables businesses to create online stores and manage orders easily.","choose_platform.shop_eg.roles_title":"Available roles:","choose_platform.shop_eg.roles":"Restaurant, Supermarket, Pharmacy, Clinic, Courier","choose_platform.shop_eg.features":"Advanced order management, Secure payment system, Detailed reports, 24/7 support","choose_platform.shop_eg.cta":"Get started with ShopEG",
    "choose_platform.master_driver.subtitle":"Delivery services platform","choose_platform.master_driver.desc":"A specialized delivery and transportation platform...","choose_platform.master_driver.roles_title":"Available roles:","choose_platform.master_driver.roles":"Lead driver","choose_platform.master_driver.features":"Real-time tracking, Advanced rating system","choose_platform.master_driver.cta":"Get started with Master Driver",

    // Choose Role
    "choose_role.title":"Choose Activity — LUXBYTE","choose_role.heading":"Choose the appropriate activity on ShopEG","choose_role.breadcrumb_back":"Back to platform selection","choose_role.panel":"Review Panel","choose_role.logout":"Sign out","choose_role.choose_activity":"Choose activity","choose_role.helper":"Pick the activity that suits you on ShopEG",
    "choose_role.restaurant.title":"Restaurant","choose_role.restaurant.subtitle":"Restaurant & meals management","choose_role.restaurant.desc":"An integrated solution for restaurants to manage menus, orders, customers, and delivery.","choose_role.restaurant.features_title":"Features:","choose_role.restaurant.features":"Menu management, Order tracking, Customer management, Sales reports","choose_role.restaurant.cta":"Choose Restaurant",
    "choose_role.supermarket.title":"Supermarket","choose_role.supermarket.subtitle":"Large-store management","choose_role.supermarket.desc":"A complete solution for supermarkets including inventory, sales, customers, and home delivery.","choose_role.supermarket.features":"Inventory management, Point of Sale (POS), Home delivery, Financial reports","choose_role.supermarket.cta":"Choose Supermarket",
    "choose_role.pharmacy.title":"Pharmacy",

    // Auth
    "auth.title":"Sign in — LUXBYTE","auth.subtitle":"Sign in or create a new account in LUXBYTE","auth.welcome":"Welcome to LUXBYTE","auth.email":"Email","auth.password":"Password","auth.password_ph":"Enter your password","auth.remember_me":"Remember me","auth.sign_in":"Sign in","auth.no_account":"Don't have an account?","auth.create_account":"Create a new account",
    "auth.signup_title":"Create Account — LUXBYTE","auth.signup_subtitle":"Register your information and required documents","auth.join_today":"Join LUXBYTE today","auth.confirm_password":"Confirm password","auth.confirm_password_ph":"Confirm your password","auth.agree_terms":"I agree to the Terms & Conditions","auth.have_account":"Already have an account?","auth.signin":"Sign in",
    "auth.fill_all_fields":"Please fill in all fields","auth.signing_in":"Signing in...","auth.success":"Signed in successfully","auth.error":"Sign-in error",

    // Registration
    "reg.title":"Registration — LUXBYTE","reg.heading":"Registration","reg.helper":"Fill in the required information","reg.personal.title":"Personal information","reg.personal.helper":"Enter your basic personal details","reg.first_name":"First name","reg.first_name_ph":"Enter your first name","reg.last_name":"Last name","reg.last_name_ph":"Enter your last name","reg.email":"Email","reg.phone":"Phone number","reg.password":"Password","reg.password_ph":"Enter your password","reg.password_confirm":"Confirm password","reg.password_confirm_ph":"Confirm your password","reg.location_activity_title":"Location & activity","reg.governorate":"Governorate","reg.governorate_ph":"Select governorate","reg.gov.cairo":"Cairo","reg.gov.giza":"Giza","reg.gov.qalyubia":"Qalyubia","reg.city":"City","reg.city_ph":"Select city","reg.address":"Detailed address","reg.get_location":"GPS",

    // Dashboard
    "dashboard.title":"Review Panel — LUXBYTE","dashboard.subtitle":"Review and manage registration requests","dashboard.new_registration":"New registration","dashboard.tabs.courier":"Courier","dashboard.tabs.clinic":"Clinic","dashboard.tabs.pharmacy":"Pharmacy","dashboard.tabs.supermarket":"Supermarket","dashboard.tabs.restaurant":"Restaurant","dashboard.cards.total_requests":"Total requests","dashboard.status.pending":"Pending","dashboard.status.approved":"Approved","dashboard.status.rejected":"Rejected","dashboard.empty_title":"No requests","dashboard.empty_subtitle":"No requests at the moment","dashboard.table.email":"Email","dashboard.table.date":"Request date","dashboard.table.status":"Status","dashboard.table.data":"Data","dashboard.table.files":"Files","dashboard.table.actions":"Actions","dashboard.action.view":"View","dashboard.action.files":"Files",

    // Contact
    "contact.title":"Contact Us — LUXBYTE","contact.subtitle":"Get in touch with LUXBYTE through different channels","contact.start_now":"Get started","contact.heading":"Contact us","contact.help_anytime":"We're here to help you anytime","contact.call_us":"Call us","contact.call_desc":"Contact us directly by phone for immediate assistance","contact.whatsapp":"WhatsApp","contact.whatsapp_desc":"Message us on WhatsApp for a quick, direct reply","contact.message_on_whatsapp":"Message on WhatsApp","contact.follow_us":"Follow us on social media","contact.company_info":"Company information","contact.company_name_label":"Company name:","contact.company_name_value":"LUXBYTE LLC — LUXBYTE Limited Liability Company","contact.location_label":"Location:","contact.location_value":"Egypt — Cairo","contact.hours_label":"Working hours:","contact.hours_value":"24/7 — Around-the-clock customer support","contact.services.shop_eg":"ShopEG e-commerce platform","contact.services.master_driver":"Master Driver delivery platform","contact.services.premium_support":"Dedicated technical support","contact.services.security":"Data protection & security","contact.faq":"FAQ"
  }
};
