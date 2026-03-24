import { describe, it, expect, beforeEach } from 'vitest'
import './setup'
import '../src/index'

function makeEl() {
  const el = document.createElement('color-input') as any
  document.body.appendChild(el)
  return el
}

describe('gamut boundary toggle', () => {
  let el: any
  beforeEach(() => { el = makeEl() })

  it('shows gamut boundaries by default', () => {
    expect(el.showGamutBoundaries).toBe(true)
    expect(el.hasAttribute('no-gamut-boundaries')).toBe(false)
  })

  it('reflects no-gamut-boundaries attribute to showGamutBoundaries property and vice versa', () => {
    el.setAttribute('no-gamut-boundaries', '')
    expect(el.showGamutBoundaries).toBe(false)

    el.removeAttribute('no-gamut-boundaries')
    expect(el.showGamutBoundaries).toBe(true)

    el.showGamutBoundaries = false
    expect(el.hasAttribute('no-gamut-boundaries')).toBe(true)

    el.showGamutBoundaries = true
    expect(el.hasAttribute('no-gamut-boundaries')).toBe(false)
  })

  it('preserves the toggle across colorspace changes', () => {
    el.showGamutBoundaries = false

    el.colorspace = 'lab'
    expect(el.showGamutBoundaries).toBe(false)
    expect(el.hasAttribute('no-gamut-boundaries')).toBe(true)

    el.colorspace = 'oklch'
    expect(el.showGamutBoundaries).toBe(false)
    expect(el.hasAttribute('no-gamut-boundaries')).toBe(true)
  })
})
