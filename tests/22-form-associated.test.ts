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
const proto = (globalThis as any).ElementInternals?.prototype
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
    expect(el.type).toBe('color-input')
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

  it('formDisabledCallback disables the inner controls and blocks opening', () => {
    const { el } = mount()
    const trigger = shadow(el).querySelector<HTMLButtonElement>('button.trigger')!
    const text = shadow(el).querySelector<HTMLInputElement>('.text-input')!
    const panel = shadow(el).querySelector<HTMLElement>('.panel')!

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

  it('formStateRestoreCallback restores saved state, including the editing space', () => {
    const { el } = mount({ value: '#000' })
    el.formStateRestoreCallback(JSON.stringify({ value: '#123456', colorspace: 'hsl' }), 'restore')
    expect(el.value).toBe('#123456')
    expect(el.colorspace).toBe('hsl')
  })

  it('formStateRestoreCallback accepts a bare color (autofill) and ignores junk', () => {
    const { el } = mount({ value: '#000' })
    el.formStateRestoreCallback('oklch(60% 40% 200)', 'autocomplete')
    expect(el.value).toBe('oklch(60% 40% 200)')
    expect(el.colorspace).toBe('oklch')

    el.formStateRestoreCallback('not a color', 'autocomplete')
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
