import * as Phaser from 'phaser';
import { COLORS, FONTS } from '../config';
import type { Tile, TileCategory } from '../data/carnet/types';

const CATEGORY_COLORS: Record<TileCategory, number> = {
  person: 0xa8dadc,   // sky pale
  verb: 0xf4a261,     // sun amber
  place: 0x7fb069,    // leaf light
  time: 0xd4a373,     // brass
  reason: 0xe9c46a,   // honey
  object: 0xf4e9d8,   // cream
};

// Draggable word tile. Used in carnet's Assertions tab.
// Drag to a slot to place. Tap on a placed tile to return to bandeau.
export class AssertionTile extends Phaser.GameObjects.Container {
  public tile: Tile;
  private bg: Phaser.GameObjects.Rectangle;
  private label: Phaser.GameObjects.Text;
  private _originX: number;
  private _originY: number;
  private isDragging = false;
  public placedInSlotIndex: number | null = null;
  public placedInAssertionId: string | null = null;

  constructor(scene: Phaser.Scene, x: number, y: number, tile: Tile) {
    super(scene, x, y);
    this.tile = tile;
    this._originX = x;
    this._originY = y;

    const color = CATEGORY_COLORS[tile.category] ?? COLORS.brass;
    const w = Math.max(160, tile.text.length * 16);
    const h = 56;

    this.bg = scene.add.rectangle(0, 0, w, h, color, 0.92);
    this.bg.setStrokeStyle(3, COLORS.charDeep, 0.85);
    this.add(this.bg);

    this.label = scene.add.text(0, 0, tile.text, {
      fontFamily: FONTS.body,
      fontSize: '24px',
      color: COLORS.hex.charDeep,
      fontStyle: 'bold',
      align: 'center',
    }).setOrigin(0.5);
    this.add(this.label);

    this.setSize(w, h);
    this.setInteractive({ useHandCursor: true, draggable: true });
    scene.input.setDraggable(this);

    this.on('drag', (_: any, dragX: number, dragY: number) => {
      this.x = dragX;
      this.y = dragY;
      this.isDragging = true;
    });

    this.on('dragstart', () => {
      this.setDepth(2900);
    });

    this.on('dragend', () => {
      this.setDepth(2700);
      // Slot snap is handled by Carnet — it listens to drop events.
      if (this.isDragging && this.placedInSlotIndex === null) {
        // Returned to origin if not snapped to a slot
        this.scene.tweens.add({
          targets: this,
          x: this._originX,
          y: this._originY,
          duration: 200,
          ease: 'Cubic.easeOut',
        });
      }
      this.isDragging = false;
    });

    scene.add.existing(this);
    this.setDepth(2700);
  }

  setOrigin2(x: number, y: number): this {
    this._originX = x;
    this._originY = y;
    if (!this.isDragging && this.placedInSlotIndex === null) {
      this.x = x;
      this.y = y;
    }
    return this;
  }

  snapToSlot(x: number, y: number, assertionId: string, slotIndex: number): void {
    this.placedInAssertionId = assertionId;
    this.placedInSlotIndex = slotIndex;
    this.scene.tweens.add({
      targets: this,
      x,
      y,
      duration: 150,
      ease: 'Back.easeOut',
    });
  }

  releaseFromSlot(): void {
    this.placedInAssertionId = null;
    this.placedInSlotIndex = null;
    this.scene.tweens.add({
      targets: this,
      x: this._originX,
      y: this._originY,
      duration: 200,
      ease: 'Cubic.easeOut',
    });
  }

  flashRed(): void {
    const orig = this.bg.fillColor;
    this.bg.setFillStyle(COLORS.warning, 1);
    this.scene.time.delayedCall(220, () => this.bg.setFillStyle(orig, 0.92));
  }
}
