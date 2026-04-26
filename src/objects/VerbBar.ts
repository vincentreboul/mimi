import * as Phaser from 'phaser';
import { COLORS, FONTS, GAME_WIDTH, GAME_HEIGHT, HUD } from '../config';
import { VERBS, VERB_LABELS, getActiveVerb, setActiveVerb, onChange, type Verb } from '../systems/verbs';
import { PrecisionButton } from './PrecisionButton';

/**
 * SCUMM-style verb panel: 2x2 grid of large verb buttons.
 * Sits above the inventory bar.
 */
export class VerbBar extends Phaser.GameObjects.Container {
  private buttons: Map<Verb, PrecisionButton> = new Map();
  private unsubscribe: (() => void) | null = null;

  constructor(scene: Phaser.Scene) {
    const panelY = GAME_HEIGHT - HUD.inventoryHeight - HUD.verbPanelHeight - 20;
    super(scene, 0, panelY);

    const bg = scene.add.rectangle(0, 0, GAME_WIDTH, HUD.verbPanelHeight, COLORS.charDeep, 0.92).setOrigin(0);
    bg.setStrokeStyle(2, COLORS.brass, 0.6);
    this.add(bg);

    const gap = 16; // wider gap so adjacent verbs cannot be confused
    const startX = (GAME_WIDTH - (2 * HUD.verbButtonWidth + gap)) / 2;
    const startY = (HUD.verbPanelHeight - (2 * HUD.verbButtonHeight + gap)) / 2;

    VERBS.forEach((verb, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = startX + col * (HUD.verbButtonWidth + gap) + HUD.verbButtonWidth / 2;
      const y = startY + row * (HUD.verbButtonHeight + gap) + HUD.verbButtonHeight / 2;
      const btn = new PrecisionButton(scene, {
        x, y,
        width: HUD.verbButtonWidth,
        height: HUD.verbButtonHeight,
        label: VERB_LABELS[verb].toUpperCase(),
        fontSize: 42,
        bold: true,
        onTap: () => setActiveVerb(verb),
      } as any);
      this.buttons.set(verb, btn);
      // The PrecisionButton already added itself to the scene; we keep it there
      // (do NOT re-parent to this container — that would shift its hit area).
    });

    scene.add.existing(this);
    this.setDepth(800);

    this.refresh();
    this.unsubscribe = onChange(() => this.refresh());
  }

  refresh(): void {
    const active = getActiveVerb();
    this.buttons.forEach((btn, verb) => {
      btn.markSelected(verb === active);
    });
  }

  destroy(fromScene?: boolean): void {
    this.unsubscribe?.();
    this.buttons.forEach((btn) => btn.destroy());
    this.buttons.clear();
    super.destroy(fromScene);
  }
}
