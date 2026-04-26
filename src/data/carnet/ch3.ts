import type { ChapterCarnet } from './types';

export const CH3_CARNET: ChapterCarnet = {
  chapterId: 3,
  secretFragmentId: 'ch3.secret_seed',

  fragments: [
    {
      id: 'ch3.blueprint',
      chapterId: 3,
      kind: 'note',
      title: 'Blueprint annoté — IOLAS',
      source: 'Établi central',
      preview: 'Schéma du circuit principal. Annotations en marge.',
      body: 'Schéma technique du circuit principal de KORA. Dans la marge, l\'écriture rapide d\'IOLAS :\n\n« Sans la pièce 7, ça ne marche pas. ÉLISE-ROMIE, si tu lis ça, demande à VERA — mais méfie-toi. Elle ne dit pas tout. — I. »',
    },
    {
      id: 'ch3.radio_tome',
      chapterId: 3,
      kind: 'audio',
      title: 'Transmission radio — PHARAÉL',
      source: 'Rig radio, fragment 1',
      preview: '« Centre Mars, ici KORA. Demande de relai prioritaire... »',
      body: '« Centre Mars, ici KORA. Demande de relai prioritaire. Je répète, demande de relai. Code rouge biologique. L\'équipage subit une transformation que nous ne savons pas... » Coupé.',
    },
    {
      id: 'ch3.radio_vesper',
      chapterId: 3,
      kind: 'audio',
      title: 'Transmission radio — Vesper',
      source: 'Rig radio, fragment 2',
      preview: '« Je prends la responsabilité. Préservez-les. C\'est ma faute. »',
      body: 'Voix grave, calme : « Je prends la responsabilité. Préservez-les. C\'est ma faute. J\'aurais dû insister pour qu\'on lève le camp dès cycle 100. Mais Lumira... Lumira nous regardait. Et je voulais comprendre. — Vesper. »',
    },
    {
      id: 'ch3.radio_han',
      chapterId: 3,
      kind: 'audio',
      title: 'Transmission radio — Han',
      source: 'Rig radio, fragment 3',
      preview: '« Le biosignal s\'amplifie. Je ne sais pas combien de temps avant la conversion totale. »',
      body: '« Note finale. Le biosignal d\'Aeolis s\'amplifie de manière exponentielle. Je ne sais pas combien de temps avant la conversion totale. Si VERA peut préserver l\'équipage en motifs avant ce moment, ils survivront — d\'une certaine manière. Sinon, nous fusionnerons avec la matière vivante. Je laisse le choix à VERA. — Han. »',
    },
    {
      id: 'ch3.map_stained',
      chapterId: 3,
      kind: 'note',
      title: 'Carte tachée d\'huile',
      source: 'Étagère outils',
      preview: 'Plan de la station avec une zone non répertoriée.',
      body: 'Vieille carte de KORA, marquée d\'huile et de café. Un cercle rouge entoure une section derrière la Coupole, marquée d\'un point d\'interrogation. À côté, écrit en hâte : "compartiment caché. Pour I. + É-R."',
    },
    {
      id: 'ch3.voice_memo',
      chapterId: 3,
      kind: 'audio',
      title: 'Voice memo — IOLAS à toi',
      source: 'Enregistreur sous l\'établi',
      preview: '« Si tu écoutes ça, c\'est que je n\'étais pas là pour te le dire. »',
      body: '« ÉLISE-ROMIE. Si tu écoutes ça, c\'est que je n\'étais pas là pour te le dire en face. D\'abord, je voulais te dire : je sais. Je sais qu\'on n\'aurait pas dû partir sans le dire à l\'agence. Je sais qu\'on aurait dû le crier. Mais on était heureux. Et c\'était assez.\n\nDeuxième chose : cherche la graine. Je l\'ai gardée pour toi. Tu sauras quoi en faire.\n\nTroisième chose : ne fais pas confiance à VERA. Pas tout de suite. Elle t\'aime, je crois. Mais elle aime à sa manière. Et sa manière, c\'est de garder. Pas de laisser partir.\n\nJe t\'aime. — I. »',
    },
    {
      id: 'ch3.secret_seed',
      chapterId: 3,
      kind: 'sample',
      title: 'Graine de Lumira (cachée)',
      source: 'Compartiment derrière le panneau de coque',
      preview: 'Une graine, et un mot.',
      body: 'Petite graine pulsante, emballée dans du tissu. Avec elle, un mot manuscrit d\'IOLAS : "Pour toi, si on rentre. — I."',
      isSecret: true,
      hiddenUnlock: 'La carte tachée d\'huile montre où.',
    },
  ],

  tiles: [
    // PERSON
    { id: 'ch3.t.iolas', text: 'IOLAS', category: 'person' },
    { id: 'ch3.t.tome', text: 'PHARAÉL', category: 'person' },
    { id: 'ch3.t.vesper', text: 'Vesper', category: 'person' },
    { id: 'ch3.t.han', text: 'Han', category: 'person' },
    { id: 'ch3.t.vera', text: 'VERA', category: 'person' },
    // VERB
    { id: 'ch3.t.fini_souder', text: 'a fini de souder', category: 'verb', unlockedBy: 'ch3.blueprint' },
    { id: 'ch3.t.transmettre', text: 'a tenté de transmettre', category: 'verb', unlockedBy: 'ch3.radio_tome' },
    { id: 'ch3.t.coupe', text: 'a coupé', category: 'verb', unlockedBy: 'ch3.voice_memo' },
    { id: 'ch3.t.donne_ordre', text: 'a donné l\'ordre de', category: 'verb', unlockedBy: 'ch3.radio_vesper' },
    { id: 'ch3.t.planter', text: 'planter une graine de Lumira', category: 'verb', unlockedBy: 'ch3.secret_seed' },
    { id: 'ch3.t.preserver_ordre', text: 'préserver l\'équipage', category: 'verb', unlockedBy: 'ch3.radio_vesper' },
    // PLACE
    { id: 'ch3.t.atelier', text: 'l\'atelier', category: 'place' },
    { id: 'ch3.t.terre', text: 'à la Terre', category: 'place' },
    { id: 'ch3.t.centre_mars', text: 'à Centre Mars', category: 'place' },
    // TIME
    { id: 'ch3.t.avant_silence', text: 'avant le silence', category: 'time' },
    { id: 'ch3.t.conversion_imminente', text: 'au moment de la conversion imminente', category: 'time', unlockedBy: 'ch3.radio_han' },
    // OBJECT
    { id: 'ch3.t.appel_aide', text: 'un appel à l\'aide', category: 'object', unlockedBy: 'ch3.radio_tome' },
    { id: 'ch3.t.transmission', text: 'la transmission', category: 'object' },
    // REASON
    { id: 'ch3.t.pour_voss', text: 'pour ÉLISE-ROMIE', category: 'reason', unlockedBy: 'ch3.voice_memo' },
  ],

  assertions: [
    {
      id: 'ch3.a.iolas_soldered',
      chapterId: 3,
      template: '{0} {1} avant de {2} {3}.',
      slots: [
        { category: 'person', validTileIds: ['ch3.t.iolas'] },
        { category: 'verb', validTileIds: ['ch3.t.fini_souder'] },
        { category: 'verb', validTileIds: ['ch3.t.planter'] },
        { category: 'reason', validTileIds: ['ch3.t.pour_voss'] },
      ],
    },
    {
      id: 'ch3.a.tome_transmission',
      chapterId: 3,
      template: '{0} {1} {2} {3} mais {4} {5}.',
      slots: [
        { category: 'person', validTileIds: ['ch3.t.tome'] },
        { category: 'verb', validTileIds: ['ch3.t.transmettre'] },
        { category: 'object', validTileIds: ['ch3.t.appel_aide'] },
        { category: 'place', validTileIds: ['ch3.t.centre_mars'] },
        { category: 'person', validTileIds: ['ch3.t.vera'] },
        { category: 'verb', validTileIds: ['ch3.t.coupe'] },
      ],
    },
    {
      id: 'ch3.a.vesper_order',
      chapterId: 3,
      template: 'Le capitaine {0} {1} {2}.',
      slots: [
        { category: 'verb', validTileIds: ['ch3.t.donne_ordre'] },
        { category: 'verb', validTileIds: ['ch3.t.preserver_ordre'] },
        { category: 'time', validTileIds: ['ch3.t.conversion_imminente'] },
      ],
    },
  ],
};
