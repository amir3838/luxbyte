// LUXBYTE Common Utilities
window.LUXBYTE = {
  // Supabase Client
  supabase: null,

  // Initialize Supabase
  init() {
    if (typeof window.supabase === 'undefined') {
      console.error('Supabase SDK not loaded');
      return;
    }

    this.supabase = window.supabase.createClient(
      window.CONFIG.SUPABASE_URL,
      window.CONFIG.SUPABASE_ANON_KEY,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true
        }
      }
    );

    console.log('Supabase initialized');
  },

  // Get current session
  async getSession() {
    if (!this.supabase) {
      this.init();
    }

    const { data: { session }, error } = await this.supabase.auth.getSession();
    if (error) {
      console.error('Error getting session:', error);
      return null;
    }
    return session;
  },

  // Require authentication or redirect
  async requireAuthOrRedirect() {
    const session = await this.getSession();
    if (!session) {
      window.location.href = 'auth.html';
      return false;
    }
    return true;
  },

  // Upload file to Supabase Storage
  async uploadToBucket(bucket, prefix, file) {
    if (!this.supabase) {
      this.init();
    }

    try {
      // Generate unique filename
      const timestamp = Date.now();
      const fileExt = file.name.split('.').pop();
      const fileName = `${prefix}_${timestamp}.${fileExt}`;
      const filePath = `${prefix}/${fileName}`;

      // Upload file
      const { data, error } = await this.supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: { publicUrl } } = this.supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  },

  // Helper functions
  byId(id) {
    return document.getElementById(id);
  },

  q(selector) {
    return document.querySelector(selector);
  },

  qAll(selector) {
    return document.querySelectorAll(selector);
  },

  // Notifications
  notifyOk(message) {
    this.showNotification(message, 'success');
  },

  notifyErr(message) {
    this.showNotification(message, 'error');
  },

  showNotification(message, type = 'success') {
    // Remove existing notifications
    const existing = document.querySelectorAll('.notification');
    existing.forEach(n => n.remove());

    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
      notification.remove();
    }, 5000);
  },

  // Form helpers
  getFormData(formId) {
    const form = this.byId(formId);
    if (!form) return {};

    const formData = new FormData(form);
    const data = {};

    for (let [key, value] of formData.entries()) {
      data[key] = value;
    }

    return data;
  },

  validateForm(formId, requiredFields = []) {
    const form = this.byId(formId);
    if (!form) return false;

    for (const field of requiredFields) {
      const input = form.querySelector(`[name="${field}"]`);
      if (!input || !input.value.trim()) {
        this.notifyErr(`يرجى ملء حقل ${field}`);
        input?.focus();
        return false;
      }
    }

    return true;
  },

  // Location helpers
  updateCityDropdown(governorateSelect, citySelect) {
    const governorate = governorateSelect.value;
    const cities = window.CONFIG.LOCATIONS[governorate] || [];

    // Clear existing options
    citySelect.innerHTML = '';

    if (cities.length > 0) {
      cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        citySelect.appendChild(option);
      });
      citySelect.disabled = false;
    } else {
      citySelect.disabled = true;
    }
  },

  // File upload helpers
  setupFileUpload(inputId, onUpload) {
    const input = this.byId(inputId);
    if (!input) return;

    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        onUpload(file);
      }
    });
  },

  // Create file preview
  createFilePreview(file, containerId) {
    const container = this.byId(containerId);
    if (!container) return;

    const preview = document.createElement('div');
    preview.className = 'uploaded-file';

    if (file.type.startsWith('image/')) {
      const img = document.createElement('img');
      img.src = URL.createObjectURL(file);
      img.className = 'file-preview';
      preview.appendChild(img);
    } else {
      const icon = document.createElement('i');
      icon.className = 'fas fa-file';
      icon.style.fontSize = '40px';
      icon.style.color = '#6b7280';
      preview.appendChild(icon);
    }

    const info = document.createElement('div');
    info.className = 'file-info';

    const name = document.createElement('div');
    name.className = 'file-name';
    name.textContent = file.name;

    const size = document.createElement('div');
    size.className = 'file-size';
    size.textContent = this.formatFileSize(file.size);

    info.appendChild(name);
    info.appendChild(size);
    preview.appendChild(info);

    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-file';
    removeBtn.innerHTML = '<i class="fas fa-trash"></i>';
    removeBtn.onclick = () => preview.remove();
    preview.appendChild(removeBtn);

    container.appendChild(preview);
  },

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  // Loading helpers
  showLoading(elementId, text = 'جاري التحميل...') {
    const element = this.byId(elementId);
    if (!element) return;

    element.innerHTML = `
      <div class="loading">
        <div class="spinner"></div>
        <span>${text}</span>
      </div>
    `;
    element.disabled = true;
  },

  hideLoading(elementId, originalText) {
    const element = this.byId(elementId);
    if (!element) return;

    element.innerHTML = originalText;
    element.disabled = false;
  },

  // URL helpers
  getUrlParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  },

  // Storage helpers
  setStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Storage error:', error);
    }
  },

  getStorage(key) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Storage error:', error);
      return null;
    }
  },

  removeStorage(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Storage error:', error);
    }
  }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  LUXBYTE.init();
});

