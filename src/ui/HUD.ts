import Phaser from 'phaser';
import type { PlayerState, GameSettings } from '@/types';
import { COLORS, GAME_CONFIG, COCKPIT_CONFIG } from '@/config';
import { CockpitOverlay } from '@/ui/CockpitOverlay';
import { AnalogGauge } from '@/ui/AnalogGauge';

export class HUD {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;
  private cockpitOverlay: CockpitOverlay;
  private healthGauge: AnalogGauge;
  private shieldGauge: AnalogGauge;
  private scoreText: Phaser.GameObjects.Text;
  private comboText: Phaser.GameObjects.Text;
  private levelText: Phaser.GameObjects.Text;
  private levelNameText: Phaser.GameObjects.Text;
  private quoteText: Phaser.GameObjects.Text;
  private shardText: Phaser.GameObjects.Text;
  private fpsText: Phaser.GameObjects.Text | null = null;
  private buffIndicators: Phaser.GameObjects.Text;
  private egoIndicator: Phaser.GameObjects.Text;
  private playableArea: Phaser.Geom.Rectangle;

  constructor(scene: Phaser.Scene, settings: GameSettings) {
    this.scene = scene;
    this.container = scene.add.container(0, 0);
    this.container.setDepth(1000);

    // Create cockpit overlay (renders at depth 900)
    this.cockpitOverlay = new CockpitOverlay(scene);
    this.playableArea = this.cockpitOverlay.getPlayableArea();

    const { topHeight, bottomHeight, sideWidth } = COCKPIT_CONFIG;
    const { width, height } = GAME_CONFIG;

    // Health gauge in bottom-left cockpit area
    this.healthGauge = new AnalogGauge(scene, sideWidth / 2, height - bottomHeight / 2, {
      label: 'HULL',
      radius: 22,
      minColor: 0xff3333,
      maxColor: 0x33ff33,
      tickMarks: 10,
      dangerThreshold: 0.25,
    });
    this.healthGauge.getContainer().setDepth(1000);

    // Shield gauge next to health
    this.shieldGauge = new AnalogGauge(scene, sideWidth / 2 + 60, height - bottomHeight / 2, {
      label: 'SHIELD',
      radius: 22,
      minColor: 0xff3333,
      maxColor: 0x00ccff,
      tickMarks: 10,
      dangerThreshold: 0.2,
    });
    this.shieldGauge.getContainer().setDepth(1000);

    // Score in top cockpit panel (centered-left area)
    this.scoreText = scene.add.text(sideWidth + 10, topHeight / 2 - 18, 'SCORE: 0', {
      fontSize: '18px',
      fontFamily: 'monospace',
      color: '#ffffff',
      fontStyle: 'bold',
    });
    this.container.add(this.scoreText);

    // Combo below score
    this.comboText = scene.add.text(sideWidth + 10, topHeight / 2 + 6, '', {
      fontSize: '14px',
      fontFamily: 'monospace',
      color: '#ffff00',
      fontStyle: 'bold',
    });
    this.comboText.setVisible(false);
    this.container.add(this.comboText);

    // Level info in top-right cockpit panel
    this.levelText = scene.add.text(width - sideWidth - 10, topHeight / 2 - 18, 'LEVEL 1', {
      fontSize: '18px',
      fontFamily: 'monospace',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(1, 0);
    this.container.add(this.levelText);

    // Level name below level number
    this.levelNameText = scene.add.text(width - sideWidth - 10, topHeight / 2 + 6, '', {
      fontSize: '12px',
      fontFamily: 'monospace',
      color: '#00ffff',
    }).setOrigin(1, 0);
    this.container.add(this.levelNameText);

    // Memory shard counter in bottom cockpit area
    this.shardText = scene.add.text(width / 2, height - bottomHeight / 2 - 4, 'SHARDS: 0', {
      fontSize: '13px',
      fontFamily: 'monospace',
      color: '#00ffcc',
    }).setOrigin(0.5);
    this.container.add(this.shardText);

    // Quote text at bottom of playable area
    const quoteY = this.playableArea.y + this.playableArea.height - 30;
    this.quoteText = scene.add.text(width / 2, quoteY, '', {
      fontSize: '16px',
      fontFamily: 'Georgia, serif',
      color: '#00ffff',
      fontStyle: 'italic',
      align: 'center',
      wordWrap: { width: this.playableArea.width - 40 },
    }).setOrigin(0.5, 0).setAlpha(0.7);
    this.container.add(this.quoteText);

    // Buff indicator area (bottom-right cockpit)
    this.buffIndicators = scene.add.text(width - sideWidth - 10, height - bottomHeight / 2 - 4, '', {
      fontSize: '11px',
      fontFamily: 'monospace',
      color: '#ffaa00',
      fontStyle: 'bold',
    }).setOrigin(1, 0.5);
    this.container.add(this.buffIndicators);

    // Ego weapon indicator
    this.egoIndicator = scene.add.text(width / 2, topHeight / 2, '', {
      fontSize: '14px',
      fontFamily: 'monospace',
      color: '#ff4444',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    this.egoIndicator.setVisible(false);
    this.container.add(this.egoIndicator);

    // FPS counter
    if (settings.showFPS) {
      this.fpsText = scene.add.text(width - sideWidth - 10, topHeight / 2 + 24, 'FPS: 60', {
        fontSize: '12px',
        fontFamily: 'monospace',
        color: '#888888',
      }).setOrigin(1, 0);
      this.container.add(this.fpsText);
    }
  }

  getPlayableArea(): Phaser.Geom.Rectangle {
    return this.playableArea;
  }

  update(state: PlayerState): void {
    // Update gauges
    this.healthGauge.setValue(state.health, state.maxHealth);
    this.healthGauge.setDanger(state.health / state.maxHealth < 0.25);
    this.shieldGauge.setValue(state.shield, state.maxShield);
    this.shieldGauge.setDanger(state.shield <= 0);

    // Alert cockpit when health is critical
    this.cockpitOverlay.setAlertState(state.health / state.maxHealth < 0.2);

    // Score
    this.scoreText.setText(`SCORE: ${state.score.toLocaleString()}`);

    // Combo
    if (state.combo > 1) {
      this.comboText.setText(`COMBO: x${state.combo}`);
      this.comboText.setVisible(true);
    } else {
      this.comboText.setVisible(false);
    }

    // Level
    this.levelText.setText(`LEVEL ${state.level}`);

    // Shards
    this.shardText.setText(`SHARDS: ${state.memoryShardsCollected}`);

    // Active buffs
    if (state.activeBuffs.length > 0) {
      const buffLabels = state.activeBuffs.map(b =>
        `${b.type.replace('_', ' ').toUpperCase()} ${Math.ceil(b.remainingTime / 1000)}s`
      );
      this.buffIndicators.setText(buffLabels.join(' | '));
      this.buffIndicators.setVisible(true);
    } else {
      this.buffIndicators.setVisible(false);
    }

    // Ego weapon
    if (state.egoWeaponActive) {
      this.egoIndicator.setText('[ EGO MODE ACTIVE ]');
      this.egoIndicator.setVisible(true);
    } else {
      this.egoIndicator.setVisible(false);
    }

    // FPS
    if (this.fpsText) {
      this.fpsText.setText(`FPS: ${Math.round(this.scene.game.loop.actualFps)}`);
    }
  }

  setQuote(quote: string): void {
    this.quoteText.setText(`"${quote}"`);

    this.quoteText.setAlpha(0);
    this.scene.tweens.add({
      targets: this.quoteText,
      alpha: 0.7,
      duration: 2000,
      ease: 'Power2',
    });
  }

  setLevelName(name: string): void {
    this.levelNameText.setText(name);
  }

  destroy(): void {
    this.cockpitOverlay.destroy();
    this.healthGauge.destroy();
    this.shieldGauge.destroy();
    this.container.destroy(true);
  }
}
