import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import dts from 'vite-plugin-dts'

export default defineConfig(({ command, mode }) => {
  const isServe = command === 'serve'
  const isTest = mode === 'test' || process.env.VITEST

  if (isTest) {
    return {
      test: {
        environment: 'jsdom',
        setupFiles: ['./tests/setup.ts'],
        globals: true
      }
    }
  }

  if (isServe) {
    return {
      root: 'docs',
      server: {
        open: true,
        fs: { allow: ['..'] }
      },
      css: { postcss: resolve(__dirname, 'postcss.config.cjs') },
    }
  }

  let formats: ('es' | 'iife')[] = ['es']
  let fileName = (_format: string) => 'slim.js'
  let external: string[] | undefined = ['colorjs.io/fn', '@preact/signals-core']
  if (process.env.BUNDLE === 'cdn') {
    formats = ['iife', 'es']
    fileName = (format) => format === 'iife' ? 'color-input.min.js' : 'index.js'
    external = undefined
  }

  return {
    plugins: [
      dts({
        include: ['src/**/*'],
        outDir: 'dist',
        insertTypesEntry: true,
        rollupTypes: true
      })
    ],
    build: {
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        formats,
        fileName,
        name: 'ColorInput'
      },
      outDir: 'dist',
      emptyOutDir: false,
      target: 'es2019',
      minify: 'terser',
      sourcemap: true,
      terserOptions: {
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
      },
      rollupOptions: {
        external,
        output: {
          inlineDynamicImports: true,
          manualChunks: undefined
        }
      }
    },
    css: { postcss: resolve(__dirname, 'postcss.config.cjs') },
  }
})
