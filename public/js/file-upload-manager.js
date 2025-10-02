/**
 * LUXBYTE File Upload Manager
 * مدير رفع الملفات
 */

class FileUploadManager {
    constructor() {
        this.maxFileSize = 10 * 1024 * 1024; // 10MB
        this.allowedTypes = [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain',
            'text/csv'
        ];
        this.uploadQueue = [];
        this.isUploading = false;
        this.init();
    }

    /**
     * Initialize file upload manager
     * تهيئة مدير رفع الملفات
     */
    init() {
        this.setupEventListeners();
        this.setupDropZones();
        this.setupProgressBars();
        console.log('📁 File upload manager initialized');
    }

    /**
     * Setup event listeners
     * إعداد مستمعي الأحداث
     */
    setupEventListeners() {
        // Handle file input changes
        document.addEventListener('change', (e) => {
            if (e.target.type === 'file') {
                this.handleFileSelect(e.target);
            }
        });

        // Handle paste events
        document.addEventListener('paste', (e) => {
            const items = e.clipboardData?.items;
            if (items) {
                for (let item of items) {
                    if (item.kind === 'file') {
                        const file = item.getAsFile();
                        this.processFile(file);
                    }
                }
            }
        });
    }

    /**
     * Setup drop zones
     * إعداد مناطق السحب والإفلات
     */
    setupDropZones() {
        document.querySelectorAll('.file-drop-zone').forEach(zone => {
            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
                zone.classList.add('drag-over');
            });

            zone.addEventListener('dragleave', (e) => {
                e.preventDefault();
                zone.classList.remove('drag-over');
            });

            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                zone.classList.remove('drag-over');

                const files = Array.from(e.dataTransfer.files);
                this.processFiles(files);
            });
        });
    }

    /**
     * Setup progress bars
     * إعداد أشرطة التقدم
     */
    setupProgressBars() {
        // Create global progress container
        if (!document.getElementById('upload-progress-container')) {
            const container = document.createElement('div');
            container.id = 'upload-progress-container';
            container.className = 'upload-progress-container';
            document.body.appendChild(container);
        }
    }

    /**
     * Handle file select
     * التعامل مع اختيار الملفات
     */
    handleFileSelect(input) {
        const files = Array.from(input.files);
        this.processFiles(files);
    }

    /**
     * Process files
     * معالجة الملفات
     */
    processFiles(files) {
        files.forEach(file => {
            if (this.validateFile(file)) {
                this.processFile(file);
            }
        });
    }

    /**
     * Process single file
     * معالجة ملف واحد
     */
    processFile(file) {
        const fileId = this.generateFileId();
        const fileData = {
            id: fileId,
            file: file,
            name: file.name,
            size: file.size,
            type: file.type,
            status: 'pending',
            progress: 0,
            error: null
        };

        this.uploadQueue.push(fileData);
        this.createProgressBar(fileData);
        this.startUpload(fileData);
    }

    /**
     * Validate file
     * التحقق من صحة الملف
     */
    validateFile(file) {
        // Check file size
        if (file.size > this.maxFileSize) {
            this.showError(`الملف ${file.name} كبير جداً. الحد الأقصى 10MB`);
            return false;
        }

        // Check file type
        if (!this.allowedTypes.includes(file.type)) {
            this.showError(`نوع الملف ${file.name} غير مدعوم`);
            return false;
        }

        return true;
    }

    /**
     * Generate file ID
     * إنشاء معرف الملف
     */
    generateFileId() {
        return 'file_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Create progress bar
     * إنشاء شريط التقدم
     */
    createProgressBar(fileData) {
        const container = document.getElementById('upload-progress-container');
        const progressDiv = document.createElement('div');
        progressDiv.id = `progress-${fileData.id}`;
        progressDiv.className = 'upload-progress-item';
        progressDiv.innerHTML = `
            <div class="progress-header">
                <span class="file-name">${fileData.name}</span>
                <span class="file-size">${this.formatFileSize(fileData.size)}</span>
                <button class="cancel-upload" onclick="fileUploadManager.cancelUpload('${fileData.id}')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: 0%"></div>
            </div>
            <div class="progress-status">في الانتظار...</div>
        `;

        container.appendChild(progressDiv);
    }

    /**
     * Start upload
     * بدء الرفع
     */
    async startUpload(fileData) {
        try {
            fileData.status = 'uploading';
            this.updateProgressBar(fileData);

            const formData = new FormData();
            formData.append('file', fileData.file);
            formData.append('type', 'document');

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${this.getAuthToken()}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            fileData.status = 'completed';
            fileData.progress = 100;
            fileData.url = result.url;
            fileData.id = result.id;

            this.updateProgressBar(fileData);
            this.showSuccess(`تم رفع الملف ${fileData.name} بنجاح`);

            // Remove progress bar after 3 seconds
            setTimeout(() => {
                this.removeProgressBar(fileData.id);
            }, 3000);

        } catch (error) {
            fileData.status = 'error';
            fileData.error = error.message;
            this.updateProgressBar(fileData);
            this.showError(`فشل في رفع الملف ${fileData.name}: ${error.message}`);
        }
    }

    /**
     * Update progress bar
     * تحديث شريط التقدم
     */
    updateProgressBar(fileData) {
        const progressDiv = document.getElementById(`progress-${fileData.id}`);
        if (!progressDiv) return;

        const progressFill = progressDiv.querySelector('.progress-fill');
        const progressStatus = progressDiv.querySelector('.progress-status');

        progressFill.style.width = `${fileData.progress}%`;

        switch (fileData.status) {
            case 'pending':
                progressStatus.textContent = 'في الانتظار...';
                progressDiv.className = 'upload-progress-item pending';
                break;
            case 'uploading':
                progressStatus.textContent = `جاري الرفع... ${fileData.progress}%`;
                progressDiv.className = 'upload-progress-item uploading';
                break;
            case 'completed':
                progressStatus.textContent = 'تم الرفع بنجاح';
                progressDiv.className = 'upload-progress-item completed';
                break;
            case 'error':
                progressStatus.textContent = `خطأ: ${fileData.error}`;
                progressDiv.className = 'upload-progress-item error';
                break;
        }
    }

    /**
     * Cancel upload
     * إلغاء الرفع
     */
    cancelUpload(fileId) {
        const fileData = this.uploadQueue.find(f => f.id === fileId);
        if (fileData) {
            fileData.status = 'cancelled';
            this.updateProgressBar(fileData);
            this.removeProgressBar(fileId);
        }
    }

    /**
     * Remove progress bar
     * إزالة شريط التقدم
     */
    removeProgressBar(fileId) {
        const progressDiv = document.getElementById(`progress-${fileId}`);
        if (progressDiv) {
            progressDiv.remove();
        }
    }

    /**
     * Format file size
     * تنسيق حجم الملف
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    /**
     * Get auth token
     * الحصول على رمز المصادقة
     */
    getAuthToken() {
        return localStorage.getItem('auth_token') || '';
    }

    /**
     * Show error message
     * إظهار رسالة خطأ
     */
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'upload-error-message';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(errorDiv);

        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    /**
     * Show success message
     * إظهار رسالة نجاح
     */
    showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'upload-success-message';
        successDiv.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(successDiv);

        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    }

    /**
     * Get upload queue
     * الحصول على قائمة الرفع
     */
    getUploadQueue() {
        return this.uploadQueue;
    }

    /**
     * Clear completed uploads
     * مسح الرفعات المكتملة
     */
    clearCompletedUploads() {
        this.uploadQueue = this.uploadQueue.filter(file => file.status !== 'completed');
    }

    /**
     * Retry failed uploads
     * إعادة محاولة الرفعات الفاشلة
     */
    retryFailedUploads() {
        const failedUploads = this.uploadQueue.filter(file => file.status === 'error');
        failedUploads.forEach(file => {
            file.status = 'pending';
            file.error = null;
            file.progress = 0;
            this.startUpload(file);
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.fileUploadManager = new FileUploadManager();
});

// Export for module usage
export { FileUploadManager };

if (typeof module !== 'undefined' && module.exports) {
    module.exports = FileUploadManager;
}
