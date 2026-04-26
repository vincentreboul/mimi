import * as Phaser from 'phaser';
import { COLORS, FONTS } from '../config';
import { PrecisionButton } from './PrecisionButton';

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

// Generous gaps so adjacent keys can NEVER overlap visually or in hit area.
const KEY_W = 90;
const KEY_H = 110;
const KEY_GAP = 14;
const ROW_GAP = 14;

/**
 * In-canvas virtual keyboard, AZERTY layout.
 * Uses PrecisionButton (pointerup with target verification) for laser-precise taps.
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
        const ky = ri * (KEY_H + ROW_GAP);
        this.add(new PrecisionButton(scene, {
          x: kx, y: ky, width: KEY_W, height: KEY_H,
          label: letter,
          fontSize: 54,
          fontFamily: FONTS.display,
          onTap: () => this.append(letter),
        }));
      });
    });

    // Bottom row: backspace + submit
    const bottomY = ROWS.length * (KEY_H + ROW_GAP);
    const backW = 240;
    const submitW = 320;
    const bx = -(backW + submitW + KEY_GAP) / 2 + backW / 2;
    const sx = bx + backW / 2 + KEY_GAP + submitW / 2;
    this.add(new PrecisionButton(scene, {
      x: bx, y: bottomY, width: backW, height: KEY_H,
      label: '⌫ EFFACER',
      fontSize: 26,
      onTap: () => this.backspace(),
    }));
    this.add(new PrecisionButton(scene, {
      x: sx, y: bottomY, width: submitW, height: KEY_H,
      label: '✓ VALIDER',
      fontSize: 28,
      fillColor: COLORS.sunAmber,
      textColor: COLORS.hex.charDeep,
      onTap: () => this.submit(),
    }));

    scene.add.existing(this);
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
}
