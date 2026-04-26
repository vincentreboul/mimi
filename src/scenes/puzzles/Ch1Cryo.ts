import * as Phaser from 'phaser';
import { COLORS, FONTS, GAME_WIDTH, GAME_HEIGHT, HUD, STAGE_BOTTOM_Y } from '../../config';
import { PuzzleSceneBase } from './PuzzleSceneBase';
import { PixelScene } from '../../objects/PixelScene';
import { Hotspot } from '../../objects/Hotspot';
import { Keypad } from '../../objects/Keypad';
import { addItem, hasItem, notifyInventoryChange } from '../../systems/inventory';
import { setProgress, hasProgress, getPlayer } from '../../systems/save';
import { PUZZLE_IDS, SOLUTIONS } from '../../data/puzzles';
import { CH1_SPRITES } from '../../data/assets';
import { playSfx } from '../../systems/audio';

export class Ch1Cryo extends PuzzleSceneBase {
  private veraGreeted = false;
  private terminalSprite?: Phaser.GameObjects.Image;
  private framePosition = { x: 320, y: 0 };
  private braceletHotspot?: Hotspot;
  // Pickable visuals — destroyed/swapped when items are taken
  private frameVisual?: Phaser.GameObjects.Container;
  private lockerVisual?: Phaser.GameObjects.Image;
  // v2 — track multi-look state for hidden hotspots
  private commPanelLookCount = 0;

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

