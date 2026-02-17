import Phaser from 'phaser';
import { GAME_CONFIG, COLORS, LEVEL_NAMES } from '@/config';
import { UIButton } from '@/ui/UIComponents';
import { CockpitOverlay } from '@/ui/CockpitOverlay';
import { saveSystem } from '@/systems/SaveSystem';
import { audioManager } from '@/systems/AudioManager';
import { narrativeManager } from '@/systems/NarrativeManager';
import { LEVEL_CONFIGS } from '@/config';
import { MEMORY_SHARD_FRAGMENTS } from '@/data/narrative';

export class JournalScene extends Phaser.Scene {
  private cockpit?: CockpitOverlay;
  private currentPage: number = 0;
  private totalPages: number = 10;
  private pageContainers: Phaser.GameObjects.Container[] = [];

  constructor() {
    super({ key: 'JournalScene' });
  }

  async create(): Promise<void> {
    this.cameras.main.setBackgroundColor(COLORS.background);

    // Create starfield background
    this.createStarfield();

    this.cockpit = new CockpitOverlay(this);
    const area = this.cockpit.getPlayableArea();

    const save = await saveSystem.loadGame();
    const emotionalPath = narrativeManager.getEmotionalPath();

    // Title
    this.add.text(area.x + area.width / 2, area.y + 18, "PILOT'S JOURNAL", {
      fontSize: '26px',
      fontFamily: 'monospace',
      color: '#00ffff',
      fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(950);

    // Stats row
    const completed = save?.levelsCompleted.filter(Boolean).length ?? 0;
    const shards = save?.totalMemoryShards ?? 0;
    const choices = narrativeManager.getAllChoices();

    this.add.text(area.x + 20, area.y + 48, [
      `Levels: ${completed}/10`,
      `Shards: ${shards}`,
      `Choices: ${choices.length}/5`,
      `Path: ${emotionalPath.charAt(0).toUpperCase() + emotionalPath.slice(1)}`,
    ].join('   '), {
      fontSize: '12px',
      fontFamily: 'monospace',
      color: '#778899',
    }).setDepth(950);

    // Separator line
    const sep = this.add.graphics().setDepth(950);
    sep.lineStyle(1, 0x334455, 0.5);
    sep.lineBetween(area.x + 10, area.y + 68, area.x + area.width - 10, area.y + 68);

    // Build journal pages
    for (let levelNum = 1; levelNum <= 10; levelNum++) {
      const container = this.createJournalPage(levelNum, save, area);
      container.setVisible(levelNum === 1);
      this.pageContainers.push(container);
    }

    this.currentPage = 0;

    // Navigation: prev/next level arrows
    const prevBtn = this.add.graphics().setDepth(960);
    this.drawArrow(prevBtn, area.x + 30, area.y + area.height / 2, 'left', false);

    const prevZone = this.add.zone(area.x + 30, area.y + area.height / 2, 50, 50)
      .setInteractive().setDepth(961);
    prevZone.on('pointerdown', () => this.changePage(-1));
    prevZone.on('pointerover', () => {
      this.input.setDefaultCursor('pointer');
      prevBtn.clear();
      this.drawArrow(prevBtn, area.x + 30, area.y + area.height / 2, 'left', true);
    });
    prevZone.on('pointerout', () => {
      this.input.setDefaultCursor('default');
      prevBtn.clear();
      this.drawArrow(prevBtn, area.x + 30, area.y + area.height / 2, 'left', false);
    });

    const nextBtn = this.add.graphics().setDepth(960);
    this.drawArrow(nextBtn, area.x + area.width - 30, area.y + area.height / 2, 'right', false);

    const nextZone = this.add.zone(area.x + area.width - 30, area.y + area.height / 2, 50, 50)
      .setInteractive().setDepth(961);
    nextZone.on('pointerdown', () => this.changePage(1));
    nextZone.on('pointerover', () => {
      this.input.setDefaultCursor('pointer');
      nextBtn.clear();
      this.drawArrow(nextBtn, area.x + area.width - 30, area.y + area.height / 2, 'right', true);
    });
    nextZone.on('pointerout', () => {
      this.input.setDefaultCursor('default');
      nextBtn.clear();
      this.drawArrow(nextBtn, area.x + area.width - 30, area.y + area.height / 2, 'right', false);
    });

    // Page indicator
    this.add.text(area.x + area.width / 2, area.y + area.height - 56, 'Use arrows to navigate levels', {
      fontSize: '11px',
      fontFamily: 'monospace',
      color: '#445566',
    }).setOrigin(0.5).setDepth(950);

    new UIButton(this, area.x + area.width / 2, area.y + area.height - 30, 'BACK', () => {
      audioManager.playSfx('ui_back', 0.5);
      this.scene.start('LevelSelectScene');
    }, 130, 36);
  }

  private createJournalPage(
    levelNum: number,
    save: any,
    area: Phaser.Geom.Rectangle
  ): Phaser.GameObjects.Container {
    const container = this.add.container(0, 0).setDepth(951);
    const cx = area.x + area.width / 2;
    const topY = area.y + 85;
    const contentWidth = area.width - 120;
    const unlocked = levelNum <= (save?.unlockedLevels ?? 1);
    const completed = save?.levelsCompleted[levelNum - 1] ?? false;
    const levelConfig = LEVEL_CONFIGS[levelNum - 1];
    const journalProgress = save?.journalUnlockProgress?.[levelNum] ?? {};
    const quoteUnlocked = journalProgress.quoteUnlocked || completed;
    const reflectionUnlocked = journalProgress.reflectionUnlocked || completed;
    const whispersUnlocked = journalProgress.whispersUnlocked || completed;

    // Level header
    const levelColor = completed ? '#00ffff' : (unlocked ? '#aaaacc' : '#334455');
    const nameText = LEVEL_NAMES[levelNum] ?? `Level ${levelNum}`;

    const headerText = this.add.text(cx, topY, `[ LEVEL ${levelNum} — ${nameText.toUpperCase()} ]`, {
      fontSize: '20px',
      fontFamily: 'monospace',
      color: levelColor,
      fontStyle: 'bold',
    }).setOrigin(0.5);
    container.add(headerText);

    const statusIcon = completed ? '✓ COMPLETE' : (unlocked ? '○ IN PROGRESS' : '✕ LOCKED');
    const statusColor = completed ? '#33cc66' : (unlocked ? '#aaaa55' : '#555566');
    const statusText = this.add.text(cx, topY + 26, statusIcon, {
      fontSize: '12px',
      fontFamily: 'monospace',
      color: statusColor,
    }).setOrigin(0.5);
    container.add(statusText);

    if (!unlocked) {
      const lockedText = this.add.text(cx, topY + 80, 'Complete previous levels to unlock.', {
        fontSize: '16px',
        fontFamily: 'Georgia, serif',
        color: '#334455',
        fontStyle: 'italic',
      }).setOrigin(0.5);
      container.add(lockedText);
      return container;
    }

    let yOffset = topY + 62;

    // Quote section
    if (quoteUnlocked && levelConfig?.quote) {
      const quoteLabel = this.add.text(cx - contentWidth / 2, yOffset, 'LEVEL EPIGRAPH', {
        fontSize: '11px',
        fontFamily: 'monospace',
        color: '#556677',
      });
      container.add(quoteLabel);

      yOffset += 18;
      const quoteText = this.add.text(cx, yOffset, `"${levelConfig.quote}"`, {
        fontSize: '15px',
        fontFamily: 'Georgia, serif',
        color: '#99aabb',
        fontStyle: 'italic',
        align: 'center',
        wordWrap: { width: contentWidth },
        lineSpacing: 4,
      }).setOrigin(0.5, 0);
      container.add(quoteText);
      yOffset += quoteText.height + 18;
    } else {
      const lockNote = this.add.text(cx, yOffset + 12, '[ Epigraph unlocks on level completion ]', {
        fontSize: '13px',
        fontFamily: 'monospace',
        color: '#334455',
        fontStyle: 'italic',
      }).setOrigin(0.5, 0);
      container.add(lockNote);
      yOffset += 46;
    }

    // Separator
    const sep2 = this.add.graphics();
    sep2.lineStyle(1, 0x223344, 0.4);
    sep2.lineBetween(area.x + 60, yOffset, area.x + area.width - 60, yOffset);
    container.add(sep2);
    yOffset += 12;

    // Reflection section
    if (reflectionUnlocked) {
      const refLabel = this.add.text(cx - contentWidth / 2, yOffset, 'STARK\'S REFLECTION', {
        fontSize: '11px',
        fontFamily: 'monospace',
        color: '#556677',
      });
      container.add(refLabel);

      yOffset += 18;
      const reflText = narrativeManager.getReflection(levelNum);
      const reflDisplay = this.add.text(cx, yOffset, reflText || 'No reflection recorded.', {
        fontSize: '14px',
        fontFamily: 'Georgia, serif',
        color: '#778899',
        fontStyle: 'italic',
        align: 'center',
        wordWrap: { width: contentWidth },
        lineSpacing: 4,
      }).setOrigin(0.5, 0);
      container.add(reflDisplay);
      yOffset += reflDisplay.height + 18;
    } else if (unlocked) {
      const refLock = this.add.text(cx, yOffset + 8, '[ Reflection unlocks after completing this level ]', {
        fontSize: '13px',
        fontFamily: 'monospace',
        color: '#334455',
        fontStyle: 'italic',
      }).setOrigin(0.5, 0);
      container.add(refLock);
      yOffset += 46;
    }

    // Choices made on this level
    const levelChoices = narrativeManager.getAllChoices().filter(c => c.level === levelNum);
    if (levelChoices.length > 0) {
      yOffset = Math.min(yOffset, area.y + area.height - 140);

      const sep3 = this.add.graphics();
      sep3.lineStyle(1, 0x223344, 0.4);
      sep3.lineBetween(area.x + 60, yOffset, area.x + area.width - 60, yOffset);
      container.add(sep3);
      yOffset += 10;

      const choiceLabel = this.add.text(cx - contentWidth / 2, yOffset, 'CHOICES MADE', {
        fontSize: '11px',
        fontFamily: 'monospace',
        color: '#556677',
      });
      container.add(choiceLabel);
      yOffset += 18;

      for (const choice of levelChoices) {
        const choiceText = this.add.text(cx, yOffset, `${choice.choiceId.replace(/_/g, ' ').toUpperCase()}: ${choice.selectedOption.toUpperCase()}`, {
          fontSize: '13px',
          fontFamily: 'monospace',
          color: '#ffaa44',
        }).setOrigin(0.5, 0);
        container.add(choiceText);
        yOffset += 20;
      }
    }

    // Memory shard fragments — unlock based on shards collected
    const shardFragments = MEMORY_SHARD_FRAGMENTS[levelNum];
    const shardsCollected = save?.totalMemoryShards ?? 0;
    const shardsForThisLevel = Math.min(
      shardFragments?.length ?? 0,
      Math.floor(shardsCollected / (levelNum)) // rough estimate: more shards = more unlocked
    );

    if (whispersUnlocked && shardFragments && shardsForThisLevel > 0) {
      yOffset = Math.min(yOffset, area.y + area.height - 100);

      const sep4 = this.add.graphics();
      sep4.lineStyle(1, 0x223344, 0.3);
      sep4.lineBetween(area.x + 60, yOffset, area.x + area.width - 60, yOffset);
      container.add(sep4);
      yOffset += 10;

      const shardLabel = this.add.text(cx - contentWidth / 2, yOffset, `MEMORY FRAGMENTS  [${shardsForThisLevel}/${shardFragments.length}]`, {
        fontSize: '11px',
        fontFamily: 'monospace',
        color: '#446655',
      });
      container.add(shardLabel);
      yOffset += 16;

      for (let si = 0; si < shardsForThisLevel && yOffset < area.y + area.height - 40; si++) {
        const frag = this.add.text(cx, yOffset, `• ${shardFragments[si]}`, {
          fontSize: '12px',
          fontFamily: 'Georgia, serif',
          color: '#557766',
          fontStyle: 'italic',
          align: 'center',
          wordWrap: { width: contentWidth - 40 },
        }).setOrigin(0.5, 0);
        container.add(frag);
        yOffset += frag.height + 4;
      }
    } else if (completed && shardFragments) {
      const noShards = this.add.text(cx, Math.min(yOffset + 8, area.y + area.height - 50), '[ Collect Memory Shards in-game to unlock fragments ]', {
        fontSize: '11px',
        fontFamily: 'monospace',
        color: '#334455',
        fontStyle: 'italic',
      }).setOrigin(0.5, 0);
      container.add(noShards);
    }

    return container;
  }

  private changePage(delta: number): void {
    const newPage = Phaser.Math.Clamp(this.currentPage + delta, 0, this.totalPages - 1);
    if (newPage === this.currentPage) return;

    audioManager.playSfx('ui_select', 0.4);
    this.pageContainers[this.currentPage].setVisible(false);
    this.currentPage = newPage;
    this.pageContainers[this.currentPage].setVisible(true);
  }

  private drawArrow(g: Phaser.GameObjects.Graphics, x: number, y: number, dir: 'left' | 'right', hovered: boolean): void {
    const color = hovered ? 0x00ffff : 0x335577;
    const size = 14;
    g.lineStyle(2, color, hovered ? 0.9 : 0.5);
    g.beginPath();
    if (dir === 'left') {
      g.moveTo(x + size, y - size);
      g.lineTo(x, y);
      g.lineTo(x + size, y + size);
    } else {
      g.moveTo(x - size, y - size);
      g.lineTo(x, y);
      g.lineTo(x - size, y + size);
    }
    g.strokePath();
  }

  private createStarfield(): void {
    for (let i = 0; i < 60; i++) {
      const x = Phaser.Math.Between(0, GAME_CONFIG.width);
      const y = Phaser.Math.Between(0, GAME_CONFIG.height);
      this.add.circle(x, y, Phaser.Math.FloatBetween(0.5, 1.5), 0xffffff, Phaser.Math.FloatBetween(0.1, 0.4));
    }
  }

  shutdown(): void {
    this.cockpit?.destroy();
  }
}
