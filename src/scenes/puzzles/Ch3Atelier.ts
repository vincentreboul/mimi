import * as Phaser from 'phaser';
import { COLORS, FONTS, GAME_WIDTH, GAME_HEIGHT, HUD, STAGE_BOTTOM_Y } from '../../config';
import { PuzzleSceneBase } from './PuzzleSceneBase';
import { PixelScene } from '../../objects/PixelScene';
import { Hotspot } from '../../objects/Hotspot';
import { addItem, hasItem, removeItem, notifyInventoryChange } from '../../systems/inventory';
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
    name: Phaser.GameObjects.Text;
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
    this.composeBackground();
    this.setupHud(PUZZLE_IDS.ch3Circuit);
    this.makeCircuitBoard(GAME_WIDTH / 2, STAGE_BOTTOM_Y - 280);
    this.makeHotspots();
    this.spawnSparks();
    this.spawnLampGlow();

    if (!hasProgress('ch3.vera_greeted')) {
      this.time.delayedCall(700, () => {
        this.showVeraSequence(
          [t('vera.ch3.greeting'), t('vera.ch3.uneasy'), t('vera.ch3.task')],
          () => setProgress('ch3.vera_greeted')
        );
      });
    }
  }

  private composeBackground(): void {
    // Industrial dark background
    PixelScene.stageBackground(this, 0x1a1612);

    // Floor
    PixelScene.tileH(this, 'floor3', STAGE_BOTTOM_Y - 30, 6);

    // Wall
    PixelScene.tileH(this, 'wall5', HUD.topBarHeight + 555, 5, 0, GAME_WIDTH, { origin: { x: 0, y: 1 } });

    // Pipes vertical along left wall
    PixelScene.place(this, 'pipe', 80, HUD.topBarHeight + 200, 5, { origin: { x: 0.5, y: 0 }, depth: 4 });
    PixelScene.place(this, 'pipe', 80, HUD.topBarHeight + 600, 5, { origin: { x: 0.5, y: 0 }, depth: 4 });
    PixelScene.place(this, 'pipe2', GAME_WIDTH - 80, HUD.topBarHeight + 200, 5, { origin: { x: 0.5, y: 0 }, depth: 4 });

    // Schema board on right wall
    PixelScene.place(this, 'board', GAME_WIDTH - 220, HUD.topBarHeight + 480, 5, { depth: 5 });
    // Component icons on the board
    const iconY = HUD.topBarHeight + 380;
    CIRCUIT_COMPONENTS.forEach((c, i) => {
      this.add.text(GAME_WIDTH - 220, iconY + i * 36, `${i + 1}. ${ITEMS[c].icon} ${this.shortName(c)}`, {
        fontFamily: FONTS.mono,
        fontSize: '20px',
        color: '#222',
      }).setOrigin(0.5).setDepth(6);
    });

    // Workbench on left — use bed flipped or chair
    PixelScene.place(this, 'machine1', 220, STAGE_BOTTOM_Y - 70, 6, { depth: 7 });
    // 4 component "boxes" on top
    PixelScene.place(this, 'smallMachine1', 130, STAGE_BOTTOM_Y - 380, 4, { depth: 8 });
    PixelScene.place(this, 'smallMachine2', 220, STAGE_BOTTOM_Y - 380, 4, { depth: 8 });
    PixelScene.place(this, 'smallMachine3', 310, STAGE_BOTTOM_Y - 380, 4, { depth: 8 });
    PixelScene.place(this, 'randomDevice', 130, STAGE_BOTTOM_Y - 220, 4, { depth: 8 });

    // Toolbox (red barrel)
    PixelScene.place(this, 'baril1', 90, STAGE_BOTTOM_Y - 180, 4, { depth: 7 });

    // Terminal (right)
    PixelScene.place(this, 'computerStation2', GAME_WIDTH - 180, STAGE_BOTTOM_Y - 70, 6, { depth: 7 });

    // Lamp center
    PixelScene.place(this, 'lamp1', GAME_WIDTH / 2, HUD.topBarHeight + 90, 6, { origin: { x: 0.5, y: 0 }, depth: 4 });

    // Title
    this.add.text(GAME_WIDTH / 2, HUD.topBarHeight + 30, 'MODULE C — ATELIER', {
      fontFamily: FONTS.mono,
      fontSize: '32px',
      color: COLORS.hex.brass,
      fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(50);
  }

  private spawnSparks(): void {
    // Occasional sparks from the workbench / pipes
    const spawnBurst = () => {
      const cx = 200 + Math.random() * 200;
      const cy = STAGE_BOTTOM_Y - 200 - Math.random() * 200;
      for (let i = 0; i < 6; i++) {
        const sparkX = cx + (Math.random() - 0.5) * 20;
        const sparkY = cy + (Math.random() - 0.5) * 20;
        const sp = this.add.rectangle(sparkX, sparkY, 6, 6, 0xf4a261, 1).setDepth(20);
        const dx = (Math.random() - 0.5) * 80;
        const dy = -40 - Math.random() * 80;
        this.tweens.add({
          targets: sp,
          x: sparkX + dx,
          y: sparkY + dy,
          alpha: { from: 1, to: 0 },
          duration: 600 + Math.random() * 400,
          ease: 'Cubic.easeOut',
          onComplete: () => sp.destroy(),
        });
      }
    };
    // Recurring sparks every 2-4 seconds
    const sparkLoop = () => {
      spawnBurst();
      this.time.delayedCall(2000 + Math.random() * 2000, sparkLoop);
    };
    this.time.delayedCall(1500, sparkLoop);
  }

  private spawnLampGlow(): void {
    // Big amber halo around the central lamp
    const lampX = GAME_WIDTH / 2;
    const lampY = HUD.topBarHeight + 200;
    const halo = this.add.graphics();
    halo.setDepth(3);
    halo.fillStyle(0xf4a261, 0.35);
    halo.fillCircle(lampX, lampY, 280);
    halo.fillStyle(0xf4a261, 0.18);
    halo.fillCircle(lampX, lampY, 460);
    this.tweens.add({
      targets: halo,
      alpha: { from: 0.7, to: 1 },
      duration: 1800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  private shortName(id: ItemId): string {
    return ITEMS[id].name.split(' ')[0];
  }

  private makeCircuitBoard(cx: number, cy: number): void {
    // PCB board background — use a dark green rectangle with brass traces
    const g = this.add.graphics();
    g.setDepth(-50);
    g.fillStyle(0x2a4f3e, 0.95);
    g.fillRoundedRect(cx - 480, cy - 100, 960, 200, 16);
    g.lineStyle(3, COLORS.brass, 0.7);
    g.strokeRoundedRect(cx - 480, cy - 100, 960, 200, 16);
    g.lineStyle(4, COLORS.brass, 0.6);
    g.beginPath();
    g.moveTo(cx - 380, cy);
    g.lineTo(cx + 380, cy);
    g.strokePath();

    const slotPositions = [-300, -100, 100, 300];
    slotPositions.forEach((dx, i) => {
      const sx = cx + dx;
      const sy = cy;
      // Slot bg is the interactive directly (no Container offset)
      const slotBg = this.add.rectangle(sx, sy, 130, 130, COLORS.charDeep, 0.85);
      slotBg.setStrokeStyle(3, COLORS.brassDark, 1);
      slotBg.setDepth(20);
      slotBg.setInteractive({ useHandCursor: true });

      const slotName = this.add.text(sx, sy, '+', {
        fontFamily: FONTS.body,
        fontSize: '64px',
        color: COLORS.hex.brass,
      }).setOrigin(0.5).setDepth(21);

      slotBg.on('pointerdown', () => this.onSlotTap(i));

      this.add.text(sx, sy + 95, `${i + 1}`, {
        fontFamily: FONTS.mono,
        fontSize: '24px',
        color: COLORS.hex.brass,
      }).setOrigin(0.5).setDepth(20);

      // Backward-compat empty container (slot ref used by other code)
      const slotContainer = this.add.container(0, 0);
      this.circuitSlots.push({ container: slotContainer, placedItem: null, name: slotName });
    });

    // Validate button — Rectangle direct interactive
    const btnY = cy + 200;
    const vX = cx;
    const vBg = this.add.rectangle(vX, btnY, 380, 100, COLORS.brassDark, 0.95);
    vBg.setStrokeStyle(3, COLORS.brass, 1);
    vBg.setDepth(20);
    vBg.setInteractive({ useHandCursor: true });
    this.add.text(vX, btnY, 'TESTER', {
      fontFamily: FONTS.mono,
      fontSize: '36px',
      color: COLORS.hex.cream,
      fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(21);
    vBg.on('pointerdown', () => {
      vBg.setFillStyle(COLORS.sunAmber, 1);
      this.time.delayedCall(120, () => vBg.setFillStyle(COLORS.brassDark, 0.95));
      this.validateCircuit();
    });
    this.validateBtn = this.add.container(0, 0); // backward-compat
  }

  private onSlotTap(slotIdx: number): void {
    this.recordTap();
    playSfx('tap');
    const slot = this.circuitSlots[slotIdx];
    const selected = this.inv.getSelected();

    if (slot.placedItem) {
      addItem(slot.placedItem);
      slot.placedItem = null;
      slot.name.setText('+');
      slot.name.setColor(COLORS.hex.brass);
      notifyInventoryChange();
      return;
    }

    if (selected && CIRCUIT_COMPONENTS.includes(selected as ItemId)) {
      removeItem(selected);
      slot.placedItem = selected;
      slot.name.setText(ITEMS[selected].icon);
      slot.name.setColor(COLORS.hex.cream);
      notifyInventoryChange();
      this.inv.clearSelection();
      playSfx('pickup');
    } else {
      this.showNarration('Sélectionne un composant dans ton inventaire (verbe Utiliser), puis touche un emplacement.');
    }
  }

  private validateCircuit(): void {
    this.recordTap();
    const placed = this.circuitSlots.map((s) => s.placedItem);
    const correct = SOLUTIONS.ch3Circuit;

    if (placed.every((p, i) => p === correct[i])) {
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
      targets: led.name,
      alpha: { from: 0.5, to: 1 },
      duration: 200,
      yoyo: true,
      repeat: 4,
      onStart: () => led.name.setColor(COLORS.hex.sunAmber),
    });
  }

  private makeHotspots(): void {
    new Hotspot(this, {
      x: 220,
      y: STAGE_BOTTOM_Y - 380,
      width: 320,
      height: 280,
      name: 'établi',
      onLook: () => {
        this.recordTap();
        this.showNarration(t('scene.ch3.workbench_look'));
      },
      onPick: () => {
        this.recordTap();
        if (!hasProgress('ch3.components_taken')) {
          this.showNarration(t('scene.ch3.workbench_pick'), () => {
            CIRCUIT_COMPONENTS.forEach((c) => addItem(c));
            setProgress('ch3.components_taken');
            notifyInventoryChange();
          });
        } else {
          this.showNarration('Plus de composants ici.');
        }
      },
    });

    new Hotspot(this, {
      x: 90,
      y: STAGE_BOTTOM_Y - 180,
      width: 200,
      height: 240,
      name: 'boîte à outils',
      onLook: () => {
        this.recordTap();
        this.showNarration(t('scene.ch3.toolbox_look'));
      },
      onPick: () => {
        this.recordTap();
        if (!hasItem('tournevis') && !hasProgress('ch3.tools_taken')) {
          this.showNarration(t('scene.ch3.toolbox_pick'), () => {
            addItem('tournevis');
            setProgress('ch3.tools_taken');
            notifyInventoryChange();
          });
        } else {
          this.showNarration(t('scene.ch3.toolbox_look'));
        }
      },
    });

    new Hotspot(this, {
      x: GAME_WIDTH - 220,
      y: HUD.topBarHeight + 480,
      width: 320,
      height: 320,
      name: 'schéma mural',
      onLook: () => {
        this.recordTap();
        this.showNarration(t('scene.ch3.schema_look'));
      },
    });

    new Hotspot(this, {
      x: GAME_WIDTH - 180,
      y: STAGE_BOTTOM_Y - 200,
      width: 280,
      height: 280,
      name: 'terminal',
      onLook: () => {
        this.recordTap();
        this.showNarration(t('scene.ch3.terminal_look'));
      },
    });

    // VERA talk
    new Hotspot(this, {
      x: GAME_WIDTH - 100,
      y: 200,
      width: 200,
      height: 200,
      name: 'VERA',
      showIndicator: false,
      onTalk: () => {
        this.recordTap();
        this.showVera('Cet endroit me met mal à l\'aise, {name}. Continue.');
      },
    });
  }
}
