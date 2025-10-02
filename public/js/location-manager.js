/**
 * LUXBYTE Location Manager
 * مدير المحافظات والمدن لـ LUXBYTE
 */

// بيانات المحافظات والمدن المدعومة
const LOCATION_DATA = {
    'القاهرة': [
        'مدينة نصر',
        'المعادي',
        'الزمالك',
        'وسط البلد',
        'مصر الجديدة',
        'المقطم',
        'التجمع الخامس',
        'الرحاب',
        'مدينتي',
        'الشروق',
        'العبور',
        'حلوان',
        'المطرية',
        'عين شمس',
        'الخليفة',
        'السيدة زينب',
        'الجمالية',
        'عابدين',
        'الموسكي',
        'باب الشعرية'
    ],
    'الجيزة': [
        'المهندسين',
        'الدقي',
        'الزمالك',
        'الهرم',
        'فيصل',
        'العجوزة',
        '6 أكتوبر',
        'الشيخ زايد',
        'البدرشين',
        'الحوامدية',
        'العياط',
        'كرداسة',
        'أوسيم',
        'الوراق',
        'إمبابة',
        'بولاق الدكرور',
        'الطالبية',
        'المنيب',
        'الصف',
        'أطفيح'
    ],
    'القليوبية': [
        'العبور',
        'شبرا الخيمة',
        'بنها',
        'الخصوص'
    ]
};

class LocationManager {
    constructor() {
        this.init();
    }

    /**
     * تهيئة مدير المواقع
     */
    init() {
        this.setupEventListeners();
        this.initializeLocationFields();
        console.log('📍 Location Manager initialized');
    }

    /**
     * إعداد مستمعي الأحداث
     */
    setupEventListeners() {
        document.addEventListener('change', (e) => {
            if (e.target.id === 'governorate' || e.target.name === 'governorate') {
                this.updateCities(e.target);
            }
        });
    }

    /**
     * تهيئة حقول المواقع في جميع النماذج
     */
    initializeLocationFields() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            this.addLocationFields(form);
        });
    }

    /**
     * إضافة حقول المحافظة والمدينة للنموذج
     */
    addLocationFields(form) {
        // البحث عن حقل المدينة الموجود
        const cityField = form.querySelector('input[name="city"], select[name="city"]');
        if (!cityField) return;

        // إنشاء حقل المحافظة
        const governorateField = this.createGovernorateField();

        // إنشاء حقل المدينة الجديد
        const newCityField = this.createCityField();

        // إدراج حقل المحافظة قبل حقل المدينة
        cityField.parentNode.insertBefore(governorateField, cityField);

        // استبدال حقل المدينة القديم بالجديد
        cityField.parentNode.replaceChild(newCityField, cityField);
    }

    /**
     * إنشاء حقل المحافظة
     */
    createGovernorateField() {
        const fieldGroup = document.createElement('div');
        fieldGroup.className = 'form-group';

        fieldGroup.innerHTML = `
            <label for="governorate" class="form-label">
                <i class="fas fa-map-marker-alt"></i>
                المحافظة *
            </label>
            <select name="governorate" id="governorate" class="form-control" required>
                <option value="">اختر المحافظة</option>
                ${Object.keys(LOCATION_DATA).map(gov =>
                    `<option value="${gov}">${gov}</option>`
                ).join('')}
            </select>
        `;

        return fieldGroup;
    }

    /**
     * إنشاء حقل المدينة
     */
    createCityField() {
        const fieldGroup = document.createElement('div');
        fieldGroup.className = 'form-group';

        fieldGroup.innerHTML = `
            <label for="city" class="form-label">
                <i class="fas fa-building"></i>
                المدينة *
            </label>
            <select name="city" id="city" class="form-control" required disabled>
                <option value="">اختر المحافظة أولاً</option>
            </select>
        `;

        return fieldGroup;
    }

    /**
     * تحديث قائمة المدن عند اختيار المحافظة
     */
    updateCities(governorateSelect) {
        const selectedGovernorate = governorateSelect.value;
        const citySelect = governorateSelect.closest('form').querySelector('select[name="city"]');

        if (!citySelect) return;

        // مسح الخيارات الحالية
        citySelect.innerHTML = '';

        if (selectedGovernorate && LOCATION_DATA[selectedGovernorate]) {
            // إضافة خيار "اختر المدينة"
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'اختر المدينة';
            citySelect.appendChild(defaultOption);

            // إضافة مدن المحافظة
            LOCATION_DATA[selectedGovernorate].forEach(city => {
                const option = document.createElement('option');
                option.value = city;
                option.textContent = city;
                citySelect.appendChild(option);
            });

            // تفعيل حقل المدينة
            citySelect.disabled = false;
            citySelect.required = true;
        } else {
            // إضافة خيار افتراضي
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'اختر المحافظة أولاً';
            citySelect.appendChild(defaultOption);

            // تعطيل حقل المدينة
            citySelect.disabled = true;
            citySelect.required = false;
        }
    }

    /**
     * الحصول على المدن المتاحة لمحافظة معينة
     */
    getCitiesForGovernorate(governorate) {
        return LOCATION_DATA[governorate] || [];
    }

    /**
     * التحقق من صحة البيانات
     */
    validateLocation(governorate, city) {
        if (!governorate || !city) {
            return { valid: false, message: 'يرجى اختيار المحافظة والمدينة' };
        }

        const availableCities = this.getCitiesForGovernorate(governorate);
        if (!availableCities.includes(city)) {
            return { valid: false, message: 'المدينة المختارة غير متاحة في هذه المحافظة' };
        }

        return { valid: true };
    }
}

// تهيئة مدير المواقع عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    window.locationManager = new LocationManager();
});

// تصدير للاستخدام في المودولات
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LocationManager;
}
