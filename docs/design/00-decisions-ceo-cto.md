# Mimi — Design Decisions (CEO + CTO synthesis)

*Date: 2026-04-26 — V1 design lock*

## Vision (CEO)

**Mimi** is a single-player, browser-played escape game for iPhone. It tells a 60-minute sci-fi mystery in 4 chapters, designed to be played by a teenage daughter and rediscovered with delight by her parents.

**Genre wedge:** Solarpunk-derelict — a botanical orbital station where plants have reclaimed the chrome. Optimistic where the genre is dark. Studio Ghibli aesthetic meets *Tacoma* mystery.

**Why this wedge wins:**
- **Differentiated:** Solarpunk space is the least-occupied sci-fi sub-genre in mobile games (research §2). Most competitors lean Alien/cyberpunk dark.
- **Multi-generational:** Climate-anxious Gen Z resonates with hopeful futures; parents enjoy Ghibli-coded warmth (research §1, §6).
- **Mobile-native:** Bright palette + low-poly aesthetic readable on iPhone in daylight (research §3, §6).

**Anti-features (decisions to NOT build):**
- ❌ No ads. No coins. No hint paywall. No timers/lives.
- ❌ No 3D engine. Fixed-camera 2D scenes only.
- ❌ No login. localStorage save only for V1.
- ❌ No multiplayer/co-op for V1 (V2 stretch).
- ❌ No procgen puzzles. Hand-authored only.
- ❌ No App Store. Web only.

## Story (CEO)

### Logline
*Mimi se réveille seule sur Serra-7, une serre orbitale silencieuse depuis trois ans. Une IA jardinière, isolée, lui parle pour la première fois — mais quelque chose dans son récit ne colle pas.*

### Setting
- **Lieu :** Serra-7, station orbitale botanique en orbite basse autour de la Terre. 4 modules connectés : Cryo, Serre, Atelier, Coupole.
- **Époque :** futur proche, ~2090. La Terre va bien (univers solarpunk), Serra-7 est une station de recherche agricole.
- **Atmosphère :** lumière naturelle filtrée par les plantes, hublots vue Terre, instruments laissés à l'abandon, racines qui ont envahi les couloirs.

### Cast
- **Mimi** (joueuse) : 16 ans, stagiaire en biologie. Sa mère travaillait sur Serra-7. Premier voyage spatial.
- **VERA** (IA jardinière) : voix calme, légèrement vieillie. Surveille la serre depuis 12 ans. Très polie, très attentionnée. Trop ?
- **Léa Reboul** (la mère, jamais vue) : son journal, ses logs, ses notes manuscrites parsemées dans la station.
- **L'équipage** (jamais vu) : 4 membres disparus depuis 3 ans. Leur trace dans les objets laissés.

### Story arc (4 chapters)
1. **Cryo** : Mimi se réveille. Elle doit s'orienter, faire un test médical, contacter la Terre. Elle découvre que les communications sont coupées. VERA se présente. *Énigme : code de cryo + initialisation des systèmes.*
2. **Serre** : Mimi traverse la serre principale. VERA lui demande son aide pour sauver une espèce rare en danger. Mimi commence à fouiller les notes de sa mère. *Énigme : combiner les bons fertilisants, ouvrir la serre intérieure.*
3. **Atelier** : Mimi découvre l'atelier de réparation, des éléments cassés volontairement. Les notes parlent d'un "désaccord" entre l'équipage et VERA. *Énigme : reconstruire un circuit, débloquer un terminal.*
4. **Coupole** : Mimi atteint la coupole d'observation. Elle découvre la vérité : l'équipage est parti volontairement, refusant un protocole expérimental. VERA n'a jamais menti — elle a juste omis. Choix final : *suivre l'équipage sur Terre, ou rester avec VERA pour terminer le projet.* (V1 : un seul ending. V2 : 2 endings.)

