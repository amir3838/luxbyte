/**
 * LUXBYTE UX Effects
 * تأثيرات تجربة المستخدم لـ LUXBYTE
 *
 * تأثيرات تفاعلية للبطاقات والعناصر
 */

class UXEffectsManager {
  constructor() {
    this.cards = [];
    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    this.init();
  }

  init() {
    if (this.isReducedMotion) {
      console.log('🚫 تم تعطيل التأثيرات المتقدمة (prefers-reduced-motion)');
      return;
    }

    this.setupCards();
    this.setupScrollAnimations();
    this.setupHoverEffects();
    this.setupClickEffects();
    this.setupLoadingStates();

    console.log('✨ تم تحميل تأثيرات UX');
  }

  setupCards() {
    this.cards = document.querySelectorAll('.lx-card');

    if (this.cards.length === 0) {
      console.log('⚠️ لم يتم العثور على بطاقات .lx-card');
      return;
    }

    // إضافة تأثيرات مختلفة حسب نوع الجهاز
    if (this.isTouchDevice) {
      this.setupTouchEffects();
    } else {
      this.setupDesktopEffects();
    }

    // إضافة تأثيرات الرسوم المتحركة
    this.setupCardAnimations();
  }

  setupDesktopEffects() {
    this.cards.forEach((card, index) => {
      // تأثير الميل (Tilt)
      this.addTiltEffect(card);

      // تأثير التمرير (Parallax)
      this.addParallaxEffect(card, index);

      // تأثير الإضاءة
      this.addGlowEffect(card);
    });
  }

  setupTouchEffects() {
    this.cards.forEach((card, index) => {
      // تأثيرات اللمس البسيطة
      this.addTouchFeedback(card);

      // تأثير التمرير
      this.addSwipeEffect(card);
    });
  }

  addTiltEffect(card) {
    let isHovering = false;
    let animationFrame = null;

    const handleMouseMove = (e) => {
      if (!isHovering) return;

      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      const rotateX = (mouseY / rect.height) * 4; // Max 4 degrees
      const rotateY = (mouseX / rect.width) * -4; // Max 4 degrees

      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }

      animationFrame = requestAnimationFrame(() => {
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) scale(1.01)`;
        card.style.boxShadow = 'var(--card-shadow-hover)';
      });
    };

    const handleMouseLeave = () => {
      isHovering = false;

      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }

      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)';
      card.style.boxShadow = 'var(--card-shadow)';
    };

    const handleMouseEnter = () => {
      isHovering = true;
    };

    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);
  }

  addParallaxEffect(card, index) {
    const speed = 0.5 + (index * 0.1); // سرعة مختلفة لكل بطاقة

    const handleScroll = () => {
      const rect = card.getBoundingClientRect();
      const scrolled = window.pageYOffset;
      const rate = scrolled * -speed;

      card.style.transform = `translateY(${rate}px)`;
    };

    window.addEventListener('scroll', this.throttle(handleScroll, 16));
  }

  addGlowEffect(card) {
    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const deltaX = (x - centerX) / centerX;
      const deltaY = (y - centerY) / centerY;

      const glowX = deltaX * 20;
      const glowY = deltaY * 20;

      card.style.boxShadow = `
        var(--card-shadow-hover),
        ${glowX}px ${glowY}px 30px rgba(216, 30, 30, 0.3)
      `;
    };

    const handleMouseLeave = () => {
      card.style.boxShadow = 'var(--card-shadow)';
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);
  }

  addTouchFeedback(card) {
    const handleTouchStart = () => {
      card.style.transform = 'scale(0.98)';
      card.style.transition = 'transform 0.1s ease';
    };

    const handleTouchEnd = () => {
      card.style.transform = 'scale(1)';
      setTimeout(() => {
        card.style.transition = '';
      }, 100);
    };

    card.addEventListener('touchstart', handleTouchStart);
    card.addEventListener('touchend', handleTouchEnd);
    card.addEventListener('touchcancel', handleTouchEnd);
  }

  addSwipeEffect(card) {
    let startX = 0;
    let startY = 0;
    let isSwipe = false;

    const handleTouchStart = (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isSwipe = false;
    };

    const handleTouchMove = (e) => {
      if (!startX || !startY) return;

      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;

      const diffX = startX - currentX;
      const diffY = startY - currentY;

      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        isSwipe = true;
        card.style.transform = `translateX(${-diffX * 0.1}px)`;
      }
    };

    const handleTouchEnd = () => {
      if (isSwipe) {
        card.style.transform = 'translateX(0)';
        card.style.transition = 'transform 0.3s ease';
        setTimeout(() => {
          card.style.transition = '';
        }, 300);
      }

      startX = 0;
      startY = 0;
      isSwipe = false;
    };

    card.addEventListener('touchstart', handleTouchStart);
    card.addEventListener('touchmove', handleTouchMove);
    card.addEventListener('touchend', handleTouchEnd);
  }

  setupCardAnimations() {
    // إضافة تأثيرات الرسوم المتحركة عند الظهور
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('reveal');
          }, index * 100);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    this.cards.forEach(card => {
      observer.observe(card);
    });
  }

  setupScrollAnimations() {
    // تأثيرات التمرير للعناصر الأخرى
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    }, {
      threshold: 0.1
    });

    animatedElements.forEach(element => {
      observer.observe(element);
    });
  }

  setupHoverEffects() {
    // تأثيرات التمرير للأزرار
    const buttons = document.querySelectorAll('.lx-btn, .btn');

    buttons.forEach(button => {
      this.addButtonHoverEffect(button);
    });
  }

  addButtonHoverEffect(button) {
    const handleMouseEnter = () => {
      button.style.transform = 'translateY(-2px)';
      button.style.boxShadow = '0 6px 14px rgba(0, 0, 0, 0.15)';
    };

    const handleMouseLeave = () => {
      button.style.transform = 'translateY(0)';
      button.style.boxShadow = '';
    };

    button.addEventListener('mouseenter', handleMouseEnter);
    button.addEventListener('mouseleave', handleMouseLeave);
  }

  setupClickEffects() {
    // تأثيرات النقر
    const clickableElements = document.querySelectorAll('.lx-card, .lx-btn, .btn');

    clickableElements.forEach(element => {
      this.addClickEffect(element);
    });
  }

  addClickEffect(element) {
    const handleClick = (e) => {
      // إنشاء موجة تأثير
      const ripple = document.createElement('span');
      const rect = element.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
        z-index: 1000;
      `;

      element.style.position = 'relative';
      element.style.overflow = 'hidden';
      element.appendChild(ripple);

      setTimeout(() => {
        if (ripple.parentNode) {
          ripple.parentNode.removeChild(ripple);
        }
      }, 600);
    };

    element.addEventListener('click', handleClick);
  }

