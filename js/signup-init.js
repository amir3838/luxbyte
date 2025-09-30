// js/signup-init.js - مُهيّئ موحد وآمن لصفحة التسجيل
import { getSupabaseClient } from './supabase-client.js';

// تعريف المستندات المطلوبة لكل دور
const requiredDocsByRole = {
    pharmacy: ['commercial_register', 'tax_card', 'pharmacy_license'],
    supermarket: ['commercial_register', 'tax_card', 'business_license'],
    restaurant: ['commercial_register', 'tax_card', 'food_license'],
    clinic: ['commercial_register', 'tax_card', 'medical_license'],
    courier: ['national_id_front', 'national_id_back', 'driving_license'],
    driver: ['driver_license', 'car_license', 'car_photos']
};

// دوال مساعدة
function $(id) { return document.getElementById(id); }
function toastErr(m) {
    console.error('❌', m);
    if (window.LUXBYTE?.notifyErr) {
        window.LUXBYTE.notifyErr(m);
    } else {
        alert('خطأ: ' + m);
    }
}
function toastOk(m) {
    console.log('✅', m);
    if (window.LUXBYTE?.notifyOk) {
        window.LUXBYTE.notifyOk(m);
    }
}

// دالة ربط بسيط كـ fallback
function bindSimpleUpload(docType) {
    const btn = $(`btn_${docType}`);
    const input = $(`file_${docType}`);

    if (!btn || !input) {
        console.error(`❌ عناصر غير موجودة: btn_${docType}, file_${docType}`);
        return;
    }

    // إزالة المستمعين السابقين
    const newBtn = btn.cloneNode(true);
    const newInput = input.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
    input.parentNode.replaceChild(newInput, input);

    // ربط الأحداث
    newBtn.addEventListener('click', () => {
        newInput.click();
    });

    newInput.addEventListener('change', (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            const preview = $(`preview_${docType}`);
            if (preview) {
                preview.src = url;
                preview.style.display = 'block';
            }
            toastOk(`تم اختيار ملف: ${file.name}`);
        }
    });

    console.log(`✅ تم ربط زر بسيط: ${docType}`);
}

// دالة ربط محسّنة مع دعم الكاميرا
function bindUploadButton(options) {
    const { btnId, inputId, docType, onDone, onError } = options;

    console.log(`🔗 ربط زر الرفع: ${btnId} -> ${inputId} (${docType})`);

    try {
        const button = document.getElementById(btnId);
        const input = document.getElementById(inputId);

        if (!button || !input) {
            throw new Error(`عنصر غير موجود: ${btnId} أو ${inputId}`);
        }

        // إزالة المستمعين السابقين لتجنب التكرار
        const newButton = button.cloneNode(true);
        const newInput = input.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        input.parentNode.replaceChild(newInput, input);

        // ربط الأحداث الجديدة
        newButton.addEventListener('click', async () => {
            try {
                console.log(`📸 فتح الكاميرا/الملف لـ ${docType}`);

                // محاولة فتح الكاميرا أولاً
                if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                    try {
                        const stream = await navigator.mediaDevices.getUserMedia({
                            video: { facingMode: 'environment' }
                        });

                        // إنشاء modal للكاميرا
                        const modal = createCameraModal(stream, docType, 'image/*');
                        document.body.appendChild(modal);

                        // إعداد زر الالتقاط
                        const captureBtn = modal.querySelector('#capture-btn');
                        const cancelBtn = modal.querySelector('#cancel-camera-btn');
                        const video = modal.querySelector('#camera-feed');
                        const canvas = modal.querySelector('#camera-canvas');
                        const context = canvas.getContext('2d');

                        video.srcObject = stream;

                        captureBtn.onclick = async () => {
                            try {
                                canvas.width = video.videoWidth;
                                canvas.height = video.videoHeight;
                                context.drawImage(video, 0, 0, canvas.width, canvas.height);

                                // إيقاف الكاميرا
                                stream.getTracks().forEach(track => track.stop());

                                // تحويل إلى ملف
                                canvas.toBlob(async (blob) => {
                                    const file = new File([blob], `${docType}_${Date.now()}.jpg`, {
                                        type: 'image/jpeg'
                                    });

                                    // رفع الملف
                                    await uploadAndProcess(file, docType, onDone, onError);

                                    // إزالة الـ modal
                                    modal.remove();
                                }, 'image/jpeg', 0.8);

                            } catch (error) {
                                console.error('خطأ في الالتقاط:', error);
                                onError?.(error);
                                stream.getTracks().forEach(track => track.stop());
                                modal.remove();
                            }
                        };

                        cancelBtn.onclick = () => {
                            stream.getTracks().forEach(track => track.stop());
                            modal.remove();
                        };

                    } catch (cameraError) {
                        console.warn('فشل فتح الكاميرا، استخدام اختيار الملف:', cameraError);
                        newInput.click();
                    }
                } else {
                    // fallback لاختيار الملف
                    newInput.click();
                }

            } catch (error) {
                console.error('خطأ في فتح الكاميرا/الملف:', error);
                onError?.(error);
            }
        });

        // ربط اختيار الملف
        newInput.addEventListener('change', async (event) => {
            const file = event.target.files[0];
            if (file) {
                await uploadAndProcess(file, docType, onDone, onError);
            }
        });

        console.log(`✅ تم ربط زر الرفع بنجاح: ${docType}`);

    } catch (error) {
        console.error(`❌ خطأ في ربط زر الرفع ${docType}:`, error);
        onError?.(error);
    }
}

