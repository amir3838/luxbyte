// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-analytics.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-messaging.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-storage.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBIlSKMkFIyY1OFYqqImwx5Lo2nHW5Foss",
  authDomain: "studio-1f95z.firebaseapp.com",
  projectId: "studio-1f95z",
  storageBucket: "studio-1f95z.firebasestorage.app",
  messagingSenderId: "922681782984",
  appId: "1:922681782984:web:d3840713be209e4a60abfd",
  measurementId: "G-4H0S8GB99R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const analytics = getAnalytics(app);
const messaging = getMessaging(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// VAPID key for messaging
const VAPID_KEY = "BJ3SXe0Nof9H4KJpvgG80LVUeDTNxdh0O2z3aOIzEzrFxd3bAn4ixhhouG7VV11zmK8giQ-UUGWeAP3JK8MpbXk";

// Firebase Manager Class
class FirebaseManager {
  constructor() {
    this.app = app;
    this.analytics = analytics;
    this.messaging = messaging;
    this.auth = auth;
    this.db = db;
    this.storage = storage;
    this.isInitialized = true;
  }

  // Get FCM token for notifications
  async getFCMToken() {
    try {
      const token = await getToken(this.messaging, {
        vapidKey: VAPID_KEY
      });
      console.log('🔑 FCM Token:', token);
      return token;
    } catch (error) {
      console.error('❌ Error getting FCM token:', error);
      return null;
    }
  }

  // Request notification permission
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

  // Setup notifications
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

  // Show notification
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

  // Track analytics event
  trackEvent(eventName, parameters = {}) {
    try {
      if (this.analytics) {
        // Note: In a real implementation, you'd use logEvent from firebase/analytics
        console.log('📊 Analytics Event:', eventName, parameters);
        // logEvent(this.analytics, eventName, parameters);
      }
    } catch (error) {
      console.error('Error tracking analytics event:', error);
    }
  }

  // Track page view
  trackPageView(pageName) {
    this.trackEvent('page_view', {
      page_title: pageName,
      page_location: window.location.href
    });
  }

  // Track user action
  trackUserAction(action, category = 'user_interaction') {
    this.trackEvent('user_action', {
      action: action,
      category: category,
      timestamp: new Date().toISOString()
    });
  }
}

// Create global instance
const firebaseManager = new FirebaseManager();

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 Initializing Firebase with Analytics...');
  await firebaseManager.setupNotifications();

  // Track initial page view
  firebaseManager.trackPageView(document.title);
});

// Export for module use
export { firebaseManager, app, analytics, messaging, auth, db, storage };

// Make available globally
if (typeof window !== 'undefined') {
  window.firebaseManager = firebaseManager;
  window.firebaseApp = app;
  window.firebaseAnalytics = analytics;
}
