import { Howl, Howler } from 'howler';
import type { GameSettings } from '@/types';

interface SoundAsset {
  key: string;
  path: string;
  volume?: number;
  loop?: boolean;
}

class AudioManager {
  private sounds: Map<string, Howl> = new Map();
  private currentMusic: Howl | null = null;
  private ambientLayer: Howl | null = null;
  private combatLayer: Howl | null = null;
  private isInCombat: boolean = false;
  private settings: { masterVolume: number; musicVolume: number; sfxVolume: number };

  constructor() {
    this.settings = {
      masterVolume: 0.7,
      musicVolume: 0.5,
      sfxVolume: 0.6
    };
  }

  initialize(assets: SoundAsset[]): void {
    // Initialize audio asynchronously to not block game startup
    assets.forEach(asset => {
      try {
        const sound = new Howl({
          src: [asset.path],
          volume: (asset.volume || 1.0) * this.settings.sfxVolume * this.settings.masterVolume,
          loop: asset.loop || false,
          preload: true, // Preload audio to avoid 416 errors
          html5: asset.loop || false, // Use HTML5 only for looping tracks
          pool: asset.loop ? 1 : 5 // Limit pool size for better resource management
        });
        this.sounds.set(asset.key, sound);
      } catch (error) {
        console.warn(`Failed to load audio: ${asset.key}`, error);
      }
    });
  }

  playSfx(key: string, volumeOverride?: number): void {
    const sound = this.sounds.get(key);
    if (sound) {
      try {
        const volume = volumeOverride !== undefined 
          ? volumeOverride * this.settings.sfxVolume * this.settings.masterVolume
          : this.settings.sfxVolume * this.settings.masterVolume;
        sound.volume(volume);
        sound.play();
      } catch (error) {
        // Silently fail if audio doesn't load
        console.warn(`Failed to play sound: ${key}`);
      }
    }
  }

  playMusic(key: string, fadeIn: boolean = true): void {
    const sound = this.sounds.get(key);
    if (!sound) return;

    try {
      if (this.currentMusic) {
        if (fadeIn) {
          this.currentMusic.fade(this.currentMusic.volume(), 0, 500);
          setTimeout(() => {
            this.currentMusic?.stop();
            this.startMusic(key, fadeIn);
          }, 500);
        } else {
          this.currentMusic.stop();
          this.startMusic(key, fadeIn);
        }
      } else {
        this.startMusic(key, fadeIn);
      }
    } catch (error) {
      console.warn(`Failed to play music: ${key}`);
    }
  }

  private startMusic(key: string, fadeIn: boolean): void {
    const sound = this.sounds.get(key);
    if (sound) {
      this.currentMusic = sound;
      const targetVolume = this.settings.musicVolume * this.settings.masterVolume;
      
      try {
        if (fadeIn) {
          sound.volume(0);
          sound.play();
          sound.fade(0, targetVolume, 1000);
        } else {
          sound.volume(targetVolume);
          sound.play();
        }
      } catch (error) {
        // Handle autoplay restrictions silently
        console.warn(`Audio playback blocked: ${key}. User interaction required.`);
      }
    }
  }

  stopMusic(fadeOut: boolean = true): void {
    if (this.currentMusic) {
      if (fadeOut) {
        this.currentMusic.fade(this.currentMusic.volume(), 0, 500);
        setTimeout(() => {
          this.currentMusic?.stop();
          this.currentMusic = null;
        }, 500);
      } else {
        this.currentMusic.stop();
        this.currentMusic = null;
      }
    }
  }

  pauseMusic(): void {
    this.currentMusic?.pause();
  }

  resumeMusic(): void {
    this.currentMusic?.play();
  }

  updateSettings(settings: Partial<GameSettings>): void {
    if (settings.masterVolume !== undefined) this.settings.masterVolume = settings.masterVolume;
    if (settings.musicVolume !== undefined) this.settings.musicVolume = settings.musicVolume;
    if (settings.sfxVolume !== undefined) this.settings.sfxVolume = settings.sfxVolume;

    Howler.volume(this.settings.masterVolume);
    
    if (this.currentMusic) {
      this.currentMusic.volume(this.settings.musicVolume * this.settings.masterVolume);
    }
  }

  unlockAudio(): void {
    // Resume audio context on user interaction
    try {
      Howler.ctx?.resume();
    } catch (error) {
      console.warn('Failed to unlock audio context:', error);
    }
  }

  /**
   * 3-Layer adaptive audio:
   * - Base layer: always playing (main music)
   * - Ambient layer: plays when not in combat (low pass, quiet)
   * - Combat layer: crossfades in when enemies are present
   */
  startAmbientLayer(key: string): void {
    const sound = this.sounds.get(key);
    if (!sound) return;
    this.ambientLayer = sound;
    const vol = this.settings.musicVolume * this.settings.masterVolume * 0.4;
    try {
      sound.volume(vol);
      sound.play();
    } catch (e) { /* silent */ }
  }

  startCombatLayer(key: string): void {
    const sound = this.sounds.get(key);
    if (!sound) return;
    this.combatLayer = sound;
    try {
      sound.volume(0);
      sound.play();
    } catch (e) { /* silent */ }
  }

  setCombatState(inCombat: boolean): void {
    if (this.isInCombat === inCombat) return;
    this.isInCombat = inCombat;

    const targetVol = this.settings.musicVolume * this.settings.masterVolume;
    const ambientVol = targetVol * 0.4;
    const combatVol = targetVol * 0.7;

    try {
      if (inCombat) {
        this.ambientLayer?.fade(ambientVol, 0, 800);
        this.combatLayer?.fade(0, combatVol, 800);
      } else {
        this.ambientLayer?.fade(0, ambientVol, 1200);
        this.combatLayer?.fade(combatVol, 0, 1200);
      }
    } catch (e) { /* silent */ }
  }

  stopLayeredAudio(): void {
    try {
      this.ambientLayer?.stop();
      this.combatLayer?.stop();
    } catch (e) { /* silent */ }
    this.ambientLayer = null;
    this.combatLayer = null;
    this.isInCombat = false;
  }

  stopAll(): void {
    Howler.stop();
    this.currentMusic = null;
    this.ambientLayer = null;
    this.combatLayer = null;
  }
}

export const audioManager = new AudioManager();
