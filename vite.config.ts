import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@pages": path.resolve(__dirname, "src/pages"),
      "@context": path.resolve(__dirname, "src/context"),
      "@app": path.resolve(__dirname, "src/App"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@styles": path.resolve(__dirname, "src/styles"),
      "@components": path.resolve(__dirname, "src/components"),
      "@layouts": path.resolve(__dirname, "src/layouts"),
      "@assets": path.resolve(__dirname, "src/assets"),
      "@data": path.resolve(__dirname, "src/data"),
      "@api": path.resolve(__dirname, "src/api"),
      "@hooks": path.resolve(__dirname, "src/hooks"),
    },
  },
  server: {
    port: 5174,
    proxy: {
      "/api": { target: "http://localhost:8080", changeOrigin: true },
      "/oauth2": { target: "http://localhost:8080", changeOrigin: true },
      "/logout": { target: "http://localhost:8080", changeOrigin: true },
    },
  },
});
