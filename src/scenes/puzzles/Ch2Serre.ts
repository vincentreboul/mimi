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
import { playSfx } from '../../systems/audio';
import { grant } from '../../systems/achievements';

export class Ch2Serre extends PuzzleSceneBase {
  // Lumira amber halo (we tween it on the song)
  private lumiraHalo?: Phaser.GameObjects.Graphics;
  private lumiraSprite?: Phaser.GameObjects.Image;

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
          [
            'Avez-vous remarqué que les plantes vous suivent du regard ? Je me demande si elles vous reconnaissent, {name}.',
            'Cette serre était le territoire du botaniste — Dr. Han. Il avait beaucoup à dire sur la Lumira. Beaucoup à taire, aussi.',
          ],
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
    this.lumiraSprite = PixelScene.place(this, 'orange1', GAME_WIDTH / 2, STAGE_BOTTOM_Y - 60, 2.2, { origin: { x: 0.5, y: 1 }, depth: 8 });
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

    // Notes / cards / botanist office
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
    // === LUMIRA — central plant (existing fert puzzle) ===
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
        } else if (hasItem('bracelet_tuned')) {
          this.triggerLumiraSong();
        } else {
          this.showNarration(t('scene.ch2.lumira_use_other'));
        }
      },
      onPick: () => {
        this.recordTap();
        // First pick prelevs a sample
        if (!hasItem('sample_lumira') && !hasProgress('ch2.sample_taken')) {
          this.showNarration('Tu détaches délicatement une feuille de Lumira. Elle est tiède dans ta paume.', () => {
            addItem('sample_lumira');
            setProgress('ch2.sample_taken');
            notifyInventoryChange();
          });
        } else {
          this.showNarration('La Lumira est trop précieuse pour la déplacer.');
        }
      },
    });

    // === FERTILIZER SHELF ===
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

    // === BOTANIST OFFICE — notes drawer (Han's research) ===
    new Hotspot(this, {
      x: GAME_WIDTH - 220,
      y: STAGE_BOTTOM_Y - 380,
      width: 320,
      height: 280,
      name: 'cahier du botaniste',
      onLook: () => {
        this.recordTap();
        this.showNarration('Le bureau du botaniste — Dr. Han. Une écriture serrée, méthodique. Des dizaines de pages sur Lumira.');
      },
      onPick: () => {
        this.recordTap();
        if (!hasItem('note_botanique') && !hasProgress('ch2.notes_taken')) {
          this.showNarration('Tu prends la note botanique du Dr. Han sur la Lumira.', () => {
            addItem('note_botanique');
            setProgress('ch2.notes_taken');
            notifyInventoryChange();
            // Fragment: Han's research notes
            this.collectFragment('ch2.research_han');
          });
        } else {
          this.showNarration('Le bureau du botaniste — Dr. Han. Une écriture serrée, méthodique.');
        }
      },
    });

    // === PLANT CARDS — picks pince (pincers) for Ch2 disease puzzle path ===
    new Hotspot(this, {
      x: GAME_WIDTH - 220,
      y: STAGE_BOTTOM_Y - 200,
      width: 220,
      height: 180,
      name: 'cartes botaniques',
      onLook: () => {
        this.recordTap();
        this.showNarration('Un paquet de cartes "données botaniques". L\'équipage avait construit ce jeu de cartes ensemble — Vesper insistait pour faire participer tout le monde.');
      },
      onPick: () => {
        this.recordTap();
        if (!hasProgress('ch2.cards_taken')) {
          this.showNarration('Tu prends le paquet — et au milieu, glissée comme un signet, une graine de Lumira intacte. Une pince à plantes traîne aussi.', () => {
            addItem('graine_rare');
            addItem('pince');
            setProgress('ch2.cards_taken');
            notifyInventoryChange();
            // Fragment: disease note unlocked when player picks the pincers
            this.collectFragment('ch2.note_disease');
          });
        } else {
          this.showNarration('Le paquet est désormais incomplet, mais c\'est ce qui compte le plus.');
        }
      },
    });

    // === MICROSCOPE (NEW — Han's office) ===
    this.makeMicroscopeHotspot();

    // === IRRIGATION PANEL (NEW — left zone, sub-puzzle) ===
    this.makeIrrigationHotspot();

    // === LOCKED DRAWER — PHARAÉL secret ===
    this.makeDrawerHotspot();

    // === LUMIRA SECONDARY HOTSPOT — frequency clue ===
    new Hotspot(this, {
      x: GAME_WIDTH / 2 - 180,
      y: STAGE_BOTTOM_Y - 380,
      width: 140,
      height: 140,
      name: 'pot de Lumira',
      showIndicator: false,
      onLook: () => {
        this.recordTap();
        if (!hasItem('frequency_lumira') && !hasProgress('ch2.frequency_learned')) {
          this.showNarration('Sous le pot de Lumira, une étiquette manuscrite de Vesper : "Cycle 220 — chante en 7,3 Hz. Elle répond." Tu mémorises la fréquence.', () => {
            addItem('frequency_lumira');
            setProgress('ch2.frequency_learned');
            notifyInventoryChange();
          });
        } else {
          this.showNarration('Sous le pot, l\'étiquette de Vesper : "7,3 Hz".');
        }
      },
    });

    // === VERA hotspot ===
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

  // === MICROSCOPE PUZZLE ===
  private makeMicroscopeHotspot(): void {
    new Hotspot(this, {
      x: GAME_WIDTH - 380,
      y: STAGE_BOTTOM_Y - 380,
      width: 140,
      height: 140,
      name: 'microscope',
      showIndicator: false,
      onLook: () => {
        this.recordTap();
        this.showNarration('Le microscope du Dr. Han. Bien entretenu. Il y a une lamelle prête à recevoir un échantillon.');
      },
      onUse: () => {
        this.recordTap();
        if (hasProgress('ch2.microscope_done')) {
          this.showNarration('Tu as déjà analysé l\'échantillon. Les motifs cellulaires sont gravés dans ta mémoire.');
          return;
        }
        if (!hasItem('sample_lumira')) {
          this.showNarration('Tu n\'as aucun échantillon à analyser. Préleve d\'abord une feuille sur Lumira.');
          return;
        }
        this.openMicroscopePuzzle();
      },
    });
  }

  private openMicroscopePuzzle(): void {
    const overlay = this.add.container(0, 0).setDepth(2000);
    const bg = this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x0d2230, 0.92).setOrigin(0);
    overlay.add(bg);

    const title = this.add.text(GAME_WIDTH / 2, 220, 'MICROSCOPE — IDENTIFIE LUMIRA', {
      fontFamily: FONTS.mono,
      fontSize: '36px',
      color: COLORS.hex.brass,
      fontStyle: 'bold',
    }).setOrigin(0.5);
    overlay.add(title);

    const sub = this.add.text(GAME_WIDTH / 2, 290, 'Trois lamelles. Une seule contient des cellules de Lumira.', {
      fontFamily: FONTS.body,
      fontSize: '24px',
      color: COLORS.hex.cream,
      align: 'center',
      wordWrap: { width: 800 },
    }).setOrigin(0.5);
    overlay.add(sub);

    const slides = [
      { id: 'A', label: 'ÉCHANTILLON A', desc: 'Cellules hexagonales régulières, semblables au lichen martien.' },
      { id: 'B', label: 'ÉCHANTILLON B', desc: 'Motifs iridescents en spirale. Pulsation faible.' },
      { id: 'C', label: 'ÉCHANTILLON C', desc: 'Cellules amorphes, dégradées. Tissu mort.' },
    ];

    const cleanup = () => {
      overlay.destroy(true);
    };

    const correctId = 'B';

    slides.forEach((s, i) => {
      const x = GAME_WIDTH / 2 - 380 + i * 380;
      const y = 480;
      const card = this.add.rectangle(x, y, 320, 220, COLORS.brass, 0.95).setStrokeStyle(3, COLORS.charDeep, 1);
      card.setInteractive({ useHandCursor: true });
      const label = this.add.text(x, y - 60, s.label, {
        fontFamily: FONTS.mono,
        fontSize: '24px',
        color: COLORS.hex.charDeep,
        fontStyle: 'bold',
      }).setOrigin(0.5);
      const desc = this.add.text(x, y + 20, s.desc, {
        fontFamily: FONTS.body,
        fontSize: '18px',
        color: COLORS.hex.charDeep,
        align: 'center',
        wordWrap: { width: 290 },
      }).setOrigin(0.5);
      overlay.add([card, label, desc]);
      card.on('pointerdown', () => {
        playSfx('tap');
        if (s.id === correctId) {
          playSfx('success');
          setProgress('ch2.microscope_done');
          if (hasItem('sample_lumira')) removeItem('sample_lumira');
          addItem('lumira_analysis');
          notifyInventoryChange();
          cleanup();
          this.showNarration(
            'Au microscope, les cellules de Lumira forment des motifs réguliers. Aucune classification terrestre.',
            () => this.collectFragment('ch2.sample_lumira')
          );
        } else {
          playSfx('fail');
          card.setFillStyle(0xc94c4c, 0.8);
          this.tweens.add({
            targets: card,
            alpha: { from: 0.8, to: 1 },
            duration: 240,
            yoyo: true,
            onComplete: () => {
              card.setFillStyle(COLORS.brass, 0.95);
            },
          });
          // Brief inline message — overlay stays open so player can retry
          const hint = this.add.text(GAME_WIDTH / 2, 740, 'Pas Lumira. Cellules martiennes classiques.', {
            fontFamily: FONTS.body,
            fontSize: '22px',
            color: COLORS.hex.warning,
          }).setOrigin(0.5);
          overlay.add(hint);
          this.time.delayedCall(1600, () => hint.destroy());
        }
      });
    });

    // Close button
    const close = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 160, 'Fermer le microscope', {
      fontFamily: FONTS.mono,
      fontSize: '24px',
      color: COLORS.hex.cream,
      backgroundColor: '#3a3a3a',
      padding: { x: 18, y: 10 },
    }).setOrigin(0.5);
    close.setInteractive({ useHandCursor: true });
    close.on('pointerdown', () => {
      playSfx('tap');
      cleanup();
    });
    overlay.add(close);
  }

  // === IRRIGATION PUZZLE (sub-puzzle) ===
  private makeIrrigationHotspot(): void {
    new Hotspot(this, {
      x: 90,
      y: STAGE_BOTTOM_Y - 200,
      width: 160,
      height: 160,
      name: 'panneau d\'irrigation',
      showIndicator: false,
      onLook: () => {
        this.recordTap();
        this.showNarration('Le panneau d\'irrigation. Quatre vannes numérotées. Trois plantes assoiffées.');
      },
      onUse: () => {
        this.recordTap();
        if (hasProgress('ch2.irrigation_done')) {
          this.showNarration('L\'eau coule comme il faut. Les plantes ont récupéré.');
          return;
        }
        this.openIrrigationPuzzle();
      },
    });
  }

  private openIrrigationPuzzle(): void {
    const overlay = this.add.container(0, 0).setDepth(2000);
    const bg = this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x0d2230, 0.92).setOrigin(0);
    overlay.add(bg);

    const title = this.add.text(GAME_WIDTH / 2, 240, 'PANNEAU D\'IRRIGATION', {
      fontFamily: FONTS.mono,
      fontSize: '36px',
      color: COLORS.hex.brass,
      fontStyle: 'bold',
    }).setOrigin(0.5);
    overlay.add(title);

    const prompt = this.add.text(GAME_WIDTH / 2, 320, 'Trois plantes sont déshydratées. Active la vanne 2 puis la vanne 4.', {
      fontFamily: FONTS.body,
      fontSize: '22px',
      color: COLORS.hex.cream,
      align: 'center',
      wordWrap: { width: 900 },
    }).setOrigin(0.5);
    overlay.add(prompt);

    const choices = [
      { id: '1', text: 'Vanne 1 seule' },
      { id: '24', text: 'Vanne 2 puis vanne 4' },
      { id: '2', text: 'Vanne 2 seule' },
      { id: '42', text: 'Vanne 4 puis vanne 2' },
    ];
    const correctId = '24';

    const cleanup = () => overlay.destroy(true);

    choices.forEach((c, i) => {
      const y = 460 + i * 100;
      const btn = this.add.rectangle(GAME_WIDTH / 2, y, 600, 80, COLORS.brass, 0.95).setStrokeStyle(3, COLORS.charDeep, 1);
      btn.setInteractive({ useHandCursor: true });
      const txt = this.add.text(GAME_WIDTH / 2, y, c.text, {
        fontFamily: FONTS.mono,
        fontSize: '26px',
        color: COLORS.hex.charDeep,
        fontStyle: 'bold',
      }).setOrigin(0.5);
      overlay.add([btn, txt]);
      btn.on('pointerdown', () => {
        playSfx('tap');
        if (c.id === correctId) {
          playSfx('success');
          setProgress('ch2.irrigation_done');
          cleanup();
          this.showNarration(
            'L\'eau circule. Trois plantes rougeoient à nouveau. Dans l\'une d\'elles, un éclat de papier — une note du botaniste sur les pathologies.',
            () => this.collectFragment('ch2.note_disease')
          );
        } else {
          playSfx('fail');
          btn.setFillStyle(0xc94c4c, 0.8);
          this.tweens.add({
            targets: btn,
            alpha: { from: 0.8, to: 1 },
            duration: 240,
            yoyo: true,
            onComplete: () => btn.setFillStyle(COLORS.brass, 0.95),
          });
        }
      });
    });

    const close = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 160, 'Fermer le panneau', {
      fontFamily: FONTS.mono,
      fontSize: '24px',
      color: COLORS.hex.cream,
      backgroundColor: '#3a3a3a',
      padding: { x: 18, y: 10 },
    }).setOrigin(0.5);
    close.setInteractive({ useHandCursor: true });
    close.on('pointerdown', () => {
      playSfx('tap');
      cleanup();
    });
    overlay.add(close);
  }

  // === PHARAÉL LOCKED DRAWER (secret) ===
  private makeDrawerHotspot(): void {
    new Hotspot(this, {
      x: GAME_WIDTH - 100,
      y: STAGE_BOTTOM_Y - 100,
      width: 160,
      height: 160,
      name: 'tiroir verrouillé',
      showIndicator: false,
      onLook: () => {
        this.recordTap();
        if (hasProgress('ch2.drawer_opened')) {
          this.showNarration('Le tiroir de PHARAÉL, ouvert. Vide à présent.');
        } else {
          this.showNarration('Un tiroir verrouillé. La serrure est petite, comme une clé d\'enfance.');
        }
      },
      onUse: () => {
        this.recordTap();
        if (hasProgress('ch2.drawer_opened')) {
          this.showNarration('Le tiroir est déjà ouvert. Tu as pris ce qu\'il fallait.');
          return;
        }
        if (!hasItem('kael_drawer_key')) {
          this.showNarration('Verrouillé. Il te faut une petite clé — peut-être dans un pod cryo.');
          return;
        }
        this.showNarration(
          'La clé tourne sans résistance. Le tiroir s\'ouvre sur un enregistreur vocal — la voix de PHARAÉL pour Naïs.',
          () => {
            removeItem('kael_drawer_key');
            addItem('voice_recorder');
            setProgress('ch2.drawer_opened');
            notifyInventoryChange();
            this.collectFragment('ch2.secret_drawer');
          }
        );
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
    this.lumiraHalo = halo;
  }

  private applyMix(): void {
    removeItem('fert_mix');
    notifyInventoryChange();
    setProgress('ch2.solved');
    // Collect the planting photo + Vesper song fragments
    this.collectFragment('ch2.photo_planting');
    this.collectFragment('ch2.audio_vesper_song');
    this.showVera(t('vera.ch2.fert_right'), () => {
      this.showVera(t('vera.ch2.complete'), () => {
        this.fadeToScene('ChapterIntroScene', { chapter: 3 });
      });
    });
  }

  // === LUMIRA SONG (hidden puzzle) ===
  private triggerLumiraSong(): void {
    if (hasProgress('ch2.lumira_song_done')) {
      this.showNarration('Lumira garde le silence cette fois. Elle a déjà chanté pour toi.');
      return;
    }
    setProgress('ch2.lumira_song_done');
    removeItem('bracelet_tuned');
    addItem('bracelet_ok');
    notifyInventoryChange();

    // Visual: Lumira blooms — scale tween + amber flash on the halo
    if (this.lumiraSprite) {
      this.tweens.add({
        targets: this.lumiraSprite,
        scale: this.lumiraSprite.scale * 1.18,
        duration: 900,
        yoyo: true,
        ease: 'Sine.easeInOut',
      });
    }
    if (this.lumiraHalo) {
      this.tweens.add({
        targets: this.lumiraHalo,
        alpha: { from: 1, to: 0.3 },
        duration: 320,
        yoyo: true,
        repeat: 5,
        ease: 'Sine.easeInOut',
      });
    }
    // 3 ethereal notes — placeholder via 'success' SFX
    playSfx('success');
    this.time.delayedCall(380, () => playSfx('success'));
    this.time.delayedCall(760, () => playSfx('success'));

    this.time.delayedCall(1400, () => {
      this.showNarration(
        'Trois notes claires s\'élèvent. La Lumira frémit, fleurit. Une berceuse oubliée — tu reconnais la voix de Vesper, comme superposée à la tienne.',
        () => {
          this.collectFragment('ch2.audio_vesper_song');
          grant('lumira_song');
        }
      );
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
