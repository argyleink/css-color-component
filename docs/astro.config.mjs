// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import mdx from '@astrojs/mdx';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  site: 'https://example.com',
  outDir: './dist',
  integrations: [
    starlight({
      title: 'color-input',
      tagline: 'A modern color picker web component with wide-gamut support',
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/argyleink/css-color-component' }],
      customCss: ['./src/styles/custom.css', './src/styles/demos.css'],
      head: [
        { tag: 'meta', attrs: { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover' } }
      ],
      components: {
        Head: './src/components/Head.astro'
      },
      sidebar: [
        { label: 'Home', slug: 'index' },
        { label: 'API Reference', slug: 'api' },
        { label: 'Styling', slug: 'styling' },
        { label: 'Color Spaces', slug: 'color-spaces' },
        { label: 'Advanced', slug: 'advanced' }
      ]
    }),
    mdx()
  ],
  vite: {
    resolve: {
      alias: {
        'color-input': fileURLToPath(new URL('../src/index.ts', import.meta.url))
      }
    },
    server: {
      watch: {
        // Watch the parent src directory for changes
        ignored: ['!**/node_modules/**', '!**/.git/**'],
        usePolling: false
      },
      fs: {
        // Allow serving files from the parent directory
        allow: ['..', '.']
      }
    },
    optimizeDeps: {
      // Include component dependencies so they're pre-bundled
      include: ['@preact/signals-core', 'colorjs.io'],
      // Exclude the component itself so changes are picked up
      exclude: ['color-input']
    }
  }
});
