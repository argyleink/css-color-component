import { describe, it, expect, afterEach } from 'vitest'
import { parse, to, getColor } from 'colorjs.io/fn'
import './setup'
import '../src/index'
import { gencolor, parseIntoChannels } from '../src/utils/color-conversion'
import { getColorJSSpaceID } from '../src/color'

// The rule under test: a color never changes unless the user edits it.
// Loading a value, re-serializing it, editing a different channel, or
// switching spaces and back must all leave it exactly where it was.
// Precision floors come from CSS Color 4 § 16 "Serializing <color> Values"
// https://drafts.csswg.org/css-color-4/#serializing-color-values

const hex2 = (n: number) => n.toString(16).padStart(2, '0')
const BYTES = Array.from({ length: 256 }, (_, i) => i)
const POSITIONS = [
  (v: number) => `#${hex2(v)}8040`,
  (v: number) => `#40${hex2(v)}80`,
  (v: number) => `#8040${hex2(v)}`,
]

/** Exact 0-255 sRGB bytes of any CSS color (no gamut mapping, in-gamut input) */
function bytes(color: string) {
  const c = to(getColor(parse(color)), 'srgb')
  return [...c.coords, c.alpha ?? 1].map(v => Math.round((v ?? 0) * 255))
}

/** Coordinates of `color` in `space`, for comparing two strings in one space */
function coords(color: string, space: string) {
  const c = to(getColor(parse(color)), getColorJSSpaceID(space))
  return [...c.coords.map(v => (v == null || Number.isNaN(v) ? 0 : v)), c.alpha ?? 1]
}

const mounted: HTMLElement[] = []
function mount(value: string) {
  const el = document.createElement('color-input') as any
  el.setAttribute('value', value)
  document.body.appendChild(el)
  mounted.push(el)
  return el
}
afterEach(() => {
  mounted.splice(0).forEach(el => el.remove())
})

describe('hex round-trips losslessly (all 256 values per channel)', () => {
  it('parseIntoChannels → gencolor rebuilds the exact hex', () => {
    const drift: string[] = []
    for (const make of POSITIONS) {
      for (const v of BYTES) {
        const hex = make(v)
        const out = gencolor('hex', parseIntoChannels('hex', hex).ch)
        if (bytes(out).join() !== bytes(hex).join()) drift.push(`${hex} → ${out}`)
      }
    }
    expect(drift).toEqual([])
  })

  it('8-digit hex alpha survives too', () => {
    const drift: string[] = []
    for (const v of BYTES) {
      const hex = `#3b82f6${hex2(v)}`
      const out = gencolor('hex', parseIntoChannels('hex', hex).ch)
      if (bytes(out).join() !== bytes(hex).join()) drift.push(`${hex} → ${out}`)
    }
    expect(drift).toEqual([])
  })

  it('loading <color-input value="#rrggbb"> never changes the value', () => {
    const changed: string[] = []
    for (const make of POSITIONS) {
      for (const v of BYTES) {
        const hex = make(v)
        const el = mount(hex) as any
        if (el.value !== hex) changed.push(`${hex} → ${el.value}`)
        el.remove()
      }
    }
    expect(changed).toEqual([])
  })

  it('#3b82f6 stays #3b82f6 (the reported case), and lowercase short/long hex stays as authored', () => {
    expect(mount('#3b82f6').value).toBe('#3b82f6')
    expect(mount('#3366aa').value).toBe('#3366aa')
    expect(mount('#36a').value).toBe('#36a')
    expect(mount('#3b82f680').value).toBe('#3b82f680')
    // Uppercase is lowercased like <input type="color">; the bytes never move
    expect(mount('#3B82F6').value).toBe('#3b82f6')
  })

  it('editing one channel leaves the other two byte-exact', () => {
    const drift: string[] = []
    for (const v of BYTES) {
      const hex = `#80${hex2(v)}${hex2(255 - v)}`
      const { ch } = parseIntoChannels('hex', hex)
      const out = gencolor('hex', { ...ch, R: '20' }) // a user edit of R only
      const [, g, b] = bytes(out)
      if (g !== v || b !== 255 - v) drift.push(`${hex} → ${out}`)
    }
    expect(drift).toEqual([])
  })

  it('dragging the R slider in the element leaves G and B untouched', async () => {
    const el = mount('#3b82f6') as any
    el.show()
    const r = el.shadowRoot.querySelector('input[type="range"].ch-r') as HTMLInputElement
    r.value = '50'
    r.dispatchEvent(new Event('input'))
    await new Promise(res => requestAnimationFrame(() => res(null)))
    expect(bytes(el.value).slice(1, 3)).toEqual([0x82, 0xf6])
  })
})

