import * as colorjs from "colorjs.io/fn";
import { type ColorConstructor, parse, contrast, contrastLstar, to, inGamut } from 'colorjs.io/fn'

export type Theme = 'auto' | 'light' | 'dark'
export type StandardSpace = 'srgb' | 'hex' | 'hsl' | 'hwb' | 'lab' | 'lch' | 'oklab' | 'oklch'
export type WideRGB = 'srgb-linear' | 'display-p3' | 'rec2020' | 'a98-rgb' | 'prophoto' | 'xyz' | 'xyz-d50' | 'xyz-d65'
export type ColorSpace = StandardSpace | WideRGB
export const COLOR_SPACES: ColorSpace[] = [
  'hex', 'srgb', 'srgb-linear', 'hsl', 'hwb',
  'lab', 'lch', 'oklab', 'oklch',
  'display-p3', 'a98-rgb', 'rec2020', 'prophoto',
  'xyz', 'xyz-d50', 'xyz-d65'
]

colorjs.ColorSpace.register(colorjs.sRGB);
colorjs.ColorSpace.register(colorjs.sRGB_Linear);
colorjs.ColorSpace.register(colorjs.HSL);
colorjs.ColorSpace.register(colorjs.HWB);
colorjs.ColorSpace.register(colorjs.Lab);
colorjs.ColorSpace.register(colorjs.LCH);
colorjs.ColorSpace.register(colorjs.OKLab);
colorjs.ColorSpace.register(colorjs.OKLCH);
colorjs.ColorSpace.register(colorjs.P3);
colorjs.ColorSpace.register(colorjs.A98RGB);
colorjs.ColorSpace.register(colorjs.ProPhoto);
colorjs.ColorSpace.register(colorjs.REC_2020);
colorjs.ColorSpace.register(colorjs.XYZ_D65);
colorjs.ColorSpace.register(colorjs.XYZ_D50);
colorjs.ColorSpace.register(colorjs.Okhsv);

// A `none` component (null or NaN, depending on colorjs.io's version) stays missing
const clamp = (v: number | null, min = -Infinity, max = Infinity) =>
  v == null || Number.isNaN(v) ? v : Math.max(min, Math.min(max, v))

/**
 * Parse a CSS color the way a browser does: colorjs.io's parse(), plus the
 * parsed-value-time rules of CSS Color 4 that it leaves out, so the picker
 * loads the same color the browser renders.
 *
 * - legacy rgb()/rgba() channels clamp to 0-255 / 0-100%
 *   (rgb(300 0 0) is red, not an out-of-gamut red)
 * - hsl() saturation and lightness clamp to 0-100%, hwb() whiteness and
 *   blackness to >= 0
 *   (hsl(30 -10% 50%) is gray, not blue)
 * - lab()/lch() L clamps to 0-100, oklab()/oklch() L to 0-1, chroma to >= 0
 *   (lab(120 0 0) is white; oklch(60% -0.1 30) is gray)
 * - a `none` alpha is a missing component, which resolves to 0 (§ 4.4),
 *   so rgb(255 0 0 / none) is transparent, not opaque
 *
 * color() channels are not clamped: they are how you write HDR / out-of-gamut colors.
 */
export function parseCSSColor(str: string): ColorConstructor {
  const meta: { formatId?: string } = {}
  const c = parse(str, { meta } as any) as ColorConstructor & { alpha: number | null }
  const [x, y, z] = c.coords as [number, number, number]
  const fmt = meta.formatId
  let coords = [x, y, z] as [number, number, number]
  if (c.spaceId === 'srgb' && (fmt === 'rgb' || fmt === 'rgba')) coords = [clamp(x, 0, 1), clamp(y, 0, 1), clamp(z, 0, 1)] as typeof coords
  else if (c.spaceId === 'hsl') coords = [x, clamp(y, 0, 100), clamp(z, 0, 100)] as typeof coords
  else if (c.spaceId === 'hwb') coords = [x, clamp(y, 0), clamp(z, 0)] as typeof coords
  else if (c.spaceId === 'lab') coords = [clamp(x, 0, 100), y, z] as typeof coords
  else if (c.spaceId === 'lch') coords = [clamp(x, 0, 100), clamp(y, 0), z] as typeof coords
  else if (c.spaceId === 'oklab') coords = [clamp(x, 0, 1), y, z] as typeof coords
  else if (c.spaceId === 'oklch') coords = [clamp(x, 0, 1), clamp(y, 0), z] as typeof coords
  const alpha = c.alpha === null || Number.isNaN(c.alpha) ? 0 : c.alpha
  return { ...c, coords, alpha }
}

export function parseCoords(x: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, x))
}

export function contrastColor(c: string): 'white' | 'black' {
  try {
    const color = parseCSSColor(c)
    let wh: number
    let bl: number
    try {
      wh = contrast(color, 'white', 'WCAG21') ?? contrastLstar(color, 'white')
      bl = contrast(color, 'black', 'WCAG21') ?? contrastLstar(color, 'black')
    } catch {
      wh = contrastLstar(color, 'white')
      bl = contrastLstar(color, 'black')
    }
    return wh > bl ? 'white' : 'black'
  } catch {
    return 'black'
  }
}

export type Gamut = 'srgb' | 'p3' | 'rec2020' | 'xyz'
export function detectGamut(colorStr: string): Gamut {
  let gamut: Gamut = 'srgb'
  if (!colorStr || colorStr.startsWith('#')) return gamut
  try {
    const c = parseCSSColor(colorStr)
    const srgb: ColorConstructor = { spaceId: 'srgb', coords: to(c, 'srgb').coords, alpha: null }
    const p3: ColorConstructor = { spaceId: 'p3', coords: to(c, 'p3').coords, alpha: null }
    const rec2020: ColorConstructor = { spaceId: 'rec2020', coords: to(c, 'rec2020').coords, alpha: null }
    const xyz: ColorConstructor = { spaceId: 'xyz', coords: to(c, 'xyz').coords, alpha: null }
    if (inGamut(xyz)) gamut = 'xyz'
    if (inGamut(rec2020)) gamut = 'rec2020'
    if (inGamut(p3)) gamut = 'p3'
    if (inGamut(srgb)) gamut = 'srgb'
  } catch { }
  return gamut
}

export function getColorJSSpaceID(space: ColorSpace | string) {
  if (space === 'display-p3') return 'p3'
  if (space === 'a98-rgb') return 'a98rgb'
  return space
}

export function reverseColorJSSpaceID(space: string): ColorSpace | string {
  if (space === 'p3') return 'display-p3'
  if (space === 'a98rgb') return 'a98-rgb'
  return space
}

export function alphaToString(alpha: string | number) {
  return alpha === '100' || alpha === 100 ? '' : ` / ${alpha}%`
}

export function isRGBLike(space: string) {
  return [
    'srgb-linear',
    'display-p3',
    'rec2020',
    'a98-rgb',
    'prophoto',
    'xyz',
    'xyz-d50',
    'xyz-d65'
  ].includes(space)
}

export function rgbColor(space: string, r: string | number, g: string | number, b: string | number, a: string | number) {
  const s = space === 'prophoto' ? 'prophoto-rgb' : space
  return `color(${s} ${r}% ${g}% ${b}%${alphaToString(a)})`
}
