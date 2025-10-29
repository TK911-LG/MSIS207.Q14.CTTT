import { defineConfig } from 'vite';

export default defineConfig({
  esbuild: {
    jsxFactory: 'createElement',
    jsxFragment: 'createFragment',
    jsxInject: `import { createElement, createFragment } from '/src/jsx-runtime'`
  },
  build: {
    target: 'es2020',
    outDir: 'dist',
    sourcemap: true,
    minify: 'esbuild'
  },
  server: {
    port: 3000,
    open: false
  }
});
