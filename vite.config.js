import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve("src/index.tsx"),
      name: "fine-import",
      formats: ["es", "umd"],
      fileName: (format) => `fine-import.${format}.js`,
      base: "https://WhatFor.github.io/fine-import/",
    },
    rollupOptions: {
      external: ["react", "tailwindcss"],
      output: {
        globals: {
          react: "React",
        },
      },
    },
  },
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
    }),
  ],
});
