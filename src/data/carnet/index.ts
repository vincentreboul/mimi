// Carnet registry — central access to all chapter data.

import type { ChapterCarnet, Fragment, Assertion, Tile } from './types';
import { CH1_CARNET } from './ch1';
import { CH2_CARNET } from './ch2';
import { CH3_CARNET } from './ch3';
import { CH4_CARNET } from './ch4';
import { CH5_CARNET } from './ch5';
import type { ChapterId } from '../../systems/save';

export const ALL_CARNETS: Record<ChapterId, ChapterCarnet> = {
  1: CH1_CARNET,
  2: CH2_CARNET,
  3: CH3_CARNET,
  4: CH4_CARNET,
  5: CH5_CARNET,
};

export function getChapterCarnet(id: ChapterId): ChapterCarnet {
  return ALL_CARNETS[id];
}

export function getFragment(fragmentId: string): Fragment | null {
  for (const ch of Object.values(ALL_CARNETS)) {
    const f = ch.fragments.find((x) => x.id === fragmentId);
    if (f) return f;
  }
  return null;
}

export function getAssertion(assertionId: string): Assertion | null {
  for (const ch of Object.values(ALL_CARNETS)) {
    const a = ch.assertions.find((x) => x.id === assertionId);
    if (a) return a;
  }
  return null;
}

export function getTile(tileId: string): Tile | null {
  for (const ch of Object.values(ALL_CARNETS)) {
    const t = ch.tiles.find((x) => x.id === tileId);
    if (t) return t;
  }
  return null;
}

export function getAllAssertionsForChapter(id: ChapterId): Assertion[] {
  return ALL_CARNETS[id]?.assertions ?? [];
}

export function getAllFragmentsForChapter(id: ChapterId): Fragment[] {
  return ALL_CARNETS[id]?.fragments ?? [];
}

// All tiles "available" given collected fragments.
// A tile is available if no `unlockedBy`, OR its required fragment is collected.
export function getAvailableTiles(chapterId: ChapterId, collectedFragmentIds: string[]): Tile[] {
  const ch = ALL_CARNETS[chapterId];
  if (!ch) return [];
  return ch.tiles.filter((t) => !t.unlockedBy || collectedFragmentIds.includes(t.unlockedBy));
}

// Total tile count, useful for completion %
export function totalAssertionsCount(): number {
  return Object.values(ALL_CARNETS).reduce((acc, ch) => acc + ch.assertions.length, 0);
}

export function totalFragmentsCount(): number {
  return Object.values(ALL_CARNETS).reduce((acc, ch) => acc + ch.fragments.length, 0);
}

export type { ChapterCarnet, Fragment, Assertion, Tile, FragmentKind, TileCategory } from './types';
