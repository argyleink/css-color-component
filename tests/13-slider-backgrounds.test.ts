import { describe, it, expect, beforeEach } from 'vitest'
import './setup'
import '../src/index'

function makeEl() {
  const el = document.createElement('color-input') as any
  document.body.appendChild(el)
  return el
}

describe('slider background reactivity', () => {
  let el: any
  beforeEach(() => {
    el = makeEl()
    el.show()
  })

  it('updates OKLCH chroma and alpha slider backgrounds when hue changes', () => {
    el.colorspace = 'oklch'
    el.value = 'oklch(75% 50% 180)'
    
    // Wait for initial render
    const hRange = el.shadowRoot.querySelector('input[type="range"].ch-h') as HTMLInputElement
    const cRange = el.shadowRoot.querySelector('input[type="range"].ch-c') as HTMLInputElement
    const alphaRange = el.shadowRoot.querySelector('input[type="range"].ch-alp') as HTMLInputElement
    
    expect(hRange).toBeTruthy()
    expect(cRange).toBeTruthy()
    expect(alphaRange).toBeTruthy()
    
    // Get initial backgrounds
    const initialCBg = cRange.style.backgroundImage
    const initialAlphaBg = alphaRange.style.background
    
    // Change hue
    hRange.value = '270'
    hRange.dispatchEvent(new Event('input', { bubbles: true }))
    
    // Wait for signals to update (they run synchronously)
    const updatedCBg = cRange.style.backgroundImage
    const updatedAlphaBg = alphaRange.style.background
    
    // Backgrounds should have changed
    expect(updatedCBg).not.toBe(initialCBg)
    expect(updatedAlphaBg).not.toBe(initialAlphaBg)
    
    // Should contain the new hue value in the gradient
    expect(updatedCBg).toContain('270')
    expect(updatedAlphaBg).toContain('270')
  })

  it('updates HSL saturation, lightness, and alpha slider backgrounds when hue changes', () => {
    el.colorspace = 'hsl'
    el.value = 'hsl(180 50% 50%)'
    
    const hRange = el.shadowRoot.querySelector('input[type="range"].ch-h') as HTMLInputElement
    const sRange = el.shadowRoot.querySelector('input[type="range"].ch-s') as HTMLInputElement
    const lRange = el.shadowRoot.querySelector('input[type="range"].ch-l') as HTMLInputElement
    const alphaRange = el.shadowRoot.querySelector('input[type="range"].ch-alp') as HTMLInputElement
    
    expect(hRange).toBeTruthy()
    expect(sRange).toBeTruthy()
    expect(lRange).toBeTruthy()
    expect(alphaRange).toBeTruthy()
    
    // Get initial backgrounds
    const initialSBg = sRange.style.backgroundImage
    const initialLBg = lRange.style.backgroundImage
    const initialAlphaBg = alphaRange.style.background
    
    // Change hue to red
    hRange.value = '0'
    hRange.dispatchEvent(new Event('input', { bubbles: true }))
    
    const updatedSBg = sRange.style.backgroundImage
    const updatedLBg = lRange.style.backgroundImage
    const updatedAlphaBg = alphaRange.style.background
    
    // All backgrounds should have changed
    expect(updatedSBg).not.toBe(initialSBg)
    expect(updatedLBg).not.toBe(initialLBg)
    expect(updatedAlphaBg).not.toBe(initialAlphaBg)
    
    // Should contain hsl with the new hue
    expect(updatedSBg).toMatch(/hsl\(0\s/)
    expect(updatedLBg).toMatch(/hsl\(0\s/)
    expect(updatedAlphaBg).toMatch(/hsl\(0\s/)
  })

  it('updates RGB alpha slider background when color channels change', () => {
    el.colorspace = 'srgb'
    el.value = 'rgb(50% 50% 50%)'
    
    const rRange = el.shadowRoot.querySelector('input[type="range"].ch-r') as HTMLInputElement
    const gRange = el.shadowRoot.querySelector('input[type="range"].ch-g') as HTMLInputElement
    const alphaRange = el.shadowRoot.querySelector('input[type="range"].ch-alp') as HTMLInputElement
    
    expect(rRange).toBeTruthy()
    expect(gRange).toBeTruthy()
    expect(alphaRange).toBeTruthy()
    
    // Get initial alpha background
    const initialAlphaBg = alphaRange.style.background
    
    // Change red channel
    rRange.value = '100'
    rRange.dispatchEvent(new Event('input', { bubbles: true }))
    
    let updatedAlphaBg = alphaRange.style.background
    expect(updatedAlphaBg).not.toBe(initialAlphaBg)
    expect(updatedAlphaBg).toMatch(/rgb\(100%/)
    
    // Change green channel
    const afterRed = updatedAlphaBg
    gRange.value = '0'
    gRange.dispatchEvent(new Event('input', { bubbles: true }))
    
    updatedAlphaBg = alphaRange.style.background
    expect(updatedAlphaBg).not.toBe(afterRed)
    expect(updatedAlphaBg).toMatch(/rgb\(100%\s+0%/)
  })
})
