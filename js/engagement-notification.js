/**
 * Engagement Notification System
 * نظام إشعارات التفاعل - لوكس بايت
 */

class EngagementNotificationManager {
  constructor() {
    this.timer = null;
    this.hasShownNotification = false;
    this.isUserLoggedIn = false;
    this.engagementTime = 20000; // 20 seconds
    this.init();
  }

  /**
   * Initialize the engagement notification system
   * تهيئة نظام إشعارات التفاعل
   */
  init() {
    // Check if user is already logged in
    this.checkUserStatus();
    
    // Start engagement timer
    this.startEngagementTimer();
    
    // Listen for user interactions
    this.setupInteractionListeners();
    
    // Listen for theme changes
    this.setupThemeListener();
    
    console.log('Engagement notification system initialized');
  }

  /**
   * Setup theme change listener
   * إعداد مستمع تغيير الألوان
   */
  setupThemeListener() {
    window.addEventListener('themeChanged', (event) => {
      // Update notification colors if it's currently visible
      const notification = document.getElementById('engagement-notification');
      if (notification) {
        this.updateNotificationColors();
      }
    });
  }

  /**
   * Update notification colors based on current theme
   * تحديث ألوان الإشعار حسب الوضع الحالي
   */
  updateNotificationColors() {
    const notification = document.getElementById('engagement-notification');
    if (!notification) return;

    const isLight = document.body.classList.contains('light-theme');
    
    if (isLight) {
      // Light theme colors
      notification.style.background = 'linear-gradient(135deg, #ffffff, #f8f9fa)';
      notification.style.borderColor = 'rgba(0, 0, 0, 0.1)';
      notification.style.color = '#1a1a1a';
      
      // Update text colors
      const h3 = notification.querySelector('h3');
      const p = notification.querySelector('p');
      if (h3) h3.style.color = '#1a1a1a';
      if (p) p.style.color = '#333333';
      
      // Update button colors
      const secondaryBtn = notification.querySelector('.engagement-btn-secondary');
      const closeBtn = notification.querySelector('.engagement-btn-close');
      if (secondaryBtn) {
        secondaryBtn.style.background = 'rgba(255, 255, 255, 0.95)';
        secondaryBtn.style.color = '#1a1a1a';
        secondaryBtn.style.borderColor = 'rgba(0, 0, 0, 0.1)';
      }
      if (closeBtn) {
        closeBtn.style.background = 'rgba(255, 255, 255, 0.95)';
        closeBtn.style.color = '#666666';
      }
    } else {
      // Dark theme colors
      notification.style.background = 'linear-gradient(135deg, #1a1a1a, #2a2a2a)';
      notification.style.borderColor = 'rgba(255, 255, 255, 0.1)';
      notification.style.color = '#ffffff';
      
      // Update text colors
      const h3 = notification.querySelector('h3');
      const p = notification.querySelector('p');
      if (h3) h3.style.color = '#ffffff';
      if (p) p.style.color = '#e5e5e5';
      
      // Update button colors
      const secondaryBtn = notification.querySelector('.engagement-btn-secondary');
      const closeBtn = notification.querySelector('.engagement-btn-close');
      if (secondaryBtn) {
        secondaryBtn.style.background = 'rgba(255, 255, 255, 0.05)';
        secondaryBtn.style.color = '#ffffff';
        secondaryBtn.style.borderColor = 'rgba(255, 255, 255, 0.1)';
      }
      if (closeBtn) {
        closeBtn.style.background = 'rgba(255, 255, 255, 0.05)';
        closeBtn.style.color = '#cccccc';
      }
    }
  }

  /**
   * Check if user is logged in
   * التحقق من حالة تسجيل الدخول
   */
  async checkUserStatus() {
    try {
      if (typeof window !== 'undefined' && window.LUXBYTE && window.LUXBYTE.supabase) {
        const { data: { user } } = await window.LUXBYTE.supabase.auth.getUser();
        this.isUserLoggedIn = !!user;
      }
    } catch (error) {
      console.log('Could not check user status:', error);
      this.isUserLoggedIn = false;
    }
  }

