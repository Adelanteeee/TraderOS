import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

export default defineConfig({
  // GitHub Pages serves the site from https://USERNAME.github.io/REPO-NAME/,
  // so the app needs to know it isn't at the domain root. Replace REPO-NAME
  // with your actual GitHub repository name before deploying. Leave it as
  // "/" if you deploy somewhere else (Vercel, Netlify, a custom domain, ...).
  base: "/",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icons/*.png"],
      manifest: {
        name: "Trader OS",
        short_name: "Trader OS",
        description: "Personal trading operating system — mind, market, execution, journal.",
        theme_color: "#0A0B0D",
        background_color: "#0A0B0D",
        display: "standalone",
        start_url: "/",
        icons: [
          { src: "icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icons/icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
        ]
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"]
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  server: {
    port: 5173
  }
});
