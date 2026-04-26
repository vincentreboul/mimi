import * as Phaser from 'phaser';
import { COLORS, FONTS } from '../config';
import type { TileCategory } from '../data/carnet/types';

// Drop target inside an assertion line. Visual: outlined empty box.
// When tile is dropped on it, asks parent (Carnet) to validate via assertion engine.
export class AssertionSlot {
  public bg: Phaser.GameObjects.Rectangle;
  private hint: Phaser.GameObjects.Text;
  public assertionId: string;
  public slotIndex: number;
  public category: TileCategory;
  public x: number;
  public y: number;
  private filled = false;
  private locked = false;

  constructor(
    scene: Phaser.Scene,
    x: number, y: number,
    width: number, height: number,
    assertionId: string,
    slotIndex: number,
    category: TileCategory,
    hintText?: string
  ) {
    this.x = x;
    this.y = y;
    this.assertionId = assertionId;
    this.slotIndex = slotIndex;
    this.category = category;

    this.bg = scene.add.rectangle(x, y, width, height, COLORS.charDeep, 0.4);
    this.bg.setStrokeStyle(2, COLORS.brass, 0.6);
    this.bg.setDepth(2750);

    this.hint = scene.add.text(x, y, hintText ?? '____', {
      fontFamily: FONTS.body,
      fontSize: '20px',
      color: COLORS.hex.brass,
      align: 'center',
    }).setOrigin(0.5).setDepth(2751);
  }

  setFilled(f: boolean): void {
    this.filled = f;
    if (f) {
      this.hint.setVisible(false);
      this.bg.setFillStyle(0x000000, 0);
      this.bg.setStrokeStyle(0, 0, 0);
    } else {
      this.hint.setVisible(true);
      this.bg.setFillStyle(COLORS.charDeep, 0.4);
      this.bg.setStrokeStyle(2, COLORS.brass, 0.6);
    }
  }

  setLocked(l: boolean): void {
    this.locked = l;
    if (l) {
      this.bg.setStrokeStyle(2, COLORS.sunAmber, 0.9);
    }
  }

  setRevisable(r: boolean): void {
    if (r) {
      this.bg.setStrokeStyle(3, COLORS.warning, 0.95);
    }
  }

  isFilled(): boolean {
    return this.filled;
  }

  isLocked(): boolean {
    return this.locked;
  }

  contains(px: number, py: number): boolean {
    const w = this.bg.width;
    const h = this.bg.height;
    return Math.abs(px - this.x) < w / 2 && Math.abs(py - this.y) < h / 2;
  }

  destroy(): void {
    this.bg.destroy();
    this.hint.destroy();
  }
}
