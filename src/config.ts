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

// Pixel-art typography — VT323 readable body, Press Start 2P iconic display
export const FONTS = {
  body: '"Pixelify Sans", "VT323", monospace',  // pixel-art readable for UI
  display: '"Press Start 2P", "VT323", monospace', // iconic retro arcade for titles
  mono: '"VT323", monospace',                    // diegetic terminals
} as const;

// HUD layout — touch-first, generous targets (iPhone)
export const HUD = {
  topBarHeight: 110,
  // SCUMM verb panel
  verbPanelHeight: 240,            // 2 rows × 120
  verbButtonHeight: 110,
  verbButtonWidth: 510,            // 2 columns: (1080 - gaps) / 2
  // Action label (current object name)
  actionLabelHeight: 88,
  // Inventory
  inventoryHeight: 220,
  inventorySlotSize: 160,
  // Hint button
  hintButtonSize: 130,
  // Hotspot minimums — VERY generous for mobile
  touchTargetMin: 180,             // ~ 90 pt on iPhone (2× Apple HIG)
  hotspotMin: 220,                 // even bigger for primary scene objects
} as const;

// Total HUD bottom block height (verbs + label + inventory + safe area)
export const HUD_BOTTOM_TOTAL = HUD.actionLabelHeight + HUD.verbPanelHeight + HUD.inventoryHeight + 40;
// Scene area = top of HUD (everything above this is "stage")
export const STAGE_BOTTOM_Y = GAME_HEIGHT - HUD_BOTTOM_TOTAL;

// Game constants
export const HINT_TIERS = 3;
export const STUCK_T1_MS = 90_000; // 90 sec
export const STUCK_T2_MS = 180_000; // 3 min
export const STUCK_T3_MS = 420_000; // 7 min
