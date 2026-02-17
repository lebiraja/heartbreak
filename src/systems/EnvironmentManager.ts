import Phaser from 'phaser';
import type { EnvironmentConfig, BackgroundLayer, AmbientParticleConfig, EmotionalPath } from '@/types';
import { GAME_CONFIG } from '@/config';
import { ENVIRONMENT_CONFIGS } from '@/data/environments';

interface LayerObject {
  graphics: Phaser.GameObjects.Graphics;
  config: BackgroundLayer;
  objects: { x: number; y: number; size: number; alpha: number; rotation: number; speed: number }[];
}

export class EnvironmentManager {
  private scene: Phaser.Scene;
  private level: number;
  private envConfig: EnvironmentConfig;
  private playableArea: Phaser.Geom.Rectangle;
  private layers: LayerObject[] = [];
  private bgGraphics: Phaser.GameObjects.Graphics;
  private ambientEmitters: Phaser.GameObjects.Graphics[] = [];
  private ambientObjects: { g: Phaser.GameObjects.Graphics; x: number; y: number; vx: number; vy: number; life: number; maxLife: number; config: AmbientParticleConfig }[] = [];
  private elapsed: number = 0;

  constructor(scene: Phaser.Scene, level: number, playableArea: Phaser.Geom.Rectangle) {
    this.scene = scene;
    this.level = level;
    this.envConfig = ENVIRONMENT_CONFIGS[level] ?? ENVIRONMENT_CONFIGS[1];
    this.playableArea = playableArea;

    // Background gradient
    this.bgGraphics = scene.add.graphics();
    this.bgGraphics.setDepth(0);
    this.drawBackground();

    this.createLayers();
    this.createAmbientParticles();
  }

  private drawBackground(): void {
    const { width, height } = GAME_CONFIG;
    const { top, bottom } = this.envConfig.backgroundGradient;
    this.bgGraphics.fillGradientStyle(top, top, bottom, bottom, 1);
    this.bgGraphics.fillRect(0, 0, width, height);
  }

  private createLayers(): void {
    for (const layerConfig of this.envConfig.backgroundLayers) {
      const g = this.scene.add.graphics();
      g.setDepth(1 + this.layers.length);

      const objects: LayerObject['objects'] = [];
      const count = layerConfig.density;

      for (let i = 0; i < count; i++) {
        objects.push({
          x: Math.random() * GAME_CONFIG.width,
          y: Math.random() * GAME_CONFIG.height,
          size: this.getSizeForType(layerConfig.type),
          alpha: layerConfig.alpha * (0.5 + Math.random() * 0.5),
          rotation: Math.random() * Math.PI * 2,
          speed: layerConfig.speed * (0.5 + Math.random() * 0.5),
        });
      }

      this.layers.push({ graphics: g, config: layerConfig, objects });
      this.drawLayer({ graphics: g, config: layerConfig, objects });
    }
  }

  private getSizeForType(type: string): number {
    switch (type) {
      case 'stars': return 1 + Math.random() * 2;
      case 'nebula': return 40 + Math.random() * 80;
      case 'debris': return 8 + Math.random() * 20;
      case 'crystals': return 6 + Math.random() * 15;
      case 'fog': return 50 + Math.random() * 100;
      case 'pulse': return 10 + Math.random() * 30;
      case 'bridge': return 15 + Math.random() * 40;
      case 'wreckage': return 20 + Math.random() * 50;
      case 'reality_wave': return 3 + Math.random() * 5;
      case 'birth_light': return 15 + Math.random() * 40;
      default: return 2;
    }
  }

  private drawLayer(layer: LayerObject): void {
    const g = layer.graphics;
    g.clear();

    for (const obj of layer.objects) {
      switch (layer.config.type) {
        case 'stars':
          this.drawStar(g, obj.x, obj.y, obj.size, layer.config.color, obj.alpha);
          break;
        case 'nebula':
          this.drawNebula(g, obj.x, obj.y, obj.size, layer.config.color, obj.alpha);
          break;
        case 'debris':
          this.drawDebris(g, obj.x, obj.y, obj.size, layer.config.color, obj.alpha, obj.rotation);
          break;
        case 'crystals':
          this.drawCrystal(g, obj.x, obj.y, obj.size, layer.config.color, obj.alpha, obj.rotation);
          break;
        case 'fog':
          this.drawFog(g, obj.x, obj.y, obj.size, layer.config.color, obj.alpha);
          break;
        case 'pulse':
          this.drawPulse(g, obj.x, obj.y, obj.size, layer.config.color, obj.alpha);
          break;
        case 'bridge':
          this.drawBridge(g, obj.x, obj.y, obj.size, layer.config.color, obj.alpha);
          break;
        case 'wreckage':
          this.drawWreckage(g, obj.x, obj.y, obj.size, layer.config.color, obj.alpha, obj.rotation);
          break;
        case 'reality_wave':
          this.drawRealityWave(g, obj.x, obj.y, layer.config.color, obj.alpha);
          break;
        case 'birth_light':
          this.drawBirthLight(g, obj.x, obj.y, obj.size, layer.config.color, obj.alpha);
          break;
      }
    }
  }

