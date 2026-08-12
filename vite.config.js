import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  server: {
    port: 5175,

    proxy: {
      "/django-api": {
        target: "https://curd-opration-0.onrender.com",
        changeOrigin: true,
        secure: false,

        rewrite: (path) =>
          path.replace(/^\/django-api/, ""),
      },
    },
  },
});