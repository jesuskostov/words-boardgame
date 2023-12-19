import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      // PWA plugin options
      registerType: "auto",
      includeAssets: ["vite.svg", "robots.txt", "apple-touch-icon.png"],
      manifest: {
        name: "My Vue App",
        short_name: "VueApp",
        description: "My Awesome Vue.js App",
        theme_color: "#ffffff",
        icons: [
          {
            src: "pwa-192x192.png", // 192x192 png icon
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png", // 512x512 png icon
            sizes: "512x512",
            type: "image/png",
          },
        ],
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
      },
    }),
  ],
});
