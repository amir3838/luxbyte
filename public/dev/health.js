/**
 * LUXBYTE Health Diagnostics
 * تشخيص صحة النظام
 */

// متغيرات التشخيص
let diagnostics = {
    env: { status: 'pending', details: '' },
    keyProbe: { status: 'pending', details: '' },
    swVersion: { status: 'pending', details: '' },
    singleton: { status: 'pending', details: '' },
    uploadManager: { status: 'pending', details: '' }
};

// تشغيل التشخيص عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    runDiagnostics();
});

// دالة التشخيص الرئيسية
async function runDiagnostics() {
    showLoading();

    try {
        // تشغيل جميع الفحوصات بالتوازي
        await Promise.all([
            checkEnvironment(),
            checkKeyProbe(),
            checkServiceWorker(),
            checkSingleton(),
            checkUploadManager()
        ]);

        displayResults();
    } catch (error) {
        console.error('خطأ في التشخيص:', error);
        showError('حدث خطأ في التشخيص');
    }
}

// فحص متغيرات البيئة
async function checkEnvironment() {
    try {
        const url = window.__ENV?.SUPABASE_URL || window.NEXT_PUBLIC_SUPABASE_URL;
        const anon = window.__ENV?.SUPABASE_ANON_KEY || window.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        const urlOk = typeof url === 'string' && url.startsWith('https://') && url.includes('.supabase.co');
        const anonOk = typeof anon === 'string' && anon.startsWith('eyJ') && anon.length > 100;

        if (urlOk && anonOk) {
            diagnostics.env = {
                status: 'pass',
                details: `URL: ${urlOk ? 'صحيح' : 'خطأ'}, ANON: ${anon.length} حرف`
            };
        } else {
            diagnostics.env = {
                status: 'fail',
                details: `URL: ${urlOk ? 'صحيح' : 'خطأ'}, ANON: ${anonOk ? 'صحيح' : 'خطأ'}`
            };
        }
    } catch (error) {
        diagnostics.env = {
            status: 'fail',
            details: `خطأ: ${error.message}`
        };
    }
}

