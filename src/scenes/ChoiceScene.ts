import Phaser from 'phaser';
import { GAME_CONFIG, COLORS } from '@/config';
import { UIButton, TypewriterText } from '@/ui/UIComponents';
import { CockpitOverlay } from '@/ui/CockpitOverlay';
import { audioManager } from '@/systems/AudioManager';
import { narrativeManager } from '@/systems/NarrativeManager';
import { CHOICE_DIALOGUES } from '@/data/narrative';
import type { ChoiceId } from '@/types';

export class ChoiceScene extends Phaser.Scene {
  private cockpit?: CockpitOverlay;
  private choiceId!: ChoiceId;
  private returnScene!: string;
  private returnData?: Record<string, any>;

  constructor() {
    super({ key: 'ChoiceScene' });
  }

  init(data: { choiceId: ChoiceId; returnScene: string; returnData?: Record<string, any> }): void {
    this.choiceId = data.choiceId;
    this.returnScene = data.returnScene;
    this.returnData = data.returnData;
  }

  create(): void {
    this.cameras.main.setBackgroundColor(COLORS.background);

    this.cockpit = new CockpitOverlay(this);
    const area = this.cockpit.getPlayableArea();

    const cx = area.x + area.width / 2;
    const baseY = area.y + 40;

    const dialogue = CHOICE_DIALOGUES[this.choiceId];
    if (!dialogue) {
      this.scene.start(this.returnScene, this.returnData);
      return;
    }

    // Prompt text via typewriter
    const typewriter = new TypewriterText(
      this,
      cx - area.width * 0.35,
      baseY,
      {
        fontSize: '18px',
        fontFamily: 'Georgia, serif',
        color: '#ccddee',
        fontStyle: 'italic',
        lineSpacing: 8,
      },
      'normal',
      false,
      area.width * 0.7
    );
    typewriter.setDepth(950);
    typewriter.start(dialogue.prompt);

    // Show choice buttons after typewriter completes
    let buttonsShown = false;
    const showButtons = () => {
      if (buttonsShown) return;
      buttonsShown = true;

      const buttonY = baseY + 180;

      dialogue.options.forEach((option, i) => {
        const optY = buttonY + i * 90;

        // Option label button
        const btn = new UIButton(this, cx, optY, option.label, () => {
          this.makeChoice(option.id);
        }, 300, 50);
        (btn as any).setDepth(950);

        // Description text below button
        const desc = this.add.text(cx, optY + 35, option.description, {
          fontSize: '14px',
          fontFamily: 'Georgia, serif',
          color: '#888899',
          fontStyle: 'italic',
          align: 'center',
          wordWrap: { width: area.width * 0.6 },
        }).setOrigin(0.5, 0).setDepth(950);
      });
    };

    typewriter.onComplete(() => {
      this.time.delayedCall(500, showButtons);
    });
    // Fallback timeout
    this.time.delayedCall(6000, showButtons);
  }

  private makeChoice(selectedOption: string): void {
    audioManager.playSfx('ui_select', 0.5);

    // Record the choice
    narrativeManager.recordChoice(this.choiceId, selectedOption, this.returnData?.level ?? 0);
    narrativeManager.save();

    const dialogue = CHOICE_DIALOGUES[this.choiceId];
    const consequenceText = dialogue.consequenceText[selectedOption];

    if (consequenceText) {
      // Show consequence briefly
      const area = this.cockpit!.getPlayableArea();
      const cx = area.x + area.width / 2;

      // Fade out existing UI (all but cockpit at depth 900)
      this.tweens.add({
        targets: this.children.getAll().filter(c => (c as any).depth < 900),
        alpha: 0,
        duration: 400,
      });

      const consequence = new TypewriterText(
        this,
        cx - area.width * 0.35,
        area.y + 80,
        {
          fontSize: '18px',
          fontFamily: 'Georgia, serif',
          color: '#aabbcc',
          fontStyle: 'italic',
          lineSpacing: 8,
        },
        'normal',
        false,
        area.width * 0.7
      );
      consequence.setDepth(950);
      consequence.start(consequenceText);

      consequence.onComplete(() => {
        this.time.delayedCall(2000, () => {
          this.scene.start(this.returnScene, this.returnData);
        });
      });

      // Fallback
      this.time.delayedCall(8000, () => {
        this.scene.start(this.returnScene, this.returnData);
      });
    } else {
      this.scene.start(this.returnScene, this.returnData);
    }
  }

  shutdown(): void {
    this.cockpit?.destroy();
  }
}
