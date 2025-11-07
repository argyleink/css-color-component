import { describe, it, expect } from 'vitest'
import { gencolor, parseIntoChannels } from '../../src/utils/color-conversion'
import type { ColorSpace } from '../../src/color'

describe('color-conversion', () => {
  describe('gencolor', () => {
    describe('oklab', () => {
      it('should generate oklab color strings', () => {
        const result = gencolor('oklab', { L: '50', A: '0.1', B: '-0.2', ALP: '100' })
        expect(result).toBe('oklab(50% 0.1 -0.2)')
      })

      it('should include alpha when less than 100', () => {
        const result = gencolor('oklab', { L: '50', A: '0', B: '0', ALP: '75' })
        expect(result).toBe('oklab(50% 0 0 / 75%)')
      })
    })

    describe('oklch', () => {
      it('should generate oklch color strings', () => {
        const result = gencolor('oklch', { L: '75', C: '50', H: '180', ALP: '100' })
        expect(result).toBe('oklch(75% 50% 180)')
      })

      it('should include alpha when less than 100', () => {
        const result = gencolor('oklch', { L: '75', C: '50', H: '180', ALP: '50' })
        expect(result).toBe('oklch(75% 50% 180 / 50%)')
      })
    })

    describe('lab', () => {
      it('should generate lab color strings', () => {
        const result = gencolor('lab', { L: '50', A: '25', B: '-30', ALP: '100' })
        expect(result).toBe('lab(50% 25 -30)')
      })

      it('should include alpha when less than 100', () => {
        const result = gencolor('lab', { L: '50', A: '0', B: '0', ALP: '80' })
        expect(result).toBe('lab(50% 0 0 / 80%)')
      })
    })

    describe('lch', () => {
      it('should generate lch color strings', () => {
        const result = gencolor('lch', { L: '50', C: '60', H: '270', ALP: '100' })
        expect(result).toBe('lch(50% 60% 270)')
      })

      it('should include alpha when less than 100', () => {
        const result = gencolor('lch', { L: '50', C: '60', H: '270', ALP: '90' })
        expect(result).toBe('lch(50% 60% 270 / 90%)')
      })
    })

    describe('hsl', () => {
      it('should generate hsl color strings', () => {
        const result = gencolor('hsl', { H: '120', S: '100', L: '50', ALP: '100' })
        expect(result).toBe('hsl(120 100% 50%)')
      })

      it('should include alpha when less than 100', () => {
        const result = gencolor('hsl', { H: '120', S: '100', L: '50', ALP: '60' })
        expect(result).toBe('hsl(120 100% 50% / 60%)')
      })
    })

    describe('hwb', () => {
      it('should generate hwb color strings', () => {
        const result = gencolor('hwb', { H: '240', W: '20', B: '30', ALP: '100' })
        expect(result).toBe('hwb(240 20% 30%)')
      })

      it('should include alpha when less than 100', () => {
        const result = gencolor('hwb', { H: '240', W: '20', B: '30', ALP: '70' })
        expect(result).toBe('hwb(240 20% 30% / 70%)')
      })
    })

    describe('srgb', () => {
      it('should generate rgb color strings', () => {
        const result = gencolor('srgb', { R: '50', G: '75', B: '100', ALP: '100' })
        expect(result).toBe('rgb(50% 75% 100%)')
      })

      it('should include alpha when less than 100', () => {
        const result = gencolor('srgb', { R: '50', G: '75', B: '100', ALP: '85' })
        expect(result).toBe('rgb(50% 75% 100% / 85%)')
      })
    })

    describe('hex', () => {
      it('should generate hex color strings', () => {
        const result = gencolor('hex', { R: '100', G: '50', B: '0', ALP: '100' })
        expect(result).toBe('#ff7f00')
      })

      it('should include alpha in hex when less than 100', () => {
        const result = gencolor('hex', { R: '100', G: '50', B: '0', ALP: '50' })
        expect(result).toBe('#ff7f0080') // 50% = 0x80 (128/255)
      })

      it('should handle edge cases for hex conversion', () => {
        // Pure white
        expect(gencolor('hex', { R: '100', G: '100', B: '100', ALP: '100' })).toBe('#ffffff')
        // Pure black
        expect(gencolor('hex', { R: '0', G: '0', B: '0', ALP: '100' })).toBe('#000000')
        // Semi-transparent white
        expect(gencolor('hex', { R: '100', G: '100', B: '100', ALP: '50' })).toBe('#ffffff80')
      })
    })

    describe('RGB-like spaces', () => {
      it('should generate color(display-p3) strings', () => {
        const result = gencolor('display-p3', { R: '50', G: '75', B: '100', ALP: '100' })
        expect(result).toBe('color(display-p3 50% 75% 100%)')
      })

      it('should generate color(rec2020) strings', () => {
        const result = gencolor('rec2020', { R: '60', G: '70', B: '80', ALP: '100' })
        expect(result).toBe('color(rec2020 60% 70% 80%)')
      })

      it('should handle prophoto space name conversion', () => {
        const result = gencolor('prophoto', { R: '50', G: '50', B: '50', ALP: '100' })
        expect(result).toBe('color(prophoto-rgb 50% 50% 50%)')
      })

      it('should include alpha for RGB-like spaces', () => {
        const result = gencolor('display-p3', { R: '50', G: '75', B: '100', ALP: '75' })
        expect(result).toBe('color(display-p3 50% 75% 100% / 75%)')
      })
    })

    describe('defaults', () => {
      it('should use default values when channels are missing', () => {
        expect(gencolor('oklch', {})).toBe('oklch(50% 0% 0)')
        expect(gencolor('hsl', {})).toBe('hsl(0 0% 50%)')
        expect(gencolor('srgb', {})).toBe('rgb(0% 0% 0%)')
      })
    })
  })

  describe('parseIntoChannels', () => {
    describe('oklab parsing', () => {
      it('should parse oklab color strings', () => {
        const result = parseIntoChannels('oklab', 'oklab(50% 0.1 -0.2)')
        expect(result.space).toBe('oklab')
        expect(result.ch.L).toBe('50')
        expect(result.ch.A).toBe('0.1')
        expect(result.ch.B).toBe('-0.2')
        expect(result.ch.ALP).toBe('100')
      })

      it('should parse oklab with alpha', () => {
        const result = parseIntoChannels('oklab', 'oklab(50% 0.1 -0.2 / 0.5)')
        expect(result.ch.ALP).toBe('50')
      })
    })

    describe('oklch parsing', () => {
      it('should parse oklch color strings', () => {
        const result = parseIntoChannels('oklch', 'oklch(75% 0.5 180)')
        expect(result.space).toBe('oklch')
        expect(result.ch.L).toBe('75')
        // Chroma is converted to 0-100 percentage
        expect(Number(result.ch.C)).toBeLessThanOrEqual(100)
        expect(result.ch.H).toBe('180')
        expect(result.ch.ALP).toBe('100')
      })

      it('should handle missing hue (achromatic colors)', () => {
        const result = parseIntoChannels('oklch', 'oklch(50% 0 none)')
        expect(result.ch.H).toBe('0')
      })

      it('should clamp chroma at 100%', () => {
        // Create a highly saturated color that might exceed 100% when scaled
        const result = parseIntoChannels('oklch', 'oklch(75% 1.5 180)')
        expect(Number(result.ch.C)).toBeLessThanOrEqual(100)
      })
    })

    describe('lab parsing', () => {
      it('should parse lab color strings', () => {
        const result = parseIntoChannels('lab', 'lab(50% 25 -30)')
        expect(result.space).toBe('lab')
        expect(result.ch.L).toBe('50')
        expect(result.ch.A).toBe('25')
        expect(result.ch.B).toBe('-30')
      })
    })

    describe('lch parsing', () => {
      it('should parse lch color strings', () => {
        const result = parseIntoChannels('lch', 'lch(50% 60% 270)')
        expect(result.space).toBe('lch')
        expect(result.ch.L).toBe('50')
        // Chroma is normalized to 0-100
        expect(Number(result.ch.C)).toBeLessThanOrEqual(100)
        expect(result.ch.H).toBe('270')
      })
    })

    describe('hsl parsing', () => {
      it('should parse hsl color strings', () => {
        const result = parseIntoChannels('hsl', 'hsl(120 100% 50%)')
        expect(result.space).toBe('hsl')
        expect(result.ch.H).toBe('120')
        expect(result.ch.S).toBe('100')
        expect(result.ch.L).toBe('50')
      })

      it('should normalize 0-1 range to 0-100 for S and L', () => {
        // When converting from another space, colorjs.io might return 0-1 or 0-100
        const result = parseIntoChannels('hsl', 'red')
        expect(Number(result.ch.S)).toBeGreaterThan(1) // Should be ~100, not ~1
        expect(Number(result.ch.L)).toBeGreaterThan(1) // Should be ~50, not ~0.5
      })
    })

    describe('hwb parsing', () => {
      it('should parse hwb color strings', () => {
        const result = parseIntoChannels('hwb', 'hwb(240 20% 30%)')
        expect(result.space).toBe('hwb')
        expect(result.ch.H).toBe('240')
        expect(result.ch.W).toBe('20')
        expect(result.ch.B).toBe('30')
      })
    })

    describe('srgb and hex parsing', () => {
      it('should parse rgb color strings', () => {
        const result = parseIntoChannels('srgb', 'rgb(50% 75% 100%)')
        expect(result.space).toBe('srgb')
        expect(result.ch.R).toBe('50')
        expect(result.ch.G).toBe('75')
        expect(result.ch.B).toBe('100')
      })

      it('should parse hex colors as srgb', () => {
        const result = parseIntoChannels('hex', '#ff7f00')
        expect(result.space).toBe('srgb')
        expect(result.ch.R).toBe('100')
        expect(result.ch.G).toBe('50')
        expect(result.ch.B).toBe('0')
      })

      it('should apply gamut clipping for srgb/hex', () => {
        // Parse a P3 color into srgb - should clip to gamut
        const result = parseIntoChannels('srgb', 'color(display-p3 1 0.5 0)')
        expect(result.space).toBe('srgb')
        // Values should be within 0-100 range
        expect(Number(result.ch.R)).toBeLessThanOrEqual(100)
        expect(Number(result.ch.G)).toBeLessThanOrEqual(100)
        expect(Number(result.ch.B)).toBeLessThanOrEqual(100)
      })
    })

    describe('RGB-like spaces parsing', () => {
      it('should parse display-p3 colors', () => {
        const result = parseIntoChannels('display-p3', 'color(display-p3 0.5 0.75 1)')
        expect(result.space).toBe('display-p3')
        expect(result.ch.R).toBe('50')
        expect(result.ch.G).toBe('75')
        expect(result.ch.B).toBe('100')
      })

      it('should parse rec2020 colors', () => {
        const result = parseIntoChannels('rec2020', 'color(rec2020 0.6 0.7 0.8)')
        expect(result.space).toBe('rec2020')
        expect(result.ch.R).toBe('60')
        expect(result.ch.G).toBe('70')
        expect(result.ch.B).toBe('80')
      })
    })

    describe('cross-space conversion', () => {
      it('should convert between different color spaces', () => {
        const hsl = parseIntoChannels('hsl', 'oklch(75% 0.5 180)')
        expect(hsl.space).toBe('hsl')
        expect(hsl.ch.H).toBeDefined()
        expect(hsl.ch.S).toBeDefined()
        expect(hsl.ch.L).toBeDefined()
      })

      it('should preserve alpha during conversion', () => {
        const result = parseIntoChannels('oklch', 'rgba(255, 0, 0, 0.5)')
        expect(result.ch.ALP).toBe('50')
      })
    })

    describe('round-trip conversion', () => {
      const testCases: Array<{ space: ColorSpace; input: string }> = [
        { space: 'oklch', input: 'oklch(75% 20% 180)' }, // Use percentage notation for chroma
        { space: 'oklab', input: 'oklab(50% 0.1 -0.2)' },
        { space: 'hsl', input: 'hsl(120 100% 50%)' },
        { space: 'hwb', input: 'hwb(240 20% 30%)' },
        { space: 'lab', input: 'lab(50% 25 -30)' },
        { space: 'lch', input: 'lch(50% 60% 270)' }
      ]

      testCases.forEach(({ space, input }) => {
        it(`should round-trip ${space} colors`, () => {
          const parsed = parseIntoChannels(space, input)
          const regenerated = gencolor(space, parsed.ch)
          const reparsed = parseIntoChannels(space, regenerated)

          // Values should be close (allowing for rounding and conversion precision loss)
          Object.keys(parsed.ch).forEach(key => {
            const original = Number(parsed.ch[key])
            const final = Number(reparsed.ch[key])
            if (key === 'H' && Math.abs(original - final) > 10) {
              // Hue can wrap around 360
              expect(Math.abs(original - final)).toBeCloseTo(360, 0)
            } else {
              // Allow for some precision loss in conversion (within 10 units)
              expect(Math.abs(original - final)).toBeLessThan(10)
            }
          })
        })
      })
    })

    describe('named colors', () => {
      it('should parse named colors', () => {
        const red = parseIntoChannels('oklch', 'red')
        expect(red.space).toBe('oklch')
        expect(Number(red.ch.L)).toBeGreaterThan(0)
        expect(Number(red.ch.C)).toBeGreaterThan(0)
      })

      it('should handle transparent', () => {
        const result = parseIntoChannels('oklch', 'transparent')
        expect(result.ch.ALP).toBe('0')
      })
    })
  })
})
