export function speakFrench(text) {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    // Remove Arabic annotations, brackets, or emojis from speech text for clean French audio
    const cleanText = text.replace(/[\u0600-\u06FF()]/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText || text);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.85;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  }
}
