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
