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

    // Small "JOUER" badge in the bottom-right corner — visual hint that the card is tappable.
    // The whole card is the actual tap target (PrecisionButton above).
    const badgeX = cx + w / 2 - 130;
    const badgeY = cy + h / 2 - 50;
    this.add.rectangle(badgeX, badgeY, 220, 70, COLORS.sunAmber, 1)
      .setStrokeStyle(3, COLORS.cream).setDepth(20);
    this.add.text(badgeX, badgeY, '▶ JOUER', {
      fontFamily: FONTS.body,
      fontSize: '32px',
      color: COLORS.hex.charDeep,
      fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(21);
  }

  private drawPortraitIcon(x: number, y: number, profile: CharacterProfile): void {
    // Pixel art profession-icon panel (cleaner than a crude human portrait)
    const g = this.add.graphics();
    g.setDepth(15);
    // Outer frame (brass with darker inset)
    g.fillStyle(COLORS.brass, 1);
    g.fillRect(x - 110, y - 130, 220, 260);
    g.fillStyle(COLORS.brassDark, 1);
    g.fillRect(x - 102, y - 122, 204, 244);
    g.fillStyle(0x0d2230, 1);
    g.fillRect(x - 96, y - 116, 192, 232);

    if (profile.gender === 'f') {
      // ANNA — biologist: a glowing pixel-art plant in a pot
      // Pot
      g.fillStyle(COLORS.brass, 1);
      g.fillRect(x - 36, y + 50, 72, 36);
      g.fillStyle(COLORS.brassDark, 1);
      g.fillRect(x - 36, y + 50, 72, 8);
      // Stem (thick)
      g.fillStyle(0x2d6a4f, 1);
      g.fillRect(x - 6, y - 30, 12, 80);
      // Leaves (chunky)
      g.fillStyle(0x7fb069, 1);
      g.fillRect(x - 40, y - 10, 30, 14);
      g.fillRect(x + 10, y, 30, 14);
      g.fillRect(x - 30, y - 50, 24, 14);
      g.fillRect(x + 6, y - 60, 28, 14);
      // Glowing flower
      g.fillStyle(0xf4a261, 1);
      g.fillRect(x - 14, y - 90, 28, 14);
      g.fillRect(x - 8, y - 96, 16, 6);
      // Halo around flower
      g.fillStyle(0xf4a261, 0.35);
      g.fillRect(x - 28, y - 100, 56, 36);
    } else {
      // LÉO — engineer: a circuit board with LED
      // Board background
      g.fillStyle(0x2a4f3e, 1);
      g.fillRect(x - 80, y - 60, 160, 130);
      // Circuit traces
      g.fillStyle(COLORS.brass, 1);
      g.fillRect(x - 70, y - 30, 80, 6);
      g.fillRect(x + 10, y - 30, 6, 60);
      g.fillRect(x - 50, y + 10, 60, 6);
      g.fillRect(x - 70, y + 10, 6, 30);
      // Components
      g.fillStyle(0x7b2d26, 1);
      g.fillRect(x - 60, y - 40, 16, 16);
      g.fillStyle(0x1a3a40, 1);
      g.fillRect(x - 30, y - 40, 16, 16);
      g.fillStyle(0x2a2620, 1);
      g.fillRect(x - 30, y - 5, 24, 16);
      // Big amber LED
      g.fillStyle(COLORS.sunAmber, 1);
      g.fillRect(x + 30, y + 30, 28, 28);
      g.fillStyle(0xf4e9d8, 1);
      g.fillRect(x + 38, y + 38, 12, 12);
      // Glow
      g.fillStyle(COLORS.sunAmber, 0.4);
      g.fillRect(x + 22, y + 22, 44, 44);
      // Wrench in corner (top-left)
      g.fillStyle(COLORS.brass, 1);
      g.fillRect(x - 70, y - 100, 14, 36);
      g.fillRect(x - 76, y - 110, 26, 14);
    }

    // Name label below the icon
    const label = profile.gender === 'f' ? 'BIO' : 'ENG';
    this.add.rectangle(x, y + 110, 80, 20, COLORS.sunAmber, 1)
      .setStrokeStyle(2, COLORS.cream).setDepth(16);
    this.add.text(x, y + 110, label, {
      fontFamily: FONTS.mono,
      fontSize: '14px',
      color: COLORS.hex.charDeep,
      fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(17);
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
