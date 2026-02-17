import Phaser from 'phaser';
import type { GameSettings, DamageEffectConfig } from '@/types';
import { DAMAGE_EFFECT_CONFIG } from '@/config';

export class ParticleManager {
  private scene: Phaser.Scene;
  private settings: GameSettings;

  // Screen crack overlay for cinematic damage
  private screenCrack?: Phaser.GameObjects.Graphics;
  private screenCrackTimer: number = 0;

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

  /**
   * Cinematic heavy hit effect: bullet-time + red flash + camera zoom + optional screen crack.
   */
  cinematicDamageEffect(x: number, y: number, damage: number): void {
    if (this.settings.reducedMotion) {
      // Minimal fallback
      this.screenShake(0.015);
      return;
    }

    const config = DAMAGE_EFFECT_CONFIG;

    if (damage < config.heavyHitThreshold) {
      // Light hit — just shake
      this.screenShake(0.01);
      return;
    }

    // Red flash overlay
    if (config.redFlash) {
      const flash = this.scene.add.rectangle(
        this.scene.cameras.main.width / 2,
        this.scene.cameras.main.height / 2,
        this.scene.cameras.main.width,
        this.scene.cameras.main.height,
        0xff0000,
        0.25
      ).setDepth(999).setScrollFactor(0);

      this.scene.tweens.add({
        targets: flash,
        alpha: 0,
        duration: 300,
        onComplete: () => flash.destroy(),
      });
    }

    // Bullet-time slow motion
    if (config.bulletTimeEnabled) {
      this.scene.time.timeScale = 0.25;
      this.scene.time.delayedCall(config.bulletTimeDuration * 0.25, () => {
        this.scene.tweens.add({
          targets: this.scene.time,
          timeScale: 1,
          duration: 200,
        });
      });
    }

    // Camera zoom
    if (config.cameraZoom) {
      const cam = this.scene.cameras.main;
      cam.zoomTo(1.08, 150, 'Linear', false, (cam: any, progress: number) => {
        if (progress === 1) {
          cam.zoomTo(1, 300);
        }
      });
    }

    // Screen crack
    if (config.screenCrack) {
      this.drawScreenCrack(x, y);
    }

    // Strong shake
    if (this.settings.screenShake) {
      this.scene.cameras.main.shake(400, 0.03);
    }
  }

  private drawScreenCrack(x: number, y: number): void {
    if (!this.screenCrack) {
      this.screenCrack = this.scene.add.graphics().setDepth(998).setScrollFactor(0);
    }

    this.screenCrack.clear();
    this.screenCrack.lineStyle(2, 0xff0000, 0.6);

    // Draw 4-6 radiating crack lines from hit point
    const numCracks = Phaser.Math.Between(4, 7);
    for (let i = 0; i < numCracks; i++) {
      const angle = (Math.PI * 2 / numCracks) * i + Phaser.Math.FloatBetween(-0.3, 0.3);
      const length = Phaser.Math.Between(60, 180);
      const segments = Phaser.Math.Between(2, 4);
      let cx = x, cy = y;

      for (let s = 0; s < segments; s++) {
        const segLen = length / segments;
        const jitter = Phaser.Math.FloatBetween(-0.25, 0.25);
        const nx = cx + Math.cos(angle + jitter) * segLen;
        const ny = cy + Math.sin(angle + jitter) * segLen;
        this.screenCrack.lineBetween(cx, cy, nx, ny);
        cx = nx;
        cy = ny;
      }
    }

    // Fade out crack
    this.scene.tweens.add({
      targets: this.screenCrack,
      alpha: 0,
      duration: 600,
      onComplete: () => {
        this.screenCrack?.clear();
        this.screenCrack?.setAlpha(1);
      },
    });
  }

  update(delta: number): void {
    if (this.screenCrack) {
      this.screenCrackTimer += delta;
    }
  }
}
