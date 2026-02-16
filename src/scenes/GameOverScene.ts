import Phaser from 'phaser';
import { GAME_CONFIG, COLORS } from '@/config';
import { UIButton, Panel } from '@/ui/UIComponents';
import { audioManager } from '@/systems/AudioManager';

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' });
  }

  create(data: { score: number; level: number; victory: boolean }): void {
    this.cameras.main.setBackgroundColor(COLORS.background);

    const panel = new Panel(
      this,
      GAME_CONFIG.width / 2 - 300,
      GAME_CONFIG.height / 2 - 250,
      600,
      500,
      data.victory ? 'LEVEL COMPLETE' : 'MISSION FAILED'
    );

    const resultText = this.add.text(
      GAME_CONFIG.width / 2,
      GAME_CONFIG.height / 2 - 150,
      data.victory 
        ? 'You have successfully navigated through the void.'
        : 'Lost among the stars, but not forgotten.',
      {
        fontSize: '18px',
        fontFamily: 'serif',
        color: '#ffffff',
        fontStyle: 'italic',
        align: 'center',
        wordWrap: { width: 500 }
      }
    ).setOrigin(0.5);

    const scoreText = this.add.text(
      GAME_CONFIG.width / 2,
      GAME_CONFIG.height / 2 - 70,
      `SCORE: ${data.score.toLocaleString()}`,
      {
        fontSize: '32px',
        fontFamily: 'monospace',
        color: '#00ffff',
        fontStyle: 'bold'
      }
    ).setOrigin(0.5);

    const levelText = this.add.text(
      GAME_CONFIG.width / 2,
      GAME_CONFIG.height / 2 - 20,
      `LEVEL: ${data.level}`,
      {
        fontSize: '24px',
        fontFamily: 'monospace',
        color: '#ffffff'
      }
    ).setOrigin(0.5);

    if (data.victory) {
      const continueButton = new UIButton(
        this,
        GAME_CONFIG.width / 2,
        GAME_CONFIG.height / 2 + 60,
        data.level < 10 ? 'NEXT LEVEL' : 'JOURNEY COMPLETE',
        () => {
          audioManager.playSfx('ui_select', 0.5);
          if (data.level < 10) {
            this.scene.start('GameScene', { level: data.level + 1 });
          } else {
            this.scene.start('TitleScene');
          }
        }
      );
    } else {
      const retryButton = new UIButton(
        this,
        GAME_CONFIG.width / 2,
        GAME_CONFIG.height / 2 + 60,
        'RETRY',
        () => {
          audioManager.playSfx('ui_select', 0.5);
          this.scene.start('GameScene', { level: data.level });
        }
      );
    }

    const levelSelectButton = new UIButton(
      this,
      GAME_CONFIG.width / 2,
      GAME_CONFIG.height / 2 + 130,
      'LEVEL SELECT',
      () => {
        audioManager.playSfx('ui_back', 0.5);
        this.scene.start('LevelSelectScene');
      }
    );

    const menuButton = new UIButton(
      this,
      GAME_CONFIG.width / 2,
      GAME_CONFIG.height / 2 + 200,
      'MAIN MENU',
      () => {
        audioManager.playSfx('ui_back', 0.5);
        this.scene.start('TitleScene');
      }
    );

    if (data.victory) {
      audioManager.stopMusic();
      audioManager.playMusic('victory_music', true);
    }
  }
}
