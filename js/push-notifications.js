/**
 * Push Notifications Manager for LUXBYTE
 * مدير الإشعارات - لوكس بايت
 */

class PushNotificationManager {
  constructor() {
    this.isInitialized = false;
    this.isSupported = false;
    this.token = null;
    this.status = 'idle'; // idle, denied, saved, error
    this.supabase = null;
  }

  /**
   * Initialize the push notification manager
   * تهيئة مدير الإشعارات
   */
  async initialize() {
    if (this.isInitialized) return;

    try {
      // Check if push notifications are supported
      this.isSupported = window.FirebaseConfig?.isPushNotificationSupported() || false;

      if (!this.isSupported) {
        console.warn('Push notifications are not supported in this browser');
        this.status = 'denied';
        return;
      }

      // Use singleton Supabase client
      const { getSupabase } = await import('./supabase-client.js');
      this.supabase = getSupabase();

      if (!this.supabase) {
        throw new Error('Supabase client not available');
      }

      this.isInitialized = true;
      console.log('Push notification manager initialized');
    } catch (error) {
      console.error('Error initializing push notification manager:', error);
      this.status = 'error';
    }
  }

  /**
   * Request notification permission and register token
   * طلب إذن الإشعارات وتسجيل التوكن
   */
  async enableNotifications() {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (!this.isSupported) {
      throw new Error('Push notifications are not supported');
    }

    try {
      this.status = 'loading';

      // Request notification permission
      const permission = await window.FirebaseConfig.requestNotificationPermission();
      if (permission !== 'granted') {
        this.status = 'denied';
        throw new Error('Notification permission denied');
      }

      // Get FCM token
      this.token = await window.FirebaseConfig.getFCMToken();
      if (!this.token) {
        throw new Error('Failed to get FCM token');
      }

      // Save token to Supabase
      await this.saveTokenToDatabase(this.token);

      this.status = 'saved';
      console.log('Push notifications enabled successfully');

      return {
        success: true,
        token: this.token,
        message: 'تم تفعيل الإشعارات بنجاح'
      };

    } catch (error) {
      console.error('Error enabling notifications:', error);
      this.status = 'error';
      throw error;
    }
  }

  /**
   * Save FCM token to Supabase database
   * حفظ توكن FCM في قاعدة البيانات
   */
  async saveTokenToDatabase(token) {
    try {
      // Get current user
      const { data: { user }, error: userError } = await this.supabase.auth.getUser();

      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      // Save token to push_tokens table
      const { error } = await this.supabase
        .from('push_tokens')
        .upsert({
          user_id: user.id,
          token: token,
          platform: 'web'
        }, {
          onConflict: 'token'
        });

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      console.log('Token saved to database successfully');
    } catch (error) {
      console.error('Error saving token to database:', error);
      throw error;
    }
  }

  /**
   * Disable notifications (remove token from database)
   * إلغاء تفعيل الإشعارات
   */
  async disableNotifications() {
    if (!this.token) {
      console.warn('No token to disable');
      return;
    }

    try {
      const { error } = await this.supabase
        .from('push_tokens')
        .delete()
        .eq('token', this.token);

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      this.token = null;
      this.status = 'idle';
      console.log('Notifications disabled successfully');

      return {
        success: true,
        message: 'تم إلغاء تفعيل الإشعارات'
      };

    } catch (error) {
      console.error('Error disabling notifications:', error);
      throw error;
    }
  }

  /**
   * Check if notifications are enabled
   * التحقق من تفعيل الإشعارات
   */
  isEnabled() {
    return this.status === 'saved' && this.token !== null;
  }

  /**
   * Get current status
   * الحصول على الحالة الحالية
   */
  getStatus() {
    return {
      status: this.status,
      isSupported: this.isSupported,
      isEnabled: this.isEnabled(),
      token: this.token
    };
  }

  /**
   * Send test notification (for admin use)
   * إرسال إشعار تجريبي
   */
  async sendTestNotification(userId, title = 'إشعار تجريبي', body = 'هذا إشعار تجريبي من لوكس بايت') {
    try {
      const response = await fetch('/api/push/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          title: title,
          body: body,
          url: window.location.origin
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send notification');
      }

      return result;
    } catch (error) {
      console.error('Error sending test notification:', error);
      throw error;
    }
  }
}

// Create global instance
window.PushNotificationManager = new PushNotificationManager();

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.PushNotificationManager.initialize();
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PushNotificationManager;
}
