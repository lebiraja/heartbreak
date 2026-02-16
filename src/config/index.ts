import type { LevelConfig } from '@/types';

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

export const LEVEL_CONFIGS: LevelConfig[] = Array.from({ length: 10 }, (_, i) => ({
  level: i + 1,
  quote: GAME_CONFIG.levelQuotes[i],
  difficulty: 1 + i * 0.3,
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
