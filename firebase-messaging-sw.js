/* global self */
// Firebase Messaging Service Worker for LUXBYTE
// خدمة العامل للإشعارات - لوكس بايت

// Import Firebase scripts
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Firebase configuration - will be replaced by environment variables
const firebaseConfig = {
  apiKey: "REPLACE_API_KEY",
  authDomain: "REPLACE_AUTH_DOMAIN",
  projectId: "REPLACE_PROJECT_ID",
  storageBucket: "REPLACE_STORAGE_BUCKET",
  messagingSenderId: "REPLACE_SENDER_ID",
  appId: "REPLACE_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);

  const notificationTitle = payload.notification?.title || 'LUXBYTE';
  const notificationOptions = {
    body: payload.notification?.body || 'لديك إشعار جديد',
    icon: payload.notification?.icon || '/assets/app_icon/LUXBYTEicon.png',
    badge: '/assets/app_icon/LUXBYTEicon.png',
    image: payload.notification?.image,
    data: {
      url: payload.data?.url || '/',
      click_action: payload.data?.click_action || '/'
    },
    actions: [
      {
        action: 'open',
        title: 'فتح',
        icon: '/assets/app_icon/LUXBYTEicon.png'
      },
      {
        action: 'close',
        title: 'إغلاق'
      }
    ],
    requireInteraction: true,
    silent: false,
    tag: 'luxbyte-notification',
    renotify: true
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);

  event.notification.close();

  const url = event.notification.data?.url || '/';

  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        // Check if there's already a window open
        for (const client of clientList) {
          if (client.url === url && 'focus' in client) {
            return client.focus();
          }
        }
        // Open new window if none exists
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
    );
  } else if (event.action === 'close') {
    // Just close the notification
    event.notification.close();
  }
});

// Handle notification close
self.addEventListener('notificationclose', (event) => {
  console.log('Notification closed:', event);
});

// Handle push events (fallback)
self.addEventListener('push', (event) => {
  console.log('Push event received:', event);

  if (event.data) {
    const data = event.data.json();
    const title = data.title || 'LUXBYTE';
    const options = {
      body: data.body || 'لديك إشعار جديد',
      icon: data.icon || '/assets/app_icon/LUXBYTEicon.png',
      badge: '/assets/app_icon/LUXBYTEicon.png',
      data: {
        url: data.url || '/'
      }
    };

    event.waitUntil(
      self.registration.showNotification(title, options)
    );
  }
});
