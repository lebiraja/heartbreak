import Phaser from 'phaser';
import { GAME_CONFIG, COLORS } from '@/config';
import { UIButton, Panel, TypewriterText, CockpitPanel } from '@/ui/UIComponents';
import { CockpitOverlay } from '@/ui/CockpitOverlay';
import { audioManager } from '@/systems/AudioManager';
import { narrativeManager } from '@/systems/NarrativeManager';

export class GameOverScene extends Phaser.Scene {
  private cockpit?: CockpitOverlay;

  constructor() {
    super({ key: 'GameOverScene' });
  }

  create(data: { score: number; level: number; victory: boolean }): void {
    this.cameras.main.setBackgroundColor(COLORS.background);

    // Cockpit overlay
    this.cockpit = new CockpitOverlay(this);
    const area = this.cockpit.getPlayableArea();

    const cx = area.x + area.width / 2;
    const baseY = area.y + 30;

    // Title
    const titleText = data.victory ? 'LEVEL COMPLETE' : 'MISSION FAILED';
    const title = this.add.text(cx, baseY, titleText, {
      fontSize: '32px',
      fontFamily: 'monospace',
      color: data.victory ? '#00ffcc' : '#ff4444',
      fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(950);

    // Score
    this.add.text(cx, baseY + 50, `SCORE: ${data.score.toLocaleString()}`, {
      fontSize: '24px',
      fontFamily: 'monospace',
      color: '#00ffff',
      fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(950);

    // Level
    this.add.text(cx, baseY + 85, `LEVEL: ${data.level}`, {
      fontSize: '18px',
      fontFamily: 'monospace',
      color: '#ffffff',
    }).setOrigin(0.5).setDepth(950);

    if (data.victory) {
      // Show reflection via typewriter
      const reflection = narrativeManager.getReflection(data.level);
      narrativeManager.markReflectionSeen(data.level);
      narrativeManager.save();

      if (reflection) {
        const typewriter = new TypewriterText(
          this,
          cx - area.width * 0.35,
          baseY + 130,
          {
            fontSize: '17px',
            fontFamily: 'Georgia, serif',
            color: '#ccddee',
            fontStyle: 'italic',
            lineSpacing: 6,
          },
          'normal',
          false,
          area.width * 0.7
        );
        typewriter.setDepth(950);
        typewriter.start(reflection);

        // Show buttons after reflection completes (or after timeout)
        const showButtons = () => this.showVictoryButtons(data, cx, baseY + 260);
        typewriter.onComplete(() => {
          this.time.delayedCall(1500, showButtons);
        });
        // Fallback timeout
        this.time.delayedCall(8000, showButtons);
      } else {
        this.showVictoryButtons(data, cx, baseY + 130);
      }

      audioManager.stopMusic();
      audioManager.playMusic('victory_music', true);
    } else {
      // Defeat - show buttons immediately
      const resultText = this.add.text(cx, baseY + 130, 'Lost among the stars, but not forgotten.', {
        fontSize: '17px',
        fontFamily: 'Georgia, serif',
        color: '#999999',
        fontStyle: 'italic',
        align: 'center',
        wordWrap: { width: area.width * 0.7 },
      }).setOrigin(0.5).setDepth(950);

      new UIButton(this, cx, baseY + 200, 'RETRY', () => {
        audioManager.playSfx('ui_select', 0.5);
        this.scene.start('VignetteScene', { level: data.level });
      });

      new UIButton(this, cx, baseY + 265, 'LEVEL SELECT', () => {
        audioManager.playSfx('ui_back', 0.5);
        this.scene.start('LevelSelectScene');
      });

      new UIButton(this, cx, baseY + 330, 'MAIN MENU', () => {
        audioManager.playSfx('ui_back', 0.5);
        this.scene.start('TitleScene');
      });
    }
  }

  private buttonsShown = false;

  private showVictoryButtons(data: { score: number; level: number; victory: boolean }, cx: number, y: number): void {
    if (this.buttonsShown) return;
    this.buttonsShown = true;

    // For Level 10 victory, go to EndingScene
    if (data.level >= 10) {
      new UIButton(this, cx, y, 'CONTINUE TO ENDING', () => {
        audioManager.stopMusic();
        this.scene.start('EndingScene');
      });
    } else {
      new UIButton(this, cx, y, 'NEXT LEVEL', () => {
        audioManager.playSfx('ui_select', 0.5);
        this.scene.start('VignetteScene', { level: data.level + 1 });
      });
    }

    new UIButton(this, cx, y + 65, 'LEVEL SELECT', () => {
      audioManager.playSfx('ui_back', 0.5);
      this.scene.start('LevelSelectScene');
    });

    new UIButton(this, cx, y + 130, 'MAIN MENU', () => {
      audioManager.playSfx('ui_back', 0.5);
      this.scene.start('TitleScene');
    });
  }

  shutdown(): void {
    this.buttonsShown = false;
    this.cockpit?.destroy();
  }
}
