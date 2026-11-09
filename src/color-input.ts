import { signal, computed, effect, batch, Signal } from '@preact/signals-core'
import { parse, serialize, to, toGamut, contrast as contrastFn } from 'colorjs.io/fn'
import {
  contrastColor,
  COLOR_SPACES,
  detectGamut,
  getColorJSSpaceID,
  isRGBLike,
  reverseColorJSSpaceID,
  type Theme,
  type ColorSpace
} from './color'
import { AreaPicker } from './area-picker'
import { formatChannel } from './utils/channel-formatting'
import { gencolor, parseIntoChannels, preprocessColorInput, displayChannels, type ChannelRecord } from './utils/color-conversion'
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
export interface ChangeDetail { value: string; colorspace: ColorSpace; gamut: string }

const supportsAnchor = CSS.supports?.('anchor-name: --a') ?? false

const DEFAULT_VALUE = 'oklch(75% 75% 180)'
const DEFAULT_SPACE: ColorSpace = 'oklch'
// How long the color must hold still before it's announced to screen readers
const ANNOUNCE_DELAY = 600
const asColorSpace = (value: string | null): ColorSpace | null =>
  COLOR_SPACES.includes(value as ColorSpace) ? value as ColorSpace : null

// A wrapping <label> also holds the control itself (and maybe others), so
// collect only its own text, skipping control subtrees and hidden content
const LABEL_SKIP = 'color-input, input, select, textarea, button, datalist, output, [hidden], [aria-hidden="true"], script, style'
/** #rgb / #rgba → #rrggbb / #rrggbbaa, so short and long hex compare equal */
const expandHex = (hex: string) =>
  hex.length === 4 || hex.length === 5 ? '#' + [...hex.slice(1)].map(c => c + c).join('') : hex

const labelText = (label: HTMLElement) => {
  const walker = document.createTreeWalker(label, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => n instanceof Element && n.matches(LABEL_SKIP) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
  })
  let text = ''
  while (walker.nextNode()) if (walker.currentNode.nodeType === Node.TEXT_NODE) text += walker.currentNode.nodeValue
  return text
}

// Create shared stylesheet for all component instances
const sheet = new CSSStyleSheet()
// Only call replaceSync if it exists (not available in jsdom)
if (typeof sheet.replaceSync === 'function') {
  sheet.replaceSync(styles)
}

export class ColorInput extends HTMLElement {
  static get observedAttributes() { return ['value', 'colorspace', 'theme', 'no-alpha', 'no-gamut-boundaries', 'initial-colorspace', 'aria-label'] }

  // Form-associated custom element (HTML § 4.13.7): takes part in <form>
  // submission, FormData, reset, disabled <fieldset>s, and <label for>.
  static formAssociated = true

  // ──────────────────────────────────────────────────────────────────────────────
  // State: Reactive signals (Preact Signals Core)
  // ──────────────────────────────────────────────────────────────────────────────
  #value = signal<string>(DEFAULT_VALUE)
  // The value a run of space switches started from. Only reused while the
  // value is still the one the last switch produced (`shown`); any edit makes
  // it stale
  #switchOrigin: { value: string; space: ColorSpace; shown: string } | null = null
  #space = signal<ColorSpace>(DEFAULT_SPACE)
  #theme = signal<Theme>('auto')
  #open = signal(false)
  #anchor: Signal<HTMLElement | null> = signal(null)
  #error = signal<string | null>(null)
  #noAlpha = signal(false)
  #showGamutBoundaries = signal(true)

  #contrast = computed(() => contrastColor(this.#value.value))
  #gamut = computed(() => detectGamut(this.#value.value))

  #previewEffectCleanup: ReturnType<typeof effect> | null = null
  #colorSchemeEffectCleanup: ReturnType<typeof effect> | null = null
  #errorEffectCleanup: ReturnType<typeof effect> | null = null
  #controlsEffectCleanup: ReturnType<typeof effect> | null = null
  #controlsUpdate: ((ch: ChannelRecord) => void) | null = null
  #areaPickerEffectCleanup: ReturnType<typeof effect> | null = null
  #formValueEffectCleanup: ReturnType<typeof effect> | null = null
  #areaPickerGamutBoundariesEffectCleanup: ReturnType<typeof effect> | null = null
  #areaPicker?: AreaPicker
  #programmaticUpdate = false

