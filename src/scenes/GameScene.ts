import Phaser from 'phaser';
import { GAME_CONFIG, PLAYER_CONFIG, ENEMY_TYPES, LEVEL_CONFIGS, BOSS_DATA } from '@/config';
import type { PlayerState, LevelConfig, GameSettings } from '@/types';
import { Player } from '@/entities/Player';
import { Enemy } from '@/entities/Enemy';
import { Boss } from '@/entities/Boss';
import { Projectile, ChargedProjectile, MemoryShard } from '@/entities/Projectile';
import { HUD } from '@/ui/HUD';
import { ParticleManager } from '@/systems/ParticleManager';
import { EnvironmentManager } from '@/systems/EnvironmentManager';
import { saveSystem } from '@/systems/SaveSystem';
import { audioManager } from '@/systems/AudioManager';
import { safeGetSettings } from '@/utils/settingsHelper';
import { narrativeManager } from '@/systems/NarrativeManager';
import { WhisperSystem } from '@/systems/WhisperSystem';
import { LEVEL_NAMES } from '@/config';

export class GameScene extends Phaser.Scene {
  private player!: Player;
  private enemies: Enemy[] = [];
  private projectiles: Projectile[] = [];
  private chargedProjectiles: ChargedProjectile[] = [];
  private memoryShards: MemoryShard[] = [];
  private hud!: HUD;
  private particleManager!: ParticleManager;
  
  private playerState: PlayerState = {
    health: PLAYER_CONFIG.health,
    maxHealth: PLAYER_CONFIG.maxHealth,
    shield: PLAYER_CONFIG.shield,
    maxShield: PLAYER_CONFIG.maxShield,
    score: 0,
    combo: 0,
    level: 1,
    memoryShardsCollected: 0,
    activeBuffs: [],
    egoWeaponActive: false,
    enemiesKilled: 0,
    enemiesDodged: 0,
  };

  private levelConfig!: LevelConfig;
  private settings!: GameSettings;
  private currentWave: number = 0;
  private waveTimer: number = 0;
  private comboTimer: number = 0;
  private isPaused: boolean = false;
  private levelComplete: boolean = false;
  private whisperSystem?: WhisperSystem;
  private environmentManager?: EnvironmentManager;
  private timeSinceLastWave: number = 0;
  private choicePending: boolean = false;
  private l5ChoiceMade: boolean = false;
  private boss?: Boss;
  private bossProjectiles: Projectile[] = [];
  private bossSpawned: boolean = false;
  private l9SecondChoiceMade: boolean = false;

  constructor() {
    super({ key: 'GameScene' });
  }

  init(data: { level: number }): void {
    this.playerState.level = data.level || 1;
    this.levelConfig = LEVEL_CONFIGS[this.playerState.level - 1];
    
    // Reset state for new level
    this.enemies = [];
    this.projectiles = [];
    this.chargedProjectiles = [];
    this.memoryShards = [];
    this.currentWave = 0;
    this.waveTimer = 0;
    this.comboTimer = 0;
    this.isPaused = false;
    this.levelComplete = false;
    
    this.playerState.health = PLAYER_CONFIG.health;
    this.playerState.shield = PLAYER_CONFIG.shield;
    this.playerState.score = 0;
    this.playerState.combo = 0;
    this.playerState.memoryShardsCollected = 0;
    this.playerState.activeBuffs = [];
    this.playerState.egoWeaponActive = false;
    this.playerState.enemiesKilled = 0;
    this.playerState.enemiesDodged = 0;
    this.bossSpawned = false;
    this.boss = undefined;
    this.bossProjectiles = [];
    this.l5ChoiceMade = false;
    this.l9SecondChoiceMade = false;
    this.choicePending = false;
  }

