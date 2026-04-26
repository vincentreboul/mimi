import * as Phaser from 'phaser';
import { COLORS, FONTS, GAME_WIDTH, GAME_HEIGHT } from '../../config';
import { InventoryBar } from '../../objects/InventoryBar';
import { DialogueBox } from '../../objects/DialogueBox';
import { HintButton } from '../../objects/HintButton';
import { hintConfig } from '../../data/puzzles';
import { startPuzzle, endPuzzle, recordTap } from '../../systems/hint';
import { setScene, type ChapterId } from '../../systems/save';
import { playAmbient, stopAmbient } from '../../systems/audio';
import { t } from '../../systems/narrative';
import { itemDesc } from '../../data/items';
import type { ItemId } from '../../data/items';

export abstract class PuzzleSceneBase extends Phaser.Scene {
  protected inv!: InventoryBar;
  protected dialogue!: DialogueBox;
  protected hintBtn!: HintButton;
  protected puzzleId!: string;
  protected chapter!: ChapterId;
  protected nextSceneKey: string = '';

  protected setupHud(puzzleId: string): void {
    this.puzzleId = puzzleId;
    startPuzzle(puzzleId);
    setScene(this.scene.key, this.chapter);

    // Title bar with chapter label
    const top = this.add.container(0, 0);
    top.setDepth(900);
    const topBg = this.add.rectangle(0, 0, GAME_WIDTH, 110, COLORS.charDeep, 0.55).setOrigin(0);
    top.add(topBg);
    const label = this.add.text(40, 36, t('ui.chapter', { n: this.chapter }), {
      fontFamily: FONTS.mono,
      fontSize: '28px',
      color: COLORS.hex.brass,
    });
    top.add(label);

    // Menu button (top-right)
    const menuBtn = this.add.container(GAME_WIDTH - 90, 55);
    const menuBg = this.add.circle(0, 0, 50, COLORS.brassDark, 0.85);
    menuBg.setStrokeStyle(2, COLORS.brass, 1);
    const menuTxt = this.add.text(0, 0, '☰', {
      fontFamily: FONTS.body,
      fontSize: '36px',
      color: COLORS.hex.cream,
    }).setOrigin(0.5);
    menuBtn.add([menuBg, menuTxt]);
    menuBtn.setSize(100, 100);
    menuBtn.setInteractive(new Phaser.Geom.Circle(0, 0, 50), Phaser.Geom.Circle.Contains);
    menuBtn.on('pointerdown', () => {
      this.cameras.main.fadeOut(300, 31, 77, 62);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        stopAmbient();
        this.scene.start('MenuScene');
      });
    });
    top.add(menuBtn);

    // Inventory + Dialogue + Hint
    this.dialogue = new DialogueBox(this);
    this.inv = new InventoryBar(this, {
      onExamine: (id) => this.examineItem(id),
    });
    this.hintBtn = new HintButton(this, {
      hintConfig: hintConfig(puzzleId),
      onSkip: () => this.onSkip(),
      onHintGiven: (cue) => this.onHintCue(cue),
    });
  }

  protected examineItem(id: ItemId): void {
    this.dialogue.show({
      speaker: 'NARRATOR',
      text: itemDesc(id),
    });
  }

  protected showVera(text: string, onDone?: () => void): void {
    this.dialogue.show({
      speaker: 'VERA',
      text,
      onComplete: onDone,
    });
  }

  protected showNarration(text: string, onDone?: () => void): void {
    this.dialogue.show({
      speaker: 'NARRATOR',
      text,
      onComplete: onDone,
    });
  }

  protected showVeraSequence(texts: string[], onAllDone?: () => void): void {
    this.dialogue.showSequence(
      texts.map((text) => ({ speaker: 'VERA' as const, text })),
      onAllDone
    );
  }

  protected fadeToScene(key: string, data?: object): void {
    endPuzzle(this.puzzleId);
    setScene(key, this.chapter);
    this.cameras.main.fadeOut(500, 31, 77, 62);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      stopAmbient();
      this.scene.start(key, data);
    });
  }

  protected recordTap(): void {
    recordTap(this.puzzleId);
  }

  protected onHintCue(_cue?: string): void {
    // Override in subclass to glow specific hotspot
  }

  protected onSkip(): void {
    // Default: jump to next scene (story-skip)
    this.fadeToScene(this.nextSceneKey);
  }
}
