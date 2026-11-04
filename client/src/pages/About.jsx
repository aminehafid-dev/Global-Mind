import { useTranslation } from 'react-i18next';

export default function About() {
  const { t } = useTranslation();

  return (
    <main>
      <section className="section">
        <div className="container">
          <h1
            style={{ textAlign: 'center', fontSize: '3rem', marginBottom: '2rem' }}
            data-i18n="about.title"
          >
            {t('about.title')}
          </h1>

          <div className="card" style={{ textAlign: 'start', alignItems: 'stretch' }}>
            <h2 style={{ color: 'var(--accent-orange)' }} data-i18n="about.vision_title">
              {t('about.vision_title')}
            </h2>
            <p data-i18n="about.vision_desc">{t('about.vision_desc')}</p>

            <h2 style={{ color: 'var(--accent-green)', marginTop: '2rem' }} data-i18n="about.mission_title">
              {t('about.mission_title')}
            </h2>
            <p data-i18n="about.mission_desc">{t('about.mission_desc')}</p>

            <h2 style={{ color: 'var(--primary-color)', marginTop: '2rem' }} data-i18n="about.method_title">
              {t('about.method_title')}
            </h2>
            <ul style={{ listStyleType: 'disc', paddingInlineStart: '2rem' }}>
              <li data-i18n="about.method_1">{t('about.method_1')}</li>
              <li data-i18n="about.method_2">{t('about.method_2')}</li>
              <li data-i18n="about.method_3">{t('about.method_3')}</li>
              <li data-i18n="about.method_4">{t('about.method_4')}</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