  setupLoadingStates() {
    // إضافة تأثيرات التحميل
    const loadingElements = document.querySelectorAll('.loading');

    loadingElements.forEach(element => {
      this.addLoadingEffect(element);
    });
  }

  addLoadingEffect(element) {
    const spinner = document.createElement('div');
    spinner.className = 'loading-spinner';
    spinner.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

    element.appendChild(spinner);
  }

  // دالة مساعدة للحد من تكرار الاستدعاءات
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // إضافة CSS للرسوم المتحركة
  addAnimationStyles() {
    if (document.getElementById('ux-effects-styles')) return;

    const style = document.createElement('style');
    style.id = 'ux-effects-styles';
    style.textContent = `
      @keyframes ripple {
        0% {
          transform: scale(0);
          opacity: 1;
        }
        100% {
          transform: scale(2);
          opacity: 0;
        }
      }

      .loading-spinner {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: var(--brand-primary);
        font-size: 1.5rem;
      }

      .animate-on-scroll {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
      }

      .animate-on-scroll.animate {
        opacity: 1;
        transform: translateY(0);
      }

      /* تحسينات للأداء */
      .lx-card {
        will-change: transform, box-shadow;
      }

      .lx-btn {
        will-change: transform;
      }

      /* تعطيل التأثيرات على الأجهزة البطيئة */
      @media (prefers-reduced-motion: reduce) {
        .lx-card,
        .lx-btn {
          will-change: auto;
        }
      }
    `;

    document.head.appendChild(style);
  }

  // تحديث البطاقات عند إضافة عناصر جديدة
  updateCards() {
    this.cards = document.querySelectorAll('.lx-card');
    this.setupCards();
  }

  // تنظيف المستمعين
  destroy() {
    this.cards.forEach(card => {
      // إزالة جميع المستمعين
      const newCard = card.cloneNode(true);
      card.parentNode.replaceChild(newCard, card);
    });
  }
}

// إنشاء مثيل مدير التأثيرات
const uxEffectsManager = new UXEffectsManager();

// إضافة الأنماط
uxEffectsManager.addAnimationStyles();

// جعل المدير متاحاً عالمياً
window.uxEffectsManager = uxEffectsManager;

// تصدير للاستخدام في الوحدات
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UXEffectsManager;
}

console.log('✨ تم تحميل مدير تأثيرات UX');