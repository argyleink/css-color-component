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

  it.each([
    ['#3b82f6', 'black'], ['oklch(20% 0.05 250)', 'white'], ['hsl(60 100% 50%)', 'black'],
    ['black', 'white'], ['white', 'black'], ['color(display-p3 0 0 1)', 'white'],
  ])('opaque %s still reads best in %s, on either backdrop', (value, expected) => {
    expect(contrastColor(value)).toBe(expected)
    expect(contrastColor(value, 'white')).toBe(expected)
    expect(contrastColor(value, 'black')).toBe(expected)
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

  it("uses the panel's painted background when the browser reports one", () => {
    // jsdom resolves no Canvas color; stand in for a ::part(panel) { background: #121212 }
    const real = window.getComputedStyle
    vi.spyOn(window, 'getComputedStyle').mockImplementation(((el: Element, pseudo?: string | null) => {
      const cs = real(el, pseudo)
      if (!(el as HTMLElement).classList?.contains('panel')) return cs
      return new Proxy(cs, { get: (t, k) => k === 'backgroundColor' ? 'rgb(18, 18, 18)' : Reflect.get(t, k) })
    }) as typeof window.getComputedStyle)
    // theme light would fall back to a white backdrop; the real surface is dark
    const el = make({ theme: 'light', value: 'transparent' })
    expect(el.contrastColor).toBe('white')
  })

  // Stand in for the panel's computed background (jsdom resolves none)
  function stubPanelBg(get: () => string) {
    const real = window.getComputedStyle
    vi.spyOn(window, 'getComputedStyle').mockImplementation(((el: Element, pseudo?: string | null) => {
      const cs = real(el, pseudo)
      if (!(el as HTMLElement).classList?.contains('panel')) return cs
      return new Proxy(cs, { get: (t, k) => k === 'backgroundColor' ? get() : Reflect.get(t, k) })
    }) as typeof window.getComputedStyle)
  }

  it('a glassy (translucent) panel is composited, not ignored', () => {
    // ::part(panel) { background: rgb(20 20 20 / .85) } in the light theme
    // paints a dark surface; ignoring it picked black text at 1.6:1
    stubPanelBg(() => 'rgba(20, 20, 20, 0.85)')
    const el = make({ theme: 'light', value: 'transparent' })
    expect(el.contrastColor).toBe('white')
    expect(scores(el)[0]).toBe('11.9:1')
  })

  it('a fully transparent panel falls back to the theme surface', () => {
    stubPanelBg(() => 'rgba(0, 0, 0, 0)')
    expect(make({ theme: 'light', value: 'transparent' }).contrastColor).toBe('black')
  })

  it('re-picks when page CSS repaints the panel (no theme change)', () => {
    let bg = 'rgb(255, 255, 255)'
    stubPanelBg(() => bg)
    const el = make({ theme: 'light', value: 'transparent' })
    expect(el.contrastColor).toBe('black')
    // a class-toggled dark mode: the panel's 1ms background transition ends
    bg = 'rgb(17, 17, 17)'
    const panel = el.shadowRoot.querySelector('.panel')
    const ev = new Event('transitionend') as any
    ev.propertyName = 'background-color'
    panel.dispatchEvent(ev)
    expect(el.contrastColor).toBe('white')
    // other properties' transitions (the popover's opacity) don't re-read
    bg = 'rgb(255, 255, 255)'
    const other = new Event('transitionend') as any
    other.propertyName = 'opacity'
    panel.dispatchEvent(other)
    expect(el.contrastColor).toBe('white')
  })

  it('opaque values are unaffected by the theme', () => {
    const el = make({ theme: 'dark', value: '#3b82f6' })
    expect(el.contrastColor).toBe('black')
  })
})
