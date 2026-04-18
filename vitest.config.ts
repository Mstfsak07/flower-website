import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    exclude: [
      "tests/e2e/**",
      "**/tests/e2e/**",
      "Flower_Platform/**",
      "node_modules/**",
      ".next/**",
    ],
  },
});
