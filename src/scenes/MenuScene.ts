import * as Phaser from 'phaser';
import { COLORS, FONTS, GAME_WIDTH, GAME_HEIGHT } from '../config';
import { t } from '../systems/narrative';
import { getState, resetSave, setSetting, getSettings } from '../systems/save';

const CHAPTER_SCENE_MAP: Record<number, string> = {
  1: 'Ch1Cryo',
  2: 'Ch2Serre',
  3: 'Ch3Atelier',
  4: 'Ch4Coupole',
};

export class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create(): void {
    this.cameras.main.fadeIn(400, 31, 77, 62);

    const { width, height } = this.scale.gameSize;
    this.drawBackground();

    // Title
    this.add.text(width / 2, 360, 'Mimi', {
      fontFamily: FONTS.display,
      fontSize: '180px',
      color: COLORS.hex.cream,
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(width / 2, 510, 'Le Jardin Suspendu', {
      fontFamily: FONTS.display,
      fontSize: '52px',
      color: COLORS.hex.brass,
      fontStyle: 'italic',
    }).setOrigin(0.5);

    // Subtitle / story teaser
    this.add.text(width / 2, 680, t('menu.story_short'), {
      fontFamily: FONTS.body,
      fontSize: '32px',
      color: COLORS.hex.cream,
      align: 'center',
      lineSpacing: 12,
    }).setOrigin(0.5);

    // Buttons
    const state = getState();
    const hasProgress = state.scene !== 'MenuScene' && state.chapter >= 1;

    let y = 1100;
    if (hasProgress) {
      this.makeButton(width / 2, y, t('ui.continue'), () => {
        const nextScene = CHAPTER_SCENE_MAP[state.chapter] ?? 'Ch1Cryo';
        this.fadeTo(nextScene);
      });
      y += 130;
    }

    this.makeButton(width / 2, y, t('ui.new_game'), () => {
      if (hasProgress) {
        // Confirm reset
        this.showConfirm(t('settings.reset_confirm'), () => {
          resetSave();
          this.fadeTo('ChapterIntroScene', { chapter: 1 });
        });
      } else {
        this.fadeTo('ChapterIntroScene', { chapter: 1 });
      }
    });

    y += 130;
    this.makeButton(width / 2, y, t('ui.settings'), () => {
      this.openSettings();
    });

    // Footer
    this.add.text(width / 2, height - 80, t('menu.credits'), {
      fontFamily: FONTS.display,
      fontSize: '24px',
      color: COLORS.hex.brass,
      fontStyle: 'italic',
    }).setOrigin(0.5);
  }

  private drawBackground(): void {
    const { width, height } = this.scale.gameSize;
    const g = this.add.graphics();
    g.fillGradientStyle(COLORS.leafDeep, COLORS.leafDeep, COLORS.charDeep, COLORS.charDeep, 1, 1, 0.95, 0.95);
    g.fillRect(0, 0, width, height);

    // Decorative leaves
    g.fillStyle(COLORS.leafLight, 0.1);
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const r = 80 + Math.random() * 180;
      g.fillCircle(x, y, r);
    }

    // Soft golden glow center
    g.fillStyle(COLORS.brass, 0.06);
    g.fillCircle(width / 2, height / 2, 600);
  }

  private makeButton(x: number, y: number, label: string, onTap: () => void): Phaser.GameObjects.Container {
    const c = this.add.container(x, y);
    const bg = this.add.rectangle(0, 0, 600, 110, COLORS.brassDark, 0.95);
    bg.setStrokeStyle(3, COLORS.brass, 1);
    const txt = this.add.text(0, 0, label, {
      fontFamily: FONTS.body,
      fontSize: '40px',
      color: COLORS.hex.cream,
      fontStyle: '600',
    }).setOrigin(0.5);
    c.add([bg, txt]);
    c.setSize(600, 110);
    c.setInteractive(new Phaser.Geom.Rectangle(-300, -55, 600, 110), Phaser.Geom.Rectangle.Contains);
    c.on('pointerdown', () => {
      this.tweens.add({
        targets: c,
        scale: { from: 1, to: 0.96 },
        duration: 80,
        yoyo: true,
        onComplete: onTap,
      });
    });
    return c;
  }

