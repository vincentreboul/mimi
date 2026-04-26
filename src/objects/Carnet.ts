import * as Phaser from 'phaser';
import { COLORS, FONTS, GAME_WIDTH, GAME_HEIGHT } from '../config';
import { playSfx } from '../systems/audio';
import { getActiveSlot, type ChapterId } from '../systems/save';
import {
  getAllAssertionsForChapter,
  getAvailableTiles,
  ALL_CARNETS,
} from '../data/carnet';
import type { Tile, Assertion, AssertionSlotDef } from '../data/carnet/types';
import {
  getAssertionState,
  placeTile,
  unplaceTile,
  isLocked,
  isRevised,
  chapterCompletionRate,
  globalCompletionRate,
  onAssertionChange,
} from '../systems/assertions';
import {
  listChapterFragments,
  getCollectedFragmentIds,
  globalCollectionRate,
} from '../systems/fragments';
import { CREW, getAllCrew } from '../data/crew';
import { AssertionTile } from './AssertionTile';
import { AssertionSlot } from './AssertionSlot';

type CarnetTab = 'assertions' | 'fragments' | 'equipage' | 'carte' | 'aeolis';

const TAB_LABELS: Record<CarnetTab, string> = {
  assertions: 'ASSERTIONS',
  fragments: 'FRAGMENTS',
  equipage: 'ÉQUIPAGE',
  carte: 'CARTE',
  aeolis: 'AEOLIS',
};

const TABS: CarnetTab[] = ['assertions', 'fragments', 'equipage', 'carte', 'aeolis'];

export class Carnet extends Phaser.GameObjects.Container {
  private bg: Phaser.GameObjects.Rectangle;
  private paper: Phaser.GameObjects.Rectangle;
  private titleText: Phaser.GameObjects.Text;
  private closeBtn: Phaser.GameObjects.Rectangle;
  private closeLabel: Phaser.GameObjects.Text;
  private tabButtons: { tab: CarnetTab; bg: Phaser.GameObjects.Rectangle; label: Phaser.GameObjects.Text }[] = [];
  private contentContainer: Phaser.GameObjects.Container;
  private currentTab: CarnetTab = 'assertions';
  private currentChapter: ChapterId;
  private unsubAssertion: () => void;

  // Assertions tab runtime state
  private tileInstances: AssertionTile[] = [];
  private slotInstances: AssertionSlot[] = [];

  constructor(scene: Phaser.Scene, chapterId: ChapterId) {
    super(scene, 0, 0);
    this.currentChapter = chapterId;

    // Full-screen modal background — paper-jaune aesthetic
    this.bg = scene.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.85).setOrigin(0);
    this.add(this.bg);
    this.bg.setInteractive(); // catch outside taps but don't close (intentional — user must close via X)

