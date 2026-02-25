import { describe, it, expect } from 'vitest'
import './setup'
import '../src/index'

function makeElWithValue(value: string) {
  const el = document.createElement('color-input') as any
  el.setAttribute('value', value)  // set attribute before connecting
  document.body.appendChild(el)    // triggers connectedCallback → normalization
  return el
}

describe('chroma normalization on load', () => {
  it('normalizes oklch decimal chroma to percentage form on initial load', () => {
    const el = makeElWithValue('oklch(75% 0.3 180)')
    // After load, value should use percentage notation (not raw decimal)
    expect(el.value).toMatch(/oklch\([\d.]+%\s+[\d.]+%\s+[\d.]+/)
  })

  it('normalizes lch decimal chroma to percentage form on initial load', () => {
    const el = makeElWithValue('lch(50% 45 270)')
    // After load, value should use percentage notation for chroma
    expect(el.value).toMatch(/lch\([\d.]+%\s+[\d.]+%\s+[\d.]+/)
  })

  it('oklch value property returns normalized form matching post-change format', () => {
    const el = makeElWithValue('oklch(75% 0.3 180)')
    const initialValue = el.value
    // Should already be in percentage form, not raw decimal
    expect(initialValue).not.toMatch(/oklch\([\d.]+%\s+0\.\d+\s+/)
    expect(initialValue).toMatch(/oklch\([\d]+%\s+[\d]+%\s+[\d]+/)
  })
})

