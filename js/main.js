// =========================================
// Main JavaScript - Navigation & i18n
// École Esprit Global (مدرسة العقل العالمي)
// Interface Languages: Arabic (Default, RTL) & English (LTR)
// =========================================

// Embedded translations dictionary (fast load + offline/file:// safe)
const I18N_DATA = {
  ar: {
    site: {
      name: "مدرسة العقل العالمي",
      tagline: "تعليم حديث يجمع بين الأصالة والمعاصرة."
    },
    nav: {
      home: "الرئيسية",
      about: "من نحن",
      primary1: "المستوى الأول",
      contact: "اتصل بنا",
      lang_ar: "العربية",
      lang_en: "English"
    },
    home: {
      hero_title: "مرحباً بك في مدرسة العقل العالمي!",
      hero_subtitle: "منصة تعليمية ممتعة وملونة لأبطال السنة الأولى ابتدائي.",
      hero_cta: "ابدأ التعلم الآن 🚀",
      subjects_title: "مواد المستوى الأول"
    },
    primary1: {
      hero_title: "المستوى الأول",
      hero_subtitle: "اختر المادة التي تريد تعلمها اليوم"
    },
    subjects: {
      arabic: {
        title: "اللغة العربية",
        desc: "تعلم الحروف والكلمات"
      },
      math: {
        title: "الرياضيات",
        desc: "الأرقام والأشكال"
      },
      french: {
        title: "اللغة الفرنسية",
        desc: "Vocabulaire & Lettres"
      },
      science: {
        title: "النشاط العلمي",
        desc: "الحواس وجسم الإنسان"
      }
    },
    about: {
      title: "من نحن",
      vision_title: "رؤيتنا",
      vision_desc: "نسعى في \"مدرسة العقل العالمي\" إلى تقديم تعليم حديث يجمع بين الأصالة والمعاصرة، لتنشئة جيل واثق ومبدع.",
      mission_title: "مهمتنا",
      mission_desc: "توفير منصة تعليمية تفاعلية آمنة للأطفال، خالية من الإعلانات، وبدون جمع بيانات شخصية. نركز على التعلم من خلال اللعب والاستكشاف.",
      method_title: "طريقتنا التعليمية",
      method_1: "دروس ملونة وجذابة تناسب الأطفال من عمر 6 إلى 8 سنوات.",
      method_2: "فيديوهات قصيرة تشرح المفاهيم بطريقة مبسطة ومسلية.",
      method_3: "تمارين تفاعلية تعزز الفهم من خلال التعلم الذاتي.",
      method_4: "نظام مكافآت لتشجيع الطفل وزيادة دافعيته للتعلم."
    },
    contact: {
      title: "اتصل بنا",
      subtitle: "يسعدنا تواصلكم معنا لأي استفسار أو اقتراح.",
      name_label: "الاسم الكامل:",
      email_label: "البريد الإلكتروني:",
      message_label: "الرسالة:",
      submit_btn: "إرسال الرسالة",
      success_msg: "شكراً لتواصلك معنا! سنرد عليك قريباً."
    },
    legal: {
      title: "الخصوصية والشروط",
      privacy_title: "سياسة الخصوصية",
      privacy_desc: "نحن لا نجمع أي بيانات شخصية من الأطفال. يتم حفظ التقدم في التمارين في متصفحك محلياً فقط (localStorage)."
    },
    exercises: {
      loading: "جاري تحميل الدروس...",
      not_found: "لم يتم العثور على دروس لهذه المادة.",
      error_loading: "خطأ في تحميل البيانات.",
      start_lesson: "ابدأ الدرس",
      back: "⬅ عودة",
      download_original: "📥 تحميل الدرس الأصلي",
      question: "السؤال",
      correct_msg: "إجابة صحيحة! أحسنت!",
      wrong_msg: "حاول مرة أخرى!",
      bravo: "🎉 أحسنت!",
      score: "نتيجتك:",
      restart: "🔄 إعادة المحاولة",
      all_lessons: "📚 قائمة الدروس",
      listen: "🔊 استمع"
    },
    footer: {
      desc: "تعليم حديث يجمع بين الأصالة والمعاصرة.",
      quick_links: "روابط سريعة",
      legal: "سياسة الخصوصية",
      rights: "جميع الحقوق محفوظة."
    }
  },
  en: {
    site: {
      name: "Global Mind School",
      tagline: "Modern education combining tradition and innovation."
    },
    nav: {
      home: "Home",
      about: "About Us",
      primary1: "Grade 1",
      contact: "Contact",
      lang_ar: "العربية",
      lang_en: "English"
    },
    home: {
      hero_title: "Welcome to Global Mind School!",
      hero_subtitle: "A fun and colourful learning platform for Grade 1 champions.",
      hero_cta: "Start Learning Now 🚀",
      subjects_title: "Grade 1 Subjects"
    },
    primary1: {
      hero_title: "Grade 1",
      hero_subtitle: "Choose the subject you want to learn today"
    },
    subjects: {
      arabic: {
        title: "Arabic",
        desc: "Letters, words & reading"
      },
      math: {
        title: "Maths",
        desc: "Numbers, counting & shapes"
      },
      french: {
        title: "French",
        desc: "Vocabulaire & Lettres"
      },
      science: {
        title: "Science",
        desc: "The 5 senses & human body"
      }
    },
    about: {
      title: "About Us",
      vision_title: "Our Vision",
      vision_desc: "At Global Mind School, we provide modern education that bridges authenticity and innovation, inspiring confident and creative young learners.",
      mission_title: "Our Mission",
      mission_desc: "Providing a safe, interactive educational platform for children, completely ad-free and without personal data collection. We focus on learning through play.",
      method_title: "Our Educational Method",
      method_1: "Colourful and engaging lessons designed specifically for kids aged 6 to 8.",
      method_2: "Short educational videos explaining key concepts simply and enjoyably.",
      method_3: "Interactive exercises reinforcing learning through self-guided practice.",
      method_4: "A fun star-reward system encouraging motivation and curiosity."
    },
    contact: {
      title: "Contact Us",
      subtitle: "We are glad to connect with parents and educators for any question or suggestion.",
      name_label: "Full Name:",
      email_label: "Email Address:",
      message_label: "Message:",
      submit_btn: "Send Message",
      success_msg: "Thank you for reaching out! We will reply soon."
    },
    legal: {
      title: "Privacy & Legal Notice",
      privacy_title: "Privacy Policy",
      privacy_desc: "We do not collect any personal data from children. Exercise progress is saved solely on your local device (localStorage)."
    },
    exercises: {
      loading: "Loading lessons...",
      not_found: "No lessons found for this subject.",
      error_loading: "Error loading data.",
      start_lesson: "Start Lesson",
      back: "⬅ Back",
      download_original: "📥 Download original lesson",
      question: "Question",
      correct_msg: "Great job! Correct answer!",
      wrong_msg: "Try again!",
      bravo: "🎉 Well done!",
      score: "Your score:",
      restart: "🔄 Try Again",
      all_lessons: "📚 All Lessons",
      listen: "🔊 Listen"
    },
    footer: {
      desc: "Modern education combining tradition and innovation.",
      quick_links: "Quick Links",
      legal: "Privacy Policy",
      rights: "All rights reserved."
    }
  }
};

