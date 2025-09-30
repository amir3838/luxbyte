/**
 * Unified Signup Page Bootstrap
 * تهيئة صفحة التسجيل الموحدة
 *
 * Features:
 * - Environment loading
 * - Supabase initialization
 * - Upload system setup
 * - Error handling
 */

import { loadEnv, validateEnv } from '../utils/env.js';
import { toastError, toastSuccess } from '../utils/toast.js';
import { createSupabaseClient } from '../integrations/supabase.js';
import { setupUploadButtons, initUploadSystem } from '../ui/upload.js';

let isInitialized = false;

/**
 * Bootstrap the unified signup page
 * تهيئة صفحة التسجيل الموحدة
 */
async function bootstrap() {
    if (isInitialized) {
        console.log('🔄 Page already initialized, skipping...');
        return;
    }

    console.log('🚀 Bootstrapping unified signup page...');

    try {
        // Load environment variables
        console.log('📦 Loading environment variables...');
        const ENV = await loadEnv();

        // Validate environment
        const { ok, missing } = validateEnv(ENV);
        if (!ok) {
            throw new Error(`متغيّرات البيئة غير مكتملة: ${missing.join(', ')}`);
        }

        console.log('✅ Environment variables loaded and validated');

        // Create Supabase client
        console.log('🔗 Creating Supabase client...');
        const supabase = createSupabaseClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY);

        // Test connection
        const connectionOk = await testSupabaseConnection(supabase);
        if (!connectionOk) {
            console.warn('⚠️ Supabase connection test failed, but continuing...');
        }

        // Initialize upload system
        console.log('📤 Initializing upload system...');
        initUploadSystem();

        // Setup upload buttons
        console.log('🔘 Setting up upload buttons...');
        setupUploadButtons({
            supabase,
            bucket: ENV.STORAGE_BUCKET,
            maxMb: Number(ENV.MAX_UPLOAD_MB || 10),
            allowed: ENV.ALLOWED_MIME || ['image/jpeg', 'image/png', 'application/pdf']
        });

        // Mark as initialized
        isInitialized = true;
        console.log('✅ Unified signup page bootstrapped successfully');

        // Show success message
        toastSuccess('تم تحميل النظام بنجاح');

    } catch (error) {
        console.error('❌ Bootstrap failed:', error);
        toastError(`خطأ في تحميل النظام: ${error.message}`);

        // Show retry button
        showRetryButton();
    }
}

/**
 * Test Supabase connection
 * اختبار اتصال Supabase
 */
async function testSupabaseConnection(supabase) {
    try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
            console.warn('⚠️ Supabase session check failed:', error);
            return false;
        }
        console.log('✅ Supabase connection test successful');
        return true;
    } catch (error) {
        console.error('❌ Supabase connection test failed:', error);
        return false;
    }
}

/**
 * Show retry button
 * عرض زر إعادة المحاولة
 */
function showRetryButton() {
    const container = document.getElementById('uploadButtonsContainer');
    if (!container) return;

    container.innerHTML = `
        <div style="text-align: center; padding: 40px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; margin: 20px 0;">
            <i class="fas fa-exclamation-triangle" style="font-size: 48px; color: #dc2626; margin-bottom: 16px;"></i>
            <h3 style="color: #dc2626; margin-bottom: 16px;">فشل في تحميل النظام</h3>
            <p style="color: #6b7280; margin-bottom: 24px;">حدث خطأ أثناء تحميل النظام. يرجى المحاولة مرة أخرى.</p>
            <button onclick="retryBootstrap()" style="
                background: #dc2626;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 16px;
                font-weight: 500;
                transition: background-color 0.2s;
            " onmouseover="this.style.backgroundColor='#b91c1c'" onmouseout="this.style.backgroundColor='#dc2626'">
                <i class="fas fa-redo"></i> إعادة المحاولة
            </button>
        </div>
    `;
}

/**
 * Retry bootstrap
 * إعادة محاولة التهيئة
 */
function retryBootstrap() {
    console.log('🔄 Retrying bootstrap...');
    isInitialized = false;
    bootstrap();
}

// Make retry function globally available
if (typeof window !== 'undefined') {
    window.retryBootstrap = retryBootstrap;
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
} else {
    bootstrap();
}
