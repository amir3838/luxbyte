// FCM Manager for Push Notifications
// Handles device registration and notification sending

import { getSupabase } from './supabase-client.js';

class FCMManager {
    constructor() {
        this.isSupported = 'serviceWorker' in navigator && 'PushManager' in window;
        this.registration = null;
        this.subscription = null;
    }

    /**
     * Initialize FCM service worker
     */
    async initialize() {
        if (!this.isSupported) {
            console.warn('Push notifications not supported');
            return false;
        }

        try {
            // Register service worker
            this.registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
            console.log('✅ Service Worker registered:', this.registration);

            // Get FCM token
            const token = await this.getToken();
            if (token) {
                await this.saveTokenToDatabase(token);
            }

            // Listen for token refresh
            this.onTokenRefresh();

            return true;
        } catch (error) {
            console.error('❌ FCM initialization failed:', error);
            return false;
        }
    }

    /**
     * Get FCM token
     */
    async getToken() {
        try {
            const messaging = firebase.messaging();
            const token = await messaging.getToken({
                vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
            });

            if (token) {
                console.log('✅ FCM Token:', token);
                return token;
            } else {
                console.warn('No FCM token available');
                return null;
            }
        } catch (error) {
            console.error('❌ Error getting FCM token:', error);
            return null;
        }
    }

    /**
     * Save token to database
     */
    async saveTokenToDatabase(token) {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: profile } = await supabase
                .from('profiles')
                .select('account')
                .eq('user_id', user.id)
                .single();

            if (!profile) return;

            // Upsert device token
            const { error } = await supabase
                .from('user_devices')
                .upsert({
                    user_id: user.id,
                    device_token: token,
                    platform: 'web',
                    is_active: true,
                    last_used_at: new Date().toISOString()
                }, {
                    onConflict: 'user_id,device_token'
                });

            if (error) {
                console.error('❌ Error saving token:', error);
            } else {
                console.log('✅ Token saved to database');
            }
        } catch (error) {
            console.error('❌ Error saving token to database:', error);
        }
    }

    /**
     * Handle token refresh
     */
    onTokenRefresh() {
        try {
            const messaging = firebase.messaging();
            messaging.onTokenRefresh(async () => {
                console.log('🔄 FCM token refreshed');
                const token = await this.getToken();
                if (token) {
                    await this.saveTokenToDatabase(token);
                }
            });
        } catch (error) {
            console.error('❌ Error setting up token refresh:', error);
        }
    }

    /**
     * Request notification permission
     */
    async requestPermission() {
        try {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                console.log('✅ Notification permission granted');
                return true;
            } else {
                console.warn('❌ Notification permission denied');
                return false;
            }
        } catch (error) {
            console.error('❌ Error requesting permission:', error);
            return false;
        }
    }

    /**
     * Send notification to specific account type
     */
    async sendNotificationToAccountType(accountType, title, message, data = {}) {
        try {
            const { error } = await supabase
                .from('notifications')
                .insert({
                    user_id: null, // Will be filled by trigger
                    title,
                    message,
                    type: 'account_notification',
                    data: JSON.stringify({
                        account_type: accountType,
                        ...data
                    })
                });

            if (error) {
                console.error('❌ Error sending notification:', error);
                return false;
            }

            console.log(`✅ Notification sent to ${accountType} accounts`);
            return true;
        } catch (error) {
            console.error('❌ Error sending notification:', error);
            return false;
        }
    }

    /**
     * Send notification to specific user
     */
    async sendNotificationToUser(userId, title, message, data = {}) {
        try {
            const { error } = await supabase
                .from('notifications')
                .insert({
                    user_id: userId,
                    title,
                    message,
                    type: 'direct_notification',
                    data: JSON.stringify(data)
                });

            if (error) {
                console.error('❌ Error sending notification:', error);
                return false;
            }

            console.log(`✅ Notification sent to user ${userId}`);
            return true;
        } catch (error) {
            console.error('❌ Error sending notification:', error);
            return false;
        }
    }

    /**
     * Get user notifications
     */
    async getUserNotifications(limit = 50) {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return [];

            const supabase = getSupabase();
            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(limit);

            if (error) {
                console.error('❌ Error fetching notifications:', error);
                return [];
            }

            return data || [];
        } catch (error) {
            console.error('❌ Error fetching notifications:', error);
            return [];
        }
    }

    /**
     * Mark notification as read
     */
    async markAsRead(notificationId) {
        try {
            const { error } = await supabase
                .from('notifications')
                .update({
                    is_read: true,
                    read_at: new Date().toISOString()
                })
                .eq('id', notificationId);

            if (error) {
                console.error('❌ Error marking notification as read:', error);
                return false;
            }

            return true;
        } catch (error) {
            console.error('❌ Error marking notification as read:', error);
            return false;
        }
    }

    /**
     * Setup message listener
     */
    setupMessageListener() {
        try {
            const messaging = firebase.messaging();

            messaging.onMessage((payload) => {
                console.log('📱 Message received:', payload);

                // Show notification
                this.showNotification(payload.notification.title, payload.notification.body, payload.data);
            });
        } catch (error) {
            console.error('❌ Error setting up message listener:', error);
        }
    }

    /**
     * Show browser notification
     */
    showNotification(title, body, data = {}) {
        if (Notification.permission === 'granted') {
            const notification = new Notification(title, {
                body,
                icon: '/assets/app_icon/LUXBYTE.png',
                badge: '/assets/app_icon/LUXBYTE.png',
                data
            });

            notification.onclick = () => {
                window.focus();
                notification.close();

                // Handle notification click
                if (data.url) {
                    window.location.href = data.url;
                }
            };
        }
    }
}

// Create global instance
const fcmManager = new FCMManager();

// Export for use in other modules
export default fcmManager;

// Make available globally
window.fcmManager = fcmManager;
