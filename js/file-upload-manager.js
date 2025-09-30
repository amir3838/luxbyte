/**
 * Enhanced Camera Upload Manager for LUXBYTE
 * مدير تصوير ورفع المستندات بالكاميرا المحسّن
 *
 * يحل مشاكل:
 * - تكرار المستمعين (listeners)
 * - رسائل "تم منح إذن الكاميرا" المتكررة
 * - عدم فتح الكاميرا بعد منح الإذن
 * - ضمان العمل على HTTPS/iFrame
 */

import { supabase } from './supabase-client.js';

let stream = null;
let opening = false;   // مانع النقرات المتكررة
let ready = false;

/**
 * Open camera once with proper error handling
 * فتح الكاميرا مرة واحدة مع معالجة الأخطاء المناسبة
 */
export async function openCameraOnce() {
    console.log('🎥 openCameraOnce called');

    if (opening) {
        console.log('⚠️ Camera already opening, ignoring duplicate request');
        return;
    }

    if (stream) {
        console.log('⚠️ Camera already opened, stopping previous stream');
        stopStream();
    }

    opening = true;

    try {
        // شرط الأمان - يجب أن يكون HTTPS أو localhost
        const isSecure = window.isSecureContext || location.hostname === 'localhost';
        if (!isSecure) {
            throw new Error('يجب فتح الموقع عبر HTTPS أو localhost للوصول للكاميرا');
        }

        // فحص قدرات المتصفح
        const supports = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
        const isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

        console.log('🔍 Browser capabilities:', {
            supports,
            isiOS,
            userAgent: navigator.userAgent,
            mediaDevices: !!navigator.mediaDevices,
            getUserMedia: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
        });

        if (!supports || isiOS) {
            console.log('📱 Camera not supported or iOS detected, using file fallback');
            const fallback = document.getElementById('fileFallback');
            if (fallback) {
                fallback.click();
            } else {
                console.error('❌ Fallback file input not found');
                toastErr('عنصر اختيار الملف غير موجود');
            }
            return;
        }

        // طلب الكاميرا مرة واحدة فقط
        console.log('🔐 Requesting camera access...');
        stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: { ideal: 'environment' },
                width: { ideal: 1280 },
                height: { ideal: 720 }
            },
            audio: false
        });

        const video = document.getElementById('camPrev');
        if (!video) {
            console.error('❌ Video element not found');
            throw new Error('عنصر الفيديو camPrev غير موجود');
        }

        console.log('📹 Video element found:', video);
        video.srcObject = stream;
        video.style.display = 'block';
        console.log('📹 Video stream set, display set to block');

        // انتظار جاهزية الفيديو قبل التشغيل
        console.log('⏳ Waiting for video metadata...');
        await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                console.error('⏰ Video metadata timeout');
                reject(new Error('الكاميرا لم تبدأ خلال 5 ثوانٍ'));
            }, 5000);

            video.onloadedmetadata = () => {
                console.log('✅ Video metadata loaded');
                clearTimeout(timeout);
                resolve();
            };

            video.onerror = (error) => {
                console.error('❌ Video error:', error);
                clearTimeout(timeout);
                reject(new Error('خطأ في تحميل الفيديو'));
            };
        });

        console.log('▶️ Starting video playback...');
        await video.play();
        ready = true;
        console.log('✅ Video is ready and playing');

        console.log('✅ Camera opened successfully');
        toastOk('تم فتح الكاميرا بنجاح ✅');

    } catch (error) {
        console.error('❌ Camera error:', error);
        toastErr(humanizeMediaError(error));
        stopStream();

        // فولباك لاختيار الملف
        setTimeout(() => {
            document.getElementById('fileFallback')?.click();
        }, 500);

    } finally {
        opening = false;
    }
}

/**
 * Capture image from camera and upload
 * التقاط صورة من الكاميرا ورفعها
 */
