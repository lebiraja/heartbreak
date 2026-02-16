import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 3000,
    open: true,
    headers: {
      'Accept-Ranges': 'bytes'
    }
  },
  build: {
    target: 'es2020',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          phaser: ['phaser'],
          howler: ['howler']
        }
      }
    }
  },
  base: './',
  assetsInclude: ['**/*.mp3', '**/*.wav', '**/*.ogg']
});
