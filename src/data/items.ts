// Item registry — each item has metadata + optional recipe (combine).
// Icons are emoji for V1 (no asset pipeline needed).

export type ItemId =
  // Chapter 1 — Cryo
  | 'bracelet'
  | 'bracelet_ok'           // v2 — repaired bracelet
  | 'bracelet_tuned'        // v2 — tuned to Lumira frequency
  | 'circuit_fragment'      // v2 — small piece from PHARAÉL pod
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
  | 'sample_lumira'         // v2 — Lumira leaf sample
  | 'microscope'            // v2 — Han's microscope
  | 'lumira_analysis'       // v2 — analysis result
  | 'frequency_lumira'      // v2 — frequency value learned
  | 'kael_drawer_key'       // v2 — key to PHARAÉL drawer
  // Chapter 3 — Atelier
  | 'tournevis'
  | 'comp_resistor'
  | 'comp_capa'
  | 'comp_diode'
  | 'comp_led'
  | 'circuit_ok'
  | 'cle_atelier'
  | 'graine_lumira'         // v2 — secret seed from IOLAS
  | 'water_drop'            // v2 — water drop for the seed
  | 'lumira_pocket'         // v2 — pocket Lumira (souvenir)
  | 'voice_recorder'        // v2 — IOLAS voice memo recorder
  // Chapter 4 — Coupole
  | 'cristal_a'
  | 'cristal_b'
  | 'cristal_c'             // v2 — third constellation crystal
  | 'log_capitaine'
  | 'truth_file';           // v2 — Han's compiled file

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
    name: 'Montre cassée',
    desc: 'Une montre dont les aiguilles sont gelées. Cadeau d\'embarquement, peut-être.',
    icon: '◷',
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
    name: 'Cadre photo',
    desc: 'Cadre en laiton. À l\'intérieur, l\'équipe au premier jour. Au dos : "14.03.2064".',
    icon: '▭',
  },
  cryo_key: {
    id: 'cryo_key',
    name: 'Clé Serre',
    desc: 'Cylindre métallique chaud au toucher. Délivré par le terminal cryo.',
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
    desc: 'Le dernier message de Vesper. "Préservez-les. Trouvez la 4e voie."',
    icon: '✦',
  },

  // === v2 additions ===
  bracelet_ok: {
    id: 'bracelet_ok',
    name: 'Bracelet comm',
    desc: 'Le bracelet réparé. Petit écran fonctionnel, communique avec VERA.',
    icon: '◉',
    recipe: ['bracelet', 'circuit_fragment'],
  },
  bracelet_tuned: {
    id: 'bracelet_tuned',
    name: 'Bracelet accordé',
    desc: 'Bracelet accordé à la fréquence de Lumira. Tu peux maintenant chanter à la plante.',
    icon: '◎',
    recipe: ['bracelet_ok', 'frequency_lumira'],
  },
  circuit_fragment: {
    id: 'circuit_fragment',
    name: 'Fragment de circuit',
    desc: 'Petit composant trouvé dans le pod de PHARAÉL. Compatible avec ton bracelet.',
    icon: '⊟',
  },
  sample_lumira: {
    id: 'sample_lumira',
    name: 'Échantillon Lumira',
    desc: 'Une feuille de Lumira. Tiède au toucher, comme vivante.',
    icon: '✿',
  },
  microscope: {
    id: 'microscope',
    name: 'Microscope',
    desc: 'Microscope de Han. Pour analyser les samples.',
    icon: '◉',
  },
  lumira_analysis: {
    id: 'lumira_analysis',
    name: 'Analyse Lumira',
    desc: 'Les cellules de Lumira forment des motifs réguliers. Aucune classification terrestre.',
    icon: '⌬',
  },
  frequency_lumira: {
    id: 'frequency_lumira',
    name: 'Fréquence Lumira',
    desc: 'La fréquence à laquelle Lumira répond. 7,3 Hz.',
    icon: '〜',
  },
  kael_drawer_key: {
    id: 'kael_drawer_key',
    name: 'Clé du tiroir de PHARAÉL',
    desc: 'Petite clé en cuivre, trouvée dans son pod cryo.',
    icon: '⚷',
  },
  graine_lumira: {
    id: 'graine_lumira',
    name: 'Graine de Lumira (cachée)',
    desc: 'La graine qu\'IOLAS a planté pour toi. Pulse faiblement.',
    icon: '◌',
  },
  water_drop: {
    id: 'water_drop',
    name: 'Goutte d\'eau',
    desc: 'Une goutte d\'eau de la Serre.',
    icon: '◐',
  },
  lumira_pocket: {
    id: 'lumira_pocket',
    name: 'Lumira de poche',
    desc: 'Une mini-Lumira que tu portes avec toi. Souvenir d\'IOLAS.',
    icon: '✿',
    recipe: ['graine_lumira', 'water_drop'],
  },
  voice_recorder: {
    id: 'voice_recorder',
    name: 'Enregistreur vocal',
    desc: 'L\'enregistreur d\'IOLAS. Contient son dernier message pour toi.',
    icon: '⏵',
  },
  cristal_c: {
    id: 'cristal_c',
    name: 'Cristal d\'orientation C',
    desc: 'Géométrie octogonale. Reflet violet.',
    icon: '◊',
  },
  truth_file: {
    id: 'truth_file',
    name: 'Le fichier vérité',
    desc: 'Tout ce que Han a compris du biosignal d\'Aeolis.',
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
