import { signal, computed, effect, Signal } from '@preact/signals-core'
import { parse, serialize, to, toGamut, contrast as contrastFn } from 'colorjs.io/fn'
import {
  DEFAULT_COLOR_SPACES,
  contrastColor,
  detectGamut,
  getColorJSSpaceID,
  isValidColorSpace,
  isRGBLike,
  reverseColorJSSpaceID,
  type Theme,
  type ColorSpace
} from './color'
import { AreaPicker } from './area-picker'
import { formatChannel } from './utils/channel-formatting'
import { gencolor, parseIntoChannels } from './utils/color-conversion'
import {
  computeCandidates,
  findFirstFitOrMaxArea,
  getSafeAreaInsets,
  getScrollParents,
  getViewportClampRect,
  GUTTER,
  type Placement,
  type Rect,
  type Size
} from './utils/positioning'
import { createTemplate } from './utils/template'
// @ts-ignore
import styles from './styles/index.css?inline'

export type { Theme, ColorSpace }
export interface ChangeDetail { value: string; colorspace: string; gamut: string }

const supportsAnchor = CSS.supports?.('anchor-name: --a') ?? false

const DEFAULT_VALUE = 'oklch(75% 75% 180)'
const DEFAULT_SPACE: ColorSpace = 'oklch'
const SPACE_GROUPS = [
  { label: 'Standard', spaces: ['hex', 'srgb', 'srgb-linear', 'hsl', 'hwb'] },
  { label: 'HDR', spaces: ['display-p3', 'a98-rgb'] },
  { label: 'Ultra HDR', spaces: ['lab', 'lch', 'oklch', 'oklab', 'rec2020', 'prophoto', 'xyz', 'xyz-d50', 'xyz-d65'] }
]

// Create shared stylesheet for all component instances
const sheet = new CSSStyleSheet()
// Only call replaceSync if it exists (not available in jsdom)
if (typeof sheet.replaceSync === 'function') {
  sheet.replaceSync(styles)
}

export class ColorInput extends HTMLElement {
  static get observedAttributes() { return ['value', 'colorspace', 'color-spaces', 'theme', 'no-alpha'] }

  // ──────────────────────────────────────────────────────────────────────────────
  // State: Reactive signals (Preact Signals Core)
  // ──────────────────────────────────────────────────────────────────────────────
  #value = signal<string>(DEFAULT_VALUE)
  #space = signal<string>(DEFAULT_SPACE)
  #theme = signal<Theme>('auto')
  #open = signal(false)
  #anchor: Signal<HTMLElement | null> = signal(null)
  #error = signal<string | null>(null)
  #noAlpha = signal(false)
  #allowedSpaces = [...DEFAULT_COLOR_SPACES]

  #contrast = computed(() => contrastColor(this.#value.value))
  #gamut = computed(() => detectGamut(this.#value.value))

  #previewEffectCleanup: ReturnType<typeof effect> | null = null
  #colorSchemeEffectCleanup: ReturnType<typeof effect> | null = null
  #errorEffectCleanup: ReturnType<typeof effect> | null = null
  #controlsEffectCleanup: ReturnType<typeof effect> | null = null
  #areaPickerEffectCleanup: ReturnType<typeof effect> | null = null
  #areaPicker?: AreaPicker
  #programmaticUpdate = false

