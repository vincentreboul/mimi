import * as Phaser from 'phaser';
import { COLORS, GAME_WIDTH, GAME_HEIGHT } from '../config';

export type Mood = 'cryo' | 'serre' | 'atelier' | 'coupole';

/**
 * SceneBackground draws a procedural stylized scene per chapter mood.
 * No image assets needed — keeps total payload < 200 KB.
 */
export class SceneBackground {
  static draw(scene: Phaser.Scene, mood: Mood): void {
    const g = scene.add.graphics();
    g.setDepth(-1000);
    const w = GAME_WIDTH;
    const h = GAME_HEIGHT;

    switch (mood) {
      case 'cryo':
        SceneBackground.drawCryo(g, w, h);
        break;
      case 'serre':
        SceneBackground.drawSerre(g, w, h);
        break;
      case 'atelier':
        SceneBackground.drawAtelier(g, w, h);
        break;
      case 'coupole':
        SceneBackground.drawCoupole(g, w, h);
        break;
    }
  }

  private static drawCryo(g: Phaser.GameObjects.Graphics, w: number, h: number): void {
    // Cold blue-green gradient
    g.fillGradientStyle(0x1a3a40, 0x1a3a40, 0x0d1e23, 0x0d1e23, 1, 1, 0.95, 0.95);
    g.fillRect(0, 0, w, h);

    // Cryo glow
    g.fillStyle(COLORS.skyPale, 0.06);
    g.fillCircle(w / 2, 600, 700);

    // Floor grid (perspective)
    g.lineStyle(2, COLORS.skyPale, 0.18);
    for (let i = 0; i < 8; i++) {
      const y = 1100 + i * 100;
      g.beginPath();
      g.moveTo(0, y);
      g.lineTo(w, y);
      g.strokePath();
    }
    for (let i = 0; i < 12; i++) {
      const x = (i / 11) * w;
      g.beginPath();
      g.moveTo(x, 1100);
      g.lineTo(w * 0.5 + (x - w * 0.5) * 2.5, h);
      g.strokePath();
    }

    // Cryo pods (5 silhouettes in background)
    const podY = 850;
    for (let i = 0; i < 5; i++) {
      const x = (i + 0.5) * (w / 5);
      g.fillStyle(COLORS.charDeep, 0.85);
      g.fillRoundedRect(x - 70, podY - 200, 140, 320, 16);
      // Pod glow
      g.fillStyle(COLORS.skyPale, i === 2 ? 0.35 : 0.12);
      g.fillRoundedRect(x - 60, podY - 190, 120, 300, 12);
    }
  }

  private static drawSerre(g: Phaser.GameObjects.Graphics, w: number, h: number): void {
    // Warm green gradient — daylight through leaves
    g.fillGradientStyle(0x2d6a4f, 0x2d6a4f, 0x1f4d3e, 0x1f4d3e, 1, 1, 0.95, 0.95);
    g.fillRect(0, 0, w, h);

    // Sunbeams
    g.fillStyle(COLORS.cream, 0.07);
    for (let i = 0; i < 8; i++) {
      const x = i * (w / 8);
      g.fillTriangle(x, 0, x + 200, 0, x + 100, h);
    }

    // Foliage circles
    g.fillStyle(COLORS.leafLight, 0.35);
    const foliage = [
      [200, 300, 280], [w - 250, 250, 320], [w / 2, 150, 240],
      [150, h - 700, 200], [w - 200, h - 600, 280], [w / 2 - 50, h - 800, 220],
    ];
    for (const [x, y, r] of foliage) {
      g.fillCircle(x, y, r);
    }

    // Hanging vines (segmented curves)
    g.lineStyle(6, COLORS.leafDeep, 0.7);
    for (let i = 0; i < 6; i++) {
      const x = (i + 0.5) * (w / 6);
      g.beginPath();
      g.moveTo(x, 0);
      const segments = 30;
      for (let s = 1; s <= segments; s++) {
        const tt = s / segments;
        const yy = tt * 700;
        const wave = Math.sin(tt * Math.PI * 2 + i) * 30;
        g.lineTo(x + wave, yy);
      }
      g.strokePath();
    }
  }

  private static drawAtelier(g: Phaser.GameObjects.Graphics, w: number, h: number): void {
    // Industrial brown / brass tones
    g.fillGradientStyle(0x2a2620, 0x2a2620, 0x18140f, 0x18140f, 1, 1, 0.95, 0.95);
    g.fillRect(0, 0, w, h);

    // Pipes along wall
    g.fillStyle(COLORS.brassDark, 0.6);
    g.fillRect(80, 200, 30, h - 800);
    g.fillRect(w - 110, 200, 30, h - 800);
    g.fillStyle(COLORS.brass, 0.4);
    for (let i = 0; i < 6; i++) {
      const y = 250 + i * 200;
      g.fillCircle(95, y, 22);
      g.fillCircle(w - 95, y, 22);
    }

    // Workbench silhouette
    g.fillStyle(COLORS.charDeep, 0.95);
    g.fillRect(140, h - 900, w - 280, 380);
    g.fillStyle(COLORS.brassDark, 0.6);
    g.fillRect(140, h - 900, w - 280, 24);

    // Hanging lamp glow
    g.fillStyle(COLORS.sunAmber, 0.18);
    g.fillCircle(w / 2, 700, 320);
    g.fillStyle(COLORS.sunAmber, 0.35);
    g.fillCircle(w / 2, 700, 80);
  }

  private static drawCoupole(g: Phaser.GameObjects.Graphics, w: number, h: number): void {
    // Deep space gradient
    g.fillGradientStyle(0x0a0e1a, 0x0a0e1a, 0x1a1f2a, 0x1a1f2a, 1, 1, 0.95, 0.95);
    g.fillRect(0, 0, w, h);

    // Stars
    g.fillStyle(COLORS.cream, 0.9);
    for (let i = 0; i < 80; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h * 0.7;
      const r = Math.random() * 2 + 0.5;
      g.fillCircle(x, y, r);
    }

    // Earth — large soft circle
    const ex = w / 2;
    const ey = 700;
    g.fillStyle(COLORS.skyPale, 0.55);
    g.fillCircle(ex, ey, 380);
    g.fillStyle(COLORS.leafLight, 0.5);
    g.fillCircle(ex - 80, ey - 50, 200);
    g.fillStyle(COLORS.leafLight, 0.4);
    g.fillCircle(ex + 100, ey + 80, 140);
    g.fillStyle(COLORS.cream, 0.2);
    g.fillCircle(ex + 60, ey - 100, 100);

    // Atmosphere glow
    g.lineStyle(8, COLORS.skyPale, 0.25);
    g.strokeCircle(ex, ey, 400);

    // Dome frame (foreground)
    g.lineStyle(4, COLORS.brass, 0.8);
    g.strokeCircle(ex, ey, 480);
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      g.beginPath();
      g.moveTo(ex, ey);
      g.lineTo(ex + Math.cos(angle) * 480, ey + Math.sin(angle) * 480);
      g.strokePath();
    }
  }
}
