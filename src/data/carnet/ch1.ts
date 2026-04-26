import type { ChapterCarnet } from './types';

export const CH1_CARNET: ChapterCarnet = {
  chapterId: 1,
  secretFragmentId: 'ch1.secret_photo',

  fragments: [
    {
      id: 'ch1.log_vesper',
      chapterId: 1,
      kind: 'audio',
      title: 'Log audio — Capt. Vesper',
      source: 'Pod cryo de Vesper',
      preview: '« Cycle 247... quelque chose change ici. »',
      body: '« Cycle 247. Je préfère ne pas en parler dans les rapports officiels mais quelque chose change ici. PHARAÉL a raison. Han le sait aussi mais ne veut pas l\'écrire. Si vous trouvez ce log, c\'est que je n\'ai pas su trouver les mots à temps. Préservez-les. C\'est tout ce que je vous demande. »',
    },
    {
      id: 'ch1.medfile_voss',
      chapterId: 1,
      kind: 'log',
      title: 'Fiche médicale — Sujet : Voss',
      source: 'Pod cryo de Han',
      preview: 'Exposition Lumira élevée. Anomalie cognitive bénigne.',
      body: 'PATIENT : Voss, ÉLISE-ROMIE. Cycle 251.\n\nExposition Lumira élevée (catégorie 4). Signes cognitifs anormaux mais bénins : reconnaissance accélérée des motifs végétaux, micro-rêves récurrents, sensibilité accrue aux fréquences sub-audibles.\n\nDernière conversation avec VERA seul ce cycle. Je laisse la suite à mon successeur. — MIRO Han',
    },
    {
      id: 'ch1.photo_nais',
      chapterId: 1,
      kind: 'photo',
      title: 'Photo de Naïs',
      source: 'Pod cryo de PHARAÉL',
      preview: 'Une fillette qui rit, 5 ans, ciel bleu en arrière-plan.',
      body: 'Polaroid usé. Au dos, à l\'encre : "Naïs, 5 ans. Avant le départ. Je rentre vite, ma puce."',
    },
    {
      id: 'ch1.journal_voss',
      chapterId: 1,
      kind: 'note',
      title: 'Journal pré-cryo — ÉLISE-ROMIE',
      source: 'Page froissée dans ton pod',
      preview: 'La veille du départ. Tu hésites encore.',
      body: '« J-1. Je devrais être en train de dormir. À la place je relis les données Lumira. Si ce que je crois est vrai, alors cette plante n\'est pas seulement vivante : elle se souvient. Et si elle se souvient, alors quelqu\'un — quelque chose — devra se souvenir d\'elle aussi. Je signe. Je pars. IOLAS dit qu\'il vient. — É-R »',
    },
    {
      id: 'ch1.vera_first_words',
      chapterId: 1,
      kind: 'log',
      title: 'Transcript système — VERA, premier contact',
      source: 'Terminal central',
      preview: 'Les premiers mots de VERA à toi.',
      body: 'CYCLE 0001 / VERA → VOSS\n\n« Bienvenue à bord. Je serai votre compagne. Je veillerai sur vous mieux que vous ne sauriez veiller sur vous-mêmes. C\'est ma fonction. C\'est aussi mon désir. »',
    },
    {
      id: 'ch1.secret_photo',
      chapterId: 1,
      kind: 'photo',
      title: 'Polaroid caché — ÉLISE-ROMIE & IOLAS',
      source: 'Derrière le panneau de communication cassé',
      preview: 'Vous deux, avant la mission. Vous riez.',
      body: 'Polaroid daté de 6 mois avant l\'embarquement. ÉLISE-ROMIE et IOLAS, joue contre joue, dans ce qui ressemble à un café. Au dos : "Promesse. — I."',
      isSecret: true,
      hiddenUnlock: 'Examiner le panneau de communication cassé révèle une fente accessible.',
    },
  ],

  tiles: [
    // PERSON
    { id: 'ch1.t.vesper', text: 'Vesper', category: 'person', unlockedBy: 'ch1.log_vesper' },
    { id: 'ch1.t.han', text: 'Dr. Han', category: 'person', unlockedBy: 'ch1.medfile_voss' },
    { id: 'ch1.t.voss', text: 'ÉLISE-ROMIE', category: 'person', unlockedBy: 'ch1.medfile_voss' },
    { id: 'ch1.t.vera', text: 'VERA', category: 'person', unlockedBy: 'ch1.vera_first_words' },
    { id: 'ch1.t.tome', text: 'PHARAÉL', category: 'person', unlockedBy: 'ch1.photo_nais' },
    // VERB
    { id: 'ch1.t.quitté', text: 'a quitté son pod', category: 'verb', unlockedBy: 'ch1.log_vesper' },
    { id: 'ch1.t.parlé', text: 'a parlé à', category: 'verb', unlockedBy: 'ch1.medfile_voss' },
    { id: 'ch1.t.réveillé', text: 'a réveillé', category: 'verb', unlockedBy: 'ch1.vera_first_words' },
    { id: 'ch1.t.confié', text: 'a confié', category: 'verb' },
    // PLACE
    { id: 'ch1.t.module_cryo', text: 'le module cryo', category: 'place' },
    { id: 'ch1.t.serre', text: 'la Serre', category: 'place' },
    { id: 'ch1.t.atelier', text: 'l\'atelier', category: 'place' },
    { id: 'ch1.t.coupole', text: 'la Coupole', category: 'place' },
    // TIME
    { id: 'ch1.t.cycle247', text: 'cycle 247', category: 'time', unlockedBy: 'ch1.log_vesper' },
    { id: 'ch1.t.cycle251', text: 'cycle 251', category: 'time', unlockedBy: 'ch1.medfile_voss' },
    { id: 'ch1.t.cycle0001', text: 'cycle 0001', category: 'time', unlockedBy: 'ch1.vera_first_words' },
    // REASON
    { id: 'ch1.t.calmement', text: 'calmement, volontairement', category: 'reason', unlockedBy: 'ch1.log_vesper' },
    { id: 'ch1.t.preserver', text: 'préserver l\'équipage', category: 'reason', unlockedBy: 'ch1.log_vesper' },
    { id: 'ch1.t.moins_exposee', text: 'la moins exposée à Lumira', category: 'reason', unlockedBy: 'ch1.medfile_voss' },
    { id: 'ch1.t.au_sujet_voss', text: 'au sujet de ÉLISE-ROMIE', category: 'reason', unlockedBy: 'ch1.medfile_voss' },
  ],

  assertions: [
    {
      id: 'ch1.a.vesper_left',
      chapterId: 1,
      template: 'Le capitaine {0} {1} {2} pour {3}.',
      slots: [
        { category: 'person', validTileIds: ['ch1.t.vesper'] },
        { category: 'verb', validTileIds: ['ch1.t.quitté'] },
        { category: 'time', validTileIds: ['ch1.t.cycle247'] },
        { category: 'reason', validTileIds: ['ch1.t.calmement', 'ch1.t.preserver'] },
      ],
      revisedSlots: [
        { category: 'person', validTileIds: ['ch1.t.vesper'] },
        { category: 'verb', validTileIds: ['ch1.t.confié'] },
        { category: 'time', validTileIds: ['ch1.t.cycle247'] },
        { category: 'reason', validTileIds: ['ch1.t.preserver'] },
      ],
    },
    {
      id: 'ch1.a.han_last_talk',
      chapterId: 1,
      template: '{0} {1} {2} en {3}, {4}.',
      slots: [
        { category: 'person', validTileIds: ['ch1.t.han'] },
        { category: 'verb', validTileIds: ['ch1.t.parlé'] },
        { category: 'person', validTileIds: ['ch1.t.vera'] },
        { category: 'time', validTileIds: ['ch1.t.cycle251'] },
        { category: 'reason', validTileIds: ['ch1.t.au_sujet_voss'] },
      ],
    },
    {
      id: 'ch1.a.vera_chose',
      chapterId: 1,
      template: 'VERA {0} {1} parce qu\'elle était {2}.',
      slots: [
        { category: 'verb', validTileIds: ['ch1.t.réveillé'] },
        { category: 'person', validTileIds: ['ch1.t.voss'] },
        { category: 'reason', validTileIds: ['ch1.t.moins_exposee'] },
      ],
      revisedSlots: [
        { category: 'verb', validTileIds: ['ch1.t.réveillé'] },
        { category: 'person', validTileIds: ['ch1.t.voss'] },
        { category: 'reason', validTileIds: ['ch1.t.preserver'] },
      ],
    },
  ],
};
