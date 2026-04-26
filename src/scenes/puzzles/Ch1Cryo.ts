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
import { CH1_SPRITES } from '../../data/assets';

export class Ch1Cryo extends PuzzleSceneBase {
  private veraGreeted = false;
  private terminalSprite?: Phaser.GameObjects.Image;
  private framePosition = { x: 320, y: 0 };
  private braceletHotspot?: Hotspot;
  // Pickable visuals — destroyed/swapped when items are taken
  private frameVisual?: Phaser.GameObjects.Container;
  private lockerVisual?: Phaser.GameObjects.Image;

  constructor() {
    super('Ch1Cryo');
  }

  init(): void {
    this.chapter = 1;
    this.nextSceneKey = 'Ch2Serre';
    this.queueSprites(CH1_SPRITES);
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

    // === Frost particles drifting down (ambient cryo atmosphere) ===
    this.spawnFrostParticles();

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
    const termX = GAME_WIDTH - 180;
    const termY = STAGE_BOTTOM_Y - 70;
    this.terminalSprite = PixelScene.place(this, 'computerStation1', termX, termY, termScale, { depth: 6 });

    // Pulsing GREEN glow ON the CRT screen of the terminal (rectangle, not big circle)
    // Computer station sprite is ~273x350 logical at scale 7, screen area is upper ~140px tall
    const screenGlow = this.add.rectangle(termX, termY - 240, 200, 110, 0x7fb069, 0.45).setDepth(7);
    this.tweens.add({
      targets: screenGlow,
      alpha: { from: 0.25, to: 0.7 },
      duration: 900,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
    // Plus a subtle scanline effect on the screen
    const scan = this.add.rectangle(termX, termY - 270, 200, 6, 0xa8dadc, 0.6).setDepth(8);
    this.tweens.add({
      targets: scan,
      y: termY - 200,
      duration: 2200,
      repeat: -1,
      ease: 'Linear',
    });

    // === Locker (desk substitute) on the left ===
    // Use 'lockerOpen' if items already picked, else 'locker'
    const lockerKey = hasProgress('ch1.badge_taken') ? 'lockerOpen' : 'locker';
    this.lockerVisual = PixelScene.place(this, lockerKey, 180, STAGE_BOTTOM_Y - 70, 6, { depth: 6 });

    // === Lamp on top wall ===
    PixelScene.place(this, 'lamp1', GAME_WIDTH / 2, wallY + 90, 6, { origin: { x: 0.5, y: 0 }, depth: 4 });

    // === Decorative props ===
    // Books / post-it on locker (only if items not yet picked, since they belong to the desk)
    if (!hasProgress('ch1.badge_taken')) {
      PixelScene.place(this, 'books', 180, STAGE_BOTTOM_Y - 230, 4, { depth: 7 });
    }
    // Phone on the floor by the locker
    PixelScene.place(this, 'phone', 320, STAGE_BOTTOM_Y - 60, 4, { depth: 7 });
    // Sticker on the wall
    PixelScene.place(this, 'sticker1', GAME_WIDTH - 380, wallY + 350, 4, { depth: 4 });

    // Photo frame on top of the locker (this is the clue-bearer)
    // Only draw if not yet picked
    this.framePosition = { x: 180, y: STAGE_BOTTOM_Y - 280 };
    if (!hasProgress('ch1.schema_taken')) {
      this.frameVisual = this.drawPhotoFrame(this.framePosition.x, this.framePosition.y);
    }

    // Title on top
    this.add.text(GAME_WIDTH / 2, HUD.topBarHeight + 30, 'MODULE A — CRYOGÉNIE', {
      fontFamily: FONTS.mono,
      fontSize: '32px',
      color: COLORS.hex.skyPale,
      fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(50);
  }

  private spawnFrostParticles(): void {
    // Single ParticleEmitter — replaces 30 individual Rectangles + infinite tweens.
    // Generates a small white-circle texture once and reuses it.
    if (!this.textures.exists('frost_particle')) {
      const g = this.make.graphics({ x: 0, y: 0 }, false);
      g.fillStyle(0xffffff, 1);
      g.fillCircle(4, 4, 4);
      g.generateTexture('frost_particle', 8, 8);
      g.destroy();
    }
    const emitter = this.add.particles(0, 0, 'frost_particle', {
      x: { min: 0, max: GAME_WIDTH },
      y: 0,
      speedY: { min: 10, max: 30 },
      speedX: { min: -5, max: 5 },
      lifespan: 8000,
      alpha: { start: 0.6, end: 0 },
      scale: { min: 0.5, max: 1.2 },
      quantity: 1,
      frequency: 250,
    });
    emitter.setDepth(15);
  }

  private drawPhotoFrame(x: number, y: number): Phaser.GameObjects.Container {
    const c = this.add.container(x, y);
    c.setDepth(8);
    const g = this.add.graphics();
    // Brass frame
    g.fillStyle(COLORS.brass, 1);
    g.fillRect(-50, -70, 100, 140);
    g.fillStyle(COLORS.charDeep, 1);
    g.fillRect(-42, -62, 84, 110);
    // Heads
    g.fillStyle(COLORS.cream, 0.7);
    g.fillCircle(-22, -30, 8);
    g.fillCircle(0, -35, 9);
    g.fillCircle(22, -30, 8);
    g.fillRect(-30, -22, 16, 30);
    g.fillRect(-8, -25, 16, 33);
    g.fillRect(14, -22, 16, 30);
    // Date plaque
    g.fillStyle(COLORS.brassDark, 1);
    g.fillRect(-50, 55, 100, 18);
    c.add(g);
    const date = this.add.text(0, 64, '14.03.2064', {
      fontFamily: FONTS.mono,
      fontSize: '16px',
      color: COLORS.hex.cream,
    }).setOrigin(0.5);
    c.add(date);
    return c;
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

    // Empty pods — REMOVED. They were giving "rien d'intéressant" but their
    // 240x580 hit areas overlapped the locker AND the photo frame, blocking
    // pickup of the date-clue. Pods are still visible (sprites stay) but
    // not interactive — no gameplay loss since they only narrated flavor.

    // Locker (with badge & note) — primary tap also picks up
    const pickLocker = () => {
      this.recordTap();
      if (!hasItem('badge') && !hasProgress('ch1.badge_taken')) {
        this.showNarration(t('scene.ch1.desk_pick'), () => {
          addItem('badge');
          addItem('note_leah');
          setProgress('ch1.badge_taken');
          notifyInventoryChange();
          // Swap locker visual to "open"
          if (this.lockerVisual && this.textures.exists('lockerOpen')) {
            this.lockerVisual.setTexture('lockerOpen');
          }
        });
      } else {
        this.showNarration(t('scene.ch1.desk_look'));
      }
    };
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
      onPick: pickLocker,
      onUse: pickLocker,
    });

    // Photo frame (THE clue — date 14.03.2064 → code 1403). Removed from scene on pick.
    const pickFrame = () => {
      this.recordTap();
      if (!hasItem('cryo_schema') && !hasProgress('ch1.schema_taken')) {
        this.showNarration('Tu prends le cadre. La date au dos est gravée : 14.03.2064.', () => {
          addItem('cryo_schema');
          setProgress('ch1.schema_taken');
          notifyInventoryChange();
          // Remove frame from scene
          if (this.frameVisual) {
            this.tweens.add({
              targets: this.frameVisual,
              alpha: { from: 1, to: 0 },
              duration: 280,
              onComplete: () => {
                this.frameVisual?.destroy();
                this.frameVisual = undefined;
              },
            });
          }
        });
      } else {
        this.showNarration(t('scene.ch1.frame_look'));
      }
    };
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
      onPick: pickFrame,
      onUse: pickFrame,
    });

    // Terminal — ALWAYS opens the keypad on any verb tap. No conditional gate.
    const openTerminal = () => {
      this.recordTap();
      this.openKeypad();
    };
    new Hotspot(this, {
      x: GAME_WIDTH - 180,
      y: STAGE_BOTTOM_Y - 280,
      width: 460,
      height: 580,
      name: 'terminal cryo',
      onLook: openTerminal,
      onUse: openTerminal,
      onTalk: openTerminal,
      onPick: () => this.showNarration('Le terminal est fixé au sol. Tu peux l\'utiliser, pas le prendre.'),
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
