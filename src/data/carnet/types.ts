// Carnet system — types for fragments, assertions, tiles.
// All content is data-driven from src/data/carnet/ch{1..5}.ts

import type { ChapterId } from '../../systems/save';

export type FragmentKind = 'audio' | 'photo' | 'log' | 'sample' | 'note' | 'misc';

export interface Fragment {
  id: string;                 // unique e.g. 'ch1.log_vesper'
  chapterId: ChapterId;
  kind: FragmentKind;
  title: string;              // short label
  source: string;             // where found (narrative)
  preview: string;            // 1-line teaser shown in carnet list
  body: string;               // full content shown when opened
  isSecret?: boolean;         // hidden from default progression
  hiddenUnlock?: string;      // narrative hint at how to find
}

// Tiles are word/concept chips dragged into assertion slots.
export type TileCategory = 'person' | 'verb' | 'place' | 'time' | 'reason' | 'object';

export interface Tile {
  id: string;                 // 'ch1.tile.vesper'
  text: string;               // 'Vesper'
  category: TileCategory;
  unlockedBy?: string;        // fragmentId — tile appears once that fragment is collected
}

export interface AssertionSlotDef {
  category: TileCategory;
  validTileIds: string[];     // any of these placed → slot accepts (allows nuance)
  hint?: string;              // shown on long-press
}

export interface Assertion {
  id: string;                 // 'ch1.assert.vesper_left'
  chapterId: ChapterId;
  // Template uses {0}..{n} placeholders. Display order = slot index.
  template: string;
  slots: AssertionSlotDef[];
  // Some assertions get revised at Ch4 (recontextualization).
  // When recontextualization is active, validTileIds in revisedSlots become the new acceptance set.
  revisedSlots?: AssertionSlotDef[];
}

export interface ChapterCarnet {
  chapterId: ChapterId;
  fragments: Fragment[];
  tiles: Tile[];
  assertions: Assertion[];
  // Secret fragment — id, plus the narrative hint for finding it.
  secretFragmentId?: string;
}
