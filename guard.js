// LUXBYTE Auth Guard
window.AuthGuard = {
  // Protected pages that require authentication
  protectedPages: [
    'choose-platform.html',
    'choose-role.html',
    'signup.html',
    'dashboard.html'
  ],

  // Initialize auth guard
  init() {
    const currentPage = this.getCurrentPage();

    if (this.isProtectedPage(currentPage)) {
      this.protectPage();
    }
  },

  // Get current page name
  getCurrentPage() {
    const path = window.location.pathname;
    return path.split('/').pop() || 'index.html';
  },

  // Check if current page is protected
  isProtectedPage(pageName) {
    return this.protectedPages.includes(pageName);
  },

  // Protect current page
  async protectPage() {
    try {
      // Show loading
      this.showLoading();

      // Check authentication
      const isAuthenticated = await LUXBYTE.requireAuthOrRedirect();

      if (!isAuthenticated) {
        // Redirect will happen in requireAuthOrRedirect
        return;
      }

      // Hide loading
      this.hideLoading();

      // Page is now accessible
      console.log('Page protected successfully');

    } catch (error) {
      console.error('Auth guard error:', error);
      LUXBYTE.notifyErr('خطأ في التحقق من الهوية');
      this.hideLoading();
    }
  },

  // Show loading overlay
  showLoading() {
    const loading = document.createElement('div');
    loading.id = 'auth-loading';
    loading.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        color: white;
        font-size: 18px;
      ">
        <div class="loading">
          <div class="spinner"></div>
          <span>جاري التحقق من الهوية...</span>
        </div>
      </div>
    `;
    document.body.appendChild(loading);
  },

  // Hide loading overlay
  hideLoading() {
    const loading = document.getElementById('auth-loading');
    if (loading) {
      loading.remove();
    }
  },

  // Check if user is authenticated (without redirect)
  async isAuthenticated() {
    try {
      const session = await LUXBYTE.getSession();
      return !!session;
    } catch (error) {
      console.error('Auth check error:', error);
      return false;
    }
  },

  // Get current user
  async getCurrentUser() {
    try {
      const session = await LUXBYTE.getSession();
      return session?.user || null;
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  },

  // Logout user
  async logout() {
    try {
      if (LUXBYTE.supabase) {
        await LUXBYTE.supabase.auth.signOut();
        LUXBYTE.notifyOk('تم تسجيل الخروج بنجاح');
        window.location.href = 'index.html';
      }
    } catch (error) {
      console.error('Logout error:', error);
      LUXBYTE.notifyErr('خطأ في تسجيل الخروج');
    }
  },

  // Redirect to login with return URL
  redirectToLogin(returnUrl = null) {
    const currentUrl = returnUrl || window.location.href;
    const loginUrl = `auth.html?return=${encodeURIComponent(currentUrl)}`;
    window.location.href = loginUrl;
  },

  // Handle auth state changes
  setupAuthListener() {
    if (!LUXBYTE.supabase) return;

    LUXBYTE.supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session);

      if (event === 'SIGNED_OUT') {
        // User signed out, redirect to home
        if (this.isProtectedPage(this.getCurrentPage())) {
          window.location.href = 'index.html';
        }
      } else if (event === 'SIGNED_IN') {
        // User signed in, check if we need to redirect
        const returnUrl = new URLSearchParams(window.location.search).get('return');
        if (returnUrl) {
          window.location.href = returnUrl;
        }
      }
    });
  }
};

// Auto-initialize guard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Wait for LUXBYTE to be available
  const initGuard = () => {
    if (window.LUXBYTE && window.LUXBYTE.supabase) {
      AuthGuard.init();
      AuthGuard.setupAuthListener();
    } else {
      // Retry after 100ms
      setTimeout(initGuard, 100);
    }
  };

  initGuard();
});
