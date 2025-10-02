// ===============================
// supabase-client.js (shared)
// ===============================
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// Supabase configuration
const SUPABASE_URL = window?.APP_CONFIG?.SUPABASE_URL || 'https://qjsvgpvbtrcnbhcjdcci.supabase.co';
const SUPABASE_ANON_KEY = window?.APP_CONFIG?.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqc3ZncHZidHJjbmJoY2pkY2NpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU2NzQ0MzQsImV4cCI6MjA1MTI1MDQzNH0.sb_publishable_vAyh05NeO33SYgua07vvIQ_M6nfrx7e';

// Create Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    headers: { 'x-client-info': 'luxbyte-dashboard-web' }
  },
});

// Make available globally for compatibility
window.supabase = supabase;

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