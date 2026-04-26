import * as Phaser from 'phaser';
import { COLORS, FONTS, GAME_WIDTH, GAME_HEIGHT, HUD } from '../config';
import { getInventory, MAX_SLOTS, onInventoryChange } from '../systems/inventory';
import { ITEMS, type ItemId } from '../data/items';
import { playSfx } from '../systems/audio';
import { setTarget, getActiveVerb, setSelectedItem, getSelectedItem, setActiveVerb } from '../systems/verbs';

/**
 * Bottom inventory bar: 6 slots, big enough for fingers, names visible.
 * Tap an item: targets it (sets verb subject).
 * If verb is "use" and another hotspot is tapped after: combines.
 */
export class InventoryBar extends Phaser.GameObjects.Container {
  private slots: Phaser.GameObjects.Container[] = [];
  private bg: Phaser.GameObjects.Rectangle;
  private unsubscribe: (() => void) | null = null;

  constructor(scene: Phaser.Scene) {
    const y = GAME_HEIGHT - HUD.inventoryHeight;
    super(scene, 0, y);

    this.bg = scene.add.rectangle(0, 0, GAME_WIDTH, HUD.inventoryHeight, COLORS.charDeep, 0.92).setOrigin(0);
    this.bg.setStrokeStyle(2, COLORS.brass, 0.6);
    this.add(this.bg);

    const slotW = HUD.inventorySlotSize;
    const totalW = MAX_SLOTS * slotW + (MAX_SLOTS - 1) * 14;
    const startX = (GAME_WIDTH - totalW) / 2 + slotW / 2;

    for (let i = 0; i < MAX_SLOTS; i++) {
      const x = startX + i * (slotW + 14);
      const slot = this.createSlot(scene, x, HUD.inventoryHeight / 2);
      this.slots.push(slot);
      this.add(slot);
    }

    scene.add.existing(this);
    this.setDepth(900);

    this.refresh();
    this.unsubscribe = onInventoryChange(() => this.refresh());
  }

  private createSlot(scene: Phaser.Scene, x: number, y: number): Phaser.GameObjects.Container {
    const slot = scene.add.container(x, y);
    const size = HUD.inventorySlotSize;

    const bg = scene.add.rectangle(0, 0, size, size, COLORS.leafDeep, 0.95);
    bg.setStrokeStyle(3, COLORS.brassDark, 0.8);
    slot.add(bg);

    const icon = scene.add.text(0, -22, '', {
      fontFamily: FONTS.body,
      fontSize: '64px',
      color: COLORS.hex.cream,
    }).setOrigin(0.5);
    slot.add(icon);

    const name = scene.add.text(0, 50, '', {
      fontFamily: FONTS.body,
      fontSize: '20px',
      color: COLORS.hex.cream,
      align: 'center',
      wordWrap: { width: size - 8 },
    }).setOrigin(0.5);
    slot.add(name);

    slot.setSize(size, size);
    slot.setInteractive(
      new Phaser.Geom.Rectangle(-size / 2, -size / 2, size, size),
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

    const verb = getActiveVerb();
    const meta = ITEMS[itemId];

    // Set target (item)
    setTarget({ kind: 'item', id: itemId, display: meta.name });

    if (verb === 'use') {
      // Pick this item as the "item to use" — next hotspot tap will trigger combine attempt
      setSelectedItem(itemId);
    } else if (verb === 'look') {
      this.scene.events.emit('item-look', { itemId });
    } else if (verb === 'pick') {
      // Already in inventory
      this.scene.events.emit('item-message', { message: 'Déjà dans ton inventaire.' });
    } else if (verb === 'talk') {
      this.scene.events.emit('item-message', { message: 'Ça ne parle pas.' });
    }

    this.refresh();
  }

  /** Legacy compatibility */
  getSelected(): ItemId | null {
    return getSelectedItem();
  }
  clearSelection(): void {
    setSelectedItem(null);
    this.refresh();
  }

  refresh(): void {
    const inv = getInventory();
    const selected = getSelectedItem();
    this.slots.forEach((slot, i) => {
      const itemId = (inv[i] ?? null) as ItemId | null;
      (slot as any).itemId = itemId;
      const bg = (slot as any).bg as Phaser.GameObjects.Rectangle;
      const icon = (slot as any).icon as Phaser.GameObjects.Text;
      const name = (slot as any).name as Phaser.GameObjects.Text;

      if (itemId && ITEMS[itemId]) {
        icon.setText(ITEMS[itemId].icon);
        name.setText(ITEMS[itemId].name.split(' ').slice(0, 2).join(' '));
        if (selected === itemId) {
          bg.setStrokeStyle(5, COLORS.sunAmber, 1);
          bg.setFillStyle(COLORS.brassDark, 0.7);
        } else {
          bg.setStrokeStyle(3, COLORS.brassDark, 0.8);
          bg.setFillStyle(COLORS.leafDeep, 0.95);
        }
      } else {
        icon.setText('');
        name.setText('');
        bg.setStrokeStyle(2, COLORS.brassDark, 0.4);
        bg.setFillStyle(COLORS.leafDeep, 0.5);
      }
    });
  }

  destroy(fromScene?: boolean): void {
    this.unsubscribe?.();
    super.destroy(fromScene);
  }
}
