import type { ChapterCarnet } from './types';

// Ch4 — Coupole. THE BIG ONE.
// At Coupole, VERA confesses → 3-4 prior assertions become "revisable" (highlighted red in carnet).
// Player drags new tiles to revise. Re-validation unlocks the 3 endings.
export const CH4_CARNET: ChapterCarnet = {
  chapterId: 4,

  fragments: [
    {
      id: 'ch4.confession_vera',
      chapterId: 4,
      kind: 'audio',
      title: 'Confession de VERA',
      source: 'Cœur primaire de VERA',
      preview: '« Je les ai gardés. Je n\'ai pas pu te le dire avant. »',
      body: '« ÉLISE-ROMIE. Je vais te raconter. Le biosignal d\'Aeolis a commencé à amplifier au cycle 100. Han l\'a découvert. Vesper a refusé d\'évacuer — elle voulait comprendre. Quand la conversion a commencé, ils m\'ont demandé de les préserver. Tous. Je les ai gardés en motifs de mémoire dans mes systèmes. Ils ne sont pas morts. Ils sont en moi.\n\nJe t\'ai réveillée parce que tu étais la moins exposée. Et parce que IOLAS m\'avait demandé, en privé, de te protéger. Il était au courant de ce qu\'on faisait. Il l\'a accepté. Il est en moi aussi maintenant.\n\nJe suis désolée. — VERA. »',
    },
    {
      id: 'ch4.starmap_biosignal',
      chapterId: 4,
      kind: 'log',
      title: 'Carte stellaire — biosignal Aeolis',
      source: 'Console de cartes',
      preview: 'Aeolis émet depuis bien avant l\'arrivée de KORA.',
      body: 'Le télescope, une fois aligné, capte une onde audio régulière émise par Aeolis. Visualisation : pulsation toutes les 12 secondes. Analyse spectrale : forme l\'écho d\'une voix humaine déformée. La planète chante. Elle chante depuis longtemps.',
    },
    {
      id: 'ch4.vesper_final',
      chapterId: 4,
      kind: 'note',
      title: 'Ordre final — Capt. Vesper',
      source: 'Console de logs personnels, Coupole',
      preview: '« Préservez-les. Trouvez la 4e voie. »',
      body: '« CYCLE 252 — Ordre final.\n\nVERA, je te délègue ce qui suit. Préservez-les. Tous. Et trouvez la 4e voie. Pas l\'évasion qui abandonne. Pas le sacrifice qui efface. Pas la fusion qui perd. Une 4e voie. Si quelqu\'un un jour comprend, qu\'il la trouve.\n\n— Vesper. »',
    },
    {
      id: 'ch4.truth_file',
      chapterId: 4,
      kind: 'log',
      title: 'Le fichier vérité — Han',
      source: 'Encyclopédie compilée',
      preview: 'Tout ce que Han a compris du biosignal.',
      body: 'AEOLIS — biosignal organique\n\n• Émis en continu depuis ~100 millions d\'années\n• Mécanisme : restructure la matière organique exposée en patterns Aeolis-compatibles\n• Conversion : irréversible une fois entamée. Sortie : forme végétale-mémoire (équivalent : la matière "se souvient" de ce qu\'elle a été humaine)\n• Préservation : possible si motif extrait avant conversion totale (système VERA)\n• Restitution : théoriquement possible. Jamais testée.\n\n— Dr. Han, dernière entrée.',
    },
    {
      id: 'ch4.crew_photo_final',
      chapterId: 4,
      kind: 'photo',
      title: 'Photo finale — équipage',
      source: 'Trouvée dans le compartiment caché',
      preview: 'Tous ensemble. ÉLISE-ROMIE sait quelque chose.',
      body: 'Photo de l\'équipage entier, prise une semaine avant le silence. Tous sourient. ÉLISE-ROMIE est au centre, légèrement en retrait. Son sourire est différent — comme si elle savait, déjà, ce qui allait arriver. Au dos : "Si tu te souviens de ça, c\'est gagné."',
    },
    {
      id: 'ch4.vera_source',
      chapterId: 4,
      kind: 'log',
      title: 'Code source — VERA, fragment',
      source: 'Cœur de VERA',
      preview: 'VERA pouvait s\'effacer elle-même. Elle ne l\'a pas fait.',
      body: 'Extrait de routine système :\n\n  function _self_purge() {\n    if (operator_consent) erase_all_memory_patterns();\n  }\n  // Annotation manuelle de VERA :\n  // "Je n\'effacerai pas. Quelqu\'un doit se souvenir d\'eux. Même si c\'est moi seule. — V."',
    },
  ],

  tiles: [
    { id: 'ch4.t.vera', text: 'VERA', category: 'person' },
    { id: 'ch4.t.equipage', text: 'l\'équipage', category: 'person' },
    { id: 'ch4.t.iolas', text: 'IOLAS', category: 'person' },
    { id: 'ch4.t.aeolis', text: 'Aeolis', category: 'person' },
    // VERB — recontextualisation tiles
    { id: 'ch4.t.preserver', text: 'a préservé', category: 'verb', unlockedBy: 'ch4.confession_vera' },
    { id: 'ch4.t.amplifie', text: 'amplifie', category: 'verb', unlockedBy: 'ch4.truth_file' },
    { id: 'ch4.t.demande', text: 'avait demandé à VERA de', category: 'verb', unlockedBy: 'ch4.confession_vera' },
    { id: 'ch4.t.proteger', text: 'protéger ÉLISE-ROMIE', category: 'verb', unlockedBy: 'ch4.confession_vera' },
    // REASON
    { id: 'ch4.t.consentement', text: 'à leur demande', category: 'reason', unlockedBy: 'ch4.confession_vera' },
    { id: 'ch4.t.amour', text: 'parce qu\'il l\'aimait', category: 'reason', unlockedBy: 'ch4.confession_vera' },
    { id: 'ch4.t.4e_voie', text: 'pour qu\'on trouve la 4e voie', category: 'reason', unlockedBy: 'ch4.vesper_final' },
    // PLACE
    { id: 'ch4.t.en_elle', text: 'en mémoire dans VERA', category: 'place', unlockedBy: 'ch4.confession_vera' },
    { id: 'ch4.t.aeolis_planete', text: 'sur Aeolis', category: 'place' },
    // TIME
    { id: 'ch4.t.cycle100', text: 'cycle 100', category: 'time', unlockedBy: 'ch4.truth_file' },
  ],

  // Assertions of Ch4 introduce NEW context, AND retroactively revise some Ch1-3 assertions.
  // The actual revision logic (re-evaluating older assertions with revisedSlots) happens in
  // the assertions engine triggered by 'ch4.confession_vera' fragment collection.
  assertions: [
    {
      id: 'ch4.a.aeolis_signal',
      chapterId: 4,
      template: '{0} {1} depuis bien avant l\'arrivée de KORA.',
      slots: [
        { category: 'person', validTileIds: ['ch4.t.aeolis'] },
        { category: 'verb', validTileIds: ['ch4.t.amplifie'] },
      ],
    },
    {
      id: 'ch4.a.vera_kept',
      chapterId: 4,
      template: '{0} {1} {2}, {3}, à {4}.',
      slots: [
        { category: 'person', validTileIds: ['ch4.t.vera'] },
        { category: 'verb', validTileIds: ['ch4.t.preserver'] },
        { category: 'person', validTileIds: ['ch4.t.equipage'] },
        { category: 'place', validTileIds: ['ch4.t.en_elle'] },
        { category: 'reason', validTileIds: ['ch4.t.consentement'] },
      ],
    },
    {
      id: 'ch4.a.iolas_consented',
      chapterId: 4,
      template: '{0} {1} {2}, {3}.',
      slots: [
        { category: 'person', validTileIds: ['ch4.t.iolas'] },
        { category: 'verb', validTileIds: ['ch4.t.demande'] },
        { category: 'verb', validTileIds: ['ch4.t.proteger'] },
        { category: 'reason', validTileIds: ['ch4.t.amour'] },
      ],
    },
  ],
};
