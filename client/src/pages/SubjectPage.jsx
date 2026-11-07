import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import fallbackLessons from '../data/lessons.json';
import { speakFrench } from '../utils/speech';
import { playSound } from '../utils/audio';
import { getSavedScore, saveScore } from '../utils/scoreStorage';
import Confetti from '../components/Confetti';

export default function SubjectPage({ subjectKey, icon }) {
  const { t, i18n } = useTranslation();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Lesson & exercise state
  const [currentLessonIndex, setCurrentLessonIndex] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const timerRef = useRef(null);

  const isAr = i18n.language === 'ar';
  const isFrenchSubject = subjectKey === 'french';

  // Load lessons data from SQL API with embedded fallback
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        setLoading(true);
        setError(false);
        // Try fetching from Node/PHP backend API first
        const res = await fetch('/api/lessons');
        if (!res.ok) throw new Error('API not available');
        const data = await res.json();
        if (isMounted) {
          if (data && data[subjectKey] && data[subjectKey].lessons) {
            setLessons(data[subjectKey].lessons);
          } else {
            setLessons([]);
          }
          setLoading(false);
        }
      } catch (err) {
        // Fallback to static JSON
        try {
          const staticRes = await fetch('/data/lessons.json');
          if (!staticRes.ok) throw new Error('Static lessons error');
          const staticData = await staticRes.json();
          if (isMounted) {
            if (staticData && staticData[subjectKey] && staticData[subjectKey].lessons) {
              setLessons(staticData[subjectKey].lessons);
            } else {
              setLessons([]);
            }
            setLoading(false);
          }
        } catch (staticErr) {
          console.warn('Using bundled fallback lessons:', staticErr);
          if (isMounted) {
            if (fallbackLessons && fallbackLessons[subjectKey] && fallbackLessons[subjectKey].lessons) {
              setLessons(fallbackLessons[subjectKey].lessons);
            } else {
              setLessons([]);
            }
            setLoading(false);
          }
        }
      }
    }

    loadData();
    return () => {
      isMounted = false;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [subjectKey]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const renderStars = (earnedScore, total, animated = false) => {
    const maxStars = 3;
    let earned = 0;
    if (earnedScore > 0) {
      const ratio = earnedScore / (total || 1);
      earned = ratio === 1 ? 3 : ratio >= 0.5 ? 2 : 1;
    }

    return (
      <div style={{ display: 'inline-flex', gap: '6px' }}>
        {Array.from({ length: maxStars }, (_, i) => {
          const isGold = i < earned;
          if (animated && isGold) {
            return (
              <motion.span
                key={i}
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: [0, 1.4, 1], rotate: [0, 15, 0] }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.2, type: 'spring' }}
                style={{
                  color: 'var(--accent-yellow)',
                  fontSize: '2.5rem',
                  display: 'inline-block',
                  filter: 'drop-shadow(0 2px 4px rgba(255,184,0,0.4))'
                }}
              >
                ⭐
              </motion.span>
            );
          }

          return (
            <span
              key={i}
              style={{
                color: isGold ? 'var(--accent-yellow)' : 'var(--gray-light)',
                fontSize: animated ? '2.5rem' : '1.5rem',
                display: 'inline-block'
              }}
            >
              {isGold ? '⭐' : '☆'}
            </span>
          );
        })}
      </div>
    );
  };

  const startLesson = (index) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setCurrentLessonIndex(index);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsChecked(false);
    setShowConfetti(false);
  };

  const backToLessonList = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setCurrentLessonIndex(null);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsChecked(false);
    setShowConfetti(false);
  };

  const handleAnswerSelect = (optionIndex, correctIndex) => {
    if (isChecked) return;

    const isCorrect = optionIndex === correctIndex;
    setSelectedAnswer(optionIndex);
    setIsChecked(true);

    if (isCorrect) {
      setScore(prev => prev + 1);
      playSound('success');
    } else {
      playSound('error');
    }

    timerRef.current = setTimeout(() => {
      setSelectedAnswer(null);
      setIsChecked(false);
      setCurrentQuestionIndex(prev => prev + 1);
    }, 2800);
  };

  const handleSpeak = (e, text) => {
    if (e && e.stopPropagation) e.stopPropagation();
    speakFrench(text);
  };

  const activeLesson = currentLessonIndex !== null ? lessons[currentLessonIndex] : null;
  const questions = activeLesson ? (activeLesson.questions || []) : [];
  const isQuizFinished = activeLesson && currentQuestionIndex >= questions.length;

  // On quiz completion: save to SQL database and trigger confetti
  useEffect(() => {
    if (isQuizFinished && activeLesson) {
      saveScore(activeLesson.id, score);

      const ratio = score / (questions.length || 1);
      const earnedStars = ratio === 1 ? 3 : ratio >= 0.5 ? 2 : (score > 0 ? 1 : 0);

      if (earnedStars >= 2) {
        setShowConfetti(true);
      }

      // Save to SQL Database (PHP or Node API)
      fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: 'Élève',
          subjectSlug: subjectKey,
          lessonSlug: activeLesson.id,
          score: score,
          total: questions.length,
          stars: earnedStars
        })
      }).catch((err) => {
        console.warn('Could not sync score to SQL database:', err);
      });
    }
  }, [isQuizFinished, activeLesson, score, questions.length, subjectKey]);

  return (
    <main>
      <Confetti active={showConfetti} />

      {/* Subject Hero Header */}
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
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ color: 'white', fontSize: '3rem', fontWeight: 800 }}
          >
            <span>{icon}</span>{' '}
            <span data-i18n={`subjects.${subjectKey}.title`}>
              {t(`subjects.${subjectKey}.title`)}
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{ fontSize: '1.4rem' }}
            data-i18n={`subjects.${subjectKey}.desc`}
          >
            {t(`subjects.${subjectKey}.desc`)}
          </motion.p>
        </div>
      </section>

      {/* Main Container */}
      <section className="section">
        <div className="container" id="app-container">
          {loading && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ textAlign: 'center', fontSize: '1.3rem', padding: '2rem' }}
              data-i18n="exercises.loading"
            >
              ⏳ {t('exercises.loading')}
            </motion.p>
          )}

          {!loading && error && (
            <p style={{ textAlign: 'center', padding: '2rem' }} data-i18n="exercises.error_loading">
              {t('exercises.error_loading')}
            </p>
          )}

          {!loading && !error && lessons.length === 0 && (
            <p style={{ textAlign: 'center', padding: '2rem' }} data-i18n="exercises.not_found">
              {t('exercises.not_found')}
            </p>
          )}

          {/* 1. Lesson List View */}
          {!loading && !error && lessons.length > 0 && currentLessonIndex === null && (
            <motion.div
              className="lesson-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {lessons.map((lesson, idx) => {
                const qCount = (lesson.questions || []).length;
                const stars = getSavedScore(lesson.id);
                return (
                  <motion.div
                    key={lesson.id || idx}
                    className="card lesson-card"
                    whileHover={{ y: -6, scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    style={{
                      marginBottom: 'var(--spacing-md)',
                      textAlign: 'start',
                      alignItems: 'stretch',
                      cursor: 'pointer',
                      borderLeft: isAr ? 'none' : '6px solid var(--primary-light)',
                      borderRight: isAr ? '6px solid var(--primary-light)' : 'none'
                    }}
                    onClick={() => startLesson(idx)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 style={{ color: 'var(--primary-color)' }}>{lesson.title}</h3>
                      <div className="stars">{renderStars(stars, qCount)}</div>
                    </div>
                    <p style={{ color: '#555', margin: '0.5rem 0' }}>{lesson.description}</p>
                    <button
                      className="btn btn-accent"
                      style={{ alignSelf: 'flex-start', marginTop: '0.8rem' }}
                      data-i18n="exercises.start_lesson"
                      onClick={(e) => {
                        e.stopPropagation();
                        startLesson(idx);
                      }}
                    >
                      🚀 {t('exercises.start_lesson')}
                    </button>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {/* 2. Active Lesson View */}
          {!loading && !error && activeLesson && (
            <motion.div
              className="lesson-content"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Top Action Bar */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 'var(--spacing-md)'
                }}
              >
                <button
                  className="btn"
                  onClick={backToLessonList}
                  style={{ background: 'var(--gray-light)', color: 'var(--text-dark)' }}
                  data-i18n="exercises.back"
                >
                  {isAr ? '← ' : '← '}{t('exercises.back')}
                </button>
                {activeLesson.pdfLink && (
                  <a
                    href={activeLesson.pdfLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn"
                    style={{ background: 'var(--accent-orange)', color: 'white' }}
                    data-i18n="exercises.download_original"
                  >
                    📄 {t('exercises.download_original')}
                  </a>
                )}
              </div>

              {/* Lesson Body Content */}
              <div lang={isFrenchSubject ? 'fr' : undefined} className="lesson-body-wrapper">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <h2 style={{ color: 'var(--primary-color)', marginBottom: 0 }}>
                    {activeLesson.title}
                  </h2>
                  {isFrenchSubject && (
                    <button
                      className="speak-btn"
                      onClick={(e) => handleSpeak(e, activeLesson.title)}
                      title="Écouter en français"
                    >
                      🔊
                    </button>
                  )}
                </div>
                <p style={{ marginBottom: 'var(--spacing-md)', fontSize: '1.15rem' }}>{activeLesson.description}</p>

                {/* Video Placeholder */}
                {activeLesson.video && (
                  <div
                    style={{
                      marginBottom: 'var(--spacing-md)',
                      aspectRatio: '16/9',
                      background: '#ddd',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <p>🎥 {activeLesson.video}</p>
                  </div>
                )}

                {/* Images Strip */}
                {activeLesson.images && activeLesson.images.length > 0 && (
                  <div
                    style={{
                      display: 'flex',
                      gap: '1rem',
                      overflowX: 'auto',
                      paddingBottom: '1rem',
                      marginBottom: 'var(--spacing-md)'
                    }}
                  >
                    {activeLesson.images.slice(0, 3).map((img, i) => (
                      <img
                        key={i}
                        src={`/assets/${img}`}
                        alt="Lesson"
                        style={{
                          height: '200px',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--gray-light)',
                          objectFit: 'contain'
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Text Content Block */}
                {activeLesson.content && (
                  <div
                    lang={isFrenchSubject ? 'fr' : undefined}
                    style={{
                      background: 'white',
                      padding: 'var(--spacing-md)',
                      borderRadius: 'var(--radius-sm)',
                      marginBottom: 'var(--spacing-md)',
                      border: '1px solid var(--gray-light)',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    {isFrenchSubject && (
                      <button
                        className="speak-btn"
                        style={{ marginBottom: '8px' }}
                        onClick={(e) => handleSpeak(e, activeLesson.content)}
                      >
                        🔊 {isAr ? 'استمع إلى النص' : 'Listen in French'}
                      </button>
                    )}
                    <p style={{ fontSize: '1.25rem', lineHeight: '1.8' }}>{activeLesson.content}</p>
                  </div>
                )}

                {/* French Vocabulary Word Grid */}
                {isFrenchSubject && activeLesson.words && activeLesson.words.length > 0 && (
                  <div className="word-grid" lang="fr">
                    {activeLesson.words.map((w, i) => (
                      <motion.div
                        key={i}
                        className="word-card"
                        whileHover={{ scale: 1.05, y: -4 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => handleSpeak(e, w.label)}
                      >
                        <span className="word-emoji">{w.emoji}</span>
                        <span className="word-label">{w.label}</span>
                        <span className="word-arabic">{w.translation || ''}</span>
                        <button
                          className="speak-btn"
                          style={{ marginTop: '8px' }}
                          onClick={(e) => handleSpeak(e, w.label)}
                        >
                          🔊 {t('exercises.listen')}
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* 3. Interactive Exercise Area */}
              <div id="exerciseArea" className="card" style={{ alignItems: 'stretch', textAlign: 'start', marginTop: '1.5rem' }}>
                <AnimatePresence mode="wait">
                  {!isQuizFinished && questions.length > 0 && (
                    <motion.div
                      key={currentQuestionIndex}
                      initial={{ opacity: 0, x: isAr ? -25 : 25 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: isAr ? 25 : -25 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <h3 style={{ margin: 0 }}>
                          {t('exercises.question')} {currentQuestionIndex + 1} / {questions.length}
                        </h3>
                        <div style={{ background: '#e3f2fd', color: 'var(--primary-color)', padding: '4px 12px', borderRadius: '12px', fontWeight: 'bold' }}>
                          🎯 {score} {isAr ? 'نقاط' : 'pts'}
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div style={{ width: '100%', height: '8px', background: '#e0e0e0', borderRadius: '4px', overflow: 'hidden', marginBottom: '1.2rem' }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
                          transition={{ duration: 0.3 }}
                          style={{ height: '100%', background: 'linear-gradient(90deg, var(--primary-light), var(--accent-green))' }}
                        />
                      </div>

                      {isFrenchSubject && (
                        <button
                          className="speak-btn"
                          style={{ marginBottom: '1rem' }}
                          onClick={(e) => handleSpeak(e, questions[currentQuestionIndex].question)}
                        >
                          🔊 {t('exercises.listen')}
                        </button>
                      )}

                      <p
                        lang={isFrenchSubject ? 'fr' : undefined}
                        style={{ fontSize: '1.45rem', marginBottom: '1.5rem', lineHeight: '1.6' }}
                      >
                        <strong>{questions[currentQuestionIndex].question}</strong>
                      </p>

                      <div className="options" style={{ display: 'grid', gap: '1rem' }}>
                        {questions[currentQuestionIndex].options.map((opt, optIdx) => {
                          const isCorrectOption = optIdx === questions[currentQuestionIndex].correct;
                          const isSelected = selectedAnswer === optIdx;

                          let btnStyle = {
                            justifyContent: 'space-between',
                            textAlign: 'start',
                            padding: '1rem 2rem',
                            fontSize: '1.25rem'
                          };

                          if (isChecked) {
                            if (isSelected && isCorrectOption) {
                              btnStyle.backgroundColor = 'var(--accent-green)';
                            } else if (isSelected && !isCorrectOption) {
                              btnStyle.backgroundColor = 'var(--accent-orange)';
                            } else if (!isSelected && isCorrectOption) {
                              btnStyle.backgroundColor = 'var(--accent-green)';
                            }
                          }

                          return (
                            <motion.button
                              key={optIdx}
                              className="btn btn-primary"
                              disabled={isChecked}
                              onClick={() => handleAnswerSelect(optIdx, questions[currentQuestionIndex].correct)}
                              style={btnStyle}
                              whileHover={!isChecked ? { scale: 1.02 } : {}}
                              whileTap={!isChecked ? { scale: 0.98 } : {}}
                              animate={
                                isChecked && isSelected
                                  ? isCorrectOption
                                    ? { scale: [1, 1.04, 1] }
                                    : { x: [0, -8, 8, -6, 6, 0] }
                                  : {}
                              }
                              transition={{ duration: 0.3 }}
                            >
                              <span lang={isFrenchSubject ? 'fr' : undefined}>{opt}</span>
                              {isFrenchSubject && (
                                <span
                                  onClick={(e) => handleSpeak(e, opt)}
                                  style={{ fontSize: '1.2rem', cursor: 'pointer', paddingInlineStart: '8px' }}
                                  title="Listen in French"
                                >
                                  🔊
                                </span>
                              )}
                            </motion.button>
                          );
                        })}
                      </div>

                      {/* Instant Feedback Area */}
                      <div id="feedbackArea" style={{ marginTop: '1.5rem', minHeight: '60px' }}>
                        {isChecked && selectedAnswer === questions[currentQuestionIndex].correct && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            style={{
                              padding: '1rem',
                              background: '#e8f5e9',
                              borderRadius: 'var(--radius-md)',
                              color: 'var(--accent-green)',
                              fontWeight: 'bold',
                              fontSize: '1.15rem',
                              border: '1px solid #a5d6a7'
                            }}
                          >
                            ✅ {questions[currentQuestionIndex].explanation || t('exercises.correct_msg')}
                          </motion.div>
                        )}
                        {isChecked && selectedAnswer !== questions[currentQuestionIndex].correct && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            style={{
                              padding: '1rem',
                              background: '#ffebee',
                              borderRadius: 'var(--radius-md)',
                              color: 'var(--accent-orange)',
                              fontWeight: 'bold',
                              fontSize: '1.15rem',
                              border: '1px solid #ffcdd2'
                            }}
                          >
                            ❌ {t('exercises.wrong_msg')}
                            <br />
                            <span style={{ fontSize: '0.95em', fontWeight: 'normal', display: 'block', marginTop: '4px' }}>
                              {questions[currentQuestionIndex].explanation || ''}
                            </span>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Results Screen */}
                  {isQuizFinished && (
                    <motion.div
                      key="results"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, type: 'spring' }}
                      style={{ textAlign: 'center', padding: '2rem 0' }}
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: [0, 1.3, 1] }}
                        transition={{ duration: 0.6 }}
                        style={{ fontSize: '4.5rem', marginBottom: '0.5rem' }}
                      >
                        🎉
                      </motion.div>

                      <h2 style={{ fontSize: '2.5rem', marginBottom: '0.8rem', color: 'var(--primary-color)' }}>
                        {t('exercises.bravo')}
                      </h2>

                      <div style={{ marginBottom: '1.5rem' }}>
                        {renderStars(score, questions.length, true)}
                      </div>

                      <p style={{ fontSize: '1.6rem', marginBottom: '1rem' }}>
                        {t('exercises.score')} <strong style={{ color: 'var(--primary-color)' }}>{score} / {questions.length}</strong>
                      </p>

                      <p style={{ color: '#00a651', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '2rem' }}>
                        💾 {isAr ? 'تم حفظ نتيجتك بنجاح في قاعدة البيانات!' : 'Score recorded successfully in the SQL database!'}
                      </p>

                      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="btn btn-accent"
                          onClick={() => startLesson(currentLessonIndex)}
                          data-i18n="exercises.restart"
                        >
                          🔄 {t('exercises.restart')}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="btn btn-primary"
                          onClick={backToLessonList}
                          data-i18n="exercises.all_lessons"
                        >
                          📚 {t('exercises.all_lessons')}
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </main>
  );
}
