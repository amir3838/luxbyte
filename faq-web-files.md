# assets/bot_faq.json

```json
{
  "faqs": [
    {
      "id": "1",
      "question": "كيف يمكنني تسجيل حساب جديد؟",
      "answer": "يمكنك تسجيل حساب جديد عن طريق اختيار نوع النشاط (شوب إي جي أو ماستر درايفر)، ثم ملء البيانات المطلوبة ورفع المستندات اللازمة.",
      "category": "registration",
      "keywords": ["تسجيل", "حساب", "جديد"]
    },
    {
      "id": "2", 
      "question": "ما هي المستندات المطلوبة للتسجيل؟",
      "answer": "المستندات المطلوبة تختلف حسب نوع النشاط:\n• الصيدلية: الرقم القومي، رخصة الصيدلية، السجل التجاري، البطاقة الضريبية\n• السوبرماركت: الرقم القومي، السجل التجاري، البطاقة الضريبية\n• المطعم: الرقم القومي، السجل التجاري، الشهادة الصحية، البطاقة الضريبية\n• السائق: الرقم القومي، رخصة القيادة، رخصة السيارة",
      "category": "documents",
      "keywords": ["مستندات", "وثائق", "مطلوبة"]
    },
    {
      "id": "3",
      "question": "كم تستغرق مراجعة الطلب؟", 
      "answer": "مراجعة طلبك تستغرق عادة من 24 إلى 48 ساعة عمل. ستتلقى إشعار عبر البريد الإلكتروني عند الانتهاء من المراجعة.",
      "category": "verification",
      "keywords": ["مراجعة", "موافقة", "وقت", "مدة"]
    },
    {
      "id": "4",
      "question": "كيف يمكنني تغيير نوع النشاط؟",
      "answer": "لتغيير نوع النشاط، يرجى التواصل مع فريق الدعم عبر الواتساب أو الاتصال المباشر. سيتطلب ذلك إعادة رفع المستندات المناسبة للنشاط الجديد.",
      "category": "account",
      "keywords": ["تغيير", "نشاط", "نوع"]
    },
    {
      "id": "5",
      "question": "ما هو الفرق بين شوب إي جي وماستر درايفر؟",
      "answer": "شوب إي جي: منصة شاملة للتجار (صيدليات، سوبرماركت، مطاعم، عيادات) ومندوبي التوصيل\n\nماستر درايفر: منصة نقل الركاب مثل أوبر للسائقين الذين يمتلكون سيارات",
      "category": "general",
      "keywords": ["شوب اي جي", "ماستر درايفر", "فرق"]
    },
    {
      "id": "6",
      "question": "كيف يمكنني استعادة كلمة المرور؟",
      "answer": "يمكنك استعادة كلمة المرور من شاشة تسجيل الدخول عن طريق النقر على \"نسيت كلمة المرور؟\" وإدخال بريدك الإلكتروني.",
      "category": "account",
      "keywords": ["كلمة المرور", "استعادة", "نسيت"]
    },
    {
      "id": "7",
      "question": "كيف يمكنني التواصل مع الدعم؟",
      "answer": "يمكنك التواصل مع فريق الدعم عبر:\n• واتساب: 01148709609\n• الاتصال المباشر: 01148709609\n• البريد الإلكتروني: support@luxbyte.com",
      "category": "support", 
      "keywords": ["دعم", "تواصل", "مساعدة"]
    },
    {
      "id": "8",
      "question": "ما هي رسوم الخدمة؟",
      "answer": "رسوم الخدمة تختلف حسب نوع النشاط ومستوى الباقة المختارة. للحصول على تفاصيل الأسعار، يرجى التواصل مع فريق المبيعات.",
      "category": "pricing",
      "keywords": ["رسوم", "أسعار", "تكلفة"]
    },
    {
      "id": "9", 
      "question": "كيف يمكنني تحديث معلوماتي الشخصية؟",
      "answer": "يمكنك تحديث معلوماتك الشخصية من خلال الذهاب إلى الملف الشخصي والنقر على \"تحديث المعلومات\".",
      "category": "account",
      "keywords": ["تحديث", "معلومات", "شخصية"]
    },
    {
      "id": "10",
      "question": "هل يمكنني إلغاء حسابي؟",
      "answer": "نعم، يمكنك إلغاء حسابك عن طريق التواصل مع فريق الدعم. سيقوم الفريق بمساعدتك في إجراءات الإلغاء.",
      "category": "account", 
      "keywords": ["إلغاء", "حذف", "حساب"]
    }
  ],
  "categories": {
    "registration": "التسجيل",
    "documents": "المستندات",
    "verification": "التحقق",
    "account": "إدارة الحساب",
    "general": "عام",
    "support": "الدعم",
    "pricing": "الأسعار"
  },
  "quick_responses": [
    "مرحباً! كيف يمكنني مساعدتك؟",
    "يمكنك مراجعة الأسئلة الشائعة أو كتابة استفسارك.",
    "هل تحتاج للتواصل مع فريق الدعم؟",
    "شكراً لاستخدام LUXBYTE!"
  ]
}
```

# web/index.html

