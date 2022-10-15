import { resolve } from 'path';
import { defineConfig } from 'vite';
import glob from 'fast-glob';

export default defineConfig(() => ({
  build: {
    minify: 'esbuild',
    assetsDir: 'assets',
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: glob
        .sync(['./**/*.html', '!dist', '!docs', '!node_modules'])
        .map((entry: string) => resolve(__dirname, entry)),
    },
    target: 'modules',
  },
}));