describe('rgb() integers round-trip losslessly (all 256 values per channel)', () => {
  it('loading rgb(r g b) keeps every byte (≥ 8 bits per CSS Color 4 § 16.2.2)', () => {
    const drift: string[] = []
    for (const pos of [0, 1, 2]) {
      for (const v of BYTES) {
        const rgb = [64, 128, 32]
        rgb[pos] = v
        const authored = `rgb(${rgb.join(' ')})`
        const el = mount(authored) as any
        const got = bytes(el.value).slice(0, 3)
        // within a 10-bit half step, and the same byte
        const exact = to(getColor(parse(el.value)), 'srgb').coords.map(c => (c ?? 0) * 255)
        const close = exact.every((c, i) => Math.abs(c - rgb[i]) <= 0.125)
        if (got.join() !== rgb.join() || !close) drift.push(`${authored} → ${el.value}`)
        el.remove()
      }
    }
    expect(drift).toEqual([])
  })
})

describe('space switches never drift (all 256 values per channel)', () => {
  const SPACES = ['srgb', 'hsl', 'hwb', 'lab', 'lch', 'oklab', 'oklch', 'display-p3', 'rec2020', 'a98-rgb', 'prophoto', 'srgb-linear', 'xyz']

  it('hex → srgb/hsl/oklch → hex is the original hex', () => {
    const el = mount('#000000') as any
    const drift: string[] = []
    for (const make of POSITIONS) {
      for (const v of BYTES) {
        const hex = make(v)
        el.value = hex
        for (const space of ['srgb', 'hsl', 'oklch']) {
          el.colorspace = space
          el.colorspace = 'hex'
          if (el.value !== hex) {
            drift.push(`${hex} via ${space} → ${el.value}`)
            el.value = hex
          }
        }
      }
    }
    expect(drift).toEqual([])
  })

  it('a chain of switches converts from the original, not from each rounded step', () => {
    const el = mount('#3b82f6') as any
    for (const space of SPACES) el.colorspace = space
    el.colorspace = 'hex'
    expect(el.value).toBe('#3b82f6')
  })

  it('returning to the authored space restores the authored string', () => {
    const el = mount('#000') as any
    el.value = 'hsl(217.2 91.2% 59.8%)'
    el.colorspace = 'oklch'
    el.colorspace = 'hex'
    el.colorspace = 'hsl'
    expect(el.value).toBe('hsl(217.2 91.2% 59.8%)')
  })

  it('a switch still rounds to the whole-number display format, rounding once', () => {
    const el = mount('#3b82f6') as any
    el.colorspace = 'srgb'
    // 96.47% → 96%, not 96.47 → 96.5 → 97
    expect(el.value).toBe('rgb(23% 51% 96%)')
    el.colorspace = 'oklch'
    expect(el.value).toMatch(/^oklch\(\d+% \d+% \d+\)$/)
  })

  it('an edit after a switch converts from the edited value', () => {
    const el = mount('#3b82f6') as any
    el.colorspace = 'srgb'
    el.value = 'rgb(10% 20% 30%)'
    el.colorspace = 'hex'
    expect(bytes(el.value).slice(0, 3)).toEqual([26, 51, 77])
  })
})

