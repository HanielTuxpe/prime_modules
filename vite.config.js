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
        theme_color: "#099247",
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

      // 👇 ESTA ES LA SECCIÓN NUEVA IMPORTANTE
      workbox: {
        runtimeCaching: [
          {
            // 🧩 Coincide con tus peticiones a la API (ajusta el dominio si cambia)
            urlPattern:
              /^https:\/\/ocelot-unique-ocelot\.ngrok-free\.app\/.*$/i,
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
            // 👇 También puedes cachear imágenes o íconos grandes
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
            handler: "CacheFirst",
            options: {
              cacheName: "prime-images",
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 1 semana
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
