// Registration Widget JavaScript
class RegistrationWidget {
    constructor() {
        this.uploadedFiles = {};
        this.currentActivityType = null;
        this.init();
    }

    init() {
        this.setupLocationDropdowns();
        this.setupActivityTypeChange();
        this.setupImageUploads();
        this.setupFormSubmission();
        this.setupCancelButton();
        this.setupLocationButtons();
    }

    // Location data - المدن والمحافظات المطلوبة فقط
    locations = {
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
    };

    // Document requirements for each activity type
    documentRequirements = {
        restaurant: [
            { name: 'لوجو المطعم', type: 'image', format: 'PNG', size: '512×512', mandatory: true, filename: 'restaurant_logo.png' },
            { name: 'صورة غلاف', type: 'image', format: 'JPG', size: '1200×600', mandatory: true, filename: 'restaurant_cover.jpg' },
            { name: 'واجهة المحل', type: 'image', format: 'JPG', size: '1280px+', mandatory: true, filename: 'restaurant_facade.jpg' },
            { name: 'السجل التجاري', type: 'document', format: 'PDF/JPG', size: 'واضحة', mandatory: true, filename: 'restaurant_cr.pdf' },
            { name: 'رخصة التشغيل', type: 'document', format: 'PDF/JPG', size: 'واضحة', mandatory: true, filename: 'restaurant_op_license.pdf' },
            { name: 'قائمة الطعام', type: 'document', format: 'PDF/JPG', size: 'واضحة', mandatory: false, filename: 'menu.pdf' }
        ],
        supermarket: [
            { name: 'لوجو السوبر ماركت', type: 'image', format: 'PNG', size: '512×512', mandatory: true, filename: 'market_logo.png' },
            { name: 'واجهة/أرفف المتجر', type: 'image', format: 'JPG', size: '1280px+', mandatory: true, filename: 'market_shelves.jpg' },
            { name: 'السجل التجاري', type: 'document', format: 'PDF/JPG', size: 'واضحة', mandatory: true, filename: 'market_cr.pdf' },
            { name: 'رخصة النشاط', type: 'document', format: 'PDF/JPG', size: 'واضحة', mandatory: true, filename: 'market_activity_license.pdf' },
            { name: 'صورة خارجية للمحل', type: 'image', format: 'JPG', size: 'واضحة', mandatory: false, filename: 'market_facade.jpg' }
        ],
        pharmacy: [
            { name: 'لوجو الصيدلية', type: 'image', format: 'PNG', size: '512×512', mandatory: true, filename: 'pharmacy_logo.png' },
            { name: 'واجهة الصيدلية', type: 'image', format: 'JPG', size: '1280px+', mandatory: true, filename: 'pharmacy_facade.jpg' },
            { name: 'ترخيص مزاولة المهنة', type: 'document', format: 'PDF/JPG', size: 'واضحة', mandatory: true, filename: 'pharmacy_practice_license.pdf' },
            { name: 'السجل التجاري', type: 'document', format: 'PDF/JPG', size: 'واضحة', mandatory: true, filename: 'pharmacy_cr.pdf' },
            { name: 'لافتة داخلية/كونتر', type: 'image', format: 'JPG', size: 'واضحة', mandatory: false, filename: 'pharmacy_interior.jpg' }
        ],
        clinic: [
            { name: 'لوجو العيادة أو صورة الطبيب', type: 'image', format: 'PNG/JPG', size: '512×512', mandatory: true, filename: 'clinic_logo.png' },
            { name: 'واجهة/الاستقبال', type: 'image', format: 'JPG', size: '1280px+', mandatory: true, filename: 'clinic_facade.jpg' },
            { name: 'رخصة العيادة', type: 'document', format: 'PDF/JPG', size: 'واضحة', mandatory: true, filename: 'clinic_license.pdf' },
            { name: 'بطاقة الطبيب (الوجه الأمامي)', type: 'image', format: 'JPG', size: 'واضح', mandatory: true, filename: 'doctor_id_front.jpg' },
            { name: 'بطاقة الطبيب (الوجه الخلفي)', type: 'image', format: 'JPG', size: 'واضح', mandatory: true, filename: 'doctor_id_back.jpg' },
            { name: 'شهادة مزاولة/زمالة', type: 'document', format: 'PDF/JPG', size: 'واضحة', mandatory: false, filename: 'doctor_certificate.pdf' }
        ],
        courier: [
            { name: 'صورة البطاقة (الوجه الأمامي)', type: 'image', format: 'JPG', size: 'واضح', mandatory: true, filename: 'id_front.jpg' },
            { name: 'صورة البطاقة (الوجه الخلفي)', type: 'image', format: 'JPG', size: 'واضح', mandatory: true, filename: 'id_back.jpg' },
            { name: 'رخصة القيادة', type: 'document', format: 'JPG/PDF', size: 'واضحة', mandatory: true, filename: 'driving_license.jpg' },
            { name: 'صورة المركبة + اللوحة', type: 'image', format: 'JPG', size: 'واضحة', mandatory: true, filename: 'vehicle_photo.jpg' },
            { name: 'صحيفة الحالة الجنائية', type: 'document', format: 'PDF/JPG', size: 'واضحة', mandatory: false, filename: 'background_check.pdf' },
            { name: 'رخصة المركبة/ترخيص السير', type: 'document', format: 'PDF/JPG', size: 'واضحة', mandatory: false, filename: 'vehicle_license.pdf' }
        ],
        driver: [
            { name: 'صورة البطاقة (الوجه الأمامي)', type: 'image', format: 'JPG', size: 'واضح', mandatory: true, filename: 'id_front.jpg' },
            { name: 'صورة البطاقة (الوجه الخلفي)', type: 'image', format: 'JPG', size: 'واضح', mandatory: true, filename: 'id_back.jpg' },
            { name: 'رخصة القيادة', type: 'document', format: 'JPG/PDF', size: 'واضحة', mandatory: true, filename: 'driving_license.jpg' },
            { name: 'صورة المركبة + اللوحة', type: 'image', format: 'JPG', size: 'واضحة', mandatory: true, filename: 'vehicle_photo.jpg' },
            { name: 'رخصة المركبة', type: 'document', format: 'PDF/JPG', size: 'واضحة', mandatory: true, filename: 'vehicle_license.pdf' },
            { name: 'تأمين ساري', type: 'document', format: 'PDF/JPG', size: 'واضحة', mandatory: true, filename: 'insurance.pdf' },
            { name: 'صحيفة الحالة الجنائية', type: 'document', format: 'PDF/JPG', size: 'واضحة', mandatory: false, filename: 'background_check.pdf' }
        ]
    };

