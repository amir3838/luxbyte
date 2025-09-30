/**
 * Camera Upload Manager for LUXBYTE
 * مدير تصوير ورفع المستندات بالكاميرا
 */

import { supabase } from './supabase-client.js';

let stream = null;

/**
 * Open camera for document capture
 * فتح الكاميرا لتصوير المستندات
 */
export async function openCamera() {
    const supports = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    const isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    if (!supports || isiOS) {
        console.log('Camera not supported or iOS detected, using file fallback');
        return document.getElementById('fileFallback').click();
    }

    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: { ideal: 'environment' }
            },
            audio: false
        });

        const video = document.getElementById('camPrev');
        if (video) {
            video.srcObject = stream;
            video.play();
        }

        console.log('Camera opened successfully');
        return true;
    } catch (error) {
        console.error('Failed to open camera:', error);
        // Fallback to file input
        return document.getElementById('fileFallback').click();
    }
}

/**
 * Capture image from camera and upload
 * التقاط صورة من الكاميرا ورفعها
 */
export async function captureAndUpload() {
    const video = document.getElementById('camPrev');
    if (!video || !video.videoWidth) {
        console.error('Video not ready for capture');
        return false;
    }

    try {
        // Create canvas and capture frame
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);

        // Convert to blob
        const blob = await new Promise(resolve =>
            canvas.toBlob(blob => resolve(blob), 'image/jpeg', 0.9)
        );

        // Upload to Supabase
        const filename = `doc_${Date.now()}.jpg`;
        const result = await uploadToSupabase(blob, filename);

        if (result.success) {
            console.log('Image captured and uploaded successfully');
            showImagePreview(result.publicUrl);
        }

        // Stop camera
        stopStream();
        return result.success;
    } catch (error) {
        console.error('Failed to capture and upload:', error);
        return false;
    }
}

/**
 * Handle fallback file selection
 * التعامل مع اختيار الملف كبديل
 */
export async function onFallbackFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
        const filename = `doc_${Date.now()}_${file.name}`;
        const result = await uploadToSupabase(file, filename);

        if (result.success) {
            console.log('File uploaded successfully');
            showImagePreview(result.publicUrl);
        }
    } catch (error) {
        console.error('Failed to upload file:', error);
    }
}

/**
 * Stop camera stream
 * إيقاف تدفق الكاميرا
 */
export function stopStream() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }
}

/**
 * Upload file/blob to Supabase Storage
 * رفع الملف إلى Supabase Storage
 */
async function uploadToSupabase(fileOrBlob, filename) {
    try {
        const { data, error } = await supabase.storage
            .from('kyc_docs')
            .upload(filename, fileOrBlob, {
                upsert: false,
                contentType: 'image/jpeg'
            });

        if (error) {
            console.error('Upload error:', error);
            return { success: false, error: error.message };
        }

        // Get public URL
        const { data: publicData } = supabase.storage
            .from('kyc_docs')
            .getPublicUrl(data.path);

        return {
            success: true,
            publicUrl: publicData.publicUrl,
            path: data.path
        };
    } catch (error) {
        console.error('Upload failed:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Show image preview
 * عرض معاينة الصورة
 */
function showImagePreview(imageUrl) {
    // Remove existing previews
    const existingPreviews = document.querySelectorAll('.image-preview');
    existingPreviews.forEach(preview => preview.remove());

    // Create preview element
    const preview = document.createElement('div');
    preview.className = 'image-preview';
    preview.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        width: 200px;
        height: 150px;
        border: 2px solid #4CAF50;
        border-radius: 8px;
        overflow: hidden;
        background: white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 1000;
    `;

    const img = document.createElement('img');
    img.src = imageUrl;
    img.style.cssText = `
        width: 100%;
        height: 100%;
        object-fit: cover;
    `;

    preview.appendChild(img);
    document.body.appendChild(preview);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (preview.parentNode) {
            preview.parentNode.removeChild(preview);
        }
    }, 5000);
}

// Export functions to window for onclick handlers
if (typeof window !== 'undefined') {
    window.openCamera = openCamera;
    window.captureAndUpload = captureAndUpload;
    window.onFallbackFile = onFallbackFile;
    window.stopStream = stopStream;
}
