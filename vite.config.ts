import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { mkdir, copyFile } from "node:fs/promises";
import { resolve } from "node:path";
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "static-schedule-route",
      apply: "build",
      async closeBundle() {
        await mkdir(resolve("dist/demo-schedule"), { recursive: true });
        await copyFile(
          resolve("dist/index.html"),
          resolve("dist/demo-schedule/index.html"),
        );
      },
    },
  ],
});