  private drawStar(g: Phaser.GameObjects.Graphics, x: number, y: number, size: number, color: number, alpha: number): void {
    g.fillStyle(color, alpha);
    g.fillCircle(x, y, size);
  }

  private drawNebula(g: Phaser.GameObjects.Graphics, x: number, y: number, size: number, color: number, alpha: number): void {
    g.fillStyle(color, alpha * 0.3);
    g.fillCircle(x, y, size);
    g.fillStyle(color, alpha * 0.15);
    g.fillCircle(x + size * 0.3, y - size * 0.2, size * 0.7);
  }

  private drawDebris(g: Phaser.GameObjects.Graphics, x: number, y: number, size: number, color: number, alpha: number, rotation: number): void {
    g.fillStyle(color, alpha);
    g.beginPath();
    const sides = 3 + Math.floor(Math.random() * 4);
    for (let i = 0; i < sides; i++) {
      const angle = rotation + (i / sides) * Math.PI * 2;
      const r = size * (0.6 + Math.random() * 0.4);
      const px = x + Math.cos(angle) * r;
      const py = y + Math.sin(angle) * r;
      if (i === 0) g.moveTo(px, py);
      else g.lineTo(px, py);
    }
    g.closePath();
    g.fillPath();
  }

  private drawCrystal(g: Phaser.GameObjects.Graphics, x: number, y: number, size: number, color: number, alpha: number, rotation: number): void {
    // Diamond shape
    g.lineStyle(1, color, alpha);
    g.beginPath();
    g.moveTo(x, y - size);
    g.lineTo(x + size * 0.6, y);
    g.lineTo(x, y + size);
    g.lineTo(x - size * 0.6, y);
    g.closePath();
    g.strokePath();

    // Reflection line
    g.lineStyle(1, 0xffffff, alpha * 0.5);
    g.beginPath();
    g.moveTo(x - size * 0.2, y - size * 0.3);
    g.lineTo(x + size * 0.2, y + size * 0.3);
    g.strokePath();
  }

  private drawFog(g: Phaser.GameObjects.Graphics, x: number, y: number, size: number, color: number, alpha: number): void {
    g.fillStyle(color, alpha * 0.2);
    g.fillCircle(x, y, size);
    g.fillStyle(color, alpha * 0.1);
    g.fillCircle(x + size * 0.5, y + size * 0.3, size * 0.8);
  }

  private drawPulse(g: Phaser.GameObjects.Graphics, x: number, y: number, size: number, color: number, alpha: number): void {
    const pulsePhase = (this.elapsed * 0.001 + x * 0.01) % 1;
    const currentSize = size * (0.5 + pulsePhase);
    const currentAlpha = alpha * (1 - pulsePhase);
    g.lineStyle(1, color, currentAlpha);
    g.strokeCircle(x, y, currentSize);
    g.fillStyle(color, currentAlpha * 0.3);
    g.fillCircle(x, y, size * 0.3);
  }

  private drawBridge(g: Phaser.GameObjects.Graphics, x: number, y: number, size: number, color: number, alpha: number): void {
    g.fillStyle(color, alpha);
    g.fillRect(x, y, size * 3, size * 0.4);
    // Gap in bridge
    g.fillStyle(0x000000, 0.8);
    g.fillRect(x + size * 1.2, y, size * 0.6, size * 0.4);
    // Edge highlights
    g.lineStyle(1, color, alpha * 0.6);
    g.strokeRect(x, y, size * 3, size * 0.4);
  }

  private drawWreckage(g: Phaser.GameObjects.Graphics, x: number, y: number, size: number, color: number, alpha: number, rotation: number): void {
    g.fillStyle(color, alpha);
    g.beginPath();
    // Angular ship-like silhouette
    g.moveTo(x, y - size * 0.8);
    g.lineTo(x + size * 0.4, y - size * 0.3);
    g.lineTo(x + size * 0.6, y + size * 0.5);
    g.lineTo(x + size * 0.2, y + size * 0.8);
    g.lineTo(x - size * 0.3, y + size * 0.6);
    g.lineTo(x - size * 0.5, y - size * 0.1);
    g.closePath();
    g.fillPath();

    // Detail line
    g.lineStyle(1, color, alpha * 0.4);
    g.beginPath();
    g.moveTo(x - size * 0.2, y - size * 0.4);
    g.lineTo(x + size * 0.3, y + size * 0.3);
    g.strokePath();
  }