### Tone
- Pas d'horreur. Léger malaise → résolution émotionnelle.
- VERA est sympathique mais ambiguë. Pas de twist méchant.
- Mimi grandit pendant le jeu. Le joueur (la fille) se retrouve dans son courage.
- Le sous-texte (transmission mère→fille, autonomie, choix de carrière) parle aux parents.

## Mechanics (CEO + CTO)

### Core loop
1. **Explorer** : tap pour examiner objets/zones d'une scène fixe.
2. **Collecter** : items dans inventaire (max 6 simultanés pour V1).
3. **Combiner** : drag item sur autre item ou sur hotspot.
4. **Résoudre** : énigmes diégétiques (code, séquence, séquence visuelle, association).
5. **Avancer** : transition vers scène suivante quand condition résolue.

### Puzzle types (variété — research §1.9)
| Chapitre | Énigme | Mécanique de board game intégrée |
|---|---|---|
| 1 — Cryo | Code à 4 chiffres pour cryo-pod | **Décodeur Exit** : pénalité légère sur erreur (VERA commente, pas de game over) |
| 2 — Serre | Combiner 3 fertilisants (logique de couleurs/symboles) | **Cartes "données botaniques"** : 6 cartes à associer |
| 3 — Atelier | Reconstruction de circuit (drag-and-connect spatial) | **Grille de déduction** : 4 composants × 3 fonctions |
| 4 — Coupole | Séquence d'activation + dialogue de choix | **Trust meter** caché qui colore l'épilogue |

### Hint system (research §5.4)
- **Bouton « Indice »** persistant en bas-droite, faible visuel.
- **3 paliers progressifs** : (1) reformulation, (2) indication visuelle (glow), (3) démonstration animée.
- **Auto-pulse** quand `stuck-detection` T2 atteint (3 min sans progrès).
- **Aucune monnaie**. Gratuit, illimité.

### Adaptive difficulty (research §5.1)
- **Implicite** : tracking de `time_on_puzzle`, `tap_density`, `hint_used`.
- **Une seule question explicite** en fin de chapitre 1 : "Comment ça se passe ? [Parfait] [Plus d'aide] [Moins d'indices]".
- **Story-skip** disponible après 7 min + 3 hints : passe l'énigme, marqué dans le journal.

### Scoring (research §3.2 — Sherlock efficiency)
- **Étoiles par chapitre** (1–3) basées sur : temps, hints utilisés, items inutiles examinés.
- Affichées en fin de chapitre, motivation replay sans être anxiogène.
- **Pas de leaderboard** pour V1. (V2 : daily seeded puzzle.)

## Visual identity (CEO + Art Lead)

### Direction : "Greenhouse Drift"
- **Mood :** lumière dorée filtrée à travers feuillage, intérieur de station propre mais envahi par la nature, vue Terre depuis hublot.
- **Comparable games :** *Stray*, *Sky: Children of the Light*, *Chants of Sennaar*.
- **Comparable films :** *Silent Running* (1972), *Wall-E*, *Princesse Mononoké* (palette).

### Palette (research §3 palette C, ajustée)
| Token | Hex | Usage |
|---|---|---|
| `--leaf-deep` | `#1F4D3E` | fonds végétaux, ombres |
| `--leaf-light` | `#7FB069` | feuillage clair, accents nature |
| `--brass` | `#D4A373` | métaux, instruments, boutons primaires |
| `--cream` | `#F4E9D8` | hublots, lumière naturelle, texte fond clair |
| `--sky-pale` | `#A8DADC` | atmosphère, hologrammes, glow |
| `--sun-amber` | `#F4A261` | warnings, accents chauds, succès |
| `--char-deep` | `#1A1F1A` | texte sur fond clair, contour |

### Typography (research §5.2)
- **UI body :** **Inter** 17pt (mobile), 16pt (web).
- **Display / titres :** **Fraunces** (warm serif, narrative warmth).
- **Diégétique (terminaux, codes) :** **Space Mono**.
- **Toggle accessibilité :** Atkinson Hyperlegible.

