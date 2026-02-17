import Phaser from 'phaser';
import { PLAYER_CONFIG, COLORS } from '@/config';
import type { GameSettings, WeaponData } from '@/types';
import { ParticleManager } from '@/systems/ParticleManager';
import { audioManager } from '@/systems/AudioManager';

export class Player extends Phaser.GameObjects.Container {
  public health: number;
  public maxHealth: number;
  public shield: number;
  public maxShield: number;
  public isInvulnerable: boolean = false;
  
  private ship: Phaser.GameObjects.Graphics;
  private shieldVisual: Phaser.GameObjects.Arc | null = null;
  private velocity: Phaser.Math.Vector2;
  private keys: Map<string, Phaser.Input.Keyboard.Key>;
  private pointer: Phaser.Input.Pointer;
  private lastFireTime: number = 0;
  private secondaryCharging: boolean = false;
  private chargeStartTime: number = 0;
  private particleManager: ParticleManager;
  private settings: GameSettings;
  private shieldRegenTimer: number = 0;
  private trailEmitter: Phaser.GameObjects.Particles.ParticleEmitter | null = null;

  constructor(scene: Phaser.Scene, x: number, y: number, settings: GameSettings, particleManager: ParticleManager) {
    super(scene, x, y);
    
    this.settings = settings;
    this.particleManager = particleManager;
    this.health = PLAYER_CONFIG.health;
    this.maxHealth = PLAYER_CONFIG.maxHealth;
    this.shield = PLAYER_CONFIG.shield;
    this.maxShield = PLAYER_CONFIG.maxShield;
    this.velocity = new Phaser.Math.Vector2(0, 0);

    this.ship = scene.add.graphics();
    this.drawShip();
    this.add(this.ship);

    this.keys = new Map();
    const keyConfig = settings.controls;
    if (scene.input.keyboard) {
      this.keys.set('up', scene.input.keyboard.addKey(keyConfig.moveUp));
      this.keys.set('down', scene.input.keyboard.addKey(keyConfig.moveDown));
      this.keys.set('left', scene.input.keyboard.addKey(keyConfig.moveLeft));
      this.keys.set('right', scene.input.keyboard.addKey(keyConfig.moveRight));
    }

    this.pointer = scene.input.activePointer;

    this.trailEmitter = particleManager.createTrail(0, 0, COLORS.primary);
    if (this.trailEmitter) {
      this.trailEmitter.startFollow(this);
    }

    scene.add.existing(this);
  }

  private drawShip(): void {
    this.ship.clear();
    
    const color = this.getShipColor();
    
    this.ship.lineStyle(2, color, 1);
    this.ship.fillStyle(color, 0.8);
    
    this.ship.beginPath();
    this.ship.moveTo(0, -20);
    this.ship.lineTo(-12, 15);
    this.ship.lineTo(0, 10);
    this.ship.lineTo(12, 15);
    this.ship.closePath();
    this.ship.fillPath();
    this.ship.strokePath();
    
    this.ship.fillStyle(0xffffff, 0.9);
    this.ship.fillCircle(0, 0, 3);
  }

  private getShipColor(): number {
    const mode = this.settings.colorBlindMode;
    if (mode === 'protanopia' || mode === 'deuteranopia') {
      return COLORS.colorBlind[mode].player;
    } else if (mode === 'tritanopia') {
      return COLORS.colorBlind.tritanopia.player;
    }
    return COLORS.primary;
  }

  update(time: number, delta: number): void {
    this.handleMovement(delta);
    this.handleAiming();
    this.handleShooting(time);
    this.handleShieldRegen(delta);
    this.constrainToScreen();
  }

  private handleMovement(delta: number): void {
    const speed = PLAYER_CONFIG.speed;
    this.velocity.set(0, 0);

    if (this.keys.get('up')?.isDown) this.velocity.y = -1;
    if (this.keys.get('down')?.isDown) this.velocity.y = 1;
    if (this.keys.get('left')?.isDown) this.velocity.x = -1;
    if (this.keys.get('right')?.isDown) this.velocity.x = 1;

    if (this.velocity.length() > 0) {
      this.velocity.normalize();
      this.x += this.velocity.x * speed * (delta / 1000);
      this.y += this.velocity.y * speed * (delta / 1000);
    }
  }

  private handleAiming(): void {
    const angle = Phaser.Math.Angle.Between(this.x, this.y, this.pointer.worldX, this.pointer.worldY);
    this.rotation = angle + Math.PI / 2;
  }

