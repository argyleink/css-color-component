import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { parse } from 'colorjs.io/fn'
import './setup'
import '../src/index'

// color-mix(), relative color syntax and context-dependent colors used to
// be rejected because colorjs.io can't parse them. They now resolve to a
// concrete color before the picker loads them.

function makeEl(attrs: Record<string, string> = {}) {
  const el = document.createElement('color-input') as any
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v)
  document.body.appendChild(el)
  return el
}

function textInput(el: any) {
  return el.shadowRoot.querySelector('.text-input') as HTMLInputElement
}

// jsdom doesn't compute colors, so stand in for the browser on probe spans
function mockComputedColor(color: string) {
  const real = window.getComputedStyle
  return vi.spyOn(window, 'getComputedStyle').mockImplementation(((node: Element, pseudo?: string | null) => {
    if (node instanceof HTMLSpanElement && node.hidden) return { color } as CSSStyleDeclaration
    return real.call(window, node, pseudo)
  }) as typeof window.getComputedStyle)
}

describe('CSS Color 5 inputs', () => {
  beforeEach(() => { document.body.innerHTML = '' })
  afterEach(() => { vi.restoreAllMocks() })

  it('loads color-mix() through the value property as a concrete color', () => {
    const el = makeEl()
    const changes: any[] = []
    el.addEventListener('change', (e: CustomEvent) => changes.push(e.detail))
    expect(() => { el.value = 'color-mix(in oklch, red, blue)' }).not.toThrow()
    expect(el.value.startsWith('oklch(')).toBe(true)
    expect(() => parse(el.value)).not.toThrow()
    expect(el.colorspace).toBe('oklch')
    expect(el.getAttribute('value')).toBe(el.value)
    expect(changes).toHaveLength(1)
  })

  it('loads relative color syntax from the value attribute and reflects the concrete color', () => {
    const el = makeEl({ value: 'lab(from red l calc(a * -1) b)' })
    expect(el.colorspace).toBe('lab')
    expect(el.getAttribute('value')!.startsWith('lab(')).toBe(true)
    expect(el.getAttribute('value')).not.toContain('from')
    const c = parse(el.value)
    expect(c.coords[1]).toBeLessThan(-70)
  })

  it('parsed markup loads the resolved color into the controls, not the default', () => {
    // Reflecting the resolved attribute during an upgrade flushes the queued
    // connectedCallback inside attributeChangedCallback; the color must be set first
    document.body.innerHTML = '<color-input value="color-mix(in oklch, red, blue)"></color-input>'
    const el = document.querySelector('color-input') as any
    expect(el.value).toBe('oklch(53.998% 71.362% 326.643)')
    const l = el.shadowRoot.querySelector('input[type=range].ch-l') as HTMLInputElement | null
    if (l) expect(Math.round(Number(l.value))).toBe(54)
  })

  it('accepts color-mix() typed into the text field', () => {
    const el = makeEl()
    const input = textInput(el)
    input.value = 'color-mix(in srgb, red, blue)'
    input.dispatchEvent(new Event('input'))
    expect(el.hasAttribute('data-error')).toBe(false)
    expect(el.value).toBe('color(srgb 0.5 0 0.5)')
    expect(el.colorspace).toBe('srgb')
  })

  it('keeps an HDR mix result instead of gamut mapping it', () => {
    const el = makeEl()
    let gamut = ''
    el.addEventListener('change', (e: CustomEvent) => { gamut = e.detail.gamut })
    el.value = 'color-mix(in display-p3, color(display-p3 0 1 0), color(display-p3 0 0.9 0))'
    expect(el.colorspace).toBe('display-p3')
    expect(gamut).toBe('p3')
  })

  it('marks invalid color-mix() as an error without changing the color', () => {
    const el = makeEl({ value: '#ff6600' })
    const before = el.value
    const input = textInput(el)
    input.value = 'color-mix(in srgb, red 0%, blue 0%)'
    input.dispatchEvent(new Event('input'))
    expect(el.hasAttribute('data-error')).toBe(true)
    expect(el.value).toBe(before)
  })

  it('resolves currentcolor against the element through computed style', () => {
    const el = makeEl()
    mockComputedColor('rgb(10, 20, 30)')
    el.value = 'currentcolor'
    expect(el.value).toBe('rgb(10, 20, 30)')
    expect(el.colorspace).toBe('srgb')
  })

  it('ignores a context-dependent color it cannot resolve, without throwing', () => {
    const el = makeEl({ value: '#ff6600' })
    mockComputedColor('')
    expect(() => { el.value = 'var(--nope)' }).not.toThrow()
    expect(el.value).toBe('#ff6600')
  })

  it('holds a context-dependent attribute until the element connects', () => {
    const el = document.createElement('color-input') as any
    el.setAttribute('value', 'currentcolor')
    mockComputedColor('rgb(1, 2, 3)')
    document.body.appendChild(el)
    // connect normalizes the loaded color into its space's own notation
    expect(el.colorspace).toBe('srgb')
    const [r, g, b] = parse(el.value).coords as number[]
    expect([r * 255, g * 255, b * 255].map(Math.round)).toEqual([1, 2, 3])
  })

  it('resolves defaultValue so a form reset restores the concrete color', () => {
    const el = makeEl()
    el.defaultValue = 'oklch(from red l c calc(h + 180))'
    el.value = '#000'
    el.formResetCallback()
    expect(el.value.startsWith('oklch(')).toBe(true)
    expect(el.value).not.toContain('from')
  })
})
