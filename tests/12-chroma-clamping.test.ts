import { describe, it, expect, beforeEach } from 'vitest'
import './setup'
import '../src/index'

function makeEl() {
  const el = document.createElement('color-input') as any
  document.body.appendChild(el)
  return el
}

describe('chroma clamping', () => {
  let el: any
  beforeEach(() => { el = makeEl() })

  it('converting from oklch with 100% chroma to lch should cap at 100%', () => {
    // Set OKLCH with maximum chroma (100%)
    el.value = 'oklch(75% 100% 180)'
    expect(el.colorspace).toBe('oklch')
    
    // Switch to lch
    el.colorspace = 'lch'
    
    const value = el.value
    // Extract chroma from lch string
    const match = value.match(/lch\(([\d.]+)%\s+([\d.]+)%\s+([\d.]+)/)
    expect(match).toBeTruthy()
    
    if (match) {
      const [, l, c, h] = match
      const chromaValue = Number(c)
      
      // Chroma should be clamped at 100%
      expect(chromaValue).toBeLessThanOrEqual(100)
      expect(chromaValue).toBeGreaterThanOrEqual(0)
    }
  })

  it('converting from lch with high chroma to oklch should cap at 100%', () => {
    // Set LCH with very high chroma (which would exceed 100% when normalized)
    el.value = 'lch(75% 100% 180)'
    expect(el.colorspace).toBe('lch')
    
    // Switch to oklch
    el.colorspace = 'oklch'
    
    const value = el.value
    // Extract chroma from oklch string
    const match = value.match(/oklch\(([\d.]+)%\s+([\d.]+)%\s+([\d.]+)/)
    expect(match).toBeTruthy()
    
    if (match) {
      const [, l, c, h] = match
      const chromaValue = Number(c)
      
      // Chroma should be clamped at 100%
      expect(chromaValue).toBeLessThanOrEqual(100)
      expect(chromaValue).toBeGreaterThanOrEqual(0)
    }
  })

  it('normal chroma values should not be affected by clamping', () => {
    // Set OKLCH with normal chroma (30%)
    el.value = 'oklch(75% 30% 180)'
    expect(el.colorspace).toBe('oklch')
    
    // Switch to lch
    el.colorspace = 'lch'
    
    const value = el.value
    const match = value.match(/lch\(([\d.]+)%\s+([\d.]+)%\s+([\d.]+)/)
    expect(match).toBeTruthy()
    
    if (match) {
      const [, l, c, h] = match
      const chromaValue = Number(c)
      
      // Should be within normal range
      expect(chromaValue).toBeLessThanOrEqual(100)
      expect(chromaValue).toBeGreaterThan(0)
    }
  })
})
