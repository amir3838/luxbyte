// js/env.js - ESM Environment loader
export async function loadEnv() {
  const el = document.getElementById('app-config');
  if (el) {
    try { 
      return JSON.parse(el.textContent); 
    } catch (e) {
      console.warn('Failed to parse inline config:', e);
    }
  }
  
  const res = await fetch('/config.json', { cache: 'no-store' });
  if (!res.ok) throw new Error(`ENV_FETCH_FAILED: ${res.status}`);
  return await res.json();
}
