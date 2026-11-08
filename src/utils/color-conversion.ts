import { getColor, OKLCH, parse, to, toGamut } from 'colorjs.io/fn'
import type { ColorSpace } from '../color'
import {
  alphaToString,
  getColorJSSpaceID,
  isRGBLike,
  rgbColor,
  reverseColorJSSpaceID
} from '../color'
import { formatChannel, serializeChannel } from './channel-formatting'

export type ChannelRecord = Record<string, string | number>

const noLeadZero = (v: any) => String(v).replace(/^(-?)0\./, '$1.')

/**
 * Generate a CSS color string from channel values and color space identifier.
 * Handles percentage/angle notation and alpha transparency per CSS Color spec.
 *
 * @param space - The color space (e.g., 'oklch', 'hsl', 'srgb')
 * @param ch - Channel values as a record (e.g., { L: '50', C: '75', H: '180', ALP: '100' })
 * @returns CSS color string (e.g., 'oklch(50% 75% 180)')
 *
 * @example
 * gencolor('oklch', { L: '50', C: '75', H: '180', ALP: '100' })
 * // → 'oklch(50% 75% 180)'
 *
 * @example
 * gencolor('hsl', { H: '120', S: '100', L: '50', ALP: '50' })
 * // → 'hsl(120 100% 50% / 50%)'
 */
export function gencolor(space: ColorSpace, ch: ChannelRecord): string {
  const L = (ch.L ?? 50) as any
  const A = (ch.A ?? 0) as any
  const B = (ch.B ?? 0) as any
  const C = (ch.C ?? 0) as any
  const H = (ch.H ?? 0) as any
  const S = (ch.S ?? 0) as any
  const W = (ch.W ?? 0) as any
  const R = (ch.R ?? 0) as any
  const G = (ch.G ?? 0) as any
  const ALP = (ch.ALP ?? 100) as any

  switch (space) {
    case 'oklab': return `oklab(${L}% ${noLeadZero(A)} ${noLeadZero(B)}${alphaToString(ALP)})`
    case 'oklch': return `oklch(${L}% ${C}% ${H}${alphaToString(ALP)})` // Chroma as percentage
    case 'lab': return `lab(${L}% ${noLeadZero(A)} ${noLeadZero(B)}${alphaToString(ALP)})`
    case 'lch': return `lch(${L}% ${C}% ${H}${alphaToString(ALP)})` // Chroma as percentage
    case 'hsl': return `hsl(${H} ${S}% ${L}%${alphaToString(ALP)})`
    case 'hwb': return `hwb(${H} ${W}% ${B}%${alphaToString(ALP)})`
    case 'srgb': return `rgb(${R}% ${G}% ${B}%${alphaToString(ALP)})`
    case 'hex': {
      // Convert percentage to 0-255 range
      const r = Math.round(Number(R) * 2.55)
      const g = Math.round(Number(G) * 2.55)
      const b = Math.round(Number(B) * 2.55)
      const a = Number(ALP)
      // Format as hex
      const rh = r.toString(16).padStart(2, '0')
      const gh = g.toString(16).padStart(2, '0')
      const bh = b.toString(16).padStart(2, '0')

      // Check if we can use shortened hex format (3 or 4 digits)
      const canShorten = rh[0] === rh[1] && gh[0] === gh[1] && bh[0] === bh[1]

      if (a < 100) {
        const alpha = Math.round((a / 100) * 255)
        const ah = alpha.toString(16).padStart(2, '0')

        if (canShorten && ah[0] === ah[1]) {
          // Use 4-digit hex format (#rgba)
          return `#${rh[0]}${gh[0]}${bh[0]}${ah[0]}`
        }
        return `#${rh}${gh}${bh}${ah}`
      }

      if (canShorten) {
        // Use 3-digit hex format (#rgb)
        return `#${rh[0]}${gh[0]}${bh[0]}`
      }
      return `#${rh}${gh}${bh}`
    }
    default:
      if (isRGBLike(space)) return rgbColor(space, R, G, B, ALP)
      return 'oklch(75% 75% 180)' // fallback
  }
}

/**
 * Normalize user-entered or pasted color text before parsing.
 * Tolerates common clipboard artifacts: surrounding whitespace,
 * zero-width characters, a full CSS declaration
 * (`color: oklch(70% 0.1 220);`), a trailing semicolon, and bare hex
 * digits without a leading `#`.
 *
 * @param raw - The raw text as typed or pasted
 * @returns Cleaned string ready for colorjs.io `parse()`
 *
 * @example
 * preprocessColorInput('  background-color: rgb(255 0 0);  ')
 * // → 'rgb(255 0 0)'
 *
 * @example
 * preprocessColorInput('ff6600')
 * // → '#ff6600'
 */