  private openSettings(): void {
    const settings = getSettings();
    const { width, height } = this.scale.gameSize;
    const overlay = this.add.container(0, 0);
    overlay.setDepth(5000);

    const bg = this.add.rectangle(0, 0, width, height, COLORS.charDeep, 0.92).setOrigin(0);
    overlay.add(bg);

    const title = this.add.text(width / 2, 200, t('settings.title'), {
      fontFamily: FONTS.display,
      fontSize: '80px',
      color: COLORS.hex.cream,
      fontStyle: 'bold',
    }).setOrigin(0.5);
    overlay.add(title);

    let y = 380;
    // Hint level toggle
    const hintLabel = this.add.text(width / 2, y, t('settings.hint_level'), {
      fontFamily: FONTS.body,
      fontSize: '32px',
      color: COLORS.hex.brass,
    }).setOrigin(0.5);
    overlay.add(hintLabel);
    y += 70;

    const hintLevels: Array<'minus' | 'normal' | 'plus'> = ['minus', 'normal', 'plus'];
    const hintLabels = [t('settings.hint_minus'), t('settings.hint_normal'), t('settings.hint_plus')];
    const hintBtns: Phaser.GameObjects.Container[] = [];
    hintLevels.forEach((lvl, i) => {
      const x = width / 2 + (i - 1) * 240;
      const btn = this.makeSmallButton(x, y, hintLabels[i], () => {
        setSetting('hintLevel', lvl);
        this.refreshButtons(hintBtns, hintLevels, lvl);
      });
      hintBtns.push(btn);
      overlay.add(btn);
    });
    this.refreshButtons(hintBtns, hintLevels, settings.hintLevel);
    y += 140;

    // Font toggle
    const fontLabel = this.add.text(width / 2, y, t('settings.font'), {
      fontFamily: FONTS.body,
      fontSize: '32px',
      color: COLORS.hex.brass,
    }).setOrigin(0.5);
    overlay.add(fontLabel);
    y += 70;

    const fonts: Array<'inter' | 'atkinson'> = ['inter', 'atkinson'];
    const fontLabels = [t('settings.font_inter'), t('settings.font_atkinson')];
    const fontBtns: Phaser.GameObjects.Container[] = [];
    fonts.forEach((f, i) => {
      const x = width / 2 + (i - 0.5) * 360;
      const btn = this.makeSmallButton(x, y, fontLabels[i], () => {
        setSetting('font', f);
        this.refreshButtons(fontBtns, fonts, f);
      });
      fontBtns.push(btn);
      overlay.add(btn);
    });
    this.refreshButtons(fontBtns, fonts, settings.font);
    y += 140;

    // Reduced motion toggle
    const motionBtn = this.makeSmallButton(width / 2, y, t('settings.motion') + (settings.reducedMotion ? ' ✓' : ''), () => {
      const cur = getSettings().reducedMotion;
      setSetting('reducedMotion', !cur);
      const t2 = motionBtn.getAt(1) as Phaser.GameObjects.Text;
      t2.setText(t('settings.motion') + (!cur ? ' ✓' : ''));
    });
    overlay.add(motionBtn);
    y += 140;

    // Reset
    const resetBtn = this.makeSmallButton(width / 2, y, t('settings.reset'), () => {
      this.showConfirm(t('settings.reset_confirm'), () => {
        resetSave();
        overlay.destroy();
        this.scene.restart();
      });
    });
    (resetBtn.getAt(0) as Phaser.GameObjects.Rectangle).setFillStyle(COLORS.warning, 0.8);
    overlay.add(resetBtn);

    // Close button (bottom)
    const closeBtn = this.makeButton(width / 2, height - 200, t('ui.back'), () => overlay.destroy());
    overlay.add(closeBtn);
  }

  private refreshButtons<T>(buttons: Phaser.GameObjects.Container[], values: T[], selected: T): void {
    buttons.forEach((btn, i) => {
      const bg = btn.getAt(0) as Phaser.GameObjects.Rectangle;
      if (values[i] === selected) {
        bg.setFillStyle(COLORS.sunAmber, 0.9);
        bg.setStrokeStyle(3, COLORS.cream, 1);
      } else {
        bg.setFillStyle(COLORS.brassDark, 0.85);
        bg.setStrokeStyle(2, COLORS.brass, 0.8);
      }
    });
  }

  private makeSmallButton(x: number, y: number, label: string, onTap: () => void): Phaser.GameObjects.Container {
    const c = this.add.container(x, y);
    const bg = this.add.rectangle(0, 0, 220, 80, COLORS.brassDark, 0.85);
    bg.setStrokeStyle(2, COLORS.brass, 0.8);
    const txt = this.add.text(0, 0, label, {
      fontFamily: FONTS.body,
      fontSize: '24px',
      color: COLORS.hex.cream,
      align: 'center',
      wordWrap: { width: 200 },
    }).setOrigin(0.5);
    c.add([bg, txt]);
    c.setSize(220, 80);
    c.setInteractive(new Phaser.Geom.Rectangle(-110, -40, 220, 80), Phaser.Geom.Rectangle.Contains);
    c.on('pointerdown', onTap);
    return c;
  }

  private showConfirm(message: string, onYes: () => void): void {
    const { width, height } = this.scale.gameSize;
    const c = this.add.container(0, 0);
    c.setDepth(9000);
    const bg = this.add.rectangle(0, 0, width, height, COLORS.charDeep, 0.95).setOrigin(0);
    bg.setInteractive();
    c.add(bg);
    const box = this.add.rectangle(width / 2, height / 2, 800, 400, COLORS.leafDeep, 1);
    box.setStrokeStyle(3, COLORS.brass);
    c.add(box);
    const txt = this.add.text(width / 2, height / 2 - 80, message, {
      fontFamily: FONTS.body,
      fontSize: '36px',
      color: COLORS.hex.cream,
      align: 'center',
      wordWrap: { width: 700 },
    }).setOrigin(0.5);
    c.add(txt);
    const yes = this.makeSmallButton(width / 2 - 130, height / 2 + 100, t('ui.confirm'), () => {
      c.destroy();
      onYes();
    });
    const no = this.makeSmallButton(width / 2 + 130, height / 2 + 100, t('ui.cancel'), () => c.destroy());
    c.add([yes, no]);
  }

  private fadeTo(scene: string, data?: object): void {
    this.cameras.main.fadeOut(400, 31, 77, 62);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start(scene, data);
    });
  }
}
