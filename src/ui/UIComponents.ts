import Phaser from 'phaser';
import { COLORS, GAME_CONFIG } from '@/config';

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
