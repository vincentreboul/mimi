import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// Conditional base path: relative for Capacitor (mobile bundles), absolute /mimi/ for GitHub Pages
const isCapacitor = process.env.CAPACITOR === '1';

export default defineConfig({
  base: isCapacitor ? './' : '/mimi/',
  build: {
    target: 'es2020',
    sourcemap: false, // disabled — saves ~11 MB in dist
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
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/*.png'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,jpg,m4a,json,woff2}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        cleanupOutdatedCaches: true,
      },
      manifest: {
        name: "KORA — L'éveil orbital",
        short_name: 'KORA',
        description: 'Escape game sci-fi mémoriel',
        theme_color: '#1f4d3e',
        background_color: '#0a1218',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/mimi/',
        scope: '/mimi/',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
});
