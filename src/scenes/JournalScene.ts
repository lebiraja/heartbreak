import Phaser from 'phaser';
import { GAME_CONFIG, COLORS, LEVEL_CONFIGS } from '@/config';
import { UIButton, Panel } from '@/ui/UIComponents';
import { saveSystem } from '@/systems/SaveSystem';
import { audioManager } from '@/systems/AudioManager';

export class JournalScene extends Phaser.Scene {
  constructor() {
    super({ key: 'JournalScene' });
  }

  async create(): Promise<void> {
    this.cameras.main.setBackgroundColor(COLORS.background);

    const panel = new Panel(
      this,
      GAME_CONFIG.width / 2 - 500,
      50,
      1000,
      620,
      'PILOT\'S JOURNAL'
    );

    const save = await saveSystem.loadGame();
    
    const journalText = this.add.text(GAME_CONFIG.width / 2 - 450, 120, '', {
      fontSize: '16px',
      fontFamily: 'serif',
      color: '#ffffff',
      lineSpacing: 10,
      wordWrap: { width: 900 }
    });

    let content = 'Mission Log - Journey Home\n\n';
    content += `Total Memory Shards Collected: ${save?.totalMemoryShards || 0}\n`;
    content += `Highest Score: ${save?.highScore.toLocaleString() || 0}\n`;
    content += `Levels Completed: ${save?.levelsCompleted.filter(Boolean).length || 0}/10\n\n`;
    content += '---\n\n';

    if (save?.journalEntries && save.journalEntries.length > 0) {
      save.journalEntries.forEach(entry => {
        content += `LEVEL ${entry.level}:\n`;
        content += `"${entry.quote}"\n`;
        if (entry.reflection) {
          content += `${entry.reflection}\n`;
        }
        content += `${entry.completed ? '✓ Completed' : '○ In Progress'}\n\n`;
      });
    } else {
      content += 'Begin your journey to unlock reflections...\n\n';
      
      LEVEL_CONFIGS.forEach((config, index) => {
        if (save?.levelsCompleted[index]) {
          content += `LEVEL ${config.level}:\n`;
          content += `"${config.quote}"\n`;
          content += '✓ Completed\n\n';
        }
      });
    }

    journalText.setText(content);

    const progressLabel = this.add.text(GAME_CONFIG.width / 2, GAME_CONFIG.height - 150, 
      'PROGRESS TRACKER', {
      fontSize: '20px',
      fontFamily: 'monospace',
      color: '#00ffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    const progressBg = this.add.graphics();
    progressBg.fillStyle(0x000000, 0.5);
    progressBg.fillRect(GAME_CONFIG.width / 2 - 400, GAME_CONFIG.height - 120, 800, 30);
    progressBg.lineStyle(2, COLORS.ui.border, 1);
    progressBg.strokeRect(GAME_CONFIG.width / 2 - 400, GAME_CONFIG.height - 120, 800, 30);

    const completedLevels = save?.levelsCompleted.filter(Boolean).length || 0;
    const progress = (completedLevels / 10) * 800;

    const progressBar = this.add.graphics();
    progressBar.fillStyle(COLORS.primary, 0.8);
    progressBar.fillRect(GAME_CONFIG.width / 2 - 400, GAME_CONFIG.height - 120, progress, 30);

    const progressText = this.add.text(GAME_CONFIG.width / 2, GAME_CONFIG.height - 105, 
      `${completedLevels}/10 Levels`, {
      fontSize: '16px',
      fontFamily: 'monospace',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    const backButton = new UIButton(
      this,
      GAME_CONFIG.width / 2,
      GAME_CONFIG.height - 50,
      'BACK',
      () => {
        audioManager.playSfx('ui_back', 0.5);
        this.scene.start('LevelSelectScene');
      },
      150,
      40
    );
  }
}
