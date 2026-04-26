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
import { CH3_SPRITES } from '../../data/assets';
import { isCollected } from '../../systems/fragments';

const CIRCUIT_COMPONENTS: ItemId[] = ['comp_resistor', 'comp_capa', 'comp_diode', 'comp_led'];

// Map of which fragment to collect when an item is first picked.
const PICK_FRAGMENT_MAP: Partial<Record<ItemId, string>> = {
  tournevis: 'ch3.blueprint',
  comp_resistor: 'ch3.radio_tome',
  comp_capa: 'ch3.radio_vesper',
  comp_diode: 'ch3.radio_han',
};

export class Ch3Atelier extends PuzzleSceneBase {
  private circuitSlots: Array<{
    container: Phaser.GameObjects.Container;
    placedItem: ItemId | null;
    name: Phaser.GameObjects.Text;
  }> = [];
  private validateBtn?: Phaser.GameObjects.Container;
  private hullPatchHotspot?: Hotspot;
  private hiddenCompartmentHotspot?: Hotspot;

  constructor() {
    super('Ch3Atelier');
  }

  init(): void {
    this.chapter = 3;
    this.nextSceneKey = 'Ch4Coupole';
    this.queueSprites(CH3_SPRITES);
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
          [
            'Bienvenue dans l\'atelier d\'IOLAS. Je préfère cet espace. Il est plein d\'objets qui ont une mémoire.',
            t('vera.ch3.uneasy'),
            t('vera.ch3.task'),
          ],
          () => setProgress('ch3.vera_greeted')
        );
      });
    }
  }

  /**
   * Wraps addItem to also collect a fragment the first time the item is picked.
   * Returns whether the item was newly added to the inventory.
   */
  private addItemWithFragment(id: ItemId): boolean {
    const wasNew = addItem(id);
    if (wasNew) {
      const fragId = PICK_FRAGMENT_MAP[id];
      if (fragId) this.collectFragment(fragId);
    }
    return wasNew;
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

    // Hull breach panel — visible crack on the back wall (centered upper area)
    this.drawHullBreach();

    // Hidden compartment panel — visible (but innocuous) panel on back wall
    this.drawHiddenPanel();

    // Title
    this.add.text(GAME_WIDTH / 2, HUD.topBarHeight + 30, 'MODULE C — ATELIER', {
      fontFamily: FONTS.mono,
      fontSize: '32px',
      color: COLORS.hex.brass,
      fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(50);
  }

  private drawHullBreach(): void {
    // Draw a visible crack on the upper-right portion of the wall
    const cx = GAME_WIDTH / 2 + 220;
    const cy = HUD.topBarHeight + 240;
    const g = this.add.graphics();
    g.setDepth(6);
    g.lineStyle(3, 0x000000, 0.85);
    g.beginPath();
    g.moveTo(cx - 50, cy - 30);
    g.lineTo(cx - 20, cy);
    g.lineTo(cx + 10, cy - 10);
    g.lineTo(cx + 30, cy + 25);
    g.lineTo(cx + 60, cy + 15);
    g.strokePath();
    // Secondary crack branches
    g.lineStyle(2, 0x000000, 0.7);
    g.beginPath();
    g.moveTo(cx - 20, cy);
    g.lineTo(cx - 35, cy + 30);
    g.strokePath();
  }

  private drawHiddenPanel(): void {
    // Subtle riveted panel near upper-left back wall
    const cx = GAME_WIDTH / 2 - 240;
    const cy = HUD.topBarHeight + 280;
    const g = this.add.graphics();
    g.setDepth(6);
    g.lineStyle(2, 0x000000, 0.5);
    g.strokeRect(cx - 40, cy - 40, 80, 80);
    // Rivets
    g.fillStyle(0x000000, 0.6);
    [[-30, -30], [30, -30], [-30, 30], [30, 30]].forEach(([dx, dy]) => {
      g.fillCircle(cx + dx, cy + dy, 3);
    });
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
      // Carte tachée fragment unlocked when circuit assembled correctly
      this.collectFragment('ch3.map_stained');
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
    // === Établi (workbench) ===
    new Hotspot(this, {
      x: 220,
      y: STAGE_BOTTOM_Y - 380,
      width: 320,
      height: 280,
      name: 'établi',
      onLook: () => {
        this.recordTap();
        // First look hints at hidden hotspot underneath
        if (!hasProgress('ch3.workbench_looked_once')) {
          setProgress('ch3.workbench_looked_once');
          this.showNarration('L\'établi est en désordre. Un coin paraît plus poussiéreux...');
        } else {
          this.showNarration(t('scene.ch3.workbench_look'));
        }
      },
      onPick: () => {
        this.recordTap();
        if (!hasProgress('ch3.components_taken')) {
          this.showNarration(t('scene.ch3.workbench_pick'), () => {
            // First-time pick of these components also collects fragments
            CIRCUIT_COMPONENTS.forEach((c) => this.addItemWithFragment(c));
            setProgress('ch3.components_taken');
            notifyInventoryChange();
          });
        } else {
          this.showNarration('Plus de composants ici.');
        }
      },
    });

    // === Voice memo discovery (under workbench) — secret ===
    // A small hot zone low and slightly off the main bench, requires examining workbench first
    new Hotspot(this, {
      x: 280,
      y: STAGE_BOTTOM_Y - 60,
      width: 180,
      height: 90,
      name: 'sous l\'établi',
      showIndicator: false,
      onLook: () => {
        this.recordTap();
        this.handleUnderBench();
      },
      onUse: () => {
        this.recordTap();
        this.handleUnderBench();
      },
      onPick: () => {
        this.recordTap();
        this.handleUnderBenchPick();
      },
    });

    // === Boîte à outils (toolbox) ===
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
            this.addItemWithFragment('tournevis');
            setProgress('ch3.tools_taken');
            notifyInventoryChange();
          });
        } else {
          this.showNarration(t('scene.ch3.toolbox_look'));
        }
      },
    });

    // === Schéma mural ===
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

    // === Terminal ===
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

    // === Hull breach panel — mini-puzzle ===
    this.hullPatchHotspot = new Hotspot(this, {
      x: GAME_WIDTH / 2 + 220,
      y: HUD.topBarHeight + 240,
      width: 200,
      height: 160,
      name: 'fissure de coque',
      onLook: () => {
        this.recordTap();
        if (hasProgress('ch3.hull_patched')) {
          this.showNarration('La fissure est colmatée. Travail propre.');
        } else {
          this.showNarration('Une fissure dans la coque. Patchable.');
        }
      },
      onUse: () => {
        this.recordTap();
        if (hasProgress('ch3.hull_patched')) {
          this.showNarration('Déjà colmatée.');
          return;
        }
        const selected = this.inv.getSelected();
        if (selected === 'tournevis') {
          this.startHullPatchPuzzle();
        } else {
          this.showNarration('Il te faut un outil. Le tournevis devrait suffire.');
        }
      },
    });

    // === Hidden compartment panel ===
    this.hiddenCompartmentHotspot = new Hotspot(this, {
      x: GAME_WIDTH / 2 - 240,
      y: HUD.topBarHeight + 280,
      width: 160,
      height: 160,
      name: 'panneau de coque arrière',
      showIndicator: false,
      onLook: () => {
        this.recordTap();
        this.handleHiddenCompartmentLook();
      },
      onUse: () => {
        this.recordTap();
        this.handleHiddenCompartmentUse();
      },
    });

    // === VERA talk ===
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

  // === Voice memo flow ===

  private handleUnderBench(): void {
    if (!hasProgress('ch3.workbench_looked_once')) {
      // Player hasn't even looked at workbench yet — give a soft nudge
      this.showNarration('Tu n\'as rien remarqué de particulier ici. Examine d\'abord l\'établi.');
      return;
    }
    if (hasItem('voice_recorder') || isCollected('ch3.voice_memo')) {
      this.showNarration('Tu as déjà fouillé sous l\'établi.');
      return;
    }
    setProgress('ch3.under_bench_revealed');
    this.showNarration('Tu trouves un enregistreur vocal sous l\'établi. Le voyant clignote.');
  }

  private handleUnderBenchPick(): void {
    if (!hasProgress('ch3.under_bench_revealed')) {
      this.showNarration('Il n\'y a rien à prendre ici. Pas encore.');
      return;
    }
    if (hasItem('voice_recorder') || isCollected('ch3.voice_memo')) {
      this.showNarration('Tu as déjà l\'enregistreur.');
      return;
    }
    addItem('voice_recorder');
    this.collectFragment('ch3.voice_memo');
    notifyInventoryChange();
    playSfx('pickup');
    this.time.delayedCall(900, () => {
      this.showVera('Vous avez trouvé son message. Écoutez-le quand vous serez prête.');
    });
  }

  // === Hidden compartment flow ===

  private mapStainedKnown(): boolean {
    // Hardcoded hint reveal: player needs the carte fragment OR map_stained item.
    return isCollected('ch3.map_stained') || hasItem('cle_atelier');
  }

  private handleHiddenCompartmentLook(): void {
    if (hasProgress('ch3.compartment_opened')) {
      this.showNarration('Le compartiment est ouvert. Vide à présent.');
      return;
    }
    if (this.mapStainedKnown()) {
      setProgress('ch3.compartment_revealed');
      this.showNarration('Tu te souviens de la carte. C\'est ici qu\'IOLAS marquait un compartiment.');
    } else {
      this.showNarration('Un panneau de coque. Rien d\'apparent.');
    }
  }

  private handleHiddenCompartmentUse(): void {
    if (hasProgress('ch3.compartment_opened')) {
      this.showNarration('Déjà ouvert.');
      return;
    }
    if (!this.mapStainedKnown() || !hasProgress('ch3.compartment_revealed')) {
      this.showNarration('Rien ne suggère qu\'on puisse l\'ouvrir.');
      return;
    }
    const selected = this.inv.getSelected();
    if (selected !== 'tournevis') {
      this.showNarration('Le panneau est rivé. Il te faut un tournevis.');
      return;
    }
    setProgress('ch3.compartment_opened');
    addItem('graine_lumira');
    this.collectFragment('ch3.secret_seed');
    notifyInventoryChange();
    playSfx('success');
    this.showNarration('Tu dévisses le panneau. Une graine pulsante. Et un mot d\'IOLAS.');
  }

  // === Hull patch mini-puzzle ===

  private startHullPatchPuzzle(): void {
    if (hasProgress('ch3.hull_patched')) return;
    new HullPatchPanel(this, {
      onSuccess: () => {
        setProgress('ch3.hull_patched');
        // Collect the Vesper radio fragment if not already
        if (!isCollected('ch3.radio_vesper')) {
          this.collectFragment('ch3.radio_vesper');
        }
        playSfx('success');
        this.showNarration('La coque est colmatée. Travail propre.');
      },
    });
  }
}

