import Phaser from 'phaser';
import { COCKPIT_CONFIG, GAME_CONFIG, COLORS } from '@/config';
import type { CockpitConfig } from '@/types';

export class CockpitOverlay {
  private scene: Phaser.Scene;
  private config: CockpitConfig;
  private container: Phaser.GameObjects.Container;
  private graphics: Phaser.GameObjects.Graphics;
  private alertActive: boolean = false;
  private alertTween?: Phaser.Tweens.Tween;
  private alertGraphics?: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene, config?: CockpitConfig) {
    this.scene = scene;
    this.config = config ?? COCKPIT_CONFIG;
    this.container = scene.add.container(0, 0);
    this.container.setDepth(900);
    this.graphics = scene.add.graphics();
    this.container.add(this.graphics);
    this.draw();
  }

  private draw(): void {
    const { width, height } = GAME_CONFIG;
    const { topHeight, bottomHeight, sideWidth, metalColor, metalHighlight, accentColor, rivetRadius, rivetSpacing } = this.config;
    const g = this.graphics;

    // Top border panel
    this.drawPanel(g, 0, 0, width, topHeight, metalColor, metalHighlight);
    // Bottom border panel
    this.drawPanel(g, 0, height - bottomHeight, width, bottomHeight, metalColor, metalHighlight);
    // Left border panel
    this.drawPanel(g, 0, topHeight, sideWidth, height - topHeight - bottomHeight, metalColor, metalHighlight);
    // Right border panel
    this.drawPanel(g, width - sideWidth, topHeight, sideWidth, height - topHeight - bottomHeight, metalColor, metalHighlight);

    // Inner accent border (cyan glow line)
    g.lineStyle(2, accentColor, 0.4);
    g.strokeRect(sideWidth, topHeight, width - sideWidth * 2, height - topHeight - bottomHeight);

    // Inner subtle glow
    g.lineStyle(1, accentColor, 0.15);
    g.strokeRect(sideWidth - 2, topHeight - 2, width - sideWidth * 2 + 4, height - topHeight - bottomHeight + 4);

    // Rivets along panel edges
    this.drawRivets(g, sideWidth, topHeight, width - sideWidth, topHeight, rivetSpacing, rivetRadius, 0x666677);
    this.drawRivets(g, sideWidth, height - bottomHeight, width - sideWidth, height - bottomHeight, rivetSpacing, rivetRadius, 0x666677);
    this.drawRivets(g, sideWidth, topHeight, sideWidth, height - bottomHeight, rivetSpacing, rivetRadius, 0x666677);
    this.drawRivets(g, width - sideWidth, topHeight, width - sideWidth, height - bottomHeight, rivetSpacing, rivetRadius, 0x666677);

    // Panel seam lines on top border
    this.drawSeamLines(g, 0, 0, width, topHeight, metalHighlight);
    // Panel seam lines on bottom border
    this.drawSeamLines(g, 0, height - bottomHeight, width, bottomHeight, metalHighlight);

    // Corner reinforcements (small triangular gussets)
    this.drawCornerGusset(g, sideWidth, topHeight, 'top-left', accentColor);
    this.drawCornerGusset(g, width - sideWidth, topHeight, 'top-right', accentColor);
    this.drawCornerGusset(g, sideWidth, height - bottomHeight, 'bottom-left', accentColor);
    this.drawCornerGusset(g, width - sideWidth, height - bottomHeight, 'bottom-right', accentColor);

    // Warning stripe accents in corners
    this.drawWarningStripes(g, 4, 4, 60, 12);
    this.drawWarningStripes(g, width - 64, 4, 60, 12);
    this.drawWarningStripes(g, 4, height - 16, 60, 12);
    this.drawWarningStripes(g, width - 64, height - 16, 60, 12);
  }

  private drawPanel(g: Phaser.GameObjects.Graphics, x: number, y: number, w: number, h: number, baseColor: number, highlightColor: number): void {
    // Base fill
    g.fillStyle(baseColor, 0.95);
    g.fillRect(x, y, w, h);

    // Highlight strips (lighter horizontal bands)
    const stripHeight = 4;
    for (let sy = y + 8; sy < y + h - 8; sy += 16) {
      g.fillStyle(highlightColor, 0.3);
      g.fillRect(x + 4, sy, w - 8, stripHeight);
    }

    // Outer border
    g.lineStyle(2, 0x555566, 0.6);
    g.strokeRect(x, y, w, h);
  }

  private drawRivets(g: Phaser.GameObjects.Graphics, x1: number, y1: number, x2: number, y2: number, spacing: number, radius: number, color: number): void {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.sqrt(dx * dx + dy * dy);
    const count = Math.floor(length / spacing);
    if (count <= 0) return;

    for (let i = 0; i <= count; i++) {
      const t = i / count;
      const rx = x1 + dx * t;
      const ry = y1 + dy * t;

      // Rivet shadow
      g.fillStyle(0x111122, 0.5);
      g.fillCircle(rx + 1, ry + 1, radius);
      // Rivet body
      g.fillStyle(color, 0.8);
      g.fillCircle(rx, ry, radius);
      // Rivet highlight
      g.fillStyle(0xaaaabb, 0.4);
      g.fillCircle(rx - 0.5, ry - 0.5, radius * 0.5);
    }
  }

  private drawSeamLines(g: Phaser.GameObjects.Graphics, x: number, y: number, w: number, h: number, color: number): void {
    g.lineStyle(1, color, 0.25);
    // Horizontal seam at 1/3 and 2/3
    g.beginPath();
    g.moveTo(x + 10, y + Math.floor(h / 3));
    g.lineTo(x + w - 10, y + Math.floor(h / 3));
    g.strokePath();
    g.beginPath();
    g.moveTo(x + 10, y + Math.floor(h * 2 / 3));
    g.lineTo(x + w - 10, y + Math.floor(h * 2 / 3));
    g.strokePath();
  }

  private drawCornerGusset(g: Phaser.GameObjects.Graphics, cx: number, cy: number, corner: string, color: number): void {
    const size = 16;
    g.lineStyle(1, color, 0.3);
    g.beginPath();

    switch (corner) {
      case 'top-left':
        g.moveTo(cx, cy);
        g.lineTo(cx + size, cy);
        g.lineTo(cx, cy + size);
        break;
      case 'top-right':
        g.moveTo(cx, cy);
        g.lineTo(cx - size, cy);
        g.lineTo(cx, cy + size);
        break;
      case 'bottom-left':
        g.moveTo(cx, cy);
        g.lineTo(cx + size, cy);
        g.lineTo(cx, cy - size);
        break;
      case 'bottom-right':
        g.moveTo(cx, cy);
        g.lineTo(cx - size, cy);
        g.lineTo(cx, cy - size);
        break;
    }

    g.closePath();
    g.strokePath();
    g.fillStyle(color, 0.08);
    g.fillPath();
  }

  private drawWarningStripes(g: Phaser.GameObjects.Graphics, x: number, y: number, w: number, h: number): void {
    const stripeWidth = 6;
    g.fillStyle(0xffaa00, 0.15);
    for (let sx = x; sx < x + w; sx += stripeWidth * 2) {
      g.beginPath();
      g.moveTo(sx, y + h);
      g.lineTo(sx + stripeWidth, y + h);
      g.lineTo(sx + stripeWidth + h, y);
      g.lineTo(sx + h, y);
      g.closePath();
      g.fillPath();
    }
  }

  getPlayableArea(): Phaser.Geom.Rectangle {
    const { topHeight, bottomHeight, sideWidth } = this.config;
    return new Phaser.Geom.Rectangle(
      sideWidth,
      topHeight,
      GAME_CONFIG.width - sideWidth * 2,
      GAME_CONFIG.height - topHeight - bottomHeight
    );
  }

  setAlertState(active: boolean): void {
    if (this.alertActive === active) return;
    this.alertActive = active;

    if (active) {
      if (!this.alertGraphics) {
        this.alertGraphics = this.scene.add.graphics();
        this.container.add(this.alertGraphics);
      }
      const ag = this.alertGraphics;
      const { sideWidth, topHeight, bottomHeight } = this.config;
      const { width, height } = GAME_CONFIG;

      ag.lineStyle(3, 0xff0000, 0.6);
      ag.strokeRect(sideWidth - 1, topHeight - 1, width - sideWidth * 2 + 2, height - topHeight - bottomHeight + 2);

      this.alertTween = this.scene.tweens.add({
        targets: ag,
        alpha: { from: 0.8, to: 0.2 },
        duration: 500,
        yoyo: true,
        repeat: -1,
      });
    } else {
      this.alertTween?.destroy();
      this.alertGraphics?.clear();
      this.alertGraphics?.setAlpha(1);
    }
  }

  destroy(): void {
    this.alertTween?.destroy();
    this.container.destroy(true);
  }
}
