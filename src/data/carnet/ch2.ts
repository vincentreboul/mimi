import type { ChapterCarnet } from './types';

export const CH2_CARNET: ChapterCarnet = {
  chapterId: 2,
  secretFragmentId: 'ch2.secret_drawer',

  fragments: [
    {
      id: 'ch2.research_han',
      chapterId: 2,
      kind: 'log',
      title: 'Notes de recherche — Han',
      source: 'Cahier du botaniste, page 1',
      preview: 'Lumira réagit à la voix humaine. Pas de manière acoustique.',
      body: '« Lumira semble réagir à la voix humaine de manière non-acoustique. Hypothèse : sensibilité aux fréquences sub-vocales (2-15 Hz). Test : l\'équipage entier chante autour de la plante. Réaction confirmée. La plante penche dans la direction de la source. Conclusion provisoire : forme de communication. — Han »',
    },
    {
      id: 'ch2.journal_tome',
      chapterId: 2,
      kind: 'note',
      title: 'Journal de PHARAÉL',
      source: 'Caché entre deux pages du cahier',
      preview: '« J\'entends des voix dans les plantes. »',
      body: '« J\'entends des voix dans les plantes. Han me dit que c\'est psychosomatique, mais Vera m\'a dit qu\'elle aussi. La nuit, dans la Serre, ça murmure. Je ne dors plus très bien. Naïs me manque. — P. »',
    },
    {
      id: 'ch2.sample_lumira',
      chapterId: 2,
      kind: 'sample',
      title: 'Échantillon — Lumira',
      source: 'Tu en prélèves une feuille',
      preview: 'Tissu mi-végétal mi-iridescent. Tiède au toucher.',
      body: 'Échantillon Lumira-3, prélevé cycle actuel. Tissu pulse faiblement, comme si quelque chose vivait à l\'intérieur. Au microscope, les cellules forment des motifs réguliers qui ne correspondent à aucune classification terrestre. Han avait raison.',
    },
    {
      id: 'ch2.photo_planting',
      chapterId: 2,
      kind: 'photo',
      title: 'Photo — Plantation collective',
      source: 'Sous un pot de la Serre',
      preview: 'L\'équipage entier plante Lumira ensemble.',
      body: 'Photo cycle 12. Toute l\'équipe — Vesper, Voss (toi), Marchand, Han, Tomé — entoure le pot où Lumira vient d\'être plantée. Chacun pose une main sur la terre. ÉLISE-ROMIE sourit, comme si elle savait quelque chose que les autres ne savent pas encore.',
    },
    {
      id: 'ch2.audio_vesper_song',
      chapterId: 2,
      kind: 'audio',
      title: 'Audio — Vesper chante',
      source: 'Capté par un micro d\'ambiance',
      preview: 'La capitaine chantonne aux plantes. Cycle 220.',
      body: 'Audio 90 secondes. La capitaine Vesper, seule dans la Serre, chante doucement une berceuse à mélodie ancienne. Les plantes en arrière-plan bougent légèrement, comme si elles écoutaient. À la fin, elle dit : « Dors maintenant. Je veille. »',
    },
    {
      id: 'ch2.note_disease',
      chapterId: 2,
      kind: 'note',
      title: 'Cahier botaniste — page 3',
      source: 'Bureau du botaniste',
      preview: 'Trois maladies type Aeolis. Leurs symptômes.',
      body: 'PATHOLOGIE A : feuilles tachetées, propagation lente. Cause : carence en oligo-éléments martiens.\n\nPATHOLOGIE B : flétrissement nocturne, restauration en jour. Cause : dérèglement biorythmique.\n\nPATHOLOGIE C : iridescence anormale, propagation foudroyante. Cause : INCONNUE. (Voir notes Lumira.)',
    },
    {
      id: 'ch2.secret_drawer',
      chapterId: 2,
      kind: 'audio',
      title: 'Log non envoyé — PHARAÉL à Naïs',
      source: 'Tiroir verrouillé',
      preview: '« Ils ne sont pas partis. Ils sont devenus quelque chose d\'autre. »',
      body: 'Audio 45 secondes. PHARAÉL, voix tremblante : « Naïs, c\'est papa. Je vais bien, je te le promets. Mais... il faut que tu saches. Si on ne revient pas, ce n\'est pas qu\'on est morts. Ils ne sont pas partis. Ils sont devenus quelque chose d\'autre. C\'est dans les plantes maintenant. Han dit que c\'est beau, à sa manière. Moi je veux juste rentrer. Je t\'aime. — Papa. »',
      isSecret: true,
      hiddenUnlock: 'Le tiroir de PHARAÉL est verrouillé. La clé est dans son pod (Ch1).',
    },
  ],

  tiles: [
    // PERSON
    { id: 'ch2.t.lumira', text: 'Lumira', category: 'person' },
    { id: 'ch2.t.han', text: 'Dr. Han', category: 'person' },
    { id: 'ch2.t.equipage', text: 'l\'équipage', category: 'person' },
    { id: 'ch2.t.tome', text: 'PHARAÉL', category: 'person' },
    { id: 'ch2.t.vesper', text: 'Vesper', category: 'person' },
    // VERB
    { id: 'ch2.t.reagir', text: 'a commencé à réagir', category: 'verb', unlockedBy: 'ch2.research_han' },
    { id: 'ch2.t.communique', text: 'communique avec eux', category: 'verb', unlockedBy: 'ch2.research_han' },
    { id: 'ch2.t.plante', text: 'a planté', category: 'verb', unlockedBy: 'ch2.photo_planting' },
    { id: 'ch2.t.entend', text: 'entendait', category: 'verb', unlockedBy: 'ch2.journal_tome' },
    { id: 'ch2.t.chante', text: 'a chanté pour', category: 'verb', unlockedBy: 'ch2.audio_vesper_song' },
    // PLACE
    { id: 'ch2.t.serre', text: 'la Serre', category: 'place' },
    { id: 'ch2.t.lumira_obj', text: 'Lumira', category: 'object' },
    // TIME
    { id: 'ch2.t.cycle12', text: 'cycle 12', category: 'time', unlockedBy: 'ch2.photo_planting' },
    { id: 'ch2.t.cycle220', text: 'cycle 220', category: 'time', unlockedBy: 'ch2.audio_vesper_song' },
    // REASON
    { id: 'ch2.t.frequences', text: 'parce qu\'elle perçoit les fréquences vocales', category: 'reason', unlockedBy: 'ch2.research_han' },
    { id: 'ch2.t.observation', text: 'pour observer son adaptation orbitale', category: 'reason', unlockedBy: 'ch2.photo_planting' },
    { id: 'ch2.t.veiller', text: 'pour veiller sur eux', category: 'reason', unlockedBy: 'ch2.audio_vesper_song' },
    { id: 'ch2.t.entendait_voix', text: 'des voix dans les plantes', category: 'reason', unlockedBy: 'ch2.journal_tome' },
  ],

  assertions: [
    {
      id: 'ch2.a.lumira_reaction',
      chapterId: 2,
      template: '{0} {1} après que {2} l\'a chantée ensemble en {3}.',
      slots: [
        { category: 'person', validTileIds: ['ch2.t.lumira'] },
        { category: 'verb', validTileIds: ['ch2.t.reagir'] },
        { category: 'person', validTileIds: ['ch2.t.equipage'] },
        { category: 'time', validTileIds: ['ch2.t.cycle12'] },
      ],
    },
    {
      id: 'ch2.a.han_hypothesis',
      chapterId: 2,
      template: '{0} pensait que Lumira {1} {2}.',
      slots: [
        { category: 'person', validTileIds: ['ch2.t.han'] },
        { category: 'verb', validTileIds: ['ch2.t.communique'] },
        { category: 'reason', validTileIds: ['ch2.t.frequences'] },
      ],
      revisedSlots: [
        { category: 'person', validTileIds: ['ch2.t.han'] },
        { category: 'verb', validTileIds: ['ch2.t.communique'] },
        { category: 'reason', validTileIds: ['ch2.t.entendait_voix'] },
      ],
    },
    {
      id: 'ch2.a.crew_planted',
      chapterId: 2,
      template: '{0} {1} Lumira ensemble en {2}, {3}.',
      slots: [
        { category: 'person', validTileIds: ['ch2.t.equipage'] },
        { category: 'verb', validTileIds: ['ch2.t.plante'] },
        { category: 'time', validTileIds: ['ch2.t.cycle12'] },
        { category: 'reason', validTileIds: ['ch2.t.observation'] },
      ],
      revisedSlots: [
        { category: 'person', validTileIds: ['ch2.t.equipage'] },
        { category: 'verb', validTileIds: ['ch2.t.plante'] },
        { category: 'time', validTileIds: ['ch2.t.cycle12'] },
        { category: 'reason', validTileIds: ['ch2.t.veiller'] },
      ],
    },
  ],
};
