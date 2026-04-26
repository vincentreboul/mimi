import * as Phaser from 'phaser';
import { COLORS, FONTS, GAME_WIDTH, GAME_HEIGHT, HUD, STAGE_BOTTOM_Y } from '../../config';
import { PuzzleSceneBase } from './PuzzleSceneBase';
import { PixelScene } from '../../objects/PixelScene';
import { Hotspot } from '../../objects/Hotspot';
import { Keypad } from '../../objects/Keypad';
import { addItem, hasItem, notifyInventoryChange } from '../../systems/inventory';
import { setProgress, hasProgress, getPlayer } from '../../systems/save';
import { PUZZLE_IDS, SOLUTIONS } from '../../data/puzzles';
import { t } from '../../systems/narrative';

export class Ch1Cryo extends PuzzleSceneBase {
  private veraGreeted = false;
  private terminalSprite?: Phaser.GameObjects.Image;
  private framePosition = { x: 320, y: 0 };

  constructor() {
    super('Ch1Cryo');
  }

  init(): void {
    this.chapter = 1;
    this.nextSceneKey = 'Ch2Serre';
  }

  create(): void {
    this.cameras.main.fadeIn(500, 31, 77, 62);

    // === Background composition ===
    this.composeBackground();

    // === HUD (top bar, verb panel, inventory, action label, hint, dialogue) ===
    this.setupHud(PUZZLE_IDS.ch1Code);

    // === Hotspots over the sprites ===
    this.makeHotspots();

    // === VERA's greeting on first entry ===
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

  private composeBackground(): void {
    // Stage background — deep teal cryo room
    PixelScene.stageBackground(this, 0x0d2230);

    // Floor (tiled along the bottom of stage)
    const floorScale = 6;
    const floorY = STAGE_BOTTOM_Y - 30;
    PixelScene.tileH(this, 'floor1', floorY, floorScale);

    // Back wall (tile along the top with wall1 sprite)
    const wallScale = 5;
    const wallY = HUD.topBarHeight + 5;
    // Tile wall1 across full width
    PixelScene.tileH(this, 'wall1', wallY + 550, wallScale, 0, GAME_WIDTH, { origin: { x: 0, y: 1 } });

    // Wall+window in the center back (a porthole showing space)
    const winScale = 6;
    PixelScene.place(this, 'wallWindow', GAME_WIDTH / 2, wallY + 660, winScale, { origin: { x: 0.5, y: 1 } });

    // Pipes along wall (top edge decoration)
    PixelScene.place(this, 'wallPipes', 200, wallY + 200, 4, { origin: { x: 0.5, y: 0 } });
    PixelScene.place(this, 'wallPipes', GAME_WIDTH - 200, wallY + 200, 4, { origin: { x: 0.5, y: 0 }, flipX: true });

    // === Cryo pods === (3 pods along back wall — center one is the player's, OPEN)
    const podScale = 7;
    const podY = STAGE_BOTTOM_Y - 60; // sit on floor
    // Left pod (closed/off, brighter tint to be visible)
    PixelScene.place(this, 'cryoPodOff', 280, podY, podScale, { depth: 5, tint: 0xa8c5d0 });
    // Center pod (active — player's)
    PixelScene.place(this, 'cryoPod', GAME_WIDTH / 2, podY, podScale, { depth: 5 });
    // Right pod (closed/off)
    PixelScene.place(this, 'cryoPodOff', GAME_WIDTH - 280, podY, podScale, { depth: 5, tint: 0xa8c5d0 });

    // Soft amber lighting glow from center pod
    const glow = this.add.graphics();
    glow.setDepth(3);
    glow.fillStyle(0xf4a261, 0.15);
    glow.fillEllipse(GAME_WIDTH / 2, podY - 200, 600, 800);

    // === Computer terminal (right of center, on floor) ===
    const termScale = 7;
    this.terminalSprite = PixelScene.place(this, 'computerStation1', GAME_WIDTH - 180, STAGE_BOTTOM_Y - 70, termScale, { depth: 6 });

    // === Locker (desk substitute) on the left ===
    PixelScene.place(this, 'locker', 180, STAGE_BOTTOM_Y - 70, 6, { depth: 6 });

    // === Lamp on top wall ===
    PixelScene.place(this, 'lamp1', GAME_WIDTH / 2, wallY + 90, 6, { origin: { x: 0.5, y: 0 }, depth: 4 });

    // === Decorative props ===
    // Books / post-it on locker
    PixelScene.place(this, 'books', 180, STAGE_BOTTOM_Y - 230, 4, { depth: 7 });
    // Phone on the floor by the locker
    PixelScene.place(this, 'phone', 320, STAGE_BOTTOM_Y - 60, 4, { depth: 7 });
    // Sticker on the wall
    PixelScene.place(this, 'sticker1', GAME_WIDTH - 380, wallY + 350, 4, { depth: 4 });

    // Photo frame on top of the locker (this is the clue-bearer)
    this.framePosition = { x: 180, y: STAGE_BOTTOM_Y - 280 };
    // Use a small drawn frame (no asset for photo frame, draw with rectangle)
    this.drawPhotoFrame(this.framePosition.x, this.framePosition.y);

    // Title on top
    this.add.text(GAME_WIDTH / 2, HUD.topBarHeight + 30, 'MODULE A — CRYOGÉNIE', {
      fontFamily: FONTS.mono,
      fontSize: '32px',
      color: COLORS.hex.skyPale,
      fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(50);
  }

  private drawPhotoFrame(x: number, y: number): void {
    const g = this.add.graphics();
    g.setDepth(8);
    // Brass frame
    g.fillStyle(COLORS.brass, 1);
    g.fillRect(x - 50, y - 70, 100, 140);
    // Inner "photo" (group portrait silhouette)
    g.fillStyle(COLORS.charDeep, 1);
    g.fillRect(x - 42, y - 62, 84, 110);
    g.fillStyle(COLORS.cream, 0.6);
    // Three little heads
    g.fillCircle(x - 22, y - 30, 8);
    g.fillCircle(x, y - 35, 9);
    g.fillCircle(x + 22, y - 30, 8);
    // Bodies
    g.fillRect(x - 30, y - 22, 16, 30);
    g.fillRect(x - 8, y - 25, 16, 33);
    g.fillRect(x + 14, y - 22, 16, 30);
    // Date plaque
    g.fillStyle(COLORS.brassDark, 1);
    g.fillRect(x - 50, y + 55, 100, 18);
    this.add.text(x, y + 64, '14.03.2064', {
      fontFamily: FONTS.mono,
      fontSize: '14px',
      color: COLORS.hex.cream,
    }).setOrigin(0.5).setDepth(9);
  }

  private makeHotspots(): void {
    // Center cryo pod (player's) — generous touch zone
    new Hotspot(this, {
      x: GAME_WIDTH / 2,
      y: STAGE_BOTTOM_Y - 360,
      width: 280,
      height: 600,
      name: 'ta cryo-capsule',
      onLook: () => {
        this.recordTap();
        this.showNarration(t('scene.ch1.cryo_pod_self'));
      },
      onPick: () => {
        this.recordTap();
        if (!hasItem('bracelet') && !hasProgress('ch1.bracelet_taken')) {
          this.showNarration(t('scene.ch1.cryo_pod_self_pick'), () => {
            addItem('bracelet');
            setProgress('ch1.bracelet_taken');
            notifyInventoryChange();
          });
        } else {
          this.showNarration(t('scene.ch1.cryo_pod_self'));
        }
      },
    });

    // Left empty pod
    new Hotspot(this, {
      x: 280,
      y: STAGE_BOTTOM_Y - 360,
      width: 240,
      height: 580,
      name: 'cryo-capsule vide',
      onLook: () => {
        this.recordTap();
        this.showNarration(t('scene.ch1.empty_pod'));
      },
    });

    // Right empty pod
    new Hotspot(this, {
      x: GAME_WIDTH - 280,
      y: STAGE_BOTTOM_Y - 360,
      width: 240,
      height: 580,
      name: 'cryo-capsule vide',
      onLook: () => {
        this.recordTap();
        this.showNarration(t('scene.ch1.empty_pod'));
      },
    });

    // Locker (with badge & note)
    new Hotspot(this, {
      x: 180,
      y: STAGE_BOTTOM_Y - 230,
      width: 280,
      height: 360,
      name: 'casier',
      onLook: () => {
        this.recordTap();
        this.showNarration(t('scene.ch1.desk_look'));
      },
      onPick: () => {
        this.recordTap();
        if (!hasItem('badge') && !hasProgress('ch1.badge_taken')) {
          this.showNarration(t('scene.ch1.desk_pick'), () => {
            addItem('badge');
            addItem('note_leah');
            setProgress('ch1.badge_taken');
            notifyInventoryChange();
          });
        } else {
          this.showNarration(t('scene.ch1.desk_look'));
        }
      },
    });

    // Photo frame (THE clue — date 14.03.2064 → code 1403)
    new Hotspot(this, {
      x: this.framePosition.x,
      y: this.framePosition.y,
      width: 220,
      height: 220,
      name: 'cadre photo',
      onLook: () => {
        this.recordTap();
        this.showNarration(t('scene.ch1.frame_look'));
      },
      onPick: () => {
        this.recordTap();
        if (!hasItem('cryo_schema') && !hasProgress('ch1.schema_taken')) {
          this.showNarration('Tu prends le cadre. La date au dos est gravée : 14.03.2064.', () => {
            addItem('cryo_schema');
            setProgress('ch1.schema_taken');
            notifyInventoryChange();
          });
        } else {
          this.showNarration(t('scene.ch1.frame_look'));
        }
      },
    });

    // Terminal — big hotspot
    new Hotspot(this, {
      x: GAME_WIDTH - 180,
      y: STAGE_BOTTOM_Y - 230,
      width: 380,
      height: 360,
      name: 'terminal cryo',
      onLook: () => {
        this.recordTap();
        this.showNarration(t('scene.ch1.terminal_look'));
      },
      onUse: () => {
        this.recordTap();
        if (!this.veraGreeted) return;
        this.openKeypad();
      },
    });

    // Door (left back wall)
    new Hotspot(this, {
      x: 100,
      y: STAGE_BOTTOM_Y - 600,
      width: 220,
      height: 440,
      name: 'porte du module',
      onLook: () => {
        this.recordTap();
        this.showNarration(t('scene.ch1.door'));
      },
      onUse: () => {
        this.recordTap();
        this.showNarration('Verrouillé. Le terminal cryo en commande l\'accès.');
      },
    });

    // VERA (talk to)
    new Hotspot(this, {
      x: GAME_WIDTH - 100,
      y: 200,
      width: 200,
      height: 200,
      name: 'VERA',
      showIndicator: false,
      onTalk: () => {
        this.recordTap();
        this.showVera('Oui, ' + (getPlayer().name || 'visiteur·euse') + ' ?');
      },
      onLook: () => {
        this.recordTap();
        this.showNarration('VERA est partout dans la station. Sa voix, calme, semble venir des murs.');
      },
    });
  }

  private openKeypad(): void {
    new Keypad(this, {
      digits: 4,
      solution: SOLUTIONS.ch1Code,
      prompt: 'Code à 4 chiffres',
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
}
