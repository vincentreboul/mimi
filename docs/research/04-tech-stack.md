# Mobile-First Web Escape Game — Tech Stack Report (April 2026)

## Executive summary

Build it on **Phaser 4 + TypeScript + Vite**, deploy to **Cloudflare Pages** via Wrangler CLI, use **Howler.js** for audio sprites, ship images as **AVIF with WebP fallback**, persist save state in **localStorage** (under 10 KB JSON), and skip a real PWA for v1 (just add a touch icon + manifest so the iOS "Add to Home Screen" looks polished). Phaser 4.0.0 "Caladan" went stable on April 10, 2026 — the renderer rewrite, proper tree-shaking, and automatic WebGL context restoration on backgrounding are exactly what a mobile point-and-click needs.

---

## 1. Framework: Phaser 4

**Verdict: Phaser 4 (4.0.0 stable, April 2026) with the official `phaser-editor-template-vite-ts` starter.**

Why Phaser 4 wins for this specific game:

| Criterion | Phaser 4 | PixiJS v8 | Three.js | React + Howler |
|---|---|---|---|---|
| Point-and-click semantics built in | Yes | Sprites only | Overkill for 2D | Reinvent everything |
| Mobile WebGL perf in 2026 | Excellent — ~16× speedup on filter-heavy scenes | Excellent | Heavy GPU footprint | Whatever you bolt on |
| Tree-shakeable bundle | Yes (new in v4) — full build ~345 KB min+gz | ~250 KB baseline | 600+ KB | React 130 KB + extras |
| Audio + sprite sheets + tweens out of box | Yes | No | No | Separate libs |
| Context loss recovery on iOS backgrounding | **Automatic in v4** | Manual | Manual | Manual |
| Documentation density for AI agents | Very high — 11k+ snippets in Context7 | High | High but 3D-focused | Fragmented |

### Stack composition

```
Phaser 4.0.0          — game framework, scene graph, input, tweens, sprites
TypeScript 5.x        — type safety, agent-friendly
Vite 5+               — dev server, HMR, production bundler
Howler.js 2.x         — audio sprites, ambient music, iOS unlock helper
phaser/scale          — built-in responsive scaling with FIT mode
```

---

## 2. Deployment: Cloudflare Pages

**Verdict: Cloudflare Pages.** Unlimited bandwidth, 500 builds/month, 100 sites on the free tier, commercial use allowed, 300+ POP CDN.

### Deploy commands

```bash
# one-time
npm i -g wrangler
wrangler login

# in your project (after `npm run build` produces `dist/`)
wrangler pages deploy dist --project-name=mimi-escape

# add to package.json
"scripts": {
  "deploy": "vite build && wrangler pages deploy dist --project-name=mimi-escape"
}
```

You get an HTTPS URL like `mimi-escape.pages.dev` instantly.

---

## 3. Mobile Safari gotchas checklist

**Audio**
- AudioContext is suspended on load. Call `Howler.ctx.resume()` inside the first `pointerdown`/`touchend` handler.
- iOS prefers AAC/MP4 (`.m4a`) and MP3 over OGG.
- Listen for `visibilitychange` and resume the AudioContext + restart ambient track.

**Viewport**
- Use `100dvh` for the game canvas, not `100vh`.
- Add `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`.
- Honor `env(safe-area-inset-*)` for any HUD/UI overlay.
- Phaser's Scale Manager: use `Phaser.Scale.FIT` with a logical resolution (e.g. 1080×1920 portrait).

**Input**
- Use `pointerdown`/`pointerup`/`pointermove`.
- Add `touch-action: none` on the canvas.
- Add `user-select: none` and `-webkit-tap-highlight-color: transparent`.

**Storage**
- localStorage 5 MiB per origin.
- **The 7-day eviction cliff**: if a user doesn't open Safari to your site for 7 days, all storage is wiped (does *not* apply to PWAs added to Home Screen).

**Performance pitfalls on 5+ year old iPhones (A11/A12 era)**
- Avoid CSS `backdrop-filter: blur()`.
- Cap target framerate to 30 fps for ambient scenes.
- Pre-decode large images with `<link rel="preload" as="image">`.
- Use sprite atlases, not individual PNGs.

---

## 4. PWA: minimal v1

For v1, **don't build a full offline PWA**. Add minimum so iOS users who tap "Add to Home Screen" get a clean experience:

```html
<!-- index.html <head> -->
<link rel="manifest" href="/manifest.webmanifest">
<link rel="apple-touch-icon" href="/icons/apple-touch-icon-180.png">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Mimi">
<meta name="theme-color" content="#0a0a0a">
```

```json
// public/manifest.webmanifest
{
  "name": "Mimi — Escape Game",
  "short_name": "Mimi",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0a0a0a",
  "theme_color": "#0a0a0a",
  "orientation": "portrait",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable" }
  ]
}
```

---

## 5. Asset pipeline

**Images**
- Source assets in PNG (sharp lines) or high-quality JPEG (photographic).
- Ship **WebP** for canvas textures (Phaser loads it transparently in iOS 14+).
- Pack puzzle scene sprites into atlases.
- Target dimensions: 1080×1920 logical resolution, 2× assets only for hero art. Keep total initial load under 3 MB.

**Audio**
- Ship MP3 only.
- Use Howler audio sprites for short SFX (one HTTP request, one decode).
- Long ambient tracks stay as standalone files with `loop: true, html5: true`.
- Encode ambient music at 96–128 kbps mono.

---

## 6. State and save game

**localStorage. Single key. JSON blob. Done.**

```ts
type SaveState = {
  v: 1;
  scene: string;
  progress: Record<string, boolean>;
  inventory: string[];
  cards: { id: string; state: 'hand' | 'played' | 'discarded' }[];
  flags: Record<string, number>;
  startedAt: number;
  updatedAt: number;
};

const KEY = 'mimi.save.v1';
const save = (s: SaveState) => localStorage.setItem(KEY, JSON.stringify({ ...s, updatedAt: Date.now() }));
const load = (): SaveState | null => {
  try { return JSON.parse(localStorage.getItem(KEY) ?? 'null'); } catch { return null; }
};
```

---

## 7. Folder structure

```
mimi/
├── public/
│   ├── manifest.webmanifest
│   ├── icons/
│   └── assets/
│       ├── atlases/
│       ├── images/
│       ├── audio/
│       └── fonts/
├── src/
│   ├── main.ts
│   ├── config.ts
│   ├── scenes/
│   │   ├── BootScene.ts
│   │   ├── PreloadScene.ts
│   │   ├── MenuScene.ts
│   │   ├── puzzles/
│   │   └── EndScene.ts
│   ├── objects/
│   │   ├── Card.ts
│   │   ├── Hotspot.ts
│   │   └── DialogueBox.ts
│   ├── systems/
│   │   ├── save.ts
│   │   ├── audio.ts
│   │   ├── narrative.ts
│   │   └── inventory.ts
│   └── data/
│       ├── puzzles.ts
│       ├── cards.ts
│       └── dialogue.ts
├── index.html
├── tsconfig.json
├── vite.config.ts
├── package.json
└── wrangler.toml
```

### One-shot bootstrap

```bash
npm create @phaserjs/game@latest mimi -- --template vite-ts
cd mimi
npm install howler @types/howler
npm install -D wrangler
npm run dev
```
