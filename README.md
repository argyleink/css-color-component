# color-input

A standalone web component color picker using colorjs.io and preact signals.

- One script import, one custom element tag
- Colorspaces: srgb, hsl, hwb, lab, lch, oklch, oklab and wide-gamut RGB-like spaces
- Popover UI with automatic positioning; Shadow DOM encapsulation
- Open Props styling compiled away with PostCSS

## Install

```sh
npm i color-input
# or pnpm add color-input
```

## Usage

```html
<script type="module">
  import 'color-input/dist/index.js'
</script>

<color-input value="oklch(75% .3 180)" colorspace="oklch"></color-input>
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
