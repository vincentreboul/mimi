import * as Phaser from 'phaser';
import { COLORS, FONTS, GAME_WIDTH, GAME_HEIGHT } from '../config';
import { playSfx } from '../systems/audio';

export interface KeypadOptions {
  digits: number;
  solution: string;
  prompt?: string;
  onCorrect: () => void;
  onWrong: (entered: string) => void;
  onCancel?: () => void;
}

/**
 * Keypad — modal numeric input.
 * Uses scene-level Rectangles as interactive (no Container nesting offset).
 * Each visual is tracked for proper cleanup on destroy().
 */
export class Keypad {
  private display: Phaser.GameObjects.Text;
  private current = '';
  private opts: KeypadOptions;
  private feedback: Phaser.GameObjects.Text;
  private allChildren: Phaser.GameObjects.GameObject[] = [];
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene, opts: KeypadOptions) {
    this.scene = scene;
    this.opts = opts;

    const cx = GAME_WIDTH / 2;
    const cy = GAME_HEIGHT / 2;
    const baseDepth = 8000;

    // Backdrop — full-screen, interactive, taps outside cancel
    const backdrop = scene.add.rectangle(cx, cy, GAME_WIDTH, GAME_HEIGHT, COLORS.charDeep, 0.92);
    backdrop.setDepth(baseDepth);
    backdrop.setInteractive({ useHandCursor: false });
    backdrop.on('pointerdown', () => {
      opts.onCancel?.();
      this.destroy();
    });
    this.allChildren.push(backdrop);

    // Panel — solid color rect, interactive to absorb taps (so they don't fall through to backdrop)
    const panel = scene.add.rectangle(cx, cy, 720, 1100, COLORS.leafDeep, 0.98);
    panel.setStrokeStyle(4, COLORS.brass, 1);
    panel.setDepth(baseDepth + 1);
    panel.setInteractive({ useHandCursor: false });
    // Empty handler — just absorb taps
    panel.on('pointerdown', () => { /* swallow */ });
    this.allChildren.push(panel);

    // Prompt
    const prompt = scene.add.text(cx, cy - 440, opts.prompt ?? 'Code', {
      fontFamily: FONTS.mono,
      fontSize: '36px',
      color: COLORS.hex.skyPale,
    }).setOrigin(0.5).setDepth(baseDepth + 2);
    this.allChildren.push(prompt);

    // Display
    this.display = scene.add.text(cx, cy - 340, '_'.repeat(opts.digits), {
      fontFamily: FONTS.mono,
      fontSize: '96px',
      color: COLORS.hex.cream,
      letterSpacing: 18,
    } as Phaser.Types.GameObjects.Text.TextStyle).setOrigin(0.5).setDepth(baseDepth + 2);
    this.allChildren.push(this.display);

    // Feedback
    this.feedback = scene.add.text(cx, cy - 220, '', {
      fontFamily: FONTS.body,
      fontSize: '28px',
      color: COLORS.hex.warning,
    }).setOrigin(0.5).setDepth(baseDepth + 2);
    this.allChildren.push(this.feedback);

    // Digit grid 1-9
    const startX = cx - 240;
    const startY = cy - 100;
    const btnSize = 160;
    const gap = 20;
    for (let i = 0; i < 9; i++) {
      const r = Math.floor(i / 3);
      const c = i % 3;
      const x = startX + c * (btnSize + gap);
      const y = startY + r * (btnSize + gap);
      const digit = String(i + 1);
      this.makeKey(x, y, btnSize, digit, () => this.appendDigit(digit), false, baseDepth + 3);
    }
    const zeroY = startY + 3 * (btnSize + gap);
    this.makeKey(cx, zeroY, btnSize, '0', () => this.appendDigit('0'), false, baseDepth + 3);
    this.makeKey(startX, zeroY, btnSize, '⌫', () => this.backspace(), false, baseDepth + 3);
    this.makeKey(startX + 2 * (btnSize + gap), zeroY, btnSize, '✓', () => this.validate(), true, baseDepth + 3);
  }

  private makeKey(x: number, y: number, size: number, label: string, onTap: () => void, primary: boolean, depth: number): void {
    const fill = primary ? COLORS.sunAmber : COLORS.brassDark;
    const bg = this.scene.add.rectangle(x, y, size, size, fill, 0.95);
    bg.setStrokeStyle(2, COLORS.brass, 1);
    bg.setDepth(depth);
    bg.setInteractive({ useHandCursor: true });

    const txt = this.scene.add.text(x, y, label, {
      fontFamily: FONTS.mono,
      fontSize: '64px',
      color: primary ? COLORS.hex.charDeep : COLORS.hex.cream,
      fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(depth + 1);

    bg.on('pointerdown', () => {
      playSfx('tap');
      // Color flash, NOT scale tween (preserves hit area)
      bg.setFillStyle(COLORS.cream, 1);
      this.scene.time.delayedCall(80, () => {
        if (bg.active) bg.setFillStyle(fill, 0.95);
      });
      onTap();
    });

    this.allChildren.push(bg, txt);
  }

  private appendDigit(d: string): void {
    if (this.current.length >= this.opts.digits) return;
    this.current += d;
    this.refreshDisplay();
    this.feedback.setText('');
  }

  private backspace(): void {
    this.current = this.current.slice(0, -1);
    this.refreshDisplay();
    this.feedback.setText('');
  }

  private refreshDisplay(): void {
    const filled = this.current;
    const empty = '_'.repeat(this.opts.digits - filled.length);
    this.display.setText((filled + empty).split('').join(' '));
  }

  private validate(): void {
    if (this.current.length !== this.opts.digits) {
      this.feedback.setText(`Code de ${this.opts.digits} chiffres requis.`);
      return;
    }
    if (this.current === this.opts.solution) {
      playSfx('success');
      this.opts.onCorrect();
      this.destroy();
    } else {
      playSfx('fail');
      this.opts.onWrong(this.current);
      this.feedback.setText('Code incorrect.');
      this.scene.tweens.add({
        targets: this.display,
        x: { from: this.display.x - 10, to: this.display.x + 10 },
        duration: 60,
        yoyo: true,
        repeat: 3,
        onComplete: () => this.display.setX(GAME_WIDTH / 2),
      });
      this.current = '';
      this.scene.time.delayedCall(800, () => this.refreshDisplay());
    }
  }

  destroy(): void {
    this.allChildren.forEach((c) => c.destroy());
    this.allChildren = [];
  }
}
