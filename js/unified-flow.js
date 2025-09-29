// Unified Flow JavaScript
class UnifiedFlow {
    constructor() {
        this.currentStep = 1;
        this.selectedService = null;
        this.selectedRole = null;
        this.uploadedFiles = {};
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupLocationDropdowns();
        this.setupLoginModal();
    }

    // Location data
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

    // Role definitions
    roles = {
        shopeg: [
            { id: 'restaurant', name: 'مطعم', icon: 'fas fa-utensils' },
            { id: 'supermarket', name: 'سوبر ماركت', icon: 'fas fa-shopping-cart' },
            { id: 'pharmacy', name: 'صيدلية', icon: 'fas fa-pills' },
            { id: 'clinic', name: 'عيادة', icon: 'fas fa-stethoscope' },
            { id: 'courier', name: 'مندوب توصيل', icon: 'fas fa-motorcycle' }
        ],
        masterdriver: [
            { id: 'driver', name: 'سائق رئيسي', icon: 'fas fa-car' }
        ]
    };

    // Document requirements
    documentRequirements = {
        restaurant: [
            { name: 'لوجو المطعم', type: 'image', format: 'PNG', size: '512×512', mandatory: true, filename: 'restaurant_logo.png' },
            { name: 'صورة غلاف', type: 'image', format: 'JPG', size: '1200×600', mandatory: true, filename: 'restaurant_cover.jpg' },
            { name: 'واجهة المحل', type: 'image', format: 'JPG', size: '1280px+', mandatory: true, filename: 'restaurant_facade.jpg' },
            { name: 'السجل التجاري', type: 'document', format: 'PDF/JPG', size: 'واضحة', mandatory: true, filename: 'restaurant_cr.pdf' },
            { name: 'رخصة التشغيل', type: 'document', format: 'PDF/JPG', size: 'واضحة', mandatory: true, filename: 'restaurant_op_license.pdf' }
        ],
        supermarket: [
            { name: 'لوجو السوبر ماركت', type: 'image', format: 'PNG', size: '512×512', mandatory: true, filename: 'market_logo.png' },
            { name: 'واجهة/أرفف المتجر', type: 'image', format: 'JPG', size: '1280px+', mandatory: true, filename: 'market_shelves.jpg' },
            { name: 'السجل التجاري', type: 'document', format: 'PDF/JPG', size: 'واضحة', mandatory: true, filename: 'market_cr.pdf' },
            { name: 'رخصة النشاط', type: 'document', format: 'PDF/JPG', size: 'واضحة', mandatory: true, filename: 'market_activity_license.pdf' }
        ],
        pharmacy: [
            { name: 'لوجو الصيدلية', type: 'image', format: 'PNG', size: '512×512', mandatory: true, filename: 'pharmacy_logo.png' },
            { name: 'واجهة الصيدلية', type: 'image', format: 'JPG', size: '1280px+', mandatory: true, filename: 'pharmacy_facade.jpg' },
            { name: 'ترخيص مزاولة المهنة', type: 'document', format: 'PDF/JPG', size: 'واضحة', mandatory: true, filename: 'pharmacy_practice_license.pdf' },
            { name: 'السجل التجاري', type: 'document', format: 'PDF/JPG', size: 'واضحة', mandatory: true, filename: 'pharmacy_cr.pdf' }
        ],
        clinic: [
            { name: 'لوجو العيادة أو صورة الطبيب', type: 'image', format: 'PNG/JPG', size: '512×512', mandatory: true, filename: 'clinic_logo.png' },
            { name: 'واجهة/الاستقبال', type: 'image', format: 'JPG', size: '1280px+', mandatory: true, filename: 'clinic_facade.jpg' },
            { name: 'رخصة العيادة', type: 'document', format: 'PDF/JPG', size: 'واضحة', mandatory: true, filename: 'clinic_license.pdf' },
            { name: 'بطاقة الطبيب (الوجه الأمامي)', type: 'image', format: 'JPG', size: 'واضح', mandatory: true, filename: 'doctor_id_front.jpg' },
            { name: 'بطاقة الطبيب (الوجه الخلفي)', type: 'image', format: 'JPG', size: 'واضح', mandatory: true, filename: 'doctor_id_back.jpg' }
        ],
        courier: [
            { name: 'صورة البطاقة (الوجه الأمامي)', type: 'image', format: 'JPG', size: 'واضح', mandatory: true, filename: 'id_front.jpg' },
            { name: 'صورة البطاقة (الوجه الخلفي)', type: 'image', format: 'JPG', size: 'واضح', mandatory: true, filename: 'id_back.jpg' },
            { name: 'رخصة القيادة', type: 'document', format: 'JPG/PDF', size: 'واضحة', mandatory: true, filename: 'driving_license.jpg' },
            { name: 'صورة المركبة + اللوحة', type: 'image', format: 'JPG', size: 'واضحة', mandatory: true, filename: 'vehicle_photo.jpg' }
        ],
        driver: [
            { name: 'صورة البطاقة (الوجه الأمامي)', type: 'image', format: 'JPG', size: 'واضح', mandatory: true, filename: 'id_front.jpg' },
            { name: 'صورة البطاقة (الوجه الخلفي)', type: 'image', format: 'JPG', size: 'واضح', mandatory: true, filename: 'id_back.jpg' },
            { name: 'رخصة القيادة', type: 'document', format: 'JPG/PDF', size: 'واضحة', mandatory: true, filename: 'driving_license.jpg' },
            { name: 'صورة المركبة + اللوحة', type: 'image', format: 'JPG', size: 'واضحة', mandatory: true, filename: 'vehicle_photo.jpg' },
            { name: 'رخصة المركبة', type: 'document', format: 'PDF/JPG', size: 'واضحة', mandatory: true, filename: 'vehicle_license.pdf' },
            { name: 'تأمين ساري', type: 'document', format: 'PDF/JPG', size: 'واضحة', mandatory: true, filename: 'insurance.pdf' }
        ]
    };

