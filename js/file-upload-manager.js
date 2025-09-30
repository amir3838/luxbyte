/**
 * Unified File Upload Manager for LUXBYTE
 * مدير موحد لرفع الملفات وتصوير المستندات
 *
 * Features:
 * - Camera capture with fallback to file selection
 * - Multiple file types support (images, PDFs)
 * - Supabase Storage integration
 * - Progress tracking and error handling
 * - Mobile and desktop compatibility
 * - Arabic UI support
 */

// Global variables
let uploadedFiles = {};
let currentUploading = false;

/**
 * Ensure Supabase is ready
 * التأكد من جاهزية Supabase
 */
export async function ensureSupabaseReady() {
    console.log('🔍 Checking Supabase readiness...');

    // Check environment variables
    if (!window.__ENV__ || !window.__ENV__.NEXT_PUBLIC_SUPABASE_URL || !window.__ENV__.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        throw new Error('متغيرات البيئة غير مكتملة - تحقق من config.js');
    }

    // Check Supabase client
    if (!window.supabase) {
        throw new Error('عميل Supabase غير متاح - تحقق من js/supabase-client.js');
    }

    // Test Supabase connection
    try {
        const { data, error } = await window.supabase.auth.getSession();
        if (error) {
            console.warn('Supabase session check failed:', error);
        }
        console.log('✅ Supabase is ready');
    } catch (error) {
        throw new Error(`فشل في الاتصال بـ Supabase: ${error.message}`);
    }
}

/**
 * Initialize file upload system
 * تهيئة نظام رفع الملفات
 */
function initFileUpload() {
    console.log('🚀 Initializing file upload system...');

    // Check for required dependencies
    if (typeof window.CONFIG === 'undefined') {
        console.error('❌ CONFIG not found');
        return false;
    }

    if (typeof window.supabase === 'undefined') {
        console.error('❌ Supabase client not found');
        return false;
    }

    console.log('✅ File upload system initialized');
    return true;
}

/**
 * Open camera or file selection dialog
 * فتح الكاميرا أو نافذة اختيار الملفات
 */
async function openCameraOrFile(documentType, accept = "image/*") {
    console.log(`📷 Opening camera/file for: ${documentType}`);

    if (currentUploading) {
        showToast('جاري رفع ملف آخر، يرجى الانتظار...', 'warning');
        return;
    }

    // Check if camera is supported
    const isCameraSupported = checkCameraSupport();
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isCameraSupported && isMobile) {
        // Try camera first on mobile
        try {
            await openCamera(documentType, accept);
        } catch (error) {
            console.warn('Camera failed, falling back to file selection:', error);
            openFileSelection(documentType, accept);
        }
    } else {
        // Use file selection on desktop or if camera not supported
        openFileSelection(documentType, accept);
    }
}

/**
 * Check if camera is supported
 * فحص دعم الكاميرا
 */
function checkCameraSupport() {
    return !!(navigator.mediaDevices &&
              navigator.mediaDevices.getUserMedia &&
              window.isSecureContext);
}

/**
 * Open camera for document capture
 * فتح الكاميرا لتصوير المستندات
 */
async function openCamera(documentType, accept) {
    console.log(`📹 Opening camera for: ${documentType}`);

    try {
        // Request camera permission
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: { ideal: 'environment' }, // Use back camera
                width: { ideal: 1280 },
                height: { ideal: 720 }
            },
            audio: false
        });

        // Create camera modal
        createCameraModal(stream, documentType, accept);

    } catch (error) {
        console.error('Camera access failed:', error);
        throw new Error(getCameraErrorMessage(error));
    }
}

/**
 * Create camera modal for document capture
 * إنشاء نافذة الكاميرا لتصوير المستندات
 */
