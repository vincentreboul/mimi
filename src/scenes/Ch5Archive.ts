import * as Phaser from 'phaser';
import { COLORS, FONTS, GAME_WIDTH, GAME_HEIGHT } from '../config';
import { DialogueBox } from '../objects/DialogueBox';
import { setScene, setAssertion, addAchievement, type ChapterId } from '../systems/save';
import { collectFragment } from '../systems/fragments';
import { getChapterCarnet, ALL_CARNETS } from '../data/carnet';
import type { Assertion } from '../data/carnet/types';
import { stopAmbient } from '../systems/audio';

interface EncounterDef {
  fragmentId: string;
  silhouetteColor: number;
  silhouetteX: number;
}

/**
 * Ch5 ARCHIVE — Secret epilogue. NO HUD. Just narrative.
 * ÉLISE-ROMIE & IOLAS walk across an Aeolis dreamscape, meeting four ghost-silhouettes
 * (Vesper, Han, PHARAÉL, VERA). Each delivers a short line. Then auto-fills all assertions
 * to their canonical "true" values, grants achievements, transitions to EndingScene with
 * `ending: 'archive'`.
 */
export class Ch5Archive extends Phaser.Scene {
  private chapter: ChapterId = 5;
  private dialogue!: DialogueBox;

  // Walk-cycle silhouettes
  private elise!: Phaser.GameObjects.Container;
  private iolas!: Phaser.GameObjects.Container;

  // Walk timing — full traversal across the screen during the 4 encounters.
  private readonly WALK_START_X = -180;
  private readonly WALK_END_X = GAME_WIDTH + 180;

  private encounters: EncounterDef[] = [
    {
      fragmentId: 'ch5.encounter_vesper',
      silhouetteColor: 0xa8dadc, // sky pale → Vesper composed
      silhouetteX: 280,
    },
    {
      fragmentId: 'ch5.encounter_han',
      silhouetteColor: 0xc4b5a0, // soft brass → Han retired from time
      silhouetteX: 540,
    },
    {
      fragmentId: 'ch5.encounter_tome',
      silhouetteColor: 0xf4a261, // amber → PHARAÉL young & joyful
      silhouetteX: 800,
    },
    {
      fragmentId: 'ch5.encounter_vera',
      silhouetteColor: 0x7fb069, // leaf light → VERA almost human
      silhouetteX: 1040,
    },
  ];

  private currentEncounterIndex = -1;
  private encounterSilhouettes: Phaser.GameObjects.Container[] = [];

  constructor() {
    super('Ch5Archive');
  }

  init(): void {
    this.chapter = 5;
    this.currentEncounterIndex = -1;
    this.encounterSilhouettes = [];
    setScene('Ch5Archive', 5);
  }

  create(): void {
    this.cameras.main.fadeIn(900, 31, 77, 62);

    this.composeDreamBackground();
    this.spawnMemoryMotes();

    // Walking duo — silhouettes only (placeholder pixel rectangles).
    this.elise = this.makeWalker(this.WALK_START_X - 40, GAME_HEIGHT - 360, COLORS.cream, 'Walker A');
    this.iolas = this.makeWalker(this.WALK_START_X, GAME_HEIGHT - 360, COLORS.brass, 'Walker B');

    // Dialogue box — re-used for each encounter.
    this.dialogue = new DialogueBox(this);

    // Begin walking across the screen with rendezvous stops at each encounter.
    this.time.delayedCall(1400, () => this.startEncounterSequence());
  }

  // -------------- Background --------------

