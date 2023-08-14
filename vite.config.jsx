import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve("src", "src/index.tsx"),
      name: "fine-import",
      fileName: (format) => `fine-import.${format}.js`,
      base: "https://WhatFor.github.io/fine-import/",
    },
  },
  plugins: [react()],
});
