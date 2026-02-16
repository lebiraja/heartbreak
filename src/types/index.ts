export interface GameConfig {
  levelQuotes: string[];
  epigraph: string;
  maxLevels: number;
}

export interface LevelConfig {
  level: number;
  quote: string;
  waves: WaveConfig[];
  miniBoss?: BossConfig;
  finalBoss?: BossConfig;
  backgroundTheme?: string;
  difficulty: number;
}

export interface WaveConfig {
  enemyType: 'basic' | 'fast' | 'tank' | 'sniper';
  count: number;
  delay: number;
  formation?: 'line' | 'v' | 'circle' | 'random';
}

export interface BossConfig {
  type: string;
  health: number;
  attack: number;
  speed: number;
  abilities: string[];
}

export interface PlayerState {
  health: number;
  maxHealth: number;
  shield: number;
  maxShield: number;
  score: number;
  combo: number;
  level: number;
  memoryShardsCollected: number;
}

export interface SaveData {
  playerName: string;
  levelsCompleted: boolean[];
  highScore: number;
  totalMemoryShards: number;
  unlockedLevels: number;
  settings: GameSettings;
  journalEntries: JournalEntry[];
  statistics: GameStatistics;
}

export interface GameSettings {
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  reducedMotion: boolean;
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  screenShake: boolean;
  particles: boolean;
  showFPS: boolean;
  controls: ControlMapping;
}

export interface ControlMapping {
  moveUp: string;
  moveDown: string;
  moveLeft: string;
  moveRight: string;
  primaryFire: string;
  secondaryFire: string;
  pause: string;
}

export interface JournalEntry {
  level: number;
  quote: string;
  reflection: string;
  timestamp: number;
  completed: boolean;
}

export interface GameStatistics {
  totalEnemiesDestroyed: number;
  totalShipsFired: number;
  accuracyRate: number;
  totalPlayTime: number;
  deathCount: number;
  perfectLevels: number;
}

export interface LeaderboardEntry {
  rank: number;
  playerName: string;
  score: number;
  level: number;
  timestamp: number;
}

export interface EnemyData {
  type: string;
  health: number;
  speed: number;
  damage: number;
  scoreValue: number;
  aiPattern: 'straight' | 'zigzag' | 'chase' | 'strafe';
}

export interface WeaponData {
  type: 'primary' | 'secondary';
  damage: number;
  fireRate: number;
  speed: number;
  chargeTime?: number;
  maxCharge?: number;
}

export interface ParticleConfig {
  count: number;
  color: number;
  speed: { min: number; max: number };
  scale: { start: number; end: number };
  lifespan: number;
}

export type GameState = 'title' | 'levelSelect' | 'playing' | 'paused' | 'gameOver' | 'journal' | 'leaderboard' | 'settings';