  private composeDreamBackground(): void {
    const g = this.add.graphics();
    g.setDepth(-1000);
    // Vertical gradient: charDeep (top) → leafLight (bottom). Phaser uses
    // (TL, TR, BL, BR) for fillGradientStyle.
    g.fillGradientStyle(
      COLORS.charDeep,
      COLORS.charDeep,
      COLORS.leafLight,
      COLORS.leafLight,
      1,
      1,
      1,
      1
    );
    g.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Subtle horizon glow
    const horizon = this.add.graphics();
    horizon.setDepth(-900);
    horizon.fillStyle(COLORS.cream, 0.18);
    horizon.fillCircle(GAME_WIDTH / 2, GAME_HEIGHT - 280, 800);

    // Distant softly-glowing planets / Aeolis
    const aeolis = this.add.graphics();
    aeolis.setDepth(-880);
    aeolis.fillStyle(COLORS.skyPale, 0.5);
    aeolis.fillCircle(GAME_WIDTH * 0.78, 360, 130);
    aeolis.fillStyle(COLORS.leafLight, 0.5);
    aeolis.fillCircle(GAME_WIDTH * 0.78 - 30, 360 - 20, 90);

    // Gentle "ground" line
    const ground = this.add.graphics();
    ground.setDepth(-800);
    ground.fillStyle(COLORS.leafDeep, 0.65);
    ground.fillRect(0, GAME_HEIGHT - 250, GAME_WIDTH, 250);
  }

  /** Spawn floating cyan "memory motes" via ParticleEmitter (lazy texture). */
  private spawnMemoryMotes(): void {
    // Build a tiny in-memory texture for the mote (cyan glow).
    const moteKey = 'ch5_mote';
    if (!this.textures.exists(moteKey)) {
      const g = this.add.graphics();
      g.fillStyle(0xa8dadc, 1);
      g.fillCircle(6, 6, 6);
      g.fillStyle(0xffffff, 0.6);
      g.fillCircle(6, 6, 3);
      g.generateTexture(moteKey, 12, 12);
      g.destroy();
    }

    const emitter = this.add.particles(0, 0, moteKey, {
      x: { min: 0, max: GAME_WIDTH },
      y: { min: GAME_HEIGHT * 0.3, max: GAME_HEIGHT - 250 },
      speedY: { min: -15, max: -30 },
      speedX: { min: -8, max: 8 },
      lifespan: 6000,
      alpha: { start: 0.85, end: 0 },
      scale: { start: 0.9, end: 0.4 },
      quantity: 1,
      frequency: 220,
      blendMode: 'ADD',
    });
    emitter.setDepth(-700);
  }

  // -------------- Walkers --------------

  private makeWalker(x: number, y: number, color: number, _label: string): Phaser.GameObjects.Container {
    const c = this.add.container(x, y);
    c.setDepth(50);
    // Pixel-art body silhouette: head (10×10) + torso (16×24) + legs (16×16).
    const head = this.add.rectangle(0, -28, 22, 22, color, 1);
    const torso = this.add.rectangle(0, -2, 28, 36, color, 1);
    const legL = this.add.rectangle(-7, 28, 10, 26, color, 1);
    const legR = this.add.rectangle(7, 28, 10, 26, color, 1);
    // Soft halo
    const halo = this.add.rectangle(0, 0, 60, 90, color, 0.18);
    c.add([halo, head, torso, legL, legR]);

    // Subtle bob-tween: simulates walking. Tiny vertical oscillation.
    this.tweens.add({
      targets: c,
      y: y - 6,
      yoyo: true,
      duration: 380,
      repeat: -1,
      ease: 'Sine.inOut',
    });
    return c;
  }

  /** Walk both silhouettes to a given X over `duration` ms. */
  private walkTo(targetX: number, duration: number, onArrived?: () => void): void {
    this.tweens.add({
      targets: this.elise,
      x: targetX - 40,
      duration,
      ease: 'Sine.inOut',
    });
    this.tweens.add({
      targets: this.iolas,
      x: targetX,
      duration,
      ease: 'Sine.inOut',
      onComplete: () => onArrived?.(),
    });
  }

  // -------------- Encounters --------------

  private startEncounterSequence(): void {
    this.currentEncounterIndex = 0;
    this.runNextEncounter();
  }