  // Infer the working colorspace from a color string. Hex and functional
  // notations express a format preference; named colors (`rebeccapurple`)
  // don't, so they default to oklch rather than srgb.
  #detectSpace(value: string, parsedSpaceId: string): ColorSpace {
    const v = value.trim()
    if (v.startsWith('#')) return 'hex'
    if (/^[a-z]+$/i.test(v)) return DEFAULT_SPACE
    const sid = reverseColorJSSpaceID(parsedSpaceId)
    // colorjs parses spaces we don't offer as an editing space (e.g. okhsv);
    // they have no controls to render, so fall back rather than blank the panel
    return asColorSpace(sid === 'rgb' ? 'srgb' : sid) ?? DEFAULT_SPACE
  }

  get value() { return this.#value.value }
  set value(v: string) {
    if (typeof v !== 'string' || !v) return
    try {
      const parsed = parse(v)
      this.#space.value = this.#detectSpace(v, parsed.spaceId)
      this.#value.value = v
      this.#programmaticUpdate = true
      this.setAttribute('value', v)
      this.setAttribute('colorspace', this.#space.value)
      this.#programmaticUpdate = false
      this.#emitChange()
    } catch { }
  }

  get colorspace() { return this.#space.value }
  set colorspace(s: ColorSpace | string) {
    const next = (s as ColorSpace) || DEFAULT_SPACE
    const prevSpace = this.#space.value
    this.#space.value = next
    this.#programmaticUpdate = true
    this.setAttribute('colorspace', next)
    try {
      // A space switch rounds to display precision (whole percents/degrees).
      // Convert from the last value the user actually set, not the rounded
      // one, so switching back and forth never drifts: #3b82f6 → oklch → hex
      // is #3b82f6 again, and returning to the original space restores the
      // original string
      const prev = this.#value.value
      const origin = this.#switchOrigin?.shown === prev ? this.#switchOrigin : { value: prev, space: prevSpace }
      let newValue: string
      if (next === origin.space) {
        newValue = origin.value
      } else {
        const current = parse(origin.value)
        const targetSpace = next === 'hex' ? 'srgb' : next
        const converted = toGamut(to(current, getColorJSSpaceID(targetSpace)))
        const tempStr = serialize(converted, { precision: 12 })
        newValue = gencolor(next, displayChannels(next, tempStr).ch)
      }
      this.#switchOrigin = { value: origin.value, space: origin.space, shown: newValue }
      this.#value.value = newValue
      this.setAttribute('value', newValue)
      this.#emitChange()
    } catch { }
    this.#programmaticUpdate = false
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

  get noAlpha() { return this.#noAlpha.value }
  set noAlpha(v: boolean) {
    this.#noAlpha.value = !!v
    if (v) this.setAttribute('no-alpha', '')
    else this.removeAttribute('no-alpha')
  }

  get showGamutBoundaries() { return this.#showGamutBoundaries.value }
  set showGamutBoundaries(v: boolean) {
    this.#showGamutBoundaries.value = !!v
    if (v) this.removeAttribute('no-gamut-boundaries')
    else this.setAttribute('no-gamut-boundaries', '')
  }

  get gamut() { return this.#gamut.value }
  get contrastColor() { return this.#contrast.value }
  get initialColorspace() { return asColorSpace(this.getAttribute('initial-colorspace')) }
  set initialColorspace(s: ColorSpace | string | null) {
    const next = asColorSpace(typeof s === 'string' ? s : null)
    if (next) this.setAttribute('initial-colorspace', next)
    else this.removeAttribute('initial-colorspace')
  }

  // ──────────────────────────────────────────────────────────────────────────────
  // Form-associated API, mirroring <input>
  // ──────────────────────────────────────────────────────────────────────────────
  #internals: ElementInternals | null = null
  // What a form reset restores: the color (and editing space) the element was
  // first connected with. The `value` attribute can't serve as the default the
  // way it does for <input>, because the component reflects every edit into it.
  #defaultState: { value: string; space: ColorSpace } | null = null
  #disabled = false
  #pendingRestore: string | null = null

  get form() { return this.#internals?.form ?? null }
  get labels(): NodeListOf<HTMLLabelElement> {
    return (this.#internals?.labels as NodeListOf<HTMLLabelElement> | undefined)
      ?? document.querySelectorAll<HTMLLabelElement>(':not(*)')
  }
  get name() { return this.getAttribute('name') ?? '' }
  set name(v: string) { this.setAttribute('name', v) }
  get disabled() { return this.hasAttribute('disabled') }
  set disabled(v: boolean) { this.toggleAttribute('disabled', !!v) }
  get defaultValue() { return this.#defaultState?.value ?? this.getAttribute('value') ?? DEFAULT_VALUE }
  set defaultValue(v: string) {
    if (typeof v !== 'string' || !v) return
    try {
      this.#defaultState = { value: v, space: this.#detectSpace(v, parse(v).spaceId) }
    } catch { }
  }
  get validity() { return this.#internals?.validity }
  get validationMessage() { return this.#internals?.validationMessage ?? '' }
  get willValidate() { return this.#internals?.willValidate ?? false }
  checkValidity() { return this.#internals?.checkValidity?.() ?? true }
  reportValidity() { return this.#internals?.reportValidity?.() ?? true }

  // Called by the browser when `disabled` toggles on this element or on an
  // ancestor <fieldset>. Disabled controls are left out of form submission.
  formDisabledCallback(disabled: boolean) {
    this.#disabled = disabled
    const trigger = this.#root.querySelector<HTMLButtonElement>('button.trigger')
    const text = this.#root.querySelector<HTMLInputElement>('.text-input')
    const panel = this.#root.querySelector<HTMLElement>('.panel')
    if (trigger) trigger.disabled = disabled
    if (text) text.disabled = disabled
    // An inline picker's panel is always visible; inert takes its sliders,
    // area picker and buttons out of the tab order and pointer handling
    if (panel) panel.inert = disabled
    if (disabled) this.close()
  }

  formResetCallback() {
    const start = this.#defaultState
    if (!start || (start.value === this.#value.value && start.space === this.#space.value)) return
    this.#restoreColor(start.value, start.space)
  }

  // Session history (back/forward, reload) and autofill hand back either the
  // state recorded by setFormValue() or a bare color string
  formStateRestoreCallback(state: unknown) {
    if (typeof state !== 'string') return
    // Chromium restores before the first connectedCallback; hold the state
    // until the authored color has been captured as the reset target
    if (!this.#defaultState) {
      this.#pendingRestore = state
      return
    }
    let value = state
    let space: ColorSpace | null = null
    try {
      const saved = JSON.parse(state)
      if (saved && typeof saved.value === 'string') {
        value = saved.value
        space = asColorSpace(saved.colorspace)
      }
    } catch { }
    try {
      const parsed = parse(value)
      space ??= this.#detectSpace(value, parsed.spaceId)
    } catch { return }
    // Like native controls, a UA-initiated restore fires no change event
    this.#restoreColor(value, space, { silent: true })
  }

  #syncFormValue() {
    const value = this.#value.value
    try {
      this.#internals?.setFormValue?.(value, JSON.stringify({ value, colorspace: this.#space.value }))
    } catch { }
  }

  // The focusable parts live in shadow DOM, so a <label> naming the host
  // doesn't reach them; carry its text (or the host's aria-label) inward
  #labelObserver: MutationObserver | null = null
  #observedLabels: HTMLLabelElement[] = []
  #syncAccessibleName() {
    if (!this.isConnected) return
    const trigger = this.#root.querySelector<HTMLButtonElement>('button.trigger')
    const text = this.#root.querySelector<HTMLInputElement>('.text-input')
    const labels = Array.from(this.labels)
    // Follow edits to the label text; only re-observe when the set changes
    const sameLabels = labels.length === this.#observedLabels.length
      && labels.every((l, i) => l === this.#observedLabels[i])
    if (!sameLabels && typeof MutationObserver !== 'undefined') {
      this.#labelObserver?.disconnect()
      this.#labelObserver ??= new MutationObserver(() => this.#syncAccessibleName())
      labels.forEach((l) => this.#labelObserver!.observe(l, { childList: true, characterData: true, subtree: true }))
      this.#observedLabels = labels
    }
    const fromLabels = labels
      .map((label) => labelText(label).replace(/\s+/g, ' ').trim())
      .filter(Boolean)
      .join(' ')
    const name = this.getAttribute('aria-label')?.trim() || fromLabels
    const set = (el: Element | null, label: string) => {
      if (el && el.getAttribute('aria-label') !== label) el.setAttribute('aria-label', label)
    }
    set(trigger, name ? `${name}, open color picker` : 'Open color picker')
    set(text, name || 'Color value')
  }

  // Inline mode: the page restyles ::part(panel) into the flow (display: block;
  // position: static), so the panel is always shown and never a popover. The
  // UA gives every [popover] position: fixed, so an in-flow position is what
  // sets inline mode apart. Computed display can't: a closing popover keeps
  // display: block for the length of its allow-discrete exit transition.
  #isInlinePickerVisible() {
    const panel = this.#panel
    if (!panel || this.#panelOpen()) return false
    const { display, position } = getComputedStyle(panel)
    return display !== 'none' && position !== 'fixed' && position !== 'absolute'
  }

  #restoreFocus() {
    this.#focusInPanelAtClose = false
    const inner = this.#root.activeElement
    const outer = document.activeElement
    // Still inside the closing panel, or dropped on <body>; anything else is
    // a deliberate move (an outside click focusing its target) and stays
    const lost = inner ? !!this.#panel?.contains(inner) : (!outer || outer === document.body)
    if (!lost) return
    // The opener may be gone, hidden or disabled by now; fall back to the swatch
    const landed = (el?: HTMLElement | null) => {
      el?.focus({ preventScroll: true })
      return !!el && (document.activeElement === el || this.#root.activeElement === el)
    }
    if (!landed(this.#returnFocus?.isConnected ? this.#returnFocus : null)) landed(this.#internalTrigger)
  }

  #panelOpen() {
    try { return !!this.#panel?.matches(':popover-open') } catch { return this.#open.value }
  }

  // The swatch is a declarative popover invoker (popovertarget), so the
  // browser owns toggling, light dismiss and focus return. In inline mode
  // there is nothing to toggle: drop the invoker and its expanded state.
  #syncInvoker() {
    const btn = this.#internalTrigger
    if (!btn) return
    if (this.#isInlinePickerVisible()) {
      btn.removeAttribute('popovertarget')
      btn.removeAttribute('aria-expanded')
    } else {
      if (btn.getAttribute('popovertarget') !== 'panel') btn.setAttribute('popovertarget', 'panel')
      btn.setAttribute('aria-expanded', String(this.#panelOpen()))
    }
  }

  show(anchor?: HTMLElement | null) {
    if (this.#disabled) return
    if (anchor) this.#anchor.value = anchor
    const panel = this.#panel
    if (panel?.showPopover && !this.#panelOpen()) {
      // Name the opener as the source, like an invoker click: focus returns
      // to it on close. Browsers without the options bag ignore it.
      const source = anchor ?? this.#internalTrigger
      try { (panel.showPopover as (o?: { source?: HTMLElement }) => void)(source ? { source } : undefined) }
      catch { try { panel.showPopover() } catch { } }
    }
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
  #infoInput?: HTMLInputElement
  #chip?: HTMLElement
  #internalTrigger?: HTMLButtonElement
  #textInput?: HTMLInputElement
  #errorMessage?: HTMLElement
  #lastInvoker: HTMLElement | null = null
  #returnFocus: HTMLElement | null = null
  #focusInPanelAtClose = false
  // While an editable color-string field has focus, reactive effects must not
  // rewrite its text out from under the user's caret (re-sync happens on blur)
  #editingField: HTMLInputElement | null = null
  // The color as it stood when the footer field took focus, so Escape can undo
  // the whole edit — commits are live, so the text alone isn't enough to revert
  #editStart: { value: string; space: ColorSpace } | null = null
  #valueLiveRegion?: HTMLElement
  #announceTimeout: number | null = null
  // Suppresses the announcement of the value the component loads with
  #announceReady = false

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

    try {
      this.#internals = this.attachInternals()
    } catch { }

    // Activating an associated <label> clicks the host itself (clicks inside
    // the shadow root keep their inner node as the original target, so they
    // never match). Behave like <input type="color">: open the picker.
    this.addEventListener('click', (ev) => {
      if (ev.composedPath()[0] !== this || this.#disabled) return
      if (this.#isInlinePickerVisible()) {
        this.focus()
        return
      }
      this.#internalTrigger?.focus({ preventScroll: true })
      this.show(this.#internalTrigger)
    })
    this.addEventListener('focusin', () => {
      this.#syncAccessibleName()
      this.#syncInvoker()
    })
  }

  // Delegate focus to the text input (replaces delegatesFocus behavior
  // without the sticky side-effect of auto-focusing on every click)
  focus(options?: FocusOptions) {
    (this.#textInput ?? this.#internalTrigger)?.focus(options)
  }

  connectedCallback() {
    this.#upgradeProperty('value')
    this.#upgradeProperty('name')
    this.#upgradeProperty('disabled')
    this.#upgradeProperty('defaultValue')
    const btn = this.#root.querySelector<HTMLButtonElement>('button.trigger')
    this.#internalTrigger = btn ?? undefined
    this.#panel = this.#root.querySelector('.panel') as any
    this.#controls = this.#root.querySelector('.controls') as HTMLElement
    this.#spaceSelect = this.#root.querySelector('.space') as HTMLSelectElement
    this.#infoInput = this.#root.querySelector('input.info') as HTMLInputElement
    this.#valueLiveRegion = this.#root.querySelector('.value-live-region') as HTMLElement
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
        this.#updateControls()
      })

      // Sync area picker when color changes
      this.#areaPickerEffectCleanup = effect(() => {
        const v = this.#value.value
        const space = this.#space.value
        this.#areaPicker?.setValue(v, space)
      })
      this.#areaPickerGamutBoundariesEffectCleanup = effect(() => {
        this.#areaPicker?.setShowGamutBoundaries(this.#showGamutBoundaries.value)
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
              const color = gencolor(space, displayChannels(space, serialized).ch)
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

    // Runs before the invoker's activation behavior, so popovertarget is
    // current when the browser acts on it
    if (btn) btn.addEventListener('click', () => {
      this.#syncInvoker()
      if (!this.#isInlinePickerVisible()) this.#anchor.value = btn
    })
    this.#syncInvoker()

    // Text input validation
    if (this.#textInput) {
      this.#textInput.value = this.#value.value

      this.#textInput.addEventListener('focus', () => { this.#editingField = this.#textInput! })
      this.#textInput.addEventListener('blur', () => {
        this.#editingField = null
        // Revert any uncommitted (invalid or unnormalized) text
        this.#textInput!.value = this.#value.value
        this.#error.value = null
      })
      this.#textInput.addEventListener('input', () => {
        const ok = this.#validateAndSetColor(this.#textInput!.value)
        this.#error.value = ok ? null : 'Invalid color format'
      })
    }

    // Editable color string in the panel footer: paste/type any CSS color
    if (this.#infoInput) {
      this.#infoInput.value = this.#value.value
      const setInvalid = (invalid: boolean) => this.#infoInput!.setAttribute('aria-invalid', String(invalid))

      // First click selects the whole value (one-click paste target and copy
      // source); once focused, further clicks place the caret normally.
      // Safari collapses the focus-handler selection on the click's mouseup
      // clearing the text selection, so suppress that first mouseup event.
      let focusingClick = false
      let downX = 0
      let downY = 0
      this.#infoInput.addEventListener('pointerdown', (ev: PointerEvent) => {
        focusingClick = this.#editingField !== this.#infoInput
        downX = ev.clientX
        downY = ev.clientY
      })
      this.#infoInput.addEventListener('mouseup', (ev) => {
        // Only a stationary click; a drag means the user selected a range by
        // hand, and suppressing that mouseup would snap it back to select-all
        const dragged = Math.abs(ev.clientX - downX) > 3 || Math.abs(ev.clientY - downY) > 3
        if (focusingClick && !dragged) ev.preventDefault()
        focusingClick = false
      })
      this.#infoInput.addEventListener('focus', () => {
        this.#editingField = this.#infoInput!
        this.#editStart = { value: this.#value.value, space: this.#space.value }
        this.#infoInput!.select()
      })
      this.#infoInput.addEventListener('blur', () => {
        this.#editingField = null
        this.#editStart = null
        this.#infoInput!.value = this.#value.value
        setInvalid(false)
      })
      this.#infoInput.addEventListener('input', () => {
        setInvalid(!this.#validateAndSetColor(this.#infoInput!.value))
      })
      this.#infoInput.addEventListener('keydown', (ev: KeyboardEvent) => {
        const info = this.#infoInput!
        if (ev.key === 'Enter') {
          ev.preventDefault()
          info.blur()
        } else if (ev.key === 'Escape') {
          // First Escape abandons the edit — including any color already
          // committed live — and keeps the popover open; with nothing left to
          // undo, Escape falls through and closes it
          const start = this.#editStart
          const colorChanged = !!start && (this.#value.value !== start.value || this.#space.value !== start.space)
          const textDirty = info.value !== (start ? start.value : this.#value.value)
          if (!colorChanged && !textDirty) return
          ev.preventDefault()
          ev.stopPropagation()
          if (colorChanged) this.#restoreColor(start!.value, start!.space)
          info.value = this.#value.value
          setInvalid(false)
          info.select()
        }
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
        if (this.#panelOpen()) this.close(); else this.show(this.#lastInvoker)
      }
    })

    // Focus return: Firefox and Safari hand focus back to the opener when a
    // popover closes with focus inside it; Chromium misses it when that focus
    // is in a shadow root (the document sees only the host) and drops it on
    // <body>. Remember the opener, and put focus back only when it was lost.
    this.#panel?.addEventListener('beforetoggle', (ev: Event) => {
      const panel = this.#panel!
      if ((ev as ToggleEvent).newState === 'open') {
        this.#focusInPanelAtClose = false
        let active: Element | null = document.activeElement
        while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement
        this.#returnFocus = active instanceof HTMLElement && active !== document.body && !panel.contains(active) ? active : null
      } else {
        const inner = this.#root.activeElement
        this.#focusInPanelAtClose = !!inner && panel.contains(inner)
      }
    })

    this.#panel?.addEventListener('toggle', () => {
      const el = this.#panel as HTMLElement
      let isOpen = !el.hasAttribute('hidden')
      try {
        isOpen = el.matches(':popover-open') ?? false
      } catch { }
      this.#open.value = isOpen
      this.#syncInvoker()
      if (isOpen) {
        this.#startReposition()
      } else {
        this.#stopReposition()
        if (this.#focusInPanelAtClose) this.#restoreFocus()
      }
      this.dispatchEvent(new CustomEvent(isOpen ? 'open' : 'close', { bubbles: true }))
    })

    this.#spaceSelect.addEventListener('change', () => {
      // the colorspace setter re-renders controls itself
      this.colorspace = this.#spaceSelect!.value as ColorSpace
    })

    // Reactive effects
    this.#previewEffectCleanup = effect(() => {
      const v = this.#value.value
      const gamut = this.#gamut.value
      const contrast = this.#contrast.value
      if (this.#infoInput && this.#editingField !== this.#infoInput && this.#infoInput.value !== v) {
        this.#infoInput.value = v
      }
      if (this.#chip) this.#chip.style.setProperty('--value', v)
      if (this.#textInput && this.#editingField !== this.#textInput && this.#textInput.value !== v) {
        this.#textInput.value = v
      }
      this.#announceValue(v)
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
    const resolvedInitialSpace = !this.hasAttribute('colorspace')
      ? asColorSpace(this.getAttribute('initial-colorspace'))
      : null
    if (resolvedInitialSpace) this.#space.value = resolvedInitialSpace
    if (!this.hasAttribute('colorspace')) {
      // If we have a value attribute, the colorspace was already detected in attributeChangedCallback
      // So we should sync the attribute with the detected internal space value
      this.setAttribute('colorspace', this.#space.value)
    }

    this.#spaceSelect.value = this.#space.value

    // Normalize value on load so chroma (and other channels) are in consistent form
    // (e.g. percentage notation), matching what gencolor produces after any change.
    // parseIntoChannels is lossless, so this never changes an in-gamut color
    // (srgb/hex still clip to the sRGB gamut, as before). A
    // lowercase hex that already holds the same bytes is left exactly as
    // authored (#3366aa stays #3366aa, not #36a); anything else in hex mode
    // (red, rgb(), #ABC, #rrggbbff) is still converted to canonical hex
    if (!resolvedInitialSpace) {
      try {
        const authored = this.#value.value
        const { ch } = parseIntoChannels(this.#space.value, authored)
        const normalized = gencolor(this.#space.value, ch)
        const keep = this.#space.value === 'hex' && /^#(?:[0-9a-f]{3}){1,2}$|^#(?:[0-9a-f]{4}){1,2}$/.test(authored)
          && expandHex(authored) === expandHex(normalized)
        this.#value.value = keep ? authored : normalized
      } catch {}
    }

    this.#renderControls()
    this.#announceReady = true

    this.#defaultState ??= { value: this.#value.value, space: this.#space.value }
    if (this.#pendingRestore !== null) {
      const state = this.#pendingRestore
      this.#pendingRestore = null
      this.formStateRestoreCallback(state)
    }
    this.#formValueEffectCleanup = effect(() => {
      this.#value.value
      this.#space.value
      this.#syncFormValue()
    })
    // A <label for> later in the document doesn't exist yet while the parser
    // is still connecting this element, so look again once parsing is done
    this.#syncAccessibleName()
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.#syncAccessibleName(), { once: true })
    } else {
      queueMicrotask(() => this.#syncAccessibleName())
    }
  }

  // A property set before the element upgraded (common with frameworks)
  // shadows the class accessor; re-run it through the setter
  #upgradeProperty(prop: 'value' | 'name' | 'disabled' | 'defaultValue') {
    if (!Object.prototype.hasOwnProperty.call(this, prop)) return
    const v = (this as any)[prop]
    delete (this as any)[prop]
    ;(this as any)[prop] = v
  }

  disconnectedCallback() {
    this.#colorSchemeEffectCleanup?.()
    this.#previewEffectCleanup?.()
    this.#errorEffectCleanup?.()
    this.#areaPickerEffectCleanup?.()
    this.#formValueEffectCleanup?.()
    this.#labelObserver?.disconnect()
    this.#observedLabels = []
    this.#areaPickerGamutBoundariesEffectCleanup?.()
    this.#areaPicker?.unmount()
    this.#editingField = null
    this.#editStart = null
    this.#announceReady = false
    if (this.#announceTimeout !== null) {
      clearTimeout(this.#announceTimeout)
      this.#announceTimeout = null
    }
  }

  attributeChangedCallback(name: string, _old: string | null, value: string | null) {
    if (value === _old) return
    // Skip processing if this is from a programmatic update (avoid circular event emissions)
    if (this.#programmaticUpdate) return

    if (name === 'value' && typeof value === 'string') {
      try {
        const parsed = parse(value)
        this.#value.value = value
        this.#space.value = this.#detectSpace(value, parsed.spaceId)
        if (this.#spaceSelect) this.#spaceSelect.value = this.#space.value
      } catch { }
    }
    if (name === 'colorspace' && value) {
      this.#space.value = value as ColorSpace
      if (this.#spaceSelect) this.#spaceSelect.value = value
    }
    if (name === 'theme') {
      this.#theme.value = (value as Theme) || 'auto'
    }
    if (name === 'no-alpha') {
      this.#noAlpha.value = value !== null
      if (this.#controls) this.#renderControls()
    }
    if (name === 'aria-label') this.#syncAccessibleName()
    if (name === 'no-gamut-boundaries') {
      this.#showGamutBoundaries.value = value === null
    }
  }

  #emitChange() {
    const detail: ChangeDetail = { value: this.#value.value, colorspace: this.#space.value, gamut: this.#gamut.value }
    this.dispatchEvent(new CustomEvent<ChangeDetail>('change', { detail, bubbles: true }))
  }

  // The footer field used to be an <output>, whose implicit role="status"
  // announced the color to screen readers. An <input> doesn't, so mirror the
  // value into a live region — but only once it settles, since announcing
  // every frame of a slider or area drag is unusable. Typing is skipped
  // entirely; the field already echoes what the user entered.
  #announceValue(v: string) {
    if (!this.#valueLiveRegion || !this.#announceReady) return
    if (this.#announceTimeout !== null) clearTimeout(this.#announceTimeout)
    this.#announceTimeout = window.setTimeout(() => {
      this.#announceTimeout = null
      if (this.#editingField) return
      if (this.#valueLiveRegion) this.#valueLiveRegion.textContent = v
    }, ANNOUNCE_DELAY)
  }

  #validateAndSetColor(rawValue: string): boolean {
    const inputValue = preprocessColorInput(rawValue ?? '')
    if (!inputValue) return false

    try {
      const parsed = parse(inputValue)
      const nextSpace = this.#detectSpace(inputValue, parsed.spaceId)
      const spaceChanged = nextSpace !== this.#space.value

      // Update value and colorspace
      this.#space.value = nextSpace
      this.#value.value = inputValue
      this.setAttribute('value', inputValue)
      this.setAttribute('colorspace', nextSpace)
      if (this.#spaceSelect) this.#spaceSelect.value = nextSpace
      this.#emitChange()

      // Keep sliders and numeric inputs in step with the committed string
      if (spaceChanged) this.#renderControls()
      else this.#updateControls()
      return true
    } catch {
      return false
    }
  }

  // Put back an exact value/space pair without re-detecting the space, so an
  // abandoned edit lands back where it started even when the space came from
  // `initial-colorspace` rather than the value string
  #restoreColor(value: string, space: ColorSpace, { silent = false } = {}) {
    const spaceChanged = space !== this.#space.value
    this.#space.value = space
    this.#value.value = value
    this.#programmaticUpdate = true
    this.setAttribute('value', value)
    this.setAttribute('colorspace', space)
    this.#programmaticUpdate = false
    if (this.#spaceSelect) this.#spaceSelect.value = space
    if (!silent) this.#emitChange()
    if (spaceChanged) this.#renderControls()
    else this.#updateControls()
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
    const current = parseIntoChannels(space, this.#value.value)
    const ch = current.ch
    const updaters: Array<(ch: ChannelRecord) => void> = []

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
      // ch holds lossless channel values; the number field shows them at
      // display precision (whole percents/degrees). Only chroma is clamped (to
      // the slider's 100%, as edits do): out-of-range wide-gamut/HDR channels
      // like color(display-p3 -0.1 0.5 1.2) show their real value
      const clampsDisplay = key === 'C' && (space === 'oklch' || space === 'lch')
      const shown = (v: string | number | undefined) => {
        const n = Number(v ?? 0)
        return formatChannel(space, key, clampsDisplay ? Math.max(min, Math.min(max, n)) : n)
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
          const c0 = gencolor(space, { ...ch, ALP: '0' })
          const c1 = gencolor(space, { ...ch, ALP: '100' })
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
      num.value = isLabAB ? String(Math.abs(Number(shown(ch[key])))) : shown(ch[key])

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
        // Sign of the displayed number, so -0.4 shows +0, never −0
        signSup.textContent = Number(shown(val)) < 0 ? '−' : '+'
        numWrapper.appendChild(signSup)
        num.value = stripLeadingZeros(String(Math.abs(Number(shown(val)))))
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
        if (isLabAB && target === num) {
          // number input shows absolute value; apply sign from sup
          val = Math.abs(val) * (signSup && signSup.textContent === '−' ? -1 : 1)
        }
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
        const formatted = formatChannel(space, key, val)
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

      // Sync this control from an externally-changed value (area picker drags)
      // without rebuilding the DOM
      updaters.push((newCh) => {
        const raw = newCh[key]
        if (raw === undefined) return
        ch[key] = raw
        if (channelSignals[key]) channelSignals[key].value = String(raw)
        range.value = String(raw)
        if (isLabAB) {
          const n = Number(shown(raw))
          if (signSup) signSup.textContent = n < 0 ? '−' : '+'
          num.value = stripLeadingZeros(String(Math.abs(n)))
        } else {
          num.value = shown(raw)
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
          const c0 = gencolor(space, { ...ch, R, G, B, ALP: '0' })
          const c1 = gencolor(space, { ...ch, R, G, B, ALP: '100' })
          alphaRange.style.background = `linear-gradient(to right, ${c0}, ${c1}), var(--checker)`
        }
      })
    }

    this.#controlsUpdate = (newCh) => {
      batch(() => updaters.forEach((update) => update(newCh)))
    }
  }

  // Sync existing control inputs from the current value without rebuilding the
  // DOM — called on every area-picker change, including per-move during drags
  #updateControls() {
    if (!this.#controlsUpdate) {
      this.#renderControls()
      return
    }
    try {
      const { ch } = parseIntoChannels(this.#space.value, this.#value.value)
      this.#controlsUpdate(ch)
    } catch { }
  }
}

customElements.define('color-input', ColorInput)

declare global {
  interface HTMLElementTagNameMap { 'color-input': ColorInput }
}
