import '@fontsource/vt323';
import '@fontsource/press-start-2p';
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
import { Ch5Archive } from './scenes/Ch5Archive';
import { EndingScene } from './scenes/EndingScene';
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
    Ch5Archive,
    EndingScene,
    EpilogueScene,
  ],
};

const game = new Phaser.Game(config);

// Expose for dev/debug only
if (import.meta.env.DEV) {
  (window as any).game = game;
  (window as any).Phaser = Phaser;
}

// Native audio unlock on first user interaction (more reliable than Phaser-only)
import { unlockAudio } from './systems/audio';
const unlockOnce = () => {
  unlockAudio();
  document.removeEventListener('touchstart', unlockOnce);
  document.removeEventListener('touchend', unlockOnce);
  document.removeEventListener('mousedown', unlockOnce);
  document.removeEventListener('keydown', unlockOnce);
};
document.addEventListener('touchstart', unlockOnce, { once: false });
document.addEventListener('touchend', unlockOnce, { once: false });
document.addEventListener('mousedown', unlockOnce, { once: false });
document.addEventListener('keydown', unlockOnce, { once: false });

// Pause/resume audio AND scenes on tab visibility change
// (iOS Safari fix + battery savings — no useless ticks while backgrounded)
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    game.scene.scenes.forEach((s) => {
      if (s.scene.isActive()) {
        s.sound?.pauseAll();
        s.scene.pause();
      }
    });
  } else {
    game.scene.scenes.forEach((s) => {
      if (s.scene.isPaused()) {
        s.sound?.resumeAll();
        s.scene.resume();
      }
    });
  }
});

export default game;
