import * as Phaser from 'phaser';
import { COLORS, FONTS, GAME_WIDTH, GAME_HEIGHT, HUD, STAGE_BOTTOM_Y } from '../config';
import { t } from '../systems/narrative';
import { getState, getPlayer, resetSave, setSetting, getSettings } from '../systems/save';
import { PixelScene } from '../objects/PixelScene';
import { playSfx } from '../systems/audio';

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

    this.composeBackground();

    // Title — Press Start 2P at moderate size (it's a tall pixel font)
    this.add.text(width / 2, 280, 'KORA', {
      fontFamily: FONTS.display,
      fontSize: '128px',
      color: COLORS.hex.cream,
    }).setOrigin(0.5).setDepth(20);

    // Subtitle in mono
    this.add.text(width / 2, 420, 'L\'ÉVEIL ORBITAL', {
      fontFamily: FONTS.mono,
      fontSize: '52px',
      color: COLORS.hex.brass,
    }).setOrigin(0.5).setDepth(20);

    // Story teaser
    this.add.text(width / 2, 600, t('menu.story_short'), {
      fontFamily: FONTS.mono,
      fontSize: '38px',
      color: COLORS.hex.cream,
      align: 'center',
      lineSpacing: 8,
    }).setOrigin(0.5).setDepth(20);

    // Buttons
    const state = getState();
    const player = getPlayer();
    const hasProgress = state.scene !== 'MenuScene' && state.chapter >= 1;

    let y = 1100;
    if (hasProgress) {
      this.bigButton(width / 2, y, t('ui.continue'), () => {
        const nextScene = CHAPTER_SCENE_MAP[state.chapter] ?? 'Ch1Cryo';
        this.fadeTo(nextScene);
      });
      y += 170;
    }

    this.bigButton(width / 2, y, hasProgress ? 'NOUVELLE PARTIE' : 'COMMENCER', () => {
      if (hasProgress) {
        this.showConfirm(t('settings.reset_confirm'), () => {
          resetSave();
          this.fadeTo('PlayerSetupScene');
        });
      } else {
        this.fadeTo('ChapterIntroScene', { chapter: 1 });
      }
    });

    y += 170;
    this.bigButton(width / 2, y, t('ui.settings').toUpperCase(), () => this.openSettings());

    // Player badge bottom
    if (player.name) {
      this.add.text(width / 2, height - 280, `JOUEUR · ${player.name.toUpperCase()}`, {
        fontFamily: FONTS.mono,
        fontSize: '32px',
        color: COLORS.hex.skyPale,
      }).setOrigin(0.5).setDepth(20);
    }

    // Footer credits
    this.add.text(width / 2, height - 80, 'KORA · UN ESCAPE GAME SPATIAL', {
      fontFamily: FONTS.mono,
      fontSize: '24px',
      color: COLORS.hex.brass,
    }).setOrigin(0.5).setDepth(20);
  }

  /** Compose a pixel art backdrop reusing the cryo aesthetic (subdued) */
  private composeBackground(): void {
    const { width, height } = this.scale.gameSize;
    const g = this.add.graphics();
    g.setDepth(-1000);
    // Deep space gradient
    g.fillGradientStyle(0x0a1218, 0x0a1218, 0x1a3a40, 0x1a3a40, 1, 1, 1, 1);
    g.fillRect(0, 0, width, height);

    // Stars
    g.fillStyle(0xf4e9d8, 0.85);
    for (let i = 0; i < 80; i++) {
      g.fillRect(Math.random() * width, Math.random() * height * 0.6, 2, 2);
    }
    // Brighter stars
    g.fillStyle(0xa8dadc, 1);
    for (let i = 0; i < 25; i++) {
      g.fillRect(Math.random() * width, Math.random() * height * 0.6, 3, 3);
    }

    // Distant Earth halo near top
    g.fillStyle(0x7fb069, 0.18);
    g.fillCircle(width / 2 - 200, 200, 180);
    g.fillStyle(0xa8dadc, 0.12);
    g.fillCircle(width / 2 - 200, 200, 240);

    // Bottom: pixel art floor + walls (sci-fi panel rendered as silhouette)
    if (this.textures.exists('floor1') && this.textures.exists('wall1')) {
      // Wall row
      PixelScene.tileH(this, 'wall1', height - 600, 4, 0, GAME_WIDTH, { origin: { x: 0, y: 1 } });
      // Floor tiles
      PixelScene.tileH(this, 'floor1', height - 30, 5);
      // A single cryo pod silhouette in the back as scenery
      if (this.textures.exists('cryoPodOff')) {
        PixelScene.place(this, 'cryoPodOff', width / 2, height - 80, 5, { tint: 0x445566, depth: -100 });
      }
      if (this.textures.exists('lamp1')) {
        PixelScene.place(this, 'lamp1', width / 2, height - 700, 4, { origin: { x: 0.5, y: 0 }, depth: -100 });
      }
    } else {
      // Fallback: solid horizon strip
      g.fillStyle(0x1f4d3e, 1);
      g.fillRect(0, height - 200, width, 200);
    }

    // Soft amber glow center
    g.fillStyle(COLORS.brass, 0.06);
    g.fillCircle(width / 2, 350, 500);
  }

  private bigButton(x: number, y: number, label: string, onTap: () => void): Phaser.GameObjects.Rectangle {
    const w = 720;
    const h = 140;
    // Rectangle is the interactive (CTO pattern, no Container offset bug)
    const bg = this.add.rectangle(x, y, w, h, COLORS.brassDark, 0.95);
    bg.setStrokeStyle(4, COLORS.brass, 1);
    bg.setDepth(30);
    bg.setInteractive({ useHandCursor: true });
    // Inner pixel-art highlight
    this.add.rectangle(x, y - h / 2 + 6, w - 12, 4, COLORS.brass, 0.7).setDepth(31);
    this.add.text(x, y, label, {
      fontFamily: FONTS.body,
      fontSize: '44px',
      color: COLORS.hex.cream,
    }).setOrigin(0.5).setDepth(32);
    bg.on('pointerdown', () => {
      playSfx('tap');
      bg.setFillStyle(COLORS.sunAmber, 1);
      this.time.delayedCall(80, () => bg.setFillStyle(COLORS.brassDark, 0.95));
      this.time.delayedCall(120, onTap);
    });
    return bg;
  }

  private openSettings(): void {
    const settings = getSettings();
    const { width, height } = this.scale.gameSize;
    const overlay = this.add.container(0, 0);
    overlay.setDepth(5000);

    const bg = this.add.rectangle(0, 0, width, height, COLORS.charDeep, 0.94).setOrigin(0);
    overlay.add(bg);

    overlay.add(this.add.text(width / 2, 200, 'RÉGLAGES', {
      fontFamily: FONTS.display,
      fontSize: '64px',
      color: COLORS.hex.cream,
    }).setOrigin(0.5));

    let y = 380;
    overlay.add(this.add.text(width / 2, y, 'NIVEAU D\'AIDE', {
      fontFamily: FONTS.mono,
      fontSize: '36px',
      color: COLORS.hex.brass,
    }).setOrigin(0.5));
    y += 90;

    const hintLevels: Array<['minus' | 'normal' | 'plus', string]> = [
      ['minus', 'MOINS'],
      ['normal', 'NORMAL'],
      ['plus', 'PLUS'],
    ];
    const hintBtns: Phaser.GameObjects.Rectangle[] = [];
    hintLevels.forEach(([lvl, label], i) => {
      const x = width / 2 + (i - 1) * 280;
      const btn = this.smallButton(x, y, 250, 100, label, () => {
        setSetting('hintLevel', lvl);
        this.refreshToggles(hintBtns, hintLevels.map(([l]) => l), lvl);
      });
      hintBtns.push(btn);
    });
    this.refreshToggles(hintBtns, hintLevels.map(([l]) => l), settings.hintLevel);

    y += 200;
    overlay.add(this.add.text(width / 2, y, 'POLICE', {
      fontFamily: FONTS.mono,
      fontSize: '36px',
      color: COLORS.hex.brass,
    }).setOrigin(0.5));
    y += 90;

    const fonts: Array<['inter' | 'atkinson', string]> = [['inter', 'PIXEL'], ['atkinson', 'ATKINSON']];
    const fontBtns: Phaser.GameObjects.Rectangle[] = [];
    fonts.forEach(([f, label], i) => {
      const x = width / 2 + (i - 0.5) * 380;
      const btn = this.smallButton(x, y, 350, 100, label, () => {
        setSetting('font', f);
        this.refreshToggles(fontBtns, fonts.map(([k]) => k), f);
      });
      fontBtns.push(btn);
    });
    this.refreshToggles(fontBtns, fonts.map(([k]) => k), settings.font);

    y += 200;
    // Motion toggle (no label-swap to avoid getAt complexity — just shows current state on hover)
    this.smallButton(width / 2, y, 600, 110, settings.reducedMotion ? 'ANIMATIONS RÉDUITES ✓' : 'ANIMATIONS RÉDUITES', () => {
      const cur = getSettings().reducedMotion;
      setSetting('reducedMotion', !cur);
      // Re-open settings to refresh
      overlay.destroy();
      this.openSettings();
    });

    y += 180;
    const resetBtn = this.smallButton(width / 2, y, 600, 110, 'RECOMMENCER', () => {
      this.showConfirm(t('settings.reset_confirm'), () => {
        resetSave();
        overlay.destroy();
        this.fadeTo('PlayerSetupScene');
      });
    });
    resetBtn.setFillStyle(COLORS.warning, 0.85);

    this.bigButton(width / 2, height - 200, 'RETOUR', () => overlay.destroy());
  }

  private refreshToggles<T>(buttons: Phaser.GameObjects.Rectangle[], values: T[], selected: T): void {
    buttons.forEach((bg, i) => {
      if (values[i] === selected) {
        bg.setFillStyle(COLORS.sunAmber, 1);
        bg.setStrokeStyle(4, COLORS.cream, 1);
      } else {
        bg.setFillStyle(COLORS.brassDark, 0.95);
        bg.setStrokeStyle(3, COLORS.brass, 1);
      }
    });
  }

  private smallButton(x: number, y: number, w: number, h: number, label: string, onTap: () => void): Phaser.GameObjects.Rectangle {
    const bg = this.add.rectangle(x, y, w, h, COLORS.brassDark, 0.95);
    bg.setStrokeStyle(3, COLORS.brass, 1);
    bg.setInteractive({ useHandCursor: true });
    this.add.rectangle(x, y - h / 2 + 4, w - 8, 3, COLORS.brass, 0.7);
    this.add.text(x, y, label, {
      fontFamily: FONTS.body,
      fontSize: '32px',
      color: COLORS.hex.cream,
      align: 'center',
      wordWrap: { width: w - 24 },
    }).setOrigin(0.5);
    bg.on('pointerdown', () => {
      playSfx('tap');
      bg.setFillStyle(COLORS.sunAmber, 1);
      this.time.delayedCall(70, () => bg.setFillStyle(COLORS.brassDark, 0.95));
      this.time.delayedCall(110, onTap);
    });
    return bg;
  }

  private showConfirm(message: string, onYes: () => void): void {
    const { width, height } = this.scale.gameSize;
    const c = this.add.container(0, 0);
    c.setDepth(9000);
    const bg = this.add.rectangle(0, 0, width, height, COLORS.charDeep, 0.95).setOrigin(0);
    bg.setInteractive();
    c.add(bg);
    const box = this.add.rectangle(width / 2, height / 2, 900, 460, COLORS.leafDeep, 1);
    box.setStrokeStyle(4, COLORS.brass);
    c.add(box);
    const txt = this.add.text(width / 2, height / 2 - 90, message, {
      fontFamily: FONTS.body,
      fontSize: '36px',
      color: COLORS.hex.cream,
      align: 'center',
      wordWrap: { width: 800 },
    }).setOrigin(0.5);
    c.add(txt);
    const yes = this.smallButton(width / 2 - 180, height / 2 + 100, 320, 110, 'OUI', () => { c.destroy(); onYes(); });
    const no = this.smallButton(width / 2 + 180, height / 2 + 100, 320, 110, 'NON', () => c.destroy());
    c.add([yes, no]);
  }

  private fadeTo(scene: string, data?: object): void {
    this.cameras.main.fadeOut(400, 31, 77, 62);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start(scene, data);
    });
  }
}
