import * as Phaser from 'phaser';
import { COLORS, FONTS, GAME_WIDTH, GAME_HEIGHT } from '../config';
import { t } from '../systems/narrative';
import { setPlayer, type AgeBracket, type Gender } from '../systems/save';
import { playSfx } from '../systems/audio';

export class PlayerSetupScene extends Phaser.Scene {
  private nameInput?: HTMLInputElement;
  private domEl?: Phaser.GameObjects.DOMElement;
  private selectedAge: AgeBracket = 'teen';
  private selectedGender: Gender = 'nb';
  private startBtn?: Phaser.GameObjects.Container;
  private ageBtns: Map<AgeBracket, Phaser.GameObjects.Container> = new Map();
  private genderBtns: Map<Gender, Phaser.GameObjects.Container> = new Map();

  constructor() {
    super('PlayerSetupScene');
  }

  create(): void {
    this.cameras.main.fadeIn(400, 31, 77, 62);
    const { width, height } = this.scale.gameSize;

    // Background
    const g = this.add.graphics();
    g.fillGradientStyle(0x1f4d3e, 0x1f4d3e, 0x0d2620, 0x0d2620, 1, 1, 1, 1);
    g.fillRect(0, 0, width, height);

    // Title
    this.add.text(width / 2, 200, t('setup.title'), {
      fontFamily: FONTS.display,
      fontSize: '72px',
      color: COLORS.hex.cream,
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // === Name input ===
    let y = 380;
    this.add.text(width / 2, y, t('setup.name_label'), {
      fontFamily: FONTS.body,
      fontSize: '36px',
      color: COLORS.hex.brass,
    }).setOrigin(0.5);

    y += 80;
    // DOM input element overlay
    this.nameInput = document.createElement('input');
    this.nameInput.type = 'text';
    this.nameInput.placeholder = t('setup.name_placeholder');
    this.nameInput.maxLength = 20;
    this.nameInput.autocapitalize = 'words';
    this.nameInput.autocomplete = 'off';
    this.nameInput.style.cssText = `
      width: 720px;
      height: 90px;
      padding: 0 24px;
      font-size: 40px;
      font-family: 'Inter', sans-serif;
      color: #f4e9d8;
      background: #1a1f1a;
      border: 3px solid #d4a373;
      border-radius: 8px;
      text-align: center;
      caret-color: #f4a261;
      outline: none;
    `;
    this.nameInput.addEventListener('input', () => this.refreshStartButton());
    this.nameInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && this.canStart()) this.start();
    });
    this.domEl = this.add.dom(width / 2, y + 45, this.nameInput);

    // === Age picker ===
    y += 200;
    this.add.text(width / 2, y, t('setup.age_label'), {
      fontFamily: FONTS.body,
      fontSize: '36px',
      color: COLORS.hex.brass,
    }).setOrigin(0.5);

    y += 80;
    const ages: Array<[AgeBracket, string]> = [
      ['kid', t('setup.age_kid')],
      ['teen', t('setup.age_teen')],
      ['young', t('setup.age_young')],
      ['adult', t('setup.age_adult')],
      ['senior', t('setup.age_senior')],
    ];
    const ageBtnW = 280;
    const ageBtnH = 90;
    const ageGap = 16;
    // 2 rows: 3 + 2
    const row1 = ages.slice(0, 3);
    const row2 = ages.slice(3);
    const row1W = row1.length * ageBtnW + (row1.length - 1) * ageGap;
    const row2W = row2.length * ageBtnW + (row2.length - 1) * ageGap;
    row1.forEach(([key, label], i) => {
      const x = (width - row1W) / 2 + i * (ageBtnW + ageGap) + ageBtnW / 2;
      const btn = this.makeBigToggle(x, y, ageBtnW, ageBtnH, label, () => {
        this.selectedAge = key;
        this.refreshAgeButtons();
      });
      this.ageBtns.set(key, btn);
    });
    row2.forEach(([key, label], i) => {
      const x = (width - row2W) / 2 + i * (ageBtnW + ageGap) + ageBtnW / 2;
      const btn = this.makeBigToggle(x, y + ageBtnH + ageGap, ageBtnW, ageBtnH, label, () => {
        this.selectedAge = key;
        this.refreshAgeButtons();
      });
      this.ageBtns.set(key, btn);
    });
    this.refreshAgeButtons();

    // === Gender picker ===
    y += 280;
    this.add.text(width / 2, y, 'Tu es...', {
      fontFamily: FONTS.body,
      fontSize: '36px',
      color: COLORS.hex.brass,
    }).setOrigin(0.5);

