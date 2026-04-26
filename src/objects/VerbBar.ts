import * as Phaser from 'phaser';
import { COLORS, FONTS, GAME_WIDTH, GAME_HEIGHT, HUD } from '../config';
import { VERBS, VERB_LABELS, getActiveVerb, setActiveVerb, onChange, type Verb } from '../systems/verbs';
import { playSfx } from '../systems/audio';

/**
 * SCUMM-style verb panel: 2x2 grid of large verb buttons.
 * Sits above the inventory bar.
 */
export class VerbBar extends Phaser.GameObjects.Container {
  private buttons: Map<Verb, { container: Phaser.GameObjects.Container; bg: Phaser.GameObjects.Rectangle; txt: Phaser.GameObjects.Text }> = new Map();
  private unsubscribe: (() => void) | null = null;

  constructor(scene: Phaser.Scene) {
    // Position: above inventory, below action label
    const panelY = GAME_HEIGHT - HUD.inventoryHeight - HUD.verbPanelHeight - 20;
    super(scene, 0, panelY);

    // Background
    const bg = scene.add.rectangle(0, 0, GAME_WIDTH, HUD.verbPanelHeight, COLORS.charDeep, 0.92).setOrigin(0);
    bg.setStrokeStyle(2, COLORS.brass, 0.6);
    this.add(bg);

    // 2x2 grid of verbs
    const gap = 12;
    const startX = (GAME_WIDTH - (2 * HUD.verbButtonWidth + gap)) / 2;
    const startY = (HUD.verbPanelHeight - (2 * HUD.verbButtonHeight + gap)) / 2;

    VERBS.forEach((verb, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = startX + col * (HUD.verbButtonWidth + gap) + HUD.verbButtonWidth / 2;
      const y = startY + row * (HUD.verbButtonHeight + gap) + HUD.verbButtonHeight / 2;
      const btn = this.makeButton(scene, x, y, verb);
      this.buttons.set(verb, btn);
      this.add(btn.container);
    });

    scene.add.existing(this);
    this.setDepth(800);

    this.refresh();
    this.unsubscribe = onChange(() => this.refresh());
  }

  private makeButton(scene: Phaser.Scene, x: number, y: number, verb: Verb) {
    const container = scene.add.container(x, y);
    const bg = scene.add.rectangle(0, 0, HUD.verbButtonWidth, HUD.verbButtonHeight, COLORS.brassDark, 0.95);
    bg.setStrokeStyle(3, COLORS.brass, 1);
    container.add(bg);

    const txt = scene.add.text(0, 0, VERB_LABELS[verb].toUpperCase(), {
      fontFamily: FONTS.body,
      fontSize: '46px',
      color: COLORS.hex.cream,
      fontStyle: 'bold',
    }).setOrigin(0.5);
    container.add(txt);

    container.setSize(HUD.verbButtonWidth, HUD.verbButtonHeight);
    container.setInteractive(
      new Phaser.Geom.Rectangle(-HUD.verbButtonWidth / 2, -HUD.verbButtonHeight / 2, HUD.verbButtonWidth, HUD.verbButtonHeight),
      Phaser.Geom.Rectangle.Contains
    );
    container.on('pointerdown', () => {
      playSfx('tap');
      scene.tweens.add({
        targets: container,
        scale: { from: 1, to: 0.95 },
        duration: 80,
        yoyo: true,
      });
      setActiveVerb(verb);
    });

    return { container, bg, txt };
  }

  refresh(): void {
    const active = getActiveVerb();
    this.buttons.forEach((btn, verb) => {
      if (verb === active) {
        btn.bg.setFillStyle(COLORS.sunAmber, 1);
        btn.bg.setStrokeStyle(4, COLORS.cream, 1);
        btn.txt.setColor(COLORS.hex.charDeep);
      } else {
        btn.bg.setFillStyle(COLORS.brassDark, 0.95);
        btn.bg.setStrokeStyle(3, COLORS.brass, 1);
        btn.txt.setColor(COLORS.hex.cream);
      }
    });
  }

  destroy(fromScene?: boolean): void {
    this.unsubscribe?.();
    super.destroy(fromScene);
  }
}
