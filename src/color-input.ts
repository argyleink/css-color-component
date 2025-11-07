import { signal, computed, effect, Signal } from '@preact/signals-core'
import Color from 'colorjs.io'
import {
  alphaToString,
  contrastColor,
  detectGamut,
  getColorJSSpaceID,
  isRGBLike,
  rgbColor,
  reverseColorJSSpaceID
} from './color'

export type Theme = 'auto' | 'light' | 'dark'
export type ColorSpace =
  | 'srgb' | 'hex' | 'hsl' | 'hwb' | 'lab' | 'lch' | 'oklab' | 'oklch'
  | 'srgb-linear' | 'display-p3' | 'rec2020' | 'a98-rgb' | 'prophoto' | 'xyz' | 'xyz-d50' | 'xyz-d65'

export interface ChangeDetail { value: string; colorspace: ColorSpace; gamut: string }

const DEFAULT_VALUE = 'oklch(75% 75% 180)'
const DEFAULT_SPACE: ColorSpace = 'oklch'

// ──────────────────────────────────────────────────────────────────────────────
// Channel formatting utilities
// ──────────────────────────────────────────────────────────────────────────────
// Convert numeric channel values to strings with space-appropriate precision.

/** Round number to fixed decimals and remove trailing zeros from the string representation. */
function toFixed(n: number, digits = 0) { return Number(n.toFixed(digits)).toString() }

/** Strip trailing zeros from decimal strings (e.g., "1.500" → "1.5", "2.00" → "2"). */
function trimZeros(s: string) { return s.replace(/\.0+($|\D)/, '$1').replace(/(\.\d*?)0+($|\D)/, '$1$2') }

/** Format a channel value to appropriate precision for the given color space and channel name. */
function formatChannel(space: ColorSpace, key: string, val: number) {
  const round = (n: number, d = 0) => Number(n.toFixed(d))
  if (space === 'oklab') {
    if (key === 'L') return String(round(val, 0))
    if (key === 'A' || key === 'B') return String(round(val, 2))
  } else if (space === 'oklch') {
    if (key === 'L') return String(round(val, 0))
    if (key === 'C') return String(round(val, 0)) // 0-100 percentage
    if (key === 'H') return String(round(val, 0))
  } else if (space === 'lab') {
    if (key === 'L') return String(round(val, 0))
    if (key === 'A' || key === 'B') return String(round(val, 0))
  } else if (space === 'lch') {
    if (key === 'L' || key === 'C' || key === 'H') return String(round(val, 0)) // C is 0-100 scale
  } else if (space === 'hsl' || space === 'hwb') {
    if (key === 'H') return String(round(val, 0))
    if (key === 'S' || key === 'L' || key === 'W' || key === 'B') return String(round(val, 0))
  } else if (space === 'srgb' || space === 'hex' || isRGBLike(space)) {
    if (key === 'R' || key === 'G' || key === 'B') return String(round(val, 0))
  }
  if (key === 'ALP') return String(round(val, 0))
  return String(round(val, 2))
}

/** Generate a CSS color string from channel values and color space identifier.
 * Handles percentage/angle notation and alpha transparency per CSS Color spec. */
function gencolor(space: ColorSpace, ch: Record<string, string | number>) {
  const L = (ch.L ?? 50) as any
  const A = (ch.A ?? 0) as any
  const B = (ch.B ?? 0) as any
  const C = (ch.C ?? 0) as any
  const H = (ch.H ?? 0) as any
  const S = (ch.S ?? 0) as any
  const W = (ch.W ?? 0) as any
  const R = (ch.R ?? 0) as any
  const G = (ch.G ?? 0) as any
  const ALP = (ch.ALP ?? 100) as any
  switch (space) {
    case 'oklab': return `oklab(${L}% ${A} ${B}${alphaToString(ALP)})`
    case 'oklch': return `oklch(${L}% ${C}% ${H}${alphaToString(ALP)})` // Chroma as percentage
    case 'lab':   return `lab(${L}% ${A} ${B}${alphaToString(ALP)})`
    case 'lch':   return `lch(${L}% ${C}% ${H}${alphaToString(ALP)})` // Chroma as percentage
    case 'hsl':   return `hsl(${H} ${S}% ${L}%${alphaToString(ALP)})`
    case 'hwb':   return `hwb(${H} ${W}% ${B}%${alphaToString(ALP)})`
    case 'srgb':  return `rgb(${R}% ${G}% ${B}%${alphaToString(ALP)})`
    case 'hex': {
      // Convert percentage to 0-255 range
      const r = Math.round(Number(R) * 2.55)
      const g = Math.round(Number(G) * 2.55)
      const b = Math.round(Number(B) * 2.55)
      const a = Number(ALP)
      // Format as hex
      const rh = r.toString(16).padStart(2, '0')
      const gh = g.toString(16).padStart(2, '0')
      const bh = b.toString(16).padStart(2, '0')
      if (a < 100) {
        const alpha = Math.round((a / 100) * 255)
        const ah = alpha.toString(16).padStart(2, '0')
        return `#${rh}${gh}${bh}${ah}`
      }
      return `#${rh}${gh}${bh}`
    }
    default:
      if (isRGBLike(space)) return rgbColor(space, R, G, B, ALP)
      return DEFAULT_VALUE
  }
}

/** Parse a CSS color string into its component channels for a target color space.
 * Converts between spaces if necessary, normalizes channel ranges, and handles missing hue. */
function parseIntoChannels(space: ColorSpace, colorStr: string) {
  let c = new Color(colorStr)
  // Hex is internally sRGB
  const actualSpace = space === 'hex' ? 'srgb' : space
  // Convert to target space if different
  const targetId = getColorJSSpaceID(actualSpace)
  if (c.space.id !== targetId) {
    c = c.to(targetId)
  }
  const id = reverseColorJSSpaceID(c.space.id) as string
  const s = (id === 'rgb' ? 'srgb' : id) as ColorSpace

  const ch: Record<string, string | number> = {}
  if (s === 'oklab') {
    const [l, a, b] = c.coords
    ch.L = toFixed(l * 100)
    ch.A = toFixed(a, 2)
    ch.B = toFixed(b, 2)
    ch.ALP = toFixed(c.alpha * 100)
  } else if (s === 'oklch') {
    const [l, cc, h] = c.coords
    ch.L = toFixed(l * 100)
    ch.C = toFixed(Math.min(100, cc * 100), 0) // Convert to 0-100%, clamp at 100%
    ch.H = isNaN(h) ? '0' : toFixed(h)
    ch.ALP = toFixed(c.alpha * 100)
  } else if (s === 'lab') {
    const [l, a, b] = c.coords
    ch.L = toFixed(l)
    ch.A = toFixed(a)
    ch.B = toFixed(b)
    ch.ALP = toFixed(c.alpha * 100)
  } else if (s === 'lch') {
    const [l, cc, h] = c.coords
    ch.L = toFixed(l)
    ch.C = toFixed(Math.min(100, cc / 1.5), 0) // Normalize 0-150 to 0-100%, clamp at 100%
    ch.H = toFixed(h)
    ch.ALP = toFixed(c.alpha * 100)
  } else if (s === 'hsl') {
    const [h, s2, l] = c.coords
    ch.H = toFixed(h)
    // colorjs.io returns 0-1 when parsing HSL strings, but 0-100 when converting from other spaces
    ch.S = toFixed(s2 > 1 ? s2 : s2 * 100)
    ch.L = toFixed(l > 1 ? l : l * 100)
    ch.ALP = toFixed(c.alpha * 100)
  } else if (s === 'hwb') {
    const [h, w, b] = c.coords
    ch.H = toFixed(h)
    // colorjs.io returns 0-1 when parsing HWB strings, but 0-100 when converting from other spaces
    ch.W = toFixed(w > 1 ? w : w * 100)
    ch.B = toFixed(b > 1 ? b : b * 100)
    ch.ALP = toFixed(c.alpha * 100)
  } else if (s === 'srgb' || s === 'hex') {
    const [r, g, b] = c.toGamut({ space: 'srgb', method: 'clip' }).coords
    ch.R = toFixed(r * 100)
    ch.G = toFixed(g * 100)
    ch.B = toFixed(b * 100)
    ch.ALP = toFixed(c.alpha * 100)
  } else if (isRGBLike(s)) {
    const [r, g, b] = c.coords
    ch.R = toFixed(Number(r) * 100)
    ch.G = toFixed(Number(g) * 100)
    ch.B = toFixed(Number(b) * 100)
    ch.ALP = toFixed(c.alpha * 100)
  }
  return { space: s, ch }
}

