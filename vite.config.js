import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

import * as packageJson from "./package.json";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve("src/index.tsx"),
      name: "fine-import",
      fileName: (format) => `fine-import.${format}.js`,
      base: "https://WhatFor.github.io/fine-import/",
    },
    rollupOptions: {
      external: [...Object.keys(packageJson.peerDependencies)],
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
