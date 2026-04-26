import * as Phaser from 'phaser';
import { COLORS } from '../config';
import type { ItemId } from '../data/items';

/**
 * Draw a pixel-art icon for an item, centered at (0, 0) within a parent container.
 * Returns a Graphics object that can be added to a container.
 */
export function drawItemIcon(scene: Phaser.Scene, itemId: ItemId, scale: number = 1): Phaser.GameObjects.Graphics {
  const g = scene.add.graphics();
  const s = scale;

  const px = (x: number, y: number, w: number, h: number, color: number, alpha = 1) => {
    g.fillStyle(color, alpha);
    g.fillRect(x * s, y * s, w * s, h * s);
  };

  switch (itemId) {
    case 'bracelet': // Montre cassée — broken pocket watch
      // Outer brass case
      px(-22, -22, 44, 44, COLORS.brassDark);
      px(-20, -20, 40, 40, COLORS.brass);
      // Face
      px(-16, -16, 32, 32, COLORS.cream);
      // Hour marks
      px(-2, -16, 4, 4, COLORS.charDeep);
      px(-2, 12, 4, 4, COLORS.charDeep);
      px(-16, -2, 4, 4, COLORS.charDeep);
      px(12, -2, 4, 4, COLORS.charDeep);
      // Broken hands (askew)
      px(-2, -10, 4, 12, COLORS.charDeep);
      px(-10, -2, 8, 4, COLORS.charDeep);
      // Crack across face
      px(-12, -8, 4, 4, COLORS.warning, 0.7);
      px(-8, -4, 4, 4, COLORS.warning, 0.7);
      px(-4, 0, 4, 4, COLORS.warning, 0.7);
      break;

    case 'badge': // ID badge
      px(-20, -28, 40, 56, COLORS.cream);
      px(-18, -26, 36, 52, COLORS.skyPale);
      // Photo
      px(-14, -22, 18, 22, COLORS.brass);
      px(-12, -20, 14, 18, COLORS.charDeep);
      // Name lines
      px(8, -20, 10, 4, COLORS.charDeep);
      px(8, -12, 10, 4, COLORS.charDeep);
      px(-14, 4, 28, 3, COLORS.charDeep);
      px(-14, 12, 24, 3, COLORS.charDeep);
      // Clip
      px(-6, -32, 12, 8, COLORS.brassDark);
      break;

    case 'note_leah': // Handwritten note
      px(-22, -28, 44, 56, COLORS.cream);
      // Lines
      for (let i = 0; i < 7; i++) {
        const y = -22 + i * 8;
        const len = i % 2 === 0 ? 36 : 28;
        px(-18, y, len, 2, COLORS.charDeep);
      }
      // Folded corner
      px(14, -28, 8, 8, COLORS.brassDark);
      px(16, -26, 6, 6, COLORS.brass);
      break;

    case 'cryo_schema': // Cadre photo (frame)
      // Brass frame
      px(-22, -28, 44, 56, COLORS.brass);
      px(-18, -24, 36, 48, COLORS.charDeep);
      // 3 head silhouettes
      px(-12, -16, 6, 6, COLORS.cream);
      px(-2, -18, 6, 6, COLORS.cream);
      px(8, -16, 6, 6, COLORS.cream);
      // Bodies
      px(-14, -8, 8, 12, COLORS.cream);
      px(-4, -10, 8, 14, COLORS.cream);
      px(6, -8, 8, 12, COLORS.cream);
      // Date plaque
      px(-20, 18, 40, 8, COLORS.brassDark);
      px(-18, 20, 36, 4, COLORS.brass);
      break;

    case 'cryo_key':
    case 'cle_atelier': // Brass key
      // Bow (rounded head)
      px(-22, -10, 16, 20, COLORS.brassDark);
      px(-20, -8, 12, 16, COLORS.brass);
      px(-18, -6, 8, 12, COLORS.charDeep);
      px(-14, -2, 4, 4, COLORS.brass);
      // Shaft
      px(-6, -3, 24, 6, COLORS.brass);
      // Teeth
      px(14, 3, 4, 6, COLORS.brass);
      px(8, 3, 3, 5, COLORS.brass);
      break;

    case 'pince': // Pince à plantes (small pruner)
      px(-18, -16, 12, 4, COLORS.brass);
      px(6, -16, 12, 4, COLORS.brass);
      px(-6, -16, 12, 4, COLORS.brassDark);
      px(-2, -12, 4, 26, COLORS.brassDark);
      px(-14, -12, 12, 4, COLORS.brassDark);
      px(2, -12, 12, 4, COLORS.brassDark);
      px(-2, 14, 4, 8, COLORS.brass);
      break;

    case 'fert_a': // Bottle blue (phosphate)
    case 'fert_b': // Bottle green (azote)
    case 'fert_c': // Bottle orange (potasse)
    case 'fert_d': // Bottle gray (calcium)
    {
      const fcol: Record<string, number> = {
        fert_a: COLORS.skyPale,
        fert_b: COLORS.leafLight,
        fert_c: COLORS.sunAmber,
        fert_d: 0xb0b0b0,
      };
      const c = fcol[itemId] || COLORS.cream;
      // Cap
      px(-6, -22, 12, 6, COLORS.brassDark);
      // Neck
      px(-4, -16, 8, 4, COLORS.brass);
      // Body
      px(-14, -12, 28, 32, c);
      px(-12, -10, 24, 28, c);
      // Highlight
      px(-10, -8, 4, 24, COLORS.cream, 0.4);
      // Label
      px(-12, 0, 24, 8, COLORS.charDeep, 0.85);
      break;
    }

    case 'fert_mix': // Mixed bottle (purple-ish)
      px(-6, -22, 12, 6, COLORS.brassDark);
      px(-4, -16, 8, 4, COLORS.brass);
      px(-14, -12, 28, 32, 0x8b6db5);
      px(-12, -10, 24, 28, 0x8b6db5);
      px(-10, -8, 4, 24, COLORS.cream, 0.4);
      // Sparkle
      px(0, -6, 4, 4, COLORS.sunAmber, 0.9);
      px(-6, 4, 3, 3, COLORS.cream, 0.8);
      px(8, 8, 3, 3, COLORS.cream, 0.8);
      break;

    case 'note_botanique': // Paper with leaf
      px(-22, -28, 44, 56, COLORS.cream);
      // Leaf
      px(-8, -20, 16, 22, COLORS.leafLight);
      px(-6, -18, 12, 18, COLORS.leafDeep);
      px(-1, -22, 2, 28, COLORS.leafDeep);
      // Lines below
      px(-18, 8, 36, 2, COLORS.charDeep);
      px(-18, 14, 28, 2, COLORS.charDeep);
      px(-18, 20, 32, 2, COLORS.charDeep);
      break;

    case 'graine_rare': // Bioluminescent seed
      // Halo
      px(-20, -20, 40, 40, COLORS.sunAmber, 0.25);
      px(-16, -16, 32, 32, COLORS.sunAmber, 0.5);
      // Seed body
      px(-10, -12, 20, 24, COLORS.brassDark);
      px(-8, -10, 16, 20, COLORS.brass);
      // Inner glow
      px(-4, -6, 8, 12, COLORS.sunAmber);
      px(-2, -2, 4, 4, COLORS.cream);
      break;

    case 'tournevis': // Screwdriver
      // Handle
      px(-22, -8, 16, 16, COLORS.warning);
      px(-20, -6, 12, 12, 0xb02617);
      // Shaft
      px(-6, -3, 22, 6, 0xc0c0c0);
      // Tip
      px(16, -2, 4, 4, COLORS.cream);
      break;

    case 'comp_resistor': // Resistor
      // Wires
      px(-22, -2, 8, 4, 0x808080);
      px(14, -2, 8, 4, 0x808080);
      // Body
      px(-14, -8, 28, 16, COLORS.cream);
      // Bands
      px(-10, -8, 4, 16, COLORS.warning);
      px(-2, -8, 4, 16, COLORS.charDeep);
      px(6, -8, 4, 16, COLORS.sunAmber);
      break;

    case 'comp_capa': // Capacitor (cylinder)
      px(-2, -22, 4, 8, 0x808080);
      px(-12, -14, 24, 28, 0x1a3a40);
      px(-10, -12, 20, 24, 0x2d6a4f);
      px(-8, -8, 16, 6, COLORS.cream);
      px(-2, 14, 4, 6, 0x808080);
      break;

    case 'comp_diode': // Diode (triangle pointing right)
      px(-22, -2, 8, 4, 0x808080);
      // Triangle body
      for (let i = 0; i < 12; i++) {
        const w = 12 - i;
        px(-12 + i, -i / 2 - 6, 1, 12 + i, COLORS.charDeep);
      }
      // Cathode bar
      px(2, -10, 4, 20, COLORS.cream);
      px(8, -2, 8, 4, 0x808080);
      break;

    case 'comp_led': // LED (amber bulb)
      // Halo
      px(-18, -18, 36, 36, COLORS.sunAmber, 0.3);
      // Bulb dome
      px(-10, -16, 20, 4, COLORS.sunAmber);
      px(-12, -12, 24, 16, COLORS.sunAmber);
      px(-10, 4, 20, 4, COLORS.sunAmber);
      // Highlight
      px(-6, -10, 4, 6, COLORS.cream);
      // Legs
      px(-6, 8, 3, 12, 0x808080);
      px(3, 8, 3, 12, 0x808080);
      break;

    case 'circuit_ok': // Repaired circuit board
      px(-22, -16, 44, 32, 0x2a4f3e);
      px(-20, -14, 40, 28, 0x355e4c);
      // Traces
      px(-18, -8, 28, 2, COLORS.brass);
      px(-18, -6, 2, 14, COLORS.brass);
      px(8, -6, 2, 10, COLORS.brass);
      // Components
      px(-14, -4, 6, 6, COLORS.warning);
      px(-4, -4, 6, 6, 0x1a3a40);
      // LED on (glowing)
      px(10, -4, 8, 8, COLORS.sunAmber);
      px(12, -2, 4, 4, COLORS.cream);
      break;

    case 'cristal_a': // Hexagonal crystal (sky)
      // Hexagon shape (approximated)
      px(-6, -20, 12, 4, COLORS.skyPale);
      px(-12, -16, 24, 4, COLORS.skyPale);
      px(-16, -12, 32, 16, COLORS.skyPale);
      px(-12, 4, 24, 4, COLORS.skyPale);
      px(-6, 8, 12, 4, COLORS.skyPale);
      // Highlights
      px(-4, -16, 4, 24, COLORS.cream, 0.6);
      // Halo
      px(-22, -22, 44, 36, COLORS.skyPale, 0.2);
      break;

    case 'cristal_b': // Pentagonal crystal (amber)
      px(-4, -20, 8, 4, COLORS.sunAmber);
      px(-12, -16, 24, 4, COLORS.sunAmber);
      px(-14, -12, 28, 8, COLORS.sunAmber);
      px(-16, -4, 32, 8, COLORS.sunAmber);
      px(-10, 4, 20, 4, COLORS.sunAmber);
      // Highlights
      px(-2, -16, 4, 18, COLORS.cream, 0.6);
      px(-22, -22, 44, 32, COLORS.sunAmber, 0.2);
      break;

    case 'log_capitaine': // Captain's logbook
      // Cover
      px(-20, -26, 40, 52, 0x4d2818);
      px(-18, -24, 36, 48, 0x6b4226);
      // Spine
      px(-20, -26, 4, 52, 0x2a1a10);
      // Title plaque
      px(-12, -16, 24, 10, COLORS.brass);
      px(-10, -14, 20, 6, COLORS.charDeep);
      // Stripes
      px(-12, 4, 24, 2, COLORS.brass);
      px(-12, 10, 24, 2, COLORS.brass);
      px(-12, 16, 24, 2, COLORS.brass);
      break;

    default:
      // Fallback: brass square
      px(-12, -12, 24, 24, COLORS.brass);
      px(-8, -8, 16, 16, COLORS.charDeep);
      break;
  }

  return g;
}