// دالة رفع ومعالجة الملف
async function uploadAndProcess(file, docType, onDone, onError) {
    try {
        // إنشاء URL مؤقت للمعاينة
        const tempUrl = URL.createObjectURL(file);

        // استدعاء onDone مع البيانات
        onDone?.({
            publicUrl: tempUrl,
            path: `temp/${docType}_${Date.now()}.${file.name.split('.').pop()}`,
            file: file
        });

        console.log(`✅ تم معالجة الملف: ${file.name}`);

    } catch (error) {
        console.error('خطأ في معالجة الملف:', error);
        onError?.(error);
    }
}

// دالة إنشاء modal الكاميرا
function createCameraModal(stream, docType, accept) {
    const modal = document.createElement('div');
    modal.className = 'camera-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        z-index: 1000;
        display: flex;
        justify-content: center;
        align-items: center;
    `;

    modal.innerHTML = `
        <div class="camera-content" style="background: white; padding: 20px; border-radius: 10px; text-align: center;">
            <h3 style="margin-bottom: 15px;">التقاط صورة ${getDocumentLabel(docType)}</h3>
            <video id="camera-feed" autoplay style="width: 100%; max-width: 400px; border-radius: 8px;"></video>
            <canvas id="camera-canvas" style="display: none;"></canvas>
            <div class="camera-controls" style="margin-top: 15px;">
                <button id="capture-btn" class="upload-btn" style="margin: 0 5px;">
                    <i class="fas fa-camera"></i> التقاط صورة
                </button>
                <button id="cancel-camera-btn" class="upload-btn" style="background-color: #6c757d; margin: 0 5px;">
                    <i class="fas fa-times"></i> إلغاء
                </button>
            </div>
        </div>
    `;

    return modal;
}

// دالة تهيئة رئيسية - مع دعم ESM
async function init() {
    console.log('🚀 بدء تهيئة صفحة التسجيل...');
    
    // 1) أوقف أي سبينر فوراً
    const spinner = $('uploadButtonsSpinner');
    const container = $('uploadButtonsContainer');
    const banner = $('pageErrorBanner');

    // إخفاء رسالة الخطأ
    if (banner) banner.style.display = 'none';

    try {
        // 2) احصل على الدور من URL
        const urlParams = new URLSearchParams(location.search);
        const role = urlParams.get('role') || 'pharmacy';
        const docs = requiredDocsByRole[role] || requiredDocsByRole.pharmacy;
        
        console.log('🎯 الدور المحدد:', role);
        console.log('📋 المستندات المطلوبة:', docs);

        // 3) تأكد من تهيئة Supabase
        try {
            await getSupabaseClient();
            console.log('✅ Supabase جاهز');
        } catch (supabaseError) {
            console.warn('⚠️ Supabase غير متاح، المتابعة بدون اتصال:', supabaseError.message);
        }

        // 4) ابنِ الأزرار والحقول (دوماً – حتى لو فشل أي شيء آخر)
        buildDocButtons(container, docs);

        // 5) اربط الأزرار بالمدير الموحّد
        for (const docType of docs) {
            try {
                // استخدام bindUploadButton المحسّن
                if (typeof bindUploadButton === 'function') {
                    bindUploadButton({
                        btnId: `btn_${docType}`,
                        inputId: `file_${docType}`,
                        docType,
                        onDone: ({ publicUrl, path }) => {
                            const preview = $(`preview_${docType}`);
                            if (preview) { 
                                preview.src = publicUrl; 
                                preview.style.display = 'block'; 
                            }
                            toastOk(`تم رفع ${getDocumentLabel(docType)} بنجاح`);
                        },
                        onError: (e) => toastErr(`فشل رفع ${getDocumentLabel(docType)}: ${e.message || e}`)
                    });
                } else {
                    // fallback بسيط
                    bindSimpleUpload(docType);
                }
            } catch (bindError) {
                console.error(`❌ خطأ في ربط زر ${docType}:`, bindError);
                // fallback بسيط
                bindSimpleUpload(docType);
            }
        }

        toastOk('تم تهيئة أزرار المستندات بنجاح');
        
    } catch (e) {
        console.error('❌ خطأ في التهيئة:', e);
        toastErr('خطأ في تهيئة الصفحة: ' + (e?.message || e));
        showRetry(container);
    } finally {
        // 6) أخفِ السبينر مهما حدث
        if (spinner) {
            spinner.style.display = 'none';
            console.log('🔄 تم إخفاء السبينر');
        }
    }
}

// بناء أزرار المستندات
function buildDocButtons(container, docs) {
    if (!container) {
        console.error('❌ حاوية الأزرار غير موجودة');
        return;
    }

    console.log('🔨 بناء أزرار المستندات...');
    container.innerHTML = ''; // نظف المحتوى السابق

    for (const doc of docs) {
        const label = getDocumentLabel(doc);
        container.insertAdjacentHTML('beforeend', `
            <div class="file-upload-field" id="field_${doc}">
                <div class="file-upload-label">
                    <label for="file_${doc}">${label}</label>
                    <p class="file-description">JPG, PNG أو PDF (حد أقصى 10 ميجابايت)</p>
                </div>
                <div class="file-upload-controls">
                    <button id="btn_${doc}" type="button" class="upload-btn">
                        <i class="fas fa-camera"></i> تصوير/رفع
                    </button>
                    <input id="file_${doc}" type="file" accept="image/*,.pdf" capture="environment" hidden>
                </div>
                <img id="preview_${doc}" style="display:none;max-width:100%;margin-top:8px;border-radius:8px;" alt="معاينة ${label}">
            </div>
        `);
    }

    console.log(`✅ تم بناء ${docs.length} زر مستند`);
}

// الحصول على تسمية المستند
function getDocumentLabel(doc) {
    const labels = {
        commercial_register: 'السجل التجاري',
        tax_card: 'البطاقة الضريبية',
        pharmacy_license: 'ترخيص الصيدلية',
        pharmacist_register: 'قيد الصيدلي',
        business_license: 'رخصة النشاط التجاري',
        civil_defense_approval: 'موافقة الدفاع المدني',
        food_license: 'رخصة الطعام',
        food_safety_approval: 'موافقة سلامة الغذاء',
        medical_facility_license: 'ترخيص المنشأة الطبية',
        doctor_register: 'قيد الطبيب',
        national_id_front: 'بطاقة الرقم القومي (أمام)',
        national_id_back: 'بطاقة الرقم القومي (خلف)',
        driving_license: 'رخصة القيادة',
        vehicle_license: 'رخصة المركبة',
        vehicle_licenses: 'تراخيص المركبات',
        drivers_files: 'ملفات السائقين'
    };
    return labels[doc] || doc.replace(/_/g, ' ');
}

// إظهار زر إعادة المحاولة
function showRetry(container) {
    if (!container) return;

    container.insertAdjacentHTML('beforeend', `
        <div class="file-upload-field" style="text-align: center; padding: 20px;">
            <h3 style="color: #ef4444; margin-bottom: 16px;">
                <i class="fas fa-exclamation-triangle"></i>
                خطأ في تحميل الأزرار
            </h3>
            <p style="color: #666; margin-bottom: 16px;">
                حدث خطأ أثناء تحميل أزرار رفع المستندات. يرجى المحاولة مرة أخرى.
            </p>
            <button id="retryInit" type="button" class="btn btn-outline">
                <i class="fas fa-redo"></i> إعادة المحاولة
            </button>
        </div>
    `);

    const retryBtn = document.getElementById('retryInit');
    if (retryBtn) {
        retryBtn.addEventListener('click', () => {
            console.log('🔄 إعادة المحاولة...');
            init();
        });
    }
}

// تصدير الدوال للاستخدام الخارجي
export { init, buildDocButtons, getDocumentLabel, bindUploadButton, bindSimpleUpload };

// تهيئة الصفحة عند التحميل
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 تم تحميل صفحة التسجيل');
    init().catch(error => {
        console.error('❌ خطأ في تهيئة الصفحة:', error);
    });
});
