// Author: Nong Hoang Vu || JavaTech
// Facebook:https://facebook.com/NongHoangVu04
// Github: https://github.com/JavaTech04
// Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import envCompatible from "vite-plugin-env-compatible";

export default defineConfig({
  plugins: [react(), envCompatible()],
  server: {
    host: true,
    strictPort: true,
    port: 1004,
  },
  resolve: {
    alias: [{ find: "~", replacement: "/src" }],
  },
});