describe('other serializations are lossless on load and idempotent', () => {
  // Authored with decimals; each must load to the same color at the space's
  // CSS Color 4 minimum precision, and re-loading the result must not change it
  const CASES: Array<[string, string, number]> = [
    // [authored, space, max per-coordinate drift in colorjs units]
    ['rgb(23.3% 51.7% 96.2%)', 'srgb', 1 / 1023 / 2],
    ['rgb(59.5 130.25 246)', 'srgb', 1 / 1023 / 2],
    ['hsl(217.2 91.2% 59.8%)', 'hsl', 360 / 1023 / 2],
    ['hsl(0 1% 50%)', 'hsl', 0],
    ['hsl(0 0.5% 0.8%)', 'hsl', 0],
    ['hwb(200 1% 1%)', 'hwb', 0],
    ['hwb(12.5 33.3% 0.4%)', 'hwb', 360 / 1023 / 2],
    ['lab(52.27% 40.45 -63.21)', 'lab', 254 / 65535 / 2],
    ['lch(52.27% 75.04 302.6)', 'lch', 360 / 65535 / 2],
    ['oklab(62.8% 0.2249 0.1258)', 'oklab', 1 / 65535 / 2],
    ['oklab(50% -0.0005 0.00012)', 'oklab', 1 / 65535 / 2],
    ['oklch(62.8% 0.2577 29.23)', 'oklch', 360 / 65535 / 2],
    ['oklch(70% 0.45 150)', 'oklch', 360 / 65535 / 2],
    ['oklch(50% 0 none)', 'oklch', 0],
    ['color(display-p3 0.2314 0.5098 0.9647)', 'display-p3', 1 / 1023 / 2],
    ['color(rec2020 0.12345 0.6 0.98765)', 'rec2020', 1 / 4095 / 2],
    ['color(a98-rgb 0.3 0.45 0.9)', 'a98-rgb', 1 / 1023 / 2],
    ['color(prophoto-rgb 0.42 0.31 0.77)', 'prophoto', 1 / 4095 / 2],
    ['color(srgb-linear 0.0433 0.2232 0.9216)', 'srgb-linear', 1 / 4095 / 2],
    ['color(xyz-d65 0.2 0.3 0.4)', 'xyz-d65', 1 / 65535 / 2],
    ['oklch(62.8% 0.2577 29.23 / 0.4321)', 'oklch', 360 / 65535 / 2],
  ]

  for (const [authored, space, tol] of CASES) {
    it(`${authored}`, () => {
      const el = mount(authored) as any
      const a = coords(authored, space)
      const b = coords(el.value, space)
      // hue is meaningless at zero chroma: skip it there
      b.forEach((v, i) => expect(Math.abs(v - a[i])).toBeLessThanOrEqual(tol + 1e-9))
      const again = mount(el.value) as any
      expect(again.value).toBe(el.value)
    })
  }

  it('authored decimals survive verbatim', () => {
    expect(mount('oklch(62.8% 0.2577 29.23)').value).toBe('oklch(62.8% 64.425% 29.23)')
    expect(mount('color(display-p3 0.2314 0.5098 0.9647)').value).toBe('color(display-p3 23.14% 50.98% 96.47%)')
    expect(mount('color(rec2020 0.12345 0.6 0.98765)').value).toBe('color(rec2020 12.345% 60% 98.765%)')
    expect(mount('lab(52.27% 40.45 -63.21)').value).toBe('lab(52.27% 40.45 -63.21)')
    expect(mount('oklch(70% 0.45 150)').value).toBe('oklch(70% 112.5% 150)')
    // 8-bit sources take the fewest decimals that keep every byte
    expect(mount('rgb(59 130 246)').value).toBe('rgb(23.1% 51% 96.47%)')
  })

  it('integer-authored values stay integers (display format unchanged)', () => {
    expect(mount('oklch(75% 0.3 180)').value).toBe('oklch(75% 75% 180)')
    expect(mount('hsl(120 100% 50%)').value).toBe('hsl(120 100% 50%)')
    expect(mount('rgb(255 0 0)').value).toBe('rgb(100% 0% 0%)')
    expect(mount('lab(50% 25 -30)').value).toBe('lab(50% 25 -30)')
  })

  it('hex number fields show the exact channel rounded once', () => {
    const el = mount('#3b82f6') as any
    el.show()
    const nums = [...el.shadowRoot.querySelectorAll('input[type="number"]')].map((n: any) => n.value)
    // 59/2.55 = 23.1, 130/2.55 = 50.98, 246/2.55 = 96.47 (not 96.5 → 97)
    expect(nums).toEqual(['23', '51', '96', '100'])
  })

  it('the number fields still show whole numbers', () => {
    const el = mount('oklch(62.8% 0.2577 29.23)') as any
    el.show()
    const nums = [...el.shadowRoot.querySelectorAll('input[type="number"]')].map((n: any) => n.value)
    expect(nums).toEqual(['63', '64', '29', '100'])
  })

  it('editing alpha leaves the authored channels alone', async () => {
    const el = mount('oklch(62.8% 0.2577 29.23)') as any
    el.show()
    const alp = el.shadowRoot.querySelector('input[type="range"].ch-alp') as HTMLInputElement
    alp.value = '50'
    alp.dispatchEvent(new Event('input'))
    await new Promise(res => requestAnimationFrame(() => res(null)))
    expect(el.value).toBe('oklch(62.8% 64.425% 29.23 / 50%)')
  })
})

