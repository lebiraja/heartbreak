import Phaser from 'phaser';
import { GAME_CONFIG, COLORS, COCKPIT_CONFIG } from '@/config';
import { CockpitOverlay } from '@/ui/CockpitOverlay';
import { TypewriterText } from '@/ui/UIComponents';
import { OPENING_CINEMATIC_LINES } from '@/data/narrative';
import { audioManager } from '@/systems/AudioManager';

export class OpeningScene extends Phaser.Scene {
  private cockpit!: CockpitOverlay;
  private typewriter!: TypewriterText;
  private currentLineIndex: number = 0;
  private lines: string[] = OPENING_CINEMATIC_LINES;
  private shipGraphics?: Phaser.GameObjects.Graphics;
  private skipText?: Phaser.GameObjects.Text;
  private bootPhase: boolean = true;
  private bootLineDelay: number = 600;

  constructor() {
    super({ key: 'OpeningScene' });
  }

  create(): void {
    const { width, height } = GAME_CONFIG;

    // Black background
    this.cameras.main.setBackgroundColor(0x000000);

    // Cockpit overlay
    this.cockpit = new CockpitOverlay(this);
    const area = this.cockpit.getPlayableArea();

    // Boot-up flicker effect
    const flicker = this.add.rectangle(width / 2, height / 2, width, height, 0x001111, 0);
    this.tweens.add({
      targets: flicker,
      alpha: { from: 0, to: 0.15 },
      duration: 200,
      yoyo: true,
      repeat: 3,
      onComplete: () => flicker.destroy(),
    });

    // Typewriter for boot/narrative text
    this.typewriter = new TypewriterText(
      this,
      area.x + 40,
      area.y + 40,
      {
        fontSize: '18px',
        fontFamily: 'monospace',
        color: '#00ff88',
        lineSpacing: 8,
      },
      'normal',
      false,
      area.width - 80
    );
    this.typewriter.setDepth(950);

    // Skip button
    this.skipText = this.add.text(width - COCKPIT_CONFIG.sideWidth - 20, height - COCKPIT_CONFIG.bottomHeight - 20, '[ SKIP ]', {
      fontSize: '14px',
      fontFamily: 'monospace',
      color: '#555566',
    }).setOrigin(1, 1).setDepth(950).setInteractive({ useHandCursor: true });

    this.skipText.on('pointerover', () => this.skipText?.setColor('#00ffff'));
    this.skipText.on('pointerout', () => this.skipText?.setColor('#555566'));
    this.skipText.on('pointerdown', () => this.skipToEnd());

    // Also skip on any key
    this.input.keyboard?.on('keydown', () => {
      if (this.currentLineIndex >= this.lines.length) return;
      if (this.typewriter.isComplete()) {
        this.showNextLine();
      } else {
        this.typewriter.skip();
      }
    });

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      // Ignore if clicking skip button
      if (pointer.y > GAME_CONFIG.height - COCKPIT_CONFIG.bottomHeight - 40) return;
      if (this.currentLineIndex >= this.lines.length) return;
      if (this.typewriter.isComplete()) {
        this.showNextLine();
      } else {
        this.typewriter.skip();
      }
    });

    // Start showing lines
    this.showNextLine();
  }

  private showNextLine(): void {
    if (this.currentLineIndex >= this.lines.length) {
      this.finishOpening();
      return;
    }

    const line = this.lines[this.currentLineIndex];
    this.currentLineIndex++;

    // Detect transition from boot text to narrative
    if (line === '' && this.bootPhase) {
      this.bootPhase = false;
      // Show ship silhouette
      this.showShipSilhouette();
      // Change text style for narrative
      this.typewriter.destroy();
      const area = this.cockpit.getPlayableArea();
      this.typewriter = new TypewriterText(
        this,
        area.x + area.width / 2 + 60,
        area.y + 60,
        {
          fontSize: '20px',
          fontFamily: 'Georgia, serif',
          color: '#ccddee',
          fontStyle: 'italic',
          lineSpacing: 10,
        },
        'normal',
        false,
        area.width / 2 - 80
      );
      this.typewriter.setDepth(950);
      // Skip the empty line, go to next
      this.showNextLine();
      return;
    }

    this.typewriter.clear();
    this.typewriter.start(line);
    this.typewriter.onComplete(() => {
      // Auto-advance after delay
      const delay = this.bootPhase ? this.bootLineDelay : 2000;
      this.time.delayedCall(delay, () => {
        this.showNextLine();
      });
    });
  }

  private showShipSilhouette(): void {
    const area = this.cockpit.getPlayableArea();
    const cx = area.x + area.width * 0.22;
    const cy = area.y + area.height * 0.5;

    this.shipGraphics = this.add.graphics();
    this.shipGraphics.setDepth(950);
    this.shipGraphics.setAlpha(0);

    // Draw a larger, more detailed ship silhouette
    const g = this.shipGraphics;
    const scale = 3;

    // Main hull
    g.lineStyle(2, 0x00ccff, 0.6);
    g.beginPath();
    g.moveTo(cx, cy - 30 * scale);          // Nose
    g.lineTo(cx - 8 * scale, cy - 10 * scale);
    g.lineTo(cx - 15 * scale, cy + 5 * scale);  // Left wing
    g.lineTo(cx - 20 * scale, cy + 15 * scale);
    g.lineTo(cx - 8 * scale, cy + 10 * scale);
    g.lineTo(cx - 5 * scale, cy + 20 * scale);  // Left engine
    g.lineTo(cx, cy + 15 * scale);
    g.lineTo(cx + 5 * scale, cy + 20 * scale);  // Right engine
    g.lineTo(cx + 8 * scale, cy + 10 * scale);
    g.lineTo(cx + 20 * scale, cy + 15 * scale);
    g.lineTo(cx + 15 * scale, cy + 5 * scale);  // Right wing
    g.lineTo(cx + 8 * scale, cy - 10 * scale);
    g.closePath();
    g.strokePath();

    // Engine glow
    g.fillStyle(0x0088ff, 0.2);
    g.fillCircle(cx - 5 * scale, cy + 22 * scale, 4 * scale);
    g.fillCircle(cx + 5 * scale, cy + 22 * scale, 4 * scale);

    // Cockpit window
    g.lineStyle(1, 0x00ffff, 0.4);
    g.strokeCircle(cx, cy - 15 * scale, 4 * scale);

    // Fade in
    this.tweens.add({
      targets: this.shipGraphics,
      alpha: 1,
      duration: 2000,
      ease: 'Power2',
    });
  }

  private skipToEnd(): void {
    this.finishOpening();
  }

  private finishOpening(): void {
    this.cameras.main.fadeOut(800, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('LevelSelectScene');
    });
  }

  shutdown(): void {
    this.cockpit?.destroy();
  }
}
