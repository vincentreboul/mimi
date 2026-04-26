import * as Phaser from 'phaser';
import { COLORS, FONTS, GAME_WIDTH } from '../config';
import { playSfx } from '../systems/audio';

export interface VirtualKeyboardOptions {
  x: number;
  y: number;
  maxLength?: number;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
}

const ROWS = [
  ['A', 'Z', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['Q', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M'],
  ['W', 'X', 'C', 'V', 'B', 'N', 'É', 'È', 'Ç', 'À'],
];

const KEY_W = 96;
const KEY_H = 110;
const KEY_GAP = 8;

/**
 * In-canvas virtual keyboard, AZERTY layout.
 * Works reliably on mobile (no DOM/IME complexity).
 */
export class VirtualKeyboard extends Phaser.GameObjects.Container {
  private value = '';
  private opts: VirtualKeyboardOptions;

  constructor(scene: Phaser.Scene, opts: VirtualKeyboardOptions) {
    super(scene, opts.x, opts.y);
    this.opts = opts;

    ROWS.forEach((row, ri) => {
      const totalW = row.length * KEY_W + (row.length - 1) * KEY_GAP;
      const startX = -totalW / 2 + KEY_W / 2;
      row.forEach((letter, ci) => {
        const kx = startX + ci * (KEY_W + KEY_GAP);
        const ky = ri * (KEY_H + KEY_GAP);
        this.add(this.makeKey(scene, kx, ky, KEY_W, KEY_H, letter, () => this.append(letter)));
      });
    });

    // Bottom row: backspace + submit
    const bottomY = ROWS.length * (KEY_H + KEY_GAP);
    const backW = 240;
    const submitW = 320;
    const totalBottom = backW + submitW + KEY_GAP;
    const bx = -totalBottom / 2 + backW / 2;
    const sx = bx + backW / 2 + KEY_GAP + submitW / 2;
    this.add(this.makeKey(scene, bx, bottomY, backW, KEY_H, '⌫ EFFACER', () => this.backspace(), 'sub'));
    this.add(this.makeKey(scene, sx, bottomY, submitW, KEY_H, '✓ VALIDER', () => this.submit(), 'primary'));

    scene.add.existing(this);
  }

  private makeKey(scene: Phaser.Scene, x: number, y: number, w: number, h: number, label: string, onTap: () => void, kind: 'normal' | 'sub' | 'primary' = 'normal'): Phaser.GameObjects.Container {
    const c = scene.add.container(x, y);
    const fill = kind === 'primary' ? COLORS.sunAmber : kind === 'sub' ? COLORS.brassDark : COLORS.brassDark;
    const bg = scene.add.rectangle(0, 0, w, h, fill, 0.95);
    bg.setStrokeStyle(3, COLORS.brass, 1);
    const txt = scene.add.text(0, 0, label, {
      fontFamily: kind === 'normal' ? FONTS.display : FONTS.body,
      fontSize: kind === 'normal' ? '54px' : '26px',
      color: kind === 'primary' ? COLORS.hex.charDeep : COLORS.hex.cream,
      fontStyle: 'bold',
    }).setOrigin(0.5);
    c.add([bg, txt]);
    c.setSize(w, h);
    // Hit area larger than visual to absorb missed taps + never shrink during animation
    const hitPad = 12;
    c.setInteractive(
      new Phaser.Geom.Rectangle(-w / 2 - hitPad, -h / 2 - hitPad, w + hitPad * 2, h + hitPad * 2),
      Phaser.Geom.Rectangle.Contains
    );
    c.on('pointerdown', () => {
      playSfx('tap');
      // Press feedback: color flash (no scale, so hit area unaffected)
      const origColor = bg.fillColor;
      bg.setFillStyle(COLORS.cream, 1);
      scene.time.delayedCall(60, () => bg.setFillStyle(origColor, 0.95));
      onTap();
    });
    return c;
  }

  private append(letter: string): void {
    if (this.value.length >= (this.opts.maxLength ?? 12)) return;
    if (this.value.length === 0) {
      this.value = letter;
    } else {
      this.value += letter.toLowerCase();
    }
    this.opts.onChange?.(this.value);
  }

  private backspace(): void {
    if (this.value.length === 0) return;
    this.value = this.value.slice(0, -1);
    this.opts.onChange?.(this.value);
  }

  private submit(): void {
    if (this.value.length === 0) return;
    this.opts.onSubmit?.(this.value);
  }

  getValue(): string {
    return this.value;
  }

  setValue(v: string): void {
    this.value = v;
    this.opts.onChange?.(v);
  }
}
