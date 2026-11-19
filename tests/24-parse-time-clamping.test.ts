import { describe, it, expect } from 'vitest'
import { parse, getColor, deltaE, inGamut, to } from 'colorjs.io/fn'
import './setup'
import { gencolor, parseIntoChannels, displayChannels } from '../src/utils/color-conversion'
import { detectGamut, parseCSSColor } from '../src/color'

// CSS Color 4 clamps some components when a color is parsed, before it is
// converted or rendered. colorjs.io's parse() keeps the raw numbers, so the
// picker used to load a different color than the browser renders.
// https://drafts.csswg.org/css-color-4/ (rgb(), hsl(), lab()/lch(),
// oklab()/oklch() ranges, and § 4.4 Missing Color Components)

/** [authored, what the browser renders it as] */
const CLAMPED: [string, string][] = [
  ['rgb(300 128 -40)', 'rgb(255 128 0)'],
  ['rgb(120% 50% -10%)', 'rgb(100% 50% 0%)'],
  ['rgba(300, 0, 0, 0.5)', 'rgb(255 0 0 / 0.5)'],
  ['hsl(30 -10% 50%)', 'hsl(30 0% 50%)'],
  ['hsl(30 50% 130%)', 'white'],
  ['hsl(30 50% -20%)', 'black'],
  ['hsl(30 130% 50%)', 'hsl(30 100% 50%)'],
  ['hwb(200 -20% 20%)', 'hwb(200 0% 20%)'],
  ['lab(120 0 0)', 'lab(100 0 0)'],
  ['lab(-10 40 -30)', 'lab(0 40 -30)'],
  ['lch(60% -30 30)', 'lch(60% 0 30)'],
  ['lch(120% 40 250)', 'lch(100% 40 250)'],
  ['oklab(-10% 0.1 -0.05)', 'oklab(0 0.1 -0.05)'],
  ['oklch(120% 0.1 30)', 'oklch(1 0.1 30)'],
  ['oklch(60% -0.1 30)', 'oklch(60% 0 30)'],
  ['oklch(60% -20% 30)', 'oklch(60% 0 30)'],
  ['rgb(255 0 0 / none)', 'rgb(255 0 0 / 0)'],
  ['oklch(60% 0.1 30 / none)', 'oklch(60% 0.1 30 / 0)'],
  ['hsl(30 50% 50% / none)', 'hsl(30 50% 50% / 0)'],
]

/** Left alone: color() is how you write HDR / out-of-gamut colors, and
 *  conversions are never clamped */
const UNCLAMPED = [
  'color(display-p3 1.2 -0.1 0.5)',
  'color(srgb 1.2 -0.1 0.5)',
  'oklch(70% 0.45 150)',
  'lch(60% 200 30)',
  'oklab(60% 0.5 -0.5)',
  'lab(50 150 -150)',
]

const SPACES = ['oklch', 'oklab', 'lab', 'display-p3', 'srgb', 'hsl'] as const

function same(a: string, b: string) {
  const A = getColor(parse(a)), B = getColor(parse(b))
  expect(deltaE(A, B, 'OK'), `${a} vs ${b}`).toBeLessThan(0.0005)
  expect(Math.abs((A.alpha ?? 1) - (B.alpha ?? 1)), `alpha of ${a} vs ${b}`).toBeLessThan(0.001)
}

describe('parse-time clamping (CSS Color 4)', () => {
  it.each(CLAMPED)('parseCSSColor(%s) is %s', (authored, rendered) => {
    const c = parseCSSColor(authored)
    same(gencolor('oklch', parseIntoChannels('oklch', authored).ch), rendered)
    expect(c.coords.every(v => Number.isNaN(v) || Number.isFinite(v))).toBe(true)
  })

  it.each(CLAMPED)('%s loads as %s in every editing space', (authored, rendered) => {
    // srgb/hex/hsl clip to sRGB by design, so they can only match in-gamut colors
    const fitsSRGB = inGamut(to(getColor(parse(rendered)), 'srgb'), 'srgb', { epsilon: 1e-6 } as any)
    for (const space of fitsSRGB ? SPACES : (['oklch', 'oklab'] as const)) {
      const { space: s, ch } = parseIntoChannels(space, authored)
      same(gencolor(s, ch), rendered)
    }
  })

  it.each(CLAMPED)('%s drags/switches from %s too (displayChannels)', (authored, rendered) => {
    for (const space of ['oklch', 'hsl'] as const) {
      const { space: s, ch } = displayChannels(space, authored)
      const { space: s2, ch: ch2 } = displayChannels(space, rendered)
      same(gencolor(s, ch), gencolor(s2, ch2))
    }
  })

  it.each(UNCLAMPED)('%s keeps its out-of-range values', authored => {
    const raw = getColor(parse(authored))
    expect(parseCSSColor(authored).coords).toEqual(raw.coords)
    const { space, ch } = parseIntoChannels('oklch', authored)
    same(gencolor(space, ch), authored)
  })

  it('`none` channels stay missing (0), only alpha none resolves to transparent', () => {
    expect(parseCSSColor('oklch(60% 0.1 none)').coords[2] ?? NaN).toBeNaN()
    expect(parseCSSColor('rgb(none 300 0)').coords.map(v => v ?? NaN)).toEqual([NaN, 1, 0])
    expect(parseCSSColor('oklch(60% 0.1 none)').alpha).toBe(1)
    expect(parseCSSColor('rgb(none 0 0 / none)').alpha).toBe(0)
    expect(parseIntoChannels('srgb', 'rgb(255 0 0 / none)').ch.ALP).toBe('0')
  })

  it('a clamped legacy rgb() is not reported as a wide-gamut color', () => {
    expect(detectGamut('rgb(300 0 0)')).toBe('srgb')
    expect(detectGamut('hsl(30 130% 50%)')).toBe('srgb')
    // color() is still wide gamut
    expect(detectGamut('color(srgb 1.2 0 0)')).not.toBe('srgb')
  })
})
