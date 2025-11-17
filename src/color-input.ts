import { signal, computed, effect, Signal } from '@preact/signals-core'
import Color from 'colorjs.io'
import {
  alphaToString,
  contrastColor,
  detectGamut,
  getColorJSSpaceID,
  isRGBLike,
  rgbColor,
  reverseColorJSSpaceID,
  type Theme,
  type ColorSpace
} from './color'
import { formatChannel } from './utils/channel-formatting'
import { gencolor, parseIntoChannels } from './utils/color-conversion'
import {
  computeCandidates,
  findFirstFitOrMaxArea,
  getSafeAreaInsets,
  getScrollParents,
  getViewportClampRect,
  type Placement,
  type Rect,
  type Size
} from './utils/positioning'
import { createTemplate } from './utils/template'
// @ts-ignore
import styles from './styles/index.css?inline'

export type { Theme, ColorSpace }
export interface ChangeDetail { value: string; colorspace: ColorSpace; gamut: string }

const DEFAULT_VALUE = 'oklch(75% 75% 180)'
const DEFAULT_SPACE: ColorSpace = 'oklch'

// Create shared stylesheet for all component instances
const sheet = new CSSStyleSheet()
// Only call replaceSync if it exists (not available in jsdom)
if (typeof sheet.replaceSync === 'function') {
  sheet.replaceSync(styles)
}

export class ColorInput extends HTMLElement {
  static get observedAttributes() { return ['value', 'colorspace', 'theme'] }

  // ──────────────────────────────────────────────────────────────────────────────
  // State: Reactive signals (Preact Signals Core)
  // ──────────────────────────────────────────────────────────────────────────────
  #value = signal<string>(DEFAULT_VALUE)
  #space = signal<ColorSpace>(DEFAULT_SPACE)
  #theme = signal<Theme>('auto')
  #open = signal(false)
  #anchor: Signal<HTMLElement | null> = signal(null)
  #error = signal<string | null>(null)

  #contrast = computed(() => contrastColor(this.#value.value))
  #gamut = computed(() => detectGamut(this.#value.value))

  #previewEffectCleanup: ReturnType<typeof effect> | null = null
  #colorSchemeEffectCleanup: ReturnType<typeof effect> | null = null
  #errorEffectCleanup: ReturnType<typeof effect> | null = null
  #controlsEffectCleanup: ReturnType<typeof effect> | null = null