  async create(): Promise<void> {
    // Load settings before creating game objects
    const save = await saveSystem.loadGame();
    this.settings = safeGetSettings(save?.settings);

    this.cameras.main.setBackgroundColor(0x0a0a1a);

    this.particleManager = new ParticleManager(this, this.settings);

    this.player = new Player(
      this,
      GAME_CONFIG.width / 2,
      GAME_CONFIG.height - 200,
      this.settings,
      this.particleManager
    );

    // Initialize HUD before any updates
    this.hud = new HUD(this, this.settings);
    this.hud.setQuote(this.levelConfig.quote);
    this.hud.setLevelName(LEVEL_NAMES[this.playerState.level] ?? '');
    this.hud.update(this.playerState);

    // Initialize environment manager for level-specific backgrounds
    const playArea = this.hud.getPlayableArea();
    this.environmentManager = new EnvironmentManager(this, this.playerState.level, playArea);

    // Apply mood shift based on emotional path from choices
    const emotionalPath = narrativeManager.computeEmotionalPath();
    this.environmentManager.applyMoodShift(emotionalPath);

    // Initialize whisper system for mid-level narrative
    this.whisperSystem = new WhisperSystem(this, this.playerState.level);
    this.timeSinceLastWave = 0;

    // Constrain player to playable area (within cockpit bounds)
    if (this.player && playArea) {
      this.player.setPlayableArea(playArea);
    }

    this.setupEventListeners();
    this.setupPauseControl();
    this.setupLevelMechanic();

    audioManager.stopMusic();
    audioManager.playMusic('gameplay_music', true);
    
    this.time.delayedCall(2000, () => {
      this.startNextWave();
    });
  }

  update(time: number, delta: number): void {
    if (this.isPaused || !this.hud) return;

    // Track time since last wave for whisper triggers
    this.timeSinceLastWave += delta;

    // Update environment visuals
    if (this.environmentManager) {
      this.environmentManager.update(delta);
    }

    if (this.player) {
      this.player.update(time, delta);
      this.playerState.health = this.player.health;
      this.playerState.shield = this.player.shield;
    }

    // Update whisper system
    if (this.whisperSystem) {
      this.whisperSystem.update(delta, {
        inCombat: this.enemies.length > 0,
        playerHealthPercent: this.playerState.health / this.playerState.maxHealth,
        timeSinceLastWave: this.timeSinceLastWave,
      });
    }

    // Adaptive audio: crossfade combat/ambient layers
    audioManager.setCombatState(this.enemies.length > 0);

    this.enemies.forEach((enemy, index) => {
      if (this.player) {
        enemy.update(delta, this.player.x, this.player.y);
      }

      if (enemy.isOffScreen()) {
        enemy.destroy();
        this.enemies.splice(index, 1);
      }

      if (this.player && Phaser.Math.Distance.Between(this.player.x, this.player.y, enemy.x, enemy.y) < 30) {
        this.player.takeDamage(ENEMY_TYPES[enemy.enemyType as keyof typeof ENEMY_TYPES].damage);
        enemy.takeDamage(999);
      }
    });

    this.projectiles.forEach((projectile, index) => {
      projectile.update(delta);

      if (projectile.isOffScreen()) {
        projectile.destroy();
        this.projectiles.splice(index, 1);
        return;
      }

      if (projectile.isPlayerProjectile) {
        this.enemies.forEach((enemy) => {
          if (Phaser.Math.Distance.Between(projectile.x, projectile.y, enemy.x, enemy.y) < 20) {
            const destroyed = enemy.takeDamage(projectile.damage);
            projectile.destroy();
            this.projectiles.splice(index, 1);
          }
        });
      } else {
        if (this.player && Phaser.Math.Distance.Between(projectile.x, projectile.y, this.player.x, this.player.y) < 20) {
          this.player.takeDamage(projectile.damage);
          projectile.destroy();
          this.projectiles.splice(index, 1);
        }
      }
    });

    this.chargedProjectiles.forEach((projectile, index) => {
      projectile.update(delta);

      if (projectile.isOffScreen()) {
        projectile.destroy();
        this.chargedProjectiles.splice(index, 1);
        return;
      }

      this.enemies.forEach((enemy) => {
        if (Phaser.Math.Distance.Between(projectile.x, projectile.y, enemy.x, enemy.y) < 30) {
          enemy.takeDamage(projectile.damage);
          this.particleManager.createExplosion(enemy.x, enemy.y, 0xffff00, 1);
        }
      });
    });

    this.memoryShards.forEach((shard, index) => {
      if (this.player && Phaser.Math.Distance.Between(this.player.x, this.player.y, shard.x, shard.y) < 30) {
        this.collectMemoryShard();
        shard.destroy();
        this.memoryShards.splice(index, 1);
      }
    });

    if (this.comboTimer > 0) {
      this.comboTimer -= delta;
      if (this.comboTimer <= 0) {
        this.playerState.combo = 0;
      }
    }

    this.hud.update(this.playerState);

    // Boss update and projectile handling
    if (this.boss) {
      if (this.player) {
        this.boss.update(delta, this.player.x, this.player.y);
      }
      this.bossProjectiles.forEach((p, i) => {
        p.update(delta);
        if (p.isOffScreen()) {
          p.destroy();
          this.bossProjectiles.splice(i, 1);
          return;
        }
        if (this.player && Phaser.Math.Distance.Between(p.x, p.y, this.player.x, this.player.y) < 20) {
          this.player.takeDamage(p.damage);
          p.destroy();
          this.bossProjectiles.splice(i, 1);
        }
      });
      this.projectiles.forEach((p, i) => {
        if (p.isPlayerProjectile && this.boss) {
          if (Phaser.Math.Distance.Between(p.x, p.y, this.boss.x, this.boss.y) < 40) {
            const killed = this.boss.takeDamage(p.damage);
            p.destroy();
            this.projectiles.splice(i, 1);
            if (killed) {
              this.boss = undefined;
              this.playerState.score += 5000;
            }
          }
        }
      });
    }

    if (this.currentWave < this.levelConfig.waves.length) {
      this.waveTimer += delta;
      if (this.waveTimer >= this.levelConfig.waves[this.currentWave].delay && this.enemies.length === 0) {
        this.startNextWave();
      }
    } else if (this.enemies.length === 0 && !this.boss && !this.levelComplete) {
      // Spawn boss for L5 (miniboss) and L10 (final boss) after all waves
      if (!this.bossSpawned && (this.playerState.level === 5 || this.playerState.level === 10)) {
        this.spawnBoss();
      } else {
        this.completeLevel();
      }
    }

    // L5 proximity-based choice: NPC encounter (trust_bridge)
    if (this.playerState.level === 5 && !this.l5ChoiceMade && !this.choicePending) {
      const alreadyMade = narrativeManager.getChoiceMade('trust_bridge');
      if (!alreadyMade && this.player && this.enemies.length === 0 && this.currentWave >= 2) {
        this.l5ChoiceMade = true;
        this.triggerChoice('trust_bridge');
      }
    }
  }

