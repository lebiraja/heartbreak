import Phaser from 'phaser';
import { GAME_CONFIG, COLORS, COCKPIT_CONFIG } from '@/config';
import { UIButton } from '@/ui/UIComponents';
import { CockpitOverlay } from '@/ui/CockpitOverlay';
import { saveSystem } from '@/systems/SaveSystem';
import { audioManager } from '@/systems/AudioManager';

export class TitleScene extends Phaser.Scene {
  private bootLines = [
    '[ STELLAR RESOLVE OS v1.0 ]',
    'HULL INTEGRITY............ OK',
    'NAVIGATION CORE........... ONLINE',
    'MEMORY CORE............... FRAGMENTED',
    'EMOTIONAL PAYLOAD......... DETECTED',
    'DESTINATION: HOME',
  ];

  constructor() {
    super({ key: 'TitleScene' });
  }

  async create(): Promise<void> {
    await saveSystem.initializeSave();

    this.input.once('pointerdown', () => audioManager.unlockAudio());
    this.cameras.main.setBackgroundColor(COLORS.background);

    // Starfield
    this.createStarfield();

    // Cockpit overlay
    const cockpit = new CockpitOverlay(this);
    const area = cockpit.getPlayableArea();
    const cx = area.x + area.width / 2;

    // Boot sequence text in top-left panel
    this.runBootSequence(area);

    // Title
    const title = this.add.text(cx, area.y + area.height * 0.32, 'STELLAR RESOLVE', {
      fontSize: '62px',
      fontFamily: 'monospace',
      color: '#00ffff',
      fontStyle: 'bold',
      stroke: '#002233',
      strokeThickness: 6,
    }).setOrigin(0.5).setDepth(950);

    this.tweens.add({
      targets: title,
      alpha: 0.75,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Subtitle
    this.add.text(cx, area.y + area.height * 0.42, '"A Journey Home Through the Stars"', {
      fontSize: '18px',
      fontFamily: 'Georgia, serif',
      color: '#778899',
      fontStyle: 'italic',
    }).setOrigin(0.5).setDepth(950);

    // Epigraph
    this.add.text(cx, area.y + area.height * 0.50, GAME_CONFIG.epigraph, {
      fontSize: '14px',
      fontFamily: 'Georgia, serif',
      color: '#445566',
      fontStyle: 'italic',
    }).setOrigin(0.5).setDepth(950);

    // Buttons
    const btnY = area.y + area.height * 0.60;
    const gap = 66;

    new UIButton(this, cx, btnY, 'START GAME', () => {
      audioManager.playSfx('ui_select', 0.5);
      audioManager.stopMusic(true);
      this.scene.start('OpeningScene');
    }, 220, 50);

    const continueBtn = new UIButton(this, cx, btnY + gap, 'CONTINUE', async () => {
      const save = await saveSystem.loadGame();
      if (save && save.unlockedLevels > 1) {
        audioManager.playSfx('ui_select', 0.5);
        this.scene.start('LevelSelectScene');
      }
    }, 220, 50);

    saveSystem.loadGame().then(save => {
      if (!save || save.unlockedLevels <= 1) continueBtn.setEnabled(false);
    });

    new UIButton(this, cx, btnY + gap * 2, 'LEADERBOARD', () => {
      audioManager.playSfx('ui_select', 0.5);
      this.scene.start('LeaderboardScene');
    }, 220, 50);

    new UIButton(this, cx, btnY + gap * 3, 'SETTINGS', () => {
      audioManager.playSfx('ui_select', 0.5);
      this.scene.start('SettingsScene');
    }, 220, 50);

    // Version
    this.add.text(area.x + area.width - 10, area.y + area.height - 8, 'v1.0.0', {
      fontSize: '11px',
      fontFamily: 'monospace',
      color: '#334455',
    }).setOrigin(1, 1).setDepth(950);

    audioManager.playMusic('menu_music', true);
  }

  private runBootSequence(area: Phaser.Geom.Rectangle): void {
    const startX = area.x + 20;
    let y = area.y + 12;

    this.bootLines.forEach((line, i) => {
      this.time.delayedCall(i * 180, () => {
        const color = line.startsWith('[') ? '#00ffcc' : (line.includes('FRAGMENTED') || line.includes('DETECTED') ? '#ffaa44' : '#445566');
        this.add.text(startX, y + i * 14, line, {
          fontSize: '11px',
          fontFamily: 'monospace',
          color,
        }).setDepth(960).setAlpha(0).setData('boot', true);

        // Fade in each line
        const texts = this.children.getAll().filter(c => c.getData?.('boot'));
        const last = texts[texts.length - 1] as Phaser.GameObjects.Text;
        if (last) {
          this.tweens.add({ targets: last, alpha: 1, duration: 200 });
        }
      });
    });
  }

  private createStarfield(): void {
    for (let i = 0; i < 120; i++) {
      const x = Phaser.Math.Between(0, GAME_CONFIG.width);
      const y = Phaser.Math.Between(0, GAME_CONFIG.height);
      const size = Phaser.Math.FloatBetween(0.5, 2.5);
      const star = this.add.circle(x, y, size, 0xffffff, Phaser.Math.FloatBetween(0.1, 0.7));
      this.tweens.add({
        targets: star,
        alpha: Phaser.Math.FloatBetween(0.05, 0.4),
        duration: Phaser.Math.Between(1200, 4000),
        yoyo: true,
        repeat: -1,
      });
    }
  }
}