export async function captureAndUpload() {
    const video = document.getElementById('camPrev');
    if (!video || !ready || !video.videoWidth) {
        toastErr('الكاميرا غير جاهزة للالتقاط');
        return false;
    }

    try {
        // إنشاء canvas والالتقاط
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

        // تحويل إلى blob
        const blob = await new Promise(resolve =>
            canvas.toBlob(blob => resolve(blob), 'image/jpeg', 0.9)
        );

        // رفع إلى Supabase
        const filename = `doc_${Date.now()}.jpg`;
        const result = await uploadToSupabase(blob, filename);

        if (result.success) {
            console.log('✅ Image captured and uploaded successfully');
            showImagePreview(result.publicUrl);
            toastOk('تم الالتقاط والرفع بنجاح ✅');
        } else {
            toastErr(`فشل في الرفع: ${result.error}`);
        }

        // إيقاف الكاميرا
        stopStream();
        return result.success;

    } catch (error) {
        console.error('❌ Capture error:', error);
        toastErr(`خطأ في الالتقاط: ${error.message}`);
        return false;
    }
}

/**
 * Handle fallback file selection (iOS/Safari)
 * التعامل مع اختيار الملف كبديل
 */
export async function onFallbackFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
        const filename = `doc_${Date.now()}_${file.name}`;
        const result = await uploadToSupabase(file, filename);

        if (result.success) {
            console.log('✅ File uploaded successfully');
            showImagePreview(result.publicUrl);
            toastOk('تم رفع الملف بنجاح ✅');
        } else {
            toastErr(`فشل في رفع الملف: ${result.error}`);
        }
    } catch (error) {
        console.error('❌ File upload error:', error);
        toastErr(`خطأ في رفع الملف: ${error.message}`);
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
        ready = false;

        const video = document.getElementById('camPrev');
        if (video) {
            video.srcObject = null;
            video.style.display = 'none';
        }

        console.log('🛑 Camera stream stopped');
    }
}

/**
 * Upload file/blob to Supabase Storage
 * رفع الملف إلى Supabase Storage
 */
export async function uploadToSupabase(fileOrBlob, filename) {
    try {
        const { data, error } = await supabase.storage
            .from('kyc_docs')
            .upload(filename, fileOrBlob, {
                upsert: false,
                contentType: 'image/jpeg'
            });

        if (error) {
            console.error('❌ Upload error:', error);
            return { success: false, error: error.message };
        }

        // الحصول على الرابط العام
        const { data: publicData } = supabase.storage
            .from('kyc_docs')
            .getPublicUrl(data.path);

        return {
            success: true,
            publicUrl: publicData.publicUrl,
            path: data.path
        };
    } catch (error) {
        console.error('❌ Upload failed:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Show image preview
 * عرض معاينة الصورة
 */
function showImagePreview(imageUrl) {
    // إزالة المعاينات الموجودة
    const existingPreviews = document.querySelectorAll('.image-preview');
    existingPreviews.forEach(preview => preview.remove());

    // إنشاء عنصر المعاينة
    const preview = document.createElement('div');
    preview.className = 'image-preview';
    preview.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        width: 200px;
        height: 150px;
        border: 2px solid #10b981;
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

    // إزالة تلقائية بعد 5 ثوانٍ
    setTimeout(() => {
        if (preview.parentNode) {
            preview.parentNode.removeChild(preview);
        }
    }, 5000);
}

/**
 * Humanize media error messages
 * تحويل رسائل الأخطاء إلى رسائل مفهومة
 */
function humanizeMediaError(error) {
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
 * Toast notification functions
 * دوال الإشعارات
 */
function toastOk(message) {
    console.log('✅', message);
    // استخدم نظام الإشعارات الموجود في المشروع
    if (typeof LUXBYTE !== 'undefined' && LUXBYTE.notifyOk) {
        LUXBYTE.notifyOk(message);
    } else if (typeof window !== 'undefined' && window.LUXBYTE?.notifyOk) {
        window.LUXBYTE.notifyOk(message);
    }
}

function toastErr(message) {
    console.error('❌', message);
    // استخدم نظام الإشعارات الموجود في المشروع
    if (typeof LUXBYTE !== 'undefined' && LUXBYTE.notifyErr) {
        LUXBYTE.notifyErr(message);
    } else if (typeof window !== 'undefined' && window.LUXBYTE?.notifyErr) {
        window.LUXBYTE.notifyErr(message);
    }
}

// تصدير الدوال للاستخدام العام
if (typeof window !== 'undefined') {
    window.openCameraOnce = openCameraOnce;
    window.captureAndUpload = captureAndUpload;
    window.onFallbackFile = onFallbackFile;
    window.stopStream = stopStream;
}