// ──────────────────────────────────────────────────────────────────────────────
// Positioning system: Intelligent popover placement
// ──────────────────────────────────────────────────────────────────────────────
// Computes optimal popover position relative to an anchor, respecting viewport
// bounds, safe areas, and scroll containers. Tries multiple placements and picks
// the one that maximizes visible area while maintaining placement stability.

const VIEWPORT_MARGIN = 8
const GUTTER = 8

type Placement =
  | 'bottom-center' | 'top-center'
  | 'right-start' | 'left-start'
  | 'bottom-left' | 'bottom-right'
  | 'top-left' | 'top-right'

interface Rect {
  left: number
  top: number
  right: number
  bottom: number
  width: number
  height: number
}

interface Size {
  width: number
  height: number
}

interface Candidate {
  placement: Placement
  left: number
  top: number
  right: number
  bottom: number
}

let cachedInsets: { top: number; right: number; bottom: number; left: number } | null = null

/** Detect CSS safe area insets (for notched/rounded displays) via a probe element.
 * Caches result after first call. */
function getSafeAreaInsets(): { top: number; right: number; bottom: number; left: number } {
  if (cachedInsets) return cachedInsets

  const probe = document.createElement('div')
  probe.style.position = 'fixed'
  probe.style.left = '-9999px'
  probe.style.top = '0'
  probe.style.paddingTop = 'env(safe-area-inset-top)'
  probe.style.paddingRight = 'env(safe-area-inset-right)'
  probe.style.paddingBottom = 'env(safe-area-inset-bottom)'
  probe.style.paddingLeft = 'env(safe-area-inset-left)'
  document.documentElement.appendChild(probe)

  const computed = getComputedStyle(probe)
  const top = parseFloat(computed.paddingTop) || 0
  const right = parseFloat(computed.paddingRight) || 0
  const bottom = parseFloat(computed.paddingBottom) || 0
  const left = parseFloat(computed.paddingLeft) || 0

  document.documentElement.removeChild(probe)
  cachedInsets = { top, right, bottom, left }
  return cachedInsets
}

/** Calculate the usable viewport rectangle after accounting for safe areas and margin. */
function getViewportClampRect(insets: { top: number; right: number; bottom: number; left: number }): Rect {
  const vw = window.visualViewport?.width ?? window.innerWidth
  const vh = window.visualViewport?.height ?? window.innerHeight
  const scrollX = window.pageXOffset || document.documentElement.scrollLeft
  const scrollY = window.pageYOffset || document.documentElement.scrollTop

  const left = insets.left + VIEWPORT_MARGIN + scrollX
  const top = insets.top + VIEWPORT_MARGIN + scrollY
  const right = vw - insets.right - VIEWPORT_MARGIN + scrollX
  const bottom = vh - insets.bottom - VIEWPORT_MARGIN + scrollY

  return {
    left,
    top,
    right,
    bottom,
    width: right - left,
    height: bottom - top,
  }
}

/** Generate all possible placement candidates (bottom-center, top-center, etc.) for a popover of given size. */
function computeCandidates(anchor: Rect, size: Size): Candidate[] {
  const { width: w, height: h } = size
  const placements: Candidate[] = [
    {
      placement: 'bottom-center',
      left: anchor.left + anchor.width / 2 - w / 2,
      top: anchor.bottom + GUTTER,
      right: 0, bottom: 0
    },
    {
      placement: 'top-center',
      left: anchor.left + anchor.width / 2 - w / 2,
      top: anchor.top - GUTTER - h,
      right: 0, bottom: 0
    },
    {
      placement: 'right-start',
      left: anchor.right + GUTTER,
      top: anchor.top,
      right: 0, bottom: 0
    },
    {
      placement: 'left-start',
      left: anchor.left - GUTTER - w,
      top: anchor.top,
      right: 0, bottom: 0
    },
    {
      placement: 'bottom-left',
      left: anchor.left,
      top: anchor.bottom + GUTTER,
      right: 0, bottom: 0
    },
    {
      placement: 'bottom-right',
      left: anchor.right - w,
      top: anchor.bottom + GUTTER,
      right: 0, bottom: 0
    },
    {
      placement: 'top-left',
      left: anchor.left,
      top: anchor.top - GUTTER - h,
      right: 0, bottom: 0
    },
    {
      placement: 'top-right',
      left: anchor.right - w,
      top: anchor.top - GUTTER - h,
      right: 0, bottom: 0
    },
  ]

  // Compute right and bottom for each
  placements.forEach((p) => {
    p.right = p.left + w
    p.bottom = p.top + h
  })

  return placements
}

/** Select the best placement candidate: prefer the last placement if still valid (stability),
 * otherwise pick the first that fully fits, or the one with maximum visible area. */
function findFirstFitOrMaxArea(
  candidates: Candidate[],
  viewport: Rect,
  lastPlacement: Placement | null
): Candidate {
  // Check if last placement still fits (for stability)
  if (lastPlacement) {
    const last = candidates.find((c) => c.placement === lastPlacement)
    if (last && fitsInside(last, viewport)) {
      return last
    }
  }

  // First pass: find first that fully fits
  for (const c of candidates) {
    if (fitsInside(c, viewport)) {
      return c
    }
  }

  // Second pass: choose candidate with maximum visible area
  let best = candidates[0]
  let maxArea = visibleArea(best, viewport)

  for (let i = 1; i < candidates.length; i++) {
    const area = visibleArea(candidates[i], viewport)
    if (area > maxArea) {
      maxArea = area
      best = candidates[i]
    }
  }

  return best
}