  private setupEventListeners(): void {
    this.events.on('playerFirePrimary', (data: { x: number; y: number; angle: number; damage?: number }) => {
      const projectile = new Projectile(
        this,
        data.x,
        data.y,
        data.angle,
        data.damage ?? PLAYER_CONFIG.primaryDamage,
        true,
        this.particleManager
      );
      this.projectiles.push(projectile);
    });

    this.events.on('playerFireSecondary', (data: { x: number; y: number; angle: number }) => {
      const projectile = new ChargedProjectile(this, data.x, data.y, data.angle, this.particleManager);
      this.chargedProjectiles.push(projectile);
    });

    this.events.on('enemyDestroyed', (data: { score: number; x: number; y: number }) => {
      this.playerState.combo++;
      this.playerState.enemiesKilled++;
      this.comboTimer = 3000;
      const comboMultiplier = Math.min(this.playerState.combo, 10);
      this.playerState.score += data.score * comboMultiplier;

      if (Math.random() < 0.15) {
        const shard = new MemoryShard(this, data.x, data.y);
        this.memoryShards.push(shard);
      }
    });

    this.events.on('playerDeath', () => {
      this.time.delayedCall(1000, () => {
        this.scene.start('GameOverScene', {
          score: this.playerState.score,
          level: this.playerState.level,
          victory: false
        });
      });
    });

    this.events.on('bossFireProjectile', (data: { x: number; y: number; angle: number }) => {
      const p = new Projectile(this, data.x, data.y, data.angle, 20, false, this.particleManager);
      this.bossProjectiles.push(p);
    });

    this.events.on('bossDestroyed', () => {
      this.playerState.score += 5000;
      this.boss = undefined;
      // Trigger level complete after short delay
      this.time.delayedCall(1500, () => {
        if (!this.levelComplete) this.completeLevel();
      });
    });
  }

