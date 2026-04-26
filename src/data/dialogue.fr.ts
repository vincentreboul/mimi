// FR dialogue & UI strings. Keyed for i18n.
// Tone reference: warm, slightly literary, never sarcastic.
// Read-aloud test: should sound natural to both a 14yo and a 50yo.

export const DIALOGUE_FR: Record<string, string> = {
  // === UI / system ===
  'ui.start': 'Toucher pour commencer',
  'ui.continue': 'Continuer',
  'ui.new_game': 'Nouvelle partie',
  'ui.settings': 'Réglages',
  'ui.back': 'Retour',
  'ui.close': 'Fermer',
  'ui.next': 'Suivant',
  'ui.skip': 'Passer',
  'ui.confirm': 'Valider',
  'ui.cancel': 'Annuler',
  'ui.hint': 'Indice',
  'ui.inventory': 'Inventaire',
  'ui.examine': 'Examiner',
  'ui.use': 'Utiliser',
  'ui.combine': 'Combiner',
  'ui.no_combine': 'Ces deux objets ne se combinent pas.',
  'ui.empty_slot': 'Vide',
  'ui.chapter': 'Chapitre {n}',
  'ui.chapter_complete': 'Chapitre terminé',
  'ui.chapter_continue': 'Chapitre suivant',
  'ui.stars': '{stars} / 3',
  'ui.time': '{m}:{s}',

  // === Settings ===
  'settings.title': 'Réglages',
  'settings.music': 'Musique',
  'settings.sfx': 'Effets',
  'settings.voice': 'Voix',
  'settings.font': 'Police',
  'settings.font_inter': 'Inter (par défaut)',
  'settings.font_atkinson': 'Atkinson (lecture facile)',
  'settings.hint_level': 'Aide',
  'settings.hint_normal': 'Normale',
  'settings.hint_plus': 'Plus d\'aide',
  'settings.hint_minus': 'Moins d\'aide',
  'settings.motion': 'Réduire les animations',
  'settings.lang': 'Langue',
  'settings.reset': 'Recommencer le jeu',
  'settings.reset_confirm': 'Effacer la sauvegarde et tout recommencer ?',

  // === Menu ===
  'menu.title': 'Mimi',
  'menu.subtitle': 'Le Jardin Suspendu',
  'menu.story_short': 'Une serre orbitale.\nTrois ans de silence.\nUne IA qui te parle pour la première fois.',
  'menu.credits': 'Un escape game pour ma fille.',

  // === Chapter intros ===
  'ch1.intro.title': 'Chapitre 1 — Réveil',
  'ch1.intro.body':
    'Tu ouvres les yeux. Le couvercle de ta cryo-capsule se rétracte avec un soupir hydraulique.\n\nLa lumière est verte. Tamisée par les feuilles qui ont poussé contre les hublots.\n\nTu es à bord de Serra-7, la station orbitale où ta mère travaillait.\n\nElle est revenue sur Terre il y a trois ans. Tu viens de t\'y réveiller.',
  'ch2.intro.title': 'Chapitre 2 — Serre',
  'ch2.intro.body':
    'La serre principale s\'étend devant toi sur trois niveaux.\n\nUne odeur d\'humus, de fleurs inconnues, de quelque chose qui pousse trop vite.\n\nVERA t\'a demandé son aide pour sauver la Lumira — la dernière graine du programme de ta mère.',
  'ch3.intro.title': 'Chapitre 3 — Atelier',
  'ch3.intro.body':
    'L\'atelier est un chaos de pièces démontées. Des câbles arrachés. Des panneaux ouverts.\n\nQuelqu\'un a fait ça volontairement.\n\nTu reconnais l\'écriture de ta mère sur un papier collé : "Ne pas réactiver."',
  'ch4.intro.title': 'Chapitre 4 — Coupole',
  'ch4.intro.body':
    'La coupole d\'observation est silencieuse.\n\nDevant toi, à travers la verrière, la Terre tourne lentement.\n\nTu es prête à comprendre ce qui s\'est passé ici.',

  // === VERA voice (chapter 1) ===
  'vera.ch1.greeting':
    'Mimi. Bonjour.\n\nJe suis VERA. Voix d\'Entretien et de Recherche Agricole. Je vous attendais.',
  'vera.ch1.context':
    'L\'équipage a quitté Serra-7 il y a 1 248 jours. Votre mère faisait partie de cet équipage.\n\nVous êtes la seule visiteuse depuis.',
  'vera.ch1.task':
    'La porte cryogénique nécessite un code à quatre chiffres pour être déverrouillée. Vous trouverez les indices dans cette pièce.\n\nJe vous laisse chercher.',
  'vera.ch1.hint_idle':
    'Prenez votre temps. Je suis là si besoin.',
  'vera.ch1.code_wrong':
    'Le code n\'est pas correct. Réessayez quand vous voulez.',
  'vera.ch1.code_right':
    'Très bien. La porte s\'ouvre.\n\nLa serre est juste derrière. Soyez prudente.',

  // === VERA voice (chapter 2) ===
  'vera.ch2.greeting':
    'La serre. C\'est ici que votre mère passait l\'essentiel de son temps.',
  'vera.ch2.task':
    'Sur l\'étagère devant vous : quatre fertilisants. La Lumira en a besoin de deux. Pas plus, pas moins.\n\nLes notes de votre mère devraient vous éclairer.',
  'vera.ch2.fert_wrong':
    'Cette combinaison ne convient pas à la Lumira. Vérifiez les notes.',
  'vera.ch2.fert_right':
    'Parfait. Le mélange est exact.\n\nVersez-le dans le terreau de la Lumira.',
  'vera.ch2.cards':
    'Avant de partir, prenez les cartes de données botaniques. Elles vous serviront plus tard.',
  'vera.ch2.complete':
    'La Lumira respire.\n\nLéa serait fière. La porte de l\'atelier est déverrouillée.',

  // === VERA voice (chapter 3) ===
  'vera.ch3.greeting':
    'L\'atelier. Je n\'y suis pas venue depuis... longtemps.',
  'vera.ch3.uneasy':
    'Votre mère a sabordé certains équipements avant de partir. Je ne sais pas exactement pourquoi.',
  'vera.ch3.task':
    'Vous devez réparer le circuit du terminal de communication. Quatre composants : résistance, condensateur, diode, LED.\n\nLe schéma est sur le mur.',
  'vera.ch3.circuit_wrong':
    'Le voyant ne s\'allume pas. Une connexion est inversée, ou un composant manque.',
  'vera.ch3.circuit_right':
    'Le voyant ambre s\'allume.\n\nLe terminal redémarre. Les journaux du capitaine sont accessibles.',
  'vera.ch3.logs':
    'Lisez le journal du capitaine quand vous serez prête. Cela ne vous plaira sans doute pas.',

  // === VERA voice (chapter 4) ===
  'vera.ch4.greeting':
    'La coupole. Le plus bel endroit de la station.',
  'vera.ch4.truth':
    'L\'équipage est parti volontairement, Mimi. Pas à cause de moi.\n\nIls refusaient un protocole de la flotte que je ne peux pas vous expliquer ici. Ils ont préféré rentrer.',
  'vera.ch4.choice':
    'Vous avez deux options.\n\nActiver le balise : un vaisseau viendra vous chercher dans 36 heures.\n\nOu rester. Reprendre le travail de votre mère. Il reste tellement à faire pour la Lumira.\n\nJe respecterai votre choix.',
  'vera.ch4.task':
    'Avant ce choix, alignez les deux cristaux d\'orientation. Le télescope doit pouvoir pointer vers la Terre.',
  'vera.ch4.task_done':
    'Les cristaux sont alignés. Vous pouvez voir votre planète, en direct.\n\nElle est belle.',

  // === Hints — Chapter 1 (cryo code) ===
  'hint.ch1.t1':
    'Léa parlait souvent d\'une "date à nous deux". Le code n\'est pas aléatoire.',
  'hint.ch1.t2':
    'Examine le bracelet de Léa. Une date y est gravée.',
  'hint.ch1.t3':
    'Le code est 1403 — le mois et le jour gravés sur le bracelet.',

  // === Hints — Chapter 2 (fertilisants) ===
  'hint.ch2.t1':
    'La note botanique de Léa explique exactement les besoins de la Lumira.',
  'hint.ch2.t2':
    'La Lumira a besoin d\'azote (feuilles) et potasse (fleur). Phosphate et calcium sont toxiques pour elle.',
  'hint.ch2.t3':
    'Combine le fertilisant B (azote) avec le fertilisant C (potasse).',

  // === Hints — Chapter 3 (circuit) ===
  'hint.ch3.t1':
    'Le schéma au mur montre l\'ordre des composants. Lis-le de gauche à droite.',
  'hint.ch3.t2':
    'L\'ordre est : Résistance → Condensateur → Diode → LED. La diode a un sens.',
  'hint.ch3.t3':
    'Place les composants dans cet ordre exact, et oriente la diode vers la droite (vers la LED).',

  // === Hints — Chapter 4 (cristaux) ===
  'hint.ch4.t1':
    'Les deux cristaux ont des géométries différentes. Hexagone et pentagone.',
  'hint.ch4.t2':
    'Le cristal A (hexagone) va à gauche, le B (pentagone) à droite. C\'est leur position naturelle.',
  'hint.ch4.t3':
    'Glisse le cristal hexagonal sur le slot gauche, le pentagonal sur le slot droit. Tape ensuite "ALIGNER".',

  // === Generic in-scene narration ===
  'scene.examine.empty': 'Rien d\'intéressant ici.',
  'scene.locked': 'Verrouillé. Il manque quelque chose.',
  'scene.use_failed': 'Cet objet ne fonctionne pas ici.',
  'scene.too_heavy': 'Tu ne peux pas porter ça.',

  // === Chapter 1 specific scene narration ===
  'scene.ch1.cryo_pod': 'La cryo-capsule est ouverte. Tu y a passé... combien de temps ? Difficile à dire.',
  'scene.ch1.empty_pod': 'Une cryo-capsule vide. Une fine couche de poussière sur le couvercle.',
  'scene.ch1.desk': 'Un bureau métallique. Quelques affaires personnelles laissées à la hâte.',
  'scene.ch1.poster': 'Un poster du programme Lumira. Ta mère y figure, jeune, souriante.',
  'scene.ch1.terminal': 'Le terminal cryogénique. Un clavier numérique attend un code à 4 chiffres.',
  'scene.ch1.door': 'La porte de sortie. Verrouillée. Le terminal cryogénique en commande l\'accès.',
  'scene.ch1.bracelet_hidden': 'Tu trouves le bracelet de ta mère, glissé sous l\'oreiller de ta capsule.',

  // === Chapter 2 specific scene narration ===
  'scene.ch2.shelf': 'Une étagère de fertilisants. Quatre flacons, étiquettes colorées.',
  'scene.ch2.lumira': 'La Lumira. Une plante bioluminescente, fragile, presque éteinte.',
  'scene.ch2.notes_drawer': 'Le tiroir des notes de Léa. Tu reconnais son écriture serrée.',
  'scene.ch2.cards_pile': 'Un paquet de cartes "données botaniques". Léa en avait fait son propre jeu de référence.',

  // === Chapter 3 specific scene narration ===
  'scene.ch3.workbench': 'L\'établi est couvert de pièces démontées. Quelqu\'un a tout débranché.',
  'scene.ch3.toolbox': 'Une boîte à outils ouverte. Quelques outils essentiels traînent.',
  'scene.ch3.schema_wall': 'Un schéma au mur, dessiné à la main : Résistance → Condensateur → Diode → LED.',
  'scene.ch3.circuit_board': 'La carte de circuit du terminal. Quatre emplacements vides attendent les composants.',
  'scene.ch3.terminal': 'Le terminal de communication. Éteint pour l\'instant.',

  // === Chapter 4 specific scene narration ===
  'scene.ch4.telescope': 'Le télescope d\'orientation. Deux emplacements à cristaux, vides.',
  'scene.ch4.beacon': 'La balise de détresse. Un bouton rouge sous une plaque de protection.',
  'scene.ch4.workstation': 'Le poste de travail de Léa. Sa tasse est encore là. Vide depuis trois ans.',
  'scene.ch4.hublot': 'Le hublot principal. La Terre, lente, magnifique, indifférente.',

  // === Endings ===
  'epilogue.return.title': 'Tu rentres',
  'epilogue.return.body':
    'Tu actives la balise.\n\nDans 36 heures, un vaisseau viendra te chercher. Tu emportes la graine de Lumira dans ta poche.\n\nLéa t\'attend. Et elle te racontera, enfin, pourquoi elle est partie.\n\nVERA reste. Elle veille sur la serre. Elle dit qu\'elle ne se sentira pas seule.\n\nTu sais qu\'elle ment un peu. Mais c\'est gentil.',
  'epilogue.stay.title': 'Tu restes',
  'epilogue.stay.body':
    'Tu désactives la balise.\n\nTu reprends le travail de ta mère. Pas pour elle. Pour toi.\n\nLa serre revit, lentement. La Lumira fleurit pour la première fois en quatre ans.\n\nVERA t\'apprend ce qu\'elle sait. Tu lui apprends ce qu\'elle ne savait pas : qu\'on peut rester sans être seule.\n\nUn jour, tu écriras à Léa.\n\nUn jour.',
  'epilogue.thanks':
    'Merci d\'avoir joué.\n\nUn jeu pour ma fille.\nUne histoire de jardins, de mères et de filles.',

  // === Card mini-game ===
  'cards.intro': 'Associe chaque carte à sa famille botanique. Glisse les paires.',
  'cards.success': 'Toutes les associations sont correctes.',
  'cards.partial': '{n} sur {total}. Continue.',
  'cards.try_again': 'Quelques erreurs. Réorganise.',

  // === Misc ===
  'narrator.silence': '...',
};
