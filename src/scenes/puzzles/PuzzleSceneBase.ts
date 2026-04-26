import * as Phaser from 'phaser';
import { COLORS, FONTS, GAME_WIDTH, GAME_HEIGHT, HUD } from '../../config';
import { InventoryBar } from '../../objects/InventoryBar';
import { DialogueBox } from '../../objects/DialogueBox';
import { HintButton } from '../../objects/HintButton';
import { VerbBar } from '../../objects/VerbBar';
import { ActionLabel } from '../../objects/ActionLabel';
import { TutorialOverlay } from '../../objects/TutorialOverlay';
import { Hotspot } from '../../objects/Hotspot';
import { Carnet } from '../../objects/Carnet';
import { CarnetButton } from '../../objects/CarnetButton';
import { hintConfig } from '../../data/puzzles';
import { startPuzzle, endPuzzle, recordTap } from '../../systems/hint';
import { setScene, setProgress, hasProgress, getPlayer, type ChapterId } from '../../systems/save';
import { stopAmbient } from '../../systems/audio';
import { t } from '../../systems/narrative';
import { itemDesc, type ItemId } from '../../data/items';
import { setActiveVerb, clearTarget } from '../../systems/verbs';
import { ASSETS_BASE } from '../../data/assets';
import { collectFragment } from '../../systems/fragments';
import { markRecontextualization } from '../../systems/assertions';

export abstract class PuzzleSceneBase extends Phaser.Scene {
  protected inv!: InventoryBar;
  protected dialogue!: DialogueBox;
  protected hintBtn!: HintButton;
  protected verbBar!: VerbBar;
  protected actionLabel!: ActionLabel;
  protected carnet!: Carnet;
  protected carnetButton!: CarnetButton;
  protected puzzleId!: string;
  protected chapter!: ChapterId;
  protected nextSceneKey: string = '';

  /**
   * Queue chapter-specific sprites in this scene's loader. Skips textures already
   * cached, so re-entering a scene is a no-op. Call from `init()`.
   */
  protected queueSprites(group: Record<string, string>): void {
    for (const [key, file] of Object.entries(group)) {
      if (this.textures.exists(key)) continue;
      const url = ASSETS_BASE + file.split('/').map((p) => encodeURIComponent(p)).join('/');
      this.load.image(key, url);
    }
  }

  protected setupHud(puzzleId: string): void {
    this.puzzleId = puzzleId;
    startPuzzle(puzzleId);
    setScene(this.scene.key, this.chapter);

    // Reset verb to default
    setActiveVerb('look');
    clearTarget();

    // Top bar
    const top = this.add.container(0, 0);
    top.setDepth(900);
    const topBg = this.add.rectangle(0, 0, GAME_WIDTH, HUD.topBarHeight, COLORS.charDeep, 0.75).setOrigin(0);
    top.add(topBg);
    const label = this.add.text(36, 36, t('ui.chapter', { n: this.chapter }), {
      fontFamily: FONTS.mono,
      fontSize: '32px',
      color: COLORS.hex.brass,
    });
    top.add(label);

    // Menu button (top-right) — Rectangle as direct interactive (no Container offset bug)
    const menuX = GAME_WIDTH - 100;
    const menuY = HUD.topBarHeight / 2;
    const menuBg = this.add.rectangle(menuX, menuY, 140, 80, COLORS.brassDark, 0.95).setDepth(901);
    menuBg.setStrokeStyle(2, COLORS.brass, 1);
    menuBg.setInteractive({ useHandCursor: true });
    this.add.text(menuX, menuY, 'MENU', {
      fontFamily: FONTS.body,
      fontSize: '28px',
      color: COLORS.hex.cream,
      fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(902);
    menuBg.on('pointerdown', () => {
      menuBg.setFillStyle(COLORS.sunAmber, 1);
      this.cameras.main.fadeOut(300, 31, 77, 62);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        stopAmbient();
        this.scene.start('MenuScene');
      });
    });

    // Carnet button (top-right, left of Menu)
    this.carnet = new Carnet(this, this.chapter);
    const carnetX = GAME_WIDTH - 260;
    this.carnetButton = new CarnetButton(this, carnetX, menuY, () => this.carnet.open());

    // HUD components (order matters for depth)
    this.dialogue = new DialogueBox(this);
    this.actionLabel = new ActionLabel(this);
    this.verbBar = new VerbBar(this);
    this.inv = new InventoryBar(this);
    this.hintBtn = new HintButton(this, {
      hintConfig: hintConfig(puzzleId),
      onSkip: () => this.onSkip(),
      onHintGiven: (cue) => this.onHintCue(cue),
    });

    // Mark chapter as visited (for Carte tab in Carnet)
    setProgress(`chapter.${this.chapter}.visited`);

    // Listen to fallback events from hotspots / inventory
    this.events.on('hotspot-fallback', (e: { message: string }) => {
      this.showNarration(e.message);
    });
    this.events.on('item-look', (e: { itemId: ItemId }) => {
      this.examineItem(e.itemId);
    });
    this.events.on('item-message', (e: { message: string }) => {
      this.showNarration(e.message);
    });

    // Show tutorial overlay on first chapter ever
    if (!hasProgress('global.tutorial_shown')) {
      this.time.delayedCall(400, () => {
        new TutorialOverlay(this, () => {
          setProgress('global.tutorial_shown');
          // After tutorial dismissed, briefly flash all hotspots
          this.flashAllHotspots();
        });
      });
    } else {
      // On subsequent chapters: brief hotspot flash on scene entry
      this.time.delayedCall(900, () => this.flashAllHotspots());
    }
  }

