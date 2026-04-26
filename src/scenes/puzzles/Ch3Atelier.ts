import * as Phaser from 'phaser';
import { COLORS, FONTS, GAME_WIDTH, GAME_HEIGHT } from '../../config';
import { PuzzleSceneBase } from './PuzzleSceneBase';
import { SceneBackground } from '../../objects/SceneBackground';
import { Hotspot } from '../../objects/Hotspot';
import { addItem, hasItem, removeItem, notifyInventoryChange, getInventory } from '../../systems/inventory';
import { setProgress, hasProgress } from '../../systems/save';
import { PUZZLE_IDS, SOLUTIONS } from '../../data/puzzles';
import { t } from '../../systems/narrative';
import { ITEMS, type ItemId } from '../../data/items';
import { playSfx } from '../../systems/audio';

const CIRCUIT_COMPONENTS: ItemId[] = ['comp_resistor', 'comp_capa', 'comp_diode', 'comp_led'];

export class Ch3Atelier extends PuzzleSceneBase {
  private circuitSlots: Array<{
    container: Phaser.GameObjects.Container;
    placedItem: ItemId | null;
    label: Phaser.GameObjects.Text;
  }> = [];
  private validateBtn?: Phaser.GameObjects.Container;

  constructor() {
    super('Ch3Atelier');
  }

  init(): void {
    this.chapter = 3;
    this.nextSceneKey = 'Ch4Coupole';
  }

  create(): void {
    this.cameras.main.fadeIn(500, 31, 77, 62);
    SceneBackground.draw(this, 'atelier');

    this.add.text(GAME_WIDTH / 2, 200, 'ATELIER — Module C', {
      fontFamily: FONTS.mono,
      fontSize: '36px',
      color: COLORS.hex.brass,
    }).setOrigin(0.5);

    this.setupHud(PUZZLE_IDS.ch3Circuit);

    // Schema (background hint, drawn on wall — visible)
    this.drawSchemaWall(GAME_WIDTH - 180, 700);
    new Hotspot(this, {
      x: GAME_WIDTH - 180,
      y: 700,
      width: 280,
      height: 320,
      label: 'Schéma mural',
      onTap: () => {
        this.recordTap();
        this.showNarration(t('scene.ch3.schema_wall'));
      },
    });

    // Toolbox (left)
    this.drawToolbox(180, 850);
    new Hotspot(this, {
      x: 180,
      y: 850,
      width: 220,
      height: 180,
      label: 'Boîte à outils',
      onTap: () => {
        this.recordTap();
        if (!hasItem('tournevis') && !hasProgress('ch3.tools_taken')) {
          this.showNarration(t('scene.ch3.toolbox'), () => {
            addItem('tournevis');
            setProgress('ch3.tools_taken');
            notifyInventoryChange();
          });
        } else {
          this.showNarration(t('scene.ch3.toolbox'));
        }
      },
    });

    // Workbench — contains 4 components
    this.drawWorkbench(GAME_WIDTH / 2, 1100);
    new Hotspot(this, {
      x: GAME_WIDTH / 2,
      y: 1100,
      width: 600,
      height: 280,
      label: 'Établi',
      onTap: () => {
        this.recordTap();
        if (!hasProgress('ch3.components_taken')) {
          this.showNarration(t('scene.ch3.workbench'), () => {
            CIRCUIT_COMPONENTS.forEach((c) => addItem(c));
            setProgress('ch3.components_taken');
            notifyInventoryChange();
          });
        } else {
          this.showNarration('Les composants sont à toi désormais.');
        }
      },
    });

    // Circuit board — 4 slots to place components
    this.makeCircuitBoard(GAME_WIDTH / 2, GAME_HEIGHT - 720);

    // VERA welcome
    if (!hasProgress('ch3.vera_greeted')) {
      this.time.delayedCall(700, () => {
        this.showVeraSequence(
          [t('vera.ch3.greeting'), t('vera.ch3.uneasy'), t('vera.ch3.task')],
          () => setProgress('ch3.vera_greeted')
        );
      });
    }
  }

  private makeCircuitBoard(cx: number, cy: number): void {
    // PCB background
    const g = this.add.graphics();
    g.setDepth(-50);
    g.fillStyle(0x2a4f3e, 0.95);
    g.fillRoundedRect(cx - 480, cy - 100, 960, 200, 16);
    g.lineStyle(3, COLORS.brass, 0.7);
    g.strokeRoundedRect(cx - 480, cy - 100, 960, 200, 16);

    // Trace lines between slots
    g.lineStyle(4, COLORS.brass, 0.6);
    g.beginPath();
    g.moveTo(cx - 380, cy);
    g.lineTo(cx + 380, cy);
    g.strokePath();

    // 4 slots
    const slotPositions = [-300, -100, 100, 300];
    slotPositions.forEach((dx, i) => {
      const sx = cx + dx;
      const sy = cy;
      const slotContainer = this.add.container(sx, sy);

      const slotBg = this.add.rectangle(0, 0, 130, 130, COLORS.charDeep, 0.85);
      slotBg.setStrokeStyle(3, COLORS.brassDark, 1);
      slotContainer.add(slotBg);

      const slotLabel = this.add.text(0, 0, '+', {
        fontFamily: FONTS.body,
        fontSize: '64px',
        color: COLORS.hex.brass,
      }).setOrigin(0.5);
      slotContainer.add(slotLabel);

      slotContainer.setSize(130, 130);
      slotContainer.setInteractive(new Phaser.Geom.Rectangle(-65, -65, 130, 130), Phaser.Geom.Rectangle.Contains);
      slotContainer.on('pointerdown', () => this.onSlotTap(i));

      // Position number
      this.add.text(sx, sy + 95, `${i + 1}`, {
        fontFamily: FONTS.mono,
        fontSize: '24px',
        color: COLORS.hex.brass,
      }).setOrigin(0.5);

      this.circuitSlots.push({
        container: slotContainer,
        placedItem: null,
        label: slotLabel,
      });
    });

    // Validate button
    const btnY = cy + 200;
    this.validateBtn = this.add.container(cx, btnY);
    const vBg = this.add.rectangle(0, 0, 320, 80, COLORS.brassDark, 0.9);
    vBg.setStrokeStyle(2, COLORS.brass, 1);
    const vTxt = this.add.text(0, 0, 'Tester le circuit', {
      fontFamily: FONTS.body,
      fontSize: '28px',
      color: COLORS.hex.cream,
    }).setOrigin(0.5);
    this.validateBtn.add([vBg, vTxt]);
    this.validateBtn.setSize(320, 80);
    this.validateBtn.setInteractive(new Phaser.Geom.Rectangle(-160, -40, 320, 80), Phaser.Geom.Rectangle.Contains);
    this.validateBtn.on('pointerdown', () => this.validateCircuit());
  }

