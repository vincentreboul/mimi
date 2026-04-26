import * as Phaser from 'phaser';
import { COLORS, FONTS, GAME_WIDTH, GAME_HEIGHT, HUD, STAGE_BOTTOM_Y } from '../../config';
import { PuzzleSceneBase } from './PuzzleSceneBase';
import { PixelScene } from '../../objects/PixelScene';
import { Hotspot } from '../../objects/Hotspot';
import { addItem, hasItem, removeItem, notifyInventoryChange } from '../../systems/inventory';
import { setProgress, hasProgress, setFlag, getPlayer } from '../../systems/save';
import { PUZZLE_IDS, SOLUTIONS } from '../../data/puzzles';
import { t } from '../../systems/narrative';
import { ITEMS, type ItemId } from '../../data/items';
import { playSfx } from '../../systems/audio';

export class Ch4Coupole extends PuzzleSceneBase {
  private leftSlot?: { container: Phaser.GameObjects.Container; placed: ItemId | null; name: Phaser.GameObjects.Text };
  private rightSlot?: { container: Phaser.GameObjects.Container; placed: ItemId | null; name: Phaser.GameObjects.Text };
  private alignBtn?: Phaser.GameObjects.Container;
  private telescopeAligned = false;
  private choiceContainer?: Phaser.GameObjects.Container;

  constructor() {
    super('Ch4Coupole');
  }

  init(): void {
    this.chapter = 4;
    this.nextSceneKey = 'EpilogueScene';
  }

  create(): void {
    this.cameras.main.fadeIn(700, 31, 77, 62);
    this.composeBackground();
    this.setupHud(PUZZLE_IDS.ch4Crystals);
    this.makeTelescope(GAME_WIDTH / 2, STAGE_BOTTOM_Y - 280);
    this.makeHotspots();

    if (!hasProgress('ch4.vera_greeted')) {
      this.time.delayedCall(800, () => {
        this.showVeraSequence(
          [t('vera.ch4.greeting'), t('vera.ch4.task')],
          () => setProgress('ch4.vera_greeted')
        );
      });
    }
  }

  private composeBackground(): void {
    // Deep space
    PixelScene.stageBackground(this, 0x05080f);

    // Stars
    const stars = this.add.graphics();
    stars.setDepth(-900);
    stars.fillStyle(0xf4e9d8, 0.95);
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * GAME_WIDTH;
      const y = Math.random() * (STAGE_BOTTOM_Y * 0.7);
      stars.fillRect(x, y, 2, 2);
    }

    // Earth — large soft circle (drawn since no Earth sprite)
    const earth = this.add.graphics();
    earth.setDepth(-800);
    const ex = GAME_WIDTH / 2;
    const ey = HUD.topBarHeight + 380;
    // Halo
    earth.fillStyle(0xa8dadc, 0.35);
    earth.fillCircle(ex, ey, 320);
    // Earth body
    earth.fillStyle(0xa8dadc, 0.95);
    earth.fillCircle(ex, ey, 280);
    // Continents (greens)
    earth.fillStyle(0x7fb069, 0.85);
    earth.fillCircle(ex - 60, ey - 30, 130);
    earth.fillStyle(0x7fb069, 0.75);
    earth.fillCircle(ex + 80, ey + 50, 90);
    earth.fillStyle(0x7fb069, 0.65);
    earth.fillCircle(ex + 40, ey - 80, 60);
    // Atmosphere ring
    earth.lineStyle(6, 0xa8dadc, 0.55);
    earth.strokeCircle(ex, ey, 290);

    // Floor
    PixelScene.tileH(this, 'floor1', STAGE_BOTTOM_Y - 30, 6);

