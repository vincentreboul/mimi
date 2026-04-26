import * as Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, BG_COLOR } from './config';
import { BootScene } from './scenes/BootScene';
import { PreloadScene } from './scenes/PreloadScene';
import { PlayerSetupScene } from './scenes/PlayerSetupScene';
import { MenuScene } from './scenes/MenuScene';
import { ChapterIntroScene } from './scenes/ChapterIntroScene';
import { Ch1Cryo } from './scenes/puzzles/Ch1Cryo';
import { Ch2Serre } from './scenes/puzzles/Ch2Serre';
import { Ch3Atelier } from './scenes/puzzles/Ch3Atelier';
import { Ch4Coupole } from './scenes/puzzles/Ch4Coupole';
import { EpilogueScene } from './scenes/EpilogueScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: BG_COLOR,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
  },
  fps: {
    target: 60,
    forceSetTimeOut: false,
  },
  render: {
    pixelArt: true,
    antialias: false,
    roundPixels: true,
  },
  input: {
    activePointers: 2,
  },
  dom: {
    createContainer: true,
  },
  scene: [
    BootScene,
    PreloadScene,
    PlayerSetupScene,
    MenuScene,
    ChapterIntroScene,
    Ch1Cryo,
    Ch2Serre,
    Ch3Atelier,
    Ch4Coupole,
    EpilogueScene,
  ],
};

const game = new Phaser.Game(config);

// Expose for dev/debug only
if (import.meta.env.DEV) {
  (window as any).game = game;
  (window as any).Phaser = Phaser;
}

// Pause/resume audio on tab visibility change (iOS Safari fix)
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    game.scene.scenes.forEach((s) => s.scene.isActive() && s.sound?.pauseAll());
  } else {
    game.scene.scenes.forEach((s) => s.scene.isActive() && s.sound?.resumeAll());
  }
});

export default game;
