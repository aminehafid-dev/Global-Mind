// =========================================
// Exercise Engine – École Esprit Global (مدرسة العقل العالمي)
// Supports Arabic, Math, French, and Science subjects.
// Interface UI respects Arabic ('ar') and English ('en') settings.
// French lesson content retains lang="fr" with fr-FR audio speech.
// =========================================

// Speech synthesis helper for French lessons
window.speakFrench = function(text) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        // Remove Arabic annotations or emojis from speech text for clean French audio
        const cleanText = text.replace(/[\u0600-\u06FF()]/g, '').trim();
        const utterance = new SpeechSynthesisUtterance(cleanText || text);
        utterance.lang = 'fr-FR';
        utterance.rate = 0.85;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
    }
};

class ExerciseEngine {
    constructor(containerId, subjectId) {
        this.container = document.getElementById(containerId);
        this.subjectId = subjectId;
        this.lessons = [];
        this.currentLessonIndex = 0;
        this.currentQuestionIndex = 0;
        this.score = 0;

        // Sounds
        this.successSound = new Audio('assets/success.mp3');
        this.errorSound   = new Audio('assets/error.mp3');

        // Listen for language changes to re-render in place
        window.addEventListener('languageChanged', () => {
            if (this.currentQuestionIndex === 0 && !this.inLesson) {
                this.renderLessonList();
            } else if (this.inLesson) {
                this.renderLessonContent();
            }
        });

        this.init();
    }

    getLang() {
        return window.currentLang || localStorage.getItem('preferredLang') || 'ar';
    }

    // --------------------------------------------------
    // Data loading
    // --------------------------------------------------
    async init() {
        try {
            const response = await fetch('data/lessons.json');
            const data = await response.json();
            if (data[this.subjectId]) {
                this.lessons = data[this.subjectId].lessons;
                this.inLesson = false;
                this.renderLessonList();
            } else {
                const isAr = this.getLang() === 'ar';
                this.container.innerHTML = `<p style="text-align:center; padding:2rem;">${isAr ? 'لم يتم العثور على دروس لهذه المادة.' : 'No lessons found for this subject.'}</p>`;
            }
        } catch (error) {
            console.error('Error loading lessons:', error);
            const isAr = this.getLang() === 'ar';
            this.container.innerHTML = `<p style="text-align:center; padding:2rem;">${isAr ? 'خطأ في تحميل البيانات.' : 'Error loading data.'}</p>`;
        }
    }

    // --------------------------------------------------
    // Lesson list
    // --------------------------------------------------
    renderLessonList() {
        this.inLesson = false;
        const isAr = this.getLang() === 'ar';
        const startLabel = isAr ? 'ابدأ الدرس' : 'Start Lesson';

        this.container.innerHTML = `
            <div class="lesson-list">
                ${this.lessons.map((lesson, index) => {
                    const qCount = (lesson.questions || []).length;
                    const stars  = this.getSavedScore(lesson.id);
                    return `
                    <div class="card lesson-card"
                         style="margin-bottom: var(--spacing-md); text-align: start; align-items: stretch; cursor: pointer;"
                         onclick="app.startLesson(${index})">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <h3>${lesson.title}</h3>
                            <div class="stars">${this.renderStars(stars, qCount)}</div>
                        </div>
                        <p>${lesson.description}</p>
                        <button class="btn btn-accent" style="align-self: flex-start; margin-top: 1rem;">
                            ${startLabel}
                        </button>
                    </div>`;
                }).join('')}
            </div>`;
    }

    // --------------------------------------------------
    // Stars helper
    // --------------------------------------------------
    renderStars(score, total) {
        const maxStars = 3;
        let earned = 0;
        if (score > 0) {
            const ratio = score / (total || 1);
            earned = ratio === 1 ? 3 : ratio >= 0.5 ? 2 : 1;
        }
        return Array.from({ length: maxStars }, (_, i) =>
            i < earned
                ? '<span style="color:var(--accent-yellow);font-size:1.5rem;">⭐</span>'
                : '<span style="color:var(--gray-light);font-size:1.5rem;">☆</span>'
        ).join('');
    }

    // --------------------------------------------------
    // Start a lesson
    // --------------------------------------------------
    startLesson(index) {
        this.inLesson = true;
        this.currentLessonIndex   = index;
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.renderLessonContent();
    }

