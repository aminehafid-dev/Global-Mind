import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function TrophyModal({ isOpen, onClose }) {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const [stats, setStats] = useState(null);
  const [recentScores, setRecentScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;

    async function loadData() {
      setLoading(true);
      try {
        const [statsRes, scoresRes] = await Promise.all([
          fetch('/api/stats').catch(() => null),
          fetch('/api/scores?limit=5').catch(() => null)
        ]);

        if (isMounted) {
          if (statsRes && statsRes.ok) {
            const data = await statsRes.json();
            setStats(data);
          }
          if (scoresRes && scoresRes.ok) {
            const list = await scoresRes.json();
            setRecentScores(Array.isArray(list) ? list : (list.value || []));
          }
        }
      } catch (err) {
        console.warn('Could not fetch scores stats:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();
    return () => { isMounted = false; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          style={{
            background: 'white',
            borderRadius: 'var(--radius-lg)',
            maxWidth: '500px',
            width: '100%',
            padding: '2rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            position: 'relative',
            maxHeight: '90vh',
            overflowY: 'auto',
            textAlign: 'center'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '1rem',
              right: isAr ? 'auto' : '1rem',
              left: isAr ? '1rem' : 'auto',
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#888'
            }}
          >
            ✕
          </button>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{ fontSize: '4rem', marginBottom: '0.5rem' }}
          >
            🏆
          </motion.div>

          <h2 style={{ color: 'var(--primary-color)', marginBottom: '0.5rem' }}>
            {isAr ? 'لوحة الشرف والإنجازات' : 'Achievements & Star Board'}
          </h2>
          <p style={{ color: '#666', marginBottom: '1.5rem' }}>
            {isAr ? 'نتائج التمارين والنجوم المسجلة في قاعدة البيانات' : 'Quiz progress and stars saved in the SQL database'}
          </p>

          {/* Stats Badges */}
          {stats && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.8rem',
                marginBottom: '1.5rem'
              }}
            >
              <div style={{ background: '#fff9e6', padding: '0.8rem', borderRadius: '12px', border: '1px solid #ffe082' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-yellow)' }}>
                  ⭐ {stats.totalStarsAwarded || 0}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#666' }}>{isAr ? 'النجوم المكتسبة' : 'Total Stars'}</div>
              </div>

              <div style={{ background: '#e8f5e9', padding: '0.8rem', borderRadius: '12px', border: '1px solid #a5d6a7' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-green)' }}>
                  🎯 {stats.completedQuizzes || 0}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#666' }}>{isAr ? 'تمارين مكتملة' : 'Quizzes Done'}</div>
              </div>

              <div style={{ background: '#e3f2fd', padding: '0.8rem', borderRadius: '12px', border: '1px solid #90caf9' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                  📚 {stats.lessonsCount || 0}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#666' }}>{isAr ? 'مجموع الدروس' : 'Lessons'}</div>
              </div>
            </div>
          )}

          {/* Recent scores list */}
          <div style={{ textAlign: isAr ? 'right' : 'left' }}>
            <h4 style={{ color: 'var(--text-dark)', marginBottom: '0.8rem' }}>
              {isAr ? 'آخر النتائج المسجلة:' : 'Recent Recorded Scores:'}
            </h4>
            {loading ? (
              <p style={{ textAlign: 'center', color: '#888' }}>{isAr ? 'جارٍ التحميل...' : 'Loading...'}</p>
            ) : recentScores.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#888' }}>{isAr ? 'لا توجد نتائج مسجلة حتى الآن.' : 'No scores recorded yet.'}</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {recentScores.map((s, idx) => (
                  <motion.div
                    key={s.id || idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: 'var(--bg-color)',
                      padding: '0.6rem 1rem',
                      borderRadius: '8px',
                      fontSize: '0.95rem'
                    }}
                  >
                    <span>
                      <strong>{s.student_name || 'Élève'}</strong> ({s.subject_slug})
                    </span>
                    <span style={{ color: 'var(--accent-yellow)', fontWeight: 'bold' }}>
                      {'⭐'.repeat(Math.max(1, Math.min(3, s.stars || 1)))} {s.score}/{s.total}
                    </span>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <button
            className="btn btn-primary"
            onClick={onClose}
            style={{ marginTop: '1.5rem', width: '100%' }}
          >
            {isAr ? 'إغلاق' : 'Close'}
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
