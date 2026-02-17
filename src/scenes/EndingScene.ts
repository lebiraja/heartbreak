import Phaser from 'phaser';
import { GAME_CONFIG, COCKPIT_CONFIG } from '@/config';
import { CockpitOverlay } from '@/ui/CockpitOverlay';
import { TypewriterText } from '@/ui/UIComponents';
import { narrativeManager } from '@/systems/NarrativeManager';
import { audioManager } from '@/systems/AudioManager';

export class EndingScene extends Phaser.Scene {
  private cockpit!: CockpitOverlay;
  private typewriter!: TypewriterText;
  private lines: string[] = [];
  private currentLineIndex: number = 0;
  private bgGraphics!: Phaser.GameObjects.Graphics;
  private dissolveParticles: Phaser.GameObjects.Graphics[] = [];
  private brightnessLevel: number = 0;

  constructor() {
    super({ key: 'EndingScene' });
  }

  create(): void {
    const { width, height } = GAME_CONFIG;

    this.lines = narrativeManager.getEndingSequence();

    // Dark background that will gradually brighten
    this.bgGraphics = this.add.graphics();
    this.drawBackground(0);

    // Cockpit overlay
    this.cockpit = new CockpitOverlay(this);
    const area = this.cockpit.getPlayableArea();

    // Dream dissolve particles
    this.createDissolveParticles(area);

    // Typewriter text centered in playable area
    this.typewriter = new TypewriterText(
      this,
      area.x + area.width / 2,
      area.y + area.height * 0.35,
      {
        fontSize: '22px',
        fontFamily: 'Georgia, serif',
        color: '#ffffff',
        fontStyle: 'italic',
        align: 'center',
        lineSpacing: 10,
      },
      'slow',
      false,
      area.width * 0.7
    );
    this.typewriter.setDepth(950);
    this.typewriter.setX(this.typewriter.x - (area.width * 0.7) / 2); // Center the container

    // Skip button
    const skipText = this.add.text(area.x + area.width - 20, area.y + area.height - 20, '[ SKIP ]', {
      fontSize: '12px',
      fontFamily: 'monospace',
      color: '#555566',
    }).setOrigin(1, 1).setDepth(950).setInteractive({ useHandCursor: true });

    skipText.on('pointerover', () => skipText.setColor('#00ffff'));
    skipText.on('pointerout', () => skipText.setColor('#555566'));
    skipText.on('pointerdown', () => this.finishEnding());

    // Input
    this.input.on('pointerdown', () => this.advance());
    this.input.keyboard?.on('keydown-SPACE', () => this.advance());

    // Play victory music
    audioManager.playMusic('victory_music');

    // Start showing lines
    this.showNextLine();

    // Gradually brighten background
    this.time.addEvent({
      delay: 100,
      callback: () => {
        this.brightnessLevel = Math.min(1, this.brightnessLevel + 0.002);
        this.drawBackground(this.brightnessLevel);
      },
      loop: true,
    });

    // Save narrative state
    narrativeManager.save();
  }

  private advance(): void {
    if (!this.typewriter.isComplete()) {
      this.typewriter.skip();
    } else {
      this.showNextLine();
    }
  }

  private showNextLine(): void {
    if (this.currentLineIndex >= this.lines.length) {
      this.showCredits();
      return;
    }

    const line = this.lines[this.currentLineIndex];
    this.currentLineIndex++;

    this.typewriter.clear();
    this.typewriter.start(line);

    this.typewriter.onComplete(() => {
      this.time.delayedCall(2500, () => {
        if (this.typewriter.isComplete() && this.currentLineIndex <= this.lines.length) {
          this.showNextLine();
        }
      });
    });
  }

  private drawBackground(brightness: number): void {
    const { width, height } = GAME_CONFIG;
    this.bgGraphics.clear();

    const r = Math.floor(10 + brightness * 40);
    const g = Math.floor(10 + brightness * 45);
    const b = Math.floor(20 + brightness * 55);
    const color = (r << 16) | (g << 8) | b;

    this.bgGraphics.fillStyle(color, 1);
    this.bgGraphics.fillRect(0, 0, width, height);
  }

  private createDissolveParticles(area: Phaser.Geom.Rectangle): void {
    for (let i = 0; i < 30; i++) {
      const p = this.add.graphics();
      const x = area.x + Math.random() * area.width;
      const y = area.y + Math.random() * area.height;

      p.fillStyle(0xffffff, 0.05 + Math.random() * 0.1);
      p.fillCircle(0, 0, 2 + Math.random() * 4);
      p.setPosition(x, y);
      p.setDepth(10);

      // Float outward and fade
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.1 + Math.random() * 0.3;
      const targetX = x + Math.cos(angle) * 200;
      const targetY = y + Math.sin(angle) * 200;

      this.tweens.add({
        targets: p,
        x: targetX,
        y: targetY,
        alpha: { from: 0.5, to: 0 },
        duration: 8000 + Math.random() * 6000,
        repeat: -1,
        onRepeat: () => {
          p.setPosition(
            area.x + Math.random() * area.width,
            area.y + Math.random() * area.height
          );
        },
      });

      this.dissolveParticles.push(p);
    }
  }

  private showCredits(): void {
    const area = this.cockpit.getPlayableArea();
    const cx = area.x + area.width / 2;
    const cy = area.y + area.height * 0.5;

    this.typewriter.destroy();

    // Title
    const title = this.add.text(cx, cy - 40, 'STELLAR RESOLVE', {
      fontSize: '36px',
      fontFamily: 'monospace',
      color: '#00ffcc',
      fontStyle: 'bold',
    }).setOrigin(0.5).setAlpha(0).setDepth(950);

    // Subtitle
    const subtitle = this.add.text(cx, cy + 10, 'A Journey Home Through the Stars', {
      fontSize: '18px',
      fontFamily: 'Georgia, serif',
      color: '#aabbcc',
      fontStyle: 'italic',
    }).setOrigin(0.5).setAlpha(0).setDepth(950);

    // Emotional path summary
    const path = narrativeManager.getEmotionalPath();
    const pathLabel = path === 'compassionate' ? 'The Compassionate Pilot'
      : path === 'aggressive' ? 'The Resolute Pilot'
      : 'The Balanced Pilot';

    const pathText = this.add.text(cx, cy + 50, pathLabel, {
      fontSize: '16px',
      fontFamily: 'monospace',
      color: '#888899',
    }).setOrigin(0.5).setAlpha(0).setDepth(950);

    // Fade in credits
    this.tweens.add({ targets: title, alpha: 1, duration: 2000, delay: 500 });
    this.tweens.add({ targets: subtitle, alpha: 1, duration: 2000, delay: 1500 });
    this.tweens.add({ targets: pathText, alpha: 1, duration: 2000, delay: 2500 });

    // Return to title after delay
    this.time.delayedCall(8000, () => this.finishEnding());
  }

  private finishEnding(): void {
    this.cameras.main.fadeOut(1500, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      audioManager.stopMusic();
      this.scene.start('TitleScene');
    });
  }

  shutdown(): void {
    this.cockpit?.destroy();
    this.dissolveParticles.forEach(p => p.destroy());
  }
}
