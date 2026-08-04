import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const buildStamp = new Date().toISOString().slice(0, 16).replace("T", " ");

export default defineConfig({
  define: {
    __APP_BUILD__: JSON.stringify(buildStamp),
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
