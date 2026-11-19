import { parse, to, serialize, type PlainColorObject } from 'colorjs.io/fn'
import '../color' // registers the color spaces colorjs needs

/**
 * CSS Color 5 resolution for inputs colorjs.io can't parse on its own:
 * `color-mix()`, relative color syntax (`oklch(from red l c h)`), and
 * context-dependent colors (`currentcolor`, `var()`, system colors).
 *
 * `color-mix()` and relative colors are resolved in JS with the library's
 * color engine, so the result is the same in every browser and works on a
 * disconnected element. Context-dependent colors only mean something on a
 * connected element, so they're resolved from the computed style of a probe
 * inside `context` (which inherits the host's `color` and custom properties).
 *
 * Returns a concrete color string colorjs can parse, the input unchanged when
 * it needs no resolution, or `null` when it can't be resolved.
 */
export function resolveColorSyntax(input: string, context?: Element | null): string | null {
  const s = input.trim()
  if (!s) return null
  if (!needsResolution(s)) return s
  if (!/var\(|env\(|attr\(/i.test(s)) {
    try {
      const resolved = resolveExpr(s)
      if (resolved) return out(resolved)
    } catch { }
  }
  return resolveFromDOM(s, context)
}

/** True when `s` uses syntax colorjs.io can't parse without resolution */
export function needsResolution(s: string): boolean {
  if (/color-mix\(|\(\s*from\s|var\(|env\(|attr\(|currentcolor/i.test(s)) return true
  if (/^[a-z]+$/i.test(s.trim())) {
    try { parse(s.trim()); return false } catch { return true }
  }
  return false
}

// ---------------------------------------------------------------------------
// DOM fallback for context-dependent colors

function resolveFromDOM(s: string, context?: Element | null): string | null {
  if (!context?.isConnected || typeof getComputedStyle !== 'function') return null
  const host: ParentNode = (context as HTMLElement).shadowRoot ?? context
  const probe = document.createElement('span')
  probe.hidden = true
  probe.style.color = s
  if (!probe.style.color) return null // not a valid <color> in this browser
  host.appendChild(probe)
  try {
    const computed = getComputedStyle(probe).color
    if (!computed) return null
    parse(computed)
    return computed
  } catch {
    return null
  } finally {
    probe.remove()
  }
}

// ---------------------------------------------------------------------------
// Tokenizing helpers

/** Split at top-level occurrences of `sep` (',' or whitespace), ignoring nested parens */
function splitTop(s: string, sep: ',' | ' ' | '/'): string[] {
  const parts: string[] = []
  let depth = 0
  let cur = ''
  for (const ch of s) {
    if (ch === '(') depth++
    else if (ch === ')') depth--
    const isSep = sep === ' ' ? /\s/.test(ch) : ch === sep
    if (isSep && depth === 0) {
      if (sep !== ' ' || cur) parts.push(cur.trim())
      cur = ''
    } else cur += ch
  }
  if (sep !== ' ' || cur.trim()) parts.push(cur.trim())
  return parts
}

/** `name(inner)` → [name, inner], only when the parens wrap the whole string */
function fnParts(s: string): [string, string] | null {
  const m = /^([a-z-]+)\(/i.exec(s)
  if (!m || !s.endsWith(')')) return null
  let depth = 0
  for (let i = m[0].length - 1; i < s.length; i++) {
    if (s[i] === '(') depth++
    else if (s[i] === ')' && --depth === 0 && i !== s.length - 1) return null
  }
  return [m[1].toLowerCase(), s.slice(m[0].length, -1).trim()]
}

// ---------------------------------------------------------------------------
// Color expressions

const MIX_SPACES: Record<string, string> = {
  'srgb': 'srgb', 'srgb-linear': 'srgb-linear', 'display-p3': 'p3', 'a98-rgb': 'a98rgb',
  'prophoto-rgb': 'prophoto', 'rec2020': 'rec2020', 'lab': 'lab', 'oklab': 'oklab',
  'xyz': 'xyz-d65', 'xyz-d65': 'xyz-d65', 'xyz-d50': 'xyz-d50',
  'hsl': 'hsl', 'hwb': 'hwb', 'lch': 'lch', 'oklch': 'oklch',
}
const POLAR = new Set(['hsl', 'hwb', 'lch', 'oklch'])
const HUE_METHODS = new Set(['shorter', 'longer', 'increasing', 'decreasing'])

/** Resolve a color expression to a colorjs color, or throw */
function resolveExpr(s: string): PlainColorObject {
  s = s.trim()
  const fn = fnParts(s)
  if (fn && fn[0] === 'color-mix') return resolveMix(fn[1])
  if (fn && /^from\s/i.test(fn[1])) return resolveRelative(fn[0], fn[1].slice(4).trim())
  return parse(s) as unknown as PlainColorObject
}

function resolveMix(inner: string): PlainColorObject {
  const args = splitTop(inner, ',')
  let space = 'oklab'
  let hue = 'shorter'
  // The interpolation method is optional (CSS Color 5); oklab is the default
  if (/^in\s/i.test(args[0])) {
    const words = args.shift()!.toLowerCase().split(/\s+/).slice(1)
    const name = words[0]
    if (!(name in MIX_SPACES)) throw new Error(`color-mix: unknown space ${name}`)
    space = MIX_SPACES[name]
    if (words.length > 1) {
      if (!POLAR.has(name) || words.length !== 3 || words[2] !== 'hue' || !HUE_METHODS.has(words[1]))
        throw new Error('color-mix: bad hue interpolation method')
      hue = words[1]
    }
  }
  if (args.length !== 2) throw new Error('color-mix: expects two colors')
  const items = args.map(arg => {
    const parts = splitTop(arg, ' ')
    let pct: number | null = null
    const pIdx = parts.findIndex(p => /^-?[\d.]+%$/.test(p))
    if (pIdx !== -1 && (pIdx === 0 || pIdx === parts.length - 1)) {
      pct = parseFloat(parts.splice(pIdx, 1)[0])
      if (pct < 0 || pct > 100) throw new Error('color-mix: percentage out of range')
    }
    return { color: resolveExpr(parts.join(' ')), pct }
  })
  let [p1, p2] = [items[0].pct, items[1].pct]
  if (p1 === null && p2 === null) [p1, p2] = [50, 50]
  else if (p1 === null) p1 = 100 - p2!
  else if (p2 === null) p2 = 100 - p1
  const sum = p1 + p2!
  if (sum === 0) throw new Error('color-mix: percentages sum to zero')
  const result = interpolate(items[0].color, items[1].color, p2! / sum, space, hue)
  if (sum < 100) result.alpha = (isMissing(result.alpha) ? 1 : result.alpha as number) * sum / 100
  return result
}

// Analogous components (CSS Color 4 §12.2): a missing component carries
// forward into the interpolation space when the target has an analogous one
const RGBISH = ['R', 'G', 'B']
const CATEGORIES: Record<string, (string | null)[]> = {
  'srgb': RGBISH, 'srgb-linear': RGBISH, 'p3': RGBISH, 'a98rgb': RGBISH, 'prophoto': RGBISH,
  'rec2020': RGBISH, 'xyz-d65': RGBISH, 'xyz-d50': RGBISH,
  'lab': ['L', 'a', 'b'], 'oklab': ['L', 'a', 'b'],
  'lch': ['L', 'C', 'H'], 'oklch': ['L', 'C', 'H'],
  'hsl': ['H', 'C', 'L'], 'hwb': ['H', null, null],
}
const HUE_INDEX: Record<string, number> = { hsl: 0, hwb: 0, lch: 2, oklch: 2 }

const isMissing = (v: unknown) => v == null || Number.isNaN(v)
const spaceIdOf = (c: any): string => c.space?.id ?? c.spaceId

/** Convert to `target`, keeping missing components missing where analogous */
function convertKeepingMissing(c: PlainColorObject, target: string): { coords: (number | null)[]; alpha: number | null } {
  const from = spaceIdOf(c)
  const coords = (c.coords as (number | null)[]).map(v => (isMissing(v) ? 0 : v)) as [number, number, number]
  const converted = (to({ spaceId: from, coords, alpha: 1 } as any, target).coords as (number | null)[])
    .map(v => (isMissing(v) ? null : v))
  const fromCats = CATEGORIES[from] ?? []
  const toCats = CATEGORIES[target] ?? []
  ;(c.coords as (number | null)[]).forEach((v, i) => {
    const cat = fromCats[i]
    if (!isMissing(v) || !cat) return
    const j = toCats.indexOf(cat)
    if (j !== -1) converted[j] = null
  })
  // An achromatic color's hue is powerless, so it's treated as missing
  const h = HUE_INDEX[target]
  if (h !== undefined) {
    const [a, b, c2] = converted as number[]
    const achromatic = target === 'hsl' ? (b ?? 0) <= 1e-6
      : target === 'hwb' ? (b ?? 0) + (c2 ?? 0) >= 100 - 1e-6
      : (converted[1] ?? 0) <= 1e-6
    if (achromatic) converted[h] = null
    void a
  }
  return { coords: converted, alpha: isMissing(c.alpha) ? null : c.alpha as number }
}

/** CSS Color 4 §12 interpolation: premultiplied, missing components, hue fixup */
function interpolate(c1: PlainColorObject, c2: PlainColorObject, p: number, space: string, hue: string): PlainColorObject {
  const A = convertKeepingMissing(c1, space)
  const B = convertKeepingMissing(c2, space)
  const h = HUE_INDEX[space]
  for (let i = 0; i < 3; i++) {
    if (A.coords[i] === null) A.coords[i] = B.coords[i]
    else if (B.coords[i] === null) B.coords[i] = A.coords[i]
  }
  if (A.alpha === null) A.alpha = B.alpha
  else if (B.alpha === null) B.alpha = A.alpha
  const a1 = A.alpha ?? 1
  const a2 = B.alpha ?? 1
  if (h !== undefined && A.coords[h] !== null && B.coords[h] !== null) {
    let h1 = ((A.coords[h]! % 360) + 360) % 360
    let h2 = ((B.coords[h]! % 360) + 360) % 360
    const d = h2 - h1
    if (hue === 'shorter') { if (d > 180) h1 += 360; else if (d < -180) h2 += 360 }
    else if (hue === 'longer') { if (d > 0 && d < 180) h1 += 360; else if (d > -180 && d <= 0) h2 += 360 }
    else if (hue === 'increasing') { if (d < 0) h2 += 360 }
    else if (hue === 'decreasing') { if (d > 0) h1 += 360 }
    A.coords[h] = h1
    B.coords[h] = h2
  }
  const alpha = a1 * (1 - p) + a2 * p
  const coords = A.coords.map((v1, i) => {
    const v2 = B.coords[i]
    if (v1 === null || v2 === null) return null
    if (i === h) return v1 * (1 - p) + v2 * p
    const v = v1 * a1 * (1 - p) + v2 * a2 * p
    return alpha === 0 ? v : v / alpha
  })
  if (h !== undefined && coords[h] !== null) coords[h] = ((coords[h]! % 360) + 360) % 360
  return {
    spaceId: space, coords,
    alpha: A.alpha === null && B.alpha === null ? null : alpha,
  } as unknown as PlainColorObject
}

// Channel keywords and their reference ranges (the value 100% maps to) per
// CSS Color 5 relative color syntax. Keywords resolve to plain numbers.
type Channel = { key: string; ref: number; hue?: boolean; scale?: number }
const RGB: Channel[] = [{ key: 'r', ref: 255, scale: 255 }, { key: 'g', ref: 255, scale: 255 }, { key: 'b', ref: 255, scale: 255 }]
const REL_SPACES: Record<string, { id: string; channels: Channel[] }> = {
  rgb: { id: 'srgb', channels: RGB },
  rgba: { id: 'srgb', channels: RGB },
  hsl: { id: 'hsl', channels: [{ key: 'h', ref: 1, hue: true }, { key: 's', ref: 100 }, { key: 'l', ref: 100 }] },
  hsla: { id: 'hsl', channels: [{ key: 'h', ref: 1, hue: true }, { key: 's', ref: 100 }, { key: 'l', ref: 100 }] },
  hwb: { id: 'hwb', channels: [{ key: 'h', ref: 1, hue: true }, { key: 'w', ref: 100 }, { key: 'b', ref: 100 }] },
  lab: { id: 'lab', channels: [{ key: 'l', ref: 100 }, { key: 'a', ref: 125 }, { key: 'b', ref: 125 }] },
  lch: { id: 'lch', channels: [{ key: 'l', ref: 100 }, { key: 'c', ref: 150 }, { key: 'h', ref: 1, hue: true }] },
  oklab: { id: 'oklab', channels: [{ key: 'l', ref: 1 }, { key: 'a', ref: 0.4 }, { key: 'b', ref: 0.4 }] },
  oklch: { id: 'oklch', channels: [{ key: 'l', ref: 1 }, { key: 'c', ref: 0.4 }, { key: 'h', ref: 1, hue: true }] },
}
const COLOR_FN_SPACES: Record<string, string> = {
  'srgb': 'srgb', 'srgb-linear': 'srgb-linear', 'display-p3': 'p3', 'a98-rgb': 'a98rgb',
  'prophoto-rgb': 'prophoto', 'rec2020': 'rec2020', 'xyz': 'xyz-d65', 'xyz-d65': 'xyz-d65', 'xyz-d50': 'xyz-d50',
}

function resolveRelative(fn: string, rest: string): PlainColorObject {
  // rest = "<origin> <c1> <c2> <c3> [/ <alpha>]" (color(): "<origin> <space> ...")
  const [main, alphaPart, extra] = splitTop(rest, '/')
  if (extra !== undefined) throw new Error('relative color: too many slashes')
  const tokens = splitTop(main, ' ')
  const origin = resolveExpr(tokens.shift()!)
  let spaceId: string
  let channels: Channel[]
  if (fn === 'color') {
    const name = (tokens.shift() ?? '').toLowerCase()
    spaceId = COLOR_FN_SPACES[name]
    if (!spaceId) throw new Error(`relative color: unknown color() space ${name}`)
    const keys = spaceId.startsWith('xyz') ? ['x', 'y', 'z'] : ['r', 'g', 'b']
    channels = keys.map(key => ({ key, ref: 1 }))
  } else {
    const def = REL_SPACES[fn]
    if (!def) throw new Error(`relative color: unsupported function ${fn}`)
    spaceId = def.id
    channels = def.channels
  }
  if (tokens.length !== 3) throw new Error('relative color: expects three channels')

  const converted = to(origin, spaceId)
  const vars: Record<string, number> = {}
  channels.forEach((ch, i) => {
    const v = converted.coords[i] as number | null
    vars[ch.key] = (v == null || Number.isNaN(v) ? 0 : v) * (ch.scale ?? 1)
  })
  const originAlpha = origin.alpha == null || Number.isNaN(origin.alpha as number) ? 1 : origin.alpha as number
  vars.alpha = originAlpha

  const coords = channels.map((ch, i) => {
    const tok = tokens[i]
    if (tok.toLowerCase() === 'none') return null
    return evalCalc(tok, vars, ch.ref, !!ch.hue) / (ch.scale ?? 1)
  })
  let alpha: number | null = originAlpha
  if (alphaPart !== undefined) {
    alpha = alphaPart.toLowerCase() === 'none' ? null : evalCalc(alphaPart, vars, 1, false)
  }
  return { spaceId, coords, alpha } as unknown as PlainColorObject
}

// ---------------------------------------------------------------------------
// A small calc() evaluator: numbers, percentages, angles, channel keywords,
// + - * /, parentheses and calc/min/max/clamp/abs/sign/round(nearest)

const ANGLE: Record<string, number> = { deg: 1, rad: 180 / Math.PI, grad: 0.9, turn: 360 }
const CONSTS: Record<string, number> = { pi: Math.PI, e: Math.E, infinity: Infinity, '-infinity': -Infinity }

function evalCalc(src: string, vars: Record<string, number>, pctRef: number, hue: boolean): number {
  let i = 0
  const str = src.trim()
  const ws = () => { while (i < str.length && /\s/.test(str[i])) i++ }
  const fail = (): never => { throw new Error(`relative color: can't evaluate ${src}`) }

  function primary(): number {
    ws()
    const num = /^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?/i.exec(str.slice(i))
    if (num) {
      i += num[0].length
      let v = parseFloat(num[0])
      if (str[i] === '%') { i++; return v / 100 * pctRef }
      const unit = /^[a-z]+/i.exec(str.slice(i))
      if (unit) {
        const factor = ANGLE[unit[0].toLowerCase()]
        if (!hue || factor === undefined) fail()
        i += unit[0].length
        v *= factor
      }
      return v
    }
    if (str[i] === '(') {
      i++
      const v = sum()
      ws()
      if (str[i++] !== ')') fail()
      return v
    }
    if (str[i] === '-' || str[i] === '+') {
      const sign = str[i++] === '-' ? -1 : 1
      return sign * primary()
    }
    const id = /^-?[a-z][a-z-]*/i.exec(str.slice(i))
    if (!id) return fail()
    const name = id[0].toLowerCase()
    i += id[0].length
    if (str[i] === '(') {
      i++
      const args: number[] = []
      for (;;) {
        args.push(sum())
        ws()
        if (str[i] === ',') { i++; continue }
        if (str[i] === ')') { i++; break }
        fail()
      }
      return callFn(name, args)
    }
    if (name in vars) return vars[name]
    if (name in CONSTS) return CONSTS[name]
    return fail()
  }

  function callFn(name: string, a: number[]): number {
    switch (name) {
      case 'calc': if (a.length === 1) return a[0]; break
      case 'min': return Math.min(...a)
      case 'max': return Math.max(...a)
      case 'clamp': if (a.length === 3) return Math.max(a[0], Math.min(a[1], a[2])); break
      case 'abs': if (a.length === 1) return Math.abs(a[0]); break
      case 'sign': if (a.length === 1) return Math.sign(a[0]); break
      case 'round': if (a.length === 2) return Math.round(a[0] / a[1]) * a[1]; break
    }
    return fail()
  }

  function product(): number {
    let v = primary()
    for (;;) {
      ws()
      const op = str[i]
      if (op !== '*' && op !== '/') return v
      i++
      const rhs = primary()
      v = op === '*' ? v * rhs : v / rhs
    }
  }

  function sum(): number {
    let v = product()
    for (;;) {
      ws()
      const op = str[i]
      // CSS requires whitespace around + and -, so "a -b" isn't subtraction
      if ((op !== '+' && op !== '-') || !/\s/.test(str[i - 1] ?? '') || !/\s/.test(str[i + 1] ?? '')) return v
      i++
      const rhs = product()
      v = op === '+' ? v + rhs : v - rhs
    }
  }

  const v = sum()
  ws()
  if (i !== str.length || !Number.isFinite(v)) fail()
  return v
}

// ---------------------------------------------------------------------------
// Output

/**
 * Serialize a resolved color so colorjs (and the picker's space detection)
 * read it back as the same color. Like the browser, results in sRGB, hsl or
 * hwb serialize as color(srgb): legacy rgb()/hsl() would be clamped when
 * parsed, and these results can be out of the sRGB gamut. No gamut mapping:
 * HDR stays HDR.
 */
function out(c: PlainColorObject): string {
  let color: any = c
  const id = spaceIdOf(c)
  if (id === 'hsl' || id === 'hwb') {
    const coords = (c.coords as (number | null)[]).map(v => (isMissing(v) ? 0 : v))
    color = { spaceId: 'srgb', coords: to({ spaceId: id, coords, alpha: 1 } as any, 'srgb').coords, alpha: c.alpha }
  }
  const fmt = spaceIdOf(color) === 'srgb' ? { format: 'color' } : {}
  return serialize(color, { precision: 12, inGamut: false, ...fmt } as any)
}
