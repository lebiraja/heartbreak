import localforage from 'localforage';
import type { SaveData, GameSettings, LeaderboardEntry, ChoiceResult, EmotionalPath, JournalUnlockState } from '@/types';
import { DEFAULT_SETTINGS } from '@/config';

class SaveSystem {
  private db: LocalForage;
  private readonly SAVE_KEY = 'stellar_resolve_save';
  private readonly LEADERBOARD_KEY = 'stellar_resolve_leaderboard';

  constructor() {
    this.db = localforage.createInstance({
      name: 'StellarResolve',
      storeName: 'gameData'
    });
  }

  async initializeSave(): Promise<SaveData> {
    const existingSave = await this.loadGame();
    if (existingSave) return existingSave;

    const newSave: SaveData = {
      playerName: 'Pilot',
      levelsCompleted: Array(10).fill(false),
      highScore: 0,
      totalMemoryShards: 0,
      unlockedLevels: 1,
      settings: { ...DEFAULT_SETTINGS },
      journalEntries: [],
      statistics: {
        totalEnemiesDestroyed: 0,
        totalShipsFired: 0,
        accuracyRate: 0,
        totalPlayTime: 0,
        deathCount: 0,
        perfectLevels: 0
      },
      choicesMade: [],
      narrativeState: {
        whispersShown: [],
        vignettesSeen: [],
        reflectionsSeen: [],
      },
      emotionalPath: 'balanced',
      journalUnlockProgress: {},
    };

    await this.saveGame(newSave);
    return newSave;
  }

  async saveGame(data: SaveData): Promise<void> {
    try {
      await this.db.setItem(this.SAVE_KEY, data);
    } catch (error) {
      console.error('Failed to save game:', error);
    }
  }

  async loadGame(): Promise<SaveData | null> {
    try {
      const save = await this.db.getItem<SaveData>(this.SAVE_KEY);
      if (save) {
        return await this.migrateSave(save);
      }
      return null;
    } catch (error) {
      console.error('Failed to load game:', error);
      return null;
    }
  }

  async updateSettings(settings: Partial<GameSettings>): Promise<void> {
    const save = await this.loadGame();
    if (save) {
      save.settings = { ...save.settings, ...settings };
      await this.saveGame(save);
    }
  }

  async completeLevel(level: number, score: number, memoryShards: number, perfect: boolean): Promise<void> {
    const save = await this.loadGame();
    if (save) {
      save.levelsCompleted[level - 1] = true;
      save.unlockedLevels = Math.max(save.unlockedLevels, level + 1);
      save.highScore = Math.max(save.highScore, score);
      save.totalMemoryShards += memoryShards;
      if (perfect) save.statistics.perfectLevels++;
      await this.saveGame(save);
    }
  }

  async addLeaderboardEntry(entry: Omit<LeaderboardEntry, 'rank'>): Promise<void> {
    try {
      let leaderboard = await this.db.getItem<LeaderboardEntry[]>(this.LEADERBOARD_KEY) || [];
      
      leaderboard.push({ ...entry, rank: 0 });
      leaderboard.sort((a, b) => b.score - a.score);
      leaderboard = leaderboard.slice(0, 100).map((entry, index) => ({ ...entry, rank: index + 1 }));
      
      await this.db.setItem(this.LEADERBOARD_KEY, leaderboard);
    } catch (error) {
      console.error('Failed to add leaderboard entry:', error);
    }
  }

  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    try {
      return await this.db.getItem<LeaderboardEntry[]>(this.LEADERBOARD_KEY) || [];
    } catch (error) {
      console.error('Failed to get leaderboard:', error);
      return [];
    }
  }

  async saveChoice(choice: ChoiceResult): Promise<void> {
    const save = await this.loadGame();
    if (save) {
      save.choicesMade = save.choicesMade ?? [];
      // Avoid duplicate choices for same choiceId
      save.choicesMade = save.choicesMade.filter(c => c.choiceId !== choice.choiceId);
      save.choicesMade.push(choice);
      await this.saveGame(save);
    }
  }

  async getChoices(): Promise<ChoiceResult[]> {
    const save = await this.loadGame();
    return save?.choicesMade ?? [];
  }

  async saveNarrativeState(narrativeState: SaveData['narrativeState'], emotionalPath: EmotionalPath): Promise<void> {
    const save = await this.loadGame();
    if (save) {
      save.narrativeState = narrativeState;
      save.emotionalPath = emotionalPath;
      await this.saveGame(save);
    }
  }

  async updateJournalUnlock(level: number, state: Partial<JournalUnlockState>): Promise<void> {
    const save = await this.loadGame();
    if (save) {
      save.journalUnlockProgress = save.journalUnlockProgress ?? {};
      const current = save.journalUnlockProgress[level] ?? {
        quoteUnlocked: false,
        reflectionUnlocked: false,
        whispersUnlocked: false,
      };
      save.journalUnlockProgress[level] = { ...current, ...state };
      await this.saveGame(save);
    }
  }

  async clearSave(): Promise<void> {
    try {
      await this.db.removeItem(this.SAVE_KEY);
    } catch (error) {
      console.error('Failed to clear save:', error);
    }
  }

  /**
   * Migrate old saves to include new fields, preventing crashes on load.
   */
  async migrateSave(save: SaveData): Promise<SaveData> {
    let dirty = false;

    if (!save.choicesMade) {
      save.choicesMade = [];
      dirty = true;
    }
    if (!save.narrativeState) {
      save.narrativeState = { whispersShown: [], vignettesSeen: [], reflectionsSeen: [] };
      dirty = true;
    }
    if (!save.emotionalPath) {
      save.emotionalPath = 'balanced';
      dirty = true;
    }
    if (!save.journalUnlockProgress) {
      save.journalUnlockProgress = {};
      dirty = true;
    }
    if (save.settings && !save.settings.textSpeed) {
      save.settings.textSpeed = 'normal';
      save.settings.subtitles = save.settings.subtitles ?? true;
      dirty = true;
    }

    if (dirty) {
      await this.saveGame(save);
    }
    return save;
  }
}

export const saveSystem = new SaveSystem();
