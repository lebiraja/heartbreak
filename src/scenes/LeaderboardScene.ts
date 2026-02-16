import Phaser from 'phaser';
import { GAME_CONFIG, COLORS } from '@/config';
import { UIButton, Panel } from '@/ui/UIComponents';
import { saveSystem } from '@/systems/SaveSystem';
import { audioManager } from '@/systems/AudioManager';

export class LeaderboardScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LeaderboardScene' });
  }

  async create(): Promise<void> {
    this.cameras.main.setBackgroundColor(COLORS.background);

    const panel = new Panel(
      this,
      GAME_CONFIG.width / 2 - 400,
      50,
      800,
      620,
      'LEADERBOARD'
    );

    const headerText = this.add.text(GAME_CONFIG.width / 2 - 350, 120, 'RANK    PILOT         SCORE          LEVEL    DATE', {
      fontSize: '16px',
      fontFamily: 'monospace',
      color: '#00ffff',
      fontStyle: 'bold'
    });

    const separator = this.add.graphics();
    separator.lineStyle(2, COLORS.ui.border, 1);
    separator.lineBetween(GAME_CONFIG.width / 2 - 350, 150, GAME_CONFIG.width / 2 + 350, 150);

    const leaderboard = await saveSystem.getLeaderboard();

    let yPos = 170;
    const maxEntries = 15;

    if (leaderboard.length === 0) {
      const emptyText = this.add.text(
        GAME_CONFIG.width / 2,
        GAME_CONFIG.height / 2,
        'No entries yet. Be the first!',
        {
          fontSize: '20px',
          fontFamily: 'monospace',
          color: '#888888',
          fontStyle: 'italic'
        }
      ).setOrigin(0.5);
    } else {
      leaderboard.slice(0, maxEntries).forEach((entry, index) => {
        const rank = (entry.rank).toString().padStart(2, ' ');
        const name = entry.playerName.substring(0, 12).padEnd(12, ' ');
        const score = entry.score.toLocaleString().padStart(12, ' ');
        const level = entry.level.toString().padStart(2, ' ');
        const date = new Date(entry.timestamp).toLocaleDateString().substring(0, 10);

        const entryText = this.add.text(
          GAME_CONFIG.width / 2 - 350,
          yPos,
          `${rank}      ${name}  ${score}     ${level}       ${date}`,
          {
            fontSize: '14px',
            fontFamily: 'monospace',
            color: index < 3 ? '#ffff00' : '#ffffff'
          }
        );

        if (index < 3) {
          const medal = this.add.text(GAME_CONFIG.width / 2 - 380, yPos, ['🥇', '🥈', '🥉'][index], {
            fontSize: '14px'
          });
        }

        yPos += 28;
      });
    }

    const localLabel = this.add.text(GAME_CONFIG.width / 2 - 350, GAME_CONFIG.height - 140, 
      'Local Leaderboard', {
      fontSize: '14px',
      fontFamily: 'monospace',
      color: '#888888',
      fontStyle: 'italic'
    });

    const apiStubLabel = this.add.text(GAME_CONFIG.width / 2 + 100, GAME_CONFIG.height - 140, 
      'Global API: Not Connected', {
      fontSize: '14px',
      fontFamily: 'monospace',
      color: '#888888',
      fontStyle: 'italic'
    });

    const clearButton = new UIButton(
      this,
      GAME_CONFIG.width / 2 - 110,
      GAME_CONFIG.height - 80,
      'CLEAR',
      async () => {
        if (confirm('Clear all leaderboard entries?')) {
          await saveSystem.clearSave();
          audioManager.playSfx('ui_select', 0.5);
          this.scene.restart();
        }
      },
      150,
      50
    );

    const backButton = new UIButton(
      this,
      GAME_CONFIG.width / 2 + 110,
      GAME_CONFIG.height - 80,
      'BACK',
      () => {
        audioManager.playSfx('ui_back', 0.5);
        this.scene.start('TitleScene');
      },
      150,
      50
    );
  }
}
