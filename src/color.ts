import * as colorjs from "colorjs.io/fn";
import { type ColorConstructor, parse, contrast, contrastLstar, to, inGamut } from 'colorjs.io/fn'

export type Theme = 'auto' | 'light' | 'dark'
export type StandardSpace = 'srgb' | 'hex' | 'hsl' | 'hwb' | 'lab' | 'lch' | 'oklab' | 'oklch'
export type WideRGB = 'srgb-linear' | 'display-p3' | 'rec2020' | 'a98-rgb' | 'prophoto' | 'xyz' | 'xyz-d50' | 'xyz-d65'
export type ColorSpace = StandardSpace | WideRGB

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