  private handleShooting(time: number): void {
    if (this.pointer.leftButtonDown() && time > this.lastFireTime + PLAYER_CONFIG.primaryFireRate) {
      this.firePrimary();
      this.lastFireTime = time;
    }

    if (this.pointer.rightButtonDown()) {
      if (!this.secondaryCharging) {
        this.secondaryCharging = true;
        this.chargeStartTime = time;
      }
    } else if (this.secondaryCharging) {
      const chargeTime = time - this.chargeStartTime;
      if (chargeTime >= PLAYER_CONFIG.secondaryChargeTime) {
        this.fireSecondary();
      }
      this.secondaryCharging = false;
    }
  }

  private firePrimary(): void {
    const angle = this.rotation - Math.PI / 2;
    const spawnX = this.x + Math.cos(angle) * 20;
    const spawnY = this.y + Math.sin(angle) * 20;

    this.scene.events.emit('playerFirePrimary', { x: spawnX, y: spawnY, angle });
    audioManager.playSfx('shoot_primary', 0.3);
    this.particleManager.screenShake(0.005);
  }

  private fireSecondary(): void {
    const angle = this.rotation - Math.PI / 2;
    const spawnX = this.x + Math.cos(angle) * 20;
    const spawnY = this.y + Math.sin(angle) * 20;

    this.scene.events.emit('playerFireSecondary', { x: spawnX, y: spawnY, angle });
    audioManager.playSfx('shoot_secondary', 0.5);
    this.particleManager.screenShake(0.015);
  }

  private handleShieldRegen(delta: number): void {
    if (this.shield < this.maxShield) {
      this.shieldRegenTimer += delta;
      if (this.shieldRegenTimer >= PLAYER_CONFIG.shieldRegenDelay) {
        this.shield += PLAYER_CONFIG.shieldRegenRate * (delta / 1000);
        this.shield = Math.min(this.shield, this.maxShield);
        this.updateShieldVisual();
      }
    }
  }

  takeDamage(amount: number): void {
    if (this.isInvulnerable) return;

    if (this.shield > 0) {
      this.shield -= amount;
      if (this.shield < 0) {
        this.health += this.shield;
        this.shield = 0;
      }
      this.shieldRegenTimer = 0;
      this.particleManager.createShieldHit(this.x, this.y);
      audioManager.playSfx('shield_hit', 0.4);
    } else {
      this.health -= amount;
      this.particleManager.createHitEffect(this.x, this.y, 0xff0000);
      audioManager.playSfx('player_hit', 0.5);
      this.particleManager.screenShake(0.02);
    }

    this.updateShieldVisual();

    if (this.health <= 0) {
      this.health = 0;
      this.onDeath();
    } else {
      this.becomeInvulnerable();
    }
  }

  private becomeInvulnerable(): void {
    this.isInvulnerable = true;
    this.scene.tweens.add({
      targets: this,
      alpha: 0.5,
      duration: 200,
      yoyo: true,
      repeat: PLAYER_CONFIG.invulnerabilityTime / 400
    });

    this.scene.time.delayedCall(PLAYER_CONFIG.invulnerabilityTime, () => {
      this.isInvulnerable = false;
      this.alpha = 1;
    });
  }

  private updateShieldVisual(): void {
    if (this.shieldVisual) {
      this.shieldVisual.destroy();
      this.shieldVisual = null;
    }

    if (this.shield > 0) {
      const alpha = this.shield / this.maxShield;
      this.shieldVisual = this.scene.add.circle(0, 0, 30, COLORS.primary, alpha * 0.2);
      this.shieldVisual.setStrokeStyle(2, COLORS.primary, alpha * 0.8);
      this.add(this.shieldVisual);
      this.sendToBack(this.shieldVisual);
    }
  }

  private onDeath(): void {
    this.particleManager.createExplosion(this.x, this.y, 0xff0000, 2);
    audioManager.playSfx('player_death', 0.7);
    this.scene.events.emit('playerDeath');
    this.destroy();
  }

  private playableArea?: Phaser.Geom.Rectangle;

  setPlayableArea(area: Phaser.Geom.Rectangle): void {
    this.playableArea = area;
  }

  private constrainToScreen(): void {
    if (this.playableArea) {
      const margin = 10;
      this.x = Phaser.Math.Clamp(this.x, this.playableArea.x + margin, this.playableArea.x + this.playableArea.width - margin);
      this.y = Phaser.Math.Clamp(this.y, this.playableArea.y + margin, this.playableArea.y + this.playableArea.height - margin);
    } else {
      const cam = this.scene.cameras.main;
      this.x = Phaser.Math.Clamp(this.x, 30, cam.width - 30);
      this.y = Phaser.Math.Clamp(this.y, 30, cam.height - 30);
    }
  }

  destroy(fromScene?: boolean): void {
    if (this.trailEmitter) {
      this.trailEmitter.destroy();
    }
    super.destroy(fromScene);
  }
}
