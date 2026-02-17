import Phaser from 'phaser';
import { GAME_CONFIG } from '@/config';
import { TitleScene } from '@/scenes/TitleScene';
import { LevelSelectScene } from '@/scenes/LevelSelectScene';
import { GameScene } from '@/scenes/GameScene';
import { PauseScene } from '@/scenes/PauseScene';
import { GameOverScene } from '@/scenes/GameOverScene';
import { JournalScene } from '@/scenes/JournalScene';
import { LeaderboardScene } from '@/scenes/LeaderboardScene';
import { SettingsScene } from '@/scenes/SettingsScene';
import { OpeningScene } from '@/scenes/OpeningScene';
import { VignetteScene } from '@/scenes/VignetteScene';
import { EndingScene } from '@/scenes/EndingScene';
import { saveSystem } from '@/systems/SaveSystem';
import { audioManager } from '@/systems/AudioManager';
import { narrativeManager } from '@/systems/NarrativeManager';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: GAME_CONFIG.width,
  height: GAME_CONFIG.height,
  parent: 'game-container',
  backgroundColor: '#0a0a1a',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false
    }
  },
  scene: [
    TitleScene,
    OpeningScene,
    LevelSelectScene,
    VignetteScene,
    GameScene,
    PauseScene,
    GameOverScene,
    JournalScene,
    LeaderboardScene,
    SettingsScene,
    EndingScene
  ]
};

async function initializeGame() {
  try {
    // Initialize save system
    await saveSystem.initializeSave();

    // Initialize narrative system
    await narrativeManager.initialize();

    // Initialize audio (non-blocking)
    audioManager.initialize([
      { key: 'menu_music', path: '/assets/audio/menu_music.mp3', loop: true, volume: 0.5 },
      { key: 'gameplay_music', path: '/assets/audio/gameplay_music.mp3', loop: true, volume: 0.4 },
      { key: 'victory_music', path: '/assets/audio/victory_music.mp3', loop: false, volume: 0.6 },
      { key: 'shoot_primary', path: '/assets/audio/shoot_primary.mp3', volume: 0.3 },
      { key: 'shoot_secondary', path: '/assets/audio/shoot_secondary.mp3', volume: 0.5 },
      { key: 'enemy_death', path: '/assets/audio/enemy_death.mp3', volume: 0.4 },
      { key: 'player_hit', path: '/assets/audio/player_hit.mp3', volume: 0.5 },
      { key: 'player_death', path: '/assets/audio/player_death.mp3', volume: 0.7 },
      { key: 'shield_hit', path: '/assets/audio/shield_hit.mp3', volume: 0.4 },
      { key: 'powerup', path: '/assets/audio/powerup.mp3', volume: 0.6 },
      { key: 'level_complete', path: '/assets/audio/level_complete.mp3', volume: 0.8 },
      { key: 'ui_select', path: '/assets/audio/ui_select.mp3', volume: 0.5 },
      { key: 'ui_back', path: '/assets/audio/ui_back.mp3', volume: 0.5 }
    ]);

    // Create game instance
    const game = new Phaser.Game(config);

    // Hide loading screen
    setTimeout(() => {
      const loading = document.getElementById('loading');
      const controls = document.getElementById('controls');
      const notice = document.getElementById('accessibility-notice');
      
      if (loading) loading.classList.add('hidden');
      if (controls) controls.classList.remove('hidden');
      if (notice) {
        notice.classList.remove('hidden');
        setTimeout(() => notice.classList.add('hidden'), 10000);
      }
    }, 1000);

    return game;
  } catch (error) {
    console.error('Failed to initialize game:', error);
    
    // Show error to user
    const loading = document.getElementById('loading');
    if (loading) {
      loading.innerHTML = `
        <h1>ERROR</h1>
        <p>Failed to initialize game. Please refresh the page.</p>
        <p style="font-size: 12px; color: #888;">${error}</p>
      `;
    }
    
    throw error;
  }
}

initializeGame().catch(console.error);
