/**
 * LUXBYTE Service Worker
 * خدمة العمل لـ LUXBYTE
 *
 * إدارة التخزين المؤقت والوضع غير المتصل
 */

const VERSION = 'v1.0.5';
const CACHE_NAME = `luxbyte-${VERSION}`;
const STATIC_CACHE = `luxbyte-static-${VERSION}`;
const DYNAMIC_CACHE = `luxbyte-dynamic-${VERSION}`;
const IMAGES_CACHE = `luxbyte-images-${VERSION}`;

// الملفات الثابتة للتخزين المؤقت
const STATIC_FILES = [
  '/',
  '/index.html',
  '/auth.html',
  '/choose-activity.html',
  '/offline.html',
  '/manifest.webmanifest',
  '/css/styles.css',
  '/css/mobile-fixes.css',
  '/css/components/cards.css',
  '/js/common.js',
  '/js/auth.js',
  '/js/supabase-client.js',
  '/js/theme-lang-toggle.js',
  '/js/ux-effects.js',
  '/js/register-sw.js',
  '/assets/app_icon/LUXBYTEICON.PNG',
  '/assets/images/shopeg_logo.webp',
  '/assets/images/activities/pharmacy.png',
  '/assets/images/activities/restaurant.png',
  '/assets/images/activities/supermarket.png',
  '/assets/images/activities/clinic.png',
  '/assets/images/activities/courier.png',
  '/assets/images/activities/driver.png'
];

// ملفات CSS و JS للتخزين المؤقت
const ASSET_FILES = [
  '/css/',
  '/js/',
  '/assets/',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700&display=swap'
];

// استراتيجيات التخزين المؤقت
const CACHE_STRATEGIES = {
  // الصفحات: Network First مع fallback
  pages: {
    strategy: 'NetworkFirst',
    timeout: 3000,
    cacheName: DYNAMIC_CACHE
  },
  // الأصول: Stale While Revalidate
  assets: {
    strategy: 'StaleWhileRevalidate',
    cacheName: STATIC_CACHE
  },
  // الصور: Cache First
  images: {
    strategy: 'CacheFirst',
    cacheName: IMAGES_CACHE,
    maxEntries: 50
  }
};

// تثبيت Service Worker
self.addEventListener('install', (event) => {
  console.log(`🔧 تثبيت Service Worker ${VERSION}...`);
  
  event.waitUntil(
    Promise.all([
      // تخزين الملفات الثابتة مع معالجة الأخطاء
      caches.open(STATIC_CACHE).then(cache => {
        console.log('📦 تخزين الملفات الثابتة...');
        return Promise.allSettled(
          STATIC_FILES.map(url => 
            fetch(url)
              .then(response => {
                if (response.ok) {
                  return cache.put(url, response);
                } else {
                  console.warn(`⚠️ تخطي ملف غير متاح: ${url} (${response.status})`);
                }
              })
              .catch(error => {
                console.warn(`⚠️ تخطي ملف بسبب خطأ: ${url}`, error.message);
              })
          )
        ).then(results => {
          const successful = results.filter(r => r.status === 'fulfilled').length;
          const failed = results.filter(r => r.status === 'rejected').length;
          console.log(`✅ تم تخزين ${successful} ملف، تخطي ${failed} ملف`);
        });
      }),
      // تفعيل فوري
      self.skipWaiting()
    ])
  );
});

// تفعيل Service Worker
self.addEventListener('activate', (event) => {
  console.log(`✅ تفعيل Service Worker ${VERSION}...`);
  
  event.waitUntil(
    Promise.all([
      // تنظيف الكاشات القديمة
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (!cacheName.includes(VERSION)) {
              console.log('🗑️ حذف الكاش القديم:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // السيطرة على جميع العملاء
      self.clients.claim()
    ])
  );
});

// معالجة الطلبات
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // تجاهل الطلبات غير HTTP/HTTPS
  if (!request.url.startsWith('http')) {
    return;
  }

  // تحديد نوع الطلب
  const requestType = getRequestType(request);

  event.respondWith(
    handleRequest(request, requestType)
  );
});

// تحديد نوع الطلب
function getRequestType(request) {
  const url = new URL(request.url);

  // صفحات HTML
  if (request.destination === 'document' ||
      url.pathname.endsWith('.html') ||
      url.pathname === '/') {
    return 'pages';
  }

  // الصور
  if (request.destination === 'image' ||
      url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg|ico)$/i)) {
    return 'images';
  }

  // الأصول (CSS, JS, Fonts)
  if (request.destination === 'style' ||
      request.destination === 'script' ||
      request.destination === 'font' ||
      url.pathname.match(/\.(css|js|woff|woff2|ttf|eot)$/i)) {
    return 'assets';
  }

  return 'pages';
}

