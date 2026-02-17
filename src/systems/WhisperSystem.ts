import Phaser from 'phaser';
import type { WhisperData } from '@/types';
import { GAME_CONFIG, COCKPIT_CONFIG } from '@/config';
import { narrativeManager } from '@/systems/NarrativeManager';

export interface WhisperGameState {
  inCombat: boolean;
  playerHealthPercent: number;
  timeSinceLastWave: number;
}

export class WhisperSystem {
  private scene: Phaser.Scene;
  private level: number;
  private whispers: WhisperData[];
  private availableWhispers: WhisperData[];
  private activeWhisper: Phaser.GameObjects.Text | null = null;
  private timeSinceLastWhisper: number = 0;
  private elapsed: number = 0;

  private static readonly MIN_GAP = 15000; // 15 seconds between whispers
  private static readonly DRIFT_DURATION = 7000; // 7 seconds on screen
  private static readonly FADE_IN = 1500;
  private static readonly FADE_OUT = 2000;

  constructor(scene: Phaser.Scene, level: number) {
    this.scene = scene;
    this.level = level;
    this.whispers = narrativeManager.getWhispers(level);
    this.availableWhispers = this.whispers.filter(w => !narrativeManager.hasWhisperBeenShown(w.id));
    this.timeSinceLastWhisper = -5000; // Small initial delay before first whisper
  }

  update(delta: number, gameState: WhisperGameState): void {
    this.elapsed += delta;
    this.timeSinceLastWhisper += delta;

    if (this.activeWhisper) return; // One at a time
    if (this.timeSinceLastWhisper < WhisperSystem.MIN_GAP) return;
    if (this.availableWhispers.length === 0) return;

    // Find a whisper that matches current conditions
    const candidates = this.availableWhispers.filter(w => {
      switch (w.triggerCondition) {
        case 'calm':
          return !gameState.inCombat && gameState.timeSinceLastWave > 2000;
        case 'post_wave':
          return !gameState.inCombat && gameState.timeSinceLastWave > 500 && gameState.timeSinceLastWave < 5000;
        case 'low_health':
          return gameState.playerHealthPercent < 0.35;
        case 'timed':
          return this.elapsed >= (w.delay ?? 20000);
        default:
          return false;
      }
    });

    if (candidates.length === 0) return;

    // Pick a random candidate
    const whisper = candidates[Math.floor(Math.random() * candidates.length)];
    this.showWhisper(whisper);
  }

  private showWhisper(whisper: WhisperData): void {
    const { sideWidth, topHeight, bottomHeight } = COCKPIT_CONFIG;
    const playW = GAME_CONFIG.width - sideWidth * 2;
    const playH = GAME_CONFIG.height - topHeight - bottomHeight;

    // Start position: random edge of playable area
    const edge = Math.floor(Math.random() * 4);
    let startX: number, startY: number, endX: number, endY: number;

    switch (edge) {
      case 0: // From left
        startX = sideWidth + 20;
        startY = topHeight + 40 + Math.random() * (playH - 80);
        endX = startX + playW * 0.6;
        endY = startY + (Math.random() - 0.5) * 60;
        break;
      case 1: // From right
        startX = GAME_CONFIG.width - sideWidth - 20;
        startY = topHeight + 40 + Math.random() * (playH - 80);
        endX = startX - playW * 0.6;
        endY = startY + (Math.random() - 0.5) * 60;
        break;
      case 2: // From top
        startX = sideWidth + 40 + Math.random() * (playW - 80);
        startY = topHeight + 30;
        endX = startX + (Math.random() - 0.5) * 100;
        endY = startY + playH * 0.5;
        break;
      default: // From bottom
        startX = sideWidth + 40 + Math.random() * (playW - 80);
        startY = GAME_CONFIG.height - bottomHeight - 50;
        endX = startX + (Math.random() - 0.5) * 100;
        endY = startY - playH * 0.5;
        break;
    }

    this.activeWhisper = this.scene.add.text(startX, startY, whisper.text, {
      fontSize: `${20 + Math.floor(Math.random() * 4)}px`,
      fontFamily: 'Georgia, serif',
      fontStyle: 'italic',
      color: '#ffffff',
    }).setOrigin(0.5).setAlpha(0).setDepth(800);

    // Fade in
    this.scene.tweens.add({
      targets: this.activeWhisper,
      alpha: 0.4,
      duration: WhisperSystem.FADE_IN,
      ease: 'Power2',
    });

    // Drift
    this.scene.tweens.add({
      targets: this.activeWhisper,
      x: endX,
      y: endY,
      duration: WhisperSystem.DRIFT_DURATION,
      ease: 'Linear',
    });

    // Fade out and cleanup
    this.scene.time.delayedCall(WhisperSystem.DRIFT_DURATION - WhisperSystem.FADE_OUT, () => {
      if (this.activeWhisper) {
        this.scene.tweens.add({
          targets: this.activeWhisper,
          alpha: 0,
          duration: WhisperSystem.FADE_OUT,
          ease: 'Power2',
          onComplete: () => {
            this.activeWhisper?.destroy();
            this.activeWhisper = null;
            this.timeSinceLastWhisper = 0;
          },
        });
      }
    });

    // Mark as shown
    narrativeManager.markWhisperShown(whisper.id);
    this.availableWhispers = this.availableWhispers.filter(w => w.id !== whisper.id);
  }

  destroy(): void {
    this.activeWhisper?.destroy();
    this.activeWhisper = null;
  }
}
