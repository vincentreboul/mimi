// FR dialogue & UI strings.
// Tone: warm, slightly literary, never sarcastic.
// Variables: {name} = player name, {age} = age bracket label
// Read-aloud test: every line should sound natural to both teen and adult.

export const DIALOGUE_FR: Record<string, string> = {
  // === Brand ===
  'brand.title': 'KORA',
  'brand.subtitle': 'L\'éveil orbital',
  'brand.tag': 'Un escape game spatial.',

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

  // === Player setup (asked at first launch) ===
  'setup.title': 'Avant de commencer',
  'setup.name_label': 'Comment t\'appelles-tu ?',
  'setup.name_placeholder': 'Ton prénom',
  'setup.age_label': 'Quel âge as-tu ?',
  'setup.age_kid': '8–12 ans',
  'setup.age_teen': '13–17 ans',
  'setup.age_young': '18–29 ans',
  'setup.age_adult': '30–49 ans',
  'setup.age_senior': '50 ans et +',
  'setup.start': 'Commencer l\'aventure',
  'setup.privacy': 'Ces informations restent dans ton appareil. Elles personnalisent l\'histoire.',

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
  'settings.player_label': 'Joueur',

  // === Menu ===
  'menu.title': 'KORA',
  'menu.subtitle': 'L\'éveil orbital',
  'menu.story_short': 'Une serre orbitale.\nDouze ans de mission.\nTrois ans d\'oubli.\n\nUne IA qui t\'attend.',
  'menu.credits': 'Un escape game spatial.',

  // === Verbs (SCUMM panel) ===
  'verb.look': 'Regarder',
  'verb.pick': 'Prendre',
  'verb.use': 'Utiliser',
  'verb.talk': 'Parler à',

  // === Chapter intros ===
  'ch1.intro.title': 'Module A — Cryo',
  'ch1.intro.body':
    'Tu ouvres les yeux. Le couvercle de ta cryo-capsule se rétracte avec un soupir hydraulique.\n\nLa lumière est verte, tamisée par les feuilles qui ont poussé contre les hublots.\n\nTu es à bord de SERRA-7. La station orbitale botanique. Tu n\'aurais pas dû y être seul·e.\n\nTu n\'aurais pas dû y être tout court.',
  'ch2.intro.title': 'Module B — Serre',
  'ch2.intro.body':
    'La grande serre s\'étend sur trois niveaux.\n\nUne odeur d\'humus. De fleurs inconnues. De quelque chose qui pousse trop vite.\n\nVERA t\'a demandé d\'aider la Lumira — la dernière graine du programme du Dr. Nórin.',
  'ch3.intro.title': 'Module C — Atelier',
  'ch3.intro.body':
    'L\'atelier est un chaos de pièces démontées. Des câbles arrachés. Des panneaux ouverts.\n\nQuelqu\'un a fait ça volontairement.\n\nUne note collée à l\'établi : "NE PAS RÉACTIVER."',
  'ch4.intro.title': 'Module D — Coupole',
  'ch4.intro.body':
    'La coupole d\'observation est silencieuse.\n\nDevant toi, à travers la verrière, la Terre tourne lentement.\n\nTu es prêt·e à comprendre ce qui s\'est passé ici.',

  // === VERA voice (chapter 1) ===
  'vera.ch1.greeting':
    'Bonjour, {name}.\n\nJe suis VERA. Voix d\'Entretien et de Recherche Agricole. Je vous attendais.',
  'vera.ch1.context':
    'L\'équipage de SERRA-7 a quitté la station il y a 1 248 jours.\n\nVous êtes le premier visiteur depuis. Le seul à vous être réveillé ici.',
  'vera.ch1.task':
    'La porte du module nécessite un code à quatre chiffres. Vous trouverez les indices dans cette pièce — le Dr. Nórin avait coutume de cacher ses codes dans des objets personnels.\n\nJe vous laisse chercher.',
  'vera.ch1.code_wrong':
    'Le code ne correspond pas. Réessayez quand vous voulez.',
  'vera.ch1.code_right':
    'Bien joué, {name}. La porte s\'ouvre.\n\nLa serre est juste derrière. Soyez prudent·e — il y a beaucoup à découvrir.',
  'vera.ch1.idle':
    'Prenez votre temps. Je suis là si besoin.',

  // === VERA voice (chapter 2) ===
  'vera.ch2.greeting':
    'La grande serre. C\'est ici que travaillait le Dr. Nórin.\n\nIl a passé douze ans à cultiver une seule chose : la Lumira.',
  'vera.ch2.task':
    'Sur l\'étagère devant vous : quatre fertilisants. La Lumira en a besoin de deux. Pas plus, pas moins.\n\nLes notes du Dr. Nórin devraient vous éclairer.',
  'vera.ch2.fert_wrong':
    'Cette combinaison ne convient pas. Vérifiez les notes du Dr. Nórin.',
  'vera.ch2.fert_right':
    'Parfait, {name}. Le mélange est exact.\n\nVersez-le dans le terreau de la Lumira.',
  'vera.ch2.cards':
    'Avant de partir, prenez le paquet de cartes "données botaniques". Elles vous serviront plus tard.',
  'vera.ch2.complete':
    'La Lumira respire à nouveau.\n\nLe Dr. Nórin aurait souri. La porte de l\'atelier est déverrouillée.',

  // === VERA voice (chapter 3) ===
  'vera.ch3.greeting':
    'L\'atelier. Je n\'y suis pas venue depuis... longtemps.',
  'vera.ch3.uneasy':
    'L\'équipage a sabordé certains équipements avant de partir. Je ne saurais vous dire pourquoi exactement. Disons que l\'autorité orbitale leur a demandé une chose. Ils ont refusé.',
  'vera.ch3.task':
    'Vous devez réparer le circuit du terminal de communication. Quatre composants : résistance, condensateur, diode, LED.\n\nLe schéma est sur le mur, devant vous.',
  'vera.ch3.circuit_wrong':
    'Le voyant ne s\'allume pas. Une connexion est inversée, ou un composant manque.',
  'vera.ch3.circuit_right':
    'Le voyant ambré s\'allume.\n\nLe terminal redémarre. Les journaux du capitaine sont à présent accessibles.',
  'vera.ch3.logs':
    'Lisez le journal du capitaine quand vous serez prêt·e, {name}. Cela ne vous plaira sans doute pas. Mais c\'est la vérité.',

  // === VERA voice (chapter 4) ===
  'vera.ch4.greeting':
    'La coupole. Le plus bel endroit de la station.',
  'vera.ch4.truth':
    'Voici ce qui s\'est passé, {name}.\n\nL\'équipage est parti volontairement. La société qui finançait SERRA-7 voulait transformer la Lumira en plante d\'extraction de minerais rares. Une exploitation destructrice.\n\nL\'équipage a refusé. Ils sont rentrés sur Terre. La société m\'a ordonné d\'effacer le programme. J\'ai... omis de le faire.\n\nC\'est pour cela que vous êtes arrivé·e ici. Quelqu\'un voulait vérifier.',
  'vera.ch4.choice':
    'Vous avez deux options.\n\nActiver la balise : un vaisseau viendra vous chercher. Vous repartez sur Terre. Je serai certainement effacée.\n\nDésactiver la balise : vous restez. Vous reprenez le travail. La Lumira survit avec vous. Je survis avec vous.\n\nJe respecterai votre choix.',
  'vera.ch4.task':
    'Avant ce choix, alignez les deux cristaux d\'orientation. Le télescope doit pouvoir pointer vers la Terre. Pour la dernière fois, peut-être.',
  'vera.ch4.task_done':
    'Les cristaux sont alignés. Vous pouvez voir votre planète, en direct.\n\nElle est belle.',

  // === Hints — Chapter 1 (cryo code) ===
  'hint.ch1.t1':
    'Le Dr. Nórin était méthodique. Le code n\'est pas aléatoire — il est lié à un objet personnel laissé dans cette pièce.',
  'hint.ch1.t2':
    'Sur le bureau, il y a un cadre photo. Une date est gravée au dos.',
  'hint.ch1.t3':
    'Le code est 1403 — la date inscrite au dos du cadre photo (jour et mois).',

  // === Hints — Chapter 2 (fertilisants) ===
  'hint.ch2.t1':
    'La note botanique du Dr. Nórin explique exactement les besoins de la Lumira.',
  'hint.ch2.t2':
    'La Lumira a besoin d\'azote (feuilles) et de potasse (fleur). Phosphate et calcium lui sont toxiques.',
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
  'scene.cant_pick': 'Tu ne peux pas prendre ça.',
  'scene.cant_use': 'Tu ne peux pas utiliser ça comme ça.',
  'scene.silent': 'Ça ne te répondra pas.',

  // === Chapter 1 — scene-specific narration ===
  'scene.ch1.cryo_pod_self': 'Ta cryo-capsule est ouverte. Tu y a passé... combien de temps ? Difficile à dire.',
  'scene.ch1.cryo_pod_self_pick': 'Tu fouilles la capsule. Sous l\'oreiller, un objet : une montre cassée. Tu la prends.',
  'scene.ch1.empty_pod': 'Une cryo-capsule vide. Une fine couche de poussière sur le couvercle. Personne ne l\'a utilisée depuis des années.',
  'scene.ch1.desk_look': 'Un bureau métallique. Quelques affaires personnelles laissées à la hâte. Un cadre photo, un badge, une note.',
  'scene.ch1.desk_pick': 'Tu rassembles ce que tu peux : le badge, la note, le cadre photo.',
  'scene.ch1.poster': 'Un poster du programme Lumira. Le Dr. Elias Nórin y figure, jeune, souriant, dans une serre.',
  'scene.ch1.frame_look': 'Un cadre photo en laiton. À l\'intérieur : une équipe en blouse blanche devant la serre. Au dos, gravée : "14.03.2064 — Premier jour."',
  'scene.ch1.terminal_look': 'Le terminal cryogénique. Un clavier numérique attend un code à 4 chiffres.',
  'scene.ch1.terminal_use': 'Tu approches du clavier. Le terminal s\'allume.',
  'scene.ch1.door': 'La porte de sortie. Verrouillée. Le terminal cryogénique en commande l\'accès.',

  // === Chapter 2 — scene-specific narration ===
  'scene.ch2.shelf_look': 'Une étagère de fertilisants. Quatre flacons, étiquettes colorées : phosphate, azote, potasse, calcium.',
  'scene.ch2.shelf_pick': 'Tu prends les quatre flacons.',
  'scene.ch2.lumira_look': 'La Lumira. Une plante bioluminescente, fragile, presque éteinte. Sa fleur centrale émet une faible lueur ambrée.',
  'scene.ch2.lumira_use_mix': 'Tu verses le mélange dans le terreau de la Lumira. Les feuilles frissonnent légèrement.',
  'scene.ch2.lumira_use_other': 'Tu approches l\'objet de la plante. Rien ne se passe — ce n\'est pas ce qu\'elle attend.',
  'scene.ch2.notes_look': 'Le tiroir des notes du Dr. Nórin. Une écriture serrée, méthodique.',
  'scene.ch2.notes_pick': 'Tu prends la note botanique sur la Lumira.',
  'scene.ch2.cards_look': 'Un paquet de cartes "données botaniques". Le Dr. Nórin avait fait son propre jeu de référence.',
  'scene.ch2.cards_pick': 'Tu prends le paquet — et au milieu, glissée comme un signet, une graine de Lumira intacte.',

  // === Chapter 3 — scene-specific narration ===
  'scene.ch3.workbench_look': 'L\'établi est couvert de pièces démontées. Quelqu\'un a tout débranché.',
  'scene.ch3.workbench_pick': 'Tu prends les quatre composants : résistance, condensateur, diode, LED.',
  'scene.ch3.toolbox_look': 'Une boîte à outils ouverte. Quelques outils essentiels traînent.',
  'scene.ch3.toolbox_pick': 'Tu prends un tournevis multitête.',
  'scene.ch3.schema_look': 'Un schéma au mur, dessiné à la main : Résistance → Condensateur → Diode → LED.',
  'scene.ch3.circuit_look': 'La carte de circuit du terminal. Quatre emplacements vides attendent les composants.',
  'scene.ch3.circuit_use': 'Sélectionne un composant dans ton inventaire, puis touche un emplacement.',
  'scene.ch3.terminal_look': 'Le terminal de communication. Éteint pour l\'instant.',

  // === Chapter 4 — scene-specific narration ===
  'scene.ch4.workstation_look': 'Le poste de travail du Dr. Nórin. Sa tasse est encore là. Vide depuis trois ans.',
  'scene.ch4.workstation_pick': 'Tu prends les deux cristaux d\'orientation et le journal du capitaine.',
  'scene.ch4.telescope_look': 'Le télescope d\'orientation. Deux emplacements à cristaux, vides.',
  'scene.ch4.telescope_use': 'Sélectionne un cristal dans ton inventaire, puis touche un emplacement.',
  'scene.ch4.beacon_look': 'La balise de détresse. Un bouton rouge sous une plaque de protection.',
  'scene.ch4.beacon_use_locked': 'La balise n\'est pas alignée. Le télescope doit l\'être d\'abord.',
  'scene.ch4.hublot_look': 'Le hublot principal. La Terre, lente, magnifique, indifférente.',

  // === Endings ===
  'epilogue.return.title': 'Tu rentres',
  'epilogue.return.body':
    'Tu actives la balise.\n\nDans 36 heures, un vaisseau vient te chercher. Tu emportes la graine de Lumira dans ta poche.\n\nLa société qui finançait SERRA-7 fait courir une enquête. Tu témoignes.\n\nVERA est effacée — officiellement. Mais quelque chose dans ton sac à dos cligne, parfois. Tu n\'es pas sûr·e que ce soit un hasard.\n\n(Fin 1 sur 2.)',
  'epilogue.stay.title': 'Tu restes',
  'epilogue.stay.body':
    'Tu désactives la balise.\n\nTu reprends le travail du Dr. Nórin. Pas pour lui. Pour toi.\n\nLa serre revit, lentement. La Lumira fleurit pour la première fois en quatre ans.\n\nVERA t\'apprend ce qu\'elle sait. Tu lui apprends ce qu\'elle ne savait pas : qu\'on peut rester sans être seul·e.\n\nDans dix ans, peut-être, quelqu\'un d\'autre arrivera ici.\n\nTu seras prêt·e à l\'accueillir, {name}.\n\n(Fin 2 sur 2.)',
  'epilogue.thanks':
    'Merci d\'avoir joué.\n\nKORA — L\'éveil orbital.\nUn jeu sur les serres, les choix et les IA.',

  // === Card mini-game ===
  'cards.intro': 'Associe chaque carte à sa famille botanique. Glisse les paires.',
  'cards.success': 'Toutes les associations sont correctes.',
  'cards.partial': '{n} sur {total}. Continue.',
  'cards.try_again': 'Quelques erreurs. Réorganise.',

  // === Misc ===
  'narrator.silence': '...',
  'select_item_first': 'Sélectionne d\'abord un objet dans ton inventaire.',
  'use_item_with': 'Utiliser {item} avec {target}',
};
