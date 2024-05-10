import { defineConfig } from "vite";

export default defineConfig({
  base: "/",
  plugins: [],
  preview: {
    port: 3000,
    strictPort: true,
  },
  server: {
    port: 3000,
    strictPort: true,
    host: true,
  },
});
