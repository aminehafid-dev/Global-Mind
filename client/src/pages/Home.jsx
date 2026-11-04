import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t } = useTranslation();

  return (
    <main>
      <section
        className="section hero"
        style={{
          textAlign: 'center',
          backgroundColor: 'var(--primary-light)',
          color: 'white',
          padding: '4rem 1rem'
        }}
      >
        <div className="container">
          <h1 style={{ color: 'white', fontSize: '3rem' }} data-i18n="home.hero_title">
            {t('home.hero_title')}
          </h1>
          <p
            style={{
              fontSize: '1.5rem',
              maxWidth: '800px',
              margin: '0 auto 2rem'
            }}
            data-i18n="home.hero_subtitle"
          >
            {t('home.hero_subtitle')}
          </p>
          <Link to="/primary1.html" className="btn btn-accent" data-i18n="home.hero_cta">
            {t('home.hero_cta')}
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 style={{ textAlign: 'center' }} data-i18n="home.subjects_title">
            {t('home.subjects_title')}
          </h2>
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
