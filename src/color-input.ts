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
  | 'srgb' | 'hsl' | 'hwb' | 'lab' | 'lch' | 'oklab' | 'oklch'
  | 'srgb-linear' | 'display-p3' | 'rec2020' | 'a98-rgb' | 'prophoto' | 'xyz' | 'xyz-d50' | 'xyz-d65'

export interface ChangeDetail { value: string; colorspace: ColorSpace }

const DEFAULT_VALUE = 'oklch(75% .3 180)'
const DEFAULT_SPACE: ColorSpace = 'oklch'

function toFixed(n: number, digits = 0) { return Number(n.toFixed(digits)).toString() }

function trimZeros(s: string) { return s.replace(/\.0+($|\D)/, '$1').replace(/(\.\d*?)0+($|\D)/, '$1$2') }
function formatChannel(space: ColorSpace, key: string, val: number) {
  const round = (n: number, d = 0) => Number(n.toFixed(d))
  if (space === 'oklab') {
    if (key === 'L') return String(round(val, 0))
    if (key === 'A' || key === 'B') return String(round(val, 2))
  } else if (space === 'oklch') {
    if (key === 'L') return String(round(val, 0))
    if (key === 'C') return String(round(val, 2))
    if (key === 'H') return String(round(val, 0))
  } else if (space === 'lab') {
    if (key === 'L') return String(round(val, 0))
    if (key === 'A' || key === 'B') return String(round(val, 0))
  } else if (space === 'lch') {
    if (key === 'L' || key === 'C' || key === 'H') return String(round(val, 0))
  } else if (space === 'hsl' || space === 'hwb') {
    if (key === 'H') return String(round(val, 0))
    if (key === 'S' || key === 'L' || key === 'W' || key === 'B') return String(round(val, 0))
  } else if (space === 'srgb' || isRGBLike(space)) {
    if (key === 'R' || key === 'G' || key === 'B') return String(round(val, 0))
  }
  if (key === 'ALP') return String(round(val, 0))
  return String(round(val, 2))
}

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
    case 'oklch': return `oklch(${L}% ${C} ${H}${alphaToString(ALP)})`
    case 'lab':   return `lab(${L}% ${A} ${B}${alphaToString(ALP)})`
    case 'lch':   return `lch(${L}% ${C} ${H}${alphaToString(ALP)})`
    case 'hsl':   return `hsl(${H} ${S}% ${L}%${alphaToString(ALP)})`
    case 'hwb':   return `hwb(${H} ${W}% ${B}%${alphaToString(ALP)})`
    case 'srgb':  return `rgb(${R}% ${G}% ${B}%${alphaToString(ALP)})`
    default:
      if (isRGBLike(space)) return rgbColor(space, R, G, B, ALP)
      return DEFAULT_VALUE
  }
}

