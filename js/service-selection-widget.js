// Service Selection Widget JavaScript
class ServiceSelectionWidget {
    constructor() {
        this.init();
    }

    init() {
        this.setupServiceSelection();
        this.setupLearnMoreButtons();
        this.setupQuickLinks();
    }

    setupServiceSelection() {
        // Shop EG selection
        const selectShopEG = document.getElementById('select-shopeg');
        if (selectShopEG) {
            selectShopEG.addEventListener('click', () => {
                this.handleServiceSelection('shopeg');
            });
        }

        // Master Driver selection
        const selectMasterDriver = document.getElementById('select-masterdriver');
        if (selectMasterDriver) {
            selectMasterDriver.addEventListener('click', () => {
                this.handleServiceSelection('masterdriver');
            });
        }
    }

    setupLearnMoreButtons() {
        // Learn more for Shop EG
        const learnMoreShopEG = document.getElementById('learn-more-shopeg');
        if (learnMoreShopEG) {
            learnMoreShopEG.addEventListener('click', () => {
                this.showServiceDetails('shopeg');
            });
        }

        // Learn more for Master Driver
        const learnMoreMasterDriver = document.getElementById('learn-more-masterdriver');
        if (learnMoreMasterDriver) {
            learnMoreMasterDriver.addEventListener('click', () => {
                this.showServiceDetails('masterdriver');
            });
        }
    }

    setupQuickLinks() {
        // Quick links are already set up in HTML with href attributes
        // No additional JavaScript needed for basic navigation
    }

    handleServiceSelection(serviceType) {
        // Store selected service
        sessionStorage.setItem('selected_service', serviceType);

        // Show loading animation
        this.showLoading(true);

        // Simulate processing delay
        setTimeout(() => {
            this.showLoading(false);

            // Redirect based on service type
            if (serviceType === 'shopeg') {
                this.redirectToActivitySelection();
            } else if (serviceType === 'masterdriver') {
                this.redirectToRegistration('driver');
            }
        }, 1000);
    }

    redirectToActivitySelection() {
        // Create activity selection modal or redirect to activity selection page
        this.showActivitySelectionModal();
    }

    redirectToRegistration(activityType) {
        // Redirect to registration with pre-selected activity type
        const registrationUrl = `registration-widget.html?activity=${activityType}`;
        window.location.href = registrationUrl;
    }

    showActivitySelectionModal() {
        // Create modal for activity selection
        const modal = document.createElement('div');
        modal.className = 'activity-selection-modal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>اختر نوع النشاط</h3>
                        <button class="close-modal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="activities-grid">
                            <div class="activity-option" data-activity="restaurant">
                                <img src="./assets/images/activities/restaurant.png" alt="مطعم">
                                <span>مطعم</span>
                            </div>
                            <div class="activity-option" data-activity="supermarket">
                                <img src="./assets/images/activities/supermarket.png" alt="سوبر ماركت">
                                <span>سوبر ماركت</span>
                            </div>
                            <div class="activity-option" data-activity="pharmacy">
                                <img src="./assets/images/activities/pharmacy.png" alt="صيدلية">
                                <span>صيدلية</span>
                            </div>
                            <div class="activity-option" data-activity="clinic">
                                <img src="./assets/images/activities/clinic.png" alt="عيادة">
                                <span>عيادة</span>
                            </div>
                            <div class="activity-option" data-activity="courier">
                                <img src="./assets/images/activities/courier.png" alt="مندوب توصيل">
                                <span>مندوب توصيل</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .activity-selection-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 1000;
            }

