import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

export default function Home() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch('/api/stats')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setStats(data);
      })
      .catch(() => {});
  }, []);

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
      {/* Hero Section */}
      <section
        className="section hero"
        style={{
          textAlign: 'center',
          backgroundColor: 'var(--primary-light)',
          color: 'white',
          padding: '4.5rem 1rem 3.5rem',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Animated decorative floating shapes */}
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', top: '15%', left: '8%', fontSize: '2.5rem', opacity: 0.25, pointerEvents: 'none' }}
        >
          ✏️
        </motion.div>
        <motion.div
          animate={{ y: [0, 18, 0], rotate: [0, -12, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', top: '20%', right: '10%', fontSize: '2.8rem', opacity: 0.25, pointerEvents: 'none' }}
        >
          🌟
        </motion.div>
        <motion.div
          animate={{ y: [0, -12, 0], rotate: [0, 8, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', bottom: '15%', left: '15%', fontSize: '2.2rem', opacity: 0.2, pointerEvents: 'none' }}
        >
          📖
        </motion.div>

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
            style={{ display: 'inline-block', fontSize: '3.5rem', marginBottom: '0.5rem' }}
          >
            🎓
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ color: 'white', fontSize: '3rem', fontWeight: 800, marginBottom: '1rem' }}
            data-i18n="home.hero_title"
          >
            {t('home.hero_title')}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              fontSize: '1.45rem',
              maxWidth: '800px',
              margin: '0 auto 2.5rem',
              lineHeight: 1.7,
              opacity: 0.95
            }}
            data-i18n="home.hero_subtitle"
          >
            {t('home.hero_subtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link
              to="/primary1.html"
              className="btn btn-accent"
              style={{
                fontSize: '1.35rem',
                padding: '14px 36px',
                boxShadow: '0 8px 24px rgba(255, 184, 0, 0.4)'
              }}
              data-i18n="home.hero_cta"
            >
              🚀 {t('home.hero_cta')}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* SQL Platform Live Stats Banner */}
      {stats && (
        <section style={{ background: '#fff', borderBottom: '1px solid var(--gray-light)', padding: '1.2rem 0' }}>
          <div className="container">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
                textAlign: 'center'
              }}
            >
              <div>
                <span style={{ fontSize: '1.6rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                  {stats.subjectsCount || 4}
                </span>{' '}
                <span style={{ color: '#666' }}>{isAr ? 'مواد دراسية' : 'Subjects'}</span>
              </div>
              <div style={{ color: 'var(--gray-light)' }}>|</div>
              <div>
                <span style={{ fontSize: '1.6rem', fontWeight: 'bold', color: 'var(--accent-green)' }}>
                  {stats.lessonsCount || 9}
                </span>{' '}
                <span style={{ color: '#666' }}>{isAr ? 'درساً تفاعلياً' : 'Interactive Lessons'}</span>
              </div>
              <div style={{ color: 'var(--gray-light)' }}>|</div>
              <div>
                <span style={{ fontSize: '1.6rem', fontWeight: 'bold', color: 'var(--accent-orange)' }}>
                  {stats.quizzesCount || 31}
                </span>{' '}
                <span style={{ color: '#666' }}>{isAr ? 'سؤالاً وتمريناً' : 'Quiz Questions'}</span>
              </div>
              <div style={{ color: 'var(--gray-light)' }}>|</div>
              <div>
                <span style={{ fontSize: '1.6rem', fontWeight: 'bold', color: 'var(--accent-yellow)' }}>
                  ⭐ {stats.totalStarsAwarded || 12}
                </span>{' '}
                <span style={{ color: '#666' }}>{isAr ? 'نجمة مكتسبة' : 'Stars Earned'}</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Subjects Grid Section */}
      <section className="section">
        <div className="container">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{ textAlign: 'center', marginBottom: '2.5rem' }}
            data-i18n="home.subjects_title"
          >
            {t('home.subjects_title')}
          </motion.h2>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: 'var(--spacing-lg)'
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