    this.paper = scene.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH - 80, GAME_HEIGHT - 200, 0xf2e4c3, 1);
    this.paper.setStrokeStyle(4, 0x8c6e3a, 1);
    this.add(this.paper);

    // Title
    this.titleText = scene.add.text(GAME_WIDTH / 2, 160, 'CARNET DE BORD', {
      fontFamily: FONTS.display,
      fontSize: '54px',
      color: '#3a2614',
    }).setOrigin(0.5);
    this.add(this.titleText);

    // Subtitle (chapter + completion)
    const subtitle = scene.add.text(GAME_WIDTH / 2, 230, '', {
      fontFamily: FONTS.body,
      fontSize: '28px',
      color: '#6b4f2c',
    }).setOrigin(0.5);
    subtitle.setText(this.subtitleText());
    this.add(subtitle);

    // Close button (top-right)
    const closeX = GAME_WIDTH - 100;
    const closeY = 160;
    this.closeBtn = scene.add.rectangle(closeX, closeY, 90, 90, 0x8c6e3a, 1);
    this.closeBtn.setStrokeStyle(3, 0x3a2614, 1);
    this.closeBtn.setInteractive({ useHandCursor: true });
    this.add(this.closeBtn);
    this.closeLabel = scene.add.text(closeX, closeY, '✕', {
      fontFamily: FONTS.body,
      fontSize: '54px',
      color: '#f2e4c3',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    this.add(this.closeLabel);
    this.closeBtn.on('pointerdown', () => this.close());

    // Tabs
    const tabsY = 320;
    const tabW = (GAME_WIDTH - 160) / TABS.length;
    TABS.forEach((tab, i) => {
      const x = 80 + tabW * i + tabW / 2;
      const tBg = scene.add.rectangle(x, tabsY, tabW - 16, 80, tab === this.currentTab ? 0x8c6e3a : 0xc0a778, 1);
      tBg.setStrokeStyle(2, 0x3a2614, 0.6);
      tBg.setInteractive({ useHandCursor: true });
      this.add(tBg);
      const tLabel = scene.add.text(x, tabsY, TAB_LABELS[tab], {
        fontFamily: FONTS.mono,
        fontSize: '22px',
        color: tab === this.currentTab ? '#f2e4c3' : '#3a2614',
        fontStyle: 'bold',
      }).setOrigin(0.5);
      this.add(tLabel);
      tBg.on('pointerdown', () => this.switchTab(tab));
      this.tabButtons.push({ tab, bg: tBg, label: tLabel });
    });

    // Content container — swapped per tab
    this.contentContainer = scene.add.container(0, 380);
    this.add(this.contentContainer);

    scene.add.existing(this);
    this.setDepth(2500);
    this.setVisible(false);
    this.setAlpha(0);

    // Listen for assertion changes to refresh
    this.unsubAssertion = onAssertionChange(() => {
      if (this.visible && this.currentTab === 'assertions') this.renderAssertionsTab();
    });

    this.renderTab();
  }

  open(): void {
    this.setVisible(true);
    this.scene.tweens.add({
      targets: this,
      alpha: 1,
      duration: 240,
      ease: 'Cubic.easeOut',
    });
    playSfx('beep');
    this.renderTab();
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

  private subtitleText(): string {
    const chRate = Math.round(chapterCompletionRate(this.currentChapter) * 100);
    const globalRate = Math.round(globalCompletionRate() * 100);
    return `Chapitre ${this.currentChapter} — ${chRate}% — Global ${globalRate}%`;
  }

  setChapter(chapterId: ChapterId): void {
    this.currentChapter = chapterId;
    if (this.visible) this.renderTab();
  }

  private switchTab(tab: CarnetTab): void {
    if (tab === this.currentTab) return;
    this.currentTab = tab;
    this.tabButtons.forEach(({ tab: t, bg, label }) => {
      bg.setFillStyle(t === tab ? 0x8c6e3a : 0xc0a778, 1);
      label.setColor(t === tab ? '#f2e4c3' : '#3a2614');
    });
    playSfx('tap');
    this.renderTab();
  }

  private renderTab(): void {
    // Clear previous content
    this.contentContainer.removeAll(true);
    this.tileInstances.forEach((t) => t.destroy());
    this.slotInstances.forEach((s) => s.destroy());
    this.tileInstances = [];
    this.slotInstances = [];

    switch (this.currentTab) {
      case 'assertions': this.renderAssertionsTab(); break;
      case 'fragments': this.renderFragmentsTab(); break;
      case 'equipage': this.renderCrewTab(); break;
      case 'carte': this.renderCarteTab(); break;
      case 'aeolis': this.renderAeolisTab(); break;
    }
  }

  // -------------------- ASSERTIONS TAB --------------------

  private renderAssertionsTab(): void {
    const assertions = getAllAssertionsForChapter(this.currentChapter);
    if (assertions.length === 0) {
      this.contentContainer.add(this.scene.add.text(GAME_WIDTH / 2, 100, 'Aucune assertion pour ce chapitre.', {
        fontFamily: FONTS.body,
        fontSize: '32px',
        color: '#6b4f2c',
      }).setOrigin(0.5));
      return;
    }

    const collectedFragmentIds = getCollectedFragmentIds(this.currentChapter);
    const availableTiles = getAvailableTiles(this.currentChapter, collectedFragmentIds);

    let cursorY = 60;
    assertions.forEach((assertion, idx) => {
      cursorY = this.renderAssertion(assertion, cursorY, idx);
      cursorY += 30;
    });

    // Tile bandeau at bottom
    this.renderTileBandeau(availableTiles, cursorY + 20);
  }

  private renderAssertion(assertion: Assertion, startY: number, idx: number): number {
    const state = getAssertionState(assertion.id);
    const activeSlots = state.revised && assertion.revisedSlots ? assertion.revisedSlots : assertion.slots;

    // Heading
    const heading = this.scene.add.text(120, startY, `${idx + 1}.`, {
      fontFamily: FONTS.mono,
      fontSize: '32px',
      color: state.locked ? '#1f4d3e' : (state.revised ? '#c0392b' : '#3a2614'),
      fontStyle: 'bold',
    });
    this.contentContainer.add(heading);

    // Build the line — split template by {n} placeholders
    // template e.g. "Le capitaine {0} {1} {2} pour {3}."
    const parts = assertion.template.split(/(\{\d+\})/);
    let cursorX = 180;
    let lineY = startY + 18;

    parts.forEach((part) => {
      const m = part.match(/^\{(\d+)\}$/);
      if (m) {
        const slotIdx = parseInt(m[1], 10);
        const slotDef = activeSlots[slotIdx];
        const tileId = state.tiles[slotIdx];
        if (tileId) {
          // Render filled with mini-tile
          const tile = this.findTileDefinition(tileId);
          const text = tile?.text ?? tileId;
          const w = Math.max(140, text.length * 14);
          const slotBox = new AssertionSlot(this.scene, cursorX + w / 2, lineY, w, 50, assertion.id, slotIdx, slotDef.category);
          slotBox.setFilled(true);
          if (state.locked) slotBox.setLocked(true);
          if (state.revised && !state.locked) slotBox.setRevisable(true);
          // Place a mini-tile visual inside (always-on, not draggable)
          this.contentContainer.add(this.scene.add.text(cursorX + w / 2, lineY, text, {
            fontFamily: FONTS.body,
            fontSize: '24px',
            color: state.locked ? '#1f4d3e' : '#3a2614',
            fontStyle: 'bold',
          }).setOrigin(0.5).setDepth(2752));
          // Tap to release if not locked
          if (!state.locked) {
            slotBox.bg.setInteractive({ useHandCursor: true });
            slotBox.bg.on('pointerdown', () => {
              unplaceTile(assertion.id, slotIdx);
              this.renderAssertionsTab();
            });
          }
          this.slotInstances.push(slotBox);
          cursorX += w + 12;
        } else {
          // Empty slot — drop target
          const w = 200;
          const slotBox = new AssertionSlot(this.scene, cursorX + w / 2, lineY, w, 50, assertion.id, slotIdx, slotDef.category, '____');
          if (state.revised) slotBox.setRevisable(true);
          this.slotInstances.push(slotBox);
          cursorX += w + 12;
        }
      } else if (part.length > 0) {
        const t = this.scene.add.text(cursorX, lineY, part, {
          fontFamily: FONTS.body,
          fontSize: '26px',
          color: '#3a2614',
        }).setOrigin(0, 0.5);
        this.contentContainer.add(t);
        cursorX += t.width + 8;
      }
      // Wrap if cursor exceeds width
      if (cursorX > GAME_WIDTH - 120) {
        cursorX = 180;
        lineY += 56;
      }
    });

    return lineY + 60;
  }

  private renderTileBandeau(tiles: Tile[], startY: number): void {
    if (tiles.length === 0) return;
    // Header
    this.contentContainer.add(this.scene.add.text(120, startY, '— TUILES DISPONIBLES —', {
      fontFamily: FONTS.mono,
      fontSize: '22px',
      color: '#6b4f2c',
    }));
    let cursorX = 120;
    let cursorY = startY + 50;
    const yLimit = 1280; // top of HUD
    tiles.forEach((tile) => {
      const t = new AssertionTile(this.scene, cursorX + 100, cursorY, tile);
      this.tileInstances.push(t);
      // Hook up drag/drop snapping
      t.on('drag', () => this.onTileDrag(t));
      t.on('dragend', () => this.onTileDrop(t));
      cursorX += 220;
      if (cursorX > GAME_WIDTH - 200) {
        cursorX = 120;
        cursorY += 80;
      }
      if (cursorY > yLimit) return;
    });
  }

  private onTileDrag(_t: AssertionTile): void {
    // Optional: could highlight valid slots here
  }

  private onTileDrop(t: AssertionTile): void {
    // Find slot under tile
    const targetSlot = this.slotInstances.find((s) => !s.isFilled() && s.contains(t.x - this.contentContainer.x, t.y - this.contentContainer.y));
    if (!targetSlot) {
      // Snap back done by AssertionTile dragend
      return;
    }
    const result = placeTile(targetSlot.assertionId, targetSlot.slotIndex, t.tile.id);
    if (result.ok) {
      playSfx('success');
      this.renderAssertionsTab();
    } else {
      t.flashRed();
      playSfx('beep');
    }
  }

  private findTileDefinition(tileId: string): Tile | null {
    for (const ch of Object.values(ALL_CARNETS)) {
      const t = ch.tiles.find((x) => x.id === tileId);
      if (t) return t;
    }
    return null;
  }

  // -------------------- FRAGMENTS TAB --------------------

  private renderFragmentsTab(): void {
    const allChapters: ChapterId[] = [1, 2, 3, 4, 5];
    let cursorY = 40;

    allChapters.forEach((chId) => {
      const fragments = listChapterFragments(chId);
      const collectedCount = fragments.filter((f) => f.collected).length;
      if (collectedCount === 0 && chId !== this.currentChapter) return;

      // Chapter header
      this.contentContainer.add(this.scene.add.text(120, cursorY, `CHAPITRE ${chId} — ${collectedCount}/${fragments.length}`, {
        fontFamily: FONTS.mono,
        fontSize: '28px',
        color: '#6b4f2c',
        fontStyle: 'bold',
      }));
      cursorY += 50;

      fragments.forEach((entry) => {
        const text = entry.collected ? `▸ ${entry.fragment.title}` : '▢ ???';
        const color = entry.collected ? '#3a2614' : '#a89b80';
        const t = this.scene.add.text(160, cursorY, text, {
          fontFamily: FONTS.body,
          fontSize: '24px',
          color,
        });
        this.contentContainer.add(t);
        if (entry.collected) {
          t.setInteractive({ useHandCursor: true });
          t.on('pointerdown', () => this.openFragmentDetail(entry.fragment.id));
        }
        cursorY += 38;
      });
      cursorY += 16;
    });
  }

  private openFragmentDetail(fragmentId: string): void {
    // Modal-in-modal: show fragment body
    // Quick implementation — overlay rectangle + text
    const overlay = this.scene.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH - 200, GAME_HEIGHT - 400, 0x3a2614, 0.97).setDepth(2900);
    overlay.setStrokeStyle(3, 0xc0a778, 1);
    overlay.setInteractive({ useHandCursor: true });

    const fragment = (() => {
      for (const ch of Object.values(ALL_CARNETS)) {
        const f = ch.fragments.find((x) => x.id === fragmentId);
        if (f) return f;
      }
      return null;
    })();
    if (!fragment) {
      overlay.destroy();
      return;
    }

    const title = this.scene.add.text(GAME_WIDTH / 2, 320, fragment.title, {
      fontFamily: FONTS.display,
      fontSize: '36px',
      color: '#f2e4c3',
      align: 'center',
      wordWrap: { width: GAME_WIDTH - 280 },
    }).setOrigin(0.5).setDepth(2901);

    const source = this.scene.add.text(GAME_WIDTH / 2, 380, `[${fragment.kind.toUpperCase()}] — ${fragment.source}`, {
      fontFamily: FONTS.mono,
      fontSize: '22px',
      color: '#c0a778',
    }).setOrigin(0.5).setDepth(2901);

    const body = this.scene.add.text(GAME_WIDTH / 2, 440, fragment.body, {
      fontFamily: FONTS.body,
      fontSize: '26px',
      color: '#f2e4c3',
      align: 'left',
      wordWrap: { width: GAME_WIDTH - 320 },
      lineSpacing: 6,
    }).setOrigin(0.5, 0).setDepth(2901);

    const closeNote = this.scene.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 240, '— Tape pour fermer —', {
      fontFamily: FONTS.mono,
      fontSize: '24px',
      color: '#c0a778',
    }).setOrigin(0.5).setDepth(2901);

    const cleanup = () => {
      overlay.destroy();
      title.destroy();
      source.destroy();
      body.destroy();
      closeNote.destroy();
    };
    overlay.on('pointerdown', cleanup);
  }

  // -------------------- CREW TAB --------------------

  private renderCrewTab(): void {
    const slot = getActiveSlot();
    const allFragmentIds = Object.values(slot.fragments ?? {}).flat();
    let cursorY = 40;

    getAllCrew().forEach((member) => {
      // Card header
      this.contentContainer.add(this.scene.add.text(120, cursorY, member.fullName, {
        fontFamily: FONTS.display,
        fontSize: '32px',
        color: '#3a2614',
      }));
      cursorY += 44;
      this.contentContainer.add(this.scene.add.text(120, cursorY, `${member.rank}${member.age ? ` — ${member.age} ans` : ''}`, {
        fontFamily: FONTS.mono,
        fontSize: '20px',
        color: '#6b4f2c',
      }));
      cursorY += 30;
      this.contentContainer.add(this.scene.add.text(120, cursorY, member.baseBio, {
        fontFamily: FONTS.body,
        fontSize: '22px',
        color: '#3a2614',
        wordWrap: { width: GAME_WIDTH - 240 },
      }));
      cursorY += this.estimateTextHeight(member.baseBio, GAME_WIDTH - 240, 22) + 14;

      // Unlocked traits
      member.traits.forEach((trait) => {
        if (allFragmentIds.includes(trait.unlockedBy)) {
          this.contentContainer.add(this.scene.add.text(140, cursorY, `• ${trait.text}`, {
            fontFamily: FONTS.body,
            fontSize: '20px',
            color: '#3a2614',
            wordWrap: { width: GAME_WIDTH - 280 },
          }));
          cursorY += this.estimateTextHeight(trait.text, GAME_WIDTH - 280, 20) + 8;
        }
      });
      cursorY += 28;
    });
  }

  // -------------------- CARTE TAB (stub) --------------------

  private renderCarteTab(): void {
    this.contentContainer.add(this.scene.add.text(GAME_WIDTH / 2, 200, 'CARTE DE KORA', {
      fontFamily: FONTS.display,
      fontSize: '40px',
      color: '#3a2614',
    }).setOrigin(0.5));

    const slot = getActiveSlot();
    const visited = slot.progress?.['chapter.1.visited'] ? '✓' : '◌';
    const ch2 = slot.progress?.['chapter.2.visited'] ? '✓' : '◌';
    const ch3 = slot.progress?.['chapter.3.visited'] ? '✓' : '◌';
    const ch4 = slot.progress?.['chapter.4.visited'] ? '✓' : '◌';

    const map = `
${visited}  CRYO         (Module de réveil)
   │
${ch2}  SERRE        (Jardin xénobotanique)
   │
${ch3}  ATELIER      (Engineering bay)
   │
${ch4}  COUPOLE      (Observatoire principal)
   │
?  ARCHIVE      (zone secrète)
    `.trim();

    this.contentContainer.add(this.scene.add.text(GAME_WIDTH / 2, 400, map, {
      fontFamily: FONTS.mono,
      fontSize: '32px',
      color: '#3a2614',
      align: 'left',
    }).setOrigin(0.5));
  }

  // -------------------- AEOLIS TAB (stub) --------------------

  private renderAeolisTab(): void {
    this.contentContainer.add(this.scene.add.text(GAME_WIDTH / 2, 200, 'AEOLIS — DOSSIER', {
      fontFamily: FONTS.display,
      fontSize: '40px',
      color: '#3a2614',
    }).setOrigin(0.5));

    const slot = getActiveSlot();
    const collected = Object.values(slot.fragments ?? {}).flat();

    let cursorY = 300;
    const facts: string[] = ['Exoplanète tempérée du système Kepler-186.'];
    if (collected.includes('ch4.starmap_biosignal')) {
      facts.push('Émet un biosignal organique régulier (12s de période).');
    }
    if (collected.includes('ch4.truth_file')) {
      facts.push('Le biosignal réorganise la matière organique exposée.');
    }
    if (collected.includes('ch2.research_han')) {
      facts.push('La flore d\'Aeolis (notamment Lumira) réagit aux fréquences vocales humaines.');
    }

    this.contentContainer.add(this.scene.add.text(120, cursorY, 'FAITS OBSERVÉS', {
      fontFamily: FONTS.mono,
      fontSize: '24px',
      color: '#6b4f2c',
      fontStyle: 'bold',
    }));
    cursorY += 50;
    facts.forEach((f) => {
      this.contentContainer.add(this.scene.add.text(140, cursorY, `• ${f}`, {
        fontFamily: FONTS.body,
        fontSize: '22px',
        color: '#3a2614',
        wordWrap: { width: GAME_WIDTH - 280 },
      }));
      cursorY += this.estimateTextHeight(f, GAME_WIDTH - 280, 22) + 12;
    });
  }

  private estimateTextHeight(text: string, wrapWidth: number, fontSize: number): number {
    const charsPerLine = Math.floor(wrapWidth / (fontSize * 0.55));
    const lines = Math.ceil(text.length / charsPerLine);
    return lines * (fontSize + 6);
  }

  destroy(fromScene?: boolean): void {
    this.unsubAssertion();
    this.tileInstances.forEach((t) => t.destroy());
    this.slotInstances.forEach((s) => s.destroy());
    super.destroy(fromScene);
  }
}
