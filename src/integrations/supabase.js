/**
 * Supabase Integration
 * تكامل Supabase
 *
 * Features:
 * - Client creation with proper configuration
 * - Authentication handling
 * - Storage operations
 * - Error handling
 */

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

let supabaseClient = null;

/**
 * Create Supabase client
 * إنشاء عميل Supabase
 */
export function createSupabaseClient(url, anonKey) {
    if (supabaseClient) {
        console.log('🔄 Using existing Supabase client');
        return supabaseClient;
    }

    console.log('🚀 Creating new Supabase client...');

    try {
        supabaseClient = createClient(url, anonKey, {
            auth: {
                persistSession: true,
                autoRefreshToken: true,
                detectSessionInUrl: true
            },
            realtime: {
                params: {
                    eventsPerSecond: 10
                }
            }
        });

        // Make it globally available for backward compatibility
        if (typeof window !== 'undefined') {
            window.supabase = supabaseClient;
        }

        console.log('✅ Supabase client created successfully');
        return supabaseClient;

    } catch (error) {
        console.error('❌ Failed to create Supabase client:', error);
        throw new Error(`فشل في إنشاء عميل Supabase: ${error.message}`);
    }
}

/**
 * Get current Supabase client
 * الحصول على عميل Supabase الحالي
 */
export function getSupabaseClient() {
    if (!supabaseClient) {
        throw new Error('عميل Supabase غير مهيأ - استدعِ createSupabaseClient أولاً');
    }
    return supabaseClient;
}

/**
 * Test Supabase connection
 * اختبار اتصال Supabase
 */
export async function testSupabaseConnection() {
    const client = getSupabaseClient();

    try {
        const { data, error } = await client.auth.getSession();
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
 * Upload file to Supabase Storage
 * رفع ملف إلى Supabase Storage
 */
export async function uploadFileToStorage(bucket, path, file, options = {}) {
    const client = getSupabaseClient();

    try {
        const { data, error } = await client.storage
            .from(bucket)
            .upload(path, file, {
                cacheControl: '3600',
                upsert: false,
                ...options
            });

        if (error) {
            throw error;
        }

        console.log('✅ File uploaded successfully:', data.path);
        return data;
    } catch (error) {
        console.error('❌ File upload failed:', error);
        throw new Error(`فشل في رفع الملف: ${error.message}`);
    }
}

/**
 * Get public URL for file
 * الحصول على رابط عام للملف
 */
export function getPublicUrl(bucket, path) {
    const client = getSupabaseClient();

    try {
        const { data } = client.storage
            .from(bucket)
            .getPublicUrl(path);

        return data.publicUrl;
    } catch (error) {
        console.error('❌ Failed to get public URL:', error);
        throw new Error(`فشل في الحصول على الرابط العام: ${error.message}`);
    }
}

/**
 * Delete file from Storage
 * حذف ملف من التخزين
 */
export async function deleteFileFromStorage(bucket, path) {
    const client = getSupabaseClient();

    try {
        const { error } = await client.storage
            .from(bucket)
            .remove([path]);

        if (error) {
            throw error;
        }

        console.log('✅ File deleted successfully:', path);
        return true;
    } catch (error) {
        console.error('❌ File deletion failed:', error);
        throw new Error(`فشل في حذف الملف: ${error.message}`);
    }
}

/**
 * List files in bucket
 * قائمة الملفات في المجلد
 */
export async function listFilesInBucket(bucket, folder = '') {
    const client = getSupabaseClient();

    try {
        const { data, error } = await client.storage
            .from(bucket)
            .list(folder);

        if (error) {
            throw error;
        }

        return data;
    } catch (error) {
        console.error('❌ Failed to list files:', error);
        throw new Error(`فشل في قائمة الملفات: ${error.message}`);
    }
}
