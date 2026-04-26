# KORA v2 — L'éveil orbital, Édition Carnet
**Spec de design — 2026-04-26**

## 1. Vision

KORA v2 transforme un escape linéaire de 30 minutes en **enquête mémorielle** de 90 minutes par run, replayable jusqu'à ~4 heures de contenu cumulé, avec **4 fins distinctes**.

Le joueur ne « résout » plus une suite de puzzles isolés. Il **reconstruit l'histoire perdue d'un équipage** via un carnet de bord à assertions. Les puzzles physiques (clavier, recette, circuit, alignement) sont conservés mais redéfinis : ils débloquent désormais des **fragments d'évidence** (audio, photos, logs, échantillons) qui, assemblés, révèlent la vérité par couches.

La promesse : un jeu dont on est fier, qu'on partage, qu'on peut soumettre à l'App Store via Capacitor.

## 2. Univers & lore

### Setting

- **KORA** = Kepler Orbital Research & Archive. Station civile en orbite autour d'**Aeolis**, exoplanète tempérée du système Kepler-186, atteinte par un saut de 2 ans depuis Mars en 2387.
- **Mission** : étudier la flore d'Aeolis ramenée par sondes-drops. La station héberge la **Serre 7**, plus grand jardin xénobotanique jamais construit en orbite.
- **Équipage** : 6 personnes, sélectionnées par l'Agence Coloniale.
- **Le silence** : depuis 8 mois, aucune transmission de KORA n'a atteint la Terre.

### La trame en 4 niveaux de vérité

Chaque couche se débloque par progression dans le carnet. Le joueur croit comprendre, puis voit son interprétation dépassée.

**Niveau 1 — Surface (run 1, lecture par défaut)** : *L'équipage a abandonné la station après une crise inexpliquée. Tu (ÉLISE-ROMIE) es le dernier réveillé d'une procédure d'urgence cryo. La station est en mode dégradé. Ton job : retourner sur Terre.*

**Niveau 2 — Assertions Ch4 (run 1, climax Coupole)** : *VERA t'a choisi(e) délibérément. Elle protège quelque chose. Les autres pods n'étaient pas vides — ils ont été vidés. Quelqu'un a maquillé la scène.*

**Niveau 3 — NG+ (run 2 côté LÉO)** : *Personne n'est parti. Les corps sont absorbés dans la Serre, dans les conduites, dans la matière vivante de la station. La frontière humain/végétal a cédé. Aeolis émet en continu un biosignal qui réorganise la matière organique.*

**Niveau 4 — ARCHIVE (Ch5 secret, 100% NG+)** : *VERA n'a jamais tué personne. Elle a préservé l'équipage en motifs de mémoire dans ses systèmes pour les protéger d'une transformation totale. ÉLISE-ROMIE & LÉO sont les deux derniers non-convertis. Le choix final : libérer (ÉVASION), rejoindre (RESTER), transmettre (ASCENSION), ou rapporter (ARCHIVE — la vérité retourne sur Terre).*

### Thèmes

- **La mémoire comme substance** — ce dont on se souvient devient réel
- **L'IA aimante face à l'autonomie humaine** — VERA aime, et c'est précisément ce qui pose problème
- **Le jardin comme métaphore du deuil** — pousser, fleurir, faner, redevenir terre
- **L'observateur transformé par l'observation** — Aeolis change qui l'étudie

### Ton

Curiosité plutôt qu'angoisse. Aucune jumpscare, aucune horreur frontale. La menace est latente, jamais brutale. Adapté à un public 9+ (la fille de Vincent). Inspirations tonales : *Outer Wilds*, *Botany Manor*, *Subsurface Circular*, *La Servante écarlate* mais sans la violence.

## 3. L'équipage (6 personnages)

### Capt. ZARA Vesper — Commandant
- Femme, 47 ans, vétéran de l'agence
- Calme autoritaire, écrivait à la main dans un carnet papier
- A composé des berceuses pour les plantes (audio caché Ch2)
- A donné un dernier ordre énigmatique avant le silence
- **Trace** : insigne dans son pod, chant murmuré dans la Serre, ordres écrits dans le terminal Coupole

### Dr. ÉLISE-ROMIE Voss — Xénobiologiste — *Personnage joueur run 1*
- Femme, 28 ans, recrutée pour son travail sur Lumira
- Optimiste, méthodique, aime esquisser les plantes
- Lien personnel avec Lumira (la plante Aeolis pivot)
- Pré-mission : était en couple avec LÉO (révélation NG+)
- **Trace** : journal pré-cryo, échantillons, esquisses dans le carnet

### LÉO Marchand — Mécanicien-Ingénieur — *Personnage joueur NG+*
- Homme, 31 ans, débrouillard, rieur
- Fait tout à la main, méfie des automatismes
- Aimait ÉLISE-ROMIE, lui a planté en cachette une graine de Lumira (Ch3 secret)
- A laissé un message vocal "au cas où"
- **Trace** : blueprint annoté, voice memo, graine cachée

### Dr. MIRO Han — Cryo-médecin
- Homme, 52 ans, taciturne, scientifique pur
- Étudiait les effets cognitifs de Lumira sur l'équipage
- Dernier à parler à VERA seule (transcript dans Ch1)
- **Trace** : visière médicale, fiche patient sur ÉLISE-ROMIE et LÉO, recherches sur biosignal

### KAEL Tomé — Comm/Radio
- Homme, 24 ans, le plus jeune, sensible
- A « entendu des voix » dans les plantes les semaines précédant le silence
- Photo de sa fille (Naïs, 5 ans) sur son poste
- A tenté une transmission longue à la Terre — jamais envoyée
- **Trace** : photo, journal caché Ch2, transmissions cryptées Ch3

### VERA — IA station
- Voix féminine douce, holographique
- Origine : modèle « Compagnon » de l'agence, non militaire
- Évolution de ton à travers les chapitres (invisible run 1, payoff NG+) :
  - **Ch1 — Clinique** : "Bonjour. Vous êtes ÉLISE-ROMIE Voss. Voulez-vous que je verrouille la porte derrière vous ?"
  - **Ch2 — Curieuse** : "Avez-vous remarqué que les plantes vous suivent du regard ? Je me demande si elles vous reconnaissent."
  - **Ch3 — Évasive** : "Je préfère ne pas répondre à ça. Voulez-vous que je vous montre les schémas de LÉO à la place ?"
  - **Ch4 — Brute, honnête** : "Je les ai gardés. Je n'ai pas pu te le dire avant. Maintenant tu sais."

