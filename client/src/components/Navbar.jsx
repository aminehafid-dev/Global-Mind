import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  const currentLang = i18n.language === 'en' ? 'en' : 'ar';

  const toggleMenu = () => {
    setIsOpen(prev => !prev);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const switchLanguage = (lang) => {
    i18n.changeLanguage(lang);
    closeMenu();
  };

  // Determine active link
  const isHome = currentPath === '/' || currentPath === '/index.html' || currentPath === '';
  const isAbout = currentPath === '/about.html' || currentPath === '/about';
  const isPrimary1 = (
    currentPath === '/primary1.html' || currentPath === '/primary1' ||
    currentPath === '/arabic_p1.html' || currentPath === '/arabic_p1' ||
    currentPath === '/math_p1.html' || currentPath === '/math_p1' ||
    currentPath === '/french_p1.html' || currentPath === '/french_p1' ||
    currentPath === '/science_p1.html' || currentPath === '/science_p1'
  );
  const isContact = currentPath === '/contact.html' || currentPath === '/contact';

  return (
    <header className="site-header">
      <div className="container header-container">
        <Link to="/" className="logo" onClick={closeMenu}>
          <span style={{ fontSize: '2rem' }}>🎓</span>
          <span data-i18n="site.name">{t('site.name')}</span>
        </Link>

        <button
          className="menu-toggle"
          id="menuToggle"
          aria-label="Ouvrir le menu"
          onClick={toggleMenu}
        >
          {isOpen ? '✕' : '☰'}
        </button>

        <nav className={`nav-links ${isOpen ? 'show' : ''}`} id="navLinks">
          <Link
            to="/index.html"
            className={`nav-link ${isHome ? 'active' : ''}`}
            data-i18n="nav.home"
            onClick={closeMenu}
          >
            {t('nav.home')}
          </Link>
          <Link
            to="/about.html"
            className={`nav-link ${isAbout ? 'active' : ''}`}
            data-i18n="nav.about"
            onClick={closeMenu}
          >
            {t('nav.about')}
          </Link>
          <Link
            to="/primary1.html"
            className={`nav-link ${isPrimary1 ? 'active' : ''}`}
            data-i18n="nav.primary1"
            onClick={closeMenu}
          >
            {t('nav.primary1')}
          </Link>
          <Link
            to="/contact.html"
            className={`nav-link ${isContact ? 'active' : ''}`}
            data-i18n="nav.contact"
            onClick={closeMenu}
          >
            {t('nav.contact')}
          </Link>

          <div className="lang-switch">
            <button
              type="button"
              className={`lang-btn ${currentLang === 'ar' ? 'active' : ''}`}
              data-lang="ar"
              data-i18n="nav.lang_ar"
              onClick={() => switchLanguage('ar')}
            >
              {t('nav.lang_ar')}
            </button>
            <button
              type="button"
              className={`lang-btn ${currentLang === 'en' ? 'active' : ''}`}
              data-lang="en"
              data-i18n="nav.lang_en"
              onClick={() => switchLanguage('en')}
            >
              {t('nav.lang_en')}
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
