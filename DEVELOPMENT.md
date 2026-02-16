# Stellar Resolve - Development Guide

## Development Workflow

### Setup
```bash
git clone <repository>
cd heartbreak
npm install
npm run dev
```

### File Organization

#### Adding New Scenes
1. Create scene file in `src/scenes/NewScene.ts`
2. Extend `Phaser.Scene`
3. Register in `src/main.ts` config
4. Add navigation from existing scenes

#### Adding New Entities
1. Create entity in `src/entities/NewEntity.ts`
2. Extend appropriate base class (Container, Graphics, etc.)
3. Implement update loop if needed
4. Add collision/interaction logic in GameScene

#### Modifying Game Config
- Edit `src/config/index.ts` for game-wide settings
- Adjust `GAME_CONFIG` for dimensions, quotes, max levels
- Modify `PLAYER_CONFIG` for player stats
- Update `ENEMY_TYPES` for enemy configurations
- Change `LEVEL_CONFIGS` for wave patterns

### Adding Audio

1. Place audio files in `public/assets/audio/`
2. Register in `src/main.ts` audioManager.initialize()
3. Use `audioManager.playSfx()` or `audioManager.playMusic()`

### Styling UI

- Modify `COLORS` in `src/config/index.ts` for color schemes
- Edit UI components in `src/ui/UIComponents.ts`
- Update HUD layout in `src/ui/HUD.ts`
- Adjust CSS in `index.html` for page styling

### Save System

Located in `src/systems/SaveSystem.ts`
- Uses localforage (IndexedDB)
- Automatically saves progress
- Methods:
  - `saveGame(data)` - Save current state
  - `loadGame()` - Load saved state
  - `completeLevel()` - Mark level complete
  - `addLeaderboardEntry()` - Add score entry

### Testing

```bash
# Development server with hot reload
npm run dev

# Build production version
npm run build

# Test production build locally
npm run preview
```

### Performance Tips

1. **Particle Systems**: Toggle via settings.particles
2. **Screen Shake**: Toggle via settings.screenShake
3. **Reduced Motion**: Disables animations/tweens
4. **FPS Counter**: Enable in settings for monitoring

### Debugging

Enable Phaser debug mode in `src/main.ts`:
```typescript
physics: {
  default: 'arcade',
  arcade: {
    debug: true // Shows collision boxes
  }
}
```

### Common Issues

**Audio not playing:**
- Check browser autoplay policies
- Ensure audio files exist in public/assets/audio/
- Verify file paths in audioManager.initialize()

**Save not persisting:**
- Check browser IndexedDB support
- Clear application data and retry
- Verify saveSystem methods are awaited

**Performance issues:**
- Disable particles in settings
- Reduce enemy count in level configs
- Check for memory leaks in entity cleanup

## Architecture Overview

### Scene Flow
```
TitleScene → LevelSelectScene → GameScene → GameOverScene
    ↓              ↓                 ↓
SettingsScene  JournalScene     PauseScene
    ↓
LeaderboardScene
```

### Entity Hierarchy
```
Player (Container)
  ├── ship (Graphics)
  └── shieldVisual (Arc)

Enemy (Container)
  └── ship (Graphics)

Projectile (Graphics)
  └── trailEmitter (ParticleEmitter)

ChargedProjectile (Container)
  ├── core (Graphics)
  └── trailEmitter (ParticleEmitter)

MemoryShard (Container)
  └── crystal (Graphics)
```

### System Dependencies
```
GameScene
  ├── Player → ParticleManager, AudioManager
  ├── Enemy → ParticleManager, AudioManager
  ├── HUD → GameSettings
  └── SaveSystem
```

## Code Style

- Use TypeScript strict mode
- Prefer async/await over promises
- Document complex logic with comments
- Use meaningful variable names
- Keep functions focused and small
- Use types from `src/types/index.ts`

## Deployment Checklist

- [ ] Build passes (`npm run build`)
- [ ] No TypeScript errors
- [ ] Audio files added (or placeholders documented)
- [ ] Test all scenes navigation
- [ ] Verify save/load functionality
- [ ] Test on target browsers
- [ ] Check responsive scaling
- [ ] Validate accessibility features
- [ ] Review performance (60 FPS target)
- [ ] Update version in package.json
- [ ] Update README.md if needed

## Adding New Levels

1. Update `GAME_CONFIG.maxLevels` in config
2. Add quote to `GAME_CONFIG.levelQuotes` array
3. Add wave config to `LEVEL_CONFIGS` array
4. Test difficulty scaling
5. Update level select UI if grid changes

## Customization Ideas

- **New Enemy Types**: Add to `ENEMY_TYPES`, create AI patterns
- **Boss Abilities**: Extend Enemy class with special attacks
- **Power-ups**: Create new entity types, add spawn logic
- **Visual Themes**: Modify color schemes per level
- **Story Elements**: Add cutscenes between levels
- **Achievements**: Track player actions, show badges

---

Happy Coding! 🚀
