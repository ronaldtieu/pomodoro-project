let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

/**
 * Plays an 8-bit chiptune chime using square waves.
 * C6 → E6 → G6 arpeggio for a retro pixel-art feel.
 */
export function playNotificationSound() {
  try {
    const ctx = getAudioContext();

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;
    const notes = [
      { freq: 1047, start: 0 },     // C6
      { freq: 1319, start: 0.1 },   // E6
      { freq: 1568, start: 0.2 },   // G6
    ];
    const noteDuration = 0.09;
    const volume = 0.08;

    for (const note of notes) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.value = note.freq;

      // Sharp on/off envelope for punchy 8-bit character
      gain.gain.setValueAtTime(volume, now + note.start);
      gain.gain.setValueAtTime(0, now + note.start + noteDuration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + note.start);
      osc.stop(now + note.start + noteDuration);
    }
  } catch {
    // Silently fail — sound is non-critical
  }
}
