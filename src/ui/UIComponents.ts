import Phaser from 'phaser';
import { COLORS, GAME_CONFIG, COCKPIT_CONFIG, DEFAULT_SETTINGS } from '@/config';

export class UIButton extends Phaser.GameObjects.Container {
  private background: Phaser.GameObjects.Graphics;
  private text: Phaser.GameObjects.Text;
  private callback: () => void;
  private isHovered: boolean = false;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    text: string,
    callback: () => void,
    width: number = 200,
    height: number = 50
  ) {
    super(scene, x, y);

    this.callback = callback;

    this.background = scene.add.graphics();
    this.add(this.background);

    this.text = scene.add.text(0, 0, text, {
      fontSize: '20px',
      fontFamily: 'monospace',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    this.add(this.text);

    this.setSize(width, height);
    
    // Make interactive area more forgiving
    const hitArea = new Phaser.Geom.Rectangle(-width/2, -height/2, width, height);
    this.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);

    this.drawButton(false);

    this.on('pointerover', () => {
      this.isHovered = true;
      this.drawButton(true);
      scene.input.setDefaultCursor('pointer');
    });

    this.on('pointerout', () => {
      this.isHovered = false;
      this.drawButton(false);
      scene.input.setDefaultCursor('default');
    });

    this.on('pointerdown', () => {
      this.scale = 0.95;
    });

    this.on('pointerup', () => {
      this.scale = 1;
      this.callback();
    });

    scene.add.existing(this);
  }

  private drawButton(hovered: boolean): void {
    this.background.clear();
    
    const w = this.width as number;
    const h = this.height as number;
    
    const bgColor = hovered ? COLORS.primary : COLORS.ui.bg;
    const borderColor = hovered ? 0xffffff : COLORS.ui.border;
    
    // Draw shadow for depth
    this.background.fillStyle(0x000000, 0.5);
    this.background.fillRect(-w/2 + 4, -h/2 + 4, w, h);
    
    // Draw main button background
    this.background.fillStyle(bgColor, hovered ? 0.5 : 0.9);
    this.background.fillRect(-w/2, -h/2, w, h);
    
    // Draw border
    this.background.lineStyle(3, borderColor, 1);
    this.background.strokeRect(-w/2, -h/2, w, h);
    
    // Draw inner highlight when hovered
    if (hovered) {
      this.background.lineStyle(2, borderColor, 0.5);
      this.background.strokeRect(-w/2 + 5, -h/2 + 5, w - 10, h - 10);
    }
    
    this.text.setColor(hovered ? '#00ffff' : '#ffffff');
  }

  setText(newText: string): void {
    this.text.setText(newText);
  }

  setEnabled(enabled: boolean): void {
    this.setAlpha(enabled ? 1 : 0.5);
    this.setInteractive(enabled);
  }
}

export class Panel extends Phaser.GameObjects.Container {
  private background: Phaser.GameObjects.Graphics;
  private titleText?: Phaser.GameObjects.Text;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    height: number,
    title?: string
  ) {
    super(scene, x, y);

    this.background = scene.add.graphics();
    this.background.fillStyle(COLORS.ui.bg, 0.95);
    this.background.fillRect(0, 0, width, height);
    this.background.lineStyle(4, COLORS.ui.border, 1);
    this.background.strokeRect(0, 0, width, height);
    
    this.background.lineStyle(2, COLORS.ui.border, 0.5);
    this.background.strokeRect(10, 10, width - 20, height - 20);
    
    this.add(this.background);

    if (title) {
      this.titleText = scene.add.text(width / 2, 30, title, {
        fontSize: '32px',
        fontFamily: 'monospace',
        color: '#00ffff',
        fontStyle: 'bold'
      }).setOrigin(0.5);
      this.add(this.titleText);
    }

    scene.add.existing(this);
  }
}