function createCameraModal(stream, documentType, accept) {
    // Remove existing modal
    const existingModal = document.getElementById('cameraModal');
    if (existingModal) {
        existingModal.remove();
    }

    // Create modal
    const modal = document.createElement('div');
    modal.id = 'cameraModal';
    modal.innerHTML = `
        <div class="camera-modal-overlay">
            <div class="camera-modal-content">
                <div class="camera-modal-header">
                    <h3>تصوير ${getDocumentLabel(documentType)}</h3>
                    <button class="close-btn" onclick="closeCameraModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="camera-modal-body">
                    <video id="cameraPreview" autoplay playsinline></video>
                    <div class="camera-controls">
                        <button class="btn btn-primary" onclick="capturePhoto('${documentType}', '${accept}')">
                            <i class="fas fa-camera"></i>
                            التقاط صورة
                        </button>
                        <button class="btn btn-secondary" onclick="closeCameraModal()">
                            <i class="fas fa-times"></i>
                            إلغاء
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .camera-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .camera-modal-content {
            background: white;
            border-radius: 12px;
            max-width: 90vw;
            max-height: 90vh;
            overflow: hidden;
        }
        .camera-modal-header {
            padding: 20px;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .camera-modal-body {
            padding: 20px;
            text-align: center;
        }
        #cameraPreview {
            width: 100%;
            max-width: 500px;
            height: auto;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .camera-controls {
            display: flex;
            gap: 10px;
            justify-content: center;
        }
        .close-btn {
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            color: #666;
        }
    `;

    document.head.appendChild(style);
    document.body.appendChild(modal);

    // Set video stream
    const video = document.getElementById('cameraPreview');
    video.srcObject = stream;

    // Store stream for cleanup
    window.currentCameraStream = stream;
}

/**
 * Capture photo from camera
 * التقاط صورة من الكاميرا
 */
async function capturePhoto(documentType, accept) {
    console.log(`📸 Capturing photo for: ${documentType}`);

    const video = document.getElementById('cameraPreview');
    if (!video || !video.videoWidth) {
        showToast('الكاميرا غير جاهزة', 'error');
        return;
    }

    try {
        // Create canvas and capture frame
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);

        // Convert to blob
        const blob = await new Promise(resolve => {
            canvas.toBlob(resolve, 'image/jpeg', 0.9);
        });

        // Close camera modal
        closeCameraModal();

        // Upload the captured image
        await uploadFile(blob, documentType, 'camera_capture.jpg');

    } catch (error) {
        console.error('Photo capture failed:', error);
        showToast('فشل في التقاط الصورة', 'error');
    }
}

/**
 * Close camera modal
 * إغلاق نافذة الكاميرا
 */
function closeCameraModal() {
    const modal = document.getElementById('cameraModal');
    if (modal) {
        modal.remove();
    }

    // Stop camera stream
    if (window.currentCameraStream) {
        window.currentCameraStream.getTracks().forEach(track => track.stop());
        window.currentCameraStream = null;
    }
}

/**
 * Open file selection dialog
 * فتح نافذة اختيار الملفات
 */
function openFileSelection(documentType, accept) {
    console.log(`📁 Opening file selection for: ${documentType}`);

    // Create file input
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept;
    input.multiple = false;
    input.style.display = 'none';

    input.onchange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            await uploadFile(file, documentType, file.name);
        }
        input.remove();
    };

    document.body.appendChild(input);
    input.click();
}

/**
 * Upload file to Supabase Storage
 * رفع الملف إلى Supabase Storage
 */
async function uploadFile(file, documentType, filename) {
    console.log(`📤 Uploading file: ${filename} for ${documentType}`);

    if (currentUploading) {
        showToast('جاري رفع ملف آخر، يرجى الانتظار...', 'warning');
        return;
    }

    currentUploading = true;

    try {
        // Get current user ID
        const userId = getCurrentUserId();
        if (!userId) {
            throw new Error('لم يتم العثور على معرف المستخدم');
        }

        // Create file path
        const filePath = `${userId}/${documentType}/${Date.now()}_${filename}`;

        // Show progress
        showUploadProgress(documentType, 0);

        // Upload to Supabase Storage
        const { data, error } = await window.supabase.storage
            .from('kyc_docs')
            .upload(filePath, file, {
                upsert: false,
                contentType: file.type || 'image/jpeg'
            });

        if (error) {
            throw new Error(error.message);
        }

        // Get public URL
        const { data: publicData } = window.supabase.storage
            .from('kyc_docs')
            .getPublicUrl(data.path);

        // Store file info
        uploadedFiles[documentType] = {
            path: data.path,
            url: publicData.publicUrl,
            filename: filename,
            uploadedAt: new Date().toISOString()
        };

        // Update UI
        updateFileUploadUI(documentType, publicData.publicUrl, filename);

        // Save to database
        await saveFileToDatabase(documentType, data.path, publicData.publicUrl);

        showToast('تم رفع الملف بنجاح', 'success');

    } catch (error) {
        console.error('Upload failed:', error);
        showToast(`فشل في رفع الملف: ${error.message}`, 'error');
    } finally {
        currentUploading = false;
        hideUploadProgress(documentType);
    }
}

