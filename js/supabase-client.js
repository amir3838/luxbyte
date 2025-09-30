// js/supabase-client.js - ESM Supabase client (no getters/setters)
import { loadEnv } from "./env.js";
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

let client = null;

export async function initSupabase() {
  if (client) return client;

  const cfg = await loadEnv();
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = cfg || {};

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error("ENV_INCOMPLETE: SUPABASE_URL / SUPABASE_ANON_KEY");
  }

  client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    },
    global: {
      fetch: (...args) => fetch(...args)
    }
  });

  console.log('✅ Supabase client initialized');
  return client;
}

export function getSupabase() {
  if (!client) throw new Error("SUPABASE_NOT_READY");
  return client;
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
    get: getSupabase
  };
}