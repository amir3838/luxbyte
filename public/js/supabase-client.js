// ===============================
// LUXBYTE Supabase Client - Enhanced Version
// ===============================
// هذا الملف يستخدم الآن الـ singleton من common.js

// Error handling and logging
const logLevel = window.location.hostname === 'localhost' ? 'debug' : 'error';
const log = (level, message, data = null) => {
    if (level === 'debug' && logLevel !== 'debug') return;
    console[level](`[LUXBYTE] ${message}`, data || '');
};

// استخدام الـ singleton من common.js
const supabase = window.getSupabase ? window.getSupabase() : window.__supabase;

// Enhanced error handling wrapper
export const supabaseWithErrorHandling = {
  auth: {
    signUp: async (credentials) => {
      try {
        log('debug', 'Attempting user signup', { email: credentials.email });
        const result = await supabase.auth.signUp(credentials);
        if (result.error) {
          log('error', 'Signup failed', result.error);
        } else {
          log('debug', 'Signup successful', { userId: result.data.user?.id });
        }
        return result;
      } catch (error) {
        log('error', 'Signup exception', error);
        throw error;
      }
    },
    signInWithPassword: async (credentials) => {
      try {
        log('debug', 'Attempting user login', { email: credentials.email });
        const result = await supabase.auth.signInWithPassword(credentials);
        if (result.error) {
          log('error', 'Login failed', result.error);
        } else {
          log('debug', 'Login successful', { userId: result.data.user?.id });
        }
        return result;
      } catch (error) {
        log('error', 'Login exception', error);
        throw error;
      }
    },
    signOut: async () => {
      try {
        log('debug', 'Attempting user logout');
        const result = await supabase.auth.signOut();
        log('debug', 'Logout successful');
        return result;
      } catch (error) {
        log('error', 'Logout exception', error);
        throw error;
      }
    },
    getSession: async () => {
      try {
        const result = await supabase.auth.getSession();
        log('debug', 'Session retrieved', { hasSession: !!result.data.session });
        return result;
      } catch (error) {
        log('error', 'Get session exception', error);
        throw error;
      }
    },
    getUser: async () => {
      try {
        const result = await supabase.auth.getUser();
        log('debug', 'User retrieved', { hasUser: !!result.data.user });
        return result;
      } catch (error) {
        log('error', 'Get user exception', error);
        throw error;
      }
    },
    resetPasswordForEmail: async (email, options) => {
      try {
        log('debug', 'Attempting password reset', { email });
        const result = await supabase.auth.resetPasswordForEmail(email, options);
        if (result.error) {
          log('error', 'Password reset failed', result.error);
        } else {
          log('debug', 'Password reset email sent');
        }
        return result;
      } catch (error) {
        log('error', 'Password reset exception', error);
        throw error;
      }
    }
  },
  from: (table) => {
    const originalFrom = supabase.from(table);
    return {
      select: async (columns = '*', options = {}) => {
        try {
          log('debug', `Selecting from ${table}`, { columns, options });
          const result = await originalFrom.select(columns, options);
          if (result.error) {
            log('error', `Select from ${table} failed`, result.error);
          }
          return result;
        } catch (error) {
          log('error', `Select from ${table} exception`, error);
          throw error;
        }
      },
      insert: async (data, options = {}) => {
        try {
          log('debug', `Inserting into ${table}`, { dataCount: Array.isArray(data) ? data.length : 1 });
          const result = await originalFrom.insert(data, options);
          if (result.error) {
            log('error', `Insert into ${table} failed`, result.error);
          }
          return result;
        } catch (error) {
          log('error', `Insert into ${table} exception`, error);
          throw error;
        }
      },
      update: async (data, options = {}) => {
        try {
          log('debug', `Updating ${table}`, { data, options });
          const result = await originalFrom.update(data, options);
          if (result.error) {
            log('error', `Update ${table} failed`, result.error);
          }
          return result;
        } catch (error) {
          log('error', `Update ${table} exception`, error);
          throw error;
        }
      },
      delete: async (options = {}) => {
        try {
          log('debug', `Deleting from ${table}`, { options });
          const result = await originalFrom.delete(options);
          if (result.error) {
            log('error', `Delete from ${table} failed`, result.error);
          }
          return result;
        } catch (error) {
          log('error', `Delete from ${table} exception`, error);
          throw error;
        }
      },
      eq: (column, value) => originalFrom.eq(column, value),
      single: () => originalFrom.single(),
      order: (column, options = {}) => originalFrom.order(column, options),
      limit: (count) => originalFrom.limit(count)
    };
  }
};

// Make available globally for compatibility
window.supabase = supabase;
window.supabaseWithErrorHandling = supabaseWithErrorHandling;

export async function requireAuth() {
  const { data } = await supabase.auth.getSession();
  if (!data?.session) throw new Error('ليس لديك جلسة صالحة. الرجاء تسجيل الدخول.');
  return data.session.user;
}

export async function logout() {
  await supabase.auth.signOut();
  window.location.href = '/auth.html';
}

// Export for global access
window.supabase = supabase;

// Export getSupabase function for compatibility
export function getSupabase() {
  return supabase;
}