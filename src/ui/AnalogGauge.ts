import Phaser from 'phaser';

export interface AnalogGaugeConfig {
  label: string;
  radius: number;
  minColor: number;
  maxColor: number;
  tickMarks: number;
  dangerThreshold: number;
}

export class AnalogGauge {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;
  private graphics: Phaser.GameObjects.Graphics;
  private needleGraphics: Phaser.GameObjects.Graphics;
  private valueText: Phaser.GameObjects.Text;
  private labelText: Phaser.GameObjects.Text;
  private config: AnalogGaugeConfig;
  private currentValue: number = 1;
  private targetAngle: number = 0;
  private currentAngle: number = 0;
  private dangerTween?: Phaser.Tweens.Tween;
  private dangerRing?: Phaser.GameObjects.Graphics;

  // Gauge sweep: from -135deg (min) to +135deg (max), spanning 270 degrees
  private static readonly START_ANGLE = -225 * (Math.PI / 180); // -135 deg from top
  private static readonly END_ANGLE = 45 * (Math.PI / 180);     // +135 deg from top
  private static readonly SWEEP = 270 * (Math.PI / 180);

  constructor(scene: Phaser.Scene, x: number, y: number, config: AnalogGaugeConfig) {
    this.scene = scene;
    this.config = config;
    this.container = scene.add.container(x, y);

    this.graphics = scene.add.graphics();
    this.needleGraphics = scene.add.graphics();
    this.dangerRing = scene.add.graphics();

    this.valueText = scene.add.text(0, config.radius * 0.25, '100', {
      fontSize: `${Math.floor(config.radius * 0.45)}px`,
      fontFamily: 'monospace',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.labelText = scene.add.text(0, config.radius + 10, config.label, {
      fontSize: '11px',
      fontFamily: 'monospace',
      color: '#888899',
    }).setOrigin(0.5);

    this.container.add([this.graphics, this.dangerRing, this.needleGraphics, this.valueText, this.labelText]);

    this.drawFace();
  }

  private drawFace(): void {
    const g = this.graphics;
    const r = this.config.radius;

    // Background circle
    g.fillStyle(0x1a1a2a, 0.9);
    g.fillCircle(0, 0, r);

    // Outer ring (metallic)
    g.lineStyle(4, 0x4a4a5a, 0.8);
    g.strokeCircle(0, 0, r);

    // Inner ring
    g.lineStyle(1, 0x3a3a4a, 0.5);
    g.strokeCircle(0, 0, r - 6);

    // Tick marks
    this.drawTickMarks(g, r);

    // Color arc (value indicator background)
    this.drawColorArc(g, r - 10);

    // Center pivot
    g.fillStyle(0xcccccc, 0.8);
    g.fillCircle(0, 0, 3);
    g.fillStyle(0x888899, 0.5);
    g.fillCircle(0, 0, 2);
  }

  private drawTickMarks(g: Phaser.GameObjects.Graphics, radius: number): void {
    const { tickMarks } = this.config;
    const innerR = radius - 14;
    const outerR = radius - 6;

    for (let i = 0; i <= tickMarks; i++) {
      const t = i / tickMarks;
      const angle = AnalogGauge.START_ANGLE + t * AnalogGauge.SWEEP;

      const isMajor = i % Math.ceil(tickMarks / 5) === 0;
      const lineWidth = isMajor ? 2 : 1;
      const alpha = isMajor ? 0.7 : 0.35;
      const tickInner = isMajor ? innerR - 4 : innerR;

      g.lineStyle(lineWidth, 0xaaaabb, alpha);
      g.beginPath();
      g.moveTo(Math.cos(angle) * tickInner, Math.sin(angle) * tickInner);
      g.lineTo(Math.cos(angle) * outerR, Math.sin(angle) * outerR);
      g.strokePath();
    }
  }

  private drawColorArc(g: Phaser.GameObjects.Graphics, radius: number): void {
    const { minColor, maxColor, dangerThreshold } = this.config;
    const segments = 30;

    for (let i = 0; i < segments; i++) {
      const t = i / segments;
      const angle = AnalogGauge.START_ANGLE + t * AnalogGauge.SWEEP;
      const nextAngle = AnalogGauge.START_ANGLE + ((i + 1) / segments) * AnalogGauge.SWEEP;

      // Color transitions from danger (red) at low values to safe (maxColor) at high values
      const color = t < dangerThreshold ? minColor : maxColor;
      const alpha = t < dangerThreshold ? 0.25 : 0.12;

      g.lineStyle(3, color, alpha);
      g.beginPath();
      g.arc(0, 0, radius, angle, nextAngle, false);
      g.strokePath();
    }
  }

  private drawNeedle(angle: number): void {
    const ng = this.needleGraphics;
    ng.clear();

    const needleLength = this.config.radius - 16;
    const needleWidth = 2;

    // Needle shadow
    ng.fillStyle(0x000000, 0.3);
    ng.beginPath();
    ng.moveTo(2, 2);
    ng.lineTo(Math.cos(angle) * needleLength + 2, Math.sin(angle) * needleLength + 2);
    ng.lineTo(Math.cos(angle + 0.1) * needleWidth + 2, Math.sin(angle + 0.1) * needleWidth + 2);
    ng.closePath();
    ng.fillPath();

    // Needle body
    ng.fillStyle(0xff3333, 0.9);
    ng.beginPath();
    ng.moveTo(0, 0);
    ng.lineTo(Math.cos(angle) * needleLength, Math.sin(angle) * needleLength);
    ng.lineTo(Math.cos(angle + Math.PI / 2) * needleWidth, Math.sin(angle + Math.PI / 2) * needleWidth);
    ng.closePath();
    ng.fillPath();

    ng.beginPath();
    ng.moveTo(0, 0);
    ng.lineTo(Math.cos(angle) * needleLength, Math.sin(angle) * needleLength);
    ng.lineTo(Math.cos(angle - Math.PI / 2) * needleWidth, Math.sin(angle - Math.PI / 2) * needleWidth);
    ng.closePath();
    ng.fillPath();
  }

  setValue(value: number, maxValue: number): void {
    const ratio = Math.max(0, Math.min(1, value / maxValue));
    this.currentValue = ratio;
    this.targetAngle = AnalogGauge.START_ANGLE + ratio * AnalogGauge.SWEEP;

    // Smooth needle movement
    this.currentAngle = this.currentAngle + (this.targetAngle - this.currentAngle) * 0.15;
    this.drawNeedle(this.currentAngle);

    // Update value text
    this.valueText.setText(Math.round(value).toString());

    // Color text based on value
    if (ratio < this.config.dangerThreshold) {
      this.valueText.setColor('#ff4444');
    } else if (ratio < 0.5) {
      this.valueText.setColor('#ffaa44');
    } else {
      this.valueText.setColor('#ffffff');
    }
  }

  setDanger(danger: boolean): void {
    if (danger && !this.dangerTween) {
      const dr = this.dangerRing!;
      dr.lineStyle(2, 0xff0000, 0.5);
      dr.strokeCircle(0, 0, this.config.radius + 1);

      this.dangerTween = this.scene.tweens.add({
        targets: dr,
        alpha: { from: 0.8, to: 0.2 },
        duration: 400,
        yoyo: true,
        repeat: -1,
      });
    } else if (!danger && this.dangerTween) {
      this.dangerTween.destroy();
      this.dangerTween = undefined;
      this.dangerRing?.clear();
      this.dangerRing?.setAlpha(1);
    }
  }

  getContainer(): Phaser.GameObjects.Container {
    return this.container;
  }

  destroy(): void {
    this.dangerTween?.destroy();
    this.container.destroy(true);
  }
}
