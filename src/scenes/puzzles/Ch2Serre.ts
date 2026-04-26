import * as Phaser from 'phaser';
import { COLORS, FONTS, GAME_WIDTH, GAME_HEIGHT } from '../../config';
import { PuzzleSceneBase } from './PuzzleSceneBase';
import { SceneBackground } from '../../objects/SceneBackground';
import { Hotspot } from '../../objects/Hotspot';
import { addItem, hasItem, removeItem, notifyInventoryChange, getInventory } from '../../systems/inventory';
import { setProgress, hasProgress } from '../../systems/save';
import { PUZZLE_IDS, SOLUTIONS } from '../../data/puzzles';
import { t } from '../../systems/narrative';
import type { ItemId } from '../../data/items';

export class Ch2Serre extends PuzzleSceneBase {
  private lumiraHotspot?: Hotspot;

  constructor() {
    super('Ch2Serre');
  }

  init(): void {
    this.chapter = 2;
    this.nextSceneKey = 'Ch3Atelier';
  }

  create(): void {
    this.cameras.main.fadeIn(500, 31, 77, 62);
    SceneBackground.draw(this, 'serre');

    this.add.text(GAME_WIDTH / 2, 200, 'SERRE — Module B', {
      fontFamily: FONTS.mono,
      fontSize: '36px',
      color: COLORS.hex.cream,
    }).setOrigin(0.5);

    this.setupHud(PUZZLE_IDS.ch2Fert);

    // Lumira plant (target for fertilizer)
    this.drawLumira(GAME_WIDTH / 2, GAME_HEIGHT - 800);
    this.lumiraHotspot = new Hotspot(this, {
      x: GAME_WIDTH / 2,
      y: GAME_HEIGHT - 800,
      width: 280,
      height: 380,
      label: 'Lumira',
      onTap: () => {
        this.recordTap();
        if (hasItem('fert_mix')) {
          this.applyMix();
        } else {
          this.showNarration(t('scene.ch2.lumira'));
        }
      },
    });

    // Fertilizer shelf
    this.drawShelf(GAME_WIDTH / 2, 720);
    new Hotspot(this, {
      x: GAME_WIDTH / 2,
      y: 720,
      width: 700,
      height: 220,
      label: 'Étagère fertilisants',
      onTap: () => {
        this.recordTap();
        if (!hasProgress('ch2.fert_taken')) {
          this.showNarration(t('scene.ch2.shelf'), () => {
            ['fert_a', 'fert_b', 'fert_c', 'fert_d'].forEach((f) => addItem(f as ItemId));
            setProgress('ch2.fert_taken');
            notifyInventoryChange();
          });
        } else {
          this.showNarration(t('scene.ch2.shelf'));
        }
      },
    });

    // Notes drawer (left)
    this.drawDrawer(180, GAME_HEIGHT - 500);
    new Hotspot(this, {
      x: 180,
      y: GAME_HEIGHT - 500,
      width: 220,
      height: 200,
      label: 'Tiroir notes',
      onTap: () => {
        this.recordTap();
        if (!hasItem('note_botanique') && !hasProgress('ch2.notes_taken')) {
          this.showNarration(t('scene.ch2.notes_drawer'), () => {
            addItem('note_botanique');
            setProgress('ch2.notes_taken');
            notifyInventoryChange();
          });
        } else {
          this.showNarration(t('scene.ch2.notes_drawer'));
        }
      },
    });

    // Cards / graine
    this.drawCardsPile(GAME_WIDTH - 180, GAME_HEIGHT - 500);
    new Hotspot(this, {
      x: GAME_WIDTH - 180,
      y: GAME_HEIGHT - 500,
      width: 220,
      height: 200,
      label: 'Cartes botaniques',
      onTap: () => {
        this.recordTap();
        if (!hasProgress('ch2.cards_taken')) {
          this.showNarration(t('scene.ch2.cards_pile'), () => {
            addItem('graine_rare');
            setProgress('ch2.cards_taken');
            notifyInventoryChange();
          });
        } else {
          this.showNarration('Le paquet est désormais incomplet, mais c\'est ce qui compte le plus.');
        }
      },
    });

    // VERA welcome on first entry
    if (!hasProgress('ch2.vera_greeted')) {
      this.time.delayedCall(700, () => {
        this.showVeraSequence(
          [t('vera.ch2.greeting'), t('vera.ch2.task')],
          () => setProgress('ch2.vera_greeted')
        );
      });
    }
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

  // Override: validate combine when player tries combining via inventory
  // The actual combine is handled in InventoryBar via tryCombine; here we listen for fert_mix appearing
  protected examineItem(id: ItemId): void {
    super.examineItem(id);
    // After examining a freshly-created mix, prompt VERA
    if (id === 'fert_mix' && !hasProgress('ch2.mix_made')) {
      setProgress('ch2.mix_made');
      this.time.delayedCall(2000, () => {
        if (this.dialogue) {
          this.showVera('Parfait. Apporte ce mélange à la Lumira.');
        }
      });
    }
  }

  // === Decorative shapes ===
  private drawLumira(x: number, y: number): void {
    const g = this.add.graphics();
    g.setDepth(-100);
    // Pot
    g.fillStyle(COLORS.brassDark, 0.9);
    g.fillRoundedRect(x - 100, y + 100, 200, 120, 16);
    g.fillStyle(COLORS.charDeep, 0.7);
    g.fillEllipse(x, y + 100, 200, 30);
    // Stem
    g.fillStyle(COLORS.leafDeep, 1);
    g.fillRect(x - 8, y - 80, 16, 200);
    // Leaves
    g.fillStyle(COLORS.leafLight, 0.95);
    g.fillCircle(x - 60, y - 20, 50);
    g.fillCircle(x + 70, y - 30, 60);
    g.fillCircle(x - 30, y - 100, 45);
    // Glow flower
    g.fillStyle(COLORS.sunAmber, 0.9);
    g.fillCircle(x, y - 130, 28);
    g.fillStyle(COLORS.sunAmber, 0.3);
    g.fillCircle(x, y - 130, 60);
  }

  private drawShelf(x: number, y: number): void {
    const g = this.add.graphics();
    g.setDepth(-100);
    g.fillStyle(COLORS.brassDark, 0.95);
    g.fillRect(x - 350, y - 60, 700, 18);
    g.fillRect(x - 350, y + 60, 700, 18);
    // 4 jars
    const colors = [COLORS.skyPale, COLORS.leafLight, COLORS.sunAmber, COLORS.brass];
    for (let i = 0; i < 4; i++) {
      const jx = x - 240 + i * 160;
      g.fillStyle(colors[i], 0.85);
      g.fillRoundedRect(jx - 50, y - 50, 100, 110, 8);
      g.fillStyle(COLORS.charDeep, 0.85);
      g.fillRect(jx - 30, y + 30, 60, 14); // label
    }
  }

  private drawDrawer(x: number, y: number): void {
    const g = this.add.graphics();
    g.setDepth(-100);
    g.fillStyle(COLORS.brassDark, 0.9);
    g.fillRoundedRect(x - 110, y - 100, 220, 200, 8);
    g.fillStyle(COLORS.brass, 0.6);
    g.fillCircle(x, y, 14); // handle
    g.lineStyle(3, COLORS.charDeep, 0.8);
    g.strokeRect(x - 105, y - 95, 210, 190);
  }

  private drawCardsPile(x: number, y: number): void {
    const g = this.add.graphics();
    g.setDepth(-100);
    for (let i = 0; i < 5; i++) {
      g.fillStyle(COLORS.cream, 0.92);
      g.fillRoundedRect(x - 60 + i * 4, y - 80 + i * 6, 120, 160, 6);
      g.lineStyle(2, COLORS.charDeep, 0.7);
      g.strokeRoundedRect(x - 60 + i * 4, y - 80 + i * 6, 120, 160, 6);
    }
    // Top card flower
    g.fillStyle(COLORS.sunAmber, 0.95);
    g.fillCircle(x + 16, y + 6, 18);
  }
}
