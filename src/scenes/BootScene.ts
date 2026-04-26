import * as Phaser from 'phaser';
import { COLORS, FONTS, GAME_WIDTH, GAME_HEIGHT } from '../config';
import { unlockAudio } from '../systems/audio';
import { loadSave } from '../systems/save';
import { t } from '../systems/narrative';

/**
 * BootScene: pixel-art splash with tap-to-start. Doubles as iOS audio unlock.
 */
export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  async create(): Promise<void> {
    loadSave();
    await this.waitForFonts();

    const { width, height } = this.scale.gameSize;

    // Pixel-art space background — chunky stars
    const g = this.add.graphics();
    g.fillStyle(0x0a1218, 1);
    g.fillRect(0, 0, width, height);

    // Stars (large, chunky pixels)
    g.fillStyle(0xf4e9d8, 0.95);
    for (let i = 0; i < 60; i++) {
      const x = Math.floor(Math.random() * width / 8) * 8;
      const y = Math.floor(Math.random() * height / 8) * 8;
      g.fillRect(x, y, 6, 6);
    }
    g.fillStyle(0xa8dadc, 1);
    for (let i = 0; i < 18; i++) {
      const x = Math.floor(Math.random() * width / 8) * 8;
      const y = Math.floor(Math.random() * height / 8) * 8;
      g.fillRect(x, y, 8, 8);
    }

    // Distant planet — chunky pixel circle
    const planetX = width / 2;
    const planetY = height / 2 - 80;
    this.drawPixelPlanet(g, planetX, planetY, 220);

    // Orbital ring (brass band crossing the planet)
    g.fillStyle(0xd4a373, 0.85);
    g.fillRect(planetX - 360, planetY - 20, 720, 18);
    g.fillStyle(0xa87a4f, 1);
    g.fillRect(planetX - 360, planetY - 4, 720, 4);

    // Title — KORA in chunky pixel font
    this.add.text(width / 2, height / 2 + 200, 'KORA', {
      fontFamily: FONTS.display,
      fontSize: '180px',
      color: COLORS.hex.cream,
    }).setOrigin(0.5).setDepth(10);

    this.add.text(width / 2, height / 2 + 360, "L'ÉVEIL ORBITAL", {
      fontFamily: FONTS.mono,
      fontSize: '46px',
      color: COLORS.hex.brass,
    }).setOrigin(0.5).setDepth(10);

    // Tap-to-start prompt (pulsing)
    const tapText = this.add.text(width / 2, height - 280, '▼ ' + t('ui.start') + ' ▼', {
      fontFamily: FONTS.mono,
      fontSize: '40px',
      color: COLORS.hex.skyPale,
    }).setOrigin(0.5).setDepth(10);
    this.tweens.add({
      targets: tapText,
      alpha: { from: 0.4, to: 1 },
      duration: 1100,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Full-screen tap zone
    const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0).setOrigin(0);
    overlay.setInteractive();
    overlay.on('pointerdown', () => {
      unlockAudio();
      this.cameras.main.fadeOut(300, 10, 18, 24);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('PreloadScene');
      });
    });
  }

  private drawPixelPlanet(g: Phaser.GameObjects.Graphics, cx: number, cy: number, r: number): void {
    // Quantize to 8px chunks for pixel feel
    const step = 8;
    g.fillStyle(0xa8dadc, 1); // sky-pale (planet body)
    for (let dy = -r; dy <= r; dy += step) {
      const halfW = Math.floor(Math.sqrt(r * r - dy * dy) / step) * step;
      g.fillRect(cx - halfW, cy + dy, halfW * 2, step);
    }
    // Continents in green
    g.fillStyle(0x7fb069, 1);
    const continents = [
      [-80, -40, 80], [60, -10, 60], [-30, 50, 70], [40, 60, 50],
    ];
    for (const [dx, dy, sz] of continents) {
      for (let yy = 0; yy < sz; yy += step) {
        const w = Math.floor((sz - yy) * 0.8 / step) * step;
        g.fillRect(cx + dx - w / 2, cy + dy + yy, w, step);
      }
    }
    // Highlight (cream) on top-left
    g.fillStyle(0xf4e9d8, 0.4);
    for (let yy = -r; yy < -r + 80; yy += step) {
      g.fillRect(cx - r / 3, cy + yy, 60, step);
    }
  }

  private async waitForFonts(): Promise<void> {
    if (!('fonts' in document)) return;
    try {
      await (document as any).fonts.ready;
    } catch {
      // ignore
    }
  }
}
