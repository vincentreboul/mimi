import * as Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, COLORS, STAGE_BOTTOM_Y } from '../config';

/**
 * PixelScene helper: places sprites with integer scaling and chunky pixel feel.
 * All sprites are rendered with integer scale to preserve pixel-art crispness.
 */
export class PixelScene {
  /**
   * Add a sprite at a logical position with integer scale.
   * The sprite's pivot is bottom-center for natural floor placement.
   */
  static place(scene: Phaser.Scene, key: string, x: number, y: number, scale: number, opts: {
    origin?: { x: number; y: number };
    depth?: number;
    flipX?: boolean;
    tint?: number;
    alpha?: number;
  } = {}): Phaser.GameObjects.Image {
    const img = scene.add.image(x, y, key);
    img.setOrigin(opts.origin?.x ?? 0.5, opts.origin?.y ?? 1);
    img.setScale(scale);
    if (opts.flipX) img.setFlipX(true);
    if (opts.tint !== undefined) img.setTint(opts.tint);
    if (opts.alpha !== undefined) img.setAlpha(opts.alpha);
    if (opts.depth !== undefined) img.setDepth(opts.depth);
    return img;
  }

  /**
   * Tile a sprite horizontally across a row.
   */
  static tileH(scene: Phaser.Scene, key: string, y: number, scale: number, fromX = 0, toX = GAME_WIDTH, opts: {
    origin?: { x: number; y: number };
    depth?: number;
  } = {}): Phaser.GameObjects.Image[] {
    const tex = scene.textures.get(key);
    const w = tex.getSourceImage().width * scale;
    const result: Phaser.GameObjects.Image[] = [];
    for (let x = fromX; x < toX; x += w) {
      result.push(PixelScene.place(scene, key, x, y, scale, { origin: opts.origin ?? { x: 0, y: 1 }, depth: opts.depth }));
    }
    return result;
  }

  /**
   * Draw a tinted vignette overlay.
   */
  static vignette(scene: Phaser.Scene, color: number = 0x000000, alpha: number = 0.45): Phaser.GameObjects.Graphics {
    const g = scene.add.graphics();
    g.setDepth(50);
    // Simple radial-feel vignette: dark on edges, transparent in middle
    g.fillStyle(color, alpha);
    g.fillRect(0, 0, GAME_WIDTH, 200);
    g.fillRect(0, STAGE_BOTTOM_Y - 200, GAME_WIDTH, 200);
    g.fillRect(0, 0, 100, GAME_HEIGHT);
    g.fillRect(GAME_WIDTH - 100, 0, 100, GAME_HEIGHT);
    return g;
  }

  /**
   * Background fill for stage area.
   */
  static stageBackground(scene: Phaser.Scene, color: number): Phaser.GameObjects.Rectangle {
    const r = scene.add.rectangle(0, 0, GAME_WIDTH, STAGE_BOTTOM_Y, color, 1).setOrigin(0);
    r.setDepth(-1000);
    return r;
  }
}
