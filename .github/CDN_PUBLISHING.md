# CDN Publishing Workflow

This repository includes a GitHub Actions workflow that automatically publishes the production build to jsDelivr CDN.

## How It Works

The workflow (`.github/workflows/publish-cdn.yml`) is triggered by:
1. **Release creation** - When you publish a new release on GitHub
2. **Version tags** - When you push a tag starting with `v*` (e.g., `v1.0.0`)
3. **Manual trigger** - Via the "Actions" tab in GitHub (workflow_dispatch)

## What the Workflow Does

1. **Checks out** the repository
2. **Installs** dependencies with `npm ci`
3. **Runs tests** to ensure quality
4. **Builds** the production bundle with `npm run build:prod`
5. **Commits** the built files (`dist/color-input.min.js` and `dist/index.js`)
6. **Creates/updates tags**:
   - `cdn-latest` - Always points to the latest build
   - `cdn-v*` - Version-specific tag (if triggered by a release tag)
7. **Uploads** the minified file as a release asset (if triggered by a release)
8. **Displays** the CDN URLs in the workflow summary

## CDN URLs

After the workflow runs, your files are available via jsDelivr:

**Latest version (always up-to-date):**
```
https://cdn.jsdelivr.net/gh/argyleink/css-color-component@cdn-latest/dist/color-input.min.js
```

**Specific version (immutable):**
```
https://cdn.jsdelivr.net/gh/argyleink/css-color-component@cdn-v1.0.0/dist/color-input.min.js
```

**Specific commit (immutable):**
```
https://cdn.jsdelivr.net/gh/argyleink/css-color-component@<commit-hash>/dist/color-input.min.js
```

## Publishing a New Version

### Option 1: Create a GitHub Release
1. Go to the "Releases" page on GitHub
2. Click "Draft a new release"
3. Create a new tag (e.g., `v1.0.0`)
4. Add release notes
5. Click "Publish release"
6. The workflow will run automatically

### Option 2: Push a Tag
```bash
git tag v1.0.0
git push origin v1.0.0
```

### Option 3: Manual Trigger
1. Go to the "Actions" tab on GitHub
2. Select "Publish to CDN" workflow
3. Click "Run workflow"
4. Select the branch
5. Click "Run workflow"

## jsDelivr Cache

- jsDelivr caches files for 7 days by default
- To bust the cache, you can add `?v=<timestamp>` to the URL
- Or use a specific version/commit hash for immutable URLs

## Bundle Information

- **Minified size**: ~88 KB (uncompressed)
- **Gzipped size**: ~31.7 KB
- **Format**: IIFE (Immediately Invoked Function Expression)
- **Global variable**: `ColorInput`
- **Dependencies**: Bundled (colorjs.io, @preact/signals-core)

## Troubleshooting

### Workflow fails to push
- Ensure the repository has Actions enabled
- Check that the workflow has `contents: write` permission

### jsDelivr not serving the file
- Wait 1-2 minutes after the workflow completes
- jsDelivr may take time to sync with GitHub
- Try purging the cache: https://www.jsdelivr.com/tools/purge

### Old version is being served
- Use a version-specific or commit-specific URL
- Or append `?v=<timestamp>` to bust the cache
