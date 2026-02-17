import type { GameSettings } from '@/types';
import { DEFAULT_SETTINGS } from '@/config';

export function getDefaultSettings(): GameSettings {
  return JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
}

export function safeGetSettings(settings: GameSettings | null | undefined): GameSettings {
  if (!settings) {
    return getDefaultSettings();
  }
  
  // Ensure all required fields exist
  return {
    masterVolume: settings.masterVolume ?? DEFAULT_SETTINGS.masterVolume,
    musicVolume: settings.musicVolume ?? DEFAULT_SETTINGS.musicVolume,
    sfxVolume: settings.sfxVolume ?? DEFAULT_SETTINGS.sfxVolume,
    reducedMotion: settings.reducedMotion ?? DEFAULT_SETTINGS.reducedMotion,
    colorBlindMode: settings.colorBlindMode ?? DEFAULT_SETTINGS.colorBlindMode,
    screenShake: settings.screenShake ?? DEFAULT_SETTINGS.screenShake,
    particles: settings.particles ?? DEFAULT_SETTINGS.particles,
    showFPS: settings.showFPS ?? DEFAULT_SETTINGS.showFPS,
    textSpeed: settings.textSpeed ?? DEFAULT_SETTINGS.textSpeed,
    subtitles: settings.subtitles ?? DEFAULT_SETTINGS.subtitles,
    controls: settings.controls ?? DEFAULT_SETTINGS.controls
  };
}
