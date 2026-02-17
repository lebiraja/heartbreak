import type { LevelConfig, CockpitConfig, DamageEffectConfig, AudioLayerConfig, PowerUpData, PowerUpType } from '@/types';

export const GAME_CONFIG = {
  width: 1280,
  height: 720,
  levelQuotes: [
    "We learn from history that we do not learn anything from history.",
    "People get lost in thought because it is unfamiliar territory.",
    "If only I could be respected without having to be respectable.",
    "All wise men share one trait in common: the ability to listen.",
    "Put your trust in those who are worthy.",
    "All I ask of life is a constant and exaggerated sense of my own importance.",
    "The more things change, the more they stay insane.",
    "There will be big changes for you, but you will be happy.",
    "Due to circumstances beyond your control, you are master of your fate and captain of your soul.",
    "Among the lucky, you are the chosen one."
  ],
  epigraph: "If anything can go wrong, it will.",
  maxLevels: 10
};

export const PLAYER_CONFIG = {
  speed: 300,
  health: 100,
  maxHealth: 100,
  shield: 50,
  maxShield: 50,
  shieldRegenRate: 2,
  shieldRegenDelay: 3000,
  primaryFireRate: 200,
  primaryDamage: 10,
  secondaryChargeTime: 1500,
  secondaryDamage: 50,
  invulnerabilityTime: 2000
};

export const ENEMY_TYPES = {
  basic: {
    type: 'basic',
    health: 30,
    speed: 150,
    damage: 10,
    scoreValue: 100,
    aiPattern: 'straight' as const
  },
  fast: {
    type: 'fast',
    health: 20,
    speed: 300,
    damage: 15,
    scoreValue: 150,
    aiPattern: 'zigzag' as const
  },
  tank: {
    type: 'tank',
    health: 80,
    speed: 80,
    damage: 25,
    scoreValue: 250,
    aiPattern: 'straight' as const
  },
  sniper: {
    type: 'sniper',
    health: 40,
    speed: 100,
    damage: 20,
    scoreValue: 200,
    aiPattern: 'strafe' as const
  }
};

export const COLORS = {
  primary: 0x00ffff,
  secondary: 0xff00ff,
  accent: 0xffff00,
  background: 0x0a0a1a,
  ui: {
    bg: 0x1a1a2e,
    border: 0x00ffff,
    text: 0xffffff,
    textDim: 0x888888,
    success: 0x00ff00,
    warning: 0xffaa00,
    danger: 0xff0000
  },
  colorBlind: {
    protanopia: {
      player: 0x0088ff,
      enemy: 0xffaa00,
      powerup: 0xffffff
    },
    deuteranopia: {
      player: 0x0088ff,
      enemy: 0xffaa00,
      powerup: 0xffffff
    },
    tritanopia: {
      player: 0xff0088,
      enemy: 0x00ff88,
      powerup: 0xffffff
    }
  }
};

export const DEFAULT_SETTINGS = {
  masterVolume: 0.7,
  musicVolume: 0.5,
  sfxVolume: 0.6,
  reducedMotion: false,
  colorBlindMode: 'none' as const,
  screenShake: true,
  particles: true,
  showFPS: false,
  textSpeed: 'normal' as const,
  subtitles: true,
  controls: {
    moveUp: 'W',
    moveDown: 'S',
    moveLeft: 'A',
    moveRight: 'D',
    primaryFire: 'MOUSE_LEFT',
    secondaryFire: 'MOUSE_RIGHT',
    pause: 'ESCAPE'
  }
};

// ========================================
// Cockpit Configuration
// ========================================

export const COCKPIT_CONFIG: CockpitConfig = {
  topHeight: 80,
  bottomHeight: 60,
  sideWidth: 80,
  metalColor: 0x2a2a3a,
  metalHighlight: 0x3a3a4a,
  accentColor: 0x00ffff,
  rivetRadius: 2,
  rivetSpacing: 40,
};

// ========================================
// Damage Effect Configuration
// ========================================

export const DAMAGE_EFFECT_CONFIG: DamageEffectConfig = {
  bulletTimeEnabled: true,
  bulletTimeDuration: 300,
  screenCrack: true,
  cameraZoom: true,
  redFlash: true,
  heavyHitThreshold: 25,
};