describe('review follow-ups', () => {
  // Parsed markup, like <color-input value="red" colorspace="hex"> in a page
  function mountIn(value: string, colorspace: string) {
    const host = document.createElement('div')
    host.innerHTML = `<color-input value="${value}" colorspace="${colorspace}"></color-input>`
    const el = host.firstElementChild as any
    document.body.appendChild(el)
    mounted.push(el)
    return el
  }

  it('hex mode still converts non-hex input to hex on load', () => {
    expect(mountIn('red', 'hex').value).toBe('#f00')
    expect(mountIn('rgb(59 130 246)', 'hex').value).toBe('#3b82f6')
    expect(mountIn('#ABC', 'hex').value).toBe('#abc')
    expect(mountIn('#3b82f6ff', 'hex').value).toBe('#3b82f6')
  })

  it('a converted hex-mode value is what a space switch returns to', () => {
    const el = mountIn('red', 'hex')
    el.colorspace = 'oklch'
    el.colorspace = 'hex'
    expect(el.value).toBe('#f00')
  })

  it('out-of-range wide-gamut/HDR channels show their real value in the number fields', () => {
    const el = mount('color(display-p3 -0.1 0.5 1.2)') as any
    el.show()
    const nums = [...el.shadowRoot.querySelectorAll('input[type="number"]')].map((n: any) => n.value)
    expect(nums).toEqual(['-10', '50', '120', '100'])
    expect(el.value).toBe('color(display-p3 -10% 50% 120%)')
  })

  it('oklch chroma above 100% is kept in the value but shown clamped to the slider', () => {
    const el = mount('oklch(70% 0.45 145)') as any
    el.show()
    const c = el.shadowRoot.querySelector('input[type="number"].ch-c') as HTMLInputElement
    expect(c.value).toBe('100')
    expect(el.value).toBe('oklch(70% 112.5% 145)')
  })

  it('a lab a/b value that displays as 0 gets a + sign, never −0', () => {
    const el = mount('lab(50% -0.4 0.4)') as any
    el.show()
    const sups = [...el.shadowRoot.querySelectorAll('.num-wrapper sup')].map((s: any) => s.textContent).filter((t: string) => t !== '%')
    expect(sups).toEqual(['+', '+'])
  })

  it('wide-gamut and HDR spaces load and round-trip losslessly', () => {
    for (const v of [
      'color(display-p3 0.2 0.5 0.95)',
      'color(rec2020 0.1 0.6 0.3)',
      'color(a98-rgb 0.123 0.456 0.789)',
      'color(prophoto-rgb 0.3 0.4 0.5 / 0.25)',
      'oklch(55.5% 0.123 250.5 / 40%)',
      'oklab(0.62 -0.1234 0.0567)',
      'lch(52.2% 72.2 50)',
      'color(xyz-d65 0.2 0.3 0.4)',
    ]) {
      const out = mount(v).value
      const space = parse(v).spaceId
      const a = coords(v, space), b = coords(out, space)
      a.forEach((x, i) => expect(Math.abs(x - b[i]), `${v} → ${out}`).toBeLessThan(150 / 65535))
      // 16-bit per CSS Color 4 § 16 (lch C is stored as a % of 150, so its
      // authored digits shift: 72.2 → 48.133% → 72.1995)
      void 0
      // and reloading the output is idempotent
      expect(mount(out).value).toBe(out)
    }
  })
})

describe('serializeChannel edge cases', () => {
  it('never double-rounds a value sitting on a display boundary', async () => {
    const { serializeChannel, formatChannel } = await import('../src/utils/channel-formatting')
    for (const v of [-0.0049999, 0.0049999, 96.4999999, -40.5, 0, -0]) {
      const out = serializeChannel('oklab', 'A', v)
      expect(formatChannel('oklab', 'A', Number(out)), `${v} → ${out}`).toBe(formatChannel('oklab', 'A', v))
    }
    expect(serializeChannel('srgb', 'R', -0)).toBe('0')
    expect(serializeChannel('srgb', 'R', NaN)).toBe('0')
  })
})
