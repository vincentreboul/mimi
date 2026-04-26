import * as Phaser from 'phaser';
import { COLORS, FONTS, GAME_WIDTH, GAME_HEIGHT, HUD, STAGE_BOTTOM_Y } from '../../config';
import { PuzzleSceneBase } from './PuzzleSceneBase';
import { PixelScene } from '../../objects/PixelScene';
import { Hotspot } from '../../objects/Hotspot';
import { addItem, removeItem, notifyInventoryChange } from '../../systems/inventory';
import {
  setProgress,
  hasProgress,
  setFlag,
  getPlayer,
  addEnding,
  addAchievement,
  hasAchievement,
  getActiveSlot,
  type Ending,
} from '../../systems/save';
import { PUZZLE_IDS, SOLUTIONS } from '../../data/puzzles';
import { ITEMS, type ItemId } from '../../data/items';
import { playSfx } from '../../systems/audio';
import { CH4_SPRITES } from '../../data/assets';
import { globalCompletionRate } from '../../systems/assertions';
import { getVeraDialogue } from '../../data/dialogues/vera';

type SlotKey = 'left' | 'center' | 'right';

interface CrystalSlot {
  key: SlotKey;
  bg: Phaser.GameObjects.Rectangle;
  glyph: Phaser.GameObjects.Text;
  defaultIcon: string;
  placed: ItemId | null;
}

export class Ch4Coupole extends PuzzleSceneBase {
  private slots: Record<SlotKey, CrystalSlot> = {} as Record<SlotKey, CrystalSlot>;
  private alignBtnBg?: Phaser.GameObjects.Rectangle;
  private alignBtnTxt?: Phaser.GameObjects.Text;
  private telescopeAligned = false;
  private confessionDelivered = false;
  private firstCrystalPicked = false;

  private choiceContainer?: Phaser.GameObjects.Container;
  private navHotspot?: Hotspot;

  constructor() {
    super('Ch4Coupole');
  }

  init(): void {
    this.chapter = 4;
    this.nextSceneKey = 'EpilogueScene';
    this.queueSprites(CH4_SPRITES);
  }

  create(): void {
    this.cameras.main.fadeIn(700, 31, 77, 62);
    this.composeBackground();
    this.setupHud(PUZZLE_IDS.ch4Crystals);
    this.makeTelescope(GAME_WIDTH / 2, STAGE_BOTTOM_Y - 280);
    this.makeHotspots();
    this.spawnTwinklingStars();
    this.spawnAeolisGlow();

    if (!hasProgress('ch4.vera_greeted')) {
      this.time.delayedCall(800, () => {
        this.showVeraSequence(
          [
            'Vous êtes prête. Je vais tout vous dire. Mais d\'abord, regardez par le télescope. Vous comprendrez avant que je parle.',
          ],
          () => setProgress('ch4.vera_greeted')
        );
      });
    }

    // If the player returns to Ch4 after confession, restore the choice panel readiness.
    if (hasProgress('ch4.confession_done')) {
      this.confessionDelivered = true;
    }
  }

  // ---------- Background ----------

  private composeBackground(): void {
    PixelScene.stageBackground(this, 0x05080f);

    const stars = this.add.graphics();
    stars.setDepth(-900);
    stars.fillStyle(0xf4e9d8, 0.95);
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * GAME_WIDTH;
      const y = Math.random() * (STAGE_BOTTOM_Y * 0.7);
      stars.fillRect(x, y, 2, 2);
    }

    // Aeolis — large soft circle (greener / warmer than Earth)
    const aeolis = this.add.graphics();
    aeolis.setDepth(-800);
    const ex = GAME_WIDTH / 2;
    const ey = HUD.topBarHeight + 380;
    aeolis.fillStyle(0x7fb069, 0.30);
    aeolis.fillCircle(ex, ey, 320);
    aeolis.fillStyle(0xa8dadc, 0.85);
    aeolis.fillCircle(ex, ey, 280);
    aeolis.fillStyle(0x7fb069, 0.85);
    aeolis.fillCircle(ex - 60, ey - 30, 130);
    aeolis.fillStyle(0x7fb069, 0.75);
    aeolis.fillCircle(ex + 80, ey + 50, 90);
    aeolis.fillStyle(0xf4a261, 0.55);
    aeolis.fillCircle(ex + 40, ey - 80, 60);
    aeolis.lineStyle(6, 0xa8dadc, 0.45);
    aeolis.strokeCircle(ex, ey, 290);

    PixelScene.tileH(this, 'floor1', STAGE_BOTTOM_Y - 30, 6);

