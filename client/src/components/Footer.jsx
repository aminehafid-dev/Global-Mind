import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Footer({ full }) {
  const { t } = useTranslation();
  const location = useLocation();

  const isHome = location.pathname === '/' || location.pathname === '/index.html' || location.pathname === '';
  const showFull = full !== undefined ? full : isHome;

  return (
    <footer className="site-footer">
      <div className="container footer-container">
        <div className="footer-col">
          <h3 data-i18n="site.name">{t('site.name')}</h3>
          <p data-i18n="footer.desc">{t('footer.desc')}</p>
        </div>
        {showFull && (
          <div className="footer-col">
            <h3 data-i18n="footer.quick_links">{t('footer.quick_links')}</h3>
            <ul className="footer-links">
              <li>
                <Link to="/primary1.html" data-i18n="nav.primary1">
                  {t('nav.primary1')}
                </Link>
              </li>
              <li>
                <Link to="/about.html" data-i18n="nav.about">
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link to="/contact.html" data-i18n="nav.contact">
                  {t('nav.contact')}
                </Link>
              </li>
              <li>
                <Link to="/legal.html" data-i18n="footer.legal">
                  {t('footer.legal')}
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </footer>
  );
}
