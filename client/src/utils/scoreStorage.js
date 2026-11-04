const STORAGE_KEY = 'espritGlobalScores';

export function getSavedScore(lessonId) {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    return saved[lessonId] || 0;
  } catch {
    return 0;
  }
}

export function saveScore(lessonId, score) {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    if (!saved[lessonId] || score > saved[lessonId]) {
      saved[lessonId] = score;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    }
  } catch {
    // localStorage error handled silently
  }
}
