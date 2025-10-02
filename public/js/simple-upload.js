/**
 * LUXBYTE Simple Upload Manager
 * مدير رفع الملفات البسيط
 */

(function() {
    'use strict';

    // Initialize when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        console.log('📁 Simple Upload Manager initialized');

        // Initialize all upload buttons
        initializeUploadButtons();
    });

    function initializeUploadButtons() {
        // Find all upload buttons
        const uploadButtons = document.querySelectorAll('.doc-upload-btn, .upload-btn, [data-upload]');

        uploadButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();

                // Find associated file input
                const fileInput = this.parentNode.querySelector('input[type="file"]') ||
                                this.parentNode.querySelector('.doc-input');

                if (fileInput) {
                    fileInput.click();
                }
            });
        });

        // Find all file inputs
        const fileInputs = document.querySelectorAll('input[type="file"]');

        fileInputs.forEach(input => {
            input.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    handleFileUpload(file, this);
                }
            });
        });
    }

    function handleFileUpload(file, input) {
        console.log('📁 Handling file upload:', file.name);

        // Validate file size (10MB max)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            showNotification('الملف كبير جداً. الحد الأقصى 10 ميجابايت', 'error');
            return;
        }

        // Validate file type
        const allowedTypes = [
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

        if (!allowedTypes.includes(file.type)) {
            showNotification('نوع الملف غير مدعوم', 'error');
            return;
        }

        // Show preview
        showFilePreview(file, input);

        // Update button
        const button = input.parentNode.querySelector('.doc-upload-btn, .upload-btn');
        if (button) {
            button.innerHTML = '<i class="fas fa-check"></i> تم الرفع';
            button.classList.add('btn-success');
            button.classList.remove('btn-outline');
        }

        showNotification(`تم رفع ${file.name} بنجاح`, 'success');
    }

    function showFilePreview(file, input) {
        const preview = input.parentNode.querySelector('.doc-preview, .file-preview');
        if (!preview) return;

        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                preview.innerHTML = `
                    <div style="padding: 10px; background: #f0f9ff; border: 2px solid #0ea5e9; border-radius: 8px;">
                        <img src="${e.target.result}" style="max-width: 100px; max-height: 100px; border-radius: 4px; margin-bottom: 5px;">
                        <p style="margin: 0; color: #0c4a6e; font-size: 14px;">
                            <i class="fas fa-check"></i> ${file.name}
                        </p>
                    </div>
                `;
            };
            reader.readAsDataURL(file);
        } else {
            preview.innerHTML = `
                <div style="padding: 10px; background: #f0f9ff; border: 2px solid #0ea5e9; border-radius: 8px; color: #0c4a6e;">
                    <i class="fas fa-file-pdf"></i> ${file.name}
                    <p style="margin: 5px 0; color: #28a745; font-size: 14px;">
                        <i class="fas fa-check"></i> تم رفع الملف بنجاح
                    </p>
                </div>
            `;
        }
    }

    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        // Add styles if not exists
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 15px 20px;
                    border-radius: 8px;
                    color: white;
                    font-weight: 500;
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    min-width: 300px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    animation: slideInRight 0.3s ease;
                }
                .notification-success { background: #10b981; }
                .notification-error { background: #ef4444; }
                .notification-info { background: #3b82f6; }
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOutRight {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 5000);
    }

    // Export to global scope
    window.SimpleUpload = {
        initialize: initializeUploadButtons,
        handleFileUpload: handleFileUpload,
        showNotification: showNotification
    };

})();
