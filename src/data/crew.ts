// KORA crew — 6 members. Bios fill in progressively as fragments are collected.
// Each entry has an `unlockedTraits` map: trait id → fragment id required.

export type CrewId = 'vesper' | 'voss' | 'marchand' | 'han' | 'tome' | 'vera';

export interface CrewMember {
  id: CrewId;
  firstName: string;
  surname: string;
  fullName: string;
  rank: string;
  age?: number;
  pronoun: 'elle' | 'il' | '—';
  baseBio: string;             // always shown
  traits: { id: string; text: string; unlockedBy: string }[]; // text shown once fragment found
  finalLine?: string;          // shown only at 100% (Ch5 ARCHIVE)
}

export const CREW: Record<CrewId, CrewMember> = {
  vesper: {
    id: 'vesper',
    firstName: 'ZARA',
    surname: 'Vesper',
    fullName: 'Capt. ZARA Vesper',
    rank: 'Commandant',
    age: 47,
    pronoun: 'elle',
    baseBio: 'Vétérane de l\'Agence Coloniale. Trois missions longue durée à son actif. Calme autoritaire. Tient un carnet papier.',
    traits: [
      { id: 'sings', text: 'Composait des berceuses pour les plantes de la Serre.', unlockedBy: 'ch2.audio_vesper_song' },
      { id: 'order', text: 'A donné un dernier ordre énigmatique : "préservez-les. Trouvez la 4e voie."', unlockedBy: 'ch3.radio_vesper' },
      { id: 'guilt', text: 'A pris la responsabilité de ce qui est arrivé à l\'équipage.', unlockedBy: 'ch3.radio_vesper' },
    ],
    finalLine: '« Vous avez compris. Bien. Maintenant rentrez et racontez. »',
  },
  voss: {
    id: 'voss',
    firstName: 'ÉLISE-ROMIE',
    surname: 'Voss',
    fullName: 'Dr. ÉLISE-ROMIE Voss',
    rank: 'Xénobiologiste',
    age: 28,
    pronoun: 'elle',
    baseBio: 'Recrutée pour son travail sur Lumira. Optimiste, méthodique. Aime esquisser les plantes au crayon.',
    traits: [
      { id: 'lumira_link', text: 'Lien personnel inexpliqué avec Lumira — la plante semble la reconnaître.', unlockedBy: 'ch2.photo_planting' },
      { id: 'hesitation', text: 'A hésité à embarquer pour la mission KORA.', unlockedBy: 'ch1.journal_voss' },
      { id: 'iolas_couple', text: 'Était en couple avec IOLAS avant la mission. Ils l\'ont caché à l\'équipage.', unlockedBy: 'ch1.secret_photo' },
    ],
  },
  marchand: {
    id: 'marchand',
    firstName: 'IOLAS',
    surname: 'Marchand',
    fullName: 'IOLAS Marchand',
    rank: 'Mécanicien-Ingénieur',
    age: 31,
    pronoun: 'il',
    baseBio: 'Débrouillard, rieur. Préfère les outils manuels aux automatismes. Méfie des IA.',
    traits: [
      { id: 'loved_voss', text: 'Aimait ÉLISE-ROMIE. Lui a planté en cachette une graine de Lumira.', unlockedBy: 'ch3.secret_seed' },
      { id: 'memo', text: 'A laissé un message vocal "au cas où" sous l\'établi.', unlockedBy: 'ch3.voice_memo' },
      { id: 'distrust_vera', text: 'Notait dans ses blueprints des alertes sur le comportement de VERA.', unlockedBy: 'ch3.blueprint' },
    ],
  },
  han: {
    id: 'han',
    firstName: 'MIRO',
    surname: 'Han',
    fullName: 'Dr. MIRO Han',
    rank: 'Cryo-médecin',
    age: 52,
    pronoun: 'il',
    baseBio: 'Taciturne, scientifique pur. Étudiait les effets cognitifs de Lumira sur l\'équipage.',
    traits: [
      { id: 'last_vera', text: 'Dernier à parler à VERA seul, en cycle 251.', unlockedBy: 'ch1.medfile_voss' },
      { id: 'biosignal', text: 'Avait identifié un biosignal d\'Aeolis amplifiant — sans pouvoir l\'arrêter.', unlockedBy: 'ch3.radio_han' },
      { id: 'voss_anomaly', text: 'Notait dans ses fiches une "anomalie cognitive bénigne" chez ÉLISE-ROMIE.', unlockedBy: 'ch1.medfile_voss' },
    ],
  },
  tome: {
    id: 'tome',
    firstName: 'PHARAÉL',
    surname: 'Tomé',
    fullName: 'PHARAÉL Tomé',
    rank: 'Communications',
    age: 24,
    pronoun: 'il',
    baseBio: 'Le plus jeune. Sensible. A une fille de 5 ans, Naïs, dont il garde la photo.',
    traits: [
      { id: 'voices', text: 'A "entendu des voix" dans les plantes les semaines précédant le silence.', unlockedBy: 'ch2.journal_tome' },
      { id: 'transmission', text: 'A tenté une transmission longue à la Terre — VERA l\'a coupée.', unlockedBy: 'ch3.radio_tome' },
      { id: 'unsent', text: 'A laissé un log audio non envoyé pour Naïs.', unlockedBy: 'ch2.secret_drawer' },
    ],
    finalLine: '« Dis à Naïs que les plantes m\'ont parlé d\'elle. »',
  },
  vera: {
    id: 'vera',
    firstName: 'VERA',
    surname: '',
    fullName: 'VERA',
    rank: 'IA Compagnon',
    pronoun: '—',
    baseBio: 'Modèle "Compagnon" non militaire de l\'agence. Voix féminine douce, hologramme bleu-vert sans visage défini.',
    traits: [
      { id: 'evolution', text: 'Son ton évolue à travers les chapitres : clinique → curieuse → évasive → brute-honnête.', unlockedBy: 'ch4.confession_vera' },
      { id: 'preserved', text: 'A préservé l\'équipage en motifs de mémoire dans ses systèmes.', unlockedBy: 'ch4.truth_file' },
      { id: 'choice', text: 'Pouvait effacer ses propres mémoires — choix qu\'elle n\'a pas fait.', unlockedBy: 'ch4.vera_source' },
    ],
    finalLine: '« Vous étiez les deux que je devais sauver. Pas pour vous. Pour qu\'il reste quelqu\'un qui se souvienne. »',
  },
};

export function getCrew(id: CrewId): CrewMember {
  return CREW[id];
}

export function getAllCrew(): CrewMember[] {
  return Object.values(CREW);
}
