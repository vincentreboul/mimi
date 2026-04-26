import * as Phaser from 'phaser';
import { COLORS, FONTS, GAME_WIDTH, GAME_HEIGHT } from '../config';
import { ENDINGS, getEnding } from '../data/endings';
import {
  addEnding,
  addAchievement,
  hasAchievement,
  getActiveSlot,
  unlockNGPlus,
  type Ending,
} from '../systems/save';
import { getAchievement } from '../data/achievements';
import { stopAmbient } from '../systems/audio';

interface EndingSceneData {
  ending?: Ending;
}

/**
 * Final beat of a run. Receives `{ ending: Ending }` (defaults to 'evasion' if missing).
 * Persists the ending, grants its achievement, unlocks NG+ (if not yet) for any
 * non-archive ending, signals "ARCHIVE complété" for archive.
 */
export class EndingScene extends Phaser.Scene {
  private endingId: Ending = 'evasion';
  private lineIndex = 0;
  private bodyText?: Phaser.GameObjects.Text;
  private closingText?: Phaser.GameObjects.Text;
  private hint?: Phaser.GameObjects.Text;
  private creditsBtn?: Phaser.GameObjects.Rectangle;
  private creditsLabel?: Phaser.GameObjects.Text;
  private bottomMessage?: Phaser.GameObjects.Text;
  private toastShown = false;
  private tapOverlay?: Phaser.GameObjects.Rectangle;
  private isAdvancing = false;

  constructor() {
    super('EndingScene');
  }

  init(data: EndingSceneData): void {
    this.endingId = data?.ending ?? 'evasion';
    this.lineIndex = 0;
    this.toastShown = false;
    this.isAdvancing = false;
  }

