import { defineConfig } from 'vite';

export default defineConfig({
  base: '/mimi/',
  build: {
    target: 'es2020',
    sourcemap: true,
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: {
          phaser: ['phaser'],
          howler: ['howler'],
        },
      },
    },
  },
  server: {
    host: true,
    port: 5173,
  },
});
