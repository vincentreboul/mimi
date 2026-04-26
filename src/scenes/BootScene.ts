import * as Phaser from 'phaser';
import { COLORS, FONTS, GAME_WIDTH, GAME_HEIGHT } from '../config';
import { unlockAudio } from '../systems/audio';
import { loadSave } from '../systems/save';
import { t } from '../systems/narrative';

/**
 * BootScene: shows a tap-to-start prompt that doubles as the iOS audio unlock.
 * Without this, audio is silent on iPhone Safari.
 */
export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload(): void {
    // Load only what's strictly needed for the splash
  }

  async create(): Promise<void> {
    loadSave();

    // Wait briefly for fonts to load
    await this.waitForFonts();

    const { width, height } = this.scale.gameSize;

    // Backdrop with subtle gradient (drawn via Graphics)
    const g = this.add.graphics();
    g.fillGradientStyle(COLORS.leafDeep, COLORS.leafDeep, COLORS.charDeep, COLORS.charDeep, 1, 1, 0.9, 0.9);
    g.fillRect(0, 0, width, height);

    // Decorative leaves (procedural)
    this.drawDecoLeaves(g, width, height);

    // Title
    this.add.text(width / 2, height / 2 - 200, 'KORA', {
      fontFamily: FONTS.display,
      fontSize: '200px',
      color: COLORS.hex.cream,
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 - 60, 'L\'éveil orbital', {
      fontFamily: FONTS.display,
      fontSize: '48px',
      color: COLORS.hex.brass,
      fontStyle: 'italic',
    }).setOrigin(0.5);

    // Tap to start prompt
    const tapText = this.add.text(width / 2, height / 2 + 200, t('ui.start'), {
      fontFamily: FONTS.body,
      fontSize: '36px',
      color: COLORS.hex.skyPale,
    }).setOrigin(0.5);

    this.tweens.add({
      targets: tapText,
      alpha: { from: 0.4, to: 1 },
      duration: 1100,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Make the whole screen tap-to-start
    const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0).setOrigin(0);
    overlay.setInteractive();
    overlay.on('pointerdown', () => {
      unlockAudio();
      this.cameras.main.fadeOut(300, 31, 77, 62);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('PreloadScene');
      });
    });
  }

  private async waitForFonts(): Promise<void> {
    if (!('fonts' in document)) return;
    try {
      await (document as any).fonts.ready;
    } catch {
      // ignore
    }
  }

  private drawDecoLeaves(g: Phaser.GameObjects.Graphics, w: number, h: number): void {
    g.fillStyle(COLORS.leafLight, 0.08);
    for (let i = 0; i < 24; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const r = 60 + Math.random() * 140;
      g.fillCircle(x, y, r);
    }
  }
}
