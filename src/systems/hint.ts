import { incFlag, getSettings } from './save';
import { STUCK_T1_MS, STUCK_T2_MS, STUCK_T3_MS } from '../config';

export interface HintTier {
  text: string;
  visualCue?: string; // optional hotspot key to glow
}

export interface HintConfig {
  puzzleId: string;
  tiers: HintTier[]; // length 3
}

interface PuzzleHintState {
  startedAt: number;
  tierUsed: number; // 0 = none used yet
  taps: number;
  inventoryOpens: number;
}

const states: Map<string, PuzzleHintState> = new Map();

export function startPuzzle(puzzleId: string): void {
  if (states.has(puzzleId)) return;
  states.set(puzzleId, {
    startedAt: Date.now(),
    tierUsed: 0,
    taps: 0,
    inventoryOpens: 0,
  });
}

export function endPuzzle(puzzleId: string): void {
  states.delete(puzzleId);
}

export function recordTap(puzzleId: string): void {
  const s = states.get(puzzleId);
  if (s) s.taps += 1;
}

export function recordInventoryOpen(puzzleId: string): void {
  const s = states.get(puzzleId);
  if (s) s.inventoryOpens += 1;
}

export function getStuckTier(puzzleId: string): 0 | 1 | 2 | 3 {
  const s = states.get(puzzleId);
  if (!s) return 0;
  const elapsed = Date.now() - s.startedAt;
  if (elapsed >= STUCK_T3_MS) return 3;
  if (elapsed >= STUCK_T2_MS) return 2;
  if (elapsed >= STUCK_T1_MS || s.inventoryOpens >= 4) return 1;
  return 0;
}

export function getTierUsed(puzzleId: string): number {
  return states.get(puzzleId)?.tierUsed ?? 0;
}

export function nextHint(config: HintConfig): HintTier | null {
  const s = states.get(config.puzzleId);
  if (!s) return null;
  const settings = getSettings();
  const offset = settings.hintLevel === 'plus' ? 0 : settings.hintLevel === 'minus' ? 1 : 0;

  const next = Math.max(s.tierUsed, offset);
  if (next >= config.tiers.length) return null;
  s.tierUsed = next + 1;
  incFlag('hintsUsed', 1);
  return config.tiers[next];
}

export function canShowSkip(puzzleId: string): boolean {
  const s = states.get(puzzleId);
  if (!s) return false;
  return s.tierUsed >= 3 || (Date.now() - s.startedAt >= STUCK_T3_MS);
}
