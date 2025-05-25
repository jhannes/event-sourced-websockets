import { defineConfig } from "vite";

export default defineConfig({
  server: {
    proxy: {
      "/ws": {
        target: "http://localhost:3000",
        ws: true,
      },
    },
  },
});