/** Check if a candidate placement fully fits within the viewport bounds. */
function fitsInside(candidate: Candidate, viewport: Rect): boolean {
  return (
    candidate.left >= viewport.left &&
    candidate.top >= viewport.top &&
    candidate.right <= viewport.right &&
    candidate.bottom <= viewport.bottom
  )
}

/** Calculate the visible area (in px²) of a candidate that intersects with the viewport. */
function visibleArea(candidate: Candidate, viewport: Rect): number {
  const left = Math.max(candidate.left, viewport.left)
  const top = Math.max(candidate.top, viewport.top)
  const right = Math.min(candidate.right, viewport.right)
  const bottom = Math.min(candidate.bottom, viewport.bottom)

  if (right <= left || bottom <= top) return 0
  return (right - left) * (bottom - top)
}

/** Walk up the DOM tree to find all scrollable ancestor containers of an element. */
function getScrollParents(el: HTMLElement): Element[] {
  const parents: Element[] = []
  let current: Element | null = el.parentElement

  while (current && current !== document.documentElement) {
    const style = getComputedStyle(current)
    const overflowY = style.overflowY
    const overflowX = style.overflowX

    if (
      (overflowY === 'auto' || overflowY === 'scroll' || overflowX === 'auto' || overflowX === 'scroll') &&
      (current.scrollHeight > current.clientHeight || current.scrollWidth > current.clientWidth)
    ) {
      parents.push(current)
    }

    current = current.parentElement
  }

  // Always include document scrolling element
  if (document.scrollingElement) {
    parents.push(document.scrollingElement)
  }

  return parents
}

// ──────────────────────────────────────────────────────────────────────────────
// Shadow DOM Template
// ──────────────────────────────────────────────────────────────────────────────
// Defines the component's internal structure and encapsulated styles.
// Layout: trigger button + popover panel (preview area + controls).

const template = document.createElement('template')
template.innerHTML = `
  <style>
    /* Design tokens and system colors */
    :host {
      --canvas: Canvas;
      --canvas-text: CanvasText;
      --radius-2: 0.5rem;
      --radius-3: 0.75rem;
      --radius-round: 9999px;
      --shadow-elev: 0 10px 30px rgba(0,0,0,.18);
      --shadow-inner: inset 0 0 0 1px color-mix(in oklab, var(--canvas-text), transparent 94%);
      --checker: repeating-conic-gradient(color-mix(in oklab, var(--canvas-text), transparent 90%) 0% 25%, transparent 0% 50%) 50%/1rem 1rem;

      color-scheme: light dark;
      display: inline-block;
      position: relative;

      :focus-visible {
        outline-offset: 2px;
      }
    }
    :host([hidden]) { display: none; }

    /* Trigger button: externally visible chip + label that opens the picker */
    button.trigger {
      all: unset;
      cursor: pointer;
      padding: 0.5rem 0.75rem;
      border-radius: var(--radius-2);
      background: color-mix(in oklab, var(--canvas-text), var(--canvas) 92%);
      box-shadow: var(--shadow-inner);
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      .chip {
        inline-size: 1.25rem;
        block-size: 1.25rem;
        border-radius: var(--radius-round);
        box-shadow: inset 0 0 0 1px color-mix(in oklab, var(--canvas-text), transparent 92%);
        margin-inline-end: .25rem;
        background: linear-gradient(var(--value) 0 0), var(--checker);
      }
    }

    /* Panel: popover container for preview + controls; positioned via Popover API */
    .panel {
      margin: 0;
      max-inline-size: min(92vw, 560px);
      background: var(--canvas);
      color: var(--canvas-text);
      box-shadow: var(--shadow-elev);
      border-radius: var(--radius-3);
      padding: 0;
      border: 1px solid #0000;
    }

    /* Preview area: visual swatch + colorspace selector + current value output + gamut badge */
    .preview {
      position: relative;
      aspect-ratio: 16 / 9;
      min-inline-size: 28ch;
      display: grid;
      align-content: end;
      justify-items: start;
      padding: 0.75rem;
      gap: .25lh;
      box-shadow: var(--shadow-inner);
      background: linear-gradient(var(--value) 0 0), var(--checker);
      &:hover .copy-btn, &:focus-within .copy-btn { opacity: 1; }

      & > *:not(:hover) {opacity:.8}
      .copy-wrap {
        position: absolute;
        top: .5rem;
        right: .5rem;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: .25rem;
      }
      .copy-btn {
        color: var(--contrast);
        background: none;
        border: 1px solid #0000;
        border-radius: 0;
        padding: 0;
        cursor: pointer;
        opacity: 0;
        transition: opacity .2s ease;
        display: inline-flex;
        align-items: center;
      }
      .copy-btn svg { display: block; }
      .copy-message {
        color: var(--contrast);
        font-size: 14px;
        font-weight: 500;
        opacity: 0;
        pointer-events: none;
        transition: opacity .2s ease;
        white-space: nowrap;
      }
      .copy-message.show { opacity: 1; }
    }

    /* Colorspace select: dropdown for switching color models (rgb, oklch, lab, etc.) */
    .space {
      appearance: base-select;
      min-block-size: 1lh;
      line-height: 1.1;
      font-size: 12px;
      font-weight: bold;
      margin: 0;
      padding: 0;
      color: var(--contrast);
      background: transparent;
      border-radius: 0;
      border: none;
    }
    .space::picker-icon {
      content: "›";
      transform: rotate(90deg) scale(1.5);
    }

    /* Gamut badge: displays detected color gamut (srgb/p3/rec2020/xyz) */
    /* Info output: shows the current CSS color string */
    .gamut, .info {
      line-height: 1.1;
      text-box: cap alphabetic;
      display: block;
      color: var(--contrast);
      /* No padding/radius; background only on hover/focus */
      background: transparent;
    }
    .gamut { font-size: 12px; text-box: ex alphabetic; }

    /* Controls: dynamically generated sliders + numeric inputs for each channel in the selected color space */
    .controls {
      display: grid;
      gap: 0.5rem;
      padding: 0.75rem;
      border-radius: 0 0 var(--radius-3) var(--radius-3);
      .control {
        display: grid;
        grid-template-columns: min-content 1fr 4ch;
        align-items: center;
        gap: 0.5rem;
      }
      .control .num-wrapper {
        position: relative;
        display: flex;
        align-items: center;
      }
      .control .num-wrapper sup {
        opacity: 0.5;
        font-size: 10px;
        place-self: start;
      }
      .control label {
        font: 500 12px/1.2 ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace;
      }
      .control input[type="number"] {
        text-align: end;
        font-size: 12px; padding: 0; background: none;
        border: 1px solid var(--canvas);
        border-radius: 0.25rem;
        -moz-appearance: textfield;
        font-variant: tabular-nums;
        font-family: monospace;

        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
      }
      .control input[type="range"] {
        width: 100%; height: 1rem; border-radius: 999px;
        border: 1px solid var(--canvas);
        background: var(--canvas); box-shadow: var(--shadow-inner); appearance: none;
      }
      .control input[type="range"].alpha {
        background: linear-gradient(to right, #0000, #000), var(--checker);
      }
      /* Slider thumb styles */
      .control input[type="range"]::-webkit-slider-thumb {
        cursor: grab; appearance: none; border: 4px solid white;
        height: calc(1rem + 8px); aspect-ratio: 1; border-radius: var(--radius-round);
        box-shadow: 0 0px 1px 1px rgba(0,0,0,.25), inset 0 1px 2px rgba(0,0,0,.15);
      }
      .control input[type="range"]:active::-webkit-slider-thumb {
        cursor: grabbing;
      }
      .control input[type="range"]::-moz-range-thumb {
        cursor: grab; appearance: none; border: 4px solid white;
        height: calc(1rem + 8px); aspect-ratio: 1; border-radius: var(--radius-round);
        box-shadow: 0 0px 1px 1px rgba(0,0,0,.25), inset 0 1px 2px rgba(0,0,0,.15);
      }
      .control input[type="range"]:active::-moz-range-thumb {
        cursor: grabbing;
      }
    }
  </style>
  <button class="trigger" part="trigger" aria-haspopup="dialog">
    <span class="chip" part="chip"></span>
    <span class="label" part="label">Color</span>
  </button>
  <div class="panel" popover="auto" part="panel">
    <div class="preview">
      <div class="copy-wrap">
        <button class="copy-btn" title="Copy color" aria-label="Copy color">
          <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 22q-.825 0-1.413-.588T3 20V6h2v14h11v2H5Zm4-4q-.825 0-1.413-.588T7 16V4q0-.825.588-1.413T9 2h9q.825 0 1.413.588T20 4v12q0 .825-.588 1.413T18 18H9Z"/></svg>
        </button>
        <span class="copy-message" aria-live="polite" role="status">Copied!</span>
      </div>
      <select class="space" title="Colorspace"></select>
      <output class="info" part="output"></output>
      <span class="gamut" title="Color's gamut" part="gamut"></span>
    </div>
    <div class="controls" part="controls"></div>
  </div>
  </div>
`

