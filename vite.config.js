import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",

      includeAssets: [
        "favicon.ico",
        "robots.txt",
        "apple-touch-icon.png",
        "icons/pwa-192x192.png",
        "icons/pwa-512x512.png",
      ],

      manifest: {
        name: "PRIME Web",
        short_name: "PRIME",
        description:
          "Plataforma académica con análisis, predicciones y trazabilidad estudiantil.",
        theme_color: "#8f1e44ff",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        scope: "/",
        icons: [
          {
            src: "icons/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icons/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "icons/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },

      // 👇 SECCIÓN DE CACHÉ ACTUALIZADA PARA TU NUEVO BACKEND
      workbox: {
        maximumFileSizeToCacheInBytes: 3000000, // 3 MB (ajusta según necesites)
        runtimeCaching: [
          {
            // 🧠 Coincide con tu API actual en Render
            urlPattern:
              /^https:\/\/prime-api-iawe\.onrender\.com\/.*$/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "prime-api-cache",
              networkTimeoutSeconds: 5,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24, // 1 día
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            // 👇 Cachea imágenes institucionales, íconos y recursos estáticos
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/i,
            handler: "CacheFirst",
            options: {
              cacheName: "prime-images",
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 1 semana
              },
            },
          },
          {
            urlPattern: /^https:\/\/prime-api-iawe\.onrender\.com\/Politicas$/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "prime-politicas-cache",
              expiration: {
                maxEntries: 25,
                maxAgeSeconds: 60 * 60 * 24 * 7,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/prime-api-iawe\.onrender\.com\/faqs$/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "prime-faqs-cache",
              expiration: {
                maxEntries: 25,
                maxAgeSeconds: 60 * 60 * 24 * 7,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },


        ],
      },
    }),
  ],

  preview: {
    allowedHosts: ["prime-modules.onrender.com"],
    host: "0.0.0.0",
    port: process.env.PORT || 4173,
  },
});