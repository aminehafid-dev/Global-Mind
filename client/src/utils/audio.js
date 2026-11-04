export function playSound(type) {
  try {
    const src = type === 'success' ? '/assets/success.mp3' : '/assets/error.mp3';
    const audio = new Audio(src);
    audio.currentTime = 0;
    audio.play().catch(() => {});
  } catch {
    // Audio playback safely caught
  }
}
