import Phaser from 'phaser';
import { GAME_CONFIG, COCKPIT_CONFIG } from '@/config';
import { CockpitOverlay } from '@/ui/CockpitOverlay';
import { TypewriterText } from '@/ui/UIComponents';
import { narrativeManager } from '@/systems/NarrativeManager';
import { ENVIRONMENT_CONFIGS } from '@/data/environments';

export class VignetteScene extends Phaser.Scene {
  private cockpit!: CockpitOverlay;
  private typewriter!: TypewriterText;
  private level: number = 1;
  private lines: string[] = [];
  private currentLineIndex: number = 0;
  private shipGraphics?: Phaser.GameObjects.Graphics;
  private particles: Phaser.GameObjects.Graphics[] = [];

  constructor() {
    super({ key: 'VignetteScene' });
  }

  init(data: { level: number }): void {
    this.level = data.level ?? 1;
  }

  create(): void {
    const { width, height } = GAME_CONFIG;
    const vignette = narrativeManager.getVignette(this.level);
    this.lines = vignette?.lines ?? ['The journey continues...'];

    // Background gradient matching level theme
    const envConfig = ENVIRONMENT_CONFIGS[this.level];
    const { top, bottom } = envConfig?.backgroundGradient ?? { top: 0x0a0a1a, bottom: 0x0d0b18 };

    const bg = this.add.graphics();
    bg.fillGradientStyle(top, top, bottom, bottom, 1);
    bg.fillRect(0, 0, width, height);

    // Ambient particles
    this.createAmbientParticles(envConfig?.primaryColor ?? 0x888888);

    // Cockpit overlay
    this.cockpit = new CockpitOverlay(this);
    const area = this.cockpit.getPlayableArea();

    // Ship silhouette on left
    this.drawShipSilhouette(area.x + area.width * 0.18, area.y + area.height * 0.5, envConfig?.primaryColor ?? 0x00ccff);

    // Level title
    const titleY = area.y + 30;
    this.add.text(area.x + area.width * 0.42, titleY, `LEVEL ${this.level}`, {
      fontSize: '14px',
      fontFamily: 'monospace',
      color: '#888899',
    }).setDepth(950);

    const levelName = envConfig?.name ?? '';
    this.add.text(area.x + area.width * 0.42, titleY + 22, levelName, {
      fontSize: '22px',
      fontFamily: 'Georgia, serif',
      color: '#00ffcc',
      fontStyle: 'italic',
    }).setDepth(950);

    // Typewriter text on right side
    this.typewriter = new TypewriterText(
      this,
      area.x + area.width * 0.42,
      area.y + 90,
      {
        fontSize: '18px',
        fontFamily: 'Georgia, serif',
        color: '#ccddee',
        fontStyle: 'italic',
        lineSpacing: 8,
      },
      'normal',
      false,
      area.width * 0.52
    );
    this.typewriter.setDepth(950);

    // Skip hint
    this.add.text(area.x + area.width - 20, area.y + area.height - 20, 'CLICK TO ADVANCE', {
      fontSize: '12px',
      fontFamily: 'monospace',
      color: '#555566',
    }).setOrigin(1, 1).setDepth(950);

    // Input: click/key to advance
    this.input.on('pointerdown', () => this.advance());
    this.input.keyboard?.on('keydown-SPACE', () => this.advance());
    this.input.keyboard?.on('keydown-ENTER', () => this.advance());

    // Start first line
    this.showNextLine();

    // Mark vignette as seen
    narrativeManager.markVignetteSeen(this.level);
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
      this.transitionToGame();
      return;
    }

    const line = this.lines[this.currentLineIndex];
    this.currentLineIndex++;

    this.typewriter.clear();
    this.typewriter.start(line);

    // Auto-advance after delay if not interacted
    this.typewriter.onComplete(() => {
      this.time.delayedCall(3000, () => {
        if (this.currentLineIndex <= this.lines.length && this.typewriter.isComplete()) {
          this.showNextLine();
        }
      });
    });
  }

  private drawShipSilhouette(cx: number, cy: number, color: number): void {
    this.shipGraphics = this.add.graphics();
    this.shipGraphics.setDepth(950);

    const g = this.shipGraphics;
    const s = 2.5;

    // Ship outline
    g.lineStyle(2, color, 0.5);
    g.beginPath();
    g.moveTo(cx, cy - 30 * s);
    g.lineTo(cx - 8 * s, cy - 10 * s);
    g.lineTo(cx - 15 * s, cy + 5 * s);
    g.lineTo(cx - 20 * s, cy + 15 * s);
    g.lineTo(cx - 8 * s, cy + 10 * s);
    g.lineTo(cx - 5 * s, cy + 20 * s);
    g.lineTo(cx, cy + 15 * s);
    g.lineTo(cx + 5 * s, cy + 20 * s);
    g.lineTo(cx + 8 * s, cy + 10 * s);
    g.lineTo(cx + 20 * s, cy + 15 * s);
    g.lineTo(cx + 15 * s, cy + 5 * s);
    g.lineTo(cx + 8 * s, cy - 10 * s);
    g.closePath();
    g.strokePath();

    // Cockpit
    g.lineStyle(1, color, 0.3);
    g.strokeCircle(cx, cy - 15 * s, 4 * s);

    // Engine glow
    g.fillStyle(color, 0.15);
    g.fillCircle(cx - 5 * s, cy + 22 * s, 5 * s);
    g.fillCircle(cx + 5 * s, cy + 22 * s, 5 * s);

    // Gentle float animation
    this.tweens.add({
      targets: this.shipGraphics,
      y: this.shipGraphics.y - 8,
      duration: 3000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  private createAmbientParticles(color: number): void {
    const area = this.cockpit?.getPlayableArea() ?? new Phaser.Geom.Rectangle(80, 80, 1120, 580);

    for (let i = 0; i < 15; i++) {
      const p = this.add.graphics();
      const x = area.x + Math.random() * area.width;
      const y = area.y + Math.random() * area.height;
      const size = 1 + Math.random() * 2;

      p.fillStyle(color, 0.15 + Math.random() * 0.15);
      p.fillCircle(x, y, size);
      p.setDepth(5);

      this.tweens.add({
        targets: p,
        alpha: { from: 0.5, to: 0.1 },
        y: y - 20 - Math.random() * 30,
        duration: 4000 + Math.random() * 3000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });

      this.particles.push(p);
    }
  }

  private transitionToGame(): void {
    this.cameras.main.fadeOut(600, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('GameScene', { level: this.level });
    });
  }

  shutdown(): void {
    this.cockpit?.destroy();
    this.particles.forEach(p => p.destroy());
  }
}
