// Firebase setup script for LUXBYTE
// This script handles Firebase initialization and messaging

class FirebaseManager {
  constructor() {
    this.app = null;
    this.messaging = null;
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;

    try {
      // Dynamic import for Firebase modules
      const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
      const { getMessaging, getToken, onMessage } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging.js');

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
      this.app = initializeApp(firebaseConfig);
      this.messaging = getMessaging(this.app);
      this.isInitialized = true;

      console.log('✅ Firebase initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Firebase initialization failed:', error);
      return false;
    }
  }

  async getFCMToken() {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const { getToken } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging.js');
      
      const token = await getToken(this.messaging, {
        vapidKey: "BJ3SXe0Nof9H4KJpvgG80LVUeDTNxdh0O2z3aOIzEzrFxd3bAn4ixhhouG7VV11zmK8giQ-UUGWeAP3JK8MpbXk"
      });
      
      console.log('🔑 FCM Token:', token);
      return token;
    } catch (error) {
      console.error('❌ Error getting FCM token:', error);
      return null;
    }
  }

  async requestNotificationPermission() {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      console.warn('Notification permission denied');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  async setupNotifications() {
    try {
      // Request permission
      const hasPermission = await this.requestNotificationPermission();
      if (!hasPermission) {
        console.warn('Notification permission not granted');
        return false;
      }

      // Get FCM token
      const token = await this.getFCMToken();
      if (!token) {
        console.warn('Failed to get FCM token');
        return false;
      }

      // Store token for server use
      localStorage.setItem('fcm_token', token);
      
      // Set up foreground message listener
      const { onMessage } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging.js');
      
      onMessage(this.messaging, (payload) => {
        console.log('📱 Message received in foreground:', payload);
        this.showNotification(payload);
      });

      console.log('✅ Notifications setup complete');
      return true;
    } catch (error) {
      console.error('❌ Error setting up notifications:', error);
      return false;
    }
  }

  showNotification(payload) {
    const title = payload.notification?.title || 'LUXBYTE';
    const body = payload.notification?.body || 'لديك إشعار جديد';
    
    if ('serviceWorker' in navigator && 'showNotification' in ServiceWorkerRegistration.prototype) {
      navigator.serviceWorker.ready.then(registration => {
        registration.showNotification(title, {
          body: body,
          icon: '/assets/logo.png',
          badge: '/assets/badge.png',
          tag: 'luxbyte-notification',
          requireInteraction: true
        });
      });
    } else {
      // Fallback for browsers that don't support service worker notifications
      new Notification(title, {
        body: body,
        icon: '/assets/logo.png'
      });
    }
  }
}

// Create global instance
window.firebaseManager = new FirebaseManager();

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 Initializing Firebase...');
  await window.firebaseManager.initialize();
  await window.firebaseManager.setupNotifications();
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FirebaseManager;
}
