import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon-192.png', 'icon-512.png', 'icon-512-maskable.png'],
      manifest: {
        name: 'PumpOrPlug',
        short_name: 'PumpOrPlug',
        description: 'Lohnt sich Strom oder Benzin? Berechne den Breakeven für deinen Plug-in-Hybrid.',
        start_url: '/',
        display: 'standalone',
        background_color: '#0f172a',
        theme_color: '#22c55e',
        orientation: 'portrait',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/creativecommons\.tankerkoenig\.de\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'tankerkoenig-cache',
              expiration: { maxAgeSeconds: 3600 },
            },
          },
          {
            urlPattern: /\/src\/data\/vehicles\.json/,
            handler: 'CacheFirst',
            options: { cacheName: 'vehicles-cache' },
          },
        ],
      },
    }),
  ],
})
