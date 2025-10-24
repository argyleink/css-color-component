import { describe, it, expect, beforeEach } from 'vitest'
import './setup'
import '../src/index'

function makeEl() {
  const el = document.createElement('color-input') as any
  document.body.appendChild(el)
  return el
}

describe('colorspace conversion precision', () => {
  let el: any
  beforeEach(() => { el = makeEl() })

  it('converting from hsl to oklch produces reasonable precision', () => {
    el.value = 'hsl(240 100% 50%)'
    expect(el.colorspace).toBe('hsl')
    
    // Switch to oklch
    el.colorspace = 'oklch'
    
    const value = el.value
    // Should not have excessive decimal places like oklch(53.8987696988% 0.174846879646 239.949946663)
    // Extract the numbers from the oklch string
    const match = value.match(/oklch\(([\d.]+)%?\s+([\d.]+)\s+([\d.]+)/)
    expect(match).toBeTruthy()
    
    if (match) {
      const [, l, c, h] = match
      // L should have at most 2 decimal places (stored as integer 0-100)
      expect(l).toMatch(/^\d+$/)
      // C should have at most 2 decimal places
      expect(c).toMatch(/^\d+\.?\d{0,2}$/)
      // H should have at most 0 decimal places (integer)
      expect(h).toMatch(/^\d+$/)
    }
  })

  it('converting from oklch to hsl produces reasonable precision', () => {
    el.value = 'oklch(75% 0.3 180)'
    expect(el.colorspace).toBe('oklch')
    
    // Switch to hsl
    el.colorspace = 'hsl'
    
    const value = el.value
    console.log('OKLCH to HSL conversion result:', value)
    
    // Value should be a valid HSL color
    expect(value).toMatch(/^hsl\(/)
    
    // Extract the numbers from the hsl string
    const match = value.match(/hsl\(([\d.]+)\s+([\d.]+)%\s+([\d.]+)%/)
    expect(match).toBeTruthy()
    
    if (match) {
      const [, h, s, l] = match
      console.log('Parsed HSL values:', { h, s, l })
      
      // H should be an integer 0-360
      expect(h).toMatch(/^\d+$/)
      expect(Number(h)).toBeGreaterThanOrEqual(0)
      expect(Number(h)).toBeLessThanOrEqual(360)
      
      // S should be an integer percentage 0-100
      expect(s).toMatch(/^\d+$/)
      expect(Number(s)).toBeGreaterThanOrEqual(0)
      expect(Number(s)).toBeLessThanOrEqual(100)
      
      // L should be an integer percentage 0-100
      expect(l).toMatch(/^\d+$/)
      expect(Number(l)).toBeGreaterThanOrEqual(0)
      expect(Number(l)).toBeLessThanOrEqual(100)
    }
  })

  it('converting from lab to lch produces reasonable precision', () => {
    el.value = 'lab(50% 40 -30)'
    expect(el.colorspace).toBe('lab')
    
    // Switch to lch
    el.colorspace = 'lch'
    
    const value = el.value
    // Extract the numbers from the lch string
    const match = value.match(/lch\(([\d.]+)%?\s+([\d.]+)\s+([\d.]+)/)
    expect(match).toBeTruthy()
    
    if (match) {
      const [, l, c, h] = match
      // All should be integers
      expect(l).toMatch(/^\d+$/)
      expect(c).toMatch(/^\d+$/)
      expect(h).toMatch(/^\d+$/)
    }
  })

  it('converting between multiple colorspaces maintains reasonable precision', () => {
    el.value = 'oklch(75% 0.3 180)'
    
    // Convert through multiple spaces
    el.colorspace = 'hsl'
    const hsl = el.value
    el.colorspace = 'lab'
    const lab = el.value
    el.colorspace = 'lch'
    const lch = el.value
    el.colorspace = 'oklch'
    const oklch = el.value
    
    // None should have excessive decimal places
    expect(hsl).not.toMatch(/\d+\.\d{4,}/)
    expect(lab).not.toMatch(/\d+\.\d{4,}/)
    expect(lch).not.toMatch(/\d+\.\d{4,}/)
    expect(oklch).not.toMatch(/\d+\.\d{4,}/)
  })
})