  get value() { return this.#value.value }
  set value(v: string) {
    if (typeof v !== 'string' || !v) return
    try {
      this.#applyValue(v)
    } catch { }
  }

  get colorspace() { return this.#space.value }
  set colorspace(s: ColorSpace | string) {
    this.#applyColorspace(s)
  }

  get colorSpaces() { return [...this.#allowedSpaces] }
  set colorSpaces(spaces: string[] | string) {
    const next = this.#parseColorSpacesAttribute(Array.isArray(spaces) ? spaces.join(' ') : spaces)
    this.#allowedSpaces = next
    this.#withProgrammaticUpdate(() => {
      this.setAttribute('color-spaces', next.join(' '))
    })
    this.#renderSpaceOptions()
    this.#syncAllowedSpace()
  }

  get theme() { return this.#theme.value }
  set theme(t: Theme | string) {
    const next: Theme = (t === 'light' || t === 'dark') ? t : 'auto'
    this.#theme.value = next
    if (next === 'auto') this.removeAttribute('theme')
    else this.setAttribute('theme', next)
  }

  get noAlpha() { return this.#noAlpha.value }
  set noAlpha(v: boolean) {
    this.#noAlpha.value = !!v
    if (v) this.setAttribute('no-alpha', '')
    else this.removeAttribute('no-alpha')
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

  #defaultAllowedSpace() {
    return this.#allowedSpaces[0] ?? DEFAULT_SPACE
  }

  #withProgrammaticUpdate(fn: () => void) {
    this.#programmaticUpdate = true
    try {
      fn()
    } finally {
      this.#programmaticUpdate = false
    }
  }

  #parseColorSpacesAttribute(value: string | null) {
    const tokens = (value ?? '')
      .split(/\s+/)
      .map(space => space.trim().toLowerCase())
      .filter(Boolean)

    const valid = tokens.filter((space, index) => {
      if (tokens.indexOf(space) !== index) return false
      return isValidColorSpace(space)
    })

    return valid.length ? valid : [...DEFAULT_COLOR_SPACES]
  }

  #detectValueSpace(value: string) {
    const parsed = parse(value)
    const sid = reverseColorJSSpaceID(parsed.spaceId)
    const isHex = typeof value === 'string' && value.trim().startsWith('#')
    return isHex ? 'hex' : (sid === 'rgb' ? 'srgb' : sid)
  }

  #convertValueToSpace(value: string, space: string) {
    const current = parse(value)
    const targetSpace = space === 'hex' ? 'srgb' : space
    const converted = toGamut(to(current, getColorJSSpaceID(targetSpace)))
    const tempStr = serialize(converted, { precision: 12 })
    const parsed = parseIntoChannels(space as ColorSpace, tempStr)
    return gencolor(space as ColorSpace, parsed.ch)
  }

  #applyValue(value: string, emit = true) {
    const detectedSpace = this.#detectValueSpace(value)
    const nextSpace = this.#allowedSpaces.includes(detectedSpace)
      ? detectedSpace
      : this.#defaultAllowedSpace()
    const nextValue = nextSpace === detectedSpace
      ? value
      : this.#convertValueToSpace(value, nextSpace)

