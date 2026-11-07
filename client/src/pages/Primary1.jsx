import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

export default function Primary1() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 260, damping: 20 }
    }
  };

  const subjects = [
    {
      to: '/arabic_p1.html',
      icon: '📚',
      titleKey: 'subjects.arabic.title',
      descKey: 'subjects.arabic.desc',
      accentColor: '#00a651'
    },
    {
      to: '/math_p1.html',
      icon: '🔢',
      titleKey: 'subjects.math.title',
      descKey: 'subjects.math.desc',
      accentColor: '#004a99'
    },
    {
      to: '/french_p1.html',
      icon: '🇫🇷',
      titleKey: 'subjects.french.title',
      descKey: 'subjects.french.desc',
      accentColor: '#f26522'
    },
    {
      to: '/science_p1.html',
      icon: '🔬',
      titleKey: 'subjects.science.title',
      descKey: 'subjects.science.desc',
      accentColor: '#7b1fa2'
    }
  ];

  return (
    <main>
      <section
        className="section"
        style={{
          backgroundColor: 'var(--primary-light)',
          color: 'white',
          textAlign: 'center',
          padding: '3.5rem 1rem'
        }}
      >
        <div className="container">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ color: 'white', fontSize: '3rem', fontWeight: 800 }}
            data-i18n="primary1.hero_title"
          >
            {t('primary1.hero_title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{ fontSize: '1.4rem', maxWidth: '700px', margin: '0 auto' }}
            data-i18n="primary1.hero_subtitle"
          >
            {t('primary1.hero_subtitle')}
          </motion.p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: 'var(--spacing-lg)',
              marginTop: 'var(--spacing-lg)'
            }}
          >
            {subjects.map((sub) => (
              <motion.div
                key={sub.to}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 300, damping: 18 }}
              >
                <Link
                  to={sub.to}
                  className="card"
                  style={{
                    height: '100%',
                    borderTop: `6px solid ${sub.accentColor}`,
                    textDecoration: 'none'
                  }}
                >
                  <motion.div
                    className="card-icon"
                    whileHover={{ scale: 1.25, rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.4 }}
                  >
                    {sub.icon}
                  </motion.div>
                  <h3 data-i18n={sub.titleKey}>{t(sub.titleKey)}</h3>
                  <p data-i18n={sub.descKey}>{t(sub.descKey)}</p>
                  <span
                    className="btn btn-primary"
                    style={{
                      marginTop: 'auto',
                      padding: '8px 20px',
                      fontSize: '1rem',
                      backgroundColor: sub.accentColor
                    }}
                  >
                    {isAr ? 'ابدأ التعلم ←' : 'Start Lesson →'}
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </main>
  );
}
