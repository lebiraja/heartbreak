import Phaser from 'phaser';
import { GAME_CONFIG, COLORS } from '@/config';
import { UIButton, Panel, Slider, Checkbox } from '@/ui/UIComponents';
import { saveSystem } from '@/systems/SaveSystem';
import { audioManager } from '@/systems/AudioManager';
import type { GameSettings } from '@/types';

export class SettingsScene extends Phaser.Scene {
  private settings!: GameSettings;

  constructor() {
    super({ key: 'SettingsScene' });
  }

  async create(): Promise<void> {
    this.cameras.main.setBackgroundColor(COLORS.background);

    const save = await saveSystem.loadGame();
    this.settings = save?.settings || (await saveSystem.initializeSave()).settings;

    const panel = new Panel(
      this,
      GAME_CONFIG.width / 2 - 400,
      50,
      800,
      620,
      'SETTINGS'
    );

    const audioLabel = this.add.text(GAME_CONFIG.width / 2 - 350, 120, 'AUDIO', {
      fontSize: '24px',
      fontFamily: 'monospace',
      color: '#00ffff',
      fontStyle: 'bold'
    });

    const masterSlider = new Slider(
      this,
      GAME_CONFIG.width / 2 - 350,
      160,
      'Master Volume',
      this.settings.masterVolume,
      (value) => {
        this.settings.masterVolume = value;
        audioManager.updateSettings(this.settings);
      }
    );

    const musicSlider = new Slider(
      this,
      GAME_CONFIG.width / 2 - 350,
      220,
      'Music Volume',
      this.settings.musicVolume,
      (value) => {
        this.settings.musicVolume = value;
        audioManager.updateSettings(this.settings);
      }
    );

    const sfxSlider = new Slider(
      this,
      GAME_CONFIG.width / 2 - 350,
      280,
      'SFX Volume',
      this.settings.sfxVolume,
      (value) => {
        this.settings.sfxVolume = value;
        audioManager.updateSettings(this.settings);
      }
    );

    const accessibilityLabel = this.add.text(GAME_CONFIG.width / 2 - 350, 340, 'ACCESSIBILITY', {
      fontSize: '24px',
      fontFamily: 'monospace',
      color: '#00ffff',
      fontStyle: 'bold'
    });

    const reducedMotionCheck = new Checkbox(
      this,
      GAME_CONFIG.width / 2 - 350,
      390,
      'Reduced Motion',
      this.settings.reducedMotion,
      (checked) => {
        this.settings.reducedMotion = checked;
      }
    );

    const screenShakeCheck = new Checkbox(
      this,
      GAME_CONFIG.width / 2 - 350,
      430,
      'Screen Shake',
      this.settings.screenShake,
      (checked) => {
        this.settings.screenShake = checked;
      }
    );

    const particlesCheck = new Checkbox(
      this,
      GAME_CONFIG.width / 2 - 350,
      470,
      'Particle Effects',
      this.settings.particles,
      (checked) => {
        this.settings.particles = checked;
      }
    );

    const fpsCheck = new Checkbox(
      this,
      GAME_CONFIG.width / 2 - 350,
      510,
      'Show FPS',
      this.settings.showFPS,
      (checked) => {
        this.settings.showFPS = checked;
      }
    );

    const colorBlindLabel = this.add.text(GAME_CONFIG.width / 2 + 50, 390, 'Color Blind Mode:', {
      fontSize: '16px',
      fontFamily: 'monospace',
      color: '#ffffff'
    });

    const modes = ['none', 'protanopia', 'deuteranopia', 'tritanopia'];
    let currentModeIndex = modes.indexOf(this.settings.colorBlindMode);

    const modeText = this.add.text(GAME_CONFIG.width / 2 + 50, 420, modes[currentModeIndex].toUpperCase(), {
      fontSize: '18px',
      fontFamily: 'monospace',
      color: '#00ffff',
      fontStyle: 'bold'
    });

    const prevButton = new UIButton(
      this,
      GAME_CONFIG.width / 2 + 50,
      480,
      '<',
      () => {
        currentModeIndex = (currentModeIndex - 1 + modes.length) % modes.length;
        this.settings.colorBlindMode = modes[currentModeIndex] as any;
        modeText.setText(modes[currentModeIndex].toUpperCase());
      },
      60,
      40
    );

    const nextButton = new UIButton(
      this,
      GAME_CONFIG.width / 2 + 150,
      480,
      '>',
      () => {
        currentModeIndex = (currentModeIndex + 1) % modes.length;
        this.settings.colorBlindMode = modes[currentModeIndex] as any;
        modeText.setText(modes[currentModeIndex].toUpperCase());
      },
      60,
      40
    );

    const saveButton = new UIButton(
      this,
      GAME_CONFIG.width / 2 - 110,
      GAME_CONFIG.height - 80,
      'SAVE',
      async () => {
        await saveSystem.updateSettings(this.settings);
        audioManager.playSfx('ui_select', 0.5);
      },
      150,
      50
    );

    const backButton = new UIButton(
      this,
      GAME_CONFIG.width / 2 + 110,
      GAME_CONFIG.height - 80,
      'BACK',
      () => {
        audioManager.playSfx('ui_back', 0.5);
        this.scene.start('TitleScene');
      },
      150,
      50
    );
  }
}
