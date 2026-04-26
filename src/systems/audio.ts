import { Howl, Howler } from 'howler';
import { getSettings } from './save';

// Audio is intentionally minimal for V1 — we synthesize most SFX via WebAudio
// and rely on a single ambient track per chapter. This keeps the asset budget tiny.

let ambient: Howl | null = null;
let unlocked = false;
let audioCtx: AudioContext | null = null;

export function unlockAudio(): void {
  if (unlocked) return;
  // Howler will create its context on first sound; force-resume here.
  if (Howler.ctx?.state === 'suspended') {
    void Howler.ctx.resume();
  }
  if (!audioCtx) {
    try {
      const Ctx = window.AudioContext || (window as any).webkitAudioContext;
      audioCtx = new Ctx();
      if (audioCtx.state === 'suspended') {
        void audioCtx.resume();
      }
    } catch {
      // No WebAudio — silent fallback
    }
  }
  unlocked = true;
  document.dispatchEvent(new CustomEvent('audio-unlocked'));
}

export function setMasterVolume(v: number): void {
  Howler.volume(Math.max(0, Math.min(1, v)));
}

export function playAmbient(url: string, loop = true): void {
  stopAmbient();
  const settings = getSettings();
  ambient = new Howl({
    src: [url],
    loop,
    html5: true,
    volume: settings.musicVol,
  });
  ambient.play();
}

export function stopAmbient(): void {
  if (ambient) {
    ambient.fade(ambient.volume(), 0, 600);
    setTimeout(() => {
      ambient?.unload();
      ambient = null;
    }, 700);
  }
}

export function setAmbientVolume(v: number): void {
  if (ambient) ambient.volume(v);
}

// === Synthesized SFX ===
// Avoids shipping audio sprites for V1. All SFX are short tones generated via WebAudio.
type SfxKind = 'tap' | 'pickup' | 'success' | 'fail' | 'discovery' | 'door' | 'whoosh' | 'beep';

const SFX_PROFILES: Record<SfxKind, { freq: number[]; duration: number; type: OscillatorType; gain: number }> = {
  tap: { freq: [800], duration: 0.04, type: 'sine', gain: 0.08 },
  pickup: { freq: [880, 1320], duration: 0.18, type: 'triangle', gain: 0.18 },
  success: { freq: [523, 659, 784], duration: 0.32, type: 'triangle', gain: 0.22 },
  fail: { freq: [220, 165], duration: 0.22, type: 'sine', gain: 0.15 },
  discovery: { freq: [988, 1318, 1568], duration: 0.45, type: 'sine', gain: 0.18 },
  door: { freq: [80, 60], duration: 0.5, type: 'sawtooth', gain: 0.12 },
  whoosh: { freq: [400, 100], duration: 0.4, type: 'sawtooth', gain: 0.08 },
  beep: { freq: [1200], duration: 0.06, type: 'square', gain: 0.1 },
};

export function playSfx(kind: SfxKind): void {
  // Lazy-init audio context on first SFX call (works inside user-gesture chains).
  if (!audioCtx) {
    try {
      const Ctx = window.AudioContext || (window as any).webkitAudioContext;
      audioCtx = new Ctx();
    } catch {
      return;
    }
  }
  if (audioCtx.state === 'suspended') {
    void audioCtx.resume();
  }
  const settings = getSettings();
  const profile = SFX_PROFILES[kind];
  const now = audioCtx.currentTime;
  const noteDuration = profile.duration / profile.freq.length;

  profile.freq.forEach((freq, i) => {
    const osc = audioCtx!.createOscillator();
    const gain = audioCtx!.createGain();
    osc.type = profile.type;
    osc.frequency.setValueAtTime(freq, now + i * noteDuration);

    const startTime = now + i * noteDuration;
    const endTime = startTime + noteDuration;
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(profile.gain * settings.sfxVol, startTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, endTime);

    osc.connect(gain);
    gain.connect(audioCtx!.destination);
    osc.start(startTime);
    osc.stop(endTime + 0.01);
  });
}
