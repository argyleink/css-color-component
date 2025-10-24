import { defineConfig } from 'vite'
import { resolve } from 'node:path'

export default defineConfig(({ command }) => {
  const isServe = command === 'serve'
  return {
    root: isServe ? 'docs' : '.',
    server: {
      open: true,
      fs: { allow: ['..'] }
    },
    build: isServe ? undefined : {
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        formats: ['es'],
        fileName: () => 'index.js'
      },
      outDir: 'dist',
      emptyOutDir: true,
      target: 'es2019',
      rollupOptions: {
        output: {
          inlineDynamicImports: true
        }
      }
    },
    css: { postcss: resolve(__dirname, 'postcss.config.cjs') }
  }
})