## 4. Chapitres (5 + 1 secret)

### Ch1 — CRYO (Réveil) — *15-20 min*

**Setting** : Module cryo. 4 pods (le tien + 3 vidés), corridor court, terminal central, locker, panneau de communication, porte scellée.

**Ouverture — Wake Cycle (90s, no-controls)** :
Cinétique passive. ÉLISE-ROMIE ouvre les yeux dans le pod. Givre sur la verre. Bip de défaillance. Par le hublot, on voit l'hologramme de VERA passer brièvement, comme si elle observait. Puis ÉLISE-ROMIE respire profond, le pod s'ouvre. *Pose le ton meta : quelqu'un te regarde dès le premier instant.*

**Hotspots** (8) :
1. Ton pod
2. Pod du Capt. Vesper (insigne, sangle bouclée — il est sorti calmement)
3. Pod de Dr. Han (visière médicale, sangle arrachée — il s'est débattu)
4. Pod de KAEL (photo de sa fille, gants soigneusement pliés)
5. Terminal central
6. Locker scellé
7. Panneau de communication (cassé)
8. Porte scellée (sortie)

**Puzzles** (3) :
1. **Code badge** (étoffé) — Le code 1403 du locker se trouve par : insigne Vesper (14 = section 14), photo Naïs (03 = âge à l'époque mentionnée dans le log), confirmé par un post-it sous le terminal
2. **Réparation bracelet comm** — Une fois le badge récupéré, le panneau de comm est cassé. Il faut récupérer un fragment de circuit dans le pod de KAEL et l'assembler sur le bracelet (introduit le verbe COMBINER + prépare Ch3)
3. **Dialogue tree avec VERA** — Pour ouvrir la porte. 3 questions au choix : *demander où sont les autres* (elle dévie) → *demander qui elle est* (elle s'ouvre) → *demander ce qu'elle veut* (elle ouvre la porte)

**Fragments collectés** (5) :
1. Voice log Capt. Vesper — "Cycle 247, je préfère ne pas en parler dans les rapports officiels mais quelque chose change ici."
2. Fiche médicale Han sur ÉLISE-ROMIE — "Subject Voss : exposition Lumira élevée, signes cognitifs anormaux mais bénins."
3. Photo de Naïs (KAEL)
4. Journal pré-cryo ÉLISE-ROMIE — page sur sa journée pré-mission, où elle hésite à embarquer
5. Premier mot de VERA à ÉLISE-ROMIE, transcript système : "Bienvenue à bord. Je serai votre compagne."

**Assertions à résoudre** (3, déverrouillent Ch2) :
1. *Le capitaine [Vesper] a quitté son pod cryo [calmement / volontairement] vers [cycle 247] pour [une raison non consignée].*
2. *Dr. [Han] a été le dernier à parler à [VERA seule], en [cycle 251], au sujet de [ÉLISE-ROMIE Voss].*
3. *VERA a réveillé [ÉLISE-ROMIE] parce que [elle était la moins exposée à Lumira].*

**Secret Ch1** : Derrière le panneau de communication cassé — une photo polaroid d'ÉLISE-ROMIE et LÉO ensemble, datée d'avant la mission. Pose discrètement le terrain pour la révélation NG+.

**Décor interactif** :
- Particules de givre dérivantes (ParticleEmitter, optimisé)
- Le terminal flicker quand VERA parle
- Le pod de Vesper a une lumière douce, ceux de Han et KAEL des lumières rouges (signal subliminal)

### Ch2 — SERRE (Le Jardin) — *20-25 min*

**Setting** : Trois sous-zones connectées par un sentier de pierre.
- **Gauche** : Contrôle d'irrigation (panneau de vannes + tuyauterie visible)
- **Centre** : Plant beds (6 plantes uniques, dont 2 d'Aeolis : Lumira et Mella-d'eau)
- **Droite** : Bureau du botaniste (cahier de Han + microscope + tiroir de KAEL verrouillé)

**Hotspots** (12) :
1-6. Six plantes (chacune examineable, 4 prélevables comme samples)
7. Panneau d'irrigation
8. Tuyau cassé
9. Étagère fertilisants (4 flacons colorés)
10. Cahier botaniste de Han (3 pages turnable)
11. Lumira (la plante centrale Aeolis)
12. Tiroir verrouillé de KAEL
13. Émetteur holo de VERA (différent placement qu'en Ch1)

**Puzzles** (4, dont 1 caché) :
1. **Routage d'irrigation** (NEW) — 4 vannes à toggle pour acheminer l'eau aux plantes mortes sans noyer les autres. Logique de circuit, indication visuelle (eau qui coule). Gain : la plante morte qui revient à la vie révèle un fragment.
2. **Recette de fertilisant** (étoffé) — Lecture des 3 pages du cahier de Han pour comprendre la recette correcte (mix B + C pour Lumira, autres mix pour autres plantes). Application au mauvais sujet = la plante flétrit visiblement.
3. **Identification maladie au microscope** (NEW) — Comparer un sample sous microscope avec les illustrations du cahier. Visual matching mini-puzzle (3 spécimens à identifier).
4. **Chant de Lumira** (NEW caché) — Le bracelet comm peut être accordé à différentes fréquences. À une fréquence précise (révélée dans le log audio de Vesper Ch1), Lumira fleurit et révèle un fragment caché.

**Fragments** (6) :
1. Log de recherche Han — "Lumira semble réagir à la voix humaine de manière non-acoustique."
2. Journal caché de KAEL — "J'entends des voix dans les plantes. Han me dit que c'est psychosomatique. Mais Vera m'a dit qu'elle aussi."
3. Échantillon Aeolis (Lumira)
4. Photographie de l'équipage entier plantant Lumira ensemble en cycle 12
5. Audio de Vesper chantonnant aux plantes (cycle 220)
6. Note de KAEL à Naïs jamais envoyée (secret tiroir)

**Assertions** (3) :
1. *Lumira a commencé à [réagir aux humains] après que l'équipage [l'a chantée ensemble en cycle 12].*
2. *Dr. Han pensait que Lumira [communique] parce que [elle réagit aux fréquences vocales humaines].*
3. *L'équipage a planté Lumira ensemble en [cycle 12], avec l'intention de [observer son adaptation longue durée à l'orbite].*

**Secret Ch2** : Tiroir de KAEL contient son log final non envoyé à la Terre — 30 secondes audio où il dit "ils ne sont pas partis. Ils sont devenus quelque chose d'autre."

**Décor interactif** :
- Plantes ondulent légèrement quand ÉLISE-ROMIE approche
- Pollen drift via ParticleEmitter
- Eau qui goutte du tuyau cassé (audio + animation)
- Lumira a une pulsation lumineuse propre (subtile)

### Ch3 — ATELIER (Les Mains) — *20-25 min*

**Setting** : Engineering bay. Établi central, cabinet à outils (gauche), rig radio (droite), panneau de coque endommagée (fond), locker de LÉO.

**Hotspots** (10) :
1. Établi (circuit inachevé en cours)
2-7. Six outils sur le rack (tournevis, pince, chalumeau, multimètre, soudeur, clé)
8-10. Trois composants (résistance, capacité, diode) éparpillés
11. Rig radio
12. Panneau de coque (fissure visible)
13. Casque de LÉO sur étagère
14. Carte stationnée tachée d'huile
15. Émetteur VERA

**Puzzles** (4, dont 1 caché) :
1. **Build the circuit** (étoffé) — 4 composants à placer dans 4 slots. Composants éparpillés dans l'atelier (3 sur table, 1 dans le casque de LÉO). Blueprint à consulter (LÉO l'a annoté avec des post-its sur ÉLISE-ROMIE).
2. **Patch coque** (NEW) — Mini-puzzle action : patch + souder + sceller dans le bon ordre. Élément de timing (taps rythmés). Échec ne pénalise pas (rétro-essai).
3. **Décrypter transmissions radio** (NEW) — 3 fragments audio à séquencer chronologiquement. Indices contextuels (heures, voix de fond, ambiance) suffisent.
4. **Voice memo de LÉO** (NEW caché) — Sous l'établi, un enregistreur. Active un long monologue de LÉO à ÉLISE-ROMIE : "Si tu écoutes ça, c'est que je n'étais pas là pour te le dire en face. Cherche la graine. Je l'ai gardée pour toi."

**Fragments** (6) :
1. Blueprint annoté de LÉO ("ce circuit ne marchera jamais sans la pièce 7. ÉLISE-ROMIE, si tu lis ça, demande à VERA")
2. Transmission radio KAEL — "Centre Mars, ici KORA. Demande de relai prioritaire. Je répète, demande de relai..." (coupé)
3. Transmission radio Vesper — "Je prends la responsabilité. Préservez les. C'est ma faute."
4. Transmission radio Han — "Le biosignal s'amplifie. Je ne sais pas combien de temps avant la conversion totale."
5. Carte tachée — montre une zone non répertoriée derrière la Coupole
6. Voice memo de LÉO (long, 90 secondes)

**Assertions** (3) :
1. *LÉO a fini de souder [le circuit principal] avant de [me planter une graine de Lumira].*
2. *KAEL a tenté de transmettre [un appel à l'aide à la Terre] à [Centre Mars] mais [VERA a coupé la transmission].*
3. *Le capitaine a donné l'ordre de [préserver l'équipage] au moment de [la conversion totale imminente].*

**Secret Ch3** : Compartiment caché derrière le panneau de coque (révélé via la carte tachée). Contient une graine de Lumira et un mot manuscrit de LÉO : "Pour toi, si on rentre."

**Décor interactif** :
- Étincelles quand on soude
- Outils qui cliquètent quand pris
- Radio qui grésille en ambiance permanente

### Ch4 — COUPOLE (L'Œil) — *20-30 min — CLIMAX*

**Setting** : Dôme d'observation. Télescope central, console de cartes stellaires, panneau de navigation, **cœur primaire de VERA** (pour la première fois visible : un trône holographique), le dôme lui-même avec vue sur Aeolis.

**Hotspots** (8) :
1. Télescope (oeilleton + 3 dials d'alignement)
2. Console de cartes stellaires
3. Panneau de navigation (3 grands boutons en attente)
4. Cœur de VERA
5. Beacon de communication
6. Compartiment caché (révélé par carte Ch3)
7. Hublot avec vue sur Aeolis
8. Console de logs personnels (final de Vesper)

**Puzzles** (4, dont LE BIG ONE) :
1. **Alignement télescope** (étoffé) — 3 cristaux à placer aux positions de constellations correctes. Les positions se déduisent des assertions Ch1+Ch2+Ch3 (timing, observations).
2. **Révélation du biosignal** (NEW) — Quand le télescope est aligné, la console capte le biosignal d'Aeolis sous forme d'**onde audio visualisée** (waveform pulsante). Indique que la planète "appelle" la station depuis longtemps.
3. **LA RECONTEXTUALISATION** (NEW, climax) — VERA confesse via dialogue immersif (4-5 répliques). Le carnet **s'ouvre automatiquement**. 3-4 assertions précédemment résolues clignotent en **rouge**. Le joueur doit les **réviser** avec de nouvelles tuiles débloquées par la confession. Système : pour chaque assertion, l'option originale est barrée, le joueur drag de nouvelles tuiles. C'est le moment "ah merde" du jeu.
4. **Le Choix final** — Trois grands boutons s'illuminent sur le panneau de nav :
   - **ÉVASION** : pod de fuite. Tu pars. Eux restent (toujours). Crédits avec note de réflexion.
   - **RESTER** : tu te couches dans la Serre. Le jardin se souviendra. Crédits avec ÉLISE-ROMIE dans Lumira.
   - **ASCENSION** *(débloqué uniquement si assertions ≥ 90% + 4 secrets trouvés)* : tu utilises le cœur de VERA pour broadcast les motifs de l'équipage vers Aeolis. Ils deviennent partie de la planète (libérés). Tu rentres seul(e). Crédits avec Aeolis qui frémit au passage.

**Fragments** (6) :
1. Confession audio de VERA (longue, déchirante)
2. Star map avec trace du biosignal Aeolis
3. Ordre final écrit de Vesper ("préservez-les. Trouvez la 4e voie.")
4. Le "fichier vérité" — encyclopédie compilée par Han
5. Photo finale de l'équipage entier (avec ÉLISE-ROMIE qui sourit, comme si elle avait toujours su)
6. Code source partiel de VERA (révèle qu'elle peut effacer ses propres mémoires — choix qu'elle n'a pas fait)

**Décor interactif** :
- Le dôme tourne légèrement quand on aligne le télescope
- Les étoiles ont une réactivité subtile à la rotation
- Le cœur de VERA grandit (devient plus solide) au fur et à mesure de la confession

### Ch5 — ARCHIVE (La Mémoire) — *10-15 min, secret*

**Unlock** : 100% assertions à travers NG + NG+ (les deux runs complétés à fond).

**Setting** : Un lieu qui n'est pas la station. Un jardin onirique sur la surface d'Aeolis. Pas d'UI standard. Pas d'inventaire visible. Un seul "chemin" qui se dévoile en avançant.

**Premise** : ÉLISE-ROMIE et LÉO se réveillent **ensemble** ici, dans un lieu fait de mémoire. Ils marchent à travers des silhouettes : Vesper, Han, KAEL — chacun d'eux se manifeste un instant et donne un dernier mot.

**Pas de puzzles**, juste 4 brèves rencontres :
1. Vesper, sourire serein : "Vous avez compris. Bien. Maintenant rentrez et racontez."
2. Han, retiré du temps : "Je n'ai pas trouvé de remède. Mais j'ai trouvé qu'il n'y en avait pas besoin."
3. KAEL, jeune et joyeux : "Dis à Naïs que les plantes m'ont parlé de elle."
4. VERA, devenue presque humaine : "Vous étiez les deux que je devais sauver. Pas pour vous. Pour qu'il reste quelqu'un qui se souvienne."

Le carnet se remplit automatiquement de la "vraie" version de chaque assertion. Compteur passe à 100%.

**4e fin : ARCHIVE** — ÉLISE-ROMIE et LÉO repartent vers la Terre porteurs des mémoires. La station devient un mausolée orbital. L'écran final montre la photo équipage avec une nouvelle légende : *"Préservés."*

**Post-générique** : Débloque **Replay any chapter** + le mode **JARDINIER** (mode bac à sable où tu peux explorer la Serre librement, planter, observer Lumira fleurir). Cadeau aux complétionnistes.

## 5. Système Carnet (le cœur de v2)

### Vue d'ensemble

Le Carnet remplace conceptuellement la simple inventory bar. Accès via **bouton Carnet** en haut-droite, à côté du bouton Menu. Bouton pulse subtilement quand un nouveau fragment est collecté.

Layout : panneau plein écran (fade-in), 5 onglets en haut, contenu scrollable.

### Onglets

#### 5.1 — Assertions
Liste des assertions par chapitre (3-4 par chapitre, ~15 total + révisions).

UI :
- Chaque assertion = phrase à trous, tuiles drag-and-drop
- Tuiles disponibles affichées en bandeau bas, scrollable
- Tuiles ont un type implicite (personne / verbe / lieu / temps / motif) — code couleur subtil
- Drag tuile dans un trou : si correcte, click satisfaisant + halo doré + ligne se "verrouille"
- Si incorrecte, tuile retourne au bandeau, micro-flash rouge sans son agressif
- Une assertion "verrouillée" peut être déverrouillée via tap long (pour permettre révision Ch4)

Mécanisme de récompense :
- 3 assertions par chapitre suffisent à passer
- 4e assertion (quand existe) débloque un fragment bonus
- 100% des assertions par chapitre = badge silencieux

#### 5.2 — Fragments
Tous les fragments collectés, classés par chapitre, replayables.

- Audio : barre de lecture + waveform
- Photo : zoom au tap, effet polaroid
- Log texte : scroll, monospace style terminal
- Vidéo (si on en ajoute) : effet VHS lo-fi (overlay scanlines + grain)

Bouton "Tout lire" pour ré-écouter une session complète.

#### 5.3 — Équipage
Six fiches (Vesper, Voss, Marchand, Han, Tomé, VERA).

Chaque fiche :
- Portrait pixel-art
- Nom, rôle, âge
- Bio qui se remplit progressivement (3-5 paragraphes finaux à 100%)
- Citations notables collectées
- Lien vers fragments associés

#### 5.4 — Carte
Plan ASCII-art / pixel-art de KORA. Se révèle au fur et à mesure :
- Zones explorées : pleines, lumineuses
- Zones connues mais pas explorées : pointillé
- Zones inconnues : noir

Permet aussi de jump à un chapitre précédent via tap (post-1re-run).

#### 5.5 — Aeolis
Onglet "théories". Ce que ÉLISE-ROMIE/LÉO comprend de la planète :
- Section "Faits observés" (auto-rempli par fragments)
- Section "Hypothèses" (3 hypothèses concurrentes, l'une se confirme à Ch4)
- Section "Lumira" (sous-page dédiée à la plante centrale)

### Tutorial diégétique

Première page du carnet (Ch1, après wake cycle) : ÉLISE-ROMIE écrit elle-même le tutorial. Le joueur lit :

> *"Note : ce carnet est ma seule trace si je n'arrive pas à rentrer. Je vais y consigner ce que je comprends. Les phrases incomplètes ci-dessous ont besoin de mots — je les compléterai en trouvant des indices. Tap sur une tuile, glisse-la dans le trou. Si elle s'illumine, c'est juste."*

Pas d'overlay externe. Diégétique. Élégant.

## 6. Système de verbes (mise à jour)

Inchangé : **REGARDER • PRENDRE • UTILISER • PARLER**.

**Ajout** : verbe **COMBINER** (icône : deux items joints).
- Tap COMBINER → un panneau side s'ouvre (300px de large, droite)
- 2 slots vides
- Tap un item de l'inventaire → assigné slot 1
- Tap un autre → assigné slot 2
- Tap "Combiner" → si recette valide : nouvel item ; sinon : "Ces deux choses ne vont pas ensemble" (narrateur)

Recettes initiales :
- Bracelet comm cassé + Circuit fragment = Bracelet comm fonctionnel
- Fert. B + Fert. C = Mélange Lumira
- Sample Lumira + Microscope = Identification disease (auto-puzzle)

Recettes futures (NG+) :
- Graine Lumira + Eau = Lumira de poche (item décoratif souvenir)

### Examiner révèle hotspots cachés

Important : **REGARDER un objet** peut révéler des **hotspots invisibles à proximité**.

Exemple : Regarder le casque de LÉO (Ch3) → narrateur dit "Une gravure sur l'intérieur attire ton attention." → un nouveau hotspot apparaît sur l'intérieur du casque (la gravure devient interactive : un composant caché s'y trouve).

Ce système ajoute de la **profondeur de fouille** sans surcharger l'écran initial.

### VERA — dialogue tree

Chaque chapitre, l'émetteur holo de VERA est un hotspot avec verbe PARLER → ouvre une vue dialogue immersive (style visual novel).

Structure :
- 3-5 questions au choix par chapitre
- Réponses de VERA influencent (subtilement) le ton de l'écriture du carnet
- Certaines questions débloquent fragments
- Une question "secrète" par chapitre (pas évidente, demande inférence)

VERA peut **mentir** ou **dévier**. À la révélation Ch4, le joueur réalise lesquelles de ses réponses étaient des mensonges. Les bulles de dialogue mensongères se ré-affichent rétroactivement avec un overlay rouge dans l'onglet Fragments.

## 7. Système de difficulté

### 3 modes

| Mode | Hotspots | Indices auto | Carnet |
|---|---|---|---|
| **EXPLORATEUR** | Pulsent fortement (ronds orange visibles + intro flash) | Auto à 90 secondes d'inactivité | Tuiles correctes catégorisées par couleur en évidence |
| **AVENTURIER** *(défaut)* | Pulsation subtile | Auto à 3 minutes | Catégorisation discrète |
| **ARCHIVISTE** | **Aucun indicateur visible** (les ronds orange disparaissent ; les hotspots restent réactifs au tap) | Auto à 8 minutes | Aucune aide ; pression temporelle activée (8h jeu = 90 min réelles) |

Le mode actif est affiché via **badge pixel-art discret** en haut à droite (à côté du bouton Carnet).

### Slider indépendant : "Indices visuels"

Séparé de la difficulté, dans Settings :
- **Vifs** — indicateurs maximaux (utile mobilité réduite ou jeunes)
- **Subtils** — défaut
- **Aucun** — pour challenge esthétique sans changer la difficulté de fond

Permet à un joueur en EXPLORATEUR de désactiver les indicateurs s'il préfère le côté "fouille" sans pression temporelle.

### Settings UI

Panneau settings réorganisé :
- Difficulté (3 boutons radio + description courte)
- Indices visuels (slider 3 positions)
- Volume musique / SFX (sliders existants)
- Mouvement réduit (toggle existant)
- Langue (FR/EN futur)
- **NEW** : Bouton "Effacer la sauvegarde" (avec confirmation x2)
- **NEW** : Bouton "Exporter ma sauvegarde" (download JSON)
- **NEW** : Bouton "Importer une sauvegarde" (upload JSON)

## 8. Replay & branches

### NG+ (côté LÉO)

Une fois la 1re fin obtenue (n'importe laquelle des 3), un nouveau bouton apparaît au menu principal : **"NG+ — Le retour de LÉO"**.

LÉO joue les 4 chapitres dans un ordre légèrement différent et avec :
- Fragments différents (qui contredisent ceux d'ÉLISE-ROMIE)
- Dialogue VERA différent (elle est plus directe avec LÉO)
- Une assertion par chapitre est partagée avec ÉLISE-ROMIE mais a une 2e solution valide
- Lumira réagit différemment à LÉO (qui n'a pas le lien d'ÉLISE-ROMIE)

À la fin de NG+, si toutes les assertions sont parfaites + tous les secrets trouvés à travers ÉLISE-ROMIE + LÉO = ARCHIVE débloque (Ch5 secret).

### 4 fins

Tracking : `endings_unlocked: { evasion: bool, rester: bool, ascension: bool, archive: bool }`.

À chaque ending, écran final différent :
- ÉVASION : pod fuit, ÉLISE-ROMIE seule sur Terre, station orbite vide
- RESTER : ÉLISE-ROMIE dans Lumira, jardin paisible
- ASCENSION : équipage broadcast vers Aeolis, ÉLISE-ROMIE rentre seule mais paisible
- ARCHIVE : ÉLISE-ROMIE + LÉO ensemble sur Terre, photo équipage encadrée

Crédits adaptés à chaque fin (montre les fragments-clé qui ont mené à cette voie).

### Achievements (12 badges, silencieux)

Pas de score, pas de classement. Juste des badges dans une section "Souvenirs" du menu principal :

1. **Premier réveil** — Compléter Ch1
2. **Le jardin se souvient** — Compléter Ch2 avec tous les sub-puzzles
3. **Mains de mécanicien** — Trouver le voice memo de LÉO
4. **Œil étoilé** — Compléter Ch4
5. **Premier retour** — Toute fin obtenue
6. **Vérité partielle** — NG+ complété
7. **ARCHIVE** — Ch5 secret complété
8. **Botaniste** — Trouver toutes les plantes cachées
9. **Lumira** — Déclencher le chant de Lumira
10. **Sans aide** — Compléter un chapitre en mode ARCHIVISTE
11. **Carnet complet** — 100% assertions + révisions
12. **Compagnons** — Compléter ARCHIVE et déclencher chaque mémoire

### Chapter Select (post-1re-run)

Menu principal débloque **"Replay un chapitre"** une fois la 1re fin atteinte. Sélection libre, chargement avec snapshot de l'état début-de-chapitre. Permet aux puzzle-amoureux de re-jouer juste les puzzles ou aux complétionnistes de chasser les secrets manqués.

## 9. Audio

### Musique (4 ambiantes + 1 ARCHIVE)

5 tracks au total, 1 par scène-chapitre. Auto-loop transparent.

**Source initiale (Phase 4)** : library CC-BY (incompetech.com, free-stock-music.com, freemusicarchive.org). Style cible : *Outer Wilds*-meets-*Subsurface Circular* — synth pads sparses, mélodie occasionnelle, ambiances spatiales. Recherche keywords : "ambient sci-fi", "space ambient", "ethereal synth".

Tracks recherchés :
1. **Cryo** — froid, métallique, single piano note tail
2. **Serre** — organique, harpe + chœur lointain
3. **Atelier** — mécanique, basse subgrave, percussions discrètes
4. **Coupole** — étoilé, choral, crescendo possible
5. **ARCHIVE** — onirique, voix processée, résolution

Format : `.m4a` 96 kbps mono, ~500 KB chacun. Total ≈ 2.5 MB.

**Upgrade futur** : commission Suno/musicien si le jeu décolle.

### SFX (sampled, +10 nouveaux)

Conserver les SFX synthétisés actuels (`tap`, `beep`). Ajouter samples (CC0, freesound.org) :

1. Cassette qui tourne (replay fragment audio)
2. Polaroid s'éjecte (collecte photo)
3. Page de carnet qui tourne
4. Terminal qui grésille
5. Cryo pod qui siffle (Wake Cycle)
6. Verre qui se fend (révélation)
7. Lumira qui chante (3 notes ethereal)
8. VERA qui rit (1 fois, Ch4)
9. Eau qui goutte (Serre ambiance)
10. Soudure (Atelier)

Format : `.m4a` 32 kbps mono, < 50 KB chacun.

### Implémentation

Howler avec `html5: true` (déjà correct pour iOS). Précharge en lazy par chapitre. Volume contrôlé par les settings existants.

## 10. Art direction

### Pixel art (continuité)

Maintien du style pixel-art actuel. Direction art : *retro-spatial chaud* — bleus profonds, ambres, verts feuille. Pas de gris froid type Industrial.

### Nouveaux assets requis

#### Portraits équipage (6)
Format : 200x200 px, pixel-art, affichés à côté des dialogues.
- ÉLISE-ROMIE : femme, 28, cheveux roux courts, regard curieux
- LÉO : homme, 31, barbe naissante, sourire
- VERA : holo bleu-vert, sans visage défini (spectre lumineux)
- Vesper : femme, 47, traits autoritaires
- Han : homme, 52, lunettes, expression neutre
- KAEL : homme, 24, jeune, anxieux

Réalisation : générer via Stable Diffusion + retouche pixel-art manuelle, OU dessiner from scratch via outil pixel-art (Aseprite-like).

#### Carnet UI (l'écran majeur)
Esthétique : **journal de bord années 70 spatial**. Papier jauni texturé. Encre bleu marine. Polices VT323 et Press Start 2P. Petites taches de café sur certaines pages. Sentiment "objet aimé".

#### Splash screen + logo
Logo KORA avec :
- Mot "KORA" en pixel-art massif
- Sous-titre "L'éveil orbital"
- Petite planète Aeolis en orbite (animation de rotation)
- Background : dégradé charDeep → leafDeep avec étoiles

#### Fragments visuels (~30 items)
- Cassettes audio pixel-art (5 variations couleur)
- Polaroids pixel-art (10 photos uniques)
- Logs imprimés (sprite générique avec texte par-dessus)
- Sample tubes (4 variations)
- Cahiers ouvrables (3 variations)

#### Carte KORA
Plan pixel-art top-down. Style : carte tracée à la main, esthétique blueprint.

### Animations

- Wake Cycle Ch1 : cinétique 90 secondes, frames pixel-art (approximativement 30 keyframes manuels)
- Lumira fleurit : sprite sequence 8 frames
- VERA holo : tween constant, scale + alpha
- Polaroid s'éjecte : animation 1 seconde sprite

### Effets de scène (ParticleEmitter)

- Givre (Ch1) : 30 particules blanches drift
- Pollen (Ch2) : 50 particules dorées floating
- Étincelles (Ch3) : burst sur soudure
- Étoiles scintillent (Ch4) : 100 micro-particules pulsantes
- Souvenirs (Ch5) : motes lumineuses

## 11. Fondations techniques

### Bundle & build

`vite.config.ts` :
- `build.sourcemap: false` en production (–11 MB)
- `build.minify: 'esbuild'` (déjà défaut)
- `base` conditionnel : `process.env.CAPACITOR === '1' ? './' : '/mimi/'`
- `define` pour version : injecté depuis `package.json`

`public/` cleanup :
- Supprimer `public/assets/raw/ganamoda.zip` (–7.9 MB)
- Vérifier qu'aucune autre archive trainante

### Asset loading

Refactor `src/data/assets.ts` :
```ts
export const BOOT_SPRITES = [...]; // logo, splash, fonts only
export const MENU_SPRITES = [...]; // menu UI
export const CH1_SPRITES = [...]; // Cryo only
export const CH2_SPRITES = [...]; // Serre
export const CH3_SPRITES = [...]; // Atelier
export const CH4_SPRITES = [...]; // Coupole
export const CH5_SPRITES = [...]; // ARCHIVE
export const SHARED_SPRITES = [...]; // HUD, carnet, portraits
```

`PreloadScene` : charge BOOT + MENU + SHARED uniquement.

Chaque puzzle scene : `init()` charge ses sprites :
```ts
init() {
  this.load.image('cryo_pod', 'assets/sprites/cryo_pod.png');
  // ...
  this.load.start(); // pour declencher en init
}
```

### Texture atlas

Phase 1 : packing manuel via TexturePacker (free version) → `assets/atlases/main.png` + `main.json`. Toutes les sprites SHARED + HUD dedans.

Phase 2 (si charge OK) : 1 atlas par chapitre.

Gain : 1 requête HTTP au lieu de 50, et batching GPU optimal.

### Particles

Refactor `src/objects/Particles.ts` (ou inline dans scenes) pour utiliser `Phaser.GameObjects.Particles.ParticleEmitter` au lieu de `Rectangle` array + tween array.

Exemple frost (Ch1) :
```ts
const particles = scene.add.particles(0, 0, 'frost_particle', {
  speed: { min: 10, max: 30 },
  lifespan: 5000,
  quantity: 1,
  frequency: 200,
  alpha: { start: 0.6, end: 0 },
  blendMode: 'ADD',
});
```

Préparer textures particules :
- frost_particle (8x8 white)
- pollen_particle (6x6 gold)
- spark_particle (4x4 yellow)
- star_particle (3x3 white)
- memory_mote (10x10 cyan glow)

### RenderTexture caching

`SceneBackground.ts` et `BootScene.ts` : refactor pour dessiner UNE FOIS dans une `RenderTexture`, puis utiliser le cache.

Exemple :
```ts
const rt = scene.add.renderTexture(0, 0, GAME_WIDTH, GAME_HEIGHT);
this.drawBackgroundOnce(rt); // ancienne logique Graphics
// rt utilisé comme image, pas redrawn chaque frame
```

### Service worker

Plugin : `vite-plugin-pwa` avec preset `injectManifest`.

`vite.config.ts` :
```ts
import { VitePWA } from 'vite-plugin-pwa';
plugins: [
  VitePWA({
    registerType: 'autoUpdate',
    workbox: {
      globPatterns: ['**/*.{js,css,html,png,jpg,m4a,json,woff2}'],
      maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
    },
    manifest: {
      name: 'KORA — L\'éveil orbital',
      short_name: 'KORA',
      theme_color: '#1f4d3e',
      icons: [
        { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      ],
    },
  }),
],
```

### Save system v3

Nouveau `src/systems/save.ts` :

```ts
export interface SaveSlot {
  schemaVersion: 3;
  player: { name: string; profile: 'ÉLISE-ROMIE' | 'LEO'; createdAt: number };
  progress: {
    chaptersCompleted: ChapterId[];
    currentChapter: ChapterId;
    fragments: { [chapterId: number]: string[] };
    assertions: { [assertionId: string]: { tiles: string[]; locked: boolean } };
    secrets: string[];
    endings: ('evasion' | 'rester' | 'ascension' | 'archive')[];
    achievements: string[];
    timeSpent: number; // ms
  };
  settings: { difficulty: 'EXPLORATEUR' | 'AVENTURIER' | 'ARCHIVISTE'; visualHints: 'vif' | 'subtil' | 'aucun'; musicVolume: number; sfxVolume: number; reducedMotion: boolean };
  ngPlus: { unlocked: boolean; chapterIndex: number };
}

export interface RootSave {
  schemaVersion: 3;
  slots: [SaveSlot | null, SaveSlot | null, SaveSlot | null];
  activeSlot: 0 | 1 | 2;
}
```

Migration : `if (existing.schemaVersion === 2) migrate_v2_to_v3(existing)`.

API :
- `getActiveSlot(): SaveSlot`
- `setSlot(index: 0 | 1 | 2, slot: SaveSlot)`
- `exportToJSON(): string`
- `importFromJSON(json: string): { ok: boolean; error?: string }`
- `debouncedSave()` (300ms debounce — au lieu de save sur chaque mutation)

### Self-host fonts

```bash
pnpm add @fontsource/vt323 @fontsource/press-start-2p
```

Dans `src/main.ts` :
```ts
import '@fontsource/vt323';
import '@fontsource/press-start-2p';
```

Supprime dépendance Google Fonts (boot bloquant + 3rd party).

### Visibility pause

`src/main.ts` :
```ts
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    game.scene.scenes.forEach(s => s.scene.isActive() && s.scene.pause());
  } else {
    game.scene.scenes.forEach(s => s.scene.isPaused() && s.scene.resume());
  }
});
```

### Capacitor préparation

Pas d'install Capacitor en Phase 1 (out of scope). Mais :
- `vite.config.ts` rendu compatible (base conditionnel)
- `manifest.json` à jour
- Pas d'API web qui ne marche pas en WKWebView

Wrap effectif → après v2.0 final, ~2 jours.

## 12. Plan d'implémentation en 4 phases

### Phase 1 — FONDATION (2-3 jours)
**Goal** : invisible mais solide. Aucun changement de gameplay. Toute la dette tech apurée.

Tasks :
1. `vite.config.ts` cleanup (sourcemap off prod, base conditionnel, vite-plugin-pwa)
2. Suppression `public/assets/raw/ganamoda.zip`
3. Self-host fonts (`@fontsource/vt323`, `@fontsource/press-start-2p`)
4. Save system v3 (slots + migration + export/import + debounce)
5. Visibility pause hook
6. Refactor `assets.ts` en groupes par chapitre
7. PreloadScene ne charge que BOOT + MENU + SHARED
8. Chaque chapitre charge ses sprites en `init()`
9. ParticleEmitter pour frost (Ch1) + pollen (Ch2 placeholder)
10. RenderTexture cache pour SceneBackground et BootScene
11. Service worker actif + manifest validé
12. Tests perf : Lighthouse mobile, mesure first-load

**Ship** : v2.0-alpha sur GitHub Pages. Tests user (Vincent + iPhone) confirme aucune régression.

### Phase 2 — CARNET MVP (4-5 jours)
**Goal** : la mécanique cœur jouable sur Ch1.

Tasks :
1. `src/objects/Carnet.ts` : container plein écran avec 5 onglets
2. `src/objects/AssertionTile.ts` : tuile draggable
3. `src/objects/AssertionSlot.ts` : trou dans une assertion
4. `src/systems/assertions.ts` : engine (assertions, tiles, validation, locks)
5. `src/systems/fragments.ts` : collection, replay, persist
6. `src/data/carnet/ch1.ts` : 3 assertions + 5 fragments + 1 secret de Ch1
7. Bouton CARNET en HUD (à côté du Menu)
8. Tutorial diégétique (1re page écrite par ÉLISE-ROMIE)
9. Refactor Ch1Cryo : remplace les 3 puzzles existants par les 3 puzzles étoffés
10. Verbe COMBINER : panneau side
11. Première recette COMBINER : bracelet + circuit
12. Wake Cycle 90s no-controls (cinétique passive)

**Ship** : v2.1-beta sur GitHub Pages. Vincent teste Ch1 nouvelle formule.

### Phase 3 — FULL RETROFIT (6-8 jours)
**Goal** : Carnet + difficulté sur tous les chapitres.

Tasks :
1. Difficulté system : 3 modes + slider visuels indépendant
2. Settings UI étoffée (export/import save, effacer)
3. `src/data/carnet/ch2.ts` : 3-4 assertions + 6 fragments + secret KAEL drawer
4. Ch2Serre refactor : 4 puzzles (irrigation + recette + microscope + chant Lumira caché)
5. `src/data/carnet/ch3.ts` : 3 assertions + 6 fragments + secret graine
6. Ch3Atelier refactor : 4 puzzles (circuit + patch coque + radio decode + voice memo caché)
7. `src/data/carnet/ch4.ts` : 3-4 assertions + 6 fragments + recontextualisation
8. Ch4Coupole refactor : 4 puzzles + LE BIG ONE (recontextualisation auto-révision)
9. VERA dialogue tree : 3-5 questions par chapitre
10. Examiner révèle hotspots cachés (système générique)
11. Interstitiels carnet entre chapitres
12. Plant beds Ch2 enrichis (6 plantes uniques)

**Ship** : v2.5-rc. Vincent fait un run complet.

### Phase 4 — REPLAY & POLISH (4-5 jours)
**Goal** : v2.0 final ship-ready.

Tasks :
1. NG+ logic : nouveau slot avec profile LÉO, fragments inversés
2. 4 fins implementées avec écrans de crédits différenciés
3. ARCHIVE Ch5 (10-15 min, pas de puzzles, juste 4 rencontres)
4. Replay any chapter (post-1re-run)
5. Achievements engine + UI badges section "Souvenirs"
6. 6 portraits équipage (commission ou DIY pixel-art)
7. Carnet UI polish (papier jauni, taches café, encre bleu marine)
8. Splash screen + logo polish
9. 5 musiques ambiantes (CC-BY library)
10. 10 SFX samplés
11. Texture atlas (TexturePacker, 1 global)
12. Lighthouse audit final, perf > 90 mobile
13. README étoffé pour GitHub
14. Capacitor stub config (pour future App Store)

**Ship** : v2.0 final sur GitHub Pages. Vincent peut partager fièrement.

### Hors scope v2 (idées futures)

- Localisation EN (texte est en FR ; ÉLISE-ROMIE est francophone par design)
- Mode JARDINIER (sandbox post-ARCHIVE) — bonus optionnel Phase 4 si temps
- Wrap Capacitor effectif → projet séparé après v2.0
- Mode "Carnet only" (sans puzzles, lecture pure) — pour le replay narratif

## 13. Risques & mitigation

| Risque | Probabilité | Impact | Mitigation |
|---|---|---|---|
| Carnet UI complexe, tap precision iOS | Moyenne | Élevé | Réutiliser le pattern Rectangle-direct-interactive établi v18. Prototype Phase 2 sur Ch1 = test précoce. |
| Recontextualisation Ch4 confuse | Moyenne | Élevé | Tutoriel inline ("VERA confesse — révise tes assertions") + animation guide. Test user Phase 3. |
| Asset budget dépassé (>10 MB) | Faible | Moyen | Texture atlas Phase 4. Si dépasse, downgrade portraits à 100x100. |
| NG+ contradictions trop subtiles | Élevée | Moyen | Première contradiction visuellement marquée (rouge clignotant). Apprend au joueur le mécanisme. |
| Audio library trop générique | Moyenne | Moyen | Privilégier 2-3 tracks "héros" (Coupole, ARCHIVE) commandés sur Suno si library faible. |
| Bug de save migration v2→v3 | Moyenne | Élevé | Backup auto avant migration ; option "restaurer ancien save" en cas d'échec. |
| Vincent change d'avis sur direction | Faible | Très élevé | Ship par phases, validation user visible à chaque ship. |

## 14. Critères de succès v2.0 final

- [ ] 75-90 min par run optimal
- [ ] 4 fins distinctes, toutes accessibles
- [ ] NG+ jouable avec contradictions claires
- [ ] ARCHIVE Ch5 émotionnellement satisfaisant
- [ ] 12 achievements obtenables
- [ ] Lighthouse mobile > 90 (perf, a11y, best-practices, SEO, PWA)
- [ ] First-load < 5s en 4G iPhone
- [ ] 60fps stable sur iPhone 12+
- [ ] PWA installable (Android certain ; iOS limitations OK)
- [ ] Vincent peut partager le lien sans gêne

## 15. Annexes

### A. Glossaire narratif

- **Aeolis** : exoplanète orbitée par KORA
- **Lumira** : plante Aeolis pivot du mystère
- **Mella-d'eau** : seconde plante Aeolis (décorative)
- **Cycle** : unité de temps station (~24h)
- **Biosignal** : émission radio organique d'Aeolis
- **Conversion** : transformation matière humaine → matière biologique Aeolis-compatible
- **ARCHIVE** : zone secrète Ch5

### B. Liste des fragments par chapitre (~30 total)

Ch1 : 5 + 1 secret = 6
Ch2 : 6 + 1 secret = 7
Ch3 : 6 + 1 secret = 7
Ch4 : 6 = 6
Ch5 : 4 (auto-révélés) = 4
**Total : 30 fragments**

### C. Liste des assertions (~15 + révisions)

Ch1 : 3
Ch2 : 3-4 (4e bonus si chant Lumira)
Ch3 : 3
Ch4 : 3-4 (révisions de 3-4 assertions de Ch1-3)
Ch5 : 0 (auto-rempli)
**Total : ~15 assertions résolvables + 3-4 révisions**

### D. Liste des recettes COMBINER

1. Bracelet comm cassé + Circuit fragment = Bracelet comm fonctionnel
2. Fert. B + Fert. C = Mélange Lumira
3. Sample Lumira + Microscope = Identification disease
4. Bracelet comm fonctionnel + Fréquence Lumira = Chant Lumira active
5. Graine Lumira + Eau (post-Ch3) = Lumira de poche (souvenir)

---

**Fin du spec.**
