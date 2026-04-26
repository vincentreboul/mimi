import * as Phaser from 'phaser';
import { COLORS, FONTS, GAME_WIDTH, GAME_HEIGHT } from '../config';
import { t } from '../systems/narrative';
import { resetSave, type Ending } from '../systems/save';

// Legacy keys still used by Ch4Coupole's two-button "return | stay" choice.
type LegacyEnding = 'return' | 'stay';
const NEW_ENDINGS: ReadonlyArray<Ending> = ['evasion', 'rester', 'ascension', 'archive'];

export class EpilogueScene extends Phaser.Scene {
  private endingKey: LegacyEnding = 'return';
  private redirected = false;

  constructor() {
    super('EpilogueScene');
  }

  init(data: { ending?: LegacyEnding | Ending }): void {
    // If caller provided one of the new v2 endings, redirect immediately.
    if (data?.ending && (NEW_ENDINGS as readonly string[]).includes(data.ending)) {
      this.redirected = true;
      this.scene.start('EndingScene', { ending: data.ending });
      return;
    }
    this.endingKey = (data?.ending as LegacyEnding) ?? 'return';
  }

  create(): void {
    if (this.redirected) return;
    this.cameras.main.fadeIn(800, 31, 77, 62);
    const { width, height } = this.scale.gameSize;

    // Background — Earth view
    const g = this.add.graphics();
    g.fillStyle(COLORS.charDeep, 1);
    g.fillRect(0, 0, width, height);
    // "Earth" — radial circle with palette
    g.fillStyle(COLORS.skyPale, 0.4);
    g.fillCircle(width / 2, 600, 350);
    g.fillStyle(COLORS.leafLight, 0.45);
    g.fillCircle(width / 2 - 50, 540, 180);
    g.fillStyle(COLORS.cream, 0.18);
    g.fillCircle(width / 2 + 80, 660, 90);

    // Title
    const title = this.add.text(width / 2, 1100, t(`epilogue.${this.endingKey}.title`), {
      fontFamily: FONTS.display,
      fontSize: '80px',
      color: COLORS.hex.cream,
      fontStyle: 'bold',
    }).setOrigin(0.5);
    title.setAlpha(0);

    // Body
    const body = this.add.text(width / 2, 1450, t(`epilogue.${this.endingKey}.body`), {
      fontFamily: FONTS.body,
      fontSize: '32px',
      color: COLORS.hex.cream,
      align: 'center',
      wordWrap: { width: width - 200 },
      lineSpacing: 12,
    }).setOrigin(0.5);
    body.setAlpha(0);

    // Sign-off
    const thanks = this.add.text(width / 2, height - 280, t('epilogue.thanks'), {
      fontFamily: FONTS.display,
      fontSize: '28px',
      color: COLORS.hex.brass,
      align: 'center',
      fontStyle: 'italic',
      lineSpacing: 8,
    }).setOrigin(0.5);
    thanks.setAlpha(0);

    this.tweens.add({ targets: title, alpha: 1, duration: 1500, delay: 800 });
    this.tweens.add({ targets: body, alpha: 1, duration: 2000, delay: 2200 });
    this.tweens.add({ targets: thanks, alpha: 1, duration: 1500, delay: 4500 });

    // Tap to return to menu
    this.time.delayedCall(6000, () => {
      const bX = width / 2;
      const bY = height - 100;
      const bg = this.add.rectangle(bX, bY, 400, 80, COLORS.brassDark, 0.9);
      bg.setStrokeStyle(2, COLORS.brass);
      bg.setAlpha(0);
      bg.setInteractive({ useHandCursor: true });
      const t2 = this.add.text(bX, bY, 'Menu', {
        fontFamily: FONTS.body,
        fontSize: '32px',
        color: COLORS.hex.cream,
      }).setOrigin(0.5).setAlpha(0);
      this.tweens.add({ targets: [bg, t2], alpha: 1, duration: 600 });
      bg.on('pointerdown', () => {
        this.cameras.main.fadeOut(400, 31, 77, 62);
        this.cameras.main.once('camerafadeoutcomplete', () => {
          this.scene.start('MenuScene');
        });
      });
    });
  }
}
