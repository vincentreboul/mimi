// Item registry — each item has metadata + optional recipe (combine).
// Icons are emoji for V1 (no asset pipeline needed).

export type ItemId =
  // Chapter 1 — Cryo
  | 'bracelet'
  | 'badge'
  | 'note_leah'
  | 'cryo_schema'
  | 'cryo_key'
  // Chapter 2 — Serre
  | 'pince'
  | 'fert_a'
  | 'fert_b'
  | 'fert_c'
  | 'fert_d'
  | 'fert_mix'
  | 'note_botanique'
  | 'graine_rare'
  // Chapter 3 — Atelier
  | 'tournevis'
  | 'comp_resistor'
  | 'comp_capa'
  | 'comp_diode'
  | 'comp_led'
  | 'circuit_ok'
  | 'cle_atelier'
  // Chapter 4 — Coupole
  | 'cristal_a'
  | 'cristal_b'
  | 'log_capitaine';

export interface ItemMeta {
  id: ItemId;
  name: string;
  desc: string;
  icon: string; // emoji/glyph for V1
  recipe?: [ItemId, ItemId]; // ingredients to produce this
}

export const ITEMS: Record<ItemId, ItemMeta> = {
  // === Chapter 1 ===
  bracelet: {
    id: 'bracelet',
    name: 'Bracelet de Léa',
    desc: 'Le bracelet de ta mère. Tu te souviens qu\'elle ne le quittait jamais. Une date est gravée à l\'intérieur : 14.03.78.',
    icon: '⊙',
  },
  badge: {
    id: 'badge',
    name: 'Badge Stagiaire',
    desc: 'Ton badge d\'accès, niveau 1. "Mimi R. — Stagiaire Bio." Bizarre, on dirait qu\'il a déjà été utilisé.',
    icon: '▭',
  },
  note_leah: {
    id: 'note_leah',
    name: 'Note manuscrite',
    desc: 'Écriture de ta mère. "Si tu lis ceci, regarde la photo. Le code, c\'est nous deux."',
    icon: '✉',
  },
  cryo_schema: {
    id: 'cryo_schema',
    name: 'Schéma cryo',
    desc: 'Plan technique des cryo-pods. La séquence d\'ouverture nécessite un code 4 chiffres.',
    icon: '◎',
  },
  cryo_key: {
    id: 'cryo_key',
    name: 'Clé d\'accès Serre',
    desc: 'Délivrée par le terminal cryo. Cylindre métallique chaud au toucher.',
    icon: '⚷',
  },

  // === Chapter 2 ===
  pince: {
    id: 'pince',
    name: 'Pince à plantes',
    desc: 'Outil de jardinage en laiton. Bien équilibré.',
    icon: '✂',
  },
  fert_a: {
    id: 'fert_a',
    name: 'Fertilisant A — Phosphate',
    desc: 'Étiquette bleue. Renforce les racines.',
    icon: '◐',
  },
  fert_b: {
    id: 'fert_b',
    name: 'Fertilisant B — Azote',
    desc: 'Étiquette verte. Stimule la croissance des feuilles.',
    icon: '◑',
  },
  fert_c: {
    id: 'fert_c',
    name: 'Fertilisant C — Potasse',
    desc: 'Étiquette orange. Aide à la floraison.',
    icon: '◒',
  },
  fert_d: {
    id: 'fert_d',
    name: 'Fertilisant D — Calcium',
    desc: 'Étiquette grise. Solidifie les tiges.',
    icon: '◓',
  },
  fert_mix: {
    id: 'fert_mix',
    name: 'Mélange nutritif',
    desc: 'Combinaison finale. Une fragrance verte, presque sucrée.',
    icon: '✦',
    recipe: ['fert_b', 'fert_c'], // base — atelier-like crafting
  },
  note_botanique: {
    id: 'note_botanique',
    name: 'Note botanique',
    desc: 'Léa écrit : "La Lumira a besoin d\'azote (feuilles) et potasse (fleur). Pas de phosphate ni de calcium — toxique pour elle."',
    icon: '✿',
  },
  graine_rare: {
    id: 'graine_rare',
    name: 'Graine de Lumira',
    desc: 'Une graine bioluminescente. Très rare. Léa l\'avait sauvée elle-même.',
    icon: '⁂',
  },

  // === Chapter 3 ===
  tournevis: {
    id: 'tournevis',
    name: 'Tournevis multitête',
    desc: 'Outil de base de l\'atelier.',
    icon: '⚒',
  },
  comp_resistor: {
    id: 'comp_resistor',
    name: 'Résistance 100Ω',
    desc: 'Petit cylindre rayé. Limite le courant.',
    icon: '▬',
  },
  comp_capa: {
    id: 'comp_capa',
    name: 'Condensateur',
    desc: 'Stocke une charge brève. Marqué 47µF.',
    icon: '⊟',
  },
  comp_diode: {
    id: 'comp_diode',
    name: 'Diode',
    desc: 'Laisse passer le courant dans un seul sens.',
    icon: '▷',
  },
  comp_led: {
    id: 'comp_led',
    name: 'LED ambrée',
    desc: 'Le voyant final. Doit s\'allumer une fois le circuit complet.',
    icon: '◉',
  },
  circuit_ok: {
    id: 'circuit_ok',
    name: 'Circuit réparé',
    desc: 'Le circuit fonctionne. La LED ambre brille faiblement.',
    icon: '✚',
  },
  cle_atelier: {
    id: 'cle_atelier',
    name: 'Clé Coupole',
    desc: 'Délivrée par le terminal atelier réactivé. Lourde, dorée.',
    icon: '⚿',
  },

  // === Chapter 4 ===
  cristal_a: {
    id: 'cristal_a',
    name: 'Cristal d\'orientation A',
    desc: 'Géométrie hexagonale. Léger reflet bleu.',
    icon: '◇',
  },
  cristal_b: {
    id: 'cristal_b',
    name: 'Cristal d\'orientation B',
    desc: 'Géométrie pentagonale. Léger reflet ambre.',
    icon: '◈',
  },
  log_capitaine: {
    id: 'log_capitaine',
    name: 'Journal du capitaine',
    desc: 'Le dernier message de l\'équipage avant leur départ. Tu n\'es pas prête à le lire seule.',
    icon: '✦',
  },
};

export function itemName(id: ItemId): string {
  return ITEMS[id]?.name ?? id;
}

export function itemDesc(id: ItemId): string {
  return ITEMS[id]?.desc ?? '';
}

export function itemIcon(id: ItemId): string {
  return ITEMS[id]?.icon ?? '?';
}
