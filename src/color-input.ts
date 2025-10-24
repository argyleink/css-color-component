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

function gencolor(space: ColorSpace, ch: Record<string, string | number>) {
  switch (space) {
    case 'oklab': return `oklab(${ch.L}% ${ch.A} ${ch.B}${alphaToString(ch.ALP)})`
    case 'oklch': return `oklch(${ch.L}% ${ch.C} ${ch.H}${alphaToString(ch.ALP)})`
    case 'lab':   return `lab(${ch.L}% ${ch.A} ${ch.B}${alphaToString(ch.ALP)})`
    case 'lch':   return `lch(${ch.L}% ${ch.C} ${ch.H}${alphaToString(ch.ALP)})`
    case 'hsl':   return `hsl(${ch.H} ${ch.S}% ${ch.L}%${alphaToString(ch.ALP)})`
    case 'hwb':   return `hwb(${ch.H} ${ch.W}% ${ch.B}%${alphaToString(ch.ALP)})`
    case 'srgb':  return `rgb(${ch.R}% ${ch.G}% ${ch.B}%${alphaToString(ch.ALP)})`
    default:
      if (isRGBLike(space)) return rgbColor(space, ch.R, ch.G, ch.B, ch.ALP)
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
    :host { display: inline-block; position: relative; }
    :host([hidden]) { display: none; }
    button.trigger { all: unset; cursor: pointer; padding: var(--size-2, 8px) var(--size-3, 12px); border-radius: var(--radius-2, 8px); background: var(--surface-2, #f5f5f5); box-shadow: var(--inner-shadow-0, inset 0 0 0 1px #0001); }
    .chip { inline-size: 1.25rem; block-size: 1.25rem; border-radius: 999px; box-shadow: inset 0 0 0 1px #0002; margin-inline-end: .5rem; background: linear-gradient(var(--value) 0 0), repeating-conic-gradient(#0000001a 0% 25%, transparent 0% 50%) 50%/1rem 1rem; }
    .label { font: 600 14px/1.1 system-ui, -apple-system, Segoe UI, Roboto, sans-serif; }

    .panel { max-inline-size: min(92vw, 560px); background: var(--surface-1, #fff); color: var(--text-1, #111); border-radius: var(--radius-3, 12px); box-shadow: var(--shadow-5, 0 10px 30px #00000030); padding: 12px; }
    .panel[popover] { border: none; }

    .preview { aspect-ratio: 16 / 9; display: grid; grid-template-rows: 1fr auto auto; align-content: end; justify-items: start; padding: 12px; box-shadow: var(--inner-shadow-0, inset 0 0 0 1px #0001); background: linear-gradient(var(--value) 0 0), repeating-conic-gradient(#0000001a 0% 25%, transparent 0% 50%) 50%/1rem 1rem; }
    .info { display: inline-flex; align-items: center; gap: .5rem; color: var(--contrast, #000); background: var(--counter, #fff); padding: 4px 8px; border-radius: 999px; }

    .controls { display: grid; gap: 8px; padding: 12px; background: var(--surface-2, #f8f8f8); border-radius: 10px; margin-block-start: 12px; }
    .control { display: grid; grid-template-columns: min-content 1fr minmax(60px, 80px); align-items: center; gap: 8px; }
    .control label { font: 500 12px/1.2 system-ui; }
    .control input[type="range"] { width: 100%; height: 1rem; border-radius: 999px; background: var(--surface-1, #fff); box-shadow: var(--inner-shadow-0, inset 0 0 0 1px #0001); appearance: none; }
    .control input[type="number"] { width: 100%; }

    :host([theme="dark"]) .panel { background: #161616; color: #efefef; }
    :host([theme="dark"]) .controls { background: #1f1f1f; }
  </style>
  <button class="trigger" part="trigger" aria-haspopup="dialog">
    <span class="chip" part="chip"></span>
    <span class="label" part="label">Color</span>
  </button>
  <div class="panel" popover="auto" part="panel">
    <div class="preview">
      <div class="badges" part="badges">
        <span class="gamut" part="gamut"></span>
      </div>
      <output class="info" part="output"></output>
    </div>
    <div class="toolbar">
      <select class="space" title="Colorspace"></select>
    </div>
    <div class="controls" part="controls"></div>
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
    // convert current value to target space to preserve color
    try {
      const current = new Color(this.#value.value)
      const converted = current.to(getColorJSSpaceID(next)).toGamut()
      this.#value.value = converted.toString({ precision: 5 })
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
  show() { this.#panel?.showPopover?.(); }
  close() { this.#panel?.hidePopover?.(); }
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

  constructor() {
    super()
    this.#root = this.attachShadow({ mode: 'open' })
    this.#root.appendChild(template.content.cloneNode(true))
  }

  connectedCallback() {
    const btn = this.#root.querySelector<HTMLButtonElement>('button.trigger')!
    this.#panel = this.#root.querySelector('.panel') as any
    this.#controls = this.#root.querySelector('.controls') as HTMLElement
    this.#spaceSelect = this.#root.querySelector('.space') as HTMLSelectElement
    this.#output = this.#root.querySelector('output.info') as HTMLOutputElement
    this.#chip = this.#root.querySelector('.chip') as HTMLElement

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
    btn.addEventListener('click', () => this.show())

    // Invoker Commands API: respond to command events addressed to the host
    this.addEventListener('command', (ev: Event) => {
      const command = (ev as any).command as string | undefined
      if (!command) return
      if (command === 'show-popover' || command === 'show') this.show()
      else if (command === 'hide-popover' || command === 'close') this.close()
      else if (command === 'toggle-popover' || command === 'toggle') {
        if (this.#open.value) this.close(); else this.show()
      }
    })

    this.#panel?.addEventListener('toggle', () => {
      // Prefer native :popover-open; fall back to !hidden for polyfills
      const el = this.#panel as HTMLElement
      const isOpen = (el.matches?.(':popover-open') ?? false) || !el.hasAttribute('hidden')
      this.#open.value = isOpen
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

  #renderControls() {
    const space = this.#space.value
    if (!this.#controls) return
    const current = parseIntoChannels(space, this.#value.value)
    const ch = current.ch

    const make = (label: string, key: string, min: number, max: number, step = 1, bg?: string) => {
      const wrapHue = key === 'H'
      const onInput = (ev: Event) => {
        const target = ev.target as HTMLInputElement
        let val = target.type === 'number' ? Number(target.value) : Number(target.value)
        if (!Number.isFinite(val)) return
        if (wrapHue) {
          val = ((val % 360) + 360) % 360
        } else {
          val = Math.max(min, Math.min(max, val))
        }
        ch[key] = val.toString()
        const next = gencolor(space, ch)
        this.#value.value = next
        this.setAttribute('value', next)
        this.#emitChange()
      }
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
      const num = document.createElement('input')
      num.type = 'number'
      num.min = String(min)
      num.max = String(max)
      num.step = String(step)
      num.value = String(ch[key] ?? 0)
      range.addEventListener('input', onInput)
      num.addEventListener('change', onInput)
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
        make('H', 'H', 0, 360, 1, `linear-gradient(to right in oklch longer hue, oklch(95% ${ch.C} 0), oklch(95% ${ch.C} 0))`),
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
        make('H', 'H', 0, 360, 1, `linear-gradient(to right in lch longer hue, lch(95% ${ch.C} 0), lch(95% ${ch.C} 0))`),
        make('A', 'ALP', 0, 100, 1)
      )
    } else if (space === 'hsl') {
      this.#controls.append(
        make('H', 'H', 0, 360, 1, `linear-gradient(to right in hsl longer hue, hsl(0 ${ch.S}% 50%), hsl(0 ${ch.S}% 50%))`),
        make('S', 'S', 0, 100, 1, `linear-gradient(to right in oklab, hsl(${ch.H} 0% ${ch.L}%), hsl(${ch.H} 100% ${ch.L}%))`),
        make('L', 'L', 0, 100, 1, `linear-gradient(to right in oklab, hsl(${ch.H} ${ch.S}% 0%), hsl(${ch.H} ${ch.S}% 100%))`),
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
