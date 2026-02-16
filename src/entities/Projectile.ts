import Phaser from 'phaser';
import { PLAYER_CONFIG, COLORS } from '@/config';
import { ParticleManager } from '@/systems/ParticleManager';

export class Projectile extends Phaser.GameObjects.Graphics {
  public damage: number;
  public isPlayerProjectile: boolean;
  
  private velocity: Phaser.Math.Vector2;
  private speed: number = 600;
  private trailEmitter: Phaser.GameObjects.Particles.ParticleEmitter | null = null;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    angle: number,
    damage: number,
    isPlayerProjectile: boolean,
    particleManager: ParticleManager
  ) {
    super(scene);

    this.x = x;
    this.y = y;
    this.damage = damage;
    this.isPlayerProjectile = isPlayerProjectile;

    const color = isPlayerProjectile ? COLORS.accent : COLORS.secondary;
    this.fillStyle(color, 1);
    this.fillCircle(0, 0, 3);

    this.velocity = new Phaser.Math.Vector2(
      Math.cos(angle) * this.speed,
      Math.sin(angle) * this.speed
    );

    this.trailEmitter = particleManager.createTrail(x, y, color);
    if (this.trailEmitter) {
      this.trailEmitter.startFollow(this);
    }

    scene.add.existing(this);
  }

  update(delta: number): void {
    this.x += this.velocity.x * (delta / 1000);
    this.y += this.velocity.y * (delta / 1000);
  }

  isOffScreen(): boolean {
    const cam = this.scene.cameras.main;
    return this.x < -10 || this.x > cam.width + 10 || this.y < -10 || this.y > cam.height + 10;
  }

  destroy(fromScene?: boolean): void {
    if (this.trailEmitter) {
      this.trailEmitter.destroy();
    }
    super.destroy(fromScene);
  }
}

export class ChargedProjectile extends Phaser.GameObjects.Container {
  public damage: number;
  public isPlayerProjectile: boolean = true;
  
  private velocity: Phaser.Math.Vector2;
  private speed: number = 400;
  private core: Phaser.GameObjects.Graphics;
  private trailEmitter: Phaser.GameObjects.Particles.ParticleEmitter | null = null;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    angle: number,
    particleManager: ParticleManager
  ) {
    super(scene, x, y);

    this.damage = PLAYER_CONFIG.secondaryDamage;

    this.core = scene.add.graphics();
    this.core.fillStyle(COLORS.accent, 1);
    this.core.fillCircle(0, 0, 8);
    this.core.lineStyle(2, 0xffffff, 1);
    this.core.strokeCircle(0, 0, 8);
    this.add(this.core);

    this.velocity = new Phaser.Math.Vector2(
      Math.cos(angle) * this.speed,
      Math.sin(angle) * this.speed
    );

    this.trailEmitter = particleManager.createTrail(x, y, COLORS.accent);
    if (this.trailEmitter) {
      this.trailEmitter.startFollow(this);
    }

    scene.tweens.add({
      targets: this.core,
      alpha: 0.6,
      duration: 200,
      yoyo: true,
      repeat: -1
    });

    scene.add.existing(this);
  }

  update(delta: number): void {
    this.x += this.velocity.x * (delta / 1000);
    this.y += this.velocity.y * (delta / 1000);
    this.rotation += 0.1;
  }

  isOffScreen(): boolean {
    const cam = this.scene.cameras.main;
    return this.x < -20 || this.x > cam.width + 20 || this.y < -20 || this.y > cam.height + 20;
  }

  destroy(fromScene?: boolean): void {
    if (this.trailEmitter) {
      this.trailEmitter.destroy();
    }
    super.destroy(fromScene);
  }
}

export class MemoryShard extends Phaser.GameObjects.Container {
  private crystal: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    this.crystal = scene.add.graphics();
    this.crystal.fillStyle(COLORS.primary, 0.8);
    this.crystal.lineStyle(2, 0xffffff, 1);
    
    this.crystal.beginPath();
    this.crystal.moveTo(0, -10);
    this.crystal.lineTo(6, 0);
    this.crystal.lineTo(0, 10);
    this.crystal.lineTo(-6, 0);
    this.crystal.closePath();
    this.crystal.fillPath();
    this.crystal.strokePath();
    
    this.add(this.crystal);

    scene.tweens.add({
      targets: this,
      y: y - 10,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    scene.tweens.add({
      targets: this,
      rotation: Math.PI * 2,
      duration: 3000,
      repeat: -1
    });

    scene.add.existing(this);
  }
}