  get value() { return this.#value.value }
  set value(v: string) {
    if (typeof v !== 'string' || !v) return
    try {
      const parsed = new Color(v)
      const sid = reverseColorJSSpaceID(parsed.space.id) as string
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
    try {
      const current = new Color(this.#value.value)
      const targetSpace = next === 'hex' ? 'srgb' : next
      const converted = current.to(getColorJSSpaceID(targetSpace)).toGamut()
      const tempStr = converted.toString({ precision: 12 })
      const parsed = parseIntoChannels(next, tempStr)
      const newValue = gencolor(next, parsed.ch)
      this.#value.value = newValue
      this.setAttribute('value', newValue)
      this.#emitChange()
    } catch {}
    // Re-render controls for new colorspace
    if (this.#controls) this.#renderControls()
  }

  get theme() { return this.#theme.value }
  set theme(t: Theme | string) {
    const next: Theme = (t === 'light' || t === 'dark') ? t : 'auto'
    this.#theme.value = next
    if (next === 'auto') this.removeAttribute('theme')
    else this.setAttribute('theme', next)
  }

  get gamut() { return this.#gamut.value }
  get contrastColor() { return this.#contrast.value }

  show(anchor?: HTMLElement | null) {
    if (anchor) this.#anchor.value = anchor
    this.#panel?.showPopover?.();
    this.#startReposition()
  }
  close() { this.#panel?.hidePopover?.(); this.#stopReposition() }
  showPicker() { this.show() }

  setAnchor(el: HTMLElement | null) { this.#anchor.value = el }
  set setColor(v: string) { this.value = v }
  set setAnchorElement(el: HTMLElement | null) { this.setAnchor(el) }

  // ──────────────────────────────────────────────────────────────────────────────
  // DOM references
  // ──────────────────────────────────────────────────────────────────────────────
  #root: ShadowRoot
  #panel?: HTMLElement & { showPopover?: () => void; hidePopover?: () => void }
  #controls?: HTMLElement
  #spaceSelect?: HTMLSelectElement
  #output?: HTMLOutputElement
  #chip?: HTMLElement
  #internalTrigger?: HTMLButtonElement
  #textInput?: HTMLInputElement
  #errorMessage?: HTMLElement
  #lastInvoker: HTMLElement | null = null

  constructor() {
    super()
    this.#root = this.attachShadow({ mode: 'open', delegatesFocus: true })

    // Adopt shared stylesheet if supported, otherwise inject inline styles
    if ('adoptedStyleSheets' in this.#root && typeof sheet.replaceSync === 'function') {
      this.#root.adoptedStyleSheets = [sheet]
    } else {
      // Fallback for environments without adoptedStyleSheets support (e.g., jsdom)
      const styleEl = document.createElement('style')
      styleEl.textContent = styles
      this.#root.appendChild(styleEl)
    }

    // Add template content
    const template = createTemplate()
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
    this.#textInput = this.#root.querySelector('.text-input') as HTMLInputElement
    this.#errorMessage = this.#root.querySelector('.error-message') as HTMLElement

    // Copy to clipboard
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

    // Init space options
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

    if (btn) btn.addEventListener('click', () => this.show(btn))

    // Text input validation
    if (this.#textInput) {
      this.#textInput.value = this.#value.value

      this.#textInput.addEventListener('input', (e) => {
        const inputValue = (e.target as HTMLInputElement).value
        this.#validateAndSetColor(inputValue)
      })

      this.#textInput.addEventListener('paste', (e) => {
        // Allow default paste, then validate via input event
      })
    }

    // Command API handler
    this.addEventListener('command', (ev: Event) => {
      const command = (ev as any).command as string | undefined
      if (!command) return
      const possibleInvoker = (ev as any).source || (ev as any).invoker || (document.activeElement instanceof HTMLElement ? document.activeElement : null)
      if (possibleInvoker) { this.#lastInvoker = possibleInvoker; this.setAnchor(possibleInvoker) }
      if (command === 'show-popover' || command === 'show') this.show(this.#lastInvoker)
      else if (command === 'hide-popover' || command === 'close') this.close()
      else if (command === 'toggle-popover' || command === 'toggle') {
        if (this.#open.value) this.close(); else this.show(this.#lastInvoker)
      }
    })

    this.#panel?.addEventListener('toggle', () => {
      const el = this.#panel as HTMLElement
      let isOpen = false
      try {
        isOpen = el.matches?.(':popover-open') ?? false
      } catch {}
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

    // Reactive effects
    this.#previewEffectCleanup = effect(() => {
      const v = this.#value.value
      const gamut = this.#gamut.value
      const contrast = this.#contrast.value
      if (this.#output) this.#output.value = v
      if (this.#chip) this.#chip.style.setProperty('--value', v)
      if (this.#textInput && this.#textInput.value !== v) {
        this.#textInput.value = v
      }
      this.style.setProperty('--contrast', contrast)
      this.style.setProperty('--counter', contrast === 'white' ? 'black' : 'white')
      const gamutEl = this.#root.querySelector('.gamut') as HTMLElement
      if (gamutEl) gamutEl.textContent = gamut
      const preview = this.#root.querySelector('.preview') as HTMLElement
      if (preview) preview.style.setProperty('--value', v)
    })

    this.#errorEffectCleanup = effect(() => {
      const error = this.#error.value
      if (error) {
        this.setAttribute('data-error', '')
        if (this.#errorMessage) this.#errorMessage.textContent = error
        if (this.#textInput) this.#textInput.setAttribute('aria-invalid', 'true')
      } else {
        this.removeAttribute('data-error')
        if (this.#errorMessage) this.#errorMessage.textContent = ''
        if (this.#textInput) this.#textInput.setAttribute('aria-invalid', 'false')
      }
    })

    this.#colorSchemeEffectCleanup = effect(() => {
      const theme = this.#theme.value
      const colorScheme = theme === 'auto' ? 'light dark' : theme
      this.style.setProperty('color-scheme', colorScheme)
    })

    // Defaults
    if (!this.hasAttribute('value')) this.setAttribute('value', DEFAULT_VALUE)
    if (!this.hasAttribute('colorspace')) {
      // If we have a value attribute, the colorspace was already detected in attributeChangedCallback
      // So we should sync the attribute with the detected internal space value
      this.setAttribute('colorspace', this.#space.value)
    }

    this.#spaceSelect.value = this.#space.value
    this.#renderControls()
  }

  disconnectedCallback() {
    if (this.#colorSchemeEffectCleanup) this.#colorSchemeEffectCleanup()
    if (this.#previewEffectCleanup) this.#previewEffectCleanup()
    if (this.#errorEffectCleanup) this.#errorEffectCleanup()
  }

  attributeChangedCallback(name: string, _old: string | null, value: string | null) {
    if (value === _old) return
    if (name === 'value' && typeof value === 'string') {
      try {
        const parsed = new Color(value)
        const sid = reverseColorJSSpaceID(parsed.space.id) as string
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

  #validateAndSetColor(inputValue: string) {
    if (!inputValue || !inputValue.trim()) {
      this.#error.value = 'Invalid color format'
      return
    }

    try {
      const parsed = new Color(inputValue)
      const sid = reverseColorJSSpaceID(parsed.space.id) as string
      const isHex = typeof inputValue === 'string' && inputValue.trim().startsWith('#')

      // Clear error on success
      this.#error.value = null

      // Update value and colorspace
      this.#space.value = isHex ? 'hex' : (sid === 'rgb' ? 'srgb' : (sid as ColorSpace))
      this.#value.value = inputValue
      this.setAttribute('value', inputValue)
      this.setAttribute('colorspace', this.#space.value)
      if (this.#spaceSelect) this.#spaceSelect.value = this.#space.value
      this.#emitChange()
    } catch (error) {
      this.#error.value = 'Invalid color format'
    }
  }

  // ──────────────────────────────────────────────────────────────────────────────
  // Positioning system
  // ──────────────────────────────────────────────────────────────────────────────
  #lastPlacement: Placement | null = null
  #lastPanelSize: Size | null = null
  #cleanup: Array<() => void> = []
  #rafId: number | null = null

  #startReposition() {
    if (this.#cleanup.length) return
    this.#scheduleReposition()

    const anchor = this.#anchor.value ?? this.#lastInvoker ?? this.#internalTrigger
    if (!anchor || !this.#panel) return

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

    if (window.visualViewport) {
      const onVV = () => this.#scheduleReposition()
      window.visualViewport.addEventListener('resize', onVV)
      window.visualViewport.addEventListener('scroll', onVV)
      this.#cleanup.push(() => {
        window.visualViewport?.removeEventListener('resize', onVV)
        window.visualViewport?.removeEventListener('scroll', onVV)
      })
    }

    const scrollParents = getScrollParents(anchor)
    scrollParents.forEach((sp) => {
      const onScroll = () => this.#scheduleReposition()
      sp.addEventListener('scroll', onScroll, { passive: true })
      this.#cleanup.push(() => sp.removeEventListener('scroll', onScroll))
    })

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

    const anchorRect = this.#getAnchorRect()
    const insets = getSafeAreaInsets()
    const viewport = getViewportClampRect(insets)
    const size = this.#measurePanel(panel)

    const candidates = computeCandidates(anchorRect, size)
    const pick = findFirstFitOrMaxArea(candidates, viewport, this.#lastPlacement)
    this.#lastPlacement = pick.placement

    const left = Math.round(Math.min(Math.max(pick.left, viewport.left), viewport.right - size.width))
    const top = Math.round(Math.min(Math.max(pick.top, viewport.top), viewport.bottom - size.height))

    const maxPanelHeight = viewport.bottom - viewport.top
    if (size.height > maxPanelHeight) {
      panel.style.maxHeight = `${maxPanelHeight}px`
      panel.style.overflow = 'auto'
    } else if (panel.style.maxHeight) {
      panel.style.maxHeight = ''
      panel.style.overflow = ''
    }

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

    return this.#lastPanelSize ?? { width: 560, height: 400 }
  }

  // ──────────────────────────────────────────────────────────────────────────────
  // Control rendering
  // ──────────────────────────────────────────────────────────────────────────────
  #renderControls() {
    if (this.#controlsEffectCleanup) this.#controlsEffectCleanup()
    const space = this.#space.value
    if (!this.#controls) return
    const current = parseIntoChannels(space, this.#value.value)
    const ch = current.ch

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
        try {
          const c0 = gencolor(space, { ...ch, ALP: '0' })
          const c1 = gencolor(space, { ...ch, ALP: '100' })
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
      const alphaRange = this.#controls.querySelector<HTMLInputElement>('input[type="range"].ch-alp')
      this.#controlsEffectCleanup = effect(() => {
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
        make('C', 'C', 0, 100, 1, `linear-gradient(in oklch to right, oklch(${ch.L ?? 0}% 1% ${ch.H ?? 0}), oklch(${ch.L ?? 0}% 100% ${ch.H ?? 0}))`),
        make('H', 'H', 0, 359, 1, 'linear-gradient(to right in oklch longer hue, oklch(90% 75% 0), oklch(90% 75% 0))'),
        make('A', 'ALP', 0, 100, 1)
      )
      const cRange = this.#controls.querySelector<HTMLInputElement>('input[type="range"].ch-c')
      const alphaRange = this.#controls.querySelector<HTMLInputElement>('input[type="range"].ch-alp')
      this.#controlsEffectCleanup = effect(() => {
        const L = channelSignals.L.value || '0'
        const C = channelSignals.C.value || '0'
        const H = channelSignals.H.value || '0'
        if (cRange) {
          cRange.style.backgroundImage = `linear-gradient(in oklch to right, oklch(${L}% 1% ${H}deg), oklch(${L}% 100% ${H}deg))`
        }
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
      const alphaRange = this.#controls.querySelector<HTMLInputElement>('input[type="range"].ch-alp')
      this.#controlsEffectCleanup = effect(() => {
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
        make('C', 'C', 0, 100, 1, `linear-gradient(in lch to right, lch(${ch.L ?? 0}% 1% ${ch.H ?? 0}), lch(${ch.L ?? 0}% 100% ${ch.H ?? 0}))`),
        make('H', 'H', 0, 359, 1, 'linear-gradient(to right in lch longer hue, lch(90% 75% 0), lch(90% 75% 0))'),
        make('A', 'ALP', 0, 100, 1)
      )
      const cRange = this.#controls.querySelector<HTMLInputElement>('input[type="range"].ch-c')
      const alphaRange = this.#controls.querySelector<HTMLInputElement>('input[type="range"].ch-alp')
      this.#controlsEffectCleanup = effect(() => {
        const L = channelSignals.L.value || '50'
        const C = channelSignals.C.value || '0'
        const H = channelSignals.H.value || '0'
        if (cRange) {
          cRange.style.backgroundImage = `linear-gradient(in lch to right, lch(${L}% 1% ${H}), lch(${L}% 100% ${H}))`
        }
        if (alphaRange) {
          alphaRange.style.background = `linear-gradient(to right in lch, lch(${L}% ${C}% ${H} / 0%), lch(${L}% ${C}% ${H} / 100%)), var(--checker)`
        }
      })
    } else if (space === 'hsl') {
      this.#controls.append(
        make('H', 'H', 0, 359, 1, 'linear-gradient(to right in hsl longer hue, hsl(0 100% 50%), hsl(360 100% 50%))'),
        make('S', 'S', 0, 100, 1, `linear-gradient(in hsl to right, hsl(${ch.H ?? 0} 0% ${ch.L ?? 50}% / 100%), hsl(${ch.H ?? 0} 100% ${ch.L ?? 50}% / 100%))`),
        make('L', 'L', 0, 100, 1, `linear-gradient(in oklab to right, hsl(${ch.H ?? 0} ${ch.S ?? 100}% 0%), hsl(${ch.H ?? 0} ${ch.S ?? 100}% 100%))`),
        make('A', 'ALP', 0, 100, 1)
      )
      const sRange = this.#controls.querySelector<HTMLInputElement>('input[type="range"].ch-s')
      const lRange = this.#controls.querySelector<HTMLInputElement>('input[type="range"].ch-l')
      const alphaRange = this.#controls.querySelector<HTMLInputElement>('input[type="range"].ch-alp')
      this.#controlsEffectCleanup = effect(() => {
        const H = channelSignals.H.value || '0'
        const S = channelSignals.S.value || '100'
        const L = channelSignals.L.value || '50'
        if (sRange) {
          sRange.style.backgroundImage = `linear-gradient(in hsl to right, hsl(${H} 0% ${L}% / 100%), hsl(${H} 100% ${L}% / 100%))`
        }
        if (lRange) {
          lRange.style.backgroundImage = `linear-gradient(in oklab to right, hsl(${H} ${S}% 0%), hsl(${H} ${S}% 100%))`
        }
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
      const alphaRange = this.#controls.querySelector<HTMLInputElement>('input[type="range"].ch-alp')
      this.#controlsEffectCleanup = effect(() => {
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
      const alphaRange = this.#controls.querySelector<HTMLInputElement>('input[type="range"].ch-alp')
      this.#controlsEffectCleanup = effect(() => {
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
      const alphaRange = this.#controls.querySelector<HTMLInputElement>('input[type="range"].ch-alp')
      this.#controlsEffectCleanup = effect(() => {
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
