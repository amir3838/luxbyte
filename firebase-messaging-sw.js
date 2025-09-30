// Firebase Messaging Service Worker for LUXBYTE
// Handles push notifications and background sync

importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize Firebase
const firebaseConfig = {
  apiKey: "your_firebase_api_key",
  authDomain: "your_project.firebaseapp.com",
  projectId: "your_project_id",
  storageBucket: "your_project.appspot.com",
  messagingSenderId: "your_sender_id",
  appId: "your_app_id",
  vapidKey: "your_vapid_key"
};

firebase.initializeApp(firebaseConfig);

// Initialize Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('📱 Background message received:', payload);

  const notificationTitle = payload.notification?.title || 'LUXBYTE';
  const notificationOptions = {
    body: payload.notification?.body || 'لديك إشعار جديد',
    icon: '/assets/app_icon/LUXBYTE.png',
    badge: '/assets/app_icon/LUXBYTE.png',
    data: payload.data || {},
    actions: [
      {
        action: 'open',
        title: 'فتح التطبيق'
      },
      {
        action: 'dismiss',
        title: 'تجاهل'
      }
    ],
    requireInteraction: true,
    silent: false
  };

  // Show notification
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('📱 Notification clicked:', event);

  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  // Open the app
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If app is already open, focus it
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      
      // If app is not open, open it
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

// Handle push events
self.addEventListener('push', (event) => {
  console.log('📱 Push event received:', event);

  if (event.data) {
    const data = event.data.json();
    console.log('📱 Push data:', data);

    const options = {
      body: data.body || 'لديك إشعار جديد',
      icon: '/assets/app_icon/LUXBYTE.png',
      badge: '/assets/app_icon/LUXBYTE.png',
      data: data.data || {},
      tag: data.tag || 'luxbyte-notification',
      requireInteraction: true,
      silent: false
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'LUXBYTE', options)
    );
  }
});

// Handle notification close
self.addEventListener('notificationclose', (event) => {
  console.log('📱 Notification closed:', event);
  
  // Track notification dismissal
  if (event.notification.data && event.notification.data.trackingId) {
    // Send analytics event
    fetch('/api/track-notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'dismissed',
        trackingId: event.notification.data.trackingId,
        timestamp: new Date().toISOString()
      })
    }).catch(console.error);
  }
});

// Handle service worker updates
self.addEventListener('install', (event) => {
  console.log('📱 Service Worker installing...');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('📱 Service Worker activating...');
  event.waitUntil(self.clients.claim());
});

// Handle fetch events for offline support
self.addEventListener('fetch', (event) => {
  // Only handle requests to our domain
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
    );
  }
});

// Handle sync events for background sync
self.addEventListener('sync', (event) => {
  console.log('📱 Background sync:', event.tag);
  
  if (event.tag === 'notification-sync') {
    event.waitUntil(
      // Sync any pending notifications
      syncPendingNotifications()
    );
  }
});

// Function to sync pending notifications
async function syncPendingNotifications() {
  try {
    // Get pending notifications from IndexedDB
    const pendingNotifications = await getPendingNotifications();
    
    for (const notification of pendingNotifications) {
      try {
        await fetch('/api/sync-notification', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(notification)
        });
        
        // Remove from pending list
        await removePendingNotification(notification.id);
      } catch (error) {
        console.error('Failed to sync notification:', error);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// IndexedDB helper functions
function getPendingNotifications() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('luxbyte-notifications', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['pending'], 'readonly');
      const store = transaction.objectStore('pending');
      const getAllRequest = store.getAll();
      
      getAllRequest.onsuccess = () => resolve(getAllRequest.result);
      getAllRequest.onerror = () => reject(getAllRequest.error);
    };
    
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('pending')) {
        db.createObjectStore('pending', { keyPath: 'id' });
      }
    };
  });
}

function removePendingNotification(id) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('luxbyte-notifications', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['pending'], 'readwrite');
      const store = transaction.objectStore('pending');
      const deleteRequest = store.delete(id);
      
      deleteRequest.onsuccess = () => resolve();
      deleteRequest.onerror = () => reject(deleteRequest.error);
    };
  });
}

console.log('📱 LUXBYTE Service Worker loaded successfully');