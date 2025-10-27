# color-input Documentation Site

This directory contains the Astro + Starlight documentation site for the `color-input` web component.

## Development

From the **root** of the repository:

```sh
# Start dev server
npm run dev

# Build docs
npm run build:docs

# Preview built site
npm run preview
```

## Project Structure

```
docs/
├── src/
│   ├── components/          # Interactive demo components
│   ├── content/docs/        # MDX documentation pages
│   └── styles/              # Custom CSS
├── astro.config.mjs         # Astro + Starlight configuration
└── tsconfig.json            # TypeScript with path aliases
```

## Adding Pages

1. Create MDX file in `src/content/docs/[section]/`
2. Add frontmatter: `title`, `description`
3. Use Starlight components: Tabs, Callouts, Cards
4. Update sidebar in `astro.config.mjs` if needed

## Available Components

- **ColorInputDemo** — Live picker with readout
- **EventLogger** — Event capture panel
- Starlight: Tabs, Card, CardGrid, Aside

## Deployment

### GitHub Pages

```sh
npm install --save-dev gh-pages
npm run build:docs
npx gh-pages -d docs/dist
```

### Static Host (rsync)

```sh
npm run build:docs
rsync -avz --delete docs/dist/ user@host:/path
```

## Notes

- The `color-input` element loads globally via `<head>` script
- Path alias `color-input` → `../src/index.ts`
- **HMR enabled:** Changes to `../src/` automatically reload the page
- No need to restart the dev server when editing the component
