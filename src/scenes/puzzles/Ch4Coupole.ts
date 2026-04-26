import * as Phaser from 'phaser';
import { COLORS, FONTS, GAME_WIDTH, GAME_HEIGHT } from '../../config';
import { PuzzleSceneBase } from './PuzzleSceneBase';
import { SceneBackground } from '../../objects/SceneBackground';
import { Hotspot } from '../../objects/Hotspot';
import { addItem, hasItem, removeItem, notifyInventoryChange } from '../../systems/inventory';
import { setProgress, hasProgress, setFlag, getFlag } from '../../systems/save';
import { PUZZLE_IDS, SOLUTIONS } from '../../data/puzzles';
import { t } from '../../systems/narrative';
import { ITEMS, type ItemId } from '../../data/items';
import { playSfx } from '../../systems/audio';

export class Ch4Coupole extends PuzzleSceneBase {
  private leftSlot?: { container: Phaser.GameObjects.Container; placed: ItemId | null; label: Phaser.GameObjects.Text };
  private rightSlot?: { container: Phaser.GameObjects.Container; placed: ItemId | null; label: Phaser.GameObjects.Text };
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
    SceneBackground.draw(this, 'coupole');

    this.add.text(GAME_WIDTH / 2, 200, 'COUPOLE — Module D', {
      fontFamily: FONTS.mono,
      fontSize: '36px',
      color: COLORS.hex.cream,
    }).setOrigin(0.5);

    this.setupHud(PUZZLE_IDS.ch4Crystals);

    // Workstation — gives crystals + log
    this.drawWorkstation(220, GAME_HEIGHT - 800);
    new Hotspot(this, {
      x: 220,
      y: GAME_HEIGHT - 800,
      width: 280,
      height: 240,
      label: 'Poste de Léa',
      onTap: () => {
        this.recordTap();
        if (!hasProgress('ch4.workstation_taken')) {
          this.showNarration(t('scene.ch4.workstation'), () => {
            addItem('cristal_a');
            addItem('cristal_b');
            addItem('log_capitaine');
            setProgress('ch4.workstation_taken');
            notifyInventoryChange();
          });
        } else {
          this.showNarration(t('scene.ch4.workstation'));
        }
      },
    });

    // Telescope
    this.makeTelescope(GAME_WIDTH / 2, GAME_HEIGHT - 1200);

    // Hublot decorative
    new Hotspot(this, {
      x: GAME_WIDTH / 2,
      y: 700,
      width: 800,
      height: 800,
      label: 'Hublot principal',
      onTap: () => {
        this.recordTap();
        this.showNarration(t('scene.ch4.hublot'));
      },
    });

    // Beacon — only enabled after telescope aligned
    this.drawBeacon(GAME_WIDTH - 220, GAME_HEIGHT - 800);
    new Hotspot(this, {
      x: GAME_WIDTH - 220,
      y: GAME_HEIGHT - 800,
      width: 220,
      height: 240,
      label: 'Balise',
      onTap: () => {
        this.recordTap();
        if (!this.telescopeAligned) {
          this.showVera('La balise n\'est pas alignée. Le télescope doit l\'être d\'abord.');
        } else if (this.choiceContainer) {
          // already showing choice
        } else {
          this.showFinalChoice();
        }
      },
    });

