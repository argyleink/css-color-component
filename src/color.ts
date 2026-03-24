import * as colorjs from "colorjs.io/fn";
import { type ColorConstructor, parse, contrast, contrastLstar, to, inGamut } from 'colorjs.io/fn'

export type Theme = 'auto' | 'light' | 'dark'
export type StandardSpace = 'srgb' | 'hex' | 'hsl' | 'hwb' | 'lab' | 'lch' | 'oklab' | 'oklch'
export type WideRGB = 'srgb-linear' | 'display-p3' | 'rec2020' | 'a98-rgb' | 'prophoto' | 'xyz' | 'xyz-d50' | 'xyz-d65'
export type ColorSpace = StandardSpace | WideRGB
export type ColorCoord = {
  name?: string
  range?: [number, number]
  refRange?: [number, number]
}

export const DEFAULT_COLOR_SPACES: string[] = [
  'hex',
  'srgb',
  'srgb-linear',
  'hsl',
  'hwb',
  'display-p3',
  'a98-rgb',
  'lab',
  'lch',
  'oklch',
  'oklab',
  'rec2020',
  'prophoto',
  'xyz',
  'xyz-d50',
  'xyz-d65'
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

function getSpaceLookupId(space: string) {
  return getColorJSSpaceID(space.trim().toLowerCase())
}

export function ensureColorSpace(space: string) {
  const lookupId = getSpaceLookupId(space)

  try {
    return colorjs.ColorSpace.get(lookupId)
  } catch { }

  const spaces = Object.values(colorjs.spaces as Record<string, any>)
  const match = spaces.find((candidate: any) => {
    if (!candidate) return false
    if (candidate.id === lookupId) return true
    return Array.isArray(candidate.aliases) && candidate.aliases.includes(lookupId)
  })

  if (!match) return null

  colorjs.ColorSpace.register(match)

  try {
    return colorjs.ColorSpace.get(match.id)
  } catch {
    return null
  }
}

export function isValidColorSpace(space: string) {
  return !!space && (space === 'hex' || ensureColorSpace(space) !== null)
}

export function getColorSpaceCoords(space: string): Array<[string, ColorCoord]> {
  const resolved = ensureColorSpace(space === 'hex' ? 'srgb' : space)
  if (!resolved || !resolved.coords) return []
  return Object.entries(resolved.coords as Record<string, ColorCoord>)
}

export function getColorSpaceChannelKey(coordId: string) {
  return coordId.replace(/[^a-z0-9]/gi, '').toUpperCase()
}

export function getColorSpaceRange(coord: ColorCoord): [number, number] {
  const range = coord.refRange ?? coord.range ?? [0, 100]
  const min = Number(range[0])
  const max = Number(range[1])

  if (!Number.isFinite(min) || !Number.isFinite(max) || min === max) {
    return [0, 100]
  }

  return [min, max]
}

export function parseCoords(x: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, x))
}

export function contrastColor(c: string): 'white' | 'black' {
  try {
    const color = parse(c)
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
    const c = parse(colorStr)
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
  if (space === 'srgb' || space === 'hex') return false

  if ([
    'srgb-linear',
    'display-p3',
    'rec2020',
    'a98-rgb',
    'prophoto',
    'xyz',
    'xyz-d50',
    'xyz-d65'
  ].includes(space)) return true

  const coords = getColorSpaceCoords(space)
  return coords.length === 3 && coords.every(([id]) => ['r', 'g', 'b'].includes(id))
}

export function rgbColor(space: string, r: string | number, g: string | number, b: string | number, a: string | number) {
  const s = space === 'prophoto' ? 'prophoto-rgb' : space
  return `color(${s} ${r}% ${g}% ${b}%${alphaToString(a)})`
}
