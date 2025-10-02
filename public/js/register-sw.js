/**
 * LUXBYTE Service Worker Registration
 * تسجيل خدمة العمل لـ LUXBYTE
 *
 * تسجيل وإدارة Service Worker
 */

class ServiceWorkerManager {
  constructor() {
    this.registration = null;
    this.isSupported = 'serviceWorker' in navigator;
    this.swPath = '/sw.js';
    this.init();
  }

  async init() {
    if (!this.isSupported) {
      console.warn('⚠️ Service Worker غير مدعوم في هذا المتصفح');
      return;
    }

    try {
      await this.register();
      this.setupEventListeners();
      console.log('✅ تم تسجيل Service Worker بنجاح');
    } catch (error) {
      console.error('❌ فشل في تسجيل Service Worker:', error);
    }
  }

      async register() {
        const swPaths = ['/sw.js', '/public/sw.js', '../sw.js'];

        for (const swPath of swPaths) {
          try {
            console.log(`🔍 محاولة تسجيل Service Worker من: ${swPath}`);
            this.registration = await navigator.serviceWorker.register(swPath, {
              scope: '/'
            });

            // معالجة التحديثات
            this.registration.addEventListener('updatefound', () => {
              this.handleUpdate();
            });

            console.log(`✅ تم تسجيل Service Worker بنجاح من: ${swPath}`);
            console.log(`📊 معلومات التسجيل:`, {
              scope: this.registration.scope,
              state: this.registration.active?.state || 'unknown',
              scriptURL: this.registration.active?.scriptURL || 'unknown'
            });
            return this.registration;
          } catch (error) {
            console.warn(`⚠️ فشل في تسجيل Service Worker من ${swPath}:`, error.message);
            if (swPath === swPaths[swPaths.length - 1]) {
              console.error('❌ فشل في تسجيل Service Worker من جميع المسارات');
              throw error;
            }
          }
        }
      }

  handleUpdate() {
    const newWorker = this.registration.installing;

    if (!newWorker) return;

    newWorker.addEventListener('statechange', () => {
      if (newWorker.state === 'installed') {
        if (navigator.serviceWorker.controller) {
          // هناك تحديث متاح
          this.showUpdateNotification();
        } else {
          // تم التثبيت لأول مرة
          console.log('✅ تم تثبيت Service Worker لأول مرة');
        }
      }
    });
  }

  showUpdateNotification() {
    // إنشاء إشعار التحديث
    const notification = document.createElement('div');
    notification.className = 'sw-update-notification';
    notification.innerHTML = `
      <div class="sw-update-content">
        <div class="sw-update-icon">
          <i class="fas fa-download"></i>
        </div>
        <div class="sw-update-text">
          <h4>تحديث متاح!</h4>
          <p>يوجد إصدار جديد من LUXBYTE متاح</p>
        </div>
        <div class="sw-update-actions">
          <button class="btn btn-primary btn-sm" onclick="swManager.updateNow()">
            تحديث الآن
          </button>
          <button class="btn btn-secondary btn-sm" onclick="swManager.dismissUpdate()">
            لاحقاً
          </button>
        </div>
      </div>
    `;

    // إضافة الأنماط
    this.addUpdateNotificationStyles();

    // إضافة الإشعار إلى الصفحة
    document.body.appendChild(notification);

    // إظهار الإشعار مع تأثير
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);

    // إخفاء تلقائي بعد 30 ثانية
    setTimeout(() => {
      this.dismissUpdate();
    }, 30000);
  }

  addUpdateNotificationStyles() {
    if (document.getElementById('sw-update-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'sw-update-styles';
    styles.textContent = `
      .sw-update-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        background: white;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        max-width: 400px;
        transform: translateX(100%);
        opacity: 0;
        transition: all 0.3s ease;
        font-family: 'Cairo', sans-serif;
        direction: rtl;
      }

      .sw-update-notification.show {
        transform: translateX(0);
        opacity: 1;
      }

      .sw-update-content {
        display: flex;
        align-items: center;
        padding: 20px;
        gap: 15px;
      }

      .sw-update-icon {
        font-size: 2rem;
        color: #3498db;
      }

      .sw-update-text h4 {
        margin: 0 0 5px 0;
        color: #2c3e50;
        font-size: 1.1rem;
      }

      .sw-update-text p {
        margin: 0;
        color: #7f8c8d;
        font-size: 0.9rem;
      }

      .sw-update-actions {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-right: auto;
      }

      .btn {
        padding: 8px 16px;
        border: none;
        border-radius: 6px;
        font-family: 'Cairo', sans-serif;
        font-size: 0.9rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .btn-primary {
        background: #e74c3c;
        color: white;
      }

      .btn-primary:hover {
        background: #c0392b;
      }

      .btn-secondary {
        background: #ecf0f1;
        color: #7f8c8d;
      }

      .btn-secondary:hover {
        background: #bdc3c7;
      }

      @media (max-width: 480px) {
        .sw-update-notification {
          right: 10px;
          left: 10px;
          max-width: none;
        }

        .sw-update-content {
          flex-direction: column;
          text-align: center;
        }

        .sw-update-actions {
          flex-direction: row;
          justify-content: center;
        }
      }
    `;

    document.head.appendChild(styles);
  }

  updateNow() {
    if (this.registration && this.registration.waiting) {
      // إرسال رسالة للـ Service Worker لتحديث نفسه
      this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });

      // إعادة تحميل الصفحة
      window.location.reload();
    }
  }

  dismissUpdate() {
    const notification = document.querySelector('.sw-update-notification');
    if (notification) {
      notification.classList.remove('show');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }
  }

  setupEventListeners() {
    // مراقبة تغيير الـ Service Worker
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('🔄 تم تغيير Service Worker');
      // إعادة تحميل الصفحة إذا لزم الأمر
      if (this.registration && this.registration.waiting) {
        window.location.reload();
      }
    });

    // مراقبة الأخطاء
    navigator.serviceWorker.addEventListener('error', (event) => {
      console.error('❌ خطأ في Service Worker:', event);
    });
  }

  // الحصول على معلومات الـ Service Worker
  async getInfo() {
    if (!this.registration) return null;

    return {
      scope: this.registration.scope,
      state: this.registration.active?.state || 'unknown',
      scriptURL: this.registration.active?.scriptURL || 'unknown'
    };
  }

  // مسح الكاش
  async clearCache() {
    if (!this.registration) return false;

    try {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      console.log('🗑️ تم مسح الكاش');
      return true;
    } catch (error) {
      console.error('❌ فشل في مسح الكاش:', error);
      return false;
    }
  }

  // التحقق من حالة الاتصال
  isOnline() {
    return navigator.onLine;
  }

  // إضافة مستمع لتغيير حالة الاتصال
  onConnectionChange(callback) {
    window.addEventListener('online', () => callback(true));
    window.addEventListener('offline', () => callback(false));
  }
}

// إنشاء مثيل مدير Service Worker
const swManager = new ServiceWorkerManager();

// جعل المدير متاحاً عالمياً
window.swManager = swManager;

// تصدير للاستخدام في الوحدات
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ServiceWorkerManager;
}

console.log('📱 تم تحميل Service Worker Manager');