  private runNextEncounter(): void {
    if (this.currentEncounterIndex >= this.encounters.length) {
      this.finishArchive();
      return;
    }
    const enc = this.encounters[this.currentEncounterIndex];
    // Walk to the encounter's silhouette X, then fade in the silhouette and dialogue.
    this.walkTo(enc.silhouetteX - 90, 2000, () => {
      this.spawnSilhouette(enc.silhouetteX, enc.silhouetteColor, () => {
        this.showEncounterFragment(enc);
      });
    });
  }

  private spawnSilhouette(x: number, color: number, onAppeared: () => void): void {
    const y = GAME_HEIGHT - 360;
    const c = this.add.container(x, y);
    c.setDepth(40);
    const head = this.add.rectangle(0, -28, 22, 22, color, 1);
    const torso = this.add.rectangle(0, -2, 28, 36, color, 1);
    const legL = this.add.rectangle(-7, 28, 10, 26, color, 1);
    const legR = this.add.rectangle(7, 28, 10, 26, color, 1);
    const halo = this.add.rectangle(0, 0, 80, 110, color, 0.25);
    c.add([halo, head, torso, legL, legR]);
    c.setAlpha(0);
    this.encounterSilhouettes.push(c);

    this.tweens.add({
      targets: c,
      alpha: 1,
      duration: 900,
      ease: 'Cubic.easeOut',
      onComplete: () => onAppeared(),
    });

    // Soft pulsing halo
    this.tweens.add({
      targets: halo,
      alpha: { from: 0.25, to: 0.55 },
      duration: 1400,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.inOut',
    });
  }

  private showEncounterFragment(enc: EncounterDef): void {
    const ch5 = getChapterCarnet(5);
    const fragment = ch5.fragments.find((f) => f.id === enc.fragmentId);
    if (!fragment) {
      // Should never happen if data is intact — skip gracefully.
      this.advanceAfterEncounter();
      return;
    }

    // Persist fragment as collected for completionist purposes.
    collectFragment(fragment.id);

    this.dialogue.show({
      speaker: 'NARRATOR',
      text: fragment.body,
      onComplete: () => this.advanceAfterEncounter(),
    });
  }

  private advanceAfterEncounter(): void {
    const idx = this.currentEncounterIndex;
    const sil = this.encounterSilhouettes[idx];
    if (sil) {
      this.tweens.add({
        targets: sil,
        alpha: 0,
        duration: 700,
        ease: 'Cubic.easeIn',
        onComplete: () => sil.destroy(true),
      });
    }
    this.currentEncounterIndex += 1;
    this.time.delayedCall(900, () => this.runNextEncounter());
  }

  // -------------- Finale --------------

  private finishArchive(): void {
    // 1) Auto-fill ALL prior assertions with their canonical first-valid tile per slot,
    //    locked + not flagged as "revised" (the canonical truth, no revision needed).
    this.autoFillAllAssertions();

    // 2) Grant ARCHIVE achievement + Compagnons (per spec section 8 & ch5 brief).
    addAchievement('archive');
    addAchievement('companions');

    // 3) Walk the duo off-screen toward the right while we fade to white,
    //    then start EndingScene with the archive ending.
    this.walkTo(this.WALK_END_X, 2200);

    this.cameras.main.fadeOut(1800, 244, 233, 216); // cream-ish fade-to-white
    this.cameras.main.once('camerafadeoutcomplete', () => {
      stopAmbient();
      this.scene.start('EndingScene', { ending: 'archive' });
    });
  }

  /** Iterate every assertion across all chapters and force-lock with first valid tile per slot. */
  private autoFillAllAssertions(): void {
    for (const carnet of Object.values(ALL_CARNETS)) {
      for (const a of carnet.assertions as Assertion[]) {
        // Use revised slots if defined (canonical "true" version after recontextualization),
        // otherwise the base slots.
        const slots = a.revisedSlots ?? a.slots;
        const tiles = slots.map((s) => s.validTileIds[0] ?? '');
        // locked = true, revised = false (we're declaring this the final canonical state).
        setAssertion(a.id, tiles, true, false);
      }
    }
  }
}
