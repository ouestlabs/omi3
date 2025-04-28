import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ["esm"],
  clean: true,
  treeshake: true,
  dts: true,
  esbuildOptions(options) {
    options.jsx = "transform";
  },
});
