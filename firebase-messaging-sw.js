// Import Firebase scripts
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics-compat.js');

// Initialize Firebase in service worker
firebase.initializeApp({
  apiKey: "AIzaSyBIlSKMkFIyY1OFYqqImwx5Lo2nHW5Foss",
  authDomain: "studio-1f95z.firebaseapp.com",
  projectId: "studio-1f95z",
  storageBucket: "studio-1f95z.firebasestorage.app",
  messagingSenderId: "922681782984",
  appId: "1:922681782984:web:d3840713be209e4a60abfd",
  measurementId: "G-4H0S8GB99R"
});

// Initialize Analytics
const analytics = firebase.analytics();

// Initialize Firebase Cloud Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);

  const notificationTitle = payload.notification?.title || 'LUXBYTE';
  const notificationOptions = {
    body: payload.notification?.body || 'لديك إشعار جديد',
    icon: '/assets/logo.png',
    badge: '/assets/badge.png',
    tag: 'luxbyte-notification',
    requireInteraction: true,
    actions: [
      {
        action: 'open',
        title: 'فتح التطبيق'
      },
      {
        action: 'close',
        title: 'إغلاق'
      }
    ]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);

  event.notification.close();

  // Get URL from notification data
  const url = event.notification.data?.url || '/';

  // Handle different actions
  if (event.action === 'close') {
    return; // Just close the notification
  }

  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        // Check if app is already open
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            return client.focus();
          }
        }
        // Open new window if app is not open
        return clients.openWindow(url);
      })
    );
  }
});

// Handle notification close
self.addEventListener('notificationclose', (event) => {
  console.log('Notification closed:', event);
});