    setupEventListeners() {
        // Service selection
        document.querySelectorAll('.role-card[data-service]').forEach(card => {
            card.addEventListener('click', (e) => {
                this.selectService(e.currentTarget.dataset.service);
            });
        });

        // Navigation buttons
        document.getElementById('next-to-role').addEventListener('click', () => this.nextStep());
        document.getElementById('back-to-service').addEventListener('click', () => this.prevStep());
        document.getElementById('next-to-registration').addEventListener('click', () => this.nextStep());
        document.getElementById('back-to-role').addEventListener('click', () => this.prevStep());
        document.getElementById('next-to-upload').addEventListener('click', () => this.nextStep());
        document.getElementById('back-to-registration').addEventListener('click', () => this.prevStep());
        document.getElementById('complete-registration').addEventListener('click', () => this.completeRegistration());

        // Login
        document.getElementById('show-login').addEventListener('click', (e) => {
            e.preventDefault();
            this.showLoginModal();
        });
    }

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

    setupLoginModal() {
        const modal = document.getElementById('login-modal');
        const closeBtn = modal.querySelector('.close-modal');
        const loginForm = document.getElementById('login-form');

        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        modal.querySelector('.modal-overlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                modal.style.display = 'none';
            }
        });

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });
    }

    selectService(service) {
        this.selectedService = service;

        // Update UI
        document.querySelectorAll('.role-card[data-service]').forEach(card => {
            card.classList.remove('selected');
        });
        document.querySelector(`.role-card[data-service="${service}"]`).classList.add('selected');

        // Enable next button
        document.getElementById('next-to-role').disabled = false;

        // Update roles
        this.updateRoles();
    }

    updateRoles() {
        const roleGrid = document.getElementById('role-grid');
        const roles = this.roles[this.selectedService] || [];

        roleGrid.innerHTML = '';

        roles.forEach(role => {
            const card = document.createElement('div');
            card.className = 'role-card';
            card.dataset.role = role.id;
            card.innerHTML = `
                <div class="role-icon">
                    <i class="${role.icon}"></i>
                </div>
                <div class="role-name">${role.name}</div>
            `;

            card.addEventListener('click', () => {
                this.selectRole(role.id);
            });

            roleGrid.appendChild(card);
        });
    }

    selectRole(role) {
        this.selectedRole = role;

        // Update UI
        document.querySelectorAll('.role-card[data-role]').forEach(card => {
            card.classList.remove('selected');
        });
        document.querySelector(`.role-card[data-role="${role}"]`).classList.add('selected');

        // Enable next button
        document.getElementById('next-to-registration').disabled = false;
    }

    nextStep() {
        if (this.currentStep < 4) {
            this.currentStep++;
            this.updateStepDisplay();
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateStepDisplay();
        }
    }

    updateStepDisplay() {
        // Update step indicators
        document.querySelectorAll('.step').forEach((step, index) => {
            step.classList.remove('active', 'completed');
            if (index + 1 < this.currentStep) {
                step.classList.add('completed');
            } else if (index + 1 === this.currentStep) {
                step.classList.add('active');
            }
        });

        // Update step content
        document.querySelectorAll('.step-content').forEach((content, index) => {
            content.classList.remove('active');
            if (index + 1 === this.currentStep) {
                content.classList.add('active');
            }
        });

        // Update upload grid if on step 4
        if (this.currentStep === 4) {
            this.updateUploadGrid();
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

    updateUploadGrid() {
        const grid = document.getElementById('image-upload-grid');
        const instructions = document.querySelector('.upload-instructions');

        if (!this.selectedRole) {
            instructions.style.display = 'block';
            grid.innerHTML = '';
            return;
        }

        const requirements = this.documentRequirements[this.selectedRole];
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
            alert('نوع الملف أو الحجم غير مناسب');
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

    completeRegistration() {
        // Validate form
        if (!this.validateForm()) {
            return;
        }

        // Show loading
        const submitBtn = document.getElementById('complete-registration');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري إنشاء الحساب...';
        submitBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            alert('تم إنشاء الحساب بنجاح! سيتم إرسال رابط التحقق إلى بريدك الإلكتروني.');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 3000);
    }

    validateForm() {
        // Check required fields
        const requiredFields = ['first-name', 'last-name', 'phone', 'email', 'governorate', 'city', 'address', 'password', 'confirm-password'];

        for (const fieldId of requiredFields) {
            const field = document.getElementById(fieldId);
            if (!field || !field.value.trim()) {
                alert(`يرجى ملء حقل ${field.previousElementSibling.textContent}`);
                field.focus();
                return false;
            }
        }

        // Check password match
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        if (password !== confirmPassword) {
            alert('كلمة المرور وتأكيدها غير متطابقتين');
            return false;
        }

        // Check terms acceptance
        const termsAccepted = document.getElementById('terms-acceptance').checked;
        if (!termsAccepted) {
            alert('يجب الموافقة على الشروط والأحكام');
            return false;
        }

        // Check mandatory files
        if (this.selectedRole) {
            const requirements = this.documentRequirements[this.selectedRole];
            const mandatoryFiles = requirements.filter(req => req.mandatory);

            for (const req of mandatoryFiles) {
                if (!this.uploadedFiles[req.filename]) {
                    alert(`يرجى رفع الملف المطلوب: ${req.name}`);
                    return false;
                }
            }
        }

        return true;
    }

    showLoginModal() {
        document.getElementById('login-modal').style.display = 'block';
    }

    handleLogin() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        if (!email || !password) {
            alert('يرجى ملء جميع الحقول');
            return;
        }

        // Simulate login
        alert('تم تسجيل الدخول بنجاح!');
        document.getElementById('login-modal').style.display = 'none';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new UnifiedFlow();
});
