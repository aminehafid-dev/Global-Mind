import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Primary1() {
  const { t } = useTranslation();

  return (
    <main>
      <section
        className="section"
        style={{
          backgroundColor: 'var(--primary-light)',
          color: 'white',
          textAlign: 'center',
          padding: '3rem 1rem'
        }}
      >
        <div className="container">
          <h1 style={{ color: 'white', fontSize: '3rem' }} data-i18n="primary1.hero_title">
            {t('primary1.hero_title')}
          </h1>
          <p style={{ fontSize: '1.5rem' }} data-i18n="primary1.hero_subtitle">
            {t('primary1.hero_subtitle')}
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: 'var(--spacing-lg)',
              marginTop: 'var(--spacing-lg)'
            }}
          >
            <Link to="/arabic_p1.html" className="card">
              <div className="card-icon">📚</div>
              <h3 data-i18n="subjects.arabic.title">{t('subjects.arabic.title')}</h3>
              <p data-i18n="subjects.arabic.desc">{t('subjects.arabic.desc')}</p>
            </Link>

            <Link to="/math_p1.html" className="card">
              <div className="card-icon">🔢</div>
              <h3 data-i18n="subjects.math.title">{t('subjects.math.title')}</h3>
              <p data-i18n="subjects.math.desc">{t('subjects.math.desc')}</p>
            </Link>

            <Link to="/french_p1.html" className="card">
              <div className="card-icon">🇫🇷</div>
              <h3 data-i18n="subjects.french.title">{t('subjects.french.title')}</h3>
              <p data-i18n="subjects.french.desc">{t('subjects.french.desc')}</p>
            </Link>

            <Link to="/science_p1.html" className="card">
              <div className="card-icon">🔬</div>
              <h3 data-i18n="subjects.science.title">{t('subjects.science.title')}</h3>
              <p data-i18n="subjects.science.desc">{t('subjects.science.desc')}</p>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