/**
 * Save file info to database
 * حفظ معلومات الملف في قاعدة البيانات
 */
async function saveFileToDatabase(documentType, filePath, publicUrl) {
    try {
        const userId = getCurrentUserId();

        const { error } = await window.supabase
            .from('documents')
            .insert({
                user_id: userId,
                document_type: documentType,
                file_path: filePath,
                public_url: publicUrl,
                uploaded_at: new Date().toISOString()
            });

        if (error) {
            console.error('Database save failed:', error);
        }
    } catch (error) {
        console.error('Database save error:', error);
    }
}

/**
 * Update file upload UI
 * تحديث واجهة رفع الملفات
 */
function updateFileUploadUI(documentType, imageUrl, filename) {
    const container = document.getElementById(`file-upload-${documentType}`);
    if (!container) return;

    // Remove existing preview
    const existingPreview = container.querySelector('.file-preview');
    if (existingPreview) {
        existingPreview.remove();
    }

    // Create preview
    const preview = document.createElement('div');
    preview.className = 'file-preview';
    preview.innerHTML = `
        <div class="file-preview-content">
            <img src="${imageUrl}" alt="${filename}" class="file-preview-image">
            <div class="file-preview-info">
                <p class="file-name">${filename}</p>
                <p class="file-status">تم الرفع بنجاح</p>
            </div>
            <button class="btn btn-danger btn-sm" onclick="removeFile('${documentType}')">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .file-preview {
            margin-top: 10px;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 8px;
            background: #f9f9f9;
        }
        .file-preview-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .file-preview-image {
            width: 60px;
            height: 60px;
            object-fit: cover;
            border-radius: 4px;
        }
        .file-preview-info {
            flex: 1;
        }
        .file-name {
            font-weight: bold;
            margin: 0 0 5px 0;
        }
        .file-status {
            color: #28a745;
            font-size: 12px;
            margin: 0;
        }
    `;

    document.head.appendChild(style);
    container.appendChild(preview);

    // Update upload button
    const uploadBtn = container.querySelector('.upload-btn');
    if (uploadBtn) {
        uploadBtn.innerHTML = '<i class="fas fa-sync"></i> تغيير الملف';
    }
}

/**
 * Remove uploaded file
 * حذف الملف المرفوع
 */
async function removeFile(documentType) {
    console.log(`🗑️ Removing file: ${documentType}`);

    try {
        const fileInfo = uploadedFiles[documentType];
        if (fileInfo) {
            // Delete from storage
            const { error } = await window.supabase.storage
                .from('kyc_docs')
                .remove([fileInfo.path]);

            if (error) {
                console.error('Storage delete failed:', error);
            }

            // Delete from database
            const userId = getCurrentUserId();
            if (userId) {
                await window.supabase
                    .from('documents')
                    .delete()
                    .eq('user_id', userId)
                    .eq('document_type', documentType);
            }

            // Remove from memory
            delete uploadedFiles[documentType];
        }

        // Update UI
        const container = document.getElementById(`file-upload-${documentType}`);
        if (container) {
            const preview = container.querySelector('.file-preview');
            if (preview) {
                preview.remove();
            }

            const uploadBtn = container.querySelector('.upload-btn');
            if (uploadBtn) {
                uploadBtn.innerHTML = '<i class="fas fa-camera"></i> تصوير/رفع';
            }
        }

        showToast('تم حذف الملف', 'success');

    } catch (error) {
        console.error('Remove file failed:', error);
        showToast('فشل في حذف الملف', 'error');
    }
}

/**
 * Show upload progress
 * عرض تقدم الرفع
 */
function showUploadProgress(documentType, progress) {
    const container = document.getElementById(`file-upload-${documentType}`);
    if (!container) return;

    let progressBar = container.querySelector('.upload-progress');
    if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.className = 'upload-progress';
        progressBar.innerHTML = `
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${progress}%"></div>
            </div>
            <p class="progress-text">جاري الرفع... ${progress}%</p>
        `;
        container.appendChild(progressBar);
    } else {
        const fill = progressBar.querySelector('.progress-fill');
        const text = progressBar.querySelector('.progress-text');
        if (fill) fill.style.width = `${progress}%`;
        if (text) text.textContent = `جاري الرفع... ${progress}%`;
    }
}

