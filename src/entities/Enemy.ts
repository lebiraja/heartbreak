import Phaser from 'phaser';
import type { EnemyData, GameSettings } from '@/types';
import { COLORS } from '@/config';
import { ParticleManager } from '@/systems/ParticleManager';
import { audioManager } from '@/systems/AudioManager';

export class Enemy extends Phaser.GameObjects.Container {
  public health: number;
  public maxHealth: number;
  public scoreValue: number;
  public enemyType: string;

  private enemyData: EnemyData;
  private ship: Phaser.GameObjects.Graphics;
  private afterimage: Phaser.GameObjects.Graphics | null = null;
  private telegraphTimer: number = 0;
  private target: Phaser.Math.Vector2 | null = null;
  private aiTimer: number = 0;
  private particleManager: ParticleManager;
  private settings: GameSettings;
  // Mirror mode: player X reference
  private mirrorPlayerX: number = 640;
  // Invisible mode state
  private isVisible_: boolean = true;
  private invisibleFlashTimer: number = 0;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    enemyData: EnemyData,
    settings: GameSettings,
    particleManager: ParticleManager
  ) {
    super(scene, x, y);

    this.enemyData = enemyData;
    this.enemyType = enemyData.type;
    this.health = enemyData.health;
    this.maxHealth = enemyData.health;
    this.scoreValue = enemyData.scoreValue;
    this.settings = settings;
    this.particleManager = particleManager;

    this.ship = scene.add.graphics();
    this.drawShip();
    this.add(this.ship);

    scene.add.existing(this);
  }

  private drawShip(): void {
    this.ship.clear();
    
    const color = this.getShipColor();
    
    this.ship.lineStyle(2, color, 1);
    this.ship.fillStyle(color, 0.6);

    switch (this.enemyType) {
      case 'basic':
        this.ship.fillTriangle(0, 10, -8, -10, 8, -10);
        this.ship.strokeTriangle(0, 10, -8, -10, 8, -10);
        break;
      case 'fast':
        this.ship.beginPath();
        this.ship.moveTo(0, 12);
        this.ship.lineTo(-6, -12);
        this.ship.lineTo(0, -8);
        this.ship.lineTo(6, -12);
        this.ship.closePath();
        this.ship.fillPath();
        this.ship.strokePath();
        break;
      case 'tank':
        this.ship.fillRect(-10, -10, 20, 20);
        this.ship.strokeRect(-10, -10, 20, 20);
        this.ship.fillCircle(0, 0, 5);
        break;
      case 'sniper':
        this.ship.beginPath();
        this.ship.moveTo(0, 15);
        this.ship.lineTo(-10, 0);
        this.ship.lineTo(-5, -15);
        this.ship.lineTo(5, -15);
        this.ship.lineTo(10, 0);
        this.ship.closePath();
        this.ship.fillPath();
        this.ship.strokePath();
        break;
    }
  }

  private getShipColor(): number {
    const mode = this.settings.colorBlindMode;
    if (mode !== 'none') {
      return COLORS.colorBlind[mode].enemy;
    }
    return COLORS.secondary;
  }

  update(delta: number, playerX: number, playerY: number): void {
    this.updateAI(delta, playerX, playerY);
    this.move(delta);
  }

  private updateAI(delta: number, playerX: number, playerY: number): void {
    this.aiTimer += delta;

    switch (this.enemyData.aiPattern) {
      case 'straight':
        this.target = new Phaser.Math.Vector2(this.x, this.y + 100);
        break;
      
      case 'zigzag':
        if (this.aiTimer > 500) {
          const offset = Math.sin(Date.now() / 200) * 100;
          this.target = new Phaser.Math.Vector2(this.x + offset, this.y + 50);
          this.aiTimer = 0;
        }
        break;
      
      case 'chase':
        this.target = new Phaser.Math.Vector2(playerX, playerY);
        break;
      
      case 'strafe':
        if (this.aiTimer > 800) {
          const angle = Math.atan2(playerY - this.y, playerX - this.x);
          const perpAngle = angle + Math.PI / 2;
          const strafeDir = Math.random() > 0.5 ? 1 : -1;
          this.target = new Phaser.Math.Vector2(
            this.x + Math.cos(perpAngle) * strafeDir * 100,
            this.y + Math.sin(perpAngle) * strafeDir * 100
          );
          this.aiTimer = 0;
        }
        break;

      case 'mirror':
        // Mirror: move to inverted X-axis position of player
        this.mirrorPlayerX = playerX;
        {
          const mirrorX = this.scene.cameras.main.width - playerX;
          this.target = new Phaser.Math.Vector2(mirrorX, playerY - 120);
        }
        break;

      case 'invisible':
        // Invisible enemy: mostly invisible, flashes telegraph before attacking
        this.invisibleFlashTimer += delta;
        this.telegraphTimer += delta;

        // Telegraph every 3 seconds: flash visible briefly
        if (this.telegraphTimer > 3000) {
          this.telegraphTimer = 0;
          this.ship.setAlpha(0.8);
          this.scene.time.delayedCall(400, () => {
            if (this.active) this.ship.setAlpha(0.05);
          });
        }
        // Move straight down while hidden
        this.target = new Phaser.Math.Vector2(this.x, this.y + 80);
        if (this.isVisible_) {
          this.ship.setAlpha(0.05);
          this.isVisible_ = false;
        }
        break;
    }
  }

  private move(delta: number): void {
    if (!this.target) return;

    const direction = new Phaser.Math.Vector2(
      this.target.x - this.x,
      this.target.y - this.y
    ).normalize();

    this.x += direction.x * this.enemyData.speed * (delta / 1000);
    this.y += direction.y * this.enemyData.speed * (delta / 1000);

    const angle = Math.atan2(direction.y, direction.x);
    this.rotation = angle + Math.PI / 2;
  }

  takeDamage(amount: number): boolean {
    this.health -= amount;
    
    this.particleManager.createHitEffect(this.x, this.y);
    
    this.scene.tweens.add({
      targets: this.ship,
      alpha: 0.5,
      duration: 50,
      yoyo: true
    });

    if (this.health <= 0) {
      this.onDeath();
      return true;
    }
    return false;
  }

  private onDeath(): void {
    this.particleManager.createExplosion(this.x, this.y, this.getShipColor(), 1.5);
    audioManager.playSfx('enemy_death', 0.4);
    this.scene.events.emit('enemyDestroyed', { score: this.scoreValue, x: this.x, y: this.y });
    this.destroy();
  }

  isOffScreen(): boolean {
    const cam = this.scene.cameras.main;
    return this.y > cam.height + 50 || this.y < -50 || this.x < -50 || this.x > cam.width + 50;
  }
}
