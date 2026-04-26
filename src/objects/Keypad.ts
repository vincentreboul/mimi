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

export class Keypad extends Phaser.GameObjects.Container {
  private display: Phaser.GameObjects.Text;
  private current = '';
  private opts: KeypadOptions;
  private feedback: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, opts: KeypadOptions) {
    super(scene, GAME_WIDTH / 2, GAME_HEIGHT / 2);
    this.opts = opts;

    // Backdrop
    const backdrop = scene.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, COLORS.charDeep, 0.92);
    backdrop.setInteractive();
    backdrop.on('pointerdown', () => {
      // tap outside cancels
      opts.onCancel?.();
      this.destroy();
    });
    this.add(backdrop);

    // Panel
    const panel = scene.add.rectangle(0, 0, 720, 1100, COLORS.leafDeep, 0.98);
    panel.setStrokeStyle(4, COLORS.brass, 1);
    panel.setInteractive(); // catch taps so backdrop doesn't trigger
    this.add(panel);

    // Prompt
    const prompt = scene.add.text(0, -440, opts.prompt ?? 'Code', {
      fontFamily: FONTS.mono,
      fontSize: '36px',
      color: COLORS.hex.skyPale,
    }).setOrigin(0.5);
    this.add(prompt);

    // Display
    this.display = scene.add.text(0, -340, '_'.repeat(opts.digits), {
      fontFamily: FONTS.mono,
      fontSize: '96px',
      color: COLORS.hex.cream,
      letterSpacing: 18,
    } as Phaser.Types.GameObjects.Text.TextStyle).setOrigin(0.5);
    this.add(this.display);

    // Feedback
    this.feedback = scene.add.text(0, -220, '', {
      fontFamily: FONTS.body,
      fontSize: '28px',
      color: COLORS.hex.warning,
    }).setOrigin(0.5);
    this.add(this.feedback);

    // Digit grid
    const startX = -240;
    const startY = -100;
    const btnSize = 160;
    const gap = 20;
    for (let i = 0; i < 9; i++) {
      const r = Math.floor(i / 3);
      const c = i % 3;
      const x = startX + c * (btnSize + gap);
      const y = startY + r * (btnSize + gap);
      const digit = String(i + 1);
      this.add(this.makeKey(scene, x, y, btnSize, digit, () => this.appendDigit(digit)));
    }
    // 0 in center bottom
    const zeroY = startY + 3 * (btnSize + gap);
    this.add(this.makeKey(scene, 0, zeroY, btnSize, '0', () => this.appendDigit('0')));
    // Backspace
    this.add(this.makeKey(scene, startX, zeroY, btnSize, '⌫', () => this.backspace()));
    // Validate
    this.add(this.makeKey(scene, startX + 2 * (btnSize + gap), zeroY, btnSize, '✓', () => this.validate(), true));

    scene.add.existing(this);
    this.setDepth(8000);

    scene.tweens.add({
      targets: this,
      alpha: { from: 0, to: 1 },
      duration: 220,
    });
  }

  private makeKey(scene: Phaser.Scene, x: number, y: number, size: number, label: string, onTap: () => void, primary = false): Phaser.GameObjects.Container {
    const c = scene.add.container(x, y);
    const fill = primary ? COLORS.sunAmber : COLORS.brassDark;
    const bg = scene.add.rectangle(0, 0, size, size, fill, 0.9);
    bg.setStrokeStyle(2, COLORS.brass, 1);
    const t = scene.add.text(0, 0, label, {
      fontFamily: FONTS.mono,
      fontSize: '64px',
      color: COLORS.hex.cream,
      fontStyle: 'bold',
    }).setOrigin(0.5);
    c.add([bg, t]);
    c.setSize(size, size);
    c.setInteractive(new Phaser.Geom.Rectangle(-size / 2, -size / 2, size, size), Phaser.Geom.Rectangle.Contains);
    c.on('pointerdown', () => {
      playSfx('tap');
      scene.tweens.add({ targets: c, scale: { from: 1, to: 0.92 }, duration: 80, yoyo: true });
      onTap();
    });
    return c;
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
        x: { from: -10, to: 10 },
        duration: 60,
        yoyo: true,
        repeat: 3,
        onComplete: () => this.display.setX(0),
      });
      this.current = '';
      this.scene.time.delayedCall(800, () => this.refreshDisplay());
    }
  }
}