    y += 80;
    const genders: Array<[Gender, string]> = [
      ['f', 'une fille'],
      ['m', 'un garçon'],
      ['nb', 'autre / non-binaire'],
    ];
    const gW = 280;
    const gH = 90;
    const gGap = 16;
    const totalGW = genders.length * gW + (genders.length - 1) * gGap;
    genders.forEach(([key, label], i) => {
      const x = (width - totalGW) / 2 + i * (gW + gGap) + gW / 2;
      const btn = this.makeBigToggle(x, y, gW, gH, label, () => {
        this.selectedGender = key;
        this.refreshGenderButtons();
      });
      this.genderBtns.set(key, btn);
    });
    this.refreshGenderButtons();

    // === Privacy note ===
    y += 160;
    this.add.text(width / 2, y, t('setup.privacy'), {
      fontFamily: FONTS.body,
      fontSize: '20px',
      color: COLORS.hex.skyPale,
      fontStyle: 'italic',
      align: 'center',
      wordWrap: { width: width - 200 },
    }).setOrigin(0.5);

    // === Start button ===
    this.startBtn = this.makeBigToggle(width / 2, height - 200, 600, 120, t('setup.start'), () => {
      if (this.canStart()) this.start();
    });
    this.refreshStartButton();
  }

  private refreshAgeButtons(): void {
    this.ageBtns.forEach((btn, key) => {
      const bg = btn.getAt(0) as Phaser.GameObjects.Rectangle;
      const txt = btn.getAt(1) as Phaser.GameObjects.Text;
      if (key === this.selectedAge) {
        bg.setFillStyle(COLORS.sunAmber, 1);
        bg.setStrokeStyle(4, COLORS.cream, 1);
        txt.setColor(COLORS.hex.charDeep);
      } else {
        bg.setFillStyle(COLORS.brassDark, 0.95);
        bg.setStrokeStyle(2, COLORS.brass, 0.8);
        txt.setColor(COLORS.hex.cream);
      }
    });
  }

  private refreshGenderButtons(): void {
    this.genderBtns.forEach((btn, key) => {
      const bg = btn.getAt(0) as Phaser.GameObjects.Rectangle;
      const txt = btn.getAt(1) as Phaser.GameObjects.Text;
      if (key === this.selectedGender) {
        bg.setFillStyle(COLORS.sunAmber, 1);
        bg.setStrokeStyle(4, COLORS.cream, 1);
        txt.setColor(COLORS.hex.charDeep);
      } else {
        bg.setFillStyle(COLORS.brassDark, 0.95);
        bg.setStrokeStyle(2, COLORS.brass, 0.8);
        txt.setColor(COLORS.hex.cream);
      }
    });
  }

  private refreshStartButton(): void {
    if (!this.startBtn) return;
    const bg = this.startBtn.getAt(0) as Phaser.GameObjects.Rectangle;
    const txt = this.startBtn.getAt(1) as Phaser.GameObjects.Text;
    if (this.canStart()) {
      bg.setFillStyle(COLORS.sunAmber, 1);
      bg.setStrokeStyle(4, COLORS.cream, 1);
      txt.setColor(COLORS.hex.charDeep);
    } else {
      bg.setFillStyle(COLORS.brassDark, 0.4);
      bg.setStrokeStyle(2, COLORS.brass, 0.4);
      txt.setColor(COLORS.hex.cream);
    }
  }

  private canStart(): boolean {
    return (this.nameInput?.value?.trim().length ?? 0) >= 1;
  }

  private start(): void {
    if (!this.canStart()) return;
    playSfx('success');
    setPlayer(this.nameInput!.value.trim(), this.selectedAge, this.selectedGender);
    this.cameras.main.fadeOut(400, 31, 77, 62);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('MenuScene');
    });
  }

  private makeBigToggle(x: number, y: number, w: number, h: number, label: string, onTap: () => void): Phaser.GameObjects.Container {
    const c = this.add.container(x, y);
    const bg = this.add.rectangle(0, 0, w, h, COLORS.brassDark, 0.95);
    bg.setStrokeStyle(2, COLORS.brass, 0.8);
    const txt = this.add.text(0, 0, label, {
      fontFamily: FONTS.body,
      fontSize: '32px',
      color: COLORS.hex.cream,
      fontStyle: '600',
      align: 'center',
      wordWrap: { width: w - 16 },
    }).setOrigin(0.5);
    c.add([bg, txt]);
    c.setSize(w, h);
    c.setInteractive(new Phaser.Geom.Rectangle(-w / 2, -h / 2, w, h), Phaser.Geom.Rectangle.Contains);
    c.on('pointerdown', () => {
      playSfx('tap');
      this.tweens.add({ targets: c, scale: { from: 1, to: 0.95 }, duration: 80, yoyo: true });
      onTap();
    });
    return c;
  }
}
