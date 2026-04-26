import * as Phaser from 'phaser';
import { COLORS, FONTS, GAME_WIDTH, GAME_HEIGHT } from '../config';
import { playSfx } from '../systems/audio';
import { getVeraDialogue, type VeraQuestion } from '../data/dialogues/vera';
import { collectFragment } from '../systems/fragments';
import type { ChapterId } from '../systems/save';

// Branching dialogue presenter for VERA holographic emitter.
// Player taps a question → VERA replies → side effects (unlock fragment/tile).
// Each question can be "asked" once per scene visit; visited questions get a checkmark.
export class VeraDialog extends Phaser.GameObjects.Container {
  private bg: Phaser.GameObjects.Rectangle;
  private panelBg: Phaser.GameObjects.Rectangle;
  private title: Phaser.GameObjects.Text;
  private intro: Phaser.GameObjects.Text;
  private questionButtons: Phaser.GameObjects.Container[] = [];
  private askedQuestions = new Set<string>();
  private chapterId: ChapterId;

  constructor(scene: Phaser.Scene, chapterId: ChapterId) {
    super(scene, 0, 0);
    this.chapterId = chapterId;

    // Modal background
    this.bg = scene.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.85).setOrigin(0);
    this.bg.setInteractive(); // catch background taps
    this.add(this.bg);

    // Panel — VERA-themed (cyan/blue holographic)
    this.panelBg = scene.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH - 120, GAME_HEIGHT - 360, 0x0a3a40, 0.96);
    this.panelBg.setStrokeStyle(4, 0xa8dadc, 0.9);
    this.add(this.panelBg);

    // Title with VERA portrait stub
    this.title = scene.add.text(GAME_WIDTH / 2, 280, '◉  VERA  ◉', {
      fontFamily: FONTS.display,
      fontSize: '54px',
      color: '#a8dadc',
    }).setOrigin(0.5);
    this.add(this.title);

    // Pulsing halo
    const halo = scene.add.circle(GAME_WIDTH / 2, 280, 80, 0xa8dadc, 0.15);
    scene.tweens.add({
      targets: halo,
      scale: { from: 0.9, to: 1.4 },
      alpha: { from: 0.15, to: 0.05 },
      yoyo: true,
      repeat: -1,
      duration: 1800,
      ease: 'Sine.easeInOut',
    });
    this.add(halo);

    // Intro text (from chapter dialogue tree)
    this.intro = scene.add.text(GAME_WIDTH / 2, 400, '', {
      fontFamily: FONTS.body,
      fontSize: '28px',
      color: '#f4e9d8',
      align: 'center',
      wordWrap: { width: GAME_WIDTH - 200 },
      lineSpacing: 6,
    }).setOrigin(0.5);
    this.add(this.intro);

    // Close button
    const closeX = GAME_WIDTH / 2;
    const closeY = GAME_HEIGHT - 280;
    const closeBg = scene.add.rectangle(closeX, closeY, 240, 80, COLORS.brassDark, 0.95);
    closeBg.setStrokeStyle(3, COLORS.brass, 1);
    closeBg.setInteractive({ useHandCursor: true });
    this.add(closeBg);
    const closeLabel = scene.add.text(closeX, closeY, '✕  FERMER', {
      fontFamily: FONTS.body,
      fontSize: '32px',
      color: COLORS.hex.cream,
      fontStyle: 'bold',
    }).setOrigin(0.5);
    this.add(closeLabel);
    closeBg.on('pointerdown', () => this.close());

    scene.add.existing(this);
    this.setDepth(2400);
    this.setVisible(false);
    this.setAlpha(0);

    this.renderQuestions();
  }

  open(): void {
    this.setVisible(true);
    const tree = getVeraDialogue(this.chapterId);
    this.intro.setText(tree.intro);
    this.scene.tweens.add({
      targets: this,
      alpha: 1,
      duration: 240,
      ease: 'Cubic.easeOut',
    });
    playSfx('beep');
  }

  close(): void {
    playSfx('tap');
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      duration: 180,
      onComplete: () => this.setVisible(false),
    });
  }

  private renderQuestions(): void {
    const tree = getVeraDialogue(this.chapterId);
    let cursorY = 700;
    tree.questions.forEach((q) => {
      // Skip hidden questions until they're discoverable
      if (q.isHidden) return;
      const btn = this.makeQuestionButton(q, cursorY);
      this.questionButtons.push(btn);
      this.add(btn);
      cursorY += 140;
    });
  }

  private makeQuestionButton(q: VeraQuestion, y: number): Phaser.GameObjects.Container {
    const c = this.scene.add.container(GAME_WIDTH / 2, y);
    const bg = this.scene.add.rectangle(0, 0, GAME_WIDTH - 200, 110, 0x1a4f5a, 0.9);
    bg.setStrokeStyle(2, 0xa8dadc, 0.7);
    bg.setInteractive({ useHandCursor: true });
    c.add(bg);

    const label = this.scene.add.text(-(GAME_WIDTH - 220) / 2, 0, q.question, {
      fontFamily: FONTS.body,
      fontSize: '26px',
      color: '#f4e9d8',
      wordWrap: { width: GAME_WIDTH - 320 },
    }).setOrigin(0, 0.5);
    c.add(label);

    // Checkmark if asked
    const check = this.scene.add.text((GAME_WIDTH - 220) / 2, 0, this.askedQuestions.has(q.id) ? '✓' : '', {
      fontFamily: FONTS.body,
      fontSize: '36px',
      color: '#7fb069',
    }).setOrigin(1, 0.5);
    c.add(check);
    (c as any).check = check;

    bg.on('pointerdown', () => {
      this.askQuestion(q);
      check.setText('✓');
    });

    return c;
  }

  private askQuestion(q: VeraQuestion): void {
    this.askedQuestions.add(q.id);
    playSfx('tap');

    // Hide question buttons during response
    this.questionButtons.forEach((b) => b.setVisible(false));

    // Show response text
    const responseBg = this.scene.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 100, GAME_WIDTH - 200, 360, 0x0a3a40, 0.98);
    responseBg.setStrokeStyle(3, 0xa8dadc, 1).setDepth(2410);
    const responseText = this.scene.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 100, q.response.text, {
      fontFamily: FONTS.body,
      fontSize: '30px',
      color: '#f4e9d8',
      align: 'center',
      wordWrap: { width: GAME_WIDTH - 280 },
      lineSpacing: 8,
    }).setOrigin(0.5).setDepth(2411);
    const tapCue = this.scene.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 290, '— Tape pour continuer —', {
      fontFamily: FONTS.mono,
      fontSize: '22px',
      color: '#a8dadc',
    }).setOrigin(0.5).setDepth(2411);

    // Side effects
    if (q.response.unlocksFragmentId) collectFragment(q.response.unlocksFragmentId);
    // Tile unlock — best done by re-rendering carnet (next time it opens)

    const cleanup = () => {
      responseBg.destroy();
      responseText.destroy();
      tapCue.destroy();
      this.questionButtons.forEach((b) => b.setVisible(true));
    };
    responseBg.setInteractive({ useHandCursor: true });
    responseBg.on('pointerdown', cleanup);
  }
}
