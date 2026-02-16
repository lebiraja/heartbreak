import Phaser from 'phaser';
import type { GameSettings } from '@/types';

export class ParticleManager {
  private scene: Phaser.Scene;
  private settings: GameSettings;

  constructor(scene: Phaser.Scene, settings: GameSettings) {
    this.scene = scene;
    this.settings = settings;
  }

  createExplosion(x: number, y: number, color: number = 0xff6600, size: number = 1): void {
    if (!this.settings.particles) return;

    const particleCount = Math.floor(20 * size);
    const graphics = this.scene.add.graphics();
    graphics.fillStyle(color, 1);
    graphics.fillCircle(2, 2, 2);
    graphics.generateTexture('particle_explosion', 4, 4);
    graphics.destroy();

    const emitter = this.scene.add.particles(x, y, 'particle_explosion', {
      speed: { min: 50 * size, max: 200 * size },
      angle: { min: 0, max: 360 },
      scale: { start: 1 * size, end: 0 },
      alpha: { start: 1, end: 0 },
      lifespan: 600,
      blendMode: 'ADD',
      quantity: particleCount
    });

    this.scene.time.delayedCall(600, () => {
      emitter.destroy();
    });
  }

  createTrail(x: number, y: number, color: number = 0x00ffff): Phaser.GameObjects.Particles.ParticleEmitter | null {
    if (!this.settings.particles) return null;

    const graphics = this.scene.add.graphics();
    graphics.fillStyle(color, 1);
    graphics.fillCircle(1, 1, 1);
    graphics.generateTexture('particle_trail', 2, 2);
    graphics.destroy();

    return this.scene.add.particles(x, y, 'particle_trail', {
      speed: 20,
      scale: { start: 0.8, end: 0 },
      alpha: { start: 0.8, end: 0 },
      lifespan: 300,
      blendMode: 'ADD',
      frequency: 30
    });
  }

  createHitEffect(x: number, y: number, color: number = 0xffff00): void {
    if (!this.settings.particles) return;

    const graphics = this.scene.add.graphics();
    graphics.fillStyle(color, 1);
    graphics.fillCircle(2, 2, 2);
    graphics.generateTexture('particle_hit', 4, 4);
    graphics.destroy();

    const emitter = this.scene.add.particles(x, y, 'particle_hit', {
      speed: { min: 30, max: 100 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.8, end: 0 },
      alpha: { start: 1, end: 0 },
      lifespan: 300,
      blendMode: 'ADD',
      quantity: 5
    });

    this.scene.time.delayedCall(300, () => {
      emitter.destroy();
    });
  }

  createShieldHit(x: number, y: number): void {
    if (!this.settings.particles) return;

    const circle = this.scene.add.circle(x, y, 40, 0x00ffff, 0.3);
    circle.setStrokeStyle(3, 0x00ffff, 1);
    
    this.scene.tweens.add({
      targets: circle,
      scale: 1.5,
      alpha: 0,
      duration: 300,
      onComplete: () => circle.destroy()
    });
  }

  screenShake(intensity: number = 0.01): void {
    if (!this.settings.screenShake || this.settings.reducedMotion) return;
    
    this.scene.cameras.main.shake(200, intensity);
  }
}
