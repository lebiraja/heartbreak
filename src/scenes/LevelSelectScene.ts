import Phaser from 'phaser';
import { GAME_CONFIG, COLORS, LEVEL_NAMES } from '@/config';
import { UIButton } from '@/ui/UIComponents';
import { CockpitOverlay } from '@/ui/CockpitOverlay';
import { saveSystem } from '@/systems/SaveSystem';
import { audioManager } from '@/systems/AudioManager';
import { narrativeManager } from '@/systems/NarrativeManager';
import { ENVIRONMENT_CONFIGS } from '@/data/environments';

// Choice levels for indicator display
const CHOICE_LEVELS = [5, 7, 9, 10];

export class LevelSelectScene extends Phaser.Scene {
  private cockpit?: CockpitOverlay;
  private tooltip?: Phaser.GameObjects.Container;

  constructor() {
    super({ key: 'LevelSelectScene' });
  }

  async create(): Promise<void> {
    this.cameras.main.setBackgroundColor(COLORS.background);

    // Starfield background
    this.createStarfield();

    // Cockpit overlay
    this.cockpit = new CockpitOverlay(this);
    const area = this.cockpit.getPlayableArea();

    const save = await saveSystem.loadGame();
    const unlockedLevels = save ? save.unlockedLevels : 1;
    const choices = narrativeManager.getAllChoices();

    // Title
    this.add.text(area.x + area.width / 2, area.y + 20, 'STAR MAP', {
      fontSize: '28px',
      fontFamily: 'monospace',
      color: '#00ffff',
      fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(950);

    // Emotional path indicator
    const path = narrativeManager.getEmotionalPath();
    const pathColors: Record<string, string> = {
      compassionate: '#4488ff',
      aggressive: '#ff4444',
      balanced: '#aaaaaa',
    };
    this.add.text(area.x + area.width / 2, area.y + 50, `Path: ${path.toUpperCase()}`, {
      fontSize: '14px',
      fontFamily: 'monospace',
      color: pathColors[path] ?? '#aaaaaa',
    }).setOrigin(0.5).setDepth(950);

    // Star map layout: curved path from bottom-left to top-right
    const positions = this.getStarPositions(area);

    // Draw journey lines connecting levels
    const lineGraphics = this.add.graphics();
    lineGraphics.setDepth(940);

    for (let i = 0; i < positions.length - 1; i++) {
      const from = positions[i];
      const to = positions[i + 1];
      const levelUnlocked = (i + 2) <= unlockedLevels;

      lineGraphics.lineStyle(2, levelUnlocked ? 0x335577 : 0x1a1a2a, levelUnlocked ? 0.6 : 0.3);
      lineGraphics.beginPath();
      lineGraphics.moveTo(from.x, from.y);
      // Slight curve via midpoint
      const mx = (from.x + to.x) / 2;
      const my = (from.y + to.y) / 2 - 10;
      lineGraphics.lineTo(mx, my);
      lineGraphics.lineTo(to.x, to.y);
      lineGraphics.strokePath();
    }

    // Create tooltip container (hidden)
    this.tooltip = this.add.container(0, 0).setDepth(1000).setVisible(false);

    // Draw level stars
    for (let i = 0; i < 10; i++) {
      const level = i + 1;
      const pos = positions[i];
      const unlocked = level <= unlockedLevels;
      const completed = save?.levelsCompleted[i] || false;
      const envConfig = ENVIRONMENT_CONFIGS[level];
      const levelColor = envConfig?.primaryColor ?? 0x888888;
      const hasChoice = CHOICE_LEVELS.includes(level);
      const choiceMade = choices.find(c => c.level === level);

      this.createLevelStar(
        pos.x, pos.y, level, unlocked, completed, levelColor, hasChoice, !!choiceMade, area
      );
    }

    // Navigation buttons
    new UIButton(this, area.x + area.width / 2 - 120, area.y + area.height - 30, 'BACK', () => {
      audioManager.playSfx('ui_back', 0.5);
      this.scene.start('TitleScene');
    }, 150, 40);

    new UIButton(this, area.x + area.width / 2 + 120, area.y + area.height - 30, 'JOURNAL', () => {
      audioManager.playSfx('ui_select', 0.5);
      this.scene.start('JournalScene');
    }, 150, 40);
  }

  private getStarPositions(area: Phaser.Geom.Rectangle): { x: number; y: number }[] {
    const positions: { x: number; y: number }[] = [];
    const marginX = 60;
    const marginTop = 80;
    const marginBottom = 60;
    const usableWidth = area.width - marginX * 2;
    const usableHeight = area.height - marginTop - marginBottom;

    for (let i = 0; i < 10; i++) {
      const t = i / 9;
      // S-curve path across the playable area
      const x = area.x + marginX + t * usableWidth;
      const wave = Math.sin(t * Math.PI * 2) * (usableHeight * 0.2);
      const baseY = area.y + marginTop + usableHeight * 0.4 + wave - t * usableHeight * 0.15;
      positions.push({ x, y: baseY });
    }

    return positions;
  }

  private createLevelStar(
    x: number, y: number, level: number, unlocked: boolean, completed: boolean,
    color: number, hasChoice: boolean, choiceMade: boolean,
    area: Phaser.Geom.Rectangle
  ): void {
    const g = this.add.graphics();
    g.setDepth(950);

    const radius = completed ? 18 : 14;

    if (completed) {
      // Filled star - completed
      g.fillStyle(color, 0.8);
      g.fillCircle(x, y, radius);
      g.lineStyle(2, 0xffffff, 0.6);
      g.strokeCircle(x, y, radius);

      // Glow
      g.fillStyle(color, 0.15);
      g.fillCircle(x, y, radius + 8);
    } else if (unlocked) {
      // Bright outline - unlocked but not completed
      g.lineStyle(3, color, 0.9);
      g.strokeCircle(x, y, radius);
      g.fillStyle(color, 0.15);
      g.fillCircle(x, y, radius);

      // Pulse animation
      this.tweens.add({
        targets: g,
        alpha: 0.6,
        duration: 1200,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    } else {
      // Dim outline - locked
      g.lineStyle(1, 0x333344, 0.5);
      g.strokeCircle(x, y, radius);
    }

    // Level number
    const numText = this.add.text(x, y, level.toString(), {
      fontSize: '16px',
      fontFamily: 'monospace',
      color: unlocked ? '#ffffff' : '#444455',
      fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(951);

    // Level name below
    const name = LEVEL_NAMES[level] ?? '';
    if (unlocked && name) {
      this.add.text(x, y + radius + 12, name, {
        fontSize: '10px',
        fontFamily: 'monospace',
        color: completed ? '#88aacc' : '#556677',
      }).setOrigin(0.5).setDepth(950);
    }

    // Choice indicator (small diamond icon)
    if (hasChoice && unlocked) {
      const choiceG = this.add.graphics();
      choiceG.setDepth(952);
      const cx = x + radius + 8;
      const cy = y - radius + 2;
      const s = 5;

      if (choiceMade) {
        choiceG.fillStyle(0xffaa00, 0.9);
      } else {
        choiceG.fillStyle(0x888888, 0.5);
      }
      choiceG.beginPath();
      choiceG.moveTo(cx, cy - s);
      choiceG.lineTo(cx + s, cy);
      choiceG.lineTo(cx, cy + s);
      choiceG.lineTo(cx - s, cy);
      choiceG.closePath();
      choiceG.fillPath();
    }

    // Interactive area for unlocked levels
    if (unlocked) {
      const hitZone = this.add.zone(x, y, radius * 3, radius * 3)
        .setInteractive()
        .setDepth(953);

      hitZone.on('pointerover', () => {
        this.input.setDefaultCursor('pointer');
        g.setScale(1.15);
        numText.setScale(1.15);
      });

      hitZone.on('pointerout', () => {
        this.input.setDefaultCursor('default');
        g.setScale(1);
        numText.setScale(1);
      });

      hitZone.on('pointerdown', () => {
        audioManager.playSfx('ui_select', 0.5);
        this.time.delayedCall(100, () => {
          this.scene.start('VignetteScene', { level });
        });
      });
    }
  }

  private createStarfield(): void {
    for (let i = 0; i < 80; i++) {
      const x = Phaser.Math.Between(0, GAME_CONFIG.width);
      const y = Phaser.Math.Between(0, GAME_CONFIG.height);
      const size = Phaser.Math.FloatBetween(0.5, 2);
      const star = this.add.circle(x, y, size, 0xffffff, Phaser.Math.FloatBetween(0.2, 0.7));

      this.tweens.add({
        targets: star,
        alpha: Phaser.Math.FloatBetween(0.1, 0.5),
        duration: Phaser.Math.Between(1500, 4000),
        yoyo: true,
        repeat: -1,
      });
    }
  }

  shutdown(): void {
    this.cockpit?.destroy();
  }
}
