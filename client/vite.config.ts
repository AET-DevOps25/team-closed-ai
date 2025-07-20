/// <reference types="vitest" />
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "src/api/**",
        "src/components/ui/**",
        "src/types/**",
        "src/vite-env.d.ts",
        "node_modules/**",
        "dist/**",
        "**/*.test.{ts,tsx}",
        "**/*.spec.{ts,tsx}",
        "**/*.config.{js,ts}",
        "**/eslint.config.js",
        "**/vite.config.ts",
      ],
      thresholds: {
        lines: 70,
        branches: 70,
        functions: 70,
        statements: 70,
      },
    },
  },
});
