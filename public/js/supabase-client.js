// js/supabase-client.js - Singleton Supabase client
import { loadEnv } from "./env.js";
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

let _supabase = null;

// Singleton pattern to prevent multiple GoTrueClient instances
export const supabase = (() => {
  if (_supabase) return _supabase;

  // Initialize synchronously if possible
  try {
    const cfg = loadEnv();
    if (cfg && cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY) {
      _supabase = createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        },
        global: {
          fetch: (...args) => fetch(...args)
        }
      });
      console.log('✅ Supabase client initialized (sync)');

      // Initialize session immediately
      _supabase.auth.getSession().then(() => {
        console.log('✅ Supabase session initialized');
      }).catch(err => {
        console.warn('Session initialization warning:', err);
      });

      return _supabase;
    }
  } catch (error) {
    console.warn('Sync initialization failed, will use async:', error);
  }

  return null;
})();

export async function initSupabase() {
  if (_supabase) return _supabase;

  const cfg = await loadEnv();
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = cfg || {};

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error("ENV_INCOMPLETE: SUPABASE_URL / SUPABASE_ANON_KEY");
  }

  _supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    },
    global: {
      fetch: (...args) => fetch(...args)
    }
  });

  console.log('✅ Supabase client initialized (async)');
  return _supabase;
}

export function getSupabase() {
  if (_supabase) return _supabase;
  throw new Error("SUPABASE_NOT_READY - Call initSupabase() first");
}

// Legacy compatibility
export async function getSupabaseClient() {
  return await initSupabase();
}

// Make available globally for legacy scripts
if (typeof window !== 'undefined') {
  window.LUXBYTE = window.LUXBYTE || {};
  window.LUXBYTE.supabase = {
    init: initSupabase,
    getClient: getSupabaseClient,
    get: getSupabase,
    client: supabase
  };
}