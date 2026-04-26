import { DIALOGUE_FR } from '../data/dialogue.fr';
import { getPlayer } from './save';

export type Lang = 'fr' | 'en';

let currentLang: Lang = 'fr';

export function setLang(l: Lang): void {
  currentLang = l;
}

/** Apply gender accord to phrases like "prêt·e" based on player gender. */
function applyGender(text: string): string {
  const g = getPlayer().gender;
  // Pattern: "racine·e" → "racine" (m), "racinee" (f) — but our suffixes are usually 1 char
  // Examples: prêt·e → prêt / prête / prêt·e (nb)
  return text.replaceAll(/([a-zàéèêîùçA-Z]+)·([a-z]+)/g, (_, root, suffix) => {
    if (g === 'm') return root;
    if (g === 'f') return root + suffix;
    return root + '·' + suffix; // non-binary keeps inclusive form
  });
}

export function t(key: string, vars?: Record<string, string | number>): string {
  const dict = currentLang === 'fr' ? DIALOGUE_FR : DIALOGUE_FR; // EN later
  let str = dict[key] ?? `[${key}]`;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      str = str.replaceAll(`{${k}}`, String(v));
    }
  }
  str = applyGender(str);
  return str;
}

// Helper: typewriter-friendly dialogue chunks
export function tLines(key: string): string[] {
  const text = t(key);
  return text.split('\n').map((s) => s.trim()).filter(Boolean);
}
