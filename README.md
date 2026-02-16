# Stellar Resolve

**A Journey Home Through the Stars**

A production-ready browser-based 2D space shooter built with Phaser 3 and TypeScript. Guide a lonely pilot healing from heartbreak through 10 progressively challenging levels, each representing a stage of emotional growth.

## 🎮 Game Features

### Core Gameplay
- **Twin-stick controls**: WASD movement + mouse aiming
- **Dual weapon system**: Primary rapid fire + charged secondary shot
- **Shield & health system**: Energy-based protection with auto-regeneration
- **Progressive difficulty**: 10 levels with unique quotes and scaling challenges
- **Enemy variety**: Basic, Fast, Tank, and Sniper enemy types with distinct AI patterns
- **Boss encounters**: Mini-boss at level 5, final boss at level 10
- **Memory Shards**: Collectible power-ups that restore health/shield
- **Score & combo system**: Multiplier rewards for consecutive kills
- **Persistent progress**: Local save system with level unlocking

### UI & Systems
- **Title Screen**: Opening epigraph "If anything can go wrong, it will."
- **Level Select**: Visual grid showing progress and completion status
- **HUD**: Real-time health, shield, score, combo, and level quote display
- **Pause Menu**: Resume, restart, or quit options
- **Game Over**: Victory/defeat screens with score summary
- **Journal**: Progress tracker with collected quotes and reflections
- **Leaderboard**: Local high score tracking with API stub for global leaderboard
- **Settings**: Comprehensive accessibility and audio controls

### Visual Design
- **Skeuomorphic elements**: Tactile cockpit overlays, analog gauges, metallic textures
- **Neo-Brutalist UI**: Bold geometric blocks, high-contrast typography, hard shadows
- **Procedural graphics**: All game objects rendered via Phaser Graphics API (no sprite sheets required)
- **Dynamic particles**: Explosions, trails, and hit effects with performance toggles
- **Starfield backgrounds**: Animated parallax star layers

### Accessibility
- ✅ Reduced motion mode
- ✅ Color-blind palettes (Protanopia, Deuteranopia, Tritanopia)
- ✅ Remappable controls
- ✅ Independent volume sliders (Master, Music, SFX)
- ✅ Screen shake toggle
- ✅ Particle effects toggle
- ✅ FPS counter
- ✅ Keyboard-only navigation

### Level Quotes (in order)
1. "We learn from history that we do not learn anything from history."
2. "People get lost in thought because it is unfamiliar territory."
3. "If only I could be respected without having to be respectable."
4. "All wise men share one trait in common: the ability to listen."
5. "Put your trust in those who are worthy."
6. "All I ask of life is a constant and exaggerated sense of my own importance."
7. "The more things change, the more they stay insane."
8. "There will be big changes for you, but you will be happy."
9. "Due to circumstances beyond your control, you are master of your fate and captain of your soul."
10. "Among the lucky, you are the chosen one."

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (tested with v20.20.0)
- npm 9+ (tested with v10.8.2)

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The game will open at `http://localhost:3000`

### Production Deployment

#### Vercel
```bash
npm install -g vercel
vercel
```

#### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

#### Cloudflare Pages
```bash
npm run build
# Upload `dist` folder to Cloudflare Pages dashboard
```

#### Manual Static Hosting
```bash
npm run build
# Upload contents of `dist/` folder to any static host
```

## 📁 Project Structure

```
heartbreak/
├── src/
│   ├── scenes/          # Phaser scenes (Title, Game, Settings, etc.)
│   ├── entities/        # Game objects (Player, Enemy, Projectile)
│   ├── systems/         # Core systems (Save, Audio, Particles)
│   ├── ui/              # UI components (HUD, Buttons, Panels)
│   ├── config/          # Game configuration and constants
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Helper utilities
│   └── main.ts          # Entry point
├── public/
│   ├── assets/
│   │   ├── audio/       # Sound effects and music (placeholders)
│   │   ├── images/      # Optional images (not required)
│   │   └── sprites/     # Sprite sheets (not required)
│   └── sw.js            # Service worker for PWA
├── index.html           # Main HTML file
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Dependencies
```

