import * as Phaser from 'phaser';
import { COLORS, FONTS, GAME_WIDTH, GAME_HEIGHT } from '../../config';
import { PuzzleSceneBase } from './PuzzleSceneBase';
import { SceneBackground } from '../../objects/SceneBackground';
import { Hotspot } from '../../objects/Hotspot';
import { Keypad } from '../../objects/Keypad';
import { addItem, hasItem, notifyInventoryChange } from '../../systems/inventory';
import { setProgress, hasProgress } from '../../systems/save';
import { PUZZLE_IDS, SOLUTIONS } from '../../data/puzzles';
import { t } from '../../systems/narrative';

export class Ch1Cryo extends PuzzleSceneBase {
  private braceletHotspot?: Hotspot;
  private terminalHotspot?: Hotspot;
  private veraGreeted = false;

  constructor() {
    super('Ch1Cryo');
  }

  init(): void {
    this.chapter = 1;
    this.nextSceneKey = 'Ch2Serre';
  }

  create(): void {
    this.cameras.main.fadeIn(500, 31, 77, 62);

    SceneBackground.draw(this, 'cryo');

    // Title floating in scene
    this.add.text(GAME_WIDTH / 2, 200, 'CRYO — Module A', {
      fontFamily: FONTS.mono,
      fontSize: '36px',
      color: COLORS.hex.skyPale,
    }).setOrigin(0.5);

    this.setupHud(PUZZLE_IDS.ch1Code);

    // === Hotspots ===
    // Mimi's pod (centered, contains bracelet)
    this.braceletHotspot = new Hotspot(this, {
      x: GAME_WIDTH / 2,
      y: 800,
      width: 220,
      height: 380,
      label: 'Cryo-pod de Mimi',
      onTap: () => {
        this.recordTap();
        if (!hasItem('bracelet') && !hasProgress('ch1.bracelet_taken')) {
          this.showNarration(t('scene.ch1.bracelet_hidden'), () => {
            addItem('bracelet');
            setProgress('ch1.bracelet_taken');
            notifyInventoryChange();
            this.braceletHotspot?.stopGlow();
          });
        } else {
          this.showNarration(t('scene.ch1.cryo_pod'));
        }
      },
    });

    // Empty pods
    for (let i = 0; i < 5; i++) {
      if (i === 2) continue; // skip center (Mimi's)
      const x = (i + 0.5) * (GAME_WIDTH / 5);
      new Hotspot(this, {
        x,
        y: 800,
        width: 180,
        height: 380,
        onTap: () => {
          this.recordTap();
          this.showNarration(t('scene.ch1.empty_pod'));
        },
      });
    }

    // Desk on the left bottom — contains badge + note_leah
    const desk = new Hotspot(this, {
      x: 220,
      y: GAME_HEIGHT - 600,
      width: 280,
      height: 200,
      label: 'Bureau',
      onTap: () => {
        this.recordTap();
        if (!hasItem('badge') && !hasProgress('ch1.badge_taken')) {
          this.showNarration(t('scene.ch1.desk'), () => {
            addItem('badge');
            addItem('note_leah');
            setProgress('ch1.badge_taken');
            notifyInventoryChange();
          });
        } else {
          this.showNarration(t('scene.ch1.desk'));
        }
      },
    });
    this.drawDeskShape(220, GAME_HEIGHT - 600);

    // Poster on the wall — right
    new Hotspot(this, {
      x: GAME_WIDTH - 200,
      y: GAME_HEIGHT - 1100,
      width: 220,
      height: 300,
      label: 'Poster Lumira',
      onTap: () => {
        this.recordTap();
        this.showNarration(t('scene.ch1.poster'));
      },
    });
    this.drawPosterShape(GAME_WIDTH - 200, GAME_HEIGHT - 1100);

    // Cryo schema on right wall
    new Hotspot(this, {
      x: GAME_WIDTH - 200,
      y: GAME_HEIGHT - 600,
      width: 220,
      height: 200,
      label: 'Schéma cryo',
      onTap: () => {
        this.recordTap();
        if (!hasItem('cryo_schema') && !hasProgress('ch1.schema_taken')) {
          this.showNarration(t('scene.ch1.poster'), () => {
            addItem('cryo_schema');
            setProgress('ch1.schema_taken');
            notifyInventoryChange();
          });
        } else {
          this.showNarration('Le schéma est dans ton inventaire.');
        }
      },
    });
    this.drawSchemaShape(GAME_WIDTH - 200, GAME_HEIGHT - 600);

    // Terminal — bottom center, opens keypad
    this.terminalHotspot = new Hotspot(this, {
      x: GAME_WIDTH / 2,
      y: GAME_HEIGHT - 460,
      width: 280,
      height: 200,
      label: 'Terminal cryo',
      onTap: () => {
        this.recordTap();
        this.openKeypad();
      },
    });
    this.drawTerminalShape(GAME_WIDTH / 2, GAME_HEIGHT - 460);

    // VERA's greeting on first entry
    if (!hasProgress('ch1.vera_greeted')) {
      this.time.delayedCall(800, () => {
        this.showVeraSequence(
          [t('vera.ch1.greeting'), t('vera.ch1.context'), t('vera.ch1.task')],
          () => {
            setProgress('ch1.vera_greeted');
            this.veraGreeted = true;
          }
        );
      });
    } else {
      this.veraGreeted = true;
    }
  }

