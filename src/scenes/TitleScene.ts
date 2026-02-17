import Phaser from 'phaser';
import { GAME_CONFIG, COLORS, COCKPIT_CONFIG } from '@/config';
import { UIButton, Panel } from '@/ui/UIComponents';
import { CockpitOverlay } from '@/ui/CockpitOverlay';
import { saveSystem } from '@/systems/SaveSystem';
import { audioManager } from '@/systems/AudioManager';

export class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TitleScene' });
  }

  async create(): Promise<void> {
    // Initialize save system first
    await saveSystem.initializeSave();
    
    // Unlock audio on any user interaction
    this.input.once('pointerdown', () => {
      audioManager.unlockAudio();
    });
    
    this.cameras.main.setBackgroundColor(COLORS.background);

    this.createStarfield();

    const epigraph = this.add.text(
      GAME_CONFIG.width / 2,
      80,
      GAME_CONFIG.epigraph,
      {
        fontSize: '24px',
        fontFamily: 'serif',
        color: '#888888',
        fontStyle: 'italic',
        align: 'center'
      }
    ).setOrigin(0.5);

    const title = this.add.text(
      GAME_CONFIG.width / 2,
      GAME_CONFIG.height / 2 - 100,
      'STELLAR RESOLVE',
      {
        fontSize: '72px',
        fontFamily: 'monospace',
        color: '#00ffff',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 6
      }
    ).setOrigin(0.5);

    this.tweens.add({
      targets: title,
      alpha: 0.7,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    const subtitle = this.add.text(
      GAME_CONFIG.width / 2,
      GAME_CONFIG.height / 2 - 30,
      'A Journey Home Through the Stars',
      {
        fontSize: '20px',
        fontFamily: 'serif',
        color: '#ffffff',
        fontStyle: 'italic'
      }
    ).setOrigin(0.5);

    const startButton = new UIButton(
      this,
      GAME_CONFIG.width / 2,
      GAME_CONFIG.height / 2 + 50,
      'START GAME',
      () => {
        audioManager.playSfx('ui_select', 0.5);
        audioManager.stopMusic(true);
        this.scene.start('OpeningScene');
      }
    );

    const continueButton = new UIButton(
      this,
      GAME_CONFIG.width / 2,
      GAME_CONFIG.height / 2 + 120,
      'CONTINUE',
      async () => {
        const save = await saveSystem.loadGame();
        if (save && save.unlockedLevels > 1) {
          audioManager.playSfx('ui_select', 0.5);
          this.scene.start('LevelSelectScene');
        }
      }
    );

    saveSystem.loadGame().then(save => {
      if (!save || save.unlockedLevels <= 1) {
        continueButton.setEnabled(false);
      }
    });

    const leaderboardButton = new UIButton(
      this,
      GAME_CONFIG.width / 2,
      GAME_CONFIG.height / 2 + 190,
      'LEADERBOARD',
      () => {
        audioManager.playSfx('ui_select', 0.5);
        this.scene.start('LeaderboardScene');
      },
      200,
      50
    );

    const settingsButton = new UIButton(
      this,
      GAME_CONFIG.width / 2,
      GAME_CONFIG.height / 2 + 260,
      'SETTINGS',
      () => {
        audioManager.playSfx('ui_select', 0.5);
        this.scene.start('SettingsScene');
      },
      200,
      50
    );

    const credits = this.add.text(
      GAME_CONFIG.width / 2,
      GAME_CONFIG.height - 30,
      'Created with Phaser 3 & TypeScript | v1.0.0',
      {
        fontSize: '14px',
        fontFamily: 'monospace',
        color: '#666666'
      }
    ).setOrigin(0.5);

    audioManager.playMusic('menu_music', true);
  }

  private createStarfield(): void {
    for (let i = 0; i < 100; i++) {
      const x = Phaser.Math.Between(0, GAME_CONFIG.width);
      const y = Phaser.Math.Between(0, GAME_CONFIG.height);
      const size = Phaser.Math.Between(1, 3);
      const star = this.add.circle(x, y, size, 0xffffff, Phaser.Math.FloatBetween(0.3, 1));

      this.tweens.add({
        targets: star,
        alpha: Phaser.Math.FloatBetween(0.2, 0.8),
        duration: Phaser.Math.Between(1000, 3000),
        yoyo: true,
        repeat: -1
      });
    }
  }
}
