import { defineConfig } from "vite";

export default defineConfig({
  root: "src/main/frontend",
  server: {
    proxy: {
      "/api": "http://localhost:8080",
    },
  },
});
