import Phaser from 'phaser';
import { GAME_CONFIG, COLORS } from '@/config';
import { UIButton, CockpitPanel } from '@/ui/UIComponents';
import { audioManager } from '@/systems/AudioManager';

export class PauseScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PauseScene' });
  }

  create(): void {
    this.cameras.main.setBackgroundColor(0x000000);
    this.cameras.main.setAlpha(0.7);

    const panel = new CockpitPanel(
      this,
      GAME_CONFIG.width / 2 - 200,
      GAME_CONFIG.height / 2 - 160,
      400,
      320,
      'PAUSED'
    );

    const resumeButton = new UIButton(
      this,
      GAME_CONFIG.width / 2,
      GAME_CONFIG.height / 2,
      'RESUME',
      () => {
        audioManager.playSfx('ui_select', 0.5);
        this.scene.stop();
        const gameScene = this.scene.get('GameScene') as any;
        gameScene.resumeGame();
      }
    );

    const restartButton = new UIButton(
      this,
      GAME_CONFIG.width / 2,
      GAME_CONFIG.height / 2 + 70,
      'RESTART',
      () => {
        audioManager.playSfx('ui_select', 0.5);
        this.scene.stop();
        const gameScene = this.scene.get('GameScene') as any;
        this.scene.start('GameScene', { level: gameScene.playerState?.level || 1 });
      }
    );

    const quitButton = new UIButton(
      this,
      GAME_CONFIG.width / 2,
      GAME_CONFIG.height / 2 + 140,
      'QUIT',
      () => {
        audioManager.playSfx('ui_back', 0.5);
        this.scene.stop();
        this.scene.stop('GameScene');
        this.scene.start('TitleScene');
      }
    );
  }
}