  create(): void {
    const desc = getEnding(this.endingId);
    this.cameras.main.fadeIn(900, 0, 0, 0);
    const { width, height } = this.scale.gameSize;

    // ---- Save side-effects (apply once on entry) ----
    addEnding(this.endingId);
    const isNewAchievement = !hasAchievement(desc.achievementId);
    addAchievement(desc.achievementId);

    // Any ending → unlock NG+ for the active slot. Archive doesn't toggle NG+ (already
    // implies NG+ was completed), but unlocking again is a no-op.
    const slot = getActiveSlot();
    const wasNGPlusLocked = !slot.ngPlus.unlocked;
    if (this.endingId !== 'archive') {
      unlockNGPlus();
    }

    // ---- Background : gradient using ending's primary/secondary ----
    const bg = this.add.graphics();
    bg.setDepth(-1000);
    bg.fillGradientStyle(
      desc.primaryColor,
      desc.primaryColor,
      desc.secondaryColor,
      desc.secondaryColor,
      1,
      1,
      1,
      1
    );
    bg.fillRect(0, 0, width, height);

    // Soft scattered stars / motes for ambience (don't overload)
    const motes = this.add.graphics();
    motes.setDepth(-900);
    motes.fillStyle(COLORS.cream, 0.55);
    for (let i = 0; i < 60; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const r = Math.random() < 0.85 ? 2 : 3;
      motes.fillRect(x, y, r, r);
    }
    // Single low-amplitude breathing tween on the motes layer
    this.tweens.add({
      targets: motes,
      alpha: { from: 1, to: 0.5 },
      duration: 4200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.inOut',
    });

    // ---- Title ----
    const title = this.add.text(width / 2, 320, desc.label, {
      fontFamily: FONTS.display,
      fontSize: '110px',
      color: COLORS.hex.cream,
      align: 'center',
      shadow: {
        color: '#000000',
        offsetX: 0,
        offsetY: 4,
        blur: 8,
        fill: true,
      },
    }).setOrigin(0.5);
    title.setAlpha(0);
    this.tweens.add({ targets: title, alpha: 1, duration: 1800, delay: 600 });

    // ---- Body : prelude lines, fade-in sequentially ----
    this.bodyText = this.add.text(width / 2, height / 2 - 60, '', {
      fontFamily: FONTS.body,
      fontSize: '40px',
      color: COLORS.hex.cream,
      align: 'center',
      wordWrap: { width: width - 180 },
      lineSpacing: 14,
    }).setOrigin(0.5);
    this.bodyText.setAlpha(0);

    // ---- Closing line (italic, bottom of body, hidden until last line shown) ----
    this.closingText = this.add.text(width / 2, height - 620, desc.closing, {
      fontFamily: FONTS.body,
      fontSize: '34px',
      color: COLORS.hex.cream,
      align: 'center',
      fontStyle: 'italic',
      wordWrap: { width: width - 200 },
      lineSpacing: 10,
    }).setOrigin(0.5);
    this.closingText.setAlpha(0);

    // ---- Tap-to-advance overlay (full-screen, lowest depth above background) ----
    this.tapOverlay = this.add.rectangle(0, 0, width, height, 0x000000, 0).setOrigin(0);
    this.tapOverlay.setDepth(50);
    this.tapOverlay.setInteractive({ useHandCursor: true });
    this.tapOverlay.on('pointerdown', () => this.advance());

    // ---- Hint to tap ----
    this.hint = this.add.text(width / 2, height - 380, '▼ TAPE POUR CONTINUER ▼', {
      fontFamily: FONTS.mono,
      fontSize: '30px',
      color: COLORS.hex.skyPale,
    }).setOrigin(0.5);
    this.hint.setAlpha(0);
    this.hint.setDepth(60);

    // ---- "Crédits" button (hidden until the closing is visible) ----
    const cBtnX = width / 2;
    const cBtnY = height - 200;
    this.creditsBtn = this.add.rectangle(cBtnX, cBtnY, 460, 110, COLORS.brassDark, 0.95);
    this.creditsBtn.setStrokeStyle(3, COLORS.brass, 1);
    this.creditsBtn.setDepth(70);
    this.creditsBtn.setVisible(false);
    this.creditsBtn.setInteractive({ useHandCursor: true });

    this.creditsLabel = this.add.text(cBtnX, cBtnY, 'Crédits', {
      fontFamily: FONTS.body,
      fontSize: '40px',
      color: COLORS.hex.cream,
    }).setOrigin(0.5).setDepth(71);
    this.creditsLabel.setVisible(false);

    this.creditsBtn.on('pointerdown', () => {
      this.creditsBtn?.setFillStyle(COLORS.sunAmber, 1);
      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        stopAmbient();
        this.scene.start('MenuScene');
      });
    });

    // ---- Achievement toast (top of screen) ----
    if (isNewAchievement) {
      this.time.delayedCall(2200, () => this.showAchievementToast(desc.achievementId));
    }

    // ---- Stash for the post-prelude unlock message ----
    (this as any).__wasNGPlusLocked = wasNGPlusLocked;

    // ---- Kick off the prelude line sequence after title fade-in ----
    this.time.delayedCall(2000, () => this.showNextLine());
  }

  /** Show the next prelude line with a 1.5s fade-in, then wait for tap. */
  private showNextLine(): void {
    const desc = getEnding(this.endingId);
    if (!this.bodyText) return;

    if (this.lineIndex >= desc.prelude.length) {
      // All lines shown → reveal closing + bottom message + credits button.
      this.revealEnding();
      return;
    }

    const line = desc.prelude[this.lineIndex];
    this.bodyText.setAlpha(0);
    this.bodyText.setText(line);
    this.tweens.add({
      targets: this.bodyText,
      alpha: 1,
      duration: 1500,
      ease: 'Cubic.easeOut',
      onComplete: () => {
        this.hint?.setAlpha(0);
        this.tweens.add({
          targets: this.hint,
          alpha: { from: 0, to: 1 },
          duration: 600,
        });
        this.isAdvancing = false;
      },
    });
  }

  private advance(): void {
    if (this.isAdvancing) return;
    this.isAdvancing = true;

    const desc = getEnding(this.endingId);
    if (this.lineIndex < desc.prelude.length) {
      // If body still fading, snap to full and proceed
      this.bodyText?.setAlpha(1);
      this.lineIndex += 1;
      // Hide hint while transitioning
      if (this.hint) this.hint.setAlpha(0);
      this.time.delayedCall(160, () => this.showNextLine());
    } else {
      // Already past prelude — tap on the credits button itself triggers transition
      this.isAdvancing = false;
    }
  }

  private revealEnding(): void {
    if (!this.closingText || !this.creditsBtn || !this.creditsLabel) return;
    // Hide the body / hint
    if (this.bodyText) this.bodyText.setAlpha(0);
    if (this.hint) this.hint.setAlpha(0);

    // Reveal closing
    this.tweens.add({
      targets: this.closingText,
      alpha: 1,
      duration: 1600,
      ease: 'Cubic.easeOut',
    });

    // Bottom unlock message
    const wasNGPlusLocked = (this as any).__wasNGPlusLocked === true;
    let msg = '';
    if (this.endingId === 'archive') {
      msg = '+ ARCHIVE COMPLÉTÉ — Replay any chapter unlock';
    } else if (wasNGPlusLocked) {
      msg = '+ NG+ DÉBLOQUÉ — Rejoue avec IOLAS';
    }
    if (msg) {
      this.bottomMessage = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 320, msg, {
        fontFamily: FONTS.mono,
        fontSize: '28px',
        color: COLORS.hex.brass,
        align: 'center',
        wordWrap: { width: GAME_WIDTH - 200 },
      }).setOrigin(0.5).setDepth(65);
      this.bottomMessage.setAlpha(0);
      this.tweens.add({
        targets: this.bottomMessage,
        alpha: 1,
        duration: 1400,
        delay: 1200,
      });
    }

    // Credits button
    this.creditsBtn.setVisible(true);
    this.creditsLabel.setVisible(true);
    this.creditsBtn.setAlpha(0);
    this.creditsLabel.setAlpha(0);
    this.tweens.add({
      targets: [this.creditsBtn, this.creditsLabel],
      alpha: 1,
      duration: 1000,
      delay: 1800,
    });

    // Disable the tap overlay so taps reach the credits button cleanly
    this.tapOverlay?.disableInteractive();
  }

  private showAchievementToast(achievementId: string): void {
    if (this.toastShown) return;
    this.toastShown = true;
    const ach = getAchievement(achievementId);
    const label = ach
      ? `+ Achievement débloqué : ${ach.title}`
      : `+ Achievement débloqué : ${achievementId}`;

    const toast = this.add.container(GAME_WIDTH / 2, 180);
    toast.setDepth(2400);
    const bg = this.add.rectangle(0, 0, 760, 100, COLORS.brass, 0.95);
    bg.setStrokeStyle(3, COLORS.charDeep, 1);
    const txt = this.add.text(0, 0, label, {
      fontFamily: FONTS.mono,
      fontSize: '28px',
      color: COLORS.hex.charDeep,
      fontStyle: 'bold',
      align: 'center',
      wordWrap: { width: 700 },
    }).setOrigin(0.5);
    toast.add([bg, txt]);
    toast.setAlpha(0);
    this.tweens.add({
      targets: toast,
      alpha: 1,
      y: 210,
      duration: 320,
      ease: 'Cubic.easeOut',
    });
    this.time.delayedCall(3000, () => {
      this.tweens.add({
        targets: toast,
        alpha: 0,
        duration: 320,
        onComplete: () => toast.destroy(true),
      });
    });
  }
}