export class ColorInput extends HTMLElement {
  static get observedAttributes() { return ['value', 'colorspace', 'theme'] }

  // ──────────────────────────────────────────────────────────────────────────────
  // State: Reactive signals (Preact Signals Core)
  // ──────────────────────────────────────────────────────────────────────────────
  // #value: current CSS color string (canonical representation)
  // #space: selected color space (e.g., 'oklch', 'srgb', 'display-p3')
  // #theme: UI theme ('auto' | 'light' | 'dark')
  // #open: popover open/closed state
  // #anchor: optional external element to anchor positioning to
  //
  // Derived signals:
  // #contrast: computed legible contrast color ('white' | 'black') for preview text
  // #gamut: computed smallest gamut containing the color ('srgb' | 'p3' | 'rec2020' | 'xyz')

  #value = signal<string>(DEFAULT_VALUE)
  #space = signal<ColorSpace>(DEFAULT_SPACE)
  #theme = signal<Theme>('auto')
  #open = signal(false)
  #anchor: Signal<HTMLElement | null> = signal(null)

  #contrast = computed(() => contrastColor(this.#value.value))
  #gamut = computed(() => detectGamut(this.#value.value))

  get value() { return this.#value.value }
  set value(v: string) {
    if (typeof v !== 'string' || !v) return
    try {
      const parsed = new Color(v)
      const sid = reverseColorJSSpaceID(parsed.space.id) as string
      // Detect hex format
      const isHex = typeof v === 'string' && v.trim().startsWith('#')
      this.#space.value = isHex ? 'hex' : (sid === 'rgb' ? 'srgb' : (sid as ColorSpace))
      this.#value.value = v
      this.setAttribute('value', v)
      this.setAttribute('colorspace', this.#space.value)
      this.#emitChange()
    } catch {}
  }

  get colorspace() { return this.#space.value }
  set colorspace(s: ColorSpace | string) {
    const next = (s as ColorSpace) || DEFAULT_SPACE
    this.#space.value = next
    this.setAttribute('colorspace', next)
    // convert current value to target space to preserve color
    try {
      const current = new Color(this.#value.value)
      // Hex is internally sRGB for conversion purposes
      const targetSpace = next === 'hex' ? 'srgb' : next
      const converted = current.to(getColorJSSpaceID(targetSpace)).toGamut()
      // Parse and regenerate using our formatters for proper precision
      const tempStr = converted.toString({ precision: 12 })
      const parsed = parseIntoChannels(next, tempStr)
      const newValue = gencolor(next, parsed.ch)
      // Update value signal (this triggers gamut recomputation)
      this.#value.value = newValue
      this.setAttribute('value', newValue)
      // gamut signal is computed and will update automatically
      this.#emitChange()
    } catch {}
  }

  get theme() { return this.#theme.value }
  set theme(t: Theme | string) {
    const next: Theme = (t === 'light' || t === 'dark') ? t : 'auto'
    this.#theme.value = next
    if (next === 'auto') this.removeAttribute('theme')
    else this.setAttribute('theme', next)
  }

  // read-only derived
  get gamut() { return this.#gamut.value }
  get contrastColor() { return this.#contrast.value }

  // popover API
  show(anchor?: HTMLElement | null) {
    if (anchor) this.#anchor.value = anchor
    this.#panel?.showPopover?.();
    this.#startReposition()
  }
  close() { this.#panel?.hidePopover?.(); this.#stopReposition() }
  // HTMLInputElement.showPicker() alignment for custom element consumers
  showPicker() { this.show() }

  setAnchor(el: HTMLElement | null) { this.#anchor.value = el }
  set setColor(v: string) { this.value = v }
  set setAnchorElement(el: HTMLElement | null) { this.setAnchor(el) }

  // ──────────────────────────────────────────────────────────────────────────────
  // DOM references: Cached shadow DOM elements for efficient updates
  // ──────────────────────────────────────────────────────────────────────────────
  // #root: shadow root container
  // #panel: popover panel container (with Popover API methods)
  // #controls: container for channel sliders/inputs (dynamically populated)
  // #spaceSelect: colorspace dropdown in preview
  // #output: <output> displaying current CSS color string
  // #chip: color swatch on trigger button
  // #internalTrigger: built-in trigger button
  // #lastInvoker: last external button that invoked the picker (for anchoring)

  #root: ShadowRoot
  #panel?: HTMLElement & { showPopover?: () => void; hidePopover?: () => void }
  #controls?: HTMLElement
  #spaceSelect?: HTMLSelectElement
  #output?: HTMLOutputElement
  #chip?: HTMLElement
  #internalTrigger?: HTMLButtonElement
  #lastInvoker: HTMLElement | null = null

  constructor() {
    super()
    this.#root = this.attachShadow({ mode: 'open' })
    this.#root.appendChild(template.content.cloneNode(true))
  }

  connectedCallback() {
    const btn = this.#root.querySelector<HTMLButtonElement>('button.trigger')
    this.#internalTrigger = btn ?? undefined
    this.#panel = this.#root.querySelector('.panel') as any
    this.#controls = this.#root.querySelector('.controls') as HTMLElement
    this.#spaceSelect = this.#root.querySelector('.space') as HTMLSelectElement
    this.#output = this.#root.querySelector('output.info') as HTMLOutputElement
    this.#chip = this.#root.querySelector('.chip') as HTMLElement
    // Copy to clipboard from preview button
    const copyBtn = this.#root.querySelector<HTMLButtonElement>('button.copy-btn')
    const copyMessage = this.#root.querySelector<HTMLElement>('.copy-message')
    if (copyBtn && copyMessage) {
      let copyTimeout: number | null = null
      copyBtn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(this.#value.value)
          copyMessage.classList.add('show')
          if (copyTimeout !== null) clearTimeout(copyTimeout)
          copyTimeout = window.setTimeout(() => {
            copyMessage.classList.remove('show')
            copyTimeout = null
          }, 3000)
        } catch {}
      })
    }

    // init space options
    this.#spaceSelect.innerHTML = `
      <optgroup label="Standard">
        <option value="hex">hex</option>
        <option value="srgb">rgb</option>
        <option value="srgb-linear">srgb-linear</option>
        <option value="hsl">hsl</option>
        <option value="hwb">hwb</option>
      </optgroup>
      <optgroup label="HDR">
        <option value="display-p3">display-p3</option>
        <option value="a98-rgb">a98-rgb</option>
      </optgroup>
      <optgroup label="Ultra HDR">
        <option value="lab">lab</option>
        <option value="lch">lch</option>
        <option value="oklch">oklch</option>
        <option value="oklab">oklab</option>
        <option value="rec2020">rec2020</option>
        <option value="prophoto">prophoto</option>
        <option value="xyz">xyz</option>
        <option value="xyz-d50">xyz-d50</option>
        <option value="xyz-d65">xyz-d65</option>
      </optgroup>
    `

    // internal trigger opens via click
    if (btn) btn.addEventListener('click', () => this.show(btn))

    // Invoker Commands API: respond to command events addressed to the host
    this.addEventListener('command', (ev: Event) => {
      const command = (ev as any).command as string | undefined
      if (!command) return
      // Try to capture the invoker (button) to anchor positioning
      const possibleInvoker = (ev as any).source || (ev as any).invoker || (document.activeElement instanceof HTMLElement ? document.activeElement : null)
      if (possibleInvoker) { this.#lastInvoker = possibleInvoker; this.setAnchor(possibleInvoker) }
      if (command === 'show-popover' || command === 'show') this.show(this.#lastInvoker)
      else if (command === 'hide-popover' || command === 'close') this.close()
      else if (command === 'toggle-popover' || command === 'toggle') {
        if (this.#open.value) this.close(); else this.show(this.#lastInvoker)
      }
    })

    this.#panel?.addEventListener('toggle', () => {
      // Prefer native :popover-open; fall back to !hidden for polyfills
      const el = this.#panel as HTMLElement
      let isOpen = false
      try {
        isOpen = el.matches?.(':popover-open') ?? false
      } catch {
        // jsdom doesn't support :popover-open pseudo-class
      }
      isOpen = isOpen || !el.hasAttribute('hidden')
      this.#open.value = isOpen
      if (isOpen) {
        this.#startReposition()
      } else {
        this.#stopReposition()
      }
      this.dispatchEvent(new CustomEvent(isOpen ? 'open' : 'close', { bubbles: true }))
    })

    this.#spaceSelect.addEventListener('change', () => {
      this.colorspace = this.#spaceSelect!.value as ColorSpace
      this.#renderControls()
    })

    // ──────────────────────────────────────────────────────────────────────────────
    // Reactive effect: Sync signal state → DOM
    // ──────────────────────────────────────────────────────────────────────────────
    // Updates chip, output, gamut badge, and CSS custom properties whenever
    // value, gamut, or contrast signals change.

    effect(() => {
      const v = this.#value.value
      const gamut = this.#gamut.value
      const contrast = this.#contrast.value
      if (this.#output) this.#output.value = v
      if (this.#chip) this.#chip.style.setProperty('--value', v)
      this.style.setProperty('--contrast', contrast)
      this.style.setProperty('--counter', contrast === 'white' ? 'black' : 'white')
      const gamutEl = this.#root.querySelector('.gamut') as HTMLElement
      if (gamutEl) gamutEl.textContent = gamut
      const preview = this.#root.querySelector('.preview') as HTMLElement
      if (preview) preview.style.setProperty('--value', v)
    })

    // Update color-scheme based on theme
    effect(() => {
      const theme = this.#theme.value
      const colorScheme = theme === 'auto' ? 'light dark' : theme
      this.style.setProperty('color-scheme', colorScheme)
    })

    // Defaults
    if (!this.hasAttribute('value')) this.setAttribute('value', DEFAULT_VALUE)
    if (!this.hasAttribute('colorspace')) this.setAttribute('colorspace', DEFAULT_SPACE)

    this.#spaceSelect.value = this.#space.value
    this.#renderControls()
  }

  attributeChangedCallback(name: string, _old: string | null, value: string | null) {
    if (value === _old) return
    if (name === 'value' && typeof value === 'string') {
      try {
        const parsed = new Color(value)
        const sid = reverseColorJSSpaceID(parsed.space.id) as string
        // Detect hex format
        const isHex = typeof value === 'string' && value.trim().startsWith('#')
        this.#value.value = value
        this.#space.value = isHex ? 'hex' : (sid === 'rgb' ? 'srgb' : (sid as ColorSpace))
        if (this.#spaceSelect) this.#spaceSelect.value = this.#space.value
      } catch {}
    }
    if (name === 'colorspace' && value) {
      this.#space.value = value as ColorSpace
      if (this.#spaceSelect) this.#spaceSelect.value = value
    }
    if (name === 'theme') {
      this.#theme.value = (value as Theme) || 'auto'
    }
  }

  #emitChange() {
    const detail: ChangeDetail = { value: this.#value.value, colorspace: this.#space.value, gamut: this.#gamut.value }
    this.dispatchEvent(new CustomEvent<ChangeDetail>('change', { detail, bubbles: true }))
  }

  // ──────────────────────────────────────────────────────────────────────────────
  // Positioning system
  // ──────────────────────────────────────────────────────────────────────────────

  #lastPlacement: Placement | null = null
  #lastPanelSize: Size | null = null
  #cleanup: Array<() => void> = []
  #rafId: number | null = null

  #startReposition() {
    if (this.#cleanup.length) return // already started
    this.#scheduleReposition()

    const anchor = this.#anchor.value ?? this.#lastInvoker ?? this.#internalTrigger
    if (!anchor || !this.#panel) return

    // ResizeObserver for anchor, panel, and documentElement
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(() => this.#scheduleReposition())
      ro.observe(anchor)
      ro.observe(this.#panel)
      ro.observe(document.documentElement)
      this.#cleanup.push(() => ro.disconnect())
    } else {
      const onResize = () => this.#scheduleReposition()
      window.addEventListener('resize', onResize)
      this.#cleanup.push(() => window.removeEventListener('resize', onResize))
    }

    // VisualViewport events
    if (window.visualViewport) {
      const onVV = () => this.#scheduleReposition()
      window.visualViewport.addEventListener('resize', onVV)
      window.visualViewport.addEventListener('scroll', onVV)
      this.#cleanup.push(() => {
        window.visualViewport?.removeEventListener('resize', onVV)
        window.visualViewport?.removeEventListener('scroll', onVV)
      })
    }

    // Scroll parents
    const scrollParents = getScrollParents(anchor)
    scrollParents.forEach((sp) => {
      const onScroll = () => this.#scheduleReposition()
      sp.addEventListener('scroll', onScroll, { passive: true })
      this.#cleanup.push(() => sp.removeEventListener('scroll', onScroll))
    })

    // IntersectionObserver for anchor visibility
    if (typeof IntersectionObserver !== 'undefined') {
      const io = new IntersectionObserver(() => this.#scheduleReposition(), { threshold: 0 })
      io.observe(anchor)
      this.#cleanup.push(() => io.disconnect())
    }
  }

  #stopReposition() {
    this.#cleanup.forEach((fn) => fn())
    this.#cleanup = []
    if (this.#rafId !== null) {
      cancelAnimationFrame(this.#rafId)
      this.#rafId = null
    }
  }

  #scheduleReposition() {
    if (this.#rafId !== null) return
    this.#rafId = requestAnimationFrame(() => {
      this.#rafId = null
      this.#positionNow()
    })
  }

  #positionNow() {
    if (!this.#panel) return
    const panel = this.#panel as HTMLElement

    // Read phase
    const anchorRect = this.#getAnchorRect()
    const insets = getSafeAreaInsets()
    const viewport = getViewportClampRect(insets)
    const size = this.#measurePanel(panel)

    // Compute candidates
    const candidates = computeCandidates(anchorRect, size)

    // Pick best placement
    const pick = findFirstFitOrMaxArea(candidates, viewport, this.#lastPlacement)
    this.#lastPlacement = pick.placement

    // Clamp within viewport
    const left = Math.round(Math.min(Math.max(pick.left, viewport.left), viewport.right - size.width))
    const top = Math.round(Math.min(Math.max(pick.top, viewport.top), viewport.bottom - size.height))

    // Enforce max height if needed
    const maxPanelHeight = viewport.bottom - viewport.top
    if (size.height > maxPanelHeight) {
      panel.style.maxHeight = `${maxPanelHeight}px`
      panel.style.overflow = 'auto'
    } else if (panel.style.maxHeight) {
      panel.style.maxHeight = ''
      panel.style.overflow = ''
    }

    // Write phase
    panel.style.position = 'absolute'
    panel.style.left = `${left}px`
    panel.style.top = `${top}px`
    panel.style.setProperty('--ci-panel-placement', pick.placement)
    panel.dataset.placement = pick.placement
  }

  #getAnchorRect(): Rect {
    const anchor = this.#anchor.value ?? this.#lastInvoker ?? this.#internalTrigger ?? this
    const scrollX = window.pageXOffset || document.documentElement.scrollLeft
    const scrollY = window.pageYOffset || document.documentElement.scrollTop

    if (!anchor.isConnected) {
      // Fallback to viewport center
      const vw = window.visualViewport?.width ?? window.innerWidth
      const vh = window.visualViewport?.height ?? window.innerHeight
      const cx = vw / 2 + scrollX
      const cy = vh / 2 + scrollY
      return { left: cx, top: cy, right: cx, bottom: cy, width: 0, height: 0 }
    }
    const rect = anchor.getBoundingClientRect()
    return {
      left: rect.left + scrollX,
      top: rect.top + scrollY,
      right: rect.right + scrollX,
      bottom: rect.bottom + scrollY,
      width: rect.width,
      height: rect.height,
    }
  }

  #measurePanel(panel: HTMLElement): Size {
    const rect = panel.getBoundingClientRect()
    if (rect.width > 0 && rect.height > 0) {
      this.#lastPanelSize = { width: rect.width, height: rect.height }
      return this.#lastPanelSize
    }

    // Force layout for measurement
    const saved = {
      display: panel.style.display,
      position: panel.style.position,
      left: panel.style.left,
      top: panel.style.top,
      visibility: panel.style.visibility,
      maxHeight: panel.style.maxHeight,
    }
    panel.style.display = 'block'
    panel.style.position = 'absolute'
    panel.style.left = '-99999px'
    panel.style.top = '0'
    panel.style.visibility = 'hidden'
    panel.style.maxHeight = 'none'

    const rect2 = panel.getBoundingClientRect()
    panel.style.display = saved.display
    panel.style.position = saved.position
    panel.style.left = saved.left
    panel.style.top = saved.top
    panel.style.visibility = saved.visibility
    panel.style.maxHeight = saved.maxHeight

    if (rect2.width > 0 && rect2.height > 0) {
      this.#lastPanelSize = { width: rect2.width, height: rect2.height }
      return this.#lastPanelSize
    }

    // Fallback to cached or hardcoded default
    return this.#lastPanelSize ?? { width: 560, height: 400 }
  }

  // ──────────────────────────────────────────────────────────────────────────────
  // Control rendering: Dynamically generate sliders + numeric inputs per color space
  // ──────────────────────────────────────────────────────────────────────────────
  // Each space defines its own channels (e.g., H/S/L for HSL, L/C/H for OKLCH).
  // The `make` helper creates a label + range slider + numeric input trio with
  // synchronized two-way binding and optional gradient backgrounds.

  #renderControls() {
    const space = this.#space.value
    if (!this.#controls) return
    const current = parseIntoChannels(space, this.#value.value)
    const ch = current.ch

    // Create reactive channel signals for dynamic backgrounds
    const channelSignals: Record<string, ReturnType<typeof signal<string>>> = {}
    Object.keys(ch).forEach(key => {
      channelSignals[key] = signal(String(ch[key]))
    })

    const make = (label: string, key: string, min: number, max: number, step = 1, bg?: string, bgColor?: string) => {
      const wrapHue = key === 'H'
      const isPercentage = ['L', 'S', 'C', 'W', 'B', 'R', 'G', 'ALP'].includes(key)
      const isAngle = key === 'H'

      const group = document.createElement('div')
      group.className = 'control'
      const lab = document.createElement('label')
      lab.textContent = label
      // Add title attribute with full channel name
      const titleMap: Record<string, string> = {
        'L': 'Lightness',
        'C': 'Chroma',
        'H': 'Hue',
        'S': 'Saturation',
        'A': 'A (green-red axis)',
        'W': 'Whiteness',
        'R': 'Red',
        'G': 'Green',
        'ALP': 'Alpha'
      }
      // B channel is context-dependent
      if (key === 'B') {
        if (space === 'oklab' || space === 'lab') {
          lab.title = 'B (blue-yellow axis)'
        } else if (space === 'hwb') {
          lab.title = 'Blackness'
        } else {
          lab.title = 'Blue'
        }
      } else if (titleMap[key]) {
        lab.title = titleMap[key]
      }
      const range = document.createElement('input')
      range.type = 'range'
      range.min = String(min)
      range.max = String(max)
      range.step = String(step)
      range.classList.add(`ch-${key.toLowerCase()}`)
      if (bg) range.style.backgroundImage = bg
      if (bgColor) range.style.backgroundColor = bgColor
      range.value = String(ch[key] ?? 0)
      if (key === 'ALP') {
        range.classList.add('alpha')
        // Alpha slider shows transparent -> current color over checkerboard
        try {
          const c0 = gencolor(space, { ...ch, ALP: '0' })
          const c1 = gencolor(space, { ...ch, ALP: '100' })
          // Use appropriate interpolation color space for alpha gradient
          const interpSpace = space === 'hsl' ? 'hsl' : (space === 'lch' ? 'lch' : (space === 'oklch' ? 'oklch' : 'oklab'))
          range.style.background = `linear-gradient(to right in ${interpSpace}, ${c0}, ${c1}), var(--checker)`
        } catch {}
      }
      const num = document.createElement('input')
      num.type = 'number'
      num.min = String(min)
      num.max = String(max)
      num.step = String(step)
      num.classList.add(`ch-${key.toLowerCase()}`)
      num.value = String(ch[key] ?? 0)

      // Wrap number input with unit suffix
      const numWrapper = document.createElement('div')
      numWrapper.className = 'num-wrapper'
      numWrapper.appendChild(num)
      if (isPercentage || isAngle) {
        const unit = document.createElement('sup')
        unit.textContent = isAngle ? '°' : '%'
        numWrapper.appendChild(unit)
      }

      const apply = () => {
        const next = gencolor(space, ch)
        this.#value.value = next
        this.setAttribute('value', next)
        // Don't update colorspace attribute during slider changes - preserve current space
        // this.setAttribute('colorspace', space) // removed to prevent space changes
        this.#emitChange()
      }

      const onInput = (ev: Event) => {
        const target = ev.target as HTMLInputElement
        let val = Number(target.value)
        if (!Number.isFinite(val)) return
        if (wrapHue) {
          val = ((val % 360) + 360) % 360
        } else {
          val = Math.max(min, Math.min(max, val))
        }
        const formatted = formatChannel(space, key, val)
        ch[key] = formatted
        channelSignals[key].value = formatted
        // keep controls in sync
        range.value = String(ch[key])
        num.value = String(ch[key])
        apply()
      }

      range.addEventListener('input', onInput)
      num.addEventListener('input', onInput)
      group.append(lab, range, numWrapper)
      return group
    }

    this.#controls.innerHTML = ''

    if (space === 'oklab') {
      this.#controls.append(
        make('L', 'L', 0, 100, 1, 'linear-gradient(in oklab to right, black, white)'),
        make('A', 'A', -0.5, 0.5, 0.01, 'linear-gradient(to right in oklab, oklab(65% -.5 .5), oklab(65% .5 .5))'),
        make('B', 'B', -0.5, 0.5, 0.01, 'linear-gradient(to right in oklab, oklab(47% -.03 -.32), oklab(96% 0 .25))'),
        make('A', 'ALP', 0, 100, 1)
      )
      // Use signals to reactively update oklab alpha slider background
      const alphaRange = this.#controls.querySelector<HTMLInputElement>('input[type="range"].ch-alp')
      effect(() => {
        const L = channelSignals.L.value || '50'
        const A = channelSignals.A.value || '0'
        const B = channelSignals.B.value || '0'
        if (alphaRange) {
          alphaRange.style.background = `linear-gradient(to right in oklab, oklab(${L}% ${A} ${B} / 0%), oklab(${L}% ${A} ${B} / 100%)), var(--checker)`
        }
      })
    } else if (space === 'oklch') {
      this.#controls.append(
        make('L', 'L', 0, 100, 1, 'linear-gradient(in oklab to right, black, white)'),
        // Chroma: 0-100% (gray → highly saturated)
        make('C', 'C', 0, 100, 1, `linear-gradient(in oklch to right, oklch(${ch.L ?? 0}% 1% ${ch.H ?? 0}), oklch(${ch.L ?? 0}% 100% ${ch.H ?? 0}))`),
        // Hue: full spectrum (mirror LCH pattern, but in OKLCH)
        make('H', 'H', 0, 359, 1, 'linear-gradient(to right in oklch longer hue, oklch(90% 75% 0), oklch(90% 75% 0))'),
        make('A', 'ALP', 0, 100, 1)
      )
      // Use signals to reactively update OKLCH slider backgrounds
      const cRange = this.#controls.querySelector<HTMLInputElement>('input[type="range"].ch-c')
      const alphaRange = this.#controls.querySelector<HTMLInputElement>('input[type="range"].ch-alp')
      effect(() => {
        const L = channelSignals.L.value || '0'
        const C = channelSignals.C.value || '0'
        const H = channelSignals.H.value || '0'
        // Update Chroma slider background
        if (cRange) {
          cRange.style.backgroundImage = `linear-gradient(in oklch to right, oklch(${L}% 1% ${H}deg), oklch(${L}% 100% ${H}deg))`
        }
        // Update Alpha slider background
        if (alphaRange) {
          alphaRange.style.background = `linear-gradient(to right in oklch, oklch(${L}% ${C}% ${H} / 0%), oklch(${L}% ${C}% ${H} / 100%)), var(--checker)`
        }
      })
    } else if (space === 'lab') {
      this.#controls.append(
        make('L', 'L', 0, 100, 1, 'linear-gradient(in lab to right, black, white)'),
        make('A', 'A', -160, 160, 1, 'linear-gradient(to right in oklab, lab(85% -100 100), lab(55% 100 100))'),
        make('B', 'B', -160, 160, 1, 'linear-gradient(to right in oklab, lab(31% 70 -120), lab(96% 0 120))'),
        make('A', 'ALP', 0, 100, 1)
      )
      // Use signals to reactively update lab alpha slider background
      const alphaRange = this.#controls.querySelector<HTMLInputElement>('input[type="range"].ch-alp')
      effect(() => {
        const L = channelSignals.L.value || '50'
        const A = channelSignals.A.value || '0'
        const B = channelSignals.B.value || '0'
        if (alphaRange) {
          alphaRange.style.background = `linear-gradient(to right in lab, lab(${L}% ${A} ${B} / 0%), lab(${L}% ${A} ${B} / 100%)), var(--checker)`
        }
      })
    } else if (space === 'lch') {
      this.#controls.append(
        make('L', 'L', 0, 100, 1, 'linear-gradient(in lab to right, black, white)'),
        // Chroma: 0-100% (gray → highly saturated)
        make('C', 'C', 0, 100, 1, `linear-gradient(in lch to right, lch(${ch.L ?? 0}% 1% ${ch.H ?? 0}), lch(${ch.L ?? 0}% 100% ${ch.H ?? 0}))`),
        // Hue: full spectrum
        make('H', 'H', 0, 359, 1, 'linear-gradient(to right in lch longer hue, lch(90% 75% 0), lch(90% 75% 0))'),
        make('A', 'ALP', 0, 100, 1)
      )
      // Use signals to reactively update LCH slider backgrounds
      const cRange = this.#controls.querySelector<HTMLInputElement>('input[type="range"].ch-c')
      const alphaRange = this.#controls.querySelector<HTMLInputElement>('input[type="range"].ch-alp')
      effect(() => {
        const L = channelSignals.L.value || '50'
        const C = channelSignals.C.value || '0'
        const H = channelSignals.H.value || '0'
        // Update Chroma slider background
        if (cRange) {
          cRange.style.backgroundImage = `linear-gradient(in lch to right, lch(${L}% 1% ${H}), lch(${L}% 100% ${H}))`
        }
        // Update Alpha slider background
        if (alphaRange) {
          alphaRange.style.background = `linear-gradient(to right in lch, lch(${L}% ${C}% ${H} / 0%), lch(${L}% ${C}% ${H} / 100%)), var(--checker)`
        }
      })
    } else if (space === 'hsl') {
      this.#controls.append(
        make('H', 'H', 0, 359, 1, 'linear-gradient(to right in hsl longer hue, hsl(0 100% 50%), hsl(360 100% 50%))'),
        // Saturation: gray → fully saturated at current H and L (interpolate in hsl with full context)
        make('S', 'S', 0, 100, 1, `linear-gradient(in hsl to right, hsl(${ch.H ?? 0} 0% ${ch.L ?? 50}% / 100%), hsl(${ch.H ?? 0} 100% ${ch.L ?? 50}% / 100%))`),
        // Lightness: black → white at current H/S (interpolate in oklab)
        make('L', 'L', 0, 100, 1, `linear-gradient(in oklab to right, hsl(${ch.H ?? 0} ${ch.S ?? 100}% 0%), hsl(${ch.H ?? 0} ${ch.S ?? 100}% 100%))`),
        make('A', 'ALP', 0, 100, 1)
      )
      // Use signals to reactively update HSL slider backgrounds
      const sRange = this.#controls.querySelector<HTMLInputElement>('input[type="range"].ch-s')
      const lRange = this.#controls.querySelector<HTMLInputElement>('input[type="range"].ch-l')
      const alphaRange = this.#controls.querySelector<HTMLInputElement>('input[type="range"].ch-alp')
      effect(() => {
        const H = channelSignals.H.value || '0'
        const S = channelSignals.S.value || '100'
        const L = channelSignals.L.value || '50'
        // Update Saturation slider: gray to fully saturated at current H and L
        if (sRange) {
          sRange.style.backgroundImage = `linear-gradient(in hsl to right, hsl(${H} 0% ${L}% / 100%), hsl(${H} 100% ${L}% / 100%))`
        }
        // Update Lightness slider: black to white at current H and S
        if (lRange) {
          lRange.style.backgroundImage = `linear-gradient(in oklab to right, hsl(${H} ${S}% 0%), hsl(${H} ${S}% 100%))`
        }
        // Update Alpha slider: transparent to current color
        if (alphaRange) {
          alphaRange.style.background = `linear-gradient(to right in hsl, hsl(${H} ${S}% ${L}% / 0%), hsl(${H} ${S}% ${L}% / 100%)), var(--checker)`
        }
      })
    } else if (space === 'hwb') {
      this.#controls.append(
        make('H', 'H', 0, 359, 1, 'linear-gradient(to right in hsl longer hue, hsl(0 100% 50%), hsl(360 100% 50%))'),
        make('W', 'W', 0, 100, 1, 'linear-gradient(to right in oklab, #fff0, #fff)', 'black'),
        make('B', 'B', 0, 100, 1, 'linear-gradient(to right in oklab, #0000, #000)', 'white'),
        make('A', 'ALP', 0, 100, 1)
      )
      // Use signals to reactively update HWB alpha slider background
      const alphaRange = this.#controls.querySelector<HTMLInputElement>('input[type="range"].ch-alp')
      effect(() => {
        const H = channelSignals.H.value || '0'
        const W = channelSignals.W.value || '0'
        const B = channelSignals.B.value || '0'
        if (alphaRange) {
          alphaRange.style.background = `linear-gradient(to right in hwb, hwb(${H} ${W}% ${B}% / 0%), hwb(${H} ${W}% ${B}% / 100%)), var(--checker)`
        }
      })
    } else if (space === 'srgb' || space === 'hex') {
      this.#controls.append(
        make('R', 'R', 0, 100, 1, 'linear-gradient(to right in oklab, #f000, #f00)', 'black'),
        make('G', 'G', 0, 100, 1, 'linear-gradient(to right in oklab, #0f00, #0f0)', 'black'),
        make('B', 'B', 0, 100, 1, 'linear-gradient(to right in oklab, #00f0, #00f)', 'black'),
        make('A', 'ALP', 0, 100, 1)
      )
      // Use signals to reactively update sRGB/hex alpha slider background
      const alphaRange = this.#controls.querySelector<HTMLInputElement>('input[type="range"].ch-alp')
      effect(() => {
        const R = channelSignals.R.value || '0'
        const G = channelSignals.G.value || '0'
        const B = channelSignals.B.value || '0'
        if (alphaRange) {
          alphaRange.style.background = `linear-gradient(to right in srgb, rgb(${R}% ${G}% ${B}% / 0%), rgb(${R}% ${G}% ${B}% / 100%)), var(--checker)`
        }
      })
    } else if (isRGBLike(space)) {
      this.#controls.append(
        make('R', 'R', 0, 100, 1, 'linear-gradient(to right in oklab, #f000, #f00)', 'black'),
        make('G', 'G', 0, 100, 1, 'linear-gradient(to right in oklab, #0f00, #0f0)', 'black'),
        make('B', 'B', 0, 100, 1, 'linear-gradient(to right in oklab, #00f0, #00f)', 'black'),
        make('A', 'ALP', 0, 100, 1)
      )
      // Use signals to reactively update RGB-like alpha slider background
      const alphaRange = this.#controls.querySelector<HTMLInputElement>('input[type="range"].ch-alp')
      effect(() => {
        const R = channelSignals.R.value || '0'
        const G = channelSignals.G.value || '0'
        const B = channelSignals.B.value || '0'
        if (alphaRange) {
          const c0 = gencolor(space, { ...ch, R, G, B, ALP: '0' })
          const c1 = gencolor(space, { ...ch, R, G, B, ALP: '100' })
          alphaRange.style.background = `linear-gradient(to right, ${c0}, ${c1}), var(--checker)`
        }
      })
    }
  }
}

customElements.define('color-input', ColorInput)

declare global {
  interface HTMLElementTagNameMap { 'color-input': ColorInput }
}
