import Phaser from 'phaser';
import type { BossData, BossPhase } from '@/types';
import { COLORS } from '@/config';
import { ParticleManager } from '@/systems/ParticleManager';
import { audioManager } from '@/systems/AudioManager';

export class Boss extends Phaser.GameObjects.Container {
  public health: number;
  public maxHealth: number;
  public scoreValue: number = 5000;

  private bossData: BossData;
  private ship: Phaser.GameObjects.Graphics;
  private healthBar: Phaser.GameObjects.Graphics;
  private healthBarBg: Phaser.GameObjects.Graphics;
  private nameText: Phaser.GameObjects.Text;
  private dialogueText: Phaser.GameObjects.Text;
  private particleManager: ParticleManager;

  private currentPhase: number = 0;
  private aiTimer: number = 0;
  private dialogueTimer: number = 0;
  private currentDialogueLine: number = 0;
  private movementPhase: number = 0;
  private target: Phaser.Math.Vector2;

  // Phase-specific state
  private shootTimer: number = 0;
  private isEnraged: boolean = false;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    bossData: BossData,
    particleManager: ParticleManager
  ) {
    super(scene, x, y);

    this.bossData = bossData;
    this.health = bossData.health;
    this.maxHealth = bossData.health;
    this.particleManager = particleManager;
    this.target = new Phaser.Math.Vector2(x, y);

    // Draw boss ship
    this.ship = scene.add.graphics();
    this.drawBossShip();
    this.add(this.ship);

    // Health bar background
    this.healthBarBg = scene.add.graphics();
    this.healthBarBg.fillStyle(0x111122, 0.9);
    this.healthBarBg.fillRect(-80, -60, 160, 12);
    this.healthBarBg.lineStyle(1, 0x334455, 0.7);
    this.healthBarBg.strokeRect(-80, -60, 160, 12);
    this.add(this.healthBarBg);

    // Health bar fill
    this.healthBar = scene.add.graphics();
    this.drawHealthBar();
    this.add(this.healthBar);

    // Boss name text
    this.nameText = scene.add.text(0, -80, bossData.name.toUpperCase(), {
      fontSize: '14px',
      fontFamily: 'monospace',
      color: '#ff4444',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    this.add(this.nameText);

    // Dialogue text (shows at bottom of screen)
    this.dialogueText = scene.add.text(scene.cameras.main.width / 2, scene.cameras.main.height - 80, '', {
      fontSize: '16px',
      fontFamily: 'Georgia, serif',
      color: '#ff8888',
      fontStyle: 'italic',
      align: 'center',
      wordWrap: { width: 700 },
    }).setOrigin(0.5).setDepth(990);
    // Not added to container — pinned to screen position

    // Entry animation
    this.alpha = 0;
    scene.tweens.add({
      targets: this,
      alpha: 1,
      duration: 1000,
      ease: 'Power2',
    });

    // Show first dialogue line on entry
    this.showNextDialogue();

    scene.add.existing(this);
  }

  private drawBossShip(): void {
    this.ship.clear();

    // Larger, more imposing design than regular enemies
    this.ship.lineStyle(2, 0xff4444, 1);
    this.ship.fillStyle(0xcc2222, 0.7);

    // Main hull
    this.ship.beginPath();
    this.ship.moveTo(0, 30);
    this.ship.lineTo(-25, 0);
    this.ship.lineTo(-20, -20);
    this.ship.lineTo(0, -30);
    this.ship.lineTo(20, -20);
    this.ship.lineTo(25, 0);
    this.ship.closePath();
    this.ship.fillPath();
    this.ship.strokePath();

    // Wings
    this.ship.lineStyle(2, 0xcc2222, 0.8);
    this.ship.fillStyle(0x881111, 0.5);
    this.ship.fillTriangle(-25, 0, -50, 20, -15, 10);
    this.ship.strokeTriangle(-25, 0, -50, 20, -15, 10);
    this.ship.fillTriangle(25, 0, 50, 20, 15, 10);
    this.ship.strokeTriangle(25, 0, 50, 20, 15, 10);

    // Core
    this.ship.fillStyle(0xff6666, 0.9);
    this.ship.fillCircle(0, 0, 8);
    this.ship.lineStyle(1, 0xffffff, 0.4);
    this.ship.strokeCircle(0, 0, 8);
  }

  private drawHealthBar(): void {
    this.healthBar.clear();
    const ratio = Math.max(0, this.health / this.maxHealth);
    const barWidth = 156 * ratio;
    const barColor = ratio > 0.5 ? 0xff4444 : (ratio > 0.25 ? 0xff8800 : 0xffff00);
    this.healthBar.fillStyle(barColor, 0.9);
    this.healthBar.fillRect(-78, -58, barWidth, 8);
  }

  private showNextDialogue(): void {
    if (this.currentDialogueLine >= this.bossData.dialogueLines.length) return;

    const line = this.bossData.dialogueLines[this.currentDialogueLine];
    this.currentDialogueLine++;

    this.dialogueText.setText(`"${line}"`);
    this.dialogueText.setAlpha(0);

    this.scene.tweens.add({
      targets: this.dialogueText,
      alpha: 1,
      duration: 400,
      hold: 3000,
      yoyo: true,
    });
  }

  update(delta: number, playerX: number, playerY: number): void {
    this.aiTimer += delta;
    this.dialogueTimer += delta;
    this.shootTimer += delta;

    // Phase transitions based on health
    this.checkPhaseTransition();

    // Movement pattern based on current phase
    this.updateMovement(delta, playerX, playerY);

    // Periodic dialogue
    if (this.dialogueTimer > 6000) {
      this.dialogueTimer = 0;
      this.showNextDialogue();
    }

    // Phase-based shooting
    const phase = this.bossData.phases[this.currentPhase];
    if (phase) {
      const fireRate = this.isEnraged ? 1200 : 2000;
      if (this.shootTimer >= fireRate) {
        this.shootTimer = 0;
        this.fireBossProjectile(playerX, playerY, phase.attackPattern);
      }
    }
  }

  private checkPhaseTransition(): void {
    const phases = this.bossData.phases;
    for (let i = phases.length - 1; i >= 0; i--) {
      if (this.health <= this.maxHealth * phases[i].healthThreshold && this.currentPhase < i) {
        this.currentPhase = i;
        this.isEnraged = i >= phases.length - 1;
        this.onPhaseChange(phases[i]);
        break;
      }
    }
  }

  private onPhaseChange(phase: BossPhase): void {
    // Visual flash on phase change
    this.scene.tweens.add({
      targets: this.ship,
      alpha: 0,
      duration: 100,
      yoyo: true,
      repeat: 4,
    });

    // Show phase dialogue
    if (phase.dialogue.length > 0) {
      const line = phase.dialogue[0];
      this.dialogueText.setText(`"${line}"`);
      this.dialogueText.setAlpha(0);
      this.scene.tweens.add({
        targets: this.dialogueText,
        alpha: 1,
        duration: 400,
        hold: 3000,
        yoyo: true,
      });
    }

    // Enrage effect
    if (this.isEnraged) {
      this.ship.clear();
      this.ship.lineStyle(3, 0xff8800, 1);
      this.ship.fillStyle(0xff4400, 0.8);
      this.drawBossShip();
      this.nameText.setColor('#ff8800');
    }

    this.particleManager.createExplosion(this.x, this.y, 0xff4444, 2);
  }

  private updateMovement(delta: number, playerX: number, playerY: number): void {
    const phase = this.bossData.phases[this.currentPhase];
    const speed = phase ? phase.speed : 60;

    // Sinusoidal movement pattern
    this.movementPhase += delta * 0.001;
    const swayX = Math.sin(this.movementPhase * 1.5) * 200;
    const baseY = 120 + Math.sin(this.movementPhase * 0.7) * 40;

    this.target.set(this.scene.cameras.main.width / 2 + swayX, baseY);

    // Move toward target
    const dx = this.target.x - this.x;
    const dy = this.target.y - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > 5) {
      this.x += (dx / dist) * speed * (delta / 1000);
      this.y += (dy / dist) * speed * (delta / 1000);
    }
  }

  private fireBossProjectile(playerX: number, playerY: number, pattern: string): void {
    const angle = Math.atan2(playerY - this.y, playerX - this.x);

    switch (pattern) {
      case 'spread':
        for (let spread = -1; spread <= 1; spread++) {
          const a = angle + spread * 0.3;
          this.scene.events.emit('bossFireProjectile', { x: this.x, y: this.y, angle: a });
        }
        break;
      case 'burst':
        for (let i = 0; i < 6; i++) {
          const a = (Math.PI * 2 / 6) * i;
          this.scene.events.emit('bossFireProjectile', { x: this.x, y: this.y, angle: a });
        }
        break;
      default:
        this.scene.events.emit('bossFireProjectile', { x: this.x, y: this.y, angle });
        break;
    }
  }

  takeDamage(amount: number): boolean {
    this.health -= amount;
    this.drawHealthBar();

    this.particleManager.createHitEffect(this.x, this.y);

    this.scene.tweens.add({
      targets: this.ship,
      alpha: 0.4,
      duration: 60,
      yoyo: true,
    });

    if (this.health <= 0) {
      this.onDeath();
      return true;
    }
    return false;
  }

  private onDeath(): void {
    this.dialogueText.destroy();
    this.particleManager.createExplosion(this.x, this.y, 0xff4444, 3);
    audioManager.playSfx('enemy_death', 0.8);
    this.scene.events.emit('bossDestroyed', { score: this.scoreValue, x: this.x, y: this.y });
    this.destroy();
  }

  isOffScreen(): boolean {
    return false; // Boss never goes off screen
  }

  destroy(fromScene?: boolean): void {
    if (this.dialogueText?.active) {
      this.dialogueText.destroy();
    }
    super.destroy(fromScene);
  }
}
