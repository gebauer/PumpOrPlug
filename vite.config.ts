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
      includeAssets: [
        'favicon.svg',
        'favicon-16.png',
        'favicon-32.png',
        'apple-touch-icon.png',
        'icon-monochrome.svg',
      ],
      manifest: {
        name: 'PumpOrPlug',
        short_name: 'PumpOrPlug',
        description: 'Lohnt sich Strom oder Benzin? Berechne den Breakeven für deinen Plug-in-Hybrid.',
        start_url: '/',
        display: 'standalone',
        lang: 'de',
        background_color: '#F2F1EC',
        theme_color: '#1157C7',
        orientation: 'portrait',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          { src: '/icon-monochrome.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'monochrome' },
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
        ],
      },
    }),
  ],
})
