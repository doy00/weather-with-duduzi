import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        VitePWA({
          registerType: 'autoUpdate',
          includeAssets: ['icons/*.png'],
          manifest: false,
          workbox: {
            globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
            runtimeCaching: [
              {
                urlPattern: /^https:\/\/api\.openweathermap\.org\/data\/2\.5\/.*/i,
                handler: 'NetworkFirst',
                options: {
                  cacheName: 'weather-api-cache',
                  expiration: {
                    maxEntries: 50,
                    maxAgeSeconds: 5 * 60,
                  },
                  networkTimeoutSeconds: 10,
                },
              },
              {
                urlPattern: /^https:\/\/api\.openweathermap\.org\/geo\/1\.0\/.*/i,
                handler: 'CacheFirst',
                options: {
                  cacheName: 'geocoding-api-cache',
                  expiration: {
                    maxEntries: 100,
                    maxAgeSeconds: 24 * 60 * 60,
                  },
                },
              },
              {
                urlPattern: /^https:\/\/generativelanguage\.googleapis\.com\/.*/i,
                handler: 'NetworkFirst',
                options: {
                  cacheName: 'gemini-api-cache',
                  expiration: {
                    maxEntries: 30,
                    maxAgeSeconds: 10 * 60,
                  },
                  networkTimeoutSeconds: 15,
                },
              },
            ],
            cleanupOutdatedCaches: true,
            skipWaiting: true,
            clientsClaim: true,
          },
          devOptions: {
            enabled: false, // 개발 모드에서는 PWA 비활성화 (경고 제거)
          },
        }),
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
        }
      }
    };
});
