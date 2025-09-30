/**
 * Upload UI System
 * نظام واجهة الرفع
 *
 * Features:
 * - Dynamic button generation
 * - File validation
 * - Progress tracking
 * - Error handling
 * - Arabic language support
 */

import { toastError, toastSuccess, toastInfo } from '../utils/toast.js';

let uploadSystem = null;

/**
 * Setup upload buttons
 * إعداد أزرار الرفع
 */
export function setupUploadButtons({ supabase, bucket, maxMb, allowed }) {
    console.log('🔧 Setting up upload buttons...', { bucket, maxMb, allowed });

    // Store configuration
    uploadSystem = { supabase, bucket, maxMb, allowed };

    const inputs = document.querySelectorAll('[data-upload-input]');
    const buttons = document.querySelectorAll('[data-upload-btn]');

    if (!inputs.length || !buttons.length) {
        console.log('ℹ️ No upload inputs or buttons found, skipping setup');
        return;
    }

    console.log(`📋 Found ${inputs.length} inputs and ${buttons.length} buttons`);

    // Setup each button
    buttons.forEach(btn => {
        setupUploadButton(btn);
    });

    console.log('✅ Upload buttons setup completed');
}

/**
 * Setup individual upload button
 * إعداد زر رفع فردي
 */
function setupUploadButton(button) {
    // Enable button
    button.disabled = false;
    button.style.opacity = '1';
    button.style.cursor = 'pointer';

    // Remove existing listeners
    button.removeEventListener('click', handleUploadClick);

    // Add click listener
    button.addEventListener('click', handleUploadClick);

    console.log('🔗 Upload button configured:', button.getAttribute('data-for'));
}

/**
 * Handle upload button click
 * معالجة النقر على زر الرفع
 */
async function handleUploadClick(event) {
    event.preventDefault();

    const button = event.currentTarget;
    const targetId = button.getAttribute('data-for');
    const bindId = button.getAttribute('data-bind');

    if (!targetId) {
        toastError('خطأ في إعدادات زر الرفع');
        return;
    }

    const targetInput = document.querySelector(targetId);
    if (!targetInput || !targetInput.files || !targetInput.files[0]) {
        toastError('من فضلك اختر ملفًا أولاً');
        return;
    }

    const file = targetInput.files[0];

    try {
        // Show loading state
        setButtonLoading(button, true);

        // Validate file
        const validation = validateFile(file);
        if (!validation.valid) {
            toastError(validation.message);
            return;
        }

        // Generate unique path
        const path = generateFilePath(file);

        // Upload file
        const uploadResult = await uploadFile(file, path);

        // Store public URL if bind element exists
        if (bindId) {
            const bindElement = document.querySelector(bindId);
            if (bindElement) {
                bindElement.value = uploadResult.publicUrl;
                console.log('💾 Public URL stored in:', bindId);
            }
        }

        // Update UI
        updateFileUploadUI(targetInput, uploadResult.publicUrl, file.name);

        toastSuccess('تم رفع الملف بنجاح');

    } catch (error) {
        console.error('❌ Upload failed:', error);
        toastError(`فشل في رفع الملف: ${error.message}`);
    } finally {
        setButtonLoading(button, false);
    }
}

/**
 * Validate file
 * التحقق من صحة الملف
 */
function validateFile(file) {
    const { maxMb, allowed } = uploadSystem;

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxMb) {
        return {
            valid: false,
            message: `حجم الملف أكبر من ${maxMb} ميجابايت`
        };
    }

    // Check file type
    if (allowed && allowed.length > 0 && !allowed.includes(file.type)) {
        const allowedTypes = allowed.join(', ');
        return {
            valid: false,
            message: `نوع الملف غير مسموح. الأنواع المسموحة: ${allowedTypes}`
        };
    }

    return { valid: true };
}

/**
 * Generate unique file path
 * إنشاء مسار ملف فريد
 */
function generateFilePath(file) {
    const email = getCurrentUserEmail();
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');

    return `${email}/${timestamp}_${sanitizedName}`;
}

/**
 * Get current user email
 * الحصول على إيميل المستخدم الحالي
 */
function getCurrentUserEmail() {
    // Try to get from form
    const emailInput = document.querySelector('input[type="email"]');
    if (emailInput && emailInput.value) {
        return emailInput.value.replace(/[^\w.-]/g, '_');
    }

    // Try to get from Supabase session
    if (uploadSystem?.supabase) {
        try {
            const { data } = uploadSystem.supabase.auth.getSession();
            if (data?.session?.user?.email) {
                return data.session.user.email.replace(/[^\w.-]/g, '_');
            }
        } catch (error) {
            console.warn('Could not get user email from session:', error);
        }
    }

    // Fallback to anonymous
    return 'anonymous';
}

/**
 * Upload file to Supabase
 * رفع ملف إلى Supabase
 */
async function uploadFile(file, path) {
    const { supabase, bucket } = uploadSystem;

    if (!supabase) {
        throw new Error('عميل Supabase غير متاح');
    }

    try {
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(path, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            throw error;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from(bucket)
            .getPublicUrl(data.path);

        return {
            path: data.path,
            publicUrl: urlData.publicUrl
        };

    } catch (error) {
        console.error('❌ Supabase upload error:', error);
        throw new Error(`فشل في رفع الملف: ${error.message}`);
    }
}

/**
 * Update file upload UI
 * تحديث واجهة رفع الملف
 */
function updateFileUploadUI(input, publicUrl, fileName) {
    // Add uploaded class
    const uploadContainer = input.closest('.file-upload');
    if (uploadContainer) {
        uploadContainer.classList.add('uploaded');
    }

    // Show file info
    const fileInfo = input.parentElement.querySelector('.file-info');
    if (fileInfo) {
        fileInfo.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px; margin-top: 8px;">
                <i class="fas fa-check-circle" style="color: #059669;"></i>
                <span style="color: #059669; font-weight: 500;">تم رفع الملف بنجاح</span>
            </div>
            <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">
                ${fileName}
            </div>
        `;
    }

    // Store URL in hidden input if exists
    const hiddenInput = input.parentElement.querySelector('input[type="hidden"]');
    if (hiddenInput) {
        hiddenInput.value = publicUrl;
    }
}

/**
 * Set button loading state
 * تعيين حالة التحميل للزر
 */
function setButtonLoading(button, loading) {
    if (loading) {
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الرفع...';
        button.style.opacity = '0.7';
    } else {
        button.disabled = false;
        button.innerHTML = button.getAttribute('data-original-text') || 'رفع الملف';
        button.style.opacity = '1';
    }
}

/**
 * Initialize upload system
 * تهيئة نظام الرفع
 */
export function initUploadSystem() {
    console.log('🚀 Initializing upload system...');

    // Store original button texts
    document.querySelectorAll('[data-upload-btn]').forEach(btn => {
        if (!btn.getAttribute('data-original-text')) {
            btn.setAttribute('data-original-text', btn.textContent);
        }
    });

    console.log('✅ Upload system initialized');
}

/**
 * Reset upload system
 * إعادة تعيين نظام الرفع
 */
export function resetUploadSystem() {
    uploadSystem = null;
    console.log('🔄 Upload system reset');
}
