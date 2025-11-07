import { describe, it, expect } from 'vitest'
import { toFixed, trimZeros, formatChannel } from '../../src/utils/channel-formatting'
import type { ColorSpace } from '../../src/color'

describe('channel-formatting', () => {
  describe('toFixed', () => {
    it('should round to specified decimals and remove trailing zeros', () => {
      expect(toFixed(1.5, 2)).toBe('1.5')
      expect(toFixed(2.00, 2)).toBe('2')
      expect(toFixed(3.456, 2)).toBe('3.46')
      expect(toFixed(3.454, 2)).toBe('3.45')
    })

    it('should default to 0 decimals', () => {
      expect(toFixed(1.7)).toBe('2')
      expect(toFixed(1.4)).toBe('1')
    })

    it('should handle negative numbers', () => {
      expect(toFixed(-1.5, 2)).toBe('-1.5')
      expect(toFixed(-2.456, 2)).toBe('-2.46')
    })

    it('should handle zero', () => {
      expect(toFixed(0)).toBe('0')
      expect(toFixed(0, 2)).toBe('0')
      expect(toFixed(0.001, 2)).toBe('0')
    })
  })

  describe('trimZeros', () => {
    it('should remove trailing zeros after decimal point', () => {
      expect(trimZeros('1.500')).toBe('1.5')
      expect(trimZeros('2.00')).toBe('2')
      expect(trimZeros('3.1000')).toBe('3.1')
    })

    it('should preserve non-trailing zeros', () => {
      expect(trimZeros('1.05')).toBe('1.05')
      expect(trimZeros('10.50')).toBe('10.5')
    })

    it('should handle strings without decimals', () => {
      expect(trimZeros('42')).toBe('42')
      expect(trimZeros('100')).toBe('100')
    })

    it('should handle edge cases', () => {
      expect(trimZeros('0.0')).toBe('0')
      expect(trimZeros('0.00')).toBe('0')
      expect(trimZeros('1.0')).toBe('1')
    })
  })

  describe('formatChannel', () => {
    describe('oklab space', () => {
      it('should format L with 0 decimals', () => {
        expect(formatChannel('oklab', 'L', 50.7)).toBe('51')
        expect(formatChannel('oklab', 'L', 50.3)).toBe('50')
      })

      it('should format A and B with 2 decimals', () => {
        expect(formatChannel('oklab', 'A', 0.125)).toBe('0.13')
        expect(formatChannel('oklab', 'B', -0.456)).toBe('-0.46')
        expect(formatChannel('oklab', 'A', 0.1)).toBe('0.1')
      })
    })

    describe('oklch space', () => {
      it('should format L with 0 decimals', () => {
        expect(formatChannel('oklch', 'L', 75.6)).toBe('76')
      })

      it('should format C with 0 decimals', () => {
        expect(formatChannel('oklch', 'C', 50.7)).toBe('51')
      })

      it('should format H with 0 decimals', () => {
        expect(formatChannel('oklch', 'H', 180.6)).toBe('181')
      })
    })

    describe('lab space', () => {
      it('should format all channels with 0 decimals', () => {
        expect(formatChannel('lab', 'L', 50.7)).toBe('51')
        expect(formatChannel('lab', 'A', 25.4)).toBe('25')
        expect(formatChannel('lab', 'B', -30.6)).toBe('-31')
      })
    })

    describe('lch space', () => {
      it('should format all channels with 0 decimals', () => {
        expect(formatChannel('lch', 'L', 50.7)).toBe('51')
        expect(formatChannel('lch', 'C', 60.3)).toBe('60')
        expect(formatChannel('lch', 'H', 270.9)).toBe('271')
      })
    })

    describe('hsl space', () => {
      it('should format H with 0 decimals', () => {
        expect(formatChannel('hsl', 'H', 120.6)).toBe('121')
      })

      it('should format S and L with 0 decimals', () => {
        expect(formatChannel('hsl', 'S', 75.4)).toBe('75')
        expect(formatChannel('hsl', 'L', 50.8)).toBe('51')
      })
    })

    describe('hwb space', () => {
      it('should format H with 0 decimals', () => {
        expect(formatChannel('hwb', 'H', 240.5)).toBe('241')
      })

      it('should format W and B with 0 decimals', () => {
        expect(formatChannel('hwb', 'W', 25.7)).toBe('26')
        expect(formatChannel('hwb', 'B', 30.2)).toBe('30')
      })
    })

    describe('srgb and hex spaces', () => {
      it('should format R, G, B with 0 decimals for srgb', () => {
        expect(formatChannel('srgb', 'R', 50.6)).toBe('51')
        expect(formatChannel('srgb', 'G', 75.3)).toBe('75')
        expect(formatChannel('srgb', 'B', 100.8)).toBe('101')
      })

      it('should format R, G, B with 0 decimals for hex', () => {
        expect(formatChannel('hex', 'R', 50.6)).toBe('51')
        expect(formatChannel('hex', 'G', 75.3)).toBe('75')
        expect(formatChannel('hex', 'B', 100.8)).toBe('101')
      })
    })

    describe('RGB-like spaces', () => {
      const rgbLikeSpaces: ColorSpace[] = [
        'srgb-linear',
        'display-p3',
        'rec2020',
        'a98-rgb',
        'prophoto',
        'xyz',
        'xyz-d50',
        'xyz-d65'
      ]

      rgbLikeSpaces.forEach(space => {
        it(`should format R, G, B with 0 decimals for ${space}`, () => {
          expect(formatChannel(space, 'R', 50.6)).toBe('51')
          expect(formatChannel(space, 'G', 75.3)).toBe('75')
          expect(formatChannel(space, 'B', 100.8)).toBe('101')
        })
      })
    })

    describe('alpha channel', () => {
      it('should format ALP with 0 decimals for any space', () => {
        expect(formatChannel('oklch', 'ALP', 75.6)).toBe('76')
        expect(formatChannel('srgb', 'ALP', 50.3)).toBe('50')
        expect(formatChannel('hsl', 'ALP', 100.0)).toBe('100')
      })
    })

    describe('default formatting', () => {
      it('should use 2 decimals for unknown channel/space combinations', () => {
        // Unknown channel in a known space
        expect(formatChannel('oklch', 'X' as any, 1.234)).toBe('1.23')

        // XYZ space with non-RGB channels might use default
        expect(formatChannel('xyz', 'X' as any, 0.456)).toBe('0.46')
      })
    })

    describe('edge cases', () => {
      it('should handle zero values', () => {
        expect(formatChannel('oklch', 'L', 0)).toBe('0')
        expect(formatChannel('oklab', 'A', 0)).toBe('0')
      })

      it('should handle very small numbers', () => {
        expect(formatChannel('oklab', 'A', 0.001)).toBe('0')
        expect(formatChannel('oklab', 'A', 0.006)).toBe('0.01')
      })

      it('should handle very large numbers', () => {
        expect(formatChannel('oklch', 'L', 999.9)).toBe('1000')
        expect(formatChannel('hsl', 'H', 720.5)).toBe('721')
      })

      it('should handle negative values', () => {
        expect(formatChannel('oklab', 'A', -0.5)).toBe('-0.5')
        expect(formatChannel('lab', 'B', -100.7)).toBe('-101')
      })
    })
  })
})