    setupLocationDropdowns() {
        const governorateSelect = document.getElementById('governorate');
        const citySelect = document.getElementById('city');

        if (governorateSelect && citySelect) {
            governorateSelect.addEventListener('change', (e) => {
                const selectedGovernorate = e.target.value;
                this.updateCityDropdown(citySelect, selectedGovernorate);
            });
        }
    }

    updateCityDropdown(citySelect, governorate) {
        citySelect.innerHTML = '<option value="">اختر المدينة</option>';

        if (governorate && this.locations[governorate]) {
            const cities = this.locations[governorate];

            cities.forEach(city => {
                const option = document.createElement('option');
                option.value = city;
                option.textContent = city;
                citySelect.appendChild(option);
            });

            citySelect.disabled = false;
        } else {
            citySelect.disabled = true;
        }
    }

    setupActivityTypeChange() {
        const activityTypeSelect = document.getElementById('activity-type');

        if (activityTypeSelect) {
            activityTypeSelect.addEventListener('change', (e) => {
                this.currentActivityType = e.target.value;
                this.updateImageUploadGrid();
            });
        }
    }

    updateImageUploadGrid() {
        const grid = document.getElementById('image-upload-grid');
        const instructions = document.querySelector('.upload-instructions');

        if (!grid) return;

        if (!this.currentActivityType) {
            instructions.style.display = 'block';
            grid.innerHTML = '';
            return;
        }

        const requirements = this.documentRequirements[this.currentActivityType];
        if (!requirements) return;

        instructions.style.display = 'none';
        grid.innerHTML = '';

        requirements.forEach((req, index) => {
            const uploadItem = this.createUploadItem(req, index);
            grid.appendChild(uploadItem);
        });
    }

