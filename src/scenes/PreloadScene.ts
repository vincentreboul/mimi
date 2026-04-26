import * as Phaser from 'phaser';
import { COLORS, FONTS, GAME_WIDTH, GAME_HEIGHT } from '../config';

/**
 * PreloadScene: in V1 we have no external assets to load — all art is procedural.
 * This scene exists as a hook for V2 asset loading.
 */
export class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  preload(): void {
    // No external assets in V1 — all visuals are procedural via Graphics + emoji text.
    // Placeholder for future asset preload.
  }

  create(): void {
    // Brief loading feedback
    const txt = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, '...', {
      fontFamily: FONTS.display,
      fontSize: '64px',
      color: COLORS.hex.cream,
    }).setOrigin(0.5);

    this.tweens.add({
      targets: txt,
      alpha: { from: 0.3, to: 1 },
      duration: 500,
      yoyo: true,
      onComplete: () => {
        this.scene.start('MenuScene');
      },
    });
  }
}