    // --------------------------------------------------
    // Lesson page (media · text · words · exercises)
    // --------------------------------------------------
    renderLessonContent() {
        this.inLesson = true;
        const lesson  = this.lessons[this.currentLessonIndex];
        const isAr    = this.getLang() === 'ar';
        const isFrenchSubject = this.subjectId === 'french';
        const backLabel = isAr ? '⬅ عودة' : '⬅ Back';

        /* --- video placeholder --- */
        let mediaHtml = '';
        if (lesson.video) {
            mediaHtml += `
            <div style="margin-bottom:var(--spacing-md);aspect-ratio:16/9;background:#ddd;
                        border-radius:var(--radius-md);display:flex;align-items:center;justify-content:center;">
                <p>🎥 ${lesson.video}</p>
            </div>`;
        }

        /* --- images strip (max 3) --- */
        if (lesson.images && lesson.images.length > 0) {
            mediaHtml += `<div style="display:flex;gap:1rem;overflow-x:auto;padding-bottom:1rem;margin-bottom:var(--spacing-md);">`;
            lesson.images.slice(0, 3).forEach(img => {
                mediaHtml += `<img src="assets/${img}" alt="Lesson image"
                                   style="height:200px;border-radius:var(--radius-sm);
                                          border:1px solid var(--gray-light);object-fit:contain;">`;
            });
            mediaHtml += `</div>`;
        }

        /* --- Word grid with 🔊 sound button (for French vocabulary) --- */
        let wordGridHtml = '';
        if (isFrenchSubject && lesson.words && lesson.words.length > 0) {
            wordGridHtml = `
            <div class="word-grid" lang="fr">
                ${lesson.words.map(w => `
                <div class="word-card" onclick="window.speakFrench('${w.label}')">
                    <span class="word-emoji">${w.emoji}</span>
                    <span class="word-label">${w.label}</span>
                    <span class="word-arabic">${w.translation || ''}</span>
                    <button class="speak-btn" style="margin-top:8px;" onclick="event.stopPropagation(); window.speakFrench('${w.label}')">
                        🔊 ${isAr ? 'استمع' : 'Listen'}
                    </button>
                </div>`).join('')}
            </div>`;
        }

        /* --- text content block --- */
        let textHtml = '';
        if (lesson.content) {
            const frenchVoiceBtn = isFrenchSubject
                ? `<button class="speak-btn" style="margin-bottom:8px;" onclick="window.speakFrench('${lesson.content.replace(/'/g, "\\'")}')">🔊 ${isAr ? 'استمع إلى النص' : 'Listen in French'}</button>`
                : '';
            textHtml = `
            <div ${isFrenchSubject ? 'lang="fr"' : ''} style="background:white;padding:var(--spacing-md);border-radius:var(--radius-sm);
                        margin-bottom:var(--spacing-md);border:1px solid var(--gray-light);">
                ${frenchVoiceBtn}
                <p style="font-size:1.2rem;line-height:1.8;">${lesson.content}</p>
            </div>`;
        }

        /* --- download original file button --- */
        let downloadHtml = '';
        if (lesson.pdfLink) {
            const dlText = isAr ? '📥 تحميل الدرس الأصلي' : '📥 Download original lesson';
            downloadHtml = `<a href="${lesson.pdfLink}" target="_blank" class="btn"
                              style="background:var(--accent-orange);color:white;">
                              ${dlText}
                           </a>`;
        }

        /* --- assemble page --- */
        this.container.innerHTML = `
        <div class="lesson-content">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--spacing-md);">
                <button class="btn"
                        onclick="app.renderLessonList()"
                        style="background:var(--gray-light);color:var(--text-dark);">${backLabel}</button>
                ${downloadHtml}
            </div>

            <!-- French lesson content has lang='fr' attribute on the lesson element -->
            <div ${isFrenchSubject ? 'lang="fr"' : ''} class="lesson-body-wrapper">
                <div style="display:flex; align-items:center; gap:12px; margin-bottom:8px;">
                    <h2 style="color:var(--primary-color); margin-bottom:0;">${lesson.title}</h2>
                    ${isFrenchSubject ? `<button class="speak-btn" onclick="window.speakFrench('${lesson.title.replace(/'/g, "\\'")}')" title="Écouter en français">🔊</button>` : ''}
                </div>
                <p style="margin-bottom:var(--spacing-md);">${lesson.description}</p>

                ${mediaHtml}
                ${textHtml}
                ${wordGridHtml}
            </div>