function parseIntoChannels(space: ColorSpace, colorStr: string) {
  const c = new Color(colorStr)
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
    ch.C = toFixed(cc, 2)
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
    ch.C = toFixed(cc)
    ch.H = toFixed(h)
    ch.ALP = toFixed(c.alpha * 100)
  } else if (s === 'hsl') {
    const [h, s2, l] = c.coords
    ch.H = toFixed(h)
    ch.S = toFixed(s2 * 100)
    ch.L = toFixed(l * 100)
    ch.ALP = toFixed(c.alpha * 100)
  } else if (s === 'hwb') {
    const [h, w, b] = c.coords
    ch.H = toFixed(h)
    ch.W = toFixed(w * 100)
    ch.B = toFixed(b * 100)
    ch.ALP = toFixed(c.alpha * 100)
  } else if (s === 'srgb') {
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

const template = document.createElement('template')
template.innerHTML = `
  <style>
    /* Design tokens and system colors */
    :host {
      /* System colors */
      --canvas: Canvas;
      --canvas-text: CanvasText;
      /* Radii */
      --radius-2: 0.5rem;
      --radius-3: 0.75rem;
      --radius-round: 9999px;
      /* Shadows */
      --shadow-elev: 0 10px 30px rgba(0,0,0,.18);
      --shadow-inner: inset 0 0 0 1px color-mix(in oklab, var(--canvas-text), transparent 94%);
      /* Checkerboard for alpha previews */
      --checker: repeating-conic-gradient(color-mix(in oklab, var(--canvas-text), transparent 90%) 0% 25%, transparent 0% 50%) 50%/1rem 1rem;
      color-scheme: light dark;
      display: inline-block;
      position: relative;
    }
    :host([hidden]) { display: none; }

    /* Trigger button */
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

    /* Panel */
    .panel {
      max-inline-size: min(92vw, 560px);
      background: var(--canvas);
      color: var(--canvas-text);
      box-shadow: var(--shadow-elev);
      border-radius: var(--radius-3);
      padding: 0;
      &[popover] { border: none; }
    }

    /* Preview area */
    .preview {
      position: relative;
      aspect-ratio: 16 / 9;
      display: grid;
      align-content: end;
      justify-items: start;
      padding: 0.75rem;
      gap: 0.5rem;
      box-shadow: var(--shadow-inner);
      background: linear-gradient(var(--value) 0 0), var(--checker);
      &:hover .copy-btn, &:focus-within .copy-btn { opacity: 1; }
      .copy-btn {
        position: absolute;
        top: .5rem;
        right: .5rem;
        /* Match info/gamut colors */
        background: color-mix(in oklab, var(--counter) 25%, transparent);
        color: var(--contrast);
        border: none;
        border-radius: 0;
        padding: 0;
        cursor: pointer;
        opacity: 0;
        transition: opacity .2s ease;
        display: inline-flex;
        align-items: center;
      }
      .copy-btn svg { display: block; }
    }

    /* Colorspace select + badges */
    .space {
      align-self: start;
      color: var(--contrast);
      padding: .25rem .5rem;
      border-radius: .4rem;
      border: 1px solid color-mix(in oklab, var(--canvas-text), transparent 70%);
      outline: none;
      background: transparent;
      &:is(:hover, :focus-visible) { background: color-mix(in oklab, var(--counter) 25%, transparent); }
    }

.gamut, .info {
      display: inline-flex;
      align-items: center;
      gap: .5rem;
      color: var(--contrast);
      /* No padding/radius; background only on hover/focus */
      background: transparent;
      &:is(:hover,:focus-visible) { background: color-mix(in oklab, var(--counter) 25%, transparent); }
    }
    .gamut { font-size: 12px; margin-block-start: .25rem; }

    /* Controls */
    .controls {
      display: grid;
      gap: 0.5rem;
      padding: 0.75rem;
      background: color-mix(in oklab, var(--canvas-text), var(--canvas) 94%);
      border-radius: 0 0 var(--radius-3) var(--radius-3);
      .control {
        display: grid;
        grid-template-columns: min-content 1fr minmax(6ch, 10ch);
        align-items: center;
        gap: 0.5rem;
        label { font: 500 12px/1.2 ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace; }
        /* Range slider base (contextual track images are inline via style attr) */
        input[type="number"] { width: 100%; font-size: 0.875rem; padding: .25rem .5rem; background: none; }
        input[type="range"] {
          width: 100%; height: 1rem; border-radius: 999px; background: var(--canvas); box-shadow: var(--shadow-inner); appearance: none;
        }
        /* Flattened pseudo-element selectors (no nesting) */
        .control input[type="range"].alpha { background: linear-gradient(to right, #0000, #000), var(--checker); }
        .control input[type="range"]::-webkit-slider-thumb {
          cursor: grab; appearance: none; border: 2px solid var(--canvas-text); background: var(--canvas);
          height: calc(1rem + 8px); aspect-ratio: 1; border-radius: var(--radius-round);
          box-shadow: 0 6px 16px rgba(0,0,0,.25), inset 0 1px 2px rgba(0,0,0,.15);
        }
        .control input[type="range"]:active::-webkit-slider-thumb { cursor: grabbing; }
        .control input[type="range"]::-moz-range-thumb {
          cursor: grab; appearance: none; border: 2px solid var(--canvas-text); background: var(--canvas);
          height: calc(1rem + 8px); aspect-ratio: 1; border-radius: var(--radius-round);
          box-shadow: 0 6px 16px rgba(0,0,0,.25), inset 0 1px 2px rgba(0,0,0,.15);
        }
        .control input[type="range"]:active::-moz-range-thumb { cursor: grabbing; }
        }
      }
    }
  </style>
  <button class="trigger" part="trigger" aria-haspopup="dialog">
    <span class="chip" part="chip"></span>
    <span class="label" part="label">Color</span>
  </button>
  <div class="panel" popover="auto" part="panel">
    <div class="preview">
      <button class="copy-btn" title="Copy color" aria-label="Copy color">
        <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 22q-.825 0-1.413-.588T3 20V6h2v14h11v2H5Zm4-4q-.825 0-1.413-.588T7 16V4q0-.825.588-1.413T9 2h9q.825 0 1.413.588T20 4v12q0 .825-.588 1.413T18 18H9Z"/></svg>
      </button>
      <select class="space" title="Colorspace"></select>
      <span class="gamut" part="gamut"></span>
      <output class="info" part="output"></output>
    </div>
    <div class="controls" part="controls"></div>
  </div>
  </div>
`

export class ColorInput extends HTMLElement {
  static get observedAttributes() { return ['value', 'colorspace', 'theme'] }

  // signals
  #value = signal<string>(DEFAULT_VALUE)
  #space = signal<ColorSpace>(DEFAULT_SPACE)
  #theme = signal<Theme>('auto')
  #open = signal(false)
  #anchor: Signal<HTMLElement | null> = signal(null)

  // derived
  #contrast = computed(() => contrastColor(this.#value.value))
  #gamut = computed(() => detectGamut(this.#value.value))

  get value() { return this.#value.value }
  set value(v: string) {
    if (typeof v !== 'string' || !v) return
    try {
      const parsed = new Color(v)
      const sid = reverseColorJSSpaceID(parsed.space.id) as string
      this.#space.value = (sid === 'rgb' ? 'srgb' : (sid as ColorSpace))
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
    // convert current value to target space to preserve color (high precision)
    try {
      const current = new Color(this.#value.value)
      const converted = current.to(getColorJSSpaceID(next)).toGamut()
      this.#value.value = converted.toString({ precision: 12 })
      this.setAttribute('value', this.#value.value)
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
    const a = anchor ?? this.#anchor.value ?? this.#internalTrigger
    if (a) this.#positionPanel(a)
    this.#panel?.showPopover?.();
    this.#startReposition()
  }
  close() { this.#panel?.hidePopover?.(); this.#stopReposition() }
  // HTMLInputElement.showPicker() alignment for custom element consumers
  showPicker() { this.show() }

  setAnchor(el: HTMLElement | null) { this.#anchor.value = el }
  set setColor(v: string) { this.value = v }
  set setAnchorElement(el: HTMLElement | null) { this.setAnchor(el) }

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
    if (copyBtn) {
      copyBtn.addEventListener('click', async () => {
        try { await navigator.clipboard.writeText(this.#value.value) } catch {}
      })
    }

    // init space options
    this.#spaceSelect.innerHTML = `
      <optgroup label="Standard">
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
      const isOpen = (el.matches?.(':popover-open') ?? false) || !el.hasAttribute('hidden')
      this.#open.value = isOpen
      if (isOpen) {
        const a = this.#anchor.value ?? this.#lastInvoker ?? this.#internalTrigger
        if (a) this.#positionPanel(a)
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

    // Effects
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
        this.#value.value = value
        this.#space.value = (sid === 'rgb' ? 'srgb' : (sid as ColorSpace))
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
    const detail: ChangeDetail = { value: this.#value.value, colorspace: this.#space.value }
    this.dispatchEvent(new CustomEvent<ChangeDetail>('change', { detail, bubbles: true }))
  }

  #startReposition() {
    const fn = () => {
      const a = this.#anchor.value ?? this.#lastInvoker ?? this.#internalTrigger
      if (a) this.#positionPanel(a)
    }
    this.#onReposition = fn
    window.addEventListener('resize', fn)
    window.addEventListener('scroll', fn, true)
  }
  #stopReposition() {
    if (!this.#onReposition) return
    window.removeEventListener('resize', this.#onReposition)
    window.removeEventListener('scroll', this.#onReposition, true)
    this.#onReposition = undefined
  }
  #onReposition?: () => void

  #positionPanel(anchorEl: HTMLElement) {
    if (!this.#panel) return
    const rect = anchorEl.getBoundingClientRect()
    const panel = this.#panel as HTMLElement
    const margin = 8
    const vw = window.innerWidth
    const vh = window.innerHeight
    // ensure measured size
    const w = panel.offsetWidth || 320
    const h = panel.offsetHeight || 240
    let left = Math.min(Math.max(rect.left + rect.width / 2 - w / 2, margin), vw - w - margin)
    let top = rect.bottom + margin
    if (top + h + margin > vh && rect.top - h - margin >= margin) {
      top = rect.top - h - margin
    }
    panel.style.position = 'fixed'
    panel.style.left = `${left}px`
    panel.style.top = `${top}px`
  }

  #renderControls() {
    const space = this.#space.value
    if (!this.#controls) return
    const current = parseIntoChannels(space, this.#value.value)
    const ch = current.ch

    const make = (label: string, key: string, min: number, max: number, step = 1, bg?: string) => {
      const wrapHue = key === 'H'
      const group = document.createElement('div')
      group.className = 'control'
      const lab = document.createElement('label')
      lab.textContent = label
      const range = document.createElement('input')
      range.type = 'range'
      range.min = String(min)
      range.max = String(max)
      range.step = String(step)
      if (bg) range.style.backgroundImage = bg
      range.value = String(ch[key] ?? 0)
      if (key === 'ALP') range.classList.add('alpha')
      const num = document.createElement('input')
      num.type = 'number'
      num.min = String(min)
      num.max = String(max)
      num.step = String(step)
      num.value = String(ch[key] ?? 0)

      const apply = () => {
        const next = gencolor(space, ch)
        this.#value.value = next
        this.setAttribute('value', next)
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
        // keep controls in sync
        range.value = String(ch[key])
        num.value = String(ch[key])
        apply()
      }

      range.addEventListener('input', onInput)
      num.addEventListener('input', onInput)
      group.append(lab, range, num)
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
    } else if (space === 'oklch') {
      this.#controls.append(
        make('L', 'L', 0, 100, 1, 'linear-gradient(in oklab to right, black, white)'),
        make('C', 'C', 0, 0.5, 0.01),
        make('H', 'H', 0, 360, 1, `linear-gradient(to right in oklch longer hue, oklch(95% ${ch.C ?? 0} 0), oklch(95% ${ch.C ?? 0} 0))`),
        make('A', 'ALP', 0, 100, 1)
      )
    } else if (space === 'lab') {
      this.#controls.append(
        make('L', 'L', 0, 100, 1, 'linear-gradient(in lab to right, black, white)'),
        make('A', 'A', -160, 160, 1, 'linear-gradient(to right in oklab, lab(85% -100 100), lab(55% 100 100))'),
        make('B', 'B', -160, 160, 1, 'linear-gradient(to right in oklab, lab(31% 70 -120), lab(96% 0 120))'),
        make('A', 'ALP', 0, 100, 1)
      )
    } else if (space === 'lch') {
      this.#controls.append(
        make('L', 'L', 0, 100, 1, 'linear-gradient(in lab to right, black, white)'),
        make('C', 'C', 0, 230, 1),
        make('H', 'H', 0, 360, 1, `linear-gradient(to right in lch longer hue, lch(95% ${ch.C ?? 0} 0), lch(95% ${ch.C ?? 0} 0))`),
        make('A', 'ALP', 0, 100, 1)
      )
    } else if (space === 'hsl') {
      this.#controls.append(
        make('H', 'H', 0, 360, 1, `linear-gradient(to right in hsl longer hue, hsl(0 ${ch.S ?? 0}% 50%), hsl(0 ${ch.S ?? 0}% 50%))`),
        make('S', 'S', 0, 100, 1, `linear-gradient(to right in oklab, hsl(${ch.H ?? 0} 0% ${ch.L ?? 0}%), hsl(${ch.H ?? 0} 100% ${ch.L ?? 0}%))`),
        make('L', 'L', 0, 100, 1, `linear-gradient(to right in oklab, hsl(${ch.H ?? 0} ${ch.S ?? 0}% 0%), hsl(${ch.H ?? 0} ${ch.S ?? 0}% 100%))`),
        make('A', 'ALP', 0, 100, 1)
      )
    } else if (space === 'hwb') {
      this.#controls.append(
        make('H', 'H', 0, 360, 1, 'linear-gradient(to right in hsl longer hue, red, red)'),
        make('W', 'W', 0, 100, 1, 'linear-gradient(to right in oklab, #fff0, #fff)'),
        make('B', 'B', 0, 100, 1, 'linear-gradient(to right in oklab, #0000, #000)'),
        make('A', 'ALP', 0, 100, 1)
      )
    } else if (space === 'srgb') {
      this.#controls.append(
        make('R', 'R', 0, 100, 1, 'linear-gradient(to right in oklab, #f000, #f00)'),
        make('G', 'G', 0, 100, 1, 'linear-gradient(to right in oklab, #0f00, #0f0)'),
        make('B', 'B', 0, 100, 1, 'linear-gradient(to right in oklab, #00f0, #00f)'),
        make('A', 'ALP', 0, 100, 1)
      )
    } else if (isRGBLike(space)) {
      this.#controls.append(
        make('R', 'R', 0, 100, 1, 'linear-gradient(to right in oklab, #f000, #f00)'),
        make('G', 'G', 0, 100, 1, 'linear-gradient(to right in oklab, #0f00, #0f0)'),
        make('B', 'B', 0, 100, 1, 'linear-gradient(to right in oklab, #00f0, #00f)'),
        make('A', 'ALP', 0, 100, 1)
      )
    }
  }
}

customElements.define('color-input', ColorInput)

declare global {
  interface HTMLElementTagNameMap { 'color-input': ColorInput }
}
