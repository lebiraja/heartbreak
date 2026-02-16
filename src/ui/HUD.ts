import Phaser from 'phaser';
import type { PlayerState, GameSettings } from '@/types';
import { COLORS, GAME_CONFIG } from '@/config';

export class HUD {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;
  private healthBar: Phaser.GameObjects.Graphics;
  private shieldBar: Phaser.GameObjects.Graphics;
  private scoreText: Phaser.GameObjects.Text;
  private comboText: Phaser.GameObjects.Text;
  private levelText: Phaser.GameObjects.Text;
  private quoteText: Phaser.GameObjects.Text;
  private fpsText: Phaser.GameObjects.Text | null = null;

  constructor(scene: Phaser.Scene, settings: GameSettings) {
    this.scene = scene;
    this.container = scene.add.container(0, 0);
    this.container.setDepth(1000);

    this.createBackground();
    this.healthBar = this.createBar(20, 20, COLORS.ui.danger);
    this.shieldBar = this.createBar(20, 50, COLORS.primary);

    this.scoreText = scene.add.text(20, 80, 'SCORE: 0', {
      fontSize: '20px',
      fontFamily: 'monospace',
      color: '#ffffff',
      fontStyle: 'bold'
    });
    this.container.add(this.scoreText);

    this.comboText = scene.add.text(20, 105, '', {
      fontSize: '16px',
      fontFamily: 'monospace',
      color: '#ffff00',
      fontStyle: 'bold'
    });
    this.container.add(this.comboText);

    this.levelText = scene.add.text(GAME_CONFIG.width - 20, 20, 'LEVEL 1', {
      fontSize: '20px',
      fontFamily: 'monospace',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(1, 0);
    this.container.add(this.levelText);

    this.quoteText = scene.add.text(GAME_CONFIG.width / 2, GAME_CONFIG.height - 40, '', {
      fontSize: '18px',
      fontFamily: 'serif',
      color: '#00ffff',
      fontStyle: 'italic',
      align: 'center',
      wordWrap: { width: GAME_CONFIG.width - 100 }
    }).setOrigin(0.5, 0).setAlpha(0.8);
    this.container.add(this.quoteText);

    if (settings.showFPS) {
      this.fpsText = scene.add.text(GAME_CONFIG.width - 20, 50, 'FPS: 60', {
        fontSize: '14px',
        fontFamily: 'monospace',
        color: '#888888'
      }).setOrigin(1, 0);
      this.container.add(this.fpsText);
    }
  }

  private createBackground(): void {
    const topPanel = this.scene.add.graphics();
    topPanel.fillStyle(COLORS.ui.bg, 0.9);
    topPanel.fillRect(0, 0, GAME_CONFIG.width, 140);
    topPanel.lineStyle(3, COLORS.ui.border, 1);
    topPanel.strokeRect(0, 0, GAME_CONFIG.width, 140);
    this.container.add(topPanel);

    const bottomPanel = this.scene.add.graphics();
    bottomPanel.fillStyle(COLORS.ui.bg, 0.9);
    bottomPanel.fillRect(0, GAME_CONFIG.height - 80, GAME_CONFIG.width, 80);
    bottomPanel.lineStyle(3, COLORS.ui.border, 1);
    bottomPanel.strokeRect(0, GAME_CONFIG.height - 80, GAME_CONFIG.width, 80);
    this.container.add(bottomPanel);
  }

  private createBar(x: number, y: number, color: number): Phaser.GameObjects.Graphics {
    const bar = this.scene.add.graphics();
    this.container.add(bar);
    return bar;
  }

  update(state: PlayerState): void {
    this.updateHealthBar(state.health, state.maxHealth);
    this.updateShieldBar(state.shield, state.maxShield);
    this.scoreText.setText(`SCORE: ${state.score.toLocaleString()}`);
    
    if (state.combo > 1) {
      this.comboText.setText(`COMBO: x${state.combo}`);
      this.comboText.setVisible(true);
    } else {
      this.comboText.setVisible(false);
    }

    this.levelText.setText(`LEVEL ${state.level}`);

    if (this.fpsText) {
      this.fpsText.setText(`FPS: ${Math.round(this.scene.game.loop.actualFps)}`);
    }
  }

  private updateHealthBar(health: number, maxHealth: number): void {
    this.healthBar.clear();
    
    const barWidth = 200;
    const barHeight = 20;
    const x = 120;
    const y = 20;
    
    this.healthBar.fillStyle(0x000000, 0.5);
    this.healthBar.fillRect(x, y, barWidth, barHeight);
    
    const healthPercent = health / maxHealth;
    const fillWidth = barWidth * healthPercent;
    
    this.healthBar.fillStyle(COLORS.ui.danger, 1);
    this.healthBar.fillRect(x, y, fillWidth, barHeight);
    
    this.healthBar.lineStyle(2, COLORS.ui.border, 1);
    this.healthBar.strokeRect(x, y, barWidth, barHeight);
    
    const healthText = this.scene.add.text(x + 10, y + 3, `HP: ${Math.ceil(health)}`, {
      fontSize: '14px',
      fontFamily: 'monospace',
      color: '#ffffff',
      fontStyle: 'bold'
    });
    this.container.add(healthText);
  }

  private updateShieldBar(shield: number, maxShield: number): void {
    this.shieldBar.clear();
    
    const barWidth = 200;
    const barHeight = 20;
    const x = 120;
    const y = 50;
    
    this.shieldBar.fillStyle(0x000000, 0.5);
    this.shieldBar.fillRect(x, y, barWidth, barHeight);
    
    const shieldPercent = shield / maxShield;
    const fillWidth = barWidth * shieldPercent;
    
    this.shieldBar.fillStyle(COLORS.primary, 0.8);
    this.shieldBar.fillRect(x, y, fillWidth, barHeight);
    
    this.shieldBar.lineStyle(2, COLORS.ui.border, 1);
    this.shieldBar.strokeRect(x, y, barWidth, barHeight);
    
    const shieldText = this.scene.add.text(x + 10, y + 3, `SHIELD: ${Math.ceil(shield)}`, {
      fontSize: '14px',
      fontFamily: 'monospace',
      color: '#ffffff',
      fontStyle: 'bold'
    });
    this.container.add(shieldText);
  }

  setQuote(quote: string): void {
    this.quoteText.setText(`"${quote}"`);
    
    this.quoteText.setAlpha(0);
    this.scene.tweens.add({
      targets: this.quoteText,
      alpha: 0.8,
      duration: 2000,
      ease: 'Power2'
    });
  }

  destroy(): void {
    this.container.destroy();
  }
}
