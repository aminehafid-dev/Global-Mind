import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ar from './ar.json';
import en from './en.json';

const savedLang = localStorage.getItem('preferredLang') || 'ar';
const initialLang = savedLang === 'en' ? 'en' : 'ar';

export const updateDocumentDirection = (lang) => {
  const safeLang = lang === 'en' ? 'en' : 'ar';
  document.documentElement.lang = safeLang;
  document.documentElement.dir = safeLang === 'ar' ? 'rtl' : 'ltr';
};

// Set initial document attributes
updateDocumentDirection(initialLang);

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ar: { translation: ar },
      en: { translation: en }
    },
    lng: initialLang,
    fallbackLng: 'ar',
    interpolation: {
      escapeValue: false // React already escapes values
    }
  });

i18n.on('languageChanged', (lng) => {
  localStorage.setItem('preferredLang', lng);
  updateDocumentDirection(lng);
  window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: lng } }));
});

export default i18n;