// معالجة الطلبات حسب الاستراتيجية
async function handleRequest(request, type) {
  const strategy = CACHE_STRATEGIES[type];

  try {
    switch (strategy.strategy) {
      case 'NetworkFirst':
        return await networkFirst(request, strategy);
      case 'StaleWhileRevalidate':
        return await staleWhileRevalidate(request, strategy);
      case 'CacheFirst':
        return await cacheFirst(request, strategy);
      default:
        return await networkFirst(request, strategy);
    }
  } catch (error) {
    console.error('❌ خطأ في معالجة الطلب:', error);
    return await getOfflineResponse(request);
  }
}

// استراتيجية Network First
async function networkFirst(request, strategy) {
  try {
    // محاولة الشبكة أولاً
    const networkResponse = await fetchWithTimeout(request, strategy.timeout);

    if (networkResponse && networkResponse.ok) {
      // تخزين الاستجابة في الكاش
      const cache = await caches.open(strategy.cacheName);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
  } catch (error) {
    console.log('🌐 فشل في الشبكة، البحث في الكاش...');
  }

  // البحث في الكاش
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  // صفحة غير متصل
  return await getOfflineResponse(request);
}

// استراتيجية Stale While Revalidate
async function staleWhileRevalidate(request, strategy) {
  const cache = await caches.open(strategy.cacheName);
  const cachedResponse = await cache.match(request);

  // إرجاع الكاش فوراً
  const responsePromise = cachedResponse || fetchWithTimeout(request, 5000);

  // تحديث الكاش في الخلفية
  fetchWithTimeout(request, 10000)
    .then(networkResponse => {
      if (networkResponse && networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
    })
    .catch(error => {
      console.log('🔄 فشل في تحديث الكاش:', error);
    });

  return await responsePromise;
}

// استراتيجية Cache First
async function cacheFirst(request, strategy) {
  const cache = await caches.open(strategy.cacheName);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetchWithTimeout(request, 5000);

    if (networkResponse && networkResponse.ok) {
      // التحقق من حد الصور
      if (strategy.maxEntries) {
        const keys = await cache.keys();
        if (keys.length >= strategy.maxEntries) {
          const oldestKey = keys[0];
          await cache.delete(oldestKey);
        }
      }

      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
  } catch (error) {
    console.log('📷 فشل في تحميل الصورة:', error);
  }

  return await getOfflineResponse(request);
}

// Fetch مع مهلة زمنية
async function fetchWithTimeout(request, timeout = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(request, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// الحصول على استجابة غير متصل
async function getOfflineResponse(request) {
  const url = new URL(request.url);

  // إذا كان طلب صفحة، أرسل صفحة غير متصل
  if (request.destination === 'document' ||
      url.pathname.endsWith('.html') ||
      url.pathname === '/') {
    const offlineResponse = await caches.match('/offline.html');
    if (offlineResponse) {
      return offlineResponse;
    }
  }

  // استجابة خطأ عامة
  return new Response(
    JSON.stringify({
      error: 'غير متصل',
      message: 'يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى',
      offline: true
    }),
    {
      status: 503,
      statusText: 'Service Unavailable',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    }
  );
}

// معالجة الرسائل من الصفحة الرئيسية
self.addEventListener('message', (event) => {
  const { type, payload } = event.data;

  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;

    case 'GET_VERSION':
      event.ports[0].postMessage({ version: CACHE_NAME });
      break;

    case 'CLEAR_CACHE':
      clearAllCaches().then(() => {
        event.ports[0].postMessage({ success: true });
      });
      break;

    default:
      console.log('📨 رسالة غير معروفة:', type);
  }
});

// مسح جميع الكاشات
async function clearAllCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames.map(cacheName => caches.delete(cacheName))
  );
  console.log('🗑️ تم مسح جميع الكاشات');
}

// معالجة الأخطاء
self.addEventListener('error', (event) => {
  console.error('❌ خطأ في Service Worker:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('❌ خطأ غير معالج في Service Worker:', event.reason);
});

console.log(`🚀 تم تحميل Service Worker ${VERSION} بنجاح`);
