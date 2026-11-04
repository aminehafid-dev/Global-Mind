import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import fallbackLessons from '../data/lessons.json';
import { speakFrench } from '../utils/speech';
import { playSound } from '../utils/audio';
import { getSavedScore, saveScore } from '../utils/scoreStorage';

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

  const timerRef = useRef(null);

  const isAr = i18n.language === 'ar';
  const isFrenchSubject = subjectKey === 'french';

  // Load lessons data
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        setLoading(true);
        setError(false);
        const res = await fetch('/data/lessons.json');
        if (!res.ok) throw new Error('Network error');
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
        console.warn('Falling back to embedded lessons data:', err);
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
    loadData();
    return () => {
      isMounted = false;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [subjectKey]);

  // Clean timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const renderStars = (earnedScore, total) => {
    const maxStars = 3;
    let earned = 0;
    if (earnedScore > 0) {
      const ratio = earnedScore / (total || 1);
      earned = ratio === 1 ? 3 : ratio >= 0.5 ? 2 : 1;
    }
    return Array.from({ length: maxStars }, (_, i) => (
      <span
        key={i}
        style={{
          color: i < earned ? 'var(--accent-yellow)' : 'var(--gray-light)',
          fontSize: '1.5rem'
        }}
      >
        {i < earned ? '⭐' : '☆'}
      </span>
    ));
  };

  const startLesson = (index) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setCurrentLessonIndex(index);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsChecked(false);
  };

  const backToLessonList = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setCurrentLessonIndex(null);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsChecked(false);
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
    }, 3000);
  };

  // Safe speech wrapper
  const handleSpeak = (e, text) => {
    if (e && e.stopPropagation) e.stopPropagation();
    speakFrench(text);
  };

  const activeLesson = currentLessonIndex !== null ? lessons[currentLessonIndex] : null;
  const questions = activeLesson ? (activeLesson.questions || []) : [];
  const isQuizFinished = activeLesson && currentQuestionIndex >= questions.length;

  useEffect(() => {
    if (isQuizFinished && activeLesson) {
      saveScore(activeLesson.id, score);
    }
  }, [isQuizFinished, activeLesson, score]);

  return (
    <main>
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
          <h1 style={{ color: 'white', fontSize: '3rem' }}>
            <span>{icon}</span>{' '}
            <span data-i18n={`subjects.${subjectKey}.title`}>
              {t(`subjects.${subjectKey}.title`)}
            </span>
          </h1>
          <p style={{ fontSize: '1.5rem' }} data-i18n={`subjects.${subjectKey}.desc`}>
            {t(`subjects.${subjectKey}.desc`)}
          </p>
        </div>
      </section>

      {/* Main Container */}
      <section className="section">
        <div className="container" id="app-container">
          {loading && (
            <p style={{ textAlign: 'center' }} data-i18n="exercises.loading">
              {t('exercises.loading')}
            </p>
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
            <div className="lesson-list">
              {lessons.map((lesson, idx) => {
                const qCount = (lesson.questions || []).length;
                const stars = getSavedScore(lesson.id);
                return (
                  <div
                    key={lesson.id || idx}
                    className="card lesson-card"
                    style={{
                      marginBottom: 'var(--spacing-md)',
                      textAlign: 'start',
                      alignItems: 'stretch',
                      cursor: 'pointer'
                    }}
                    onClick={() => startLesson(idx)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3>{lesson.title}</h3>
                      <div className="stars">{renderStars(stars, qCount)}</div>
                    </div>
                    <p>{lesson.description}</p>
                    <button
                      className="btn btn-accent"
                      style={{ alignSelf: 'flex-start', marginTop: '1rem' }}
                      data-i18n="exercises.start_lesson"
                      onClick={(e) => {
                        e.stopPropagation();
                        startLesson(idx);
                      }}
                    >
                      {t('exercises.start_lesson')}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* 2. Active Lesson View */}
          {!loading && !error && activeLesson && (
            <div className="lesson-content">
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
                  {t('exercises.back')}
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
                    {t('exercises.download_original')}
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
                <p style={{ marginBottom: 'var(--spacing-md)' }}>{activeLesson.description}</p>

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

                {/* Images Strip (first 3) */}
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
                      border: '1px solid var(--gray-light)'
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
                    <p style={{ fontSize: '1.2rem', lineHeight: '1.8' }}>{activeLesson.content}</p>
                  </div>
                )}

                {/* French Vocabulary Word Grid */}
                {isFrenchSubject && activeLesson.words && activeLesson.words.length > 0 && (
                  <div className="word-grid" lang="fr">
                    {activeLesson.words.map((w, i) => (
                      <div
                        key={i}
                        className="word-card"
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
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 3. Interactive Exercise Area */}
              <div id="exerciseArea" className="card" style={{ alignItems: 'stretch', textAlign: 'start' }}>
                {!isQuizFinished && questions.length > 0 && (
                  <div>
                    <h3 style={{ marginBottom: '0.5rem' }}>
                      {t('exercises.question')} {currentQuestionIndex + 1} / {questions.length}
                    </h3>

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
                      style={{ fontSize: '1.4rem', marginBottom: '1.5rem' }}
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
                          padding: '1rem 2rem'
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
                          <button
                            key={optIdx}
                            className="btn btn-primary"
                            disabled={isChecked}
                            onClick={() => handleAnswerSelect(optIdx, questions[currentQuestionIndex].correct)}
                            style={btnStyle}
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
                          </button>
                        );
                      })}
                    </div>

                    {/* Instant Feedback Area */}
                    <div id="feedbackArea" style={{ marginTop: '2rem', minHeight: '60px' }}>
                      {isChecked && selectedAnswer === questions[currentQuestionIndex].correct && (
                        <div
                          style={{
                            padding: '1rem',
                            background: '#e8f5e9',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--accent-green)',
                            fontWeight: 'bold'
                          }}
                        >
                          ✅ {questions[currentQuestionIndex].explanation || t('exercises.correct_msg')}
                        </div>
                      )}
                      {isChecked && selectedAnswer !== questions[currentQuestionIndex].correct && (
                        <div
                          style={{
                            padding: '1rem',
                            background: '#ffebee',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--accent-orange)',
                            fontWeight: 'bold'
                          }}
                        >
                          ❌ {t('exercises.wrong_msg')}
                          <br />
                          <span style={{ fontSize: '0.9em', fontWeight: 'normal' }}>
                            {questions[currentQuestionIndex].explanation || ''}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Results Screen */}
                {isQuizFinished && (
                  <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
                      {t('exercises.bravo')}
                    </h2>
                    <div style={{ marginBottom: '2rem' }}>
                      {renderStars(score, questions.length)}
                    </div>
                    <p style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>
                      {t('exercises.score')} <strong>{score} / {questions.length}</strong>
                    </p>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                      <button
                        className="btn btn-accent"
                        onClick={() => startLesson(currentLessonIndex)}
                        data-i18n="exercises.restart"
                      >
                        {t('exercises.restart')}
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={backToLessonList}
                        data-i18n="exercises.all_lessons"
                      >
                        {t('exercises.all_lessons')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
