/**
 * LUXBYTE Supabase Client - Singleton
 * عميل Supabase الوحيد لتجنب Multiple GoTrueClient
 */

(() => {
  // عداد لمراقبة إنشاء العملاء
  window.__supabaseClientCount = (window.__supabaseClientCount || 0) + 1;

  // تحميل Supabase بشكل ديناميكي
  if (window.__supabase) {
    console.log('✅ Supabase singleton موجود بالفعل');
    return;
  }

  // إعدادات Supabase
  const URL = window.__ENV?.SUPABASE_URL || window.NEXT_PUBLIC_SUPABASE_URL || 'https://qjsvgpvbtrcnbhcjdcci.supabase.co';
  const ANON = window.__ENV?.SUPABASE_ANON_KEY || window.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_vAyh05NeO33SYgua07vvIQ_M6nfrx7e';

  // فحص صحة الإعدادات
  const okUrl = typeof URL === 'string' && URL.startsWith('https://') && URL.includes('.supabase.co');
  const okAnon = typeof ANON === 'string' && ANON.startsWith('sb_') && ANON.length > 50;

  console.log('SB URL ok?', okUrl, 'ANON len:', ANON?.length);

  if (!okUrl || !okAnon) {
    console.error('❌ Supabase config invalid', { okUrl, okAnon, URL });
    alert('إعدادات Supabase غير صحيحة: URL/ANON');
    return;
  }

  // تحميل Supabase وإنشاء العميل الوحيد
  import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm').then(({ createClient }) => {
    if (!window.__supabase) {
      window.__supabase = createClient(URL, ANON, {
        auth: {
          storageKey: 'luxbyte-auth',
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          flowType: 'pkce'
        },
        global: {
          headers: {
            'x-client-info': 'luxbyte-web',
            'x-app-version': '1.0.8'
          }
        }
      });
      console.log('✅ Supabase singleton ready');
    }
  }).catch(error => {
    console.error('❌ فشل في تحميل Supabase:', error);
  });

  // دالة للحصول على العميل
  window.getSupabase = () => window.__supabase;
})();