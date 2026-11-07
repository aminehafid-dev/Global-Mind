import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import TrophyModal from './TrophyModal';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isTrophyOpen, setIsTrophyOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  const currentLang = i18n.language === 'en' ? 'en' : 'ar';
  const isRtl = currentLang === 'ar';

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

  const navItems = [
    { to: '/index.html', label: t('nav.home'), active: isHome, key: 'nav.home' },
    { to: '/about.html', label: t('nav.about'), active: isAbout, key: 'nav.about' },
    { to: '/primary1.html', label: t('nav.primary1'), active: isPrimary1, key: 'nav.primary1' },
    { to: '/contact.html', label: t('nav.contact'), active: isContact, key: 'nav.contact' }
  ];

  return (
    <>
      <header className="site-header">
        <div className="container header-container">
          <Link to="/" className="logo" onClick={closeMenu}>
            <motion.span
              whileHover={{ rotate: [0, -10, 10, -5, 5, 0], scale: 1.15 }}
              transition={{ duration: 0.5 }}
              style={{ fontSize: '2.2rem', display: 'inline-block' }}
            >
              🎓
            </motion.span>
            <span data-i18n="site.name">{t('site.name')}</span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            {/* Desktop Trophy button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsTrophyOpen(true)}
              className="trophy-btn"
              title={isRtl ? 'لوحة الإنجازات' : 'Achievements'}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'linear-gradient(135deg, #fff3e0, #ffe0b2)',
                border: '1px solid #ffb74d',
                padding: '6px 14px',
                borderRadius: 'var(--radius-pill)',
                cursor: 'pointer',
                fontWeight: 'bold',
                color: '#e65100',
                fontSize: '0.95rem'
              }}
            >
              <span>🏆</span>
              <span>{isRtl ? 'الإنجازات' : 'Trophy'}</span>
            </motion.button>

            {/* Mobile menu toggle */}
            <button
              className="menu-toggle"
              id="menuToggle"
              aria-label="Menu"
              onClick={toggleMenu}
            >
              {isOpen ? '✕' : '☰'}
            </button>
          </div>

          <nav className={`nav-links ${isOpen ? 'show' : ''}`} id="navLinks">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`nav-link ${item.active ? 'active' : ''}`}
                data-i18n={item.key}
                onClick={closeMenu}
              >
                {item.label}
              </Link>
            ))}

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

      {/* Trophy Modal */}
      <TrophyModal isOpen={isTrophyOpen} onClose={() => setIsTrophyOpen(false)} />
    </>
  );
}