  private setupPauseControl(): void {
    if (this.input.keyboard) {
      const pauseKey = this.input.keyboard.addKey(this.settings.controls.pause);
      pauseKey.on('down', () => {
        this.togglePause();
      });
    }
  }

  private togglePause(): void {
    this.isPaused = !this.isPaused;
    if (this.isPaused) {
      this.scene.pause();
      this.scene.launch('PauseScene');
      audioManager.pauseMusic();
    }
  }

  private startNextWave(): void {
    if (this.currentWave >= this.levelConfig.waves.length) return;

    const wave = this.levelConfig.waves[this.currentWave];
    const formation = wave.formation || 'random';

    for (let i = 0; i < wave.count; i++) {
      let x: number, y: number;

      switch (formation) {
        case 'line':
          x = (GAME_CONFIG.width / (wave.count + 1)) * (i + 1);
          y = -50;
          break;
        case 'v':
          x = GAME_CONFIG.width / 2 + (i - wave.count / 2) * 60;
          y = -50 - Math.abs(i - wave.count / 2) * 30;
          break;
        case 'circle':
          const angle = (Math.PI * 2 / wave.count) * i;
          x = GAME_CONFIG.width / 2 + Math.cos(angle) * 200;
          y = 100 + Math.sin(angle) * 200;
          break;
        default:
          x = Phaser.Math.Between(50, GAME_CONFIG.width - 50);
          y = Phaser.Math.Between(-100, -50);
      }

      const enemy = new Enemy(
        this,
        x,
        y,
        ENEMY_TYPES[wave.enemyType],
        this.settings,
        this.particleManager
      );
      this.enemies.push(enemy);
    }

    this.currentWave++;
    this.waveTimer = 0;
  }

  private collectMemoryShard(): void {
    this.playerState.memoryShardsCollected++;
    this.playerState.score += 500;
    audioManager.playSfx('powerup', 0.6);
    
    this.player.health = Math.min(this.player.health + 20, this.player.maxHealth);
    this.player.shield = Math.min(this.player.shield + 30, this.player.maxShield);
  }

  private async completeLevel(): Promise<void> {
    this.levelComplete = true;
    audioManager.playSfx('level_complete', 0.8);

    await saveSystem.completeLevel(
      this.playerState.level,
      this.playerState.score,
      this.playerState.memoryShardsCollected,
      this.player.health === this.player.maxHealth
    );

    await saveSystem.addLeaderboardEntry({
      playerName: 'Pilot',
      score: this.playerState.score,
      level: this.playerState.level,
      timestamp: Date.now()
    });

    // Unlock journal entries for completed level
    await saveSystem.updateJournalUnlock(this.playerState.level, {
      quoteUnlocked: true,
      reflectionUnlocked: true,
      whispersUnlocked: true,
    });

    const level = this.playerState.level;

    // L7: Behavior detection — organic choice based on kill/dodge ratio
    if (level === 7) {
      const alreadyMade = narrativeManager.getChoiceMade('chaos_current');
      if (!alreadyMade) {
        const total = this.playerState.enemiesKilled + this.playerState.enemiesDodged;
        const aggRatio = total > 0 ? this.playerState.enemiesKilled / total : 0.5;
        // Auto-record based on behavior — aggressive if killed >60%, defensive otherwise
        const selectedOption = aggRatio > 0.6 ? 'aggressive' : 'defensive';
        narrativeManager.recordChoice('chaos_current', selectedOption, level);
        await narrativeManager.save();
      }
    }

    // L9: TWO choices — helm_mercy first, then helm_risk
    if (level === 9) {
      const mercyMade = narrativeManager.getChoiceMade('helm_mercy');
      const riskMade = narrativeManager.getChoiceMade('helm_risk');

      if (!mercyMade) {
        this.time.delayedCall(1000, () => {
          // After mercy choice, chain to risk choice via ChoiceScene returnData
          this.scene.start('ChoiceScene', {
            choiceId: 'helm_mercy',
            returnScene: 'ChoiceScene',
            returnData: {
              choiceId: 'helm_risk',
              returnScene: 'GameOverScene',
              returnData: {
                score: this.playerState.score,
                level: this.playerState.level,
                victory: true,
              },
            },
          });
        });
        return;
      } else if (!riskMade) {
        this.time.delayedCall(1000, () => {
          this.triggerChoice('helm_risk');
        });
        return;
      }
    }

    // L10: homecoming — final choice before ending
    if (level === 10) {
      const alreadyMade = narrativeManager.getChoiceMade('homecoming');
      if (!alreadyMade) {
        this.time.delayedCall(1000, () => {
          this.triggerChoice('homecoming');
        });
        return;
      }
    }

    this.time.delayedCall(2000, () => {
      this.scene.start('GameOverScene', {
        score: this.playerState.score,
        level: this.playerState.level,
        victory: true
      });
    });
  }

