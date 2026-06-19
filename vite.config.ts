import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      "/api/login": {
        target: "http://168.144.122.72",
        changeOrigin: true,
        rewrite: (path) => path.replace("/api/login", "/prod/CPLogin/CMMTN"),
      },
      "/api/unsub": {
        target: "http://168.144.122.72",
        changeOrigin: true,
        rewrite: (path) => path.replace("/api/unsub", "/prod/CMMTN/unsub"),
      },
    },
    fs: {
      allow: [".", "./client", "./shared"],
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**"],
    },
  },
  root: ".",
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, "index.html"),
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
});
