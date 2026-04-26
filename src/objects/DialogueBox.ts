import * as Phaser from 'phaser';
import { COLORS, FONTS, GAME_WIDTH, GAME_HEIGHT } from '../config';
import { playSfx } from '../systems/audio';
import { getSettings } from '../systems/save';

export interface DialogueOptions {
  speaker?: 'VERA' | 'MIMI' | 'NARRATOR';
  text: string;
  onComplete?: () => void;
  autoAdvanceMs?: number;
}

const BOX_HEIGHT = 300;     // smaller — covers less of the scene
const PADDING = 40;
const TYPEWRITER_BASE = 14; // ms per char (faster)

export class DialogueBox extends Phaser.GameObjects.Container {
  private bg: Phaser.GameObjects.Rectangle;
  private speakerLabel: Phaser.GameObjects.Text;
  private bodyText: Phaser.GameObjects.Text;
  private hint: Phaser.GameObjects.Text;
  private currentTimer: Phaser.Time.TimerEvent | null = null;
  private fullText = '';
  private currentOptions: DialogueOptions | null = null;
  private isComplete = false;

  constructor(scene: Phaser.Scene) {
    // Position the dialog at the BOTTOM of the scene area, just above the HUD.
    // BOX_HEIGHT=360, HUD bottom starts ~ GAME_HEIGHT - 440. So box bottom should
    // be just above STAGE_BOTTOM_Y (~1480) → center Y = 1480 - 180 - 10 = 1290.
    const yCenter = 1290;
    super(scene, GAME_WIDTH / 2, yCenter);

    this.bg = scene.add.rectangle(0, 0, GAME_WIDTH - 64, BOX_HEIGHT, COLORS.charDeep, 0.92);
    this.bg.setStrokeStyle(3, COLORS.brass, 0.85);
    this.add(this.bg);

    this.speakerLabel = scene.add.text(-GAME_WIDTH / 2 + 64, -BOX_HEIGHT / 2 + 16, '', {
      fontFamily: FONTS.mono,
      fontSize: '30px',
      color: COLORS.hex.skyPale,
      fontStyle: 'bold',
    });
    this.add(this.speakerLabel);

    this.bodyText = scene.add.text(-(GAME_WIDTH - 64) / 2 + PADDING, -BOX_HEIGHT / 2 + 60, '', {
      fontFamily: FONTS.body,
      fontSize: '42px',
      color: COLORS.hex.cream,
      wordWrap: { width: GAME_WIDTH - 64 - 2 * PADDING },
      lineSpacing: 8,
    });
    this.add(this.bodyText);

    this.hint = scene.add.text(0, BOX_HEIGHT / 2 - 36, '▼ TAPE POUR CONTINUER ▼', {
      fontFamily: FONTS.mono,
      fontSize: '34px',
      color: COLORS.hex.skyPale,
      fontStyle: 'bold',
    }).setOrigin(0.5);
    this.hint.setAlpha(0);
    this.add(this.hint);

    this.bg.setInteractive({ useHandCursor: true });
    this.bg.on('pointerdown', () => this.onTap());

    scene.add.existing(this);
    this.setDepth(2000);
    this.setVisible(false);
    // CRITICAL: disable input when hidden so dialog bg doesn't intercept hotspot taps
    this.bg.disableInteractive();
  }

  show(options: DialogueOptions): void {
    this.currentOptions = options;
    this.isComplete = false;
    this.fullText = options.text;
    this.bodyText.setText('');
    this.hint.setAlpha(0);

    const speakerText = options.speaker === 'VERA' ? 'VERA'
      : options.speaker === 'MIMI' ? 'MIMI'
      : '';
    this.speakerLabel.setText(speakerText);

    this.setVisible(true);
    this.bg.setInteractive({ useHandCursor: true });
    this.scene.tweens.add({
      targets: this,
      alpha: { from: 0, to: 1 },
      duration: 240,
      ease: 'Cubic.easeOut',
    });

    this.startTypewriter();
  }

  private startTypewriter(): void {
    const settings = getSettings();
    const speedMs = settings.reducedMotion ? 1 : TYPEWRITER_BASE;

    if (this.currentTimer) this.currentTimer.destroy();

    let i = 0;
    this.currentTimer = this.scene.time.addEvent({
      delay: speedMs,
      repeat: this.fullText.length - 1,
      callback: () => {
        i += 1;
        this.bodyText.setText(this.fullText.slice(0, i));
        if (i % 3 === 0) playSfx('beep');
        if (i >= this.fullText.length) {
          this.onTypewriterComplete();
        }
      },
    });
  }

  private onTypewriterComplete(): void {
    this.isComplete = true;
    this.scene.tweens.add({
      targets: this.hint,
      alpha: { from: 0, to: 1 },
      duration: 300,
    });
    if (this.currentOptions?.autoAdvanceMs) {
      this.scene.time.delayedCall(this.currentOptions.autoAdvanceMs, () => this.advance());
    }
  }

  private onTap(): void {
    if (!this.isComplete) {
      // Speed up to end
      if (this.currentTimer) this.currentTimer.destroy();
      this.bodyText.setText(this.fullText);
      this.onTypewriterComplete();
      return;
    }
    this.advance();
  }

  private advance(): void {
    const opts = this.currentOptions;
    this.hide();
    opts?.onComplete?.();
  }

  hide(): void {
    if (this.currentTimer) this.currentTimer.destroy();
    // Disable input IMMEDIATELY so taps don't get intercepted during fade-out
    this.bg.disableInteractive();
    this.scene.tweens.add({
      targets: this,
      alpha: { from: 1, to: 0 },
      duration: 200,
      onComplete: () => this.setVisible(false),
    });
  }

  /**
   * Show a sequence of dialogue chunks, each advancing on tap.
   */
  showSequence(items: DialogueOptions[], onAllDone?: () => void): void {
    if (items.length === 0) {
      onAllDone?.();
      return;
    }
    const [first, ...rest] = items;
    this.show({
      ...first,
      onComplete: () => {
        first.onComplete?.();
        if (rest.length > 0) {
          this.showSequence(rest, onAllDone);
        } else {
          onAllDone?.();
        }
      },
    });
  }
}
