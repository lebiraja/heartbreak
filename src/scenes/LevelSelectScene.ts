import Phaser from 'phaser';
import { GAME_CONFIG, COLORS, LEVEL_CONFIGS } from '@/config';
import { UIButton, Panel } from '@/ui/UIComponents';
import { saveSystem } from '@/systems/SaveSystem';
import { audioManager } from '@/systems/AudioManager';

export class LevelSelectScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LevelSelectScene' });
  }

  async create(): Promise<void> {
    this.cameras.main.setBackgroundColor(COLORS.background);

    const panel = new Panel(
      this,
      GAME_CONFIG.width / 2 - 400,
      100,
      800,
      550,
      'LEVEL SELECT'
    );

    const save = await saveSystem.loadGame();
    const unlockedLevels = save ? save.unlockedLevels : 1;

    const cols = 5;
    const rows = 2;
    const startX = GAME_CONFIG.width / 2 - 350;
    const startY = 220;
    const spacing = 140;

    for (let i = 0; i < 10; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = startX + col * spacing;
      const y = startY + row * spacing;
      const level = i + 1;
      const unlocked = level <= unlockedLevels;
      const completed = save?.levelsCompleted[i] || false;

      const levelContainer = this.add.container(x, y);

      const bg = this.add.graphics();
      bg.fillStyle(unlocked ? COLORS.ui.bg : 0x333333, 0.9);
      bg.fillRect(-50, -50, 100, 100);
      bg.lineStyle(3, unlocked ? COLORS.ui.border : 0x555555, 1);
      bg.strokeRect(-50, -50, 100, 100);
      levelContainer.add(bg);

      if (completed) {
        const check = this.add.graphics();
        check.lineStyle(4, COLORS.ui.success, 1);
        check.beginPath();
        check.moveTo(-20, -5);
        check.lineTo(-10, 10);
        check.lineTo(25, -25);
        check.strokePath();
        levelContainer.add(check);
      }

      const levelText = this.add.text(0, 0, level.toString(), {
        fontSize: '32px',
        fontFamily: 'monospace',
        color: unlocked ? '#ffffff' : '#666666',
        fontStyle: 'bold'
      }).setOrigin(0.5);
      levelContainer.add(levelText);

      if (unlocked) {
        levelContainer.setInteractive(
          new Phaser.Geom.Rectangle(-50, -50, 100, 100),
          Phaser.Geom.Rectangle.Contains
        );

        levelContainer.on('pointerover', () => {
          bg.clear();
          bg.fillStyle(COLORS.primary, 0.3);
          bg.fillRect(-50, -50, 100, 100);
          bg.lineStyle(3, 0xffffff, 1);
          bg.strokeRect(-50, -50, 100, 100);
        });

        levelContainer.on('pointerout', () => {
          bg.clear();
          bg.fillStyle(COLORS.ui.bg, 0.9);
          bg.fillRect(-50, -50, 100, 100);
          bg.lineStyle(3, COLORS.ui.border, 1);
          bg.strokeRect(-50, -50, 100, 100);
        });

        levelContainer.on('pointerdown', () => {
          audioManager.playSfx('ui_select', 0.5);
          // Small delay for visual feedback
          setTimeout(() => {
            this.scene.start('GameScene', { level });
          }, 100);
        });
      }
    }

    const backButton = new UIButton(
      this,
      GAME_CONFIG.width / 2,
      GAME_CONFIG.height - 80,
      'BACK',
      () => {
        audioManager.playSfx('ui_back', 0.5);
        this.scene.start('TitleScene');
      },
      150,
      50
    );

    const journalButton = new UIButton(
      this,
      GAME_CONFIG.width / 2 + 200,
      GAME_CONFIG.height - 80,
      'JOURNAL',
      () => {
        audioManager.playSfx('ui_select', 0.5);
        this.scene.start('JournalScene');
      },
      150,
      50
    );
  }
}