  private onSlotTap(slotIdx: number): void {
    this.recordTap();
    playSfx('tap');
    const slot = this.circuitSlots[slotIdx];
    const selected = this.inv.getSelected();

    // If a component is already in the slot, return it to inventory
    if (slot.placedItem) {
      addItem(slot.placedItem);
      slot.placedItem = null;
      slot.label.setText('+');
      slot.label.setColor(COLORS.hex.brass);
      notifyInventoryChange();
      return;
    }

    // If player has selected a circuit component, place it
    if (selected && CIRCUIT_COMPONENTS.includes(selected as ItemId)) {
      removeItem(selected);
      slot.placedItem = selected;
      slot.label.setText(ITEMS[selected].icon);
      slot.label.setColor(COLORS.hex.cream);
      notifyInventoryChange();
      this.inv.clearSelection();
      playSfx('pickup');
    } else {
      this.showNarration('Sélectionne un composant dans ton inventaire, puis touche un emplacement.');
    }
  }

  private validateCircuit(): void {
    this.recordTap();
    const placed = this.circuitSlots.map((s) => s.placedItem);
    const correct = SOLUTIONS.ch3Circuit;

    if (placed.every((p, i) => p === correct[i])) {
      // Solved!
      playSfx('success');
      addItem('cle_atelier');
      setProgress('ch3.solved');
      notifyInventoryChange();
      this.flashLed();
      this.showVera(t('vera.ch3.circuit_right'), () => {
        this.showVera(t('vera.ch3.logs'), () => {
          this.fadeToScene('ChapterIntroScene', { chapter: 4 });
        });
      });
    } else {
      playSfx('fail');
      this.showVera(t('vera.ch3.circuit_wrong'));
      this.cameras.main.shake(150, 0.005);
    }
  }

  private flashLed(): void {
    const led = this.circuitSlots[3];
    this.tweens.add({
      targets: led.label,
      alpha: { from: 0.5, to: 1 },
      duration: 200,
      yoyo: true,
      repeat: 4,
      onStart: () => led.label.setColor(COLORS.hex.sunAmber),
    });
  }

  // === Decorative shapes ===
  private drawSchemaWall(x: number, y: number): void {
    const g = this.add.graphics();
    g.setDepth(-100);
    g.fillStyle(COLORS.cream, 0.9);
    g.fillRect(x - 130, y - 150, 260, 300);
    g.lineStyle(3, COLORS.charDeep, 0.85);
    g.strokeRect(x - 130, y - 150, 260, 300);

    // Schema icons in row
    const icons = [ITEMS.comp_resistor.icon, ITEMS.comp_capa.icon, ITEMS.comp_diode.icon, ITEMS.comp_led.icon];
    icons.forEach((icon, i) => {
      this.add.text(x, y - 80 + i * 60, `${i + 1}. ${icon}  ${this.shortName(CIRCUIT_COMPONENTS[i])}`, {
        fontFamily: FONTS.mono,
        fontSize: '24px',
        color: '#222',
      }).setOrigin(0.5);
    });
  }

  private shortName(id: ItemId): string {
    return ITEMS[id].name.split(' ')[0];
  }

  private drawToolbox(x: number, y: number): void {
    const g = this.add.graphics();
    g.setDepth(-100);
    g.fillStyle(COLORS.warning, 0.7);
    g.fillRoundedRect(x - 110, y - 90, 220, 180, 8);
    g.fillStyle(COLORS.charDeep, 0.85);
    g.fillRect(x - 100, y - 80, 200, 30);
    g.lineStyle(3, COLORS.charDeep, 0.9);
    g.strokeRoundedRect(x - 110, y - 90, 220, 180, 8);
  }

  private drawWorkbench(x: number, y: number): void {
    const g = this.add.graphics();
    g.setDepth(-100);
    g.fillStyle(COLORS.brassDark, 0.95);
    g.fillRect(x - 300, y - 140, 600, 280);
    g.fillStyle(COLORS.brass, 0.4);
    g.fillRect(x - 300, y - 140, 600, 24);
    // 4 component shapes scattered
    const positions = [[-180, 0], [-60, -30], [60, 20], [180, -10]];
    positions.forEach((p, i) => {
      g.fillStyle(COLORS.skyPale, 0.85);
      g.fillRoundedRect(x + p[0] - 30, y + p[1] - 30, 60, 60, 6);
      this.add.text(x + p[0], y + p[1], ITEMS[CIRCUIT_COMPONENTS[i]].icon, {
        fontFamily: FONTS.body,
        fontSize: '36px',
        color: COLORS.hex.charDeep,
      }).setOrigin(0.5);
    });
  }
}
