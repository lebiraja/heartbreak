// ========================================
// Core Game Types
// ========================================

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
  environment: string;
  mechanic?: LevelMechanic;
  whisperIds: string[];
  vignetteId: string;
  reflectionId: string;
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

// ========================================
// Player Types
// ========================================

export interface PlayerState {
  health: number;
  maxHealth: number;
  shield: number;
  maxShield: number;
  score: number;
  combo: number;
  level: number;
  memoryShardsCollected: number;
  activeBuffs: ActiveBuff[];
  egoWeaponActive: boolean;
  enemiesKilled: number;
  enemiesDodged: number;
}

export type PowerUpType = 'double_damage' | 'double_speed' | 'rapid_fire' | 'shield_overcharge';

export interface PowerUpData {
  type: PowerUpType;
  duration: number;
  multiplier: number;
  color: number;
  label: string;
}

export interface ActiveBuff {
  type: PowerUpType;
  remainingTime: number;
  multiplier: number;
}

// ========================================
// Save & Settings Types
// ========================================

export interface SaveData {
  playerName: string;
  levelsCompleted: boolean[];
  highScore: number;
  totalMemoryShards: number;
  unlockedLevels: number;
  settings: GameSettings;
  journalEntries: JournalEntry[];
  statistics: GameStatistics;
  choicesMade: ChoiceResult[];
  narrativeState: {
    whispersShown: string[];
    vignettesSeen: number[];
    reflectionsSeen: number[];
  };
  emotionalPath: EmotionalPath;
  journalUnlockProgress: Record<number, JournalUnlockState>;
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
  textSpeed: 'slow' | 'normal' | 'fast';
  subtitles: boolean;
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

export interface JournalUnlockState {
  quoteUnlocked: boolean;
  reflectionUnlocked: boolean;
  whispersUnlocked: boolean;
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

// ========================================
// Enemy & Weapon Types
// ========================================

export interface EnemyData {
  type: string;
  health: number;
  speed: number;
  damage: number;
  scoreValue: number;
  aiPattern: 'straight' | 'zigzag' | 'chase' | 'strafe' | 'mirror' | 'invisible';
}

export interface WeaponData {
  type: 'primary' | 'secondary';
  damage: number;
  fireRate: number;
  speed: number;
  chargeTime?: number;
  maxCharge?: number;
}

// ========================================
// Narrative Types
// ========================================

export type ChoiceId = 'trust_bridge' | 'chaos_current' | 'helm_mercy' | 'helm_risk' | 'homecoming';

export interface ChoiceOption {
  id: string;
  label: string;
  description: string;
}

export interface ChoiceResult {
  choiceId: ChoiceId;
  selectedOption: string;
  level: number;
  timestamp: number;
}

export type EmotionalPath = 'compassionate' | 'aggressive' | 'balanced';

export interface NarrativeState {
  currentPath: EmotionalPath;
  choicesMade: ChoiceResult[];
  whispersShown: Set<string>;
  vignettesSeen: number[];
  reflectionsSeen: number[];
}

export interface VignetteData {
  level: number;
  lines: string[];
  backgroundTheme: string;
}

export interface WhisperData {
  id: string;
  level: number;
  text: string;
  triggerCondition: 'calm' | 'post_wave' | 'low_health' | 'timed';
  delay?: number;
}

export interface ReflectionData {
  level: number;
  defaultText: string;
  variants: Record<string, string>;
}

export interface MemoryShardData {
  level: number;
  fragments: string[];
}

export interface ChoiceDialogueData {
  prompt: string;
  options: ChoiceOption[];
  consequenceText: Record<string, string>;
}

// ========================================
// Boss Types
// ========================================

export interface BossPhase {
  healthThreshold: number;
  attackPattern: string;
  dialogue: string[];
  speed: number;
}

export interface BossData {
  type: string;
  name: string;
  health: number;
  phases: BossPhase[];
  dialogueLines: string[];
  telegraphDuration: number;
}

// ========================================
// Level Mechanic Types
// ========================================

export type LevelMechanicType =
  | 'ghost_afterimage'
  | 'fog_zones'
  | 'mirror_enemies'
  | 'invisible_enemies'
  | 'npc_encounter'
  | 'ego_weapon'
  | 'behavior_detection'
  | 'power_ups'
  | 'split_paths'
  | 'final_sequence';

export interface LevelMechanic {
  type: LevelMechanicType;
  config: Record<string, any>;
}

// ========================================
// Environment Types
// ========================================

export type BackgroundLayerType =
  | 'stars'
  | 'nebula'
  | 'debris'
  | 'crystals'
  | 'fog'
  | 'pulse'
  | 'bridge'
  | 'wreckage'
  | 'reality_wave'
  | 'birth_light';

export interface BackgroundLayer {
  type: BackgroundLayerType;
  speed: number;
  density: number;
  color: number;
  alpha: number;
}

export interface AmbientParticleConfig {
  type: string;
  color: number;
  count: number;
  speed: { min: number; max: number };
  alpha: { start: number; end: number };
  scale: { start: number; end: number };
  lifespan: number;
}

export interface EnvironmentConfig {
  level: number;
  name: string;
  primaryColor: number;
  secondaryColor: number;
  backgroundGradient: { top: number; bottom: number };
  backgroundLayers: BackgroundLayer[];
  ambientParticles: AmbientParticleConfig[];
  fogEnabled: boolean;
  fogColor?: number;
  fogDensity?: number;
}

// ========================================
// Effects & Audio Types
// ========================================

export interface DamageEffectConfig {
  bulletTimeEnabled: boolean;
  bulletTimeDuration: number;
  screenCrack: boolean;
  cameraZoom: boolean;
  redFlash: boolean;
  heavyHitThreshold: number;
}

export interface AudioLayerConfig {
  level: number;
  baseMusic: string;
  ambientLayer: string;
  combatLayer: string;
}

export interface CockpitConfig {
  topHeight: number;
  bottomHeight: number;
  sideWidth: number;
  metalColor: number;
  metalHighlight: number;
  accentColor: number;
  rivetRadius: number;
  rivetSpacing: number;
}

// ========================================
// Particle & Visual Types
// ========================================

export interface ParticleConfig {
  count: number;
  color: number;
  speed: { min: number; max: number };
  scale: { start: number; end: number };
  lifespan: number;
}

// ========================================
// Game State
// ========================================

export type GameState =
  | 'title'
  | 'levelSelect'
  | 'playing'
  | 'paused'
  | 'gameOver'
  | 'journal'
  | 'leaderboard'
  | 'settings'
  | 'opening'
  | 'vignette'
  | 'ending'
  | 'choice';
