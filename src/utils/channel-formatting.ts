import type { ColorSpace } from '../color'

/**
 * Round number to fixed decimals and remove trailing zeros from the string representation.
 * @example toFixed(1.5, 2) → "1.5"
 * @example toFixed(2.00, 2) → "2"
 */
export function toFixed(n: null | number, digits = 0): string {
  if (n == null) {
    return '0'
  }
  return Number(n.toFixed(digits)).toString()
}

/**
 * Strip trailing zeros from decimal strings.
 * @example trimZeros("1.500") → "1.5"
 * @example trimZeros("2.00") → "2"
 */
export function trimZeros(s: string): string {
  return s.replace(/\.0+($|\D)/, '$1').replace(/(\.\d*?)0+($|\D)/, '$1$2')
}

/**
 * Format a channel value to appropriate precision for the given color space and channel name.
 * Handles different precision requirements across color spaces:
 * - OKLab: L (0 decimals), A/B (2 decimals)
 * - OKLCH: L/C/H (0 decimals)
 * - Lab: L/A/B (0 decimals)
 * - LCH: L/C/H (0 decimals)
 * - HSL/HWB: All channels (0 decimals)
 * - RGB-like: R/G/B (0 decimals)
 * - Alpha: (0 decimals)
 * - Default: 2 decimals
 */
export function formatChannel(space: ColorSpace, key: string, val: number): string {
  const round = (n: number, d = 0) => Number(n.toFixed(d))

  if (space === 'oklab') {
    if (key === 'L') return String(round(val, 0))
    if (key === 'A' || key === 'B') return String(round(val, 2))
  } else if (space === 'oklch') {
    if (key === 'L') return String(round(val, 0))
    if (key === 'C') return String(round(val, 0)) // 0-100 percentage
    if (key === 'H') return String(round(val, 0))
  } else if (space === 'lab') {
    if (key === 'L') return String(round(val, 0))
    if (key === 'A' || key === 'B') return String(round(val, 0))
  } else if (space === 'lch') {
    if (key === 'L' || key === 'C' || key === 'H') return String(round(val, 0)) // C is 0-100 scale
  } else if (space === 'hsl' || space === 'hwb') {
    if (key === 'H') return String(round(val, 0))
    if (key === 'S' || key === 'L' || key === 'W' || key === 'B') return String(round(val, 0))
  } else if (space === 'srgb' || space === 'hex') {
    if (key === 'R' || key === 'G' || key === 'B') return String(round(val, 0))
  } else {
    // Handle RGB-like spaces (display-p3, rec2020, etc.)
    const rgbLike = [
      'srgb-linear',
      'display-p3',
      'rec2020',
      'a98-rgb',
      'prophoto',
      'xyz',
      'xyz-d50',
      'xyz-d65'
    ]
    if (rgbLike.includes(space) && (key === 'R' || key === 'G' || key === 'B')) {
      return String(round(val, 0))
    }
  }

  if (key === 'ALP') return String(round(val, 0))
  return String(round(val, 2))
}

/**
 * Serialization precision, from CSS Color 4 § 16 "Serializing <color> Values"
 * https://drafts.csswg.org/css-color-4/#serializing-color-values
 *
 * The spec sets minimum round-trip precisions: 8 bits for the legacy sRGB
 * forms (#css-serialization-of-srgb), 10-16 bits per space for color()
 * (#serializing-color-function-values), 16 bits for lab/lch, oklab/oklch
 * (#serializing-lab-lch, #serializing-oklab-oklch) and modern alpha
 * (#serializing-modern-alpha-values). 16 bits meets or beats all of them and
 * keeps decimals an author typed (0.2577, 0.12345) instead of trimming them
 * to the bare minimum. 8-bit sources pass a lower depth explicitly
 * (see parseIntoChannels()).
 */
const DEFAULT_BITS = 16

/** Range of a channel, in the units parseIntoChannels() stores it in */
function channelRange(space: string, key: string): number {
  if (key === 'H') return 360
  if (space === 'oklab' && (key === 'A' || key === 'B')) return 1 // ±0.5
  if (space === 'lab' && (key === 'A' || key === 'B')) return 254 // ±127
  if (space === 'oklch' && key === 'C') return 125 // 0-0.5 as % of 0.4
  return 100 // every other channel is a percentage
}

const MAX_DECIMALS = 6

/**
 * Serialize a channel value without losing precision.
 *
 * Emits the fewest decimals (0-6, trailing zeros dropped) that stay within
 * half a step of a `bits`-deep quantization of the channel's range, so integers stay
 * integers (`50`), authored decimals survive (`62.8`, `64.425`), and float
 * noise from conversions is dropped (`50.000000001` → `50`), and the result
 * shows the same whole number in the number field as the exact value. Rounds
 * half towards +∞, as the spec requires.
 *
 * This is the lossless form used for the value itself. formatChannel() is the
 * coarser display form for the number inputs and for values produced by a
 * user drag or space switch.
 */
export function serializeChannel(space: ColorSpace | string, key: string, val: number | null | undefined, bits?: number): string {
  if (val == null || !Number.isFinite(val)) return '0'
  bits ??= DEFAULT_BITS
  const tolerance = channelRange(space, key) / (2 ** bits - 1) / 2
  // The shorter form must also display the same as the exact value, or the
  // number field would double-round (96.47 → 96.5 → 97 instead of 96)
  const display = formatChannel(space as ColorSpace, key, val)
  for (let d = 0; d <= MAX_DECIMALS; d++) {
    const f = 10 ** d
    const rounded = Math.floor(val * f + 0.5) / f
    const ok = Math.abs(rounded - val) <= tolerance && formatChannel(space as ColorSpace, key, rounded) === display
    if (ok || d === MAX_DECIMALS) {
      // `+ 0` turns -0 into 0
      return String(rounded + 0)
    }
  }
  return String(val)
}
