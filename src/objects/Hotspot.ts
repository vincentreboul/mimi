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
  name: string;
  label?: string;                  // legacy alias
  shape?: 'rect' | 'circle';
  showIndicator?: boolean;
  glow?: boolean;
  onTap?: () => void;              // legacy single-action handler
  onLook?: () => void;
  onPick?: () => void;
  onUse?: (item?: ItemId) => void;
  onTalk?: () => void;
  defaultMessage?: string;
}

/**
 * Hotspot — uses the rectangle ITSELF as the interactive object (no Container nesting,
 * no coordinate offsets). Indicator dot is added separately to the scene.
 */
export class Hotspot {
  public bg: Phaser.GameObjects.Rectangle;
  private indicatorOuter?: Phaser.GameObjects.Arc;
  private indicatorInner?: Phaser.GameObjects.Arc;
  public config: HotspotConfig;

  constructor(scene: Phaser.Scene, config: HotspotConfig) {
    this.config = config;

    const w = Math.max(config.width ?? HUD.touchTargetMin, HUD.touchTargetMin);
    const h = Math.max(config.height ?? HUD.touchTargetMin, HUD.touchTargetMin);

    // Highlight rect — interactive, exactly matches the visual zone.
    this.bg = scene.add.rectangle(config.x, config.y, w, h, COLORS.sunAmber, 0);
    this.bg.setStrokeStyle(0, COLORS.sunAmber, 0);
    this.bg.setInteractive({ useHandCursor: true });

    this.bg.on('pointerover', () => this.showHighlight(0.2));
    this.bg.on('pointerout', () => this.fadeHighlight());
    this.bg.on('pointerdown', () => this.onTap());

    if (config.showIndicator !== false) this.addIndicator(scene);
  }

  private addIndicator(scene: Phaser.Scene): void {
    this.indicatorOuter = scene.add.circle(this.config.x, this.config.y, 18, COLORS.sunAmber, 0)
      .setStrokeStyle(4, COLORS.sunAmber, 1);
    this.indicatorInner = scene.add.circle(this.config.x, this.config.y, 10, COLORS.sunAmber, 1);

    scene.tweens.add({
      targets: this.indicatorOuter,
      scale: { from: 1, to: 2.2 },
      alpha: { from: 1, to: 0 },
      duration: 1400,
      repeat: -1,
      ease: 'Sine.easeOut',
    });
    scene.tweens.add({
      targets: this.indicatorInner,
      alpha: { from: 1, to: 0.5 },
      duration: 700,
      yoyo: true,
      repeat: -1,
    });
  }

  hideIndicator(): void {
    this.indicatorOuter?.setVisible(false);
    this.indicatorInner?.setVisible(false);
  }

  showHighlight(alpha = 0.3): void {
    this.bg.setStrokeStyle(4, COLORS.sunAmber, 1);
    this.bg.setFillStyle(COLORS.sunAmber, alpha);
  }

  fadeHighlight(): void {
    this.bg.setStrokeStyle(0, COLORS.sunAmber, 0);
    this.bg.setFillStyle(COLORS.sunAmber, 0);
  }

  pulse(): void {
    const scene = this.bg.scene;
    scene.tweens.add({
      targets: this.bg,
      alpha: { from: 0.6, to: 0 },
      duration: 320,
      ease: 'Cubic.easeOut',
      onStart: () => {
        this.bg.setFillStyle(COLORS.sunAmber, 0.6);
      },
    });
  }

  flashIntro(): void {
    this.showHighlight(0.4);
    this.bg.scene.tweens.add({
      targets: this.bg,
      alpha: { from: 0.4, to: 0 },
      duration: 1200,
      onComplete: () => this.fadeHighlight(),
    });
  }

  /** Legacy compatibility */
  startGlow(): void {
    this.showHighlight(0.4);
  }
  stopGlow(): void {
    this.fadeHighlight();
  }

  private onTap(): void {
    playSfx('tap');
    this.pulse();

    const target: VerbTarget = {
      kind: 'hotspot',
      id: this.config.name,
      display: this.config.name,
    };
    setTarget(target);

    const verb = getActiveVerb();
    this.handleVerb(verb);
  }

  private handleVerb(verb: Verb): void {
    const c = this.config;
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

  private fallback(msg: string): void {
    this.bg.scene.events.emit('hotspot-fallback', { hotspot: this, message: msg });
  }

  destroy(): void {
    this.bg.destroy();
    this.indicatorOuter?.destroy();
    this.indicatorInner?.destroy();
  }
}
