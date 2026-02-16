# Stellar Resolve - Quick Deployment Guide

## 🚀 Instant Deploy (Recommended)

### Option 1: Vercel (Fastest)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd heartbreak
vercel
```
Follow prompts, then visit the provided URL.

### Option 2: Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
cd heartbreak
netlify deploy --prod
```

### Option 3: Cloudflare Pages
1. Go to: https://pages.cloudflare.com
2. Connect your Git repository, or
3. Upload the `dist` folder manually

## 📦 Manual Build & Deploy

```bash
# Build
npm run build

# The `dist` folder contains everything needed
# Upload to any static host:
# - GitHub Pages
# - AWS S3 + CloudFront
# - Azure Static Web Apps
# - Any web server
```

## 🎮 Local Testing

```bash
# Development mode (hot reload)
npm run dev

# Production preview
npm run build && npm run preview
```

## ⚠️ Important Notes

### Audio Files
The game builds with **empty audio placeholders**. For a complete experience:

1. Add real audio files to `public/assets/audio/`
2. Or remove audio calls in `src/main.ts` (audioManager.initialize)

### Browser Requirements
- Modern browser with ES2020 support
- LocalStorage/IndexedDB enabled
- Mouse + keyboard for best experience

### Performance
- Targets 60 FPS on modern hardware
- Disable particles/screen shake in settings if needed
- Built bundle is ~1.3MB (mostly Phaser)

## 🔧 Configuration

Edit before deploying:
- `package.json` - Change name, version
- `public/manifest.json` - PWA metadata
- `index.html` - Page title, meta tags
- `src/config/index.ts` - Game parameters

## 📱 Mobile Support

Current build is desktop-optimized (mouse + keyboard).
For mobile support, add touch controls in GameScene.

## 🐛 Troubleshooting

**Build fails:**
- Run `npm install` again
- Check Node version (need 18+)

**Audio errors in console:**
- Expected with placeholder files
- Add real MP3 files or disable audio

**Save data not persisting:**
- Check browser allows IndexedDB
- Clear site data and retry

## ✅ Deployment Checklist

- [ ] `npm run build` succeeds
- [ ] Test locally with `npm run preview`
- [ ] Add real audio files (optional)
- [ ] Update README/meta tags
- [ ] Test on target browsers
- [ ] Deploy!

## 🎯 Post-Deployment

After deploying, test:
1. All scenes load correctly
2. Level progression works
3. Save system persists data
4. Settings take effect
5. Responsive scaling works

---

Your game is ready to ship! 🚀