export class Slider extends Phaser.GameObjects.Container {
  private track: Phaser.GameObjects.Graphics;
  private handle: Phaser.GameObjects.Graphics;
  private label: Phaser.GameObjects.Text;
  private valueText: Phaser.GameObjects.Text;
  private _value: number;
  private onChangeCallback: (value: number) => void;
  private trackWidth: number = 200;
  private isDragging: boolean = false;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    label: string,
    initialValue: number,
    onChange: (value: number) => void
  ) {
    super(scene, x, y);

    this._value = initialValue;
    this.onChangeCallback = onChange;

    this.label = scene.add.text(0, 0, label, {
      fontSize: '16px',
      fontFamily: 'monospace',
      color: '#ffffff'
    });
    this.add(this.label);

    this.track = scene.add.graphics();
    this.track.fillStyle(0x000000, 0.5);
    this.track.fillRect(0, 25, this.trackWidth, 10);
    this.track.lineStyle(2, COLORS.ui.border, 1);
    this.track.strokeRect(0, 25, this.trackWidth, 10);
    this.add(this.track);

    this.handle = scene.add.graphics();
    this.drawHandle();
    this.add(this.handle);
    this.updateHandlePosition();

    this.valueText = scene.add.text(this.trackWidth + 15, 20, Math.round(this._value * 100) + '%', {
      fontSize: '16px',
      fontFamily: 'monospace',
      color: '#00ffff'
    });
    this.add(this.valueText);

    this.handle.setInteractive(new Phaser.Geom.Circle(0, 0, 10), Phaser.Geom.Circle.Contains);
    this.handle.on('pointerdown', () => { this.isDragging = true; });
    
    scene.input.on('pointerup', () => { this.isDragging = false; });
    scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (this.isDragging) {
        const localX = pointer.x - this.x;
        const newValue = Phaser.Math.Clamp(localX / this.trackWidth, 0, 1);
        this.setValue(newValue);
        this.onChangeCallback(this._value);
      }
    });

    scene.add.existing(this);
  }

  private drawHandle(): void {
    this.handle.clear();
    this.handle.fillStyle(COLORS.primary, 1);
    this.handle.fillCircle(0, 0, 10);
    this.handle.lineStyle(2, 0xffffff, 1);
    this.handle.strokeCircle(0, 0, 10);
  }

  private updateHandlePosition(): void {
    this.handle.x = this._value * this.trackWidth;
    this.handle.y = 30;
  }

  setValue(value: number): void {
    this._value = Phaser.Math.Clamp(value, 0, 1);
    this.updateHandlePosition();
    this.valueText.setText(Math.round(this._value * 100) + '%');
  }

  getValue(): number {
    return this._value;
  }
}

export class Checkbox extends Phaser.GameObjects.Container {
  private box: Phaser.GameObjects.Graphics;
  private check: Phaser.GameObjects.Graphics;
  private label: Phaser.GameObjects.Text;
  private _checked: boolean;
  private onChangeCallback: (checked: boolean) => void;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    label: string,
    initialChecked: boolean,
    onChange: (checked: boolean) => void
  ) {
    super(scene, x, y);

    this._checked = initialChecked;
    this.onChangeCallback = onChange;

    this.box = scene.add.graphics();
    this.add(this.box);

    this.check = scene.add.graphics();
    this.add(this.check);

    this.drawBox();

    this.label = scene.add.text(35, 0, label, {
      fontSize: '16px',
      fontFamily: 'monospace',
      color: '#ffffff'
    }).setOrigin(0, 0.5);
    this.add(this.label);

    this.setInteractive(new Phaser.Geom.Rectangle(-5, -15, 300, 30), Phaser.Geom.Rectangle.Contains);
    this.on('pointerdown', () => {
      this._checked = !this._checked;
      this.drawBox();
      this.onChangeCallback(this._checked);
    });

    scene.add.existing(this);
  }

  private drawBox(): void {
    this.box.clear();
    this.box.lineStyle(2, COLORS.ui.border, 1);
    this.box.strokeRect(0, -10, 20, 20);
    this.box.fillStyle(COLORS.ui.bg, 1);
    this.box.fillRect(0, -10, 20, 20);

    this.check.clear();
    if (this._checked) {
      this.check.lineStyle(3, COLORS.primary, 1);
      this.check.beginPath();
      this.check.moveTo(4, 0);
      this.check.lineTo(8, 6);
      this.check.lineTo(16, -6);
      this.check.strokePath();
    }
  }

  setChecked(checked: boolean): void {
    this._checked = checked;
    this.drawBox();
  }

  isChecked(): boolean {
    return this._checked;
  }
}

// ========================================
// TypewriterText - Character-by-character text rendering
// ========================================

export class TypewriterText extends Phaser.GameObjects.Container {
  private displayText: Phaser.GameObjects.Text;
  private fullText: string = '';
  private currentIndex: number = 0;
  private timer?: Phaser.Time.TimerEvent;
  private _isComplete: boolean = false;
  private completeCallbacks: (() => void)[] = [];
  private textSpeed: 'slow' | 'normal' | 'fast';
  private subtitlesMode: boolean;
  private bgPanel?: Phaser.GameObjects.Graphics;

