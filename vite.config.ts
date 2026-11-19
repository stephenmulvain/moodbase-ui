import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    react(),
    // Emits .d.ts files next to the bundle so consumers get full TypeScript types.
    dts({ tsconfigPath: './tsconfig.build.json', entryRoot: 'src' }),
  ],
  css: {
    modules: {
      // `.focus-ring` in CSS becomes `styles.focusRing` in TSX.
      localsConvention: 'camelCaseOnly',
      // Readable, collision-free class names, e.g. `mb-root-x7f2a`.
      generateScopedName: 'mb-[local]-[hash:base64:5]',
    },
  },
  build: {
    lib: {
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      formats: ['es'],
      fileName: 'index',
      cssFileName: 'styles',
    },
    rollupOptions: {
      // The consuming app provides React; never bundle a second copy.
      external: ['react', 'react-dom', 'react/jsx-runtime'],
    },
    sourcemap: true,
  },
});