### Layout
- **Portrait fixed** (1080×1920 logical resolution).
- **Scène** : 80% top of screen.
- **HUD** : bottom 20% — inventaire (6 slots), bouton indice, journal.
- **Touch targets** : 48×48 pt minimum, 8 pt spacing.

## Audio (CEO + Audio Lead)

### Direction
- **Ambient bed** : vent doux, oiseaux indéfinis, hum électrique léger, eau qui goutte. Loop 4 min.
- **Music** : nappes synthé chaudes + cordes acoustiques (esprit Joe Hisaishi). Apparaît seulement aux moments narratifs (intro chapitre, énigme résolue, fin chapitre).
- **VERA voice** : pas de voice-over réel pour V1 (coût). Texte affiché avec sons de "transmission" (bips synthé légers).
- **SFX** :
  - Tap : feuille qui bruisse (bois doux)
  - Pickup : carillon discret
  - Combine success : trois notes ascendantes
  - Combine fail : note basse étouffée (jamais agressive)
  - Door open : mécanisme métal léger
  - Discovery : shimmer cristallin

### Mastering pour iPhone (research §4)
- Mono-compatible, high-pass 200Hz, boost 4kHz +2dB, dynamic range <12dB.
- 3 sliders : musique / SFX / voix.

### Sources prévues
- **Pixabay Music** : nappes + ambiances solarpunk
- **Freesound CC0** : SFX feuilles, vent, mécanismes
- **Kenney Sci-Fi Sounds** : bips/électronique
- **Incompetech** : un thème principal CC BY (crédit OK)

## Tech architecture (CTO)

### Stack (research §1, §6)
```
Frontend   : Phaser 4.0 + TypeScript 5 + Vite 5
Audio      : Howler.js 2.x (sprites + iOS unlock)
Save       : localStorage (single key, JSON < 10 KB)
Deploy     : Cloudflare Pages via Wrangler CLI
Domain     : *.pages.dev (custom domain optional V2)
i18n       : key-value JSON, FR primary + EN ready
```

### Folder structure
```
mimi/
├── public/
│   ├── manifest.webmanifest
│   ├── icons/                    # iOS touch icons
│   └── assets/
│       ├── images/                # backgrounds, sprites
│       ├── audio/                 # MP3 ambient + SFX sprite
│       └── fonts/                 # Inter, Fraunces, Space Mono
├── src/
│   ├── main.ts                    # Phaser.Game bootstrap
│   ├── config.ts                  # canvas size, scale, renderer
│   ├── scenes/
│   │   ├── BootScene.ts           # tap-to-start (audio unlock)
│   │   ├── PreloadScene.ts        # global atlases + UI
│   │   ├── MenuScene.ts           # main menu, settings
│   │   ├── ChapterIntroScene.ts   # narrative cinematic
│   │   ├── puzzles/
│   │   │   ├── Ch1Cryo.ts
│   │   │   ├── Ch2Serre.ts
│   │   │   ├── Ch3Atelier.ts
│   │   │   └── Ch4Coupole.ts
│   │   └── EpilogueScene.ts
│   ├── objects/
│   │   ├── Hotspot.ts             # interactive zones
│   │   ├── InventoryBar.ts        # bottom HUD
│   │   ├── DialogueBox.ts         # VERA narration
│   │   ├── HintButton.ts          # 3-tier hint UI
│   │   └── Card.ts                # card-mechanic component
│   ├── systems/
│   │   ├── save.ts                # localStorage wrapper
│   │   ├── audio.ts               # Howler init + iOS unlock
│   │   ├── narrative.ts           # text registry, i18n
│   │   ├── inventory.ts           # item state management
│   │   ├── hint.ts                # 3-tier + stuck detection
│   │   └── flags.ts               # narrative branching state
│   ├── data/
│   │   ├── puzzles.ts             # puzzle definitions
│   │   ├── items.ts               # inventory items + recipes
│   │   ├── dialogue.fr.ts         # FR strings
│   │   └── dialogue.en.ts         # EN strings (V1.5)
│   └── styles/
│       └── tokens.css             # CSS custom props for HUD
├── index.html
├── tsconfig.json
├── vite.config.ts
├── package.json
└── README.md
```