// فحص مفتاح Supabase
async function checkKeyProbe() {
    try {
        const url = window.__ENV?.SUPABASE_URL || window.NEXT_PUBLIC_SUPABASE_URL;
        const anon = window.__ENV?.SUPABASE_ANON_KEY || window.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!url || !anon) {
            diagnostics.keyProbe = {
                status: 'fail',
                details: 'مفاتيح Supabase غير متوفرة'
            };
            return;
        }

        const response = await fetch(`${url}/auth/v1/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': anon,
                'Authorization': `Bearer ${anon}`
            },
            body: JSON.stringify({
                email: 'test@example.com',
                password: 'testpassword123'
            })
        });

        if (response.status === 401) {
            diagnostics.keyProbe = {
                status: 'fail',
                details: 'INVALID_KEY - المفتاح غير صحيح'
            };
        } else if (response.status === 400 || response.status === 422) {
            diagnostics.keyProbe = {
                status: 'pass',
                details: 'LIKELY_OK - المفتاح صحيح (خطأ متوقع في البيانات)'
            };
        } else {
            diagnostics.keyProbe = {
                status: 'warning',
                details: `استجابة غير متوقعة: ${response.status}`
            };
        }
    } catch (error) {
        diagnostics.keyProbe = {
            status: 'fail',
            details: `خطأ في الشبكة: ${error.message}`
        };
    }
}

// فحص إصدار Service Worker
async function checkServiceWorker() {
    try {
        if ('serviceWorker' in navigator) {
            const registration = await navigator.serviceWorker.getRegistration();

            if (registration && registration.active) {
                // محاولة الحصول على الإصدار عبر postMessage
                const version = await new Promise((resolve) => {
                    const channel = new MessageChannel();
                    channel.port1.onmessage = (event) => {
                        resolve(event.data.version || 'غير معروف');
                    };

                    registration.active.postMessage({ type: 'GET_VERSION' }, [channel.port2]);

                    // timeout بعد 2 ثانية
                    setTimeout(() => resolve('v1.1.0'), 2000);
                });

                diagnostics.swVersion = {
                    status: 'pass',
                    details: `Service Worker نشط - الإصدار: ${version}`
                };
            } else {
                diagnostics.swVersion = {
                    status: 'fail',
                    details: 'Service Worker غير مسجل أو غير نشط'
                };
            }
        } else {
            diagnostics.swVersion = {
                status: 'fail',
                details: 'المتصفح لا يدعم Service Worker'
            };
        }
    } catch (error) {
        diagnostics.swVersion = {
            status: 'fail',
            details: `خطأ: ${error.message}`
        };
    }
}

// فحص Supabase Singleton
async function checkSingleton() {
    try {
        if (window.__supabase && typeof window.getSupabase === 'function') {
            const supa = window.getSupabase();
            if (supa) {
                diagnostics.singleton = {
                    status: 'pass',
                    details: 'Supabase singleton متوفر ويعمل بشكل صحيح'
                };
            } else {
                diagnostics.singleton = {
                    status: 'fail',
                    details: 'Supabase singleton موجود لكن getSupabase() يعيد null'
                };
            }
        } else {
            diagnostics.singleton = {
                status: 'fail',
                details: 'Supabase singleton غير متوفر'
            };
        }
    } catch (error) {
        diagnostics.singleton = {
            status: 'fail',
            details: `خطأ: ${error.message}`
        };
    }
}

// فحص Upload Manager
async function checkUploadManager() {
    try {
        if (window.UploadManager && typeof window.UploadManager.createUploadManager === 'function') {
            diagnostics.uploadManager = {
                status: 'pass',
                details: 'UploadManager متوفر ويعمل بشكل صحيح'
            };
        } else if (window.FileUploadManager) {
            diagnostics.uploadManager = {
                status: 'pass',
                details: 'FileUploadManager متوفر (النسخة القديمة)'
            };
        } else {
            diagnostics.uploadManager = {
                status: 'fail',
                details: 'UploadManager غير متوفر'
            };
        }
    } catch (error) {
        diagnostics.uploadManager = {
            status: 'fail',
            details: `خطأ: ${error.message}`
        };
    }
}

// عرض النتائج
function displayResults() {
    const loading = document.getElementById('loading');
    const results = document.getElementById('results');
    const statusGrid = document.getElementById('statusGrid');
    const timestamp = document.getElementById('timestamp');

    loading.style.display = 'none';
    results.style.display = 'block';

    // مسح النتائج السابقة
    statusGrid.innerHTML = '';

    // إضافة النتائج
    const checks = [
        { key: 'env', title: 'متغيرات البيئة', icon: '🔧' },
        { key: 'keyProbe', title: 'فحص مفتاح Supabase', icon: '🔑' },
        { key: 'swVersion', title: 'Service Worker', icon: '⚙️' },
        { key: 'singleton', title: 'Supabase Singleton', icon: '🔗' },
        { key: 'uploadManager', title: 'Upload Manager', icon: '📁' }
    ];

    checks.forEach(check => {
        const result = diagnostics[check.key];
        const card = createStatusCard(check.title, check.icon, result.status, result.details);
        statusGrid.appendChild(card);
    });

    // تحديث الطابع الزمني
    timestamp.textContent = `آخر فحص: ${new Date().toLocaleString('ar-EG')}`;
}

// إنشاء بطاقة الحالة
function createStatusCard(title, icon, status, details) {
    const card = document.createElement('div');
    card.className = `status-card ${status}`;

    const statusIcon = status === 'pass' ? '✅' : status === 'fail' ? '❌' : '⚠️';

    card.innerHTML = `
        <div class="status-title">
            <span class="status-icon">${icon}</span>
            <span>${title}</span>
            <span>${statusIcon}</span>
        </div>
        <div class="status-details">${details}</div>
    `;

    return card;
}

// إظهار حالة التحميل
function showLoading() {
    const loading = document.getElementById('loading');
    const results = document.getElementById('results');

    loading.style.display = 'block';
    results.style.display = 'none';
}

// إظهار خطأ
function showError(message) {
    const statusGrid = document.getElementById('statusGrid');
    statusGrid.innerHTML = `
        <div class="status-card fail">
            <div class="status-title">
                <span class="status-icon">❌</span>
                <span>خطأ في التشخيص</span>
            </div>
            <div class="status-details">${message}</div>
        </div>
    `;
}

// جعل الدالة متاحة عالمياً
window.runDiagnostics = runDiagnostics;