  /**
   * Start the engagement timer
   * بدء مؤقت التفاعل
   */
  startEngagementTimer() {
    // Clear existing timer
    if (this.timer) {
      clearTimeout(this.timer);
    }

    // Start new timer
    this.timer = setTimeout(() => {
      this.showEngagementNotification();
    }, this.engagementTime);
  }

  /**
   * Setup interaction listeners to reset timer
   * إعداد مستمعي التفاعل لإعادة تعيين المؤقت
   */
  setupInteractionListeners() {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

    events.forEach(event => {
      document.addEventListener(event, () => {
        this.resetTimer();
      }, { passive: true });
    });
  }

  /**
   * Reset the engagement timer
   * إعادة تعيين مؤقت التفاعل
   */
  resetTimer() {
    // Only reset if user is not logged in and notification hasn't been shown
    if (!this.isUserLoggedIn && !this.hasShownNotification) {
      this.startEngagementTimer();
    }
  }

  /**
   * Show engagement notification
   * عرض إشعار التفاعل
   */
  showEngagementNotification() {
    // Don't show if user is logged in or already shown
    if (this.isUserLoggedIn || this.hasShownNotification) {
      return;
    }

    // Mark as shown
    this.hasShownNotification = true;

    // Create notification element
    this.createNotificationElement();
  }

  /**
   * Create the notification element
   * إنشاء عنصر الإشعار
   */
  createNotificationElement() {
    // Remove existing notification if any
    const existingNotification = document.getElementById('engagement-notification');
    if (existingNotification) {
      existingNotification.remove();
    }

    // Create notification container
    const notification = document.createElement('div');
    notification.id = 'engagement-notification';
    notification.className = 'engagement-notification';
    notification.setAttribute('dir', 'rtl');
    notification.setAttribute('lang', 'ar');

    // Apply theme colors
    this.updateNotificationColors();

    // Create notification content
    notification.innerHTML = `
      <div class="engagement-notification-content">
        <div class="engagement-notification-icon">
          <i class="fas fa-user-plus"></i>
        </div>
        <div class="engagement-notification-text">
          <h3>هل ليس لديك حساب؟</h3>
          <p>إذا كانت تطبق عليك الشروط اشترك وسجل الآن!</p>
        </div>
        <div class="engagement-notification-actions">
          <button class="engagement-btn engagement-btn-primary" onclick="window.engagementNotification.goToSignup()">
            <i class="fas fa-user-plus"></i>
            إنشاء حساب
          </button>
          <button class="engagement-btn engagement-btn-secondary" onclick="window.engagementNotification.goToLogin()">
            <i class="fas fa-sign-in-alt"></i>
            تسجيل الدخول
          </button>
          <button class="engagement-btn engagement-btn-close" onclick="window.engagementNotification.close()">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    `;

    // Add to page
    document.body.appendChild(notification);

    // Apply theme colors after DOM insertion
    setTimeout(() => {
      this.updateNotificationColors();
    }, 50);

    // Show with animation
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);

    // Auto-hide after 30 seconds
    setTimeout(() => {
      this.close();
    }, 30000);
  }

  /**
   * Go to signup page
   * الذهاب إلى صفحة التسجيل
   */
  goToSignup() {
    window.location.href = 'account-type-selection.html';
  }

  /**
   * Go to login page
   * الذهاب إلى صفحة تسجيل الدخول
   */
  goToLogin() {
    window.location.href = 'auth.html';
  }

  /**
   * Close the notification
   * إغلاق الإشعار
   */
  close() {
    const notification = document.getElementById('engagement-notification');
    if (notification) {
      notification.classList.add('hide');
      setTimeout(() => {
        notification.remove();
      }, 300);
    }
  }

  /**
   * Reset the system (for testing)
   * إعادة تعيين النظام (للاختبار)
   */
  reset() {
    this.hasShownNotification = false;
    this.close();
    this.startEngagementTimer();
  }
}

// Create global instance
window.engagementNotification = new EngagementNotificationManager();

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EngagementNotificationManager;
}
