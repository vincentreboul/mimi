import * as Phaser from 'phaser';
import { COLORS, FONTS, GAME_WIDTH, GAME_HEIGHT, HUD } from '../config';
import { onChange, buildSentence, getActiveVerb, getTarget, VERB_LABELS } from '../systems/verbs';

/**
 * Persistent label above the verb panel showing what the player is about to do.
 * Looks like the SCUMM action sentence: "Look at brass key" / "Use key with door".
 */
export class ActionLabel extends Phaser.GameObjects.Container {
  private label: Phaser.GameObjects.Text;
  private unsubscribe: (() => void) | null = null;

  constructor(scene: Phaser.Scene) {
    const y = GAME_HEIGHT - HUD.inventoryHeight - HUD.verbPanelHeight - HUD.actionLabelHeight - 28;
    super(scene, 0, y);

    const bg = scene.add.rectangle(0, 0, GAME_WIDTH, HUD.actionLabelHeight, COLORS.charDeep, 0.85).setOrigin(0);
    bg.setStrokeStyle(2, COLORS.brass, 0.4);
    this.add(bg);

    this.label = scene.add.text(GAME_WIDTH / 2, HUD.actionLabelHeight / 2, '', {
      fontFamily: FONTS.body,
      fontSize: '40px',
      color: COLORS.hex.sunAmber,
      fontStyle: 'bold',
      align: 'center',
    }).setOrigin(0.5);
    this.add(this.label);

    scene.add.existing(this);
    this.setDepth(820);

    this.refresh();
    this.unsubscribe = onChange(() => this.refresh());
  }

  refresh(): void {
    const verb = getActiveVerb();
    const target = getTarget();
    if (!target) {
      this.label.setText(VERB_LABELS[verb] + '...');
      this.label.setColor(COLORS.hex.skyPale);
    } else {
      this.label.setText(buildSentence());
      this.label.setColor(COLORS.hex.sunAmber);
    }
  }

  destroy(fromScene?: boolean): void {
    this.unsubscribe?.();
    super.destroy(fromScene);
  }
}
