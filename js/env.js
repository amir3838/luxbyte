// js/env.js - ESM Environment loader
export async function loadEnv() {
  // 1) Try inline config first (fastest)
  const el = document.getElementById('app-config');
  if (el) {
    try { 
      const config = JSON.parse(el.textContent);
      console.log('✅ Loaded environment from inline config');
      return config;
    } catch (e) {
      console.warn('Failed to parse inline config:', e);
    }
  }
  
  // 2) Fallback to fetch
  try {
    const res = await fetch('/config.json', { cache: 'no-store' });
    if (!res.ok) throw new Error(`ENV_FETCH_FAILED: ${res.status}`);
    const config = await res.json();
    console.log('✅ Loaded environment from config.json');
    return config;
  } catch (error) {
    console.error('❌ Error loading environment configuration:', error);
    throw new Error('ENV_FETCH_FAILED: No configuration available');
  }
}

// Make available globally for legacy scripts
if (typeof window !== 'undefined') {
  window.loadEnv = loadEnv;
}
