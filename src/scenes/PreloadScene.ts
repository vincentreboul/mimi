import * as Phaser from 'phaser';
import { COLORS, FONTS, GAME_WIDTH, GAME_HEIGHT } from '../config';
import { SPRITES, PLANTS, ASSETS_BASE } from '../data/assets';
import { hasPlayer } from '../systems/save';

export class PreloadScene extends Phaser.Scene {
  private progressBar?: Phaser.GameObjects.Rectangle;
  private progressText?: Phaser.GameObjects.Text;

  constructor() {
    super('PreloadScene');
  }

  preload(): void {
    this.drawProgressUI();

    this.load.on('progress', (v: number) => {
      if (this.progressBar) this.progressBar.scaleX = v;
      if (this.progressText) this.progressText.setText(`${Math.round(v * 100)} %`);
    });

    // Load all sci-fi sprites (encode spaces in filenames)
    for (const [key, file] of Object.entries(SPRITES)) {
      this.load.image(key, ASSETS_BASE + encodeURIComponent(file));
    }

    // Load all plants
    for (const [key, file] of Object.entries(PLANTS)) {
      // PLANTS paths include "plants/" prefix — encode each segment separately
      const parts = file.split('/').map((p) => encodeURIComponent(p));
      this.load.image(key, ASSETS_BASE + parts.join('/'));
    }
  }

  private drawProgressUI(): void {
    const { width, height } = this.scale.gameSize;
    this.add.rectangle(0, 0, width, height, 0x1f4d3e).setOrigin(0);

    this.add.text(width / 2, height / 2 - 80, 'KORA', {
      fontFamily: FONTS.display,
      fontSize: '120px',
      color: COLORS.hex.cream,
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Progress bar frame
    const barW = 600;
    const barH = 40;
    const barY = height / 2 + 60;
    this.add.rectangle(width / 2, barY, barW + 8, barH + 8, COLORS.brass, 1).setStrokeStyle(2, COLORS.brass, 1);
    this.add.rectangle(width / 2, barY, barW, barH, COLORS.charDeep, 1);
    this.progressBar = this.add.rectangle(width / 2 - barW / 2, barY, barW, barH, COLORS.brass, 1).setOrigin(0, 0.5);
    this.progressBar.scaleX = 0;

    this.progressText = this.add.text(width / 2, barY + 80, '0 %', {
      fontFamily: FONTS.mono,
      fontSize: '32px',
      color: COLORS.hex.brass,
    }).setOrigin(0.5);
  }

  create(): void {
    // Pick next scene based on player setup state
    const next = hasPlayer() ? 'MenuScene' : 'PlayerSetupScene';
    this.cameras.main.fadeOut(300, 31, 77, 62);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start(next);
    });
  }
}
