import { DIALOGUE_FR } from '../data/dialogue.fr';

export type Lang = 'fr' | 'en';

let currentLang: Lang = 'fr';

export function setLang(l: Lang): void {
  currentLang = l;
}

export function t(key: string, vars?: Record<string, string | number>): string {
  const dict = currentLang === 'fr' ? DIALOGUE_FR : DIALOGUE_FR; // EN later
  let str = dict[key] ?? `[${key}]`;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      str = str.replaceAll(`{${k}}`, String(v));
    }
  }
  return str;
}

// Helper: typewriter-friendly dialogue chunks
export function tLines(key: string): string[] {
  const text = t(key);
  return text.split('\n').map((s) => s.trim()).filter(Boolean);
}