// ========================================
// Audio Layer Configurations (per-level)
// ========================================

export const AUDIO_LAYER_CONFIGS: Record<number, AudioLayerConfig> = {
  1: { level: 1, baseMusic: 'base_L1', ambientLayer: 'ambient_L1', combatLayer: 'combat_L1' },
  2: { level: 2, baseMusic: 'base_L2', ambientLayer: 'ambient_L2', combatLayer: 'combat_L2' },
  3: { level: 3, baseMusic: 'base_L3', ambientLayer: 'ambient_L3', combatLayer: 'combat_L3' },
  4: { level: 4, baseMusic: 'base_L4', ambientLayer: 'ambient_L4', combatLayer: 'combat_L4' },
  5: { level: 5, baseMusic: 'base_L5', ambientLayer: 'ambient_L5', combatLayer: 'combat_L5' },
  6: { level: 6, baseMusic: 'base_L6', ambientLayer: 'ambient_L6', combatLayer: 'combat_L6' },
  7: { level: 7, baseMusic: 'base_L7', ambientLayer: 'ambient_L7', combatLayer: 'combat_L7' },
  8: { level: 8, baseMusic: 'base_L8', ambientLayer: 'ambient_L8', combatLayer: 'combat_L8' },
  9: { level: 9, baseMusic: 'base_L9', ambientLayer: 'ambient_L9', combatLayer: 'combat_L9' },
  10: { level: 10, baseMusic: 'base_L10', ambientLayer: 'ambient_L10', combatLayer: 'combat_L10' },
};

// ========================================
// Power-Up Configurations (Level 8)
// ========================================

export const POWER_UP_CONFIGS: Record<PowerUpType, PowerUpData> = {
  double_damage: {
    type: 'double_damage',
    duration: 12000,
    multiplier: 2.0,
    color: 0xff4444,
    label: 'DOUBLE DAMAGE',
  },
  double_speed: {
    type: 'double_speed',
    duration: 10000,
    multiplier: 2.0,
    color: 0x44ff44,
    label: 'OVERDRIVE',
  },
  rapid_fire: {
    type: 'rapid_fire',
    duration: 10000,
    multiplier: 0.4, // fire rate multiplier (lower = faster)
    color: 0xffaa00,
    label: 'RAPID FIRE',
  },
  shield_overcharge: {
    type: 'shield_overcharge',
    duration: 15000,
    multiplier: 2.0, // max shield multiplier
    color: 0x4488ff,
    label: 'SHIELD SURGE',
  },
};

// ========================================
// Level Names (emotional themes)
// ========================================

export const LEVEL_NAMES: Record<number, string> = {
  1: 'Echoes of Yesterday',
  2: 'Mind Maze',
  3: 'Facade Mirrors',
  4: 'Quiet Signals',
  5: 'Trust Bridge',
  6: 'Ego Engine',
  7: 'Chaos Current',
  8: 'New Growth',
  9: 'Helm of Fate',
  10: 'Homecoming',
};

// ========================================
// Level Configs (expanded)
// ========================================

export const LEVEL_CONFIGS: LevelConfig[] = Array.from({ length: 10 }, (_, i) => ({
  level: i + 1,
  quote: GAME_CONFIG.levelQuotes[i],
  difficulty: 1 + i * 0.3,
  environment: LEVEL_NAMES[i + 1],
  vignetteId: `vignette_${i + 1}`,
  reflectionId: `reflection_${i + 1}`,
  whisperIds: Array.from({ length: 7 }, (_, w) => `l${i + 1}_w${w + 1}`),
  mechanic: getMechanicForLevel(i + 1),
  waves: [
    {
      enemyType: 'basic' as const,
      count: 5 + i * 2,
      delay: 2000 - i * 100,
      formation: 'line' as const
    },
    {
      enemyType: 'fast' as const,
      count: 3 + i,
      delay: 1500 - i * 80,
      formation: 'v' as const
    },
    ...(i >= 3 ? [{
      enemyType: 'tank' as const,
      count: 2 + Math.floor(i / 2),
      delay: 3000,
      formation: 'random' as const
    }] : []),
    ...(i >= 5 ? [{
      enemyType: 'sniper' as const,
      count: 2 + Math.floor(i / 3),
      delay: 2500,
      formation: 'circle' as const
    }] : [])
  ],
  miniBoss: i === 4 ? {
    type: 'miniboss_1',
    health: 500,
    attack: 20,
    speed: 120,
    abilities: ['shield', 'laser']
  } : undefined,
  finalBoss: i === 9 ? {
    type: 'final_boss',
    health: 2000,
    attack: 30,
    speed: 100,
    abilities: ['shield', 'laser', 'missiles', 'summon']
  } : undefined
}));

