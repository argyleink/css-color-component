import Color from 'colorjs.io'

export type Theme = 'auto' | 'light' | 'dark'
export type StandardSpace = 'srgb' | 'hex' | 'hsl' | 'hwb' | 'lab' | 'lch' | 'oklab' | 'oklch'
export type WideRGB = 'srgb-linear' | 'display-p3' | 'rec2020' | 'a98-rgb' | 'prophoto' | 'xyz' | 'xyz-d50' | 'xyz-d65'
export type ColorSpace = StandardSpace | WideRGB

export function parseCoords(x: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, x))
}

export function contrastColor(c: string): 'white' | 'black' {
  try {
    const color = new Color(c)
    let wh: number
    let bl: number
    try {
      // @ts-ignore method overload
      wh = color.contrast('white', 'WCAG21') ?? color.contrastLstar('white')
      // @ts-ignore method overload
      bl = color.contrast('black', 'WCAG21') ?? color.contrastLstar('black')
    } catch {
      wh = color.contrastLstar('white')
      bl = color.contrastLstar('black')
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
    const c = new Color(colorStr)
    const srgb = new Color('srgb', c.to('srgb').coords)
    const p3 = new Color('p3', c.to('p3').coords)
    const rec2020 = new Color('rec2020', c.to('rec2020').coords)
    const xyz = new Color('xyz', c.to('xyz').coords)
    if (xyz.inGamut()) gamut = 'xyz'
    if (rec2020.inGamut()) gamut = 'rec2020'
    if (p3.inGamut()) gamut = 'p3'
    if (srgb.inGamut()) gamut = 'srgb'
  } catch {}
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