// =====================================================================
// HullPatchPanel — modal mini-puzzle: tap each button while it's lit.
// 3 buttons (Patch / Souder / Sceller) light up sequentially with a ~1s
// window each. Miss → retry. Success → onSuccess callback.
// =====================================================================

interface HullPatchOpts {
  onSuccess: () => void;
}

class HullPatchPanel {
  private scene: Phaser.Scene;
  private opts: HullPatchOpts;
  private root: Phaser.GameObjects.Container;
  private buttons: Phaser.GameObjects.Rectangle[] = [];
  private labels: Phaser.GameObjects.Text[] = [];
  private currentStep = 0;
  private litUntil = 0;
  private litIdx = -1;
  private status!: Phaser.GameObjects.Text;
  private scheduled?: Phaser.Time.TimerEvent;
  private updateLoop?: Phaser.Time.TimerEvent;
  private finished = false;

  constructor(scene: Phaser.Scene, opts: HullPatchOpts) {
    this.scene = scene;
    this.opts = opts;

    this.root = scene.add.container(0, 0);
    this.root.setDepth(2200);

    // Backdrop blocks input
    const backdrop = scene.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.7).setOrigin(0);
    backdrop.setInteractive();
    backdrop.on('pointerdown', () => {});
    this.root.add(backdrop);

