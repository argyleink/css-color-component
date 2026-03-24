# `<color-input>`

A standalone web component color picker built with [colorjs.io](http://colorjs.io/) and [Preact Signals](https://github.com/preactjs/signals).

It is meant to be easy to drop into any app while still supporting modern CSS color workflows:

- modern CSS color syntax, including wide-gamut spaces
- inline text editing, numeric inputs, sliders, and a 2D area picker
- automatic conversion between editing spaces
- popover UI with Shadow DOM encapsulation and CSS parts
- gamut detection, contrast readouts, copy, and EyeDropper support

Try on [CodePen](https://codepen.io/argyleink/pen/dPGBYZg) or get it on [NPM](https://www.npmjs.com/package/hdr-color-input)

> Consider this an actively evolving component. The API is already useful, but the project still benefits from broader real-world testing.

## Supported editing spaces

The picker UI can operate in these spaces:

- `hex`
- `srgb`
- `srgb-linear`
- `hsl`
- `hwb`
- `lab`
- `lch`
- `oklab`
- `oklch`
- `display-p3`
- `a98-rgb`
- `rec2020`
- `prophoto`
- `xyz`
- `xyz-d50`
- `xyz-d65`

The component also computes a read-only `gamut` value that reports the smallest tracked gamut containing the current color.

## Features

### Multiple synchronized editing modes

The picker keeps these surfaces in sync:

- inline text input for raw CSS color strings
- sliders
- numeric channel inputs
- colorspace select
- a 2D area picker

### Gamut-aware area picker

The area picker changes its model depending on the active space:

- `srgb` and `hex` use an OKHSV-style plane
- `hsl` uses saturation × lightness
- `oklch`, `lch`, and wide-gamut RGB-like spaces use a chroma × lightness plane
- `oklab` and `lab` use a centered `a × b` plane
- `hwb` uses whiteness × blackness

For spaces where gamut boundaries matter, the canvas can render boundary overlays and stretch the mapping so more of the useful gamut occupies the control.

### Practical UI features

- inline validation and parse error messaging
- copy current value to clipboard
- EyeDropper integration when supported
- keyboard support in the area picker and slider controls
- optional `no-alpha` mode
- gamut and black/white contrast readouts

## Installation

### CDN

```html
<script type="module">
  import 'https://unpkg.com/hdr-color-input/dist/index.js'
</script>

<color-input value="oklch(75% 30% 180)"></color-input>
```

### Package

```js
import 'hdr-color-input'
```

## Basic usage

```html
<color-input value="color(display-p3 0.3 0.7 0.95)"></color-input>
```

```js
const picker = document.querySelector('color-input')

picker.addEventListener('change', (event) => {
  console.log(event.detail.value)
  console.log(event.detail.colorspace)
  console.log(event.detail.gamut)
})
```

## API overview

### Attributes

- `value`
- `colorspace`
- `color-spaces`
- `theme` (`auto`, `light`, `dark`)
- `no-alpha`

Use `color-spaces` to limit the dropdown to a space-delimited list and choose the default editing space from the first entry:

```html
<color-input
  value="color(display-p3 0.3 0.7 0.95)"
  color-spaces="oklch oklab hex"
></color-input>
```

### Properties

- `value`
- `colorspace`
- `theme`
- `noAlpha`
- `gamut` (read-only)
- `contrastColor` (read-only)

### Methods

- `show(anchor?)`
- `showPicker()`
- `close()`
- `setAnchor(element)`

Compatibility setters are also supported:

- `setColor = value`
- `setAnchorElement = element`

### Events

- `change`
- `open`
- `close`

## Behavior notes

### Value normalization

When the component parses and re-emits a color, it normalizes formatting for the active colorspace. That keeps the visible channel controls and serialized value aligned.

### `colorspace` conversion

Changing `picker.colorspace` converts the current color into the target space and rebuilds the control UI for that space.

```js
picker.value = 'hsl(240 100% 50%)'
picker.colorspace = 'oklch'
console.log(picker.value)
```

### `no-alpha`

When `no-alpha` is present, alpha controls are hidden but any alpha already present in the value is preserved.

```html
<color-input value="oklch(75% 30% 180 / 50%)" no-alpha></color-input>
```

## Styling

The component uses Shadow DOM and exposes CSS parts for customization:

- `trigger`
- `chip`
- `input`
- `error`
- `panel`
- `controls`
- `output`
- `gamut`
- `area`

Example:

```css
color-input::part(trigger) {
  border-radius: 999px;
}

color-input::part(panel) {
  max-inline-size: 40rem;
}
```

## Browser/platform notes

- The picker UI uses the Popover API.
- The EyeDropper control appears only when the browser supports the EyeDropper API.
- The area picker prefers wide-gamut canvas rendering when supported and falls back to sRGB rendering otherwise.

## Development

- Dev docs: `npm run dev`
- Build library + docs: `npm run build`
- Build library only: `npm run build:lib`
- Typecheck: `npm run typecheck`
- Tests: `npm test`
