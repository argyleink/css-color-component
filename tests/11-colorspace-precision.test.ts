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
    // Should produce oklch with percentage chroma like oklch(54% 29% 240)
    // Extract the numbers from the oklch string with percentage for chroma
    const match = value.match(/oklch\(([\d.]+)%\s+([\d.]+)%\s+([\d.]+)/)
    expect(match).toBeTruthy()
    
    if (match) {
      const [, l, c, h] = match
      // L should be integer 0-100
      expect(l).toMatch(/^\d+$/)
      // C should be integer 0-100 (percentage)
      expect(c).toMatch(/^\d+$/)
      // H should be integer 0-360
      expect(h).toMatch(/^\d+$/)
    }
  })

  it('converting from oklch to hsl produces reasonable precision', () => {
    el.value = 'oklch(75% 30% 180)' // Use new percentage format
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
    // LCH now outputs percentage chroma like oklch
    // Format: lch(L% C% H)
    const match = value.match(/lch\(([\d.]+)%\s+([\d.]+)%\s+([\d.]+)/)
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
    el.value = 'oklch(75% 30% 180)' // Use new percentage format
    
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
