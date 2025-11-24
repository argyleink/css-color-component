import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import dts from 'vite-plugin-dts'

export default defineConfig(({ command, mode }) => {
  const isServe = command === 'serve'
  const isTest = mode === 'test' || process.env.VITEST
  const isProd = mode === 'production'

  return {
    root: isServe && !isTest ? 'docs' : '.',
    server: {
      open: true,
      fs: { allow: ['..'] }
    },
    plugins: isServe && !isTest ? [] : [
      dts({
        include: ['src/**/*'],
        outDir: 'dist',
        insertTypesEntry: true,
        rollupTypes: true
      })
    ],
    build: isServe && !isTest ? undefined : {
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        formats: isProd ? ['es', 'iife'] : ['es'],
        fileName: (format) => isProd && format === 'iife' ? 'color-input.min.js' : 'index.js',
        name: 'ColorInput'
      },
      outDir: 'dist',
      emptyOutDir: true,
      target: 'es2019',
      minify: isProd ? 'terser' : 'esbuild',
      sourcemap: isProd ? true : false,
      terserOptions: isProd ? {
        compress: {
          drop_console: false,
          drop_debugger: true,
          pure_funcs: ['console.log'],
          passes: 2
        },
        mangle: {
          safari10: true
        },
        format: {
          comments: false,
          preamble: '/* color-input web component - https://github.com/pops/css-color-component */'
        }
      } : undefined,
      rollupOptions: {
        output: {
          inlineDynamicImports: true,
          manualChunks: undefined
        }
      }
    },
    css: { postcss: resolve(__dirname, 'postcss.config.cjs') },
    test: {
      environment: 'jsdom',
      setupFiles: ['./tests/setup.ts'],
      globals: true
    }
  }
})
