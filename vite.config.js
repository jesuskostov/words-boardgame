import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      name: "Association",
      short_name: "Association",
      start_url: "/",
      display: "standalone",
      background_color: "#000",
      theme_color: "#000",
      description: "Забавна игра за асоциации",
      icons: [
        {
          src: "../icons/appstore.png",
          sizes: "48x48",
          type: "image/png",
        },
        {
          src: "../icons/playstore.png",
          sizes: "72x72 96x96 128x128 256x256",
        },
      ],
    }),
  ],
});
