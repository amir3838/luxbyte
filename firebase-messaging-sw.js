/* global self */
// Firebase Messaging Service Worker for LUXBYTE
// خدمة العامل للإشعارات - لوكس بايت

// Import Firebase scripts
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBIlSKMkFIyY1OFYqqImwx5Lo2nHW5Foss",
  authDomain: "studio-1f95z.firebaseapp.com",
  projectId: "studio-1f95z",
  storageBucket: "studio-1f95z.firebasestorage.app",
  messagingSenderId: "922681782984",
  appId: "1:922681782984:web:d3840713be209e4a60abfd"
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