    createUploadItem(requirement, index) {
        const item = document.createElement('div');
        item.className = 'image-upload-item';
        item.dataset.requirement = requirement.filename;
        item.dataset.mandatory = requirement.mandatory;

        item.innerHTML = `
            <div class="upload-icon">
                <i class="fas fa-${requirement.type === 'image' ? 'image' : 'file-pdf'}"></i>
            </div>
            <div class="upload-text">${requirement.name}</div>
            <div class="upload-requirement">
                ${requirement.format} - ${requirement.size}
                ${requirement.mandatory ? '<span style="color: var(--color-red-500); font-weight: bold;">*</span>' : ''}
            </div>
            <div class="upload-button">
                <i class="fas fa-cloud-upload-alt"></i>
                اضغط للرفع
            </div>
            <input type="file" class="file-input" accept="${this.getFileAccept(requirement)}" style="display: none;">
            <div class="progress-bar" style="display: none;">
                <div class="progress-fill"></div>
            </div>
        `;

        // Add click event
        item.addEventListener('click', () => {
            const fileInput = item.querySelector('.file-input');
            fileInput.click();
        });

        // Add file change event
        const fileInput = item.querySelector('.file-input');
        fileInput.addEventListener('change', (e) => {
            this.handleFileUpload(e, item, requirement);
        });

        return item;
    }

    getFileAccept(requirement) {
        if (requirement.type === 'image') {
            return 'image/*';
        } else {
            return '.pdf,.jpg,.jpeg,.png';
        }
    }

