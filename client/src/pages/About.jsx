import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

export default function About() {
  const { t } = useTranslation();

  return (
    <main>
      <section className="section">
        <div className="container" style={{ maxWidth: '850px' }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ textAlign: 'center' }}
          >
            <span style={{ fontSize: '3rem', display: 'inline-block', marginBottom: '0.5rem' }}>🌱</span>
            <h1
              style={{ fontSize: '3rem', marginBottom: '2rem' }}
              data-i18n="about.title"
            >
              {t('about.title')}
            </h1>
          </motion.div>

          <motion.div
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{ textAlign: 'start', alignItems: 'stretch', boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}
          >
            <h2 style={{ color: 'var(--accent-orange)' }} data-i18n="about.vision_title">
              🌟 {t('about.vision_title')}
            </h2>
            <p style={{ fontSize: '1.2rem', lineHeight: '1.8' }} data-i18n="about.vision_desc">
              {t('about.vision_desc')}
            </p>

            <h2 style={{ color: 'var(--accent-green)', marginTop: '2rem' }} data-i18n="about.mission_title">
              🎯 {t('about.mission_title')}
            </h2>
            <p style={{ fontSize: '1.2rem', lineHeight: '1.8' }} data-i18n="about.mission_desc">
              {t('about.mission_desc')}
            </p>

            <h2 style={{ color: 'var(--primary-color)', marginTop: '2rem' }} data-i18n="about.method_title">
              💡 {t('about.method_title')}
            </h2>
            <ul style={{ listStyleType: 'disc', paddingInlineStart: '2rem', fontSize: '1.15rem', lineHeight: '2' }}>
              <li data-i18n="about.method_1">{t('about.method_1')}</li>
              <li data-i18n="about.method_2">{t('about.method_2')}</li>
              <li data-i18n="about.method_3">{t('about.method_3')}</li>
              <li data-i18n="about.method_4">{t('about.method_4')}</li>
            </ul>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
