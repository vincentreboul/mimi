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

// HUD layout — touch-first, generous targets (iPhone). Compact to give the scene more height.
export const HUD = {
  topBarHeight: 90,
  // SCUMM verb panel
  verbPanelHeight: 200,            // 2 rows × 95 + gap
  verbButtonHeight: 95,
  verbButtonWidth: 520,            // 2 columns: (1080 - gaps) / 2
  // Action label (current object name)
  actionLabelHeight: 56,
  // Inventory — slightly smaller slots so hint button fits on the right
  inventoryHeight: 160,
  inventorySlotSize: 108,
  // Hint button — placed at right of inventory strip
  hintButtonSize: 120,
  // Hotspot minimums — VERY generous for mobile
  touchTargetMin: 180,
  hotspotMin: 220,
} as const;

// Total HUD bottom block height (action label + verbs + inventory + safe margin)
export const HUD_BOTTOM_TOTAL = HUD.actionLabelHeight + HUD.verbPanelHeight + HUD.inventoryHeight + 24;
// Scene area = top of HUD (everything above this is "stage")
export const STAGE_BOTTOM_Y = GAME_HEIGHT - HUD_BOTTOM_TOTAL;

// Game constants
export const HINT_TIERS = 3;
export const STUCK_T1_MS = 90_000; // 90 sec
export const STUCK_T2_MS = 180_000; // 3 min
export const STUCK_T3_MS = 420_000; // 7 min