    this.#space.value = nextSpace
    this.#value.value = nextValue
    this.#withProgrammaticUpdate(() => {
      this.setAttribute('value', nextValue)
      this.setAttribute('colorspace', nextSpace)
    })
    if (this.#spaceSelect) this.#spaceSelect.value = nextSpace
    if (emit) this.#emitChange()
    if (this.#controls) this.#renderControls()
  }

  #applyColorspace(space: ColorSpace | string, emit = true, reflect = true) {
    const requested = typeof space === 'string' ? space.trim().toLowerCase() : String(space)
    const next = this.#allowedSpaces.includes(requested) ? requested : this.#defaultAllowedSpace()

    this.#space.value = next
    try {
      this.#withProgrammaticUpdate(() => {
        if (reflect) this.setAttribute('colorspace', next)
        const newValue = this.#convertValueToSpace(this.#value.value, next)
        this.#value.value = newValue
        if (reflect) this.setAttribute('value', newValue)
      })
    } catch { }
    if (emit) this.#emitChange()
    if (this.#spaceSelect) this.#spaceSelect.value = next
    if (this.#controls) this.#renderControls()
  }

  #colorSpaceLabel(space: string) {
    return space === 'srgb' ? 'rgb' : space
  }

  #renderSpaceOptions() {
    if (!this.#spaceSelect) return

    const useDefaultGrouping =
      this.#allowedSpaces.length === DEFAULT_COLOR_SPACES.length &&
      this.#allowedSpaces.every((space, index) => space === DEFAULT_COLOR_SPACES[index])

    const fragment = document.createDocumentFragment()

    const appendOption = (parent: HTMLElement | HTMLOptGroupElement, space: string) => {
      const option = document.createElement('option')
      option.value = space
      option.textContent = this.#colorSpaceLabel(space)
      parent.appendChild(option)
    }

    if (!useDefaultGrouping) {
      this.#allowedSpaces.forEach(space => appendOption(fragment as any, space))
      this.#spaceSelect.replaceChildren(fragment)
      return
    }

    const allowed = new Set(this.#allowedSpaces)
    SPACE_GROUPS.forEach(({ label, spaces }) => {
      const group = document.createElement('optgroup')
      group.label = label
      spaces
        .filter(space => allowed.has(space))
        .forEach(space => appendOption(group, space))

      if (group.childElementCount > 0) {
        fragment.appendChild(group)
      }
    })

    this.#spaceSelect.replaceChildren(fragment)
  }

  #syncAllowedSpace() {
    const next = this.#allowedSpaces.includes(this.#space.value)
      ? this.#space.value
      : this.#defaultAllowedSpace()
    if (this.#spaceSelect) this.#spaceSelect.value = next
    if (next !== this.#space.value || this.#detectValueSpace(this.#value.value) !== next) {
      this.#applyColorspace(next, false)
    }
  }

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
    this.#root = this.attachShadow({ mode: 'open' })

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

  // Delegate focus to the text input (replaces delegatesFocus behavior
  // without the sticky side-effect of auto-focusing on every click)
  focus(options?: FocusOptions) {
    (this.#textInput ?? this.#internalTrigger)?.focus(options)
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

    // Initialize AreaPicker only when visible
    const areaPickerEl = this.#root.querySelector<HTMLElement>('.area-picker')
    if (areaPickerEl && getComputedStyle(areaPickerEl).display !== 'none') {
      this.#areaPicker = new AreaPicker(areaPickerEl, (color, isDragging) => {
        this.#value.value = color
        this.#programmaticUpdate = true
        this.setAttribute('value', color)
        this.#programmaticUpdate = false
        this.#emitChange()
        this.#renderControls()
      })

      // Sync area picker when color changes
      this.#areaPickerEffectCleanup = effect(() => {
        const v = this.#value.value
        const space = this.#space.value
        const pickerSpace = DEFAULT_COLOR_SPACES.includes(space)
          ? space
          : (this.#allowedSpaces.find(candidate => DEFAULT_COLOR_SPACES.includes(candidate)) ?? 'srgb')
        this.#areaPicker?.setValue(v, pickerSpace as ColorSpace)
      })
    }

    // Eye dropper (pick color from screen)
    const eyedropperBtn = this.#root.querySelector<HTMLButtonElement>('button.eyedropper-btn')
    if (eyedropperBtn) {
      if ('EyeDropper' in window) {
        eyedropperBtn.addEventListener('click', async () => {
          try {
            const eyeDropper = new (window as any).EyeDropper()
            const result = await eyeDropper.open()
            if (result && result.sRGBHex) {
              const space = this.#space.value
              // convert to current space and format color
              const converted = to(result.sRGBHex, space === 'hex' ? 'srgb' : space)
              const serialized = serialize(converted, {
                format: space === "hex" ? "hex" : undefined,
              })
              const color = gencolor(space as ColorSpace, parseIntoChannels(space as ColorSpace, serialized).ch)
              this.#value.value = color
              this.setAttribute('value', color)
              this.#emitChange()
              this.#renderControls()
            }
          } catch {
            // User cancelled or error occurred
          }
        })
      } else {
        eyedropperBtn.hidden = true
      }
    }

    // Copy to clipboard
    const copyBtn = this.#root.querySelector<HTMLButtonElement>('button.copy-btn')
    const copyMessage = this.#root.querySelector<HTMLElement>('.copy-message')
    const copyMessageLiveRegion = this.#root.querySelector<HTMLElement>('.copy-message-live-region')
    if (copyBtn && copyMessage && copyMessageLiveRegion) {
      let copyTimeout: number | null = null
      copyBtn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(this.#value.value)
          copyMessage.classList.add('show')
          copyMessageLiveRegion.innerText = copyMessage.innerText
          if (copyTimeout !== null) clearTimeout(copyTimeout)
          copyTimeout = window.setTimeout(() => {
            copyMessage.classList.remove('show')
            copyMessageLiveRegion.innerText = ""
            copyTimeout = null
          }, 3000)
        } catch { }
      })
    }

    this.#allowedSpaces = this.#parseColorSpacesAttribute(this.getAttribute('color-spaces'))
    this.#renderSpaceOptions()

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
      let isOpen = !el.hasAttribute('hidden')
      try {
        isOpen = el.matches(':popover-open') ?? false
      } catch { }
      this.#open.value = isOpen
      if (isOpen) {
        this.#startReposition()
      } else {
        this.#stopReposition()
      }
      this.dispatchEvent(new CustomEvent(isOpen ? 'open' : 'close', { bubbles: true }))
    })

    this.#spaceSelect.addEventListener('change', () => {
      this.colorspace = this.#spaceSelect!.value
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
      if (gamutEl) {
        const gamutOrder = ['srgb', 'p3', 'rec2020', 'xyz']
        const idx = gamutOrder.indexOf(gamut)
        gamutEl.style.setProperty('--gamut-index', String(idx >= 0 ? idx : 0))
      }
      const preview = this.#root.querySelector('.preview') as HTMLElement
      if (preview) preview.style.setProperty('--value', v)

      // Update WCAG contrast scores
      const crW = this.#root.querySelector('.cr-w') as HTMLElement
      const crB = this.#root.querySelector('.cr-b') as HTMLElement
      if (crW && crB) {
        try {
          const parsed = parse(v)
          const cw = contrastFn(parsed, 'white', 'WCAG21')
          const cb = contrastFn(parsed, 'black', 'WCAG21')
          crW.textContent = `${(cw as number).toFixed(1)}:1`
          crB.textContent = `${(cb as number).toFixed(1)}:1`
        } catch { }
      }
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
      this.setAttribute('colorspace', this.#defaultAllowedSpace())
    }

    this.#syncAllowedSpace()

    // Normalize value on load so chroma (and other channels) are in consistent form
    // (e.g. percentage notation), matching what gencolor produces after any change
    try {
      const { ch } = parseIntoChannels(this.#space.value as ColorSpace, this.#value.value)
      this.#value.value = gencolor(this.#space.value as ColorSpace, ch)
    } catch {}

    this.#renderControls()
  }

  disconnectedCallback() {
    this.#colorSchemeEffectCleanup?.()
    this.#previewEffectCleanup?.()
    this.#errorEffectCleanup?.()
    this.#areaPickerEffectCleanup?.()
    this.#areaPicker?.unmount()
  }

  attributeChangedCallback(name: string, _old: string | null, value: string | null) {
    if (value === _old) return
    // Skip processing if this is from a programmatic update (avoid circular event emissions)
    if (this.#programmaticUpdate) return

    if (name === 'value' && typeof value === 'string') {
      try {
        this.#applyValue(value, false)
      } catch { }
    }
    if (name === 'colorspace' && value) {
      this.#applyColorspace(value, false, false)
    }
    if (name === 'color-spaces') {
      this.#allowedSpaces = this.#parseColorSpacesAttribute(value)
      this.#renderSpaceOptions()
      this.#syncAllowedSpace()
    }
    if (name === 'theme') {
      this.#theme.value = (value as Theme) || 'auto'
    }
    if (name === 'no-alpha') {
      this.#noAlpha.value = value !== null
      if (this.#controls) this.#renderControls()
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
      // Clear error on success
      this.#error.value = null
      this.#applyValue(inputValue)
    } catch {
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

  #usingCSSAnchor() {
    const anchor = this.#anchor.value
    const isInternal = !anchor || anchor === this.#internalTrigger
    return supportsAnchor && isInternal && !this.#lastInvoker
  }

  #startReposition() {
    if (this.#usingCSSAnchor()) return

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
    if (this.#usingCSSAnchor()) return
    const panel = this.#panel as HTMLElement

    const anchorRect = this.#getAnchorRect()
    const insets = getSafeAreaInsets()
    const viewport = getViewportClampRect(insets)
    const size = this.#measurePanel(panel)

    const candidates = computeCandidates(anchorRect, size)
    const pick = findFirstFitOrMaxArea(candidates, viewport, this.#lastPlacement)
    this.#lastPlacement = pick.placement

    const left = Math.round(Math.min(Math.max(pick.left, viewport.left), viewport.right - size.width))
    let top = Math.round(Math.min(Math.max(pick.top, viewport.top), viewport.bottom - size.height))

    // Fix overlap: if "top" placement got clamped into the anchor, flip to bottom
    if (pick.placement.startsWith('top') && top + size.height > anchorRect.top - GUTTER) {
      top = Math.round(anchorRect.bottom + GUTTER)
      pick.placement = pick.placement.replace('top', 'bottom') as Placement
    }

    const maxPanelHeight = viewport.bottom - viewport.top
    if (size.height > maxPanelHeight) {
      panel.style.maxHeight = `${maxPanelHeight}px`
      panel.style.overflow = 'auto'
    } else if (panel.style.maxHeight) {
      panel.style.maxHeight = ''
      panel.style.overflow = ''
    }

    panel.style.position = 'fixed'
    panel.style.left = `${left}px`
    panel.style.top = `${top}px`
    panel.dataset.placement = pick.placement
  }

  #getAnchorRect(): Rect {
    const anchor = this.#anchor.value ?? this.#lastInvoker ?? this.#internalTrigger ?? this

    if (!anchor.isConnected) {
      const vw = window.visualViewport?.width ?? window.innerWidth
      const vh = window.visualViewport?.height ?? window.innerHeight
      const cx = vw / 2
      const cy = vh / 2
      return { left: cx, top: cy, right: cx, bottom: cy, width: 0, height: 0 }
    }
    const rect = anchor.getBoundingClientRect()
    return {
      left: rect.left,
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
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
    panel.style.position = 'fixed'
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
    const current = parseIntoChannels(space as ColorSpace, this.#value.value)
    const ch = current.ch

    const channelSignals: Record<string, ReturnType<typeof signal<string>>> = {}
    Object.keys(ch).forEach(key => {
      channelSignals[key] = signal(String(ch[key]))
    })

    let rafId: number | null = null
    let pendingApply: (() => void) | null = null

    const stripLeadingZeros = (s: string) => s.replace(/^0+(\d)/, '$1').replace(/^0\./, '.')

    const make =(label: string, key: string, min: number, max: number, step = 1, bg?: string, bgColor?: string) => {
      const wrapHue = key === 'H'
      const isLabAB = (key === 'A' || key === 'B') && (space === 'lab' || space === 'oklab')
      const isPercentage = !isLabAB && ['L', 'S', 'C', 'W', 'B', 'R', 'G', 'ALP'].includes(key)
      const isAngle = key === 'H'
      const formatValue = (value: number) => {
        return formatChannel(space as ColorSpace, key, value)
      }

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
          const c0 = gencolor(space as ColorSpace, { ...ch, ALP: '0' })
          const c1 = gencolor(space as ColorSpace, { ...ch, ALP: '100' })
          const interpSpace = space === 'hsl' ? 'hsl' : (space === 'lch' ? 'lch' : (space === 'oklch' ? 'oklch' : 'oklab'))
          range.style.background = `linear-gradient(to right in ${interpSpace}, ${c0}, ${c1}), var(--checker)`
        } catch { }
      }
      const num = document.createElement('input')
      num.type = 'number'
      num.min = isLabAB ? '0' : String(min)
      num.max = isLabAB ? String(Math.max(Math.abs(min), Math.abs(max))) : String(max)
      num.step = String(step)
      num.classList.add(`ch-${key.toLowerCase()}`)
      num.value = isLabAB ? String(Math.abs(Number(ch[key] ?? 0))) : String(ch[key] ?? 0)

      const numWrapper = document.createElement('div')
      numWrapper.className = 'num-wrapper'
      numWrapper.appendChild(num)
      if (isPercentage || isAngle) {
        const unit = document.createElement('sup')
        unit.textContent = isAngle ? '°' : '%'
        numWrapper.appendChild(unit)
      }
      let signSup: HTMLElement | null = null
      if (isLabAB) {
        signSup = document.createElement('sup')
        const val = Number(ch[key] ?? 0)
        signSup.textContent = val < 0 ? '−' : '+'
        numWrapper.appendChild(signSup)
        num.value = stripLeadingZeros(String(Math.abs(val)))
      }

      const apply = () => {
        const next = gencolor(space as ColorSpace, ch)
        this.#value.value = next
        this.setAttribute('value', next)
        this.#emitChange()
      }

      const onInput = (ev: Event) => {
        const target = ev.target as HTMLInputElement
        let val = Number(target.value)
        if (!Number.isFinite(val)) return
        if (isLabAB && target === num) {
          // number input shows absolute value; apply sign from sup
          val = Math.abs(val) * (signSup && signSup.textContent === '−' ? -1 : 1)
        }
        if (wrapHue) {
          val = ((val % 360) + 360) % 360
        } else {
          val = Math.max(min, Math.min(max, val))
        }
        const formatted = formatValue(val)
        ch[key] = formatted
        channelSignals[key].value = formatted
        // keep controls in sync
        range.value = String(ch[key])
        if (isLabAB) {
          const n = Number(ch[key])
          if (signSup) signSup.textContent = n < 0 ? '−' : '+'
          num.value = stripLeadingZeros(String(Math.abs(n)))
        } else {
          num.value = String(ch[key])
        }
        pendingApply = apply
        if (rafId === null) {
          rafId = requestAnimationFrame(() => {
            rafId = null
            if (pendingApply) {
              pendingApply()
              pendingApply = null
            }
          })
        }
      }

      num.addEventListener('keydown', (ev: KeyboardEvent) => {
        if (ev.key !== 'ArrowUp' && ev.key !== 'ArrowDown') return
        if (!ev.shiftKey && !ev.altKey) return
        ev.preventDefault()
        const dir = ev.key === 'ArrowUp' ? 1 : -1
        const delta = ev.shiftKey ? step * 10 : ev.altKey ? step * 0.1 : step
        let val = Number(num.value) * (isLabAB && signSup?.textContent === '−' ? -1 : 1)
        val += dir * delta
        if (wrapHue) {
          val = ((val % 360) + 360) % 360
        } else {
          val = Math.max(min, Math.min(max, val))
        }
        const formatted = formatValue(val)
        ch[key] = formatted
        channelSignals[key].value = formatted
        range.value = String(ch[key])
        if (isLabAB) {
          const n = Number(ch[key])
          if (signSup) signSup.textContent = n < 0 ? '−' : '+'
          num.value = stripLeadingZeros(String(Math.abs(n)))
        } else {
          num.value = String(ch[key])
        }
        pendingApply = apply
        if (rafId === null) {
          rafId = requestAnimationFrame(() => {
            rafId = null
            if (pendingApply) {
              pendingApply()
              pendingApply = null
            }
          })
        }
      })

      range.addEventListener('input', onInput)
      num.addEventListener('input', onInput)
      group.append(lab, range, numWrapper)
      return group
    }

    this.#controls.innerHTML = ''

    if (space === 'oklab') {
      const alphaControl = make('A', 'ALP', 0, 100, 1)
      if (this.#noAlpha.value) alphaControl.style.display = 'none'
      this.#controls.append(
        make('L', 'L', 0, 100, 1, 'linear-gradient(in oklab to right, black, white)'),
        make('A', 'A', -0.5, 0.5, 0.01, 'linear-gradient(to right in oklab, oklab(65% -.5 .5), oklab(65% .5 .5))'),
        make('B', 'B', -0.5, 0.5, 0.01, 'linear-gradient(to right in oklab, oklab(47% -.03 -.32), oklab(96% 0 .25))'),
        alphaControl
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
      const alphaControl = make('A', 'ALP', 0, 100, 1)
      if (this.#noAlpha.value) alphaControl.style.display = 'none'
      this.#controls.append(
        make('L', 'L', 0, 100, 1, 'linear-gradient(in oklab to right, black, white)'),
        make('C', 'C', 0, 100, 1, `linear-gradient(in oklch to right, oklch(${ch.L ?? 0}% 1% ${ch.H ?? 0}), oklch(${ch.L ?? 0}% 100% ${ch.H ?? 0}))`),
        make('H', 'H', 0, 359, 1, 'linear-gradient(to right in oklch longer hue, oklch(90% 75% 0), oklch(90% 75% 0))'),
        alphaControl
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
      const alphaControl = make('A', 'ALP', 0, 100, 1)
      if (this.#noAlpha.value) alphaControl.style.display = 'none'
      this.#controls.append(
        make('L', 'L', 0, 100, 1, 'linear-gradient(in lab to right, black, white)'),
        make('A', 'A', -160, 160, 1, 'linear-gradient(to right in oklab, lab(85% -100 100), lab(55% 100 100))'),
        make('B', 'B', -160, 160, 1, 'linear-gradient(to right in oklab, lab(31% 70 -120), lab(96% 0 120))'),
        alphaControl
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
      const alphaControl = make('A', 'ALP', 0, 100, 1)
      if (this.#noAlpha.value) alphaControl.style.display = 'none'
      this.#controls.append(
        make('L', 'L', 0, 100, 1, 'linear-gradient(in lab to right, black, white)'),
        make('C', 'C', 0, 100, 1, `linear-gradient(in lch to right, lch(${ch.L ?? 0}% 1% ${ch.H ?? 0}), lch(${ch.L ?? 0}% 100% ${ch.H ?? 0}))`),
        make('H', 'H', 0, 359, 1, 'linear-gradient(to right in lch longer hue, lch(90% 75% 0), lch(90% 75% 0))'),
        alphaControl
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
      const alphaControl = make('A', 'ALP', 0, 100, 1)
      if (this.#noAlpha.value) alphaControl.style.display = 'none'
      this.#controls.append(
        make('H', 'H', 0, 359, 1, 'linear-gradient(to right in hsl longer hue, hsl(0 100% 50%), hsl(360 100% 50%))'),
        make('S', 'S', 0, 100, 1, `linear-gradient(in hsl to right, hsl(${ch.H ?? 0} 0% ${ch.L ?? 50}% / 100%), hsl(${ch.H ?? 0} 100% ${ch.L ?? 50}% / 100%))`),
        make('L', 'L', 0, 100, 1, `linear-gradient(in oklab to right, hsl(${ch.H ?? 0} ${ch.S ?? 100}% 0%), hsl(${ch.H ?? 0} ${ch.S ?? 100}% 100%))`),
        alphaControl
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
      const alphaControl = make('A', 'ALP', 0, 100, 1)
      if (this.#noAlpha.value) alphaControl.style.display = 'none'
      this.#controls.append(
        make('H', 'H', 0, 359, 1, 'linear-gradient(to right in hsl longer hue, hsl(0 100% 50%), hsl(360 100% 50%))'),
        make('W', 'W', 0, 100, 1, 'linear-gradient(to right in oklab, #fff0, #fff)', 'black'),
        make('B', 'B', 0, 100, 1, 'linear-gradient(to right in oklab, #0000, #000)', 'white'),
        alphaControl
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
      const alphaControl = make('A', 'ALP', 0, 100, 1)
      if (this.#noAlpha.value) alphaControl.style.display = 'none'
      this.#controls.append(
        make('R', 'R', 0, 100, 1, 'linear-gradient(to right in oklab, #f000, #f00)', 'black'),
        make('G', 'G', 0, 100, 1, 'linear-gradient(to right in oklab, #0f00, #0f0)', 'black'),
        make('B', 'B', 0, 100, 1, 'linear-gradient(to right in oklab, #00f0, #00f)', 'black'),
        alphaControl
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
      const alphaControl = make('A', 'ALP', 0, 100, 1)
      if (this.#noAlpha.value) alphaControl.style.display = 'none'
      this.#controls.append(
        make('R', 'R', 0, 100, 1, 'linear-gradient(to right in oklab, #f000, #f00)', 'black'),
        make('G', 'G', 0, 100, 1, 'linear-gradient(to right in oklab, #0f00, #0f0)', 'black'),
        make('B', 'B', 0, 100, 1, 'linear-gradient(to right in oklab, #00f0, #00f)', 'black'),
        alphaControl
      )
      const alphaRange = this.#controls.querySelector<HTMLInputElement>('input[type="range"].ch-alp')
      this.#controlsEffectCleanup = effect(() => {
        const R = channelSignals.R.value || '0'
        const G = channelSignals.G.value || '0'
        const B = channelSignals.B.value || '0'
        if (alphaRange) {
          const c0 = gencolor(space as ColorSpace, { ...ch, R, G, B, ALP: '0' })
          const c1 = gencolor(space as ColorSpace, { ...ch, R, G, B, ALP: '100' })
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