  private drawRealityWave(g: Phaser.GameObjects.Graphics, x: number, y: number, color: number, alpha: number): void {
    const waveLength = GAME_CONFIG.width;
    g.lineStyle(2, color, alpha);
    g.beginPath();

    const phase = this.elapsed * 0.002 + y * 0.01;
    for (let wx = 0; wx < waveLength; wx += 4) {
      const wy = y + Math.sin((wx * 0.02) + phase) * 30 + Math.sin((wx * 0.005) + phase * 0.7) * 15;
      if (wx === 0) g.moveTo(wx, wy);
      else g.lineTo(wx, wy);
    }
    g.strokePath();
  }

  private drawBirthLight(g: Phaser.GameObjects.Graphics, x: number, y: number, size: number, color: number, alpha: number): void {
    const pulsePhase = (this.elapsed * 0.0005 + x * 0.005) % 1;
    const currentSize = size * (0.8 + pulsePhase * 0.5);
    g.fillStyle(color, alpha * (1 - pulsePhase * 0.5));
    g.fillCircle(x, y, currentSize);
    g.fillStyle(color, alpha * 0.3);
    g.fillCircle(x, y, size * 0.4);
  }

  private createAmbientParticles(): void {
    for (const config of this.envConfig.ambientParticles) {
      for (let i = 0; i < config.count; i++) {
        const g = this.scene.add.graphics();
        g.setDepth(3);

        const x = this.playableArea.x + Math.random() * this.playableArea.width;
        const y = this.playableArea.y + Math.random() * this.playableArea.height;
        const angle = Math.random() * Math.PI * 2;
        const speed = config.speed.min + Math.random() * (config.speed.max - config.speed.min);

        this.ambientObjects.push({
          g,
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: Math.random() * config.lifespan,
          maxLife: config.lifespan,
          config,
        });
      }
    }
  }

  update(delta: number): void {
    this.elapsed += delta;

    // Scroll background layers
    for (const layer of this.layers) {
      for (const obj of layer.objects) {
        obj.y += layer.config.speed * (delta * 0.06);

        // Wrap around
        if (obj.y > GAME_CONFIG.height + obj.size * 2) {
          obj.y = -obj.size * 2;
          obj.x = Math.random() * GAME_CONFIG.width;
        }
      }

      // Redraw layer with updated positions
      this.drawLayer(layer);
    }

    // Update ambient particles
    for (const particle of this.ambientObjects) {
      particle.life += delta;
      if (particle.life >= particle.maxLife) {
        // Reset particle
        particle.x = this.playableArea.x + Math.random() * this.playableArea.width;
        particle.y = this.playableArea.y + Math.random() * this.playableArea.height;
        particle.life = 0;
        const angle = Math.random() * Math.PI * 2;
        const speed = particle.config.speed.min + Math.random() * (particle.config.speed.max - particle.config.speed.min);
        particle.vx = Math.cos(angle) * speed;
        particle.vy = Math.sin(angle) * speed;
      }

      particle.x += particle.vx * (delta * 0.001);
      particle.y += particle.vy * (delta * 0.001);

      const t = particle.life / particle.maxLife;
      const alpha = particle.config.alpha.start + (particle.config.alpha.end - particle.config.alpha.start) * t;
      const scale = particle.config.scale.start + (particle.config.scale.end - particle.config.scale.start) * t;

      particle.g.clear();
      particle.g.fillStyle(particle.config.color, Math.max(0, alpha));
      particle.g.fillCircle(particle.x, particle.y, Math.max(0.5, scale * 3));
    }
  }

  applyMoodShift(emotionalPath: EmotionalPath): void {
    // Subtle color tint based on emotional path
    // This adjusts the background gradient slightly
    let tintColor: number;
    let tintAlpha: number = 0.05;

    switch (emotionalPath) {
      case 'compassionate':
        tintColor = 0x0044ff; // Blue warmth
        break;
      case 'aggressive':
        tintColor = 0xff2200; // Red intensity
        break;
      default:
        return; // No shift for balanced
    }

    const tint = this.scene.add.rectangle(
      GAME_CONFIG.width / 2,
      GAME_CONFIG.height / 2,
      GAME_CONFIG.width,
      GAME_CONFIG.height,
      tintColor,
      tintAlpha
    );
    tint.setDepth(2);
  }

  destroy(): void {
    this.bgGraphics.destroy();
    for (const layer of this.layers) {
      layer.graphics.destroy();
    }
    for (const particle of this.ambientObjects) {
      particle.g.destroy();
    }
    this.layers = [];
    this.ambientObjects = [];
  }
}