    // VERA welcome
    if (!hasProgress('ch4.vera_greeted')) {
      this.time.delayedCall(800, () => {
        this.showVeraSequence(
          [t('vera.ch4.greeting'), t('vera.ch4.task')],
          () => setProgress('ch4.vera_greeted')
        );
      });
    }
  }

  private makeTelescope(cx: number, cy: number): void {
    const g = this.add.graphics();
    g.setDepth(-50);
    // Telescope body
    g.fillStyle(COLORS.brassDark, 0.95);
    g.fillRoundedRect(cx - 180, cy - 60, 360, 120, 16);
    g.fillStyle(COLORS.brass, 0.8);
    g.fillCircle(cx + 200, cy, 60);
    g.fillStyle(COLORS.charDeep, 1);
    g.fillCircle(cx + 200, cy, 38);

    // Two crystal slots
    const leftSlotC = this.add.container(cx - 80, cy);
    const lBg = this.add.rectangle(0, 0, 110, 110, COLORS.leafDeep, 0.95);
    lBg.setStrokeStyle(3, COLORS.brassDark, 1);
    const lLabel = this.add.text(0, 0, '◇', {
      fontFamily: FONTS.body,
      fontSize: '52px',
      color: COLORS.hex.brass,
    }).setOrigin(0.5);
    lLabel.setAlpha(0.4);
    leftSlotC.add([lBg, lLabel]);
    leftSlotC.setSize(110, 110);
    leftSlotC.setInteractive(new Phaser.Geom.Rectangle(-55, -55, 110, 110), Phaser.Geom.Rectangle.Contains);
    leftSlotC.on('pointerdown', () => this.onSlotTap('left'));
    this.leftSlot = { container: leftSlotC, placed: null, label: lLabel };

    const rightSlotC = this.add.container(cx + 80, cy);
    const rBg = this.add.rectangle(0, 0, 110, 110, COLORS.leafDeep, 0.95);
    rBg.setStrokeStyle(3, COLORS.brassDark, 1);
    const rLabel = this.add.text(0, 0, '◈', {
      fontFamily: FONTS.body,
      fontSize: '52px',
      color: COLORS.hex.brass,
    }).setOrigin(0.5);
    rLabel.setAlpha(0.4);
    rightSlotC.add([rBg, rLabel]);
    rightSlotC.setSize(110, 110);
    rightSlotC.setInteractive(new Phaser.Geom.Rectangle(-55, -55, 110, 110), Phaser.Geom.Rectangle.Contains);
    rightSlotC.on('pointerdown', () => this.onSlotTap('right'));
    this.rightSlot = { container: rightSlotC, placed: null, label: rLabel };

    // Align button
    this.alignBtn = this.add.container(cx, cy + 130);
    const aBg = this.add.rectangle(0, 0, 280, 70, COLORS.brassDark, 0.9);
    aBg.setStrokeStyle(2, COLORS.brass, 1);
    const aTxt = this.add.text(0, 0, 'ALIGNER', {
      fontFamily: FONTS.mono,
      fontSize: '28px',
      color: COLORS.hex.cream,
      fontStyle: 'bold',
    }).setOrigin(0.5);
    this.alignBtn.add([aBg, aTxt]);
    this.alignBtn.setSize(280, 70);
    this.alignBtn.setInteractive(new Phaser.Geom.Rectangle(-140, -35, 280, 70), Phaser.Geom.Rectangle.Contains);
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
      slot.label.setAlpha(0.4);
      slot.label.setColor(COLORS.hex.brass);
      slot.label.setText(side === 'left' ? '◇' : '◈');
      notifyInventoryChange();
      return;
    }

    if (selected && (selected === 'cristal_a' || selected === 'cristal_b')) {
      removeItem(selected);
      slot.placed = selected as ItemId;
      slot.label.setAlpha(1);
      slot.label.setColor(selected === 'cristal_a' ? COLORS.hex.skyPale : COLORS.hex.sunAmber);
      slot.label.setText(ITEMS[selected].icon);
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

    const title = this.add.text(0, -500, 'Ton choix', {
      fontFamily: FONTS.display,
      fontSize: '72px',
      color: COLORS.hex.cream,
      fontStyle: 'bold',
    }).setOrigin(0.5);
    c.add(title);

    const body = this.add.text(0, -250, t('vera.ch4.choice'), {
      fontFamily: FONTS.body,
      fontSize: '32px',
      color: COLORS.hex.cream,
      align: 'center',
      wordWrap: { width: GAME_WIDTH - 200 },
      lineSpacing: 12,
    }).setOrigin(0.5);
    c.add(body);

    const returnBtn = this.makeChoiceButton(0, 200, 'Activer la balise — rentrer sur Terre', () => {
      this.endGame('return');
    });
    c.add(returnBtn);

    const stayBtn = this.makeChoiceButton(0, 320, 'Désactiver la balise — rester avec VERA', () => {
      this.endGame('stay');
    });
    c.add(stayBtn);

    this.choiceContainer = c;

    this.tweens.add({
      targets: c,
      alpha: { from: 0, to: 1 },
      duration: 600,
    });
  }

  private makeChoiceButton(x: number, y: number, label: string, onTap: () => void): Phaser.GameObjects.Container {
    const c = this.add.container(x, y);
    const bg = this.add.rectangle(0, 0, 720, 90, COLORS.brassDark, 0.95);
    bg.setStrokeStyle(2, COLORS.brass, 1);
    const txt = this.add.text(0, 0, label, {
      fontFamily: FONTS.body,
      fontSize: '28px',
      color: COLORS.hex.cream,
      align: 'center',
    }).setOrigin(0.5);
    c.add([bg, txt]);
    c.setSize(720, 90);
    c.setInteractive(new Phaser.Geom.Rectangle(-360, -45, 720, 90), Phaser.Geom.Rectangle.Contains);
    c.on('pointerdown', () => {
      this.tweens.add({
        targets: c,
        scale: { from: 1, to: 0.96 },
        duration: 80,
        yoyo: true,
        onComplete: onTap,
      });
    });
    return c;
  }

  private endGame(ending: 'return' | 'stay'): void {
    setFlag('endingChoice', ending === 'return' ? 1 : 2);
    setProgress('game.complete');
    this.fadeToScene('EpilogueScene', { ending });
  }

  // === Decorative shapes ===
  private drawWorkstation(x: number, y: number): void {
    const g = this.add.graphics();
    g.setDepth(-100);
    g.fillStyle(COLORS.charDeep, 0.95);
    g.fillRoundedRect(x - 140, y - 120, 280, 240, 12);
    // monitor
    g.fillStyle(COLORS.skyPale, 0.7);
    g.fillRect(x - 110, y - 100, 220, 130);
    // mug
    g.fillStyle(COLORS.brass, 0.9);
    g.fillRoundedRect(x - 90, y + 60, 50, 40, 4);
    // crystals shimmer
    g.fillStyle(COLORS.skyPale, 0.9);
    g.fillCircle(x + 70, y + 70, 10);
    g.fillStyle(COLORS.sunAmber, 0.9);
    g.fillCircle(x + 100, y + 70, 10);
  }

  private drawBeacon(x: number, y: number): void {
    const g = this.add.graphics();
    g.setDepth(-100);
    g.fillStyle(COLORS.charDeep, 0.95);
    g.fillRoundedRect(x - 110, y - 120, 220, 240, 12);
    // red panel
    g.fillStyle(COLORS.warning, 0.85);
    g.fillRect(x - 70, y - 60, 140, 80);
    // button
    g.fillStyle(COLORS.warning, 1);
    g.fillCircle(x, y - 20, 30);
    g.fillStyle(COLORS.cream, 0.9);
    g.fillCircle(x, y - 20, 18);
    // antenna
    g.lineStyle(4, COLORS.brass, 0.9);
    g.beginPath();
    g.moveTo(x, y - 120);
    g.lineTo(x, y - 200);
    g.strokePath();
    g.fillStyle(COLORS.sunAmber, 0.9);
    g.fillCircle(x, y - 200, 10);
  }
}