/**
 * Hide upload progress
 * إخفاء تقدم الرفع
 */
function hideUploadProgress(documentType) {
    const container = document.getElementById(`file-upload-${documentType}`);
    if (!container) return;

    const progressBar = container.querySelector('.upload-progress');
    if (progressBar) {
        progressBar.remove();
    }
}

/**
 * Get current user ID
 * الحصول على معرف المستخدم الحالي
 */
function getCurrentUserId() {
    // Try to get from localStorage
    const user = localStorage.getItem('user');
    if (user) {
        try {
            const userData = JSON.parse(user);
            return userData.id || userData.user_id;
        } catch (e) {
            console.error('Error parsing user data:', e);
        }
    }

    // Try to get from Supabase session
    if (window.supabase && window.supabase.auth) {
        const session = window.supabase.auth.session();
        if (session && session.user) {
            return session.user.id;
        }
    }

    return null;
}

/**
 * Get document label
 * الحصول على تسمية المستند
 */
function getDocumentLabel(documentType) {
    const labels = {
        'commercial_register': 'السجل التجاري',
        'tax_card': 'البطاقة الضريبية',
        'contract_document': 'عقد المقر',
        'facade_photo': 'صورة الواجهة',
        'interior_photo': 'صورة داخلية',
        'national_id': 'البطاقة الشخصية',
        'driving_license': 'رخصة القيادة',
        'vehicle_license': 'رخصة المركبة',
        'criminal_record': 'صحيفة الحالة الجنائية',
        'personal_photos': 'الصور الشخصية',
        'vehicle_photo': 'صورة المركبة'
    };

    return labels[documentType] || documentType;
}

/**
 * Get camera error message
 * الحصول على رسالة خطأ الكاميرا
 */
function getCameraErrorMessage(error) {
    const name = error?.name || '';
    const message = error?.message || String(error);

    switch (name) {
        case 'NotAllowedError':
            return 'تم رفض الإذن من المتصفح. يرجى السماح بالوصول للكاميرا.';
        case 'NotFoundError':
            return 'لا توجد كاميرا متاحة على هذا الجهاز.';
        case 'NotReadableError':
            return 'الكاميرا مشغولة بتطبيق آخر. يرجى إغلاق التطبيقات الأخرى.';
        case 'OverconstrainedError':
            return 'قيود الكاميرا غير مناسبة. سيتم استخدام الكاميرا الأمامية.';
        case 'SecurityError':
            return 'خطأ أمني: يجب فتح الموقع عبر HTTPS.';
        default:
            return message || 'خطأ غير معروف في الوصول للكاميرا';
    }
}

/**
 * Show toast notification
 * عرض إشعار
 */
function showToast(message, type = 'info') {
    console.log(`📢 Toast [${type}]: ${message}`);

    // Use existing notification system if available
    if (typeof LUXBYTE !== 'undefined' && LUXBYTE.notifyOk) {
        if (type === 'success') {
            LUXBYTE.notifyOk(message);
        } else if (type === 'error') {
            LUXBYTE.notifyErr(message);
        } else if (type === 'warning') {
            LUXBYTE.notifyWarn(message);
        } else {
            LUXBYTE.notifyOk(message);
        }
    } else {
        // Fallback to alert
        alert(message);
    }
}

/**
 * Render upload buttons for documents (Idempotent)
 * رسم أزرار الرفع للمستندات (قابل للتكرار)
 */
export async function renderUploadButtons(container, documentTypes) {
    console.log('🎨 Rendering upload buttons for:', documentTypes);

    if (!container) {
        throw new Error('حاوية الأزرار غير موجودة');
    }

    // Check if already initialized
    if (container.hasAttribute('data-initialized')) {
        console.log('🔄 Upload buttons already initialized');
        return;
    }

    // Mark as initialized
    container.setAttribute('data-initialized', '1');

    // Clear existing content
    container.innerHTML = '';

    // Create header
    const header = document.createElement('div');
    header.className = 'file-upload-header';
    header.innerHTML = `
        <h3>
            <i class="fas fa-upload" style="margin-left: 8px; color: #6b7cff;"></i>
            رفع صور المستندات المطلوبة
        </h3>
        <p style="color: #666; margin-bottom: 20px;">
            يرجى رفع جميع المستندات المطلوبة بوضوح. يمكنك استخدام الكاميرا أو اختيار ملف من الجهاز.
        </p>
    `;
    container.appendChild(header);

    // Create upload fields for each document type
    for (const docType of documentTypes) {
        const field = createFileUploadField(docType);
        container.appendChild(field);
    }

    console.log('✅ Upload buttons rendered successfully');
}