  private openKeypad(): void {
    if (!this.veraGreeted) return;
    new Keypad(this, {
      digits: 4,
      solution: SOLUTIONS.ch1Code,
      prompt: 'Code cryo (4 chiffres)',
      onCorrect: () => this.onCodeCorrect(),
      onWrong: () => this.showVera(t('vera.ch1.code_wrong')),
    });
  }

  private onCodeCorrect(): void {
    addItem('cryo_key');
    setProgress('ch1.solved');
    notifyInventoryChange();
    this.showVera(t('vera.ch1.code_right'), () => {
      this.fadeToScene('ChapterIntroScene', { chapter: 2 });
    });
  }

  protected onHintCue(cue?: string): void {
    if (cue === 'bracelet' && !hasItem('bracelet')) {
      this.braceletHotspot?.startGlow();
    }
  }

  // === Decorative shape helpers ===
  private drawDeskShape(x: number, y: number): void {
    const g = this.add.graphics();
    g.setDepth(-100);
    g.fillStyle(COLORS.brassDark, 0.85);
    g.fillRoundedRect(x - 140, y - 100, 280, 200, 8);
    g.fillStyle(COLORS.brass, 0.5);
    g.fillRect(x - 130, y - 95, 260, 14);
    g.fillStyle(COLORS.cream, 0.7);
    g.fillRect(x - 90, y - 30, 80, 60); // paper
    g.fillStyle(COLORS.skyPale, 0.6);
    g.fillRect(x + 20, y - 30, 50, 30); // badge
  }

  private drawPosterShape(x: number, y: number): void {
    const g = this.add.graphics();
    g.setDepth(-100);
    g.fillStyle(COLORS.leafLight, 0.6);
    g.fillRect(x - 110, y - 150, 220, 300);
    g.fillStyle(COLORS.cream, 0.85);
    g.fillCircle(x, y - 70, 40); // sun/leaf icon
    g.fillStyle(COLORS.leafDeep, 0.9);
    g.fillRect(x - 90, y + 80, 180, 30); // text bar
  }

  private drawSchemaShape(x: number, y: number): void {
    const g = this.add.graphics();
    g.setDepth(-100);
    g.fillStyle(COLORS.cream, 0.92);
    g.fillRect(x - 110, y - 100, 220, 200);
    g.lineStyle(2, COLORS.charDeep, 0.7);
    g.strokeRect(x - 90, y - 80, 180, 30);
    g.strokeRect(x - 90, y - 30, 180, 30);
    g.strokeRect(x - 90, y + 20, 180, 30);
    // numbers
    this.add.text(x, y, '1 4 0 3', {
      fontFamily: FONTS.mono,
      fontSize: '20px',
      color: '#888',
    }).setOrigin(0.5).setAlpha(0); // hidden — only revealed via hint, NOT visible. The clue is on bracelet.
  }

  private drawTerminalShape(x: number, y: number): void {
    const g = this.add.graphics();
    g.setDepth(-100);
    g.fillStyle(COLORS.charDeep, 0.95);
    g.fillRoundedRect(x - 140, y - 100, 280, 200, 12);
    g.fillStyle(COLORS.skyPale, 0.7);
    g.fillRect(x - 110, y - 80, 220, 70); // screen
    g.fillStyle(COLORS.skyPale, 0.4);
    for (let i = 0; i < 12; i++) {
      const cx = x - 100 + (i % 4) * 60;
      const cy = y + 10 + Math.floor(i / 4) * 30;
      g.fillCircle(cx, cy, 8); // keypad dots
    }
  }
}
