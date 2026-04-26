// Assertion engine — tracks tile placements, validates, persists.
// Persists via save v3 (setAssertion / getAssertion).

import {
  getActiveSlot,
  setAssertion as saveAssertionState,
  getAssertion as loadAssertionState,
  setProgress,
} from './save';
import type { ChapterId } from './save';
import {
  getAssertion as getAssertionDef,
  getAllAssertionsForChapter,
  totalAssertionsCount,
} from '../data/carnet';
import type { Assertion, AssertionSlotDef } from '../data/carnet/types';

const _listeners = new Set<(assertionId: string, locked: boolean) => void>();

export function onAssertionChange(
  cb: (assertionId: string, locked: boolean) => void
): () => void {
  _listeners.add(cb);
  return () => _listeners.delete(cb);
}

export interface AssertionState {
  tiles: string[];   // tileId per slot, '' = empty
  locked: boolean;
  revised: boolean;
}

export function getAssertionState(assertionId: string): AssertionState {
  const def = getAssertionDef(assertionId);
  if (!def) return { tiles: [], locked: false, revised: false };
  const stored = loadAssertionState(assertionId);
  if (stored) {
    return {
      tiles: stored.tiles,
      locked: stored.locked,
      revised: stored.revised ?? false,
    };
  }
  return {
    tiles: new Array(def.slots.length).fill(''),
    locked: false,
    revised: false,
  };
}

export function placeTile(
  assertionId: string,
  slotIndex: number,
  tileId: string
): { ok: boolean; locks: boolean } {
  const def = getAssertionDef(assertionId);
  if (!def) return { ok: false, locks: false };
  const state = getAssertionState(assertionId);
  if (state.locked) return { ok: false, locks: false };

  const activeSlots = state.revised && def.revisedSlots ? def.revisedSlots : def.slots;
  const slot = activeSlots[slotIndex];
  if (!slot) return { ok: false, locks: false };

  // Slot acceptance: tileId must be in validTileIds.
  // (Categories are advisory hints; the engine just checks valid IDs.)
  if (!slot.validTileIds.includes(tileId)) {
    return { ok: false, locks: false };
  }

  state.tiles[slotIndex] = tileId;

  // Check full assertion validity — all slots filled with valid tiles.
  const allValid = activeSlots.every(
    (s, i) => state.tiles[i] && s.validTileIds.includes(state.tiles[i])
  );
  state.locked = allValid;

  saveAssertionState(assertionId, state.tiles, state.locked, state.revised);

  if (state.locked) {
    setProgress(`assertion.${assertionId}`);
    for (const cb of _listeners) cb(assertionId, true);
  }
  return { ok: true, locks: state.locked };
}

export function unplaceTile(assertionId: string, slotIndex: number): void {
  const state = getAssertionState(assertionId);
  if (state.locked) {
    // Allow unlock for revision (Ch4 recontextualization)
    state.locked = false;
  }
  state.tiles[slotIndex] = '';
  saveAssertionState(assertionId, state.tiles, state.locked, state.revised);
  for (const cb of _listeners) cb(assertionId, false);
}

export function isLocked(assertionId: string): boolean {
  return getAssertionState(assertionId).locked;
}

export function isRevised(assertionId: string): boolean {
  return getAssertionState(assertionId).revised;
}

// Triggered when player collects 'ch4.confession_vera' fragment.
// Marks ALL assertions with revisedSlots as "needs revision" (visual: red).
// Player must re-place tiles to lock them again under the new validation set.
export function markRecontextualization(): void {
  const slot = getActiveSlot();
  for (const ch of [1, 2, 3] as ChapterId[]) {
    const assertions = getAllAssertionsForChapter(ch);
    for (const a of assertions) {
      if (!a.revisedSlots) continue;
      const state = getAssertionState(a.id);
      // Unlock so player must revise
      saveAssertionState(a.id, state.tiles, false, true);
      for (const cb of _listeners) cb(a.id, false);
    }
  }
}

export function chapterCompletionRate(chapterId: ChapterId): number {
  const all = getAllAssertionsForChapter(chapterId);
  if (all.length === 0) return 1;
  const lockedCount = all.filter((a) => isLocked(a.id)).length;
  return lockedCount / all.length;
}

export function globalCompletionRate(): number {
  const total = totalAssertionsCount();
  if (total === 0) return 1;
  let locked = 0;
  for (const ch of [1, 2, 3, 4, 5] as ChapterId[]) {
    locked += getAllAssertionsForChapter(ch).filter((a) => isLocked(a.id)).length;
  }
  return locked / total;
}

// Useful for ascension ending gate
export function chapterAllLocked(chapterId: ChapterId): boolean {
  const all = getAllAssertionsForChapter(chapterId);
  return all.length > 0 && all.every((a) => isLocked(a.id));
}
