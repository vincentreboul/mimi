import * as Phaser from 'phaser';
import { COLORS, FONTS } from '../config';
import { playSfx } from '../systems/audio';

export interface PrecisionButtonOptions {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  fontSize?: number;
  fontFamily?: string;
  fillColor?: number;
  borderColor?: number;
  textColor?: string;
  selected?: boolean;
  onTap: () => void;
}

/**
 * PrecisionButton — laser-precise tap handling for mobile.
 *
 * Why this exists:
 * - Phaser's default `pointerdown` fires on press, even if the user drags off
 *   before releasing. That makes "I tapped between two buttons" feel like the
 *   wrong one was selected.
 * - The native iOS pattern is: register on `pointerup`, but only if the up event
 *   happens INSIDE the same hit area as the down. Drag-off cancels.
 *
 * - Hit area is EXACTLY the visual rect (no overshoot, no overlap with neighbors).
 * - No scale tween (would shrink the hit area mid-touch).
 * - Visual feedback is a fill-flash on press, reverting on release/cancel.
 */
export class PrecisionButton extends Phaser.GameObjects.Container {
  private bg: Phaser.GameObjects.Rectangle;
  private txt: Phaser.GameObjects.Text;
  private opts: PrecisionButtonOptions;
  private isPressed = false;
  private origFillColor: number;

  constructor(scene: Phaser.Scene, opts: PrecisionButtonOptions) {
    super(scene, opts.x, opts.y);
    this.opts = opts;

    const fill = opts.fillColor ?? COLORS.brassDark;
    this.origFillColor = fill;

    this.bg = scene.add.rectangle(0, 0, opts.width, opts.height, fill, 0.95);
    this.bg.setStrokeStyle(3, opts.borderColor ?? COLORS.brass, 1);
    this.add(this.bg);

    this.txt = scene.add.text(0, 0, opts.label, {
      fontFamily: opts.fontFamily ?? FONTS.body,
      fontSize: (opts.fontSize ?? 36) + 'px',
      color: opts.textColor ?? COLORS.hex.cream,
      fontStyle: 'bold',
      align: 'center',
      wordWrap: { width: opts.width - 24 },
    }).setOrigin(0.5);
    this.add(this.txt);

    this.setSize(opts.width, opts.height);
    // Hit area exactly matches visual — no padding, no overlap with neighbors.
    this.setInteractive(
      new Phaser.Geom.Rectangle(-opts.width / 2, -opts.height / 2, opts.width, opts.height),
      Phaser.Geom.Rectangle.Contains
    );

    // pointerdown: visual press feedback, mark pressed
    this.on('pointerdown', () => {
      this.isPressed = true;
      this.bg.setFillStyle(COLORS.sunAmber, 1);
    });

    // pointerup: only fire onTap if release happens INSIDE the hit area
    // (i.e., not after a drag-off). This is the laser-precision pattern.
    this.on('pointerup', () => {
      if (this.isPressed) {
        this.isPressed = false;
        this.bg.setFillStyle(this.origFillColor, 0.95);
        playSfx('tap');
        opts.onTap();
      }
    });

    // pointerout/upoutside: cancel if drag-off
    this.on('pointerout', () => {
      if (this.isPressed) {
        this.isPressed = false;
        this.bg.setFillStyle(this.origFillColor, 0.95);
      }
    });
    this.on('pointerupoutside', () => {
      if (this.isPressed) {
        this.isPressed = false;
        this.bg.setFillStyle(this.origFillColor, 0.95);
      }
    });

    if (opts.selected) this.markSelected(true);

    scene.add.existing(this);
  }

  markSelected(selected: boolean): void {
    if (selected) {
      this.origFillColor = COLORS.sunAmber;
      this.bg.setFillStyle(COLORS.sunAmber, 1);
      this.bg.setStrokeStyle(4, COLORS.cream, 1);
      this.txt.setColor(COLORS.hex.charDeep);
    } else {
      this.origFillColor = this.opts.fillColor ?? COLORS.brassDark;
      this.bg.setFillStyle(this.origFillColor, 0.95);
      this.bg.setStrokeStyle(3, this.opts.borderColor ?? COLORS.brass, 1);
      this.txt.setColor(this.opts.textColor ?? COLORS.hex.cream);
    }
  }

  setLabel(label: string): void {
    this.txt.setText(label);
  }
}
