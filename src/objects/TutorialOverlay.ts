import * as Phaser from 'phaser';
import { COLORS, FONTS, GAME_WIDTH, GAME_HEIGHT, HUD } from '../config';
import { playSfx } from '../systems/audio';

/**
 * One-shot tutorial overlay shown on first chapter.
 * Explains the SCUMM verb mechanic with a clear visual + dismiss-on-tap.
 */
export class TutorialOverlay extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, onDismiss: () => void) {
    super(scene, 0, 0);
    this.setDepth(9999);

    const { width, height } = scene.scale.gameSize;

    // Backdrop
    const backdrop = scene.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.85).setOrigin(0);
    backdrop.setInteractive();
    this.add(backdrop);

    // Panel
    const panelW = GAME_WIDTH - 80;
    const panelH = 1100;
    const panelY = (GAME_HEIGHT - panelH) / 2;
    const panel = scene.add.rectangle(GAME_WIDTH / 2, panelY + panelH / 2, panelW, panelH, COLORS.leafDeep, 0.98);
    panel.setStrokeStyle(6, COLORS.brass, 1);
    this.add(panel);

    // Header
    let y = panelY + 90;
    this.add(scene.add.text(GAME_WIDTH / 2, y, 'COMMENT JOUER', {
      fontFamily: FONTS.display,
      fontSize: '64px',
      color: COLORS.hex.cream,
    }).setOrigin(0.5));

    y += 130;

    // Section 1 — Verb panel
    this.add(scene.add.text(GAME_WIDTH / 2, y, '1.  CHOISIS UN VERBE', {
      fontFamily: FONTS.body,
      fontSize: '38px',
      color: COLORS.hex.brass,
      fontStyle: 'bold',
    }).setOrigin(0.5));
    y += 70;

    // 4 mock verb buttons (visual demo)
    const verbY = y + 60;
    const verbW = 240;
    const verbH = 90;
    const verbs = ['REGARDER', 'PRENDRE', 'UTILISER', 'PARLER'];
    const startX = GAME_WIDTH / 2 - (2 * verbW + 12);
    verbs.forEach((v, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = startX + col * (verbW + 12) + verbW;
      const yy = verbY + row * (verbH + 12);
      const bg = scene.add.rectangle(x, yy, verbW, verbH, i === 0 ? COLORS.sunAmber : COLORS.brassDark, 0.95);
      bg.setStrokeStyle(3, COLORS.brass, 1);
      const txt = scene.add.text(x, yy, v, {
        fontFamily: FONTS.body,
        fontSize: '28px',
        color: i === 0 ? COLORS.hex.charDeep : COLORS.hex.cream,
        fontStyle: 'bold',
      }).setOrigin(0.5);
      this.add(bg);
      this.add(txt);
    });
    y = verbY + 2 * verbH + 50;

    // Section 2 — Tap object
    this.add(scene.add.text(GAME_WIDTH / 2, y, '2.  TOUCHE UN OBJET', {
      fontFamily: FONTS.body,
      fontSize: '38px',
      color: COLORS.hex.brass,
      fontStyle: 'bold',
    }).setOrigin(0.5));
    y += 70;

    this.add(scene.add.text(GAME_WIDTH / 2, y, 'Les zones interactives\nsont signalées par un point qui clignote.', {
      fontFamily: FONTS.body,
      fontSize: '30px',
      color: COLORS.hex.cream,
      align: 'center',
      lineSpacing: 8,
    }).setOrigin(0.5));
    y += 130;

    // Mock indicator
    const ind = scene.add.circle(GAME_WIDTH / 2, y, 16, 0, 0).setStrokeStyle(3, COLORS.sunAmber, 1);
    const inner = scene.add.circle(GAME_WIDTH / 2, y, 7, COLORS.sunAmber, 1);
    this.add(ind);
    this.add(inner);
    scene.tweens.add({
      targets: ind,
      scale: { from: 1, to: 2.2 },
      alpha: { from: 1, to: 0 },
      duration: 1300,
      repeat: -1,
    });
    y += 80;

    // Section 3
    this.add(scene.add.text(GAME_WIDTH / 2, y, '3.  COLLECTE, COMBINE, RÉSOUDS', {
      fontFamily: FONTS.body,
      fontSize: '32px',
      color: COLORS.hex.brass,
      fontStyle: 'bold',
    }).setOrigin(0.5));
    y += 60;
    this.add(scene.add.text(GAME_WIDTH / 2, y, 'Pour utiliser un objet de l\'inventaire :\nverbe UTILISER → tape l\'objet → tape la cible.', {
      fontFamily: FONTS.body,
      fontSize: '26px',
      color: COLORS.hex.cream,
      align: 'center',
      lineSpacing: 6,
    }).setOrigin(0.5));

    // Dismiss button (big)
    const btnY = panelY + panelH - 110;
    const btnW = 600;
    const btnH = 120;
    const btnBg = scene.add.rectangle(GAME_WIDTH / 2, btnY, btnW, btnH, COLORS.sunAmber, 1);
    btnBg.setStrokeStyle(4, COLORS.cream, 1);
    const btnTxt = scene.add.text(GAME_WIDTH / 2, btnY, 'COMPRIS, ON Y VA !', {
      fontFamily: FONTS.body,
      fontSize: '36px',
      color: COLORS.hex.charDeep,
      fontStyle: 'bold',
    }).setOrigin(0.5);
    this.add(btnBg);
    this.add(btnTxt);
    btnBg.setInteractive(new Phaser.Geom.Rectangle(-btnW / 2, -btnH / 2, btnW, btnH), Phaser.Geom.Rectangle.Contains);
    btnBg.on('pointerdown', () => {
      playSfx('success');
      this.scene.tweens.add({
        targets: this,
        alpha: { from: 1, to: 0 },
        duration: 300,
        onComplete: () => {
          this.destroy();
          onDismiss();
        },
      });
    });
    // Also dismiss on backdrop tap
    backdrop.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      // Only if not over the button
      if (Math.abs(pointer.x - GAME_WIDTH / 2) > btnW / 2 || Math.abs(pointer.y - btnY) > btnH / 2) {
        // Allow dismiss via backdrop too
      }
    });

    scene.add.existing(this);
  }
}