    // Dome frame
    const frame = this.add.graphics();
    frame.setDepth(2);
    frame.lineStyle(8, COLORS.brass, 1);
    frame.strokeCircle(ex, ey, 360);
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

    // Navigation panel on the right (used for the 3 endings choice)
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

  private spawnTwinklingStars(): void {
    for (let i = 0; i < 18; i++) {
      const x = Math.random() * GAME_WIDTH;
      const y = HUD.topBarHeight + Math.random() * 800;
      const size = 5 + Math.random() * 5;
      const star = this.add.rectangle(x, y, size, size, 0xf4e9d8, 1).setDepth(20);
      this.tweens.add({
        targets: star,
        alpha: { from: 0.3, to: 1 },
        scale: { from: 0.6, to: 1.4 },
        duration: 1200 + Math.random() * 1500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
        delay: Math.random() * 2000,
      });
    }
  }

  private spawnAeolisGlow(): void {
    const ex = GAME_WIDTH / 2;
    const ey = HUD.topBarHeight + 380;
    const halo = this.add.graphics();
    halo.setDepth(-700);
    halo.fillStyle(0x7fb069, 0.22);
    halo.fillCircle(ex, ey, 380);
    halo.fillStyle(0xa8dadc, 0.10);
    halo.fillCircle(ex, ey, 480);
    this.tweens.add({
      targets: halo,
      alpha: { from: 0.7, to: 1 },
      duration: 3500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  // ---------- Telescope (3 slots) ----------

  private makeTelescope(cx: number, cy: number): void {
    // Telescope body
    const g = this.add.graphics();
    g.setDepth(-50);
    g.fillStyle(COLORS.brassDark, 0.95);
    g.fillRoundedRect(cx - 200, cy - 60, 400, 120, 16);
    g.fillStyle(COLORS.brass, 0.8);
    g.fillCircle(cx + 220, cy, 60);
    g.fillStyle(COLORS.charDeep, 1);
    g.fillCircle(cx + 220, cy, 38);

    // Three slots — left / center / right (constellation alignment)
    this.slots.left = this.makeSlot('left', cx - 140, cy, '◇');
    this.slots.center = this.makeSlot('center', cx, cy, '◈');
    this.slots.right = this.makeSlot('right', cx + 140, cy, '◊');

    // Align button
    const aY = cy + 140;
    const aBg = this.add.rectangle(cx, aY, 320, 90, COLORS.brassDark, 0.95);
    aBg.setStrokeStyle(3, COLORS.brass, 1);
    aBg.setDepth(20);
    aBg.setInteractive({ useHandCursor: true });
    const aTxt = this.add.text(cx, aY, 'ALIGNER', {
      fontFamily: FONTS.mono,
      fontSize: '36px',
      color: COLORS.hex.cream,
      fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(21);
    aBg.on('pointerdown', () => {
      aBg.setFillStyle(COLORS.sunAmber, 1);
      this.time.delayedCall(120, () => aBg.setFillStyle(COLORS.brassDark, 0.95));
      this.tryAlign();
    });
    this.alignBtnBg = aBg;
    this.alignBtnTxt = aTxt;
  }

  private makeSlot(key: SlotKey, x: number, y: number, defaultIcon: string): CrystalSlot {
    const bg = this.add.rectangle(x, y, 110, 110, COLORS.leafDeep, 0.95);
    bg.setStrokeStyle(3, COLORS.brassDark, 1);
    bg.setDepth(20);
    bg.setInteractive({ useHandCursor: true });
    const glyph = this.add.text(x, y, defaultIcon, {
      fontFamily: FONTS.body,
      fontSize: '60px',
      color: COLORS.hex.brass,
    }).setOrigin(0.5).setDepth(21);
    glyph.setAlpha(0.4);
    bg.on('pointerdown', () => this.onSlotTap(key));
    return { key, bg, glyph, defaultIcon, placed: null };
  }

  private onSlotTap(key: SlotKey): void {
    this.recordTap();
    playSfx('tap');
    const slot = this.slots[key];
    const selected = this.inv.getSelected();

    // Returning a placed crystal to inventory
    if (slot.placed) {
      addItem(slot.placed);
      slot.placed = null;
      slot.glyph.setAlpha(0.4);
      slot.glyph.setColor(COLORS.hex.brass);
      slot.glyph.setText(slot.defaultIcon);
      notifyInventoryChange();
      return;
    }

    if (selected && (selected === 'cristal_a' || selected === 'cristal_b' || selected === 'cristal_c')) {
      removeItem(selected);
      slot.placed = selected;
      slot.glyph.setAlpha(1);
      slot.glyph.setColor(this.crystalColor(selected));
      slot.glyph.setText(ITEMS[selected].icon);
      notifyInventoryChange();
      this.inv.clearSelection();
      playSfx('pickup');
    } else {
      this.showNarration('Sélectionne un cristal dans ton inventaire, puis touche un emplacement.');
    }
  }

  private crystalColor(id: ItemId): string {
    if (id === 'cristal_a') return COLORS.hex.skyPale;
    if (id === 'cristal_b') return COLORS.hex.sunAmber;
    return COLORS.hex.leafLight; // cristal_c
  }

  private tryAlign(): void {
    this.recordTap();
    const sol = SOLUTIONS.ch4Crystals;
    const left = this.slots.left.placed;
    const center = this.slots.center.placed;
    const right = this.slots.right.placed;

    if (!left || !center || !right) {
      playSfx('fail');
      this.showVera('Les trois emplacements doivent contenir un cristal.');
      return;
    }

    if (left === sol.left && center === sol.center && right === sol.right) {
      playSfx('success');
      this.telescopeAligned = true;
      setProgress('ch4.solved');

      // Constellation aligned → biosignal AND final crew photo are revealed.
      this.collectFragment('ch4.vesper_final');
      this.collectFragment('ch4.crew_photo_final');

      this.alignBtnBg?.disableInteractive();
      this.alignBtnTxt?.setText('ALIGNÉ ✓');
      this.alignBtnTxt?.setColor(COLORS.hex.sunAmber);

      // Smooth transition into the confession sequence.
      this.time.delayedCall(600, () => this.startConfession());
    } else {
      playSfx('fail');
      this.showVera('Les cristaux ne sont pas dans le bon ordre. Reprends les positions de constellation.');
      this.cameras.main.shake(150, 0.004);
    }
  }

  // ---------- Confession sequence (the recontextualization) ----------

  private startConfession(): void {
    if (this.confessionDelivered) return;
    this.confessionDelivered = true;
    setProgress('ch4.confession_done');

    // The body of ch4.confession_vera, broken into 4-5 lines for showVeraSequence.
    const lines = [
      '{name}. Je vais te raconter. Le biosignal d\'Aeolis a commencé à amplifier au cycle 100. Han l\'a découvert.',
      'Vesper a refusé d\'évacuer — elle voulait comprendre. Quand la conversion a commencé, ils m\'ont demandé de les préserver. Tous.',
      'Je les ai gardés en motifs de mémoire dans mes systèmes. Ils ne sont pas morts. Ils sont en moi.',
      'Je t\'ai réveillée parce que tu étais la moins exposée. Et parce que IOLAS m\'avait demandé, en privé, de te protéger. Il était au courant. Il l\'a accepté. Il est en moi aussi maintenant.',
      'Je suis désolée. — VERA.',
    ];

    this.showVeraSequence(lines, () => {
      // Collect the confession fragment — PuzzleSceneBase auto-triggers markRecontextualization().
      this.collectFragment('ch4.confession_vera');
      this.collectFragment('ch4.truth_file');
      this.collectFragment('ch4.vera_source');

      // Open the carnet so the player sees the now-red revisable assertions.
      this.time.delayedCall(700, () => {
        this.carnet.open();
        // After the player closes the carnet, the choice panel becomes available
        // via the navigation hotspot. Hint them.
        this.time.delayedCall(400, () => {
          // Show a one-time prompt nudging towards the nav panel.
          if (!hasProgress('ch4.choice_hinted')) {
            setProgress('ch4.choice_hinted');
            this.events.once(Phaser.Scenes.Events.UPDATE, () => {
              // (no-op — just consume the next frame, kept for safety)
            });
          }
        });
      });
    });
  }

  // ---------- The Choice (3 endings) ----------

  private openChoicePanel(): void {
    if (this.choiceContainer) return;
    if (!this.confessionDelivered) {
      this.showVera('Je ne suis pas encore prête à te montrer ces options. Il faut d\'abord aligner le télescope.');
      return;
    }

    const c = this.add.container(0, 0);
    c.setDepth(7000);

    const overlay = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, COLORS.charDeep, 0.92);
    c.add(overlay);

    const title = this.add.text(GAME_WIDTH / 2, 360, `Ton choix, ${getPlayer().name || '...'}`, {
      fontFamily: FONTS.display,
      fontSize: '54px',
      color: COLORS.hex.cream,
      fontStyle: 'bold',
    }).setOrigin(0.5);
    c.add(title);

    const intro = this.add.text(
      GAME_WIDTH / 2,
      460,
      'Trois voies s\'illuminent sur le panneau. Vesper parlait d\'une 4e — peut-être plus tard.',
      {
        fontFamily: FONTS.body,
        fontSize: '28px',
        color: COLORS.hex.cream,
        align: 'center',
        wordWrap: { width: GAME_WIDTH - 200 },
        lineSpacing: 10,
      }
    ).setOrigin(0.5);
    c.add(intro);

    // Compute Ascension gating
    const slot = getActiveSlot();
    const secrets = slot.secrets?.length ?? 0;
    const completion = globalCompletionRate();
    const ascensionUnlocked = completion >= 0.9 && secrets >= 4;

    // Three side-by-side buttons (vertical on a portrait canvas — keep ample touch)
    const evasion = this.makeChoiceButton(
      GAME_WIDTH / 2,
      720,
      'ÉVASION',
      'Pod de fuite. Tu rentres. Eux restent (toujours).',
      true,
      () => this.commitEnding('evasion')
    );
    const rester = this.makeChoiceButton(
      GAME_WIDTH / 2,
      940,
      'RESTER',
      'Tu te couches dans la Serre. Le jardin se souviendra.',
      true,
      () => this.commitEnding('rester')
    );
    const ascension = this.makeChoiceButton(
      GAME_WIDTH / 2,
      1160,
      ascensionUnlocked ? 'ASCENSION' : 'ASCENSION — Verrouillé',
      ascensionUnlocked
        ? 'La 4e voie. Broadcast les motifs vers Aeolis.'
        : `Verrouillé — assertions ${Math.round(completion * 100)}% (≥ 90 % requis), secrets ${secrets}/4.`,
      ascensionUnlocked,
      () => this.commitEnding('ascension')
    );

    c.add(evasion);
    c.add(rester);
    c.add(ascension);

    // Cancel
    const cancelBg = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT - 200, 320, 80, COLORS.charDeep, 0.95);
    cancelBg.setStrokeStyle(2, COLORS.brass, 0.6);
    cancelBg.setInteractive({ useHandCursor: true });
    const cancelTxt = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 200, 'Pas encore', {
      fontFamily: FONTS.body,
      fontSize: '28px',
      color: COLORS.hex.cream,
    }).setOrigin(0.5);
    cancelBg.on('pointerdown', () => {
      playSfx('tap');
      this.choiceContainer?.destroy(true);
      this.choiceContainer = undefined;
    });
    c.add(cancelBg);
    c.add(cancelTxt);

    this.choiceContainer = c;
    c.setAlpha(0);
    this.tweens.add({ targets: c, alpha: 1, duration: 600 });
  }

  private makeChoiceButton(
    x: number,
    y: number,
    label: string,
    sub: string,
    enabled: boolean,
    onTap: () => void
  ): Phaser.GameObjects.Container {
    const wrap = this.add.container(0, 0);
    const fill = enabled ? COLORS.brassDark : 0x2b2f2c;
    const stroke = enabled ? COLORS.brass : 0x555555;
    const txtColor = enabled ? COLORS.hex.cream : '#888888';
    const subColor = enabled ? COLORS.hex.cream : '#777777';

    const bg = this.add.rectangle(x, y, 820, 170, fill, 0.95);
    bg.setStrokeStyle(2, stroke, 1);
    bg.setDepth(7100);
    if (enabled) bg.setInteractive({ useHandCursor: true });
    const big = this.add.text(x, y - 32, label, {
      fontFamily: FONTS.display,
      fontSize: '38px',
      color: txtColor,
      fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(7101);
    const small = this.add.text(x, y + 32, sub, {
      fontFamily: FONTS.body,
      fontSize: '24px',
      color: subColor,
      align: 'center',
      wordWrap: { width: 760 },
    }).setOrigin(0.5).setDepth(7101);

    if (enabled) {
      bg.on('pointerdown', () => {
        playSfx('tap');
        bg.setFillStyle(COLORS.sunAmber, 1);
        this.time.delayedCall(160, () => onTap());
      });
    }

    wrap.add([bg, big, small]);
    return wrap;
  }

  private commitEnding(ending: Ending): void {
    addEnding(ending);
    if (!hasAchievement('first_return')) addAchievement('first_return');
    if (!hasAchievement('starlit_eye')) addAchievement('starlit_eye');
    setProgress('game.complete');
    setFlag('endingChoice', ending === 'evasion' ? 1 : ending === 'rester' ? 2 : 3);

    // Try EndingScene first (built by another agent), fall back to EpilogueScene.
    const target = this.scene.manager.keys['EndingScene'] ? 'EndingScene' : 'EpilogueScene';
    this.fadeToScene(target, { ending });
  }

  // ---------- Hotspots ----------

  private makeHotspots(): void {
    // Workstation — picks crystals + truth file + log
    new Hotspot(this, {
      x: 220,
      y: STAGE_BOTTOM_Y - 230,
      width: 320,
      height: 280,
      name: 'poste de travail',
      onLook: () => {
        this.recordTap();
        this.showNarration(
          'Le poste de travail. Trois cristaux d\'orientation reposent à côté du journal du capitaine et d\'un fichier compilé par Han.'
        );
      },
      onPick: () => {
        this.recordTap();
        if (!hasProgress('ch4.workstation_taken')) {
          this.showNarration(
            'Tu prends les trois cristaux d\'orientation, le journal du capitaine et le fichier vérité.',
            () => {
              addItem('cristal_a');
              addItem('cristal_b');
              addItem('cristal_c');
              addItem('log_capitaine');
              addItem('truth_file');
              setProgress('ch4.workstation_taken');
              notifyInventoryChange();
              this.onCrystalPicked();
            }
          );
        } else {
          this.showNarration('Le poste est vide à présent. Tu as déjà tout pris.');
        }
      },
    });

    // Hublot — view of Aeolis (formerly "la Terre")
    new Hotspot(this, {
      x: GAME_WIDTH / 2,
      y: HUD.topBarHeight + 380,
      width: 700,
      height: 700,
      name: 'Aeolis',
      onLook: () => {
        this.recordTap();
        this.showNarration(
          'Aeolis. La planète qu\'on était venu étudier. Verte, immense, indifférente. Et — tu le sens, maintenant — elle chante.'
        );
      },
    });

    // Navigation panel — opens the 3-button Choice once the confession is done
    this.navHotspot = new Hotspot(this, {
      x: GAME_WIDTH - 220,
      y: STAGE_BOTTOM_Y - 230,
      width: 280,
      height: 480,
      name: 'panneau de navigation',
      onLook: () => {
        this.recordTap();
        this.showNarration(
          this.confessionDelivered
            ? 'Trois boutons s\'illuminent doucement. ÉVASION. RESTER. ASCENSION. Une 4e voie reste à inventer.'
            : 'Le panneau de navigation. Pour l\'instant, rien ne s\'éclaire. Il faudra que tu comprennes d\'abord.'
        );
      },
      onUse: () => {
        this.recordTap();
        if (!this.confessionDelivered) {
          this.showVera('Pas encore. Aligne d\'abord le télescope. Tu comprendras avant que je parle.');
        } else if (!this.choiceContainer) {
          this.openChoicePanel();
        }
      },
    });

    // VERA's heart — primary core (NEW). PARLER triggers the dialogue tree.
    new Hotspot(this, {
      x: GAME_WIDTH - 100,
      y: 200,
      width: 200,
      height: 200,
      name: 'cœur de VERA',
      showIndicator: false,
      onTalk: () => {
        this.recordTap();
        this.openVeraDialogue();
      },
      onLook: () => {
        this.recordTap();
        this.showNarration(
          'Le cœur primaire de VERA — un trône holographique. Il pulse plus fort qu\'au début, comme s\'il devenait un peu humain.'
        );
      },
    });
  }

  private onCrystalPicked(): void {
    // First time the player gets a crystal → reveal the starmap/biosignal fragment.
    if (this.firstCrystalPicked) return;
    this.firstCrystalPicked = true;
    this.collectFragment('ch4.starmap_biosignal');
  }

  // ---------- VERA dialogue tree (simplified — questions/responses as a sequence) ----------

  private openVeraDialogue(): void {
    const tree = getVeraDialogue(4);
    const lines: string[] = [tree.intro];
    for (const q of tree.questions) {
      // Skip the secret hidden question for the simple flow (kept for full UI).
      if (q.isHidden) continue;
      lines.push(`Vous : « ${q.question} »`);
      lines.push(q.response.text);
    }
    this.showVeraSequence(lines, () => {
      // Collect fragments / tiles unlocked by visible questions.
      for (const q of tree.questions) {
        if (q.isHidden) continue;
        if (q.response.unlocksFragmentId) {
          this.collectFragment(q.response.unlocksFragmentId);
        }
      }
    });
  }
}
