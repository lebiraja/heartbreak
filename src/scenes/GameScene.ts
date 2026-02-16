import Phaser from 'phaser';
import { GAME_CONFIG, PLAYER_CONFIG, ENEMY_TYPES, LEVEL_CONFIGS } from '@/config';
import type { PlayerState, LevelConfig, GameSettings } from '@/types';
import { Player } from '@/entities/Player';
import { Enemy } from '@/entities/Enemy';
import { Projectile, ChargedProjectile, MemoryShard } from '@/entities/Projectile';
import { HUD } from '@/ui/HUD';
import { ParticleManager } from '@/systems/ParticleManager';
import { saveSystem } from '@/systems/SaveSystem';
import { audioManager } from '@/systems/AudioManager';
import { safeGetSettings } from '@/utils/settingsHelper';

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
    memoryShardsCollected: 0
  };

  private levelConfig!: LevelConfig;
  private settings!: GameSettings;
  private currentWave: number = 0;
  private waveTimer: number = 0;
  private comboTimer: number = 0;
  private isPaused: boolean = false;
  private levelComplete: boolean = false;

  constructor() {
    super({ key: 'GameScene' });
  }

  init(data: { level: number }): void {
    this.playerState.level = data.level || 1;
    this.levelConfig = LEVEL_CONFIGS[this.playerState.level - 1];
  }

  async create(): Promise<void> {
    // Load settings before creating game objects
    const save = await saveSystem.loadGame();
    this.settings = safeGetSettings(save?.settings);

    this.cameras.main.setBackgroundColor(0x0a0a1a);
    this.createStarfield();

    this.particleManager = new ParticleManager(this, this.settings);

    this.player = new Player(
      this,
      GAME_CONFIG.width / 2,
      GAME_CONFIG.height - 200,
      this.settings,
      this.particleManager
    );

    this.hud = new HUD(this, this.settings);
    this.hud.setQuote(this.levelConfig.quote);

    this.setupEventListeners();
    this.setupPauseControl();

    audioManager.stopMusic();
    audioManager.playMusic('gameplay_music', true);
    
    this.time.delayedCall(2000, () => {
      this.startNextWave();
    });
  }

  update(time: number, delta: number): void {
    if (this.isPaused) return;

    if (this.player) {
      this.player.update(time, delta);
      this.playerState.health = this.player.health;
      this.playerState.shield = this.player.shield;
    }

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

    if (this.currentWave < this.levelConfig.waves.length) {
      this.waveTimer += delta;
      if (this.waveTimer >= this.levelConfig.waves[this.currentWave].delay && this.enemies.length === 0) {
        this.startNextWave();
      }
    } else if (this.enemies.length === 0 && !this.levelComplete) {
      this.completeLevel();
    }
  }

  private setupEventListeners(): void {
    this.events.on('playerFirePrimary', (data: { x: number; y: number; angle: number }) => {
      const projectile = new Projectile(
        this,
        data.x,
        data.y,
        data.angle,
        PLAYER_CONFIG.primaryDamage,
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

    this.time.delayedCall(2000, () => {
      this.scene.start('GameOverScene', {
        score: this.playerState.score,
        level: this.playerState.level,
        victory: true
      });
    });
  }

  private createStarfield(): void {
    const stars = this.add.group();
    for (let i = 0; i < 50; i++) {
      const x = Phaser.Math.Between(0, GAME_CONFIG.width);
      const y = Phaser.Math.Between(0, GAME_CONFIG.height);
      const star = this.add.circle(x, y, 1, 0xffffff, 0.8);
      stars.add(star);
    }

    this.tweens.add({
      targets: stars.getChildren(),
      y: '+=720',
      duration: 3000,
      repeat: -1,
      onRepeat: (tween, target: any) => {
        target.y = -10;
        target.x = Phaser.Math.Between(0, GAME_CONFIG.width);
      }
    });
  }

  resumeGame(): void {
    this.isPaused = false;
    this.scene.resume();
    audioManager.resumeMusic();
  }
}