    // === Wake Cycle 90s cinematic (only first time) ===
    if (!hasProgress('ch1.wake_cycle_done')) {
      this.playWakeCycle(() => this.bootScene());
    } else {
      this.bootScene();
    }
  }

  /** Build the actual scene after (or instead of) the Wake Cycle. */
  private bootScene(): void {
    // === Background composition ===
    this.composeBackground();

    // === HUD (top bar, verb panel, inventory, action label, hint, dialogue) ===
    this.setupHud(PUZZLE_IDS.ch1Code);

    // === Hotspots over the sprites ===
    this.makeHotspots();

    // === VERA's greeting on first entry — short clinical Ch1 tone ===
    if (!hasProgress('ch1.vera_greeted')) {
      this.time.delayedCall(800, () => {
        const player = getPlayer();
        const name = player.name || 'visiteur·euse';
        this.showVeraSequence(
          [
            `Bonjour, ${name}. Vous êtes ÉLISE-ROMIE Voss.`,
            'Voulez-vous que je verrouille la porte derrière vous ?',
            'Le terminal cryo commande la sortie. Quatre chiffres. Les indices sont dans cette pièce.',
          ],
          () => {
            setProgress('ch1.vera_greeted');
            this.veraGreeted = true;
            // Auto-collect the journal that's in YOUR pod — teaches the Carnet.
            // Tiny delay so the toast lands AFTER VERA's bubble fades.
            this.time.delayedCall(400, () => {
              this.collectFragment('ch1.journal_voss');
              // Briefly open the Carnet to show what just happened.
              this.time.delayedCall(900, () => {
                if (!hasProgress('ch1.carnet_intro_shown')) {
                  setProgress('ch1.carnet_intro_shown');
                  this.carnet.open();
                }
              });
            });
          }
        );
      });
    } else {
      this.veraGreeted = true;
    }
  }

  // ────────────────────────────────────────────────────────────
  // Wake Cycle — 90s passive cinematic, skip after 5s grace.
  // ────────────────────────────────────────────────────────────
  private playWakeCycle(onDone: () => void): void {
    const cam = this.cameras.main;
    cam.setBackgroundColor(0x000000);

    // Mark done immediately so a mid-cinematic refresh doesn't replay it.
    setProgress('ch1.wake_cycle_done');

    // Black screen layer
    const black = this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x000000, 1)
      .setOrigin(0)
      .setDepth(3000);

    // Eyelids — two horizontal bands that retract upward/downward to reveal a slit
    const lidTop = this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT / 2, 0x000000, 1)
      .setOrigin(0)
      .setDepth(3010);
    const lidBot = this.add.rectangle(0, GAME_HEIGHT, GAME_WIDTH, GAME_HEIGHT / 2, 0x000000, 1)
      .setOrigin(0, 1)
      .setDepth(3010);

    // Faint cryo-pod glow visible BETWEEN the eyelids
    const podGlow = this.add.ellipse(GAME_WIDTH / 2, GAME_HEIGHT / 2, 800, 600, 0x2a4a5e, 1)
      .setDepth(3005)
      .setAlpha(0);

    // Frost ring on porthole — many small white dots in a circle pattern
    const frostLayer = this.add.container(GAME_WIDTH / 2, GAME_HEIGHT / 2)
      .setDepth(3007)
      .setAlpha(0);
    for (let i = 0; i < 60; i++) {
      const angle = (i / 60) * Math.PI * 2 + Math.random() * 0.4;
      const r = 220 + Math.random() * 80;
      const dot = this.add.circle(
        Math.cos(angle) * r,
        Math.sin(angle) * r,
        2 + Math.random() * 3,
        0xddeeff,
        0.6 + Math.random() * 0.3
      );
      frostLayer.add(dot);
    }

    // Flickering shape outside the porthole (VERA observing) — cyan rect that drifts
    const veraShape = this.add.rectangle(-60, GAME_HEIGHT / 2 - 100, 80, 220, 0x6dd5ed, 0.5)
      .setDepth(3008)
      .setAlpha(0);
    veraShape.setStrokeStyle(2, 0xa8dadc, 0.7);

    // Narration text overlay
    const narration = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 350, '', {
      fontFamily: FONTS.body,
      fontSize: '36px',
      color: '#f4e9d8',
      align: 'center',
      wordWrap: { width: GAME_WIDTH - 120 },
    }).setOrigin(0.5).setDepth(3050).setAlpha(0);

    // Skip hint (appears after 5s grace)
    const skipHint = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 120, 'Tape pour passer', {
      fontFamily: FONTS.mono,
      fontSize: '22px',
      color: '#a8dadc',
    }).setOrigin(0.5).setDepth(3050).setAlpha(0);

    // Skip handler — single full-screen interactive layer (above everything)
    const skipZone = this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.001)
      .setOrigin(0)
      .setDepth(3100);
    let skipEnabled = false;
    let finished = false;

    const finishCycle = () => {
      if (finished) return;
      finished = true;
      // Stop any pending timers
      this.tweens.killAll();
      // Fade everything out
      this.tweens.add({
        targets: [black, lidTop, lidBot, podGlow, frostLayer, veraShape, narration, skipHint],
        alpha: 0,
        duration: 600,
        onComplete: () => {
          black.destroy();
          lidTop.destroy();
          lidBot.destroy();
          podGlow.destroy();
          frostLayer.destroy();
          veraShape.destroy();
          narration.destroy();
          skipHint.destroy();
          skipZone.destroy();
          onDone();
        },
      });
    };

    skipZone.setInteractive({ useHandCursor: true });
    skipZone.on('pointerdown', () => {
      if (skipEnabled) finishCycle();
    });

    // Soft pod beep at start
    playSfx('beep');

    // === Sequence (90s total) ===
    // 0–4s: pure black silence
    // 4–8s: "Tu ouvres les yeux." text fade-in + eyelids retract slightly + pod glow
    // 8–14s: frost appears
    // 14–22s: VERA shape drifts past porthole (left → right, slow)
    // 22–28s: pod beeps
    // 28–40s: second narration "Module cryo. Cycle inconnu. Quelqu'un t'observe à travers le hublot."
    // 40–88s: silence/contemplation, narration fades
    // 88–90s: fade to bootScene

    // 4s — first text + eyelids open partially
    this.time.delayedCall(4000, () => {
      narration.setText('Tu ouvres les yeux.');
      this.tweens.add({ targets: narration, alpha: 1, duration: 1200 });
      this.tweens.add({ targets: lidTop, height: GAME_HEIGHT / 2 - 80, duration: 2400, ease: 'Sine.easeOut' });
      this.tweens.add({ targets: lidBot, height: GAME_HEIGHT / 2 - 80, duration: 2400, ease: 'Sine.easeOut' });
      this.tweens.add({ targets: podGlow, alpha: 0.5, duration: 2400 });
    });

    // 5s — enable skip
    this.time.delayedCall(5000, () => {
      skipEnabled = true;
      this.tweens.add({ targets: skipHint, alpha: 0.7, duration: 800 });
    });

    // 8s — frost appears
    this.time.delayedCall(8000, () => {
      this.tweens.add({ targets: frostLayer, alpha: 1, duration: 2000 });
    });

    // 14s — VERA shape drifts past
    this.time.delayedCall(14000, () => {
      veraShape.setAlpha(0.7);
      this.tweens.add({
        targets: veraShape,
        x: GAME_WIDTH + 60,
        duration: 8000,
        ease: 'Sine.easeInOut',
      });
      // Pulse alpha during drift
      this.tweens.add({
        targets: veraShape,
        alpha: { from: 0.7, to: 0.3 },
        duration: 600,
        yoyo: true,
        repeat: 6,
      });
    });

    // 22s — beep
    this.time.delayedCall(22000, () => playSfx('beep'));
    this.time.delayedCall(24500, () => playSfx('beep'));

    // 28s — second narration
    this.time.delayedCall(28000, () => {
      this.tweens.add({
        targets: narration,
        alpha: 0,
        duration: 800,
        onComplete: () => {
          narration.setText('Module cryo. Cycle inconnu.\nQuelqu\'un t\'observe à travers le hublot.');
          this.tweens.add({ targets: narration, alpha: 1, duration: 1200 });
        },
      });
    });

    // 50s — narration fades, eyelids open fully
    this.time.delayedCall(50000, () => {
      this.tweens.add({ targets: narration, alpha: 0, duration: 1500 });
      this.tweens.add({ targets: lidTop, height: 0, duration: 3000, ease: 'Sine.easeOut' });
      this.tweens.add({ targets: lidBot, height: 0, duration: 3000, ease: 'Sine.easeOut' });
    });

    // 88s — auto-end
    this.time.delayedCall(88000, () => finishCycle());
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
    this.add.text(GAME_WIDTH / 2, HUD.topBarHeight + 30, 'MODULE A — CRYO', {
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
    // Polaroid de Naïs — small white-bordered photo, slightly tilted, with handwritten date.
    const c = this.add.container(x, y);
    c.setDepth(8);
    c.setAngle(-6);
    const g = this.add.graphics();
    // White polaroid border
    g.fillStyle(COLORS.cream, 1);
    g.fillRect(-55, -75, 110, 150);
    // Photo area (sky blue background — outdoor)
    g.fillStyle(0x6dadd5, 1);
    g.fillRect(-47, -67, 94, 110);
    // A small grass strip
    g.fillStyle(0x4a7a3e, 1);
    g.fillRect(-47, 30, 94, 13);
    // A child silhouette (head + body)
    g.fillStyle(0xf4d4a2, 1);
    g.fillCircle(0, -20, 12); // head
    g.fillStyle(0xc0392b, 1);
    g.fillRect(-12, -8, 24, 26); // red dress
    g.fillStyle(0xf4d4a2, 1);
    g.fillRect(-15, 18, 6, 14); // left leg
    g.fillRect(9, 18, 6, 14);   // right leg
    c.add(g);
    // Handwritten date on the white border (bottom)
    const date = this.add.text(0, 60, '14.03.2064', {
      fontFamily: FONTS.body,
      fontSize: '18px',
      color: '#3a2614',
      fontStyle: 'italic',
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
        this.showNarration('Ta cryo-capsule est ouverte. Tu y as passé... combien de temps ? Difficile à dire. Une page froissée glisse sous l\'oreiller.');
      },
      onPick: () => {
        this.recordTap();
        if (!hasItem('bracelet') && !hasProgress('ch1.bracelet_taken')) {
          this.showNarration('Tu fouilles la capsule. Sous l\'oreiller : une montre cassée et une page de ton journal pré-cryo. Tu prends les deux.', () => {
            addItem('bracelet');
            setProgress('ch1.bracelet_taken');
            notifyInventoryChange();
            // Safety net — also collect journal (normally auto-collected on intro,
            // but this guarantees it if intro was skipped or migrated mid-scene).
            this.collectFragment('ch1.journal_voss');
          });
        } else {
          this.showNarration('Ta cryo-capsule, vide à présent. Le couvercle reste tiède.');
        }
      },
    });

    // Vesper pod (LEFT) — narrative + log_vesper after second LOOK
    new Hotspot(this, {
      x: 280,
      y: STAGE_BOTTOM_Y - 360,
      width: 180,
      height: 540,
      name: 'pod du Capt. Vesper',
      showIndicator: false, // discrete — discoverable by exploration
      onLook: () => {
        this.recordTap();
        const seen = hasProgress('ch1.vesper_pod_seen');
        if (!seen) {
          setProgress('ch1.vesper_pod_seen');
          this.showNarration('Le pod du Capt. Vesper. La sangle est calmement bouclée. Comme s\'il était sorti de son plein gré. Sous le harnais, un boîtier d\'enregistrement clignote encore.');
        } else {
          this.showNarration('Tu rouvres le boîtier. Une voix grave, calme. Vesper. Cycle 247.', () => {
            this.collectFragment('ch1.log_vesper');
          });
        }
      },
      onPick: () => {
        this.recordTap();
        this.showNarration('La sangle est verrouillée. Tu peux écouter, pas démonter.');
      },
    });

    // Han pod (RIGHT) — sangle arrachée + medfile_voss on LOOK
    new Hotspot(this, {
      x: GAME_WIDTH - 280,
      y: STAGE_BOTTOM_Y - 360,
      width: 180,
      height: 540,
      name: 'pod du Dr. Han',
      showIndicator: false,
      onLook: () => {
        this.recordTap();
        this.showNarration('Le pod de Dr. Han. Sa visière médicale repose sur l\'oreiller. La sangle a été arrachée. Une fiche imprimée est glissée dans la doublure — ton nom est dessus.', () => {
          this.collectFragment('ch1.medfile_voss');
        });
      },
      onPick: () => {
        this.recordTap();
        this.showNarration('Tu prends la fiche. Elle parle de toi. Lecture difficile.');
      },
    });

    // Locker (with badge & note) — primary tap also picks up + Vera first-words log
    const pickLocker = () => {
      this.recordTap();
      if (!hasItem('badge') && !hasProgress('ch1.badge_taken')) {
        this.showNarration('Tu rassembles ce que tu peux : le badge, la note manuscrite. En glissant le badge, le terminal du locker s\'allume une seconde — le tout premier message de VERA s\'affiche.', () => {
          addItem('badge');
          addItem('note_leah');
          setProgress('ch1.badge_taken');
          notifyInventoryChange();
          // Swap locker visual to "open"
          if (this.lockerVisual && this.textures.exists('lockerOpen')) {
            this.lockerVisual.setTexture('lockerOpen');
          }
          // Collect both fragments revealed by the locker
          this.collectFragment('ch1.medfile_voss');
          this.collectFragment('ch1.vera_first_words');
        });
      } else {
        this.showNarration('Le locker est ouvert. Vide.');
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
        this.showNarration('Un locker métallique. Quelques affaires personnelles. Un badge, une note manuscrite, un terminal clignotant.');
      },
      onPick: pickLocker,
      onUse: pickLocker,
    });

    // Polaroid de Naïs (THE clue — 14.03.2064 → code 1403). PHARAÉL's daughter.
    const pickFrame = () => {
      this.recordTap();
      if (!hasItem('cryo_schema') && !hasProgress('ch1.schema_taken')) {
        this.showNarration('Tu prends le polaroid. Au dos, à l\'encre : "14.03.2064 — le jour où PHARAÉL embarqua sans dire au revoir à Naïs."', () => {
          addItem('cryo_schema');
          setProgress('ch1.schema_taken');
          notifyInventoryChange();
          this.collectFragment('ch1.photo_nais');
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
        this.showNarration('Le polaroid de Naïs. Une fillette qui rit dans l\'herbe. 14.03.2064 au dos.');
      }
    };
    new Hotspot(this, {
      x: this.framePosition.x,
      y: this.framePosition.y,
      width: 220,
      height: 220,
      name: 'polaroid de Naïs',
      onLook: () => {
        this.recordTap();
        this.showNarration('Un polaroid posé sur le locker. Une fillette en robe rouge, environ 5 ans, dans un jardin. Trouvé dans le pod de PHARAÉL. Au dos, une date manuscrite est partiellement visible.');
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
        this.showNarration('La porte du module cryo. Verrouillée. Le terminal en commande l\'accès.');
      },
      onUse: () => {
        this.recordTap();
        this.showNarration('Verrouillé. Le terminal cryo en commande l\'accès.');
      },
    });

    // === Hidden comm panel — left wall, behind the locker decoration. ===
    // No indicator. Discoverable via verb LOOK on the wall area. Two LOOKs
    // reveal a slipped-in polaroid + a circuit fragment for Ch3's COMBINE recipe.
    new Hotspot(this, {
      x: 100,
      y: STAGE_BOTTOM_Y - 350,
      width: 200,
      height: 220,
      name: 'panneau de communication',
      showIndicator: false,
      onLook: () => {
        this.recordTap();
        if (hasProgress('ch1.comm_panel_secret_taken')) {
          this.showNarration('Le panneau de communication, vide à présent. Le mur garde un rectangle plus clair là où le polaroid était caché.');
          return;
        }
        this.commPanelLookCount += 1;
        if (this.commPanelLookCount === 1) {
          this.showNarration('Le panneau de communication est cassé. Quelque chose semble glissé derrière — un coin de papier, peut-être.');
        } else {
          // Second LOOK → reveal
          this.commPanelSecretReveal();
        }
      },
      onPick: () => {
        this.recordTap();
        if (hasProgress('ch1.comm_panel_secret_taken')) {
          this.showNarration('Plus rien à prendre derrière ce panneau.');
          return;
        }
        if (this.commPanelLookCount === 0) {
          // Direct PICK without examining first → first LOOK message
          this.commPanelLookCount = 1;
          this.showNarration('Le panneau ne s\'enlève pas d\'un coup. Tu y reviens d\'abord du regard — un coin de papier dépasse derrière.');
          return;
        }
        // Already examined once → reveal
        this.commPanelSecretReveal();
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

  /** Reveals the polaroid + circuit fragment behind the comm panel. */
  private commPanelSecretReveal(): void {
    if (hasProgress('ch1.comm_panel_secret_taken')) return;
    setProgress('ch1.comm_panel_secret_taken');
    this.showNarration('Tu glisses la main derrière le panneau. Tes doigts trouvent deux choses : un polaroid jauni et un petit fragment de circuit qui pourrait s\'adapter à ton bracelet.', () => {
      addItem('circuit_fragment');
      notifyInventoryChange();
      this.collectFragment('ch1.secret_photo');
    });
  }

  private openKeypad(): void {
    new Keypad(this, {
      digits: 4,
      solution: SOLUTIONS.ch1Code,
      prompt: 'Code à 4 chiffres',
      onCorrect: () => this.onCodeCorrect(),
      onWrong: () => this.showVera('Le code ne correspond pas. Réessayez quand vous voulez.'),
    });
  }

  private onCodeCorrect(): void {
    addItem('cryo_key');
    setProgress('ch1.solved');
    notifyInventoryChange();
    // The terminal triggers Vesper's voice log on correct code (diegetic — the
    // door unlock pulls a queued audio entry from the same archive).
    this.collectFragment('ch1.log_vesper');
    const player = getPlayer();
    const name = player.name || 'visiteur·euse';
    this.showVeraSequence(
      [
        `Bien joué, ${name}. La porte s\'ouvre.`,
        'Un dernier message archivé se déclenche depuis le terminal. Voix du Capt. Vesper. Cycle 247.',
      ],
      () => {
        this.fadeToScene('ChapterIntroScene', { chapter: 2 });
      }
    );
  }
}
