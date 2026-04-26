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
 * PrecisionButton — uses the rectangle ITSELF as the interactive object
 * (no Container nesting that could introduce coordinate offsets).
 * Hit detection on the rectangle's actual world bounds, exactly matching the visual.
 */
export class PrecisionButton {
  public bg: Phaser.GameObjects.Rectangle;
  public txt: Phaser.GameObjects.Text;
  private opts: PrecisionButtonOptions;
  private origFillColor: number;
  private origStrokeColor: number;
  private origTextColor: string;
  private _selectedState = false;
  private _scene: Phaser.Scene;

  constructor(scene: Phaser.Scene, opts: PrecisionButtonOptions) {
    this._scene = scene;
    this.opts = opts;

    const fill = opts.fillColor ?? COLORS.brassDark;
    const stroke = opts.borderColor ?? COLORS.brass;
    const txtColor = opts.textColor ?? COLORS.hex.cream;
    this.origFillColor = fill;
    this.origStrokeColor = stroke;
    this.origTextColor = txtColor;

    // Rectangle directly placed at world (x, y), centered (default origin 0.5, 0.5).
    this.bg = scene.add.rectangle(opts.x, opts.y, opts.width, opts.height, fill, 0.95);
    this.bg.setStrokeStyle(3, stroke, 1);
    // Make the rectangle itself interactive — Phaser uses its own bounds.
    this.bg.setInteractive({ useHandCursor: true });

    this.txt = scene.add.text(opts.x, opts.y, opts.label, {
      fontFamily: opts.fontFamily ?? FONTS.body,
      fontSize: (opts.fontSize ?? 36) + 'px',
      color: txtColor,
      fontStyle: 'bold',
      align: 'center',
      wordWrap: { width: opts.width - 24 },
    }).setOrigin(0.5);

    // Fire on pointerdown for instant response.
    this.bg.on('pointerdown', () => {
      const wasSelected = this._selectedState;
      this.bg.setFillStyle(COLORS.cream, 1);
      playSfx('tap');
      opts.onTap();
      // Revert color after press (unless persistent selected state)
      scene.time.delayedCall(120, () => {
        if (!this._selectedState) {
          this.bg.setFillStyle(this.origFillColor, 0.95);
        } else if (this._selectedState && !wasSelected) {
          // Newly selected — handled by markSelected
        }
      });
    });

    if (opts.selected) this.markSelected(true);
  }

  markSelected(selected: boolean): void {
    this._selectedState = selected;
    if (selected) {
      this.origFillColor = COLORS.sunAmber;
      this.bg.setFillStyle(COLORS.sunAmber, 1);
      this.bg.setStrokeStyle(4, COLORS.cream, 1);
      this.txt.setColor(COLORS.hex.charDeep);
    } else {
      this.origFillColor = this.opts.fillColor ?? COLORS.brassDark;
      this.bg.setFillStyle(this.origFillColor, 0.95);
      this.bg.setStrokeStyle(3, this.origStrokeColor, 1);
      this.txt.setColor(this.origTextColor);
    }
  }

  setLabel(label: string): void {
    this.txt.setText(label);
  }

  setDepth(d: number): void {
    this.bg.setDepth(d);
    this.txt.setDepth(d + 1);
  }

  destroy(): void {
    this.bg.destroy();
    this.txt.destroy();
  }
}