## 🎨 Design Philosophy

### Skeuomorphism
- Tactile, realistic UI elements that mimic physical objects
- Metallic textures and analog gauge aesthetics
- Mechanical animations and button feedback

### Neo-Brutalism
- Bold, geometric UI blocks
- High-contrast color schemes (#00ffff primary, #ff00ff secondary)
- Hard shadows and stark borders
- Functional, no-nonsense layout

## 🛠️ Technology Stack

- **Game Engine**: Phaser 3.60+
- **Language**: TypeScript 5+
- **Build Tool**: Vite 5+
- **Audio**: Howler.js
- **Storage**: LocalForage (IndexedDB wrapper)
- **Styling**: Custom CSS with neo-brutalist design

## 🎵 Audio Assets

Audio files are currently placeholders. For production deployment, add the following files to `public/assets/audio/`:

- `menu_music.mp3` - Calm ambient menu theme
- `gameplay_music.mp3` - Intense combat music
- `victory_music.mp3` - Triumphant completion theme
- `shoot_primary.mp3` - Light laser sound
- `shoot_secondary.mp3` - Heavy charged shot
- `enemy_death.mp3` - Explosion effect
- `player_hit.mp3` - Impact sound
- `player_death.mp3` - Dramatic explosion
- `shield_hit.mp3` - Energy deflection
- `powerup.mp3` - Positive chime
- `level_complete.mp3` - Success jingle
- `ui_select.mp3` - Menu selection click
- `ui_back.mp3` - Back button sound

**Recommended sources**: freesound.org, opengameart.org, incompetech.com

## 🎮 Controls

| Action | Input |
|--------|-------|
| Move | WASD |
| Aim | Mouse |
| Primary Fire | Left Click |
| Charged Secondary | Right Click (hold) |
| Pause | ESC |

All controls are remappable in Settings.

## 💾 Save System

Game progress is automatically saved to browser storage (IndexedDB) including:
- Level completion status
- High scores
- Memory shards collected
- Settings preferences
- Journal entries
- Leaderboard entries

## 🌐 Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Opera 76+

## 📊 Performance

- Target: 60 FPS on modern hardware
- Optimized particle systems with toggles
- Efficient collision detection
- Modular asset loading
- Service worker caching for fast reload

## 🔧 Configuration

Edit `src/config/index.ts` to adjust:
- Game dimensions
- Player stats (health, speed, damage)
- Enemy configurations
- Level wave patterns
- Color schemes
- Control mappings

## 🚧 Future Enhancements

- [ ] Global leaderboard API integration
- [ ] Additional boss types with unique mechanics
- [ ] Power-up system (weapon upgrades, speed boost)
- [ ] Achievement system
- [ ] New game+ mode with increased difficulty
- [ ] Gamepad support
- [ ] Mobile touch controls
- [ ] Sprite-based graphics option
- [ ] Sound visualization effects
- [ ] Multiplayer co-op mode

## 📝 License

ISC License - Free for personal and commercial use.

## 🤝 Contributing

This is a complete, production-ready game. Feel free to fork and customize for your own projects.

## 🎯 Narrative Theme

Stellar Resolve tells the story of a pilot's emotional journey home after heartbreak. Each level represents a stage of healing:
1. **Denial** - Learning from the past
2. **Confusion** - Lost in unfamiliar emotions
3. **Resentment** - Struggling with self-image
4. **Understanding** - Learning to listen
5. **Caution** - Rebuilding trust
6. **Ego** - Reclaiming self-worth
7. **Acceptance** - Embracing change
8. **Hope** - Anticipating happiness
9. **Empowerment** - Taking control
10. **Resolution** - Finding peace

---

**Created with ❤️ using Phaser 3 & TypeScript**

*"If anything can go wrong, it will... but we rise anyway."*
