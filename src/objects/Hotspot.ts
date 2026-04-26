import * as Phaser from 'phaser';
import { COLORS, HUD } from '../config';
import { playSfx } from '../systems/audio';

export interface HotspotConfig {
  x: number;
  y: number;
  width?: number;
  height?: number;
  shape?: 'rect' | 'circle';
  label?: string; // accessibility / dev hint
  glow?: boolean;
  onTap: () => void;
  acceptsItem?: (itemId: string) => boolean;
  onItemDrop?: (itemId: string) => void;
}

/**
 * Hotspot: an invisible (or subtly highlighted) interactive zone.
 * Generous touch target — minimum 96x96 (logical px = ~48pt on iPhone).
 */
export class Hotspot extends Phaser.GameObjects.Container {
  private bg: Phaser.GameObjects.Shape;
  private glowFx: Phaser.Tweens.Tween | null = null;
  public config: HotspotConfig;

  constructor(scene: Phaser.Scene, config: HotspotConfig) {
    super(scene, config.x, config.y);
    this.config = config;

    const w = Math.max(config.width ?? HUD.touchTargetMin, HUD.touchTargetMin);
    const h = Math.max(config.height ?? HUD.touchTargetMin, HUD.touchTargetMin);

    if (config.shape === 'circle') {
      this.bg = scene.add.circle(0, 0, Math.max(w, h) / 2, COLORS.cream, 0);
      this.bg.setStrokeStyle(0, COLORS.cream, 0);
    } else {
      this.bg = scene.add.rectangle(0, 0, w, h, COLORS.cream, 0);
      this.bg.setStrokeStyle(0, COLORS.cream, 0);
    }
    this.bg.setOrigin(0.5);
    this.add(this.bg);

    this.setSize(w, h);
    this.setInteractive(
      new Phaser.Geom.Rectangle(-w / 2, -h / 2, w, h),
      Phaser.Geom.Rectangle.Contains
    );

    this.on('pointerdown', () => {
      playSfx('tap');
      this.pulse();
      config.onTap();
    });

    if (config.glow) this.startGlow();

    scene.add.existing(this);
  }

  startGlow(): void {
    if (this.glowFx) return;
    this.bg.setStrokeStyle(4, COLORS.sunAmber, 0.9);
    this.glowFx = this.scene.tweens.add({
      targets: this.bg,
      alpha: { from: 0.15, to: 0.45 },
      duration: 900,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
    this.bg.fillColor = COLORS.sunAmber;
  }

  stopGlow(): void {
    if (this.glowFx) {
      this.glowFx.stop();
      this.glowFx = null;
    }
    this.bg.setStrokeStyle(0, COLORS.cream, 0);
    this.bg.setAlpha(0);
  }

  pulse(): void {
    this.scene.tweens.add({
      targets: this.bg,
      alpha: { from: 0.5, to: 0 },
      duration: 320,
      ease: 'Cubic.easeOut',
      onStart: () => {
        this.bg.fillColor = COLORS.sunAmber;
        this.bg.setAlpha(0.35);
      },
    });
  }

  setLabel(_label: string): void {
    // For future accessibility: could add aria-label via DOM overlay
  }

  destroy(fromScene?: boolean): void {
    if (this.glowFx) this.glowFx.stop();
    super.destroy(fromScene);
  }
}
