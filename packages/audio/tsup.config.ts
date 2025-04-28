import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/react/index.ts'],
  format: ["esm"],
  external: ['react', 'react-dom'],
  clean: true,
  sourcemap: true,
  treeshake: true,
  dts: true,
  esbuildOptions(options) {
    options.jsx = "transform";
  },
});
