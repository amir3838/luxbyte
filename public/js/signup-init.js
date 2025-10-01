// js/signup-init.js - مُهيّئ موحد وآمن لصفحة التسجيل
import { initSupabase } from './supabase-client.js';

// تعريف المستندات المطلوبة لكل دور - مفصل حسب النشاط
const requiredDocsByRole = {
    // 🏥 صيدلية (Pharmacy)
    pharmacy: [
        'pharmacist_license',           // صورة ترخيص/قيد صيدلي أو كارنيه النقابة
        'pharmacist_id_front',          // صورة بطاقة الصيدلي المسؤول (وجه)
        'pharmacist_id_back',           // صورة بطاقة الصيدلي المسؤول (ظهر)
        'commercial_register'           // صورة السجل التجاري
    ],

    // 🍽️ مطعم (Restaurant)
    restaurant: [
        'health_certificate',           // صورة شهادة صحية للمدير أو الشيف
        'manager_id_front',             // صورة بطاقة المدير (وجه)
        'manager_id_back',              // صورة بطاقة المدير (ظهر)
        'commercial_register',          // صورة السجل التجاري (إن وجد)
        'rental_contract',              // صورة عقد مقر موثق (إيجار/تمليك)
        'utilities_receipt',            // صورة إيصال مرافق حديث
        'food_license',                 // صورة رخصة تشغيل مأكولات (قد تُطلب لاحقًا)
        'food_safety_approval'          // صورة موافقة جهاز سلامة الغذاء (قد تُطلب لاحقًا)
    ],

    // 🛒 سوبر ماركت (Supermarket)
    supermarket: [
        'food_safety_certificate',      // صورة شهادة صحية لمسؤول الأغذية (لو يتعامل مع لحوم/ألبان)
        'manager_id_front',             // صورة بطاقة المدير (وجه)
        'manager_id_back',              // صورة بطاقة المدير (ظهر)
        'commercial_register',          // صورة السجل التجاري
        'rental_contract',              // صورة عقد مقر موثق (إيجار/تمليك)
        'utilities_receipt'             // صورة إيصال مرافق حديث
    ],

    // 🩺 عيادة (Clinic)
    clinic: [
        'doctor_id_front',              // صورة بطاقة الطبيب (وجه)
        'doctor_id_back',               // صورة بطاقة الطبيب (ظهر)
        'doctor_union_register',        // صورة قيد نقابة الطبيب
        'commercial_register',          // صورة السجل التجاري/ترخيص النشاط (إن وجد)
        'rental_contract',              // صورة عقد مقر موثق (إيجار/تمليك)
        'utilities_receipt',            // صورة إيصال مرافق حديث
        'medical_facility_license'      // صورة ترخيص منشأة طبية (قد يُطلب لاحقًا)
    ],

    // 🚴‍♂️ مندوب توصيل (Courier – فرد)
    courier: [
        'national_id_front',            // صورة بطاقة رقم قومي (وجه)
        'national_id_back',             // صورة بطاقة رقم قومي (ظهر)
        'driving_license_front',        // صورة رخصة قيادة سارية (وجه)
        'driving_license_back',         // صورة رخصة قيادة سارية (ظهر)
        'personal_photo',               // صورة شخصية واضحة (Selfie)
        'vehicle_front_photo',          // صورة المركبة من الأمام
        'vehicle_plate_photo'           // صورة لوحة المركبة الخلفية
    ],

    // 🚚 سائق رئيسي / Master Driver (شركة/أسطول)
    driver: [
        'vehicle_license_front_1',      // صورة رخصة مركبة (مركبة 1 – وجه)
        'vehicle_license_back_1',       // صورة رخصة مركبة (مركبة 1 – ظهر)
        'driver_license_1',             // صورة رخصة سائق 1
        'driver_id_1'                   // صورة بطاقة سائق 1
    ]
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
        newBtn.addEventListener('click', async () => {
            try {
                // طلب إذن الكاميرا أولاً
                if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                    const stream = await navigator.mediaDevices.getUserMedia({
                        video: {
                            facingMode: 'environment' // استخدام الكاميرا الخلفية
                        }
                    });

                    // إيقاف الكاميرا فوراً
                    stream.getTracks().forEach(track => track.stop());

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

                } else {
                    // fallback لاختيار الملف
                    newInput.click();
                }
            } catch (error) {
                console.warn('فشل فتح الكاميرا، استخدام اختيار الملف:', error);
                newInput.click();
            }
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

// دالة إنشاء modal الكاميرا
function createCameraModal(stream, docType, accept) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        z-index: 10000;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    `;

    modal.innerHTML = `
        <div style="background: white; border-radius: 12px; padding: 20px; max-width: 90%; max-height: 90%; display: flex; flex-direction: column; align-items: center;">
            <h3 style="margin-bottom: 20px; color: #333;">التقاط صورة ${docType}</h3>
            <video id="camera-feed" autoplay style="width: 100%; max-width: 400px; border-radius: 8px;"></video>
            <canvas id="camera-canvas" style="display: none;"></canvas>
            <div style="margin-top: 20px; display: flex; gap: 10px;">
                <button id="capture-btn" style="background: #4CAF50; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;">
                    <i class="fas fa-camera"></i> التقاط
                </button>
                <button id="cancel-camera-btn" style="background: #f44336; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;">
                    <i class="fas fa-times"></i> إلغاء
                </button>
            </div>
        </div>
    `;

    return modal;
}

// دالة رفع ومعالجة الملف
async function uploadAndProcess(file, docType, onDone, onError) {
    try {
        // التحقق من نوع الملف
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
        if (!allowedTypes.includes(file.type)) {
            throw new Error('نوع الملف غير مدعوم. يرجى اختيار ملف JPG, PNG أو PDF');
        }

        // التحقق من حجم الملف (5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            throw new Error('حجم الملف كبير جداً. الحد الأقصى 5MB');
        }

        // إنشاء URL مؤقت للمعاينة
        const tempUrl = URL.createObjectURL(file);

        // التحقق من وجود جلسة مستخدم
        const supabase = await initSupabase();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            throw new Error('يجب إنشاء حساب وتأكيد البريد أولًا');
        }

        // رفع الملف إلى Supabase Storage
        const fileName = `${docType}_${Date.now()}.${file.name.split('.').pop()}`;
        const filePath = `kyc_docs/${getRoleFromUrl()}/${user.id}/${docType}/${fileName}`;

        const { data, error } = await supabase.storage
            .from('kyc_docs')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false,
                contentType: file.type
            });

        if (error) {
            throw new Error(`فشل في رفع الملف: ${error.message}`);
        }

        // الحصول على الرابط العام
        const { data: publicData } = supabase.storage
            .from('kyc_docs')
            .getPublicUrl(filePath);

        // استدعاء onDone مع البيانات
        onDone?.({
            publicUrl: publicData.publicUrl,
            path: filePath,
            file: file,
            tempUrl: tempUrl
        });

        console.log(`✅ تم رفع الملف بنجاح: ${fileName}`);

    } catch (error) {
        console.error('خطأ في معالجة الملف:', error);
        onError?.(error);
    }
}

// دالة للحصول على الدور من URL
function getRoleFromUrl() {
    const urlParams = new URLSearchParams(location.search);
    return urlParams.get('role') || 'restaurant';
}

// دالة معالجة المستندات مع التحقق
function handleDocumentUpload(docType) {
    const fileInput = document.getElementById(`file_${docType}`);
    const preview = document.getElementById(`preview_${docType}`);
    const img = document.getElementById(`img_${docType}`);
    const info = document.getElementById(`info_${docType}`);
    const error = document.getElementById(`error_${docType}`);
    const btn = document.getElementById(`btn_${docType}`);

    if (!fileInput || !preview) return;

    fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // إخفاء رسائل الخطأ السابقة
        if (error) error.style.display = 'none';

        // إظهار حالة التحميل
        if (btn) {
            btn.classList.add('is-loading');
            btn.disabled = true;
        }

        try {
            // التحقق من صحة الملف
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
            if (!allowedTypes.includes(file.type)) {
                throw new Error('نوع الملف غير مدعوم. يرجى اختيار ملف JPG, PNG أو PDF');
            }

            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                throw new Error('حجم الملف كبير جداً. الحد الأقصى 5MB');
            }

            // معاينة الملف
            const tempUrl = URL.createObjectURL(file);
            if (img) {
                img.src = tempUrl;
                img.style.display = 'block';
            }
            if (preview) preview.style.display = 'block';
            if (info) {
                info.innerHTML = `
                    <div style="font-size: 12px; color: #666; margin-top: 4px;">
                        ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)
                    </div>
                `;
            }

            // رفع الملف
            await uploadAndProcess(file, docType,
                (data) => {
                    console.log(`✅ تم رفع ${docType} بنجاح`);
                    if (window.LUXBYTE?.notifyOk) {
                        window.LUXBYTE.notifyOk(`تم رفع ${getDocumentLabel(docType)} بنجاح`);
                    }
                },
                (err) => {
                    console.error(`❌ فشل رفع ${docType}:`, err);
                    if (error) {
                        error.textContent = err.message;
                        error.style.display = 'block';
                    }
                    if (window.LUXBYTE?.notifyErr) {
                        window.LUXBYTE.notifyErr(`فشل رفع ${getDocumentLabel(docType)}: ${err.message}`);
                    }
                }
            );

        } catch (err) {
            console.error(`❌ خطأ في معالجة ${docType}:`, err);
            if (error) {
                error.textContent = err.message;
                error.style.display = 'block';
            }
        } finally {
            // إخفاء حالة التحميل
            if (btn) {
                btn.classList.remove('is-loading');
                btn.disabled = false;
            }
        }
    });
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

// Initialize document uploader with dynamic rendering
function initializeDocumentUploader(role) {
    const urlRole = new URLSearchParams(location.search).get('role');
    const currentRole = (urlRole || role || '').trim();

    // خريطة المستندات (Fallback لو الـconfig مش جاهز)
    const DOCS_BY_ROLE = {
        pharmacy: [
            {key:'ph_license', label:'صورة ترخيص/قيد صيدلي أو كارنيه النقابة', accept:'image/*,application/pdf', required:true},
            {key:'ph_id_front', label:'بطاقة الصيدلي المسؤول (وجه)', accept:'image/*', required:true},
            {key:'ph_id_back', label:'بطاقة الصيدلي المسؤول (ظهر)', accept:'image/*', required:true},
            {key:'ph_cr', label:'السجل التجاري', accept:'image/*,application/pdf', required:true}
        ],
        restaurant: [
            {key:'rs_health', label:'شهادة صحية للمدير/الشيف', accept:'image/*,application/pdf', required:true},
            {key:'rs_mgr_front', label:'بطاقة المدير (وجه)', accept:'image/*', required:true},
            {key:'rs_mgr_back', label:'بطاقة المدير (ظهر)', accept:'image/*', required:true},
            {key:'rs_cr', label:'السجل التجاري (إن وجد)', accept:'image/*,application/pdf', required:false},
            {key:'rs_lease', label:'عقد مقر موثق', accept:'image/*,application/pdf', required:true},
            {key:'rs_bill', label:'إيصال مرافق حديث', accept:'image/*,application/pdf', required:true}
        ],
        supermarket: [
            {key:'sm_health', label:'شهادة صحية لمسؤول الأغذية', accept:'image/*,application/pdf', required:false},
            {key:'sm_mgr_front', label:'بطاقة المدير (وجه)', accept:'image/*', required:true},
            {key:'sm_mgr_back', label:'بطاقة المدير (ظهر)', accept:'image/*', required:true},
            {key:'sm_cr', label:'السجل التجاري', accept:'image/*,application/pdf', required:true},
            {key:'sm_lease', label:'عقد مقر موثق', accept:'image/*,application/pdf', required:true},
            {key:'sm_bill', label:'إيصال مرافق حديث', accept:'image/*,application/pdf', required:true}
        ],
        clinic: [
            {key:'cl_doc_front', label:'بطاقة الطبيب (وجه)', accept:'image/*', required:true},
            {key:'cl_doc_back', label:'بطاقة الطبيب (ظهر)', accept:'image/*', required:true},
            {key:'cl_union', label:'قيد نقابة الطبيب', accept:'image/*,application/pdf', required:true},
            {key:'cl_cr', label:'السجل التجاري/ترخيص النشاط (إن وجد)', accept:'image/*,application/pdf', required:false},
            {key:'cl_lease', label:'عقد مقر موثق', accept:'image/*,application/pdf', required:true},
            {key:'cl_bill', label:'إيصال مرافق حديث', accept:'image/*,application/pdf', required:true}
        ],
        courier: [
            {key:'co_id_front', label:'بطاقة رقم قومي (وجه)', accept:'image/*', required:true},
            {key:'co_id_back', label:'بطاقة رقم قومي (ظهر)', accept:'image/*', required:true},
            {key:'co_drv_front', label:'رخصة قيادة سارية (وجه)', accept:'image/*', required:true},
            {key:'co_drv_back', label:'رخصة قيادة سارية (ظهر)', accept:'image/*', required:true},
            {key:'co_selfie', label:'صورة شخصية واضحة', accept:'image/*', required:true},
            {key:'co_vehicle_front', label:'صورة المركبة من الأمام', accept:'image/*', required:false},
            {key:'co_plate', label:'صورة لوحة المركبة الخلفية', accept:'image/*', required:false}
        ],
        driver: [
            {key:'md_vehicle_license_front', label:'رخصة مركبة (وجه)', accept:'image/*', required:true},
            {key:'md_vehicle_license_back', label:'رخصة مركبة (ظهر)', accept:'image/*', required:true},
            {key:'md_driver_license', label:'رخصة سائق', accept:'image/*', required:true},
            {key:'md_driver_id', label:'بطاقة سائق', accept:'image/*', required:true}
        ]
    };

    const MAX_MB = 5;
    const state = { files: new Map() };

    function renderDocsList(r) {
        const list = DOCS_BY_ROLE[r] || [];
        const host = document.getElementById('docs-uploader');
        if (!host) return;
        host.innerHTML = '';

        list.forEach(doc => {
            const row = document.createElement('div');
            row.className = 'doc-item';
            row.dataset.key = doc.key;

            row.innerHTML = `
                <div class="doc-title">${doc.label}${doc.required ? ' <span style="color:#c00">*</span>' : ''}</div>
                <div class="doc-actions">
                    <input class="doc-input" type="file" accept="${doc.accept}" ${/image\//.test(doc.accept)?'capture="environment"':''} />
                    <button type="button" class="btn btn-sm replace-btn">استبدال</button>
                    <div class="doc-preview"></div>
                </div>
                <div class="doc-error" hidden></div>
            `;

            const input = row.querySelector('.doc-input');
            const err = row.querySelector('.doc-error');
            const preview = row.querySelector('.doc-preview');
            const replaceBtn = row.querySelector('.replace-btn');

            function showErr(msg){ err.textContent = msg; err.hidden = !msg; }
            function onFile(f){
                showErr('');
                if (!f) { state.files.delete(doc.key); preview.innerHTML=''; return; }
                const okType = /^(image\/(jpe?g|png|webp)|application\/pdf)$/.test(f.type);
                const okSize = f.size <= MAX_MB*1024*1024;
                if (!okType) return showErr('نوع الملف غير مدعوم');
                if (!okSize) return showErr('الحد الأقصى 5MB');
                state.files.set(doc.key, f);
                if (f.type.startsWith('image/')) {
                    const url = URL.createObjectURL(f);
                    preview.innerHTML = `<img src="${url}" alt="preview">`;
                } else {
                    preview.innerHTML = `PDF ✔ (${Math.round(f.size/1024)} KB)`;
                }
            }

            input.addEventListener('change', e => onFile(e.target.files?.[0]));
            replaceBtn.addEventListener('click', () => input.click());

            host.appendChild(row);
        });
    }

    // استدعِ الرندر عند فتح تبويب "المستندات" أو فورًا إن كان هو الحالي
    const docsTabBtn = document.querySelector('[data-tab="documents"], .tab-documents, #tab-documents');
    if (docsTabBtn) {
        docsTabBtn.addEventListener('click', () => renderDocsList(currentRole));
    }
    // لو التبويب بالفعل نشِط:
    const activeTab = document.querySelector('.tabs .active[data-tab="documents"]');
    if (activeTab) renderDocsList(currentRole);

    // اربط زر "التالي" للتأكد من أن كل المطلوب موجود قبل الرفع
    const nextBtn = document.querySelector('#next-btn, .btn-next');
    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            const required = (DOCS_BY_ROLE[currentRole]||[]).filter(d=>d.required).map(d=>d.key);
            const missing = required.filter(k=>!state.files.has(k));
            if (missing.length) {
                e.preventDefault();
                const host = document.getElementById('docs-uploader');
                if (host) {
                    host.scrollIntoView({behavior:'smooth', block:'center'});
                }
                alert('من فضلك ارفع جميع المستندات المطلوبة قبل المتابعة.');
            }
        }, {passive:false});
    }

    // اجعل الحالة متاحة لباقي الشيفرة
    window.__docsState = state;
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
        const role = urlParams.get('role') || 'restaurant';

        // Initialize document uploader
        initializeDocumentUploader(role);

        if (!role) {
            console.warn('Role missing; using default restaurant');
        }

        const docs = requiredDocsByRole[role] || requiredDocsByRole.restaurant;

        console.log('🎯 الدور المحدد:', role);
        console.log('📋 المستندات المطلوبة:', docs);

        // 3) تأكد من تهيئة الإعدادات أولاً
        try {
            if (typeof window.initConfig === 'function') {
                await window.initConfig();
                console.log('✅ الإعدادات جاهزة');
            }
        } catch (configError) {
            console.warn('⚠️ فشل في تحميل الإعدادات:', configError.message);
        }

        // 4) تأكد من تهيئة Supabase
        try {
            await initSupabase();
            console.log('✅ Supabase جاهز');
        } catch (supabaseError) {
            console.warn('⚠️ Supabase غير متاح، المتابعة بدون اتصال:', supabaseError.message);
        }

        // 5) ابنِ الأزرار والحقول (دوماً – حتى لو فشل أي شيء آخر)
        buildDocButtons(container, docs);

        // 6) اربط الأزرار بالمدير الموحّد
        for (const docType of docs) {
            try {
                // استخدام النظام الجديد
                handleDocumentUpload(docType);

                // ربط زر الرفع
                const btn = document.getElementById(`btn_${docType}`);
                if (btn) {
                    btn.addEventListener('click', () => {
                        const fileInput = document.getElementById(`file_${docType}`);
                        if (fileInput) fileInput.click();
                    });
                }
            } catch (bindError) {
                console.error(`❌ خطأ في ربط زر ${docType}:`, bindError);
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
            <div class="doc-item" id="field_${doc}">
                <div class="doc-title">${label}</div>
                <div class="actions">
                    <button id="btn_${doc}" type="button" class="btn btn-outline">
                        <i class="fas fa-upload"></i> رفع ملف
                    </button>
                    <button type="button" class="btn btn-outline" onclick="document.getElementById('file_${doc}').click()">
                        <i class="fas fa-camera"></i> التقاط بالكاميرا
                    </button>
                    <input id="file_${doc}" type="file" accept="image/*,application/pdf" multiple="false" style="display: none;">
                </div>
                <div class="preview" id="preview_${doc}" style="display: none;">
                    <img id="img_${doc}" style="max-width: 100%; max-height: 90px; border-radius: 4px;" alt="معاينة ${label}">
                    <div class="file-info" id="info_${doc}"></div>
                </div>
                <div class="error-text" id="error_${doc}" style="display: none;"></div>
            </div>
        `);
    }

    console.log(`✅ تم بناء ${docs.length} زر مستند`);
}

