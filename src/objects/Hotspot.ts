import * as Phaser from 'phaser';
import { COLORS, HUD } from '../config';
import { playSfx } from '../systems/audio';
import { setTarget, getActiveVerb, type Verb, type VerbTarget } from '../systems/verbs';
import type { ItemId } from '../data/items';

export interface HotspotConfig {
  x: number;
  y: number;
  width?: number;
  height?: number;
  name: string;                    // Required — shown in action label
  label?: string;                  // Legacy alias, ignored
  shape?: 'rect' | 'circle';
  glow?: boolean;                  // Legacy, ignored
  onTap?: () => void;              // Legacy single-action handler (used if no verb handlers)
  showIndicator?: boolean;         // Show subtle "tap me" dot
  // Per-verb handlers — return true if handled, false to fall through to default
  onLook?: () => void;
  onPick?: () => void;
  onUse?: (item?: ItemId) => void; // item present when "use X with this"
  onTalk?: () => void;
  // Fallback for unsupported verbs
  defaultMessage?: string;
}

/**
 * Hotspot: an interactive zone with a name and verb-based handlers.
 * Tap shows the name in ActionLabel and dispatches the active verb.
 */
export class Hotspot extends Phaser.GameObjects.Container {
  private indicator: Phaser.GameObjects.Container | null = null;
  private highlight: Phaser.GameObjects.Rectangle;
  private highlightTween: Phaser.Tweens.Tween | null = null;
  public config: HotspotConfig;

  constructor(scene: Phaser.Scene, config: HotspotConfig) {
    super(scene, config.x, config.y);
    this.config = config;

    const w = Math.max(config.width ?? HUD.touchTargetMin, HUD.touchTargetMin);
    const h = Math.max(config.height ?? HUD.touchTargetMin, HUD.touchTargetMin);

    // Highlight rect (visible briefly on tap, on hover, or always-on for active target)
    this.highlight = scene.add.rectangle(0, 0, w, h, COLORS.sunAmber, 0);
    this.highlight.setStrokeStyle(4, COLORS.sunAmber, 0);
    this.add(this.highlight);

    this.setSize(w, h);
    this.setInteractive(
      new Phaser.Geom.Rectangle(-w / 2, -h / 2, w, h),
      Phaser.Geom.Rectangle.Contains
    );

    this.on('pointerover', () => this.showHighlight(0.2));
    this.on('pointerout', () => this.fadeHighlight());
    this.on('pointerdown', () => this.onTap());

    if (config.showIndicator !== false) this.addIndicator();

    scene.add.existing(this);
  }

  private addIndicator(): void {
    // Small pulsing dot to telegraph interactability
    const dot = this.scene.add.container(0, 0);
    const ring = this.scene.add.circle(0, 0, 18, COLORS.sunAmber, 0).setStrokeStyle(3, COLORS.sunAmber, 0.95);
    const inner = this.scene.add.circle(0, 0, 8, COLORS.sunAmber, 0.95);
    dot.add([ring, inner]);
    this.add(dot);
    this.indicator = dot;

    this.scene.tweens.add({
      targets: ring,
      scale: { from: 1, to: 1.6 },
      alpha: { from: 0.95, to: 0 },
      duration: 1400,
      repeat: -1,
      ease: 'Sine.easeOut',
    });
  }

  hideIndicator(): void {
    if (this.indicator) {
      this.indicator.setVisible(false);
    }
  }

  showHighlight(alpha = 0.3): void {
    this.highlight.setStrokeStyle(4, COLORS.sunAmber, 1);
    this.highlight.setFillStyle(COLORS.sunAmber, alpha);
  }

  fadeHighlight(): void {
    this.highlight.setStrokeStyle(0, COLORS.sunAmber, 0);
    this.highlight.setFillStyle(COLORS.sunAmber, 0);
  }

  pulse(): void {
    this.scene.tweens.add({
      targets: this.highlight,
      alpha: { from: 0.6, to: 0 },
      duration: 320,
      ease: 'Cubic.easeOut',
      onStart: () => {
        this.highlight.setFillStyle(COLORS.sunAmber, 0.6);
      },
    });
  }

  private onTap(): void {
    playSfx('tap');
    this.pulse();

    // Set this as target
    const target: VerbTarget = {
      kind: 'hotspot',
      id: this.config.name,
      display: this.config.name,
    };
    setTarget(target);

    // Dispatch active verb
    const verb = getActiveVerb();
    this.handleVerb(verb);
  }

  private handleVerb(verb: Verb): void {
    const c = this.config;
    // Legacy fallback to onTap when no verb-specific handlers
    if (!c.onLook && !c.onPick && !c.onUse && !c.onTalk && c.onTap) {
      c.onTap();
      return;
    }
    switch (verb) {
      case 'look':
        if (c.onLook) c.onLook();
        else this.fallback('Tu observes ' + c.name + '. Rien de particulier.');
        break;
      case 'pick':
        if (c.onPick) c.onPick();
        else this.fallback('Tu ne peux pas prendre ça.');
        break;
      case 'use':
        if (c.onUse) c.onUse();
        else this.fallback('Tu ne peux pas utiliser ça comme ça.');
        break;
      case 'talk':
        if (c.onTalk) c.onTalk();
        else this.fallback('Ça ne te répondra pas.');
        break;
    }
  }

  /** Legacy compatibility: used to be the glow API */
  startGlow(): void {
    this.showHighlight(0.4);
  }
  stopGlow(): void {
    this.fadeHighlight();
  }

  private fallback(msg: string): void {
    // Emit event the scene can listen to
    this.scene.events.emit('hotspot-fallback', { hotspot: this, message: msg });
  }

  destroy(fromScene?: boolean): void {
    if (this.highlightTween) this.highlightTween.stop();
    super.destroy(fromScene);
  }
}