    // Modal panel
    const panelW = 720;
    const panelH = 460;
    const px = (GAME_WIDTH - panelW) / 2;
    const py = (GAME_HEIGHT - panelH) / 2;
    const panel = scene.add.rectangle(px, py, panelW, panelH, COLORS.charDeep, 0.98).setOrigin(0);
    panel.setStrokeStyle(3, COLORS.brass, 1);
    this.root.add(panel);

    // Title
    const title = scene.add.text(GAME_WIDTH / 2, py + 40, 'COLMATAGE', {
      fontFamily: FONTS.mono,
      fontSize: '32px',
      color: COLORS.hex.brass,
      fontStyle: 'bold',
    }).setOrigin(0.5);
    this.root.add(title);

    const sub = scene.add.text(GAME_WIDTH / 2, py + 80, 'Tape chaque bouton quand il s\'allume', {
      fontFamily: FONTS.body,
      fontSize: '22px',
      color: COLORS.hex.cream,
    }).setOrigin(0.5);
    this.root.add(sub);

    // 3 buttons
    const labels = ['PATCH', 'SOUDER', 'SCELLER'];
    const baseY = py + 220;
    const spacing = 200;
    labels.forEach((text, i) => {
      const bx = GAME_WIDTH / 2 + (i - 1) * spacing;
      const btn = scene.add.rectangle(bx, baseY, 160, 100, COLORS.brassDark, 1)
        .setStrokeStyle(3, COLORS.brass, 1);
      btn.setInteractive({ useHandCursor: true });
      btn.on('pointerdown', () => this.onBtnTap(i));
      this.buttons.push(btn);
      const lab = scene.add.text(bx, baseY, text, {
        fontFamily: FONTS.mono,
        fontSize: '24px',
        color: COLORS.hex.cream,
        fontStyle: 'bold',
      }).setOrigin(0.5);
      this.labels.push(lab);
      this.root.add(btn);
      this.root.add(lab);
    });

