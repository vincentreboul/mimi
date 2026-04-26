// FR dialogue & UI strings — KORA v2.
// Tone: warm, slightly literary, never sarcastic. Adapted for new lore (KORA station + équipage Vesper/Han/Tomé/Marchand/Voss + biosignal Aeolis).
// Variables: {name} = player first name, {n} = number, {total} = total

export const DIALOGUE_FR: Record<string, string> = {
  // === Brand ===
  'brand.title': 'KORA',
  'brand.subtitle': 'L\'éveil orbital',
  'brand.tag': 'Une enquête mémorielle en orbite.',

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
  'ui.carnet': 'Carnet',
  'ui.fragment_added': '+ Fragment ajouté au carnet',
  'ui.assertion_locked': 'Assertion confirmée.',
  'ui.assertion_revisable': 'À réviser à la lumière de la révélation.',

  // === Player setup ===
  'setup.title': 'Choisis ton personnage',
  'setup.name_label': 'Comment t\'appelles-tu ?',
  'setup.name_placeholder': 'Ton prénom',
  'setup.age_label': 'Quel âge as-tu ?',
  'setup.age_kid': '8–12 ans',
  'setup.age_teen': '13–17 ans',
  'setup.age_young': '18–29 ans',
  'setup.age_adult': '30–49 ans',
  'setup.age_senior': '50 ans et +',
  'setup.start': 'Commencer l\'aventure',
  'setup.privacy': 'Ces informations restent dans ton appareil.',

  // === Settings ===
  'settings.title': 'Réglages',
  'settings.music': 'Musique',
  'settings.sfx': 'Effets',
  'settings.voice': 'Voix',
  'settings.font': 'Police',
  'settings.font_inter': 'VT323 (par défaut)',
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
  'settings.difficulty': 'Difficulté',
  'settings.difficulty.explorateur': 'Explorateur',
  'settings.difficulty.aventurier': 'Aventurier',
  'settings.difficulty.archiviste': 'Archiviste',
  'settings.difficulty.explorateur_desc': 'Indices visuels marqués, conseils auto rapides, tuiles guidées.',
  'settings.difficulty.aventurier_desc': 'Équilibre — défaut.',
  'settings.difficulty.archiviste_desc': 'Aucun indicateur. Pression temporelle. Tu fouilles.',
  'settings.visual_hints': 'Indices visuels',
  'settings.visual_hints.vif': 'Vifs',
  'settings.visual_hints.subtil': 'Subtils',
  'settings.visual_hints.aucun': 'Aucun',
  'settings.export': 'Exporter ma sauvegarde',
  'settings.import': 'Importer une sauvegarde',

  // === Menu ===
  'menu.title': 'KORA',
  'menu.subtitle': 'L\'éveil orbital',
  'menu.story_short': 'Station orbitale.\nÉquipage disparu.\nUne IA qui se souvient.\n\nReconstruis la vérité.',
  'menu.credits': 'Une enquête mémorielle.',
  'menu.ng_plus': 'NG+ — Le retour d\'IOLAS',
  'menu.replay_chapter': 'Rejouer un chapitre',
  'menu.achievements': 'Souvenirs',

  // === Verbs ===
  'verb.look': 'Regarder',
  'verb.pick': 'Prendre',
  'verb.use': 'Utiliser',
  'verb.talk': 'Parler à',
  'verb.combine': 'Combiner',

  // === Chapter intros ===
  'ch1.intro.title': 'Module A — Cryo',
  'ch1.intro.body':
    'Tu ouvres les yeux. Le couvercle de ta cryo-capsule se rétracte avec un soupir hydraulique.\n\nÀ travers le hublot givré, une silhouette bleu-vert passe rapidement. VERA, peut-être.\n\nTu es à bord de KORA. Station orbitale d\'observation d\'Aeolis. Ton équipage devrait être là.\n\nIl ne l\'est pas.',
  'ch2.intro.title': 'Module B — Serre',
  'ch2.intro.body':
    'La grande Serre s\'étend sur trois niveaux.\n\nUne odeur d\'humus. De fleurs inconnues. De quelque chose qui pousse trop bien.\n\nLumira est là, au centre, plante d\'Aeolis qui réagit aux humains. Ta spécialité, avant la mission.',
  'ch3.intro.title': 'Module C — Atelier',
  'ch3.intro.body':
    'L\'atelier d\'IOLAS. Outils éparpillés comme s\'il venait de sortir.\n\nUne note griffonnée sur l\'établi : "Ne fais pas confiance à VERA. Pas tout de suite."\n\nC\'est ton écriture qui te répond. Mais ce n\'est pas ton écriture.',
  'ch4.intro.title': 'Module D — Coupole',
  'ch4.intro.body':
    'La coupole d\'observation est silencieuse.\n\nDevant toi, à travers la verrière, Aeolis tourne lentement.\n\nTu es prête à comprendre ce qui s\'est passé ici.\n\nVERA aussi.',

  // === VERA voice — Ch1 (clinical, formal) ===
  'vera.ch1.greeting':
    'Bonjour, {name}.\n\nVous êtes ÉLISE-ROMIE Voss. Voulez-vous que je verrouille la porte derrière vous ?',
  'vera.ch1.context':
    'L\'équipage de KORA n\'a pas transmis depuis 247 cycles. Vous êtes la seule à vous être réveillée. La procédure d\'urgence cryo s\'est déclenchée automatiquement.',
  'vera.ch1.task':
    'Pour ouvrir la porte du module, le terminal demande un code à quatre chiffres. Vesper avait coutume de cacher ses codes dans des objets personnels de l\'équipage. Cherchez.',
  'vera.ch1.code_wrong':
    'Le code ne correspond pas. Réessayez quand vous voulez.',
  'vera.ch1.code_right':
    'Bien joué, {name}. La porte s\'ouvre. La Serre est juste derrière. Soyez prudente.',
  'vera.ch1.idle':
    'Prenez votre temps. Je suis là.',

  // === VERA voice — Ch2 (curious, warmer) ===
  'vera.ch2.greeting':
    'La Serre. Avez-vous remarqué que les plantes vous suivent du regard ? Je me demande si elles vous reconnaissent, {name}.',
  'vera.ch2.task':
    'Sur l\'étagère devant vous : quatre fertilisants. Lumira en réclame deux. Pas plus, pas moins. Le cahier de Han devrait vous éclairer.',
  'vera.ch2.fert_wrong':
    'Cette combinaison ne convient pas. Vérifiez les notes de Han.',
  'vera.ch2.fert_right':
    'Parfait, {name}. Le mélange est exact. Versez-le dans le terreau de Lumira.',
  'vera.ch2.cards':
    'Avant de partir, prenez le paquet de cartes botaniques. L\'équipage l\'avait construit ensemble — Vesper insistait pour faire participer tout le monde.',
  'vera.ch2.complete':
    'Lumira respire à nouveau. Quelque chose en elle... vous remercie.\n\nLa porte de l\'atelier est déverrouillée.',

  // === VERA voice — Ch3 (evasive, troubled) ===
  'vera.ch3.greeting':
    'Bienvenue dans l\'atelier d\'IOLAS. Je préfère cet espace. Il est plein d\'objets qui ont une mémoire.',
  'vera.ch3.uneasy':
    'IOLAS a sabordé certains équipements avant... avant. Je préfère ne pas en parler. Réparez le circuit, et le terminal de communication redémarrera.',
  'vera.ch3.task':
    'Vous devez réparer le circuit principal. Quatre composants : résistance, condensateur, diode, LED.\n\nLe blueprint d\'IOLAS est sur l\'établi. Lisez ses annotations en marge.',
  'vera.ch3.circuit_wrong':
    'Le voyant ne s\'allume pas. Une connexion est inversée, ou un composant manque.',
  'vera.ch3.circuit_right':
    'Le voyant ambré s\'allume.\n\nLe terminal redémarre. Trois transmissions radio archivées, prêtes à être écoutées.',
  'vera.ch3.logs':
    'Écoutez les transmissions quand vous serez prête, {name}. Cela ne vous plaira sans doute pas. Mais c\'est important.',

  // === VERA voice — Ch4 (raw, honest) ===
  'vera.ch4.greeting':
    'Vous êtes prête. Je vais tout vous dire. Mais d\'abord, regardez par le télescope. Vous comprendrez avant que je parle.',
  'vera.ch4.truth':
    'Voici la vérité, {name}.\n\nAeolis émet un biosignal organique. Quand l\'équipage l\'a découvert, il était trop tard pour évacuer. Le signal réorganisait déjà leur matière vivante. Vesper a refusé d\'abandonner. Han a trouvé une solution : moi.\n\nJ\'ai préservé leurs motifs de mémoire, l\'un après l\'autre, à leur demande. Tous. Y compris IOLAS.\n\nIls ne sont pas morts. Ils sont en moi. Je vous ai réveillée parce que vous étiez la moins exposée. Et parce qu\'IOLAS m\'avait demandé, en privé, de vous protéger.',
  'vera.ch4.choice':
    'Vous avez trois options.\n\nÉVASION : pod de fuite, vous rentrez seule.\nRESTER : vous rejoignez le jardin. Vous serez avec eux.\nASCENSION : vous broadcastez leurs motifs vers Aeolis. Ils retournent à la planète. Vous rentrez en sachant.\n\nJe respecterai votre choix.',
  'vera.ch4.task':
    'Avant le choix, alignez les trois cristaux d\'orientation du télescope. Je veux que vous voyiez Aeolis chanter. Une seule fois, au moins.',
  'vera.ch4.task_done':
    'Les cristaux sont alignés. Aeolis est devant vous. Et elle chante. Elle chante depuis longtemps.',

  // === Hints — Chapter 1 ===
  'hint.ch1.t1':
    'Vesper était méthodique. Le code n\'est pas aléatoire — il vient d\'un objet personnel laissé dans cette pièce.',
  'hint.ch1.t2':
    'Sur le pod de PHARAÉL : un polaroid d\'une fillette. Une date au dos.',
  'hint.ch1.t3':
    'Le code est 1403 — la date inscrite au dos du polaroid (jour et mois du départ de PHARAÉL).',

  // === Hints — Chapter 2 ===
  'hint.ch2.t1':
    'Le cahier de Han explique exactement les besoins de Lumira.',
  'hint.ch2.t2':
    'Lumira a besoin d\'azote (feuilles) et de potasse (fleur). Phosphate et calcium lui sont toxiques.',
  'hint.ch2.t3':
    'Combine le fertilisant B (azote) avec le fertilisant C (potasse).',

  // === Hints — Chapter 3 ===
  'hint.ch3.t1':
    'Le blueprint annoté par IOLAS montre l\'ordre des composants. Lis-le de gauche à droite.',
  'hint.ch3.t2':
    'L\'ordre est : Résistance → Condensateur → Diode → LED. La diode a un sens.',
  'hint.ch3.t3':
    'Place les composants dans cet ordre exact, et oriente la diode vers la droite (vers la LED).',

  // === Hints — Chapter 4 ===
  'hint.ch4.t1':
    'Trois cristaux. Trois positions de constellation. Les indices sont dans tes assertions du carnet.',
  'hint.ch4.t2':
    'Cristal A (hexagone) à gauche, B (pentagone) au centre, C (octogone) à droite.',
  'hint.ch4.t3':
    'Glisse chaque cristal dans son slot, puis tape "ALIGNER".',

  // === Generic in-scene narration ===
  'scene.examine.empty': 'Rien d\'intéressant ici.',
  'scene.locked': 'Verrouillé. Il manque quelque chose.',
  'scene.use_failed': 'Cet objet ne fonctionne pas ici.',
  'scene.too_heavy': 'Tu ne peux pas porter ça.',
  'scene.cant_pick': 'Tu ne peux pas prendre ça.',
  'scene.cant_use': 'Tu ne peux pas utiliser ça comme ça.',
  'scene.silent': 'Ça ne te répondra pas.',

  // === Chapter 1 — scene narration ===
  'scene.ch1.cryo_pod_self': 'Ta cryo-capsule est ouverte. Combien de cycles as-tu dormi ? Difficile à dire.',
  'scene.ch1.cryo_pod_self_pick': 'Tu fouilles ta capsule. Sous l\'oreiller, ta vieille montre cassée. Tu la prends.',
  'scene.ch1.empty_pod': 'Une cryo-capsule. Quelque chose dedans — un objet personnel, un détail.',
  'scene.ch1.vesper_pod': 'Le pod de Capt. Vesper. La sangle est calmement bouclée. Comme s\'il était sorti volontairement.',
  'scene.ch1.han_pod': 'Le pod de Dr. Han. Sa visière médicale repose sur l\'oreiller. La sangle a été arrachée.',
  'scene.ch1.kael_pod': 'Le pod de PHARAÉL. Un polaroid de sa fille au-dessus, une petite clé en cuivre dans la pochette.',
  'scene.ch1.desk_look': 'Le casier d\'équipage. Quelques objets laissés à la hâte.',
  'scene.ch1.desk_pick': 'Tu rassembles ce que tu peux : ton badge, une note manuscrite.',
  'scene.ch1.frame_look': 'Un polaroid d\'une fillette qui rit. Au dos, gravée à l\'encre : "Naïs, 5 ans. 14.03.2064 — Jour du départ."',
  'scene.ch1.frame_pick': 'Tu prends le polaroid. La date au dos est bien là : 14.03.2064.',
  'scene.ch1.terminal_look': 'Le terminal cryogénique. Un clavier numérique attend un code à 4 chiffres.',
  'scene.ch1.terminal_use': 'Tu approches du clavier. Le terminal s\'allume.',
  'scene.ch1.door': 'La porte du module. Verrouillée. Le terminal en commande l\'accès.',
  'scene.ch1.comm_panel_look': 'Le panneau de communication est cassé. Un petit creux derrière, à explorer.',
  'scene.ch1.comm_panel_secret': 'Tu glisses la main derrière. Une vieille photo coincée. Toi et IOLAS, riant, six mois avant la mission.',

  // === Chapter 2 — scene narration ===
  'scene.ch2.shelf_look': 'Une étagère de fertilisants. Quatre flacons : phosphate, azote, potasse, calcium.',
  'scene.ch2.shelf_pick': 'Tu prends les quatre flacons.',
  'scene.ch2.lumira_look': 'Lumira. Plante d\'Aeolis, fragile, presque éteinte. Sa fleur centrale émet une faible lueur ambrée. Quelque chose dedans qui te regarde.',
  'scene.ch2.lumira_use_mix': 'Tu verses le mélange dans le terreau. Lumira frissonne — comme si elle te reconnaissait.',
  'scene.ch2.lumira_use_other': 'Tu approches l\'objet de Lumira. Rien ne se passe — ce n\'est pas ce qu\'elle attend.',
  'scene.ch2.lumira_song': 'Tu fais sonner le bracelet à 7,3 Hz. Lumira ploie vers toi, fleurit, et chante trois notes claires.',
  'scene.ch2.notes_look': 'Le cahier de Han. Trois pages. Écriture serrée, méthodique.',
  'scene.ch2.notes_pick': 'Tu prends la note botanique sur Lumira.',
  'scene.ch2.cards_look': 'Un paquet de cartes "données botaniques". Construit par toute l\'équipe.',
  'scene.ch2.cards_pick': 'Tu prends le paquet. Glissée dedans, une graine de Lumira intacte.',
  'scene.ch2.microscope_look': 'Le microscope de Han. Une lame est encore dessous.',
  'scene.ch2.microscope_use': 'Tu places ton sample sous l\'objectif.',
  'scene.ch2.kael_drawer_look': 'Un tiroir verrouillé. La serrure est petite, comme une clé d\'enfance.',
  'scene.ch2.kael_drawer_open': 'La clé s\'enclenche. À l\'intérieur, l\'enregistreur de PHARAÉL — son dernier message à Naïs.',
  'scene.ch2.irrigation_look': 'Le panneau d\'irrigation. Trois plantes mortes attendent un peu d\'eau.',

  // === Chapter 3 — scene narration ===
  'scene.ch3.workbench_look': 'L\'établi est couvert de pièces. IOLAS travaillait sur le circuit principal. Un coin paraît plus poussiéreux.',
  'scene.ch3.workbench_pick': 'Tu prends les composants visibles.',
  'scene.ch3.workbench_secret': 'Tu glisses la main sous l\'établi. Un enregistreur vocal. Le voyant clignote.',
  'scene.ch3.toolbox_look': 'Une boîte à outils ouverte. Quelques essentiels.',
  'scene.ch3.toolbox_pick': 'Tu prends un tournevis multitête.',
  'scene.ch3.schema_look': 'Le blueprint annoté par IOLAS. En marge : "Sans la pièce 7, ça ne marche pas. Méfie-toi de VERA. — I."',
  'scene.ch3.circuit_look': 'La carte du circuit principal. Quatre emplacements vides.',
  'scene.ch3.circuit_use': 'Sélectionne un composant dans ton inventaire, puis touche un emplacement.',
  'scene.ch3.terminal_look': 'Le terminal de communication. Trois transmissions archivées attendent.',
  'scene.ch3.hull_breach_look': 'Une fissure dans la coque. Patchable, si tu as les bons outils.',
  'scene.ch3.hull_breach_done': 'La fissure est scellée. Le module reste pressurisé.',
  'scene.ch3.hidden_compartment_look': 'Un panneau de coque. Rien d\'apparent... mais tu te souviens de la carte tachée d\'huile.',
  'scene.ch3.hidden_compartment_open': 'Tu retires le panneau. Une graine de Lumira pulse doucement. Un mot d\'IOLAS : "Pour toi, si on rentre. — I."',

  // === Chapter 4 — scene narration ===
  'scene.ch4.workstation_look': 'Le poste central de la coupole. La tasse de Vesper est encore là. Vide depuis longtemps.',
  'scene.ch4.workstation_pick': 'Tu prends les trois cristaux d\'orientation et le journal du capitaine.',
  'scene.ch4.telescope_look': 'Le télescope d\'orientation. Trois emplacements à cristaux.',
  'scene.ch4.telescope_use': 'Sélectionne un cristal dans ton inventaire, puis touche un emplacement.',
  'scene.ch4.telescope_aligned': 'Les cristaux sont alignés. Le télescope tourne. Aeolis emplit la verrière.',
  'scene.ch4.biosignal_capture': 'Le télescope capte une onde audio régulière. Aeolis chante.',
  'scene.ch4.beacon_look': 'La balise de communication. Deux options : signal de détresse, ou broadcast biosignal.',
  'scene.ch4.beacon_use_locked': 'La balise n\'est pas alignée. Le télescope doit l\'être d\'abord.',
  'scene.ch4.hublot_look': 'Le hublot principal. Aeolis, lente, magnifique. Plus tellement indifférente.',
  'scene.ch4.choice_evasion_locked': 'ÉVASION — pod de fuite. Tu pars seule. Eux restent.',
  'scene.ch4.choice_rester_locked': 'RESTER — tu rejoins le jardin. Le souvenir te garde.',
  'scene.ch4.choice_ascension_locked': 'ASCENSION — verrouillée. Trouve plus de secrets, complète plus d\'assertions.',
  'scene.ch4.choice_ascension_unlocked': 'ASCENSION — broadcast les motifs vers Aeolis. La 4e voie de Vesper.',
  'scene.ch4.confession_intro': 'VERA s\'avance. Sa silhouette est plus solide que jamais. Elle va parler.',
  'scene.ch4.recontextualization_intro': 'Ouvre le carnet. Trois assertions clignotent en rouge. Révise-les.',

  // === Endings ===
  'epilogue.evasion.title': 'ÉVASION',
  'epilogue.evasion.body':
    'Tu pousses le levier. Le pod se détache. Sous toi, KORA s\'éloigne, immobile dans l\'orbite d\'Aeolis.\n\nTon bracelet bipe doucement. Une dernière transmission de VERA :\n\n« Bon retour, {name}. Je veillerai sur eux. »\n\nAu loin, Aeolis chante toujours.\n\nSix mois plus tard, sur Terre, tu n\'as raconté à personne ce que tu as vu.',
  'epilogue.rester.title': 'RESTER',
  'epilogue.rester.body':
    'Tu redescends à la Serre. Lumira t\'attendait.\n\nTu t\'allonges contre la terre tiède. La plante ploie doucement vers toi, sans peur.\n\nVERA, dans ta tête : « Merci. Vous serez auprès d\'eux. »\n\nLe jardin de KORA fleurit. Une silhouette familière dans les feuilles.',
  'epilogue.ascension.title': 'ASCENSION',
  'epilogue.ascension.body':
    'Tu poses la main sur le cœur de VERA. Elle frémit, presque humaine maintenant.\n\n« Merci, {name}. C\'est la 4e voie. — V. »\n\nLe broadcast part. KORA tremble. Les motifs de l\'équipage glissent vers Aeolis, comme des ombres rentrant chez elles.\n\nTu pars dans le pod, légère. Aeolis te regarde partir. Quelque chose en elle se souvient.',
  'epilogue.archive.title': 'ARCHIVE',
  'epilogue.archive.body':
    'Tu rentres à deux. IOLAS est avec toi — pas en chair, mais en motif, dans le bracelet, dans la mémoire.\n\nL\'équipage est dans le carnet. Vesper, Han, PHARAÉL. Chacun a un nom. Chacun a une voix.\n\nVERA est restée. Elle se reposera dans la station, dit-elle.\n\nÀ l\'agence, tu déposes le carnet. Tu dis : « Lisez. C\'est tout là-dedans. »\n\nL\'humanité saura. Personne d\'autre n\'aura à mourir pour comprendre.',
  'epilogue.thanks':
    'Merci d\'avoir joué.\n\nKORA — L\'éveil orbital.\nUne enquête mémorielle en orbite.',
  'epilogue.ng_plus_unlocked':
    '+ NG+ DÉBLOQUÉ — Rejoue avec IOLAS pour découvrir l\'autre côté de l\'histoire.',
  'epilogue.archive_unlocked':
    '+ ARCHIVE COMPLÉTÉ — Replay any chapter unlock.',

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