  private spawnBoss(): void {
    this.bossSpawned = true;
    const bossKey = this.playerState.level === 5 ? 'miniboss_1' : 'final_boss';
    const bossData = BOSS_DATA[bossKey];
    if (!bossData) return;

    this.showMechanicHint(
      this.playerState.level === 5 ? '[ WARDEN INCOMING ]' : '[ THE KEEPER — FINAL CONFRONTATION ]'
    );

    this.time.delayedCall(1000, () => {
      this.boss = new Boss(
        this,
        GAME_CONFIG.width / 2,
        -80,
        bossData,
        this.particleManager
      );
    });
  }

  private setupLevelMechanic(): void {
    const level = this.playerState.level;

    switch (level) {
      case 1:
        // Ghost afterimage — visual echo of player movement
        if (this.player) {
          this.player.enableGhostAfterimage();
        }
        break;

      case 2:
        // Fog zones — reduce visibility for player
        if (this.player) {
          this.player.enableFogEffect();
        }
        break;

      case 4:
        // Quiet Signals — show telegraph hint to player
        this.showMechanicHint('[ LISTEN ] Watch for enemy glow — dodge before they fire');
        // Enemies in L4 use 'sniper' type which already has a slow fire pattern
        break;

      case 6:
        // Ego weapon — bind E key to toggle
        if (this.input.keyboard) {
          const eKey = this.input.keyboard.addKey('E');
          eKey.on('down', () => {
            if (this.player) {
              this.player.toggleEgoWeapon();
              this.playerState.egoWeaponActive = this.player.egoWeaponActive;
            }
          });
          // Show brief hint
          this.showMechanicHint('[ E ] — TOGGLE EGO WEAPON  |  3x Damage / Shield Drain');
        }
        break;

      case 8:
        // Power-up spawning — memory shards become power-ups
        this.events.on('enemyDestroyed', () => {
          if (Math.random() < 0.08) {
            this.spawnPowerUp();
          }
        });
        break;

      default:
        break;
    }
  }

  private showMechanicHint(text: string): void {
    const playArea = this.hud.getPlayableArea();
    const hint = this.add.text(
      playArea.x + playArea.width / 2,
      playArea.y + 20,
      text,
      {
        fontSize: '14px',
        fontFamily: 'monospace',
        color: '#ffaa00',
      }
    ).setOrigin(0.5).setDepth(990).setAlpha(0);

    this.tweens.add({
      targets: hint,
      alpha: 1,
      duration: 600,
      hold: 3000,
      yoyo: true,
      onComplete: () => hint.destroy(),
    });
  }

  private spawnPowerUp(): void {
    const x = Phaser.Math.Between(100, GAME_CONFIG.width - 100);
    const y = -30;
    const shard = new MemoryShard(this, x, y);
    this.memoryShards.push(shard);
  }

  private triggerChoice(choiceId: string): void {
    this.choicePending = true;
    this.scene.start('ChoiceScene', {
      choiceId,
      returnScene: 'GameOverScene',
      returnData: {
        score: this.playerState.score,
        level: this.playerState.level,
        victory: true,
      },
    });
  }

  resumeGame(): void {
    this.isPaused = false;
    this.scene.resume();
    audioManager.resumeMusic();
  }
}
