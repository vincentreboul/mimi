import * as Phaser from 'phaser';
import { COLORS, FONTS, GAME_WIDTH, GAME_HEIGHT, HUD } from '../config';
import { nextHint, getStuckTier, canShowSkip, type HintConfig } from '../systems/hint';
import { playSfx } from '../systems/audio';
import { t } from '../systems/narrative';

export interface HintButtonOptions {
  hintConfig: HintConfig;
  onSkip?: () => void;
  onHintGiven?: (visualCue?: string) => void;
}

export class HintButton extends Phaser.GameObjects.Container {
  private bg: Phaser.GameObjects.Arc;
  private label: Phaser.GameObjects.Text;
  private pulseTween: Phaser.Tweens.Tween | null = null;
  private modal: HintModal | null = null;
  private options: HintButtonOptions;
  private checkTimer: Phaser.Time.TimerEvent;

  constructor(scene: Phaser.Scene, options: HintButtonOptions) {
    // Position: at the right of the inventory bar (replaces unused panel space).
    // Centered vertically within the inventory strip.
    super(scene, GAME_WIDTH - HUD.hintButtonSize / 2 - 18, GAME_HEIGHT - HUD.inventoryHeight / 2);
    this.options = options;

    this.bg = scene.add.circle(0, 0, HUD.hintButtonSize / 2, COLORS.brassDark, 0.85);
    this.bg.setStrokeStyle(3, COLORS.brass, 1);
    this.add(this.bg);

    this.label = scene.add.text(0, 0, '?', {
      fontFamily: FONTS.display,
      fontSize: '52px',
      color: COLORS.hex.cream,
      fontStyle: 'bold',
    }).setOrigin(0.5);
    this.add(this.label);

    this.setSize(HUD.hintButtonSize, HUD.hintButtonSize);
    this.setInteractive(
      new Phaser.Geom.Circle(0, 0, HUD.hintButtonSize / 2),
      Phaser.Geom.Circle.Contains
    );
    this.on('pointerdown', () => this.onTap());

    scene.add.existing(this);
    this.setDepth(1500);

    // Periodically check stuck-detection to pulse
    this.checkTimer = scene.time.addEvent({
      delay: 5000,
      loop: true,
      callback: () => this.checkStuck(),
    });
  }

  private checkStuck(): void {
    const tier = getStuckTier(this.options.hintConfig.puzzleId);
    if (tier >= 2 && !this.pulseTween) {
      this.startPulse();
    }
  }

