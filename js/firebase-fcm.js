/**
 * Firebase FCM Integration for LUXBYTE
 * تكامل Firebase FCM - لوكس بايت
 */

import { initializeApp } from 'https://esm.sh/firebase@10/app';
import { getMessaging, getToken, onMessage, isSupported } from 'https://esm.sh/firebase@10/messaging';

class FirebaseFCM {
    constructor() {
        this.app = null;
        this.messaging = null;
        this.isInitialized = false;
        this.init();
    }

    /**
     * Initialize Firebase FCM
     * تهيئة Firebase FCM
     */
    async init() {
        try {
            // Check if Firebase is supported
            const supported = await isSupported();
            if (!supported) {
                console.warn('Firebase Messaging is not supported in this browser');
                return;
            }

            // Get configuration from window.CONFIG
            const config = window.CONFIG?.__ENV__ || window.CONFIG;
            if (!config) {
                console.error('Firebase configuration not found');
                return;
            }

            const firebaseConfig = {
                apiKey: config.NEXT_PUBLIC_FIREBASE_API_KEY,
                authDomain: config.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
                projectId: config.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
                messagingSenderId: config.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
                appId: config.NEXT_PUBLIC_FIREBASE_APP_ID
            };

            // Initialize Firebase
            this.app = initializeApp(firebaseConfig);
            this.messaging = getMessaging(this.app);
            this.isInitialized = true;

            console.log('Firebase FCM initialized successfully');
        } catch (error) {
            console.error('Failed to initialize Firebase FCM:', error);
        }
    }

    /**
     * Register FCM token for user
     * تسجيل FCM token للمستخدم
     */
    async registerFCMToken(userId) {
        if (!this.isInitialized) {
            console.warn('Firebase FCM not initialized');
            return null;
        }

        try {
            // Check if service worker is supported
            if (!('serviceWorker' in navigator)) {
                console.warn('Service Worker not supported');
                return null;
            }

            // Register service worker
            const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
            console.log('Service Worker registered:', registration);

            // Get FCM token
            const token = await getToken(this.messaging, {
                vapidKey: window.CONFIG?.__ENV__?.NEXT_PUBLIC_FIREBASE_VAPID_KEY || window.CONFIG?.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
                serviceWorkerRegistration: registration
            });

            if (!token) {
                console.warn('No FCM token received');
                return null;
            }

            console.log('FCM Token:', token);

            // Register token with backend
            const response = await fetch('/api/push/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: userId,
                    token: token,
                    platform: 'web'
                })
            });

            if (!response.ok) {
                throw new Error(`Failed to register token: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('Token registered successfully:', result);

            return token;
        } catch (error) {
            console.error('Failed to register FCM token:', error);
            return null;
        }
    }

    /**
     * Listen for foreground messages
     * الاستماع للرسائل في المقدمة
     */
    onForegroundMessage(callback) {
        if (!this.isInitialized) {
            console.warn('Firebase FCM not initialized');
            return;
        }

        try {
            onMessage(this.messaging, (payload) => {
                console.log('Foreground message received:', payload);
                callback(payload);
            });
        } catch (error) {
            console.error('Failed to set up foreground message listener:', error);
        }
    }

    /**
     * Request notification permission
     * طلب إذن الإشعارات
     */
    async requestPermission() {
        if (!('Notification' in window)) {
            console.warn('Notifications not supported');
            return false;
        }

        try {
            const permission = await Notification.requestPermission();
            console.log('Notification permission:', permission);
            return permission === 'granted';
        } catch (error) {
            console.error('Failed to request notification permission:', error);
            return false;
        }
    }

    /**
     * Check notification permission
     * فحص إذن الإشعارات
     */
    checkPermission() {
        if (!('Notification' in window)) {
            return 'unsupported';
        }
        return Notification.permission;
    }

    /**
     * Send test notification
     * إرسال إشعار تجريبي
     */
    async sendTestNotification() {
        try {
            const response = await fetch('/api/push/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: 'LUXBYTE Test',
                    body: 'This is a test notification from LUXBYTE',
                    topic: 'test'
                })
            });

            if (!response.ok) {
                throw new Error(`Failed to send notification: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('Test notification sent:', result);
            return result;
        } catch (error) {
            console.error('Failed to send test notification:', error);
            throw error;
        }
    }
}

// Create global instance
window.firebaseFCM = new FirebaseFCM();

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FirebaseFCM;
}
