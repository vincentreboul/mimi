// Puzzle definitions — IDs, hint configs, and validators.
import type { HintConfig } from '../systems/hint';
import { t } from '../systems/narrative';
import type { ItemId } from './items';

export const PUZZLE_IDS = {
  ch1Code: 'ch1.cryo_code',
  ch2Fert: 'ch2.fertilizer',
  ch2Cards: 'ch2.botanical_cards',
  ch3Circuit: 'ch3.circuit',
  ch4Crystals: 'ch4.crystals',
} as const;

export function hintConfig(puzzleId: string): HintConfig {
  switch (puzzleId) {
    case PUZZLE_IDS.ch1Code:
      return {
        puzzleId,
        tiers: [
          { text: t('hint.ch1.t1') },
          { text: t('hint.ch1.t2'), visualCue: 'bracelet' },
          { text: t('hint.ch1.t3') },
        ],
      };
    case PUZZLE_IDS.ch2Fert:
      return {
        puzzleId,
        tiers: [
          { text: t('hint.ch2.t1') },
          { text: t('hint.ch2.t2') },
          { text: t('hint.ch2.t3') },
        ],
      };
    case PUZZLE_IDS.ch3Circuit:
      return {
        puzzleId,
        tiers: [
          { text: t('hint.ch3.t1') },
          { text: t('hint.ch3.t2') },
          { text: t('hint.ch3.t3') },
        ],
      };
    case PUZZLE_IDS.ch4Crystals:
      return {
        puzzleId,
        tiers: [
          { text: t('hint.ch4.t1') },
          { text: t('hint.ch4.t2') },
          { text: t('hint.ch4.t3') },
        ],
      };
    default:
      return { puzzleId, tiers: [{ text: '...' }, { text: '...' }, { text: '...' }] };
  }
}

// Solutions
export const SOLUTIONS = {
  ch1Code: '1403',
  ch2Fert: ['fert_b', 'fert_c'] as ItemId[],
  ch3Circuit: ['comp_resistor', 'comp_capa', 'comp_diode', 'comp_led'] as ItemId[],
  ch4Crystals: { left: 'cristal_a', center: 'cristal_b', right: 'cristal_c' } as Record<
    'left' | 'center' | 'right',
    ItemId
  >,
};