    // Window-frame around the Earth (the dome of the coupole)
    const frame = this.add.graphics();
    frame.setDepth(2);
    frame.lineStyle(8, COLORS.brass, 1);
    frame.strokeCircle(ex, ey, 360);
    // Spokes
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      frame.beginPath();
      frame.moveTo(ex, ey);
      frame.lineTo(ex + Math.cos(a) * 360, ey + Math.sin(a) * 360);
      frame.strokePath();
    }

    // Workstation on the left
    PixelScene.place(this, 'computerStation1', 220, STAGE_BOTTOM_Y - 70, 6, { depth: 7 });
    PixelScene.place(this, 'chair', 100, STAGE_BOTTOM_Y - 70, 4, { depth: 7 });

    // Beacon on the right
    PixelScene.place(this, 'wallDevice', GAME_WIDTH - 220, STAGE_BOTTOM_Y - 320, 5, { depth: 7 });
    PixelScene.place(this, 'baril1', GAME_WIDTH - 220, STAGE_BOTTOM_Y - 70, 5, { depth: 7 });

    // Title
    this.add.text(GAME_WIDTH / 2, HUD.topBarHeight + 30, 'MODULE D — COUPOLE', {
      fontFamily: FONTS.mono,
      fontSize: '32px',
      color: COLORS.hex.cream,
      fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(50);
  }

  private makeTelescope(cx: number, cy: number): void {
    // Telescope body — drawn (no perfect sprite)
    const g = this.add.graphics();
    g.setDepth(-50);
    g.fillStyle(COLORS.brassDark, 0.95);
    g.fillRoundedRect(cx - 180, cy - 60, 360, 120, 16);
    g.fillStyle(COLORS.brass, 0.8);
    g.fillCircle(cx + 200, cy, 60);
    g.fillStyle(COLORS.charDeep, 1);
    g.fillCircle(cx + 200, cy, 38);

    // Two crystal slots
    const leftSlotC = this.add.container(cx - 80, cy);
    const lBg = this.add.rectangle(0, 0, 120, 120, COLORS.leafDeep, 0.95);
    lBg.setStrokeStyle(3, COLORS.brassDark, 1);
    const lName = this.add.text(0, 0, '◇', {
      fontFamily: FONTS.body,
      fontSize: '64px',
      color: COLORS.hex.brass,
    }).setOrigin(0.5);
    lName.setAlpha(0.4);
    leftSlotC.add([lBg, lName]);
    leftSlotC.setSize(120, 120);
    leftSlotC.setInteractive(new Phaser.Geom.Rectangle(-60, -60, 120, 120), Phaser.Geom.Rectangle.Contains);
    leftSlotC.setDepth(20);
    leftSlotC.on('pointerdown', () => this.onSlotTap('left'));
    this.leftSlot = { container: leftSlotC, placed: null, name: lName };

    const rightSlotC = this.add.container(cx + 80, cy);
    const rBg = this.add.rectangle(0, 0, 120, 120, COLORS.leafDeep, 0.95);
    rBg.setStrokeStyle(3, COLORS.brassDark, 1);
    const rName = this.add.text(0, 0, '◈', {
      fontFamily: FONTS.body,
      fontSize: '64px',
      color: COLORS.hex.brass,
    }).setOrigin(0.5);
    rName.setAlpha(0.4);
    rightSlotC.add([rBg, rName]);
    rightSlotC.setSize(120, 120);
    rightSlotC.setInteractive(new Phaser.Geom.Rectangle(-60, -60, 120, 120), Phaser.Geom.Rectangle.Contains);
    rightSlotC.setDepth(20);
    rightSlotC.on('pointerdown', () => this.onSlotTap('right'));
    this.rightSlot = { container: rightSlotC, placed: null, name: rName };

    // Align button
    this.alignBtn = this.add.container(cx, cy + 130);
    const aBg = this.add.rectangle(0, 0, 320, 90, COLORS.brassDark, 0.95);
    aBg.setStrokeStyle(3, COLORS.brass, 1);
    const aTxt = this.add.text(0, 0, 'ALIGNER', {
      fontFamily: FONTS.mono,
      fontSize: '36px',
      color: COLORS.hex.cream,
      fontStyle: 'bold',
    }).setOrigin(0.5);
    this.alignBtn.add([aBg, aTxt]);
    this.alignBtn.setSize(320, 90);
    this.alignBtn.setInteractive(new Phaser.Geom.Rectangle(-160, -45, 320, 90), Phaser.Geom.Rectangle.Contains);
    this.alignBtn.setDepth(20);
    this.alignBtn.on('pointerdown', () => this.tryAlign());
  }

  private onSlotTap(side: 'left' | 'right'): void {
    this.recordTap();
    playSfx('tap');
    const slot = side === 'left' ? this.leftSlot! : this.rightSlot!;
    const selected = this.inv.getSelected();

    if (slot.placed) {
      addItem(slot.placed);
      slot.placed = null;
      slot.name.setAlpha(0.4);
      slot.name.setColor(COLORS.hex.brass);
      slot.name.setText(side === 'left' ? '◇' : '◈');
      notifyInventoryChange();
      return;
    }

    if (selected && (selected === 'cristal_a' || selected === 'cristal_b')) {
      removeItem(selected);
      slot.placed = selected as ItemId;
      slot.name.setAlpha(1);
      slot.name.setColor(selected === 'cristal_a' ? COLORS.hex.skyPale : COLORS.hex.sunAmber);
      slot.name.setText(ITEMS[selected].icon);
      notifyInventoryChange();
      this.inv.clearSelection();
      playSfx('pickup');
    } else {
      this.showNarration('Sélectionne un cristal dans ton inventaire, puis touche un emplacement.');
    }
  }

  private tryAlign(): void {
    this.recordTap();
    const sol = SOLUTIONS.ch4Crystals;
    const left = this.leftSlot?.placed;
    const right = this.rightSlot?.placed;

    if (left === sol.left && right === sol.right) {
      playSfx('success');
      this.telescopeAligned = true;
      setProgress('ch4.solved');
      this.alignBtn?.disableInteractive();
      const aTxt = this.alignBtn?.getAt(1) as Phaser.GameObjects.Text;
      aTxt.setText('ALIGNÉ ✓');
      aTxt.setColor(COLORS.hex.sunAmber);
      this.showVera(t('vera.ch4.task_done'), () => {
        this.showVera(t('vera.ch4.truth'), () => {
          this.showFinalChoice();
        });
      });
    } else if (!left || !right) {
      playSfx('fail');
      this.showVera('Les deux emplacements doivent contenir un cristal.');
    } else {
      playSfx('fail');
      this.showVera('Les cristaux ne sont pas dans le bon ordre. Inverse-les peut-être.');
      this.cameras.main.shake(150, 0.004);
    }
  }

  private showFinalChoice(): void {
    if (this.choiceContainer) return;
    const c = this.add.container(GAME_WIDTH / 2, GAME_HEIGHT / 2);
    c.setDepth(7000);
    const overlay = this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, COLORS.charDeep, 0.92);
    c.add(overlay);
    const title = this.add.text(0, -500, 'Ton choix, ' + (getPlayer().name || '...'), {
      fontFamily: FONTS.display,
      fontSize: '64px',
      color: COLORS.hex.cream,
      fontStyle: 'bold',
    }).setOrigin(0.5);
    c.add(title);
    const body = this.add.text(0, -250, t('vera.ch4.choice'), {
      fontFamily: FONTS.body,
      fontSize: '30px',
      color: COLORS.hex.cream,
      align: 'center',
      wordWrap: { width: GAME_WIDTH - 200 },
      lineSpacing: 12,
    }).setOrigin(0.5);
    c.add(body);
    const returnBtn = this.makeChoiceButton(0, 220, 'Activer la balise — rentrer sur Terre', () => this.endGame('return'));
    c.add(returnBtn);
    const stayBtn = this.makeChoiceButton(0, 360, 'Désactiver la balise — rester avec VERA', () => this.endGame('stay'));
    c.add(stayBtn);
    this.choiceContainer = c;
    this.tweens.add({ targets: c, alpha: { from: 0, to: 1 }, duration: 600 });
  }

  private makeChoiceButton(x: number, y: number, label: string, onTap: () => void): Phaser.GameObjects.Container {
    const c = this.add.container(x, y);
    const bg = this.add.rectangle(0, 0, 800, 110, COLORS.brassDark, 0.95);
    bg.setStrokeStyle(2, COLORS.brass, 1);
    const txt = this.add.text(0, 0, label, {
      fontFamily: FONTS.body,
      fontSize: '30px',
      color: COLORS.hex.cream,
      align: 'center',
      wordWrap: { width: 760 },
    }).setOrigin(0.5);
    c.add([bg, txt]);
    c.setSize(800, 110);
    c.setInteractive(new Phaser.Geom.Rectangle(-400, -55, 800, 110), Phaser.Geom.Rectangle.Contains);
    c.on('pointerdown', () => {
      playSfx('tap');
      this.tweens.add({ targets: c, scale: { from: 1, to: 0.96 }, duration: 80, yoyo: true, onComplete: onTap });
    });
    return c;
  }

  private endGame(ending: 'return' | 'stay'): void {
    setFlag('endingChoice', ending === 'return' ? 1 : 2);
    setProgress('game.complete');
    this.fadeToScene('EpilogueScene', { ending });
  }

  private makeHotspots(): void {
    new Hotspot(this, {
      x: 220,
      y: STAGE_BOTTOM_Y - 230,
      width: 320,
      height: 280,
      name: 'poste de travail',
      onLook: () => {
        this.recordTap();
        this.showNarration(t('scene.ch4.workstation_look'));
      },
      onPick: () => {
        this.recordTap();
        if (!hasProgress('ch4.workstation_taken')) {
          this.showNarration(t('scene.ch4.workstation_pick'), () => {
            addItem('cristal_a');
            addItem('cristal_b');
            addItem('log_capitaine');
            setProgress('ch4.workstation_taken');
            notifyInventoryChange();
          });
        } else {
          this.showNarration(t('scene.ch4.workstation_look'));
        }
      },
    });

    // Hublot decorative
    new Hotspot(this, {
      x: GAME_WIDTH / 2,
      y: HUD.topBarHeight + 380,
      width: 700,
      height: 700,
      name: 'la Terre',
      onLook: () => {
        this.recordTap();
        this.showNarration(t('scene.ch4.hublot_look'));
      },
    });

    // Beacon
    new Hotspot(this, {
      x: GAME_WIDTH - 220,
      y: STAGE_BOTTOM_Y - 230,
      width: 280,
      height: 480,
      name: 'balise de détresse',
      onLook: () => {
        this.recordTap();
        this.showNarration(t('scene.ch4.beacon_look'));
      },
      onUse: () => {
        this.recordTap();
        if (!this.telescopeAligned) {
          this.showVera(t('scene.ch4.beacon_use_locked'));
        } else if (!this.choiceContainer) {
          this.showFinalChoice();
        }
      },
    });

    // VERA
    new Hotspot(this, {
      x: GAME_WIDTH - 100,
      y: 200,
      width: 200,
      height: 200,
      name: 'VERA',
      showIndicator: false,
      onTalk: () => {
        this.recordTap();
        this.showVera('Je suis là, {name}. Pour ce que ça vaut.');
      },
    });
  }
}