            <div id="exerciseArea" class="card" style="align-items:stretch;text-align:start;">
                <!-- Questions loaded dynamically -->
            </div>
        </div>`;

        this.renderQuestion();
    }

    // --------------------------------------------------
    // Render one question
    // --------------------------------------------------
    renderQuestion() {
        const lesson    = this.lessons[this.currentLessonIndex];
        const questions = lesson.questions || [];
        if (this.currentQuestionIndex >= questions.length) {
            this.renderResult();
            return;
        }

        const q      = questions[this.currentQuestionIndex];
        const exArea = document.getElementById('exerciseArea');
        const isAr   = this.getLang() === 'ar';
        const isFrenchSubject = this.subjectId === 'french';

        const qLabel = isAr ? 'السؤال' : 'Question';
        const listenLabel = isAr ? 'استمع' : 'Listen';

        const speakQ = isFrenchSubject
            ? `<button class="speak-btn" style="margin-bottom:1rem;"
                       onclick="window.speakFrench('${q.question.replace(/'/g, "\\'")}')">
                   🔊 ${listenLabel}
               </button>`
            : '';

        exArea.innerHTML = `
        <h3 style="margin-bottom:0.5rem;">
            ${qLabel} ${this.currentQuestionIndex + 1} / ${questions.length}
        </h3>
        ${speakQ}
        <p ${isFrenchSubject ? 'lang="fr"' : ''} style="font-size:1.4rem;margin-bottom:1.5rem;"><strong>${q.question}</strong></p>

        <div class="options" style="display:grid;gap:1rem;">
            ${q.options.map((opt, i) => `
            <button class="btn btn-primary"
                    onclick="app.checkAnswer(${i})"
                    style="justify-content:space-between;text-align:start;padding:1rem 2rem;">
                <span ${isFrenchSubject ? 'lang="fr"' : ''}>${opt}</span>
                ${isFrenchSubject ? `<span onclick="event.stopPropagation(); window.speakFrench('${opt.replace(/'/g, "\\'")}')"
                                     style="font-size:1.2rem;cursor:pointer;padding-inline-start:8px;" title="Listen in French">🔊</span>` : ''}
            </button>`).join('')}
        </div>

        <div id="feedbackArea" style="margin-top:2rem;min-height:60px;"></div>`;
    }

    // --------------------------------------------------
    // Check answer
    // --------------------------------------------------
    checkAnswer(selectedIndex) {
        const lesson   = this.lessons[this.currentLessonIndex];
        const q        = (lesson.questions || [])[this.currentQuestionIndex];
        const feedback = document.getElementById('feedbackArea');
        const buttons  = document.querySelectorAll('.options .btn');
        const isAr     = this.getLang() === 'ar';

        buttons.forEach(btn => btn.disabled = true);

        const correct = selectedIndex === q.correct;
        this.playSound(correct ? 'success' : 'error');

        if (correct) {
            this.score++;
            buttons[selectedIndex].style.backgroundColor = 'var(--accent-green)';
            const correctText = isAr ? 'إجابة صحيحة! أحسنت!' : 'Great job! Correct answer!';
            feedback.innerHTML = `
            <div style="padding:1rem;background:#e8f5e9;border-radius:var(--radius-md);color:var(--accent-green);font-weight:bold;">
                ✅ ${q.explanation || correctText}
            </div>`;
        } else {
            buttons[selectedIndex].style.backgroundColor = 'var(--accent-orange)';
            if (buttons[q.correct]) buttons[q.correct].style.backgroundColor = 'var(--accent-green)';
            const tryAgainText = isAr ? 'حاول مرة أخرى!' : 'Try again!';
            feedback.innerHTML = `
            <div style="padding:1rem;background:#ffebee;border-radius:var(--radius-md);color:var(--accent-orange);font-weight:bold;">
                ❌ ${tryAgainText}<br>
                <span style="font-size:.9em;font-weight:normal;">${q.explanation || ''}</span>
            </div>`;
        }

        setTimeout(() => {
            this.currentQuestionIndex++;
            this.renderQuestion();
        }, 3000);
    }

    // --------------------------------------------------
    // Results screen
    // --------------------------------------------------
    renderResult() {
        const lesson = this.lessons[this.currentLessonIndex];
        const total  = (lesson.questions || []).length;
        this.saveScore(lesson.id, this.score);
        const isAr   = this.getLang() === 'ar';

        const bravoMsg    = isAr ? '🎉 أحسنت!' : '🎉 Well done!';
        const scoreMsg    = isAr ? 'نتيجتك:' : 'Your score:';
        const restartText = isAr ? '🔄 إعادة المحاولة' : '🔄 Try Again';
        const allText     = isAr ? '📚 قائمة الدروس' : '📚 All Lessons';

        const exArea = document.getElementById('exerciseArea');
        exArea.innerHTML = `
        <div style="text-align:center;padding:2rem 0;">
            <h2 style="font-size:2.5rem;margin-bottom:1rem;">
                ${bravoMsg}
            </h2>
            <div style="margin-bottom:2rem;">${this.renderStars(this.score, total)}</div>
            <p style="font-size:1.5rem;margin-bottom:2rem;">
                ${scoreMsg} <strong>${this.score} / ${total}</strong>
            </p>

            <div style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;">
                <button class="btn btn-accent"
                        onclick="app.startLesson(${this.currentLessonIndex})">
                    ${restartText}
                </button>
                <button class="btn btn-primary"
                        onclick="app.renderLessonList()">
                    ${allText}
                </button>
            </div>
        </div>`;
    }

    // --------------------------------------------------
    // Persistence (localStorage – no personal data)
    // --------------------------------------------------
    saveScore(lessonId, score) {
        const saved = JSON.parse(localStorage.getItem('espritGlobalScores')) || {};
        if (!saved[lessonId] || score > saved[lessonId]) {
            saved[lessonId] = score;
            localStorage.setItem('espritGlobalScores', JSON.stringify(saved));
        }
    }

    getSavedScore(lessonId) {
        const saved = JSON.parse(localStorage.getItem('espritGlobalScores')) || {};
        return saved[lessonId] || 0;
    }

    // --------------------------------------------------
    // Sound feedback
    // --------------------------------------------------
    playSound(type) {
        try {
            const snd = type === 'success' ? this.successSound : this.errorSound;
            snd.currentTime = 0;
            snd.play().catch(() => {});
        } catch (e) {}
    }
}