  startPulse(): void {
    if (this.pulseTween) return;
    this.pulseTween = this.scene.tweens.add({
      targets: this,
      scale: { from: 1, to: 1.12 },
      duration: 700,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  stopPulse(): void {
    if (this.pulseTween) {
      this.pulseTween.stop();
      this.pulseTween = null;
      this.setScale(1);
    }
  }

  private onTap(): void {
    playSfx('tap');
    this.stopPulse();
    this.openModal();
  }

  private openModal(): void {
    if (this.modal) this.modal.destroy();
    this.modal = new HintModal(this.scene, {
      hintConfig: this.options.hintConfig,
      onClose: () => {
        this.modal?.destroy();
        this.modal = null;
      },
      onHintGiven: (cue) => this.options.onHintGiven?.(cue),
      onSkip: this.options.onSkip,
    });
  }

  destroy(fromScene?: boolean): void {
    this.checkTimer?.destroy();
    if (this.pulseTween) this.pulseTween.stop();
    this.modal?.destroy();
    super.destroy(fromScene);
  }
}

interface HintModalOptions {
  hintConfig: HintConfig;
  onClose: () => void;
  onHintGiven?: (cue?: string) => void;
  onSkip?: () => void;
}

class HintModal extends Phaser.GameObjects.Container {
  private hintText: Phaser.GameObjects.Text;
  private nextButton: Phaser.GameObjects.Container;
  private skipButton: Phaser.GameObjects.Container | null = null;
  private options: HintModalOptions;

  constructor(scene: Phaser.Scene, options: HintModalOptions) {
    super(scene, GAME_WIDTH / 2, GAME_HEIGHT / 2);
    this.options = options;

    // Backdrop
    const backdrop = scene.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, COLORS.charDeep, 0.85);
    backdrop.setInteractive();
    backdrop.on('pointerdown', () => options.onClose());
    this.add(backdrop);

    // Modal box
    const box = scene.add.rectangle(0, 0, GAME_WIDTH - 120, 700, COLORS.leafDeep, 0.98);
    box.setStrokeStyle(3, COLORS.brass, 1);
    this.add(box);

    // Title
    const title = scene.add.text(0, -300, t('ui.hint'), {
      fontFamily: FONTS.display,
      fontSize: '60px',
      color: COLORS.hex.brass,
    }).setOrigin(0.5);
    this.add(title);

    // Hint text — large for readability
    this.hintText = scene.add.text(0, -50, '...', {
      fontFamily: FONTS.body,
      fontSize: '44px',
      color: COLORS.hex.cream,
      wordWrap: { width: GAME_WIDTH - 220 },
      align: 'center',
      lineSpacing: 12,
    }).setOrigin(0.5);
    this.add(this.hintText);

    // Auto-give first hint on open
    const tier = nextHint(options.hintConfig);
    if (tier) {
      this.hintText.setText(tier.text);
      options.onHintGiven?.(tier.visualCue);
    } else {
      this.hintText.setText('Pas d\'indice supplémentaire pour cette énigme.');
    }

    // Next-hint button
    this.nextButton = this.makeButton(scene, 0, 200, '+ Indice', () => {
      const t = nextHint(options.hintConfig);
      if (t) {
        this.hintText.setText(t.text);
        options.onHintGiven?.(t.visualCue);
        scene.tweens.add({
          targets: this.hintText,
          alpha: { from: 0, to: 1 },
          duration: 300,
        });
      } else {
        this.nextButton.setVisible(false);
        this.maybeShowSkip();
      }
    });
    this.add(this.nextButton);

    // Close button
    const closeBtn = this.makeButton(scene, 0, 290, t('ui.close'), () => options.onClose());
    this.add(closeBtn);

    this.maybeShowSkip();

    scene.add.existing(this);
    this.setDepth(3000);

    scene.tweens.add({
      targets: this,
      alpha: { from: 0, to: 1 },
      duration: 220,
      ease: 'Cubic.easeOut',
    });
  }

  private maybeShowSkip(): void {
    if (this.skipButton) return;
    if (canShowSkip(this.options.hintConfig.puzzleId) && this.options.onSkip) {
      this.skipButton = this.makeButton(this.scene, 0, 100, t('ui.skip'), () => {
        this.options.onSkip?.();
        this.options.onClose();
      });
      this.add(this.skipButton);
    }
  }

  private makeButton(scene: Phaser.Scene, x: number, y: number, label: string, onTap: () => void): Phaser.GameObjects.Container {
    const c = scene.add.container(x, y);
    const bg = scene.add.rectangle(0, 0, 480, 90, COLORS.brassDark, 0.95);
    bg.setStrokeStyle(3, COLORS.brass, 1);
    const txt = scene.add.text(0, 0, label, {
      fontFamily: FONTS.body,
      fontSize: '36px',
      color: COLORS.hex.cream,
      fontStyle: 'bold',
    }).setOrigin(0.5);
    c.add([bg, txt]);
    c.setSize(480, 90);
    c.setInteractive(new Phaser.Geom.Rectangle(-240, -45, 480, 90), Phaser.Geom.Rectangle.Contains);
    let pressed = false;
    c.on('pointerdown', () => { pressed = true; bg.setFillStyle(COLORS.sunAmber, 1); });
    c.on('pointerup', () => {
      if (pressed) { pressed = false; bg.setFillStyle(COLORS.brassDark, 0.95); playSfx('tap'); onTap(); }
    });
    c.on('pointerout', () => { if (pressed) { pressed = false; bg.setFillStyle(COLORS.brassDark, 0.95); } });
    c.on('pointerupoutside', () => { if (pressed) { pressed = false; bg.setFillStyle(COLORS.brassDark, 0.95); } });
    return c;
  }
}
