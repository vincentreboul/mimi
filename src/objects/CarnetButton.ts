import * as Phaser from 'phaser';
import { COLORS, FONTS } from '../config';
import { playSfx } from '../systems/audio';
import { onFragmentCollected } from '../systems/fragments';

// HUD button — top-right, next to Menu. Pulses when new fragment collected.
export class CarnetButton {
  public bg: Phaser.GameObjects.Rectangle;
  private label: Phaser.GameObjects.Text;
  private dot: Phaser.GameObjects.Arc;          // notification dot
  private unsub: () => void;
  private hasNew = false;

  constructor(scene: Phaser.Scene, x: number, y: number, onTap: () => void) {
    this.bg = scene.add.rectangle(x, y, 160, 80, COLORS.brassDark, 0.95).setDepth(901);
    this.bg.setStrokeStyle(2, COLORS.brass, 1);
    this.bg.setInteractive({ useHandCursor: true });

    this.label = scene.add.text(x, y, 'CARNET', {
      fontFamily: FONTS.body,
      fontSize: '26px',
      color: COLORS.hex.cream,
      fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(902);

    // Notification dot in top-right corner of button
    this.dot = scene.add.circle(x + 70, y - 30, 12, COLORS.sunAmber, 1)
      .setDepth(903)
      .setVisible(false);

    this.bg.on('pointerdown', () => {
      playSfx('tap');
      this.bg.setFillStyle(COLORS.sunAmber, 1);
      scene.time.delayedCall(120, () => this.bg.setFillStyle(COLORS.brassDark, 0.95));
      this.clearNotification();
      onTap();
    });

    this.unsub = onFragmentCollected(() => this.markNotification(scene));
  }

  private markNotification(scene: Phaser.Scene): void {
    if (this.hasNew) return;
    this.hasNew = true;
    this.dot.setVisible(true);
    scene.tweens.add({
      targets: this.dot,
      scale: { from: 1, to: 1.4 },
      yoyo: true,
      repeat: -1,
      duration: 600,
    });
  }

  private clearNotification(): void {
    this.hasNew = false;
    this.dot.setVisible(false);
  }

  destroy(): void {
    this.unsub();
    this.bg.destroy();
    this.label.destroy();
    this.dot.destroy();
  }
}