```html
<!DOCTYPE html>
<html dir="rtl">
<head>
  <!--
    If you are serving your web app in a path other than the root, change the
    href value below to reflect the base path you are serving from.

    The path provided below has to start and end with a slash "/" in order for
    it to work correctly.

    For more details:
    * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base

    This is a placeholder for base href that will be replaced by the value of
    the `--base-href` argument provided to `flutter build`.
  -->
  <base href="$FLUTTER_BASE_HREF">

  <meta charset="UTF-8">
  <meta content="IE=Edge" http-equiv="X-UA-Compatible">
  <meta name="description" content="LUXBYTE - بوابة تطبيق شوب إي جي وماستر درايفر">

  <!-- iOS meta tags & icons -->
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black">
  <meta name="apple-mobile-web-app-title" content="LUXBYTE">
  <link rel="apple-touch-icon" href="icons/Icon-192.png">

  <!-- Favicon -->
  <link rel="icon" type="image/png" href="favicon.png"/>

  <title>LUXBYTE</title>
  <link rel="manifest" href="manifest.json">

  <style>
    /* Loading Animation */
    body {
      margin: 0;
      padding: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      font-family: 'Arial', sans-serif;
      direction: rtl;
    }

    .loading-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      z-index: 9999;
    }

    .logo-container {
      width: 120px;
      height: 120px;
      background: white;
      border-radius: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 30px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      animation: pulse 2s infinite;
    }

    .logo {
      width: 80px;
      height: 80px;
      background: url('icons/Icon-192.png') center/contain no-repeat;
    }

    .app-title {
      color: white;
      font-size: 32px;
      font-weight: bold;
      margin-bottom: 10px;
      letter-spacing: 2px;
    }

    .app-subtitle {
      color: rgba(255, 255, 255, 0.8);
      font-size: 16px;
      margin-bottom: 30px;
      text-align: center;
      max-width: 300px;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid rgba(255, 255, 255, 0.3);
      border-top: 4px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 20px;
    }

    .loading-text {
      color: rgba(255, 255, 255, 0.8);
      font-size: 14px;
      margin-bottom: 50px;
    }

    .company-info {
      color: rgba(255, 255, 255, 0.6);
      font-size: 12px;
      position: absolute;
      bottom: 30px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }

    /* Hide loading when Flutter is ready */
    flt-glass-pane {
      display: none !important;
    }
  </style>
</head>
<body>
  <!-- Loading Screen -->
  <div class="loading-container" id="loading">
    <div class="logo-container">
      <div class="logo"></div>
    </div>
    <div class="app-title">LUXBYTE</div>
    <div class="app-subtitle">بوابة تطبيق شوب إي جي وماستر درايفر</div>
    <div class="spinner"></div>
    <div class="loading-text">جاري التحميل...</div>
    <div class="company-info">تطوير شركة لوكس بايت المحدودة المسئولية</div>
  </div>

  <!-- Flutter App Container -->
  <div id="flutter-app"></div>

  <script>
    window.addEventListener('flutter-first-frame', function () {
      const loading = document.getElementById('loading');
      if (loading) {
        loading.style.display = 'none';
      }
    });

    // Hide loading after 5 seconds as fallback
    setTimeout(() => {
      const loading = document.getElementById('loading');
      if (loading) {
        loading.style.opacity = '0';
        setTimeout(() => {
          loading.style.display = 'none';
        }, 500);
      }
    }, 5000);
  </script>

  <script>
    var serviceWorkerVersion = null;
    var scriptLoaded = false;
    function loadMainDartJs() {
      if (scriptLoaded) {
        return;
      }
      scriptLoaded = true;
      var scriptTag = document.createElement('script');
      scriptTag.src = 'main.dart.js';
      scriptTag.type = 'application/javascript';
      document.body.append(scriptTag);
    }

    if ('serviceWorker' in navigator) {
      // Service workers are supported. Use them.
      window.addEventListener('load', function () {
        // Wait for registration to finish before dropping the <script> tag.
        // Otherwise, the browser will load the script multiple times,
        // potentially different versions.
        var serviceWorkerUrl = 'flutter_service_worker.js?v=' + serviceWorkerVersion;
        navigator.serviceWorker.register(serviceWorkerUrl)
          .then((reg) => {
            function waitForActivation(serviceWorker) {
              serviceWorker.addEventListener('statechange', () => {
                if (serviceWorker.state == 'activated') {
                  console.log('Installed new service worker.');
                  loadMainDartJs();
                }
              });
            }
            if (!reg.active && (reg.installing || reg.waiting)) {
              // No active web worker and we have installed or are installing
              // one for the first time. Simply wait for it to activate.
              waitForActivation(reg.installing || reg.waiting);
            } else if (!reg.active.scriptURL.endsWith(serviceWorkerVersion)) {
              // When the app updates the serviceWorkerVersion changes, so we
              // need to ask the service worker to update.
              console.log('New service worker available.');
              reg.update();
              waitForActivation(reg.installing);
            } else {
              // Existing service worker is still good.
              console.log('Loading app from service worker.');
              loadMainDartJs();
            }
          });

        // If service worker doesn't succeed in a reasonable amount of time,
        // fallback to plain <script> tag.
        setTimeout(() => {
          if (!scriptLoaded) {
            console.warn(
              'Failed to load app from service worker. Falling back to plain <script> tag.',
            );
            loadMainDartJs();
          }
        }, 4000);
      });
    } else {
      // Service workers not supported. Just drop the <script> tag.
      loadMainDartJs();
    }
  </script>
</body>
</html>
```