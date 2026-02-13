# `<color-input>`

A standalone web component color picker using [colorjs.io](http://colorjs.io/) and [Preact signals](https://github.com/preactjs/signals).

- One script import, one custom element tag
- Colorspaces: srgb, hsl, hwb, lab, lch, oklch, oklab and wide-gamut RGB-like spaces
- Popover UI with automatic positioning and Shadow DOM encapsulation

Try on [CodePen](https://codepen.io/argyleink/pen/dPGBYZg) or get it on [NPM](https://www.npmjs.com/package/hdr-color-input)

> Consider this as a beta or alpha build, needing battle testing, contributions and possibly a couple more features before being production ready

## Usage

### With CDN

```html
<script src="https://unpkg.com/hdr-color-input"></script>

<color-input value="oklch(75% 75% 180)"></color-input>
```

### With NPM / Bundlers

If you're using a bundler and already have `colorjs.io` or `@preact/signals-core` as dependencies in your project, use the `/slim` entry point to avoid duplicating bundled dependencies:

```js
import 'hdr-color-input/slim'
```

## API
- Attributes: `value`, `theme` (auto|light|dark), `no-alpha` (boolean)
- Properties: `value`, `colorspace`, `theme`, `noAlpha`, readonly: `gamut`, `contrastColor`
- Methods: `show()`, `close()`, `setAnchor(element)`
- Events: `change`, `open`, `close`

### Attributes

#### `no-alpha`
When present, hides the alpha channel control from the color picker. The alpha value will still be preserved in the color value, but users won't be able to modify it through the UI.

```html
<color-input value="oklch(75% 75% 180)" no-alpha></color-input>
```

## Dev
- Dev docs: `npm run dev` (serves docs/)
- Build library: `npm run build` (outputs to dist/)
- Tests: `npm test`
