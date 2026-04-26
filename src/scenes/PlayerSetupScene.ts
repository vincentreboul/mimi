import * as Phaser from 'phaser';
import { COLORS, FONTS, GAME_WIDTH, GAME_HEIGHT } from '../config';
import { t } from '../systems/narrative';
import { setPlayer, type AgeBracket, type Gender } from '../systems/save';
import { playSfx } from '../systems/audio';
import { VirtualKeyboard } from '../objects/VirtualKeyboard';

const STEPS = ['name', 'age', 'gender', 'confirm'] as const;
type Step = typeof STEPS[number];

export class PlayerSetupScene extends Phaser.Scene {
  private step: Step = 'name';
  private name = '';
  private age: AgeBracket = 'teen';
  private gender: Gender = 'nb';
  private contentLayer?: Phaser.GameObjects.Container;
  private nameDisplay?: Phaser.GameObjects.Text;

  constructor() {
    super('PlayerSetupScene');
  }

  create(): void {
    this.cameras.main.fadeIn(400, 31, 77, 62);
    this.drawBackground();
    this.renderStep();
  }

  private drawBackground(): void {
    const { width, height } = this.scale.gameSize;
    // Pixel art background using sci-fi wall sprites if loaded
    const g = this.add.graphics();
    g.fillStyle(0x0d2230, 1);
    g.fillRect(0, 0, width, height);

    // Stars
    g.fillStyle(0xf4e9d8, 0.9);
    for (let i = 0; i < 60; i++) {
      g.fillRect(Math.random() * width, Math.random() * height * 0.5, 2, 2);
    }

    // Distant Earth glow
    g.fillStyle(0xa8dadc, 0.18);
    g.fillCircle(width / 2, 350, 280);
    g.fillStyle(0x7fb069, 0.25);
    g.fillCircle(width / 2 - 40, 320, 140);

    // Title bar
    this.add.text(width / 2, 180, 'KORA', {
      fontFamily: FONTS.display,
      fontSize: '120px',
      color: COLORS.hex.cream,
      fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(10);

    this.add.text(width / 2, 280, 'L\'éveil orbital', {
      fontFamily: FONTS.mono,
      fontSize: '32px',
      color: COLORS.hex.brass,
      fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(10);
  }

  private renderStep(): void {
    if (this.contentLayer) this.contentLayer.destroy();
    this.contentLayer = this.add.container(0, 0);
    this.contentLayer.setDepth(20);

    switch (this.step) {
      case 'name': this.renderNameStep(); break;
      case 'age': this.renderAgeStep(); break;
      case 'gender': this.renderGenderStep(); break;
      case 'confirm': this.start(); break;
    }
  }

  private renderNameStep(): void {
    const { width } = this.scale.gameSize;
    this.contentLayer!.add(this.label(width / 2, 460, t('setup.name_label')));

    // Name display box (big)
    const boxY = 580;
    const boxW = 720;
    const boxH = 130;
    const bg = this.add.rectangle(width / 2, boxY, boxW, boxH, COLORS.charDeep, 0.98);
    bg.setStrokeStyle(4, COLORS.brass, 1);
    this.contentLayer!.add(bg);

    this.nameDisplay = this.add.text(width / 2, boxY, '_', {
      fontFamily: FONTS.display,
      fontSize: '64px',
      color: COLORS.hex.cream,
      fontStyle: 'bold',
    }).setOrigin(0.5);
    this.contentLayer!.add(this.nameDisplay);

    // Virtual keyboard (centered)
    const keyboardY = 800;
    const kb = new VirtualKeyboard(this, {
      x: width / 2,
      y: keyboardY,
      maxLength: 12,
      onChange: (v) => {
        this.name = v;
        this.nameDisplay!.setText(v.length > 0 ? v : '_');
      },
      onSubmit: (v) => {
        if (v.length >= 1) {
          playSfx('success');
          this.step = 'age';
          this.renderStep();
        }
      },
    });
    this.contentLayer!.add(kb);
  }

  private renderAgeStep(): void {
    const { width } = this.scale.gameSize;
    this.contentLayer!.add(this.label(width / 2, 460, `Bonjour, ${this.name}.`));
    this.contentLayer!.add(this.label(width / 2, 540, t('setup.age_label'), true));

    const ages: Array<[AgeBracket, string]> = [
      ['kid', t('setup.age_kid')],
      ['teen', t('setup.age_teen')],
      ['young', t('setup.age_young')],
      ['adult', t('setup.age_adult')],
      ['senior', t('setup.age_senior')],
    ];

    let y = 700;
    ages.forEach(([key, label], i) => {
      const btn = this.bigBtn(width / 2, y + i * 140, 700, 120, label, () => {
        this.age = key;
        playSfx('success');
        this.step = 'gender';
        this.renderStep();
      });
      this.contentLayer!.add(btn);
    });
  }

  private renderGenderStep(): void {
    const { width } = this.scale.gameSize;
    this.contentLayer!.add(this.label(width / 2, 500, 'Tu es...', true));

    const genders: Array<[Gender, string]> = [
      ['f', 'Une fille'],
      ['m', 'Un garçon'],
      ['nb', 'Autre / non-binaire'],
    ];

    let y = 660;
    genders.forEach(([key, label], i) => {
      const btn = this.bigBtn(width / 2, y + i * 160, 700, 130, label, () => {
        this.gender = key;
        playSfx('success');
        this.step = 'confirm';
        this.renderStep();
      });
      this.contentLayer!.add(btn);
    });

    // Back button
    const back = this.bigBtn(width / 2, y + 3 * 160 + 60, 320, 100, '← Retour', () => {
      this.step = 'age';
      this.renderStep();
    }, 'secondary');
    this.contentLayer!.add(back);
  }

  private start(): void {
    setPlayer(this.name, this.age, this.gender);
    this.cameras.main.fadeOut(500, 31, 77, 62);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('MenuScene');
    });
  }

  private label(x: number, y: number, text: string, small = false): Phaser.GameObjects.Text {
    return this.add.text(x, y, text, {
      fontFamily: FONTS.body,
      fontSize: small ? '40px' : '48px',
      color: small ? COLORS.hex.brass : COLORS.hex.cream,
      fontStyle: small ? 'normal' : 'bold',
      align: 'center',
    }).setOrigin(0.5);
  }

  private bigBtn(x: number, y: number, w: number, h: number, label: string, onTap: () => void, kind: 'primary' | 'secondary' = 'primary'): Phaser.GameObjects.Container {
    const c = this.add.container(x, y);
    const fill = kind === 'primary' ? COLORS.brassDark : COLORS.charDeep;
    const bg = this.add.rectangle(0, 0, w, h, fill, 0.95);
    bg.setStrokeStyle(4, COLORS.brass, 1);
    const txt = this.add.text(0, 0, label, {
      fontFamily: FONTS.body,
      fontSize: '40px',
      color: COLORS.hex.cream,
      fontStyle: 'bold',
      align: 'center',
      wordWrap: { width: w - 40 },
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
