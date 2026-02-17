import type {
  ChoiceId,
  ChoiceResult,
  EmotionalPath,
  NarrativeState,
  VignetteData,
  WhisperData,
  ReflectionData,
} from '@/types';
import { saveSystem } from '@/systems/SaveSystem';
import {
  LEVEL_VIGNETTES,
  WHISPERS,
  REFLECTIONS,
  ENDING_SEQUENCES,
} from '@/data/narrative';

class NarrativeManager {
  private state: NarrativeState = {
    currentPath: 'balanced',
    choicesMade: [],
    whispersShown: new Set(),
    vignettesSeen: [],
    reflectionsSeen: [],
  };

  async initialize(): Promise<void> {
    const save = await saveSystem.loadGame();
    if (save?.narrativeState) {
      this.state.whispersShown = new Set(save.narrativeState.whispersShown);
      this.state.vignettesSeen = save.narrativeState.vignettesSeen ?? [];
      this.state.reflectionsSeen = save.narrativeState.reflectionsSeen ?? [];
    }
    if (save?.choicesMade) {
      this.state.choicesMade = save.choicesMade;
    }
    if (save?.emotionalPath) {
      this.state.currentPath = save.emotionalPath;
    }
  }

  getVignette(level: number): VignetteData | null {
    return LEVEL_VIGNETTES[level] ?? null;
  }

  hasSeenVignette(level: number): boolean {
    return this.state.vignettesSeen.includes(level);
  }

  markVignetteSeen(level: number): void {
    if (!this.state.vignettesSeen.includes(level)) {
      this.state.vignettesSeen.push(level);
    }
  }

  getWhispers(level: number): WhisperData[] {
    return Object.values(WHISPERS).filter(w => w.level === level);
  }

  hasWhisperBeenShown(whisperId: string): boolean {
    return this.state.whispersShown.has(whisperId);
  }

  markWhisperShown(whisperId: string): void {
    this.state.whispersShown.add(whisperId);
  }

  getReflection(level: number): string {
    const data: ReflectionData | undefined = REFLECTIONS[level];
    if (!data) return '';

    const path = this.state.currentPath;
    return data.variants[path] ?? data.defaultText;
  }

  hasSeenReflection(level: number): boolean {
    return this.state.reflectionsSeen.includes(level);
  }

  markReflectionSeen(level: number): void {
    if (!this.state.reflectionsSeen.includes(level)) {
      this.state.reflectionsSeen.push(level);
    }
  }

  recordChoice(choiceId: ChoiceId, selectedOption: string, level: number): void {
    const result: ChoiceResult = {
      choiceId,
      selectedOption,
      level,
      timestamp: Date.now(),
    };
    this.state.choicesMade.push(result);
    this.state.currentPath = this.computeEmotionalPath();
  }

  getChoiceMade(choiceId: ChoiceId): ChoiceResult | undefined {
    return this.state.choicesMade.find(c => c.choiceId === choiceId);
  }

  computeEmotionalPath(): EmotionalPath {
    const choices = this.state.choicesMade;
    if (choices.length === 0) return 'balanced';

    let compassionScore = 0;
    let aggressionScore = 0;

    for (const choice of choices) {
      switch (choice.selectedOption) {
        case 'help':
        case 'mercy':
        case 'caution':
        case 'defensive':
        case 'release':
          compassionScore++;
          break;
        case 'ignore':
        case 'destruction':
        case 'risk':
        case 'aggressive':
        case 'cling':
          aggressionScore++;
          break;
      }
    }

    if (compassionScore > aggressionScore + 1) return 'compassionate';
    if (aggressionScore > compassionScore + 1) return 'aggressive';
    return 'balanced';
  }

  getEmotionalPath(): EmotionalPath {
    return this.state.currentPath;
  }

  getEndingSequence(): string[] {
    // Check L10 choice
    const homecoming = this.getChoiceMade('homecoming');
    if (homecoming?.selectedOption === 'release') {
      return ENDING_SEQUENCES['release'];
    }
    if (homecoming?.selectedOption === 'cling') {
      return ENDING_SEQUENCES['cling'];
    }
    // Default to release
    return ENDING_SEQUENCES['release'];
  }

  getAllChoices(): ChoiceResult[] {
    return [...this.state.choicesMade];
  }

  async save(): Promise<void> {
    const save = await saveSystem.loadGame();
    if (save) {
      save.choicesMade = this.state.choicesMade;
      save.narrativeState = {
        whispersShown: Array.from(this.state.whispersShown),
        vignettesSeen: this.state.vignettesSeen,
        reflectionsSeen: this.state.reflectionsSeen,
      };
      save.emotionalPath = this.state.currentPath;
      await saveSystem.saveGame(save);
    }
  }
}

export const narrativeManager = new NarrativeManager();
