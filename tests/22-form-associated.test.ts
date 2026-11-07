import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import './setup'
import '../src/index'

// jsdom implements attachInternals() but none of the form-association
// plumbing (setFormValue, form callbacks), so these tests record what the
// component hands to ElementInternals and invoke the lifecycle callbacks the
// way the HTML spec says a browser does (HTML § 4.13.7.4, "Form-associated
// custom elements"). The end-to-end behavior — FormData, <form> submission,
// <fieldset disabled>, <label for> — was verified in Chromium.

type Call = { value: unknown; state: unknown }
const calls = new WeakMap<object, Call[]>()
// Reach the prototype through an instance: the ElementInternals global isn't
// exposed on every Node version vitest's jsdom env runs under (Node 20 in CI)
customElements.define('internals-probe', class extends HTMLElement {})
const proto = Object.getPrototypeOf((document.createElement('internals-probe') as any).attachInternals())
const original = proto?.setFormValue

beforeAll(() => {
  proto.setFormValue = function (value: unknown, state?: unknown) {
    const list = calls.get(this) ?? []
    list.push({ value, state })
    calls.set(this, list)
  }
})
afterAll(() => {
  if (original) proto.setFormValue = original
  else delete proto.setFormValue
})
afterEach(() => { document.body.innerHTML = '' })

// The element keeps its ElementInternals private; capture it as it attaches
function mount(attrs: Record<string, string> = {}) {
  let internals: any
  const attach = HTMLElement.prototype.attachInternals
  HTMLElement.prototype.attachInternals = function () {
    internals = attach.call(this)
    return internals
  }
  const el = document.createElement('color-input') as any
  HTMLElement.prototype.attachInternals = attach
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v)
  document.body.appendChild(el)
  const last = () => { const list = calls.get(internals) ?? []; return list[list.length - 1] }
  return { el, internals, last }
}

const shadow = (el: HTMLElement) => el.shadowRoot!

