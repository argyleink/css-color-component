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
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/your-org/css-color-component' }],
      customCss: ['./src/styles/custom.css', './src/styles/demos.css'],
      head: [
        { tag: 'meta', attrs: { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover' } }
      ],
      components: {
        Head: './src/components/Head.astro'
      },
      sidebar: [
        { label: 'Overview', items: [{ label: 'Introduction', slug: 'index' }] },
        {
          label: 'Getting Started',
          items: [
            { label: 'Installation', slug: 'getting-started/installation' },
            { label: 'Quick Start', slug: 'getting-started/quick-start' },
            { label: 'Concepts', slug: 'getting-started/concepts' }
          ]
        },
        {
          label: 'API',
          items: [
            { label: 'Attributes', slug: 'api/attributes' },
            { label: 'Properties', slug: 'api/properties' },
            { label: 'Methods', slug: 'api/methods' },
            { label: 'Events', slug: 'api/events' },
            { label: 'CSS Parts', slug: 'api/css-parts' }
          ]
        },
        {
          label: 'Color Spaces',
          items: [
            { label: 'Overview', slug: 'color-spaces/overview' },
            { label: 'sRGB, HSL, HWB', slug: 'color-spaces/srgb-hsl-hwb' },
            { label: 'LAB, LCH', slug: 'color-spaces/lab-lch' },
            { label: 'OKLCH, OKLAB', slug: 'color-spaces/oklch-oklab' },
            { label: 'Wide Gamut', slug: 'color-spaces/wide-gamut' }
          ]
        },
        {
          label: 'Styling',
          items: [
            { label: 'Theming', slug: 'styling/theming' },
            { label: 'Customization', slug: 'styling/customization' },
            { label: 'Integration', slug: 'styling/integration' }
          ]
        },
        {
          label: 'Recipes',
          items: [
            { label: 'Form Integration', slug: 'recipes/form-integration' },
            { label: 'Programmatic Control', slug: 'recipes/programmatic-control' },
            { label: 'Anchor Positioning', slug: 'recipes/anchor-positioning' },
            { label: 'Keyboard Shortcuts', slug: 'recipes/keyboard-shortcuts' },
            { label: 'Advanced Patterns', slug: 'recipes/advanced-patterns' }
          ]
        },
        { label: 'Accessibility', items: [{ label: 'Accessibility', slug: 'accessibility' }] },
        {
          label: 'Advanced',
          items: [
            { label: 'Architecture', slug: 'advanced/architecture' },
            { label: 'Positioning System', slug: 'advanced/positioning-system' },
            { label: 'Gamut Detection', slug: 'advanced/gamut-detection' },
            { label: 'Performance', slug: 'advanced/performance' }
          ]
        }
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