// ====== ENHANCED UI UTILITIES ======

// ====== Toast ======
let toastEl;
function showToast(msg, ms=3000){
  if(!toastEl){
    toastEl = document.createElement('div');
    toastEl.className='toast';
    document.body.appendChild(toastEl);
  }
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  setTimeout(()=>toastEl.classList.remove('show'), ms);
}

// ====== Loader ======
let loaderEl;
function showLoader(show=true){
  if(!loaderEl){
    loaderEl = document.createElement('div');
    loaderEl.className='loader';
    loaderEl.innerHTML = '<div class="spinner"></div>';
    document.body.appendChild(loaderEl);
  }
  loaderEl.style.display = show ? 'grid' : 'none';
}

// ====== Button ripple ======
document.addEventListener('click', (e)=>{
  const btn = e.target.closest('.btn, .nav-btn');
  if(!btn) return;
  const r = document.createElement('span');
  r.className='ripple';
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  r.style.width = r.style.height = size+'px';
  r.style.left = (e.clientX - rect.left - size/2)+'px';
  r.style.top  = (e.clientY - rect.top  - size/2)+'px';
  btn.appendChild(r);
  setTimeout(()=> r.remove(), 800);
});

// ====== Scroll reveal ======
(function(){
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{
      if(en.isIntersecting){
        en.target.classList.add('in');
        io.unobserve(en.target);
      }
    });
  }, {threshold:.1});

  document.addEventListener('DOMContentLoaded', ()=>{
    document.querySelectorAll('.reveal').forEach(el=> io.observe(el));
  });
})();

// ====== Back to top ======
(function(){
  const b = document.createElement('button');
  b.className='back-to-top';
  b.innerHTML = '<i class="fas fa-arrow-up"></i>';
  b.onclick = ()=> window.scrollTo({top:0, behavior:'smooth'});

  document.addEventListener('scroll', ()=> {
    if(window.scrollY > 400) b.classList.add('show');
    else b.classList.remove('show');
  });

  document.body.appendChild(b);
})();

// ====== Helpers to wrap async ops with loader + toast ======
async function withLoader(fn, okMsg){
  try{
    showLoader(true);
    const res = await fn();
    if(okMsg) showToast(okMsg);
    return res;
  }catch(err){
    showToast('خطأ: '+(err.message||err));
    throw err;
  }
  finally{
    showLoader(false);
  }
}

// ====== Enhanced Notifications ======
LUXBYTE.notifyOk = function(message) {
  showToast('✅ ' + message, 3000);
};

LUXBYTE.notifyErr = function(message) {
  showToast('❌ ' + message, 4000);
};

// ====== Parallax Effect ======
function initParallax() {
  const parallaxElements = document.querySelectorAll('.hero-parallax');

  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;

    parallaxElements.forEach(element => {
      const rate = scrolled * -0.5;
      element.style.transform = `translateY(${rate}px)`;
    });
  });
}

// ====== Logo Glow Effect ======
function initLogoGlow() {
  const logos = document.querySelectorAll('.logo img, .card-icon img');
  logos.forEach(logo => {
    logo.classList.add('logo-glow');
  });
}



// ====== Al-Hareth Indicator ======
function injectAlHareth(){
  const alhareth = document.createElement('div');
  alhareth.className = 'alhareth-indicator';
  alhareth.innerHTML = `
    <i class="fas fa-robot"></i> الحارث متصل
  `;
  document.body.appendChild(alhareth);
}

// ====== Theme Toggle ======
function injectThemeToggle(){
  const themeToggle = document.createElement('div');
  themeToggle.className = 'theme-toggle';
  themeToggle.innerHTML = `<i class="fas fa-moon" id="theme-icon"></i>`;
  themeToggle.onclick = toggleTheme;
  document.body.appendChild(themeToggle);
}

// ====== Language Toggle ======
function injectLanguageToggle(){
  // تم دمج وظيفة تبديل اللغة في النافبار
  // لا حاجة لزر منفصل
}

// ====== Theme Toggle Function ======
function toggleTheme() {
  const body = document.body;
  const themeIcon = document.getElementById('theme-icon');

  if (body.classList.contains('light-theme')) {
    body.classList.remove('light-theme');
    themeIcon.className = 'fas fa-moon';
    localStorage.setItem('theme', 'dark');
  } else {
    body.classList.add('light-theme');
    themeIcon.className = 'fas fa-sun';
    localStorage.setItem('theme', 'light');
  }
}

// ====== Language Toggle Function ======
// تم حذف دالة toggleLanguage القديمة
// يتم استخدام switchLang() الجديدة بدلاً منها