            .modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                padding: var(--space-16);
            }

            .modal-content {
                background: var(--color-white);
                border-radius: var(--border-radius-xl);
                max-width: 600px;
                width: 100%;
                max-height: 80vh;
                overflow-y: auto;
            }

            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: var(--space-24);
                border-bottom: 1px solid var(--color-gray-200);
            }

            .modal-header h3 {
                margin: 0;
                color: var(--color-text);
            }

            .close-modal {
                background: none;
                border: none;
                font-size: var(--font-size-2xl);
                cursor: pointer;
                color: var(--color-text-secondary);
            }

            .modal-body {
                padding: var(--space-24);
            }

            .activities-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                gap: var(--space-16);
            }

            .activity-option {
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: var(--space-16);
                border: 2px solid var(--color-gray-200);
                border-radius: var(--border-radius-lg);
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .activity-option:hover {
                border-color: var(--luxbyte-primary);
                background: var(--color-bg-1);
            }

            .activity-option img {
                width: 60px;
                height: 60px;
                object-fit: cover;
                border-radius: var(--border-radius-lg);
                margin-bottom: var(--space-8);
            }

            .activity-option span {
                font-size: var(--font-size-sm);
                color: var(--color-text);
                text-align: center;
            }
        `;
        document.head.appendChild(style);

        // Add to page
        document.body.appendChild(modal);

        // Setup event listeners
        const closeModal = modal.querySelector('.close-modal');
        closeModal.addEventListener('click', () => {
            document.body.removeChild(modal);
            document.head.removeChild(style);
        });

        const activityOptions = modal.querySelectorAll('.activity-option');
        activityOptions.forEach(option => {
            option.addEventListener('click', () => {
                const activityType = option.dataset.activity;
                this.selectActivity(activityType);
                document.body.removeChild(modal);
                document.head.removeChild(style);
            });
        });

        // Close on overlay click
        modal.querySelector('.modal-overlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                document.body.removeChild(modal);
                document.head.removeChild(style);
            }
        });
    }

    selectActivity(activityType) {
        // Store selected activity
        sessionStorage.setItem('selected_activity', activityType);

        // Redirect to registration
        const registrationUrl = `registration-widget.html?activity=${activityType}`;
        window.location.href = registrationUrl;
    }

    showServiceDetails(serviceType) {
        const details = {
            shopeg: {
                title: 'شوب إي جي - منصة التجار',
                description: 'منصة شاملة تمكن التجار من إدارة أعمالهم بكفاءة عالية',
                features: [
                    'إدارة المنتجات والمخزون',
                    'تتبع الطلبات والمبيعات',
                    'ربط مع مندوبي التوصيل',
                    'نظام دفع متكامل',
                    'تقارير وإحصائيات مفصلة',
                    'دعم فني 24/7'
                ]
            },
            masterdriver: {
                title: 'ماستر درايفر - منصة السائقين',
                description: 'منصة متخصصة للسائقين لإدارة رحلاتهم وأرباحهم',
                features: [
                    'إدارة الرحلات والحجوزات',
                    'تتبع الأرباح اليومية والشهرية',
                    'نظام تقييم العملاء',
                    'خرائط وتوجيه ذكي',
                    'دعم فني متخصص',
                    'برامج حوافز ومكافآت'
                ]
            }
        };

        const service = details[serviceType];
        if (service) {
            this.showDetailsModal(service);
        }
    }

    showDetailsModal(service) {
        const modal = document.createElement('div');
        modal.className = 'service-details-modal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>${service.title}</h3>
                        <button class="close-modal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <p class="service-description">${service.description}</p>
                        <h4>المميزات الرئيسية:</h4>
                        <ul class="features-list">
                            ${service.features.map(feature => `<li><i class="fas fa-check"></i> ${feature}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn--primary select-service-btn">
                            <i class="fas fa-arrow-left"></i>
                            اختر هذه الخدمة
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .service-details-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 1000;
            }

            .modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                padding: var(--space-16);
            }

            .modal-content {
                background: var(--color-white);
                border-radius: var(--border-radius-xl);
                max-width: 500px;
                width: 100%;
                max-height: 80vh;
                overflow-y: auto;
            }

            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: var(--space-24);
                border-bottom: 1px solid var(--color-gray-200);
            }

            .modal-header h3 {
                margin: 0;
                color: var(--color-text);
            }

            .close-modal {
                background: none;
                border: none;
                font-size: var(--font-size-2xl);
                cursor: pointer;
                color: var(--color-text-secondary);
            }

            .modal-body {
                padding: var(--space-24);
            }

            .service-description {
                color: var(--color-text-secondary);
                margin-bottom: var(--space-16);
                line-height: 1.6;
            }

            .features-list {
                list-style: none;
                padding: 0;
            }

            .features-list li {
                display: flex;
                align-items: center;
                gap: var(--space-8);
                margin-bottom: var(--space-8);
                color: var(--color-text-secondary);
            }

            .features-list li i {
                color: var(--luxbyte-primary);
                width: 16px;
            }

            .modal-footer {
                padding: var(--space-24);
                border-top: 1px solid var(--color-gray-200);
                text-align: center;
            }

            .btn {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: var(--space-8);
                padding: var(--space-12) var(--space-24);
                border: none;
                border-radius: var(--border-radius-lg);
                font-size: var(--font-size-base);
                font-weight: var(--font-weight-medium);
                cursor: pointer;
                transition: all 0.3s ease;
                text-decoration: none;
            }

            .btn--primary {
                background: var(--luxbyte-gradient);
                color: var(--color-white);
            }

            .btn--primary:hover {
                transform: translateY(-2px);
                box-shadow: var(--shadow-lg);
            }
        `;
        document.head.appendChild(style);

        // Add to page
        document.body.appendChild(modal);

        // Setup event listeners
        const closeModal = modal.querySelector('.close-modal');
        closeModal.addEventListener('click', () => {
            document.body.removeChild(modal);
            document.head.removeChild(style);
        });

        const selectBtn = modal.querySelector('.select-service-btn');
        selectBtn.addEventListener('click', () => {
            // This would be handled by the parent component
            document.body.removeChild(modal);
            document.head.removeChild(style);
        });

        // Close on overlay click
        modal.querySelector('.modal-overlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                document.body.removeChild(modal);
                document.head.removeChild(style);
            }
        });
    }

    showLoading(show) {
        // This would show a loading overlay
        // Implementation depends on specific requirements
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ServiceSelectionWidget();
});
