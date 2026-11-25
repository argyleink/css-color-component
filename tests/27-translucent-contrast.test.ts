import { describe, it, expect, afterEach, vi } from 'vitest'
import './setup'
import '../src/index'
import { compositeOver, contrastColor, contrastRatios, parseCSSColor } from '../src/color'

// #58 / #3: contrast was scored on the color alone, ignoring alpha, so
// `transparent` (alpha 0 black) got white text on a white panel (1:1)

describe('compositeOver', () => {
  it('passes opaque colors through untouched', () => {
    const c = parseCSSColor('oklch(60% 0.2 250)')
    expect(compositeOver(c, 'white')).toBe(c)
  })

  it('paints translucent colors over the backdrop in sRGB', () => {
    const out = compositeOver(parseCSSColor('rgb(0 0 0 / 0.25)'), 'white')
    expect(out.spaceId).toBe('srgb')
    expect(out.alpha).toBe(1)
    out.coords.forEach(v => expect(v).toBeCloseTo(0.75, 6))
  })

  it('is the backdrop itself for fully transparent colors', () => {
    const out = compositeOver(parseCSSColor('transparent'), 'rgb(18 18 18)')
    out.coords.forEach(v => expect(v).toBeCloseTo(18 / 255, 6))
  })

  it('keeps wide-gamut chroma (no clamp before mixing)', () => {
    const out = compositeOver(parseCSSColor('color(display-p3 0 1 0 / 0.5)'), 'white')
    // p3 green is outside sRGB: its red channel goes negative before mixing
    expect(out.coords[0]).toBeLessThan(0.5)
  })
})

describe('contrastColor / contrastRatios with a backdrop', () => {
  it.each([
    ['transparent', 'white', 'black'],
    ['#0000ff20', 'white', 'black'],
    ['oklch(30% 0.1 250 / 0.15)', 'white', 'black'],
    ['rgb(0 0 0 / 0.3)', 'white', 'black'],
    ['rgb(255 255 255 / 0.1)', 'black', 'white'],
    ['oklch(90% 0.1 90 / 0.2)', 'rgb(18 18 18)', 'white'],
    ['transparent', 'black', 'white'],
  ])('%s over %s reads best in %s', (value, backdrop, expected) => {
    expect(contrastColor(value, backdrop)).toBe(expected)
  })

  it('leaves opaque colors as before', () => {
    for (const v of ['#3b82f6', 'oklch(20% 0.05 250)', 'hsl(60 100% 50%)', 'black', 'white']) {
      expect(contrastColor(v, 'black')).toBe(contrastColor(v, 'white'))
    }
  })

  it('scores transparent as the backdrop, not as black', () => {
    const r = contrastRatios('transparent', 'white')
    expect(r.white).toBeCloseTo(1, 5)
    expect(r.black).toBeCloseTo(21, 5)
  })
})

describe('<color-input> text contrast for translucent values', () => {
  afterEach(() => { document.body.innerHTML = ''; vi.restoreAllMocks() })

  function make(attrs: Record<string, string>) {
    const el = document.createElement('color-input') as any
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v)
    document.body.appendChild(el)
    return el
  }
  const scores = (el: any) => [...el.shadowRoot.querySelectorAll('.contrast-scores span')].map((s: Element) => s.textContent)

  it('transparent on a light panel gets black text and honest scores', () => {
    const el = make({ theme: 'light', value: 'transparent' })
    expect(el.contrastColor).toBe('black')
    expect(el.style.getPropertyValue('--contrast')).toBe('black')
    expect(el.style.getPropertyValue('--counter')).toBe('white')
    expect(scores(el)).toEqual(['1.0:1', '21.0:1'])
  })

  it('a faint white on a dark panel gets white text', () => {
    const el = make({ theme: 'dark', value: 'rgb(255 255 255 / 0.1)' })
    expect(el.contrastColor).toBe('white')
  })

  it('re-picks when the theme flips', () => {
    const el = make({ theme: 'light', value: 'transparent' })
    expect(el.contrastColor).toBe('black')
    el.theme = 'dark'
    expect(el.contrastColor).toBe('white')
    el.theme = 'light'
    expect(el.contrastColor).toBe('black')
  })

  it('auto theme follows the OS scheme, live', () => {
    let dark = false
    const listeners = new Set<() => void>()
    vi.stubGlobal('matchMedia', (q: string) => ({
      media: q, get matches() { return dark },
      addEventListener: (_: string, fn: () => void) => listeners.add(fn),
      removeEventListener: (_: string, fn: () => void) => listeners.delete(fn),
    }))
    const el = make({ value: 'rgb(255 255 255 / 0.1)' })
    expect(el.contrastColor).toBe('black')
    dark = true
    listeners.forEach(fn => fn())
    expect(el.contrastColor).toBe('white')
    el.remove()
    expect(listeners.size).toBe(0)
    vi.unstubAllGlobals()
  })

  it('opaque values are unaffected by the theme', () => {
    const el = make({ theme: 'dark', value: '#3b82f6' })
    expect(el.contrastColor).toBe('black')
  })
})
