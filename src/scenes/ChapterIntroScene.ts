import * as Phaser from 'phaser';
import { COLORS, FONTS, GAME_WIDTH, GAME_HEIGHT } from '../config';
import { t } from '../systems/narrative';
import { setScene, type ChapterId } from '../systems/save';

const CHAPTER_DESTINATIONS: Record<ChapterId, string> = {
  1: 'Ch1Cryo',
  2: 'Ch2Serre',
  3: 'Ch3Atelier',
  4: 'Ch4Coupole',
  5: 'Ch5Archive', // Secret epilogue — narrative scene leading to ARCHIVE ending
};

export class ChapterIntroScene extends Phaser.Scene {
  private chapter: ChapterId = 1;

  constructor() {
    super('ChapterIntroScene');
  }

  init(data: { chapter?: ChapterId }): void {
    this.chapter = (data?.chapter as ChapterId) ?? 1;
  }

  create(): void {
    this.cameras.main.fadeIn(600, 31, 77, 62);
    const { width, height } = this.scale.gameSize;

    // Background
    const g = this.add.graphics();
    g.fillStyle(COLORS.charDeep, 1);
    g.fillRect(0, 0, width, height);
    g.fillStyle(COLORS.leafDeep, 0.4);
    g.fillCircle(width / 2, height / 2, 700);

    // Chapter label
    this.add.text(width / 2, 360, t('ui.chapter', { n: this.chapter }), {
      fontFamily: FONTS.mono,
      fontSize: '40px',
      color: COLORS.hex.brass,
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Title
    const title = this.add.text(width / 2, 480, t(`ch${this.chapter}.intro.title`), {
      fontFamily: FONTS.display,
      fontSize: '90px',
      color: COLORS.hex.cream,
      fontStyle: 'bold',
      align: 'center',
      wordWrap: { width: width - 120 },
    }).setOrigin(0.5);
    title.setAlpha(0);

    // Body
    const body = this.add.text(width / 2, height / 2 + 100, t(`ch${this.chapter}.intro.body`), {
      fontFamily: FONTS.body,
      fontSize: '36px',
      color: COLORS.hex.cream,
      align: 'center',
      wordWrap: { width: width - 200 },
      lineSpacing: 14,
    }).setOrigin(0.5);
    body.setAlpha(0);

    // Continue prompt
    const cont = this.add.text(width / 2, height - 200, t('ui.continue') + ' ▶', {
      fontFamily: FONTS.body,
      fontSize: '32px',
      color: COLORS.hex.skyPale,
    }).setOrigin(0.5);
    cont.setAlpha(0);

    // Sequence
    this.tweens.add({ targets: title, alpha: 1, duration: 800, delay: 600 });
    this.tweens.add({ targets: body, alpha: 1, duration: 1200, delay: 1400 });
    this.tweens.add({
      targets: cont,
      alpha: { from: 0.3, to: 1 },
      duration: 1000,
      delay: 2800,
      yoyo: true,
      repeat: -1,
    });

    // Tap to proceed — IMMEDIATELY interactive (no 2s deadzone)
    const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0).setOrigin(0);
    overlay.setInteractive({ useHandCursor: true });
    overlay.on('pointerdown', () => this.proceed());
  }

  private proceed(): void {
    const dest = CHAPTER_DESTINATIONS[this.chapter];
    setScene(dest, this.chapter);
    this.cameras.main.fadeOut(500, 31, 77, 62);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start(dest);
    });
  }
}