export function preprocessColorInput(raw: string): string {
  let s = raw.replace(/[\u200B-\u200D\u2060\uFEFF]/g, '').trim()
  // Strip a CSS property prefix so pasting a whole declaration works
  s = s.replace(/^[\w-]+\s*:\s*/, '')
  // Strip a trailing semicolon
  s = s.replace(/\s*;+$/, '')
  // Bare hex without a `#` (3/4/6/8 digits)
  if (/^(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(s)) s = `#${s}`
  return s
}

/**
 * Read a CSS color's channels, in the units the controls use, as exact
 * numbers: percentages for L/S/W/B/R/G/alpha, chroma as a percentage of the
 * reference range, degrees for hue, raw numbers for lab/oklab a and b.
 * Converts to `space` first (hex reads as srgb).
 */
function readChannels(space: ColorSpace, colorStr: string): { space: ColorSpace; ch: Record<string, number> } {
  // getColor() converts input to compatible type with to() result
  let c = getColor(parse(colorStr))
  // Hex is internally sRGB
  const actualSpace = space === 'hex' ? 'srgb' : space
  // Convert to target space if different
  const targetId = getColorJSSpaceID(actualSpace)
  if (c.space.id !== targetId) {
    c = to(c, targetId)
  }
  const id = reverseColorJSSpaceID(c.space.id)
  const s = (id === 'rgb' ? 'srgb' : id) as ColorSpace

  const ch: Record<string, number> = {}
  const n = (v: number | null | undefined) => (v == null || !Number.isFinite(v) ? 0 : v)

  if (s === 'oklab') {
    const [l, a, b] = c.coords
    ch.L = n(l) * 100
    ch.A = n(a)
    ch.B = n(b)
  } else if (s === 'oklch') {
    const [minChroma, maxChroma] = OKLCH.coords.c.refRange ?? [0, 0.4]
    const [l, cc, h] = c.coords
    ch.L = n(l) * 100
    // Chroma as a percentage of the reference range (0.4 = 100%). Not clamped
    // here: oklch(… 0.45 …) is a valid color and must survive a load untouched
    ch.C = ((n(cc) - minChroma) / (maxChroma - minChroma)) * 100
    ch.H = n(h)
  } else if (s === 'lab') {
    const [l, a, b] = c.coords
    ch.L = n(l)
    ch.A = n(a)
    ch.B = n(b)
  } else if (s === 'lch') {
    const [l, cc, h] = c.coords
    ch.L = n(l)
    ch.C = n(cc) / 1.5 // 0-150 as 0-100%, not clamped (see oklch)
    ch.H = n(h)
  } else if (s === 'hsl' || s === 'hwb') {
    // colorjs.io (0.5+) reports S/L and W/B on a 0-100 scale for parsed and
    // converted colors alike. (The old "≤ 1 means 0-1" guess turned
    // hsl(0 1% 50%) into hsl(0 100% 50%).)
    const [h, x, y] = c.coords
    ch.H = n(h)
    if (s === 'hsl') {
      ch.S = n(x)
      ch.L = n(y)
    } else {
      ch.W = n(x)
      ch.B = n(y)
    }
  } else if (s === 'srgb') {
    const [r, g, b] = toGamut(c, { space: 'srgb', method: 'clip' }).coords
    ch.R = n(r) * 100
    ch.G = n(g) * 100
    ch.B = n(b) * 100
  } else if (isRGBLike(s)) {
    const [r, g, b] = c.coords
    ch.R = n(r) * 100
    ch.G = n(g) * 100
    ch.B = n(b) * 100
  }
  if (Object.keys(ch).length) ch.ALP = (c.alpha ?? 1) * 100

  return { space: s, ch }
}

/** True when an sRGB percentage is an exact 8-bit value (it came from hex or rgb(0-255)) */
const isByte = (pct: number) => {
  const v = pct * 2.55
  return Math.abs(v - Math.round(v)) < 1e-6
}

/**
 * Parse a CSS color string into its component channels for a target color space.
 * Converts between spaces if necessary, normalizes channel ranges, and handles missing hue.
 *
 * Channels are lossless: they keep the color's full precision (see
 * serializeChannel()), so gencolor(space, parseIntoChannels(space, c).ch)
 * is the same color as `c`. Round with displayChannels() for display.
 *
 * @param space - Target color space to parse into
 * @param colorStr - CSS color string to parse
 * @returns Object containing the parsed space and channel values
 *
 * @example
 * parseIntoChannels('oklch', 'oklch(62.8% 0.2577 29.23)')
 * // → { space: 'oklch', ch: { L: '62.8', C: '64.425', H: '29.23', ALP: '100' } }
 *
 * @example
 * parseIntoChannels('hex', '#3b82f6')
 * // → { space: 'srgb', ch: { R: '23.1', G: '51', B: '96.47', ALP: '100' } }
 */
export function parseIntoChannels(space: ColorSpace, colorStr: string): { space: ColorSpace; ch: ChannelRecord } {
  const { space: s, ch: raw } = readChannels(space, colorStr)
  const ch: ChannelRecord = {}
  for (const [key, v] of Object.entries(raw)) {
    // 8-bit sRGB values (hex, rgb(59 130 246)) are repeating decimals as
    // percentages; serialize them at the 10-bit color(srgb) minimum, which
    // keeps every byte exact in a decimal or two (96.47%, not 96.4706%)
    const bits = s === 'srgb' && key !== 'ALP' && isByte(v) ? 10 : undefined
    ch[key] = serializeChannel(s, key, v, bits)
  }
  return { space: s, ch }
}

/**
 * Channels at display precision, for values the user creates by dragging,
 * eyedropping or switching spaces: whole percents and degrees (see
 * formatChannel()), with chroma clamped to the slider's 0-100% range.
 *
 * Rounds once, from the exact color, so there is no double rounding
 * (96.47 → 96, never 96.47 → 96.5 → 97). Hex is left lossless: gencolor()
 * quantizes it to 8 bits itself, and whole percents first would shift
 * channels by one (#3b82f6 → #3b82f5).
 */
export function displayChannels(space: ColorSpace, colorStr: string): { space: ColorSpace; ch: ChannelRecord } {
  if (space === 'hex') return parseIntoChannels(space, colorStr)
  const { space: s, ch: raw } = readChannels(space, colorStr)
  const ch: ChannelRecord = {}
  for (const [key, v] of Object.entries(raw)) {
    const clamped = (s === 'oklch' || s === 'lch') && key === 'C' ? Math.min(100, v) : v
    ch[key] = formatChannel(s, key, clamped)
  }
  return { space: s, ch }
}