  private static readonly SPEED_MAP = {
    slow: 60,
    normal: 35,
    fast: 15,
  };

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    style: Phaser.Types.GameObjects.Text.TextStyle = {},
    textSpeed?: 'slow' | 'normal' | 'fast',
    subtitles?: boolean,
    maxWidth?: number
  ) {
    super(scene, x, y);

    this.textSpeed = textSpeed ?? (DEFAULT_SETTINGS.textSpeed as 'slow' | 'normal' | 'fast');
    this.subtitlesMode = subtitles ?? false;

    const defaultStyle: Phaser.Types.GameObjects.Text.TextStyle = {
      fontSize: '20px',
      fontFamily: 'Georgia, serif',
      color: '#ffffff',
      wordWrap: maxWidth ? { width: maxWidth } : undefined,
      lineSpacing: 6,
    };

    if (this.subtitlesMode) {
      this.bgPanel = scene.add.graphics();
      this.add(this.bgPanel);
    }

    this.displayText = scene.add.text(0, 0, '', { ...defaultStyle, ...style });
    this.add(this.displayText);

    scene.add.existing(this);
  }

  start(text: string): void {
    this.fullText = text;
    this.currentIndex = 0;
    this._isComplete = false;

    if (this.subtitlesMode) {
      // Show all text immediately in subtitles mode
      this.displayText.setText(text);
      this.drawSubtitleBg();
      this._isComplete = true;
      this.completeCallbacks.forEach(cb => cb());
      return;
    }

    this.displayText.setText('');

    const delay = TypewriterText.SPEED_MAP[this.textSpeed];
    this.timer = this.scene.time.addEvent({
      delay,
      callback: this.addNextChar,
      callbackScope: this,
      loop: true,
    });
  }

  private addNextChar(): void {
    if (this.currentIndex >= this.fullText.length) {
      this.timer?.destroy();
      this._isComplete = true;
      this.completeCallbacks.forEach(cb => cb());
      return;
    }

    this.currentIndex++;
    this.displayText.setText(this.fullText.substring(0, this.currentIndex));
  }

  private drawSubtitleBg(): void {
    if (!this.bgPanel) return;
    this.bgPanel.clear();
    const bounds = this.displayText.getBounds();
    const pad = 8;
    this.bgPanel.fillStyle(0x000000, 0.7);
    this.bgPanel.fillRoundedRect(
      -pad,
      -pad,
      bounds.width + pad * 2,
      bounds.height + pad * 2,
      4
    );
  }

  skip(): void {
    if (this._isComplete) return;
    this.timer?.destroy();
    this.displayText.setText(this.fullText);
    this.currentIndex = this.fullText.length;
    this._isComplete = true;
    if (this.subtitlesMode) this.drawSubtitleBg();
    this.completeCallbacks.forEach(cb => cb());
  }

  isComplete(): boolean {
    return this._isComplete;
  }

  onComplete(callback: () => void): void {
    this.completeCallbacks.push(callback);
  }

  clear(): void {
    this.timer?.destroy();
    this.displayText.setText('');
    this.fullText = '';
    this.currentIndex = 0;
    this._isComplete = false;
    this.bgPanel?.clear();
  }

  setTextSpeed(speed: 'slow' | 'normal' | 'fast'): void {
    this.textSpeed = speed;
  }

  destroy(fromScene?: boolean): void {
    this.timer?.destroy();
    super.destroy(fromScene);
  }
}

// ========================================
// CockpitPanel - Metallic styled panel matching cockpit aesthetic
// ========================================

export class CockpitPanel extends Phaser.GameObjects.Container {
  private background: Phaser.GameObjects.Graphics;
  private titleText?: Phaser.GameObjects.Text;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    height: number,
    title?: string
  ) {
    super(scene, x, y);

    this.background = scene.add.graphics();

    // Dark metallic base
    this.background.fillStyle(COCKPIT_CONFIG.metalColor, 0.95);
    this.background.fillRect(0, 0, width, height);

    // Highlight strips
    for (let sy = 8; sy < height - 8; sy += 16) {
      this.background.fillStyle(COCKPIT_CONFIG.metalHighlight, 0.2);
      this.background.fillRect(4, sy, width - 8, 3);
    }

    // Outer border (metallic)
    this.background.lineStyle(3, 0x555566, 0.8);
    this.background.strokeRect(0, 0, width, height);

    // Inner accent border (cyan)
    this.background.lineStyle(1, COCKPIT_CONFIG.accentColor, 0.35);
    this.background.strokeRect(6, 6, width - 12, height - 12);

    // Corner rivets
    const rivetPositions = [
      [8, 8], [width - 8, 8], [8, height - 8], [width - 8, height - 8]
    ];
    for (const [rx, ry] of rivetPositions) {
      this.background.fillStyle(0x666677, 0.7);
      this.background.fillCircle(rx, ry, 3);
      this.background.fillStyle(0xaaaabb, 0.3);
      this.background.fillCircle(rx - 0.5, ry - 0.5, 1.5);
    }

    this.add(this.background);

    if (title) {
      // Title bar
      this.background.fillStyle(COCKPIT_CONFIG.metalHighlight, 0.4);
      this.background.fillRect(6, 6, width - 12, 40);
      this.background.lineStyle(1, COCKPIT_CONFIG.accentColor, 0.2);
      this.background.lineBetween(6, 46, width - 6, 46);

      this.titleText = scene.add.text(width / 2, 26, title, {
        fontSize: '24px',
        fontFamily: 'monospace',
        color: '#00ffff',
        fontStyle: 'bold',
      }).setOrigin(0.5);
      this.add(this.titleText);
    }

    scene.add.existing(this);
  }
}
