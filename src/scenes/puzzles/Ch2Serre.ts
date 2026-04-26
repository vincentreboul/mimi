import * as Phaser from 'phaser';
import { COLORS, FONTS, GAME_WIDTH, GAME_HEIGHT, HUD, STAGE_BOTTOM_Y } from '../../config';
import { PuzzleSceneBase } from './PuzzleSceneBase';
import { PixelScene } from '../../objects/PixelScene';
import { Hotspot } from '../../objects/Hotspot';
import { addItem, hasItem, removeItem, notifyInventoryChange } from '../../systems/inventory';
import { setProgress, hasProgress } from '../../systems/save';
import { PUZZLE_IDS } from '../../data/puzzles';
import { t } from '../../systems/narrative';
import type { ItemId } from '../../data/items';
import { CH2_SPRITES } from '../../data/assets';

export class Ch2Serre extends PuzzleSceneBase {
  constructor() {
    super('Ch2Serre');
  }

  init(): void {
    this.chapter = 2;
    this.nextSceneKey = 'Ch3Atelier';
    this.queueSprites(CH2_SPRITES);
  }

  create(): void {
    this.cameras.main.fadeIn(500, 31, 77, 62);
    this.composeBackground();
    this.setupHud(PUZZLE_IDS.ch2Fert);
    this.makeHotspots();
    this.spawnPollen();
    this.spawnLumiraGlow();

    if (!hasProgress('ch2.vera_greeted')) {
      this.time.delayedCall(700, () => {
        this.showVeraSequence(
          [t('vera.ch2.greeting'), t('vera.ch2.task')],
          () => setProgress('ch2.vera_greeted')
        );
      });
    }
  }

