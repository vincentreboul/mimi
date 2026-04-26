import * as Phaser from 'phaser';
import { COLORS, FONTS, GAME_WIDTH, GAME_HEIGHT, HUD } from '../config';
import { getInventory, MAX_SLOTS, removeItem, addItem, tryCombine, combine, onInventoryChange, notifyInventoryChange } from '../systems/inventory';
import { ITEMS, type ItemId } from '../data/items';
import { playSfx } from '../systems/audio';
import { t } from '../systems/narrative';

export type ItemTapMode = 'examine' | 'select-for-use';

export interface InventoryEvents {
  onSelect?: (id: ItemId) => void;
  onExamine?: (id: ItemId) => void;
}

const SLOT_SIZE = 140;
const SLOT_GAP = 16;

export class InventoryBar extends Phaser.GameObjects.Container {
  private slots: Phaser.GameObjects.Container[] = [];
  private bg: Phaser.GameObjects.Rectangle;
  private selectedId: ItemId | null = null;
  private events: InventoryEvents;
  private unsubscribe: (() => void) | null = null;

  constructor(scene: Phaser.Scene, events: InventoryEvents = {}) {
    const y = GAME_HEIGHT - HUD.inventoryHeight / 2 - 24;
    super(scene, GAME_WIDTH / 2, y);
    this.events = events;

    // Background panel
    this.bg = scene.add.rectangle(0, 0, GAME_WIDTH - 32, HUD.inventoryHeight, COLORS.charDeep, 0.55);
    this.bg.setStrokeStyle(2, COLORS.brass, 0.4);
    this.add(this.bg);

    // Layout slots
    const totalWidth = MAX_SLOTS * SLOT_SIZE + (MAX_SLOTS - 1) * SLOT_GAP;
    const startX = -totalWidth / 2 + SLOT_SIZE / 2;
    for (let i = 0; i < MAX_SLOTS; i++) {
      const slotX = startX + i * (SLOT_SIZE + SLOT_GAP);
      const slot = this.createSlot(scene, slotX, 0, i);
      this.slots.push(slot);
      this.add(slot);
    }

    scene.add.existing(this);
    this.setDepth(1000);

    this.refresh();
    this.unsubscribe = onInventoryChange(() => this.refresh());
  }

  private createSlot(scene: Phaser.Scene, x: number, y: number, _index: number): Phaser.GameObjects.Container {
    const slot = scene.add.container(x, y);
    const bg = scene.add.rectangle(0, 0, SLOT_SIZE, SLOT_SIZE, COLORS.leafDeep, 0.85);
    bg.setStrokeStyle(2, COLORS.brassDark, 0.6);
    slot.add(bg);

    const icon = scene.add.text(0, -10, '', {
      fontFamily: FONTS.body,
      fontSize: '64px',
      color: COLORS.hex.cream,
    }).setOrigin(0.5);
    slot.add(icon);

    const name = scene.add.text(0, 50, '', {
      fontFamily: FONTS.body,
      fontSize: '18px',
      color: COLORS.hex.cream,
      align: 'center',
      wordWrap: { width: SLOT_SIZE - 12 },
    }).setOrigin(0.5);
    slot.add(name);

    slot.setSize(SLOT_SIZE, SLOT_SIZE);
    slot.setInteractive(
      new Phaser.Geom.Rectangle(-SLOT_SIZE / 2, -SLOT_SIZE / 2, SLOT_SIZE, SLOT_SIZE),
      Phaser.Geom.Rectangle.Contains
    );

    (slot as any).bg = bg;
    (slot as any).icon = icon;
    (slot as any).name = name;
    (slot as any).itemId = null as ItemId | null;

    slot.on('pointerdown', () => this.onSlotTap(slot));

    return slot;
  }

  private onSlotTap(slot: Phaser.GameObjects.Container): void {
    const itemId = (slot as any).itemId as ItemId | null;
    if (!itemId) return;

    playSfx('tap');

    // If we have a selection and tap a different slot → try combine
    if (this.selectedId && this.selectedId !== itemId) {
      const result = tryCombine(this.selectedId, itemId);
      if (result) {
        const newItem = combine(this.selectedId, itemId);
        if (newItem) {
          playSfx('success');
          this.selectedId = null;
          notifyInventoryChange();
          this.events.onExamine?.(newItem);
          return;
        }
      } else {
        playSfx('fail');
        this.events.onExamine?.(itemId);
        // Cancel selection
        this.selectedId = null;
        this.refresh();
        return;
      }
    }

    // Toggle selection
    if (this.selectedId === itemId) {
      this.selectedId = null;
    } else {
      this.selectedId = itemId;
      this.events.onSelect?.(itemId);
      this.events.onExamine?.(itemId);
    }
    this.refresh();
  }

  refresh(): void {
    const inv = getInventory();
    this.slots.forEach((slot, i) => {
      const itemId = (inv[i] ?? null) as ItemId | null;
      (slot as any).itemId = itemId;
      const bg = (slot as any).bg as Phaser.GameObjects.Rectangle;
      const icon = (slot as any).icon as Phaser.GameObjects.Text;
      const name = (slot as any).name as Phaser.GameObjects.Text;

      if (itemId && ITEMS[itemId]) {
        icon.setText(ITEMS[itemId].icon);
        name.setText(ITEMS[itemId].name.split(' ').slice(0, 2).join(' '));
        if (this.selectedId === itemId) {
          bg.setStrokeStyle(4, COLORS.sunAmber, 1);
          bg.setFillStyle(COLORS.brassDark, 0.5);
        } else {
          bg.setStrokeStyle(2, COLORS.brassDark, 0.6);
          bg.setFillStyle(COLORS.leafDeep, 0.85);
        }
      } else {
        icon.setText('');
        name.setText('');
        bg.setStrokeStyle(1, COLORS.brassDark, 0.3);
        bg.setFillStyle(COLORS.leafDeep, 0.4);
      }
    });
  }

  getSelected(): ItemId | null {
    return this.selectedId;
  }

  clearSelection(): void {
    this.selectedId = null;
    this.refresh();
  }

  destroy(fromScene?: boolean): void {
    this.unsubscribe?.();
    super.destroy(fromScene);
  }
}