/* ================== THEME (light/dark) ================== */
(function themeInit(){
  const saved = localStorage.getItem('theme'); // 'light' | 'dark' | null
  if (saved === 'light' || saved === 'dark') {
    document.documentElement.classList.remove('light','dark');
    document.documentElement.classList.add(saved);
  } // وإلا هنمشي على النظام عبر @media
})();

function toggleTheme(){
  const root = document.documentElement;
  const isLight = root.classList.contains('light');
  const next = isLight ? 'dark' : 'light';
  root.classList.remove('light','dark'); root.classList.add(next);
  localStorage.setItem('theme', next);
}

/* ================== SAFE NAVIGATION ================== */
/* يمنع زرار يكون button بدون href وميحوّلكش */
function safeNav(url){
  try{ location.href = url; }catch(e){ console.error(e); alert('تعذر الانتقال'); }
}

/* استعملها على البطاقات زر ShopEG/MasterDriver بدل onClick الغامض */
window.goShopEG = function(){
  LUXBYTE.setStorage('selectedPlatform', 'shopeg');
  safeNav('choose-role.html');
}
window.goMasterDriver = function(){
  LUXBYTE.setStorage('selectedPlatform', 'masterdriver');
  safeNav('signup.html?role=courier');
}

/* ================== i18n بسطرين إعداد ================== */
// تحميل قاموس الترجمة من ملف منفصل
const i18n = {
  // اللغة الحالية
  lang: localStorage.getItem('lang') || 'ar',
  dict: i18nDict
};

function t(key){ return (i18n.dict[i18n.lang] && i18n.dict[i18n.lang][key]) || key; }

function applyI18n(){
  // النصوص
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    el.textContent = t(el.getAttribute('data-i18n'));
  });
  // Placeholder
  document.querySelectorAll('[data-i18n-ph]').forEach(el=>{
    el.setAttribute('placeholder', t(el.getAttribute('data-i18n-ph')));
  });
  // Title/Tooltip
  document.querySelectorAll('[data-i18n-title]').forEach(el=>{
    el.setAttribute('title', t(el.getAttribute('data-i18n-title')));
  });

  // RTL/LTR + lang
  const rtl = i18n.lang === 'ar';
  document.documentElement.lang = i18n.lang;
  document.documentElement.dir  = rtl ? 'rtl' : 'ltr';

  // زر اللغه
  const btn = document.getElementById('btnLang');
  if (btn) btn.textContent = i18n.lang === 'ar' ? 'EN' : 'AR';
}

function setLang(lang){
  i18n.lang = lang; localStorage.setItem('lang', lang); applyI18n();
}
function switchLang(){ setLang(i18n.lang === 'ar' ? 'en' : 'ar'); }

/* زر تبديل الثيم يظهر في النافبار */
function injectNavbar(active){
  const bar = document.createElement('div');
  bar.className = 'navbar';
  bar.innerHTML = `
    <div class="navbar-inner">
      <div class="brand">
        <img src="./assets/app_icon/LUXBYTE.png" alt="LUXBYTE Logo" class="brand-logo" 
             style="height: 45px; width: auto; margin-right: 12px; object-fit: contain; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.15);"
             onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
        <div class="brand-fallback" style="display: none; width: 45px; height: 45px; background: linear-gradient(135deg, #10b981, #059669); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 18px; margin-right: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.15);">L</div>
        <span>LUXBYTE</span>
      </div>
      <nav class="nav-links">
        <a class="nav-btn ${active==='home'?'nav-primary':''}" href="index.html" data-i18n="nav.home">الرئيسية</a>
        <a class="nav-btn ${active==='platform'?'nav-primary':''}" href="choose-platform.html" data-i18n="nav.choose_platform">اختر منصتك</a>
        <a class="nav-btn ${active==='signup'?'nav-primary':''}" href="account-type-selection.html" data-i18n="nav.signup">التسجيل</a>
        <a class="nav-btn ${active==='dash'?'nav-primary':''}" href="dashboard.html" data-i18n="nav.dashboard">لوحة المراجعة</a>
        <a class="nav-btn" href="social.html" data-i18n="nav.contact">التواصل</a>
        <a class="nav-btn" href="auth.html" data-i18n="nav.login">تسجيل الدخول</a>
        <button class="nav-btn" id="btnLang">AR</button>
        <button class="nav-btn" id="btnTheme" title="Toggle theme">🌓</button>
      </nav>
    </div>`;
  document.body.prepend(bar);

  document.getElementById('btnTheme')?.addEventListener('click', toggleTheme);
  document.getElementById('btnLang')?.addEventListener('click', switchLang);
}

// ====== Initialize Enhanced Features ======
document.addEventListener('DOMContentLoaded', () => {
  initParallax();
  initLogoGlow();

  // Add floating animation to cards
  const cards = document.querySelectorAll('.card');
  cards.forEach((card, index) => {
    if (index % 3 === 0) {
      card.classList.add('float');
    }
  });

  // Load saved theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) themeIcon.className = 'fas fa-sun';
  }

  // Apply i18n
  applyI18n();
});