  private composeBackground(): void {
    PixelScene.stageBackground(this, 0x2d5a3a);

    const g = this.add.graphics();
    g.setDepth(-900);
    g.fillStyle(0xf4e9d8, 0.05);
    for (let i = 0; i < 5; i++) {
      g.fillTriangle(i * 270, 0, i * 270 + 200, 0, i * 270 + 100, GAME_HEIGHT);
    }

    PixelScene.tileH(this, 'floor2', STAGE_BOTTOM_Y - 30, 6);
    PixelScene.tileH(this, 'wall4Light', HUD.topBarHeight + 555, 5, 0, GAME_WIDTH, { origin: { x: 0, y: 1 } });
    PixelScene.place(this, 'wallWindow', GAME_WIDTH / 2, HUD.topBarHeight + 660, 6, { origin: { x: 0.5, y: 1 } });

    const ceilY = HUD.topBarHeight + 50;
    const plantKeys = ['green00', 'green05', 'green09', 'green18'];
    plantKeys.forEach((k, i) => {
      const x = 200 + i * 220;
      PixelScene.place(this, k, x, ceilY + 220, 1.6, { origin: { x: 0.5, y: 1 }, depth: 4 });
    });

    PixelScene.place(this, 'bush1', 150, STAGE_BOTTOM_Y - 60, 1.4, { origin: { x: 0.5, y: 1 }, depth: 6 });
    PixelScene.place(this, 'bush2', GAME_WIDTH - 150, STAGE_BOTTOM_Y - 60, 1.4, { origin: { x: 0.5, y: 1 }, depth: 6 });

    // Lumira (puzzle target)
    PixelScene.place(this, 'orange1', GAME_WIDTH / 2, STAGE_BOTTOM_Y - 60, 2.2, { origin: { x: 0.5, y: 1 }, depth: 8 });
    const glow = this.add.graphics();
    glow.setDepth(7);
    glow.fillStyle(0xf4a261, 0.18);
    glow.fillEllipse(GAME_WIDTH / 2, STAGE_BOTTOM_Y - 200, 380, 500);

    // Fertilizer shelf
    PixelScene.place(this, 'locker', 220, STAGE_BOTTOM_Y - 70, 6, { depth: 7 });
    const barrels = ['baril1', 'baril2', 'baril3', 'greenBarrel'];
    barrels.forEach((b, i) => {
      const x = 90 + i * 75;
      PixelScene.place(this, b, x, STAGE_BOTTOM_Y - 380, 2.5, { depth: 8 });
    });

    // Notes / cards
    PixelScene.place(this, 'lockerOpen', GAME_WIDTH - 220, STAGE_BOTTOM_Y - 70, 6, { depth: 7 });
    PixelScene.place(this, 'books', GAME_WIDTH - 280, STAGE_BOTTOM_Y - 380, 4, { depth: 8 });
    PixelScene.place(this, 'books2', GAME_WIDTH - 180, STAGE_BOTTOM_Y - 380, 4, { depth: 8 });

    PixelScene.place(this, 'lamp1', GAME_WIDTH / 2, HUD.topBarHeight + 90, 6, { origin: { x: 0.5, y: 0 }, depth: 4 });

    this.add.text(GAME_WIDTH / 2, HUD.topBarHeight + 30, 'MODULE B — SERRE', {
      fontFamily: FONTS.mono,
      fontSize: '32px',
      color: COLORS.hex.cream,
      fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(50);
  }

  private makeHotspots(): void {
    new Hotspot(this, {
      x: GAME_WIDTH / 2,
      y: STAGE_BOTTOM_Y - 220,
      width: 320,
      height: 380,
      name: 'la Lumira',
      onLook: () => {
        this.recordTap();
        this.showNarration(t('scene.ch2.lumira_look'));
      },
      onUse: () => {
        this.recordTap();
        if (hasItem('fert_mix')) {
          this.applyMix();
        } else {
          this.showNarration(t('scene.ch2.lumira_use_other'));
        }
      },
      onPick: () => {
        this.recordTap();
        this.showNarration('La Lumira est trop précieuse pour la déplacer.');
      },
    });

    new Hotspot(this, {
      x: 220,
      y: STAGE_BOTTOM_Y - 380,
      width: 320,
      height: 280,
      name: 'étagère de fertilisants',
      onLook: () => {
        this.recordTap();
        this.showNarration(t('scene.ch2.shelf_look'));
      },
      onPick: () => {
        this.recordTap();
        if (!hasProgress('ch2.fert_taken')) {
          this.showNarration(t('scene.ch2.shelf_pick'), () => {
            ['fert_a', 'fert_b', 'fert_c', 'fert_d'].forEach((f) => addItem(f as ItemId));
            setProgress('ch2.fert_taken');
            notifyInventoryChange();
          });
        } else {
          this.showNarration(t('scene.ch2.shelf_look'));
        }
      },
    });

    new Hotspot(this, {
      x: GAME_WIDTH - 220,
      y: STAGE_BOTTOM_Y - 380,
      width: 320,
      height: 280,
      name: 'tiroir de notes',
      onLook: () => {
        this.recordTap();
        this.showNarration(t('scene.ch2.notes_look'));
      },
      onPick: () => {
        this.recordTap();
        if (!hasItem('note_botanique') && !hasProgress('ch2.notes_taken')) {
          this.showNarration(t('scene.ch2.notes_pick'), () => {
            addItem('note_botanique');
            setProgress('ch2.notes_taken');
            notifyInventoryChange();
          });
        } else {
          this.showNarration(t('scene.ch2.notes_look'));
        }
      },
    });

    new Hotspot(this, {
      x: GAME_WIDTH - 220,
      y: STAGE_BOTTOM_Y - 200,
      width: 220,
      height: 180,
      name: 'cartes botaniques',
      onLook: () => {
        this.recordTap();
        this.showNarration(t('scene.ch2.cards_look'));
      },
      onPick: () => {
        this.recordTap();
        if (!hasProgress('ch2.cards_taken')) {
          this.showNarration(t('scene.ch2.cards_pick'), () => {
            addItem('graine_rare');
            setProgress('ch2.cards_taken');
            notifyInventoryChange();
          });
        } else {
          this.showNarration('Le paquet est désormais incomplet, mais c\'est ce qui compte le plus.');
        }
      },
    });

    new Hotspot(this, {
      x: GAME_WIDTH - 100,
      y: 200,
      width: 200,
      height: 200,
      name: 'VERA',
      showIndicator: false,
      onTalk: () => {
        this.recordTap();
        this.showVera('Que veux-tu savoir, {name} ?');
      },
    });
  }

  private spawnPollen(): void {
    // Floating green/amber pollen particles in the greenhouse
    for (let i = 0; i < 28; i++) {
      const x = Math.random() * GAME_WIDTH;
      const y = 200 + Math.random() * (STAGE_BOTTOM_Y - 300);
      const size = 6 + Math.random() * 8;
      const isAmber = Math.random() > 0.7;
      const color = isAmber ? 0xf4a261 : 0x7fb069;
      const dot = this.add.rectangle(x, y, size, size, color, 0.85).setDepth(15);
      dot.setStrokeStyle(2, 0xf4e9d8, 0.9);
      const driftY = -40 - Math.random() * 100;
      const driftX = (Math.random() - 0.5) * 80;
      this.tweens.add({
        targets: dot,
        y: y + driftY,
        x: x + driftX,
        alpha: { from: 0.85, to: 0.2 },
        duration: 6000 + Math.random() * 4000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
        delay: Math.random() * 3000,
      });
    }
  }

  private spawnLumiraGlow(): void {
    // Pulsing amber halo around the Lumira (already has a static glow — add tween)
    const halo = this.add.graphics();
    halo.setDepth(7);
    halo.fillStyle(0xf4a261, 0.45);
    halo.fillCircle(GAME_WIDTH / 2, STAGE_BOTTOM_Y - 200, 240);
    halo.fillStyle(0xf4a261, 0.25);
    halo.fillCircle(GAME_WIDTH / 2, STAGE_BOTTOM_Y - 200, 380);
    this.tweens.add({
      targets: halo,
      alpha: { from: 0.6, to: 1 },
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  private applyMix(): void {
    removeItem('fert_mix');
    notifyInventoryChange();
    setProgress('ch2.solved');
    this.showVera(t('vera.ch2.fert_right'), () => {
      this.showVera(t('vera.ch2.complete'), () => {
        this.fadeToScene('ChapterIntroScene', { chapter: 3 });
      });
    });
  }

  protected examineItem(id: ItemId): void {
    super.examineItem(id);
    if (id === 'fert_mix' && !hasProgress('ch2.mix_made')) {
      setProgress('ch2.mix_made');
      this.time.delayedCall(2000, () => {
        if (this.dialogue) {
          this.showVera('Parfait. Apporte ce mélange à la Lumira, {name}.');
        }
      });
    }
  }
}
