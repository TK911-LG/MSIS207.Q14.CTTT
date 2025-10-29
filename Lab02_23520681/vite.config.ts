import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx']
  },
  esbuild: {
    jsxFactory: 'createElement',
    jsxFragment: 'createFragment',
    jsxInject: `import { createElement, createFragment } from '/src/jsx-runtime'`
  },
  build: {
    target: 'es2020',
    outDir: 'dist',
    sourcemap: true,
    minify: 'esbuild',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html')
      }
    }
  },
  server: {
    port: 3000,
    open: false
  }
});
