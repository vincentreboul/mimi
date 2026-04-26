// Achievements — grant once, persist via save v3.

import { getActiveSlot, addAchievement, hasAchievement } from './save';
import { ACHIEVEMENTS, getAchievement, type Achievement } from '../data/achievements';

const _listeners = new Set<(a: Achievement) => void>();

export function onAchievementUnlocked(cb: (a: Achievement) => void): () => void {
  _listeners.add(cb);
  return () => _listeners.delete(cb);
}

export function grant(id: string): boolean {
  const def = getAchievement(id);
  if (!def) {
    console.warn(`[achievements] Unknown id: ${id}`);
    return false;
  }
  if (hasAchievement(id)) return false;
  addAchievement(id);
  for (const cb of _listeners) cb(def);
  return true;
}

export function isUnlocked(id: string): boolean {
  return hasAchievement(id);
}

export function getAllUnlocked(): Achievement[] {
  const slot = getActiveSlot();
  return ACHIEVEMENTS.filter((a) => slot.achievements?.includes(a.id));
}

export function getProgress(): { unlocked: number; total: number } {
  const slot = getActiveSlot();
  return {
    unlocked: (slot.achievements ?? []).length,
    total: ACHIEVEMENTS.length,
  };
}
