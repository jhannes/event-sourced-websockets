import { defineConfig } from "vite";

export default defineConfig({
  root: "src/main/frontend",
  build: {
    outDir: "../../../target/classes/webapp",
  },
  server: {
    proxy: {
      "/api": "http://localhost:9080",
      "/ws": {
        target: "http://localhost:9080",
        ws: true,
      },
    },
  },
});
