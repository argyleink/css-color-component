import { describe, it, expect } from 'vitest'
import {
  parseCoords,
  contrastColor,
  detectGamut,
  getColorJSSpaceID,
  reverseColorJSSpaceID,
  alphaToString,
  isRGBLike,
  rgbColor
} from '../../src/color'

describe('color utilities', () => {
  describe('parseCoords', () => {
    it('clamps below minimum', () => {
      expect(parseCoords(-10, 0, 100)).toBe(0)
    })

    it('clamps above maximum', () => {
      expect(parseCoords(150, 0, 100)).toBe(100)
    })

    it('passes through values within range', () => {
      expect(parseCoords(50, 0, 100)).toBe(50)
    })

    it('handles boundary values exactly', () => {
      expect(parseCoords(0, 0, 100)).toBe(0)
      expect(parseCoords(100, 0, 100)).toBe(100)
    })

    it('uses default min=0 max=100', () => {
      expect(parseCoords(-1)).toBe(0)
      expect(parseCoords(101)).toBe(100)
      expect(parseCoords(50)).toBe(50)
    })

    it('handles negative ranges', () => {
      expect(parseCoords(0, -100, 100)).toBe(0)
      expect(parseCoords(-200, -100, 100)).toBe(-100)
    })
  })

  describe('contrastColor', () => {
    it('returns white for dark colors', () => {
      expect(contrastColor('black')).toBe('white')
      expect(contrastColor('#000000')).toBe('white')
      expect(contrastColor('oklch(20% 0 0)')).toBe('white')
    })

    it('returns black for light colors', () => {
      expect(contrastColor('white')).toBe('black')
      expect(contrastColor('#ffffff')).toBe('black')
      expect(contrastColor('oklch(95% 0 0)')).toBe('black')
    })

    it('returns black for invalid input (graceful fallback)', () => {
      expect(contrastColor('')).toBe('black')
      expect(contrastColor('not-a-color')).toBe('black')
    })

    it('handles saturated colors correctly', () => {
      // Pure red has higher contrast against black (WCAG21 ~5.25:1 vs ~4.0:1)
      expect(contrastColor('red')).toBe('black')
      // Pure yellow is very light — needs black text
      expect(contrastColor('yellow')).toBe('black')
      // Dark blue needs white text
      expect(contrastColor('navy')).toBe('white')
    })
  })

  describe('detectGamut', () => {
    it('keeps common CSS colors on the srgb path', () => {
      expect(detectGamut('red')).toBe('srgb')
      expect(detectGamut('rgb(128, 128, 128)')).toBe('srgb')
      expect(detectGamut('#ff0000')).toBe('srgb')
      expect(detectGamut('')).toBe('srgb')
    })

    it('distinguishes p3 and rec2020 exclusive colors', () => {
      expect(detectGamut('color(display-p3 0 1 0)')).toBe('p3')
      expect(detectGamut('color(rec2020 0 1 0)')).toBe('rec2020')
    })

    it('falls back safely for invalid input', () => {
      expect(detectGamut('not-a-color')).toBe('srgb')
    })
  })

  describe('getColorJSSpaceID / reverseColorJSSpaceID', () => {
    it('maps display-p3 to p3', () => {
      expect(getColorJSSpaceID('display-p3')).toBe('p3')
    })

    it('maps a98-rgb to a98rgb', () => {
      expect(getColorJSSpaceID('a98-rgb')).toBe('a98rgb')
    })

    it('passes through other space names unchanged', () => {
      expect(getColorJSSpaceID('oklch')).toBe('oklch')
      expect(getColorJSSpaceID('hsl')).toBe('hsl')
      expect(getColorJSSpaceID('srgb')).toBe('srgb')
      expect(getColorJSSpaceID('rec2020')).toBe('rec2020')
    })

    it('reverse maps p3 to display-p3', () => {
      expect(reverseColorJSSpaceID('p3')).toBe('display-p3')
    })

    it('reverse maps a98rgb to a98-rgb', () => {
      expect(reverseColorJSSpaceID('a98rgb')).toBe('a98-rgb')
    })

    it('round-trips both mapped spaces', () => {
      expect(reverseColorJSSpaceID(getColorJSSpaceID('display-p3'))).toBe('display-p3')
      expect(reverseColorJSSpaceID(getColorJSSpaceID('a98-rgb'))).toBe('a98-rgb')
    })
  })

  describe('alphaToString', () => {
    it('returns empty string for full opacity (number)', () => {
      expect(alphaToString(100)).toBe('')
    })

    it('returns empty string for full opacity (string)', () => {
      expect(alphaToString('100')).toBe('')
    })

    it('returns formatted alpha for partial opacity', () => {
      expect(alphaToString(50)).toBe(' / 50%')
      expect(alphaToString('75')).toBe(' / 75%')
      expect(alphaToString(0)).toBe(' / 0%')
    })
  })

  describe('isRGBLike', () => {
    const trueSpaces = [
      'srgb-linear', 'display-p3', 'rec2020', 'a98-rgb',
      'prophoto', 'xyz', 'xyz-d50', 'xyz-d65'
    ]
    trueSpaces.forEach(space => {
      it(`returns true for ${space}`, () => {
        expect(isRGBLike(space)).toBe(true)
      })
    })

    const falseSpaces = ['srgb', 'hex', 'oklch', 'hsl', 'hwb', 'oklab', 'lab', 'lch']
    falseSpaces.forEach(space => {
      it(`returns false for ${space}`, () => {
        expect(isRGBLike(space)).toBe(false)
      })
    })
  })

  describe('rgbColor', () => {
    it('generates color() function string', () => {
      expect(rgbColor('display-p3', 50, 75, 100, 100)).toBe('color(display-p3 50% 75% 100%)')
    })

    it('maps prophoto to prophoto-rgb', () => {
      expect(rgbColor('prophoto', 50, 50, 50, 100)).toBe('color(prophoto-rgb 50% 50% 50%)')
    })

    it('includes alpha when not 100', () => {
      expect(rgbColor('rec2020', 60, 70, 80, 50)).toBe('color(rec2020 60% 70% 80% / 50%)')
    })

    it('omits alpha when 100', () => {
      expect(rgbColor('xyz', 30, 40, 50, 100)).toBe('color(xyz 30% 40% 50%)')
    })
  })
})
