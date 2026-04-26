// COMBINE verb recipes — combine two inventory items → produce a new one (or trigger event).
import type { ItemId } from './items';

export interface Recipe {
  id: string;
  inputs: [ItemId, ItemId];     // order-insensitive
  output: ItemId | null;        // null = pure event trigger
  consumesInputs: boolean;      // if true, both inputs are removed
  message?: string;             // narration when combined
  unlocksFragmentId?: string;   // optional — combining unlocks a carnet fragment
  unlocksFlag?: string;         // optional — sets a save flag
}

export const RECIPES: Recipe[] = [
  {
    id: 'recipe.bracelet_repair',
    inputs: ['bracelet', 'circuit_fragment'] as any, // ItemIds may not yet include these — added in Phase 2
    output: 'bracelet_ok' as any,
    consumesInputs: true,
    message: 'Tu insères le fragment de circuit. Le bracelet bipe doucement, son écran s\'allume.',
  },
  {
    id: 'recipe.fert_lumira',
    inputs: ['fert_b', 'fert_c'] as any,
    output: 'fert_mix' as any,
    consumesInputs: true,
    message: 'Le mélange prend une teinte vert-iridescent. Lumira aimera ça.',
  },
  {
    id: 'recipe.lumira_microscope',
    inputs: ['sample_lumira', 'microscope'] as any,
    output: 'lumira_analysis' as any,
    consumesInputs: false,
    message: 'Au microscope, les cellules de Lumira forment des motifs réguliers. Du jamais vu.',
    unlocksFragmentId: 'ch2.sample_lumira',
  },
  {
    id: 'recipe.bracelet_frequency',
    inputs: ['bracelet_ok', 'frequency_lumira'] as any,
    output: 'bracelet_tuned' as any,
    consumesInputs: false,
    message: 'Le bracelet est accordé. Tu peux maintenant chanter à Lumira.',
  },
  {
    id: 'recipe.seed_water',
    inputs: ['graine_lumira', 'water_drop'] as any,
    output: 'lumira_pocket' as any,
    consumesInputs: true,
    message: 'La graine commence à pulser. Une mini-Lumira pousse dans ta paume.',
  },
];

export function findRecipe(a: string, b: string): Recipe | null {
  return RECIPES.find(
    (r) =>
      (r.inputs[0] === a && r.inputs[1] === b) ||
      (r.inputs[1] === a && r.inputs[0] === b)
  ) ?? null;
}