function getMechanicForLevel(level: number) {
  switch (level) {
    case 1: return {
      type: 'ghost_afterimage' as const,
      config: { ghostAlpha: 0.2, ghostDuration: 2500, ghostFadeTime: 1500 }
    };
    case 2: return {
      type: 'fog_zones' as const,
      config: {
        zoneCount: 4,
        effects: ['invert', 'drift', 'delay', 'invert'],
        driftStrength: 50,
        delayMs: 300,
      }
    };
    case 3: return {
      type: 'mirror_enemies' as const,
      config: { mirrorDelay: 0, mirrorFireSync: true }
    };
    case 4: return {
      type: 'invisible_enemies' as const,
      config: { pulseAlpha: 0.8, pulseDuration: 300, telegraphTime: 800 }
    };
    case 5: return {
      type: 'npc_encounter' as const,
      config: { helpProximity: 80, helpDuration: 2000 }
    };
    case 6: return {
      type: 'ego_weapon' as const,
      config: { damageMultiplier: 3, shieldDrainRate: 2, toggleKey: 'E' }
    };
    case 7: return {
      type: 'behavior_detection' as const,
      config: { aggressiveThreshold: 0.7, defensiveThreshold: 0.5 }
    };
    case 8: return {
      type: 'power_ups' as const,
      config: { spawnInterval: 8000, maxActive: 2 }
    };
    case 9: return {
      type: 'split_paths' as const,
      config: { forkCount: 2, forkWidth: 200 }
    };
    case 10: return {
      type: 'final_sequence' as const,
      config: { brightenRate: 0.001 }
    };
    default: return undefined;
  }
}

// ========================================
// Boss Data (expanded for story-driven fights)
// ========================================

export const BOSS_DATA = {
  miniboss_1: {
    type: 'miniboss_1',
    name: 'The Warden',
    health: 500,
    phases: [
      {
        healthThreshold: 1.0,
        attackPattern: 'shield_burst',
        dialogue: ['You think crossing a bridge makes you brave?', 'Trust is a crack in the armor. I\'ll show you why.'],
        speed: 120,
      },
      {
        healthThreshold: 0.5,
        attackPattern: 'laser_sweep',
        dialogue: ['Everyone you\'ve ever trusted has left.', 'Still fighting? Maybe you are brave.'],
        speed: 150,
      },
      {
        healthThreshold: 0.2,
        attackPattern: 'desperation',
        dialogue: ['Fine. Cross your bridge.', 'But remember — I\'ll be on the other side.'],
        speed: 180,
      },
    ],
    dialogueLines: [],
    telegraphDuration: 1200,
  },
  final_boss: {
    type: 'final_boss',
    name: 'The Keeper',
    health: 2000,
    phases: [
      {
        healthThreshold: 1.0,
        attackPattern: 'shield_laser',
        dialogue: ['Welcome home, Stark. Or is this just another dream?', 'You can\'t outrun what made you. I AM what made you.'],
        speed: 100,
      },
      {
        healthThreshold: 0.66,
        attackPattern: 'missile_barrage',
        dialogue: ['Every heartbreak, every tear — I kept them safe.', 'Let me show you what you\'re really afraid of.'],
        speed: 130,
      },
      {
        healthThreshold: 0.33,
        attackPattern: 'summon_assault',
        dialogue: ['LISTEN TO ME. You need this pain.', 'Without it, who are you?'],
        speed: 160,
      },
      {
        healthThreshold: 0.1,
        attackPattern: 'final_stand',
        dialogue: ['No... you\'re letting go.', 'Maybe... maybe you don\'t need me anymore.'],
        speed: 100,
      },
    ],
    dialogueLines: [],
    telegraphDuration: 1000,
  },
};