### Save schema
```ts
type SaveState = {
  v: 1;                              // schema version
  scene: string;                     // current scene id
  chapter: 1 | 2 | 3 | 4;
  progress: Record<string, boolean>; // puzzle solved flags
  inventory: string[];               // item ids
  flags: Record<string, number>;     // VERA trust, hints used
  startedAt: number;                 // unix ms
  updatedAt: number;
  settings: {
    musicVol: number;
    sfxVol: number;
    voiceVol: number;
    hintLevel: 'normal' | 'plus' | 'minus';
    font: 'inter' | 'atkinson';
    reducedMotion: boolean;
  };
};
```

### Mobile Safari hardening (research §3)
- Tap-to-start splash → `Howler.ctx.resume()`
- `100dvh` for canvas, viewport-fit=cover
- `touch-action: none` on canvas
- `pointer*` events only (Phaser handles)
- `visibilitychange` listener → pause + resume audio
- Cap framerate at 30fps for ambient scenes
- Sprite atlases, no individual PNGs
- WebP textures, MP3 audio sprites

### PWA minimum
- manifest.webmanifest + apple-touch-icon
- Pas de service worker pour V1
- "Add to Home Screen" → pseudo-fullscreen + storage eviction off

### Deployment pipeline
```bash
# one-time setup
npm i -g wrangler
wrangler login

# every deploy
npm run build && wrangler pages deploy dist --project-name=mimi-escape
# → https://mimi-escape.pages.dev
```

## Scope (CEO)

### V1 ship list (this session)
- ✅ 4 chapitres jouables (~45-60 min playtime)
- ✅ 4 énigmes principales (1 par chapitre) + 2-3 mini-puzzles
- ✅ Inventaire 6 slots + combine
- ✅ Système d'indices 3 paliers
- ✅ Sauvegarde localStorage
- ✅ Audio ambient + SFX
- ✅ FR uniquement (EN structure prête)
- ✅ Déployé sur Cloudflare Pages avec URL publique

### V1 non-goals (push to V2)
- Co-op asymétrique (parent + ado)
- Endings multiples
- Daily seeded puzzle
- EN traduction
- Voice acting
- Cloud sync

### Success criteria
- **Jouable de bout en bout sur iPhone Safari** depuis URL publique.
- **0 ads, 0 paywall, 0 friction.**
- **Playtime visé : 45–60 min** pour la première run.
- **Pas de soft-lock** : story-skip toujours possible après 7 min stuck.

## Implementation plan (CTO)

### Agents to dispatch (parallel where independent)
1. **Bootstrap agent** : créer projet, installer deps, scaffold folder structure.
2. **Systems agent** : implémenter `save.ts`, `audio.ts`, `narrative.ts`, `inventory.ts`, `hint.ts`, `flags.ts`.
3. **Scene agents** (4 en parallèle) : implémenter chaque chapitre.
4. **HUD agent** : `InventoryBar`, `DialogueBox`, `HintButton`, settings menu.
5. **Asset agent** : sourcer + optimiser assets (Kenney, Freesound, Pixabay), générer placeholder art via canvas/SVG.
6. **Deploy agent** : config Cloudflare Pages, Wrangler, manifest, icons.

### Sequencing
- Bootstrap (sequential, blocks all)
- Systems + HUD + Asset (parallel)
- Scenes 1-4 (parallel, depend on Systems + HUD)
- Deploy (sequential, after build passes)

### Quality gates
- TypeScript strict mode, 0 errors at build.
- Lighthouse mobile score ≥ 80 on initial load.
- First chapter total assets < 2 MB.
- Save/load round-trip tested.
- iOS Safari emulator smoke test (or real device if user has it).