  /** Briefly flash all hotspot zones on scene entry to show players where to tap. */
  protected flashAllHotspots(): void {
    const list = ((this as any).__hotspots ?? []) as Hotspot[];
    list.forEach((h, i) => h.flashIntro(i * 60));
  }

  protected examineItem(id: ItemId): void {
    this.dialogue.show({
      speaker: 'NARRATOR',
      text: itemDesc(id),
    });
  }

  protected vera(text: string, onDone?: () => void): void {
    this.showVera(text, onDone);
  }

  protected showVera(text: string, onDone?: () => void): void {
    const player = getPlayer();
    const interpolated = text.replaceAll('{name}', player.name || '...');
    this.dialogue.show({
      speaker: 'VERA',
      text: interpolated,
      onComplete: onDone,
    });
  }

  protected showNarration(text: string, onDone?: () => void): void {
    const player = getPlayer();
    const interpolated = text.replaceAll('{name}', player.name || '...');
    this.dialogue.show({
      speaker: 'NARRATOR',
      text: interpolated,
      onComplete: onDone,
    });
  }

  protected showVeraSequence(texts: string[], onAllDone?: () => void): void {
    const player = getPlayer();
    this.dialogue.showSequence(
      texts.map((text) => ({
        speaker: 'VERA' as const,
        text: text.replaceAll('{name}', player.name || '...'),
      })),
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
    // Override in subclass
  }

  protected onSkip(): void {
    this.fadeToScene(this.nextSceneKey);
  }

  /**
   * Add a carnet fragment to the player's collection. Shows a brief toast.
   * Called by chapter scenes when narrative beats unlock evidence.
   */
  protected collectFragment(fragmentId: string): void {
    const wasNew = collectFragment(fragmentId);
    if (wasNew) {
      // If we just collected the Ch4 confession, trigger recontextualization
      if (fragmentId === 'ch4.confession_vera') {
        markRecontextualization();
      }
      this.showFragmentToast();
    }
  }

  private showFragmentToast(): void {
    const toast = this.add.container(GAME_WIDTH / 2, 200);
    toast.setDepth(2400);
    const bg = this.add.rectangle(0, 0, 600, 100, COLORS.brass, 0.95).setStrokeStyle(3, COLORS.charDeep, 1);
    const txt = this.add.text(0, 0, '+ FRAGMENT AJOUTÉ AU CARNET', {
      fontFamily: FONTS.mono,
      fontSize: '28px',
      color: COLORS.hex.charDeep,
      fontStyle: 'bold',
    }).setOrigin(0.5);
    toast.add([bg, txt]);
    toast.setAlpha(0);
    this.tweens.add({
      targets: toast,
      alpha: 1,
      y: 230,
      duration: 280,
      ease: 'Cubic.easeOut',
    });
    this.time.delayedCall(2200, () => {
      this.tweens.add({
        targets: toast,
        alpha: 0,
        duration: 280,
        onComplete: () => toast.destroy(true),
      });
    });
  }
}
