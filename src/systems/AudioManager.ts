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
          preload: false, // Load on demand to avoid blocking
          html5: true // Use HTML5 Audio for better compatibility
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
      
      if (fadeIn) {
        sound.volume(0);
        sound.play();
        sound.fade(0, targetVolume, 1000);
      } else {
        sound.volume(targetVolume);
        sound.play();
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

  stopAll(): void {
    Howler.stop();
    this.currentMusic = null;
  }
}

export const audioManager = new AudioManager();