    handleFileUpload(event, item, requirement) {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file
        if (!this.validateFile(file, requirement)) {
            this.showError('نوع الملف أو الحجم غير مناسب');
            return;
        }

        // Show progress
        const progressBar = item.querySelector('.progress-bar');
        const progressFill = item.querySelector('.progress-fill');
        progressBar.style.display = 'block';

        // Simulate upload progress
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            progressFill.style.width = progress + '%';

            if (progress >= 100) {
                clearInterval(interval);
                this.completeUpload(item, file, requirement);
            }
        }, 100);
    }

    validateFile(file, requirement) {
        // Check file type
        if (requirement.type === 'image') {
            if (!file.type.startsWith('image/')) return false;
        } else {
            const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
            if (!allowedTypes.includes(file.type)) return false;
        }

        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) return false;

        return true;
    }

    completeUpload(item, file, requirement) {
        // Hide progress bar
        const progressBar = item.querySelector('.progress-bar');
        progressBar.style.display = 'none';

        // Update item appearance
        item.classList.add('uploaded');

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            const preview = document.createElement('img');
            preview.src = e.target.result;
            preview.className = 'uploaded-image';

            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-image';
            removeBtn.innerHTML = '<i class="fas fa-trash"></i> إزالة';
            removeBtn.onclick = () => this.removeFile(item, requirement);

            // Replace content
            item.innerHTML = '';
            item.appendChild(preview);
            item.appendChild(removeBtn);
        };
        reader.readAsDataURL(file);

        // Store file
        this.uploadedFiles[requirement.filename] = file;
    }

    removeFile(item, requirement) {
        // Reset item
        item.classList.remove('uploaded');
        item.innerHTML = `
            <div class="upload-icon">
                <i class="fas fa-${requirement.type === 'image' ? 'image' : 'file-pdf'}"></i>
            </div>
            <div class="upload-text">${requirement.name}</div>
            <div class="upload-requirement">
                ${requirement.format} - ${requirement.size}
                ${requirement.mandatory ? '<span style="color: var(--color-red-500); font-weight: bold;">*</span>' : ''}
            </div>
            <div class="upload-button">
                <i class="fas fa-cloud-upload-alt"></i>
                اضغط للرفع
            </div>
            <input type="file" class="file-input" accept="${this.getFileAccept(requirement)}" style="display: none;">
            <div class="progress-bar" style="display: none;">
                <div class="progress-fill"></div>
            </div>
        `;

        // Re-add events
        item.addEventListener('click', () => {
            const fileInput = item.querySelector('.file-input');
            fileInput.click();
        });

        const fileInput = item.querySelector('.file-input');
        fileInput.addEventListener('change', (e) => {
            this.handleFileUpload(e, item, requirement);
        });

        // Remove from uploaded files
        delete this.uploadedFiles[requirement.filename];
    }

    setupImageUploads() {
        // This will be called when activity type changes
    }

    setupFormSubmission() {
        const form = document.getElementById('registration-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission();
            });
        }
    }

    setupCancelButton() {
        const cancelBtn = document.getElementById('cancel-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                if (confirm('هل أنت متأكد من إلغاء التسجيل؟')) {
                    window.close();
                }
            });
        }
    }

    setupLocationButtons() {
        const getCurrentLocationBtn = document.getElementById('get-current-location');
        const selectOnMapBtn = document.getElementById('select-on-map');

        if (getCurrentLocationBtn) {
            getCurrentLocationBtn.addEventListener('click', () => {
                this.getCurrentLocation();
            });
        }

        if (selectOnMapBtn) {
            selectOnMapBtn.addEventListener('click', () => {
                this.selectOnMap();
            });
        }
    }

    getCurrentLocation() {
        if (!navigator.geolocation) {
            alert('المتصفح لا يدعم تحديد الموقع الجغرافي');
            return;
        }

        const locationInfo = document.getElementById('location-info');
        const locationText = document.getElementById('location-text');

        locationText.textContent = 'جاري تحديد الموقع...';
        locationInfo.style.display = 'flex';

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                locationText.textContent = `تم تحديد الموقع: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
                locationInfo.style.background = 'var(--color-green-50)';
                locationInfo.style.color = 'var(--color-green-500)';
                locationInfo.style.borderColor = 'var(--color-green-200)';

                // Store coordinates
                this.userLocation = { lat, lng };
            },
            (error) => {
                locationText.textContent = 'فشل في تحديد الموقع';
                locationInfo.style.background = 'var(--color-red-50)';
                locationInfo.style.color = 'var(--color-red-500)';
                locationInfo.style.borderColor = 'var(--color-red-200)';
            }
        );
    }

    selectOnMap() {
        alert('ميزة اختيار الموقع على الخريطة ستكون متاحة قريباً');
    }

    handleFormSubmission() {
        // Validate form
        if (!this.validateForm()) {
            return;
        }

        // Show loading
        const submitBtn = document.getElementById('submit-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري إنشاء الحساب...';
        submitBtn.disabled = true;

        // Collect form data
        const formData = this.collectFormData();

        // Simulate API call
        setTimeout(() => {
            this.showSuccess();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 3000);
    }

    validateForm() {
        // Check required fields
        const requiredFields = ['first-name', 'last-name', 'phone', 'email', 'governorate', 'city', 'address', 'activity-type', 'password', 'confirm-password'];

        for (const fieldId of requiredFields) {
            const field = document.getElementById(fieldId);
            if (!field || !field.value.trim()) {
                this.showError(`يرجى ملء حقل ${field.previousElementSibling.textContent}`);
                field.focus();
                return false;
            }
        }

        // Check password match
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        if (password !== confirmPassword) {
            this.showError('كلمة المرور وتأكيدها غير متطابقتين');
            return false;
        }

        // Check terms acceptance
        const termsAccepted = document.getElementById('terms-acceptance').checked;
        if (!termsAccepted) {
            this.showError('يجب الموافقة على الشروط والأحكام');
            return false;
        }

        // Check mandatory files
        if (this.currentActivityType) {
            const requirements = this.documentRequirements[this.currentActivityType];
            const mandatoryFiles = requirements.filter(req => req.mandatory);

            for (const req of mandatoryFiles) {
                if (!this.uploadedFiles[req.filename]) {
                    this.showError(`يرجى رفع الملف المطلوب: ${req.name}`);
                    return false;
                }
            }
        }

        return true;
    }

    collectFormData() {
        return {
            firstName: document.getElementById('first-name').value,
            lastName: document.getElementById('last-name').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            governorate: document.getElementById('governorate').value,
            city: document.getElementById('city').value,
            address: document.getElementById('address').value,
            activityType: document.getElementById('activity-type').value,
            password: document.getElementById('password').value,
            uploadedFiles: this.uploadedFiles
        };
    }

    showError(message) {
        alert('خطأ: ' + message);
    }

    showSuccess() {
        alert('تم إنشاء الحساب بنجاح! سيتم إرسال رابط التحقق إلى بريدك الإلكتروني.');
        // Redirect to verification page or close widget
        window.close();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new RegistrationWidget();
});
