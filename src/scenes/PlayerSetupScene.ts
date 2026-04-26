import * as Phaser from 'phaser';
import { COLORS, FONTS, GAME_WIDTH, GAME_HEIGHT } from '../config';
import { setPlayer, type AgeBracket, type Gender } from '../systems/save';
import { playSfx } from '../systems/audio';
import { PrecisionButton } from '../objects/PrecisionButton';

interface CharacterProfile {
  id: string;
  name: string;
  gender: Gender;
  pronoun: string;
  role: string;
  bio: string;
}

const PROFILES: CharacterProfile[] = [
  {
    id: 'anna',
    name: 'ANNA',
    gender: 'f',
    pronoun: 'elle',
    role: 'Biologiste',
    bio: 'Spécialiste des plantes orbitales.\nA grandi en lisant les travaux du\nDr. Nórin.',
  },
  {
    id: 'leo',
    name: 'LÉO',
    gender: 'm',
    pronoun: 'il',
    role: 'Ingénieur de bord',
    bio: 'Passionné de mécanique sci-fi.\nA candidaté à 4 missions avant\nd\'être enfin retenu.',
  },
];

export class PlayerSetupScene extends Phaser.Scene {
  constructor() {
    super('PlayerSetupScene');
  }

  create(): void {
    this.cameras.main.fadeIn(400, 10, 18, 24);
    this.drawBackground();
    this.drawCards();
  }

  private drawBackground(): void {
    const { width, height } = this.scale.gameSize;
    const g = this.add.graphics();
    g.setDepth(-1000);
    g.fillStyle(0x0a1218, 1);
    g.fillRect(0, 0, width, height);

    // Stars
    g.fillStyle(0xf4e9d8, 0.9);
    for (let i = 0; i < 80; i++) {
      g.fillRect(Math.floor(Math.random() * width / 8) * 8, Math.floor(Math.random() * height / 8) * 8, 4, 4);
    }
    g.fillStyle(0xa8dadc, 1);
    for (let i = 0; i < 25; i++) {
      g.fillRect(Math.floor(Math.random() * width / 8) * 8, Math.floor(Math.random() * height / 8) * 8, 6, 6);
    }

    // Distant planet
    g.fillStyle(0x7fb069, 0.18);
    g.fillCircle(width / 2, 350, 220);
    g.fillStyle(0xa8dadc, 0.15);
    g.fillCircle(width / 2, 350, 280);

    // Title
    this.add.text(width / 2, 180, 'KORA', {
      fontFamily: FONTS.display,
      fontSize: '120px',
      color: COLORS.hex.cream,
    }).setOrigin(0.5);

    this.add.text(width / 2, 320, "L'ÉVEIL ORBITAL", {
      fontFamily: FONTS.mono,
      fontSize: '34px',
      color: COLORS.hex.brass,
    }).setOrigin(0.5);

    this.add.text(width / 2, 460, 'CHOISIS TON PERSONNAGE', {
      fontFamily: FONTS.body,
      fontSize: '46px',
      color: COLORS.hex.cream,
      fontStyle: 'bold',
    }).setOrigin(0.5);
  }

  private drawCards(): void {
    const { width } = this.scale.gameSize;
    const cardW = 880;
    const cardH = 460;
    const gap = 60;

    PROFILES.forEach((profile, i) => {
      const cy = 660 + i * (cardH + gap);
      const cx = width / 2;
      this.drawProfileCard(cx, cy, cardW, cardH, profile);
    });
  }

  private drawProfileCard(cx: number, cy: number, w: number, h: number, profile: CharacterProfile): void {
    // Background card
    const card = new PrecisionButton(this, {
      x: cx, y: cy,
      width: w, height: h,
      label: '',
      onTap: () => this.choose(profile),
    } as any);

    // Build the card content as overlays positioned in scene coords
    // Portrait icon (left side)
    const portraitX = cx - w / 2 + 140;
    const portraitY = cy;
    this.drawPortraitIcon(portraitX, portraitY, profile);

    // Name (right of portrait)
    const textX = portraitX + 160;
    this.add.text(textX, cy - 150, profile.name, {
      fontFamily: FONTS.display,
      fontSize: '64px',
      color: COLORS.hex.cream,
    }).setOrigin(0, 0.5).setDepth(20);

    // Role
    this.add.text(textX, cy - 70, profile.role.toUpperCase(), {
      fontFamily: FONTS.mono,
      fontSize: '30px',
      color: COLORS.hex.sunAmber,
    }).setOrigin(0, 0.5).setDepth(20);

    // Bio
    this.add.text(textX, cy + 40, profile.bio, {
      fontFamily: FONTS.body,
      fontSize: '28px',
      color: COLORS.hex.cream,
      lineSpacing: 6,
    }).setOrigin(0, 0.5).setDepth(20);

    // "JOUER" badge bottom-center of card — BIG and tappable
    this.add.rectangle(cx, cy + h / 2 - 60, 360, 96, COLORS.sunAmber, 1)
      .setStrokeStyle(4, COLORS.cream).setDepth(20);
    this.add.text(cx, cy + h / 2 - 60, '▶  JOUER', {
      fontFamily: FONTS.body,
      fontSize: '48px',
      color: COLORS.hex.charDeep,
      fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(21);
  }

  private drawPortraitIcon(x: number, y: number, profile: CharacterProfile): void {
    // Pixel art portrait — chunky square frame with stylized icon
    const g = this.add.graphics();
    g.setDepth(15);
    // Frame
    g.fillStyle(COLORS.brass, 1);
    g.fillRect(x - 110, y - 130, 220, 260);
    g.fillStyle(0x1a3a40, 1);
    g.fillRect(x - 100, y - 120, 200, 240);

    // Stylized character silhouette
    const skin = profile.gender === 'f' ? 0xf4d5a0 : 0xe8b893;
    const hair = profile.gender === 'f' ? 0x6b4226 : 0x3a2818;
    const suit = profile.gender === 'f' ? 0xa8dadc : 0x88ad8a;

    // Body (suit)
    g.fillStyle(suit, 1);
    g.fillRect(x - 60, y + 10, 120, 100);
    // Neck
    g.fillStyle(skin, 1);
    g.fillRect(x - 22, y - 14, 44, 30);
    // Head
    g.fillStyle(skin, 1);
    g.fillRect(x - 50, y - 90, 100, 90);
    // Hair
    g.fillStyle(hair, 1);
    g.fillRect(x - 56, y - 100, 112, 28);
    if (profile.gender === 'f') {
      g.fillRect(x - 60, y - 80, 14, 60);
      g.fillRect(x + 46, y - 80, 14, 60);
    }
    // Eyes
    g.fillStyle(0x1a1a1a, 1);
    g.fillRect(x - 24, y - 50, 8, 8);
    g.fillRect(x + 16, y - 50, 8, 8);
    // KORA badge on chest
    g.fillStyle(COLORS.sunAmber, 1);
    g.fillRect(x - 14, y + 30, 28, 12);
  }

  private choose(profile: CharacterProfile): void {
    playSfx('success');
    setPlayer(profile.name.charAt(0) + profile.name.slice(1).toLowerCase(), 'young', profile.gender);
    this.cameras.main.fadeOut(400, 10, 18, 24);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('MenuScene');
    });
  }
}
