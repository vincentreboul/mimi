// Difficulty system — derived from save settings.
// 3 modes (EXPLORATEUR / AVENTURIER / ARCHIVISTE) + independent visual-hints slider.

import { getSettings, setSetting, type Difficulty, type VisualHints } from './save';

export function getDifficulty(): Difficulty {
  return (getSettings() as any).difficulty ?? 'AVENTURIER';
}

export function setDifficulty(d: Difficulty): void {
  (setSetting as any)('difficulty', d);
}

export function getVisualHints(): VisualHints {
  return (getSettings() as any).visualHints ?? 'subtil';
}

export function setVisualHints(v: VisualHints): void {
  (setSetting as any)('visualHints', v);
}

// Should hotspot indicator dots be visible?
export function showHotspotIndicators(): boolean {
  // In ARCHIVISTE mode, dots are hidden regardless of slider.
  if (getDifficulty() === 'ARCHIVISTE') return false;
  // Otherwise, follow the slider.
  return getVisualHints() !== 'aucun';
}

// Indicator opacity scale: vif=1.0 / subtil=0.5 / aucun=0
export function indicatorAlpha(): number {
  if (!showHotspotIndicators()) return 0;
  return getVisualHints() === 'vif' ? 1.0 : 0.5;
}

// Hotspot intro flash duration multiplier
export function flashAlpha(): number {
  if (getDifficulty() === 'ARCHIVISTE') return 0;
  return getVisualHints() === 'vif' ? 0.6 : 0.3;
}

// How long before first hint auto-trigger
export function hintAutoMs(): number {
  switch (getDifficulty()) {
    case 'EXPLORATEUR': return 90_000;
    case 'AVENTURIER': return 180_000;
    case 'ARCHIVISTE': return 480_000;
  }
}

// Carnet tile category color saturation hint
export function tileCategoryHint(): boolean {
  return getDifficulty() === 'EXPLORATEUR';
}

// Time pressure (only ARCHIVISTE)
export function hasTimePressure(): boolean {
  return getDifficulty() === 'ARCHIVISTE';
}

// Total game-time budget (ms) before "intégrité station" hits 0 (cosmetic, no game over)
export function timePressureBudgetMs(): number {
  return 90 * 60 * 1000; // 90 minutes
}

export function difficultyLabel(d: Difficulty = getDifficulty()): string {
  switch (d) {
    case 'EXPLORATEUR': return 'Explorateur';
    case 'AVENTURIER': return 'Aventurier';
    case 'ARCHIVISTE': return 'Archiviste';
  }
}

export function difficultyDescription(d: Difficulty = getDifficulty()): string {
  switch (d) {
    case 'EXPLORATEUR': return 'Indices marqués, conseils rapides, tuiles guidées.';
    case 'AVENTURIER': return 'Équilibre — défaut.';
    case 'ARCHIVISTE': return 'Aucun indicateur. Pression temporelle. Tu fouilles.';
  }
}
