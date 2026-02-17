import type { EnvironmentConfig } from '@/types';

export const ENVIRONMENT_CONFIGS: Record<number, EnvironmentConfig> = {
  // L1: Echoes of Yesterday - Floating debris, shattered photographs, distorted stars
  1: {
    level: 1,
    name: 'Echoes of Yesterday',
    primaryColor: 0x7a6655,
    secondaryColor: 0x4a3d33,
    backgroundGradient: { top: 0x0a0a15, bottom: 0x0d0b18 },
    backgroundLayers: [
      { type: 'stars', speed: 0.4, density: 35, color: 0xccbbaa, alpha: 0.5 },
      { type: 'debris', speed: 1.0, density: 18, color: 0x887766, alpha: 0.6 },
      { type: 'debris', speed: 0.6, density: 8, color: 0x665544, alpha: 0.3 },
    ],
    ambientParticles: [
      {
        type: 'dust',
        color: 0x998877,
        count: 25,
        speed: { min: 5, max: 20 },
        alpha: { start: 0.3, end: 0 },
        scale: { start: 0.5, end: 0.1 },
        lifespan: 6000,
      },
    ],
    fogEnabled: false,
  },

  // L2: Mind Maze - Nebula corridors, labyrinthine fog paths
  2: {
    level: 2,
    name: 'Mind Maze',
    primaryColor: 0x6633aa,
    secondaryColor: 0x2244bb,
    backgroundGradient: { top: 0x0a0520, bottom: 0x0d0830 },
    backgroundLayers: [
      { type: 'stars', speed: 0.3, density: 50, color: 0xddccff, alpha: 0.4 },
      { type: 'nebula', speed: 0.5, density: 12, color: 0x6633aa, alpha: 0.25 },
      { type: 'nebula', speed: 0.3, density: 8, color: 0x2244bb, alpha: 0.2 },
      { type: 'fog', speed: 0.8, density: 6, color: 0x442288, alpha: 0.15 },
    ],
    ambientParticles: [
      {
        type: 'wisp',
        color: 0x8855cc,
        count: 20,
        speed: { min: 8, max: 30 },
        alpha: { start: 0.25, end: 0 },
        scale: { start: 1.5, end: 0.3 },
        lifespan: 5000,
      },
    ],
    fogEnabled: true,
    fogColor: 0x331166,
    fogDensity: 0.3,
  },

  // L3: Facade Mirrors - Reflective crystalline asteroids
  3: {
    level: 3,
    name: 'Facade Mirrors',
    primaryColor: 0xccddff,
    secondaryColor: 0x88aaee,
    backgroundGradient: { top: 0x080a18, bottom: 0x0c0e22 },
    backgroundLayers: [
      { type: 'stars', speed: 0.5, density: 45, color: 0xffffff, alpha: 0.6 },
      { type: 'crystals', speed: 0.8, density: 20, color: 0xccddff, alpha: 0.7 },
      { type: 'crystals', speed: 0.5, density: 10, color: 0x88aaee, alpha: 0.4 },
    ],
    ambientParticles: [
      {
        type: 'sparkle',
        color: 0xffffff,
        count: 30,
        speed: { min: 3, max: 15 },
        alpha: { start: 0.8, end: 0 },
        scale: { start: 0.3, end: 0 },
        lifespan: 1500,
      },
    ],
    fogEnabled: false,
  },

  // L4: Quiet Signals - Silent space, faint glowing pulses
  4: {
    level: 4,
    name: 'Quiet Signals',
    primaryColor: 0xffaa66,
    secondaryColor: 0x553322,
    backgroundGradient: { top: 0x050505, bottom: 0x080808 },
    backgroundLayers: [
      { type: 'stars', speed: 0.2, density: 15, color: 0xffddbb, alpha: 0.3 },
      { type: 'pulse', speed: 0.1, density: 5, color: 0xffaa66, alpha: 0.15 },
    ],
    ambientParticles: [
      {
        type: 'pulse_glow',
        color: 0xffaa66,
        count: 8,
        speed: { min: 2, max: 8 },
        alpha: { start: 0.15, end: 0 },
        scale: { start: 0.5, end: 2.0 },
        lifespan: 4000,
      },
    ],
    fogEnabled: false,
  },

  // L5: Trust Bridge - Broken cosmic bridge, warm amber/gold
  5: {
    level: 5,
    name: 'Trust Bridge',
    primaryColor: 0xffcc44,
    secondaryColor: 0xcc8800,
    backgroundGradient: { top: 0x0a0808, bottom: 0x151008 },
    backgroundLayers: [
      { type: 'stars', speed: 0.4, density: 40, color: 0xffeedd, alpha: 0.5 },
      { type: 'bridge', speed: 0.3, density: 12, color: 0xcc9944, alpha: 0.6 },
      { type: 'bridge', speed: 0.2, density: 6, color: 0x886622, alpha: 0.3 },
    ],
    ambientParticles: [
      {
        type: 'energy_spark',
        color: 0xffdd66,
        count: 18,
        speed: { min: 10, max: 40 },
        alpha: { start: 0.6, end: 0 },
        scale: { start: 0.4, end: 0.1 },
        lifespan: 2500,
      },
    ],
    fogEnabled: false,
  },

  // L6: Ego Engine - Massive abandoned warship, dark grey/green
  6: {
    level: 6,
    name: 'Ego Engine',
    primaryColor: 0x556655,
    secondaryColor: 0x334433,
    backgroundGradient: { top: 0x080a08, bottom: 0x0c100c },
    backgroundLayers: [
      { type: 'stars', speed: 0.3, density: 25, color: 0xaabbaa, alpha: 0.35 },
      { type: 'wreckage', speed: 0.4, density: 15, color: 0x445544, alpha: 0.5 },
      { type: 'wreckage', speed: 0.2, density: 8, color: 0x334433, alpha: 0.3 },
    ],
    ambientParticles: [
      {
        type: 'metal_debris',
        color: 0x667766,
        count: 15,
        speed: { min: 5, max: 25 },
        alpha: { start: 0.4, end: 0 },
        scale: { start: 0.3, end: 0.1 },
        lifespan: 4500,
      },
    ],
    fogEnabled: false,
  },

  // L7: Chaos Current - Shifting unstable reality waves, multi-color
  7: {
    level: 7,
    name: 'Chaos Current',
    primaryColor: 0xff44aa,
    secondaryColor: 0x44aaff,
    backgroundGradient: { top: 0x0a0515, bottom: 0x050a15 },
    backgroundLayers: [
      { type: 'stars', speed: 0.6, density: 55, color: 0xffffff, alpha: 0.5 },
      { type: 'reality_wave', speed: 1.5, density: 10, color: 0xff44aa, alpha: 0.35 },
      { type: 'reality_wave', speed: 1.2, density: 8, color: 0x44aaff, alpha: 0.3 },
      { type: 'reality_wave', speed: 0.8, density: 5, color: 0xaaff44, alpha: 0.2 },
    ],
    ambientParticles: [
      {
        type: 'glitch',
        color: 0xff66cc,
        count: 35,
        speed: { min: 20, max: 80 },
        alpha: { start: 0.5, end: 0 },
        scale: { start: 0.4, end: 0 },
        lifespan: 1200,
      },
    ],
    fogEnabled: false,
  },

  // L8: New Growth - Birth of stars, warm luminous colors
  8: {
    level: 8,
    name: 'New Growth',
    primaryColor: 0xffaa44,
    secondaryColor: 0xff6688,
    backgroundGradient: { top: 0x1a1028, bottom: 0x201530 },
    backgroundLayers: [
      { type: 'stars', speed: 0.5, density: 70, color: 0xffeedd, alpha: 0.7 },
      { type: 'birth_light', speed: 0.4, density: 8, color: 0xffaa44, alpha: 0.3 },
      { type: 'birth_light', speed: 0.3, density: 5, color: 0xff6688, alpha: 0.25 },
      { type: 'nebula', speed: 0.2, density: 4, color: 0xffcc88, alpha: 0.15 },
    ],
    ambientParticles: [
      {
        type: 'warm_glow',
        color: 0xffcc66,
        count: 40,
        speed: { min: 5, max: 25 },
        alpha: { start: 0.5, end: 0 },
        scale: { start: 0.3, end: 1.2 },
        lifespan: 3500,
      },
      {
        type: 'birth_spark',
        color: 0xff8866,
        count: 20,
        speed: { min: 15, max: 50 },
        alpha: { start: 0.7, end: 0 },
        scale: { start: 0.2, end: 0 },
        lifespan: 1800,
      },
    ],
    fogEnabled: false,
  },

  // L9: Helm of Fate - Approaching home system, clean blue/green
  9: {
    level: 9,
    name: 'Helm of Fate',
    primaryColor: 0x4488cc,
    secondaryColor: 0x44aa88,
    backgroundGradient: { top: 0x080c14, bottom: 0x0a1018 },
    backgroundLayers: [
      { type: 'stars', speed: 0.4, density: 50, color: 0xddeeff, alpha: 0.6 },
      { type: 'stars', speed: 0.2, density: 20, color: 0x88bbdd, alpha: 0.3 },
    ],
    ambientParticles: [
      {
        type: 'calm_drift',
        color: 0x88ccee,
        count: 15,
        speed: { min: 3, max: 12 },
        alpha: { start: 0.3, end: 0 },
        scale: { start: 0.4, end: 0.2 },
        lifespan: 5000,
      },
    ],
    fogEnabled: false,
  },

  // L10: Homecoming - Dream dissolves to clarity
  10: {
    level: 10,
    name: 'Homecoming',
    primaryColor: 0xffffff,
    secondaryColor: 0xeeeeff,
    backgroundGradient: { top: 0x0a0a14, bottom: 0x0c0c18 },
    backgroundLayers: [
      { type: 'stars', speed: 0.3, density: 40, color: 0xffffff, alpha: 0.5 },
    ],
    ambientParticles: [
      {
        type: 'dissolve',
        color: 0xffffff,
        count: 20,
        speed: { min: 3, max: 10 },
        alpha: { start: 0.2, end: 0 },
        scale: { start: 0.3, end: 0.8 },
        lifespan: 4000,
      },
    ],
    fogEnabled: false,
  },
};
