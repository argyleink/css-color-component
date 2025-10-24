# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Commands

- Install deps
  - `npm i`
- Dev docs (serves `docs/`, imports source from `src/`)
  - `npm run dev`
- Build library (ES module to `dist/` with type declarations)
  - `npm run build`
- Preview built docs (static preview)
  - `npm run preview`
- Tests (Vitest + jsdom)
  - Run all: `npm test`
  - Watch mode: `npm run test:watch`
  - Single file: `npm test -- tests/05-space-switch.test.ts`
  - By name pattern: `npm test -- -t "derived values"`
  - Watch a single file: `npm run test:watch -- tests/01-reflection.test.ts`
- Type checking (no linter configured)
  - `npm run typecheck`

## High-level architecture

- Public surface
  - Package name `color-input`; library entry `src/index.ts` re-exports the custom element from `src/color-input.ts`.
  - Build outputs a single ES module at `dist/index.js` with bundled CSS and `dist/index.d.ts` types. `package.json` `exports` maps `.` to these files; `sideEffects: false` for tree-shaking.

- Web Component: `ColorInput` (`src/color-input.ts`)
  - Defines `<color-input>` and self-registers via `customElements.define('color-input', ColorInput)`.
  - Shadow DOM encapsulation with an inline `<template>` string for structure and styles. Uses Open Props CSS tokens; these are inlined at build by PostCSS.
  - Reactive state via `@preact/signals-core`:
    - Private signals for `value`, `colorspace`, `theme`, `open`, and optional `anchor` element.
    - Derived signals compute `contrastColor` (for legible text on the swatch) and `gamut` (srgb/p3/rec2020/xyz) from the current color.
    - An `effect` syncs state into the shadow DOM (chip, preview background, output, gamut badge, and host CSS var for contrast).
  - Attribute/property reflection and API:
    - Attributes: `value`, `colorspace`, `theme` (auto|light|dark). Properties mirror attributes; `gamut` and `contrastColor` are readonly.
    - Methods: `show()`, `close()` wrap the Popover API; `setAnchor(el)` stores an anchor reference (placement is internal).
    - `change`, `open`, `close` events are emitted (bubbling) with `change` carrying `{ value, colorspace }`.
  - UI rendering:
    - A toolbar `<select>` switches color spaces; control rows are generated dynamically per space (e.g., H/S/L sliders for `hsl`, L/C/H for `oklch`, RGB-like for wide-gamut spaces).
    - Slider and numeric inputs clamp/wrap values and regenerate the canonical CSS color string via helper `gencolor(...)`.

- Color utilities: `src/color.ts`
  - Thin wrappers around `colorjs.io` to:
    - Normalize space identifiers between CSS/ColorJS (`getColorJSSpaceID`, `reverseColorJSSpaceID`).
    - Compute contrast vs white/black using WCAG or L* fallback (`contrastColor`).
    - Detect the smallest gamut containing the color (`detectGamut`).
    - Helpers for RGB-like `color(space r% g% b% / a%)` emission and percentage formatting.

- Tooling and build
  - Vite config (`vite.config.ts`):
    - `vite serve` uses `docs/` as the project root to run the demo site; the demo imports from `src/` for fast dev.
    - `vite build` uses library mode with `src/index.ts` as entry; outputs ES-only bundle at `dist/index.js`, inlining dynamic imports and targeting `es2019`.
    - PostCSS config (`postcss.config.cjs`) applies `postcss-jit-props` with `open-props` and `autoprefixer`.
  - TypeScript (`tsconfig.json`): strict, `moduleResolution: Bundler`, DOM libs enabled, and `types` include `vitest/globals` and `jsdom`; declaration output to `dist/`.

- Tests (`tests/*.test.ts`)
  - Vitest in jsdom environment exercises attribute/property reflection, events, popover show/close, anchor behavior, per-space control rendering, numeric input clamping, derived values, and theme attribute.
  - `tests/setup.ts` installs a minimal Popover polyfill (`showPopover`/`hidePopover`) to make popover behavior observable under jsdom.

- Docs site (`docs/index.html`)
  - Demo page loaded by `npm run dev`. In dev it imports `../src/index.ts`; consumers import `color-input/dist/index.js` as shown in the README. Includes basic examples for themes, events, and API.
