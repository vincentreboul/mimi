# KORA v2 — Récap au matin

**Live** : https://vincentreboul.github.io/mimi/?v=20

**Commits** sur `main` (toutes pushées) :
```
aa3076b MenuScene NG+/Souvenirs/Replay + difficulté + VeraDialog UI
9e2fb04 Ch5 ARCHIVE scene + EndingScene + NG+ unlock
6be06a6 Ch4 Coupole retrofit — recontextualisation, 3 fins, fragments
d90804d Ch2 Serre retrofit — fragments, microscope, chant Lumira (a embarqué Ch1 + Ch3 par effet de bord)
5ab8d97 Phase 1 — fondations tech (bundle -89 %, save v3, lazy-load, SW)
```

---

## Ce qui a changé depuis v18

### Tech (fondations, invisibles mais structurantes)
- **Bundle 21 MB → 2.3 MB** (-89 %). Sourcemaps virées en prod, ganamoda.zip orphelin supprimé.
- **Save v3** avec **3 slots, migration auto v2→v3, export/import JSON, debounce 300 ms**. Aucune sauvegarde existante perdue.
- **Lazy-load par chapitre** (PreloadScene ne charge plus que SHARED+MENU+BOOT, chaque chapitre charge ses sprites en `init()`).
- **Service worker** (`vite-plugin-pwa`) → vrai PWA, install prompt sur Android, offline.
- **Self-host fonts** (`@fontsource/vt323` + `press-start-2p`) → fini les Google Fonts bloquants.
- **Particules optimisées** (frost = 1 ParticleEmitter au lieu de 30 Rectangles + tweens).
- **RenderTexture cache** sur backgrounds procéduraux.
- **Visibilité = pause** (auto-pause son + scènes quand l'onglet perd le focus).
- **Vite base conditionnel** prête pour Capacitor (App Store via wrapper, ~2 jours de boulot quand tu veux).

### Game design — la grande refonte
- **Carnet de bord** (bouton ⌐ en haut à droite, à côté de Menu) avec **5 onglets** :
  - **Assertions** — phrases à trous façon Golden Idol, drag-and-drop des tuiles-mots
  - **Fragments** — audio, photos, logs, notes collectés (rejouables, classés par chapitre)
  - **Équipage** — 6 fiches (Vesper / Voss / Marchand / Han / Tomé / VERA) qui se remplissent
  - **Carte** — plan ASCII de KORA, se révèle au fur et à mesure
  - **Aeolis** — théories sur le biosignal de la planète
- **30 fragments** authoring complet (5-7 par chapitre), tous écrits dans `src/data/carnet/ch{1..5}.ts`
- **15 assertions** + **3-4 révisions** au Coupole (recontextualisation auto déclenchée par la confession de VERA)
- **6 personnages** au lieu de 2, chacun avec bio + traits qui se débloquent par fragment
- **3 fins** au Ch4 (ÉVASION / RESTER / ASCENSION — la 3e gated par 90 % d'assertions + 4 secrets)
- **4e fin ARCHIVE** débloquée par Ch5 secret (NG+ + 100 % carnet)
- **NG+** prévu côté IOLAS (bouton Menu apparaît, route en place ; logique fragment-inversion à enrichir Phase 4)
- **12 achievements** silencieux dans **SOUVENIRS** (menu)
- **Replay any chapter** débloqué post-1re-fin

### Personnages renommés (selon ta demande)
- **ÉLISE-ROMIE** Voss — xénobiologiste (joueuse run 1)
- **IOLAS** Marchand — mécanicien-ingénieur (joueur NG+)
- **PHARAÉL** Tomé — radio (avec sa fille Naïs)
- + Capt. ZARA Vesper (commandant), Dr. MIRO Han (cryo-médecin), VERA (IA)

### Système de difficulté (3 modes + slider visuel indépendant)
- **EXPLORATEUR** — hotspots pulsent fort, indices auto à 90 s, tuiles guidées
- **AVENTURIER** *(défaut)* — équilibre
- **ARCHIVISTE** — **aucun indicateur visible**, indices à 8 min, pression temporelle (subtile, pas de game over)
- Slider **Indices visuels** : `Vifs / Subtils / Aucun` — séparé de la difficulté

Réglable depuis Menu → Réglages.

### Narration entièrement réécrite (`dialogue.fr.ts`)
- Lore corporate-greed (Dr. Nórin / SERRA-7) → **biosignal Aeolis / préservation par VERA**
- VERA évolue en ton à travers les chapitres : **clinique → curieuse → évasive → brute-honnête**
- 4 fins distinctes avec préludes différenciés
- Plus de référence à Mimi/Léa

### Chapitres enrichis (par chapitre)
- **Ch1 CRYO** : Wake Cycle 90s no-controls intro / 3 puzzles (badge + bracelet COMBINER + dialog tree VERA) / 5 fragments + 1 secret derrière le panneau de comm
- **Ch2 SERRE** : 4 puzzles (recette + microscope NEW + irrigation NEW + chant Lumira NEW caché) / 6 fragments + 1 secret (tiroir PHARAÉL)
- **Ch3 ATELIER** : 4 puzzles (circuit + patch coque NEW + voice memo NEW caché + compartiment caché) / 6 fragments + 1 secret (graine Lumira d'IOLAS)
- **Ch4 COUPOLE** : alignement 3 cristaux / capture biosignal / **recontextualisation** (le climax — assertions clignotent rouge, à réviser) / **panneau 3 choix** / 5 fragments
- **Ch5 ARCHIVE** *(secret)* : 4 mini-rencontres (Vesper, Han, PHARAÉL, VERA), pas de puzzle, pure résolution émotionnelle

---

## Ce qui n'est pas fait (et pourquoi)

### Phase 4 — Polish, pas critique mais visible
- **Audio** — pas de musique ambiante. SFX existants conservés (tap, beep, success). **Décision** : library CC-BY repérée mais pas intégrée pour gagner du temps. À toi de décider si tu veux upgrade à Suno commission.
- **Portraits équipage** — pas de portrait pixel-art à côté des dialogues. À faire (Aseprite ou commission).
- **Splash screen / logo polish** — l'écran de boot est fonctionnel mais brut.
- **Texture atlas** — pas packé. Pas critique tant qu'on est <100 sprites. À faire si on dépasse.
- **Carnet UI papier-jauni** — fond beige + bordure brune fonctionnel, mais le "papier années 70 spatial" décrit dans le spec n'est pas finalisé (manque texture grain + taches de café).

### NG+ logique
- **Bouton NG+ existe** au menu (apparaît une fois la 1re fin obtenue)
- **Route en place** vers ChapterIntroScene avec `{ ngPlus: true }`
- **Mais** : le contenu fragment-inversion côté IOLAS n'est pas encore branché. NG+ aujourd'hui = re-jouer les mêmes chapitres. À enrichir.

### Wake Cycle Ch1
- Implémenté (90s passive cinématique avec frost + silhouette VERA cyan + beeps + 2 lignes de narration). Skip après 5 s.

### Tutoriel diégétique
- Implémenté : la 1re page du carnet (auto-ouverte après le greeting Ch1) sert d'intro.

---

## Comment tester (chronologie suggérée)

1. **Ouvre** https://vincentreboul.github.io/mimi/?v=20 sur ton iPhone (Safari)
2. **Vide le cache** (Réglages → Safari → Effacer historique) ou **mode privé** pour partir d'une sauvegarde fraîche → tu verras la migration v2→v3 marcher (ou pas)
3. **Choisis un personnage** : ÉLISE-ROMIE (run 1) ou IOLAS (similaire pour l'instant)
4. **Wake Cycle Ch1** : 90s passives. Tape l'écran après 5s pour skip si tu veux.
5. **Dans le module cryo** : explore les pods (vesper, han, kael) — ils ont chacun une narration. Trouve le polaroid Naïs (date 14.03.2064). Code = 1403.
6. **Tape le bouton CARNET** (en haut à droite, à côté de MENU) — vérifie que les onglets Assertions et Fragments se peuplent
7. **Dans la Serre** : essaie le microscope, le chant de Lumira (besoin du bracelet accordé), le panneau d'irrigation
8. **Coupole** : aligne les 3 cristaux → confession VERA → carnet s'ouvre auto avec assertions rouges → révise → choisis une fin
9. **Reviens au menu** : tu dois voir NG+ + REJOUER UN CHAPITRE + SOUVENIRS

### Bugs probables à signaler
- Performance carnet sur grosse page Assertions (drag de tuiles peut laguer)
- Texte tronqué sur certaines assertions très longues
- Mauvaise interaction tap entre carnet et hotspots (à tester sérieux)
- Migration v2→v3 sur ton vrai save (si tu en avais un)

---

## Architecture (pour t'y retrouver)

### Données pures (modifie sans peur)
- `src/data/carnet/{types,ch1..5,index}.ts` — tous les fragments + assertions + tuiles
- `src/data/crew.ts` — 6 fiches équipage avec traits débloquables
- `src/data/dialogues/vera.ts` — arbres de dialogue VERA par chapitre
- `src/data/recipes.ts` — recettes COMBINER
- `src/data/achievements.ts` — 12 badges
- `src/data/endings.ts` — 4 fins (texte + couleurs + conditions)
- `src/data/items.ts` — items inventaire (étendus pour v2)
- `src/data/dialogue.fr.ts` — toute la narration FR (entièrement réécrite)

### Systèmes
- `src/systems/save.ts` — slots + migration + export/import (Phase 1)
- `src/systems/fragments.ts` — collecte fragments
- `src/systems/assertions.ts` — engine drag/drop + recontextualisation
- `src/systems/achievements.ts` — grant + progress
- `src/systems/difficulty.ts` — 3 modes + visuel
- `src/systems/audio.ts` — SFX + ambient (inchangé Phase 1)
- `src/systems/inventory.ts` — items + combine (inchangé)

### Objects (UI)
- `src/objects/Carnet.ts` — modal plein écran 5 onglets
- `src/objects/AssertionTile.ts` + `AssertionSlot.ts` — drag/drop
- `src/objects/CarnetButton.ts` — bouton HUD avec notification dot
- `src/objects/VeraDialog.ts` — branching dialogue UI

### Scènes
- `src/scenes/PlayerSetupScene.ts` — choix ÉLISE-ROMIE/IOLAS
- `src/scenes/MenuScene.ts` — Continue / NG+ / Replay / Souvenirs / Settings
- `src/scenes/puzzles/Ch{1..4}*.ts` — chapitres retrofittés
- `src/scenes/Ch5Archive.ts` — zone secrète
- `src/scenes/EndingScene.ts` — 4 fins génériques avec préludes
- `src/scenes/EpilogueScene.ts` — fallback legacy (redirige vers EndingScene)

### Spec complet
- `docs/superpowers/specs/2026-04-26-kora-v2-design.md` — bible de design (sections 1-15, glossaire, plan de dev en 4 phases, risques)

---

## Suggestions pour la suite

**Si tu veux ship "v2.0 final" rapidement (1 jour de boulot)** :
1. Intégrer 4-5 musiques ambient CC-BY (incompetech) — sub 30 min
2. Tester sur iPhone réel + corriger bugs trouvés
3. Pousser un build avec les corrections

**Si tu veux pousser à l'App Store (1 semaine)** :
1. Wrap Capacitor 6 (compat déjà préparé dans vite.config)
2. Privacy Manifest, age rating 9+
3. 5 screenshots + description
4. Soumission

**Si tu veux enrichir encore** :
1. NG+ logique fragment-inversion côté IOLAS (3-5 jours)
2. Portraits équipage pixel-art (1 jour si Aseprite, 2 jours si commission)
3. Carte interactive de KORA (zoom + click sur zones)
4. Mode JARDINIER (sandbox post-ARCHIVE) pour la rejouabilité

---

**Si tu veux que je continue maintenant :** dis-moi quoi prioriser (audio ? portraits ? bug fix ? NG+ logique ?). Si tu veux que je m'arrête pour que tu testes, fais comme tu sens.

Bon réveil. ☕

— Claude
