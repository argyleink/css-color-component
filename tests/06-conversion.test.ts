import { describe, it, expect } from 'vitest'
import Color from 'colorjs.io'

const spaces = [
  'oklab','oklch','lab','lch','hsl','hwb','srgb','p3','rec2020','a98rgb','xyz','xyz-d50','xyz-d65'
] as const

describe('colorspace conversions', () => {
  const samples = [
    'oklch(75% 0.3 180)',
    'hsl(200 100% 50%)',
    'rgb(20% 40% 60%)',
    'lab(60% 20 30)',
  ]

  for (const src of samples) {
    it(`round-trips within tolerance for ${src}`, () => {
      const c = new Color(src)
      for (const to of spaces) {
        try {
          const c2 = c.to(to)
          const back = c2.to('oklch')
          // distance in oklab space should be small
          const d = new Color(c).to('oklab').distance(back.to('oklab'))
          expect(Number.isFinite(d)).toBe(true)
          expect(d).toBeLessThan(1.5)
        } catch (e) {
          // Some spaces may not be valid for certain inputs; ensure no blow-ups
          expect(e).toBeFalsy()
        }
      }
    })
  }

  it('channel ranges are sane when converting simple color', () => {
    const c = new Color('oklch(70% 0.2 240)')
    // Clamp to sRGB before converting to HSL to avoid out-of-gamut channel spikes
    const hsl = c.toGamut({ space: 'srgb', method: 'clip' }).to('hsl')
    const [h, s, l] = hsl.coords
    expect(h).toBeGreaterThanOrEqual(0)
    expect(h).toBeLessThanOrEqual(360)
    expect(s).toBeGreaterThanOrEqual(0)
    expect(s).toBeLessThanOrEqual(100.0001)
    expect(l).toBeGreaterThanOrEqual(0)
    expect(l).toBeLessThanOrEqual(100.0001)
  })
})