/**
 * Generate file upload fields for a role
 * إنشاء حقول رفع الملفات لدور معين
 */
function generateFileUploadFields(role) {
    console.log(`🔧 Generating file upload fields for role: ${role}`);

    const roleConfig = window.CONFIG.ROLES[role];
    if (!roleConfig || !roleConfig.files) {
        console.error('Role config not found:', role);
        return;
    }

    const container = document.getElementById('file-upload-container');
    if (!container) {
        console.error('File upload container not found');
        return;
    }

    // Clear existing content
    container.innerHTML = '';

    // Create header
    const header = document.createElement('div');
    header.className = 'file-upload-header';
    header.innerHTML = `
        <h3>
            <i class="fas fa-upload" style="margin-left: 8px; color: #6b7cff;"></i>
            رفع صور المستندات المطلوبة
        </h3>
        <p style="color: #666; margin-bottom: 20px;">
            يرجى رفع جميع المستندات المطلوبة بوضوح. يمكنك استخدام الكاميرا أو اختيار ملف من الجهاز.
        </p>
    `;
    container.appendChild(header);

    // Create file upload fields
    roleConfig.files.forEach(fileConfig => {
        const field = createFileUploadField(fileConfig);
        container.appendChild(field);
    });
}

/**
 * Create individual file upload field
 * إنشاء حقل رفع ملف فردي
 */
function createFileUploadField(fileConfig) {
    const field = document.createElement('div');
    field.className = 'file-upload-field';
    
    // Handle both object config and string document type
    let config;
    if (typeof fileConfig === 'string') {
        // Simple document type - create basic config
        config = {
            name: fileConfig,
            label: getDocumentLabel(fileConfig),
            accept: 'image/*',
            required: true,
            description: 'صورة واضحة للمستند'
        };
    } else {
        // Full config object
        config = fileConfig;
    }
    
    field.id = `file-upload-${config.name}`;

    const acceptTypes = config.accept || 'image/*';
    const isRequired = config.required || false;

    field.innerHTML = `
        <div class="file-upload-label">
            <label>
                ${config.label}
                ${isRequired ? '<span style="color: #ef4444;">*</span>' : ''}
            </label>
            ${config.description ? `<p class="file-description">${config.description}</p>` : ''}
        </div>
        <div class="file-upload-controls">
            <button type="button" class="btn btn-primary upload-btn"
                    onclick="openCameraOrFile('${config.name}', '${acceptTypes}')">
                <i class="fas fa-camera"></i>
                تصوير/رفع
            </button>
        </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .file-upload-field {
            margin-bottom: 20px;
            padding: 15px;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            background: #f9fafb;
        }
        .file-upload-label label {
            font-weight: 600;
            color: #374151;
            margin-bottom: 5px;
            display: block;
        }
        .file-description {
            font-size: 12px;
            color: #6b7280;
            margin: 5px 0 0 0;
        }
        .file-upload-controls {
            margin-top: 10px;
        }
        .upload-btn {
            background: #6b7cff;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }
        .upload-btn:hover {
            background: #5a6fd8;
        }
        .progress-bar {
            width: 100%;
            height: 8px;
            background: #e5e7eb;
            border-radius: 4px;
            overflow: hidden;
            margin: 10px 0;
        }
        .progress-fill {
            height: 100%;
            background: #6b7cff;
            transition: width 0.3s ease;
        }
        .progress-text {
            text-align: center;
            font-size: 12px;
            color: #6b7280;
            margin: 5px 0;
        }
    `;

    document.head.appendChild(style);
    return field;
}

// Export functions to window for global access
if (typeof window !== 'undefined') {
    window.openCameraOrFile = openCameraOrFile;
    window.capturePhoto = capturePhoto;
    window.closeCameraModal = closeCameraModal;
    window.removeFile = removeFile;
    window.generateFileUploadFields = generateFileUploadFields;
    window.initFileUpload = initFileUpload;
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFileUpload);
} else {
    initFileUpload();
}