    // Status text
    this.status = scene.add.text(GAME_WIDTH / 2, py + panelH - 100, 'Prépare-toi...', {
      fontFamily: FONTS.body,
      fontSize: '22px',
      color: COLORS.hex.cream,
    }).setOrigin(0.5);
    this.root.add(this.status);

    // Close (cancel) button
    const closeBtn = scene.add.rectangle(GAME_WIDTH / 2, py + panelH - 50, 220, 60, COLORS.brassDark, 0.95)
      .setStrokeStyle(2, COLORS.brass, 1);
    closeBtn.setInteractive({ useHandCursor: true });
    closeBtn.on('pointerdown', () => this.close());
    const closeLab = scene.add.text(GAME_WIDTH / 2, py + panelH - 50, 'ABANDONNER', {
      fontFamily: FONTS.mono,
      fontSize: '20px',
      color: COLORS.hex.cream,
    }).setOrigin(0.5);
    this.root.add(closeBtn);
    this.root.add(closeLab);

    // Start sequence after a short delay
    this.scheduled = scene.time.delayedCall(800, () => this.runStep());

    // Watch for window timeout
    this.updateLoop = scene.time.addEvent({
      delay: 100,
      loop: true,
      callback: () => this.tick(),
    });
  }

  private runStep(): void {
    if (this.finished) return;
    if (this.currentStep >= 3) {
      this.success();
      return;
    }
    this.litIdx = this.currentStep;
    this.litUntil = this.scene.time.now + 1000; // 1s window
    const btn = this.buttons[this.litIdx];
    btn.setFillStyle(COLORS.sunAmber, 1);
    this.labels[this.litIdx].setColor(COLORS.hex.charDeep);
    this.status.setText(`${this.currentStep + 1} / 3 — vas-y !`);
  }

  private tick(): void {
    if (this.finished) return;
    if (this.litIdx >= 0 && this.scene.time.now > this.litUntil) {
      // Window expired
      this.fail();
    }
  }

  private onBtnTap(i: number): void {
    if (this.finished) return;
    playSfx('tap');
    if (i === this.litIdx && this.scene.time.now <= this.litUntil) {
      // Correct
      this.resetButton(i);
      this.litIdx = -1;
      this.currentStep++;
      this.scene.time.delayedCall(300, () => this.runStep());
    } else {
      this.fail();
    }
  }

  private resetButton(i: number): void {
    this.buttons[i].setFillStyle(COLORS.brassDark, 1);
    this.labels[i].setColor(COLORS.hex.cream);
  }

  private fail(): void {
    if (this.finished) return;
    if (this.litIdx >= 0) this.resetButton(this.litIdx);
    this.litIdx = -1;
    this.currentStep = 0;
    this.status.setText('Tu as raté un step. Réessaie.');
    playSfx('fail');
    this.scene.time.delayedCall(900, () => this.runStep());
  }

  private success(): void {
    if (this.finished) return;
    this.finished = true;
    this.status.setText('Coque colmatée.');
    this.scheduled?.remove(false);
    this.updateLoop?.remove(false);
    this.scene.time.delayedCall(700, () => {
      this.opts.onSuccess();
      this.destroy();
    });
  }

  private close(): void {
    if (this.finished) return;
    this.finished = true;
    this.scheduled?.remove(false);
    this.updateLoop?.remove(false);
    this.destroy();
  }

  private destroy(): void {
    this.root.destroy(true);
  }
}
