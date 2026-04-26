# Mimi — Le Jardin Suspendu

Un escape game de science-fiction (univers solarpunk) jouable sur iPhone via le navigateur, conçu pour une adolescente et engageant pour ses parents.

🎮 **Jouer maintenant** : https://vincentreboul.github.io/mimi/

## Pitch

Mimi se réveille seule sur Serra-7, une serre orbitale silencieuse depuis trois ans. Une IA jardinière, isolée, lui parle pour la première fois — mais quelque chose dans son récit ne colle pas.

4 chapitres, ~45-60 minutes de jeu, gratuit, sans pub, sans paywall.

## Stack

- **Frontend** : Phaser 4 + TypeScript + Vite
- **Audio** : WebAudio synth (SFX) + Howler.js (musique)
- **Save** : localStorage (single key, < 10 KB)
- **Deploy** : GitHub Pages (gh-pages branch)
- **Assets** : 100% procéduraux (Graphics + emoji + Google Fonts) — 0 image téléchargée

Bundle total : **~430 KB gzippé**.

## Décisions design

Synthèse complète dans [`docs/design/00-decisions-ceo-cto.md`](docs/design/00-decisions-ceo-cto.md).
Recherche marché dans [`docs/research/`](docs/research/) (5 rapports : marché, esthétique, mécaniques, tech, UX).

Highlights :
- **Pas d'ads, pas de coins, pas de paywall** (recherche : 1ère cause de notes 1-étoile)
- **Hints gratuits, 3 paliers progressifs** (House of Da Vinci model)
- **Story-skip après 7 min stuck** (jamais de soft-lock)
- **Univers solarpunk** (différenciation : 0 concurrent direct dans escape mobile)
- **Touch targets 96 px logical** (= ~48 pt iOS, dépasse Apple HIG)

## Lancer en local

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # build production
npm run deploy   # build + push to gh-pages branch
```

## Structure

```
src/
├── main.ts                     # Phaser.Game bootstrap
├── config.ts                   # Constants, palette, FONTS
├── scenes/
│   ├── BootScene.ts            # Tap-to-start + audio unlock
│   ├── PreloadScene.ts         # (placeholder, no assets in V1)
│   ├── MenuScene.ts            # Main menu + settings
│   ├── ChapterIntroScene.ts    # Narrative cinematic between chapters
│   ├── EpilogueScene.ts        # Final ending screen
│   └── puzzles/
│       ├── PuzzleSceneBase.ts  # Common HUD setup, dialogue, hints
│       ├── Ch1Cryo.ts          # Code 1403 from bracelet
│       ├── Ch2Serre.ts         # Combine 2 fertilizers (B + C)
│       ├── Ch3Atelier.ts       # Order 4 components correctly
│       └── Ch4Coupole.ts       # Place 2 crystals + final choice
├── objects/
│   ├── Hotspot.ts              # Interactive zones (≥96 px hit areas)
│   ├── InventoryBar.ts         # 6-slot bottom HUD
│   ├── DialogueBox.ts          # VERA narration with typewriter
│   ├── HintButton.ts           # 3-tier progressive disclosure
│   ├── Keypad.ts               # Code-entry modal
│   └── SceneBackground.ts      # Procedural backdrops per chapter mood
├── systems/
│   ├── save.ts                 # localStorage SaveState
│   ├── audio.ts                # WebAudio SFX synth + Howler ambient
│   ├── narrative.ts            # i18n key → string
│   ├── inventory.ts            # Items + combine recipes
│   └── hint.ts                 # Stuck detection + tier escalation
└── data/
    ├── items.ts                # Item registry (id, name, icon, recipe)
    ├── dialogue.fr.ts          # All FR strings
    └── puzzles.ts              # Puzzle IDs, hints, solutions
```

## Solutions (spoilers)

- **Ch1 Cryo** : Code `1403` (date gravée sur bracelet)
- **Ch2 Serre** : Combine `Fertilisant B` + `Fertilisant C`, applique sur la Lumira
- **Ch3 Atelier** : Place les composants dans l'ordre `Résistance → Condensateur → Diode → LED`
- **Ch4 Coupole** : Cristal A à gauche, B à droite, puis ALIGNER, puis choix final

## Mobile pickup (depuis téléphone)

Pour reprendre la conversation depuis le téléphone :
1. Le code est sur GitHub → https://github.com/vincentreboul/mimi
2. Le jeu est jouable → https://vincentreboul.github.io/mimi/
3. La conversation Claude Code se reprend telle quelle (toute la mémoire est dans les fichiers de ce repo)

## Roadmap V2 (proposée)

- 🔊 Musique ambient par chapitre (Pixabay/Incompetech)
- 🇬🇧 Traduction EN
- ☁️ Cloud save via simple JSON endpoint
- 🎯 Daily seeded puzzle (Wordle pattern)
- 👥 Co-op asymétrique chapter 5 (parent + ado, deux écrans)
- 🎙️ Voice acting VERA (TTS open source ou enregistré)
- ⭐ Endings multiples + trust meter visible

## Crédits

- Design + code : Vincent (avec Claude Opus 4.7)
- Police : [Inter](https://rsms.me/inter/), [Fraunces](https://fonts.google.com/specimen/Fraunces), [Space Mono](https://fonts.google.com/specimen/Space+Mono) (Google Fonts, OFL)
- Aucun asset externe en V1 (tout procédural)

## Licence

Code : MIT.
Histoire : © Vincent Reboul, 2026.

---

*Un jeu pour ma fille.*
