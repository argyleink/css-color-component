# `<color-input>`

A standalone web component color picker using [colorjs.io](http://colorjs.io/) and [Preact signals](https://github.com/preactjs/signals).

- One script import, one custom element tag
- Colorspaces: srgb, hsl, hwb, lab, lch, oklch, oklab and wide-gamut RGB-like spaces
- Popover UI with automatic positioning and Shadow DOM encapsulation

> Consider this as a beta or alpha build, needing battle testing, contributions and possibly a couple more features before being production ready

## Usage

### With CDN

```html
<script src="https://cdn.jsdelivr.net/gh/argyleink/css-color-component@cdn-latest/dist/color-input.min.js"></script>

<color-input value="oklch(75% 75% 180)"></color-input>
```

## API
- Attributes: `value`, `colorspace`, `theme` (auto|light|dark)
- Properties: `value`, `colorspace`, `theme`, readonly: `gamut`, `contrastColor`
- Methods: `show()`, `close()`, `setAnchor(element)`
- Events: `change`, `open`, `close`

## Dev
- Dev docs: `npm run dev` (serves docs/)
- Build library: `npm run build` (outputs to dist/)
- Tests: `npm test`
