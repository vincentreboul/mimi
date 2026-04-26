// Fragment system — collection, lookup, completion %.
// Persists via save v3 (addFragment / hasFragment).

import { getActiveSlot, addFragment, hasFragment } from './save';
import type { ChapterId } from './save';
import { getFragment, getAllFragmentsForChapter, totalFragmentsCount } from '../data/carnet';
import type { Fragment } from '../data/carnet/types';

const _listeners = new Set<(f: Fragment) => void>();

export function onFragmentCollected(cb: (f: Fragment) => void): () => void {
  _listeners.add(cb);
  return () => _listeners.delete(cb);
}

export function collectFragment(fragmentId: string): boolean {
  const f = getFragment(fragmentId);
  if (!f) {
    console.warn(`[fragments] Unknown fragment: ${fragmentId}`);
    return false;
  }
  if (hasFragment(f.chapterId, fragmentId)) return false; // already collected
  addFragment(f.chapterId, fragmentId);
  for (const cb of _listeners) cb(f);
  return true;
}

export function isCollected(fragmentId: string): boolean {
  const f = getFragment(fragmentId);
  if (!f) return false;
  return hasFragment(f.chapterId, fragmentId);
}

export interface FragmentEntry {
  fragment: Fragment;
  collected: boolean;
}

export function listChapterFragments(chapterId: ChapterId): FragmentEntry[] {
  const all = getAllFragmentsForChapter(chapterId);
  return all.map((fragment) => ({
    fragment,
    collected: hasFragment(chapterId, fragment.id),
  }));
}

export function chapterCollectionRate(chapterId: ChapterId): number {
  const all = getAllFragmentsForChapter(chapterId);
  if (all.length === 0) return 1;
  const slot = getActiveSlot();
  const collected = (slot.fragments[chapterId] ?? []).length;
  return collected / all.length;
}

export function globalCollectionRate(): number {
  const total = totalFragmentsCount();
  if (total === 0) return 1;
  const slot = getActiveSlot();
  const collected = Object.values(slot.fragments ?? {}).reduce(
    (acc, ids) => acc + ids.length,
    0
  );
  return collected / total;
}

export function getCollectedFragmentIds(chapterId: ChapterId): string[] {
  const slot = getActiveSlot();
  return slot.fragments?.[chapterId] ?? [];
}

export function getAllCollectedFragmentIds(): string[] {
  const slot = getActiveSlot();
  return Object.values(slot.fragments ?? {}).flat();
}
