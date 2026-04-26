// Logical resolution — letterboxed to actual screen via Phaser.Scale.FIT
export const GAME_WIDTH = 1080;
export const GAME_HEIGHT = 1920;

// Background color (matches CSS --leaf-deep)
export const BG_COLOR = '#1f4d3e';

// Palette tokens (mirror of tokens.css for use in Phaser)
export const COLORS = {
  leafDeep: 0x1f4d3e,
  leafLight: 0x7fb069,
  brass: 0xd4a373,
  brassDark: 0xa87a4f,
  cream: 0xf4e9d8,
  skyPale: 0xa8dadc,
  sunAmber: 0xf4a261,
  charDeep: 0x1a1f1a,
  warning: 0xc0392b,
  // Hex strings (for text/CSS contexts)
  hex: {
    leafDeep: '#1f4d3e',
    leafLight: '#7fb069',
    brass: '#d4a373',
    brassDark: '#a87a4f',
    cream: '#f4e9d8',
    skyPale: '#a8dadc',
    sunAmber: '#f4a261',
    charDeep: '#1a1f1a',
    warning: '#c0392b',
  },
} as const;

export const FONTS = {
  body: 'Inter, system-ui, sans-serif',
  display: 'Fraunces, serif',
  mono: 'Space Mono, monospace',
} as const;

// HUD layout
export const HUD = {
  inventoryY: GAME_HEIGHT - 280,
  inventoryHeight: 200,
  hintButtonSize: 100,
  touchTargetMin: 96,
} as const;

// Game constants
export const HINT_TIERS = 3;
export const STUCK_T1_MS = 90_000; // 90 sec
export const STUCK_T2_MS = 180_000; // 3 min
export const STUCK_T3_MS = 420_000; // 7 min
