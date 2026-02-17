# Stellar Resolve - Complete Feature Documentation

> **"If anything can go wrong, it will... but we rise anyway."**

A production-ready browser-based 2D space shooter built with Phaser 3 and TypeScript. Guide a lonely pilot healing from heartbreak through 10 progressively challenging levels, each representing a stage of emotional growth.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Core Gameplay Features](#core-gameplay-features)
- [Game Entities](#game-entities)
- [UI Systems](#ui-systems)
- [Scene Architecture](#scene-architecture)
- [Audio System](#audio-system)
- [Persistence & Save System](#persistence--save-system)
- [Accessibility Features](#accessibility-features)
- [Visual Design System](#visual-design-system)
- [Configuration & Customization](#configuration--customization)
- [Technical Architecture](#technical-architecture)
- [Code Statistics](#code-statistics)

---

## 🎮 Overview

**Project Name**: Stellar Resolve  
**Genre**: 2D Space Shooter / Narrative Experience  
**Engine**: Phaser 3.90.0  
**Language**: TypeScript 5.9.3  
**Build Tool**: Vite 7.3.1  
**Resolution**: 1280x720 (responsive scaling)  
**Target FPS**: 60 FPS

### Theme
A metaphorical journey through 10 emotional stages of healing from heartbreak, represented through space combat. Each level features a philosophical quote reflecting a stage of recovery, from denial to resolution.

---

## 🕹️ Core Gameplay Features

### 1. **Player Control System**
- **Twin-stick controls**: WASD for movement + mouse for aiming
- **Independent movement and aiming**: Move in one direction while shooting in another
- **Smooth physics-based movement**: Velocity-based system with 300 speed units
- **Full keyboard navigation**: Menu systems support keyboard-only controls

### 2. **Weapon Systems**

#### Primary Weapon
- **Fire Rate**: 200ms cooldown
- **Damage**: 10 per shot
- **Projectile Speed**: Fast-moving energy bolts
- **Control**: Left mouse button (hold for continuous fire)
- **Visual**: Cyan-colored projectiles with particle trails

#### Secondary Weapon (Charged Shot)
- **Charge Time**: 1.5 seconds
- **Damage**: 50 (5x primary weapon)
- **Projectile**: Large, slow-moving charged sphere
- **Control**: Right mouse button (hold to charge, release to fire)
- **Visual**: Magenta-colored with larger hitbox
- **Visual Indicator**: Charging progress shown on player ship

### 3. **Health & Defense System**

#### Health System
- **Max Health**: 100 HP
- **Visual**: Red health bar in HUD
- **Damage Sources**: Enemy collisions, enemy projectiles
- **Game Over**: Health reaches 0

#### Shield System
- **Max Shield**: 50 points
- **Regeneration Rate**: 2 points per second
- **Regeneration Delay**: 3 seconds after last hit
- **Visual**: Cyan shield bar + visual bubble around ship
- **Mechanic**: Absorbs damage before health is affected

#### Invulnerability
- **Duration**: 2 seconds after taking damage
- **Visual Feedback**: Ship flashes/pulses
- **Purpose**: Prevents instant death from multiple hits

### 4. **Enemy System**

Four distinct enemy types with unique behaviors:

#### Basic Enemy
- **Health**: 30 HP
- **Speed**: 150 units/s
- **Damage**: 10
- **Score Value**: 100 points
- **AI Pattern**: Straight downward movement
- **Visual**: Small red triangle
- **Spawn**: Appears from level 1

#### Fast Enemy
- **Health**: 20 HP
- **Speed**: 300 units/s (2x basic)
- **Damage**: 15
- **Score Value**: 150 points
- **AI Pattern**: Zigzag movement
- **Visual**: Elongated diamond shape
- **Spawn**: Appears from level 1

#### Tank Enemy
- **Health**: 80 HP (high durability)
- **Speed**: 80 units/s (slow)
- **Damage**: 25
- **Score Value**: 250 points
- **AI Pattern**: Straight forward assault
- **Visual**: Square with center dot
- **Spawn**: Appears from level 4+

#### Sniper Enemy
- **Health**: 40 HP
- **Speed**: 100 units/s
- **Damage**: 20
- **Score Value**: 200 points
- **AI Pattern**: Strafing movement (side-to-side)
- **Visual**: Pentagon shape
- **Spawn**: Appears from level 6+

### 5. **Boss Encounters**

#### Mini-Boss (Level 5)
- **Type**: miniboss_1
- **Health**: 500 HP
- **Attack**: 20 damage
- **Speed**: 120 units/s
- **Abilities**: Shield regeneration, laser attacks
- **Challenge**: Tests sustained damage and dodging

#### Final Boss (Level 10)
- **Type**: final_boss
- **Health**: 2000 HP
- **Attack**: 30 damage
- **Speed**: 100 units/s
- **Abilities**: Shield, laser, missiles, summon adds
- **Challenge**: Ultimate test of all skills learned

### 6. **Score & Combo System**

#### Scoring Mechanics
- **Enemy Kills**: Base score values (100-250)
- **Combo Multiplier**: Increases score for consecutive kills
- **Memory Shards**: Bonus collectibles
- **Time Bonus**: Speed completion rewards

#### Combo System
- **Activation**: Kill enemies without 5-second gap
- **Display**: Yellow "COMBO x[N]" text in HUD
- **Effect**: Score multiplier increases
- **Reset**: 5 seconds of no kills
- **Visual Feedback**: Combo text pulses and changes color

### 7. **Power-Up System**

#### Memory Shards
- **Visual**: Glowing white/cyan orbs
- **Effect**: Restores health and/or shield
- **Spawn**: Randomly dropped by enemies
- **Collection**: Automatic on collision
- **Tracking**: Collected count shown in level complete screen

### 8. **Level Progression**

#### Structure
- **Total Levels**: 10
- **Wave System**: Multiple enemy waves per level
- **Formation Patterns**: Line, V-formation, Circle, Random
- **Difficulty Scaling**: +30% difficulty per level
- **Enemy Density**: More enemies in later levels
- **Quote Display**: Philosophical quote shown during gameplay

#### Level Quotes & Themes
1. **Level 1 - Denial**: "We learn from history that we do not learn anything from history."
2. **Level 2 - Confusion**: "People get lost in thought because it is unfamiliar territory."
3. **Level 3 - Resentment**: "If only I could be respected without having to be respectable."
4. **Level 4 - Understanding**: "All wise men share one trait in common: the ability to listen."
5. **Level 5 - Caution**: "Put your trust in those who are worthy." (Mini-Boss)
6. **Level 6 - Ego**: "All I ask of life is a constant and exaggerated sense of my own importance."
7. **Level 7 - Acceptance**: "The more things change, the more they stay insane."
8. **Level 8 - Hope**: "There will be big changes for you, but you will be happy."
9. **Level 9 - Empowerment**: "Due to circumstances beyond your control, you are master of your fate and captain of your soul."
10. **Level 10 - Resolution**: "Among the lucky, you are the chosen one." (Final Boss)

#### Difficulty Progression
- **Base Difficulty**: 1.0 (Level 1)
- **Scaling**: +0.3 per level
- **Final Difficulty**: 3.7 (Level 10)
- **Enemy Count**: 5-23 enemies per wave
- **Spawn Delays**: 2000ms → 1100ms (faster in later levels)

---

## 🎨 Game Entities

### Player Class (`src/entities/Player.ts`)
**Capabilities**:
- Movement with velocity-based physics
- Rotation to face mouse cursor
- Primary weapon with fire rate limiting
- Secondary weapon with charge mechanics
- Health and shield management
- Invulnerability frames
- Particle trail effect
- Color-blind mode support
- Screen boundary constraints

**Key Methods**:
- `update()`: Main game loop
- `takeDamage()`: Damage handling with invulnerability
- `heal()`: Health restoration
- `firePrimary()`: Standard shot
- `fireSecondary()`: Charged shot

### Enemy Class (`src/entities/Enemy.ts`)
**Capabilities**:
- Type-specific visuals (triangle, diamond, square, pentagon)
- AI pattern execution (straight, zigzag, strafe, chase)
- Health management with visual feedback
- Screen boundary detection
- Collision detection
- Death animation and particle effects
- Color-blind mode support

**AI Patterns**:
- **Straight**: Direct downward movement
- **Zigzag**: Sine wave horizontal movement
- **Strafe**: Side-to-side dodging
- **Chase**: Track and follow player

### Projectile Classes (`src/entities/Projectile.ts`)

#### Standard Projectile
- Direction-based movement
- Screen boundary checking
- Owner tracking (player/enemy)
- Particle trail effects
- Damage value

#### Charged Projectile
- Slower speed, higher damage
- Larger hitbox (20 units vs 10)
- Enhanced visual effects
- Extended particle trail

#### Memory Shard
- Collectible power-up
- Rotating animation
- Glowing visual effect
- Automatic collection on proximity

---

## 🖼️ UI Systems

### 1. **HUD (Heads-Up Display)** (`src/ui/HUD.ts`)

**Components**:
- **Health Bar**: Red gradient bar (top-left)
- **Shield Bar**: Cyan gradient bar (top-left)
- **Score Display**: "SCORE: [value]" (top-left)
- **Combo Display**: "COMBO x[N]" in yellow (top-left)
- **Level Display**: "LEVEL [N]" (top-right)
- **Quote Display**: Philosophical quote (bottom-center)
- **FPS Counter**: Optional performance monitor (top-right)

**Visual Style**:
- Neo-brutalist panels with hard borders
- High-contrast cyan (#00ffff) borders
- Semi-transparent dark backgrounds
- Monospace fonts for technical data
- Serif fonts for philosophical quotes

### 2. **UI Components** (`src/ui/UIComponents.ts`)

#### UIButton
- Clickable button with hover effects
- Neo-brutalist styling (3px borders, hard shadows)
- Audio feedback on click
- Customizable colors and sizes
- Keyboard accessibility

#### Panel
- Container for grouped UI elements
- Title header with border separation
- Semi-transparent background
- Border glow effects

#### Slider
- Volume/value adjustment control
- Visual handle and track
- Real-time value display
- Draggable interaction
- Percentage display

#### Checkbox
- Toggle setting on/off
- Visual checkmark indicator
- Label text
- Click and keyboard support

#### DropdownMenu
- Select from multiple options
- Expandable option list
- Highlight on hover
- Click-outside-to-close

---

## 🎬 Scene Architecture

### 8 Distinct Scenes

#### 1. **TitleScene** (`src/scenes/TitleScene.ts`)
**Purpose**: Game entry point  
**Features**:
- Animated title with pulsing effect
- Epigraph display: "If anything can go wrong, it will."
- Subtitle: "A Journey Home Through the Stars"
- Start Game button
- Journal button
- Leaderboard button
- Settings button
- Credits
- Starfield background
- Menu music

**Navigation**:
- START GAME → LevelSelectScene
- JOURNAL → JournalScene
- LEADERBOARD → LeaderboardScene
- SETTINGS → SettingsScene

#### 2. **LevelSelectScene** (`src/scenes/LevelSelectScene.ts`)
**Purpose**: Level selection hub  
**Features**:
- 2x5 grid of level cards
- Visual completion indicators (checkmarks)
- Lock icons for locked levels
- Level quotes preview
- Unlock progression (complete level N to unlock N+1)
- Back to title button
- Starfield background

**Level Card States**:
- **Locked**: Grayed out with lock icon
- **Unlocked**: Full color, clickable
- **Completed**: Checkmark indicator

#### 3. **GameScene** (`src/scenes/GameScene.ts`)
**Purpose**: Main gameplay  
**Features**:
- Player control and combat
- Enemy spawning and AI
- Wave management system
- Collision detection
- Particle effects
- HUD updates
- Level quote display
- Pause functionality (ESC key)
- Level completion detection
- Victory/defeat conditions
- Starfield background with parallax
- Gameplay music

**Game Loop**:
1. Initialize level configuration
2. Spawn player ship
3. Start wave timer
4. Spawn enemies in formations
5. Update all entities
6. Check collisions
7. Update HUD
8. Check win/loss conditions
9. Transition to GameOverScene

#### 4. **PauseScene** (`src/scenes/PauseScene.ts`)
**Purpose**: In-game pause menu  
**Features**:
- Overlay on GameScene (semi-transparent)
- Resume button
- Restart level button
- Settings access
- Quit to title button
- Music volume lowered during pause
- Freezes game time

**Controls**:
- ESC to toggle pause
- Mouse/keyboard navigation

#### 5. **GameOverScene** (`src/scenes/GameOverScene.ts`)
**Purpose**: Level completion or failure  
**Features**:

**Victory Screen**:
- "LEVEL COMPLETE" title
- Final score display
- Memory shards collected
- Accuracy statistics
- Next level button (if available)
- Retry button
- Return to level select
- Victory music
- Confetti particle effect

**Defeat Screen**:
- "GAME OVER" title
- Final score display
- Retry button
- Level select button
- Statistics display

**Data Tracking**:
- Save level completion
- Update high scores
- Add leaderboard entry
- Update statistics
- Unlock next level

#### 6. **JournalScene** (`src/scenes/JournalScene.ts`)
**Purpose**: View collected quotes and reflections  
**Features**:
- Scrollable list of journal entries
- Level numbers and quotes
- Completion timestamps
- Personal reflections (if added)
- Completion status indicators
- Back button
- Neo-brutalist card design

**Entry Data**:
- Level number
- Quote text
- Completion status
- Timestamp
- Reflection text (optional)

#### 7. **LeaderboardScene** (`src/scenes/LeaderboardScene.ts`)
**Purpose**: High score tracking  
**Features**:
- Top 100 entries displayed
- Rank, name, score, level columns
- Local storage persistence
- Global leaderboard stub (API ready)
- Sort by score (descending)
- Your best rank highlighted
- Back button
- Scrollable list

**Leaderboard Entry**:
```typescript
{
  rank: number,
  playerName: string,
  score: number,
  level: number,
  timestamp: number
}
```

#### 8. **SettingsScene** (`src/scenes/SettingsScene.ts`)
**Purpose**: Game configuration  
**Features**:

**Audio Settings**:
- Master volume slider (0-100%)
- Music volume slider
- SFX volume slider
- Real-time audio preview

**Accessibility Settings**:
- Reduced motion toggle
- Color-blind mode selector (4 options)
- Screen shake toggle
- Particle effects toggle
- FPS counter toggle

**Control Settings**:
- Remappable key bindings
- Move Up/Down/Left/Right
- Primary Fire
- Secondary Fire
- Pause key

**Actions**:
- Save settings button
- Reset to defaults button
- Back to title button

---

## 🔊 Audio System

### AudioManager (`src/systems/AudioManager.ts`)

**Technology**: Howler.js 2.2.4  
**Storage**: In-memory sound map

#### Sound Assets (13 total)

**Music Tracks** (looping):
1. `menu_music.mp3` - Calm ambient menu theme (0.5 volume)
2. `gameplay_music.mp3` - Intense combat music (0.4 volume)
3. `victory_music.mp3` - Triumphant completion theme (0.6 volume)

**Sound Effects**:
4. `shoot_primary.mp3` - Light laser sound (0.3 volume)
5. `shoot_secondary.mp3` - Heavy charged shot (0.5 volume)
6. `enemy_death.mp3` - Explosion effect (0.4 volume)
7. `player_hit.mp3` - Impact sound (0.5 volume)
8. `player_death.mp3` - Dramatic explosion (0.7 volume)
9. `shield_hit.mp3` - Energy deflection (0.4 volume)
10. `powerup.mp3` - Positive chime (0.6 volume)
11. `level_complete.mp3` - Success jingle (0.8 volume)
12. `ui_select.mp3` - Menu selection click (0.5 volume)
13. `ui_back.mp3` - Back button sound (0.5 volume)

#### Features
- **Volume Control**: Master, Music, SFX independent sliders
- **Fade Transitions**: Smooth crossfading between music tracks
- **Preloading**: All sounds preloaded on game start
- **Pool System**: 5 simultaneous instances per SFX
- **HTML5 Audio**: For looping tracks (better performance)
- **Web Audio**: For SFX (lower latency)
- **Error Handling**: Graceful fallback if audio fails
- **User Activation**: Unlock audio on first user interaction

#### Methods
- `initialize(assets)`: Load all audio files
- `playSfx(key, volumeOverride?)`: Play sound effect
- `playMusic(key, fadeIn?)`: Play music track with crossfade
- `stopMusic()`: Stop current music
- `updateSettings(settings)`: Apply volume changes
- `unlockAudio()`: Resume AudioContext (browser requirement)

---

## 💾 Persistence & Save System

### SaveSystem (`src/systems/SaveSystem.ts`)

**Technology**: LocalForage (IndexedDB wrapper)  
**Storage Location**: Browser IndexedDB  
**Database Name**: `StellarResolve`  
**Store Name**: `gameData`

#### Save Data Structure

```typescript
SaveData {
  playerName: string,           // Player identifier
  levelsCompleted: boolean[],   // 10 booleans
  highScore: number,            // Best score achieved
  totalMemoryShards: number,    // Cumulative shards
  unlockedLevels: number,       // Highest unlocked level
  settings: GameSettings,       // Full settings object
  journalEntries: JournalEntry[], // Collected quotes
  statistics: GameStatistics    // Gameplay stats
}
```

#### Statistics Tracked
- Total enemies destroyed
- Total shots fired
- Accuracy rate (hits/shots)
- Total play time (seconds)
- Death count
- Perfect levels (no damage)

#### Key Operations
- `initializeSave()`: Create new save or load existing
- `saveGame(data)`: Persist entire save state
- `loadGame()`: Retrieve save data
- `updateSettings(partial)`: Update specific settings
- `completeLevel()`: Mark level done, unlock next
- `addLeaderboardEntry()`: Add and sort score
- `getLeaderboard()`: Retrieve top 100 scores

#### Persistence Features
- **Automatic Saving**: After each level completion
- **Settings Persistence**: Immediately on change
- **Async Operations**: Non-blocking I/O
- **Error Handling**: Console warnings, doesn't crash game
- **Data Migration**: Future-proof structure
- **Multiple Saves**: Support for profile system (future)

---

## ♿ Accessibility Features

### 1. **Reduced Motion Mode**
**Setting**: `reducedMotion: boolean`  
**Effects**:
- Disables particle effects
- Reduces screen shake
- Simplifies animations
- Removes pulsing effects
- Keeps essential feedback only

### 2. **Color-Blind Modes**

**Setting**: `colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia'`

#### Protanopia (Red-Blind)
- Player: Blue (#0088ff)
- Enemy: Orange (#ffaa00)
- Powerup: White (#ffffff)

#### Deuteranopia (Green-Blind)
- Player: Blue (#0088ff)
- Enemy: Orange (#ffaa00)
- Powerup: White (#ffffff)

#### Tritanopia (Blue-Blind)
- Player: Pink (#ff0088)
- Enemy: Teal (#00ff88)
- Powerup: White (#ffffff)

**Implementation**: Changes ship and UI element colors throughout game

### 3. **Volume Controls**
- **Master Volume**: 0-100% (controls all audio)
- **Music Volume**: 0-100% (background tracks)
- **SFX Volume**: 0-100% (sound effects)
- **Independent Sliders**: Adjust each separately
- **Real-time Update**: Changes apply immediately

### 4. **Screen Shake Toggle**
**Setting**: `screenShake: boolean`  
**Effects**: Disables camera shake on explosions and hits

### 5. **Particle Effects Toggle**
**Setting**: `particles: boolean`  
**Effects**: Disables all particle systems (trails, explosions, hits)

### 6. **FPS Counter**
**Setting**: `showFPS: boolean`  
**Display**: Top-right corner, 60 FPS target  
**Purpose**: Performance monitoring

### 7. **Remappable Controls**
**Settings**: Full keyboard customization
- Move Up (default: W)
- Move Down (default: S)
- Move Left (default: A)
- Move Right (default: D)
- Primary Fire (default: MOUSE_LEFT)
- Secondary Fire (default: MOUSE_RIGHT)
- Pause (default: ESCAPE)

### 8. **Keyboard Navigation**
- All menus support keyboard navigation
- Tab to cycle through buttons
- Enter to select
- Escape to go back
- Arrow keys in dropdowns

---

## 🎨 Visual Design System

### Design Philosophy

#### Neo-Brutalism
**Characteristics**:
- Bold geometric UI blocks
- High-contrast color schemes
- Hard shadows (4-6px offsets)
- Stark borders (3px solid lines)
- Functional, no-nonsense layout
- Aggressive typography
- Flat colors, no gradients (in UI)

**Color Palette**:
- Primary: Cyan (`#00ffff`)
- Secondary: Magenta (`#ff00ff`)
- Accent: Yellow (`#ffff00`)
- Background: Deep purple-black (`#0a0a1a`)
- UI Background: Dark blue-gray (`#1a1a2e`)

#### Skeuomorphism
**Elements**:
- Tactile cockpit overlays
- Analog gauge aesthetics
- Metallic textures (via gradients)
- Mechanical animations
- Physical button feedback
- Realistic instrument panels

### Graphics Rendering

**Technology**: Phaser Graphics API  
**Method**: Procedural generation  
**Benefit**: No sprite sheets required, instant rendering

#### Ship Rendering
- **Player**: Triangle with center dot, cyan
- **Basic Enemy**: Red triangle
- **Fast Enemy**: Diamond/elongated triangle
- **Tank Enemy**: Square with center dot
- **Sniper Enemy**: Pentagon

All shapes drawn with:
- 2px stroke (outline)
- Solid fill (60-80% alpha)
- Geometric precision

#### Particle Systems
**Implementation**: Phaser Particle Emitters  
**Types**:
1. **Explosion**: 20+ particles, radial spread
2. **Trail**: Continuous emission, follows entity
3. **Hit Effect**: 5-10 particles, burst pattern

**Performance**:
- Toggle on/off via settings
- Pool system for reuse
- Auto-cleanup after lifespan
- Additive blend mode for glow

#### Background System
**Starfield**:
- 3 layers of parallax stars
- Different depths (speed/size)
- Procedurally placed on scene create
- Continuous scrolling effect
- Twinkling animation (optional)

---

## ⚙️ Configuration & Customization

### Game Configuration (`src/config/index.ts`)

#### GAME_CONFIG
```typescript
{
  width: 1280,               // Game canvas width
  height: 720,               // Game canvas height
  levelQuotes: string[10],   // Array of 10 quotes
  epigraph: string,          // Title screen quote
  maxLevels: 10              // Total number of levels
}
```

#### PLAYER_CONFIG
```typescript
{
  speed: 300,                // Movement speed
  health: 100,               // Starting health
  maxHealth: 100,            // Maximum health
  shield: 50,                // Starting shield
  maxShield: 50,             // Maximum shield
  shieldRegenRate: 2,        // Points per second
  shieldRegenDelay: 3000,    // Milliseconds before regen
  primaryFireRate: 200,      // Milliseconds between shots
  primaryDamage: 10,         // Damage per shot
  secondaryChargeTime: 1500, // Milliseconds to full charge
  secondaryDamage: 50,       // Charged shot damage
  invulnerabilityTime: 2000  // I-frames duration
}
```

#### ENEMY_TYPES
Four types (basic, fast, tank, sniper) with:
- `health`: Hit points
- `speed`: Movement speed
- `damage`: Collision/attack damage
- `scoreValue`: Points awarded
- `aiPattern`: Behavior type

#### COLORS
Complete color system:
- Primary/secondary/accent colors
- UI color set (bg, border, text, success, warning, danger)
- Color-blind palettes (3 modes x 3 colors)

#### DEFAULT_SETTINGS
Default values for all settings:
- Volume levels (0.5-0.7)
- Accessibility flags (mostly false)
- Control mappings (WASD + mouse)

#### LEVEL_CONFIGS
Array of 10 level configurations:
- Wave definitions
- Enemy counts
- Spawn delays
- Formation patterns
- Boss data (levels 5 & 10)
- Difficulty multiplier

### Customization Guide

**To adjust difficulty**:
- Edit `PLAYER_CONFIG.health` and `shield`
- Modify `ENEMY_TYPES` health/damage values
- Change `LEVEL_CONFIGS` difficulty multiplier

**To add new enemy types**:
1. Add type to `ENEMY_TYPES` object
2. Add visual rendering in `Enemy.ts` → `drawShip()`
3. Add AI pattern if new behavior needed

**To change color scheme**:
- Edit `COLORS` object in `config/index.ts`
- Update `COLORS.primary`, `secondary`, etc.
- Color-blind modes update automatically

**To add new levels**:
1. Add quote to `GAME_CONFIG.levelQuotes`
2. Add level config to `LEVEL_CONFIGS` array
3. Update `GAME_CONFIG.maxLevels`
4. Update save system arrays

---

## 🏗️ Technical Architecture

### Project Structure

```
heartbreak/
├── src/
│   ├── config/
│   │   └── index.ts              # Game constants & configuration
│   ├── entities/
│   │   ├── Player.ts             # Player ship class
│   │   ├── Enemy.ts              # Enemy ship class
│   │   └── Projectile.ts         # Projectiles & power-ups
│   ├── scenes/
│   │   ├── TitleScene.ts         # Main menu
│   │   ├── LevelSelectScene.ts   # Level selection hub
│   │   ├── GameScene.ts          # Main gameplay loop
│   │   ├── PauseScene.ts         # Pause overlay
│   │   ├── GameOverScene.ts      # Victory/defeat screen
│   │   ├── JournalScene.ts       # Quote collection viewer
│   │   ├── LeaderboardScene.ts   # High scores
│   │   └── SettingsScene.ts      # Configuration menu
│   ├── systems/
│   │   ├── AudioManager.ts       # Howler.js wrapper
│   │   ├── ParticleManager.ts    # Particle effects handler
│   │   └── SaveSystem.ts         # IndexedDB persistence
│   ├── ui/
│   │   ├── HUD.ts                # Heads-up display
│   │   └── UIComponents.ts       # Reusable UI elements
│   ├── types/
│   │   └── index.ts              # TypeScript type definitions
│   ├── utils/
│   │   └── settingsHelper.ts     # Settings validation
│   └── main.ts                   # Entry point & Phaser config
├── public/
│   ├── assets/
│   │   └── audio/                # Sound files (13 total)
│   └── sw.js                     # Service worker for PWA
├── index.html                    # HTML entry point
├── vite.config.ts                # Vite build configuration
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Dependencies
└── README.md                     # User documentation
```

### Technology Stack

#### Core
- **Game Engine**: Phaser 3.90.0
  - Canvas-based rendering
  - Arcade physics
  - Scene management
  - Input handling
- **Language**: TypeScript 5.9.3
  - Type safety
  - Modern ES6+ features
  - Path aliases (`@/` → `src/`)
- **Build Tool**: Vite 7.3.1
  - Lightning-fast HMR
  - Optimized production builds
  - Code splitting

#### Libraries
- **Audio**: Howler.js 2.2.4
  - Cross-browser audio
  - Spatial audio support
  - Sprite sheets
  - Volume control
- **Storage**: LocalForage 1.10.0
  - IndexedDB wrapper
  - Promise-based API
  - Fallback to localStorage
  - Async operations

#### Development
- **Node.js**: 18+ recommended
- **npm**: 9+ recommended
- **TypeScript Types**: @types/howler, @types/node

### Build Configuration

#### Vite Config
- **Port**: 3000
- **Auto-open**: Browser launches on `npm run dev`
- **Path Alias**: `@/` resolves to `src/`
- **Chunk Splitting**: Phaser and Howler separated
- **Sourcemaps**: Enabled for debugging
- **Asset Handling**: MP3, WAV, OGG support

#### TypeScript Config
- **Target**: ES2020
- **Module**: ESNext
- **Strict Mode**: Enabled
- **Path Mapping**: `@/*` → `src/*`
- **JSX**: Preserve (not used)

### Performance Optimizations

1. **Code Splitting**: Phaser and Howler in separate chunks
2. **Lazy Loading**: Scenes loaded on demand
3. **Object Pooling**: Particles reused
4. **Efficient Collision**: Spatial hashing
5. **Conditional Rendering**: Particles toggle
6. **Asset Preloading**: Audio loaded on init
7. **Service Worker**: Offline caching
8. **Canvas Rendering**: Hardware-accelerated

### Browser Support
- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Opera 76+

**Requirements**:
- ES2020 support
- Canvas API
- Web Audio API
- IndexedDB
- Mouse + Keyboard

---

## 📊 Code Statistics

### Lines of Code
- **Total TypeScript**: ~3,132 lines
- **Configuration**: ~170 lines
- **Entities**: ~800 lines
- **Scenes**: ~1,400 lines
- **Systems**: ~400 lines
- **UI**: ~500 lines

### File Count
- **Source Files**: 19 TypeScript files
- **Configuration Files**: 3 (vite, tsconfig, package.json)
- **Documentation**: 9 markdown files
- **HTML/CSS**: 1 combined file

### Dependencies
**Production**:
- phaser: 3.90.0
- howler: 2.2.4
- localforage: 1.10.0

**Development**:
- typescript: 5.9.3
- vite: 7.3.1
- @types/howler: 2.2.12
- @types/node: 25.2.3

### Scene Complexity
- **TitleScene**: ~150 lines (simple menu)
- **LevelSelectScene**: ~220 lines (grid layout)
- **GameScene**: ~500 lines (main game loop)
- **PauseScene**: ~120 lines (overlay)
- **GameOverScene**: ~280 lines (results screen)
- **JournalScene**: ~200 lines (scrollable list)
- **LeaderboardScene**: ~180 lines (sorted table)
- **SettingsScene**: ~300 lines (comprehensive options)

---

## 🚀 Deployment

### Build Commands
```bash
npm install          # Install dependencies
npm run dev          # Development server (localhost:3000)
npm run build        # Production build (outputs to dist/)
npm run preview      # Preview production build
```

### Platform Deployment

#### Vercel
```bash
vercel               # Automatic detection, zero config
```

#### Netlify
```bash
netlify deploy --prod --dir=dist
```

#### Cloudflare Pages
- Build command: `npm run build`
- Publish directory: `dist`

#### GitHub Pages
```bash
npm run build
# Upload dist/ to gh-pages branch
```

### Production Checklist
- ✅ All audio files present in `public/assets/audio/`
- ✅ Service worker configured
- ✅ Base path set correctly (`./)
- ✅ Build completes without errors
- ✅ Test on target browsers
- ✅ Check mobile responsiveness
- ✅ Verify audio works (user interaction)
- ✅ Test save system persistence

---

## 📖 API Reference

### Key Classes

#### Player
```typescript
class Player extends Phaser.GameObjects.Container {
  health: number;
  shield: number;
  update(time: number, delta: number): void;
  takeDamage(amount: number): void;
  heal(amount: number): void;
  firePrimary(): void;
  fireSecondary(chargeTime: number): void;
}
```

#### Enemy
```typescript
class Enemy extends Phaser.GameObjects.Container {
  health: number;
  enemyType: string;
  scoreValue: number;
  update(delta: number, playerX: number, playerY: number): void;
  takeDamage(amount: number): boolean;
  isOffScreen(): boolean;
}
```

#### AudioManager
```typescript
class AudioManager {
  initialize(assets: SoundAsset[]): void;
  playSfx(key: string, volumeOverride?: number): void;
  playMusic(key: string, fadeIn?: boolean): void;
  stopMusic(): void;
  updateSettings(settings: GameSettings): void;
}
```

#### SaveSystem
```typescript
class SaveSystem {
  initializeSave(): Promise<SaveData>;
  saveGame(data: SaveData): Promise<void>;
  loadGame(): Promise<SaveData | null>;
  updateSettings(settings: Partial<GameSettings>): Promise<void>;
  completeLevel(level: number, score: number, shards: number, perfect: boolean): Promise<void>;
}
```

---

## 🎯 Future Roadmap

### Planned Features
- [ ] Global leaderboard API integration
- [ ] Additional boss types with unique mechanics
- [ ] Power-up system (weapon upgrades, speed boost)
- [ ] Achievement system
- [ ] New game+ mode with increased difficulty
- [ ] Gamepad controller support
- [ ] Mobile touch controls
- [ ] Sprite-based graphics option
- [ ] Sound visualization effects
- [ ] Multiplayer co-op mode
- [ ] Level editor
- [ ] Community level sharing

### Known Limitations
- Audio requires user interaction (browser policy)
- No native mobile controls yet
- Single save profile only
- Local leaderboard only (no cloud sync)

---

## 📄 License

**ISC License** - Free for personal and commercial use.

---

## 🤝 Contributing

This is a complete, production-ready game. Feel free to fork and customize for your own projects.

**Credits**:
- Game Design & Development: Stellar Resolve Team
- Engine: Phaser 3 by Photon Storm
- Audio Library: Howler.js by James Simpson
- Storage: LocalForage by Mozilla

---

## 📞 Support

For technical questions or feature requests, please refer to:
- **README.md** - User-facing documentation
- **DEVELOPMENT.md** - Developer guide
- **DEPLOYMENT_QUICK_START.md** - Hosting instructions

---

**Created with ❤️ using Phaser 3 & TypeScript**

*"If anything can go wrong, it will... but we rise anyway."*
