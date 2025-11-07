import Color from 'colorjs.io'
import type { ColorSpace } from '../color'
import {
  alphaToString,
  getColorJSSpaceID,
  isRGBLike,
  rgbColor,
  reverseColorJSSpaceID
} from '../color'
import { toFixed } from './channel-formatting'

export type ChannelRecord = Record<string, string | number>

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
    case 'oklab': return `oklab(${L}% ${A} ${B}${alphaToString(ALP)})`
    case 'oklch': return `oklch(${L}% ${C}% ${H}${alphaToString(ALP)})` // Chroma as percentage
    case 'lab':   return `lab(${L}% ${A} ${B}${alphaToString(ALP)})`
    case 'lch':   return `lch(${L}% ${C}% ${H}${alphaToString(ALP)})` // Chroma as percentage
    case 'hsl':   return `hsl(${H} ${S}% ${L}%${alphaToString(ALP)})`
    case 'hwb':   return `hwb(${H} ${W}% ${B}%${alphaToString(ALP)})`
    case 'srgb':  return `rgb(${R}% ${G}% ${B}%${alphaToString(ALP)})`
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
      if (a < 100) {
        const alpha = Math.round((a / 100) * 255)
        const ah = alpha.toString(16).padStart(2, '0')
        return `#${rh}${gh}${bh}${ah}`
      }
      return `#${rh}${gh}${bh}`
    }
    default:
      if (isRGBLike(space)) return rgbColor(space, R, G, B, ALP)
      return 'oklch(75% 75% 180)' // fallback
  }
}

/**
 * Parse a CSS color string into its component channels for a target color space.
 * Converts between spaces if necessary, normalizes channel ranges, and handles missing hue.
 *
 * @param space - Target color space to parse into
 * @param colorStr - CSS color string to parse
 * @returns Object containing the parsed space and channel values
 *
 * @example
 * parseIntoChannels('oklch', 'red')
 * // → { space: 'oklch', ch: { L: '62', C: '57', H: '29', ALP: '100' } }
 *
 * @example
 * parseIntoChannels('hsl', '#ff0000')
 * // → { space: 'hsl', ch: { H: '0', S: '100', L: '50', ALP: '100' } }
 */
export function parseIntoChannels(space: ColorSpace, colorStr: string): { space: ColorSpace; ch: ChannelRecord } {
  let c = new Color(colorStr)
  // Hex is internally sRGB
  const actualSpace = space === 'hex' ? 'srgb' : space
  // Convert to target space if different
  const targetId = getColorJSSpaceID(actualSpace)
  if (c.space.id !== targetId) {
    c = c.to(targetId)
  }
  const id = reverseColorJSSpaceID(c.space.id) as string
  const s = (id === 'rgb' ? 'srgb' : id) as ColorSpace

  const ch: ChannelRecord = {}

  if (s === 'oklab') {
    const [l, a, b] = c.coords
    ch.L = toFixed(l * 100)
    ch.A = toFixed(a, 2)
    ch.B = toFixed(b, 2)
    ch.ALP = toFixed(c.alpha * 100)
  } else if (s === 'oklch') {
    const [l, cc, h] = c.coords
    ch.L = toFixed(l * 100)
    ch.C = toFixed(Math.min(100, cc * 100), 0) // Convert to 0-100%, clamp at 100%
    ch.H = isNaN(h) ? '0' : toFixed(h)
    ch.ALP = toFixed(c.alpha * 100)
  } else if (s === 'lab') {
    const [l, a, b] = c.coords
    ch.L = toFixed(l)
    ch.A = toFixed(a)
    ch.B = toFixed(b)
    ch.ALP = toFixed(c.alpha * 100)
  } else if (s === 'lch') {
    const [l, cc, h] = c.coords
    ch.L = toFixed(l)
    ch.C = toFixed(Math.min(100, cc / 1.5), 0) // Normalize 0-150 to 0-100%, clamp at 100%
    ch.H = toFixed(h)
    ch.ALP = toFixed(c.alpha * 100)
  } else if (s === 'hsl') {
    const [h, s2, l] = c.coords
    ch.H = toFixed(h)
    // colorjs.io returns 0-1 when parsing HSL strings, but 0-100 when converting from other spaces
    ch.S = toFixed(s2 > 1 ? s2 : s2 * 100)
    ch.L = toFixed(l > 1 ? l : l * 100)
    ch.ALP = toFixed(c.alpha * 100)
  } else if (s === 'hwb') {
    const [h, w, b] = c.coords
    ch.H = toFixed(h)
    // colorjs.io returns 0-1 when parsing HWB strings, but 0-100 when converting from other spaces
    ch.W = toFixed(w > 1 ? w : w * 100)
    ch.B = toFixed(b > 1 ? b : b * 100)
    ch.ALP = toFixed(c.alpha * 100)
  } else if (s === 'srgb' || s === 'hex') {
    const [r, g, b] = c.toGamut({ space: 'srgb', method: 'clip' }).coords
    ch.R = toFixed(r * 100)
    ch.G = toFixed(g * 100)
    ch.B = toFixed(b * 100)
    ch.ALP = toFixed(c.alpha * 100)
  } else if (isRGBLike(s)) {
    const [r, g, b] = c.coords
    ch.R = toFixed(Number(r) * 100)
    ch.G = toFixed(Number(g) * 100)
    ch.B = toFixed(Number(b) * 100)
    ch.ALP = toFixed(c.alpha * 100)
  }

  return { space: s, ch }
}
