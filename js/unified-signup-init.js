/**
 * Unified Signup Page Initializer
 * مُهيئ صفحة التسجيل الموحدة
 * 
 * Features:
 * - Idempotent button generation
 * - Proper script loading order
 * - Error handling with timeouts
 * - Fallback for unsupported browsers
 * - Clear error logging
 */

import { ensureSupabaseReady, renderUploadButtons } from './file-upload-manager.js';

// Document types by role
const DOCS_BY_ROLE = {
    pharmacy: ['commercial_register', 'tax_card', 'lease_contract', 'pharmacy_license', 'pharmacist_register'],
    supermarket: ['commercial_register', 'tax_card', 'lease_contract', 'business_license', 'civil_defense_approval'],
    restaurant: ['commercial_register', 'tax_card', 'lease_contract', 'food_license', 'food_safety_approval'],
    clinic: ['commercial_register', 'tax_card', 'lease_contract', 'medical_facility_license', 'doctor_register'],
    courier: ['national_id', 'driving_license', 'vehicle_license', 'criminal_record', 'personal_photos'],
    driver: ['commercial_register', 'tax_card', 'vehicle_licenses', 'drivers_files', 'civil_defense_approval']
};

let booted = false;
let initializationAttempts = 0;
const MAX_ATTEMPTS = 3;

/**
 * Initialize upload UI with proper error handling
 * تهيئة واجهة الرفع مع معالجة الأخطاء
 */
export async function initUploadUI() {
    if (booted) {
        console.log('🔄 Upload UI already initialized');
        return;
    }

    initializationAttempts++;
    console.log(`🚀 Initializing upload UI (attempt ${initializationAttempts}/${MAX_ATTEMPTS})`);

    const spinner = document.getElementById('uploadButtonsSpinner');
    const banner = document.getElementById('pageErrorBanner');
    const container = document.getElementById('uploadButtonsContainer');

    // Show spinner
    if (spinner) {
        spinner.style.display = 'block';
        spinner.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري تحميل أزرار رفع الصور...';
    }

    // Hide error banner
    if (banner) {
        banner.style.display = 'none';
    }

    try {
        // Check if container exists
        if (!container) {
            throw new Error('لم يتم العثور على حاوية أزرار الرفع');
        }

        // Ensure Supabase is ready
        await ensureSupabaseReady();

        // Get role from URL
        const url = new URL(location.href);
        const role = (url.searchParams.get('role') || 'pharmacy').toLowerCase();
        console.log('🎯 Selected role:', role);

        // Validate role
        if (!DOCS_BY_ROLE[role]) {
            throw new Error(`نوع النشاط غير صحيح: ${role}`);
        }

        const docs = DOCS_BY_ROLE[role];
        console.log('📋 Documents for role:', docs);

        // Set up timeout watchdog
        const watchdog = setTimeout(() => {
            console.warn('⏰ Upload UI initialization timeout');
            if (spinner) {
                spinner.style.display = 'none';
            }
            showError('تأخر تحميل الأزرار. جرّب إعادة المحاولة.');
        }, 2000);

        // Render upload buttons
        await renderUploadButtons(container, docs);

        // Clear timeout
        clearTimeout(watchdog);

        // Hide spinner
        if (spinner) {
            spinner.style.display = 'none';
        }

        // Mark as booted
        booted = true;
        console.log('✅ Upload UI initialized successfully');

    } catch (error) {
        console.error('❌ Upload UI initialization failed:', error);
        
        // Hide spinner
        if (spinner) {
            spinner.style.display = 'none';
        }

        // Show error
        showError(error?.message || String(error));

        // Retry if under max attempts
        if (initializationAttempts < MAX_ATTEMPTS) {
            console.log(`🔄 Retrying in 1 second... (${initializationAttempts}/${MAX_ATTEMPTS})`);
            setTimeout(() => {
                booted = false; // Reset booted flag for retry
                initUploadUI();
            }, 1000);
        }
    }
}

/**
 * Show error message
 * عرض رسالة الخطأ
 */
function showError(message) {
    console.error('🚨 Upload UI Error:', message);
    
    const banner = document.getElementById('pageErrorBanner');
    if (banner) {
        banner.innerHTML = `
            <div style="background: #fee2e2; border: 1px solid #fecaca; color: #dc2626; padding: 12px; border-radius: 8px; margin: 16px 0;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <i class="fas fa-exclamation-triangle"></i>
                    <strong>حدث خطأ:</strong> ${message}
                </div>
                <div style="margin-top: 8px;">
                    <button onclick="retryUploadUI()" style="background: #dc2626; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">
                        <i class="fas fa-redo"></i> إعادة المحاولة
                    </button>
                </div>
            </div>
        `;
        banner.style.display = 'block';
    }

    // Also show toast notification
    if (typeof LUXBYTE !== 'undefined' && LUXBYTE.notifyErr) {
        LUXBYTE.notifyErr(`خطأ في تحميل أزرار الرفع: ${message}`);
    }
}

/**
 * Retry upload UI initialization
 * إعادة محاولة تهيئة واجهة الرفع
 */
function retryUploadUI() {
    console.log('🔄 Retrying upload UI initialization...');
    booted = false;
    initializationAttempts = 0;
    initUploadUI();
}

// Make retry function globally available
if (typeof window !== 'undefined') {
    window.retryUploadUI = retryUploadUI;
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUploadUI);
} else {
    initUploadUI();
}
