/**
 * Firebase Configuration for LUXBYTE
 * تهيئة Firebase لمشروع لوكس بايت
 */

// Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyBIlSKMkFIyY1OFYqqImwx5Lo2nHW5Foss",
  authDomain: "studio-1f95z.firebaseapp.com",
  projectId: "studio-1f95z",
  storageBucket: "studio-1f95z.firebasestorage.app",
  messagingSenderId: "922681782984",
  appId: "1:922681782984:web:d3840713be209e4a60abfd"
};

// VAPID Key for push notifications
const VAPID_KEY = window.CONFIG?.FCM_VAPID_KEY || "BJ3SXe0Nof9H4KJpvgG80LVUeDTNxdh0O2z3aOIzEzrFxd3bAn4ixhhouG7VV11zmK8giQ-UUGWeAP3JK8MpbXk";

// Initialize Firebase
let firebaseApp = null;
let messaging = null;

/**
 * Initialize Firebase app
 * تهيئة تطبيق Firebase
 */
function initializeFirebase() {
  if (firebaseApp) return firebaseApp;

  try {
    // Import Firebase modules dynamically
    import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js')
      .then(({ initializeApp }) => {
        firebaseApp = initializeApp(firebaseConfig);
        console.log('Firebase initialized successfully');
      })
      .catch(error => {
        console.error('Error initializing Firebase:', error);
      });
  } catch (error) {
    console.error('Error loading Firebase:', error);
  }

  return firebaseApp;
}

/**
 * Initialize Firebase Messaging
 * تهيئة Firebase Messaging
 */
async function initializeMessaging() {
  if (messaging) return messaging;

  try {
    const { getMessaging, isSupported } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging.js');

    // Check if messaging is supported
    const supported = await isSupported();
    if (!supported) {
      console.warn('Firebase Messaging is not supported in this browser');
      return null;
    }

    if (!firebaseApp) {
      firebaseApp = initializeFirebase();
    }

    messaging = getMessaging(firebaseApp);
    console.log('Firebase Messaging initialized successfully');
    return messaging;
  } catch (error) {
    console.error('Error initializing Firebase Messaging:', error);
    return null;
  }
}

/**
 * Get Firebase Messaging instance
 * الحصول على مثيل Firebase Messaging
 */
async function getMessaging() {
  if (!messaging) {
    messaging = await initializeMessaging();
  }
  return messaging;
}

/**
 * Check if push notifications are supported
 * التحقق من دعم الإشعارات
 */
function isPushNotificationSupported() {
  return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
}

/**
 * Request notification permission
 * طلب إذن الإشعارات
 */
async function requestNotificationPermission() {
  if (!isPushNotificationSupported()) {
    throw new Error('Push notifications are not supported in this browser');
  }

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    throw new Error('Notification permission denied');
  }

  return permission;
}

/**
 * Get FCM token
 * الحصول على توكن FCM
 */
async function getFCMToken() {
  try {
    const messagingInstance = await getMessaging();
    if (!messagingInstance) {
      throw new Error('Firebase Messaging is not available');
    }

    const { getToken } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging.js');

    // Register service worker
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');

    const token = await getToken(messagingInstance, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration
    });

    if (!token) {
      throw new Error('No FCM token received');
    }

    return token;
  } catch (error) {
    console.error('Error getting FCM token:', error);
    throw error;
  }
}

// Export functions for use in other modules
window.FirebaseConfig = {
  initializeFirebase,
  initializeMessaging,
  getMessaging,
  isPushNotificationSupported,
  requestNotificationPermission,
  getFCMToken,
  firebaseConfig,
  VAPID_KEY
};