// الحصول على تسمية المستند
function getDocumentLabel(doc) {
    const labels = {
        // صيدلية
        pharmacist_license: 'ترخيص/قيد صيدلي أو كارنيه النقابة',
        pharmacist_id_front: 'بطاقة الصيدلي المسؤول (وجه)',
        pharmacist_id_back: 'بطاقة الصيدلي المسؤول (ظهر)',
        commercial_register: 'السجل التجاري',

        // مطعم
        health_certificate: 'شهادة صحية للمدير أو الشيف',
        manager_id_front: 'بطاقة المدير (وجه)',
        manager_id_back: 'بطاقة المدير (ظهر)',
        rental_contract: 'عقد مقر موثق (إيجار/تمليك)',
        utilities_receipt: 'إيصال مرافق حديث',
        food_license: 'رخصة تشغيل مأكولات',
        food_safety_approval: 'موافقة جهاز سلامة الغذاء',

        // سوبر ماركت
        food_safety_certificate: 'شهادة صحية لمسؤول الأغذية',

        // عيادة
        doctor_id_front: 'بطاقة الطبيب (وجه)',
        doctor_id_back: 'بطاقة الطبيب (ظهر)',
        doctor_union_register: 'قيد نقابة الطبيب',
        medical_facility_license: 'ترخيص منشأة طبية',

        // مندوب توصيل
        national_id_front: 'بطاقة الرقم القومي (وجه)',
        national_id_back: 'بطاقة الرقم القومي (ظهر)',
        driving_license_front: 'رخصة القيادة (وجه)',
        driving_license_back: 'رخصة القيادة (ظهر)',
        personal_photo: 'صورة شخصية واضحة (Selfie)',
        vehicle_front_photo: 'صورة المركبة من الأمام',
        vehicle_plate_photo: 'صورة لوحة المركبة الخلفية',

        // سائق رئيسي
        vehicle_license_front_1: 'رخصة مركبة (مركبة 1 – وجه)',
        vehicle_license_back_1: 'رخصة مركبة (مركبة 1 – ظهر)',
        driver_license_1: 'رخصة سائق 1',
        driver_id_1: 'بطاقة سائق 1'
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

// Document uploader initialization
(() => {
  try {
    const role = new URLSearchParams(location.search).get('role') || '';
    const MAP = {
      supermarket: [
        {key:'sm_health', label:'شهادة صحية لمسؤول الأغذية', accept:'image/*,application/pdf', required:false},
        {key:'sm_mgr_front', label:'بطاقة المدير (وجه)', accept:'image/*', required:true},
        {key:'sm_mgr_back', label:'بطاقة المدير (ظهر)', accept:'image/*', required:true},
        {key:'sm_cr', label:'السجل التجاري', accept:'image/*,application/pdf', required:true},
        {key:'sm_lease', label:'عقد مقر موثق', accept:'image/*,application/pdf', required:true},
        {key:'sm_bill', label:'إيصال مرافق حديث', accept:'image/*,application/pdf', required:true}
      ],
      restaurant: [
        {key:'rs_health', label:'شهادة صحية للمدير/الشيف', accept:'image/*,application/pdf', required:true},
        {key:'rs_mgr_front', label:'بطاقة المدير (وجه)', accept:'image/*', required:true},
        {key:'rs_mgr_back', label:'بطاقة المدير (ظهر)', accept:'image/*', required:true},
        {key:'rs_cr', label:'السجل التجاري (إن وجد)', accept:'image/*,application/pdf', required:false},
        {key:'rs_lease', label:'عقد مقر موثق', accept:'image/*,application/pdf', required:true},
        {key:'rs_bill', label:'إيصال مرافق حديث', accept:'image/*,application/pdf', required:true}
      ],
      pharmacy: [
        {key:'ph_license', label:'ترخيص/قيد صيدلي أو كارنيه النقابة', accept:'image/*,application/pdf', required:true},
        {key:'ph_id_front', label:'بطاقة الصيدلي المسؤول (وجه)', accept:'image/*', required:true},
        {key:'ph_id_back', label:'بطاقة الصيدلي المسؤول (ظهر)', accept:'image/*', required:true},
        {key:'ph_cr', label:'السجل التجاري', accept:'image/*,application/pdf', required:true}
      ],
      clinic: [
        {key:'cl_doc_front', label:'بطاقة الطبيب (وجه)', accept:'image/*', required:true},
        {key:'cl_doc_back', label:'بطاقة الطبيب (ظهر)', accept:'image/*', required:true},
        {key:'cl_union', label:'قيد نقابة الطبيب', accept:'image/*,application/pdf', required:true},
        {key:'cl_cr', label:'السجل التجاري/ترخيص النشاط (إن وجد)', accept:'image/*,application/pdf', required:false},
        {key:'cl_lease', label:'عقد مقر موثق', accept:'image/*,application/pdf', required:true},
        {key:'cl_bill', label:'إيصال مرافق حديث', accept:'image/*,application/pdf', required:true}
      ],
      courier: [
        {key:'co_id_front', label:'بطاقة رقم قومي (وجه)', accept:'image/*', required:true},
        {key:'co_id_back', label:'بطاقة رقم قومي (ظهر)', accept:'image/*', required:true},
        {key:'co_drv_front', label:'رخصة قيادة سارية (وجه)', accept:'image/*', required:true},
        {key:'co_drv_back', label:'رخصة قيادة سارية (ظهر)', accept:'image/*', required:true},
        {key:'co_selfie', label:'صورة شخصية واضحة', accept:'image/*', required:true},
        {key:'co_vehicle_front', label:'صورة المركبة من الأمام', accept:'image/*', required:false},
        {key:'co_plate', label:'صورة لوحة المركبة الخلفية', accept:'image/*', required:false}
      ],
      driver: [
        {key:'md_vehicle_license_front', label:'رخصة مركبة (وجه)', accept:'image/*', required:true},
        {key:'md_vehicle_license_back', label:'رخصة مركبة (ظهر)', accept:'image/*', required:true},
        {key:'md_driver_license', label:'رخصة سائق', accept:'image/*', required:true},
        {key:'md_driver_id', label:'بطاقة سائق', accept:'image/*', required:true}
      ]
    };

    const host = document.getElementById('docs-uploader');
    if (!host) return;

    function rowHTML(d){
      const cap = /image\//.test(d.accept) ? 'capture="environment"' : '';
      return `
        <div class="doc-item" data-key="${d.key}">
          <div class="doc-title">${d.label}${d.required? ' <span style="color:#c00">*</span>':''}</div>
          <div class="doc-actions">
            <input class="doc-input" type="file" accept="${d.accept}" ${cap} />
            <button type="button" class="btn btn-sm replace-btn">استبدال</button>
            <div class="doc-preview"></div>
          </div>
          <div class="doc-error" hidden></div>
        </div>`;
    }

    function render(){
      const docs = MAP[role] || [];
      host.innerHTML = docs.map(rowHTML).join('');
      const MAX = 5 * 1024 * 1024;

      host.querySelectorAll('.doc-item').forEach(item => {
        const key = item.dataset.key;
        const input = item.querySelector('.doc-input');
        const err = item.querySelector('.doc-error');
        const preview = item.querySelector('.doc-preview');
        const replaceBtn = item.querySelector('.replace-btn');

        function showErr(m){ err.textContent=m||''; err.hidden=!m; }
        function onPick(f){
          showErr('');
          if(!f) { preview.innerHTML=''; return; }
          const okType = /^(image\/(jpe?g|png|webp)|application\/pdf)$/.test(f.type);
          const okSize = f.size <= MAX;
          if(!okType) return showErr('نوع الملف غير مدعوم');
          if(!okSize) return showErr('الحد الأقصى 5MB');
          item.dataset.ready = '1';
          if(f.type.startsWith('image/')) preview.innerHTML = `<img src="${URL.createObjectURL(f)}">`;
          else preview.textContent = `PDF ✔ (${Math.round(f.size/1024)} KB)`;
          // expose for uploader step:
          window.__docsState = window.__docsState || { files:new Map() };
          window.__docsState.files.set(key, f);
        }

        input.addEventListener('change', e => onPick(e.target.files?.[0]));
        replaceBtn.addEventListener('click', () => input.click());
      });
    }

    // render immediately and also when the Documents tab is clicked
    render();
    
    // Also render when page loads
    setTimeout(render, 500);
    setTimeout(render, 1000);
    setTimeout(render, 2000);
    setTimeout(render, 3000);
    
    // Listen for tab clicks
    document.querySelectorAll('[data-tab="documents"], .tab-documents, #tab-documents')
      .forEach(el => el.addEventListener('click', () => {
        setTimeout(render, 200);
      }));
      
    // Force render on any tab click
    document.querySelectorAll('.tab, [data-tab]')
      .forEach(el => el.addEventListener('click', () => {
        setTimeout(render, 200);
      }));
      
    // Force render when documents section becomes visible
    const observer = new MutationObserver(() => {
      const docsSection = document.getElementById('docs-uploader');
      if (docsSection && docsSection.offsetParent !== null) {
        setTimeout(render, 100);
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true
    });
    
    // Force render on window load
    window.addEventListener('load', () => {
      setTimeout(render, 500);
    });
    
    // Force render when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(render, 500);
      });
    }
  } catch(e){ console.error('docs uploader init failed', e); }
})();