describe('form-associated custom element', () => {
  it('opts into form association (HTML § 4.13.7.4: static formAssociated = true)', () => {
    expect((customElements.get('color-input') as any).formAssociated).toBe(true)
  })

  it('submits its value: setFormValue() gets the current color on connect', () => {
    const { el, last } = mount({ value: 'rebeccapurple', name: 'brand' })
    expect(last()?.value).toBe(el.value)
    expect(JSON.parse(last()!.state as string)).toEqual({ value: el.value, colorspace: el.colorspace })
  })

  it('keeps the submission value in step with edits', () => {
    const { el, last } = mount({ value: '#ff0000' })
    el.value = 'hsl(120 50% 50%)'
    expect(last()?.value).toBe(el.value)
    expect(JSON.parse(last()!.state as string).colorspace).toBe('hsl')

    const text = shadow(el).querySelector<HTMLInputElement>('.text-input')!
    text.value = '#00ff00'
    text.dispatchEvent(new Event('input'))
    expect(last()?.value).toBe('#00ff00')
  })

  it('reflects name and disabled like <input>', () => {
    const { el } = mount()
    expect(el.name).toBe('')
    el.name = 'accent'
    expect(el.getAttribute('name')).toBe('accent')
    el.disabled = true
    expect(el.hasAttribute('disabled')).toBe(true)
    el.disabled = false
    expect(el.hasAttribute('disabled')).toBe(false)
  })

  it('formResetCallback restores the color and space it connected with', () => {
    const { el, last } = mount({ value: '#3366cc' })
    const start = { value: el.value, colorspace: el.colorspace }
    expect(el.defaultValue).toBe(start.value)

    el.colorspace = 'oklch'
    el.value = 'oklch(50% 50% 30)'
    let changes = 0
    el.addEventListener('change', () => changes++)

    el.formResetCallback()
    expect(el.value).toBe(start.value)
    expect(el.colorspace).toBe(start.colorspace)
    expect(shadow(el).querySelector<HTMLInputElement>('.text-input')!.value).toBe(start.value)
    expect(last()?.value).toBe(start.value)
    expect(changes).toBe(1)

    // Already at the default: nothing to announce
    el.formResetCallback()
    expect(changes).toBe(1)
  })

  it('defaultValue is settable and becomes the reset target', () => {
    const { el } = mount({ value: '#3366cc' })
    el.defaultValue = 'hsl(10 80% 40%)'
    el.formResetCallback()
    expect(el.value).toBe('hsl(10 80% 40%)')
    expect(el.colorspace).toBe('hsl')
  })

  it('formDisabledCallback disables the inner controls and blocks opening', async () => {
    const { el } = mount()
    await new Promise((r) => setTimeout(r)) // let the popover polyfill hide the panel
    const trigger = shadow(el).querySelector<HTMLButtonElement>('button.trigger')!
    const text = shadow(el).querySelector<HTMLInputElement>('.text-input')!
    const panel = shadow(el).querySelector<HTMLElement>('.panel')!
    expect(panel.hasAttribute('hidden')).toBe(true)

    el.show()
    expect(panel.hasAttribute('hidden')).toBe(false)

    el.formDisabledCallback(true)
    expect(trigger.disabled).toBe(true)
    expect(text.disabled).toBe(true)
    expect((panel as any).inert).toBe(true)
    expect(panel.hasAttribute('hidden')).toBe(true)

    el.show()
    expect(panel.hasAttribute('hidden')).toBe(true)

    el.formDisabledCallback(false)
    expect(trigger.disabled).toBe(false)
    expect(text.disabled).toBe(false)
    expect((panel as any).inert).toBe(false)
    el.show()
    expect(panel.hasAttribute('hidden')).toBe(false)
  })

  it('formStateRestoreCallback restores saved state, including the editing space, silently', () => {
    const { el, last } = mount({ value: '#000' })
    let changes = 0
    el.addEventListener('change', () => changes++)
    el.formStateRestoreCallback(JSON.stringify({ value: '#123456', colorspace: 'hsl' }), 'restore')
    expect(el.value).toBe('#123456')
    expect(el.colorspace).toBe('hsl')
    expect(last()?.value).toBe('#123456')
    // Native controls fire no events when the UA restores them
    expect(changes).toBe(0)
    // ...and the reset target is still the authored color
    el.formResetCallback()
    expect(el.value).toBe('#000')
  })

  it('a restore that arrives before the first connect is applied after the reset target is captured', () => {
    const el = document.createElement('color-input') as any
    el.setAttribute('value', '#3366cc')
    el.formStateRestoreCallback(JSON.stringify({ value: '#123456', colorspace: 'hex' }), 'restore')
    document.body.appendChild(el)
    expect(el.value).toBe('#123456')
    el.formResetCallback()
    expect(el.value).toBe('#36c')
  })

  it('formStateRestoreCallback accepts a bare color (autofill) and ignores junk', () => {
    const { el } = mount({ value: '#000' })
    el.formStateRestoreCallback('oklch(60% 40% 200)', 'autocomplete')
    expect(el.value).toBe('oklch(60% 40% 200)')
    expect(el.colorspace).toBe('oklch')

    el.formStateRestoreCallback('not a color', 'autocomplete')
    el.formStateRestoreCallback(JSON.stringify({ value: 'junk', colorspace: 'hsl' }), 'restore')
    el.formStateRestoreCallback(null, 'restore')
    expect(el.value).toBe('oklch(60% 40% 200)')
  })

  // The popover polyfill hides panels from a MutationObserver (async), so
  // count the component's `open` events instead of reading `hidden`
  const opens = (el: HTMLElement) => {
    const seen = { n: 0 }
    el.addEventListener('open', () => seen.n++)
    return seen
  }

  it('a click targeting the host (what label activation does) opens the picker', async () => {
    const { el } = mount()
    await new Promise((r) => setTimeout(r)) // let the polyfill hide the panel
    const seen = opens(el)
    el.click()
    expect(seen.n).toBe(1)
  })

  it('a trigger click opens exactly once (host listener ignores shadow clicks)', async () => {
    const { el } = mount()
    await new Promise((r) => setTimeout(r))
    const seen = opens(el)
    shadow(el).querySelector<HTMLButtonElement>('button.trigger')!.click()
    expect(seen.n).toBe(1)
  })

  it('clicks that start inside the shadow root are left to the inner controls', async () => {
    const { el } = mount()
    await new Promise((r) => setTimeout(r))
    const seen = opens(el)
    shadow(el).querySelector<HTMLInputElement>('.text-input')!.click()
    expect(seen.n).toBe(0)
  })

  it('a disabled host ignores label activation', async () => {
    const { el } = mount()
    await new Promise((r) => setTimeout(r))
    const seen = opens(el)
    el.formDisabledCallback(true)
    el.click()
    expect(seen.n).toBe(0)
  })

  it('names the shadow controls from associated labels, skipping nested controls', () => {
    const { el, internals } = mount()
    const label = document.createElement('label')
    label.append('  Brand\n color ', el, document.createElement('select'))
    label.querySelector('select')!.append(new Option('Small'))
    document.body.append(label)
    // jsdom doesn't compute ElementInternals.labels; hand it the association
    Object.defineProperty(internals, 'labels', { configurable: true, get: () => label.ownerDocument.querySelectorAll('label') })
    el.dispatchEvent(new FocusEvent('focusin'))
    expect(shadow(el).querySelector('button.trigger')!.getAttribute('aria-label')).toBe('Brand color, open color picker')
    expect(shadow(el).querySelector('.text-input')!.getAttribute('aria-label')).toBe('Brand color')
  })

  it('upgrades properties set before the element was defined', () => {
    const el = document.createElement('color-input') as any
    // simulate pre-upgrade own properties shadowing the accessors
    const own = (key: string, value: unknown) =>
      Object.defineProperty(el, key, { value, writable: true, configurable: true, enumerable: true })
    own('disabled', true)
    own('name', 'brand')
    own('value', 'oklch(60% 40% 200)')
    own('defaultValue', 'hsl(10 80% 40%)')
    document.body.appendChild(el)
    expect(el.hasAttribute('disabled')).toBe(true)
    expect(el.getAttribute('name')).toBe('brand')
    expect(el.value).toBe('oklch(60% 40% 200)')
    for (const key of ['disabled', 'name', 'value', 'defaultValue']) {
      expect(Object.prototype.hasOwnProperty.call(el, key)).toBe(false)
    }
    el.formResetCallback()
    expect(el.value).toBe('hsl(10 80% 40%)')
  })

  it('re-reads labels after connect, for a <label for> that comes later in the document', async () => {
    const { el, internals } = mount()
    const label = document.createElement('label')
    label.innerHTML = 'Accent <span aria-hidden="true">*</span>'
    document.body.append(label)
    Object.defineProperty(internals, 'labels', { configurable: true, get: () => document.querySelectorAll('label') })
    // the re-sync connectedCallback queued (no focus involved)
    await Promise.resolve()
    expect(shadow(el).querySelector('button.trigger')!.getAttribute('aria-label')).toBe('Accent, open color picker')
  })

  it('carries the host aria-label into the shadow controls', () => {
    const { el } = mount({ 'aria-label': 'Brand color' })
    const trigger = shadow(el).querySelector('button.trigger')!
    const text = shadow(el).querySelector('.text-input')!
    expect(trigger.getAttribute('aria-label')).toBe('Brand color, open color picker')
    expect(text.getAttribute('aria-label')).toBe('Brand color')

    el.removeAttribute('aria-label')
    expect(trigger.getAttribute('aria-label')).toBe('Open color picker')
    expect(text.getAttribute('aria-label')).toBe('Color value')
  })
})
