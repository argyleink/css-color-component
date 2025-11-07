# color-input

A standalone web component color picker using colorjs.io and preact signals.

- One script import, one custom element tag
- Colorspaces: srgb, hsl, hwb, lab, lch, oklch, oklab and wide-gamut RGB-like spaces
- Popover UI with automatic positioning; Shadow DOM encapsulation

## Install

### Via npm

```sh
npm i color-input
# or pnpm add color-input
```

### Via CDN

```html
<script src="https://cdn.jsdelivr.net/gh/argyleink/css-color-component@cdn-latest/dist/color-input.min.js"></script>
```

The CDN build is automatically published on every release via GitHub Actions.

## Usage

### With npm

```html
<script type="module">
  import 'color-input/dist/index.js'
</script>

<color-input value="hotpink"></color-input>
<color-input value="oklch(75% 50% 180)" colorspace="oklch"></color-input>
```

### With CDN

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.jsdelivr.net/gh/argyleink/css-color-component@cdn-latest/dist/color-input.min.js"></script>
</head>
<body>
  <color-input value="oklch(75% 75% 180)" colorspace="oklch"></color-input>
</body>
</html>
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