// Helper: resolve nested keys like 'nav.home'
function getNestedValue(obj, keyPath) {
  if (!obj || !keyPath) return null;
  return keyPath.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : null), obj);
}

// Current active language (default 'ar')
window.currentLang = localStorage.getItem('preferredLang') || 'ar';

// Apply translations to DOM
window.applyLanguage = function(lang) {
  if (lang !== 'ar' && lang !== 'en') lang = 'ar';
  window.currentLang = lang;
  
  // Set html attributes
  document.documentElement.lang = lang;
  document.documentElement.dir = (lang === 'ar' ? 'rtl' : 'ltr');
  
  const dict = I18N_DATA[lang] || I18N_DATA.ar;
  
  // Update all [data-i18n]
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = getNestedValue(dict, key);
    if (val !== null) {
      el.textContent = val;
    }
  });

  // Update all [data-i18n-placeholder]
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    const val = getNestedValue(dict, key);
    if (val !== null) {
      el.setAttribute('placeholder', val);
    }
  });

  // Update active state on language switcher buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    const btnLang = btn.getAttribute('data-lang');
    if (btnLang === lang) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Notify listeners (such as exercises engine)
  window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
};

// User-triggered language switch (persists to localStorage)
window.setLanguage = function(lang) {
  localStorage.setItem('preferredLang', lang);
  window.applyLanguage(lang);
};

// Initialization on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('show');
      menuToggle.innerHTML = navLinks.classList.contains('show') ? '✕' : '☰';
    });
  }

  // 2. Active Link Highlight
  const currentPath = window.location.pathname.split('/').pop();
  const links = document.querySelectorAll('.nav-link');
  links.forEach(link => {
    const linkPath = link.getAttribute('href');
    const isHome = currentPath === '' || currentPath === 'index.html';
    if (currentPath === linkPath || (isHome && linkPath === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // 3. Language switcher buttons click listener
  document.querySelectorAll('.lang-btn[data-lang]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetLang = btn.getAttribute('data-lang');
      window.setLanguage(targetLang);
    });
  });

  // 4. Try fetching latest i18n JSON files in background, then apply
  const preferred = localStorage.getItem('preferredLang') || 'ar';
  fetch(`i18n/${preferred}.json`)
    .then(res => res.json())
    .then(data => {
      if (data && I18N_DATA[preferred]) {
        I18N_DATA[preferred] = Object.assign(I18N_DATA[preferred], data);
      }
      window.applyLanguage(preferred);
    })
    .catch(() => {
      // Fallback to embedded dictionary
      window.applyLanguage(preferred);
    });
});
