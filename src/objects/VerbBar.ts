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
    const panelTop = GAME_HEIGHT - HUD.inventoryHeight - HUD.verbPanelHeight - 20;
    super(scene, 0, panelTop);

    // Background panel (relative to container at panelTop)
    const bg = scene.add.rectangle(0, 0, GAME_WIDTH, HUD.verbPanelHeight, COLORS.charDeep, 0.92).setOrigin(0);
    bg.setStrokeStyle(2, COLORS.brass, 0.6);
    this.add(bg);

    // Buttons in WORLD coordinates (PrecisionButton stays at scene level for input correctness)
    const gap = 16;
    const startX = (GAME_WIDTH - (2 * HUD.verbButtonWidth + gap)) / 2;
    const buttonsTopY = panelTop + (HUD.verbPanelHeight - (2 * HUD.verbButtonHeight + gap)) / 2;

    VERBS.forEach((verb, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = startX + col * (HUD.verbButtonWidth + gap) + HUD.verbButtonWidth / 2;
      const y = buttonsTopY + row * (HUD.verbButtonHeight + gap) + HUD.verbButtonHeight / 2;
      const btn = new PrecisionButton(scene, {
        x, y,
        width: HUD.verbButtonWidth,
        height: HUD.verbButtonHeight,
        label: VERB_LABELS[verb].toUpperCase(),
        fontSize: 42,
        bold: true,
        onTap: () => setActiveVerb(verb),
      } as any);
      btn.setDepth(810);
      this.buttons.set(verb, btn);
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
